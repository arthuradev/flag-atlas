import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type PageShellProps = {
  title?: string;
  backTo?: string;
  children: ReactNode;
};

export function PageShell({ title, backTo, children }: PageShellProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-8">
      {(title || backTo) && (
        <header className="flex min-h-16 items-center gap-2 py-3">
          {backTo && (
            <Link
              to={backTo}
              aria-label={t("common.back")}
              className="inline-flex size-11 items-center justify-center rounded-2xl text-text-muted transition hover:bg-surface-raised hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
          )}
          {title && <h1 className="text-xl font-extrabold">{title}</h1>}
        </header>
      )}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
