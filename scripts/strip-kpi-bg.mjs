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

// All KPI icon families carry a rounded-square bg that the wrapper provides —
// we strip it here. Covers kpi-sm-*, kpi-md-*, kpi-neutral-*, and also the
// plain kpi-* family (e.g. kpi-exchange) which uses <path> instead of <rect>.
const TARGETS = readdirSync(ICON_DIR).filter(
  (f) => f.endsWith(".svg") && /^kpi-/.test(f),
);

let changed = 0;
for (const file of TARGETS) {
  const p = join(ICON_DIR, file);
  const before = readFileSync(p, "utf8");
  let after = before;
  // Case 1: leading <rect .../> bg (kpi-sm/md/neutral family).
  after = after.replace(/\s*<rect\s[^>]*\/>\n?/, "\n");
  // Case 2: pair of leading <path .../> bg (rounded-rect fill + outline),
  // matched by the signature fill="currentColor" on the first path and
  // stroke="currentColor" + stroke-width on the second. Only strip when
  // both look like full-frame paths (used by plain kpi-* icons).
  after = after.replace(
    /\s*<path\s+d="M[^"]+"\s+fill="currentColor"\s*\/>\s*<path\s+d="M[^"]+"\s+stroke="currentColor"[^/]*\/>\s*/,
    "\n",
  );
  if (after !== before) {
    writeFileSync(p, after);
    changed += 1;
  }
}
console.log(`Stripped bg from ${changed}/${TARGETS.length} kpi icons`);
