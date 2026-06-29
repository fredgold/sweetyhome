import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const SESSION_TTL = 86400;

export { redis, SESSION_TTL };

export async function createSession() {
  const token = crypto.randomUUID();
  await redis.set(`sweetyhome:sess:${token}`, 1, { ex: SESSION_TTL });
  return token;
}

export async function verifySession(req, res) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: '인증이 필요합니다.' });
    return false;
  }
  const token = auth.slice(7);
  const exists = await redis.get(`sweetyhome:sess:${token}`);
  if (!exists) {
    res.status(401).json({ ok: false, error: '세션이 만료되었습니다.' });
    return false;
  }
  return true;
}
