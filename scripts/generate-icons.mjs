/**
 * Generates derived icon and splash PNGs from the official SVG sources in
 * public/brand/. Playwright is already a dev dependency for E2E, so this keeps
 * brand generation reproducible without adding a rasterization package.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const rootDir = resolve(import.meta.dirname, "..");
const brandDir = join(rootDir, "public", "brand");
const appIconSvg = join(brandDir, "app-icon.svg");
const orbiSvg = join(brandDir, "orbi.svg");
const navy = "#12303B";
const mist = "#EAF6F8";

function ensureParentDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function svgDataUri(filePath) {
  return `data:image/svg+xml;base64,${readFileSync(filePath).toString("base64")}`;
}

async function renderAsset(page, target) {
  const {
    source,
    output,
    width,
    height,
    background = "transparent",
    imageWidth = width,
    imageHeight = height,
  } = target;

  ensureParentDir(output);
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!doctype html>
<html>
  <head>
    <style>
      html,
      body {
        width: ${width}px;
        height: ${height}px;
        margin: 0;
        overflow: hidden;
        background: ${background};
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img {
        display: block;
        width: ${imageWidth}px;
        height: ${imageHeight}px;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <img src="${svgDataUri(source)}" alt="" />
  </body>
</html>`,
    { waitUntil: "load" },
  );

  await page.locator("img").evaluate((image) => image.decode());
  await page.screenshot({
    path: output,
    omitBackground: background === "transparent",
  });
  console.log(`Generated ${relative(rootDir, output)} (${width}x${height})`);
}

const pwaTargets = [
  {
    source: appIconSvg,
    output: join(rootDir, "public", "icons", "icon-192.png"),
    width: 192,
    height: 192,
  },
  {
    source: appIconSvg,
    output: join(rootDir, "public", "icons", "icon-512.png"),
    width: 512,
    height: 512,
  },
  {
    source: appIconSvg,
    output: join(rootDir, "public", "icons", "icon-512-maskable.png"),
    width: 512,
    height: 512,
    background: navy,
  },
];

const androidIconDensities = [
  { dir: "mipmap-mdpi", iconSize: 48, foregroundSize: 108 },
  { dir: "mipmap-hdpi", iconSize: 72, foregroundSize: 162 },
  { dir: "mipmap-xhdpi", iconSize: 96, foregroundSize: 216 },
  { dir: "mipmap-xxhdpi", iconSize: 144, foregroundSize: 324 },
  { dir: "mipmap-xxxhdpi", iconSize: 192, foregroundSize: 432 },
];

const androidIconTargets = androidIconDensities.flatMap(({ dir, iconSize, foregroundSize }) => {
  const mipmapDir = join(rootDir, "android", "app", "src", "main", "res", dir);
  const foregroundImageSize = Math.round(foregroundSize * 0.72);

  return [
    {
      source: appIconSvg,
      output: join(mipmapDir, "ic_launcher.png"),
      width: iconSize,
      height: iconSize,
    },
    {
      source: appIconSvg,
      output: join(mipmapDir, "ic_launcher_round.png"),
      width: iconSize,
      height: iconSize,
    },
    {
      source: orbiSvg,
      output: join(mipmapDir, "ic_launcher_foreground.png"),
      width: foregroundSize,
      height: foregroundSize,
      imageWidth: foregroundImageSize,
      imageHeight: foregroundImageSize,
    },
  ];
});

const splashSizes = [
  { dir: "drawable", width: 480, height: 320 },
  { dir: "drawable-land-mdpi", width: 480, height: 320 },
  { dir: "drawable-land-hdpi", width: 800, height: 480 },
  { dir: "drawable-land-xhdpi", width: 1280, height: 720 },
  { dir: "drawable-land-xxhdpi", width: 1600, height: 960 },
  { dir: "drawable-land-xxxhdpi", width: 1920, height: 1280 },
  { dir: "drawable-port-mdpi", width: 320, height: 480 },
  { dir: "drawable-port-hdpi", width: 480, height: 800 },
  { dir: "drawable-port-xhdpi", width: 720, height: 1280 },
  { dir: "drawable-port-xxhdpi", width: 960, height: 1600 },
  { dir: "drawable-port-xxxhdpi", width: 1280, height: 1920 },
];

const splashTargets = splashSizes.map(({ dir, width, height }) => {
  const imageSize = Math.round(Math.min(width, height) * 0.3);

  return {
    source: appIconSvg,
    output: join(rootDir, "android", "app", "src", "main", "res", dir, "splash.png"),
    width,
    height,
    background: mist,
    imageWidth: imageSize,
    imageHeight: imageSize,
  };
});

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

try {
  for (const target of [...pwaTargets, ...androidIconTargets, ...splashTargets]) {
    await renderAsset(page, target);
  }
} finally {
  await browser.close();
}
