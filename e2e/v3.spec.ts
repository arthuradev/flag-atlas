import { expect, type Page, test } from "@playwright/test";
import {
  answerFirstOption,
  answerFullSession,
  getMainTrainingCta,
  seedSessionSize,
  skipOnboarding,
} from "./helpers";

/**
 * Remove a Web Share API e troca o clipboard por um stub gravável,
 * forçando o caminho "Copiar resultado" de forma determinística.
 */
async function stubShareAsClipboard(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    const copied: string[] = [];
    (window as unknown as { __copiedTexts: string[] }).__copiedTexts = copied;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          copied.push(text);
          return Promise.resolve();
        },
      },
      configurable: true,
    });
  });
}

/** Joga sobrevivência clicando sempre na primeira alternativa até o fim. */
async function playSurvivalToTheEnd(page: Page): Promise<void> {
  const endHeading = page.getByRole("heading", { name: "Fim da sobrevivência!" });
  for (let i = 0; i < 60; i++) {
    const option = page.getByTestId("training-option").first();
    await expect(option.or(endHeading).first()).toBeVisible();
    if (await endHeading.isVisible()) {
      return;
    }
    await answerFirstOption(page);
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  }
  await expect(endHeading).toBeVisible();
}

async function seedReturningUser(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      "flag-atlas:progress",
      JSON.stringify({
        schemaVersion: 1,
        data: {
          totalXp: 10,
          level: 1,
          countries: {},
          completedSessions: 1,
        },
      }),
    );
  });
}

test.describe("home v3", () => {
  test("shows daily missions without cluttering the main CTA", async ({ page }) => {
    await skipOnboarding(page);
    await seedReturningUser(page);
    await page.goto("./");

    await expect(getMainTrainingCta(page)).toBeVisible();
    await expect(page.getByTestId("daily-missions")).toBeVisible();
    await expect(page.getByTestId("daily-missions").getByRole("listitem")).toHaveCount(3);
    // Sem atividade hoje: nada de streak, sem culpa.
    await expect(page.getByTestId("daily-streak")).toHaveCount(0);
    // Conquistas acessível pela sidebar (desktop) ou dentro do Perfil (mobile).
    const achievementsLink = page.getByRole("link", { name: "Conquistas" });
    const profileTab = page.getByRole("link", { name: "Perfil" });
    await expect(achievementsLink.or(profileTab).first()).toBeVisible();
  });
});

test.describe("daily missions, streak and achievements flow", () => {
  test("completing a session counts the day, completes a mission and unlocks achievements", async ({
    page,
  }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./");

    await getMainTrainingCta(page).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await answerFullSession(page, 5);

    // Resumo: streak do dia, missão concluída e conquista Primeiros Passos.
    await expect(page.getByTestId("result-streak")).toContainText("Hoje já conta");
    await expect(page.getByTestId("result-streak")).toContainText("1 dia explorando o mundo");
    const missions = page.getByTestId("daily-missions");
    await expect(missions).toBeVisible();
    await expect(missions.getByText("Complete 1 sessão")).toBeVisible();
    await expect(missions.getByText("Concluída").first()).toBeVisible();
    await expect(page.getByTestId("result-achievements")).toContainText("Primeiros Passos");

    // Home mostra o streak discreto.
    await page.getByRole("button", { name: "Voltar ao início" }).click();
    await expect(page.getByTestId("daily-streak")).toContainText("1 dia explorando o mundo");

    // Página de conquistas reflete o desbloqueio. No mobile, Conquistas não
    // tem aba própria: o caminho é pelo Perfil.
    const achievementsLink = page.getByRole("link", { name: "Conquistas" }).first();
    if (!(await achievementsLink.isVisible())) {
      await page
        .getByRole("navigation", { name: "Navegação principal" })
        .getByRole("link", { name: "Perfil" })
        .click();
    }
    await page.getByRole("link", { name: "Conquistas" }).first().click();
    await expect(page.getByRole("heading", { name: "Conquistas" })).toBeVisible();
    await expect(page.getByTestId("achievement-card")).toHaveCount(20);
    const firstSteps = page.getByTestId("achievement-card").filter({ hasText: "Primeiros Passos" });
    await expect(firstSteps).toHaveAttribute("data-unlocked", "true");
  });
});

test.describe("challenges page v3", () => {
  test("organizes all seven challenges", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/challenges");

    for (const title of [
      "Modo digitação",
      "Encontre a bandeira",
      "Bandeiras parecidas",
      "Revisar hoje",
      "Sobrevivência",
      "Desafio rápido",
      "Desafio perfeito",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Começar desafio" })).toHaveCount(7);
  });

  test("quick challenge starts a 5-question session", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 20);
    await page.goto("./#/challenges");

    const quickCard = page.getByTestId("challenge-card").filter({ hasText: "Desafio rápido" });
    await quickCard.getByRole("button", { name: "Começar desafio" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
  });
});

test.describe("survival mode", () => {
  test("plays with lives until the end and shares the result", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await stubShareAsClipboard(page);
    await page.goto("./#/challenges");

    const survivalCard = page.getByTestId("challenge-card").filter({ hasText: "Sobrevivência" });
    await survivalCard.getByRole("button", { name: "Começar desafio" }).click();

    // Começa com 3 vidas.
    await expect(page.getByTestId("survival-lives")).toContainText("Vidas: 3 de 3");
    await expect(page.getByTestId("survival-score")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);

    await playSurvivalToTheEnd(page);
    await expect(page.getByText(/Você chegou a \d+ pontos\./)).toBeVisible();

    // Compartilhar cai no caminho de cópia e gera o texto de sobrevivência.
    await page.getByRole("button", { name: "Copiar resultado" }).click();
    await expect(page.getByText("Resultado copiado!")).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copiedTexts: string[] }).__copiedTexts,
    );
    expect(copied[0]).toContain("Flaggo");
    expect(copied[0]).toContain("Modo Sobrevivência");
    expect(copied[0]).toContain("Pontuação:");
  });
});

test.describe("share result", () => {
  test("copies the normal session summary", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await stubShareAsClipboard(page);
    await page.goto("./#/training");

    await answerFullSession(page, 5);
    await expect(page.getByRole("heading", { name: "Sessão concluída!" })).toBeVisible();

    await page.getByRole("button", { name: "Copiar resultado" }).click();
    await expect(page.getByText("Resultado copiado!")).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copiedTexts: string[] }).__copiedTexts,
    );
    expect(copied[0]).toContain("Sessão concluída!");
    expect(copied[0]).toContain("Jogue também:");
  });
});
