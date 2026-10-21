import Image from "next/image";
import { Container, StyledLink, Text } from "@/components/ui";
import { cPremium, type ProjectFact } from "@/data/c-premium";
import { contact } from "@/data/navigation";
import "./featured-project.css";

/** Featured project from Figma 4035:543; content shared with the project route. */
export function FeaturedProject({ detail = false }: { detail?: boolean }) {
  return (
    <section className="featured-project" aria-labelledby="featured-project-title">
      <Container className="featured-project__container">
        <div className="featured-project__content">
          <div className="featured-project__heading">
            <Text variant="subtitle" className="featured-project__status">{cPremium.status}</Text>
            <Text as={detail ? "h1" : "h2"} variant="display" id="featured-project-title">{cPremium.label}</Text>
            <Text variant="body-lg" className="featured-project__introduction">{cPremium.introduction}</Text>
          </div>
          {cPremium.facts.length > 0 && (
            <ul className="featured-project__facts" aria-label="Caractéristiques du projet">
              {cPremium.facts.map((fact: ProjectFact) => (
                <li key={fact.id}>
                  <span className="featured-project__icon" aria-hidden="true">
                    <Image src={`/brand/c-premium/${fact.icon}.svg`} alt="" width={fact.icon === "document" ? 17.0531 : 24} height={fact.icon === "document" ? 19.8652 : 24} />
                  </span>
                  <span>
                    {fact.condition ? (
                      <a className="featured-project__condition-link" href={`${detail ? "" : cPremium.href}#${fact.condition}`} aria-label={`${fact.label} : consulter les conditions`}>
                        {fact.label}<sup>{fact.marker}</sup>
                      </a>
                    ) : fact.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <StyledLink href={detail ? contact.href : cPremium.href} variant="primary" size="large" className="featured-project__cta">{detail ? contact.label : cPremium.cta}</StyledLink>
        </div>
        <Image {...cPremium.image} sizes="(max-width: 1023px) calc(100vw - 48px), (max-width: 1399px) 40vw, 560px" className="featured-project__image" />
      </Container>
    </section>
  );
}
