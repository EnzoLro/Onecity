# Header global — ENZ-50

Source : [Figma 4037:1290](https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4037-1290&m=dev).

`SiteHeader` est monté dans le layout racine. Il réutilise le logo local, `Container`, `StyledLink` et les tokens existants. Les noms de projets et destinations sont centralisés dans `data/navigation.ts`.

Desktop à partir de 1 024 px : logo 177 × 40, conteneur 1 400 px avec marges internes 60 px, espacements 40 px, liens 16 px (ajustement demandé par Enzo), CTA compact. Le lien du projet courant est souligné et porte `aria-current="page"`. Sur l’accueil, aucun projet n’est sélectionné.

Mobile : disclosure natif `details`/`summary`, sans dépendance ; Enter/Espace ouvre le menu, Tab parcourt les liens, Échap ferme le menu et rend le focus au déclencheur. Un clic ferme le menu. La navigation reste dans le flux sans overlay ni piège de focus. Header non sticky, comportement validé par Enzo.

Les routes `/projets/c-premium`, `/projets/central-avenue`, `/projets/breuil` sont des structures initiales avec titre et contact seulement. Leurs présentations seront intégrées ticket par ticket à partir des maquettes déjà créées par Enzo, lors du travail sur les pages de détail. Le contact utilise l’e-mail déjà présent dans le site.
