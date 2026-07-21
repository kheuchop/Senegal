/**
 * api/status.js — État de configuration des clés serveur (booléens uniquement).
 * Ne renvoie JAMAIS la valeur d'une clé : seulement si la variable
 * d'environnement est présente ou non, pour que l'app puisse afficher un
 * indicateur "IA configurée / absente" sans faire échouer un vrai appel.
 *
 * GET → { anthropic: bool, gemini: bool }
 */
const ALLOWED_ORIGINS = [
  'https://www.senegalthr.com',
  'https://senegalthr.com',
  'https://senegal-amber.vercel.app',
];

export default function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  return res.status(200).json({
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
  });
}
