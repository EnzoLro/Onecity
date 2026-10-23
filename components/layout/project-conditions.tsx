import { Container, Section, Text } from "@/components/ui";
import type { ProjectConditionData } from "@/data/programs";

/** Conditions supplied by the project owner, targeted by the commercial footnotes. */
export function ProjectConditions({ conditions }: { conditions: readonly ProjectConditionData[] }) {
  if (conditions.length === 0) return null;
  return (
    <Section spacing="compact" className="project-conditions" aria-labelledby="project-conditions-title">
      <Container>
        <Text as="h2" variant="heading" id="project-conditions-title">Conditions des dispositifs</Text>
        {conditions.map((condition) => (
          <section key={condition.id} id={condition.id} className="project-conditions__item" aria-labelledby={`${condition.id}-title`} tabIndex={-1}>
            <Text as="h3" variant="title" id={`${condition.id}-title`}>{condition.title}</Text>
            <Text className="mt-4">{condition.text}</Text>
          </section>
        ))}
      </Container>
    </Section>
  );
}
