import { useId, useSyncExternalStore } from "react";

/**
 * Orbi — the official Flaggo mascot, as a parametric SVG component.
 *
 * Ported from the Claude Design mascot source so the same little globe can
 * smile, cheer or wink, carry its flag, and float/wave/blink across the whole
 * product (onboarding today, more later). Colours are baked per `tone`; the
 * ambient animations are plain CSS classes (see index.css) so they respect
 * `prefers-reduced-motion` for free — callers additionally gate them via the
 * in-app "reduce motion" setting by simply not passing the flags.
 */

export type OrbiTone = "color" | "dark" | "solid-ink" | "solid-cloud" | "mono-ink" | "mono-cloud";
export type OrbiVariant = "full" | "compact";
export type OrbiExpression = "sorriso" | "alegre" | "piscada";

type OrbiColors = {
  outline: string;
  ocean: string;
  land: string;
  cheek: string;
  eye: string;
  eyeHi: string;
  mouth: string;
  mast: string;
  knob: string;
  knobStroke: string;
  cloth: string;
  clothStroke: string;
  grat: string;
  gratOp: number;
  foot: string;
};

function resolveColors(tone: Exclude<OrbiTone, "mono-ink" | "mono-cloud">): OrbiColors {
  if (tone === "dark") {
    return {
      outline: "#EAF6F8",
      ocean: "#17B4C9",
      land: "#2FB98A",
      cheek: "#FF6F61",
      eye: "#12303B",
      eyeHi: "#FFFFFF",
      mouth: "#12303B",
      mast: "#EAF6F8",
      knob: "#FFC53D",
      knobStroke: "#0E2530",
      cloth: "#FF6F61",
      clothStroke: "#0E2530",
      grat: "#0E2530",
      gratOp: 0.22,
      foot: "#EAF6F8",
    };
  }
  if (tone === "solid-ink" || tone === "solid-cloud") {
    const k = tone === "solid-ink" ? "#12303B" : "#EAF6F8";
    const w = tone === "solid-ink" ? "#FFFFFF" : "#0E2530";
    return {
      outline: k,
      ocean: k,
      land: k,
      cheek: k,
      eye: w,
      eyeHi: w,
      mouth: w,
      mast: k,
      knob: k,
      knobStroke: k,
      cloth: k,
      clothStroke: k,
      grat: k,
      gratOp: 0,
      foot: k,
    };
  }
  return {
    outline: "#12303B",
    ocean: "#17B4C9",
    land: "#2FB98A",
    cheek: "#FF6F61",
    eye: "#12303B",
    eyeHi: "#FFFFFF",
    mouth: "#12303B",
    mast: "#12303B",
    knob: "#FFC53D",
    knobStroke: "#12303B",
    cloth: "#FF6F61",
    clothStroke: "#12303B",
    grat: "#12303B",
    gratOp: 0.12,
    foot: "#12303B",
  };
}

type OrbiProps = {
  tone?: OrbiTone | "auto";
  variant?: OrbiVariant;
  expression?: OrbiExpression;
  flag?: boolean;
  feet?: boolean;
  ground?: boolean;
  float?: boolean;
  wave?: boolean;
  blink?: boolean;
  size?: number | string;
  className?: string;
  /** Accessible name. When omitted the mascot is decorative (aria-hidden). */
  title?: string;
};

/** Reads the resolved light/dark scheme so `tone="auto"` picks a legible mascot. */
function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export function useBrandTone(): "color" | "dark" {
  const scheme = useSyncExternalStore(
    subscribeTheme,
    () => getComputedStyle(document.documentElement).colorScheme,
    () => "light",
  );
  return scheme.includes("dark") ? "dark" : "color";
}

export function Orbi({
  tone = "auto",
  variant = "full",
  expression = "sorriso",
  flag = true,
  feet = true,
  ground = false,
  float = false,
  wave = false,
  blink = false,
  size = "100%",
  className = "",
  title,
}: OrbiProps) {
  const autoTone = useBrandTone();
  const titleId = useId();
  const resolvedTone = tone === "auto" ? autoTone : tone;
  const isLine = resolvedTone === "mono-ink" || resolvedTone === "mono-cloud";
  const isSolid = resolvedTone === "solid-ink" || resolvedTone === "solid-cloud";
  const full = variant === "full";
  const dim = typeof size === "number" ? `${size}px` : size;

  const showFeet = feet && full;
  const showDecor = full && !isLine && !isSolid;

  const floatClass = float ? "fa-orbi-float" : "";
  const waveClass = wave ? "fa-orbi-wave" : "";
  const blinkClass = blink ? "fa-orbi-blink" : "";

  const ink = resolvedTone === "mono-cloud" ? "#EAF6F8" : "#12303B";

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative by default; receives a title only when named.
    <svg
      viewBox="0 0 256 256"
      width={dim}
      height={dim}
      style={{ display: "block", overflow: "visible" }}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && <title id={titleId}>{title}</title>}
      {isLine ? (
        <g>
          {showFeet && (
            <>
              <rect x="100" y="197" width="27" height="20" rx="10" fill={ink} />
              <rect x="129" y="197" width="27" height="20" rx="10" fill={ink} />
            </>
          )}
          <ellipse cx="128" cy="124" rx="78" ry="75" fill="none" stroke={ink} strokeWidth="8" />
          <path
            d="M56 128 C92 143 164 143 200 128"
            fill="none"
            stroke={ink}
            strokeOpacity="0.4"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="106" cy="118" r="3.2" fill={ink} />
          <circle cx="150" cy="118" r="3.2" fill={ink} />
          <path
            d="M104 148 Q128 168 152 148"
            fill="none"
            stroke={ink}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {flag && (
            <g
              stroke={ink}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <line x1="154.5" y1="33" x2="154.5" y2="57" />
              <path d="M159 34 C176 30 193 31 201 39 L192 47 L201 55 C191 60 173 58 159 54 Z" />
              <circle cx="154.5" cy="31" r="5" />
            </g>
          )}
        </g>
      ) : (
        <FillOrbi
          colors={resolveColors(resolvedTone as Exclude<OrbiTone, "mono-ink" | "mono-cloud">)}
          expression={expression}
          showDecor={showDecor}
          showFeet={showFeet}
          ground={ground}
          flag={flag}
          floatClass={floatClass}
          waveClass={waveClass}
          blinkClass={blinkClass}
          ink={ink}
        />
      )}
    </svg>
  );
}

