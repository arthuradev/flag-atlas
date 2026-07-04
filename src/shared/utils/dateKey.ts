/** Dia local no formato YYYY-MM-DD (timezone do dispositivo, não UTC). */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: unknown): value is string {
  return typeof value === "string" && DATE_KEY_PATTERN.test(value);
}

/**
 * Diferença em dias inteiros entre duas chaves de dia (to - from).
 * Usa Date.UTC para não sofrer com horário de verão.
 * Chaves inválidas retornam NaN.
 */
export function dateKeyDiffInDays(from: string, to: string): number {
  const fromParts = DATE_KEY_PATTERN.exec(from);
  const toParts = DATE_KEY_PATTERN.exec(to);
  if (!fromParts || !toParts) {
    return Number.NaN;
  }
  const fromUtc = Date.UTC(Number(fromParts[1]), Number(fromParts[2]) - 1, Number(fromParts[3]));
  const toUtc = Date.UTC(Number(toParts[1]), Number(toParts[2]) - 1, Number(toParts[3]));
  return Math.round((toUtc - fromUtc) / 86_400_000);
}
