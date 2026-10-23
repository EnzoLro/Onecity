# ENZ-61 — Recette de l’accueil

Recette effectuée le 23 octobre 2026 sur la base ENZ-60 `ccfc136`.

## Sources et décisions conservées

- [Ticket ENZ-61](https://linear.app/enzo-louro/issue/ENZ-61/accueil-qa-responsive-et-assemblage-final).
- [Maquette actuelle, Home 4035:525](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4035-525), consultée par le connecteur Figma le 23 octobre.
- Décisions validées dans `components/layout/README.md` : header complet, conteneur commun, Parkinsans semi-bold / Inter, adaptation mobile, deux cartes projets publiables, destinations contact existantes et démonstration des avis en Preview uniquement.

Les différences avec la maquette brute correspondant à ces décisions sont conservées. Aucun nouveau texte commercial, avis, projet ou contenu juridique n’est ajouté.

## Résultat et modifications

L’ordre est correct : Hero → C’Premium → Notre manière de concevoir → Nos projets → Témoignages (Preview) → FAQ → CTA final → Footer.

Aucun défaut bloquant de l’accueil reproduit dans Chromium. Aucun contenu Orimaj ou Waitity détecté dans l’application. Le README portait encore le nom Waitity : remplacé par One City Immobilier. Les métadonnées techniques génériques sont remplacées par le nom du site et la description exacte déjà publiée dans le héros.

Un script de recette navigateur est ajouté dans `tests/home-qa.mjs`. Il couvre les onze largeurs, le chargement des images visibles après défilement, le contenu et l’ordre des sections, le menu mobile, l’absence de débordement, les routes internes, l’ancre projets, les conditions dépliables, la FAQ, le carrousel au clavier, le focus et l’arrivée du CTA final sur Contact. Il échoue sur les erreurs console JavaScript et réponses HTTP en erreur observées. Les diapositives inactives restent différées et inertes ; le script attend les images visibles.

## Vérifications

| Contrôle | Résultat local |
| --- | --- |
| Largeurs 320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920 px | OK |
| Ordre, H1 unique, header et footer | OK |
| Aucun défilement horizontal, y compris menu ouvert | OK |
| Images visibles chargées, ratios et composition inspectés | OK |
| Mosaïque sans texte coupé et typographie commune | OK |
| Menu mobile : Entrée, Tab, Échap et retour du focus | OK |
| FAQ : ouverture, fermeture, un panneau ouvert | OK |
| Conditions : activation clavier et Échap | OK |
| Carrousel : Début/Fin, bornes désactivées, réduction des mouvements | OK |
| Focus visible et hover du CTA final | OK |
| Ancre projets et activation du CTA vers `/contact` | OK |
| Routes projets, Contact, pages légales et aperçu composants | HTTP 200 |
| Console navigateur et ressources observées | Aucune erreur |
| `npm run lint` | OK |
| `node --test tests/testimonials.test.mjs` | 7 tests passent |
| `VERCEL_ENV=preview npm run build -- --webpack` | OK, TypeScript et génération des 11 pages |

`npm run build` avec Turbopack a été interrompu après être resté bloqué localement sans diagnostic. La compilation Webpack passe ; le build Vercel est vérifié séparément. Un ancien serveur local a également retenu une requête WebP Central Avenue ; un serveur neuf et la réponse WebP directe ont confirmé le chargement correct, sans modification de l’asset ou du composant.

Captures de recette locale prises à 375, 768 et 1512 px. Comparaison visuelle desktop à la maquette et inspection mobile/tablette. Ces contrôles portent sur Chromium ; aucune validation Safari, Firefox ou appareil physique n’est revendiquée.

## Relancer la recette

Construire un environnement Preview, puis lancer le serveur :

```sh
VERCEL_ENV=preview npm run build -- --webpack
npx next start -p 3101
```

Avec Playwright et Chromium disponibles dans l’environnement Node :

```sh
node tests/home-qa.mjs http://localhost:3101
```

Le script accepte aussi une URL Preview distante. `NODE_PATH` peut pointer vers l’installation Playwright fournie par l’environnement ; aucune dépendance de production n’est ajoutée. `QA_SCREENSHOTS` permet de choisir le dossier des captures.

## Limites de contenu connues

- Contact : page provisoire et e-mail existant ; aucun formulaire créé.
- Central Avenue et Breuil : pages structurées en attente de leur intégration complète ; Breuil absent des cartes de l’accueil selon ENZ-56.
- Mentions légales, confidentialité et paramètres cookies : contenus à venir, pages `noindex`, prévus sous ENZ-77.
- Avis : trois répétitions fictives de la maquette en Preview selon la décision ENZ-58 ; aucun avis réel fourni. Les tests confirment leur exclusion en production. Ne pas promouvoir ce build Preview en production ; reconstruire pour la cible production.
- Liens externes, `mailto:` et `tel:` : destinations et attributs vérifiés, sans envoi de message ni appel. L’accessibilité de comptes sociaux tiers n’est pas garantie par la recette.

Ces limites préexistantes n’empêchent pas la review de l’accueil en pré-production. Elles restent nécessaires à traiter avant une livraison complète du site.
