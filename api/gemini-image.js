/**
 * api/gemini-image.js — Proxy serverless pour la génération d'image Gemini
 * La clé GEMINI_API_KEY reste côté serveur (jamais exposée au client).
 *
 * POST { prompt }  (session Supabase requise)
 *   → { image: "data:image/png;base64,...." }
 *
 * Variables d'environnement Vercel requises :
 *   GEMINI_API_KEY  — clé gratuite sur https://aistudio.google.com/apikey
 *   GEMINI_IMAGE_MODEL (optionnel) — par défaut 'gemini-2.5-flash-image'
 */
import { verifySupabaseUser } from './_auth.js';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const user = await verifySupabaseUser(req);
  if (!user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', hint: 'Connectez-vous dans l\'application avant de générer une image' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NO_KEY', hint: 'GEMINI_API_KEY manquante côté serveur (clé gratuite sur aistudio.google.com/apikey)' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = (body.prompt || '').trim();
    if (!prompt) return res.status(400).json({ error: 'BAD_REQUEST', hint: 'prompt requis' });

    const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
    // Clé dans l'en-tête (pas dans l'URL) : les URLs peuvent finir dans des
    // journaux de proxys/serveurs, les en-têtes non.
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      }
    );

    if (!upstream.ok) {
      const errBody = await upstream.text().catch(() => '');
      return res.status(upstream.status).json({ error: 'GEMINI_FAIL', hint: errBody.slice(0, 300) });
    }

    const data = await upstream.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inlineData?.data);
    if (!imgPart) {
      return res.status(502).json({ error: 'NO_IMAGE', hint: 'Réponse Gemini sans image' });
    }
    const mime = imgPart.inlineData.mimeType || 'image/png';
    return res.status(200).json({ image: `data:${mime};base64,${imgPart.inlineData.data}` });
  } catch (err) {
    return res.status(502).json({ error: 'PROXY_FAIL' });
  }
}
