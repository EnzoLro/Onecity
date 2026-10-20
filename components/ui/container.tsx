import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/classnames";

type ContainerProps<TElement extends ElementType = "div"> = {
  as?: TElement;
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "className">;

export function Container<TElement extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? "div";

  return <Component className={cn("onecity-container", className)} {...props} />;
}
