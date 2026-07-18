import { redis, verifySession, cors } from './_auth.js';

const KEY = 'sweetyhome:state';
// B-80: 무제한 증가(사진 누적 등) 방지 — 상한만 두고 자동 압축·삭제는 안 함
const MAX_STATE_BYTES = 4 * 1024 * 1024;

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
      // B-80: 구조 검증은 최소(객체 여부)만 — 필드별 과검증 안 함
      if (!body.state || typeof body.state !== 'object') {
        res.status(400).json({ ok: false, error: 'state 필드가 필요합니다.' });
        return;
      }
      const bytes = Buffer.byteLength(JSON.stringify(body.state), 'utf8');
      if (bytes > MAX_STATE_BYTES) {
        res.status(413).json({
          ok: false,
          error: `저장 용량 초과(${(bytes / 1024 / 1024).toFixed(1)}MB, 최대 ${(MAX_STATE_BYTES / 1024 / 1024).toFixed(0)}MB) — 사진 등 큰 항목을 정리한 뒤 다시 시도해주세요.`,
        });
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
