/**
 * Gera os sons do Flag Atlas em public/sounds/ como WAV PCM 16-bit mono.
 * Sons sintetizados localmente: nenhum asset de terceiros, nada de CDN.
 *
 * - Pacote padrão (Versão 1): public/sounds/{click,success,error,complete}.wav
 * - Pacotes cosméticos (Versão 4): public/sounds/<pacote>/*.wav
 *   pacotes: suave, arcade, digital. O pacote "silencioso" não tem arquivos
 *   (o app simplesmente não toca nada) e o "padrão" é a raiz.
 *
 * Uso: node scripts/generate-sounds.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SAMPLE_RATE = 44100;
const soundsRoot = resolve(import.meta.dirname, "..", "public", "sounds");

/** Onda periódica simples por tipo. */
function waveSample(wave, phase) {
  switch (wave) {
    case "square":
      return Math.sin(phase) >= 0 ? 1 : -1;
    case "triangle":
      return (2 / Math.PI) * Math.asin(Math.sin(phase));
    default:
      return Math.sin(phase);
  }
}

/** Mistura uma nota com envelope suave (attack curto + decaimento exponencial). */
function addTone(buffer, { freq, startSec, durationSec, gain, wave = "sine" }) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const length = Math.floor(durationSec * SAMPLE_RATE);
  const attack = Math.floor(0.005 * SAMPLE_RATE);
  for (let i = 0; i < length && start + i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = i < attack ? i / attack : Math.exp((-3 * (i - attack)) / (length - attack));
    buffer[start + i] += waveSample(wave, 2 * Math.PI * freq * t) * env * gain;
  }
}

function writeWav(dir, fileName, buffer) {
  mkdirSync(dir, { recursive: true });
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
  writeFileSync(join(dir, fileName), data);
  console.log(`Generated ${join(dir, fileName)} (${data.length} bytes)`);
}

function makeBuffer(durationSec) {
  return new Float32Array(Math.ceil(durationSec * SAMPLE_RATE));
}

/**
 * Um pacote define timbre (onda) e um multiplicador de ganho; as melodias são
 * as mesmas para manter a identidade sonora, variando só a "cor" do som.
 */
function generatePack(dir, { wave, gain }) {
  const g = (base) => base * gain;

  // click: tique curto e discreto
  const click = makeBuffer(0.06);
  addTone(click, { freq: 900, startSec: 0, durationSec: 0.05, gain: g(0.18), wave });
  writeWav(dir, "click.wav", click);

  // success: duas notas ascendentes alegres
  const success = makeBuffer(0.3);
  addTone(success, { freq: 659.25, startSec: 0, durationSec: 0.13, gain: g(0.28), wave });
  addTone(success, { freq: 880, startSec: 0.09, durationSec: 0.19, gain: g(0.28), wave });
  writeWav(dir, "success.wav", success);

  // error: duas notas descendentes suaves, sem agressividade
  const error = makeBuffer(0.36);
  addTone(error, { freq: 329.63, startSec: 0, durationSec: 0.16, gain: g(0.2), wave });
  addTone(error, { freq: 261.63, startSec: 0.12, durationSec: 0.22, gain: g(0.2), wave });
  writeWav(dir, "error.wav", error);

  // complete: arpejo curto de celebração
  const complete = makeBuffer(0.75);
  addTone(complete, { freq: 523.25, startSec: 0, durationSec: 0.16, gain: g(0.26), wave });
  addTone(complete, { freq: 659.25, startSec: 0.1, durationSec: 0.16, gain: g(0.26), wave });
  addTone(complete, { freq: 783.99, startSec: 0.2, durationSec: 0.16, gain: g(0.26), wave });
  addTone(complete, { freq: 1046.5, startSec: 0.3, durationSec: 0.4, gain: g(0.26), wave });
  writeWav(dir, "complete.wav", complete);
}

// Pacote padrão (raiz): senoidal, ganho cheio — idêntico ao original.
generatePack(soundsRoot, { wave: "sine", gain: 1 });

// Pacotes cosméticos da Versão 4.
generatePack(join(soundsRoot, "suave"), { wave: "sine", gain: 0.55 });
generatePack(join(soundsRoot, "arcade"), { wave: "square", gain: 0.5 });
generatePack(join(soundsRoot, "digital"), { wave: "triangle", gain: 0.85 });
