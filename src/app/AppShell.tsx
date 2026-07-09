import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { avatarStyleClass } from "@/features/cosmetics/logic/avatarStyles";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { FlaggoLogo } from "@/shared/brand/FlaggoLogo";
import { Orbi } from "@/shared/brand/Orbi";
import { Icon, type IconName } from "@/shared/components/Icon";

type NavItem = {
  icon: IconName;
  labelKey: string;
  to: string;
};

/** Navegação primária do desktop: as 4 áreas fortes da jornada. */
const PRIMARY_NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: "home", labelKey: "nav.learn" },
  { to: "/continents", icon: "globe", labelKey: "nav.continents" },
  { to: "/collection", icon: "collection", labelKey: "nav.collection" },
  { to: "/expeditions", icon: "compass", labelKey: "nav.expeditions" },
];

/** Áreas secundárias do desktop, agrupadas sob "Mais". */
const SECONDARY_NAV_ITEMS: NavItem[] = [
  { to: "/achievements", icon: "trophy", labelKey: "nav.achievements" },
  { to: "/shop", icon: "shop", labelKey: "nav.shop" },
];

/** Bottom nav mobile: exatamente 5 áreas. Conquistas e Loja vivem no Perfil. */
const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: "home", labelKey: "nav.learn" },
  { to: "/continents", icon: "globe", labelKey: "nav.continents" },
  { to: "/collection", icon: "collection", labelKey: "nav.collection" },
  { to: "/expeditions", icon: "compass", labelKey: "nav.expeditions" },
  { to: "/profile", icon: "user", labelKey: "nav.profile" },
];

/** Iniciais do jogador para o avatar (até 2 letras, ex.: "Arthur Silva" -> "AS"). */
export function playerInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  const letters = words.slice(0, 2).map((word) => word[0] ?? "");
  return letters.join("").toUpperCase();
}

function desktopNavItemClass(isActive: boolean): string {
  return `flex min-h-11 items-center gap-3 rounded-btn px-3 text-[0.92rem] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
    isActive
      ? "bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_rgba(0,0,0,0.6)]"
      : "text-sidebar-fg-muted hover:bg-white/10 hover:text-sidebar-fg"
  }`;
}

function desktopSecondaryNavItemClass(isActive: boolean): string {
  return `flex min-h-10 items-center gap-2.5 rounded-chip px-3 text-[0.82rem] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-sidebar-fg-muted hover:bg-white/10 hover:text-sidebar-fg"
  }`;
}

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const level = useProgressStore((state) => state.progress.level);
  const playerName = useOnboardingStore((state) => state.playerName);
  const avatarCosmeticId = useEquippedId("avatarCosmetic");
  const isTrainingRoute = location.pathname.startsWith("/training");
  // Fim de lição é uma tela-momento: sem bottom nav competindo com os CTAs.
  const isResultRoute = location.pathname.startsWith("/session-result");

  const displayName = playerName.trim() || t("profile.player");
  const initials = playerInitials(displayName);

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
          aria-label={t("app.name")}
          className="z-40 hidden w-[260px] shrink-0 flex-col overflow-y-auto bg-sidebar px-4 py-5 text-sidebar-fg lg:fixed lg:inset-y-0 lg:left-0 lg:flex"
        >
          <Link
            to="/home"
            aria-label={t("app.name")}
            className="mb-5 flex items-center gap-3 rounded-btn p-1.5 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-[#0A1E33] p-1.5 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.6)]">
              <Orbi expression="sorriso" flag={false} feet={false} tone="dark" />
            </span>
            <span className="min-w-0">
              <FlaggoLogo size={19} className="text-sidebar-fg" />
              <span className="block truncate text-[0.69rem] font-bold leading-tight text-sidebar-fg-muted">
                {t("app.taglineShort")}
              </span>
            </span>
          </Link>

          <nav className="flex flex-col gap-1.5" aria-label={t("nav.primaryLabel")}>
            {PRIMARY_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => desktopNavItemClass(isActive)}
              >
                <Icon name={item.icon} size={20} />
                <span className="min-w-0 truncate">{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mx-1.5 my-3 flex items-center gap-2.5">
            <span className="text-[0.63rem] font-extrabold uppercase tracking-[0.16em] text-sidebar-fg-muted">
              {t("nav.more")}
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <nav className="flex flex-col gap-1" aria-label={t("nav.more")}>
            {SECONDARY_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => desktopSecondaryNavItemClass(isActive)}
              >
                <Icon name={item.icon} size={17} />
                <span className="min-w-0 truncate">{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex min-w-0 flex-1 items-center gap-3 rounded-btn p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive ? "bg-white/10" : "hover:bg-white/10"
                }`
              }
            >
              <span
                className={`flex size-[42px] shrink-0 items-center justify-center rounded-[13px] text-[15px] font-black tracking-tight text-white shadow-[0_0_0_3px_rgba(255,255,255,0.08)] ${avatarStyleClass(avatarCosmeticId)}`}
              >
                {initials || <Icon name="user" size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-sidebar-fg">
                  {displayName}
                </span>
                <span className="block truncate text-[0.69rem] font-bold text-sidebar-fg-muted">
                  {t("nav.profileLevel", { level })}
                </span>
              </span>
            </NavLink>
            <NavLink
              to="/settings"
              aria-label={t("home.settings")}
              title={t("home.settings")}
              className={({ isActive }) =>
                `inline-flex size-10 shrink-0 items-center justify-center rounded-btn transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-fg-muted hover:bg-white/10 hover:text-sidebar-fg"
                }`
              }
            >
              <Icon name="settings" size={19} />
            </NavLink>
          </div>
        </aside>
      )}

      <div className={`flex min-h-dvh min-w-0 flex-col ${isTrainingRoute ? "" : "lg:pl-[260px]"}`}>
        <main
          id="main-content"
          className={
            isTrainingRoute
              ? "min-w-0 flex-1 overflow-hidden"
              : "mobile-safe-top min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8"
          }
        >
          <Outlet />
        </main>
      </div>

      {!isTrainingRoute && !isResultRoute && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_26px_-18px_rgba(0,0,0,0.55)] backdrop-blur lg:hidden"
          aria-label={t("nav.primaryLabel")}
        >
          <div className="mx-auto flex max-w-md items-end gap-0.5">
            {MOBILE_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-btn py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-full max-w-[3.25rem] items-center justify-center rounded-[11px] transition ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[0_8px_16px_-7px_var(--fa-primary)]"
                          : "bg-transparent text-faint"
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span
                      className={`truncate text-[0.62rem] leading-none ${
                        isActive ? "font-black text-primary" : "font-bold text-faint"
                      }`}
                    >
                      {t(item.labelKey)}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
