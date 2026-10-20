import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/classnames";

const textVariants = {
  display: "onecity-text-display",
  heading: "onecity-text-heading",
  subtitle: "onecity-text-subtitle",
  "body-lg": "onecity-text-body-lg",
  body: "onecity-text-body",
} as const;

type TextVariant = keyof typeof textVariants;

type TextProps<TElement extends ElementType = "p"> = {
  as?: TElement;
  variant?: TextVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "className">;

export function Text<TElement extends ElementType = "p">({
  as,
  variant = "body",
  className,
  ...props
}: TextProps<TElement>) {
  const Component = as ?? "p";

  return <Component className={cn(textVariants[variant], className)} {...props} />;
}
