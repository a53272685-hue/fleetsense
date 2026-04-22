#!/usr/bin/env node
/**
 * a11y-scan.mjs — Run axe-core against every URL in .a11y-reports/urls.txt,
 * save per-URL JSON results, and print a summary.
 *
 * Output: .a11y-reports/<slug>.json  (one file per URL)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";

const require = createRequire(import.meta.url);
const axeSourcePath = require.resolve("axe-core/axe.min.js");
const axeSource = await readFile(axeSourcePath, "utf8");

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, ".a11y-reports");

function slugify(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  const urlsRaw = await readFile(path.join(OUT_DIR, "urls.txt"), "utf8");
  const urls = urlsRaw
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u && !u.startsWith("#"));

  console.log(`Scanning ${urls.length} URLs with axe-core…`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const summary = [];

  for (const url of urls) {
    const slug = slugify(url);
    const start = Date.now();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
      // Inject axe-core and run against WCAG 2.2 AA rule set.
      await page.evaluate(axeSource);
      const results = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
          },
          resultTypes: ["violations", "incomplete"],
        });
      });
      const outFile = path.join(OUT_DIR, `${slug}.json`);
      await writeFile(outFile, JSON.stringify({ url, results }, null, 2));
      const ms = Date.now() - start;
      const v = results.violations.length;
      const i = results.incomplete.length;
      const serious = results.violations.filter(
        (vv) => vv.impact === "serious" || vv.impact === "critical",
      ).length;
      console.log(
        `  ✓ ${url.padEnd(60)} violations=${v} (serious+critical=${serious}) incomplete=${i}  ${ms}ms`,
      );
      summary.push({ url, violations: v, incomplete: i, serious, ms });
    } catch (err) {
      console.error(`  ✗ ${url}: ${err.message}`);
      summary.push({ url, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  await writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2),
  );
  console.log(`\nSummary saved to .a11y-reports/summary.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
