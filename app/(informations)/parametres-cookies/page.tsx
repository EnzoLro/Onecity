import { createPageMetadata } from "@/lib/seo";
import { CookiePreferences } from "@/components/analytics/analytics";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container, Section, Text } from "@/components/ui";

export const metadata = createPageMetadata({ path: "/parametres-cookies", title: "Paramètres des cookies | One City Immobilier", description: "Acceptez ou refusez la mesure d’audience et modifiez votre choix.", indexable: false });

export default function CookiesPage() {
  return <main id="main-content" tabIndex={-1}>
    <Breadcrumb path="/parametres-cookies" label="Paramètres des cookies" />
    <Section><Container>
      <Text as="h1" variant="heading">Paramètres des cookies</Text>
      <Text>La mesure d’audience est facultative. Sans votre accord, Google Analytics n’est pas chargé. Le choix de consentement est enregistré dans le stockage local de votre navigateur, indépendamment des informations du formulaire de contact.</Text>
      {process.env.VERCEL_ENV !== "production" && <Text>Google Analytics est désactivé sur cette pré-production, même après acceptation.</Text>}
      <CookiePreferences />
      <Text>Les informations complémentaires sur les traitements de données sont en cours de préparation dans notre <a href="/politique-de-confidentialite">politique de confidentialité</a>.</Text>
    </Container></Section>
  </main>;
}
