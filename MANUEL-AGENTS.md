# MANUEL D'UTILISATION DES AGENTS — MISSION CTRL · SÉNÉGAL V3

Guide pratique et détaillé : comment utiliser concrètement chaque agent, écran par écran, bouton par bouton.

> 💡 **Note :** certaines fonctions sont marquées *(IA)*. Elles font appel à l'intelligence artificielle Claude et nécessitent que la clé soit activée. Les fonctions non marquées fonctionnent toujours, même hors-ligne.

> 📷 **Uploader une photo / un fichier :** partout où il y a une zone en pointillés ou un bouton « + Ajouter », il suffit de **cliquer dessus** → la galerie photo du téléphone s'ouvre → choisir l'image. Sur mobile, on peut aussi prendre la photo directement.

---

## CONNEXION & ACCÈS PAR RÔLE

**À l'ouverture**, une courte animation du logo s'affiche, puis un écran de **connexion** : saisir l'**identifiant** et le **mot de passe** de l'équipe (compte partagé). Sans connexion, l'app ne s'ouvre pas et les agents IA sont bloqués.

Ensuite, un **code d'accès à 4 chiffres** ouvre ton espace selon ton **rôle** :
- **Direction** : accès à **tous** les agents + réglages.
- **Communication**, **Finance**, **Terrain**, **Éditorial**, **Juridique**, **Photo/Vidéo** : chacun ne voit que **ses** agents et **ses** tâches.

> La **Direction** définit et communique ces codes : Superviseur → **🔐 Gestion des Accès** → modifier chaque code → **💾 Enregistrer**. Bouton **🔒 Changer d'accès** pour reverrouiller et changer de rôle.

**📱 Installation d'un nouvel appareil (procédure obligatoire)**

Les codes d'accès sont stockés **localement sur chaque appareil** (jamais dans le cloud, par sécurité). Un téléphone jamais configuré garde donc les **codes par défaut** — il faut les remplacer **avant** de confier l'appareil :

1. Ouvrir l'app sur le nouvel appareil et se connecter (compte équipe).
2. **La Direction** entre son code → Superviseur → **🔐 Gestion des Accès**.
3. Saisir **les 7 nouveaux codes** (les mêmes que sur les autres appareils) → **💾 Enregistrer**.
4. **🔒 Changer d'accès** → laisser le membre entrer **son** code de rôle.
5. Le **PIN Direction reste secret** (coporteurs uniquement) : c'est lui qui autorise les suppressions en finance.

> ⚠️ Sans cette étape, l'appareil accepte les codes par défaut (9999, 1111…) et le verrou finance peut être contourné avec `9999`. **Nouvel appareil = Gestion des Accès d'abord.**

---

## 01 · SUPERVISEUR — Tableau de bord

C'est l'écran d'accueil, la vue d'ensemble.

- **Avancement Mission** : anneau de progression + indicateurs (sites, jours, km).
- **Check-list du Jour** : le rituel quotidien, **filtré selon ton poste** (chacun ne voit que ses tâches ; la Direction les voit toutes). Cliquer sur une ligne pour la cocher. Se réinitialise chaque jour.
- **File d'Approbations** : valider ou refuser les décisions en attente.
- **Notifications Critiques** : les alertes importantes.
- **Journal d'Activité** : l'historique des actions.
- **Diffusion Telegram** : écrire un message → bouton **📣 Équipe** (message normal) ou **🚨 Urgence** (alerte). Le message part dans le groupe Telegram (configuré côté serveur, voir Coffre-Fort).
- **🔐 Gestion des Accès** *(Direction uniquement)* : définir les codes d'accès de chaque rôle.

---

## 02 · COFFRE-FORT — Clés et identifiants

