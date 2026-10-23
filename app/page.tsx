import { HomeFaq } from "@/components/layout/home-faq";
import { HomeCta } from "@/components/layout/home-cta";
import { HomeHero } from "@/components/layout/home-hero";
import { FeaturedProject } from "@/components/layout/featured-project";
import { DesignApproach } from "@/components/layout/design-approach";
import { HomeTestimonials } from "@/components/layout/home-testimonials";
import { getHomeTestimonials } from "@/data/testimonials";
import { HomeProjects } from "@/components/layout/home-projects";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero projectsHref="#nos-projets" />
      <FeaturedProject />
      <DesignApproach />
      <HomeProjects />
      <HomeTestimonials {...getHomeTestimonials(process.env.VERCEL_ENV, process.env.NODE_ENV)} />
      <HomeFaq />
      <HomeCta />
    </main>
  );
}
