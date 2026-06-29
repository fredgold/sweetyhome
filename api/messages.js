import { verifySession, cors, rateLimit } from './_auth.js';

function convertContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map(item => {
    if (item.type === 'text') return { type: 'input_text', text: item.text };
    if (item.type === 'image' && item.source?.type === 'base64') {
      return { type: 'input_image', image_url: `data:${item.source.media_type};base64,${item.source.data}` };
    }
    return null;
  }).filter(Boolean);
}

function toOpenAIInput(messages, system) {
  const input = [];
  if (system) {
    input.push({ role: 'system', content: system });
  }
  for (const msg of messages) {
    const converted = convertContent(msg.content);
    input.push({ role: msg.role, content: converted });
  }
  return input;
}

function toAnthropicResponse(data) {
  const outputMsg = (data.output || []).find(o => o.type === 'message');
  if (!outputMsg) return { content: [{ type: 'text', text: '' }] };
  const texts = (outputMsg.content || [])
    .filter(c => c.type === 'output_text')
    .map(c => c.text)
    .join('\n');
  return { content: [{ type: 'text', text: texts }] };
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  if (!await verifySession(req, res)) return;
  if (!await rateLimit(req, res, { prefix: 'ai', max: 30, windowSeconds: 3600 })) return;

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(500).json({ error: "서버에 OPENAI_API_KEY가 설정되지 않았습니다." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: toOpenAIInput(messages, body.system),
      max_output_tokens: Math.min(Number(body.max_tokens) || 1024, 2048),
    };

    if (body.tools && body.tools.length) {
      payload.tools = [{ type: "web_search_preview" }];
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + key,
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();

    if (data.error) {
      const msg = data.error.message || '';
      if (msg.includes('insufficient_quota') || msg.includes('billing')) {
        res.status(upstream.status || 402).json({ error: { message: 'credit balance is zero' } });
        return;
      }
      res.status(upstream.status || 500).json({ error: { message: msg || 'OpenAI API 오류' } });
      return;
    }

    res.status(200).json(toAnthropicResponse(data));
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
