/**
 * agentCommercial.js — MISSION CTRL · SÉNÉGAL
 * Agent 9 — Sourcing Sponsors (Radar IA)
 *
 * Dépendances (définies dans index.html) :
 *   state, MISSION, a9State, now()
 *   saveStateToDB(), addActivity(), showToast()
 *   disableBtn(), enableBtn()
 *   a9RenderSponsors(), a9ComputeTotals()
 *
 * Mode A : Clé Anthropic dans Vault (Coffre-fort → Cloud → "Anthropic") → Claude API
 * Mode B : Sans clé → Base locale de 37 prospects sénégalais scorés
 */

/* ============================================================
   AGENT 9 — IA SOURCING (Radar Sponsors)
   Mode A — Clé Anthropic dans Vault → Claude API
   Mode B — Sans clé → Base locale étendue + algorithme de score
   ============================================================ */

const A9_VIVIER = [
  // ENTREPRISES SÉNÉGAL — GRANDS COMPTES
  { nom:'Sonatel / Orange Sénégal',      type:'prive',       montant:12000000, secteur:'telecom',    contreparties:'Logo couverture + 30 ex. numérotés + posts réseaux officiels' },
  { nom:'Total Energies Sénégal',         type:'prive',       montant:10000000, secteur:'energie',    contreparties:'Double page intérieure + 25 ex. + communiqué presse commun' },
  { nom:'DP World Dakar',                 type:'prive',       montant:8000000,  secteur:'logistique', contreparties:'Chapitre maritime dédié + 20 ex. numérotés + branding' },
  { nom:'CBAO Attijariwafa Bank',         type:'prive',       montant:7000000,  secteur:'finance',    contreparties:'Sponsor financier officiel + 15 ex. + logo colophon' },
  { nom:'Eiffage Sénégal',               type:'prive',       montant:6000000,  secteur:'btp',        contreparties:'Mention bâtisseurs patrimoine + 15 ex. numérotés' },
  { nom:'Groupe Suneor',                  type:'prive',       montant:4000000,  secteur:'agroalim',   contreparties:'Logo intérieur + 10 ex. + activation réseaux' },
  { nom:'Senelec',                        type:'prive',       montant:5000000,  secteur:'energie',    contreparties:'Mention partenaire énergie + 12 ex. + exposition' },
  { nom:'SAR — Société Africaine Raffinage', type:'prive',   montant:5000000,  secteur:'energie',    contreparties:'Page dédicatoire + 10 ex. numérotés' },
  { nom:'SONACOS',                        type:'prive',       montant:3000000,  secteur:'agroalim',   contreparties:'Mention terroir sénégalais + 8 ex.' },
  { nom:'Bolloré Africa Logistics Dakar', type:'prive',       montant:6000000,  secteur:'logistique', contreparties:'Facilitation logistique terrain + 15 ex.' },
  { nom:'GFM — Groupe Futurs Médias',    type:'prive',       montant:3000000,  secteur:'media',      contreparties:'Couverture médiatique lancement + 10 ex.' },
  { nom:'RFM / 2STV',                    type:'prive',       montant:2000000,  secteur:'media',      contreparties:'Reportage documentaire + 5 ex. + diffusion' },
  { nom:'Société Générale Sénégal',       type:'prive',       montant:4000000,  secteur:'finance',    contreparties:'Logo + 10 ex. numérotés + post LinkedIn' },
  { nom:'UBA Sénégal',                    type:'prive',       montant:3000000,  secteur:'finance',    contreparties:'Logo intérieur + 8 ex.' },
  { nom:'Banque Atlantique Sénégal',      type:'prive',       montant:3000000,  secteur:'finance',    contreparties:'Logo + 8 ex. numérotés' },
  { nom:'Eau Kirène',                     type:'prive',       montant:2000000,  secteur:'fmcg',       contreparties:'Ravitaillement équipe terrain + mentions' },
  { nom:'Patisen',                        type:'prive',       montant:2000000,  secteur:'fmcg',       contreparties:'Mentions partenaire terrain + 6 ex.' },
  { nom:'Terrou-Bi Hôtel',               type:'prive',       montant:2000000,  secteur:'tourisme',   contreparties:'Hébergement équipe Dakar + 5 ex. distribution hôtel' },
  { nom:'King Fahd Palace Dakar',         type:'prive',       montant:2500000,  secteur:'tourisme',   contreparties:'Hébergement + 5 ex. + distribution concierge' },
  { nom:'Radisson Blu Dakar',            type:'prive',       montant:2000000,  secteur:'tourisme',   contreparties:'Hébergement équipe + 5 ex.' },
  { nom:'Air Sénégal',                    type:'prive',       montant:4000000,  secteur:'transport',  contreparties:'Billets mission + mention partenaire transport officiel' },
  { nom:'Transafrica Express',            type:'prive',       montant:1500000,  secteur:'transport',  contreparties:'Transport logistique équipements + mentions' },
  { nom:'SAPCO Sénégal',                  type:'prive',       montant:3000000,  secteur:'tourisme',   contreparties:'Distribution hôtels Petite Côte + mention institutionnel' },
  // INSTITUTIONNEL / MTAC
  { nom:'MTAC — Ministère Tourisme & Culture', type:'mtac',  montant:15000000, secteur:'culture',    contreparties:'Dépôt légal + 50 ex. + exposition institutions nationales' },
  { nom:'Ministère Affaires Étrangères',  type:'mtac',        montant:8000000,  secteur:'culture',    contreparties:'Distribution ambassades + 30 ex. + visa facilité' },
  { nom:'FESMAN — Festival Mondial Arts', type:'mtac',        montant:5000000,  secteur:'culture',    contreparties:'Partenariat festival + 20 ex. + scène de lancement' },
  { nom:'Fondation Sonatel',              type:'prive',       montant:6000000,  secteur:'culture',    contreparties:'Activation numérique + 20 ex. + exposition digital' },
  { nom:'Fondation BNP Paribas',         type:'prive',       montant:5000000,  secteur:'culture',    contreparties:'Mécène officiel + 15 ex. + mention internationale' },
  { nom:'Fondation Total Sénégal',       type:'prive',       montant:4000000,  secteur:'culture',    contreparties:'RSE culturelle + 12 ex. + rapport annuel' },
  { nom:'Institut Français de Dakar',    type:'mtac',        montant:3000000,  secteur:'culture',    contreparties:'Vernissage IFD + 10 ex. + diffusion réseau France' },
  { nom:'UNESCO Bureau Dakar',           type:'mtac',        montant:4000000,  secteur:'culture',    contreparties:'Label UNESCO + 15 ex. + distribution internationale' },
  { nom:'Union Européenne — Délégation Dakar', type:'mtac',  montant:6000000,  secteur:'culture',    contreparties:'Label UE + diffusion institutions européennes + 15 ex.' },
  { nom:'Agence Française de Développement', type:'mtac',    montant:5000000,  secteur:'culture',    contreparties:'Partenariat AFD + 15 ex. + diffusion réseau Afrique' },
  // DIASPORA
  { nom:'USAID Sénégal',                 type:'mtac',        montant:4000000,  secteur:'culture',    contreparties:'Diffusion programme éducatif + 10 ex.' },
  { nom:'Diaspora Sénégalaise — USA (NYC / Atlanta)', type:'particulier', montant:3000000, secteur:'diaspora', contreparties:'10 ex. numérotés + remerciements + lancement NY' },
  { nom:'Diaspora Sénégalaise — France (Paris / Marseille)', type:'particulier', montant:2500000, secteur:'diaspora', contreparties:'10 ex. + remerciements + lancement Paris' },
  { nom:'Diaspora Sénégalaise — Italie', type:'particulier', montant:1500000,  secteur:'diaspora',   contreparties:'6 ex. numérotés + remerciements page intérieure' },
  { nom:'Association Sénégalais Espagne', type:'particulier', montant:1500000,  secteur:'diaspora',   contreparties:'6 ex. + remerciements + activation réseaux' },
];

