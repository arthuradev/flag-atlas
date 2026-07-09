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

/** Acessórios cosméticos da Loja ("Cosméticos do Orbi"). */
export type OrbiAccessory =
  | "explorer-hat"
  | "cap"
  | "beanie"
  | "party-hat"
  | "crown"
  | "halo"
  | "glasses"
  | "sunglasses"
  | "monocle"
  | "scarf"
  | "bowtie"
  | "headphones"
  | "winter";

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
  accessory?: OrbiAccessory | undefined;
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
  accessory,
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
          accessory={accessory}
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
  accessory?: OrbiAccessory | undefined;
  showDecor: boolean;
  showFeet: boolean;
  ground: boolean;
  flag: boolean;
  floatClass: string;
  waveClass: string;
  blinkClass: string;
  ink: string;
};

/** Acessórios desenhados por cima do globo, na mesma linguagem de traço. */
function AccessoryLayer({ accessory, ink }: { accessory: OrbiAccessory; ink: string }) {
  const gold = "#FFC53D";
  const coral = "#FF6F61";
  const teal = "#17B4C9";

  switch (accessory) {
    case "explorer-hat":
      return (
        <g>
          <ellipse cx="118" cy="56" rx="56" ry="12" fill="#C9A063" stroke={ink} strokeWidth="6" />
          <path
            d="M86 54 Q118 8 150 54 Z"
            fill="#D9B37C"
            stroke={ink}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path d="M88 47 Q118 36 148 47" fill="none" stroke="#8A5E2A" strokeWidth="8" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path
            d="M88 54 Q118 12 148 54 Z"
            fill={teal}
            stroke={ink}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M144 50 Q176 48 182 60 Q152 64 140 58 Z"
            fill={teal}
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="118" cy="18" r="6" fill={gold} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "beanie":
    case "winter":
      return (
        <g>
          <path
            d="M84 56 Q118 6 152 56 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <rect
            x="82"
            y="48"
            width="72"
            height="15"
            rx="7"
            fill="#FFFFFF"
            stroke={ink}
            strokeWidth="5"
          />
          <circle cx="118" cy="12" r="9" fill="#FFFFFF" stroke={ink} strokeWidth="5" />
          {accessory === "winter" && (
            <path
              d="M70 176 Q128 200 186 176 L182 192 Q128 214 74 192 Z"
              fill={coral}
              stroke={ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />
          )}
        </g>
      );
    case "party-hat":
      return (
        <g>
          <path
            d="M96 52 L120 4 L144 52 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path d="M104 36 L136 36" stroke={gold} strokeWidth="6" strokeLinecap="round" />
          <circle cx="120" cy="4" r="7" fill={gold} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "crown":
      return (
        <g>
          <path
            d="M88 52 L88 24 L104 40 L120 16 L136 40 L152 24 L152 52 Z"
            fill={gold}
            stroke={ink}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="120" cy="44" r="4.5" fill={coral} stroke={ink} strokeWidth="3" />
        </g>
      );
    case "halo":
      return (
        <ellipse
          cx="122"
          cy="24"
          rx="34"
          ry="9"
          fill="none"
          stroke={gold}
          strokeWidth="8"
          strokeLinecap="round"
        />
      );
    case "glasses":
      return (
        <g fill="none" stroke={ink} strokeWidth="6">
          <circle cx="106" cy="118" r="17" />
          <circle cx="150" cy="118" r="17" />
          <path d="M123 118 L133 118" />
        </g>
      );
    case "sunglasses":
      return (
        <g>
          <circle cx="106" cy="118" r="17" fill={ink} stroke={ink} strokeWidth="5" />
          <circle cx="150" cy="118" r="17" fill={ink} stroke={ink} strokeWidth="5" />
          <path d="M123 118 L133 118" stroke={ink} strokeWidth="6" />
          <circle cx="100" cy="112" r="4" fill="#FFFFFF" opacity="0.5" />
          <circle cx="144" cy="112" r="4" fill="#FFFFFF" opacity="0.5" />
        </g>
      );
    case "monocle":
      return (
        <g fill="none" stroke={gold} strokeWidth="6">
          <circle cx="150" cy="118" r="17" />
          <path d="M150 135 L150 158" strokeLinecap="round" />
        </g>
      );
    case "scarf":
      return (
        <g>
          <path
            d="M70 176 Q128 200 186 176 L182 192 Q128 214 74 192 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M160 190 L166 216 L146 212 L150 188 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </g>
      );
    case "bowtie":
      return (
        <g>
          <path
            d="M128 186 L104 174 L104 198 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M128 186 L152 174 L152 198 Z"
            fill={coral}
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="128" cy="186" r="6" fill={gold} stroke={ink} strokeWidth="4" />
        </g>
      );
    case "headphones":
      return (
        <g>
          <path
            d="M62 118 Q66 44 128 40 Q190 44 194 118"
            fill="none"
            stroke={ink}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <rect
            x="46"
            y="108"
            width="22"
            height="38"
            rx="10"
            fill={teal}
            stroke={ink}
            strokeWidth="6"
          />
          <rect
            x="188"
            y="108"
            width="22"
            height="38"
            rx="10"
            fill={teal}
            stroke={ink}
            strokeWidth="6"
          />
        </g>
      );
    default:
      return null;
  }
}

function FillOrbi({
  colors: c,
  expression,
  accessory,
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
        {accessory && <AccessoryLayer accessory={accessory} ink={ink} />}
      </g>
    </g>
  );
}
