import { createPageMetadata } from "@/lib/seo";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata = createPageMetadata({ path: "/parametres-cookies", title: "Paramètres des cookies | One City Immobilier", description: "Paramètres des cookies de One City Immobilier. Contenu en cours de préparation.", indexable: false });

export default function CookiesPage() {
  return <PendingContentPage title="Paramètres des cookies" path="/parametres-cookies" />;
}
