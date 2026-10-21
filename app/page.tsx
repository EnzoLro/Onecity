import { HomeHero } from "@/components/layout/home-hero";
import { FeaturedProject } from "@/components/layout/featured-project";
import { DesignApproach } from "@/components/layout/design-approach";
import { HomeProjects } from "@/components/layout/home-projects";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero projectsHref="#nos-projets" />
      <FeaturedProject />
      <DesignApproach />
      <HomeProjects />
    </main>
  );
}
