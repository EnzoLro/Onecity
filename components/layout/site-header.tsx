"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, type KeyboardEvent } from "react";
import { Container } from "@/components/ui/container";
import { StyledLink } from "@/components/ui/button";
import "./site-header.css";

export type HeaderLink = Readonly<{ label: string; href: string }>;

type SiteHeaderProps = Readonly<{
  projects: readonly HeaderLink[];
  contact: HeaderLink;
}>;

/** Global navigation; destinations are supplied by the site's confirmed routing. */
export function SiteHeader({ projects, contact }: SiteHeaderProps) {
  const pathname = usePathname();
  const disclosure = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);

  function closeMenu() {
    if (disclosure.current) disclosure.current.open = false;
  }

  function onEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && disclosure.current?.open) {
      event.preventDefault();
      closeMenu();
      summary.current?.focus();
    }
  }

  const projectLinks = projects.map(({ label, href }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <a
        key={href}
        href={href}
        className="site-header__link onecity-text-navigation"
        aria-current={active ? "page" : undefined}
        onClick={closeMenu}
      >
        {label}
      </a>
    );
  });

  return (
    <header className="site-header" onKeyDown={onEscape}>
      <Container className="site-header__inner">
        <a href="/" className="site-header__brand" aria-label="OneCity Immobilier — Accueil">
          <Image src="/brand/logos/onecity-logo.svg" alt="OneCity Immobilier" width={177} height={40} priority />
        </a>
        <nav className="site-header__desktop" aria-label="Projets immobiliers">
          {projectLinks}
        </nav>
        <StyledLink href={contact.href} variant="primary" className="site-header__contact site-header__desktop-contact">
          {contact.label}
        </StyledLink>
        <details ref={disclosure} className="site-header__mobile">
          <summary ref={summary} className="site-header__toggle onecity-text-small">Menu</summary>
          <nav className="site-header__panel" aria-label="Navigation mobile">
            {projectLinks}
            <StyledLink href={contact.href} variant="primary" className="site-header__contact" onClick={closeMenu}>
              {contact.label}
            </StyledLink>
          </nav>
        </details>
      </Container>
    </header>
  );
}
