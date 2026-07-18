import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const SESSION_TTL = 86400;
const ALLOWED_ORIGINS = ['https://sweetyhome.vercel.app'];

export { redis, SESSION_TTL };

export function cors(req, res) {
  const origin = req.headers.origin || '';
  const localDev = process.env.VERCEL_ENV !== 'production'
    && /^http:\/\/localhost(?::\d+)?$/.test(origin);
  const allowed = localDev || ALLOWED_ORIGINS.includes(origin);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

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

export async function rateLimit(req, res, { prefix, max, windowSeconds }) {
  const auth = req.headers['authorization'] || '';
  const id = auth.slice(7) || 'anon';
  const key = `sweetyhome:rl:${prefix}:${id}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  if (count > max) {
    const ttl = await redis.ttl(key);
    res.status(429).json({ ok: false, error: `호출 한도 초과. ${Math.ceil((ttl > 0 ? ttl : windowSeconds) / 60)}분 후 다시 시도해주세요.` });
    return false;
  }
  return true;
}
