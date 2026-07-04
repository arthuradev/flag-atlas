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
      className={`w-full overflow-hidden rounded-full bg-line/70 ring-1 ring-line/70 ${size === "thin" ? "h-1.5" : "h-3"}`}
    >
      <div
        className={`h-full rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset] transition-[width] duration-300 ease-out ${colorClassName}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
