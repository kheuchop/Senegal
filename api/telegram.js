/**
 * api/telegram.js — Proxy serverless Telegram
 * ────────────────────────────────────────────────────────────
 * Le token du bot n'est plus jamais exposé au navigateur.
 * Le client envoie une cible logique ('team' | 'direction'),
 * jamais un chat_id ni un token.
 *
 * GET  /api/telegram          → { team: bool, direction: bool }
 *                               (statut de configuration, sans secret)
 * POST /api/telegram          → { target, text, parse_mode? }
 *                               Requiert Authorization: Bearer <jeton Supabase>
 *
 * Variables d'environnement Vercel requises :
 *   TELEGRAM_BOT_TOKEN          — token du bot @BotFather
 *   TELEGRAM_TEAM_CHAT_ID       — chat id du groupe Équipe
 *   TELEGRAM_DIRECTION_CHAT_ID  — chat id du groupe Direction
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const token       = process.env.TELEGRAM_BOT_TOKEN;
  const teamId      = process.env.TELEGRAM_TEAM_CHAT_ID;
  const directionId = process.env.TELEGRAM_DIRECTION_CHAT_ID;

  // Statut de configuration — aucun secret exposé, pas d'auth requise
  if (req.method === 'GET') {
    return res.status(200).json({
      ok:        true,
      team:      Boolean(token && teamId),
      direction: Boolean(token && directionId),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // Authentification obligatoire pour tout envoi
  const user = await verifySupabaseUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED', hint: 'Session Supabase requise' });
  }

  if (!token) {
    return res.status(500).json({ ok: false, error: 'NO_CONFIG', hint: 'TELEGRAM_BOT_TOKEN manquant côté serveur' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { target, text, parse_mode } = body;

    const chatId = target === 'direction' ? directionId
                 : target === 'team'      ? teamId
                 : null;

    if (!chatId) {
      return res.status(400).json({ ok: false, error: 'BAD_TARGET', hint: "target doit être 'team' ou 'direction' (et configuré)" });
    }
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ ok: false, error: 'BAD_TEXT', hint: 'text requis' });
    }
    if (text.length > 4096) {
      return res.status(400).json({ ok: false, error: 'TEXT_TOO_LONG', hint: '4096 caractères max (limite Telegram)' });
    }

    const payload = { chat_id: chatId, text };
    if (parse_mode === 'Markdown' || parse_mode === 'MarkdownV2' || parse_mode === 'HTML') {
      payload.parse_mode = parse_mode;
    }

    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!data.ok) {
      return res.status(502).json({ ok: false, error: 'TELEGRAM_FAIL', description: data.description });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'PROXY_FAIL' });
  }
}
