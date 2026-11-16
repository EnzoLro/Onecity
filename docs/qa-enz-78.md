# ENZ-78 — QA performance, accessibilité et responsive global

Date : 16 novembre 2026  
Branche : `codex/enz-78-global-qa`  
Commit final applicatif/QA : `0263bb83201b1fba86748f8a4f122004f01688ee`  
Preview finale : https://onecity-na83mihdy-enzos-projects-9848f4b8.vercel.app

## Conclusion

Aucun bug bloquant ou majeur restant identifié sur le périmètre ENZ-78. La Preview est prête pour la phase de lancement/domaine, sous réserve des validations explicitement réservées à la production dans ENZ-76 et ENZ-79.

## Corrections issues de la QA

### Contenu / états de production
- suppression d'une ancienne mention « document de travail » sur la page Paramètres cookies ;
- mise à jour du test des pages légales pour leur état public final ;
- suppression du dernier « en attente de validation » dans le bandeau Analytics ;
- texte du bandeau de consentement raccourci pour améliorer la lisibilité mobile sans retirer les informations essentielles ;
- vérification qu'aucun résidu public Orimaj, Waitity, Lorem ipsum, note Pappers ou ancien site One City ne subsiste dans `app/`, `components/` ou `data/`.

### Accessibilité
- augmentation de la largeur tactile des dots du carrousel de 12 px à 24 px (hauteur 44 px conservée) ;
- augmentation du contraste des métadonnées de cartes projet ;
- augmentation du contraste de la localisation des témoignages ;
- audit axe final : **0 violation** sur Home, C’Premium, Contact, Mentions légales, Confidentialité, Paramètres cookies et 404, aux largeurs 390 / 768 / 1512 px.

### Qualité navigateur
- ajout explicite du favicon One City à partir du mark existant ;
- suppression du micro-étirement des deux images du hero desktop en préservant leur ratio source ;
- ajout d'une page 404 One City en français, responsive et navigable au clavier, avec retour accueil/contact ;
- plus aucune erreur console détectée dans les runs Lighthouse finaux.

### Tests
- le test Contact couvre maintenant le mode désactivé local et le mode réellement activé sur Preview ;
- ajout d'une recette dédiée à la 404 ;
- les tests légaux sont alignés sur la version publiée et non sur l'ancien état brouillon.

## Responsive et parcours

Recette navigateur effectuée sur :
- 320 px
- 375 px
- 390 px
- 619 px
- 620 px
- 768 px
- 1023 px
- 1024 px
- 1200 px
- 1512 px
- 1920 px

Contrôles :
- absence d'overflow horizontal ;
- chargement des images ;
- navigation mobile ;
- focus clavier ;
- FAQ ;
- carrousels et galeries ;
- carte et informations programme ;
- CTA projets/logements ;
- Home → C’Premium → Contact ;
- présélection du logement ;
- liens footer ;
- consentement et paramètres cookies ;
- pages légales ;
- 404.

Un crawl final des liens internes accessibles depuis les principales pages a contrôlé **11 destinations internes** sans réponse >= 400.

## Formulaire réel Preview

Une soumission réelle a été exécutée via le navigateur sur la Preview :
- Cloudflare Turnstile de test exécuté ;
- champs remplis ;
- T4 98 m² sélectionné ;
- consentement coché ;
- réponse de succès reçue ;
- Resend Preview appelé ;
- formulaire réinitialisé après succès ;
- sélection revenue à « À définir ensemble ».

Résultat : **PASS**.

## Lighthouse — Preview finale

Les scores SEO de Preview sont volontairement limités à 69 car l'environnement Preview est `noindex`. Ce point est attendu et contrôlé par les tests SEO ; la production utilise la configuration indexable prévue.

| Page / profil | Performance | Accessibilité | Best Practices | SEO Preview | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home mobile | 98 | 100 | 100 | 69 | 2,3 s | 70 ms | 0 |
| C’Premium mobile | 97 | 100 | 100 | 69 | 2,5 s | 100 ms | 0 |
| Contact mobile | 89 | 100 | 100 | 69 | 3,4 s | 160 ms | 0 |
| Home desktop | 100 | 100 | 100 | 69 | 0,5 s | 10 ms | 0 |

Le LCP Contact est principalement influencé par le bandeau de consentement rendu après hydratation. Turnstile représente une part limitée du travail principal. Aucune optimisation agressive n'a été retenue au détriment de la sécurité ou de la qualité du consentement.

## Sécurité dépendances

- `npm audit --omit=dev` : **0 vulnérabilité production** (info/low/moderate/high/critical = 0).
- npm signale 7 vulnérabilités modérées uniquement dans la chaîne de tooling/dev ESLint/TypeScript. Elles ne sont pas incluses dans le runtime de production.

## Qualité technique

- `npm run lint` : PASS
- tests Node : PASS
- build Vercel final : READY
- recettes Home / projet / Contact / légal / analytics / SEO / JSON-LD : PASS
- axe : 0 violation sur le périmètre audité
- erreurs console Lighthouse : 0
- problèmes de ratio image Lighthouse : 0
- liens internes cassés : 0
- résidus de contenu interne détectés : 0

Warnings non bloquants :
- Next ne génère pas de métriques de fallback spécifiques pour Parkinsans ; la police reste servie via `next/font` ;
- les scripts Node de QA émettent un warning de détection ESM (`MODULE_TYPELESS_PACKAGE_JSON`), sans impact sur le runtime Next.js.

## Témoignages

Les avis de démonstration sont explicitement marqués comme fictifs dans les données et ne peuvent apparaître qu'en Preview/dev. En Production, en l'absence d'avis validés dans `approvedTestimonials`, aucun faux témoignage n'est rendu.

## Restant hors ENZ-78

- ENZ-76 : vérifier en production la réception réelle GA4 et le réglage de conservation à 14 mois.
- ENZ-79 : domaine, déploiement production, Search Console et recette finale sur le domaine public.

ENZ-78 peut être clôturé.