import Image from "next/image";
import { Container, StyledLink, Text } from "@/components/ui";
import { homeCta } from "@/data/home-cta";
import "./home-cta.css";

/** Final homepage contact section, from ENZ-60 / Figma 4035:844. */
export function HomeCta() {
  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <Container className="home-cta__container">
        <Image src="/brand/home-cta/logo-mark.svg" alt="" width={65.0142} height={52} />
        <div className="home-cta__content">
          <Text variant="eyebrow" className="home-cta__label">{homeCta.label}</Text>
          <Text as="h2" variant="heading" id="home-cta-title" className="home-cta__title">{homeCta.title}</Text>
          <Text variant="body-lg" className="home-cta__description">{homeCta.description}</Text>
        </div>
        <StyledLink href={homeCta.action.href} variant="inverse" className="home-cta__action">
          {homeCta.action.label}
        </StyledLink>
      </Container>
    </section>
  );
}
