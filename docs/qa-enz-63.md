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