/* Normalise un nom sponsor pour déduplication robuste :
   minuscules + suppression accents + suppression caractères non-alpha */
function _a9Normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

async function a9LaunchSourcing(btn) {
  disableBtn(btn);
  const statusEl  = document.getElementById('a9-sourcing-status');
  const resultsEl = document.getElementById('a9-sourcing-results');
  resultsEl.style.display = 'none';
  resultsEl.innerHTML = '';

  await a9SourcingAvecClaude(statusEl, resultsEl);

  enableBtn(btn);
}

/* ---------- MODE B : Algorithme local ---------- */
function a9SourcingLocal(statusEl, resultsEl) {
  statusEl.innerHTML = '<span style="color:var(--cyan)">🔍 Scan base locale en cours…</span>';

  const existants = a9State.sponsors.map(s => s.name.toLowerCase());
  const budgetRestant = MISSION.budget - (state.spent || 0);

  // Filtre dédupliqué
  const disponibles = A9_VIVIER.filter(p =>
    !existants.some(e => _a9Normalize(e) === _a9Normalize(p.nom))
  );

  if (disponibles.length === 0) {
    statusEl.innerHTML = '<span style="color:var(--amber)">✅ Tous les prospects du vivier sont déjà dans le pipeline.</span>';
    return;
  }

  // Sélection scorée : priorité aux montants cohérents avec budget restant
  const scores = disponibles.map(p => ({
    ...p,
    score: (p.montant <= budgetRestant ? 2 : 1) + (p.type === 'mtac' ? 1 : 0) + Math.random() * 0.5
  }));
  scores.sort((a, b) => b.score - a.score);
  const selection = scores.slice(0, 3);

  const data = {
    analyse: `${disponibles.length} prospects disponibles dans la base locale. ${selection.filter(s => s.type === 'mtac').length > 0 ? 'Mix institutionnel + privé recommandé.' : 'Priorité mécénat privé sur le budget restant.'}`,
    suggestions: selection.map(s => ({
      nom: s.nom, type: s.type, montant: s.montant,
      statut: 'prospect', contreparties: s.contreparties
    }))
  };

  statusEl.innerHTML = `<span style="color:var(--text-muted);font-size:0.5rem">Mode local — Ajoute ta clé Anthropic dans le Vault pour des suggestions IA personnalisées.</span>`;
  a9RenderSourcingResults(data, resultsEl, document.getElementById('a9-sourcing-status'));
}

