import type { Metadata } from "next";
import { getSeoConfig, siteName } from "@/lib/seo";
import { inter, parkinsans } from "./fonts";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { projects, contact } from "@/data/navigation";
import { footer } from "@/data/footer";

const seoConfig = getSeoConfig();
export const metadata: Metadata = {
  metadataBase: seoConfig.origin ? new URL(seoConfig.origin) : null,
  title: siteName,
  robots: { index: seoConfig.indexable, follow: true },
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
        <SiteHeader projects={projects} contact={{ ...contact, href: contact.pageHref }} />
        {children}
        <SiteFooter {...footer} />
      </body>
    </html>
  );
}
