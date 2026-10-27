import Image from "next/image";
import { Container, Section, StyledLink, Text } from "@/components/ui";
import type { DetailProgram } from "@/data/programs";
import { contact } from "@/data/navigation";
import { footer } from "@/data/footer";
import { ProjectGalleryImage } from "./project-gallery-image";
import { ProjectLocalityMap } from "./project-locality-map";
import { ProjectVisual } from "./project-visual";
import { ProjectCondition } from "./project-condition";
import { HomeCta } from "./home-cta";
import "./featured-project.css";
import "./project-detail.css";
import { Breadcrumb } from "./breadcrumb";
import { JsonLd } from "./structured-data";
import { createProgramStructuredData } from "@/lib/structured-data";
import { getSeoConfig } from "@/lib/seo";

function Heading({ label, title, id }: { label: string; title: string; id: string }) {
  return <div className="project-detail__heading"><Text variant="eyebrow" className="project-detail__label">{label}</Text><Text as="h2" variant="heading" id={id}>{title}</Text></div>;
}

/** Project template driven by approved program content; unknown commercial data stays absent. */
export function ProjectDetail({ project }: { project: DetailProgram }) {
  const { detail, featured } = project.editorial;
  const location = project.commercial.facts.find(({ id }) => id === "location");
  const energy = project.commercial.facts.find(({ id }) => id === "energy");
  const price = project.commercial.price;
  const gallery = [detail.overview.image, detail.design.image];
  const contactHref = `${contact.pageHref}?projet=${project.slug}#demande-informations`;
  const structuredData = createProgramStructuredData(getSeoConfig().origin, project);
  return (
    <main id="main-content" tabIndex={-1} className="project-detail">
      <Breadcrumb path={`/projets/${project.slug}`} label={project.label} />
      {structuredData && <JsonLd data={structuredData} />}
      <section className="project-detail__hero" aria-labelledby="project-title">
        <Container className="project-detail__hero-content">
          <div className="project-detail__heading">
            {project.commercial.status && <Text variant="eyebrow" className="project-detail__label">{project.commercial.status}</Text>}
            <Text as="h1" variant="display" id="project-title">{project.label}</Text>
            {location && <Text className="project-detail__location"><Image src="/brand/c-premium/map-pin.svg" alt="" width={20} height={20} />{location.label}</Text>}
          </div>
          <div className="project-detail__promise"><Text variant="body-lg">{featured.introduction}</Text><StyledLink href={contactHref} variant="primary" size="large">Recevoir les informations</StyledLink></div>
        </Container>
        <ProjectVisual {...detail.hero} />
      </section>
      <Container><dl className="project-detail__highlights">{detail.highlights.map(({ label, value }) => <div key={label}><dt className="onecity-text-body">{label}</dt><dd className="onecity-text-statistic">{value}</dd></div>)}</dl></Container>
      <Section aria-labelledby="project-overview-title"><Container className="project-detail__overview">
        <div className="project-detail__copy"><Heading {...detail.overview} id="project-overview-title" />{detail.overview.paragraphs.map((paragraph) => <Text key={paragraph}>{paragraph}</Text>)}</div>
        <ProjectGalleryImage images={gallery} index={0} sizes="(max-width: 1023px) calc(100vw - 48px), 560px" className="project-detail__plan" />
      </Container></Section>
      <Section aria-labelledby="project-homes-title" className="project-detail__homes"><Container className="project-detail__stack">
        <div className="project-detail__homes-heading"><Heading {...detail.homes} id="project-homes-title" />{price && <div className="project-detail__price"><Text variant="small">{price.prefix}</Text><Text variant="heading-sm">{price.amount}</Text><Text variant="small">Informations et conditions auprès de notre équipe.</Text></div>}</div>
        <div className="project-detail__home-grid">{detail.homes.items.map((home) => <article key={home.id} className="project-detail__home" aria-labelledby={`home-${home.id}`}>
          <div className="project-detail__home-type"><Text as="h3" variant="label" id={`home-${home.id}`}>LOGEMENT {home.type}<span className="sr-only"> · {home.area} m²</span></Text><Image src="/brand/c-premium/move-diagonal.svg" alt="" width={20} height={20} /></div>
          <p className="project-detail__area">{home.area}<span>m²</span></p>
          <div className="project-detail__home-facts"><Text>{home.rooms}</Text>{energy && <Text variant="label">{energy.label}</Text>}</div>
          {detail.homes.features && <ul className="project-detail__home-features">{detail.homes.features.map((feature) => <li className="onecity-text-body" key={feature}>{feature}</li>)}</ul>}
          <Text variant="small" className="project-detail__muted">{detail.homes.note}</Text>
          <StyledLink href={`${contact.pageHref}?projet=${project.slug}&logement=${home.id}#demande-informations`} variant="secondary" size="large" aria-label={`${detail.homes.action} · ${home.area} m²`} data-home-interest={home.id}>{detail.homes.action}</StyledLink>
        </article>)}</div>
        <div className="project-detail__eligibility">{project.commercial.facts.filter(({ condition }) => condition).map((fact) => {
          const condition = project.commercial.conditions.find(({ id }) => id === fact.condition);
          return condition ? <ProjectCondition key={fact.id} label={fact.label} marker={fact.marker} text={condition.text} icon={<Image src="/brand/c-premium/file-check.svg" alt="" width={20} height={20} />} /> : null;
        })}</div>
        <Text variant="small" className="project-detail__muted">{detail.eligibilityNote}</Text>
      </Container></Section>
      <Section aria-labelledby="project-design-title"><Container className="project-detail__stack"><Heading {...detail.design} id="project-design-title" /><div className="project-detail__design">
        <div><ProjectGalleryImage images={gallery} index={1} sizes="(max-width: 1023px) calc(100vw - 48px), 480px" className="project-detail__design-image" />{energy && <div className="project-detail__energy"><span className="project-detail__energy-class" aria-hidden="true">{energy.label.replace("DPE ", "")}</span><div><Text variant="label">{energy.label}</Text><Text variant="small">{detail.design.energyNote}</Text></div></div>}</div>
        <div>{detail.design.principles.map(({ title, text, items }) => <div className="project-detail__principle" key={title}><Text as="h3" variant="title">{title}</Text><Text className="project-detail__muted">{text}</Text>{items && <ul className="project-detail__principle-features">{items.map((item) => <li key={item} className="onecity-text-body">{item}</li>)}</ul>}</div>)}</div>
      </div></Container></Section>
      <Section spacing="compact" aria-labelledby="project-location-title">
        <Container className="project-detail__locality">
          <div className="project-detail__copy">
            <Heading {...detail.location} id="project-location-title" />
            <Text variant="body-lg">{detail.location.description}</Text>
            {detail.location.access && (
              <dl className="project-detail__access">
                {detail.location.access.map(({ label, duration, mode }) => (
                  <div key={label}>
                    <dt className="onecity-text-label">{label}</dt>
                    <dd><span className="onecity-text-statistic">{duration}</span><span className="onecity-text-small">{mode}</span></dd>
                  </div>
                ))}
              </dl>
            )}
            {detail.location.accessNote && <Text variant="small" className="project-detail__muted">{detail.location.accessNote}</Text>}
            <StyledLink href={contactHref} variant="primary" size="large">{detail.location.action}</StyledLink>
          </div>
          {project.slug === "c-premium" ? <ProjectLocalityMap /> : <div className="project-detail__department"><p>{detail.location.department}</p><Text variant="eyebrow">{detail.location.territory}</Text></div>}
        </Container>
      </Section>
      <Section spacing="compact" id="demande-informations" aria-labelledby="project-contact-title"><Container className="project-detail__contact"><div className="project-detail__copy"><Heading {...detail.contact} id="project-contact-title" /><Text variant="body-lg">{detail.contact.introduction}</Text><address className="project-detail__coordinates onecity-text-body"><Text variant="label">One City Immobilier</Text><div className="project-detail__coordinate"><Image src="/brand/c-premium/map-pin.svg" alt="" width={20} height={20} /><p>{footer.address.map((line) => <span key={line}>{line}<br /></span>)}</p></div><div className="project-detail__coordinate"><Image src="/brand/c-premium/mail.svg" alt="" width={20} height={20} /><a href={contact.href}>{contact.href.replace("mailto:", "")}</a></div><div className="project-detail__coordinate"><Image src="/brand/c-premium/phone.svg" alt="" width={20} height={20} /><a href={footer.phone.href}>{footer.phone.label}</a></div></address></div><StyledLink href={contactHref} variant="primary" size="large">Recevoir les informations sur {project.label}</StyledLink></Container></Section>
      <HomeCta contactHref={contactHref} />
    </main>
  );
}
