import { Container, StyledLink, Text } from "@/components/ui";
import "./not-found.css";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found">
      <Container className="not-found__container">
        <div className="not-found__copy">
          <Text variant="eyebrow" className="not-found__eyebrow">Erreur 404</Text>
          <Text as="h1" variant="display">Cette page n’existe pas.</Text>
          <Text variant="body-lg" className="not-found__description">
            Le lien a peut-être changé ou la page a été déplacée. Vous pouvez revenir à l’accueil ou contacter directement One City Immobilier.
          </Text>
          <div className="not-found__actions">
            <StyledLink href="/" variant="primary">Retour à l’accueil</StyledLink>
            <StyledLink href="/contact" variant="secondary">Nous contacter</StyledLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
