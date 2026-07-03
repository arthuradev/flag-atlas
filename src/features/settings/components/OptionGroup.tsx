type OptionGroupProps<T extends string | number> = {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

export function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`min-h-11 cursor-pointer rounded-2xl border-2 px-4 font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-text-muted hover:bg-surface-raised"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
