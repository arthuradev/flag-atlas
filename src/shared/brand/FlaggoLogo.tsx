import { useId } from "react";
import { PRODUCT_NAME } from "@/shared/brand/brand.constants";

type FlaggoLogoProps = {
  /** Tamanho da fonte do wordmark (o planeta-"o" escala junto). */
  size?: number | string;
  className?: string;
};

/**
 * Wordmark oficial do Flaggo: o texto "Flagg" com o último "o" desenhado como
 * um planeta turquesa de anel dourado (fonte de verdade: Flaggo App Design).
 * A cor do texto segue `currentColor`; o planeta tem cores fixas de marca.
 * Leitores de tela leem sempre "Flaggo".
 */
export function FlaggoLogo({ size = 19, className = "" }: FlaggoLogoProps) {
  const gradientId = useId();
  const fontSize = typeof size === "number" ? `${size}px` : size;

  return (
    <span
      role="img"
      aria-label={PRODUCT_NAME}
      className={`inline-flex items-center font-black leading-none ${className}`}
      style={{ fontSize, letterSpacing: "-0.04em" }}
    >
      <span aria-hidden="true">Flagg</span>
      <span
        aria-hidden="true"
        className="inline-block"
        style={{ width: "0.92em", height: "0.92em", marginLeft: "0.02em" }}
      >
        <svg
          viewBox="-6 -9 52 52"
          width="100%"
          height="100%"
          aria-hidden="true"
          className="block overflow-visible"
        >
          <g transform="rotate(-16 20 21)">
            <ellipse
              cx="20"
              cy="21"
              rx="21"
              ry="6"
              fill="none"
              stroke="#F5A836"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <circle cx="20" cy="21" r="14" fill={`url(#${gradientId})`} />
          <g opacity="0.17" stroke="#EAFDFF" fill="none" strokeWidth="1">
            <ellipse cx="20" cy="21" rx="13.5" ry="4" />
            <ellipse cx="20" cy="21" rx="5" ry="13.5" />
          </g>
          <ellipse
            cx="14.5"
            cy="15"
            rx="6"
            ry="4.4"
            fill="#ffffff"
            opacity="0.42"
            transform="rotate(-22 14.5 15)"
          />
          <defs>
            <radialGradient id={gradientId} cx="34%" cy="27%" r="82%">
              <stop offset="0%" stopColor="#84E8F1" />
              <stop offset="55%" stopColor="#18C4D7" />
              <stop offset="100%" stopColor="#0C97AD" />
            </radialGradient>
          </defs>
        </svg>
      </span>
    </span>
  );
}
