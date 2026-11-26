// Entry: Formington — Sunshine by Permit Only
// A one-line weather forecast (max 120 characters) for a city that isn't.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const MAX_CHARS = 120;

function forecastLine(): string {
  return "Formington: 17°C, sunshine by permit only, rain in triplicate, wind pending approval since March. Please queue.";
}

function validate(line: string): void {
  if (line.length === 0) throw new Error("line is empty");
  if (line.length > MAX_CHARS) {
    throw new Error(`line is ${line.length} chars, limit is ${MAX_CHARS}`);
  }
  if (/[\r\n]/.test(line)) throw new Error("line must be a single line");
  if (line !== line.trim()) throw new Error("line must not have leading/trailing whitespace");
  if (!/\d+°C/.test(line)) throw new Error("forecast must state a temperature in °C");
}

function main(): void {
  const line = forecastLine();
  validate(line);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8"); // no trailing newline

  const back = readFileSync(outPath, "utf8");
  if (back !== line) throw new Error("read-back mismatch");
  const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`entry.txt written (${line.length} chars) sha256=${sha256}`);
}

main();
