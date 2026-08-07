import { verifySession, cors, rateLimit } from './_auth.js';

/* B-188: 수집함 링크 썸네일 — og:image 메타 추출(mode=meta) + 이미지 프록시
   (mode=image, 클라 CORS 우회용). SSRF가 이 파일에서 가장 중요한 위험 —
   사용자가 아무 URL이나 넣을 수 있으므로 내부망·루프백 접근을 전부
   차단해야 함. 단순하고 안전한 규칙(호스트가 IP 리터럴이면 사설/루프백/
   링크로컬 구분 없이 무조건 거부)을 리다이렉트 매 hop마다 재적용 */
const MAX_META_BYTES = 512 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

class BlockedUrlError extends Error {}

function isBlockedHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return true; // IPv4 리터럴(정규화된 dotted-decimal)
  if (h.includes(':')) return true; // IPv6 리터럴(URL.hostname은 대괄호 포함 "[::1]" 형태로 콜론이 항상 남음)
  return false;
}

function parseAllowedUrl(raw) {
  let u;
  try { u = new URL(raw); } catch (e) { throw new BlockedUrlError('invalid url'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new BlockedUrlError('protocol not allowed');
  if (isBlockedHost(u.hostname)) throw new BlockedUrlError('host not allowed');
  return u;
}

/* redirect:'manual'로 매 hop을 직접 따라가며 매번 parseAllowedUrl 재검증 —
   허용된 첫 URL이 사설 IP로 리다이렉트되는 SSRF 우회를 막음 */
async function fetchWithGuard(startUrl) {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(current.href, { redirect: 'manual', signal: controller.signal, headers: { 'User-Agent': UA } });
    } finally {
      clearTimeout(timer);
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) throw new BlockedUrlError('redirect without location');
      let next;
      try { next = new URL(loc, current.href); } catch (e) { throw new BlockedUrlError('bad redirect target'); }
      current = parseAllowedUrl(next.href);
      continue;
    }
    return res;
  }
  throw new BlockedUrlError('too many redirects');
}

/* 스트리밍으로 읽으며 maxBytes 넘으면 즉시 중단(취소) — content-length를
   신뢰하지 않고 실제 수신 바이트 수 기준으로 상한을 강제 */
async function readBodyCapped(response, maxBytes) {
  const reader = response.body && response.body.getReader ? response.body.getReader() : null;
  if (!reader) {
    const buf = Buffer.from(await response.arrayBuffer());
    return { buf: buf.subarray(0, maxBytes), truncated: buf.length > maxBytes };
  }
  const chunks = [];
  let total = 0, truncated = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) { truncated = true; try { await reader.cancel(); } catch (e) {} break; }
    chunks.push(Buffer.from(value));
  }
  return { buf: Buffer.concat(chunks), truncated };
}

function extractMetaContent(html, name) {
  const re1 = new RegExp('<meta[^>]+(?:property|name)=["\']' + name + '["\'][^>]*\\bcontent=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']' + name + '["\']', 'i');
  const m = html.match(re1) || html.match(re2);
  return m && m[1] ? m[1] : null;
}
function extractOgImage(html) {
  return extractMetaContent(html, 'og:image') || extractMetaContent(html, 'twitter:image');
}
/* B-191: 단축어로 담으면 메모가 없을 때 제목이 hostname뿐이라 노션 링크가
   전부 "notion.site"로 보인다 — 페이지 제목을 함께 돌려줘 클라가 자동
   폴백 제목만 교체하게 한다. 엔티티 디코드는 하지 않음(클라가 텍스트로만
   소비하므로 &amp; 정도가 그대로 보이는 게 최악) */
function extractTitle(html) {
  const meta = extractMetaContent(html, 'og:title') || extractMetaContent(html, 'twitter:title');
  if (meta) return meta;
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m && m[1] ? m[1] : null;
}
function cleanTitle(raw) {
  if (!raw) return null;
  const t = raw.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, 200) : null;
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }
  if (!await verifySession(req, res)) return;
  if (!await rateLimit(req, res, { prefix: 'preview', max: 120, windowSeconds: 3600 })) return;

  const mode = req.query.mode === 'image' ? 'image' : 'meta';
  const param = mode === 'image' ? req.query.src : req.query.url;
  const target = typeof param === 'string' ? param.trim() : '';
  if (!target) { res.status(400).json({ error: (mode === 'image' ? 'src' : 'url') + '가 필요합니다.' }); return; }

  let allowed;
  try { allowed = parseAllowedUrl(target); }
  catch (e) { res.status(400).json({ error: '허용되지 않는 주소입니다.' }); return; }

  try {
    const upstream = await fetchWithGuard(allowed);

    if (mode === 'meta') {
      if (!upstream.ok) { res.status(200).json({ image: null, title: null }); return; }
      const { buf } = await readBodyCapped(upstream, MAX_META_BYTES);
      const html = buf.toString('utf8');
      const image = extractOgImage(html);
      let absolute = null;
      if (image) {
        try { absolute = new URL(image, upstream.url || allowed.href).href; } catch (e) { absolute = null; }
      }
      res.status(200).json({ image: absolute, title: cleanTitle(extractTitle(html)) });
      return;
    }

    // mode=image
    const ct = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !ct.startsWith('image/')) { res.status(400).json({ error: '이미지를 가져올 수 없습니다.' }); return; }
    const { buf, truncated } = await readBodyCapped(upstream, MAX_IMAGE_BYTES);
    if (truncated) { res.status(400).json({ error: '이미지가 너무 큽니다.' }); return; }
    res.setHeader('Content-Type', ct);
    res.status(200).send(buf);
  } catch (e) {
    if (e instanceof BlockedUrlError) { res.status(400).json({ error: '허용되지 않는 주소입니다.' }); return; }
    if (mode === 'meta') { res.status(200).json({ image: null, title: null }); return; }
    res.status(400).json({ error: '가져오지 못했습니다.' });
  }
}
