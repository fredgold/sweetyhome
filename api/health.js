import { verifySession, cors } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!await verifySession(req, res)) return;

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(200).json({ ok: false, reason: 'no_key', msg: 'API 키가 설정되지 않았어요.' });
    return;
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        input: 'hi',
        max_output_tokens: 1,
      }),
    });

    if (upstream.status === 200) {
      res.status(200).json({ ok: true });
      return;
    }

    const data = await upstream.json();
    const errMsg = data?.error?.message || '';

    if (errMsg.includes('insufficient_quota') || errMsg.includes('billing')) {
      res.status(200).json({ ok: false, reason: 'no_credits', msg: 'API 크레딧이 부족해요. platform.openai.com에서 충전이 필요합니다.' });
    } else if (errMsg.includes('invalid') || upstream.status === 401) {
      res.status(200).json({ ok: false, reason: 'invalid_key', msg: 'API 키가 유효하지 않아요. 키를 확인해주세요.' });
    } else {
      res.status(200).json({ ok: false, reason: 'unknown', msg: errMsg || `API 오류 (${upstream.status})` });
    }
  } catch (e) {
    res.status(200).json({ ok: false, reason: 'network', msg: 'API 서버에 연결할 수 없어요.' });
  }
}
