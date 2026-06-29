# GUIDE DE FORMATION — MISSION CTRL · SÉNÉGAL V3

Guide complet pour l'équipe. À lire avant la première utilisation, à garder comme référence.

---

## 1. C'EST QUOI CETTE APPLICATION ?

**MISSION CTRL · SÉNÉGAL V3** est le centre de pilotage de la mission documentaire photographique au Sénégal : 32 sites, 59 jours de terrain, 5 400 km, budget 100 millions FCFA, parution du livre en 2027.

C'est une **PWA** (application web installable) : elle s'ouvre dans le navigateur mais s'installe sur le téléphone comme une vraie app, et **fonctionne sans connexion internet**.

Elle est organisée en **17 agents** (onglets), chacun couvrant un métier de la mission (finances, terrain, juridique, communication, etc.).

---

## 2. CONCEPTS DE BASE (À COMPRENDRE EN PREMIER)

### Installation
- Ouvrir l'adresse **www.senegalthr.com** dans Chrome (Android) ou Safari (iPhone)
- Menu du navigateur → **« Ajouter à l'écran d'accueil »**
- L'app apparaît comme une icône, en plein écran

### Connexion
- Un **code d'accès** est demandé à l'ouverture (mur d'authentification)
- Le **Coffre-Fort** a en plus son propre code PIN

### Fonctionne hors-ligne
- Sur le terrain, beaucoup de zones n'ont pas de réseau. **Ce n'est pas un problème.**
- Tout ce que tu saisis est d'abord enregistré **sur le téléphone** (mémoire locale)
- Dès que le réseau revient, l'app **synchronise automatiquement** avec le cloud
- Une **file d'attente** garde les actions faites hors-ligne et les envoie plus tard

### Navigation
- Les onglets en haut permettent de passer d'un agent à l'autre
- L'indicateur **ONLINE / OFFLINE** (point en haut à droite) montre l'état réseau

---

## 3. COMMENT LA SYNCHRONISATION FONCTIONNE (IMPORTANT)

C'est le cœur du système. Trois niveaux :

| Niveau | Rôle |
|---|---|
| **Mémoire locale (téléphone)** | Sauvegarde immédiate de tout. Marche même sans réseau. |
| **Cloud (Supabase)** | Sauvegarde centrale partagée. Se met à jour dès qu'il y a du réseau. |
| **Temps réel** | Quand quelqu'un change une donnée, les autres appareils connectés la reçoivent. |

**Ce qui est synchronisé dans le cloud :**
- Budget et dépenses
- Avancement (jours faits, sites faits)
- Le Coffre-Fort entier (clés, configuration Telegram)
- La clé météo
- La check-list du jour

**À retenir pour l'équipe :**
- Tu peux travailler hors-ligne sans crainte, rien n'est perdu
- Ne ferme pas l'app brutalement juste après une saisie sans réseau ; laisse-la une seconde enregistrer
- Si tu changes de téléphone ou réinstalles l'app, tes données reviennent du cloud automatiquement

---

## 4. LES 17 AGENTS — MODE D'EMPLOI

Les agents sont regroupés ici par métier pour faciliter la formation.

### 🧭 PILOTAGE

#### 01 · Superviseur (COO) — le tableau de bord
**Rôle :** vue d'ensemble de toute la mission.
**On y trouve :**
- **Avancement Mission** : indicateurs clés (sites, jours, km, budget)
- **Check-list du Jour** : le rituel quotidien à cocher (se réinitialise chaque jour)
- **File d'Approbations** : les décisions à valider
- **Notifications Critiques** : les alertes importantes
- **Journal d'Activité** : l'historique de ce qui se passe dans l'app
- **Diffusion Telegram** : envoyer un message à l'équipe (📣) ou une urgence (🚨)

**Comment l'utiliser :** c'est l'écran d'accueil. On le consulte plusieurs fois par jour. On coche la check-list, on valide les approbations, on diffuse les messages importants.

#### 17 · Risk Manager — l'anticipation
**Rôle :** surveille en continu les retards et les risques budgétaires.
**Ce qu'il fait :**
- Calcule la **dérive** entre le planning prévu et la réalité
- Propose des **optimisations** en cas de retard (regrouper des sites proches, mobiliser des jours de repos)
- Déclenche un **Plan B** si le retard devient critique

**Comment l'utiliser :** le tenir informé en mettant à jour les jours/sites faits (via Coordination). Il calcule le reste tout seul et alerte la direction.

---

### 🔐 SÉCURITÉ

#### 02 · Coffre-Fort — les clés sensibles
**Rôle :** stocker en sécurité les identifiants et clés (token Telegram, clés API, etc.).
**Protégé par un code PIN.**
**Comment l'utiliser :** ajouter une clé via « + Ajouter clé » (nom + valeur). À réserver aux responsables. Possibilité d'exporter une sauvegarde.

> ⚠️ Le Coffre-Fort contient des informations critiques (ex : le token du bot Telegram). Accès à limiter aux porteurs du projet.

---

### 📷 TERRAIN

#### 05 · Coordination Terrain — le chronomètre de mission
**Rôle :** suivre le temps réel passé sur chaque site.
**Ce qu'il fait :**
- **Chronomètre GPS** : à lancer en arrivant sur un site, à arrêter en partant
- **Planning** des 59 jours de terrain
- **Journal de terrain** : noter ce qui s'est passé dans la journée
- **Historique des sessions GPS**

**Comment l'utiliser :** sur chaque site, lancer le chrono. Le soir, mettre à jour les jours/sites faits. C'est ce qui nourrit le Risk Manager.

#### 11 · Logistique — le matériel
**Rôle :** gérer le parc technique et les sauvegardes.
**Ce qu'il fait :**
- **Parc technique** : inventaire des appareils, objectifs, drones, etc.
- **Check-In / Check-Out** : sortie et retour du matériel
- **Validation Backups Cloud** : confirmer que les cartes mémoire sont sauvegardées

**Comment l'utiliser :** check-out le matin avant de partir, check-in le soir. Valider les backups chaque soir (non négociable pour ne perdre aucune photo).

#### 14 · Météo — la fenêtre de tir
**Rôle :** météo en direct et meilleures heures pour photographier.
**Ce qu'il fait :**
- Météo actuelle + prévisions sur 5 jours par région
- **Golden hours** (lever/coucher du soleil) pour la lumière idéale
- **Alertes** : chaleur extrême, vent fort, visibilité réduite

**Comment l'utiliser :** consulter chaque matin le site du jour. Nécessite une clé OpenWeatherMap (déjà configurée).

---

### ✍️ CRÉATION & CONTENU

#### 03 · CM Réseaux — la communication
**Rôle :** créer les publications pour les réseaux sociaux.
**Ce qu'il fait :**
- Choix de la **plateforme cible** (TikTok, Instagram, LinkedIn, etc.)
- **Génération depuis une photo** (IA) : décrire une photo → post rédigé
- Générateur de texte sans photo
- Aperçu + historique

**Comment l'utiliser :** sélectionner la plateforme, charger une photo de terrain, générer le post, ajuster, publier. *(Les fonctions IA nécessitent la clé Claude.)*

#### 06 · Direction Artistique — la cohérence visuelle
**Rôle :** définir le style et les briefs visuels de la mission.
**Ce qu'il fait :** génère des briefs techniques et visuels (cadrage, lumière, références) pour guider les prises de vue.

#### 07 · Rédacteur — les textes du livre
**Rôle :** rédiger et structurer les textes de l'ouvrage.
**Ce qu'il fait :** bibliothèque de textes, intégration au plan du livre.

#### 08 · Correcteur — la relecture
**Rôle :** réviser et corriger les textes.
**Ce qu'il fait :** révision, vérification de conformité, détection du « ton IA » pour humaniser les textes.

#### 13 · Numérique — l'expérience digitale du livre
**Rôle :** outils numériques liés au livre.
**Ce qu'il fait :**
- Génération de **QR codes** (4 styles, dont un style Luxe doré)
- **Certificat d'authenticité** pour les exemplaires numérotés (PNG + impression)
- Pages de vente et séquences d'emails de pré-lancement *(IA)*

---

### 💼 BUSINESS & FINANCEMENT

#### 04 · Financier — l'argent
**Rôle :** suivre le budget de 100 millions FCFA.
**Ce qu'il fait :**
- Jauge du budget global
- **Enregistrement des dépenses** par catégorie (transport, hébergement, équipement, impression, etc.)
- Tarif imprimeur
- File et historique des transactions

**Comment l'utiliser :** saisir chaque dépense le jour même. Le budget et la dérive financière se recalculent automatiquement.

#### 09 · Commercial — le sponsoring
**Rôle :** trouver et suivre les financements (mécénat, institutions).
**Ce qu'il fait :**
- Gestion des **sponsors** et du pipeline (prospect → signé → versé)
- **Générateur de dossier d'impact** adapté au type de bailleur *(IA, avec repli sur modèles)*

**Comment l'utiliser :** enregistrer chaque sponsor et son statut, générer un dossier sur mesure pour les démarches.

#### 12 · Distribution — la vente du livre
**Rôle :** gérer les points de vente et le stock.
**Contexte :** 2 éditions — 2 000 Standard (50 000 FCFA) et 500 Luxe numérotés (85 000 FCFA).
**Ce qu'il fait :**
- Points de vente (librairies, hôtels…) avec remises
- Suivi du **stock par édition** (alloué / vendu)
- Tableau de bord financier des ventes
- Alerte quand un stock devient faible

#### 15 · Achats — les devis et négociations
**Rôle :** gérer les devis fournisseurs.
**Ce qu'il fait :**
- **Lecture automatique d'un devis PDF ou photo** : l'IA lit la facture et remplit les montants en FCFA (conversion automatique des devises)
- Argumentaires de négociation, emails de relance, comparateur de devis *(IA)*
- Suivi par rapport au budget

#### 16 · Crowdfunding — le financement participatif
**Rôle :** piloter la campagne de financement.
**Ce qu'il fait :**
- **Paliers** de contribution personnalisables
- Jauge de progression + **projection** d'atteinte de l'objectif
- Messages adaptés par réseau, remerciements, diagnostic de campagne *(IA)*

---

### ⚖️ LÉGAL

#### 10 · Juridique — les autorisations
**Rôle :** gérer les autorisations de tournage et les droits.
**Ce qu'il fait :**
- 32 **autorisations** pré-remplies (organismes réels) avec statut (validé / en cours / relance)
- Journal juridique
- Relances personnalisées, formulaires de droit à l'image (FR/Wolof), checklists, contrats de cession *(IA)*

**Comment l'utiliser :** suivre l'état de chaque autorisation, passer en « relance » celles qui tardent (cela peut alerter l'équipe).

---

## 5. TELEGRAM — LES NOTIFICATIONS D'ÉQUIPE

L'app est reliée à **deux groupes Telegram** via un bot :

| Groupe | Qui | Reçoit quoi |
|---|---|---|
| **Équipe** | toute l'équipe | alertes opérationnelles (stock, juridique, durée, météo), **avec confirmation** |
| **Direction** | les 2 co-porteurs | **TOUT automatiquement**, y compris finances et Risk Manager |

**Les 6 problèmes détectés automatiquement :**
1. Dérive budgétaire (≥ 90 %) — *direction uniquement*
2. Activation Plan B — *direction uniquement*
3. Stock faible (distribution)
4. Autorisation en relance (juridique)
5. Durée terrain dépassée
6. Mauvaise météo (chaleur, vent, visibilité)

**Confirmation :** quand un problème opérationnel survient, une fenêtre propose d'envoyer au groupe Équipe. Rien ne part sans validation. Les sujets sensibles (finances, risque) vont automatiquement au seul groupe Direction.

**Rappel automatique :** chaque soir à 20h, le bot envoie au groupe Direction un rappel du rituel du soir.

---

## 6. LE RITUEL QUOTIDIEN (LA CLÉ DU SUCCÈS)

### 🌅 Matin (5 min)
- Vérifier la **météo** + golden hours du site
- Vérifier les **autorisations** du site
- **Check-out** du matériel

### 📸 Terrain
- Lancer le **chrono GPS** sur chaque site

### 🌙 Soir (10 min — le plus important)
- **Check-in** matériel + **backups** des cartes
- Mettre à jour **jours / sites faits**
- Saisir les **dépenses du jour**
- Mettre à jour les **autorisations**

> Règle d'or : le soir, **tout ce qui s'est passé entre dans l'app**. Les calculs, alertes et sauvegardes se font tout seuls.

La **check-list du jour** (onglet Superviseur) reprend ce rituel avec des cases à cocher.

---

## 7. BONNES PRATIQUES POUR L'ÉQUIPE

- **Saisir petit mais souvent** plutôt que tout rattraper en fin de semaine
- **Ne pas avoir peur du hors-ligne** : l'app est faite pour ça
- **Valider les backups chaque soir** : c'est l'assurance anti-perte de photos
- **Garder les codes confidentiels** (accès app + PIN Coffre-Fort)
- En cas de souci, regarder l'indicateur **ONLINE/OFFLINE** et le **Journal d'Activité**

---

## 8. À VENIR — ACCÈS PAR RÔLE

Prochaine étape : chaque membre aura un **accès restreint à son métier** :
- Le CM ne verra que l'agent CM
- Le financier ne verra que l'agent Financier
- Etc.

Les porteurs du projet garderont l'accès complet. Cette section sera mise à jour quand la fonctionnalité sera en place.

---

*Document de formation — Mission CTRL Sénégal V3. À mettre à jour au fil des évolutions de l'app.*
