/**
 * Acesso seguro ao localStorage: nunca lança, sempre devolve JSON
 * desserializado como `unknown` para validação na camada de repositório.
 */
export function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage cheio ou indisponível: o app segue funcionando em memória.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignorado de propósito: remoção é melhor esforço.
  }
}
