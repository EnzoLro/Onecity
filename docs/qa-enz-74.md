# ENZ-74 — Fondations SEO

## Sources et périmètre

Travail du 27 octobre 2026, sur ENZ-68 (`927bda7`). Le [ticket ENZ-74](https://linear.app/enzo-louro/issue/ENZ-74/seo-configurer-metadata-sitemap-robots-et-canonicals), ses commentaires (aucun), `data/programs.ts` et les recettes ENZ-62/63/64/68 ont été consultés. La récupération des notes Linear a retourné « Tool get_agent_context not found » ; aucune note complémentaire n’est revendiquée.

Les descriptions reprennent les faits publiés : C’Premium à Breuil-Bois-Robert (deux T4 de 98 et 103 m², terrasse et espace vert privatif), Central Avenue comme réalisation à Hardricourt, et l’activité dans les Yvelines. Aucun prix, engagement, service ou fait commercial supplémentaire. Les visuels Open Graph réutilisent les images locales existantes ; aucune nouvelle image promotionnelle.

Implémentation avec les API natives Next.js : [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

## Mise en place

- `lib/seo.ts` : titres, descriptions, URL canoniques absolues, Open Graph (`fr_FR`, titre, description, URL, image), Twitter et règles d’indexation communes.
- Les neuf pages existantes ont des titres et descriptions distincts. Les URL canoniques ne reprennent ni les paramètres de logement/projet du contact, ni les fragments.
- `data/programs.ts` : champ optionnel `seo` contenant titre, description et activation explicite. Seul C’Premium est activé ; une page détaillée est également requise pour entrer dans le sitemap.
- `app/sitemap.ts` : en production, accueil, contact et programmes prêts. Aucun `lastModified` inventé, aucune priorité ou fréquence sans source.
- `app/robots.ts` : production ouverte au crawl, API exclue et sitemap déclaré. Preview/développement : crawl bloqué et sitemap vide.
- Chaque page garde aussi une balise robots `noindex` en Preview, même si elle définit ses propres métadonnées.
- Central Avenue et Breuil restent des pages provisoires : `noindex`, hors sitemap. Les pages légales en attente d’ENZ-77 et l’aperçu technique restent également `noindex`. Elles restent accessibles au robot en production afin qu’il puisse lire cette directive.

## Domaine confirmé et migration différée

Enzo a confirmé dans ce chat le domaine actuel et futur `https://www.onecityimmobilier.fr/`, et la règle d’indexation accueil/contact/C’Premium. Il a indiqué qu’il réalisera les DNS et redirections ultérieurement. Aucun changement DNS, rattachement de domaine ou redirection du site actuel n’est effectué.

`canonicalOrigin` dans `lib/seo.ts` est donc `https://www.onecityimmobilier.fr`. Cette valeur alimente les canonicals, les URL et images Open Graph, Twitter et le sitemap. En Preview aussi, les URL canoniques désignent le domaine public confirmé : les hôtes Vercel ne deviennent jamais les URL de référence. La Preview conserve `noindex`, son crawl bloqué et son sitemap vide.

`SITE_URL` est une surcharge facultative pour une future migration ou une recette locale. Elle doit contenir une origine HTTPS (avec ou sans `www`, sans chemin, paramètres ou identifiants). Une valeur mal formée fait échouer le build. Aucune variable supplémentaire n’est requise pour le domaine confirmé.

Le domaine `https://www.example.com` utilisé pour la recette locale est une fixture de test ; il n’est ni enregistré dans le code comme valeur par défaut ni configuré sur Vercel. La mise en production et la migration du site existant restent hors de cette livraison Preview.

## Vérifications

- Lint, 23 tests Node et builds Preview et production réussis.
- Recette HTTP sur les deux builds : neuf pages en 200, titres/descriptions uniques, balises robots, Open Graph, canonicals et images absolues en production, canonique du contact sans paramètres, sitemap XML et contenu de robots.txt.
- Preview avec le domaine confirmé : toutes les pages en `noindex`, canoniques et images absolues sur `www.onecityimmobilier.fr`, sitemap vide, `Disallow: /`.
- Production locale avec domaine de test : accueil/contact/C’Premium indexables, trois URL dans le sitemap ; autres pages exclues et en `noindex` ; projet inconnu en 404.
- Avertissements préexistants : métriques de fonte de secours Parkinsans et type de module non déclaré pour les tests TypeScript. Le premier essai de build en sandbox est resté bloqué ; le build hors sandbox a permis la vérification complète.
- Les interactions visuelles et le formulaire ne sont pas modifiés ; aucune livraison d’e-mail, soumission Search Console ou indexation effective par Google n’est revendiquée.

## Rejouer

```sh
npm run lint
node --test tests/*.test.mjs
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3114
node tests/seo-qa.mjs http://localhost:3114 preview https://www.onecityimmobilier.fr
```

Pour la recette production locale, arrêter le serveur précédent, puis :

```sh
VERCEL_ENV=production SITE_URL=https://www.example.com npm run build
VERCEL_ENV=production SITE_URL=https://www.example.com node node_modules/next/dist/bin/next start -p 3114
node tests/seo-qa.mjs http://localhost:3114 production https://www.example.com
```

Pour un futur programme, ajouter des métadonnées fondées sur les contenus confirmés dans son champ `seo`, terminer sa page détaillée, puis activer `seo.indexable`. Rejouer la recette et contrôler les titres uniques et le sitemap.

## Pré-production

Vercel Preview, projet `onecity` (`prj_qLtBXANTv9l137eATtpYv8l4WaYv`), équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`, branche `codex/enz-74-seo`. Le domaine canonique et la sélection des pages indexables ont été confirmés par Enzo avant le déploiement final.

## Ajustement éditorial — intention d’achat

Le 27 octobre 2026, Enzo a préféré les propositions centrées sur l’achat près de Mantes-la-Jolie et demandé d’associer aussi Yvelines/78. Il indique une commercialisation principalement comme appartements et une cible couvrant résidence principale et investissement. Les textes utilisent donc « appartement T4 », sans ajouter de qualification « neuf », « duplex » ou « maison », de disponibilité ou de promesse de rendement.

- Accueil : « Achat de logements dans les Yvelines (78) | One City Immobilier » ; description orientée achat, C’Premium près de Mantes-la-Jolie et Central Avenue comme réalisation.
- C’Premium : « Achat appartement T4 près de Mantes-la-Jolie (78) | C’Premium » ; description précisant Breuil-Bois-Robert, Mantes-la-Jolie (Yvelines, 78), les surfaces et les extérieurs déjà validés.
- Contact : ajout du 78 au titre et description orientée achat d’appartement dans le même secteur.
- Texte visible : présentation du programme et localisation cohérentes avec les métadonnées, adresse exacte conservée et mention des deux usages d’achat.

Open Graph et Twitter reprennent automatiquement ces nouveaux titres/descriptions. Images, canoniques et règles d’indexation sont conservées. Aucun volume de recherche n’a été mesuré et aucun classement n’est garanti. La balise `meta keywords` n’est pas ajoutée.
