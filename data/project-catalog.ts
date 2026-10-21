import { projects } from "@/data/navigation";
import { cPremium } from "@/data/c-premium";

export type ProjectCard = {
  slug: string;
  label: string;
  status: string;
  transaction: string;
  commercializing: boolean;
  detailHref?: string;
  image: { src: string; alt: string };
  facts: { id: string; label: string; icon: "location" | "area" | "energy" | "price" | "document" | "key" }[];
};

/** ENZ-56 / Figma 4035:640. Breuil awaits definitive content per the ticket. */
export const projectCatalog: ProjectCard[] = [
  {
    slug: cPremium.slug,
    label: cPremium.label,
    status: cPremium.status,
    transaction: "Vente",
    commercializing: true,
    detailHref: cPremium.href,
    image: { src: "/brand/projects/c-premium.png", alt: "Maquette architecturale de C’Premium avec terrasses et jardins" },
    // Reuse ENZ-54 confirmed facts; the compact card omits the eligibility disclosures.
    facts: cPremium.facts.filter(({ id }) => ["location", "homes", "energy", "price"].includes(id)),
  },
  {
    slug: projects[1].slug,
    label: projects[1].label,
    status: "Projet réalisé",
    transaction: "Vente",
    commercializing: false,
    // The existing route is a scaffold, so no discovery CTA until its detail is ready.
    image: { src: "/brand/projects/central-avenue.png", alt: "Maquette architecturale de Central Avenue à Hardricourt" },
    facts: [
      { id: "location", label: "Hardricourt · 78", icon: "location" },
      { id: "homes", label: "10 appartements T2 | 34 m² & 42 m²", icon: "area" },
      { id: "operation", label: "Rénovation / transformation", icon: "document" },
      { id: "delivery", label: "Livré en 2024", icon: "key" },
    ],
  },
];

export const projectsSection = {
  label: "Nos réalisations",
  title: ["Des projets différents,", "une même exigence."],
  introduction: "Neuf, rénovation ou transformation, chaque opération est pensée selon son environnement, ses usages et son potentiel.",
} as const;
