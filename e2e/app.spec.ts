import { expect, test } from "@playwright/test";
import { answerFullSession, seedSessionSize, skipOnboarding } from "./helpers";

test.describe("onboarding", () => {
  test("first visit shows onboarding and completes into home", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { name: "Bem-vindo ao Flag Atlas" })).toBeVisible();

    await page.getByRole("button", { name: "Avançar" }).click();
    await expect(page.getByRole("heading", { name: "Complete o mundo" })).toBeVisible();
    await page.getByRole("button", { name: "Avançar" }).click();
    await page.getByRole("button", { name: "Começar" }).click();

    await expect(page.getByRole("button", { name: "Continuar treino" })).toBeVisible();
    await expect(page.getByText("0/195 países aprendidos")).toBeVisible();

    // Próxima abertura vai direto para a Home.
    await page.goto("./");
    await expect(page.getByRole("button", { name: "Continuar treino" })).toBeVisible();
  });
});

test.describe("training session", () => {
  test("plays a full session, sees the summary and plays again", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./");

    await page.getByRole("button", { name: "Continuar treino" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await expect(page.locator("img[alt='Bandeira para adivinhar']")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);

    await answerFullSession(page, 5);

    await expect(page.getByRole("heading", { name: "Sessão concluída!" })).toBeVisible();
    await expect(page.getByText("Melhor sequência:")).toBeVisible();

    await page.getByRole("button", { name: "Jogar mais uma" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);
  });

  test("shows feedback states on answer", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/training");

    const option = page.getByTestId("training-option").first();
    await option.click();

    // Sempre há exatamente uma alternativa marcada como correta.
    await expect(page.locator("[data-testid='training-option'][data-state='correct']")).toHaveCount(
      1,
    );
    await expect(page.getByText(/Boa!|Quase!/)).toBeVisible();
  });
});

test.describe("continent training", () => {
  test("trains a specific continent", async ({ page }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./#/continents");

    await page.getByRole("link", { name: /Oceania/ }).click();
    await expect(page.getByText("0/14 países")).toBeVisible();

    await page.getByRole("button", { name: "Treinar este continente" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await expect(page.getByTestId("training-option")).toHaveCount(4);
  });
});

test.describe("collection", () => {
  test("searches and filters countries", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/collection");

    await expect(page.getByText("195 países")).toBeVisible();

    await page.getByRole("searchbox").fill("brasil");
    await expect(page.getByText("1 país", { exact: true })).toBeVisible();
    await expect(page.getByText("Brasil")).toBeVisible();

    await page.getByRole("searchbox").fill("");
    await page.getByLabel("Continente").selectOption("oceania");
    await expect(page.getByText("14 países")).toBeVisible();
  });
});

test.describe("settings", () => {
  test("changes language, theme and session size", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/settings");

    await page.getByRole("button", { name: "English (US)" }).click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "5 questions" }).click();
    await page.goto("./#/training");
    await expect(page.getByText("1/5")).toBeVisible();
  });

  test("resets progress with confirmation", async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("./#/settings");

    await page.getByRole("button", { name: "Resetar progresso" }).click();
    await expect(page.getByText("Resetar todo o progresso?")).toBeVisible();
    await page.getByRole("button", { name: "Sim, resetar" }).click();
    await expect(page.getByText("Progresso resetado.")).toBeVisible();
  });
});

test.describe("pwa offline", () => {
  test("app keeps working offline after first load", async ({ page, context }) => {
    await skipOnboarding(page);
    await seedSessionSize(page, 5);
    await page.goto("./");
    await expect(page.getByRole("button", { name: "Continuar treino" })).toBeVisible();

    // Aguarda o service worker ativar e concluir o precache.
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.waitForTimeout(1500);

    await context.setOffline(true);
    await page.reload();

    await expect(page.getByRole("button", { name: "Continuar treino" })).toBeVisible();
    await page.getByRole("button", { name: "Continuar treino" }).click();
    await expect(page.getByTestId("training-option")).toHaveCount(4);

    // A bandeira precisa carregar do cache offline.
    const flag = page.locator("img[alt='Bandeira para adivinhar']");
    await expect(flag).toBeVisible();
    await expect
      .poll(async () => flag.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);

    await context.setOffline(false);
  });
});
