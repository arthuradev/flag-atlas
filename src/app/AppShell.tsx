import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Icon, type IconName } from "@/shared/components/Icon";

type NavItem = {
  ariaLabel: string;
  icon: IconName;
  labelKey: string;
  to: string;
};

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: "home", labelKey: "app.name", ariaLabel: "abrir inicio" },
  { to: "/continents", icon: "compass", labelKey: "home.continents", ariaLabel: "abrir mapa" },
  { to: "/challenges", icon: "target", labelKey: "home.challenges", ariaLabel: "abrir modos" },
  { to: "/collection", icon: "collection", labelKey: "home.collection", ariaLabel: "abrir album" },
  {
    to: "/achievements",
    icon: "trophy",
    labelKey: "home.achievements",
    ariaLabel: "abrir premios",
  },
  { to: "/stats", icon: "chart", labelKey: "home.stats", ariaLabel: "abrir numeros" },
  { to: "/shop", icon: "shop", labelKey: "home.shop", ariaLabel: "abrir personalizacao" },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: "home", labelKey: "app.name", ariaLabel: "abrir inicio" },
  { to: "/continents", icon: "compass", labelKey: "home.continents", ariaLabel: "abrir mapa" },
  { to: "/collection", icon: "collection", labelKey: "home.collection", ariaLabel: "abrir album" },
  { to: "/challenges", icon: "target", labelKey: "home.challenges", ariaLabel: "abrir modos" },
];

function navItemClass(isActive: boolean, isCollapsed: boolean): string {
  return `flex min-h-11 items-center rounded-btn font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
    isCollapsed ? "justify-center px-0" : "gap-3 px-3"
  } ${
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-background/70 hover:bg-white/10 hover:text-background"
  }`;
}

function mobileNavItemClass(isActive: boolean): string {
  return `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-chip px-1 py-2 text-[0.68rem] font-extrabold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    isActive ? "text-primary" : "text-faint hover:text-text"
  }`;
}

export function AppShell() {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const desktopLabelClass = isSidebarCollapsed ? "sr-only" : "truncate";
  const sidebarToggleLabel = isSidebarCollapsed
    ? "Expandir barra lateral"
    : "Recolher barra lateral";

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-surface focus:px-4 focus:py-3 focus:font-extrabold focus:text-text focus:shadow-card"
      >
        {t("common.continue")}
      </a>

      <aside
        className={`hidden shrink-0 bg-ink text-background shadow-card transition-[width,padding] duration-200 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col ${
          isSidebarCollapsed ? "w-20 p-3" : "w-64 p-5"
        }`}
      >
        <div
          className={`mb-7 flex items-center ${isSidebarCollapsed ? "flex-col gap-3" : "gap-3"}`}
        >
          <Link
            to="/home"
            aria-label={t("app.name")}
            className={`flex min-w-0 items-center rounded-btn text-background transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSidebarCollapsed ? "justify-center p-1.5" : "flex-1 gap-3 p-2"
            }`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-sm">
              <Icon name="compass" size={25} strokeWidth={2.2} />
            </span>
            <span className={isSidebarCollapsed ? "sr-only" : "min-w-0"}>
              <span className="block truncate text-lg font-black leading-tight">
                {t("app.name")}
              </span>
              <span className="block truncate text-xs font-extrabold uppercase tracking-[0.16em] text-background/50">
                Terrain
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-expanded={!isSidebarCollapsed}
            aria-label={sidebarToggleLabel}
            title={sidebarToggleLabel}
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-btn border border-white/10 text-background/70 transition hover:bg-white/10 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <Icon name={isSidebarCollapsed ? "chevron-right" : "chevron-left"} size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5" aria-label={t("app.name")}>
          <NavLink
            to="/training"
            aria-label="iniciar treino"
            title={t("home.continueTraining")}
            className={({ isActive }) => navItemClass(isActive, isSidebarCollapsed)}
          >
            <Icon name="play" size={20} />
            <span className={desktopLabelClass}>{t("home.continueTraining")}</span>
          </NavLink>
          <div className="my-3 h-px bg-white/10" />
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              title={t(item.labelKey)}
              className={({ isActive }) => navItemClass(isActive, isSidebarCollapsed)}
            >
              <Icon name={item.icon} size={20} />
              <span className={desktopLabelClass}>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/settings"
          aria-label="abrir ajustes"
          title={t("home.settings")}
          className={({ isActive }) => navItemClass(isActive, isSidebarCollapsed)}
        >
          <Icon name="settings" size={20} />
          <span className={desktopLabelClass}>{t("home.settings")}</span>
        </NavLink>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-background/88 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-btn font-black text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-btn bg-ink text-platinum shadow-sm">
                <Icon name="compass" size={22} />
              </span>
              {t("app.name")}
            </Link>
            <Link
              to="/settings"
              aria-label={t("home.settings")}
              className="inline-flex size-10 items-center justify-center rounded-btn border border-line bg-surface text-muted shadow-sm transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="settings" size={20} />
            </Link>
          </div>
        </header>

        <main id="main-content" className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/94 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-18px_36px_-28px_rgba(22,35,29,0.65)] backdrop-blur lg:hidden"
        aria-label={t("app.name")}
      >
        <div className="mx-auto flex max-w-md items-end justify-between gap-1">
          {MOBILE_NAV_ITEMS.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              className={({ isActive }) => mobileNavItemClass(isActive)}
            >
              <Icon name={item.icon} size={21} />
              <span className="truncate">{t(item.labelKey)}</span>
            </NavLink>
          ))}

          <NavLink
            to="/training"
            aria-label={t("home.continueTraining")}
            className="mx-1 flex -translate-y-3 flex-col items-center justify-center rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-14 items-center justify-center rounded-btn bg-primary text-primary-foreground shadow-btn">
              <Icon name="play" size={25} fill="currentColor" strokeWidth={1.8} />
            </span>
          </NavLink>

          {MOBILE_NAV_ITEMS.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              className={({ isActive }) => mobileNavItemClass(isActive)}
            >
              <Icon name={item.icon} size={21} />
              <span className="truncate">{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
