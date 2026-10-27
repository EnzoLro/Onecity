import type { Metadata } from "next";
import Image from "next/image";
import { Container, Section, Text } from "@/components/ui";
import { HomeTestimonials } from "@/components/layout/home-testimonials";
import { HomeFaq } from "@/components/layout/home-faq";
import { getHomeTestimonials } from "@/data/testimonials";
import { ProjectContactForm } from "@/components/layout/project-contact-form";
import { contact } from "@/data/navigation";
import { footer } from "@/data/footer";
import { getProgram, hasDetailContent } from "@/data/programs";
import { isContactConfigured } from "@/lib/project-contact";
import "@/components/layout/project-detail.css";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact — C’Premium | OneCity",
  description: "Une question sur C’Premium, un logement qui vous intéresse ? Échangez avec One City Immobilier sur votre futur logement à Breuil-Bois-Robert.",
};

/** ENZ-68: direct enquiry layout approved by Enzo, with shared testimonials and FAQ. */
export default function ContactPage() {
  const project = getProgram("c-premium");
  if (!project || !hasDetailContent(project)) throw new Error("Le contenu contact C’Premium est manquant.");
  const { detail } = project.editorial;
  const emailHref = `${contact.href}?subject=${encodeURIComponent(`Demande d’informations · ${project.label}`)}`;

  return (
    <main id="main-content" tabIndex={-1} className="contact-page project-detail">
      <Section id="demande-informations" aria-labelledby="enquiry-title">
        <Container className="project-detail__contact">
          <div className="project-detail__copy">
            <Text variant="eyebrow" className="project-detail__label">À votre écoute</Text>
            <Text as="h1" variant="heading" id="enquiry-title">Parlons de votre futur logement.</Text>
            <Text className="project-detail__muted">Plans, surfaces, prestations ou financement : partagez vos questions et vos envies avec One City Immobilier.</Text>
            <address className="contact-page__channels">
              <div><Text variant="eyebrow"><Image src="/brand/contact/mail.svg" alt="" width={20} height={20} />Nous écrire</Text><a className="onecity-text-body-lg" href={emailHref}>{contact.href.replace("mailto:", "")}</a><Text variant="small">Pour recevoir les informations du projet.</Text></div>
              <div><Text variant="eyebrow"><Image src="/brand/contact/phone.svg" alt="" width={20} height={20} />Nous appeler</Text><a className="onecity-text-body-lg" href={footer.phone.href}>{footer.phone.label}</a><Text variant="small">Pour échanger directement avec notre équipe.</Text></div>
            </address>
          </div>
          <ProjectContactForm projectSlug={project.slug} projectLabel={project.label} homes={detail.homes.items} sendingEnabled={isContactConfigured({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM })} />
        </Container>
      </Section>
      <HomeTestimonials {...getHomeTestimonials(process.env.VERCEL_ENV, process.env.NODE_ENV)} />
      <HomeFaq />
    </main>
  );
}
