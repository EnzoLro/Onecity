import type { Metadata } from "next";
import Image from "next/image";
import { Container, Section, StyledLink, Text } from "@/components/ui";
import { ProjectVisual } from "@/components/layout/project-visual";
import { ProjectContactForm } from "@/components/layout/project-contact-form";
import { contact } from "@/data/navigation";
import { footer } from "@/data/footer";
import { getProgram, hasDetailContent, projectHref } from "@/data/programs";
import { isContactConfigured } from "@/lib/project-contact";
import "@/components/layout/project-detail.css";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact — C’Premium | OneCity",
  description: "Une question sur C’Premium, un logement qui vous intéresse ? Échangez avec One City Immobilier sur votre futur logement à Breuil-Bois-Robert.",
};

/** Figma 4045:1369; commercial facts, assets and coordinates reuse approved sources. */
export default function ContactPage() {
  const project = getProgram("c-premium");
  if (!project || !hasDetailContent(project)) throw new Error("Le contenu contact C’Premium est manquant.");
  const { detail } = project.editorial;
  const href = projectHref(project.slug);
  const location = project.commercial.facts.find(({ id }) => id === "location");
  const emailHref = `${contact.href}?subject=${encodeURIComponent(`Demande d’informations · ${project.label}`)}`;

  return (
    <main id="main-content" tabIndex={-1} className="contact-page project-detail">
      <Container><nav aria-label="Fil d’Ariane" className="project-detail__breadcrumb onecity-text-small"><ol><li><a href="/">Accueil</a></li><li aria-hidden="true">/</li><li aria-current="page">Contact</li></ol></nav></Container>
      <section aria-labelledby="contact-title">
        <Container className="project-detail__hero-content">
          <div className="project-detail__heading">
            <Text variant="eyebrow" className="project-detail__label">Échangeons sur votre projet</Text>
            <Text as="h1" variant="display" id="contact-title">Contact</Text>
            <Text className="project-detail__location"><Image src="/brand/contact/map-pin.svg" alt="" width={20} height={20} />{project.label} · {location?.label}</Text>
          </div>
          <div className="project-detail__promise">
            <Text variant="body-lg">Un futur chez-vous commence par un échange.</Text>
            <Text className="project-detail__muted">Une question sur C’Premium, un logement qui vous intéresse ? Notre équipe est à votre écoute pour vous accompagner.</Text>
          </div>
        </Container>
        <ProjectVisual {...detail.hero} />
        <Container className="contact-page__caption"><Text variant="small">C’Premium — Deux logements pensés dans les détails.</Text><Text variant="eyebrow">Un projet One City Immobilier</Text></Container>
      </section>
      <Section id="demande-informations" aria-labelledby="enquiry-title">
        <Container className="project-detail__contact">
          <div className="project-detail__copy">
            <Text variant="eyebrow" className="project-detail__label">À votre écoute</Text>
            <Text as="h2" variant="heading" id="enquiry-title">Parlons de votre futur logement.</Text>
            <Text className="project-detail__muted">Plans, surfaces, prestations ou financement : partagez vos questions et vos envies avec One City Immobilier.</Text>
            <address className="contact-page__channels">
              <div><Text variant="eyebrow"><Image src="/brand/contact/mail.svg" alt="" width={20} height={20} />Nous écrire</Text><a className="onecity-text-body-lg" href={emailHref}>{contact.href.replace("mailto:", "")}</a><Text variant="small">Pour recevoir les informations du projet.</Text></div>
              <div><Text variant="eyebrow"><Image src="/brand/contact/phone.svg" alt="" width={20} height={20} />Nous appeler</Text><a className="onecity-text-body-lg" href={footer.phone.href}>{footer.phone.label}</a><Text variant="small">Pour échanger directement avec notre équipe.</Text></div>
              <div><Text variant="eyebrow"><Image src="/brand/contact/map-pin.svg" alt="" width={20} height={20} />One City Immobilier</Text><p className="onecity-text-body-lg">{footer.address.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p><Text variant="small">Contactez-nous pour convenir d’un rendez-vous.</Text></div>
            </address>
          </div>
          <ProjectContactForm projectSlug={project.slug} projectLabel={project.label} homes={detail.homes.items} sendingEnabled={isContactConfigured({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM })} />
        </Container>
      </Section>
      <Section className="contact-page__project" aria-labelledby="contact-project-title">
        <Container className="contact-page__project-grid">
          <figure><Image {...detail.overview.image} sizes="(max-width: 1023px) calc(100vw - 48px), 560px" className="contact-page__plan" /><figcaption className="onecity-text-small">C’Premium · Vue en plan de la maquette</figcaption></figure>
          <div className="project-detail__copy">
            <Text variant="eyebrow" className="project-detail__label">Le projet, en quelques mots</Text>
            <Text as="h2" variant="heading" id="contact-project-title">{detail.location.title}</Text>
            <Text>C’Premium prend place à Breuil-Bois-Robert, dans les Yvelines. Deux logements T4 pensés pour offrir plus de confort, de lumière et de qualité au quotidien.</Text>
            <dl className="contact-page__facts">{detail.highlights.slice(0, 3).map(({ label, value }) => <div key={label}><dt className="onecity-text-small">{label}</dt><dd className="onecity-text-label">{value}</dd></div>)}</dl>
            <Text variant="small" className="project-detail__muted">{detail.location.note}</Text>
            <StyledLink href={href} variant="secondary">Découvrir {project.label}</StyledLink>
          </div>
        </Container>
      </Section>
      <section className="contact-page__invitation" aria-labelledby="contact-invitation-title"><Container>
        <Text variant="eyebrow">Un projet ? Un futur logement ?</Text>
        <Text as="h2" variant="heading" id="contact-invitation-title">Votre prochain chez-vous mérite d’être bien pensé.</Text>
        <Text>Découvrez C’Premium et les détails qui font la différence au quotidien.</Text>
        <StyledLink href={href} variant="inverse">Découvrir le projet</StyledLink>
      </Container></section>
    </main>
  );
}
