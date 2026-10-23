import Image from "next/image";
import { Container, StyledLink, Text } from "@/components/ui";
import { featuredProgram, projectHref, type FeaturedProgram, type ProjectFact } from "@/data/programs";
import { contact } from "@/data/navigation";
import { ProjectCondition } from "./project-condition";
import "./featured-project.css";

/** Featured project from Figma 4035:543; content shared with the project route. */
export function FeaturedProject({ detail = false, project = featuredProgram }: { detail?: boolean; project?: FeaturedProgram }) {
  if (!project) return null;
  const content = project.editorial.featured;
  return (
    <section className="featured-project" aria-labelledby="featured-project-title">
      <Container className="featured-project__container">
        <div className="featured-project__content">
          <div className="featured-project__heading">
            <Text variant="eyebrow" className="featured-project__status">{project.commercial.status}</Text>
            <Text as={detail ? "h1" : "h2"} variant={detail ? "display" : "heading"} id="featured-project-title">{project.label}</Text>
            <Text variant="body-lg" className="featured-project__introduction">{content.introduction}</Text>
          </div>
          {project.commercial.facts.length > 0 && (
            <ul className="featured-project__facts" aria-label="Caractéristiques du projet">
              {project.commercial.facts.map((fact: ProjectFact) => {
                const icon = <span className="featured-project__icon" aria-hidden="true">
                    <Image src={`/brand/c-premium/${fact.icon}.svg`} alt="" width={fact.icon === "document" ? 17.0531 : 24} height={fact.icon === "document" ? 19.8652 : 24} />
                  </span>;
                const condition = project.commercial.conditions.find(({ id }) => id === fact.condition);
                return (
                  <li className="onecity-text-label" key={fact.id}>
                    {condition ? <ProjectCondition label={fact.label} marker={fact.marker} text={condition.text} icon={icon} /> : <>{icon}<span>{fact.label}</span></>}
                  </li>
                );
              })}
            </ul>
          )}
          <StyledLink href={detail ? contact.href : projectHref(project.slug)} variant="primary" size="large" className="featured-project__cta">{detail ? contact.label : content.cta}</StyledLink>
        </div>
        <Image {...content.image} sizes="(max-width: 1023px) calc(100vw - 48px), (max-width: 1399px) 40vw, 560px" className="featured-project__image" />
      </Container>
    </section>
  );
}
