import type { AccordionItem, TestimonialCardProps } from "@/components/ui";

// Source: Figma 4035:801. Only the first answer is supplied by the design.
export const previewFaq: readonly AccordionItem[] = [
  {
    id: "types-programmes",
    question: "Quels types de programmes immobiliers propose One City Immobilier ?",
    answer: "One City Immobilier développe des programmes résidentiels à taille humaine, aussi bien en construction neuve qu’à partir de bâtiments existants. Selon les opportunités, nos projets peuvent intégrer de la rénovation, de la transformation ou des extensions afin de créer des logements confortables, performants et adaptés aux usages actuels.",
  },
  ...[
    ["localisation", "Où sont situés les programmes immobiliers One City ?"],
    ["disponibilites", "Quels logements sont actuellement disponibles à la vente dans les Yvelines ?"],
    ["logements-neufs", "One City propose-t-il uniquement des logements neufs ?"],
    ["usage", "Peut-on acheter un logement One City pour une résidence principale ou un investissement locatif ?"],
    ["nouveaux-programmes", "Comment être informé des nouveaux programmes immobiliers One City ?"],
  ].map(([id, question]) => ({ id, question, answer: "Réponse non fournie dans la maquette — contenu à valider avant publication." })),
];

// Source: Figma 4035:780. This is design content, not a verified customer endorsement.
export const previewTestimonial: TestimonialCardProps = {
  quote: "« On remarque vite que les choix ont été faits pour le confort au quotidien. L’agencement est pratique, les volumes sont agréables et le logement est très confortable, notamment sur le plan thermique. »",
  author: "Sophie Lambert",
  location: "Breuil-Bois-Robert",
  image: { src: "/brand/interactive/testimonial-interior.png", alt: "" },
};
