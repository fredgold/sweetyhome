import { verifySession, cors } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!await verifySession(req, res)) return;

  const key = process.env.ANTHROPIC_API_KEY || process.env.sweetyhome;
  if (!key) {
    res.status(200).json({ ok: false, reason: 'no_key', msg: 'API 키가 설정되지 않았어요.' });
    return;
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    });

    if (upstream.status === 200) {
      res.status(200).json({ ok: true });
      return;
    }

    const data = await upstream.json();
    const errMsg = data?.error?.message || '';

    if (errMsg.includes('credit balance')) {
      res.status(200).json({ ok: false, reason: 'no_credits', msg: 'API 크레딧이 부족해요. Anthropic 콘솔에서 충전이 필요합니다.' });
    } else if (errMsg.includes('invalid') || upstream.status === 401) {
      res.status(200).json({ ok: false, reason: 'invalid_key', msg: 'API 키가 유효하지 않아요. 키를 확인해주세요.' });
    } else {
      res.status(200).json({ ok: false, reason: 'unknown', msg: errMsg || `API 오류 (${upstream.status})` });
    }
  } catch (e) {
    res.status(200).json({ ok: false, reason: 'network', msg: 'API 서버에 연결할 수 없어요.' });
  }
}
