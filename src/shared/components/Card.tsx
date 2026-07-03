import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-border bg-surface p-6 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
