# One City Immobilier

Site One City Immobilier — Next.js, React et TypeScript.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Deployment

The repository is connected to Vercel.

- `main` deploys to Production.
- Pull requests and non-production branches create Preview deployments.
- Environment variables can be scoped separately in Vercel for Development, Preview, and Production.

## Recette de l’accueil

Le rapport ENZ-61, les sources et les limites de contenu sont dans
[`docs/qa-enz-61.md`](docs/qa-enz-61.md).

## Données des programmes

Le registre commun et son mode d’emploi sont décrits dans [`docs/programs.md`](docs/programs.md).

## Page C’Premium

La recette ENZ-63 et la configuration différée de Resend sont décrites dans [`docs/qa-enz-63.md`](docs/qa-enz-63.md).

La recette responsive et contenu ENZ-64 est consignée dans [`docs/qa-enz-64.md`](docs/qa-enz-64.md).

## Page contact

La page contact C’Premium, les parcours T4 et la recette ENZ-68 sont décrits dans [`docs/qa-enz-68.md`](docs/qa-enz-68.md). L’envoi Resend reste préparé et désactivé, selon la décision confirmée pour ce ticket.

## SEO technique

Les règles d’indexation, le domaine canonique confirmé, les métadonnées et la recette ENZ-74 sont documentées dans [`docs/qa-enz-74.md`](docs/qa-enz-74.md). La Preview reste désindexée ; le domaine public est `https://www.onecityimmobilier.fr`.

Les données structurées, leurs sources, les exclusions et la recette ENZ-75 sont décrites dans [`docs/qa-enz-75.md`](docs/qa-enz-75.md).

## Analytics et consentement

Le plan de mesure GA4 ENZ-76, les événements, la gestion du consentement, les réglages de la propriété et les limites de recette sont décrits dans [`docs/analytics-enz-76.md`](docs/analytics-enz-76.md). GA4 reste désactivé sur Preview ; le formulaire reste désactivé tant que Resend n’est pas configuré.
