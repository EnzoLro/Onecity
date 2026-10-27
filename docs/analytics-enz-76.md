# ENZ-76 — GA4, consentement et conversions

## Sources et décisions

Le 27 octobre 2026 : tickets ENZ-76 et ENZ-77, leurs commentaires (aucun), code et recettes ENZ-68/74/75, configuration Vercel et administration GA4. Les notes partagées Linear n’ont pas été accessibles (`Tool get_agent_context not found`).

Enzo a fourni `G-R3PX4X46C9`, autorisé un bandeau simple Accepter / Refuser avec modification depuis les paramètres cookies et demandé de couvrir toutes les interactions d’ENZ-76. La connexion fournie a permis de confirmer la propriété **Onecity**, identifiant `561026163`, compte `362686389`, flux **Onecity Immobilier**, identifiant `16215988892` et mesure `G-R3PX4X46C9`. Le flux indique actuellement `https://onecityimmobilier.fr` ; le code utilise le domaine canonique `https://www.onecityimmobilier.fr` confirmé dans ENZ-74. Aucun nouveau compte, flux, secret ou outil publicitaire créé.

Le formulaire reste volontairement désactivé conformément à ENZ-68 : ce ticket ne configure pas Resend.

## Mise en place

- `lib/analytics.ts` : ID public fourni par Enzo, garde environnement/hôte, contrat du consentement et classification des liens. Pas de variable Vercel requise pour cet ID public.
- `lib/analytics-client.ts` : chargement différé de `gtag.js`, file Google standard, Consent Mode avec publicité refusée, émission manuelle des événements et retrait.
- `components/analytics/analytics.tsx` : abonnement aux préférences, suivi de navigation et liens, bandeau et panneau de réglages. Intégré au layout avec uniquement les identifiants de programmes/logements du registre.
- `/parametres-cookies` devient une page fonctionnelle, accessible depuis le footer, avec accepter/refuser et état du choix. Sa désindexation et son fil d’Ariane sont conservés.
- Le formulaire mesure la première modification et le succès confirmé de l’API. Une erreur, un clic d’envoi, une validation HTML échouée ou un envoi désactivé ne produisent pas de conversion. Le succès réinitialise la tentative.

## Consentement

Avant accord ou après refus : aucun chargement Google et aucun événement mis en attente pour une émission ultérieure. Le consentement du formulaire est distinct du consentement analytics.

Les boutons Accepter et Refuser ont la même présentation et sont accessibles au clavier. Le choix est conservé six mois, avec version, date de choix et expiration, dans `onecity.analytics-consent.v1` en localStorage. Si le stockage échoue, le choix vaut uniquement pour le document courant. Une valeur corrompue ou expirée ne donne aucun accord.

Le refus après activation positionne le drapeau de désactivation Google, vide la file, supprime les cookies `_ga` et `_ga_*` accessibles sur l’hôte/domaine, puis recharge le document pour retirer le runtime tiers. La désactivation est aussi appliquée lors d’un changement de stockage dans un autre onglet ou à expiration du choix. Les données déjà reçues par Google ne sont pas supprimées par le retrait.

