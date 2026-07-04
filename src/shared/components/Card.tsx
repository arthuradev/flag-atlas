import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "default" | "raised" | "quiet" | "ink";
};

const VARIANT_CLASSES = {
  default: "border-line bg-surface shadow-card",
  raised: "border-line bg-surface shadow-card",
  quiet: "border-line bg-surface-2 shadow-none",
  ink: "border-transparent bg-ink text-background shadow-card",
} as const;

export function Card({ className = "", children, variant = "default", ...rest }: CardProps) {
  return (
    <div className={`rounded-card border p-6 ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
