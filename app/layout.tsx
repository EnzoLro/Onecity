import type { Metadata } from "next";
import { inter, parkinsans } from "./fonts";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { projects, contact } from "@/data/navigation";

export const metadata: Metadata = {
  title: "OneCity",
  description: "Technical foundation for the OneCity website.",
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
      </body>
    </html>
  );
}
