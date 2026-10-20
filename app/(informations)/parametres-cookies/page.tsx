import type { Metadata } from "next";
import { PendingContentPage } from "@/components/layout/pending-content-page";

export const metadata: Metadata = { title: "Paramètres des cookies | OneCity", robots: { index: false } };

export default function CookiesPage() {
  return <PendingContentPage title="Paramètres des cookies" />;
}
