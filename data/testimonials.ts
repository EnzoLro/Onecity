import type { TestimonialCardProps } from "@/components/ui";

export type Testimonial = TestimonialCardProps & { id: string };

// Exact content from Figma 4035:780. Fictional, confirmed by Enzo; never a real review.
export const figmaTestimonial: TestimonialCardProps = {
  quote: "« On remarque vite que les choix ont été faits pour le confort au quotidien. L’agencement est pratique, les volumes sont agréables et le logement est très confortable, notamment sur le plan thermique. »",
  author: "Sophie Lambert",
  location: "Breuil-Bois-Robert",
  image: { src: "/brand/interactive/testimonial-interior.png", alt: "" },
};

// Add only validated real reviews, with the exact publishable author, inhabited
// project in `location`, approved quote and authorized image. No real reviews supplied yet.
export const approvedTestimonials: readonly Testimonial[] = [];

// Enzo approved three repetitions for Preview on 21 October 2026.
export const demoTestimonials: readonly Testimonial[] = [1, 2, 3].map((number) => ({
  id: `figma-demo-${number}`,
  ...figmaTestimonial,
}));

export const testimonialDemoNotice = "Avis fictif — maquette. Le même avis est répété sur trois diapositives pour démontrer la navigation.";

/** Fail closed: unknown environments and production never receive fictional reviews. */
export function getHomeTestimonials(environment: string | undefined, nodeEnvironment: string | undefined) {
  const demo = approvedTestimonials.length === 0 && (
    environment === "preview" || (environment === undefined && nodeEnvironment === "development")
  );
  return {
    items: demo ? demoTestimonials : approvedTestimonials,
    notice: demo ? testimonialDemoNotice : undefined,
  };
}
