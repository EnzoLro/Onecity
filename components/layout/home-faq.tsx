import { Accordion, Container, Section, Text } from "@/components/ui";
import { faqSection, homeFaq } from "@/data/faq";
import "./home-faq.css";

/** ENZ-59 / Figma 4035:792, using the shared single-open accordion. */
export function HomeFaq() {
  return (
    <Section id="faq" className="home-faq" aria-labelledby="faq-title">
      <Container className="home-faq__container">
        <div className="home-faq__heading">
          <Text variant="eyebrow" className="home-faq__label">{faqSection.label}</Text>
          <Text as="h2" variant="display" id="faq-title">{faqSection.title}</Text>
          <Text variant="body-lg" className="home-faq__introduction">{faqSection.introduction}</Text>
        </div>
        <Accordion
          className="home-faq__accordion"
          items={homeFaq}
          defaultOpenId={homeFaq[0]?.id}
          headingLevel={3}
        />
      </Container>
    </Section>
  );
}
