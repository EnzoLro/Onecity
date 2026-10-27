import { createPageMetadata } from "@/lib/seo";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata = createPageMetadata({ path: "/mentions-legales", title: "Mentions légales | One City Immobilier", description: "Informations légales de One City Immobilier. Contenu en cours de préparation.", indexable: false });

export default function LegalPage() {
  return <PendingContentPage title="Mentions légales" path="/mentions-legales" />;
}
