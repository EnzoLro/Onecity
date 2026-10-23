/** Program content only: unknown values are omitted, never inferred. */
export type ProjectFact = {
  id: string;
  label: string;
  icon: "location" | "area" | "energy" | "document" | "price" | "key";
  condition?: "conditions-ptz" | "conditions-jeanbrun";
  marker?: string;
};

type ProjectImage = { src: string; alt: string };
export type ProjectDetail = {
  hero: { background: ProjectImage & { width: number; height: number }; cutout: ProjectImage & { width: number; height: number } };
  highlights: readonly { label: string; value: string }[];
  overview: { label: string; title: string; paragraphs: readonly string[]; image: ProjectImage & { width: number; height: number } };
  homes: { label: string; title: string; note: string; action: string; items: readonly { id: string; type: string; area: number; rooms: string }[] };
  design: { label: string; title: string; image: ProjectImage & { width: number; height: number }; energyNote: string; principles: readonly { title: string; text: string }[] };
  location: { label: string; title: string; description: string; note: string; action: string; department: string; territory: string };
  eligibilityNote: string;
  contact: { label: string; title: string; introduction: string };
};
export type ProjectConditionData = { id: NonNullable<ProjectFact["condition"]>; title: string; text: string };
export type Program = {
  slug: string;
  /** Existing public label; Breuil is provisional until its name is confirmed. */
  label: string;
  commercial: {
    price?: { prefix: string; amount: string };
    status?: string;
    transaction?: string;
    commercializing?: boolean;
    facts: readonly ProjectFact[];
    conditions: readonly ProjectConditionData[];
  };
  editorial: {
    detail?: ProjectDetail;
    card?: { image: ProjectImage; factIds: readonly string[] };
    featured?: {
      introduction: string;
      image: ProjectImage & { width: number; height: number };
      cta: string;
    };
  };
};

// ENZ-63: structured values match the commercial facts approved under ENZ-54.
const cPremiumHomes = [
  { id: "t4-98", type: "T4", area: 98, rooms: "4 pièces" },
  { id: "t4-103", type: "T4", area: 103, rooms: "4 pièces" },
] as const;
const cPremiumHomeSummary = "2 logements T4";
const cPremiumAreas = cPremiumHomes.map(({ area }) => `${area} m²`).join(" & ");
const cPremiumEnergy = "DPE A";
const cPremiumPrice = { prefix: "À partir de", amount: "3 400 €/m²" };
const cPremiumPriceLabel = `${cPremiumPrice.prefix} ${cPremiumPrice.amount}`;

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
 * ENZ-63 / Figma 4036:1540: detail copy and assets approved by Enzo.
 * Breuil has no approved card content.
 */
export const programs: readonly Program[] = [
  {
    slug: "c-premium",
    label: "C’Premium",
    commercial: {
      price: cPremiumPrice,
      status: "Commercialisation en cours",
      transaction: "Vente",
      commercializing: true,
      facts: [
        { id: "location", label: "Breuil-Bois-Robert (78)", icon: "location" },
        { id: "homes", label: `${cPremiumHomeSummary} | ${cPremiumAreas}`, icon: "area" },
        { id: "energy", label: cPremiumEnergy, icon: "energy" },
        { id: "ptz", label: "Éligible Prêt à taux 0%", icon: "document", condition: "conditions-ptz", marker: "*" },
        { id: "jeanbrun", label: "Éligible Loi Jeanbrun", icon: "document", condition: "conditions-jeanbrun", marker: "**" },
        { id: "price", label: cPremiumPriceLabel, icon: "price" },
      ],
      conditions: cPremiumConditions,
    },
    editorial: {
      // Exact copy and assets from Figma 4036:1540, approved by Enzo for ENZ-63.
      detail: {
        hero: {
          background: { src: "/brand/hero/architectural-model-background.png", width: 3642, height: 896, alt: "Maquette architecturale d’une maison avec jardin sur une table de travail" },
          cutout: { src: "/brand/hero/architectural-model-cutout.png", width: 1200, height: 896, alt: "" },
        },
        highlights: [
          { label: "Le programme", value: cPremiumHomeSummary },
          { label: "Les surfaces", value: cPremiumAreas },
          { label: "La performance", value: cPremiumEnergy },
          { label: "Le prix", value: cPremiumPriceLabel },
        ],
        overview: {
          label: "Le projet", title: "À taille humaine. Pensé dans les détails.",
          paragraphs: ["Avec ses deux logements T4, C’Premium traduit l’approche de One City Immobilier : concevoir des lieux de vie où confort, qualité et performance se répondent.", "De la conception aux finitions, chaque choix s’inscrit dans une même exigence : mieux vivre au quotidien."],
          image: { src: "/brand/c-premium/main-plan.png", width: 1200, height: 1117, alt: "Vue en plan de la maquette C’Premium, avec les logements et leurs extérieurs" },
        },
        homes: { label: "Les logements", title: "Deux T4, votre prochain chez-vous.", note: "Échangeons sur ce logement et les informations détaillées du projet.", action: "Me renseigner sur ce T4", items: cPremiumHomes },
        design: {
          label: "Notre manière de concevoir", title: "Bien vivre aujourd’hui. Penser à demain.",
          image: { src: "/brand/c-premium/conception-detail.png", width: 600, height: 414, alt: "Détail de la maquette architecturale et de ses espaces lumineux" },
          energyNote: "La performance énergétique au cœur de C’Premium.",
          principles: [
            { title: "Confort & lumière", text: "Lumière naturelle, isolation et équipements sont intégrés dès la conception pour penser le confort au quotidien." },
            { title: "Des usages bien pensés", text: "Des volumes optimisés pour offrir plus de confort, sans perdre de mètres carrés inutilement." },
            { title: "Une qualité durable", text: "Des matériaux choisis avec exigence pour conjuguer qualité, esthétique et pérennité." },
          ],
        },
        location: {
          label: "L’adresse du projet", title: "Breuil-Bois-Robert",
          description: "C’Premium prend place à Breuil-Bois-Robert, dans les Yvelines. Un projet à taille humaine, ancré dans le territoire de One City Immobilier.",
          note: "Pour connaître son implantation et découvrir le projet en détail, échangez avec notre équipe.",
          action: "Parlons de C’Premium", department: "78", territory: "Les Yvelines",
        },
        eligibilityNote: "Éligibilité sous réserve des conditions applicables au dispositif et de votre situation. Notre équipe vous accompagne pour étudier votre projet ; le bénéfice de ces dispositifs n’est pas garanti.",
        contact: { label: "Votre futur logement", title: "Et si votre prochain chez-vous était ici ?", introduction: "Recevez les informations sur C’Premium et échangez avec nous pour trouver le logement qui vous correspond." },
      },
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

export type DetailProgram = FeaturedProgram & { editorial: FeaturedProgram["editorial"] & { detail: ProjectDetail } };

export function hasDetailContent(program: Program): program is DetailProgram {
  return hasFeaturedContent(program) && program.editorial.detail !== undefined;
}
