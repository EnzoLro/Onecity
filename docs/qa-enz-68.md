# ENZ-68 — Page contact C’Premium

## Sources et décisions

- [Ticket ENZ-68](https://linear.app/enzo-louro/issue/ENZ-68/contact-integrer-la-page-cpremium-et-le-formulaire-de-contact).
- [Figma 4045:1369](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4045-1369), contexte détaillé et capture consultés le 27 octobre 2026.
- Base : ENZ-64 `4c61c13`, incluant les décisions et l’API Resend d’[ENZ-63](qa-enz-63.md).
- Les coordonnées Figma correspondent aux données de `data/footer.ts` et `data/navigation.ts`, déjà confirmées sous ENZ-51/63. Les faits commerciaux proviennent de `data/programs.ts`, reconfirmés sous ENZ-64.
- Enzo a confirmé dans ce chat : « Oui, préparer uniquement comme prévu ». Resend reste donc non configuré ; aucune activation, aucun compte et aucun e-mail réel.

## Version simplifiée demandée par Enzo

Le 27 octobre 2026, Enzo a demandé de commencer directement par le contact, de ne garder que les canaux e-mail/téléphone à gauche, de reprendre le cadre de 8 px utilisé ailleurs sur le site et d’ajouter les avis/FAQ existants avant le footer. Cette demande remplace la composition initiale de la maquette.

Ordre final : section contact et formulaire → avis existants → FAQ existante → footer partagé. L’introduction, le fil d’Ariane, le panorama, l’adresse postale dans le bloc contact, le rappel du programme et le CTA de découverte du projet sont retirés de cette page. Le titre de la section contact devient le H1 unique. Les blocs « Nous écrire » / « Nous appeler » gardent leur icône, lien et description. L’adresse du footer partagé reste celle déjà validée.

Les composants `HomeTestimonials` et `HomeFaq` sont réutilisés avec les mêmes sources et interactions que sur l’accueil. Aucun nouvel avis ou texte de FAQ. Les avis de démonstration restent limités à Preview/développement par `getHomeTestimonials` ; aucun témoignage réel n’a été fourni.

## Formulaire et parcours

Le formulaire partagé d’ENZ-63 est centralisé sur `/contact`. Son enveloppe conserve le fond `#f1eeea`, avec 8 px de padding sur les quatre côtés et un formulaire intérieur blanc. Le padding intérieur de lecture reste de 32 px desktop / 24 px mobile. Ce traitement appartient au composant partagé : toutes ses utilisations le reprennent. Il s’agit du seul formulaire actuellement présent dans le dépôt.

Champs : prénom et nom requis, e-mail requis, téléphone facultatif, choix du logement (98 m², 103 m² ou à définir ensemble), message facultatif et accord de contact requis. Aucun champ supplémentaire. Les noms constitués uniquement d’espaces sont refusés côté client. Labels, autocomplete, fieldset/legend, radios natifs, focus visible et annonce de résultat sont conservés.

Les CTA de contact du header desktop/mobile, de l’accueil, du footer, des pages projet et de l’aperçu des composants conduisent à `/contact`. Les liens C’Premium ajoutent `projet=c-premium` ; les deux T4 transmettent aussi `logement=t4-98` ou `logement=t4-103` et ciblent `#demande-informations`. Une valeur de logement inconnue reste sur « À définir ensemble ». Cette page traite C’Premium uniquement. Les coordonnées e-mail et téléphone restent des liens directs vers leurs canaux.

La page projet conserve ses coordonnées et une invitation vers le formulaire centralisé. L’API `POST /api/project-contact` reste inchangée : validation serveur du projet/logement, consentement, origine, longueurs, champ piège, destinataire fixe, idempotence, délai et erreurs sans détail fournisseur. Les états loading/success/error sont conservés. Les valeurs survivent à une erreur ; une nouvelle tentative du même contenu réutilise sa clé ; le succès remet le formulaire à zéro.

## Vérifications

- Lint, `git diff --check`, 19 tests Node et build Preview : réussis.
- Recette Chromium sur 320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512 et 1920 px : absence de débordement, images, H1 unique, ordre des trois sections, deux canaux de contact, absence de redirection vers un projet dans le contenu principal, cadre de 8 px et fond intérieur blanc.
- Formulaire : champs, clavier/focus, radios, envoi désactivé, e-mail, téléphone, présélection des deux T4 et valeur inconnue.
- Avis et FAQ réutilisés : navigation clavier du carrousel et accordéon à une réponse ouverte.
- Captures à 375, 768 et 1512 px inspectées.
- La recette initiale couvrait également l’accueil et la page C’Premium sur ces onze largeurs, ainsi que les états d’envoi avec requêtes entièrement interceptées. La simplification ne modifie ni les données, ni la validation, ni la soumission. Aucun e-mail réel envoyé.

## Limites et activation ultérieure

Resend reste volontairement désactivé, comme confirmé par Enzo. Le bouton d’envoi l’est aussi et un avis explicite propose l’e-mail contextualisé C’Premium. L’activation future suit ENZ-63 : `RESEND_API_KEY` et `RESEND_FROM` dans Vercel Preview, puis redéploiement. La livraison réelle des messages n’est pas vérifiée.

Les pages légales restent à finaliser sous ENZ-77. Recette Chromium uniquement ; Safari, Firefox et appareils physiques non vérifiés. Avertissements préexistants non bloquants : métriques de fonte de secours Parkinsans et absence de `type: module` pour les tests TypeScript.

Pré-production : Vercel **Preview**, projet `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`. Branche `codex/enz-68-contact`, basée sur ENZ-64 ; aucune fusion dans `main`.

## Rejouer

Avec Playwright accessible via `NODE_PATH` si nécessaire :

```sh
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3112
node tests/contact-page-qa.mjs http://localhost:3112
```

`QA_SCREENSHOTS=/chemin/absolu` conserve les captures contact. Le test des états d’envoi (`tests/project-form-qa.mjs`) doit rester local, avec une configuration factice et ses requêtes interceptées ; ne pas déployer cette configuration.
