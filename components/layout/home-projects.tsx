import Image from "next/image";
import { Container, StyledLink, Text } from "@/components/ui";
import { projectCatalog, projectsSection, type ProjectCard } from "@/data/project-catalog";
import { contact } from "@/data/navigation";
import "./home-projects.css";

function ProjectCard({ project }: { project: ProjectCard }) {
  return (
    <article className="home-projects__card" aria-labelledby={`project-${project.slug}`}>
      <p className="home-projects__status" data-commercializing={project.commercializing}>{project.status}</p>
      <div className="home-projects__image">
        <Image {...project.image} fill sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1399px) 50vw, 628px" />
      </div>
      <div className="home-projects__name">
        <Text as="h3" id={`project-${project.slug}`}>{project.label}</Text>
        <Text>{project.transaction}</Text>
      </div>
      <ul className="home-projects__facts">
        {project.facts.map((fact) => (
          <li key={fact.id}>
            <span className={`home-projects__icon home-projects__icon--${fact.icon}`} aria-hidden="true">
              <Image src={`/brand/projects/${fact.icon}.svg`} alt="" width={fact.icon === "document" ? 17.0531 : 24} height={fact.icon === "document" ? 19.8652 : 24} />
            </span>
            <span>{fact.label}</span>
          </li>
        ))}
      </ul>
      {(project.commercializing || project.detailHref) && (
        <div className="home-projects__actions">
          {project.commercializing && <StyledLink href={contact.href} variant="primary">{contact.label}</StyledLink>}
          {project.detailHref && <StyledLink href={project.detailHref} aria-label={`Découvrir ${project.label}`}>Découvrir</StyledLink>}
        </div>
      )}
    </article>
  );
}

/** Compact project listing; only publishable records have a card. */
export function HomeProjects() {
  return (
    <section id="nos-projets" className="home-projects" aria-labelledby="projects-title" tabIndex={-1}>
      <Container className="home-projects__container">
        <div className="home-projects__header">
          <div className="home-projects__heading">
            <Text variant="subtitle" className="home-projects__label">{projectsSection.label}</Text>
            <Text as="h2" variant="heading" id="projects-title">{projectsSection.title[0]}<br />{projectsSection.title[1]}</Text>
          </div>
          <Text variant="body-lg" className="home-projects__introduction">{projectsSection.introduction}</Text>
        </div>
        <div className="home-projects__grid">
          {projectCatalog.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </Container>
    </section>
  );
}
