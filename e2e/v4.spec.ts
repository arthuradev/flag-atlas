import { expect, type Page, test } from "@playwright/test";
import { answerFullSession, getMainTrainingCta, seedSessionSize, skipOnboarding } from "./helpers";

/** Semeia o progresso com um saldo de Moedas Atlas e itens já possuídos. */
async function seedCosmetics(
  page: Page,
  cosmetics: { coins?: number; ownedItemIds?: string[] },
): Promise<void> {
  await page.addInitScript((seed) => {
    localStorage.setItem(
      "flag-atlas:progress",
      JSON.stringify({
        schemaVersion: 1,
        data: {
          totalXp: 0,
          level: 1,
          countries: {},
          completedSessions: 0,
          cosmetics: {
            coins: seed.coins ?? 0,
            ownedItemIds: seed.ownedItemIds ?? [],
            equipped: {},
          },
        },
      }),
    );
  }, cosmetics);
}

test.describe("home v4", () => {
  test("shows a discreet shop entry and coin balance without hiding the main CTA", async ({
    page,
  }) => {
    await skipOnboarding(page);
    await seedCosmetics(page, { coins: 120 });
    await page.goto("./");

    await expect(getMainTrainingCta(page)).toBeVisible();
    // Entrada da Loja com saldo visível.
    const shopLink = page.getByRole("link", { name: /Loja/ });
    await expect(shopLink).toBeVisible();
    await expect(page.getByTestId("coin-balance").first()).toContainText("120");
  });
});

test.describe("shop v4", () => {
  test("renders every cosmetic category and the balance", async ({ page }) => {
    await skipOnboarding(page);
    await seedCosmetics(page, { coins: 300 });
    await page.goto("./#/shop");

    await expect(page.getByRole("heading", { name: "Loja", exact: true })).toBeVisible();
    for (const category of ["Temas", "Sons", "Molduras", "Efeitos"]) {
      await expect(page.getByRole("heading", { name: category })).toBeVisible();
    }
    await expect(page.getByTestId("coin-balance").first()).toContainText("300");
    // Deixa claro que não há dinheiro real.
    await expect(page.getByText("Sem dinheiro real")).toBeVisible();
  });

  test("buys and equips a theme, applying it immediately", async ({ page }) => {
    await skipOnboarding(page);
    await seedCosmetics(page, { coins: 300 });
    await page.goto("./#/shop");

    const oceanCard = page.locator('[data-item-id="theme-oceano"]');

    // Antes: não possuído.
    await expect(oceanCard).toHaveAttribute("data-owned", "false");
    await oceanCard.getByRole("button", { name: "Comprar" }).click();
    await expect(page.getByText("Compra realizada")).toBeVisible();
    await expect(oceanCard).toHaveAttribute("data-owned", "true");
    // Saldo desceu de 300 para 180.
    await expect(page.getByTestId("coin-balance").first()).toContainText("180");

    // Equipar aplica o tema imediatamente (data-theme muda para "oceano").
    await oceanCard.getByRole("button", { name: "Equipar" }).click();
    await expect(page.getByText("Item equipado")).toBeVisible();
    await expect(oceanCard).toHaveAttribute("data-equipped", "true");
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("oceano");
  });

  test("blocks buying a cosmetic without enough coins", async ({ page }) => {
    await skipOnboarding(page);
    await seedCosmetics(page, { coins: 0 });
    await page.goto("./#/shop");

    const oceanCard = page.locator('[data-item-id="theme-oceano"]');
    await expect(oceanCard).toHaveAttribute("data-owned", "false");
    // Sem saldo: o botão Comprar fica desabilitado.
    await expect(oceanCard.getByRole("button", { name: "Comprar" })).toBeDisabled();
  });

  test("shows free default items as equippable, never for sale", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/shop");

    const defaultTheme = page.locator('[data-item-id="theme-default"]');
    await expect(defaultTheme).toHaveAttribute("data-owned", "true");
    await expect(defaultTheme).toHaveAttribute("data-equipped", "true");
    await expect(defaultTheme.getByText("Grátis")).toBeVisible();
  });
});

test.describe("coins from playing", () => {
  test("awards Atlas Coins for finishing a session", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/training");

    await answerFullSession(page, 5);
    await expect(page.getByRole("heading", { name: "Sessão concluída!" })).toBeVisible();
    // O resumo mostra as moedas ganhas na sessão.
    await expect(page.getByTestId("result-coins")).toContainText("Moedas Atlas");
  });
});

test.describe("existing modes still work under v4", () => {
  test("normal training still runs to a summary", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./");
    await getMainTrainingCta(page).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await answerFullSession(page, 5);
    await expect(page.getByRole("heading", { name: "Sessão concluída!" })).toBeVisible();
  });

  test("typing mode still works", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/challenges");
    const typingCard = page.getByTestId("challenge-card").filter({ hasText: "Modo digitação" });
    await typingCard.getByRole("button", { name: "Começar desafio" }).click();
    await expect(page.getByText("Digite o país desta bandeira")).toBeVisible();
  });
});
