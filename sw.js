/**
 * sw.js — Service Worker MISSION CTRL · SÉNÉGAL
 * Stratégie :
 *  - Shell applicatif pré-caché à l'installation (app utilisable 100% hors-ligne)
 *  - Navigation : network-first avec fallback cache (toujours la dernière version si réseau)
 *  - Statique même-origine + polices : cache-first
 *  - Tuiles OSM : cache opportuniste plafonné (les zones visitées restent visibles hors-ligne)
 *  - /api/, Supabase, Make : réseau uniquement (jamais de cache — la file SupaSync gère l'offline)
 */
const VERSION = 'mission-ctrl-v50';
const SHELL_CACHE = `shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const TILE_CACHE = `tiles-${VERSION}`;
const TILE_MAX_ENTRIES = 600;

const SHELL_ASSETS = [
  './',
  './index.html',
  './supabase-sync-1.js',
  './agentCommercial.js',
  './manifest.json',
  './assets/logo-senegal.jpg',
  './vendor/supabase.min.js',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/marker-icon.png',
  './vendor/leaflet/images/marker-icon-2x.png',
  './vendor/leaflet/images/marker-shadow.png',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/layers-2x.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => ![SHELL_CACHE, RUNTIME_CACHE, TILE_CACHE].includes(k))
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // POST /api/claude etc. → réseau direct

  const url = new URL(req.url);

  // Données dynamiques : jamais de cache (SupaSync gère l'offline côté app)
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.endsWith('.supabase.co') ||
    url.hostname.endsWith('.make.com')
  ) return;

  // Tuiles cartographiques (plan OSM + satellite Esri) : cache opportuniste plafonné
  // — la carte satellite reste elle aussi consultable hors-ligne sur le terrain
  if (
    url.hostname.endsWith('.tile.openstreetmap.org') ||
    url.hostname.endsWith('arcgisonline.com')
  ) {
    event.respondWith(tileStrategy(req));
    return;
  }

  // Navigations (index.html) : network-first, fallback cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Statique même-origine + polices Google : cache-first avec remplissage
  if (
    url.origin === self.location.origin ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        });
      })
    );
  }
});

async function tileStrategy(req) {
  const cache = await caches.open(TILE_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      await cache.put(req, res.clone());
      trimTileCache(cache); // non bloquant
    }
    return res;
  } catch (e) {
    // Hors-ligne et tuile inconnue → réponse vide (la carte affiche du gris)
    return new Response('', { status: 408 });
  }
}

async function trimTileCache(cache) {
  const keys = await cache.keys();
  if (keys.length > TILE_MAX_ENTRIES) {
    // Supprime les plus anciennes (ordre d'insertion)
    const excess = keys.length - TILE_MAX_ENTRIES;
    for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
  }
}
