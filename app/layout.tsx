import { Analytics } from "@/components/analytics/analytics";
import { programs } from "@/data/programs";
import type { Metadata } from "next";
import { getSeoConfig, siteName } from "@/lib/seo";
import { inter, parkinsans } from "./fonts";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { projects, contact } from "@/data/navigation";
import { footer } from "@/data/footer";
import { createOrganization } from "@/lib/structured-data";
import { JsonLd } from "@/components/layout/structured-data";
import { organization } from "@/data/organization";

const seoConfig = getSeoConfig();
export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.origin),
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
        <JsonLd data={createOrganization(seoConfig.origin, { ...organization, name: siteName, email: contact.href.replace("mailto:", ""), telephone: footer.phone.href.replace("tel:", ""), address: footer.address })} />
        <a href="#main-content" className="skip-link">Aller au contenu</a>
        <SiteHeader projects={projects} contact={{ ...contact, href: contact.pageHref }} />
        {children}
        <SiteFooter {...footer} />
        <Analytics environment={process.env.VERCEL_ENV} programs={programs.map((program) => ({ slug: program.slug, homes: program.editorial.detail?.homes.items.map(({ id }) => id) ?? [] }))} />
      </body>
    </html>
  );
}
