"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/classnames";

export type AccordionItem = { id: string; question: string; answer: ReactNode };
export type AccordionProps = {
  items: readonly AccordionItem[];
  defaultOpenId?: string;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

/** FAQ with one optional open panel. Item IDs must be unique and stable. */
export function Accordion({ items, defaultOpenId, headingLevel = 3, className }: AccordionProps) {
  const instanceId = useId();
  const [openId, setOpenId] = useState<string | undefined>(defaultOpenId);
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  if (!items.length) return null;

  return (
    <div className={cn("flex min-w-0 flex-col gap-2 bg-onecity-primary/4 p-2", className)}>
      {items.map((item, index) => {
        const open = openId === item.id;
        const triggerId = `${instanceId}-trigger-${index}`;
        const panelId = `${instanceId}-panel-${index}`;
        return (
          <div key={item.id} className="min-w-0 bg-onecity-surface">
            <Heading>
              <button
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? undefined : item.id)}
                className="flex w-full items-center gap-6 px-6 py-5 text-left text-base font-semibold leading-[normal] text-black hover:bg-onecity-primary/4 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onecity-primary"
              >
                <span className="min-w-0 flex-1 wrap-anywhere">{item.question}</span>
                <Image src={`/brand/interactive/accordion-${open ? "close" : "open"}.svg`} width={24} height={24} alt="" className="shrink-0" />
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!open} className="px-6 pb-6 text-base font-light leading-[normal] text-onecity-primary wrap-anywhere">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
