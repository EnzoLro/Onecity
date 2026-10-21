/** Figma 4035:609; texts and visuals confirmed by Enzo on 21 October 2026. */
export const designApproach = {
  label: "Notre manière de concevoir",
  title: "Des projets pensés pour durer, conçus pour mieux vivre.",
  introduction: "Neuf, rénovation ou transformation : One City Immobilier conçoit chaque projet avec la même exigence de confort, de qualité et de performance.",
  statement: {
    introduction: "Chaque projet est unique.",
    title: "Notre exigence reste la même.",
  },
  cards: [
    {
      id: "materials",
      title: "Des matériaux choisis avec exigence",
      description: "Des choix durables et cohérents, pensés pour conjuguer qualité, esthétique et pérennité.",
      image: { src: "/brand/design-approach/materials.png", width: 600, height: 414, alt: "Coupe de matériaux de construction et d’isolation" },
    },
    {
      id: "comfort",
      title: "Performance & confort",
      description: "Isolation, équipements, lumière naturelle et maîtrise des consommations sont intégrés dès la conception.",
      image: { src: "/brand/design-approach/comfort.png", width: 1500, height: 1000, alt: "Vue d’un espace public arboré et de ses cheminements" },
    },
    {
      id: "transformation",
      title: "Neuf, rénovation, transformation",
      description: "Chaque projet s’adapte à son environnement et à l’existant pour créer un logement fonctionnel et durable.",
      image: { src: "/brand/design-approach/transformation.png", width: 600, height: 450, alt: "Perspective architecturale de logements avec terrasses et stationnements" },
    },
    {
      id: "spaces",
      title: "Des espaces pensés dans les usages",
      description: "Des volumes optimisés pour offrir plus de confort au quotidien, sans perdre de mètres carrés inutilement.",
      image: { src: "/brand/design-approach/spaces.png", width: 2070, height: 1381, alt: "Remise de clés à l’entrée d’un logement" },
    },
  ],
} as const;
