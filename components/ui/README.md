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

## Composants interactifs — ENZ-52

Aperçu : `/#interactifs`. Sources Figma : FAQ `4035:801`, avis `4035:779`.

```tsx
<Accordion items={[{ id: "question", question: "Question validée", answer: <p>Réponse validée</p> }]} defaultOpenId="question" headingLevel={3} />
<Slider label="Avis clients" items={avis.map((avis) => ({ id: avis.id, content: <TestimonialCard {...avis} /> }))} />
```

- `Accordion` : `items` avec `id` stable et unique, `question`, `answer` (`ReactNode`). Zéro ou une réponse ouverte ; `defaultOpenId` définit l’état initial, sinon tout est fermé. `headingLevel` (2, 3 ou 4 ; 3 par défaut) adapte la hiérarchie. Tab pour naviguer, Entrée/Espace pour ouvrir et fermer. Chaque bouton expose `aria-expanded` et `aria-controls` ; les réponses fermées sont masquées et non accessibles au clavier.
- `Slider` : `items` avec `id` stable et unique et `content` (`ReactNode`), `label` accessible obligatoire. Points cliquables, défilement tactile natif avec ancrage, flèches gauche/droite et Début/Fin lorsque la zone défilante a le focus. Les diapositives inactives sont `inert` et `aria-hidden` ; le changement est annoncé discrètement. Pas de lecture automatique ni de boucle. Transition glissée native lors des changements, instantanée si `prefers-reduced-motion: reduce`. Flèches précédent/suivant de 44 px aux extrémités, désactivées aux bornes ; points de 8 px espacés visuellement de 4 px au centre. Les flèches fournissent une alternative tactile large aux points rapprochés. Sur souris, les quarts gauche/droit de la carte affichent un curseur directionnel et permettent de changer de diapositive, sans intercepter liens, boutons ou sélection de texte. Les touches des contenus interactifs restent libres. Redimensionnement : la diapositive active reste alignée. Collection vide : rien ; une diapositive : commandes masquées. Pour remplacer entièrement une collection et réinitialiser son état, changer la `key` du composant.
- `TestimonialCard` : présentation serveur de l’avis (`quote`, `author`, `location`, `image: { src, alt }`). Image à gauche sur tablette/desktop, au-dessus sur mobile. L’image de la maquette est décorative (`alt=""`).
- Focus visible ; flèches tactiles de 44 px et points rapprochés selon Figma. Les fichiers Figma sont locaux dans `public/brand/interactive`. Aucun package ajouté.
- `data/interactive-preview.ts` contient les six réponses exactes de la maquette, y compris les blocs `Answer` masqués, lus via l’API Figma. L’utilisateur a confirmé que les avis sont fictifs pour le moment. L’unique avis fourni par Figma est répété sur trois diapositives, avec une mention explicite dans l’aperçu pour tester la navigation sans inventer d’autres avis. Pour l’intégration commerciale, fournir les données propres à chaque section.
