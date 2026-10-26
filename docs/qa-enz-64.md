# ENZ-64 — Recette C’Premium

Recette du 26 octobre 2026, sur la base ENZ-63 `9c8aced`. [Ticket Linear](https://linear.app/enzo-louro/issue/ENZ-64/cpremium-qa-responsive-et-contenu-de-la-page-projet).

## Sources et validation commerciale

L’implémentation et les décisions existantes sont documentées dans [ENZ-63](qa-enz-63.md) et le [registre des programmes](programs.md). Enzo a reconfirmé dans le chat ENZ-64 que les informations commerciales validées sous ENZ-54/63 restent à jour : deux T4 de 98 et 103 m², prix à partir de 3 400 €/m² et autres informations déjà approuvées. Cette confirmation vient du propriétaire du contenu ; la recette technique ne constitue pas une nouvelle expertise commerciale ou juridique.

Aucun contenu commercial, visuel ou équipement ajouté. Le registre `data/programs.ts` reste la source partagée entre accueil et détail. Les conditions PTZ et Jeanbrun approuvées restent accessibles avec leurs marqueurs distincts. Les sources géographiques et les limites des temps d’accès restent celles d’ENZ-63.

## Contrôles

| Périmètre | Résultat |
| --- | --- |
| Responsive | 320, 375, 390, 619, 620, 768, 1023, 1024, 1200, 1512 et 1920 px ; hauteur 667 px pour 320/375, 844 px pour 390, 1000 px pour les autres |
| Images et ratios | Images locales décodées ; panorama et recadrages des deux vignettes conservés ; galerie en `object-fit: contain`, image complète consultable |
| Galerie | Deux déclencheurs, précédent/suivant, limites désactivées, flèches, fermeture par bouton et Échap, retour du focus au bon déclencheur ; aucun contrôle de page sous le dialogue dans la séquence de tabulation |
| Contenu | Comparaison du rendu accueil/détail avec les faits partagés ; repères et prix cohérents ; aucun Orimaj, Lorem ipsum ou contenu à venir dans le contenu principal C’Premium |
| Structure | H1 unique, titres nommés sans saut de niveau ; fil d’Ariane vers l’accueil et page courante identifiée |
| Contact | Tous les CTA internes atteignent le formulaire ; les deux boutons T4 présélectionnent le bon logement ; coordonnées et lien e-mail contextualisé présents |
| Carte | Cinq repères, fiches, onglets au clavier, contour 78 et cadrage mobile ; tuiles interceptées dans la recette répétitive pour ménager le service public OSM |
| Régression accueil | Onze largeurs, menu mobile, images, routes, interactions et console |
| Qualité | `npm run lint`, `node --test tests/*.test.mjs` (19 tests), `VERCEL_ENV=preview npm run build` ; TypeScript et génération des pages réussis |

Les captures mobile, tablette et desktop ont été inspectées, dont les logements, le panorama, la conception et le contact. Aucun défaut bloquant constaté. Aucun changement du code produit n’a été nécessaire : ENZ-64 renforce la recette existante dans `tests/project-page-qa.mjs` et consigne les résultats.

Le build signale un avertissement non bloquant : Next.js ne trouve pas de métriques de police de secours pour Parkinsans. Les fontes chargent dans Chromium. Les tests Node signalent aussi l’absence de `type: module` pour les imports TypeScript ; les 19 tests passent.

## Périmètre et limites

- Recette automatisée et inspection visuelle dans Chromium uniquement ; Safari, Firefox et appareils physiques non vérifiés.
- Resend reste volontairement non configuré selon ENZ-63. L’envoi est désactivé, la page l’explique et propose l’e-mail. Aucun message réel envoyé. Les validations serveur et le comportement sans configuration sont couverts par les tests existants.
- Les pages légales et la politique de confidentialité relèvent des tickets existants, dont ENZ-77 ; leur finalisation reste nécessaire avant l’activation publique du formulaire. Central Avenue et Breuil restent dans leur état prévu par ENZ-62/63.
- La recette répétitive utilise des tuiles OSM simulées ; elle ne certifie pas la disponibilité du fournisseur. La vérification du fond réel réalisée sous ENZ-63 reste documentée dans son rapport.
- Pré-production = environnement Vercel Preview du projet `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`. La branche `main` est réservée à la production.

## Rejouer

Playwright doit être disponible dans l’environnement Node (`NODE_PATH` si nécessaire). Construire puis servir le build :

```sh
VERCEL_ENV=preview npm run build
node node_modules/next/dist/bin/next start -p 3104
node tests/project-page-qa.mjs http://localhost:3104
node tests/home-qa.mjs http://localhost:3104
```

`QA_SCREENSHOTS=/chemin/absolu` conserve les captures à 375, 768 et 1512 px. Le même script de page peut être exécuté contre l’URL Vercel Preview, sans soumettre le formulaire ni envoyer d’e-mail.
