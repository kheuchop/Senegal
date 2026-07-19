# Prompts Flow — Section 6 « Voir concrètement » (sponsors.html)

Format cible : **16:9 paysage**, haute résolution. Génère chaque image, puis renvoie-les moi (ou dépose-les dans `Senegal/assets/mockups/`) sous ces noms exacts et je les intègre à la place des mockups CSS actuels :

- `double-page.jpg`
- `couverture.jpg`
- `ceremonie.jpg`
- `collector.jpg`

---

## 1. Double page prestige (`double-page.jpg`)

```
Photographie éditoriale premium d'un beau-livre grand format ouvert sur une
double page, posé à plat sur une table en bois sombre patiné, vue légèrement
plongeante à 45°, éclairage studio doux et directionnel venant de la gauche
créant des ombres douces sur le papier mat épais.

Page de gauche : photographie plein cadre d'un paysage côtier sénégalais au
coucher de soleil doré (île historique, pirogues traditionnelles colorées,
palmiers), grain photographique fin, tons chauds ocre et or.

Page de droite : bloc de texte élégant en typographie serif fine noire sur
fond ivoire crème, marges généreuses, avec un espace rectangulaire discret
réservé en bas à droite pour un emplacement logo sponsor (cadre fin doré,
vide, sans texte).

Reliure cousue visible au centre, tranche du papier légèrement dorée sur le
côté. Ambiance luxe éditorial, beau-livre de collection haut de gamme
(référence : Assouline, Taschen, National Geographic collector). Palette :
ivoire, noir encre, touches or antique #C9A84C. Fond flou hors champ : bureau
sombre acajou, rayon de lumière chaude.

Format 16:9 paysage, photoréaliste, haute résolution, netteté du grain du
papier visible, aucune personne, aucun texte lisible superflu.
```

## 2. Couverture avec emplacement logo (`couverture.jpg`)

```
Photographie produit premium d'un livre relié cartonné grand format fermé,
posé debout légèrement incliné sur un socle noir mat dans un décor
minimaliste sombre, éclairage studio dramatique en clair-obscur venant du
dessus, léger reflet sur un sol laqué noir.

Couverture rigide bleu nuit profond (#0D1525) avec titre en lettrage doré
gravé en relief « SÉNÉGAL, TERRE D'HISTOIRE ET DE RENCONTRES », sous-titre
fin en capitales dorées plus petites en dessous. Bandeau photographique
intégré : vue aérienne dorée d'une île historique sénégalaise au coucher de
soleil.

En bas de couverture, un espace rectangulaire propre et discret réservé à un
logo partenaire (cadre fin doré, vide, prêt à recevoir un logo). Tranche
dorée métallisée visible sur le côté du livre. Finition mate anti-reflet
avec liseré or brillant.

Fond : dégradé bleu nuit très sombre presque noir, légère brume lumineuse
dorée en arrière-plan.

Format 16:9 paysage, photoréaliste, haute définition, style photographie de
produit de luxe.
```

## 3. Cérémonie de lancement (`ceremonie.jpg`)

```
Photographie de reportage événementiel premium d'une cérémonie officielle de
lancement de livre dans une salle de réception élégante, en soirée. Estrade
dorée avec pupitre, grand écran en fond de scène projetant une couverture de
livre dorée sur fond bleu nuit, éclairage chaud doré et bleu nuit, jeux de
lumière architecturale subtils.

Public élégant en tenues de soirée et tenues traditionnelles ouest-africaines
raffinées (boubous brodés), environ 200 invités assis, ambiance
protocolaire haut de gamme. Table d'honneur au premier plan avec des
exemplaires du livre exposés sur présentoirs dorés.

Photographie grand angle depuis le fond de la salle, profondeur de champ
cinématographique, légère brume lumineuse dorée dans l'air.

Style : photojournalisme événementiel de luxe (référence Vanity Fair Africa),
couleurs chaudes dorées et bleu nuit profond en clair-obscur.

Format 16:9 paysage, haute résolution, personnages génériques anonymes,
vus de dos ou en silhouette au premier plan, aucun visage identifiable de
personnalité réelle.
```

## 4. Édition collector (`collector.jpg`)

```
Premium studio product photography of a luxury collector's book box set,
deep night blue cloth-bound case with a magnetic clasp, shown slightly open
to reveal the gilt-edged book inside, metallic gold foil embossing engraved
on the case.

Resting on dark, subtly wrinkled silk fabric, soft circular studio lighting
creating a warm golden halo around the object, subtle reflections on the
gold foil. Small gold-embossed numbering visible on the case, evoking a
limited collector's edition.

Deep black gradient background, with softly blurred golden particles out of
focus in the background, evoking luxury and rarity. Centered composition,
slight 3/4 top-down angle.

High-end jewelry product photography style (reference: Cartier, Hermès
presentation case), fabric texture and gold foil finely detailed and sharp.

16:9 landscape format, photorealistic, high definition, no readable text
other than the gold-foiled title lettering.
```

---

### Notes d'usage
- Si Flow te propose des variantes, choisis celles où **l'espace logo reste vide et propre** (pas de logo halluciné) — c'est plus facile à retoucher ensuite.
- Si un visage de personnalité reconnaissable apparaît sur la cérémonie (prompt 3), régénère — les modèles peuvent halluciner des visages ressemblant à des personnes réelles.
- Une fois les 4 images en main, envoie-les moi (ou dis-moi qu'elles sont dans `Senegal/assets/mockups/`) et je remplace les mockups CSS actuels par ces vrais visuels dans `sponsors.html`.
