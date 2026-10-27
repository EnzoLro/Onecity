import type { ReactNode } from "react";
import { Container, StyledLink, Text } from "@/components/ui";
import { Breadcrumb } from "./breadcrumb";
import "./legal-page.css";

export type LegalSection = { id: string; title: string; content: ReactNode };

export function LegalDetails({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return <dl className="legal-details">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

/** ENZ-77: Figma editorial layout, with the site's approved shared typography and shell. */
export function LegalPage({ title, path, description, introduction, sections }: {
  title: string; path: string; description: string; introduction: string; sections: LegalSection[];
}) {
  return <main id="main-content" tabIndex={-1} className="legal-page">
    <Breadcrumb path={path} label={title} />
    <div className="legal-page__hero">
      <Container className="legal-page__hero-inner">
        <div className="legal-page__identity"><span className="legal-page__eyebrow">Informations du site</span><Text as="h1" variant="display">{title}</Text></div>
        <div className="legal-page__presentation"><p>Les informations essentielles, en toute clarté.</p><p>{description}</p></div>
      </Container>
    </div>
    <Container className="legal-page__body">
      <nav id="sommaire" aria-label={`Sommaire — ${title}`} className="legal-page__contents">
        <p>Sur cette page</p>
        <ul>{sections.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ul>
      </nav>
      <article className="legal-page__article" aria-label={title}>
        <header className="legal-page__article-header"><Text as="h2" variant="heading">{title}</Text><p>{introduction}</p></header>
        <aside className="legal-page__draft" aria-label="État de validation">Document de travail : les informations signalées « À confirmer par One City » restent à compléter et à faire valider avant publication définitive.</aside>
        {sections.map(({ id, title, content }) => <section id={id} key={id} aria-labelledby={`${id}-title`} className="legal-page__section"><h3 id={`${id}-title`}>{title}</h3>{content}</section>)}
        <div className="legal-page__end"><p>Document à faire valider par One City</p><a href="#sommaire">Retour au sommaire ↑</a></div>
      </article>
    </Container>
    <section className="legal-page__cta" aria-labelledby="legal-cta-title"><Container>
      <p className="legal-page__eyebrow">Un projet ? Un futur logement ?</p>
      <Text as="h2" variant="heading" id="legal-cta-title">Votre prochain chez-vous mérite d’être bien pensé.</Text>
      <p>Découvrez C’Premium et les détails qui font la différence au quotidien.</p>
      <StyledLink href="/projets/c-premium" variant="inverse">Découvrir le projet</StyledLink>
    </Container></section>
  </main>;
}
