import { projects } from "@/data/navigation";

/** Figma 4035:543; commercial facts and conditions confirmed by Enzo on 21 October 2026. */
export type ProjectFact = {
  id: string;
  label: string;
  icon: "location" | "area" | "energy" | "document" | "price";
  condition?: "conditions-ptz" | "conditions-jeanbrun";
  marker?: string;
};

export const cPremium = {
  ...projects[0],
  status: "Commercialisation en cours",
  introduction: "Deux logements pensés pour offrir plus de confort, de lumière et de qualité au quotidien.",
  facts: [
    { id: "location", label: "Breuil-Bois-Robert (78)", icon: "location" },
    { id: "homes", label: "2 logements T4 | 98 m² & 103 m²", icon: "area" },
    { id: "energy", label: "DPE A", icon: "energy" },
    { id: "ptz", label: "Éligible Prêt à taux 0%", icon: "document", condition: "conditions-ptz", marker: "*" },
    { id: "jeanbrun", label: "Éligible Loi Jeanbrun", icon: "document", condition: "conditions-jeanbrun", marker: "**" },
    { id: "price", label: "À partir de 3 400 €/m²", icon: "price" },
  ] satisfies ProjectFact[],
  image: {
    src: "/brand/c-premium/main-plan.png",
    width: 1200,
    height: 1117,
    alt: "Vue en plan du projet C’Premium avec logements, terrasses, jardins et stationnements",
  },
  cta: "Découvrir le projet",
} as const;

// Supplied by Enzo; only whitespace and the distinct footnote markers are normalized.
export const cPremiumConditions = [
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
