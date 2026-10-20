import type { Metadata } from "next";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata: Metadata = { title: "Mentions légales | OneCity", robots: { index: false } };

export default function LegalPage() {
  return <PendingContentPage title="Mentions légales" />;
}
