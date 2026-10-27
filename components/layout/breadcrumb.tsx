import Link from "next/link";
import { Container } from "@/components/ui";
import { getSeoConfig } from "@/lib/seo";
import { createBreadcrumbs } from "@/lib/structured-data";
import { JsonLd } from "./structured-data";
import "./breadcrumb.css";

export function Breadcrumb({ path, label }: { path: string; label: string }) {
  return <Container>
    <JsonLd data={createBreadcrumbs(getSeoConfig().origin, path, label)} />
    <nav aria-label="Fil d’Ariane" className="site-breadcrumb onecity-text-small">
      <ol><li><Link href="/">Accueil</Link></li><li aria-hidden="true">/</li><li aria-current="page">{label}</li></ol>
    </nav>
  </Container>;
}
