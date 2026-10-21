"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/classnames";
import "./slider.css";

export type SliderItem = { id: string; content: ReactNode };
export type SliderProps = { items: readonly SliderItem[]; label: string; className?: string };

/** Native scroll-snap slider; no autoplay. Item IDs must be unique and stable. */
export function Slider({ items, label, className }: SliderProps) {
  const instanceId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const current = Math.min(active, Math.max(0, items.length - 1));

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({ left: activeRef.current * element.clientWidth, behavior: "instant" });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);

  function select(index: number) {
    const next = Math.max(0, Math.min(index, items.length - 1));
    activeRef.current = next;
    viewport.current?.scrollTo({
      left: next * viewport.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section aria-label={label} aria-roledescription="carrousel" className={cn("min-w-0 bg-onecity-primary/4 p-2", className)}>
      <div className="slider__stage"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || items.length < 2) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - bounds.left) / bounds.width;
          event.currentTarget.dataset.direction = ratio < 0.25 && current > 0 ? "previous" : ratio > 0.75 && current < items.length - 1 ? "next" : "";
        }}
        onPointerLeave={(event) => { delete event.currentTarget.dataset.direction; }}
        onClick={(event) => {
          if (event.detail === 0 || window.getSelection()?.toString()) return;
          if ((event.target as HTMLElement).closest("a, button, input, textarea, select")) return;
          const direction = event.currentTarget.dataset.direction;
          if (direction) select(current + (direction === "next" ? 1 : -1));
        }}
      >
      <div
        ref={viewport}
        role="group"
        tabIndex={items.length > 1 ? 0 : undefined}
        aria-label="Diapositives — flèches gauche et droite pour naviguer"
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onecity-primary"
        onScroll={(event) => {
          const element = event.currentTarget;
          const next = Math.max(0, Math.min(items.length - 1, Math.round(element.scrollLeft / element.clientWidth)));
          activeRef.current = next;
          setActive(next);
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          select(event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1));
        }}
      >
        {items.map((item, index) => (
          <div
            id={`${instanceId}-slide-${index}`}
            key={item.id}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${items.length}`}
            aria-hidden={index !== current}
            inert={index !== current}
            className="min-w-0 basis-full shrink-0 snap-start snap-always"
          >
            {item.content}
          </div>
        ))}
      </div>
      </div>
      {items.length > 1 ? (
        <div role="group" aria-label="Choisir une diapositive" className="slider__controls">
          <button type="button" className="slider__arrow" aria-label="Avis précédent" disabled={current === 0} onClick={() => select(current - 1)}><span aria-hidden="true">←</span></button>
          <div className="slider__dots">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-label={`Afficher la diapositive ${index + 1} sur ${items.length}`}
              aria-controls={`${instanceId}-slide-${index}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => select(index)}
              className="slider__dot"
            >
              <span aria-hidden="true" className={cn("size-2 rounded-full", index === current ? "bg-onecity-primary" : "bg-onecity-primary/24")} />
            </button>
          ))}
          </div>
          <button type="button" className="slider__arrow" aria-label="Avis suivant" disabled={current === items.length - 1} onClick={() => select(current + 1)}><span aria-hidden="true">→</span></button>
        </div>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Diapositive {current + 1} sur {items.length}</p>
    </section>
  );
}
