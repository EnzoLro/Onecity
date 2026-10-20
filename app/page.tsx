import Image from "next/image";
import { Button, Container, Section, StyledLink, Text } from "@/components/ui";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-onecity-background text-onecity-item-high">
      <Section spacing="compact">
        <Container>
          <div className="max-w-3xl">
            <Image
              src="/brand/logos/onecity-logo.svg"
              alt="OneCity"
              width={177}
              height={40}
              priority
              className="mb-10 h-10 w-auto"
            />
            <Text variant="subtitle" className="mb-4 text-onecity-item-mid">
              Fondations
            </Text>
            <Text as="h1" variant="display">
              OneCity
            </Text>
            <Text variant="body-lg" className="mt-6 max-w-2xl text-onecity-item-low">
              Système global de couleurs, typographies, espacements et conteneurs.
            </Text>
            <div className="mt-10 flex flex-wrap gap-4">
              <StyledLink href="#primitives" variant="primary">
                Explorer les primitives
              </StyledLink>
              <StyledLink href="https://linear.app/enzo-louro/issue/ENZ-49" variant="secondary">
                Voir le ticket
              </StyledLink>
              <StyledLink href="https://www.figma.com/design/xaXG28sdrzFhLXaDCoZxEo/Onecity-Website?node-id=4035-525&m=dev" variant="ghost">
                Maquette Figma
              </StyledLink>
            </div>
          </div>
        </Container>
      </Section>
      <Section id="primitives" spacing="compact" aria-labelledby="primitives-title">
        <Container className="space-y-10">
          <div>
            <Text as="h2" variant="heading" id="primitives-title">Primitives UI</Text>
            <Text className="mt-4">Survolez les boutons ou utilisez Tab pour vérifier le focus clavier.</Text>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {(["primary", "secondary", "ghost"] as const).map((variant) => (
              <div key={variant} className="flex flex-col items-start gap-4">
                <Text as="h3" className="font-semibold capitalize">{variant}</Text>
                <Button variant={variant}>Nous contacter</Button>
                <Button variant={variant} disabled>Indisponible</Button>
                <StyledLink href="#typographie" variant={variant}>Voir la typographie</StyledLink>
                <StyledLink href="#typographie" variant={variant} disabled>Lien indisponible</StyledLink>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-onecity-primary p-6">
            <Text className="text-onecity-surface">CTA sur fond primaire</Text>
            <StyledLink href="mailto:projets@onecityimmobilier.fr" variant="inverse">Nous contacter</StyledLink>
          </div>
          <div id="typographie" className="space-y-6">
            <Text as="h2" variant="heading">Typographie</Text>
            <Text as="h3" variant="display">Des logements pensés dans les moindres détails.</Text>
            <Text variant="subtitle">Texte secondaire — 14 px</Text>
            <Text variant="body-lg">Texte d’introduction — 18 px</Text>
            <Text>Texte courant — 16 px</Text>
          </div>
        </Container>
      </Section>
    </main>
  );
}
