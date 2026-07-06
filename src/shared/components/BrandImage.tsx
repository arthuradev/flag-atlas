import type { ImgHTMLAttributes } from "react";

const BRAND_ASSET_PATHS = {
  appIcon: "brand/app-icon.svg",
  favicon: "brand/favicon.svg",
  globi: "brand/globi.svg",
  logoHorizontal: "brand/logo-horizontal.svg",
  logoVertical: "brand/logo-vertical.svg",
  symbol: "brand/symbol.svg",
  wordmark: "brand/wordmark.svg",
} as const;

export type BrandAsset = keyof typeof BRAND_ASSET_PATHS;

type BrandImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> & {
  asset: BrandAsset;
  alt?: string;
  decorative?: boolean;
};

export function BrandImage({
  asset,
  alt = "Flag Atlas",
  decorative = false,
  className = "",
  ...props
}: BrandImageProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}${BRAND_ASSET_PATHS[asset]}`}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? true : undefined}
      decoding="async"
      draggable={false}
      className={`block select-none ${className}`}
      {...props}
    />
  );
}
