import { Container, Section, StyledLink, Text } from "@/components/ui";

/** Visible scaffold for pages whose editorial content has not been supplied. */
export function PendingContentPage({ title }: { title: string }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section spacing="compact">
        <Container>
          <Text as="h1" variant="heading" className="[overflow-wrap:anywhere]">{title}</Text>
          <Text className="mt-6">Contenu à venir.</Text>
          <StyledLink href="/" className="mt-8">Retour à l’accueil</StyledLink>
        </Container>
      </Section>
    </main>
  );
}
