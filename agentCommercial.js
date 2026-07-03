/**
 * agentCommercial.js — MISSION CTRL · SÉNÉGAL
 * Agent 9 — Sourcing Sponsors (Radar IA)
 * Mode A : Proxy /api/claude (clé côté serveur)
 * Mode B : Base locale 37 prospects sénégalais scorés
 */

let _a9LastSourcingData = null; // remplace le stockage sur nœud DOM (évite fuites mémoire)

const A9_VIVIER = [
  // ENTREPRISES SÉNÉGAL — GRANDS COMPTES
  { nom:'Sonatel / Orange Sénégal', type:'prive', montant:12000000, contreparties:'Logo couverture + 50 ex. dédicacés + événement lancement' },
  { nom:'Total Energies Sénégal', type:'prive', montant:10000000, contreparties:'Double page pub + 30 ex. + activation RSE' },
  { nom:'DP World Dakar', type:'prive', montant:8000000, contreparties:'Page pub + 25 ex. + mention site web' },
  { nom:'CBAO Attijariwafa Bank', type:'prive', montant:7000000, contreparties:'Page pub + 20 ex. + affichage agences' },
  { nom:'Eiffage Sénégal', type:'prive', montant:6000000, contreparties:'Page pub + 20 ex. + mention presse' },
  { nom:'Groupe Suneor', type:'prive', montant:4000000, contreparties:'Demi-page + 15 ex.' },
  { nom:'Senelec', type:'prive', montant:5000000, contreparties:'Page pub + 15 ex. + activation digitale' },
  { nom:'SAR — Société Africaine Raffinage', type:'prive', montant:5000000, contreparties:'Page pub + 15 ex.' },
  { nom:'SONACOS', type:'prive', montant:3000000, contreparties:'Demi-page + 10 ex.' },
  { nom:'Bolloré Africa Logistics Dakar', type:'prive', montant:6000000, contreparties:'Page pub + 20 ex.' },
  { nom:'GFM — Groupe Futurs Médias', type:'prive', montant:3000000, contreparties:'Couverture médiatique + 10 ex.' },
  { nom:'RFM / 2STV', type:'prive', montant:2000000, contreparties:'Couverture médiatique + 5 ex.' },
  { nom:'Société Générale Sénégal', type:'prive', montant:4000000, contreparties:'Page pub + 15 ex.' },
  { nom:'UBA Sénégal', type:'prive', montant:3000000, contreparties:'Page pub + 10 ex.' },
  { nom:'Banque Atlantique Sénégal', type:'prive', montant:3000000, contreparties:'Page pub + 10 ex.' },
  { nom:'Eau Kirène', type:'prive', montant:2000000, contreparties:'Demi-page + 8 ex.' },
  { nom:'Patisen', type:'prive', montant:2000000, contreparties:'Demi-page + 8 ex.' },
  { nom:'Terrou-Bi Hôtel', type:'prive', montant:2000000, contreparties:'Point de vente exclusif + 10 ex.' },
  { nom:'King Fahd Palace Dakar', type:'prive', montant:2500000, contreparties:'Point de vente + 10 ex.' },
  { nom:'Radisson Blu Dakar', type:'prive', montant:2000000, contreparties:'Point de vente + 8 ex.' },
  { nom:'Air Sénégal', type:'prive', montant:4000000, contreparties:'Distribution bord + 20 ex. + mention' },
  { nom:'Transafrica Express', type:'prive', montant:1500000, contreparties:'Demi-page + 5 ex.' },
  { nom:'SAPCO Sénégal', type:'prive', montant:3000000, contreparties:'Distribution sites touristiques + 15 ex.' },
  // INSTITUTIONNEL / MTAC
  { nom:'MTAC — Ministère Tourisme & Culture', type:'mtac', montant:15000000, contreparties:'Dépôt légal + 50 ex. + exposition institutions nationales' },
  { nom:'Ministère Affaires Étrangères', type:'mtac', montant:8000000, contreparties:'Distribution ambassades + 30 ex. + visa facilité' },
  { nom:'FESMAN — Festival Mondial Arts', type:'mtac', montant:5000000, contreparties:'Partenariat festival + 20 ex. + scène de lancement' },
  { nom:'Fondation Sonatel', type:'prive', montant:6000000, contreparties:'RSE + 20 ex. + digital' },
  { nom:'Fondation BNP Paribas', type:'prive', montant:5000000, contreparties:'RSE + 15 ex.' },
  { nom:'Fondation Total Sénégal', type:'prive', montant:4000000, contreparties:'RSE + 15 ex.' },
  { nom:'Institut Français de Dakar', type:'mtac', montant:3000000, contreparties:'Vernissage IFD + 10 ex. + diffusion réseau France' },
  { nom:'UNESCO Bureau Dakar', type:'mtac', montant:4000000, contreparties:'Label UNESCO + 15 ex. + distribution internationale' },
  { nom:'Union Européenne — Délégation Dakar', type:'mtac', montant:6000000, contreparties:'Label UE + 20 ex. + réseau diplomatique' },
  { nom:'Agence Française de Développement', type:'mtac', montant:5000000, contreparties:'Partenariat AFD + 15 ex. + diffusion réseau Afrique' },
  // DIASPORA
  { nom:'USAID Sénégal', type:'mtac', montant:4000000, contreparties:'Label + 15 ex. + diffusion USA' },
  { nom:'Diaspora Sénégalaise — USA (NYC / Atlanta)', type:'particulier', montant:3000000, contreparties:'Dédicaces + envoi postal + mention' },
  { nom:'Diaspora Sénégalaise — France (Paris / Marseille)', type:'particulier', montant:2500000, contreparties:'Dédicaces + envoi postal' },
  { nom:'Diaspora Sénégalaise — Italie', type:'particulier', montant:1500000, contreparties:'Dédicaces + envoi postal' },
  { nom:'Association Sénégalais Espagne', type:'particulier', montant:1500000, contreparties:'Dédicaces + envoi postal' },
];
/* Normalise un nom sponsor pour déduplication robuste */
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

