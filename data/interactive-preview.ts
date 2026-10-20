import type { AccordionItem, TestimonialCardProps } from "@/components/ui";

// Source: Figma 4035:801, including the hidden Answer layers 4035:814–4035:843.
export const previewFaq: readonly AccordionItem[] = [
  {
    id: "types-programmes",
    question: "Quels types de programmes immobiliers propose One City Immobilier ?",
    answer: "One City Immobilier développe des programmes résidentiels à taille humaine, aussi bien en construction neuve qu’à partir de bâtiments existants. Selon les opportunités, nos projets peuvent intégrer de la rénovation, de la transformation ou des extensions afin de créer des logements confortables, performants et adaptés aux usages actuels.",
  },
  ...[
    ["localisation", "Où sont situés les programmes immobiliers One City ?", "Nos projets sont aujourd’hui principalement situés dans les Yvelines (78), notamment à Hardricourt et Breuil-Bois-Robert. One City Immobilier développe plus largement ses opérations en Île-de-France, en sélectionnant chaque emplacement selon son potentiel et la qualité de vie qu’il peut offrir."],
    ["disponibilites", "Quels logements sont actuellement disponibles à la vente dans les Yvelines ?", "Les logements actuellement commercialisés sont présentés directement sur notre site. Chaque programme immobilier dispose de sa propre page avec les typologies, surfaces, performances énergétiques, prix et disponibilités. Le programme C’Premium à Breuil-Bois-Robert propose notamment des logements actuellement disponibles à la vente."],
    ["logements-neufs", "One City propose-t-il uniquement des logements neufs ?", "Non. Notre activité ne se limite pas à l’immobilier neuf. Nous pouvons également rénover, transformer ou valoriser des bâtiments existants afin de créer de nouveaux logements tout en optimisant les volumes, les performances énergétiques et le confort des futurs occupants."],
    ["usage", "Peut-on acheter un logement One City pour une résidence principale ou un investissement locatif ?", "Oui. Selon les programmes, nos logements peuvent répondre à un projet de résidence principale comme à un investissement immobilier. Les dispositifs de financement ou d’investissement disponibles dépendent du logement, du programme et de la situation de chaque acquéreur."],
    ["nouveaux-programmes", "Comment être informé des nouveaux programmes immobiliers One City ?", "Vous pouvez consulter régulièrement nos projets ou contacter directement notre équipe pour connaître les programmes actuellement en commercialisation et les futures opportunités immobilières dans les Yvelines et en Île-de-France."],
  ].map(([id, question, answer]) => ({ id, question, answer })),
];

// Source: Figma 4035:780. The user confirmed that testimonials are fictional for now.
export const previewTestimonial: TestimonialCardProps = {
  quote: "« On remarque vite que les choix ont été faits pour le confort au quotidien. L’agencement est pratique, les volumes sont agréables et le logement est très confortable, notamment sur le plan thermique. »",
  author: "Sophie Lambert",
  location: "Breuil-Bois-Robert",
  image: { src: "/brand/interactive/testimonial-interior.png", alt: "" },
};