type FillOrbiProps = {
  colors: OrbiColors;
  expression: OrbiExpression;
  showDecor: boolean;
  showFeet: boolean;
  ground: boolean;
  flag: boolean;
  floatClass: string;
  waveClass: string;
  blinkClass: string;
  ink: string;
};

function FillOrbi({
  colors: c,
  expression,
  showDecor,
  showFeet,
  ground,
  flag,
  floatClass,
  waveClass,
  blinkClass,
  ink,
}: FillOrbiProps) {
  return (
    <g style={{ transformBox: "fill-box", transformOrigin: "center 76%" }}>
      {ground && <ellipse cx="128" cy="228" rx="52" ry="8" fill={ink} opacity="0.1" />}
      <g className={floatClass}>
        {showFeet && (
          <>
            <rect x="100" y="197" width="27" height="20" rx="10" fill={c.foot} />
            <rect x="129" y="197" width="27" height="20" rx="10" fill={c.foot} />
          </>
        )}
        <ellipse
          cx="128"
          cy="124"
          rx="78"
          ry="75"
          fill={c.ocean}
          stroke={c.outline}
          strokeWidth="8"
        />
        {showDecor && (
          <>
            <ellipse
              cx="95"
              cy="100"
              rx="22"
              ry="15"
              transform="rotate(-18 95 100)"
              fill={c.land}
            />
            <ellipse
              cx="164"
              cy="140"
              rx="20"
              ry="14"
              transform="rotate(-8 164 140)"
              fill={c.land}
            />
            <path
              d="M52 128 C90 143 166 143 204 128"
              fill="none"
              stroke={c.grat}
              strokeOpacity={c.gratOp}
              strokeWidth="4"
            />
            <circle cx="84" cy="140" r="9" fill={c.cheek} opacity="0.3" />
            <circle cx="172" cy="140" r="9" fill={c.cheek} opacity="0.3" />
          </>
        )}
        {expression === "sorriso" && (
          <>
            <g className={blinkClass}>
              <circle cx="106" cy="118" r="10" fill={c.eye} />
              <circle cx="150" cy="118" r="10" fill={c.eye} />
              {showDecor && (
                <>
                  <circle cx="110" cy="114" r="3.6" fill={c.eyeHi} />
                  <circle cx="154" cy="114" r="3.6" fill={c.eyeHi} />
                </>
              )}
            </g>
            <path
              d="M104 147 Q128 169 152 147"
              fill="none"
              stroke={c.mouth}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </>
        )}
        {expression === "alegre" && (
          <g>
            <path
              d="M97 120 Q106 110 115 120"
              fill="none"
              stroke={c.eye}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M141 120 Q150 110 159 120"
              fill="none"
              stroke={c.eye}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path d="M103 145 Q128 175 153 145 Z" fill={c.mouth} />
          </g>
        )}
        {expression === "piscada" && (
          <g>
            <circle cx="106" cy="118" r="10" fill={c.eye} />
            {showDecor && <circle cx="110" cy="114" r="3.6" fill={c.eyeHi} />}
            <path
              d="M141 121 Q150 129 159 115"
              fill="none"
              stroke={c.eye}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M104 148 Q127 166 150 150"
              fill="none"
              stroke={c.mouth}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}
        {flag && (
          <g className={waveClass}>
            <rect x="150" y="30" width="9" height="27" rx="4.5" fill={c.mast} />
            <path
              d="M159 33 C176 29 193 30 201 38 L192 47 L201 56 C191 61 173 59 159 55 Z"
              fill={c.cloth}
              stroke={c.clothStroke}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <circle
              cx="154.5"
              cy="30"
              r="6.5"
              fill={c.knob}
              stroke={c.knobStroke}
              strokeWidth="3"
            />
          </g>
        )}
      </g>
    </g>
  );
}
