import type { Metadata } from "next";
import { inter, parkinsans } from "./fonts";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { projects, contact } from "@/data/navigation";
import { footer } from "@/data/footer";

export const metadata: Metadata = {
  title: "One City Immobilier",
  description: "De la conception aux finitions, One City Immobilier imagine des projets à taille humaine, pensés pour offrir plus de confort, de performance et de qualité au quotidien.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${parkinsans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Aller au contenu</a>
        <SiteHeader projects={projects} contact={contact} />
        {children}
        <SiteFooter {...footer} />
      </body>
    </html>
  );
}