Ce mécanisme suit les recommandations techniques de la [CNIL sur le recueil et retrait du consentement](https://cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite) et la [conservation du choix pendant six mois](https://cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ). Il ne constitue pas une validation juridique de l’ensemble du site : politique de confidentialité, information sur Google et transferts éventuels et validation par One City restent à finaliser sous ENZ-77 avant production. Le panneau signale que la politique est en préparation. Aucun texte juridique complet n’a été inventé.

## Plan de mesure implémenté

| Événement | Déclenchement | Paramètres métier |
| --- | --- | --- |
| `page_view` | Première page après accord, puis changement de chemin autorisé | `page_path` |
| `click_phone` | Activation d’un lien téléphone | `page_path`, `program_id` sur une page programme |
| `click_email` | Activation d’un lien email | `page_path`, `program_id` sur une page programme |
| `discover_project` | Lien vers une autre page programme connue, y compris menu et cartes | `page_path` source, `program_id` destination |
| `view_project` | Consultation d’une page programme existante | `page_path`, `program_id` |
| `project_contact_click` | CTA vers contact avec programme connu dans la destination ou page programme source | `page_path`, `program_id` |
| `select_home` | CTA vers contact avec logement existant | `page_path`, `program_id`, `home_id` |
| `form_start` | Première modification utilisateur mesurable par tentative | `form_id=project_contact`, `program_id` |
| `generate_lead` | Succès HTTP de l’API après soumission | `form_id=project_contact`, `program_id`, `home_id` si sélectionné |

Chaque émission fixe `page_location` à l’origine + chemin autorisé, `page_title` au chemin et `page_referrer` à une chaîne vide. Aucun contenu saisi, nom, email, téléphone, message, objet de mail, cible de lien brute, paramètre d’URL libre, fragment, identifiant utilisateur ou montant n’est copié. Les chemins inconnus et l’aperçu technique sont exclus. Les paramètres d’attribution des URL ne sont pas repris par ce plan de mesure minimal.

Un CTA logement produit `select_home` et `project_contact_click` : deux lectures d’une même interaction, à ne pas additionner comme des prospects distincts. Les clics téléphone/email mesurent une intention, pas un appel abouti ni un email effectivement envoyé. Aucun événement devis/recrutement Orimaj.

## Configuration GA4 effectuée

Dans le flux confirmé, les **mesures améliorées ont été désactivées** pour éviter événements automatiques, formulaires et vues d’historique en double. Le code désactive l’envoi automatique initial de `page_view`, Google Signals et la personnalisation publicitaire. Les cookies GA4 configurés ont une durée de 180 jours sans prolongation à chaque visite.

Événements clés créés et vérifiés dans l’administration, en mode « avec du code », sans règle de duplication côté GA4 : `generate_lead`, `click_phone`, `click_email`. Comptage une fois par événement ; aucune valeur monétaire par défaut. Les autres interactions restent des événements de parcours. Les événements clés déjà présents `close_convert_lead`, `purchase` et `qualify_lead` ne sont pas émis par le site et n’ont pas été modifiés.

Dimensions personnalisées à portée événement : Programme (`program_id`), Logement (`home_id`), Formulaire (`form_id`). Elles permettent l’analyse des parcours et des conversions par programme ou logement sans données personnelles.

## Environnements et limites de recette

GA4 ne peut démarrer que si `VERCEL_ENV=production` **et** si l’hôte est exactement `www.onecityimmobilier.fr`, avec un consentement accepté valide. Preview, développement, environnements inconnus et hôtes Vercel restent sans tracking, même après accord. Le bandeau et les réglages peuvent être testés en Preview.

Il n’existe pas d’exception de tracking Preview ni de paramètre d’URL pour activer GA4. La recette automatique du comportement production utilise une origine publique simulée redirigée vers le serveur local et intercepte tous les appels Google. Elle ne transmet aucune donnée à la propriété.

La configuration des événements clés est vérifiée dans GA4 ; **la réception réelle de ces événements par GA4 n’est pas validée par ces tests simulés**. Le flux indiquait aucune donnée reçue au moment de l’intervention. La recette Temps réel/DebugView devra être faite sur le site public lors de sa mise en production ou dans un futur contexte de test séparé explicitement choisi. L’envoi réel du formulaire attend aussi l’activation de Resend. Ne pas présenter ces limites comme une recette GA4 réelle réussie.

## Vérifications

- Lint, TypeScript, 33 tests Node et builds Preview/production Webpack : réussis.
- Recette navigateur Preview à 320, 375, 768 et 1512 px : pas de débordement, bandeau, refus mémorisé, acceptation depuis les réglages, GA4 exclu, valeurs corrompues/expirées refusées, aucune erreur JavaScript.
- Recette production locale : accord requis, une vue initiale, programme consulté, découverte, clics téléphone/email, contact programme et logement, début de formulaire unique, données privées exclues, retrait et suppression des cookies.
- Recette formulaire activé uniquement dans un build local avec configuration fictive : première réponse API simulée 503 sans conversion, nouvelle tentative 200 avec un seul `generate_lead`, logement connu transmis et nouvelle saisie ouvrant une nouvelle tentative. Aucun appel Resend ni Google réel.
- Turbopack local est resté bloqué ; le processus a été arrêté et les builds locaux ont été vérifiés avec Webpack, comme dans les recettes précédentes. Le build Vercel est vérifié séparément.

```sh
npm run lint
node --test tests/*.test.mjs
VERCEL_ENV=preview npm run build -- --webpack
node node_modules/next/dist/bin/next start -p 3116
node tests/analytics-qa.mjs http://localhost:3116 preview
```

Pour la recette production simulée : arrêter le serveur Preview, construire avec `VERCEL_ENV=production`, redémarrer le serveur puis exécuter `node tests/analytics-qa.mjs http://localhost:3116 production`. L’option `--form-enabled` est réservée au build local avec `RESEND_API_KEY=local-test-fixture` et `RESEND_FROM=qa@example.com` ; le test intercepte l’API. Ne pas configurer ces fixtures sur Vercel. Playwright peut être fourni par le runtime de recette via `NODE_PATH`.

## Livraison

Branche `codex/enz-76-analytics`, basée sur ENZ-75. Cible Vercel Preview du projet `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`. Aucune fusion dans `main` ni mise en production. Le build distant et la recette de l’URL seront contrôlés après le push.

## Références Google

- [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
- [Événements recommandés et generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
