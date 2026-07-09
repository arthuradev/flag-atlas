import { type SVGProps, useId } from "react";

/**
 * Flaggo icon system.
 *
 * One line-icon language for the whole product: 24×24 grid, `fill="none"`,
 * `stroke="currentColor"`, 2px stroke, round caps/joins — extended from the
 * original nav set. "Hero" icons (achievements, shop previews, continents)
 * add a soft duotone fill of the SAME color (`currentColor` +
 * low `fillOpacity`) so they read richer without leaving the line language
 * or breaking `currentColor` theming.
 *
 * Icons are decorative by default (`aria-hidden`); pass `title` to give one an
 * accessible name (it then becomes `role="img"` + `<title>`).
 */
export type IconName =
  // — UI / navigation (original set) —
  | "arrow-left"
  | "arrow-right"
  | "chart"
  | "check"
  | "check-circle"
  | "chevron-left"
  | "chevron-right"
  | "coin"
  | "collection"
  | "compass"
  | "flame"
  | "gem"
  | "globe"
  | "heart"
  | "home"
  | "keyboard"
  | "layers"
  | "lock"
  | "map"
  | "percent"
  | "play"
  | "refresh"
  | "search"
  | "settings"
  | "shield"
  | "shield-check"
  | "shop"
  | "sparkles"
  | "target"
  | "trophy"
  | "user"
  | "x"
  | "x-circle"
  | "zap"
  // — achievements —
  | "footprints"
  | "globe-half"
  | "medal"
  | "backpack"
  | "gems"
  | "crown"
  | "seal-check"
  // — cosmetics: themes —
  | "waves"
  | "planet"
  | "book"
  | "minimal"
  // — cosmetics: sounds —
  | "volume"
  | "volume-off"
  | "music"
  | "gamepad"
  | "waveform"
  // — cosmetics: frames —
  | "square"
  | "leaf"
  | "ban"
  // — cosmetics: effects & status —
  | "star"
  | "party"
  | "activity"
  | "snowflake"
  | "share"
  | "sprout"
  | "palette"
  // — continents —
  | "continent-americas"
  | "continent-europe"
  | "continent-africa"
  | "continent-asia"
  | "continent-oceania";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "height" | "viewBox" | "width"> & {
  name: IconName;
  size?: number | string;
  title?: string;
};

/** Faint globe graticule shared by the continent icons. */
function GlobeFrame({ ring = 0.4, line = 0.28 }: { ring?: number; line?: number }) {
  return (
    <>
      <circle cx="12" cy="12" r="9" strokeOpacity={ring} />
      <path d="M3.2 12h17.6" strokeOpacity={line} />
      <path d="M12 3.1c2.6 2.4 2.6 15.4 0 17.8" strokeOpacity={line} />
      <path d="M12 3.1c-2.6 2.4-2.6 15.4 0 17.8" strokeOpacity={line} />
    </>
  );
}

