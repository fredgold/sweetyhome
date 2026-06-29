import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST만 지원' });
  }

  const pin = process.env.SWEETYHOME_PIN;
  if (!pin) {
    return res.status(500).json({ ok: false, error: '서버 PIN 미설정' });
  }

  const ip = getClientIP(req);
  const key = `sweetyhome:login:${ip}`;

  try {
    const attempts = (await redis.get(key)) || 0;

    if (attempts >= MAX_ATTEMPTS) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        ok: false,
        locked: true,
        remainSeconds: ttl > 0 ? ttl : LOCKOUT_SECONDS,
        error: `시도 횟수 초과. ${Math.ceil((ttl > 0 ? ttl : LOCKOUT_SECONDS) / 60)}분 후 다시 시도해주세요.`,
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const input = (body.pin || '').replace(/[^\d]/g, '');

    if (input === pin) {
      await redis.del(key);
      return res.status(200).json({ ok: true });
    }

    const newAttempts = attempts + 1;
    await redis.set(key, newAttempts, { ex: LOCKOUT_SECONDS });

    const remaining = MAX_ATTEMPTS - newAttempts;
    return res.status(401).json({
      ok: false,
      locked: remaining <= 0,
      remaining,
      error: remaining > 0
        ? `비밀번호가 틀렸어요. (${remaining}회 남음)`
        : `시도 횟수 초과. ${Math.ceil(LOCKOUT_SECONDS / 60)}분 후 다시 시도해주세요.`,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: '서버 오류: ' + String(e.message || e) });
  }
}
