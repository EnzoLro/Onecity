# Hero de l’accueil — ENZ-53

Source : [Figma 4035:529](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4035-529&m=dev).

`HomeHero` est un Server Component qui réutilise `Container`, `Text` et `StyledLink` (styles de `Button`). Le Header est inchangé. Le H1, le descriptif et les deux libellés CTA reprennent la maquette, sans nouveau texte commercial. Desktop : contenu de 1200 px, colonnes séparées de 80 px, descriptif de 440 px, espacements verticaux de 80/120 px. Le panorama et le détourage originaux sont servis localement avec `next/image`, dimensions et `sizes` explicites, et préchargés. Le montage conserve les proportions au-delà de la largeur Figma de 1512 px.

Aucune maquette mobile dédiée n’a été trouvée dans le fichier. Enzo a validé l’adaptation : titre, texte et CTA empilés, puis visuel recadré, avec boutons pleine largeur sur petit écran. Le débordement décoratif horizontal est coupé sans masquer le dépassement vertical de la maison.

Destinations confirmées par Enzo : « Nous contacter » mène à `/contact` ; « Découvrir nos projets » mène à `#nos-projets` sur l’accueil. Dans l’attente des prochaines intégrations, Enzo a validé une page Contact « Contenu à venir » avec l’e-mail existant et un repère « Nos projets — Contenu à venir ». Aucun formulaire, programme ou contenu commercial supplémentaire n’est inventé. Les liens contact existants du Header et du Footer conservent leur fonctionnement.

La galerie technique des tickets ENZ-49 et ENZ-52 a été déplacée, avec l’accord d’Enzo, vers `/apercu-composants` (`noindex`). La page Contact provisoire est aussi `noindex`.

# Header global — ENZ-50

Source : [Figma 4037:1290](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4037-1290&m=dev).

`SiteHeader` est monté dans le layout racine. Il réutilise le logo local, `Container`, `StyledLink` et les tokens existants. Les noms de projets et destinations sont centralisés dans `data/navigation.ts`.

Desktop à partir de 1 024 px : logo 177 × 40, conteneur 1 400 px avec marges internes 60 px, espacements 40 px, liens 16 px (ajustement demandé par Enzo), CTA compact. Le lien du projet courant est souligné et porte `aria-current="page"`. Sur l’accueil, aucun projet n’est sélectionné.

Mobile : disclosure natif `details`/`summary`, sans dépendance ; Enter/Espace ouvre le menu, Tab parcourt les liens, Échap ferme le menu et rend le focus au déclencheur. Un clic ferme le menu. La navigation reste dans le flux sans overlay ni piège de focus. Header non sticky, comportement validé par Enzo.

Les routes `/projets/c-premium`, `/projets/central-avenue`, `/projets/breuil` sont des structures initiales avec titre et contact seulement. Leurs présentations seront intégrées ticket par ticket à partir des maquettes déjà créées par Enzo, lors du travail sur les pages de détail. Le contact utilise l’e-mail déjà présent dans le site.

# Footer global — ENZ-51

Source : [Figma 4037:1610](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4037-1610&m=dev).

`SiteFooter` est un Server Component monté après le contenu dans le layout racine. Il réutilise `Container`, les tokens, les projets et le contact de `data/navigation.ts`. Les coordonnées validées par Enzo et les destinations sociales fournies par Enzo sont regroupées dans `data/footer.ts`. Le lien « À propos » est retiré à sa demande. Aucun CTA supplémentaire n’est prévu dans cette maquette.

Les six SVG du footer sont les exports locaux de Figma, dans `public/brand/footer/` : symbole et texte du logo à leurs dimensions natives, Instagram et LinkedIn en 24 × 24, séparateur et grand motif décoratif. Aucun asset temporaire Figma n’est chargé à l’exécution. Le grand motif est masqué aux technologies d’assistance et recadré dans le footer.

Desktop à partir de 1 200 px : quatre colonnes, contenu de 1 280 px, padding vertical de 80 px et hauteur minimale de 760 px comme la maquette. Tablette : marque au-dessus des trois colonnes. Mobile : blocs empilés, liens légaux repliables sur plusieurs lignes. Liens avec focus visible ; téléphone et e-mail utilisent `tel:` et `mailto:`. Les réseaux et le crédit auteur s’ouvrent dans un nouvel onglet avec indication accessible.

À la demande d’Enzo, les pages `/mentions-legales`, `/politique-de-confidentialite` et `/parametres-cookies` existent avec la mention « Contenu à venir » et `noindex`. Elles partagent `PendingContentPage` et les primitives de typographie, section et bouton. Aucun contenu juridique ni gestionnaire de consentement n’a été inventé : leur implémentation reste prévue dans ENZ-77. Les libellés légaux sont traduits en français (le lien « Terms of Service » devient « Mentions légales » conformément au périmètre ENZ-77).

Validation : lint et build ; rendu à 320, 375, 390, 620, 768, 1 024, 1 200 et 1 512 px sans overflow ; liens internes en HTTP 200 et footer présent ; assets chargés ; navigation clavier avec focus visible ; aucune erreur JavaScript détectée.

