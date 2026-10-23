# Primitives OneCity

Import depuis `@/components/ui`. L’aperçu interactif est disponible sur `/apercu-composants#primitives`.

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
- `Text` : rôles partagés définis dans `app/globals.css`. `as` définit la sémantique indépendamment du style ; `p` par défaut. Titres en Parkinsans semi-bold (600), tous les autres textes en Inter, conformément au choix d’Enzo pour ENZ-60. Aucune section ne redéfinit les familles, tailles ou graisses.
- `Button` et `StyledLink` partagent leurs styles : `primary` (fond primaire, texte blanc), `secondary` (fond blanc, bordure et texte primaires), `ghost` (transparent), `inverse` (blanc sur fond primaire, comme le CTA Figma). Tailles `default` et `large`.
- `Button` utilise `type="button"` par défaut. Utiliser `type="submit"` dans un formulaire. Pour la navigation, utiliser `StyledLink` avec `href`.
- `disabled` désactive les boutons nativement ; les liens désactivés n’ont plus de destination, portent `aria-disabled` et sortent du parcours Tab. Les attributs HTML, événements et refs natifs sont transmis.
- Focus clavier visible, hover, état appuyé, opacité désactivée et respect de la réduction des animations. Les états hover/appuyé et ghost complètent les états normaux Figma ; ils utilisent la palette primaire existante.

Les classes de mise en page peuvent être ajoutées avec `className`. Les valeurs communes se trouvent dans `app/globals.css` ; éviter de répéter les styles des variantes dans les sections de page.

## Composants interactifs — ENZ-52

Aperçu : `/apercu-composants#interactifs`. Sources Figma : FAQ `4035:801`, avis `4035:779`.

```tsx
<Accordion items={[{ id: "question", question: "Question validée", answer: <p>Réponse validée</p> }]} defaultOpenId="question" headingLevel={3} />
<Slider label="Avis clients" items={avis.map((avis) => ({ id: avis.id, content: <TestimonialCard {...avis} /> }))} />
```

- `Accordion` : `items` avec `id` stable et unique, `question`, `answer` (`ReactNode`). Zéro ou une réponse ouverte ; `defaultOpenId` définit l’état initial, sinon tout est fermé. `headingLevel` (2, 3 ou 4 ; 3 par défaut) adapte la hiérarchie. Tab pour naviguer, Entrée/Espace pour ouvrir et fermer. Chaque bouton expose `aria-expanded` et `aria-controls` ; les réponses fermées sont masquées et non accessibles au clavier (`aria-hidden`, `inert`). Aucun changement de couleur au survol. Ouverture et fermeture sur la hauteur naturelle en 280 ms ; l’icône « + » reste montée et tourne de 45° en 450 ms pour devenir une croix. Aucune animation si `prefers-reduced-motion: reduce`.
- `Slider` : `items` avec `id` stable et unique et `content` (`ReactNode`), `label` accessible obligatoire. Points cliquables, défilement tactile natif avec ancrage, flèches gauche/droite et Début/Fin lorsque la zone défilante a le focus. Les diapositives inactives sont `inert` et `aria-hidden` ; le changement est annoncé discrètement. Pas de lecture automatique ni de boucle. Transition glissée native lors des changements, instantanée si `prefers-reduced-motion: reduce`. Flèches précédent/suivant de 44 px aux extrémités, désactivées aux bornes ; points de 8 px espacés visuellement de 4 px au centre. Les flèches fournissent une alternative tactile large aux points rapprochés. Sur souris, les quarts gauche/droit de la carte affichent un curseur directionnel et permettent de changer de diapositive, sans intercepter liens, boutons ou sélection de texte. Les touches des contenus interactifs restent libres. Redimensionnement : la diapositive active reste alignée. Collection vide : rien ; une diapositive : commandes masquées. Pour remplacer entièrement une collection et réinitialiser son état, changer la `key` du composant.
- `TestimonialCard` : présentation serveur de l’avis (`quote`, `author`, `location`, `image: { src, alt }`). Image à gauche sur tablette/desktop, au-dessus sur mobile. L’image de la maquette est décorative (`alt=""`).
- Focus visible ; flèches tactiles de 44 px et points rapprochés selon Figma. Les fichiers Figma sont locaux dans `public/brand/interactive`. Aucun package ajouté.
- `data/faq.ts` centralise les six réponses exactes de la maquette, y compris les blocs `Answer` masqués, lus via l’API Figma. `data/interactive-preview.ts` les réexporte pour l’aperçu. L’utilisateur a confirmé que les avis sont fictifs pour le moment. L’unique avis fourni par Figma est répété sur trois diapositives, avec une mention explicite dans l’aperçu pour tester la navigation sans inventer d’autres avis. Pour l’intégration commerciale, fournir les données propres à chaque section.

## FAQ de l’accueil — ENZ-59

`HomeFaq` suit Figma `4035:792`, après les témoignages. Deux colonnes sur desktop, une colonne sous 1 024 px. La première réponse est ouverte initialement ; le composant partagé conserve zéro ou une réponse ouverte, y compris pour les six questions de la maquette (dont deux apparaissent ouvertes dans Figma).

Les identifiants, questions et réponses en texte simple de `data/faq.ts` sont réutilisables pour le SEO technique, sans dépendance à React. Aucun balisage JSON-LD n’est ajouté par ce ticket. Les textes sont ceux de Figma, sans ajout commercial ; leur validation éditoriale reste à obtenir avant publication en production. Vérifier notamment la mention de location dans l’introduction et la promesse de disponibilités sur toutes les pages programme, encore partiellement provisoires.

Les contrôles actifs (boutons, liens avec destination et disclosures) utilisent le curseur pointeur via les styles de base globaux. Les contrôles désactivés sont exclus et les curseurs spécifiques du slider sont conservés.

## Rôles typographiques partagés — ENZ-60

| Variante `Text` | Usage | Police / graisse | Taille desktop / mobile |
| --- | --- | --- | --- |
| `display` | Titre principal H1 | Parkinsans 600 | 44 / 32 px |
| `heading` | Titre de section H2 | Parkinsans 600 | 40 / 32 px |
| `heading-sm` | Titre intermédiaire | Parkinsans 600 | 32 px |
| `title` | Titre de carte / condition | Parkinsans 600 | 18 px |
| `title-sm` | Petit titre / question FAQ | Parkinsans 600 | 16 px |
| `caption-title` | Titre de colonne du footer | Parkinsans 600 | 14 px |
| `eyebrow` | Bandeau de section | Inter 400 | 14 px, capitales, approche 3 % |
| `body-lg` | Description de section | Inter 400 | 18 px |
| `body` | Texte courant / réponse / citation | Inter 400 | 16 px, interligne 1,6 |
| `small` / `subtitle` | Légende / texte secondaire | Inter 400 | 14 px, interligne 1,6 |
| `label` | Action / statut / caractéristique / auteur | Inter 600 | 16 px |

Le seuil mobile commun est 620 px. Les titres principaux et de section gardent les capitales ; les petits titres gardent leur casse éditoriale. La classe partagée `onecity-text-navigation` couvre les liens du header (Inter 16 px, 600 pour le lien courant). Les boutons et les composants interactifs consomment les mêmes rôles. Les couleurs, alignements et largeurs restent définis par la mise en page.

Les exemples de chaque rôle sont visibles dans `/apercu-composants#typographie`. Pour une modification de typographie, changer le rôle partagé ; ne pas ajouter une exception locale à une section.
