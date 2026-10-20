"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/classnames";

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
    setActive(next);
    viewport.current?.scrollTo({ left: next * viewport.current.clientWidth, behavior: "instant" });
  }

  if (!items.length) return null;

  return (
    <section aria-label={label} aria-roledescription="carrousel" className={cn("min-w-0 bg-onecity-primary/4 p-2", className)}>
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
      {items.length > 1 ? (
        <div role="group" aria-label="Choisir une diapositive" className="mt-2 flex justify-center">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-label={`Afficher la diapositive ${index + 1} sur ${items.length}`}
              aria-controls={`${instanceId}-slide-${index}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => select(index)}
              className="flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onecity-primary"
            >
              <span aria-hidden="true" className={cn("size-2 rounded-full", index === current ? "bg-onecity-primary" : "bg-onecity-primary/24")} />
            </button>
          ))}
        </div>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Diapositive {current + 1} sur {items.length}</p>
    </section>
  );
}
