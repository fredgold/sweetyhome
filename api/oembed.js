import { verifySession, cors } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'GET only' });
    return;
  }

  if (!await verifySession(req, res)) return;

  const url = req.query.url;
  if (!url || !url.includes('instagram.com/')) {
    res.status(400).json({ ok: false, error: 'Instagram URL이 필요합니다.' });
    return;
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'accept': 'text/html',
        'accept-language': 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow',
    });

    const html = await upstream.text();

    const og = {};
    const re = /<meta\s+(?:property|name)="og:([^"]+)"\s+content="([^"]*)"/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      og[m[1]] = m[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    }

    if (!og.image && !og.title && !og.description) {
      res.status(200).json({ ok: false, error: '정보를 추출할 수 없었어요. 비공개 게시물일 수 있습니다.' });
      return;
    }

    res.status(200).json({
      ok: true,
      image: og.image || '',
      title: og.title || '',
      description: og.description || '',
      siteName: og.site_name || 'Instagram',
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: '페이지를 가져올 수 없었어요.' });
  }
}
