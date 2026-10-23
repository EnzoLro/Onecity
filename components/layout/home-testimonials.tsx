import { Container, Slider, TestimonialCard, Text } from "@/components/ui";
import type { Testimonial } from "@/data/testimonials";
import "./home-testimonials.css";

/** Figma 4035:773. Only the caller decides which approved content can be shown. */
export function HomeTestimonials({ items, notice }: { items: readonly Testimonial[]; notice?: string }) {
  if (!items.length) return null;

  return (
    <section className="home-testimonials" aria-labelledby="testimonials-title">
      <Container className="home-testimonials__container">
        <div className="home-testimonials__heading">
          <Text variant="eyebrow" className="home-testimonials__label">Leur expérience</Text>
          <Text as="h2" id="testimonials-title" variant="heading">
            Pensés sur plan.<br />Appréciés au quotidien.
          </Text>
        </div>
        <div className="home-testimonials__content">
          <Slider
            label={notice ? "Démonstration du carrousel — avis fictif" : "Témoignages clients"}
            items={items.map(({ id, ...testimonial }) => ({ id, content: <TestimonialCard {...testimonial} /> }))}
          />
        </div>
      </Container>
    </section>
  );
}
