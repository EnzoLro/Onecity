# ENZ-74 — Fondations SEO

## Sources et périmètre

Travail du 27 octobre 2026, sur ENZ-68 (`927bda7`). Le [ticket ENZ-74](https://linear.app/enzo-louro/issue/ENZ-74/seo-configurer-metadata-sitemap-robots-et-canonicals), ses commentaires (aucun), `data/programs.ts` et les recettes ENZ-62/63/64/68 ont été consultés. La récupération des notes Linear a retourné « Tool get_agent_context not found » ; aucune note complémentaire n’est revendiquée.

Les descriptions reprennent les faits publiés : C’Premium à Breuil-Bois-Robert (deux T4 de 98 et 103 m², terrasse et espace vert privatif), Central Avenue comme réalisation à Hardricourt, et l’activité dans les Yvelines. Aucun prix, engagement, service ou fait commercial supplémentaire. Les visuels Open Graph réutilisent les images locales existantes ; aucune nouvelle image promotionnelle.

Implémentation avec les API natives Next.js : [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

## Mise en place

- `lib/seo.ts` : titres, descriptions, URL canoniques absolues, Open Graph (`fr_FR`, titre, description, URL, image), Twitter et règles d’indexation communes.
- Les neuf pages existantes ont des titres et descriptions distincts. Les URL canoniques ne reprennent ni les paramètres de logement/projet du contact, ni les fragments.
- `data/programs.ts` : champ optionnel `seo` contenant titre, description et activation explicite. Seul C’Premium est activé ; une page détaillée est également requise pour entrer dans le sitemap.
- `app/sitemap.ts` : en production configurée, accueil, contact et programmes prêts. Aucun `lastModified` inventé, aucune priorité ou fréquence sans source.
- `app/robots.ts` : production configurée ouverte au crawl, API exclue et sitemap déclaré. Preview/développement/configuration manquante : crawl bloqué et sitemap vide.
- Chaque page garde aussi une balise robots `noindex` en Preview, même si elle définit ses propres métadonnées.
- Central Avenue et Breuil restent des pages provisoires : `noindex`, hors sitemap. Les pages légales en attente d’ENZ-77 et l’aperçu technique restent également `noindex`. Elles restent accessibles au robot en production afin qu’il puisse lire cette directive.

## Domaine à confirmer

Aucun domaine public officiel n’est confirmé dans les sources consultées. Le projet Vercel `onecity` ne présente que des domaines `vercel.app`. L’adresse e-mail ne permet pas de déduire le domaine du site. La question a été posée à Enzo dans le chat, ainsi que la règle d’indexation proposée.

`SITE_URL` doit contenir l’origine HTTPS officielle (avec ou sans `www`, sans chemin, paramètres ou identifiants). Sans cette valeur : aucune URL canonique/OG/image absolue n’est inventée, le sitemap reste vide et l’indexation désactivée, y compris en production. Open Graph conserve titre, description, langue et nom du site. Une valeur mal formée fait échouer le build.

Après confirmation : configurer `SITE_URL` dans Vercel Preview et Production, puis reconstruire. Les canonicals et URL sociales de Preview pointeront vers le domaine public confirmé, tout en conservant `noindex` et le sitemap Preview vide. La production pourra publier les trois entrées prévues. Aucun basculement en production n’est réalisé dans ce ticket.

Le domaine `https://www.example.com` utilisé pour la recette locale est une fixture de test ; il n’est ni enregistré dans le code comme valeur par défaut ni configuré sur Vercel.

## Vérifications

- Lint, 23 tests Node et builds Preview et production configurée réussis.
- Recette HTTP sur les deux builds : neuf pages en 200, titres/descriptions uniques, balises robots, Open Graph, canonicals et images absolues en production configurée, canonique du contact sans paramètres, sitemap XML et contenu de robots.txt.
- Preview sans domaine : toutes les pages en `noindex`, aucune canonique, sitemap vide, `Disallow: /`.
- Production locale avec domaine de test : accueil/contact/C’Premium indexables, trois URL dans le sitemap ; autres pages exclues et en `noindex` ; projet inconnu en 404.
- Avertissements préexistants : métriques de fonte de secours Parkinsans et type de module non déclaré pour les tests TypeScript. Le premier essai de build en sandbox est resté bloqué ; le build hors sandbox a permis la vérification complète.
- Les interactions visuelles et le formulaire ne sont pas modifiés ; aucune livraison d’e-mail, soumission Search Console ou indexation effective par Google n’est revendiquée.

## Rejouer

```sh
npm run lint
node --test tests/*.test.mjs
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3114
node tests/seo-qa.mjs http://localhost:3114 preview
```

Pour la recette production locale, arrêter le serveur précédent, puis :

```sh
VERCEL_ENV=production SITE_URL=https://www.example.com npm run build
VERCEL_ENV=production SITE_URL=https://www.example.com node node_modules/next/dist/bin/next start -p 3114
node tests/seo-qa.mjs http://localhost:3114 production https://www.example.com
```

Pour un futur programme, ajouter des métadonnées fondées sur les contenus confirmés dans son champ `seo`, terminer sa page détaillée, puis activer `seo.indexable`. Rejouer la recette et contrôler les titres uniques et le sitemap.

## Pré-production

Vercel Preview, projet `onecity` (`prj_qLtBXANTv9l137eATtpYv8l4WaYv`), équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`, branche `codex/enz-74-seo`. La publication ne doit pas être considérée comme une validation du domaine public manquant.
