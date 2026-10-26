# ENZ-63 — Page projet C’Premium

## Sources et décisions

- [Ticket ENZ-63](https://linear.app/enzo-louro/issue/ENZ-63/cpremium-integrer-la-page-projet).
- [Figma 4036:1540](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4036-1540), contexte, sections et capture lus le 23 octobre 2026.
- Base ENZ-62 `fe385b9` ; faits commerciaux et conditions validés sous ENZ-54.
- Enzo a approuvé les textes et visuels Figma dans ce chat. Il a confirmé Resend comme service futur et `projets@onecityimmobilier.fr` comme destinataire. Il créera le compte et fournira la configuration plus tard ; seule la préparation est demandée maintenant.

## Implémentation

La page `/projets/c-premium` utilise un gabarit réutilisable et le registre `data/programs.ts`. Ordre : fil d’Ariane, identité et panorama, repères, présentation, deux logements, conception et performance, localisation, demande d’informations, CTA final. Header, footer, primitives et typographie partagés conservés selon les décisions ENZ-50 à ENZ-62.

Les deux boutons logement ouvrent `?logement=t4-98#demande-informations` ou `?logement=t4-103#demande-informations` et présélectionnent le radio correspondant. Les CTA de la page conduisent à la demande C’Premium. Le fil d’Ariane retourne à l’accueil ; un seul H1 et des H2/H3 structurent les sections.

Les deux images de détail utilisent `next/image`, des dimensions explicites, `sizes` et le chargement différé. Elles ouvrent une galerie native `<dialog>` : précédent/suivant, flèches clavier, Échap, focus contenu dans le dialogue et retour au déclencheur. Aucun diaporama automatique.

Les hashes SHA-256 des deux couches du panorama et du plan ont été comparés aux téléchargements Figma : fichiers existants strictement identiques, réutilisés. Le détail de conception (600 × 414) et les icônes Figma de 20 × 20 ont été ajoutés localement. Aucun lien temporaire Figma utilisé au rendu.

## Adaptations explicites de la maquette

- Parkinsans 600 pour les titres et Inter pour les textes, selon la décision typographique globale ENZ-60. Ajout du rôle partagé `statistic` Inter 600 / 24 px pour les repères.
- Conteneur commun de 1 400 px avec marges 60 px desktop / 24 px mobile, conservé y compris pour la localisation et le contact. Ces deux sections ont des marges plus larges dans la maquette brute.
- Repères sur deux colonnes, sections empilées et formulaire adapté sous les seuils existants. La maquette fournie est desktop ; les adaptations mobile/tablette sont vérifiées dans Chromium.
- Conditions détaillées ENZ-54 conservées dans les disclosures PTZ et Jeanbrun avec leurs marqueurs distincts `*` et `**`. Le rappel d’éligibilité Figma est également présent.
- Formulaire explicitement inactif tant que Resend n’est pas configuré, avec un lien e-mail contextualisé. Aucun faux message d’envoi.

## Resend : préparation et activation ultérieure

L’API `POST /api/project-contact` utilise l’[API REST officielle Resend](https://resend.com/docs/api-reference/emails/send-email), sans dépendance supplémentaire. Elle valide le projet commercialisé, le logement, le prénom, le nom, l’e-mail, les longueurs, le consentement et le champ piège. Elle limite le corps à 32 Kio, vérifie l’origine et fixe le destinataire côté serveur. Le contenu est envoyé en texte simple ; l’e-mail du visiteur est placé dans `reply_to`, jamais dans `from`. Un identifiant d’idempotence est réutilisé lors d’une nouvelle tentative du même contenu. Délai maximum de 10 secondes, messages d’erreur sans détail fournisseur ni secret. Aucune donnée personnelle journalisée par l’application, aucune base de données créée.

À configurer plus tard dans **Vercel → onecity → Settings → Environment Variables → Preview**, puis redéployer :

| Variable | Valeur attendue |
| --- | --- |
| `RESEND_API_KEY` | Clé privée Resend autorisée à envoyer depuis le domaine choisi |
| `RESEND_FROM` | Adresse d’expéditeur vérifiée dans Resend, éventuellement `One City Immobilier <adresse vérifiée>` |

Le destinataire confirmé est déjà fixé depuis les coordonnées existantes : `projets@onecityimmobilier.fr`. Aucune clé dans le dépôt ou le navigateur. Les champs restent testables sans clé ; le bouton d’envoi est désactivé et l’API renvoie 503. L’activation du bouton est calculée à la génération de la page : un redéploiement est nécessaire après configuration.

Avant activation publique, finaliser la politique de confidentialité prévue sous ENZ-77 et la limitation de débit du formulaire dans Vercel Firewall. Le champ piège et la vérification d’origine ne constituent pas une protection complète contre l’abus automatisé. Après configuration, effectuer un vrai envoi contrôlé et vérifier sa réception ; une acceptation par l’API ne prouve pas à elle seule la livraison en boîte de réception.

L’installation Marketplace Resend n’a pas été effectuée : la revue automatique l’a refusée car elle agit sur l’équipe Vercel et peut avoir des effets de facturation. Enzo a ensuite confirmé reporter la création du compte et demander uniquement la préparation. Aucune modification d’intégration ou facturation n’a été effectuée.

## Vérifications

- `npm run lint` : OK.
- `node --test tests/*.test.mjs` : 17 tests, tous passent (registre, absence d’avis fictifs en production, validation formulaire, absence de configuration, réponses Resend simulées, idempotence, absence de fuite de détail fournisseur).
- `VERCEL_ENV=preview npm run build -- --webpack` : compilation, TypeScript et génération statique OK ; API dynamique séparée. Build Vercel contrôlé après déploiement.
- `tests/project-page-qa.mjs` : 320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512, 1920 px. H1 unique, images, absence de débordement, galerie et retour du focus, conditions, CTA, formulaire inactif et présélection des deux T4 : OK. Console et ressources observées sans erreur.
- `tests/project-form-qa.mjs` sur un build local avec configuration factice, toutes les requêtes HTTP interceptées : champs requis, erreur avec conservation des valeurs, nouvelle tentative avec même identifiant, succès et remise à zéro : OK. Aucun e-mail réel envoyé.
- `tests/home-qa.mjs` : contrôles de régression de l’accueil sur les onze largeurs : OK.
- Captures locales à 375, 768 et 1512 px ; comparaison desktop à Figma et inspection mobile/tablette.

Recette réalisée dans Chromium. Safari, Firefox, appareils physiques et livraison réelle des e-mails ne sont pas revendiqués. Les limites éditoriales et légales préexistantes de `qa-enz-61.md` restent applicables. Les pages Central Avenue et Breuil gardent leur état antérieur.

## Relancer la recette

Avec Playwright disponible dans l’environnement Node :

```sh
VERCEL_ENV=preview npm run build -- --webpack
npx next start -p 3104
node tests/project-page-qa.mjs http://localhost:3104
node tests/home-qa.mjs http://localhost:3104
```

Pour tester les états d’envoi sans e-mail réel : construire localement avec une configuration **factice uniquement** (`RESEND_API_KEY` et `RESEND_FROM`), lancer ce build sur localhost puis `node tests/project-form-qa.mjs http://localhost:PORT`. Le script refuse les hôtes distants et intercepte toutes les requêtes de contact. Ne jamais déployer cette configuration factice. Refaire ensuite un build local sans ces variables de test.

## Complément du 26 octobre 2026 — prestations et carte interactive

Enzo a fourni et confirmé les prestations pour **chacun des deux T4**, dont un garage et une place de parking par logement. Un bloc commun après « Notre manière de concevoir » regroupe : double orientation, terrasse, espace vert privatif, résidence sécurisée, vidéophone connecté, garage/parking, pompe à chaleur réversible, ballon thermodynamique, individualisation de l’eau, volets roulants électriques connectés, intérieur optimisé et personnalisable, placards aménagés selon plan, salle d’eau carrelée avec meuble vasque et radiateur sèche-serviettes. Aucun plan supplémentaire, dimension, orientation cardinale ou type de compteur n’est déduit.

Les quatre temps d’accès viennent d’Enzo : gare SNCF de Mantes-la-Jolie environ 10 minutes en voiture, Express 78 et bus scolaire environ 2 minutes à pied, A13 environ 5 minutes en voiture. Ils restent indicatifs et ne sont pas présentés comme des itinéraires calculés.

### Carte et sources géographiques

Leaflet 1.9.4, importé à l’approche de la carte dans le viewport, affiche des points cliquables avec fiches, des contrôles de zoom, une vue quartier, une vue des accès et une vue du département 78 surligné. La molette ne zoome pas par défaut pour conserver le défilement de la page. Les mêmes fiches sont ouvrables par boutons et les marqueurs sont accessibles au clavier. Les textes de fiches sont injectés par `textContent`, sans HTML provenant des données.

Adresses fournies par Enzo :

- C’Premium : 15 route de Mantes, 78930 Breuil-Bois-Robert.
- Express 78 : 3 rue d’Arnouville, même commune. Enzo a confirmé « rue » après que le géocodeur a signalé la différence avec « route » dicté initialement.
- Bus scolaire : 3 place des Alliés, même commune.
- Gare SNCF de Mantes-la-Jolie : point SNCF UIC 87381509, place du 8 mai 1945.

Les trois adresses sont géocodées au numéro dans la commune INSEE 78104 par le [service officiel IGN / BAN](https://cartes.gouv.fr/aide/fr/guides-utilisateur/utiliser-les-services-de-la-geoplateforme/geocodage/). Les points bus représentent les adresses de repérage fournies, pas une vérification indépendante de la position des poteaux d’arrêt. Les coordonnées de gare proviennent du [référentiel SNCF](https://data.sncf.com/explore/dataset/liste-des-gares/), avec adresse contrôlée sur [Gares & Connexions](https://www.garesetconnexions.sncf/fr/gares-services/mantes-jolie). Aucun échangeur A13 arbitraire n’est placé sur la carte ; l’information de proximité est dans la liste.

Les contours généralisés IGN / Etalab sont conservés localement depuis le [jeu de données officiel](https://www.data.gouv.fr/datasets/contours-administratifs). `data/geography/c-premium.json` archive les sources, coordonnées et résultats de géocodage. `node scripts/generate-location-map.mjs` régénère le contour et l’illustration SVG de repli. Les points sont dans `data/c-premium-map-points.ts`. Aucun appel au géocodeur pendant la navigation.

Le fond provient des tuiles standard OpenStreetMap, avec attribution visible. Aucune clé requise ; disponibilité externe au mieux, sans garantie de service. Pas de géolocalisation de l’utilisateur ni de téléchargement en masse. Le chargement des tuiles transmet les informations normales de requête au fournisseur. Revoir cette dépendance et la documentation de confidentialité avant la publication finale du site.

### Vérifications du complément

- Lint, build avec Next.js 16.4.1 et 19 tests automatisés : OK.
- La recette responsive de page couvre aussi les quatre points, leurs fiches, le clavier, les trois vues, le contour 78 et les dimensions des tuiles. Les tuiles sont interceptées dans ces tests répétitifs pour ne pas solliciter OpenStreetMap à chaque format.
- Vérification séparée d’une vue réelle du quartier : tuiles chargées, dimensions 256 × 256, rendu inspecté. La classe racine ajoutée par Leaflet est conservée pendant les mises à jour React ; le confinement des tuiles et leur dimension sont vérifiés.
- Régression accueil sur les onze formats après mise à jour de Next.js : OK.
- Recette Chromium uniquement ; les temps de trajet ne sont pas recalculés.

L’ajout de Leaflet a déclenché un audit des dépendances. Il a révélé des vulnérabilités préexistantes dans Next.js 16.3.8. Next.js est passé à 16.4.1, version corrigée selon les avis [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) et [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r). L’audit après mise à jour indique zéro vulnérabilité signalée.

## Ajustement éditorial et carte épurée — 26 octobre 2026

À la demande d’Enzo, suppression de la section autonome « Les prestations ». Aucun contenu confirmé n’est supprimé : orientation, terrasse/espace vert privatif, garage/place de parking, résidence sécurisée et vidéophone sont présentés dans chacune des deux cartes T4 (`homes.features`). PAC réversible, ballon thermodynamique, volets connectés, intérieur personnalisable, placards selon plan, individualisation de l’eau et équipements de salle d’eau sont répartis dans les trois blocs existants de conception (`design.principles[].items`).

La carte ne présente plus de boutons de points d’intérêt, de texte d’instruction, de légende d’adresse, de paragraphe de sources ou de lien « Explorer les alentours ». Les quatre points restent cliquables et accessibles au clavier. Les crédits de source sont regroupés dans la petite attribution intégrée au fond de carte.

Les vues « Le quartier », « Les accès » et « Les Yvelines » forment des onglets avec sélection visible, `tablist`, `tab`, `tabpanel`, `aria-selected`, tabulation sur l’onglet actif et navigation par flèches gauche/droite, Début/Fin. Le panneau cartographique et ses points sont conservés lors des changements.

Le fond OpenStreetMap reste identique. Les styles CARTO Positron (clair), Voyager (coloré) et Dark Matter (sombre) ont été présentés comme possibilités, sans changement de fournisseur. Leur [offre actuelle](https://www.carto.com/basemaps/) requiert une clé ; aucun compte, abonnement ou service supplémentaire n’a été créé.

Validation : lint, build et 19 tests passent. La recette de page vérifie aussi la nouvelle répartition des contenus, l’absence des éléments supprimés, les quatre fiches après fermeture de la précédente, la sélection et le focus clavier des onglets sur onze largeurs de 320 à 1920 px. Captures mobile/desktop des logements, de la conception et de la carte inspectées. Tuiles interceptées pour les tests répétitifs ; fournisseur de fond inchangé.

## Fiches des accès détaillées — 26 octobre 2026

Les fiches des deux bus et de la gare présentent les destinations fournies par Enzo, avec une liste structurée et le temps d’accès indicatif. Les fiches longues défilent verticalement ; leur largeur s’adapte au cadre, y compris après redimensionnement.

Deux précisions issues des sources officielles sont intégrées : le [prolongement du RER E à Mantes-la-Jolie est prévu en 2027](https://www.manteslajolie.fr/information/fil-infos/le-rer-e-arrivera-a-mantes-la-jolie-le-28-fevrier-2027-une-attente-de-pres-de-40-ans-enfin-recompensee-2026-6963), et le bus express A14 porte désormais le [numéro 7820](https://presse.iledefrance-mobilites.fr/ile-de-france-mobilites-restructure-les-lignes-de-bus-desservant-le-territoire-du-mantois/?lang=fr). Le RER n’est donc pas présenté comme déjà disponible. Les trains directs vers Paris Saint-Lazare en environ 40 minutes sont distingués de la Ligne J ; les [horaires SNCF](https://www.sncf-connect.com/train/horaires/mantes-la-jolie/paris) varient selon le train.

Enzo a situé l’accès A13 près du Buffalo Grill et du rond-point adjacent. Le cinquième repère désigne **le rond-point Clé des Champs, approche de Mantes Est (échangeur 11)**, et non une bretelle d’autoroute. Le [restaurant officiel](https://www.buffalo-grill.fr/nos-restaurants/mantes-la-ville) est rue du 8 Mai 1945 à Mantes-la-Ville. Les segments du rond-point nommé et les nœuds de l’échangeur proviennent de l’[API OpenStreetMap](https://api.openstreetmap.org/api/0.6/map?bbox=1.70,48.97,1.73,48.985) ; les géométries et la méthode de calcul du repère sont archivées dans `data/geography/c-premium.json`. Le numéro 11 / Mantes Est est également indiqué par [Sanef](https://www.autoroutes.sanef.com/sites/default/files/2023-07/Tableau%20chantier%20chauss%C3%A9es%20A13%202023_version%20web_1.pdf).

Les directions Paris (56 km, environ 50 min) et Rouen (85 km, environ 50 min), ainsi que les temps depuis le programme, viennent d’Enzo. Ils sont explicitement indicatifs, sans calcul d’itinéraire ni garantie de temps réel. La vue « Les accès » inclut la gare et l’A13 ; « Le quartier » reste centrée sur le programme et les deux bus.

Validation : lint, build et 19 tests passent. La recette Chromium contrôle les destinations des cinq fiches, le cadrage mobile de la gare après son recentrage automatique, puis la navigation complète de la page sur onze largeurs de 320 à 1920 px. Les contrôles de zoom sont masqués pendant l’ouverture d’une fiche pour éviter leur superposition au titre ; ils réapparaissent à sa fermeture. Tuiles interceptées pendant ces tests répétitifs.
