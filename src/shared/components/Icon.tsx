import { type SVGProps, useId } from "react";

export type IconName =
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
  | "x"
  | "x-circle"
  | "zap";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "height" | "viewBox" | "width"> & {
  name: IconName;
  size?: number | string;
  title?: string;
};

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
