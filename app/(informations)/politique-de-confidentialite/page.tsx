import { createPageMetadata } from "@/lib/seo";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata = createPageMetadata({ path: "/politique-de-confidentialite", title: "Politique de confidentialité | One City Immobilier", description: "Politique de confidentialité de One City Immobilier. Contenu en cours de préparation.", indexable: false });

export default function PrivacyPage() {
  return <PendingContentPage title="Politique de confidentialité" path="/politique-de-confidentialite" />;
}