# Projet à la une C’Premium — ENZ-54

Source : [Figma 4035:543](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4035-543&m=dev).

`FeaturedProject` reprend le bandeau, le titre, l’accroche, les six caractéristiques, le CTA et le visuel de la maquette. Il réutilise `Container`, `Text`, `StyledLink` et les tokens existants. Desktop : conteneur 1400 px avec marges internes 60 px, gap 80 px, visuel 560 × 550 px ; mobile : texte puis visuel, CTA pleine largeur sur petit écran. Les exports Figma originaux sont locaux dans `public/brand/c-premium`, avec optimisation du visuel par `next/image`. Les icônes conservent leurs dimensions natives.

Enzo a confirmé le 21 octobre 2026 : commercialisation en cours, Breuil-Bois-Robert (78), deux T4 de 98 et 103 m², DPE A, prix à partir de 3 400 €/m². Il a fourni les textes des conditions PTZ et Jeanbrun. Ces données sont centralisées dans `data/c-premium.ts` et utilisées par l’accueil et `/projets/c-premium`. Les lignes PTZ et Jeanbrun portent des repères distincts `*` et `**`. Sur desktop avec souris, seul le survol du libellé affiche une bulle sous la ligne ; quitter le libellé la ferme. Un clic déplie la description dans le contenu, sur ordinateur comme sur tablette et téléphone, sans navigation. Cette description sans fond utilise le token `--color-item-mid` et reste ouverte jusqu’au second clic ou Échap. Le clavier permet de basculer le panneau avec Entrée/Espace ; son état et sa région sont nommés pour les technologies d’assistance. Les textes complets restent aussi dans les conditions de la page projet. « Découvrir le projet » conserve son lien vers cette page. Les conditions reprennent le texte fourni, sans ajout fiscal ou juridique.

À la demande d’Enzo, la page C’Premium affiche aussi ces informations, le même visuel et le contact existant. Cette présentation réutilise la section validée ; elle ne remplace pas l’intégration ultérieure d’une éventuelle maquette complète de page projet. Les autres pages projet conservent leurs structures initiales.

# Notre manière de concevoir — ENZ-55

Source : [Figma 4035:609](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4035-609&m=dev).

`DesignApproach` est un Server Component placé après C’Premium sur l’accueil. Il réutilise `Container`, `Text`, les espacements et les couleurs existants. Le titre utilise Parkinsans, déjà chargé par le layout, et le bandeau utilise le marron primaire de la charte pour son texte, ses bordures et son fond à 8 %, conformément à la correction demandée par Enzo. La mosaïque desktop conserve ses trois colonnes, sa hauteur de 529 px, ses gouttières de 8 px et la position des quatre images originales. À moins de 1024 px, les cartes passent en une colonne ; de 620 à 1023 px, chaque carte conserve son image à gauche du texte ; en dessous, image puis texte sont empilés. Le bloc « Chaque projet est unique. Notre exigence reste la même. » vient après les quatre cartes dans le contenu et conclut la section sur mobile et tablette ; sa position centrale desktop est conservée par la grille. Cette adaptation responsive est une décision d’intégration à partir de la maquette desktop.

Les quatre visuels et l’ensemble des textes Figma ont été confirmés par Enzo le 21 octobre 2026. Ils sont centralisés dans `data/design-approach.ts`, sans ajout de promesse commerciale. Les images originales sont stockées dans `public/brand/design-approach`, avec dimensions natives, alternatives descriptives, `sizes` responsive et optimisation par `next/image`. Aucun appel à une URL Figma temporaire à l’exécution. Les cartes partagent un seul composant ; la section utilise un H2 et quatre H3 nommés.


## HomeProjects — ENZ-56

Section `#nos-projets`, après `DesignApproach`, issue de Figma `4035:640`.
`data/project-catalog.ts` rassemble les cartes publiables, réutilise les identités de
`data/navigation.ts` et les faits confirmés de `data/c-premium.ts`. Les contenus de
Central Avenue (Hardricourt, 10 T2 de 34 et 42 m², rénovation / transformation, livré
en 2024) et les visuels/icônes locaux viennent de la maquette. Le troisième projet
Breuil reste exclu en attendant ses contenus définitifs, conformément au ticket.

La grille utilise les cartes disponibles : deux colonnes dès 768 px, une colonne
en dessous. Elle accueillera un troisième projet validé sans modifier le composant.
Le titre conserve Parkinsans, comme les sections précédentes du site ; les couleurs
reprennent les tokens marron existants. L’illustration C’Premium visible dans Figma
recouvre entièrement une autre image de fond : seul le visuel supérieur est utilisé.

C’Premium affiche le statut commercial et les liens vers le contact existant et sa
page. Central Avenue affiche uniquement le CTA « Découvrir » vers sa page existante,
conformément à la précision d’Enzo ; le contact reste réservé au projet en commercialisation.
Les pictogrammes sont décoratifs, les faits restent lisibles sous forme de liste et
les liens conservent le focus visible des primitives existantes.
