/**
 * Gera os sons do MVP em public/sounds/ como WAV PCM 16-bit mono.
 * Sons sintetizados localmente: nenhum asset de terceiros, nada de CDN.
 *
 * Uso: node scripts/generate-sounds.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SAMPLE_RATE = 44100;
const outDir = resolve(import.meta.dirname, "..", "public", "sounds");
mkdirSync(outDir, { recursive: true });

/** Mistura uma nota senoidal com envelope suave dentro do buffer. */
function addNote(buffer, { freq, startSec, durationSec, gain }) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const length = Math.floor(durationSec * SAMPLE_RATE);
  const attack = Math.floor(0.005 * SAMPLE_RATE);
  for (let i = 0; i < length && start + i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = i < attack ? i / attack : Math.exp((-3 * (i - attack)) / (length - attack));
    buffer[start + i] += Math.sin(2 * Math.PI * freq * t) * env * gain;
  }
}

function writeWav(fileName, buffer) {
  const data = Buffer.alloc(44 + buffer.length * 2);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + buffer.length * 2, 4);
  data.write("WAVE", 8);
  data.write("fmt ", 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SAMPLE_RATE, 24);
  data.writeUInt32LE(SAMPLE_RATE * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(buffer.length * 2, 40);
  for (let i = 0; i < buffer.length; i++) {
    const value = Math.max(-1, Math.min(1, buffer[i]));
    data.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  writeFileSync(join(outDir, fileName), data);
  console.log(`Generated ${fileName} (${data.length} bytes)`);
}

function makeBuffer(durationSec) {
  return new Float32Array(Math.ceil(durationSec * SAMPLE_RATE));
}

// click: tique curto e discreto
const click = makeBuffer(0.06);
addNote(click, { freq: 900, startSec: 0, durationSec: 0.05, gain: 0.18 });
writeWav("click.wav", click);

// success: duas notas ascendentes alegres
const success = makeBuffer(0.3);
addNote(success, { freq: 659.25, startSec: 0, durationSec: 0.13, gain: 0.28 });
addNote(success, { freq: 880, startSec: 0.09, durationSec: 0.19, gain: 0.28 });
writeWav("success.wav", success);

// error: duas notas descendentes suaves, sem agressividade
const error = makeBuffer(0.36);
addNote(error, { freq: 329.63, startSec: 0, durationSec: 0.16, gain: 0.2 });
addNote(error, { freq: 261.63, startSec: 0.12, durationSec: 0.22, gain: 0.2 });
writeWav("error.wav", error);

// complete: arpejo curto de celebração
const complete = makeBuffer(0.75);
addNote(complete, { freq: 523.25, startSec: 0, durationSec: 0.16, gain: 0.26 });
addNote(complete, { freq: 659.25, startSec: 0.1, durationSec: 0.16, gain: 0.26 });
addNote(complete, { freq: 783.99, startSec: 0.2, durationSec: 0.16, gain: 0.26 });
addNote(complete, { freq: 1046.5, startSec: 0.3, durationSec: 0.4, gain: 0.26 });
writeWav("complete.wav", complete);