/* MODE B — Algorithme local */
function a9SourcingLocal(statusEl, resultsEl) {
  statusEl.innerHTML = '<span style="color:var(--gold)">🔍 Scan base locale en cours…</span>';
  const existants = a9State.sponsors.map(s => s.name.toLowerCase());
  const budgetRestant = MISSION.budget - (state.spent || 0);
  const disponibles = A9_VIVIER.filter(p =>
    !existants.some(e => _a9Normalize(e) === _a9Normalize(p.nom))
  );
  if (disponibles.length === 0) {
    statusEl.innerHTML = '<span style="color:var(--amber)">✅ Tous les prospects ont déjà été ajoutés.</span>';
    return;
  }
  const scores = disponibles.map(p => ({
    ...p,
    score: (p.montant <= budgetRestant ? 2 : 1) + (p.type === 'mtac' ? 1 : 0) + Math.random()
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
  statusEl.innerHTML = '';
  a9RenderSourcingResults(data, resultsEl, document.getElementById('a9-sourcing-status'));
}

/* MODE A — Claude API via proxy Vercel */
async function a9SourcingAvecClaude(statusEl, resultsEl) {
  const existants = a9State.sponsors.map(s => s.name);
  const budgetRestant = MISSION.budget - (state.spent || 0);
  statusEl.innerHTML = '<span style="color:var(--gold)">🧠 Claude analyse le marché…</span>';
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
    const response = await (window.apiFetch || fetch)('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:600, messages:[{ role:'user', content:prompt }] })
    });
    if (!response.ok) throw new Error(`Proxy ${response.status}`);
    const d = await response.json();
    const clean = (d.content?.[0]?.text || '').replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    if (!_a9ValidateSourcing(parsed)) throw new Error('Réponse IA malformée');
    a9RenderSourcingResults(parsed, resultsEl, statusEl);
  } catch (err) {
    statusEl.innerHTML = '<span style="color:var(--amber)">⚠️ Service IA indisponible — bascule mode local.</span>';
    a9SourcingLocal(statusEl, resultsEl);
  }
}
/* Valide la structure JSON renvoyée par Claude avant tout rendu */
function _a9ValidateSourcing(data) {
  if (!data || typeof data.analyse !== 'string' || !Array.isArray(data.suggestions)) return false;
  return data.suggestions.every(s =>
    s && typeof s.nom === 'string' &&
    ['prive', 'mtac', 'particulier'].includes(s.type) &&
    typeof s.montant === 'number' && isFinite(s.montant) &&
    (s.contreparties == null || typeof s.contreparties === 'string')
  );
}

function a9RenderSourcingResults(data, resultsEl, statusEl) {
  // esc : utilise le helper global d'index.html, fallback défensif si absent
  const esc = window.escapeHtml || (v => String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])));
  if (statusEl) statusEl.innerHTML = '';
  resultsEl.style.display = 'block';
  resultsEl.innerHTML = `
    <div style="margin-bottom:12px;padding:10px;background:var(--bg-card);border-radius:8px;font-size:0.75rem;color:var(--text-secondary)">
      <span style="color:var(--text-muted)">(</span>${esc(data.analyse)}<span style="color:var(--text-muted)">)</span>
    </div>
    ${data.suggestions.map(s => `
      <div class="sponsor-card" style="margin-bottom:10px;padding:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-weight:700;color:var(--gold);font-size:0.85rem">${esc(s.nom)}</span>
          <span style="font-size:0.6rem;background:var(--bg-deep);padding:2px 6px;border-radius:4px;color:var(--text-muted)">${s.type === 'mtac' ? '🏛 MTAC' : s.type === 'particulier' ? '👤 Particulier' : '🏢 Privé'}</span>
        </div>
        <div style="font-size:1.1rem;font-weight:800;color:var(--emerald);margin-bottom:4px">${Number(s.montant).toLocaleString('fr-FR')} FCFA</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${esc(s.contreparties)}</div>
      </div>
    `).join('')}
    <button class="btn btn-success btn-sm" style="width:100%;margin-top:8px" onclick="a9ValidateSourcing(this)">
      ✅ AJOUTER AU PIPELINE
    </button>
  `;
  _a9LastSourcingData = data;
}

