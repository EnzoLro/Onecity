import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, StyledLink, Text } from "@/components/ui";
import { projects, contact } from "@/data/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

type ProjectPageProps = { params: Promise<{ slug: string }> };

async function getProject(params: ProjectPageProps["params"]) {
  const { slug } = await params;
  return projects.find((project) => project.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  return { title: `${project.label} | OneCity` };
}

/** Route scaffold only: project presentations need their own validated content. */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params);

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
