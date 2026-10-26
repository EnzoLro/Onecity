# Programmes — ENZ-62

## Source et périmètre

`data/programs.ts` est le registre unique des trois programmes. Il reprend les contenus existants sans réécriture : C’Premium validé par Enzo sous ENZ-54, cartes C’Premium et Central Avenue intégrées sous ENZ-56, identités de navigation sous ENZ-50. Les références Figma sont conservées dans les commentaires ; aucune nouvelle lecture de maquette n’est revendiquée pour ce ticket.

Enzo a confirmé le 23 octobre 2026 que Breuil doit rester provisoire. Son libellé et son URL existants restent disponibles, sans statut, caractéristiques ou visuel ajoutés. Il reste absent des cartes de l’accueil.

## Organisation

- `slug` et `label` : identité commune ; les URL sont calculées par `projectHref`.
- `commercial` : statut, transaction, activation du contact commercial, caractéristiques et conditions fournies. Une valeur inconnue est omise. Les caractéristiques restent les libellés publiés : aucune surface, quantité ou valeur financière n’est déduite automatiquement de ces textes.
- `editorial.card` : visuel et sélection des caractéristiques affichées sur la carte. Sans ce contenu approuvé, aucune carte n’est publiée.
- `editorial.featured` : introduction, image principale et libellé du CTA de la présentation détaillée existante. Le premier programme qui possède cette présentation alimente aussi la section à la une de l’accueil ; actuellement C’Premium seulement.

`data/navigation.ts` et `data/project-catalog.ts` sont des projections sans copie des valeurs des programmes. Le titre des pages, leurs paramètres statiques et la recherche par slug utilisent directement le registre. `FeaturedProject` et `ProjectConditions` reçoivent le programme et ses conditions. Le module séparé `data/c-premium.ts` est supprimé.

Les pages Central Avenue et Breuil gardent leur structure provisoire avec titre et contact ; leur intégration complète relève des tickets de pages projet. Aucune galerie ou champ inutilisé n’est ajouté. Les textes généraux de la section « Nos réalisations » restent dans `data/project-catalog.ts`, car ils ne décrivent pas un programme en particulier.

## Ajouter ou compléter un programme

Ajouter un objet conforme à `Program` dans le registre, avec un slug unique et le libellé validé. Il devient disponible dans la navigation et la génération des pages. Renseigner uniquement les données confirmées et les images locales autorisées. Ajouter une carte quand son contenu est validé, en sélectionnant les identifiants des caractéristiques existantes. Ajouter une présentation détaillée seulement avec un texte et une image validés. Toute référence de condition doit correspondre aux conditions du même programme.

Les données restent statiques dans le dépôt : aucun CMS, formulaire ou système de suivi des stocks n’est introduit.

## Vérification

- Comparaison automatisée avec le commit ENZ-61 : cartes de l’accueil, caractéristiques, conditions, image principale et introduction C’Premium conservées à l’identique.
- `node --test tests/*.test.mjs` : 11 tests passent, dont unicité des slugs/caractéristiques, résolution des références de conditions et de cartes, présence des images et maintien de Breuil provisoire.
- `npm run lint` : OK.
- `VERCEL_ENV=preview npm run build -- --webpack` : OK, TypeScript et génération des 11 pages.
- `tests/home-qa.mjs` sur le build Preview local : 11 largeurs de 320 à 1920 px, routes, images, liens, navigation clavier et interactions existantes ; aucune erreur navigateur observée.

La recette navigateur porte sur Chromium. Les limites de contenu listées dans `docs/qa-enz-61.md` restent applicables.


## Page détail — ENZ-63

`editorial.detail` contient les sections approuvées dans Figma : panorama, repères, présentation, logements, conception, localisation et contact. `hasDetailContent` sélectionne le gabarit réutilisable. Les deux logements et les surfaces structurées reprennent les valeurs validées sous ENZ-54 ; le résumé de surfaces est calculé depuis cette liste. Le prix structuré `commercial.price` alimente à la fois le libellé partagé et sa présentation détaillée. Aucun état de disponibilité, prix total, équipement précis ou adresse du programme n’est déduit.

Le formulaire utilise les mêmes identifiants de logements côté serveur et navigateur. Les autres projets restent provisoires. Les coordonnées du contact viennent de `data/navigation.ts` et `data/footer.ts`. Les instructions Resend et les limites de recette sont dans `qa-enz-63.md`.

Les prestations confirmées le 26 octobre sont réparties dans `editorial.detail.homes.features` (atouts répétés dans chaque carte T4) et `design.principles[].items` (équipements et finitions), sans section supplémentaire. `location.access` contient les temps d’accès indicatifs fournis par Enzo. La carte C’Premium conserve séparément ses sources géographiques et ses points dans `data/geography/c-premium.json` et `data/c-premium-map-points.ts`. Le programme est localisé au 15 route de Mantes ; les adresses du contact de l’entreprise restent distinctes.
