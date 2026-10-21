import { HomeHero } from "@/components/layout/home-hero";
import { FeaturedProject } from "@/components/layout/featured-project";
import { DesignApproach } from "@/components/layout/design-approach";
import { Container, Section, Text } from "@/components/ui";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero projectsHref="#nos-projets" />
      <FeaturedProject />
      <DesignApproach />
      <Section id="nos-projets" spacing="compact" aria-labelledby="projects-title" tabIndex={-1}>
        <Container>
          <Text as="h2" variant="heading" id="projects-title">Nos projets</Text>
          <Text className="mt-4">Contenu à venir</Text>
        </Container>
      </Section>
    </main>
  );
}