function a9ValidateSourcing(btn) {
  disableBtn(btn);
  const resultsEl = document.getElementById('a9-sourcing-results');
  const data = _a9LastSourcingData;
  if (!data) return;
  const existants = a9State.sponsors.map(s => s.name.toLowerCase());
  let added = 0;
  data.suggestions.forEach(s => {
    const nom = s.nom;
    if (nom && !existants.some(e => _a9Normalize(e) === _a9Normalize(nom))) {
      a9State.sponsors.push({
        id: 'sp_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
        name: nom,
        type: s.type,
        amount: s.montant,
        status: s.statut || 'prospect',
        contreparties: s.contreparties,
        createdAt: Date.now()
      });
      added++;
    }
  });
  if (added > 0) {
    saveStateToDB();
    a9RenderSponsors();
    a9ComputeTotals();
    showToast(`${added} sponsor(s) ajouté(s) au pipeline`, 'success');
  } else {
    showToast('Tous ces sponsors sont déjà dans le pipeline', 'info');
  }
  enableBtn(btn);
}

function a9EditSponsor(id) {
  const sp = a9State.sponsors.find(s => s.id === id);
  if (!sp) return;
  const newStatus = prompt('Statut (prospect / contacte / negocie / verse / refuse) :', sp.status);
  if (newStatus && ['prospect','contacte','negocie','verse','refuse'].includes(newStatus.trim())) {
    sp.status = newStatus.trim();
    if (sp.status === 'verse') {
      addActivity('💰', `${sp.name} — versement confirmé`, now());
    }
    saveStateToDB();
    a9RenderSponsors();
    a9ComputeTotals();
  }
}

function a9DeleteSponsor(id) {
  if (!confirm('Supprimer ce sponsor ?')) return;
  a9State.sponsors = a9State.sponsors.filter(s => s.id !== id);
  saveStateToDB();
  a9RenderSponsors();
  a9ComputeTotals();
}
