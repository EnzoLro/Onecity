import Image from "next/image";
import { Container, StyledLink, Text } from "@/components/ui";
import "./home-hero.css";

/** Home hero from Figma 4035:529; the projects destination is supplied by the page. */
export function HomeHero({ projectsHref }: { projectsHref: string }) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__introduction">
        <Container className="home-hero__container">
          <div className="home-hero__heading">
            <Text variant="eyebrow" className="home-hero__eyebrow">
              Promotion &amp; valorisation immobilière dans les Yvelines
            </Text>
            <Text as="h1" variant="display" id="home-hero-title">
              Des logements pensés dans les moindres détails.
            </Text>
          </div>
          <div className="home-hero__content">
            <Text variant="body-lg" className="home-hero__description">
              De la conception aux finitions, One City Immobilier imagine des projets à taille humaine, pensés pour offrir plus de confort, de performance et de qualité au quotidien.
            </Text>
            <div className="home-hero__actions">
              <StyledLink href="/contact" variant="primary">Nous contacter</StyledLink>
              <StyledLink href={projectsHref} variant="secondary">Découvrir nos projets</StyledLink>
            </div>
          </div>
        </Container>
      </div>
      <div className="home-hero__visual" role="img" aria-label="Maquette architecturale d’une maison avec jardin sur une table de travail">
        <div className="home-hero__panorama">
          <Image src="/brand/hero/architectural-model-background.png" alt="" width={3642} height={896} sizes="(max-width: 1023px) 1100px, 100vw" preload className="home-hero__background" />
        </div>
        <Image src="/brand/hero/architectural-model-cutout.png" alt="" width={1200} height={896} sizes="(max-width: 1023px) 362px, 33vw" preload className="home-hero__cutout" />
      </div>
    </section>
  );
}
