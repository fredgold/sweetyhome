import { redis, verifySession, cors } from './_auth.js';

const KEY = 'sweetyhome:state';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!await verifySession(req, res)) return;

  if (req.method === 'GET') {
    try {
      const data = await redis.get(KEY);
      res.status(200).json({ ok: true, state: data || null });
    } catch (e) {
      console.error('[state/GET] unexpected error:', e);
      res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (!body.state) {
        res.status(400).json({ ok: false, error: 'state 필드가 필요합니다.' });
        return;
      }
      await redis.set(KEY, body.state);
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error('[state/POST] unexpected error:', e);
      res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
    }
    return;
  }

  res.status(405).json({ error: 'GET 또는 POST만 지원' });
}
