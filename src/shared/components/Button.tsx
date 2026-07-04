import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-btn hover:bg-pine-hover active:translate-y-[3px] active:shadow-none disabled:shadow-none",
  secondary:
    "border border-line-strong bg-surface text-primary shadow-sm hover:bg-surface-2 active:bg-surface",
  ghost: "bg-transparent text-text hover:bg-surface-2 active:bg-surface",
  danger:
    "bg-danger text-white shadow-sm hover:brightness-105 active:translate-y-px active:brightness-95",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-10 rounded-chip px-4 text-sm",
  md: "min-h-12 rounded-btn px-5 text-base",
  lg: "min-h-14 rounded-btn px-7 text-lg",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-extrabold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
