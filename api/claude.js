/**
 * api/claude.js — Proxy serverless Vercel pour l'API Anthropic
 * La clé ANTHROPIC_API_KEY reste côté serveur (jamais exposée au client).
 */
const ALLOWED_ORIGINS = [
  'https://www.senegalthr.com',
  'https://senegalthr.com',
  'https://senegal-amber.vercel.app',
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NO_KEY', hint: 'ANTHROPIC_API_KEY manquante côté serveur' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { model, max_tokens, messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', hint: 'messages[] requis' });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: Math.min(Number(max_tokens) || 600, 2000),
        messages,
      }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'PROXY_FAIL' });
  }
}
