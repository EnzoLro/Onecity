import type { Metadata } from "next";
import Image from "next/image";
import { Accordion, Button, Container, Section, Slider, StyledLink, TestimonialCard, Text } from "@/components/ui";
import { previewFaq, previewTestimonial } from "@/data/interactive-preview";

export const metadata: Metadata = {
  title: "Aperçu des composants — OneCity",
  robots: { index: false, follow: false },
};

export default function ComponentPreview() {
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
            <Text variant="eyebrow" className="mb-4 text-onecity-item-mid">
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
                <Text as="h3" variant="title-sm" className="capitalize">{variant}</Text>
                <Button variant={variant}>Nous contacter</Button>
                <Button variant={variant} disabled>Indisponible</Button>
                <StyledLink href="#typographie" variant={variant}>Voir la typographie</StyledLink>
                <StyledLink href="#typographie" variant={variant} disabled>Lien indisponible</StyledLink>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-onecity-primary p-6">
            <Text className="text-onecity-surface">CTA sur fond primaire</Text>
            <StyledLink href="/contact" variant="inverse">Nous contacter</StyledLink>
          </div>
          <div id="typographie" className="space-y-6">
            <Text as="h2" variant="heading">Typographie</Text>
            <Text as="h3" variant="display">Des logements pensés dans les moindres détails.</Text>
            <Text variant="heading-sm">Titre intermédiaire — Parkinsans semi-bold, 32 px</Text>
            <Text variant="title">Titre de carte — Parkinsans semi-bold, 18 px</Text>
            <Text variant="title-sm">Petit titre / question — Parkinsans semi-bold, 16 px</Text>
            <Text variant="caption-title">Titre de colonne — Parkinsans semi-bold, 14 px</Text>
            <Text variant="eyebrow">Bandeau de section — Inter, 14 px</Text>
            <Text variant="small">Légende — Inter, 14 px</Text>
            <Text variant="label">Libellé d’action — Inter semi-bold, 16 px</Text>
            <Text variant="body-lg">Texte d’introduction — 18 px</Text>
            <Text>Texte courant — 16 px</Text>
          </div>
        </Container>
      </Section>
      <Section id="interactifs" spacing="compact" aria-labelledby="interactifs-title">
        <Container className="space-y-10">
          <div>
            <Text as="h2" variant="heading" id="interactifs-title">Composants interactifs</Text>
            <Text className="mt-4 max-w-3xl">Aperçu technique ENZ-52. Les six réponses de FAQ et l’avis fictif sont repris de Figma, y compris les blocs de réponse masqués.</Text>
          </div>
          <div className="max-w-[700px] space-y-6">
            <Text as="h3" variant="title-sm">FAQ — accordéon</Text>
            <Accordion items={previewFaq} defaultOpenId="types-programmes" headingLevel={4} />
          </div>
          <div className="max-w-[1000px] space-y-6">
            <Text as="h3" variant="title-sm">Avis — slider</Text>
            <Text>Avis fictif de la maquette, répété sur trois diapositives pour tester la navigation. Aucun avis supplémentaire n’a été rédigé.</Text>
            <Slider label="Aperçu technique du slider d’avis fictifs" items={[1, 2, 3].map((number) => ({
              id: `figma-test-${number}`,
              content: <TestimonialCard {...previewTestimonial} />,
            }))} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
