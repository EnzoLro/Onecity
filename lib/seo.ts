import type { Metadata, MetadataRoute } from "next";
import type { Program } from "@/data/programs";

export const siteName = "One City Immobilier";

type SeoEnvironment = { [key: string]: string | undefined; VERCEL_ENV?: string; SITE_URL?: string };

/** A canonical origin is supplied explicitly; deployment hosts are never inferred. */
export function getSeoConfig(env: SeoEnvironment = process.env) {
  let origin: string | undefined;
  if (env.SITE_URL) {
    const url = new URL(env.SITE_URL);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      throw new Error("SITE_URL doit être une origine HTTPS, sans chemin, identifiants, paramètres ou fragment.");
    }
    origin = url.origin;
  }
  return { origin, indexable: env.VERCEL_ENV === "production" && Boolean(origin) };
}

export const pageSeo = {
  home: {
    path: "/",
    title: "Promotion immobilière dans les Yvelines (78) | One City Immobilier",
    description: "Découvrez les programmes de One City Immobilier dans les Yvelines : C’Premium à Breuil-Bois-Robert et la réalisation Central Avenue à Hardricourt.",
  },
  contact: {
    path: "/contact",
    title: "Contact C’Premium à Breuil-Bois-Robert | One City Immobilier",
    description: "Une question sur C’Premium, un logement qui vous intéresse ? Échangez avec One City Immobilier sur votre futur logement à Breuil-Bois-Robert.",
  },
} as const;

type PageSeo = { path: string; title: string; description: string; indexable?: boolean; image?: { src: string; alt: string } };

/** Explicit editorial opt-in prevents future scaffolds entering search results. */
export function isProgramIndexable(program: Program) {
  return program.seo?.indexable === true && Boolean(program.editorial.detail);
}

export function createPageMetadata(page: PageSeo, env: SeoEnvironment = process.env): Metadata {
  const { origin, indexable } = getSeoConfig(env);
  const url = origin ? new URL(page.path, origin).href : undefined;
  const image = page.image ?? { src: "/brand/hero/architectural-model-background.png", alt: "Maquette architecturale d’une maison avec jardin" };
  const images = origin ? [{ url: new URL(image.src, origin).href, alt: image.alt }] : undefined;
  return {
    title: page.title,
    description: page.description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: indexable && page.indexable !== false, follow: true },
    openGraph: { type: "website", locale: "fr_FR", siteName, title: page.title, description: page.description, url, images },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: images?.map(({ url }) => url) },
  };
}

export function createProgramMetadata(program: Program, env: SeoEnvironment = process.env): Metadata {
  return createPageMetadata({
    path: `/projets/${program.slug}`,
    title: program.seo?.title ?? `${program.label} | ${siteName}`,
    description: program.seo?.description ?? `Page de présentation du programme ${program.label} de ${siteName}.`,
    indexable: isProgramIndexable(program),
    image: program.editorial.card?.image,
  }, env);
}

export function createSitemap(programs: readonly Program[], env: SeoEnvironment = process.env): MetadataRoute.Sitemap {
  const { origin, indexable } = getSeoConfig(env);
  if (!origin || !indexable) return [];
  return [pageSeo.home.path, pageSeo.contact.path, ...programs.filter(isProgramIndexable).map(({ slug }) => `/projets/${slug}`)]
    .map((path) => ({ url: new URL(path, origin).href }));
}

export function createRobots(env: SeoEnvironment = process.env): MetadataRoute.Robots {
  const { origin, indexable } = getSeoConfig(env);
  return indexable && origin
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${origin}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