Stockage sécurisé, protégé par un code PIN, **local à chaque appareil** (rien n'est envoyé dans le cloud).

1. Saisir le PIN pour déverrouiller. Au **premier usage, changer le PIN par défaut**.
2. Chaque catégorie a un bouton **« + Ajouter clé »** : renseigner un **Nom** et une **Valeur**.
3. En bas : **🔑 Changer PIN** et **📤 Exporter** (sauvegarde).
4. À conserver ici : les **URL des réseaux sociaux** (pour le bouton « Ouvrir » du CM), la **clé météo**, et vos mots de passe de services.

> ⚠️ **Telegram et la clé IA (Claude) ne se mettent PLUS dans l'app.** Le token du bot Telegram, les groupes et la clé Claude sont configurés **côté serveur** (Vercel), jamais dans le navigateur — c'est nettement plus sûr. Le PIN et le contenu du coffre restent **sur l'appareil** et doivent être définis sur chaque téléphone utilisé.

---

## 03 · CM RÉSEAUX — Publications réseaux sociaux

Crée les posts pour les réseaux.

**A. Générer un post depuis une photo *(IA)***
1. Choisir la **Plateforme cible** (TikTok, YouTube, Instagram, Facebook, LinkedIn, X).
2. Dans « 🤖 IA — Générer depuis une Photo », **cliquer pour charger une photo** de terrain.
3. Cliquer **✨ Analyser & Générer** : Claude regarde la photo et rédige le post adapté à la plateforme.

**B. Générer sans photo**
1. Renseigner **Site / Lieu**, **Tonalité**, **Durée vidéo estimée**.
2. Cliquer **✨ Générer**.

**C. Aperçu & Historique**
- L'**Aperçu** montre le rendu selon la plateforme.
- L'**Historique** garde les posts déjà générés.

**D. Partager / publier** *(après génération)*
- **📲 Partager le post** : ouvre le partage du téléphone avec la **photo + le texte** (sur ordinateur : copie le texte et télécharge la photo). Sur **X**, le texte est pré-rempli.
- **⬇️ Télécharger** : récupère la photo et le texte.
- **🔗 Ouvrir <réseau>** : ouvre directement ta page du réseau (l'URL se renseigne dans le Coffre-Fort).
- **📤 Envoyer à Make.com** : publication automatisée si un webhook Make est configuré.

---

## 04 · FINANCIER — Budget et dépenses

Suit le budget de 100 millions FCFA (objectif du projet).

> 💡 **La grande jauge affiche le DISPONIBLE RÉEL** (encaissé − dépensé), pas les 100 M : on n'a jamais tout l'argent d'un coup. Tant qu'aucun encaissement n'est saisi dans la Trésorerie, elle affiche 0 (ou négatif en rouge si on a déjà dépensé). La ligne « Enveloppe projet » en dessous suit la consommation des 100 M du plan.

**Enregistrer une dépense :**
1. Carte **« Enregistrer une Dépense »**.
2. Choisir la **Catégorie** (transport, hébergement, équipement, impression…).
3. Saisir le **Montant (FCFA)** et une **Description**.
4. Cliquer **➕ Enregistrer**.

Le **budget global**, la **répartition par catégorie** et la **dérive** se recalculent automatiquement.
- **Tarif Imprimeur** : régler le coût d'impression unitaire.
- **File de Transactions** / **Historique** : suivi de tous les mouvements.
- **Supprimer une dépense** : bouton **✕** sur la ligne dans l'Historique → le budget est recalculé.
- **🗑 Réinitialiser la finance** : efface toutes les dépenses (double confirmation) — le budget repart de 100 M.

> 🔐 **Verrou Direction** : supprimer une dépense, supprimer un encaissement ou réinitialiser la finance exige le **PIN Direction**. Le rôle Finance peut saisir librement, mais pas effacer seul.

> ⚠️ Saisir chaque dépense le jour même pour garder un budget juste.

**Trésorerie — Cash-flow** *(le vrai suivi de l'argent)*

Les 100 M ne sont **pas disponibles d'un coup** : l'argent arrive par tranches (sponsors, subventions, dons). Cette carte suit le **cash réel**, pas seulement l'enveloppe théorique.

Trois indicateurs en haut :
- **Encaissé** : la somme réellement reçue.
- **Disponible** : Encaissé − Dépensé = ce que tu peux dépenser **maintenant**.
- **À encaisser** : les tranches que tu attends (promises, pas encore versées).

**Ajouter un encaissement** (à chaque confirmation ou versement) :
1. Clique une **puce source** (Sponsoring, MCAT, Mécènes, International, B2B…) pour pré-remplir le nom — ou tape ta propre source.
2. Saisis le **Montant réel**, choisis le **mois**, puis **✓ Reçu** (compte dans le Disponible) ou **⏳ Attendu** (promis mais pas encore versé).
3. **➕ Ajouter l'encaissement**. Le ✕ supprime une ligne.

> 🔑 Rien n'est pré-rempli : les montants du plan de financement sont des **hypothèses** (sponsors et subventions non confirmés). On ne saisit que le **réel**.

**Alertes automatiques :**
- 🔴 **Découvert** : tes dépenses dépassent l'encaissé.
- 🩸 **Trésorerie critique** : disponible sous 2 M → réunir le comité de crise.
- 🚦 **Seuil terrain** : les zones B à F ne se débloquent qu'à partir de **15 M encaissés**.

Tout en bas, la **Projection du bilan (M1→M12)** est affichée en lecture seule (repère du plan et du « corridor critique » de M10) — mais ces montants **ne comptent pas** dans le Disponible.

---

## 05 · COORDINATION TERRAIN — Chronomètre et planning

Le cœur du suivi terrain.

**Chronomètre GPS (sur chaque site) :**
1. En arrivant, cliquer **▶ Démarrer**.
2. **⏸ Pause** si besoin.
3. En fin de journée, **✅ Valider Jour** (incrémente les jours faits).

**Planning Mission :** liste des 54 jours de terrain avec leur statut.

**Journal de Terrain (chaque soir) :**
1. Renseigner **Site visité**, **Conditions terrain**, **Note de terrain**, **Prises validées (nb)**.
2. Cliquer **💾 Enregistrer Entrée**.

**Historique Sessions GPS :** retrouve toutes les sessions chronométrées.

---

## 06 · DIRECTION ARTISTIQUE — Style visuel et MAQUETTE DU LIVRE

L'agent le plus complet. Il guide les prises de vue ET construit le livre.

### Partie 1 — Préparer les prises de vue

**Générateur de Brief Visuel :**
1. Choisir le **Site de référence**.
2. Choisir un **Style photographique** (NatGeo, Golden Hour, Drone, Portrait…).
3. Choisir l'**Intention narrative** (Grandeur, Intimité, Spiritualité…).
4. **📋 Générer Brief** → un brief technique complet (cadrage, lumière, réglages).
5. **✨ Prompt 8K** → génère un prompt image haute définition.
6. Boutons **📋 Copier** et **💾 Archiver** pour conserver le brief.

**Repères fixes :**
- **Charte Colorimétrique** : les couleurs officielles de la mission.
- **Formats Techniques** : ratios et dimensions pour l'impression (300 DPI).

### Partie 2 — Contrôle qualité des photos *(IA Vision)*

**🎯 Conformité Brief :** vérifie qu'une photo respecte le brief.
1. Générer d'abord un brief (Partie 1).
2. **Charger la photo terrain** (cliquer la zone 📷).
3. **🎯 Analyser conformité** → Claude compare la photo au brief.

**🏆 Meilleure Photo du Site :** Claude choisit la meilleure parmi plusieurs.
1. **+ Ajouter photos** (2 à 5 photos du **même** site).
2. **🏆 Claude choisit** → il désigne la meilleure et explique pourquoi.
3. Bouton **« Ajouter au livre »** → la photo rejoint la **Galerie du Livre**.

**🎨 Cohérence Visuelle Inter-Sites :** vérifie l'harmonie du livre.
1. **+ Ajouter photos** (2 à 4 photos de sites **différents**).
2. **🎨 Analyser cohérence**.

**💡 Paramètres Lightroom :** réglages de retouche.
1. Charger une photo (optionnel mais recommandé).
2. **💡 Générer params** → Claude propose les réglages.

### Partie 3 — Construire le LIVRE

**📚 Galerie du Livre :** rassemble les photos validées (via « Meilleure Photo » → « Ajouter au livre »). Le compteur indique le nombre de photos.

**📖 Séquençage Narratif :** **📖 Générer séquençage** → Claude propose l'ordre des 32 sites pour une vraie narration.

**📐 Maquette du Livre :** la structure page à page.
1. Choisir la **Langue(s)** (FR, bilingue, trilingue FR+EN+AR).
2. Choisir le **Nombre de pages cible** (128 à 288, défaut 224).
3. **📐 Générer maquette** → Claude conçoit la structure : pleines pages, doubles pages, légendes, chapitres, emplacements sponsors.
4. **📋 Copier** pour récupérer le plan.

**📖 Livre Vivant — Page par Page :** la maquette complète et évolutive.
1. **📖 Initialiser le livre** → crée la structure.
2. La barre de progression se remplit au fur et à mesure des photos ajoutées.
3. Légendes trilingues (FR+EN+AR) générées par Claude, QR codes par site.
4. **📋 Exporter** pour sortir la maquette complète.

**🛍️ Recommandations Matériel :** **🎒 Besoins mission** (matériel idéal pour les 32 sites) ou **🔧 Optimiser mon parc** (à partir de l'existant).

> **En résumé, le livre se construit ainsi :** on shoote en suivant les briefs → on charge les photos dans « Meilleure Photo » → Claude sélectionne → « Ajouter au livre » remplit la Galerie → « Maquette » et « Livre Vivant » assemblent tout, page par page, avec légendes et QR codes.

---

## 07 · RÉDACTEUR — Textes du livre

Rédige et traduit les textes.

**Processeur Trilingue :**
1. Coller le **Texte Source**, choisir le **Type de contenu**.
2. Boutons : **✨ Poétiser** (embellir), **🌍 Traduire** (FR/EN/AR), **✂️ Condenser** (raccourcir). *(IA)*
3. Les **Versions Trilingues** s'affichent → **📚 Archiver Trilingue**.
4. Depuis les Versions Trilingues : **📝 Corriger (A8)** envoie le texte au Correcteur ; **📖 Envoyer au Livre** l'insère directement dans une page du Livre Vivant.

**📝 Générateur de Page Livre *(IA)* :**
1. Choisir le **Type de page** et le **Site concerné** (optionnel).
2. Ajouter des **Notes complémentaires**.
3. **📝 Générer le texte**.

**🎒 Notes Terrain → Prose Publiable *(IA)* :** tes **notes brutes sont obligatoires** (l'IA enrichit ton regard, elle ne le remplace pas). Tu peux joindre une **photo** (📷 prendre une photo ou 🖼️ galerie). Choisir un **registre** → **🎒 Transformer mes notes**.

**🔀 Reformulateur 4 Registres *(IA)* :** un texte → 4 versions de ton différentes.

**Glossaire** Wolof / FR / EN : termes clés de référence.

**📋 Pages du Livre à Rédiger** : la liste des pages à produire.

---

## 08 · CORRECTEUR — Relecture

Valide la qualité des textes.

**Censeur Éditorial :**
1. Coller le **Texte à Valider** + le **Contexte éditorial**.
2. **🔍 Analyser (local)** : vérification immédiate sans IA.
3. **✨ Claude Corrige** *(IA)* : correction approfondie.
4. **🌍 Corriger FR + EN + AR** *(IA)* : corrige et harmonise les **trois langues** d'un coup.
5. Le **Rapport de Conformité** s'affiche → **✅ Accepter**.
6. **📖 Envoyer au Livre Vivant** : place le texte corrigé directement dans une page du livre.

**🎨 Cohérence Éditoriale *(IA)* :** vérifie l'homogénéité de style entre textes.

**🤖 Détecteur de Ton IA *(IA)* :** coller un texte → **🤖 Scanner le ton IA** → indique s'il « sonne IA » et propose une version humanisée.

**Charte Éditoriale** et **Historique Validations** pour référence.

---

## 09 · COMMERCIAL — Sponsoring

Trouve et suit les financements.

**Enregistrer un partenaire :**
1. Carte **« Nouveau Partenaire »**.
2. Renseigner **Nom**, **Type**, **Montant engagé**, **Statut**, **Contreparties**.
3. **💾 Enregistrer**.

**Pipeline Commercial :** vue prospect → signé → versé.

**🤖 IA Sourcing :** **⚡ Lancer le Radar** → analyse le portefeuille et suggère des pistes.

**Générateur Dossier d'Impact *(IA, avec repli)* :**
1. Choisir le **Destinataire** (MTAC, entreprise, diaspora, ONG, ambassade).
2. Saisir le **Montant sollicité** et l'**Argument principal**.
3. **📄 Générer Dossier d'Impact** → dossier complet sur mesure.
4. **📤 Exporter .txt** pour l'envoyer.

---

## 10 · JURIDIQUE — Autorisations

Gère les autorisations de tournage et les droits.

**Suivi des autorisations :** liste filtrable (Toutes / Validées / En cours / Relance). Cliquer sur le statut d'une ligne le fait évoluer.

**Ajouter une autorisation :**
1. Choisir le **Site**, l'**Organisme**, le **Statut**, la **Référence dossier**.
2. **➕ Enregistrer**.

**✉️ Relance Personnalisée *(IA)* :**
1. Choisir l'**Autorisation à relancer**, le **Niveau de relance** (1 à 3) et la **Langue**.
2. **✉️ Générer la relance** → courrier adapté au protocole de l'organisme.

**📝 Droit à l'Image Terrain *(IA)* :** formulaire bilingue FR/Wolof. Choisir Site, Type de sujet, Usage → **📝 Générer formulaire**.

**✅ Checklist Juridique Pré-Site *(IA)* :** choisir un site → **✅ Générer la checklist**.

**📜 Contrat Cession de Droits *(IA)* :** décrire le contexte + type de cédant → **📜 Générer le contrat**.

---

## 11 · LOGISTIQUE — Matériel et sauvegardes

Gère le parc et les backups.

**Parc Technique :** liste filtrable du matériel.
**Ajouter un équipement :** Nom, Type, Numéro de série, Note → **💾 Ajouter**.

**Check-In / Check-Out :**
1. Choisir l'**Équipement** et l'**Opération** (Check-Out départ / Check-In retour / maintenance).
2. **✅ Valider Opération**.

**Validation Backups Cloud :** les cartes mémoire à sauvegarder.
- **☁️ Synchroniser Toutes** pour tout valider.
- **+ Ajouter Carte Mémoire** : Nom + Capacité.

**🗓 Préparer une Tournée :** Site + Date + sélection d'équipements → **🚀 Lancer la tournée**.

**🤖 Recommandation par Site *(IA)* :** Site + Durée → **🤖 Obtenir recommandations**.

**💾 Capacité Mémoire :** calcule si les cartes suffisent (photos/jour, taille RAW, jours restants, ratio backup).

**📋 Checklist Avant Départ *(IA)* :** Site + Date de départ → **📋 Générer la checklist**.

---

## 12 · DISTRIBUTION — Vente du livre

Gère les points de vente et le stock (2 000 Standard à 50 000 F · 500 Luxe à 85 000 F).

**Ajouter un point de vente :**
1. **Nom**, **Ville / Zone**, **Type**, **Remise accordée (%)**.
2. **Ex. Standard alloués** et **Ex. Luxe alloués**.
3. **💾 Enregistrer**.

**Suivi du stock :** deux jauges (Standard / Luxe) montrant alloué vs vendu.

**Enregistrer une vente :** sélectionner le point → **🛒 Valider Vente**.

**Tableau de Bord Financier :** chiffre d'affaires et potentiel.
**⚠️ Alertes Stock Critique :** signale les stocks faibles.

**Stratégie Distribution *(IA)* :** Budget + Zones cibles + Priorité → **✦ Analyser avec Claude**.

**Bon de Commande Institutionnel *(IA)* :** Institution, Contact, Ville, Pays, Quantités, Remise → **📄 Générer le bon de commande**.

---

## 13 · NUMÉRIQUE — QR codes, certificats, vente en ligne

Outils numériques du livre.

**Générateur QR Codes Immersifs :**
1. Choisir **Site source**, **Type de contenu**, **Style visuel** (4 styles dont Luxe doré).
2. **⬡ Générer QR Code** → s'ajoute à la **Bibliothèque QR**.

**Certificat d'Authenticité (Luxe) :**
1. Saisir le **N° exemplaire (1–500)** et le **Propriétaire** (optionnel).
2. **✦ Générer le certificat** → image téléchargeable et imprimable.

**Page de Vente *(IA)* :** Canal + Édition + Langue → **✍️ Rédiger avec Claude**.

**Séquence Pré-Lancement *(IA)* :** Date de lancement + Audiences → **📬 Générer la séquence** (emails J-30 à Jour J).

---

## 14 · MÉTÉO — Conditions et golden hours

**Connexion :** entrer la clé OpenWeatherMap (une fois) → **🔑 Enregistrer la clé**.

- **Conditions Actuelles** : météo en direct (bouton 🔄 Actualiser).
- **Prévisions 5 Jours**.
- **Alertes Climatiques** : chaleur, vent, visibilité.
- **Fenêtres Photographiques Optimales** : les golden hours (matin/soir).
- **Simuler un Bulletin** : Site + Saison → **🌤 Générer Bulletin** (sans clé, à titre indicatif).

---

## 15 · ACHATS — Devis et négociations

**Lecture Automatique d'un devis *(IA)* :**
1. **Charger un PDF ou une photo** de la facture (zone en pointillés).
2. Claude lit le document et remplit les champs en FCFA (conversion automatique des devises).
3. Vérifier les valeurs → **✅ Confirmer et enregistrer**.

**Ajouter un devis manuellement :** Prestataire, Catégorie, Montant reçu, Estimation, Note → **➕ Enregistrer Devis**.

**Comparateur Devis :** liste filtrable par catégorie.
**Synthèse Négociation :** totaux et économies.

**Argumentaire de Négociation *(IA)* :** choisir un prestataire → **✦ Générer avec Claude**.
**Email de Relance *(IA)* :** Prestataire + Ton → **📧 Rédiger l'email**.
**Recommandation Multi-Devis *(IA)* :** choisir une catégorie → **⚖️ Analyser avec Claude** (compare les devis et recommande le meilleur).

---

## 16 · CROWDFUNDING — Financement participatif

**Paliers de Contribution :** créer un palier (Prix, Limite, Contrepartie) → **💾 Enregistrer**. Supprimable tant qu'aucune contribution n'y est liée.

**Enregistrer une contribution :**
1. **Contributeur** (alias), **Palier choisi**, **Montant libre** (optionnel), **Pays / Ville**.
2. **💰 Enregistrer Contribution**.

**Objectif de Campagne :** définir l'**Objectif (FCFA)** et la **Durée restante**. Une jauge + une **projection** indiquent si l'objectif sera atteint au rythme actuel.

**Message Diaspora *(IA)* :** Réseau cible + Anecdote terrain → **✦ Générer avec Claude** (message adapté au réseau).
**Email de Remerciement *(IA)* :** choisir un contributeur → **💌 Générer le remerciement** (personnalisé).
**Diagnostic Campagne *(IA)* :** **✦ Analyser avec Claude** → état de santé + actions prioritaires.

---

## 17 · RISK MANAGER — Anticipation des risques

Surveille en continu — **tout est calculé en direct sur les vraies données de l'app** (rien d'inventé).

- **Mode PRÉ-MISSION** : tant qu'aucun jour terrain n'est validé, l'agent est en veille (pas de fausse dérive). L'horloge démarre au **premier jour validé**.
- **Moniteur de Dérive Temporelle** : écart entre planning prévu et réel (mis à jour via Coordination).
- **Registre des Risques dynamique** : un risque n'apparaît **que s'il est réel** — trésorerie (découvert, seuil critique, seuil terrain 15 M), budget par catégorie dépassé ou presque épuisé, dérive planning, autorisations à relancer (A10), stocks faibles (A12), devis en dépassement (A15). Si tout va bien : « ✅ Aucun risque actif ».
- **💡 Recommandations d'Optimisation** : en cas de retard → **⚡ Appliquer Recalibration** (mobilise des jours de repos, regroupe des sites).
- **🚨 Plan B Critique** : si retard grave → **🚨 Activer Plan B** (fusion de sites, surcoût injecté au budget).
- **Contrôle Watcher Financier** : surveille les transactions (**⚙️ Forcer Cycle** pour relancer).
- **Log Risk Manager** : historique des analyses.

> Cet agent travaille surtout **tout seul** : il suffit de tenir à jour les jours/sites faits (Coordination) et les dépenses (Financier) pour qu'il calcule et alerte.

---

## ⬡ CARTE — Localisation des sites

Onglet **Carte** (icône ⬡, ou bouton **Carte** en bas).

- Bascule **Satellite / Plan / Satellite + noms** (sélecteur en haut à droite de la carte).
- Chaque site est un point : cliquer dessus affiche son **nom**, sa **zone** et ses **coordonnées GPS**. Les sites offshore (Sangomar, GTA) sont signalés à part.
- Bouton **GPS** : suit ta position en temps réel et indique le **site le plus proche** et la distance.
- Les zones déjà consultées restent visibles **hors-ligne** sur le terrain.

---

## EN CAS DE DOUTE

- L'indicateur **ONLINE / OFFLINE** (en haut) montre l'état du réseau.
- Tout se sauvegarde automatiquement, même hors-ligne.
- Les fonctions *(IA)* ont besoin de la clé Claude active ; les autres marchent toujours.

*Manuel d'utilisation — Mission CTRL Sénégal V3.*
