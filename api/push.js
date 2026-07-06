/**
 * api/push.js — Envoi de notifications push (Web Push / VAPID)
 *
 * POST { title, body?, tag? }  (session Supabase requise)
 *   → envoie la notification à TOUS les appareils abonnés de l'équipe
 *     (table Supabase push_subscriptions, lue avec le jeton de l'appelant → RLS).
 *   → nettoie les abonnements morts (410/404).
 *
 * Variables d'environnement Vercel requises :
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  (+ optionnel VAPID_SUBJECT)
 */
import webpush from 'web-push';
import { verifySupabaseUser } from './_auth.js';

const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://ntzmxtewynwddqfuonwp.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_MP6lRgJBpfphbXkV1IpARg__LpAZX2F';

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
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const user = await verifySupabaseUser(req);
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED', hint: 'Session Supabase requise' });

  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    return res.status(500).json({ error: 'NO_VAPID', hint: 'Ajouter VAPID_PUBLIC_KEY et VAPID_PRIVATE_KEY dans les variables Vercel' });
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:contact@senegalthr.com', pub, priv);

  const { title, body, tag } = req.body || {};
  if (!title) return res.status(400).json({ error: 'TITLE_REQUIRED' });

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const subsRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=id,sub`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!subsRes.ok) return res.status(502).json({ error: 'SUBS_FETCH_FAIL', hint: 'Table push_subscriptions absente ? Exécuter le SQL fourni.' });
  const subs = await subsRes.json();
  if (!Array.isArray(subs) || subs.length === 0) return res.status(200).json({ ok: true, sent: 0, total: 0 });

  const payload = JSON.stringify({ title: String(title).slice(0, 120), body: String(body || '').slice(0, 300), tag: tag || 'mctrl' });
  let sent = 0, gone = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification(s.sub, payload, { TTL: 3600 });
      sent++;
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        gone++;
        await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?id=eq.${encodeURIComponent(s.id)}`, {
          method: 'DELETE',
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    }
  }));

  return res.status(200).json({ ok: true, sent, gone, total: subs.length });
}
