"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

/** Text-only hover card; clicking pins the description inline on every screen. */
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
    <div className="project-condition" data-inline={clicked}>
      <div className="project-condition__heading">
        {icon}
        <button type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-description`} className="project-condition__trigger" onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && window.matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches) setHovered(true);
        }} onPointerLeave={() => setHovered(false)} onClick={() => {
          setHovered(false);
          setClicked(!clicked);
        }}>
          <span>{label}<sup>{marker}</sup></span>
        </button>
      </div>
      <div id={`${id}-description`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open} className="project-condition__description">
        <p>{text}</p>
      </div>
    </div>
  );
}
