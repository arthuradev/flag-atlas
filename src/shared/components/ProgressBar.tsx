type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  size?: "thin" | "normal";
  colorClassName?: string;
  animate?: boolean;
};

export function ProgressBar({
  value,
  max,
  label,
  size = "normal",
  colorClassName = "bg-progress",
  animate = true,
}: ProgressBarProps) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.min(Math.max(0, value), safeMax);
  const colorClass = colorClassName.includes("primary")
    ? "fa-progress-primary"
    : "fa-progress-default";

  return (
    <progress
      value={safeValue}
      max={safeMax}
      aria-label={label}
      className={`fa-progress ${colorClass} w-full overflow-hidden rounded-full ring-1 ring-line/70 ${
        size === "thin" ? "h-1.5" : "h-3"
      } ${animate ? "" : "fa-progress-still"}`}
    />
  );
}
