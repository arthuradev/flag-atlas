import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { PageTransition } from "./PageTransition";

type PageShellWidth = "default" | "wide";

type PageShellProps = {
  title?: string;
  backTo?: string;
  width?: PageShellWidth;
  children: ReactNode;
};

const WIDTH_CLASSES: Record<PageShellWidth, string> = {
  default: "max-w-4xl",
  wide: "max-w-6xl",
};

export function PageShell({ title, backTo, width = "default", children }: PageShellProps) {
  const { t } = useTranslation();

  return (
    <PageTransition
      className={`mx-auto flex min-h-full w-full flex-col ${WIDTH_CLASSES[width]} lg:min-h-0`}
    >
      {(title || backTo) && (
        <header className="mb-5 flex min-h-12 items-center gap-3">
          {backTo && (
            <Link
              to={backTo}
              aria-label={t("common.back")}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon name="chevron-left" size={22} strokeWidth={2.4} />
            </Link>
          )}
          {title && (
            <h1 className="text-[25px] font-black tracking-[-0.02em] text-text">{title}</h1>
          )}
        </header>
      )}
      <main className="flex flex-1 flex-col">{children}</main>
    </PageTransition>
  );
}
