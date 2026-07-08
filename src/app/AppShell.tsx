import { type KeyboardEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { getLevelProgress } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { BrandImage } from "@/shared/brand/BrandImage";
import { Icon, type IconName } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";

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

/** Atalhos do menu de perfil — só rotas que já existem no app. */
const PROFILE_MENU_ITEMS: NavItem[] = [
  { to: "/collection", icon: "collection", labelKey: "home.collection", ariaLabel: "abrir album" },
  {
    to: "/achievements",
    icon: "trophy",
    labelKey: "home.achievements",
    ariaLabel: "abrir premios",
  },
  { to: "/stats", icon: "chart", labelKey: "home.stats", ariaLabel: "abrir numeros" },
  { to: "/settings", icon: "settings", labelKey: "home.settings", ariaLabel: "abrir ajustes" },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: "home", labelKey: "app.name", ariaLabel: "abrir inicio" },
  { to: "/continents", icon: "compass", labelKey: "home.continents", ariaLabel: "abrir mapa" },
  { to: "/collection", icon: "collection", labelKey: "home.collection", ariaLabel: "abrir album" },
  { to: "/challenges", icon: "target", labelKey: "home.challenges", ariaLabel: "abrir modos" },
];

function navItemClass(isActive: boolean, isCollapsed: boolean): string {
  return `flex min-h-11 items-center rounded-btn font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
    isCollapsed ? "justify-center px-0" : "gap-3 px-3"
  } ${
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-sidebar-fg-muted hover:bg-white/10 hover:text-sidebar-fg"
  }`;
}

function mobileNavItemClass(isActive: boolean): string {
  return `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-chip px-1 py-2 text-[0.68rem] font-extrabold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    isActive ? "text-primary" : "text-faint hover:text-text"
  }`;
}

