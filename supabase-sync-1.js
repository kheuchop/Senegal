/**
 * supabase-sync.js — MISSION CTRL · SÉNÉGAL
 * ═══════════════════════════════════════════════════════════════
 * Module Cloud Résilient : Supabase v2 + Web Locks + Heartbeat
 * SCHEMA_VERSION = 2
 *
 * Contrat d'architecture :
 *  - Clés Supabase définies comme constantes statiques (Cold Start safe)
 *  - Heartbeat WebSocket toutes les 30s (anti-zombie réseau mobile)
 *  - Atomicité localStorage via navigator.locks (anti-collision inter-onglets)
 *  - Délégation d'événements réseau sur document.body uniquement
 *  - updated_at généré exclusivement par now() côté Supabase RLS
 *  - Auto-guérison : storage.persist() + capture globale window.onerror
 * ═══════════════════════════════════════════════════════════════
 */

(function (global) {
  'use strict';

  /* ================================================================
     [1] CLÉS SUPABASE — À REMPLIR MANUELLEMENT
     Ces constantes sont le seul point de configuration du module.
     Ne jamais committer ces valeurs dans un dépôt public.
     ================================================================ */
  const SUPABASE_URL      = 'https://ntzmxtewynwddqfuonwp.supabase.co';       // ex: https://xxxx.supabase.co
  const SUPABASE_ANON_KEY = 'sb_publishable_MP6lRgJBpfphbXkV1IpARg__LpAZX2F';  // clé publique anon JWT

  /* ================================================================
     [2] CONSTANTES SYSTÈME
     ================================================================ */
  const SCHEMA_VERSION    = 2;
  const LS_QUEUE_KEY      = 'mission_sync_queue_v2';
  const LOCK_NAME         = 'mission_queue_lock';
  const HEARTBEAT_MS      = 30_000;   // 30 secondes
  const RECONNECT_BASE_MS = 3_000;    // backoff exponentiel base
  const MAX_RECONNECTS    = 10;
  const FLUSH_DELAY_MS    = 2_000;    // délai post-reconnexion avant flush
  const FLUSH_INTER_MS    = 80;       // anti-rate-limit entre opérations

  /* ================================================================
     [3] CLIENT SUPABASE
     Instancié une seule fois via les constantes statiques ci-dessus.
     Aucune dépendance à l'état runtime (vault, Agent 2, etc.)
     ================================================================ */
  let _client = null;

  function _buildClient() {
    if (_client) return _client;

    if (typeof global.supabase === 'undefined') {
      _log('warn', 'SDK Supabase non chargé — vérifier le <script> CDN dans index.html');
      return null;
    }

    if (
      SUPABASE_URL      === 'REMPLACER_PAR_VOTRE_URL' ||
      SUPABASE_ANON_KEY === 'REMPLACER_PAR_VOTRE_ANON_KEY'
    ) {
      _log('warn', 'Clés Supabase non renseignées dans supabase-sync.js — sync désactivée');
      return null;
    }

    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth:     { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 2 } }
    });

    _log('info', 'Client Supabase v2 instancié (Cold Start safe)');
    return _client;
  }

  /* ================================================================
     [4] HEARTBEAT WEBSOCKET
     Ping toutes les 30s sur supabase.realtime.
     Si Pong absent au cycle suivant → WebSocket zombie → reconnexion.
     ================================================================ */
  let _heartbeatTimer = null;
  let _channel        = null;
  let _pingPending    = false;
  let _reconnectCount = 0;

  function _startHeartbeat() {
    _stopHeartbeat();
    _heartbeatTimer = setInterval(_doPing, HEARTBEAT_MS);
    _log('info', 'Heartbeat WebSocket démarré — intervalle 30s');
  }

  function _stopHeartbeat() {
    if (_heartbeatTimer) {
      clearInterval(_heartbeatTimer);
      _heartbeatTimer = null;
    }
  }

  function _doPing() {
    if (!_client) return;

    // Pong non reçu depuis le dernier ping → WebSocket zombie détecté
    if (_pingPending) {
      _log('warn', 'Pong absent — WebSocket zombie détecté, reconnexion forcée');
      _forceReconnect();
      return;
    }

    if (_channel && _channel.state === 'joined') {
      _pingPending = true;
      _channel
        .send({
          type:    'broadcast',
          event:   'hb_ping',
          payload: { ts: Date.now() }
        })
        .then(() => {
          _pingPending = false;
        })
        .catch(() => {
          _pingPending = false;
          _log('warn', 'Ping broadcast échoué — reconnexion Realtime');
          _forceReconnect();
        });
    } else {
      // Canal absent ou non connecté
      _pingPending = false;
      if (navigator.onLine) _initChannel();
    }
  }

  function _forceReconnect() {
    if (_reconnectCount >= MAX_RECONNECTS) {
      _log('error', `Reconnexion abandonnée après ${MAX_RECONNECTS} tentatives — intervention manuelle requise`);
      _stopHeartbeat();
      return;
    }

    _pingPending = false;
    _reconnectCount++;

    if (_channel) {
      try { _client?.removeChannel(_channel); } catch (_) {}
      _channel = null;
    }

    // Backoff exponentiel plafonné à 60s
    const delay = Math.min(RECONNECT_BASE_MS * _reconnectCount, 60_000);
    setTimeout(() => {
      _log('info', `Reconnexion Realtime — tentative #${_reconnectCount} (délai ${delay}ms)`);
      _initChannel();
    }, delay);
  }

  function _initChannel() {
    if (!_client) { _client = _buildClient(); }
    if (!_client) return;

    _channel = _client.channel('mission_ctrl_hb', {
      config: { broadcast: { self: false } }
    });

    _channel
      .on('broadcast', { event: 'hb_pong' }, () => {
        _pingPending    = false;
        _reconnectCount = 0;
      })
      .subscribe((status) => {
        _log('info', `Realtime canal : ${status}`);
        switch (status) {
          case 'SUBSCRIBED':
            _reconnectCount = 0;
            _pingPending    = false;
            _updateDot(true);
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
            _forceReconnect();
            break;
          case 'CLOSED':
            _updateDot(false);
            break;
        }
      });
  }

  /* ================================================================
     [5] QUEUE HORS-LIGNE — Atomique via Web Locks
     navigator.locks.request garantit l'exclusion mutuelle inter-onglets
     sur la même origine. Protège contre la corruption du localStorage
     en cas d'accès concurrent depuis plusieurs onglets.
     ================================================================ */
  function _readQueueUnsafe() {
    try {
      const raw = localStorage.getItem(LS_QUEUE_KEY);
      const q   = raw ? JSON.parse(raw) : [];
      // Filtre défensif : rejette toute entrée malformée
      return Array.isArray(q) ? q.filter(op => op && typeof op.type === 'string') : [];
    } catch (_) {
      return [];
    }
  }

  function _writeQueueUnsafe(queue) {
    try {
      localStorage.setItem(LS_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      _logError('LS_WRITE_FAIL', e);
    }
  }

  function _pushCoalesced(entry) {
    const q = _readQueueUnsafe();
    // Fusion des instantanés d'état : mission_state est un upsert singleton
    // (id=1, dernier gagne). Empiler un snapshot complet à chaque modification
    // pendant des jours hors-ligne gonfle le localStorage (~5 Mo) jusqu'au
    // dépassement de quota → l'écriture échoue et des données ne partent jamais.
    // On ne conserve donc que le dernier sync_state. Les transactions (sync_tx)
    // sont individuelles et toutes préservées.
    const base = entry.type === 'sync_state'
      ? q.filter(o => o.type !== 'sync_state')
      : q;
    base.push(entry);
    _writeQueueUnsafe(base);
  }

  async function _enqueue(op) {
    const entry = {
      ...op,
      schema_version: SCHEMA_VERSION,
      queued_at:      Date.now()
    };

    if (!navigator.locks) {
      // Fallback : navigateur sans Web Locks API
      _pushCoalesced(entry);
      return;
    }

    await navigator.locks.request(LOCK_NAME, async () => {
      _pushCoalesced(entry);
    });
  }

  async function _dequeue() {
    let op = null;

    if (!navigator.locks) {
      const q = _readQueueUnsafe();
      op = q.shift() ?? null;
      _writeQueueUnsafe(q);
      return op;
    }

    await navigator.locks.request(LOCK_NAME, async () => {
      const q = _readQueueUnsafe();
      op = q.shift() ?? null;
      _writeQueueUnsafe(q);
    });

    return op;
  }

  function _queueSize() {
    return _readQueueUnsafe().length;
  }

  /* ================================================================
     [6] OPÉRATIONS SUPABASE
     updated_at généré exclusivement par now() Supabase (RLS trigger).
     Jamais passé depuis le client — cohérence temporelle serveur garantie.

     Tables attendues (créées par le SQL fourni) :
       mission_state        — state global (singleton id=1)
       mission_transactions — transactions individuelles
       system_logs          — logs d'erreurs et d'événements
     ================================================================ */

  async function _syncState(stateData) {
    const client = _buildClient();
    if (!client || !navigator.onLine) {
      return _enqueue({ type: 'sync_state', data: stateData });
    }

    const { error } = await client
      .from('mission_state')
      .upsert(
        {
          id:   1, // Singleton — une seule ligne pour toute la mission
          data: {
            // Tout ce que le client envoie est synchronisé (spent, transactions,
            // treasury, printCfg, vaultPin, rolePins, a14ApiKey, les listes des
            // agents, etc.) — un seul point de vérité, plus de champ oublié.
            ...stateData,
            // SÉCURITÉ (plancher défensif) : le CONTENU du Coffre-Fort (clés et
            // valeurs ajoutées manuellement par l'équipe) ne transite JAMAIS par
            // le cloud, quoi que l'appelant ait pu passer par erreur.
            vault:          null,
            schema_version: SCHEMA_VERSION
          }
          // updated_at : NE PAS passer — généré par now() Supabase RLS
        },
        { onConflict: 'id' }
      );

    if (error) {
      _logError('SYNC_STATE_FAIL', error);
      return _enqueue({ type: 'sync_state', data: stateData });
    }

    _log('info', `State cloud sync — dépenses: ${((stateData.spent ?? 0) / 1e6).toFixed(1)}M FCFA`);
  }

  async function _syncTransaction(tx) {
    const client = _buildClient();
    if (!client || !navigator.onLine) {
      return _enqueue({ type: 'sync_tx', data: tx });
    }

    const { error } = await client
      .from('mission_transactions')
      .upsert(
        {
          id:            String(tx.id),
          cat:           tx.cat           || 'divers',
          amount:        tx.amount        || 0,
          description:   tx.description   || '',
          ts:            tx.ts            || Date.now(),
          type:          tx.type          || 'debit',
          balance_after: tx.balanceAfter  || 0
          // updated_at : NE PAS passer — généré par now() Supabase RLS
        },
        { onConflict: 'id' }
      );

    if (error) {
      _logError('SYNC_TX_FAIL', error);
      return _enqueue({ type: 'sync_tx', data: tx });
    }

    _log('info', `TX cloud sync : ${tx.id} — ${(tx.amount || 0).toLocaleString('fr-FR')} FCFA`);
  }

  async function _writeSystemLog(level, message, payload = {}) {
    const client = _buildClient();
    if (!client) return; // system_logs non critique — pas de mise en queue

    const { error } = await client.from('system_logs').insert({
      level,
      message,
      payload: { ...payload, schema_version: SCHEMA_VERSION }
    });

    // Silencieux : évite la boucle infinie (erreur → log → erreur)
    if (error) console.warn('[SupaSync] system_logs insert échoué:', error.message);
  }

  /* ================================================================
     [7] FLUSH QUEUE
     Traite toutes les opérations en attente dès que le réseau revient.
     Déclenché à la reconnexion ET par un setInterval de sécurité (60s).
     ================================================================ */
  let _flushing = false;

  async function _flushQueue() {
    if (_flushing || !navigator.onLine || !_buildClient()) return;

    _flushing = true;
    let count = 0;
    let op;

    while ((op = await _dequeue()) !== null) {
      try {
        if      (op.type === 'sync_state') await _syncState(op.data);
        else if (op.type === 'sync_tx')    await _syncTransaction(op.data);
        else if (op.type === 'system_log') {
          await _writeSystemLog(op.data.level, op.data.message, op.data.payload);
        }
        count++;
        await _sleep(FLUSH_INTER_MS); // anti-rate-limit Supabase
      } catch (e) {
        // Réseau coupé en cours de flush → réinjection atomique
        await _enqueue(op);
        _log('warn', `Flush interrompu à l'opération #${count + 1} — réinjectée en queue`);
        break;
      }
    }

    _flushing = false;
    const remaining = _queueSize();
    _updateQueueUI(remaining);

    if (count > 0) {
      _log('info', `Flush terminé — ${count} op(s) synchronisée(s), ${remaining} en attente`);
    }
  }

  /* ================================================================
     [8] AUTO-GUÉRISON
     ================================================================ */
  async function _requestStoragePersist() {
    if (!navigator.storage?.persist) return;
    try {
      const granted = await navigator.storage.persist();
      _log(
        granted ? 'info' : 'warn',
        `navigator.storage.persist → ${granted ? 'accordé ✓' : 'refusé (navigateur discrétionnaire)'}`
      );
    } catch (e) {
      _log('warn', `storage.persist erreur : ${e.message}`);
    }
  }

  function _installErrorCapture() {
    // Les erreurs sont routées vers system_logs via un CustomEvent sur document.body
    // pour respecter la règle de délégation (pas d'écouteur direct sur window
    // sauf pour window.onerror qui est une API non-bubbleable).

    document.body.addEventListener('_supa_internal_error', (evt) => {
      const { level, message, payload } = evt.detail || {};
      _writeSystemLog(level || 'error', message || 'Erreur inconnue', payload || {});
    }, { passive: true });

    // window.onerror est une API de dernier recours — exception justifiée à la règle
    window.onerror = (msg, src, line, col, err) => {
      const message = `[onerror] ${msg} — ${src}:${line}:${col}`;
      document.body.dispatchEvent(new CustomEvent('_supa_internal_error', {
        detail: { level: 'error', message, payload: { stack: err?.stack || '' } }
      }));
      return false; // Propagation native conservée
    };

    window.addEventListener('unhandledrejection', (evt) => {
      const message = `[unhandledrejection] ${evt.reason?.message || String(evt.reason)}`;
      document.body.dispatchEvent(new CustomEvent('_supa_internal_error', {
        detail: {
          level:   'error',
          message,
          payload: { reason: String(evt.reason) }
        }
      }));
    }, { passive: true });
  }

  /* ================================================================
     [9] DÉLÉGATION D'ÉVÉNEMENTS — document.body exclusivement
     Les événements natifs online/offline (window) sont convertis
     en CustomEvents sur document.body pour respecter le contrat
     architectural (zéro écouteur direct hors window.onerror).
     ================================================================ */
  function _installBodyListeners() {

    window.addEventListener('online', () => {
      document.body.dispatchEvent(
        new CustomEvent('supabase:online', { bubbles: false })
      );
    });

    window.addEventListener('offline', () => {
      document.body.dispatchEvent(
        new CustomEvent('supabase:offline', { bubbles: false })
      );
    });

    document.body.addEventListener('supabase:online', () => {
      _log('info', 'Réseau rétabli — reconnexion Realtime + flush queue');
      _updateDot(null); // État intermédiaire "sync en cours"
      _reconnectCount = 0;
      _pingPending    = false;

      if (_channel) {
        try { _client?.removeChannel(_channel); } catch (_) {}
        _channel = null;
      }

      _initChannel();
      _startHeartbeat();
      setTimeout(_flushQueue, FLUSH_DELAY_MS);
    }, { passive: true });

    document.body.addEventListener('supabase:offline', () => {
      _log('warn', 'Réseau perdu — opérations en queue locale (Web Locks actifs)');
      _stopHeartbeat();
      _updateDot(false);
    }, { passive: true });

    // Flush de sécurité toutes les 60s (rattrape les cas limites)
    setInterval(() => {
      if (navigator.onLine && _queueSize() > 0) {
        _log('info', `Flush périodique — ${_queueSize()} op(s) en attente`);
        _flushQueue();
      }
    }, 60_000);
  }

  /* ================================================================
     [10] HELPERS INTERNES
     ================================================================ */
  function _updateDot(online) {
    const dot   = document.getElementById('online-dot');
    const label = document.getElementById('online-label');
    if (online === true) {
      if (dot)   dot.className = 'online-dot';
      if (label) label.textContent = 'CLOUD ✓';
    } else if (online === false) {
      if (dot)   dot.className = 'online-dot offline';
      if (label) label.textContent = 'HORS-LIGNE';
    } else {
      // État transitoire (reconnexion en cours)
      if (dot)   dot.className = 'online-dot';
      if (label) label.textContent = 'SYNC…';
    }
  }

  function _updateQueueUI(size) {
    const el = document.getElementById('sync-queue-label');
    if (!el) return;
    el.textContent = size > 0
      ? `${size} op. en attente · Sync au retour réseau`
      : 'File sync vide';
  }

  function _log(level, message) {
    const stamp  = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const prefix = `[SupaSync ${stamp}]`;
    if      (level === 'error') console.error(prefix, message);
    else if (level === 'warn')  console.warn(prefix, message);
    else                        console.log(prefix, message);
  }

  function _logError(code, err) {
    const message = `${code}: ${err?.message || String(err)}`;
    _log('error', message);
    _writeSystemLog('error', message, {
      code,
      details:    err?.details    || '',
      hint:       err?.hint       || '',
      statusCode: err?.code       || ''
    }).catch(() => {});
  }

  function _sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /* ================================================================
     [11] API PUBLIQUE — window.SupaSync
     ================================================================ */
  const SupaSync = {

    /**
     * Initialise le module.
     * À appeler dans init() de l'app, après loadStateFromDB().
     */
    async init() {
      await _requestStoragePersist();
      _installErrorCapture();
      _installBodyListeners();
      _buildClient();
      _initChannel();
      _startHeartbeat();
      if (navigator.onLine) setTimeout(_flushQueue, FLUSH_DELAY_MS);
      _log('info', `SupaSync initialisé — SCHEMA_VERSION=${SCHEMA_VERSION}`);
    },

    /**
     * Injecte la session authentifiée dans le client sync.
     * Appeler après signInWithPassword() et à chaque refresh de token.
     * Sans session → le client reste en mode anon (RLS bloquera les writes).
     * @param {Object} session — objet session Supabase (access_token, refresh_token)
     */
    async setSession(session) {
      const client = _buildClient();
      if (!client || !session?.access_token) return;
      try {
        await client.auth.setSession({
          access_token:  session.access_token,
          refresh_token: session.refresh_token || ''
        });
        _log('info', `Session auth injectée — uid: ${session.user?.id?.substring(0, 8)}…`);
        // Flush immédiat : les ops bloquées par RLS peuvent maintenant passer
        if (navigator.onLine) setTimeout(_flushQueue, 500);
      } catch (e) {
        _log('error', `setSession échoué : ${e.message}`);
      }
    },

    /**
     * Synchronise le state global vers Supabase.
     */
    syncState: _syncState,

    /**
     * Récupère le state global depuis Supabase (singleton id=1).
     * Utilisé au démarrage pour restaurer les données après un effacement
     * local ou sur un nouvel appareil. Retourne l'objet data ou null.
     */
    async fetchState() {
      const client = _buildClient();
      if (!client || !navigator.onLine) return null;
      try {
        const { data, error } = await client
          .from('mission_state')
          .select('data')
          .eq('id', 1)
          .maybeSingle();
        if (error) { _logError('FETCH_STATE_FAIL', error); return null; }
        _log('info', 'State cloud récupéré au démarrage');
        return data?.data ?? null;
      } catch (e) {
        _log('error', `fetchState échoué : ${e.message}`);
        return null;
      }
    },

    /**
     * Synchronise une transaction individuelle.
     */
    syncTransaction: _syncTransaction,

    /**
     * Supprime une transaction côté cloud (après suppression locale).
     * Best-effort : nécessite une policy DELETE sur mission_transactions.
     */
    deleteTransaction: async function (id) {
      const client = _buildClient();
      if (!client || !navigator.onLine) return;
      const { error } = await client.from('mission_transactions').delete().eq('id', String(id));
      if (error) { _log('warn', `Delete TX cloud refusé (policy DELETE absente ?) : ${error.message}`); return; }
      _log('info', `TX cloud supprimée : ${id}`);
    },

    /**
     * Écrit une entrée dans system_logs Supabase.
     */
    writeLog: _writeSystemLog,

    /**
     * Force le vidage immédiat de la queue hors-ligne.
     */
    flushQueue: _flushQueue,

    /**
     * Force la reconnexion Realtime.
     */
    reconnect() {
      _log('info', 'Reconnexion manuelle déclenchée');
      _reconnectCount = 0;
      _pingPending    = false;
      _forceReconnect();
      _startHeartbeat();
      if (navigator.onLine) setTimeout(_flushQueue, FLUSH_DELAY_MS);
    },

    /**
     * Abonne l'app aux changements temps réel des tables critiques.
     * @param {Function} onStateChange  — cb(data) quand mission_state change
     * @param {Function} onTxChange     — cb(data) quand mission_transactions change
     */
    subscribeRealtime(onStateChange, onTxChange) {
      const client = _buildClient();
      if (!client) return;

      // Canal de données distinct du canal heartbeat
      const dataChan = client
        .channel('mission_data_rt', { config: { broadcast: { self: false } } })
        .on('postgres_changes', {
            event:  '*',
            schema: 'public',
            table:  'mission_state'
          }, payload => {
            _log('info', 'Realtime: mission_state mis à jour');
            if (typeof onStateChange === 'function') {
              try { onStateChange(payload.new); } catch (e) {
                _log('error', `onStateChange callback: ${e.message}`);
              }
            }
          })
        .on('postgres_changes', {
            event:  'INSERT',
            schema: 'public',
            table:  'mission_transactions'
          }, payload => {
            _log('info', `Realtime: tx reçue ${payload.new?.id}`);
            if (typeof onTxChange === 'function') {
              try { onTxChange(payload.new); } catch (e) {
                _log('error', `onTxChange callback: ${e.message}`);
              }
            }
          })
        .subscribe(status => {
          _log('info', `Realtime données : ${status}`);
        });

      _log('info', 'Subscriptions Realtime activées (mission_state + mission_transactions)');
      return dataChan;
    },

    /**
     * Retourne un snapshot de l'état interne.
     */
    getStatus() {
      return {
        schemaVersion:     SCHEMA_VERSION,
        online:            navigator.onLine,
        realtimeState:     _channel?.state || 'disconnected',
        pingPending:       _pingPending,
        reconnectAttempts: _reconnectCount,
        queueSize:         _queueSize(),
        heartbeatActive:   _heartbeatTimer !== null
      };
    },

    /**
     * Diagnostic complet, sans rien avaler silencieusement : pour chaque
     * étape (client, session, lecture, écriture), renvoie true/false + le
     * message d'erreur EXACT s'il y en a un. Utilisé par le bouton
     * "Forcer la synchronisation" pour qu'un utilisateur non-technique
     * puisse lire et rapporter l'erreur réelle au lieu d'un simple "ça marche pas".
     */
    async diagnose() {
      const steps = [];
      const client = _buildClient();
      steps.push({ step: 'Client Supabase', ok: !!client, detail: client ? 'instancié' : 'SDK non chargé ou clés manquantes' });
      if (!client) return { steps, overallOk: false };

      steps.push({ step: 'Connexion réseau', ok: navigator.onLine, detail: navigator.onLine ? 'en ligne' : 'hors-ligne (rien ne peut se synchroniser)' });

      let sessionOk = false, sessionDetail = 'aucune session';
      try {
        const { data, error } = await client.auth.getSession();
        if (error) { sessionDetail = 'erreur : ' + error.message; }
        else if (data?.session?.access_token) {
          sessionOk = true;
          const exp = data.session.expires_at ? new Date(data.session.expires_at * 1000) : null;
          sessionDetail = 'connecté, jeton valide' + (exp ? ` jusqu'à ${exp.toLocaleTimeString('fr-FR')}` : '');
        } else {
          sessionDetail = 'pas de session active sur ce client de synchronisation (setSession jamais appelé ou expiré)';
        }
      } catch (e) { sessionDetail = 'exception : ' + e.message; }
      steps.push({ step: 'Session authentifiée', ok: sessionOk, detail: sessionDetail });

      let readOk = false, readDetail = '';
      try {
        const { data, error } = await client.from('mission_state').select('data, updated_at').eq('id', 1).maybeSingle();
        if (error) { readDetail = `${error.code || ''} ${error.message}`.trim(); }
        else if (!data) { readDetail = 'aucune ligne trouvée (mission_state vide ou id=1 absent)'; readOk = true; }
        else {
          readOk = true;
          const nTx = Array.isArray(data.data?.transactions) ? data.data.transactions.length : 0;
          readDetail = `OK — ${nTx} transaction(s) dans le cloud, mis à jour le ${new Date(data.updated_at).toLocaleString('fr-FR')}`;
        }
      } catch (e) { readDetail = 'exception : ' + e.message; }
      steps.push({ step: 'Lecture (mission_state)', ok: readOk, detail: readDetail });

      // Test d'écriture RÉEL : on réécrit la ligne id=1 avec EXACTEMENT le même
      // contenu qu'on vient de lire (no-op côté données, mais passe par le
      // même chemin UPDATE + RLS que la vraie synchronisation — un update sur
      // un id inexistant ne prouve rien : Postgrest le rapporte comme réussi
      // même si la policy RLS interdirait l'écriture sur la vraie ligne).
      let writeOk = false, writeDetail = '';
      try {
        const { data: cur } = await client.from('mission_state').select('data').eq('id', 1).maybeSingle();
        const payload = cur?.data ?? { schema_version: SCHEMA_VERSION };
        const { error } = await client.from('mission_state').upsert({ id: 1, data: payload }, { onConflict: 'id' });
        if (error) { writeDetail = `${error.code || ''} ${error.message}`.trim(); }
        else { writeOk = true; writeDetail = 'droit d\'écriture confirmé (RLS OK)'; }
      } catch (e) { writeDetail = 'exception : ' + e.message; }
      steps.push({ step: 'Droit d\'écriture (RLS)', ok: writeOk, detail: writeDetail });

      steps.push({ step: 'File d\'attente hors-ligne', ok: _queueSize() === 0, detail: _queueSize() + ' opération(s) en attente de renvoi' });

      return { steps, overallOk: steps.every(s => s.ok) };
    }
  };

  /* ================================================================
     EXPORT GLOBAL
     ================================================================ */
  global.SupaSync = SupaSync;

})(window);
