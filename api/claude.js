/**
 * api/claude.js — Proxy serverless Vercel pour l'API Anthropic
 * La clé ANTHROPIC_API_KEY reste côté serveur (jamais exposée au client).
 */
import { verifySupabaseUser } from './_auth.js';

const ALLOWED_ORIGINS = [
  'https://www.senegalthr.com',
  'https://senegalthr.com',
  'https://senegal-amber.vercel.app',
];

// Injectées dans TOUS les appels Claude — s'ajoutent au system prompt client
const HUMAN_WRITING_RULES = `

RÈGLES D'ÉCRITURE HUMAINE — TOUJOURS RESPECTER, SANS EXCEPTION :

Ce qui trahit immédiatement une IA — NE JAMAIS UTILISER :
- Tirets longs (—) : remplacer par une virgule, un point, ou reformuler la phrase
- Listes à puces dans les posts sociaux et messages
- "En conclusion", "Il convient de", "Force est de constater", "Il est important de noter"
- "Par ailleurs", "De plus", "Cependant", "Ainsi", "En résumé", "Il va sans dire"
- Structures de type "D'un côté... De l'autre..."
- Phrases d'introduction génériques qui n'apportent rien

Toujours faire :
- Phrases courtes. Parfois très courtes. Puis une plus longue pour respirer.
- Un détail concret et précis ancré dans la réalité visible ou vécue
- Première personne quand c'est du contenu terrain ou personnel
- Commencer directement dans le vif du sujet
- Emojis naturels, jamais en fin de chaque phrase mécaniquement`;

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

  // SÉCURITÉ : session Supabase obligatoire — bloque l'usage anonyme
  // de la clé Anthropic (curl, bots, tiers) et protège les crédits API.
  const user = await verifySupabaseUser(req);
  if (!user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', hint: 'Connectez-vous dans l\'application avant d\'utiliser les agents IA' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NO_KEY', hint: 'ANTHROPIC_API_KEY manquante côté serveur' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { model, max_tokens, messages, system } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', hint: 'messages[] requis' });
    }

    // Toujours injecter les règles humaines dans le system prompt
    const systemPrompt = system
      ? system + HUMAN_WRITING_RULES
      : 'Tu es un assistant au service de la mission documentaire SÉNÉGAL V3.' + HUMAN_WRITING_RULES;

    // Detect document/image content blocks for PDF support header
    const hasDoc = messages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'document' || c.type === 'image'));

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        ...(hasDoc ? { 'anthropic-beta': 'pdfs-2024-09-25' } : {}),
      },
      body: JSON.stringify({
        model:      model || 'claude-sonnet-4-6',
        max_tokens: Math.min(Number(max_tokens) || 600, hasDoc ? 4000 : 2000),
        system:     systemPrompt,
        messages,
      }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'PROXY_FAIL' });
  }
}
