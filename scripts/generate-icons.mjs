/**
 * Gera os ícones PNG da PWA em public/icons/ sem dependências externas,
 * desenhando pixel a pixel e codificando PNG com zlib do Node.
 *
 * Uso: node scripts/generate-icons.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { deflateSync } from "node:zlib";

const outDir = resolve(import.meta.dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const TEAL = [13, 148, 136, 255];
const TEAL_DARK = [10, 118, 110, 255];
const WHITE = [255, 255, 255, 255];
const TRANSPARENT = [0, 0, 0, 0];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32LE = undefined; // guard: sempre big-endian em PNG
  const lengthBe = Buffer.alloc(4);
  lengthBe.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([lengthBe, typeAndData, crc]);
}

function encodePng(pixels, size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filtro none por linha
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixels[y * size + x];
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Desenha o ícone: quadrado arredondado teal, mastro e bandeira ondulada.
 * `padding` controla a área segura (maior para ícones maskable).
 */
function drawIcon(size, { padding, transparentOutside }) {
  const pixels = new Array(size * size);
  const radius = size * 0.22;
  const inset = size * padding;

  const poleX = size * (padding + 0.16);
  const poleWidth = Math.max(2, size * 0.045);
  const poleTop = size * (padding + 0.12);
  const poleBottom = size * (1 - padding - 0.1);

  const flagLeft = poleX + poleWidth;
  const flagRight = size * (1 - padding - 0.12);
  const flagTop = size * (padding + 0.14);
  const flagHeight = size * 0.3;
  const waveAmp = size * 0.035;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = transparentOutside ? TRANSPARENT : TEAL;

      // Quadrado arredondado de fundo
      const rx = Math.max(inset + radius - x, x - (size - inset - radius), 0);
      const ry = Math.max(inset + radius - y, y - (size - inset - radius), 0);
      const insideBg =
        x >= inset &&
        x < size - inset &&
        y >= inset &&
        y < size - inset &&
        rx * rx + ry * ry <= radius * radius;
      if (insideBg) {
        color = TEAL;
      } else if (!transparentOutside) {
        color = TEAL; // maskable: fundo cobre tudo
      }

      if (color !== TRANSPARENT) {
        // Sombra sutil na metade de baixo do fundo
        if (y > size * 0.55 && (transparentOutside ? insideBg : true)) {
          color = y > size * 0.85 ? TEAL_DARK : color;
        }
        // Mastro
        if (x >= poleX && x < poleX + poleWidth && y >= poleTop && y <= poleBottom) {
          color = WHITE;
        }
        // Bandeira ondulada
        if (x >= flagLeft && x <= flagRight) {
          const progress = (x - flagLeft) / (flagRight - flagLeft);
          const wave = Math.sin(progress * Math.PI * 1.5) * waveAmp;
          const top = flagTop + wave;
          if (y >= top && y <= top + flagHeight) {
            color = WHITE;
          }
        }
      }

      pixels[y * size + x] = color;
    }
  }
  return pixels;
}

for (const { file, size, padding, transparentOutside } of [
  { file: "icon-192.png", size: 192, padding: 0.04, transparentOutside: true },
  { file: "icon-512.png", size: 512, padding: 0.04, transparentOutside: true },
  { file: "icon-512-maskable.png", size: 512, padding: 0.14, transparentOutside: false },
]) {
  const png = encodePng(drawIcon(size, { padding, transparentOutside }), size);
  writeFileSync(join(outDir, file), png);
  console.log(`Generated ${file} (${png.length} bytes)`);
}
