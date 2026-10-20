import type { Metadata } from "next";
import { Container, Section, StyledLink, Text } from "@/components/ui";
import { contact } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Contact — OneCity",
  robots: { index: false },
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section spacing="compact">
        <Container>
          <Text as="h1" variant="heading">Contact</Text>
          <Text className="mt-6">Contenu à venir.</Text>
          <div className="mt-8 flex flex-wrap gap-4">
            <StyledLink href={contact.href} variant="primary">{contact.href.replace("mailto:", "")}</StyledLink>
            <StyledLink href="/">Retour à l’accueil</StyledLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
