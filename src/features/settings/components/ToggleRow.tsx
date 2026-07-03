type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <span className="font-bold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1 size-6 rounded-full bg-surface shadow-sm transition-[left] ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
