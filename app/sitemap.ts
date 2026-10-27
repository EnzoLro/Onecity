import { programs } from "@/data/programs";
import { createSitemap } from "@/lib/seo";

export default function sitemap() {
  return createSitemap(programs);
}
