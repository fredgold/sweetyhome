// 스위티홈 — Anthropic Messages API 프록시 (Vercel Serverless Function)
//
// 프런트엔드(claudeAPI)는 키 없이 이 엔드포인트(/api/messages)로 호출하고,
// 이 함수가 서버에 보관된 ANTHROPIC_API_KEY로 실제 Anthropic API에 전달합니다.
//
// 필요한 환경변수 (Vercel > Settings > Environment Variables):
//   ANTHROPIC_API_KEY  (필수)  — https://console.anthropic.com 에서 발급
//   ANTHROPIC_MODEL    (선택)  — 서버 관리자만 변경, 기본값 Haiku

import { verifySession, cors, rateLimit } from './_auth.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  if (!await verifySession(req, res)) return;
  if (!await rateLimit(req, res, { prefix: 'ai', max: 30, windowSeconds: 3600 })) return;

  const key = process.env.ANTHROPIC_API_KEY || process.env.sweetyhome;
  if (!key) {
    res.status(500).json({ error: "서버에 ANTHROPIC_API_KEY가 설정되지 않았습니다." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    const payload = {
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: Math.min(Number(body.max_tokens) || 1024, 2048),
      messages: Array.isArray(body.messages) ? body.messages : [],
    };
    if (body.system) payload.system = body.system;
    if (body.tools) payload.tools = body.tools; // web_search 등 그대로 전달

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    console.error('[messages] unexpected error:', e);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
