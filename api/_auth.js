/**
 * api/_auth.js — Vérification du jeton Supabase côté serveur
 * (fichier préfixé "_" : non exposé comme endpoint par Vercel)
 *
 * Chaque endpoint sensible exige un header :
 *   Authorization: Bearer <access_token Supabase>
 * Le jeton est validé auprès de Supabase Auth (GET /auth/v1/user).
 *
 * Variables d'environnement (optionnelles — valeurs par défaut du projet) :
 *   SUPABASE_URL, SUPABASE_ANON_KEY
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://ntzmxtewynwddqfuonwp.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_MP6lRgJBpfphbXkV1IpARg__LpAZX2F';

/**
 * Retourne l'utilisateur Supabase si le jeton est valide, sinon null.
 * @param {import('http').IncomingMessage} req
 */
export async function verifySupabaseUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  if (!token) return null;

  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!r.ok) return null;
    const user = await r.json();
    return user && user.id ? user : null;
  } catch (e) {
    return null;
  }
}
