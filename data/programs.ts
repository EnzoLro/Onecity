/** Program content only: unknown values are omitted, never inferred. */
export type ProjectFact = {
  id: string;
  label: string;
  icon: "location" | "area" | "energy" | "document" | "price" | "key";
  condition?: "conditions-ptz" | "conditions-jeanbrun";
  marker?: string;
};

type ProjectImage = { src: string; alt: string };
export type ProjectConditionData = { id: NonNullable<ProjectFact["condition"]>; title: string; text: string };
export type Program = {
  slug: string;
  /** Existing public label; Breuil is provisional until its name is confirmed. */
  label: string;
  commercial: {
    status?: string;
    transaction?: string;
    commercializing?: boolean;
    facts: readonly ProjectFact[];
    conditions: readonly ProjectConditionData[];
  };
  editorial: {
    card?: { image: ProjectImage; factIds: readonly string[] };
    featured?: {
      introduction: string;
      image: ProjectImage & { width: number; height: number };
      cta: string;
    };
  };
};

// Supplied by Enzo; only whitespace and the distinct footnote markers are normalized.
const cPremiumConditions = [
  {
    id: "conditions-ptz",
    title: "* Prêt à taux zéro",
    text: "Le prêt à taux zéro (PTZ) permet d'acheter sa future résidence principale. Pour y avoir droit, il ne faut pas avoir été propriétaire de son domicile durant les 2 années précédant le prêt. Il existe toutefois des cas particuliers. Le plafond de ressources à respecter et le montant du PTZ accordé dépendent de la zone où se situe le futur logement. Le PTZ ne doit constituer qu'une partie du montant d'opération financière. Il est possible de le compléter avec un ou plusieurs autres prêts.",
  },
  {
    id: "conditions-jeanbrun",
    title: "** Dispositif Jeanbrun | statut du bailleur privé.",
    text: "Le dispositif Jeanbrun permet aux investisseurs de déduire fiscalement une partie du prix d’acquisition d’un logement loué nu, via un mécanisme d’amortissement. Celui-ci est calculé hors valeur du foncier, estimée forfaitairement à 20 % du prix d’acquisition net de frais. Le taux d’amortissement varie selon le niveau de loyer pratiqué : location intermédiaire, sociale ou très sociale. Le dispositif implique notamment un engagement de location, le respect de plafonds de loyers et de ressources du locataire. Vérifiez l’éligibilité du bien, votre situation fiscale et vos capacités de remboursement avant tout engagement. Sous réserve de signature de l’acte définitif et des textes en vigueur.",
  },
] as const;

/**
 * ENZ-54: C’Premium facts/conditions confirmed by Enzo on 21 October 2026.
 * ENZ-56 / Figma 4035:640: Central Avenue card content and the two card images.
 * ENZ-50 / Figma 4037:1290: existing navigation labels and slugs.
 * Breuil has no approved card content. No gallery or unused sales fields are added.
 */
export const programs: readonly Program[] = [
  {
    slug: "c-premium",
    label: "C’Premium",
    commercial: {
      status: "Commercialisation en cours",
      transaction: "Vente",
      commercializing: true,
      facts: [
        { id: "location", label: "Breuil-Bois-Robert (78)", icon: "location" },
        { id: "homes", label: "2 logements T4 | 98 m² & 103 m²", icon: "area" },
        { id: "energy", label: "DPE A", icon: "energy" },
        { id: "ptz", label: "Éligible Prêt à taux 0%", icon: "document", condition: "conditions-ptz", marker: "*" },
        { id: "jeanbrun", label: "Éligible Loi Jeanbrun", icon: "document", condition: "conditions-jeanbrun", marker: "**" },
        { id: "price", label: "À partir de 3 400 €/m²", icon: "price" },
      ],
      conditions: cPremiumConditions,
    },
    editorial: {
      card: {
        image: { src: "/brand/projects/c-premium.png", alt: "Maquette architecturale de C’Premium avec terrasses et jardins" },
        factIds: ["location", "homes", "energy", "price"],
      },
      featured: {
        introduction: "Deux logements pensés pour offrir plus de confort, de lumière et de qualité au quotidien.",
        image: {
          src: "/brand/c-premium/main-plan.png",
          width: 1200,
          height: 1117,
          alt: "Vue en plan du projet C’Premium avec logements, terrasses, jardins et stationnements",
        },
        cta: "Découvrir le projet",
      },
    },
  },
  {
    slug: "central-avenue",
    label: "Central Avenue",
    commercial: {
      status: "Projet réalisé",
      transaction: "Vente",
      commercializing: false,
      facts: [
        { id: "location", label: "Hardricourt · 78", icon: "location" },
        { id: "homes", label: "10 appartements T2 | 34 m² & 42 m²", icon: "area" },
        { id: "operation", label: "Rénovation / transformation", icon: "document" },
        { id: "delivery", label: "Livré en 2024", icon: "key" },
      ],
      conditions: [],
    },
    editorial: {
      card: {
        image: { src: "/brand/projects/central-avenue.png", alt: "Maquette architecturale de Central Avenue à Hardricourt" },
        factIds: ["location", "homes", "operation", "delivery"],
      },
    },
  },
  {
    slug: "breuil",
    label: "Breuil",
    commercial: { facts: [], conditions: [] },
    editorial: {},
  },
];

export function projectHref(slug: string) {
  return `/projets/${slug}`;
}

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export type FeaturedProgram = Program & { editorial: Program["editorial"] & { featured: NonNullable<Program["editorial"]["featured"]> } };

export function hasFeaturedContent(program: Program): program is FeaturedProgram {
  return program.editorial.featured !== undefined;
}

export const featuredProgram = programs.find(hasFeaturedContent);