function IconPaths({ name }: { name: IconName }) {
  switch (name) {
    case "arrow-left":
      return (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      );
    case "arrow-right":
      return (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16V9" />
          <path d="M12 16v-5" />
          <path d="M16 16V7" />
        </>
      );
    case "check":
      return <path d="m5 12 4.2 4.2L19 6.5" />;
    case "check-circle":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.2 2.6 2.6L16.5 9" />
        </>
      );
    case "chevron-left":
      return <path d="m15 18-6-6 6-6" />;
    case "chevron-right":
      return <path d="m9 18 6-6-6-6" />;
    case "coin":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8" />
          <path d="M9.5 10.2c.6-.7 1.5-1.1 2.7-1.1 1.4 0 2.3.6 2.3 1.6 0 2.5-5 1-5 3.5 0 1 .9 1.7 2.5 1.7 1.2 0 2.2-.4 2.9-1.2" />
        </>
      );
    case "collection":
      return (
        <>
          <path d="m4 7 8-4 8 4-8 4-8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 17 8 4 8-4" />
        </>
      );
    case "compass":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2.2 5.1-4.8 1.9 2.2-5.1 4.8-1.9Z" />
        </>
      );
    case "flame":
      return (
        <>
          <path d="M12 22c3.3 0 6-2.5 6-5.9 0-2.6-1.5-4.5-3.1-6.1-.9-.9-1.7-2-1.6-3.6 0-.8-.7-1.3-1.4-.9C9.8 6.8 7 9.9 7 14.2" />
          <path d="M10 17.2c0-1.6 1.1-2.8 2-3.7.9.9 2 2.1 2 3.7a2 2 0 1 1-4 0Z" />
        </>
      );
    case "gem":
      return (
        <>
          <path d="M6.5 3.5h11L22 9l-10 12L2 9l4.5-5.5Z" />
          <path d="M2 9h20" />
          <path d="m7 9 5 12 5-12" />
          <path d="m8 3.5 4 5.5 4-5.5" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21" />
          <path d="M12 3c-2.3 2.4-3.5 5.4-3.5 9s1.2 6.6 3.5 9" />
        </>
      );
    case "heart":
      return (
        <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1Z" />
      );
    case "home":
      return (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10.5V21h14V10.5" />
          <path d="M9.5 21v-6h5v6" />
        </>
      );
    case "keyboard":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M7 9h.01" />
          <path d="M11 9h.01" />
          <path d="M15 9h.01" />
          <path d="M19 9h.01" />
          <path d="M7 13h.01" />
          <path d="M11 13h.01" />
          <path d="M15 13h.01" />
          <path d="M8 17h8" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
          <path d="m3 17 9 5 9-5" />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      );
    case "map":
      return (
        <>
          <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
          <path d="M9 3v15" />
          <path d="M15 6v15" />
        </>
      );
    case "percent":
      return (
        <>
          <path d="m19 5-14 14" />
          <circle cx="7" cy="7" r="2.2" />
          <circle cx="17" cy="17" r="2.2" />
        </>
      );
    case "play":
      return <path d="M8 5v14l11-7-11-7Z" />;
    case "refresh":
      return (
        <>
          <path d="M20 11a8 8 0 0 0-14.2-4.9L4 8" />
          <path d="M4 4v4h4" />
          <path d="M4 13a8 8 0 0 0 14.2 4.9L20 16" />
          <path d="M16 16h4v4" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </>
      );
    case "shield":
      return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />;
    case "shield-check":
      return (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m8.6 12 2.2 2.2 4.8-5" />
        </>
      );
    case "shop":
      return (
        <>
          <path d="M6 8h12l-1 13H7L6 8Z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
          <path d="M8 8 9 3h6l1 5" />
        </>
      );
    case "sparkles":
      return (
        <>
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
          <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
          <path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" />
        </>
      );
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </>
      );
    case "trophy":
      return (
        <>
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
          <path d="M7 6H4a3 3 0 0 0 3 3" />
          <path d="M17 6h3a3 3 0 0 1-3 3" />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
        </>
      );
    case "x":
      return (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      );
    case "x-circle":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </>
      );
    case "zap":
      return <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />;

    // ————————————————————— achievements —————————————————————
    case "footprints":
      return (
        <>
          <ellipse
            cx="8.5"
            cy="11"
            rx="2.4"
            ry="3.6"
            transform="rotate(-16 8.5 11)"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <circle cx="11.6" cy="7.3" r="0.85" />
          <circle cx="9.6" cy="6.1" r="0.85" />
          <ellipse
            cx="15.5"
            cy="16"
            rx="2.4"
            ry="3.6"
            transform="rotate(-16 15.5 16)"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <circle cx="18.6" cy="12.3" r="0.85" />
          <circle cx="16.6" cy="11.1" r="0.85" />
        </>
      );
    case "globe-half":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 3v18" />
        </>
      );
    case "medal":
      return (
        <>
          <path d="M9 3l2.4 4.6" />
          <path d="M15 3l-2.4 4.6" />
          <circle cx="12" cy="14" r="5.4" fill="currentColor" fillOpacity="0.16" />
          <path d="M12 11.5l.9 1.85 2.05.3-1.48 1.44.35 2.03L12 16.2l-1.82.95.35-2.03-1.48-1.44 2.05-.3.9-1.85Z" />
        </>
      );
    case "backpack":
      return (
        <>
          <path
            d="M7 10a5 5 0 0 1 10 0v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8Z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M9.5 10a2.5 2.5 0 0 1 5 0" />
          <path d="M9 14.2h6" />
          <path d="M10.6 20v-3.4h2.8V20" />
        </>
      );
    case "gems":
      return (
        <>
          <path d="M6 9.2h8l-4 7.8L6 9.2Z" fill="currentColor" fillOpacity="0.16" />
          <path d="M6 9.2l2-3.2h4l2 3.2" />
          <path d="M6 9.2h8" />
          <path d="M8.3 9.2 10 17 11.7 9.2" />
          <path d="M17.6 5.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z" />
        </>
      );
    case "crown":
      return (
        <>
          <path
            d="M4 8.5l3.5 3.2L12 5.5l4.5 6.2L20 8.5l-1.4 9.5H5.4L4 8.5Z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M5.4 18h13.2" />
        </>
      );
    case "seal-check":
      return (
        <>
          <circle cx="12" cy="10" r="6" fill="currentColor" fillOpacity="0.16" />
          <path d="M8.7 15.1l-1 5.9 4.3-2.2 4.3 2.2-1-5.9" />
          <path d="M9.3 10l1.9 1.9 3.6-3.8" />
        </>
      );

    // ————————————————————— cosmetics: themes —————————————————————
    case "waves":
      return (
        <>
          <path d="M3 8c1.6-1.4 3.4-1.4 5 0s3.4 1.4 5 0 3.4-1.4 5 0" />
          <path d="M3 12c1.6-1.4 3.4-1.4 5 0s3.4 1.4 5 0 3.4-1.4 5 0" />
          <path d="M3 16c1.6-1.4 3.4-1.4 5 0s3.4 1.4 5 0 3.4-1.4 5 0" />
        </>
      );
    case "planet":
      return (
        <>
          <circle cx="12" cy="11" r="5.4" fill="currentColor" fillOpacity="0.18" />
          <path d="M7 15.2c-2.4.9-3.9 2-3.6 3 .4 1.4 4.6 1.2 9.4-.6 4.8-1.8 8.2-4.3 7.8-5.7-.2-.9-1.6-1.2-3.6-1" />
        </>
      );
    case "book":
      return (
        <>
          <path
            d="M5 5.5A2.5 2.5 0 0 1 7.5 3H18v14H7.5A2.5 2.5 0 0 0 5 19.5z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H18" />
        </>
      );
    case "minimal":
      return (
        <>
          <rect x="5" y="5" width="14" height="14" rx="4.5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </>
      );

    // ————————————————————— cosmetics: sounds —————————————————————
    case "volume":
      return (
        <>
          <path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5z" fill="currentColor" fillOpacity="0.16" />
          <path d="M15 10a3 3 0 0 1 0 4" />
          <path d="M17.5 7.7a6.5 6.5 0 0 1 0 8.6" />
        </>
      );
    case "volume-off":
      return (
        <>
          <path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5z" fill="currentColor" fillOpacity="0.16" />
          <path d="M15.5 10l4 4" />
          <path d="M19.5 10l-4 4" />
        </>
      );
    case "music":
      return (
        <>
          <path d="M9 17V6l9-1.8V15" />
          <circle cx="6.8" cy="17" r="2.2" fill="currentColor" fillOpacity="0.16" />
          <circle cx="15.8" cy="15" r="2.2" fill="currentColor" fillOpacity="0.16" />
          <path d="M9 9.2l9-1.8" />
        </>
      );
    case "gamepad":
      return (
        <>
          <path
            d="M7.5 9h9a4 4 0 0 1 3.9 3.1l.4 3.1a2.2 2.2 0 0 1-4 1.5L15.5 15h-7l-1.3 1.7a2.2 2.2 0 0 1-4-1.5l.4-3.1A4 4 0 0 1 7.5 9z"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <path d="M7 12v2.2" />
          <path d="M5.9 13.1h2.2" />
          <circle cx="15.4" cy="12.4" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="17.1" cy="14" r="0.7" fill="currentColor" stroke="none" />
        </>
      );
    case "waveform":
      return (
        <>
          <path d="M5 10.5v3" />
          <path d="M8.5 7.5v9" />
          <path d="M12 5.5v13" />
          <path d="M15.5 8.5v7" />
          <path d="M19 10.5v3" />
        </>
      );

    // ————————————————————— cosmetics: frames —————————————————————
    case "square":
      return (
        <>
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="15"
            rx="3.5"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <rect x="8.3" y="8.3" width="7.4" height="7.4" rx="1.8" />
        </>
      );
    case "leaf":
      return (
        <>
          <path
            d="M5 19c0-7.5 4.8-13 14-13 0 8.5-4.8 13.5-14 13z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path d="M8 16c2.5-3 4.5-5 7.5-7" />
        </>
      );

    case "ban":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M6 6l12 12" />
        </>
      );

    // ————————————————————— effects & status —————————————————————
    case "star":
      return (
        <path
          d="M12 3.6l2.5 5.6 6.1.5-4.6 4 1.4 6-5.4-3.2-5.4 3.2 1.4-6-4.6-4 6.1-.5z"
          fill="currentColor"
          fillOpacity="0.16"
        />
      );
    case "party":
      return (
        <>
          <path d="M4 20l4.6-12.6 8 8L4 20z" fill="currentColor" fillOpacity="0.16" />
          <path d="M8.6 7.4l8 8" />
          <path d="M14 4.6l.4 1.4M17.6 6l1.3-.5M18.6 10.6l1.4.4M15.9 3.7l1 1" />
        </>
      );
    case "activity":
      return <path d="M3 12h3.5l2-5.5 4 11 2-5.5H21" />;
    case "snowflake":
      return (
        <>
          <path d="M12 3v18" />
          <path d="M4.2 7.5l15.6 9" />
          <path d="M19.8 7.5 4.2 16.5" />
          <path d="M12 6.4l-2-1.2M12 6.4l2-1.2" />
          <path d="M12 17.6l-2 1.2M12 17.6l2 1.2" />
          <path d="M4.9 9.1l.1-2.3 2.3.1M19.1 14.9l-.1 2.3-2.3-.1M4.9 14.9l2.3.1-.1 2.3M19.1 9.1l-2.3-.1.1-2.3" />
        </>
      );
    case "share":
      return (
        <>
          <circle cx="6" cy="12" r="2.4" />
          <circle cx="17" cy="6" r="2.4" />
          <circle cx="17" cy="18" r="2.4" />
          <path d="M8.2 10.9l6.6-3.7" />
          <path d="M8.2 13.1l6.6 3.7" />
        </>
      );
    case "sprout":
      return (
        <>
          <path d="M12 21v-8" />
          <path
            d="M12 13c0-3.2 2-5.4 5.2-5.4 0 3.2-2 5.4-5.2 5.4z"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path
            d="M12 15.5c-3 0-4.8-2-4.8-5 3 0 4.8 2 4.8 5z"
            fill="currentColor"
            fillOpacity="0.16"
          />
        </>
      );
    case "palette":
      return (
        <>
          <path
            d="M12 3.5c-4.9 0-9 3.6-9 8 0 3.6 2.9 5.5 5.4 5.5 1.4 0 2-1 2-2 0-1.4-1.4-1.6-1.4-3 0-1 .8-1.6 1.9-1.6H17a4.5 4.5 0 0 0 4-4.4c0-4-4-7.5-9-7.5z"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8.4" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
        </>
      );

    // ————————————————————— continents —————————————————————
    case "continent-americas":
      return (
        <>
          <GlobeFrame />
          <path
            d="M11 5c1.8 0 2.6 1.5 2.1 3-.3.9-1.1 1.2-1.1 2.1 0 .9.8 1.2.8 2.1 0 1.4-1.4 1.8-1.4 3.4 0 1.5.9 2.6.4 4.1-.3.9-.9 1.6-1.7 1.4-.9-.2-1-1.5-.8-2.7.2-1.4.9-2.2.7-3.6-.2-1.1-1.1-1.4-1.1-2.5 0-1 .7-1.5.7-2.4 0-1.3-1.2-2-.8-3.4.3-1 1.1-1.5 2-1.5z"
            fill="currentColor"
            fillOpacity="0.26"
          />
        </>
      );
    case "continent-europe":
      return (
        <>
          <GlobeFrame />
          <path
            d="M9.6 7.2c1.4-1.1 3.4-1 4.8-.2.9.5 1.7.3 1.9 1.4.2 1-.8 1.6-.8 2.6 0 .9.7 1.7-.2 2.2-.9.5-1.9-.3-2.9 0-1 .3-1.4 1.5-2.5 1.2-1-.3-.9-1.6-1.6-2.3-.7-.7-1.9-.6-2-1.7-.1-1 .9-1.4 1.3-2z"
            fill="currentColor"
            fillOpacity="0.26"
          />
        </>
      );
    case "continent-africa":
      return (
        <>
          <GlobeFrame />
          <path
            d="M12 5c2.6 0 4.4 1.3 4.4 2.9 0 1.1-.9 1.6-.9 2.7 0 1.4-.9 2.4-1.4 3.8-.5 1.4-.5 3.3-2.1 3.3-1.6 0-1.6-1.9-2.1-3.3-.5-1.4-1.4-2.4-1.4-3.8 0-1.1-.9-1.6-.9-2.7C7.6 6.3 9.4 5 12 5z"
            fill="currentColor"
            fillOpacity="0.26"
          />
        </>
      );
    case "continent-asia":
      return (
        <>
          <GlobeFrame />
          <path
            d="M7 7c1.8-1.3 4.4-1.2 6.7-.9 1.8.2 3.9.1 4.6 1.3.55 1-.65 1.9-.85 3-.2 1 .75 1.9-.05 2.6-.9.8-2.2.2-3.3.6-1.2.4-1.5 1.9-2.8 1.7-1-.15-1-1.6-1.7-2.4-.85-.95-2.4-.75-3-1.8-.55-.95.35-2-.15-3-.4-.85-1.35-1.35-.75-2.4z"
            fill="currentColor"
            fillOpacity="0.26"
          />
        </>
      );
    case "continent-oceania":
      return (
        <>
          <GlobeFrame line={0.24} />
          <path
            d="M9 12.5c1-1.5 3.5-1.9 5.2-1 1.3.85 1.7 2.8.6 3.9-1.15 1.05-3.5 1.05-5 .4-1-.45-1.5-2.1-.8-3.3z"
            fill="currentColor"
            fillOpacity="0.26"
          />
          <circle cx="17.4" cy="8.3" r="1" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="16.6" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="16.8" cy="16.1" r="0.7" fill="currentColor" stroke="none" />
        </>
      );

    default:
      return null;
  }
}

export function Icon({
  name,
  size = 20,
  title,
  strokeWidth = 2,
  className = "",
  ...rest
}: IconProps) {
  const titleId = useId();

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Icons are decorative by default and receive a title when they need an accessible name.
    <svg
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      height={size}
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...rest}
    >
      {title && <title id={titleId}>{title}</title>}
      <IconPaths name={name} />
    </svg>
  );
}
