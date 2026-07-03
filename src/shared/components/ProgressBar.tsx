type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  size?: "thin" | "normal";
  colorClassName?: string;
};

export function ProgressBar({
  value,
  max,
  label,
  size = "normal",
  colorClassName = "bg-progress",
}: ProgressBarProps) {
  const safeMax = Math.max(1, max);
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.min(value, safeMax)}
      className={`w-full overflow-hidden rounded-full bg-border/60 ${size === "thin" ? "h-1.5" : "h-3"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${colorClassName}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