/* ---------- MODE A : Claude API ---------- */
async function a9SourcingAvecClaude(statusEl, resultsEl) {
  const existants    = a9State.sponsors.map(s => s.name);
  const budgetRestant = MISSION.budget - (state.spent || 0);

  statusEl.innerHTML = '<span style="color:var(--cyan)">🧠 Claude analyse le marché…</span>';

  const prompt = `Tu es un expert en mécénat culturel et sponsoring pour l'Afrique de l'Ouest.

CONTEXTE :
- Mission documentaire photographique au Sénégal (32 sites, 59 jours, 2027)
- Livre d'art 200 pages, 500 exemplaires numérotés
- Budget total : 100 000 000 FCFA — Restant à lever : ${Math.round(budgetRestant).toLocaleString('fr-FR')} FCFA

DÉJÀ DANS LE PIPELINE :
${existants.length > 0 ? existants.map(n => `- ${n}`).join('\n') : '- Aucun encore'}

Suggère 3 sponsors INÉDITS, réalistes pour ce projet au Sénégal en 2027.
Réponds UNIQUEMENT en JSON valide sans markdown :
{"analyse":"2 phrases","suggestions":[{"nom":"...","type":"prive|mtac|particulier","montant":5000000,"statut":"prospect","contreparties":"..."}]}`;

  try {
    // Appel via proxy Vercel — la clé Anthropic reste côté serveur
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:600, messages:[{ role:'user', content:prompt }] })
    });

    if (!response.ok) throw new Error(`Proxy ${response.status}`);
    const d = await response.json();
    const clean = (d.content?.[0]?.text || '').replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    a9RenderSourcingResults(parsed, resultsEl, statusEl);

  } catch (err) {
    statusEl.innerHTML = `<span style="color:var(--amber)">⚠️ Service IA indisponible — bascule mode local.</span>`;
    a9SourcingLocal(statusEl, resultsEl);
  }
}

