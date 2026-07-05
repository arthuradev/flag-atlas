import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

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
    <div className={`mx-auto flex min-h-full w-full flex-col ${WIDTH_CLASSES[width]} lg:min-h-0`}>
      {(title || backTo) && (
        <header className="mb-5 flex min-h-14 items-center gap-3">
          {backTo && (
            <Link
              to={backTo}
              aria-label={t("common.back")}
              className="inline-flex size-11 items-center justify-center rounded-btn border border-line bg-surface text-muted shadow-sm transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon name="chevron-left" size={23} strokeWidth={2.4} />
            </Link>
          )}
          {title && <h1 className="text-2xl font-black text-text sm:text-3xl">{title}</h1>}
        </header>
      )}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
