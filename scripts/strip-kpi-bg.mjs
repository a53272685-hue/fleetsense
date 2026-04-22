#!/usr/bin/env node
/**
 * One-off script: strip the leading <rect .../> background from kpi-sm/md/neutral
 * icons so that they work as glyph-only SVGs inside a wrapper like KpiIconBadge.
 *
 * Run:  node scripts/strip-kpi-bg.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_DIR = join(__dirname, "..", "src", "components", "icons");

const TARGETS = readdirSync(ICON_DIR).filter(
  (f) => f.endsWith(".svg") && /^kpi-(sm|md|neutral)-/.test(f),
);

let changed = 0;
for (const file of TARGETS) {
  const p = join(ICON_DIR, file);
  const before = readFileSync(p, "utf8");
  // Remove the first <rect .../> inside the svg root (the bg square).
  const after = before.replace(/\s*<rect\s[^>]*\/>\n?/, "\n");
  if (after !== before) {
    writeFileSync(p, after);
    changed += 1;
  }
}
console.log(`Stripped bg rect from ${changed}/${TARGETS.length} icons`);
