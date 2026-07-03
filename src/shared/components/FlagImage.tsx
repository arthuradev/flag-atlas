type FlagImageProps = {
  flagPath: string;
  alt: string;
  className?: string;
};

/** Bandeira como asset estático via <img>, nunca SVG inline (.specs/SECURITY.md). */
export function FlagImage({ flagPath, alt, className = "" }: FlagImageProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}${flagPath}`}
      alt={alt}
      draggable={false}
      decoding="async"
      className={`select-none ${className}`}
    />
  );
}
