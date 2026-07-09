import { expect, test } from "@playwright/test";
import { answerFirstOption, answerFullSession, seedSessionSize, skipOnboarding } from "./helpers";

test.describe("country_to_flag exercise", () => {
  test("shows the country name and flag options, and completes a session", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/challenges");

    const card = page.getByTestId("challenge-card").filter({ hasText: "Encontre a bandeira" });
    await card.getByRole("button", { name: "Começar desafio" }).click();

    // Enunciado invertido: o estímulo é o nome do país, as opções são bandeiras.
    await expect(page.getByRole("heading", { name: /Qual destas bandeiras é a de/ })).toBeVisible();
    await expect(page.getByTestId("training-country-name")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);
    const optionImages = page.getByTestId("training-option").locator("img");
    await expect(optionImages).toHaveCount(4);

    await answerFullSession(page, 5);
    await expect(page.getByRole("heading", { name: "Sessão concluída!" })).toBeVisible();
  });

  test("gives feedback on a flag pick", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/challenges");

    const card = page.getByTestId("challenge-card").filter({ hasText: "Encontre a bandeira" });
    await card.getByRole("button", { name: "Começar desafio" }).click();

    await answerFirstOption(page);
    // Após responder, alguma opção fica marcada como correta.
    await expect(page.locator('[data-testid="training-option"][data-state="correct"]')).toHaveCount(
      1,
    );
  });
});
