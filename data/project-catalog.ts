import { programs, projectHref, type ProjectFact } from "./programs";

export type ProjectCard = {
  slug: string;
  label: string;
  status?: string;
  transaction?: string;
  commercializing: boolean;
  detailHref: string;
  image: { src: string; alt: string };
  facts: readonly ProjectFact[];
};

/** Only programs with approved card content appear on home. */
export const projectCatalog: ProjectCard[] = programs.flatMap((program) => {
  const card = program.editorial.card;
  if (!card) return [];
  return [{
    slug: program.slug,
    label: program.label,
    status: program.commercial.status,
    transaction: program.commercial.transaction,
    commercializing: program.commercial.commercializing === true,
    detailHref: projectHref(program.slug),
    image: card.image,
    facts: program.commercial.facts.filter(({ id }) => card.factIds.includes(id)),
  }];
});

export const projectsSection = {
  label: "Nos réalisations",
  title: ["Des projets différents,", "une même exigence."],
  introduction: "Neuf, rénovation ou transformation, chaque opération est pensée selon son environnement, ses usages et son potentiel.",
} as const;
