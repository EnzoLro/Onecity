import type { Metadata } from "next";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata: Metadata = { title: "Politique de confidentialité | OneCity", robots: { index: false } };

export default function PrivacyPage() {
  return <PendingContentPage title="Politique de confidentialité" />;
}
