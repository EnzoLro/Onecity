# Primitives OneCity

Import depuis `@/components/ui`. L’aperçu interactif est disponible sur `/#primitives`.

```tsx
<Section aria-labelledby="projects-title">
  <Container>
    <Text as="h2" variant="heading" id="projects-title">Nos projets</Text>
    <Text variant="body-lg">Des logements pensés dans les moindres détails.</Text>
    <StyledLink href="/projets" variant="secondary">Découvrir nos projets</StyledLink>
  </Container>
</Section>

<Button type="submit" variant="primary">Envoyer</Button>
<Button variant="ghost" disabled>Indisponible</Button>
```

- `Container` : centré, largeur maximale 1 400 px, marges internes 24 px puis 60 px à partir de 1 024 px ; élément `div` par défaut, personnalisable avec `as`.
- `Section` : élément `section` par défaut. Espacements verticaux `compact` (52/80 px), `default` (80/120 px), `spacious` (120/160 px), mobile/desktop.
- `Text` : variantes `display`, `heading`, `subtitle`, `body-lg`, `body`. `as` définit la sémantique indépendamment du style ; `p` par défaut. Titres en Inter gras, capitales et approche −3 %, d’après la maquette principale.
- `Button` et `StyledLink` partagent leurs styles : `primary` (fond primaire, texte blanc), `secondary` (fond blanc, bordure et texte primaires), `ghost` (transparent), `inverse` (blanc sur fond primaire, comme le CTA Figma). Tailles `default` et `large`.
- `Button` utilise `type="button"` par défaut. Utiliser `type="submit"` dans un formulaire. Pour la navigation, utiliser `StyledLink` avec `href`.
- `disabled` désactive les boutons nativement ; les liens désactivés n’ont plus de destination, portent `aria-disabled` et sortent du parcours Tab. Les attributs HTML, événements et refs natifs sont transmis.
- Focus clavier visible, hover, état appuyé, opacité désactivée et respect de la réduction des animations. Les états hover/appuyé et ghost complètent les états normaux Figma ; ils utilisent la palette primaire existante.

Les classes de mise en page peuvent être ajoutées avec `className`. Les valeurs communes se trouvent dans `app/globals.css` ; éviter de répéter les styles des variantes dans les sections de page.
