# ENZ-75 — Données structurées

## Sources et décisions

Ticket ENZ-75 et commentaires (aucun), recettes ENZ-74 et ENZ-68, registre `data/programs.ts`, coordonnées `data/footer.ts` et `data/navigation.ts`, FAQ et composants existants consultés le 27 octobre 2026. L’appel aux notes Linear a échoué avec « Tool get_agent_context not found » ; aucune note complémentaire n’est revendiquée.

Enzo a fourni [la fiche Société.com](https://www.societe.com/societe/one-city-immobilier-440314540.html), consultée dans le navigateur : ONE CITY IMMOBILIER, SIREN 440 314 540, SIRET du siège 440 314 540 00038, 2 rue du Carrefour, 78930 Breuil-Bois-Robert. L’adresse correspond au footer. Seuls la raison sociale et le SIREN sont ajoutés dans `data/organization.ts`, avec une mention visible dans le footer. Le SIRET, la TVA, le capital, le dirigeant et les dates ne sont pas nécessaires au balisage retenu.

## Mise en place

- `Organization` dans le layout : nom public, raison sociale, identifiant SIREN sous `PropertyValue`, URL, téléphone, email et adresse déjà publiés. Identifiant stable `/#organization` sur le domaine canonique d’ENZ-74.
- Aucun `sameAs` vers le profil LinkedIn personnel de Carlos Louro. Pas de profil externe ajouté sans validation de son identité comme profil de l’organisation.
- `BreadcrumbList` sur contact, les trois pages programmes et les trois pages d’information. Un composant serveur commun produit à la fois le fil visible et son JSON-LD : Accueil → page actuelle. Aucune page `/projets` fictive. Le fil existant de C’Premium est conservé visuellement avec ses styles transférés au composant commun.
- L’accueil et l’aperçu technique n’ont pas de fil d’Ariane. Les pages provisoires conservent leur `noindex` et leur exclusion du sitemap.
- `ApartmentComplex` sur C’Premium uniquement, avec son adresse déjà publiée et deux `Apartment` contenant les surfaces approuvées (98 et 103 m²), en `QuantitativeValue`, unité UN/CEFACT `MTK`. Activation explicite dans le registre et page détaillée approuvée requises. Aucun total de logements, nombre de chambres, offre, prix de lot ou stock n’est déduit des deux logements présentés.
- Aucun balisage immobilier sur Central Avenue ou Breuil, dont les pages restent provisoires.
- Aucun `Review`, `AggregateRating`, `Offer`, disponibilité, zone desservie ou donnée héritée d’Orimaj. Le JSON-LD est rendu côté serveur par une balise native et les caractères `<` sont échappés pour empêcher une sortie du script.
- La FAQ demeure inchangée. `FAQPage` n’est pas retenu pour ce ticket SEO : [Google a supprimé les résultats enrichis FAQ le 7 mai 2026](https://developers.google.com/search/updates). Aucun résultat enrichi ou gain de classement n’est promis.

## Références techniques

- [Organization — Google](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [BreadcrumbList — Google](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [ApartmentComplex — Schema.org](https://schema.org/ApartmentComplex)
- Guide JSON-LD de la version Next.js installée : `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.

## Vérifications reproductibles

```sh
npm run lint
node --test tests/*.test.mjs
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3115
node tests/structured-data-qa.mjs http://localhost:3115
node tests/seo-qa.mjs http://localhost:3115 preview https://www.onecityimmobilier.fr
```

Les tests couvrent l’identité sourcée, les URL et positions du fil, l’exclusion des programmes non documentés, les surfaces et la protection contre la fermeture d’un script par du contenu. La recette HTTP contrôle neuf pages, le JSON effectivement rendu côté serveur, les correspondances visibles, les exclusions et l’absence des schémas interdits. Elle se rejoue aussi sur une URL Preview.

## Livraison

Branche `codex/enz-75-structured-data`, projet Vercel `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`. Cible Preview pré-prod. Les règles SEO existantes conservent la Preview en `noindex`, crawl bloqué et sitemap vide, avec les URL canoniques publiques.
