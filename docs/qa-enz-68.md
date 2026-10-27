# ENZ-68 — Page contact C’Premium

## Sources et décisions

- [Ticket ENZ-68](https://linear.app/enzo-louro/issue/ENZ-68/contact-integrer-la-page-cpremium-et-le-formulaire-de-contact).
- [Figma 4045:1369](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4045-1369), contexte détaillé et capture consultés le 27 octobre 2026.
- Base : ENZ-64 `4c61c13`, incluant les décisions et l’API Resend d’[ENZ-63](qa-enz-63.md).
- Les coordonnées Figma correspondent aux données de `data/footer.ts` et `data/navigation.ts`, déjà confirmées sous ENZ-51/63. Les faits commerciaux proviennent de `data/programs.ts`, reconfirmés sous ENZ-64.
- Enzo a confirmé dans ce chat : « Oui, préparer uniquement comme prévu ». Resend reste donc non configuré ; aucune activation, aucun compte et aucun e-mail réel.

## Mise en place

`/contact` remplace la page provisoire : fil d’Ariane, introduction, panorama à deux couches, légende, coordonnées, formulaire C’Premium, rappel du programme et invitation à découvrir le projet. Les textes éditoriaux viennent de la maquette. Le programme, ses surfaces, son DPE, les visuels principaux et les coordonnées réutilisent les sources existantes.

Le formulaire d’ENZ-63 est centralisé sur cette page. Champs visibles : prénom et nom requis, e-mail requis, téléphone facultatif, choix du logement (98 m², 103 m² ou à définir ensemble), message facultatif et accord de contact requis. Aucun champ acquéreur supplémentaire. Les noms constitués uniquement d’espaces sont aussi refusés côté client. Labels, autocomplete, fieldset/legend, radios natifs, focus visible et annonce de résultat sont conservés.

Les CTA de contact du header desktop/mobile, de l’accueil, du footer, des pages projet et de l’aperçu des composants conduisent à `/contact`. Les liens C’Premium ajoutent `projet=c-premium` ; les deux T4 transmettent aussi `logement=t4-98` ou `logement=t4-103` et ciblent `#demande-informations`. Une valeur de logement inconnue reste sur « À définir ensemble ». Cette page traite C’Premium uniquement : le paramètre de projet ne permet pas de fabriquer un autre contexte. Les coordonnées e-mail et téléphone restent des liens directs vers leurs canaux respectifs.

La page projet conserve ses coordonnées et une invitation vers le formulaire centralisé. L’API `POST /api/project-contact` reste inchangée : validation serveur du projet/logement, consentement, origine, longueurs, champ piège, destinataire fixe, idempotence, délai et erreurs sans détail fournisseur. Les états loading/success/error du formulaire existant sont conservés. Les valeurs survivent à une erreur ; une nouvelle tentative du même contenu réutilise sa clé ; le succès remet le formulaire à zéro.

## Visuels et adaptations

Les SHA-256 du panorama, de la maquette détourée et du plan sont strictement identiques aux téléchargements de cette maquette : réutilisation des fichiers existants. Les trois icônes Figma de contact sont ajoutées dans `public/brand/contact/`, avec leurs dimensions originales 20 × 20. Aucun lien temporaire Figma au rendu.

Conservation des choix globaux validés : header/footer partagés, Parkinsans pour les titres et Inter pour les textes, conteneur de 1 400 px et marges 60 px desktop / 24 px mobile. Le bandeau final est celui du contact Figma, orienté vers la découverte du projet. Adaptation de la maquette desktop en sections empilées sur mobile/tablette. Le plan garde le recadrage 560/380 ; le panorama réutilise son composant à deux couches.

## Vérifications du 27 octobre 2026

- `npm run lint` et `git diff --check` : OK.
- `node --test tests/*.test.mjs` : 19 tests réussis, incluant la validation et les réponses Resend simulées.
- `VERCEL_ENV=preview npm run build` : compilation, TypeScript et génération statique réussis ; API dynamique.
- `tests/contact-page-qa.mjs` : 320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512 et 1920 px ; images décodées et visibles, absence de débordement, H1 unique, champs, clavier/focus, radios, formulaire désactivé, e-mail, téléphone, préselection des deux T4 et rejet d’une valeur inconnue.
- `tests/project-page-qa.mjs` : mêmes onze largeurs ; contrôles existants, galerie/carte/contenu, liens vers le contact et sélection effective des deux T4 après navigation.
- `tests/home-qa.mjs` : mêmes onze largeurs et interactions de l’accueil.
- `tests/project-form-qa.mjs` : build local avec configuration factice uniquement, requêtes intégralement interceptées, champs requis, état loading/aria-busy, erreur avec conservation des valeurs, idempotence et succès avec remise à zéro. Aucun e-mail réel. Build final reconstruit ensuite sans cette configuration factice.
- Captures contact à 375, 768 et 1512 px inspectées et comparaison desktop avec la capture Figma. Console et ressources surveillées sans erreur.

## Limites et activation ultérieure

Resend reste volontairement désactivé. Le bouton d’envoi l’est aussi et un avis explicite propose l’e-mail contextualisé C’Premium. L’activation future suit ENZ-63 : `RESEND_API_KEY` et `RESEND_FROM` dans Vercel Preview, puis redéploiement. La livraison réelle des messages n’est pas vérifiée.

Les pages légales restent à finaliser sous ENZ-77. La recette est réalisée dans Chromium ; Safari, Firefox et appareils physiques ne sont pas revendiqués. Avertissements préexistants non bloquants : métriques de fonte de secours Parkinsans et absence de `type: module` pour les tests TypeScript.

Pré-production : Vercel **Preview**, projet `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`. Branche dédiée `codex/enz-68-contact`, basée sur ENZ-64 ; aucune fusion dans `main`.

## Rejouer

Avec Playwright accessible via `NODE_PATH` si nécessaire :

```sh
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3108
node tests/contact-page-qa.mjs http://localhost:3108
node tests/project-page-qa.mjs http://localhost:3108
node tests/home-qa.mjs http://localhost:3108
```

`QA_SCREENSHOTS=/chemin/absolu` conserve les captures contact. Le test des états d’envoi doit rester local, avec une configuration factice et ses requêtes interceptées ; ne pas déployer cette configuration.
