import { programs, projectHref } from "./programs";

// Navigation is a projection of the shared program registry.
export const projects = programs.map(({ slug, label }) => ({ slug, label, href: projectHref(slug) }));

export const contact = {
  label: "Nous contacter",
  pageHref: "/contact",
  href: "mailto:projets@onecityimmobilier.fr",
} as const;
