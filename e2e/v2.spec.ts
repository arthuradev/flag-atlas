import { expect, test } from "@playwright/test";
import { seedSessionSize, skipOnboarding } from "./helpers";

/** Progresso com países em revisão e confusões, para revisão e estatísticas. */
async function seedProgressWithReview(page: import("@playwright/test").Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      "flag-atlas:progress",
      JSON.stringify({
        schemaVersion: 1,
        data: {
          totalXp: 60,
          level: 1,
          completedSessions: 2,
          countries: {
            td: {
              countryId: "td",
              seenCount: 4,
              correctCount: 1,
              wrongCount: 3,
              currentCorrectStreak: 0,
              bestCorrectStreak: 1,
              masteryPoints: 1,
              masteryLevel: "recognized",
              needsReview: true,
              confusions: { ro: 2 },
            },
            br: {
              countryId: "br",
              seenCount: 3,
              correctCount: 3,
              wrongCount: 0,
              currentCorrectStreak: 3,
              bestCorrectStreak: 3,
              masteryPoints: 3,
              masteryLevel: "learned",
              needsReview: false,
            },
          },
        },
      }),
    );
  });
}

test.describe("typing mode", () => {
  test("plays a typing question with feedback and marks review on miss", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/challenges");

    await expect(page.getByRole("heading", { name: "Modo digitação" })).toBeVisible();
    await page.getByRole("button", { name: "Começar desafio" }).first().click();

    await expect(page.getByRole("heading", { name: "Digite o país desta bandeira" })).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(0);

    const input = page.getByRole("textbox", { name: "Sua resposta" });
    await expect(input).toBeVisible();

    // Resposta vazia não pode ser enviada.
    await expect(page.getByRole("button", { name: "Responder" })).toBeDisabled();

    await input.fill("atlantida perdida");
    await input.press("Enter");

    await expect(page.getByText("Quase!")).toBeVisible();
    await expect(page.getByText("Você digitou: atlantida perdida")).toBeVisible();
    await expect(page.getByText(/A resposta certa era/)).toBeVisible();

    // O erro por digitação marca o país para revisão: CTA aparece na Home.
    await page.goto("./#/home");
    await expect(page.getByRole("button", { name: /Revisar hoje/ })).toBeVisible();
  });
});

test.describe("review sessions", () => {
  test("review CTA starts a session prioritizing marked countries", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await seedProgressWithReview(page);
    await page.goto("./");

    await page.getByRole("button", { name: /Revisar hoje/ }).click();

    // Apenas 1 país em revisão + 1 fraco: a sessão encurta sem repetir.
    await expect(page.getByText("1/2")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);
  });
});

test.describe("similar flags challenge", () => {
  test("starts a similar-flags session with 4 options", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/challenges");

    await expect(page.getByRole("heading", { name: "Bandeiras parecidas" })).toBeVisible();
    await page.getByRole("button", { name: "Começar desafio" }).nth(1).click();

    await expect(page.getByText("1/5")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);

    await page.getByTestId("training-option").first().click();
    await expect(page.getByText(/Boa!|Quase!/)).toBeVisible();
  });
});

test.describe("statistics", () => {
  test("shows summary cards and lists from local progress", async ({ page }) => {
    await skipOnboarding(page);
    await seedProgressWithReview(page);
    await page.goto("./#/stats");

    await expect(page.getByRole("heading", { name: "Estatísticas" })).toBeVisible();
    await expect(page.getByText("Países vistos")).toBeVisible();
    await expect(page.getByText("Precisão geral")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mais difíceis" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Confusões comuns" })).toBeVisible();
    await expect(page.getByText("Romênia")).toBeVisible();
  });

  test("shows a friendly empty state without progress", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/stats");

    await expect(page.getByText("Jogue algumas sessões para ver suas estatísticas.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Treinar agora" })).toBeVisible();
  });
});