/** Rótulo textual do item, mostrado só com a sidebar expandida. */
function SidebarLabel({ children, isCollapsed }: { children: string; isCollapsed: boolean }) {
  if (isCollapsed) {
    return null;
  }
  return <span className="min-w-0 truncate whitespace-nowrap">{children}</span>;
}

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const level = useProgressStore((state) => state.progress.level);
  const totalXp = useProgressStore((state) => state.progress.totalXp);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const levelProgress = getLevelProgress(totalXp);
  const isTrainingRoute = location.pathname.startsWith("/training");

  // Sidebar aberta por padrão no desktop para a Home parecer um painel de jogo.
  // A largura é CSS puro (não framer), então a expansão funciona mesmo com
  // "reduzir animações" (aí a transição some, mas o trilho ainda abre).
  const [isExpanded, setExpanded] = useState(true);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const isCollapsed = !isExpanded;

  const expandSidebar = () => {
    setExpanded(true);
  };

  const collapseSidebar = () => {
    setExpanded(false);
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    if (!isExpanded) {
      return;
    }
    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isExpanded]);

  const handleSidebarKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && isExpanded) {
      collapseSidebar();
    }
  };

  const transitionClass = reduceMotion
    ? ""
    : "transition-[width,padding,box-shadow] duration-300 ease-out";

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-surface focus:px-4 focus:py-3 focus:font-extrabold focus:text-text focus:shadow-card"
      >
        {t("common.continue")}
      </a>

      {!isTrainingRoute && (
        <aside
          onKeyDown={handleSidebarKeyDown}
          aria-label={t("app.name")}
          className={`z-40 hidden shrink-0 flex-col overflow-hidden border-r border-white/10 bg-sidebar text-sidebar-fg lg:fixed lg:inset-y-0 lg:left-0 lg:flex ${transitionClass} ${
            isExpanded
              ? "w-[280px] p-[18px] shadow-[18px_0_48px_-24px_rgba(0,0,0,0.75)]"
              : "w-20 p-3"
          }`}
        >
          <div className={`mb-6 flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
            {isCollapsed ? (
              <button
                type="button"
                aria-label={t("app.openSidebar")}
                aria-expanded={isExpanded}
                title={t("app.openSidebar")}
                onClick={expandSidebar}
                className="flex size-14 items-center justify-center rounded-btn text-sidebar-fg transition hover:bg-white/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-btn bg-[#EAF6F8] p-1 shadow-sm ring-1 ring-white/15">
                  <BrandImage asset="globi" decorative className="size-10" />
                </span>
              </button>
            ) : (
              <>
                <Link
                  to="/home"
                  aria-label={t("app.name")}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-btn p-1.5 text-sidebar-fg transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-btn bg-[#EAF6F8] p-1 shadow-sm ring-1 ring-white/15">
                    <BrandImage asset="globi" decorative className="size-10" />
                  </span>
                  <span className="min-w-0 overflow-hidden whitespace-nowrap">
                    <span className="block truncate text-lg font-black leading-tight">
                      {t("app.name")}
                    </span>
                    <span className="block truncate text-xs font-bold leading-tight text-sidebar-fg-muted">
                      {t("app.tagline")}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label={t("app.closeSidebar")}
                  aria-expanded={isExpanded}
                  title={t("app.closeSidebar")}
                  onClick={collapseSidebar}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-btn text-sidebar-fg-muted transition hover:bg-white/10 hover:text-sidebar-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon name="x" size={20} strokeWidth={2.4} />
                </button>
              </>
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-1.5" aria-label={t("app.name")}>
            {PRIMARY_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.ariaLabel}
                title={t(item.labelKey)}
                className={({ isActive }) => navItemClass(isActive, isCollapsed)}
              >
                <Icon name={item.icon} size={20} />
                <SidebarLabel isCollapsed={isCollapsed}>{t(item.labelKey)}</SidebarLabel>
              </NavLink>
            ))}
          </nav>

          <div className="relative mt-2 border-t border-white/10 pt-2">
            {isProfileMenuOpen && (
              <div
                role="menu"
                aria-label={t("profile.menuLabel")}
                className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-0.5 rounded-btn border border-white/10 bg-sidebar-raised p-1.5 shadow-card"
              >
                {PROFILE_MENU_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-chip px-3 py-2 text-sm font-bold text-sidebar-fg-muted transition hover:bg-white/10 hover:text-sidebar-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon name={item.icon} size={18} />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            )}

            <div className={`flex items-center gap-2 ${isCollapsed ? "flex-col" : ""}`}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-label={t("profile.openMenu")}
                onClick={() => {
                  if (isCollapsed) {
                    setExpanded(true);
                    setProfileMenuOpen(true);
                    return;
                  }
                  setProfileMenuOpen((open) => !open);
                }}
                className={`flex min-w-0 items-center rounded-btn text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isCollapsed ? "justify-center p-1.5" : "flex-1 gap-3 p-1.5"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-sm ring-2 ring-white/10">
                  {level}
                </span>
                {!isCollapsed && (
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <span className="block truncate text-sm font-extrabold text-sidebar-fg">
                      {t("profile.player")}
                    </span>
                    <span className="block truncate text-xs font-bold text-sidebar-fg-muted">
                      {t("home.level", { level })}
                    </span>
                    <ProgressBar
                      value={levelProgress.currentLevelXp}
                      max={Math.max(1, levelProgress.xpForNextLevel)}
                      label={t("home.levelProgress")}
                      size="thin"
                      colorClassName="bg-primary"
                    />
                  </span>
                )}
              </button>

              <NavLink
                to="/settings"
                aria-label={t("home.settings")}
                title={t("home.settings")}
                onClick={() => setProfileMenuOpen(false)}
                className={({ isActive }) =>
                  `inline-flex size-10 shrink-0 items-center justify-center rounded-btn transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-fg-muted hover:bg-white/10 hover:text-sidebar-fg"
                  }`
                }
              >
                <Icon name="settings" size={20} />
              </NavLink>
            </div>
          </div>
        </aside>
      )}

      <div
        className={`flex min-h-dvh min-w-0 flex-col ${
          isTrainingRoute ? "" : isExpanded ? "lg:pl-[280px]" : "lg:pl-20"
        } ${transitionClass}`}
      >
        {!isTrainingRoute && (
          <header className="sticky top-0 z-30 border-b border-line bg-background/88 px-4 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
              <Link
                to="/home"
                className="inline-flex items-center gap-2 rounded-btn font-black text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-10 items-center justify-center overflow-hidden rounded-btn bg-[#EAF6F8] p-0.5 shadow-sm ring-1 ring-line">
                  <BrandImage asset="globi" decorative className="size-8" />
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
        )}

        <main
          id="main-content"
          className={
            isTrainingRoute
              ? "min-w-0 flex-1 overflow-hidden"
              : "min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:flex lg:flex-col lg:px-10 lg:pb-16 lg:pt-8 lg:[justify-content:safe_center]"
          }
        >
          <Outlet />
        </main>
      </div>

      {!isTrainingRoute && (
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
      )}
    </div>
  );
}
