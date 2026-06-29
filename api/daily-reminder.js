/**
 * api/daily-reminder.js — Rappel quotidien du rituel de mission
 * Déclenché par Vercel Cron (voir vercel.json). Envoie un message au
 * groupe Direction Telegram pour rappeler la saisie du soir.
 *
 * Variables d'environnement requises (Vercel → Settings → Environment Variables) :
 *   TELEGRAM_BOT_TOKEN          — token du bot @BotFather
 *   TELEGRAM_DIRECTION_CHAT_ID  — chat id du groupe Direction (ex: -1003628809970)
 *   CRON_SECRET (optionnel)     — si défini, sécurise l'endpoint
 */
export default async function handler(req, res) {
  // Sécurité : si CRON_SECRET est défini, exiger l'en-tête d'autorisation Vercel
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_DIRECTION_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ error: 'NO_CONFIG', hint: 'TELEGRAM_BOT_TOKEN ou TELEGRAM_DIRECTION_CHAT_ID manquant' });
  }

  const text =
    '🌙 RITUEL DU SOIR — MISSION SÉNÉGAL\n\n' +
    'Avant de clôturer la journée, pensez à saisir dans l\'app :\n\n' +
    '📥 Check-in matériel + backups des cartes mémoire\n' +
    '📆 Jours faits / sites faits\n' +
    '💰 Dépenses du jour\n' +
    '📝 Autorisations qui ont bougé\n\n' +
    'L\'app recalcule la dérive, déclenche les alertes et synchronise tout automatiquement.';

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await r.json();
    if (!data.ok) return res.status(502).json({ error: 'TELEGRAM_FAIL', description: data.description });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'FETCH_FAIL' });
  }
}
