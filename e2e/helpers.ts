import { expect, type Page } from "@playwright/test";

/** Marca o onboarding como concluído antes do app carregar. */
export async function skipOnboarding(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      "flag-atlas:onboarding",
      JSON.stringify({ schemaVersion: 1, data: { hasCompletedOnboarding: true } }),
    );
  });
}

/** Define o tamanho padrão de sessão antes do app carregar. */
export async function seedSessionSize(page: Page, size: number): Promise<void> {
  await page.addInitScript((sessionSize) => {
    localStorage.setItem(
      "flag-atlas:settings",
      JSON.stringify({
        schemaVersion: 1,
        data: {
          locale: "pt-BR",
          theme: "light",
          soundEnabled: false,
          volume: 0.8,
          reduceMotion: true,
          defaultSessionSize: sessionSize,
        },
      }),
    );
  }, size);
}

/** Responde todas as perguntas da sessão atual clicando na primeira alternativa. */
export async function answerFullSession(page: Page, questions: number): Promise<void> {
  for (let i = 0; i < questions; i++) {
    const option = page.getByTestId("training-option").first();
    await expect(option).toBeEnabled();
    await option.click();
    // Usa o botão Continuar para avançar sem esperar o avanço automático.
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  }
}
