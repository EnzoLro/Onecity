import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/classnames";

const sectionSpacing = {
  default: "py-20 lg:py-30",
  compact: "py-13 lg:py-20",
  spacious: "py-30 lg:py-40",
} as const;

type SectionSpacing = keyof typeof sectionSpacing;

type SectionProps<TElement extends ElementType = "section"> = {
  as?: TElement;
  spacing?: SectionSpacing;
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "className">;

export function Section<TElement extends ElementType = "section">({
  as,
  spacing = "default",
  className,
  ...props
}: SectionProps<TElement>) {
  const Component = as ?? "section";

  return <Component className={cn(sectionSpacing[spacing], className)} {...props} />;
}
