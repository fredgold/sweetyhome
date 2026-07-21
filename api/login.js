import { redis, createSession, cors } from './_auth.js';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;
/* B-157: IP 로테이션 분산 공격 방어용 전역(IP 무관) 한도. 정상 사용자는 2명뿐이고
   세션이 30일 슬라이딩이라 로그인 자체가 드묾 — 1시간에 20회 오답은 정상 범위 밖.
   공격 저지력: 4자리 PIN(10,000개) 전수 대입에 최소 500시간(약 21일) 소요되도록 억제.
   기존 IP별 300초 창을 그대로 쓰면 20/12≈1.6회/5분로 오히려 더 타이트해져 버려서
   전역은 1시간 창을 별도로 둔다(누적 시도량을 보는 게 목적이라 굵은 창이 구조적으로 맞음). */
const GLOBAL_MAX_ATTEMPTS = 20;
const GLOBAL_LOCKOUT_SECONDS = 3600;

/* B-157: x-forwarded-for의 콤마 리스트에서 맨 앞([0])은 클라이언트가 원 요청에
   직접 넣어 위조 가능한 값(실제 사고 사례: "X-Forwarded-For: 위조IP, 진짜IP"로
   split(',')[0]을 쓰는 코드의 rate limit 우회) — 표준 관례대로 맨 뒤(가장 마지막
   홉이 append한 값)를 취한다. x-vercel-forwarded-for는 Vercel 공식 문서상
   "x-forwarded-for와 동일하나, x-forwarded-for는 Vercel 앞에 별도 프록시를 두면
   그 프록시가 덮어쓸 수 있다"고 명시돼 더 견고해 최우선으로 둔다. */
function getClientIP(req) {
  const lastHop = (v) => v ? v.split(',').pop().trim() : null;
  return (
    lastHop(req.headers['x-vercel-forwarded-for']) ||
    lastHop(req.headers['x-forwarded-for']) ||
    lastHop(req.headers['x-real-ip']) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST만 지원' });
  }

  const pin = process.env.SWEETYHOME_PIN;
  if (!pin) {
    return res.status(500).json({ ok: false, error: '서버 PIN 미설정' });
  }

  const ip = getClientIP(req);
  const key = `sweetyhome:login:${ip}`;
  const globalKey = 'sweetyhome:login:global';

  try {
    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, LOCKOUT_SECONDS);
    if (attempts > MAX_ATTEMPTS) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        ok: false,
        locked: true,
        remainSeconds: ttl > 0 ? ttl : LOCKOUT_SECONDS,
        error: `시도 횟수 초과. ${Math.ceil((ttl > 0 ? ttl : LOCKOUT_SECONDS) / 60)}분 후 다시 시도해주세요.`,
      });
    }

    // B-157: IP별 한도를 통과했어도 전역 누적이 초과되면 차단(IP 로테이션 분산 공격 방어)
    const globalAttempts = await redis.incr(globalKey);
    if (globalAttempts === 1) await redis.expire(globalKey, GLOBAL_LOCKOUT_SECONDS);
    if (globalAttempts > GLOBAL_MAX_ATTEMPTS) {
      const ttl = await redis.ttl(globalKey);
      return res.status(429).json({
        ok: false,
        locked: true,
        remainSeconds: ttl > 0 ? ttl : GLOBAL_LOCKOUT_SECONDS,
        error: `시도 횟수 초과. ${Math.ceil((ttl > 0 ? ttl : GLOBAL_LOCKOUT_SECONDS) / 60)}분 후 다시 시도해주세요.`,
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const input = (body.pin || '').replace(/[^\d]/g, '');

    if (input === pin) {
      await redis.del(key);
      await redis.del(globalKey);
      const token = await createSession();
      return res.status(200).json({ ok: true, token });
    }

    const remaining = MAX_ATTEMPTS - attempts;
    return res.status(401).json({
      ok: false,
      locked: remaining <= 0,
      remaining,
      error: remaining > 0
        ? `비밀번호가 틀렸어요. (${remaining}회 남음)`
        : `시도 횟수 초과. ${Math.ceil(LOCKOUT_SECONDS / 60)}분 후 다시 시도해주세요.`,
    });
  } catch (e) {
    console.error('[login] unexpected error:', e);
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다.' });
  }
}
