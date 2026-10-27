# ENZ-77 — Pages légales et consentement

## État

Intégration technique de travail. Le contenu juridique n’est pas validé par One City et le ticket ne peut pas être considéré comme finalisé tant que les informations ci-dessous ne sont pas confirmées. Les pages portent un avertissement visible et restent `noindex`. Le formulaire reste désactivé, GA4 reste exclu de Preview. Aucune publication en production autorisée par cette recette.

## Sources consultées le 27 octobre 2026

- Ticket ENZ-77, aucun commentaire ; code et recettes ENZ-51/60/63/68/74/75/76.
- [Maquette mentions légales, 4058:1405](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4058-1405) et [confidentialité, 4059:1250](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4059-1250). Les deux sont des modèles à compléter, pas des textes approuvés.
- [Pappers fourni par Enzo](https://www.pappers.fr/entreprise/one-city-immobilier-440314540), lu dans le navigateur après échec de récupération web : SAS, capital 10 000 €, RCS Versailles, SIRET et TVA dans `data/legal-identity.ts`, président Carlos Louro. Le rôle de directeur de publication a ensuite été confirmé par Enzo. Aucune donnée personnelle sans utilité éditoriale reprise.
- [Site actuel fourni par Enzo](https://www.onecityimmobilier.fr/) : confirme adresse, téléphone et e-mail déjà présents dans le projet. L’ancien bureau de vente à Hardricourt n’est pas utilisé comme siège. Aucun ancien script, newsletter, prix ou texte commercial n’est importé.
- [Vercel](https://vercel.com/legal/privacy-notice) : raison sociale et adresse publiées. Entité contractuelle et téléphone non établis.
- [CNIL — information](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence), [droits](https://www.cnil.fr/fr/passer-laction/les-droits-des-personnes-sur-leurs-donnees), [réclamation](https://www.cnil.fr/fr/plaintes), [Google](https://policies.google.com/privacy?hl=fr), [OSMF](https://osmfoundation.org/wiki/Privacy_Policy). Ces références ne prouvent pas les pratiques internes de One City.

Les notes partagées Linear n’ont pas été accessibles (`Tool get_agent_context not found`).

## Mise en place

Composant serveur `LegalPage` : introduction, sommaire à ancres réelles, articles, listes de définitions, avertissement de validation et CTA vers C’Premium. Réutilisation des composants Container, Text et StyledLink, du header et du footer existants et de leurs assets locaux. Aucune nouvelle dépendance. Adaptation mobile : colonnes empilées et informations longues sécables.

Les choix typographiques globaux déjà confirmés sous ENZ-60 prévalent : titres Parkinsans semi-bold, textes Inter. Le header complet déjà validé remplace le logo isolé des maquettes. Les différences préexistantes du footer restent hors périmètre. Les contenus et la hauteur des documents varient avec les faits sourcés et les avertissements ; aucune fidélité pixel par pixel de texte provisoire n’est revendiquée.

Mentions légales : identité sourcée, coordonnées existantes, hébergement identifié, rubriques de publication, droits et responsabilité. Les inconnues sont visibles ; aucun numéro professionnel, assureur, garantie, clause contractuelle ou titulaire de droits n’est fabriqué.

Confidentialité : catégories du formulaire réellement codées, état désactivé de Resend, finalité consentie de GA4, exclusion des données saisies et paramètres libres, stockage local du choix six mois, cookies GA4 180 jours, retrait et limites. La conservation GA4 côté propriété n’est pas assimilée à celle des cookies et reste à vérifier.

Le fournisseur de tuiles OpenStreetMap est documenté : chargement à l’approche de la zone visible, requêtes techniques au tiers, aucune géolocalisation. Le consentement analytics ne prétend pas contrôler cette carte. Son mécanisme existant n’a pas été modifié ; sa base légale et les garanties applicables restent à confirmer.

Le bandeau contient désormais un lien direct vers la confidentialité One City et celui vers Google. La page de paramètres renvoie vers la rubrique cookies. Les choix Accepter/Refuser et les garanties réseau ENZ-76 sont conservés. Le formulaire garde son lien vers la confidentialité.

## Décisions confirmées dans le chat

Enzo a confirmé les identités exactes ONE CITY IMMOBILIER / Carlos Louro / Enzo Louro, les rôles d’éditeur et de responsable du traitement pour la société, de directeur de publication pour Carlos et de conception/gestion technique pour Enzo. L’adresse `projets@onecityimmobilier.fr` sert aussi à exercer les droits. Ces éléments sont intégrés dans les pages.

Les demandes sont traitées par Carlos Louro pour la société, par e-mail, uniquement pour répondre aux demandes, sans prospection. Le prestataire de messagerie et les autres accès éventuels ne sont pas identifiés.

Enzo précise qu’aucune purge à la clôture n’est prévue et envisage une suppression sur demande uniquement. Le code ne promet donc aucune suppression automatique et le texte n’adopte pas une conservation indéfinie : la durée maximale et les critères d’archivage restent à fixer par One City. Une règle de suppression dans la messagerie ne peut pas être automatisée par cette intégration. La possibilité de demander l’effacement est décrite sans promettre qu’elle s’applique sans exceptions.

L’absence de DPO et la cession des droits ont été exprimées avec des réserves : aucun « aucun DPO » ni aucune cession définitive n’est affirmé. La cession envisagée des créations d’Enzo et les droits des autres contenus restent à faire valider.

Concernant le directeur de publication, l’[article 93-2 de la loi du 29 juillet 1982](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033971722) désigne le représentant légal lorsque le service est fourni par une personne morale. Le rôle est distinct de la conception ou de la gestion technique. La [CNIL sur la conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees) demande de fixer la durée selon la finalité. Le [DPO](https://www.cnil.fr/fr/definition/delegue-la-protection-des-donnees-dpo) conseille et accompagne la conformité ; sa désignation est obligatoire dans certains cas, pas pour toute entreprise.

## Points restant à valider avant production

1. Durée maximale et critères de conservation des échanges et suivi ; règles de suppression et archivage dans la messagerie ; conservation des journaux et durée effective de la propriété GA4.
2. Base légale des demandes et du fonctionnement de la carte, prestataire de messagerie, accès éventuels et garanties contractuelles/transferts internationaux des services utilisés.
3. Désignation éventuelle d’un DPO. Aucune absence ou obligation propre à One City n’est déduite de la méconnaissance du terme.
4. Coordonnées contractuelles et téléphone de l’hébergeur. Le numéro de l’agent DMCA publié par Vercel n’est pas assimilé à un numéro général de l’hébergeur.
5. Applicabilité des mentions professionnelles (carte, assurance, garantie), périmètre de cession, titulaires et crédits des contenus, conditions relatives aux documents contractuels et à l’usage du site.
6. Validation finale de l’ensemble par One City, exigée par ENZ-77.

Ces limites sont visibles sur les pages de travail. La Preview sert à la recette et à la validation des textes ; elle ne permet pas de revendiquer une conformité juridique complète ni de clôturer le ticket.

## Recette reproductible

```sh
npm run lint
node --test tests/*.test.mjs
VERCEL_ENV=preview npm run build -- --webpack
node node_modules/next/dist/bin/next start -p 3117
node tests/legal-pages-qa.mjs http://localhost:3117
node tests/analytics-qa.mjs http://localhost:3117 preview
node tests/seo-qa.mjs http://localhost:3117 preview https://www.onecityimmobilier.fr
node tests/structured-data-qa.mjs http://localhost:3117
```

Les scripts navigateur utilisent Playwright du runtime de recette via `NODE_PATH`. Le scénario ENZ-77 contrôle les pages à 320, 375, 768 et 1512 px, les ancres, les trois liens du footer, l’état de validation visible et le parcours confidentialité → réglages → acceptation → confidentialité, sans requête Google. Captures éventuelles via `QA_SCREENSHOTS`.

## Résultats obtenus

- Lint, TypeScript et build Webpack Preview réussis.
- Les 33 tests Node existants passent.
- Recette navigateur ENZ-77 réussie aux quatre largeurs : pas de débordement horizontal, sommaires et retour au sommaire opérationnels, liens du footer présents, réglages accessibles et aucune requête Google.
- Recette navigateur ENZ-76 Preview rejouée avec succès : choix mémorisés, valeurs invalides/expirées refusées, GA4 exclu et aucune erreur JavaScript.
- Recettes HTTP SEO et JSON-LD réussies sur neuf pages.
- Captures desktop et mobile inspectées ; la structure reprend les maquettes avec les exceptions de typographie/header déjà décidées dans le projet. Le document de confidentialité est plus long avec les descriptions techniques réelles.
- Les contrôles ont été effectués sur le build local puis sur la Preview Vercel ci-dessous. La validation juridique et les réponses aux points manquants restent nécessaires avant de déclarer ENZ-77 terminé.

Branche de travail : `codex/enz-77-legal`, basée sur le travail livré d’ENZ-76. Aucune fusion dans `main`, aucun changement de configuration GA4/Resend ni déploiement en production.

## Livraison en pré-production de recette

Projet Vercel `onecity`, équipe `team_sM8AwN8VRDfmEBgCGypTu1sk`, cible Preview. Commit applicatif `160d7bbf758ca00a91c060f4c51bc53e47d62b5b`, déploiement `dpl_9ts6k2Zy64WVDjU76GK9GuGDVbfm`, statut `READY`, build Vercel terminé en 17 secondes.

[Preview testée](https://onecity-ht8ii33ga-enzos-projects-9848f4b8.vercel.app) · [Mentions légales](https://onecity-ht8ii33ga-enzos-projects-9848f4b8.vercel.app/mentions-legales) · [Confidentialité](https://onecity-ht8ii33ga-enzos-projects-9848f4b8.vercel.app/politique-de-confidentialite) · [Alias de branche](https://onecity-git-codex-enz-77-legal-enzos-projects-9848f4b8.vercel.app)

Recettes distantes ENZ-77, analytics Preview, SEO et JSON-LD réussies. Aucun appel Google, aucune erreur JavaScript et pas de débordement horizontal aux quatre largeurs. Une première exécution ENZ-77 a cliqué sur les réglages encore rendus côté serveur, avant l’affichage du choix mémorisé ; le test attend désormais le statut client « refusée », comme le scénario ENZ-76 existant. La réexécution complète réussit. Aucun comportement applicatif n’a été changé pour contourner le test.

ENZ-77 reste **In Progress** pour la validation des contenus. Le déploiement sert à la recette des pages de travail, pas à affirmer leur conformité juridique complète. Le formulaire reste désactivé et la Preview reste désindexée.
