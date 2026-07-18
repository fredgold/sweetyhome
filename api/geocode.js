import { verifySession, cors, rateLimit } from './_auth.js';

/* B-99: 네이버 Geocoding API는 주소 전용이라 단지명이 섞인 쿼리는 대부분
   ok:false — 검색(Local) API를 2차 폴백으로 시도. Local 응답의 mapx/mapy는
   네이버 공식 문서 기준 경도/위도 × 10^7 정수(WGS84) — 실측 접근이 막혀
   있는 로컬 환경에서는 이 문서값을 신뢰하되, 대한민국 좌표 범위를 벗어나면
   스케일 가정이 틀렸다는 뜻이므로 즉시 버리고 실패 처리(잘못된 좌표를
   조용히 반영하지 않기 위한 방어선) */
const KOREA_BOUNDS = { latMin: 32, latMax: 39, lngMin: 124, lngMax: 132 };

async function tryGeocoding(q, keyId, key) {
  const url = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode?' + new URLSearchParams({ query: q });
  const upstream = await fetch(url, {
    headers: { 'x-ncp-apigw-api-key-id': keyId, 'x-ncp-apigw-api-key': key },
  });
  const data = await upstream.json();
  if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
    const a = data.addresses[0];
    return { lat: parseFloat(a.y), lng: parseFloat(a.x), address: a.roadAddress || a.jibunAddress };
  }
  return null;
}

async function tryLocalSearch(q, id, secret) {
  const url = 'https://openapi.naver.com/v1/search/local.json?' + new URLSearchParams({ query: q, display: '5' });
  const upstream = await fetch(url, {
    headers: { 'X-Naver-Client-Id': id, 'X-Naver-Client-Secret': secret },
  });
  if (!upstream.ok) return null;
  const data = await upstream.json();
  const first = (data.items || [])[0];
  if (!first) return null;
  const lng = parseInt(first.mapx, 10) / 1e7;
  const lat = parseInt(first.mapy, 10) / 1e7;
  if (!isFinite(lat) || !isFinite(lng)) return null;
  if (lat < KOREA_BOUNDS.latMin || lat > KOREA_BOUNDS.latMax || lng < KOREA_BOUNDS.lngMin || lng > KOREA_BOUNDS.lngMax) return null;
  const title = String(first.title || '').replace(/<\/?b>/g, '');
  const address = [title, first.roadAddress || first.address || ''].filter(Boolean).join(' ');
  return { lat, lng, address };
}

/* "서울 강서구 가양동 가양2단지성지" → "가양2단지성지" — 검색 폴백 2차
   시도용. 시/도·구/군·동/읍/면/리 접두 토큰을 앞에서부터 더 이상 지워질
   게 없을 때까지 반복 제거, 나머지는 원문 그대로(단지명 내부 숫자·기호는
   건드리지 않음) */
function stripLocPrefix(q) {
  let s = q.trim();
  const patterns = [
    /^(서울|부산|대구|인천|광주|대전|울산|세종)(특별시|광역시|특별자치시)?\s+/,
    /^[가-힣]+(도|특별자치도)\s+/,
    /^[가-힣0-9]+(시|군|구)\s+/,
    /^[가-힣0-9]+(동|읍|면|리)\s+/,
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of patterns) {
      const next = s.replace(p, '');
      if (next !== s) { s = next.trim(); changed = true; }
    }
  }
  return s;
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET only' });
    return;
  }

  if (!await verifySession(req, res)) return;
  if (!await rateLimit(req, res, { prefix: 'geocode', max: 120, windowSeconds: 3600 })) return;

  const keyId = process.env.NAVER_MAPS_CLIENT_ID;
  const key = process.env.NAVER_MAPS_CLIENT_SECRET;
  if (!keyId || !key) {
    res.status(500).json({ ok: false, error: 'NAVER_MAPS_CLIENT_ID/NAVER_MAPS_CLIENT_SECRET이 설정되지 않았습니다.' });
    return;
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) {
    res.status(400).json({ ok: false, error: '검색어(q)가 필요합니다.' });
    return;
  }
  if (q.length > 120) {
    res.status(400).json({ ok: false, error: '검색어는 120자 이하로 입력해주세요.' });
    return;
  }

  try {
    const geo = await tryGeocoding(q, keyId, key);
    if (geo) { res.status(200).json({ ok: true, ...geo }); return; }

    const searchId = process.env.NAVER_SEARCH_CLIENT_ID;
    const searchSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
    if (searchId && searchSecret) {
      let local = await tryLocalSearch(q, searchId, searchSecret);
      if (!local) {
        const nameOnly = stripLocPrefix(q);
        if (nameOnly && nameOnly !== q) local = await tryLocalSearch(nameOnly, searchId, searchSecret);
      }
      if (local) { res.status(200).json({ ok: true, ...local }); return; }
    }
    res.status(200).json({ ok: false });
  } catch (e) {
    console.error('[geocode] unexpected error:', e);
    res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
  }
}
