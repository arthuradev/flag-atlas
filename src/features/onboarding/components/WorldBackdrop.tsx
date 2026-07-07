/**
 * The quiet cartographic backdrop shared by every onboarding step on mobile:
 * a soft aqua glow, a stylised globe with meridians, a dashed "travel" route
 * and a few twinkling stars. Purely decorative and theme-aware (uses the app
 * surface tokens), so it reads on light and dark alike.
 */
type WorldBackdropProps = {
  animate?: boolean;
  className?: string;
};

export function WorldBackdrop({ animate = true, className = "" }: WorldBackdropProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="fa-onb-backdrop-glow absolute left-1/2 top-[-6%] h-[52%] w-[135%] -translate-x-1/2" />
      <svg
        viewBox="0 0 384 812"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden={true}
      >
        <g fill="none" stroke="var(--fa-border-strong)" strokeOpacity="0.7" strokeWidth="1.5">
          <ellipse cx="192" cy="250" rx="250" ry="250" />
          <ellipse cx="192" cy="250" rx="165" ry="250" />
          <ellipse cx="192" cy="250" rx="80" ry="250" />
          <line x1="-58" y1="250" x2="442" y2="250" />
          <path d="M-58 168 Q192 210 442 168" />
          <path d="M-58 332 Q192 292 442 332" />
        </g>
        <g fill="var(--fa-ring)" opacity="0.06">
          <ellipse cx="104" cy="190" rx="56" ry="34" />
          <ellipse cx="286" cy="286" rx="46" ry="30" />
        </g>
        <path
          d="M92 210 C158 258 232 220 300 280"
          fill="none"
          stroke="var(--fa-accent)"
          strokeOpacity="0.45"
          strokeDasharray="1 9"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="92" cy="210" r="3" fill="var(--fa-accent)" />
        <circle cx="300" cy="280" r="3" fill="var(--fa-accent)" />
      </svg>
      {["one", "two", "three", "four", "five"].map((star) => (
        <span
          key={star}
          className={`fa-onb-backdrop-star-${star} absolute size-[3px] rounded-full bg-text ${
            animate ? "fa-onb-twinkle" : "opacity-40"
          }`}
        />
      ))}
    </div>
  );
}
