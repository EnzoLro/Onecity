import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, StyledLink, Text } from "@/components/ui";
import { projects, contact } from "@/data/navigation";
import { cPremium } from "@/data/c-premium";
import { FeaturedProject } from "@/components/layout/featured-project";
import { ProjectConditions } from "@/components/layout/project-conditions";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

type ProjectPageProps = { params: Promise<{ slug: string }> };

async function getProject(params: ProjectPageProps["params"]) {
  const { slug } = await params;
  if (slug === cPremium.slug) return cPremium;
  return projects.find((project) => project.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  return { title: `${project.label} | OneCity` };
}

/** C’Premium shares its confirmed facts with home; other projects remain scaffolds. */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params);

  if (project.slug === cPremium.slug) {
    return (
      <main id="main-content" tabIndex={-1}>
        <FeaturedProject detail />
        <ProjectConditions />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <Section spacing="compact">
        <Container>
          <Text as="h1" variant="display">{project.label}</Text>
          <StyledLink href={contact.href} variant="primary" className="mt-8">
            {contact.label}
          </StyledLink>
        </Container>
      </Section>
    </main>
  );
}
