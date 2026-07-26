import { redis, verifySession, cors } from './_auth.js';

const KEY = 'sweetyhome:inbox';
const MAX_BODY_BYTES = 8 * 1024;
const MAX_ITEMS = 100;
const IP_MAX_ATTEMPTS = 30;
const GLOBAL_MAX_ATTEMPTS = 100;
const RATE_WINDOW_SECONDS = 60 * 60;

function getClientIP(req) {
  const lastHop = (value) => value ? value.split(',').pop().trim() : null;
  return (
    lastHop(req.headers['x-vercel-forwarded-for']) ||
    lastHop(req.headers['x-forwarded-for']) ||
    lastHop(req.headers['x-real-ip']) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function parseBody(req) {
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    const error = new Error('BODY_TOO_LARGE');
    error.status = 413;
    throw error;
  }
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
}

function hasIngestToken(req) {
  const expected = process.env.INGEST_TOKEN;
  const auth = req.headers['authorization'] || '';
  return Boolean(expected) && auth.startsWith('Bearer ') && auth.slice(7) === expected;
}

function parseHttpUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

function extractHttpUrl(urlText, memoText) {
  const direct = parseHttpUrl(urlText);
  if (direct) return direct;

  const match = `${urlText}\n${memoText}`.match(/https?:\/\/\S+/i);
  if (!match) return null;
  const candidate = match[0].trim();
  return parseHttpUrl(candidate.replace(/[)\],.;!?]+$/, '')) || parseHttpUrl(candidate);
}

async function enforcePostRateLimit(req, res) {
  const ipKey = `sweetyhome:ingest:ip:${getClientIP(req)}`;
  const globalKey = 'sweetyhome:ingest:global';
  const ipCount = await redis.incr(ipKey);
  if (ipCount === 1) await redis.expire(ipKey, RATE_WINDOW_SECONDS);
  if (ipCount > IP_MAX_ATTEMPTS) {
    res.status(429).json({ ok: false, error: '호출 한도 초과. 잠시 후 다시 시도해주세요.' });
    return false;
  }
  const globalCount = await redis.incr(globalKey);
  if (globalCount === 1) await redis.expire(globalKey, RATE_WINDOW_SECONDS);
  if (globalCount > GLOBAL_MAX_ATTEMPTS) {
    res.status(429).json({ ok: false, error: '호출 한도 초과. 잠시 후 다시 시도해주세요.' });
    return false;
  }
  return true;
}

async function addItem(item) {
  const script = `
    if redis.call('LLEN', KEYS[1]) >= tonumber(ARGV[1]) then
      return 0
    end
    redis.call('LPUSH', KEYS[1], ARGV[2])
    return 1
  `;
  return redis.eval(script, [KEY], [MAX_ITEMS, JSON.stringify(item)]);
}

async function listItems() {
  const rows = await redis.lrange(KEY, 0, -1);
  return rows.flatMap((row) => {
    try {
      const item = typeof row === 'string' ? JSON.parse(row) : row;
      return item && typeof item === 'object' ? [item] : [];
    } catch {
      return [];
    }
  });
}

async function removeItems(ids) {
  const wanted = new Set(ids);
  const rows = await redis.lrange(KEY, 0, -1);
  let removed = 0;
  for (const row of rows) {
    let item;
    try {
      item = typeof row === 'string' ? JSON.parse(row) : row;
    } catch {
      continue;
    }
    if (!item || !wanted.has(item.id)) continue;
    removed += await redis.lrem(KEY, 1, typeof row === 'string' ? row : JSON.stringify(row));
  }
  return removed;
}

export default async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    if (req.method === 'POST') {
      if (!await enforcePostRateLimit(req, res)) return;
      if (!hasIngestToken(req)) {
        return res.status(401).json({ ok: false, error: '인증에 실패했습니다.' });
      }

      const body = parseBody(req);
      if ((body.url != null && typeof body.url !== 'string')
        || (body.memo != null && typeof body.memo !== 'string')) {
        return res.status(400).json({ ok: false, error: 'url과 memo는 문자열이어야 합니다.' });
      }
      const urlText = body.url || '';
      const memoText = body.memo || '';
      const url = extractHttpUrl(urlText, memoText);
      if (!url) {
        return res.status(400).json({
          ok: false,
          error: '요청에서 링크를 찾지 못했습니다',
          received: { urlLen: urlText.length, memoLen: memoText.length },
        });
      }

      const item = {
        id: crypto.randomUUID(),
        url: url.href,
        memo: memoText.trim(),
        receivedAt: new Date().toISOString(),
      };
      if (Number(await addItem(item)) !== 1) {
        return res.status(429).json({ ok: false, error: '인박스가 가득 찼습니다. 앱에서 먼저 수집해주세요.' });
      }
      return res.status(201).json({ ok: true, id: item.id });
    }

    if (req.method === 'GET') {
      if (!await verifySession(req, res)) return;
      return res.status(200).json({ ok: true, items: await listItems() });
    }

    if (req.method === 'DELETE') {
      if (!await verifySession(req, res)) return;
      const body = parseBody(req);
      if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== 'string')) {
        return res.status(400).json({ ok: false, error: 'ids 배열이 필요합니다.' });
      }
      const ids = [...new Set(body.ids)].slice(0, MAX_ITEMS);
      const removed = await removeItems(ids);
      return res.status(200).json({ ok: true, removed });
    }

    return res.status(405).json({ ok: false, error: 'GET, POST 또는 DELETE만 지원합니다.' });
  } catch (error) {
    if (error?.status === 413) {
      return res.status(413).json({ ok: false, error: '요청 본문은 8KB 이하여야 합니다.' });
    }
    if (error instanceof SyntaxError) {
      return res.status(400).json({ ok: false, error: '올바른 JSON이 아닙니다.' });
    }
    console.error(`[ingest/${req.method}] unexpected error:`, error);
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
  }
}
