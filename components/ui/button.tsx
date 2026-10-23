import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/classnames";

const interactiveBase =
  "inline-flex max-w-full items-center justify-center gap-2 rounded-none border text-center onecity-text-label transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const interactiveVariants = {
  primary: "border-transparent bg-onecity-primary text-onecity-surface hover:bg-onecity-primary-hover active:bg-onecity-primary-active focus-visible:outline-onecity-primary",
  secondary:
    "border-onecity-primary bg-onecity-surface text-onecity-primary hover:bg-onecity-primary/8 active:bg-onecity-primary/16 focus-visible:outline-onecity-primary",
  ghost:
    "border-transparent bg-transparent text-onecity-primary hover:bg-onecity-primary/8 active:bg-onecity-primary/16 focus-visible:outline-onecity-primary",
  inverse:
    "border-transparent bg-onecity-surface text-onecity-primary hover:bg-onecity-background active:bg-onecity-surface/80 focus-visible:outline-onecity-surface",
} as const;

const interactiveSizes = {
  default: "min-h-11 px-6 py-[11px]",
  large: "min-h-14 px-8 py-4",
} as const;

export type ButtonVariant = keyof typeof interactiveVariants;
export type ButtonSize = keyof typeof interactiveSizes;

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type StyledLinkProps = ComponentPropsWithRef<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

/** Native action button; defaults to type="button" to avoid accidental submits. */
export function Button({
  variant = "primary",
  size = "default",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        interactiveBase,
        interactiveSizes[size],
        interactiveVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** Navigation CTA sharing Button styles; disabled links have no destination. */
export function StyledLink({
  variant = "secondary",
  size = "default",
  className,
  disabled = false,
  href,
  onClick,
  tabIndex,
  ...props
}: StyledLinkProps) {
  return (
    <a
      {...props}
      href={disabled ? undefined : href}
      role={disabled ? "link" : props.role}
      aria-disabled={disabled || props["aria-disabled"]}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={disabled ? undefined : onClick}
      className={cn(
        interactiveBase,
        interactiveSizes[size],
        interactiveVariants[variant],
        className,
      )}
    />
  );
}
