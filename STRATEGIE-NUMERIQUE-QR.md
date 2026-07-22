# Stratégie numérique, QR codes & protection vidéo
**Livre « Sénégal, Terre d'Histoire et de Rencontres »**
30 × 24 cm paysage · 224 pages · quadrichromie CMYK · papier satiné mat 170 g · trilingue FR/EN/AR
Reliure cousue cartonnée ouvrant à plat · Collector : toilée bleu nuit + dorure or + coffret magnétique (devis ARTRON 26XT479)
38 sites · 6 zones · Standard 2 000 ex. / Luxe 500 ex. numérotés

> Document de référence. Conseil du directeur de la photographie / éditeur de beaux-livres.
> À valider et ajuster sur le marché réel — ce ne sont pas des chiffres gravés.

---

## 1. Trois produits distincts (ne pas confondre)

| Produit | Ce que c'est | Prix |
|---|---|---|
| **Livre Standard** | L'objet + QR bonus d'expériences (vidéo/audio) | 50 000 FCFA (~76 €) |
| **Livre Luxe** | Objet numéroté 001–500 + coffret + numérique **offert** | 85 000 FCFA (~130 €) |
| **Version numérique intégrale** | Le livre entier à l'écran, **produit payant séparé** | **19 900 FCFA (~30 €)** |

**Règle d'or** : aucun QR du livre papier ne donne accès *gratuitement* au livre
intégral en ligne — cela cannibaliserait le produit numérique. Les QR papier
livrent uniquement des **bonus d'expérience** (ce que l'encre ne peut pas :
mouvement, son, coulisses).

---

## 2. Prix de la version numérique : 19 900 FCFA (~30 €)

Positionné à ~40 % du Standard physique.
- Assez **bas** pour capter ceux qui n'achèteront jamais le physique : diaspora
  (frais de port), public jeune, international, institutions.
- Assez **haut** pour ne pas dévaloriser le livre-objet.
- **19 900** : point psychologique, premium accessible.

**Modulations :**
- **Licence institutionnelle** (bibliothèques, écoles, ambassades) : 3–5× le prix
  unitaire, accès multi-postes.
- **Offert dans le Luxe** via le code du certificat d'authenticité → creuse
  l'écart de valeur perçue Standard ↔ Luxe.

---

## 3. Stratégie QR : ~21 codes pour tout le livre (jamais 1 par site)

Un beau-livre ne se constelle pas de QR. **~1 QR toutes les 10 pages** :
dense en valeur, sobre à l'œil.

| Emplacement (type de page maquette) | Nombre | Type QR | Contenu |
|---|---|---|---|
| Ouverture de chaque zone (`chapitre`) | 6 | 🎬 Reel de zone | Montage vidéo 2-3 min des coulisses de la zone |
| Sites « héros » (`pleine_page`) | 10 | 🎬 Behind the Scenes | Vidéo reportage 1'30-4'00 du site |
| Sites « signature sonore » (`legendes`) | 4 | 🎙️ Audio | Ambiance / narration (oiseaux, pêche, chants…) |
| Colophon | 1 | 🛒 Version numérique | Page de **vente** du numérique (pas d'accès libre) |
| 4e de couverture | 1 | 🛒 Boutique | Précommande / achat du livre |
| **TOTAL** | **~22** | | |

**Sites héros (vidéo)** : Gorée (1), Saint-Louis (13), Djoudj (15), Guet Ndar (17),
Lac Rose (19), Delta du Saloum (23), Touba (27, avec autorisation), Pays Bassari (30),
Cap Skirring (32), Dindéfelo (37).

**Signatures sonores (audio)** : Djoudj (15, oiseaux), Guet Ndar (17, pêche),
Mangroves (26, eau/silence), Touba (27, chants — avec autorisation).

**Ce qu'on NE met PAS dans le livre d'art :**
- QR « Carte & GPS » : redondant avec le numérique, peu premium → reste un outil
  terrain dans l'app, pas dans l'ouvrage.
- QR « galerie photo » par site : c'est exactement ce que fait la version
  intégrale → doublon.

**Exécution graphique (non négociable) :**
- QR discret ~1,2–1,5 cm, dans un coin **constant** page après page, jamais sur
  la photo (bandeau de légende / marge).
- Style **Or Teranga** ou **Dark Premium** (jamais Cyber Néon cyan).
- Sur double-page (60 × 24 cm), le QR va dans la bande de texte.

**Dans l'app** : bouton « 🔲 Placer les QR (stratégie) » de la Maquette (Agent
Direction Artistique) applique automatiquement ce plan. Type « 🔓 Acheter la
version numérique » ajouté au générateur QR (Agent Numérique).

---

## 4. Protection des vidéos (anti-téléchargement / anti-piratage)

**Vérité de base** : aucune protection n'est incassable à 100 % (tout écran peut
être refilmé). Objectif réaliste : rendre le piratage assez pénible pour ne pas
en valoir la peine, et **traçable**. Avec les bonnes couches, ~95 % des tentatives
sont bloquées.

Couches, de l'indispensable au haut de gamme :

1. **Streaming, jamais un fichier** — la vidéo est découpée en segments chiffrés
   (HLS/DASH). Aucun `.mp4` téléchargeable d'un clic.
2. **URL signées et expirantes** — chaque lecture = adresse valable quelques
   minutes, liée à la session. Un lien partagé meurt vite.
3. **Accès authentifié** — la vidéo ne se lance que pour un acheteur connecté ou
   un **code d'accès valide** (certificat Luxe / achat numérique). Le QR pointe
   vers une page *gated*, jamais une URL publique ouverte.
4. **DRM matériel (Widevine / FairPlay)** — chiffre le flux ; bloque les outils
   de téléchargement et, sur beaucoup d'appareils, la capture d'écran.
5. **Filigrane personnalisé (le vrai dissuasif)** — nom + n° d'exemplaire de
   l'acheteur incrusté (visible ou forensique). Si ça fuite, on sait par qui.

**Stack recommandé** (coût/robustesse, portée internationale) :
- **Bunny.net Stream** — abordable, CDN mondial, jetons signés, DRM + filigrane
  en option. Idéal budget mission.
- Alternatives : **Cloudflare Stream** (simple, signed URLs) · **Mux** (premium).

**Architecture cible :**
```
QR (livre) → page senegalthr.com/livre/{type}/{slug}
           → vérifie le droit d'accès (login OU code certificat/achat)
           → sert le flux tokenisé + filigrane
           (JAMAIS le fichier brut)
```

**À accepter** : un déterminé filmera l'écran avec un 2ᵉ téléphone. Le filigrane
le rattrape, et une refilmée dégradée n'a aucune valeur marchande. On vit avec
ces ~5 %.

---

## 5. État actuel dans le code & reste à faire

**Fait :**
- URLs QR pointent vers `senegalthr.com/livre/{type}/{slug}` (schéma unique,
  helper `buildLivreQrUrl`), plus de domaine placeholder.
- Auto-placement des ~22 QR dans la maquette (bouton Agent DA).
- Type « Acheter la version numérique » dans le générateur QR (Agent Numérique).

**Reste à construire (hors app) :**
1. Tourner et monter les vidéos de reportage par site (voir `reportage-bts-plan.js`).
2. Choisir l'hébergeur vidéo (Bunny.net conseillé) et configurer DRM + filigrane.
3. Construire les pages `senegalthr.com/livre/…` avec accès *gated* + streaming.
4. Brancher le code du certificat Luxe (001–500) sur le déblocage du numérique.
5. Mettre en place la page de vente de la version numérique (19 900 FCFA).
