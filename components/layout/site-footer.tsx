import Image from "next/image";
import { Container } from "@/components/ui";
import { contact, projects } from "@/data/navigation";
import "./site-footer.css";

type FooterLink = { label: string; href: string };

type SiteFooterProps = {
  address: readonly string[];
  phone: FooterLink;
  socialLinks: readonly (FooterLink & { icon: "instagram" | "linkedin" })[];
  legalLinks: readonly FooterLink[];
};

/** Shared footer; destinations are supplied only once confirmed. */
export function SiteFooter({ address, phone, socialLinks, legalLinks }: SiteFooterProps) {
  return (
    <footer className="site-footer onecity-text-body" aria-label="Pied de page">
      <div className="site-footer__decoration" aria-hidden="true" />
      <Container className="site-footer__container">
        <div className="site-footer__content">
          <div className="site-footer__brand">
            <a href="/" aria-label="Onecity immobilier — Accueil" className="site-footer__logo">
              <Image src="/brand/footer/logo-mark.svg" alt="" width={65.0142} height={52} />
              <Image src="/brand/footer/logo-wordmark.svg" alt="" width={150.291} height={43.801} />
            </a>
            <p className="onecity-text-small">Promotion immobilière et valorisation de biens dans les Yvelines et en Île-de-France.</p>
            {socialLinks.length > 0 && (
              <ul className="site-footer__socials" aria-label="Réseaux sociaux">
                {socialLinks.map(({ label, href, icon }) => (
                  <li key={icon}>
                    <a href={href} aria-label={`${label} — nouvelle fenêtre`} target="_blank" rel="noopener noreferrer">
                      <Image src={`/brand/footer/${icon}.svg`} alt="" width={24} height={24} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="site-footer__columns">
            <nav aria-labelledby="footer-navigation-title" className="site-footer__navigation">
              <h2 className="onecity-text-caption-title" id="footer-navigation-title">Navigation</h2>
              <ul>
                <li><a href="/">Accueil</a></li>
                <li><a href={contact.href}>Contact</a></li>
              </ul>
            </nav>
            <nav aria-labelledby="footer-projects-title">
              <h2 className="onecity-text-caption-title" id="footer-projects-title">Projets</h2>
              <ul>
                {projects.map(({ label, href }) => <li key={href}><a href={href}>{label}</a></li>)}
              </ul>
            </nav>
            <section aria-labelledby="footer-contact-title">
              <h2 className="onecity-text-caption-title" id="footer-contact-title">Contact</h2>
              <address>
                <p>{address.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
                <a href={contact.href}>{contact.href.replace("mailto:", "")}</a>
                <a href={phone.href}>{phone.label}</a>
              </address>
            </section>
          </div>
        </div>
        <div className="site-footer__credits">
          <div className="site-footer__divider" aria-hidden="true" />
          <div className="site-footer__credits-row onecity-text-small">
            <p>© 2026 Onecity immobilier. All rights reserved.</p>
            {legalLinks.length > 0 && (
              <nav aria-label="Informations légales">
                <ul className="site-footer__legal-links">
                  {legalLinks.map(({ label, href }) => <li key={href}><a href={href}>{label}</a></li>)}
                </ul>
              </nav>
            )}
            <p className="site-footer__author">Site créé par <a href="https://www.enzolouro.fr/" target="_blank" rel="noopener noreferrer">Enzo LOURO<span className="sr-only"> — nouvelle fenêtre</span></a></p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
