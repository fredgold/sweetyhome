import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEY = 'sweetyhome:state';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await redis.get(KEY);
      res.status(200).json({ ok: true, state: data || null });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e.message || e) });
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
      res.status(500).json({ ok: false, error: String(e.message || e) });
    }
    return;
  }

  res.status(405).json({ error: 'GET 또는 POST만 지원' });
}
