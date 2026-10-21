"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

/** Inline disclosure on touch screens; hover card on desktop with keyboard dismissal. */
export function ProjectCondition({ label, marker, text, icon }: { label: string; marker?: string; text: string; icon: ReactNode }) {
  const id = useId();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = clicked || hovered;

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setClicked(false);
        setHovered(false);
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <div className="project-condition" onPointerEnter={(event) => {
      if (event.pointerType === "mouse" && window.matchMedia("(min-width: 64rem) and (hover: hover)").matches) setHovered(true);
    }} onPointerLeave={() => setHovered(false)} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setClicked(false);
    }}>
      <button type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-description`} className="project-condition__trigger" onClick={() => {
        setHovered(false);
        setClicked(!open);
      }}>
        {icon}
        <span>{label}<sup>{marker}</sup></span>
      </button>
      <div id={`${id}-description`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open} className="project-condition__description">
        <p>{text}</p>
      </div>
    </div>
  );
}
