import type { Program } from "@/data/programs";

export type StructuredData = Record<string, unknown>;

/** Native script content must not be able to close its HTML element. */
export function serializeStructuredData(data: StructuredData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function createOrganization(origin: string, identity: { name: string; email: string; telephone: string; address: readonly string[]; legalName: string; siren: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: identity.name,
    legalName: identity.legalName,
    identifier: { "@type": "PropertyValue", propertyID: "SIREN", value: identity.siren },
    url: `${origin}/`,
    email: identity.email,
    telephone: identity.telephone,
    address: identity.address.join(", "),
  };
}

export function createBreadcrumbs(origin: string, path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${origin}${path}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: label, item: `${origin}${path}` },
    ],
  };
}

/** Only explicitly documented apartment programmes qualify; never infer from marketing copy. */
export function createProgramStructuredData(origin: string, program: Program) {
  const detail = program.editorial.detail;
  const source = program.structuredData;
  if (!source || !detail || program.seo?.indexable !== true) return null;
  const url = `${origin}/projets/${program.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${url}#residence`,
    name: program.label,
    url,
    address: { "@type": "PostalAddress", ...source.address },
    containsPlace: detail.homes.items.map((home) => ({
      "@type": "Apartment",
      "@id": `${url}#home-${home.id}`,
      name: `Logement ${home.type} · ${home.area} m²`,
      floorSize: { "@type": "QuantitativeValue", value: home.area, unitCode: "MTK" },
    })),
  };
}
