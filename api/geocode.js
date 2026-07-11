import { verifySession, cors } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET only' });
    return;
  }

  if (!await verifySession(req, res)) return;

  const keyId = process.env.NAVER_MAPS_CLIENT_ID;
  const key = process.env.NAVER_MAPS_CLIENT_SECRET;
  if (!keyId || !key) {
    res.status(500).json({ ok: false, error: 'NAVER_MAPS_CLIENT_ID/NAVER_MAPS_CLIENT_SECRET이 설정되지 않았습니다.' });
    return;
  }

  const q = req.query.q;
  if (!q) {
    res.status(400).json({ ok: false, error: '검색어(q)가 필요합니다.' });
    return;
  }

  try {
    const url = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode?' + new URLSearchParams({ query: q });
    const upstream = await fetch(url, {
      headers: { 'x-ncp-apigw-api-key-id': keyId, 'x-ncp-apigw-api-key': key },
    });
    const data = await upstream.json();

    if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
      const a = data.addresses[0];
      res.status(200).json({ ok: true, lat: parseFloat(a.y), lng: parseFloat(a.x), address: a.roadAddress || a.jibunAddress });
    } else {
      res.status(200).json({ ok: false });
    }
  } catch (e) {
    console.error('[geocode] unexpected error:', e);
    res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
  }
}