function a9RenderSourcingResults(data, container, statusEl) {
  if (!data?.suggestions?.length) {
    statusEl.innerHTML = '<span style="color:var(--amber)">⚠️ Aucune suggestion disponible.</span>';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-secondary);padding:8px;background:var(--bg-card);border-radius:var(--r-sm);margin-bottom:8px;border-left:2px solid var(--cyan)">
      ${data.analyse || ''}
    </div>
    <div id="a9-sourcing-cards"></div>
    <button class="btn btn-success btn-full" style="margin-top:8px" onclick="a9ValidateSourcing(this)">
      <div class="spinner"></div><span class="btn-text">✅ Ajouter au pipeline</span>
    </button>`;

  const cardsEl = document.getElementById('a9-sourcing-cards');
  const typeLabel = { mtac:'🏛️ MTAC', prive:'🤝 Privé', particulier:'👤 Particulier', inkind:'📦 Nature' };

  data.suggestions.forEach((s, i) => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--bg-card);border:1px solid var(--border-hi);border-radius:var(--r);padding:10px;margin-bottom:6px';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-family:var(--font-display);font-size:0.7rem;font-weight:700;color:var(--cyan)">${s.nom}</div>
        <div style="font-family:var(--font-mono);font-size:0.5rem;color:var(--text-muted)">${typeLabel[s.type]||s.type}</div>
      </div>
      <div style="font-family:var(--font-display);font-size:0.95rem;font-weight:900;background:var(--grad-cyan);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px">
        ${Math.round(s.montant).toLocaleString('fr-FR')} FCFA
      </div>
      <div style="font-family:var(--font-mono);font-size:0.52rem;color:var(--text-secondary)">${s.contreparties}</div>
      <input type="hidden" class="sn" value="${s.nom}">
      <input type="hidden" class="st" value="${s.type}">
      <input type="hidden" class="sm" value="${s.montant}">
      <input type="hidden" class="sc" value="${s.contreparties}">`;
    cardsEl.appendChild(card);
  });
}

function a9ValidateSourcing(btn) {
  disableBtn(btn);
  const cards = document.querySelectorAll('#a9-sourcing-cards > div');
  let added = 0;
  const existants = a9State.sponsors.map(s => s.name.toLowerCase());

  cards.forEach(card => {
    const nom = card.querySelector('.sn')?.value;
    const type = card.querySelector('.st')?.value;
    const montant = parseInt(card.querySelector('.sm')?.value) || 0;
    const contra = card.querySelector('.sc')?.value;
    if (nom && !existants.some(e => _a9Normalize(e) === _a9Normalize(nom))) {
      a9State.sponsors.unshift({ id:'sp_ia_'+Date.now()+'_'+(added++), name:nom, type, amount:montant, status:'prospect', contra, ts:Date.now() });
    }
  });

  a9RenderSponsors(); a9ComputeTotals(); saveStateToDB();

  if (added > 0) {
    addActivity('🤖', `Sourcing : ${added} prospect(s) ajouté(s) au pipeline`, now());
    showToast(`✅ ${added} prospect(s) ajouté(s)`, 'ok');
  } else {
    showToast('Tous ces prospects sont déjà dans le pipeline', 'info');
  }

  document.getElementById('a9-sourcing-results').style.display = 'none';
  document.getElementById('a9-sourcing-status').innerHTML =
    `<span style="color:var(--text-muted)">Dernier scan terminé — ${added} ajouté(s). Relance disponible.</span>`;
  enableBtn(btn);
}

