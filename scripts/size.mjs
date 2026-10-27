// The size rule of AGENTS.md: no file in src/ is longer than MAX_LINES. scripts/verify runs this first.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MAX_LINES = 60;
const dir = new URL("../src/", import.meta.url).pathname;

const tooLong = readdirSync(dir)
  .map((name) => ({ name, lines: readFileSync(join(dir, name), "utf8").split("\n").length - 1 }))
  .filter((file) => file.lines > MAX_LINES);

for (const file of tooLong) console.log(`size: src/${file.name} has ${file.lines} lines; at most ${MAX_LINES}`);
process.exitCode = tooLong.length ? 1 : 0;
