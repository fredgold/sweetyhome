import { verifySession, cors } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET only' });
    return;
  }

  if (!await verifySession(req, res)) return;

  const key = process.env.KAKAO_REST_KEY;
  if (!key) {
    res.status(500).json({ ok: false, error: 'KAKAO_REST_KEY가 설정되지 않았습니다.' });
    return;
  }

  const q = req.query.q;
  if (!q) {
    res.status(400).json({ ok: false, error: '검색어(q)가 필요합니다.' });
    return;
  }

  try {
    const url = 'https://dapi.kakao.com/v2/local/search/keyword.json?' + new URLSearchParams({ query: q, size: '1' });
    const upstream = await fetch(url, {
      headers: { Authorization: 'KakaoAK ' + key },
    });
    const data = await upstream.json();

    if (data.documents && data.documents.length > 0) {
      const d = data.documents[0];
      res.status(200).json({ ok: true, lat: parseFloat(d.y), lng: parseFloat(d.x), name: d.place_name, address: d.address_name });
    } else {
      res.status(200).json({ ok: false });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
