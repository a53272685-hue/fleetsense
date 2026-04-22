# FleetSense — WCAG 2.2 Level AA Accessibility Audit

**Audit date:** 2026-04-22  
**Scope:** 19 routes (17 static + 2 dynamic samples) across Utilization, Efficiency, Compliance, Forms, Deep Dive  
**Standards:** WCAG 2.2 Level AA (superset of 2.1 AA, adds 6 SCs), plus axe-core best-practice rules  
**Raw data:** `.a11y-reports/*.json` (per-URL axe output) + `.a11y-reports/eslint.json`

---

## 1. Executive Summary

- **37 automated violations** across 18/19 pages (efficiency/group-comparison is the only clean page — 0 violations).
- **232 of 316 violation nodes are color-contrast** — this is the single highest-impact issue and is entirely fixable at the design-token layer.
- **5 unique axe rules triggered**; all either `serious` or `critical` impact. No `moderate`/`minor` items in violations.
- **3 additional rules flagged as `incomplete`** (needs manual review) — mostly chart SVG text and the heatmap cells.
- **2 static lint violations** from `eslint-plugin-jsx-a11y` (1 real, 1 false positive).
- **Dashboard-specific gaps** not caught by axe: missing table `scope`, no `aria-sort` for sortable columns, no chart alt-text pattern, no `prefers-reduced-motion` handling, no skip-nav link.

### Per-page scoreboard (sorted worst → best)

| # | Route | Violations | Serious+Critical | Incomplete |
|---|---|---:|---:|---:|
| 1 | `/forms/templates` | 4 | 4 | 0 |
| 2 | `/utilization/overview` | 3 | 3 | 2 |
| 3 | `/efficiency/overview` | 3 | 3 | 2 |
| 4 | `/deep-dive/drivers` | 3 | 3 | 1 |
| 5 | `/deep-dive/lytx-safety` | 3 | 3 | 1 |
| 6 | `/utilization/activity` | 2 | 2 | 3 |
| 7 | `/utilization/vehicle-deep-dive` | 2 | 2 | 1 |
| 8 | `/utilization/vehicle-deep-dive/1` | 2 | 2 | 1 |
| 9 | `/compliance/overview` | 2 | 2 | 1 |
| 10 | `/compliance/hos` | 2 | 2 | 1 |
| 11 | `/compliance/csa` | 2 | 2 | 2 |
| 12 | `/compliance/maintenance` | 2 | 2 | 2 |
| 13 | `/forms/submissions` | 2 | 2 | 1 |
| 14 | `/utilization/group-comparison` | 1 | 1 | 2 |
| 15 | `/efficiency/activity` | 1 | 1 | 3 |
| 16 | `/efficiency/driver-deep-dive` | 1 | 1 | 2 |
| 17 | `/efficiency/driver-deep-dive/1` | 1 | 1 | 2 |
| 18 | `/forms/requests` | 1 | 1 | 1 |
| 19 | `/efficiency/group-comparison` | **0** | 0 | 2 |

---

## 2. Methodology & Tools

| Tool | Version | Purpose | Status |
|---|---|---|---|
| `axe-core` | 4.11 | Runtime rules engine (WCAG 2.2 AA tagset) | ✓ Installed, 19 URLs scanned |
| `@axe-core/cli` | latest | CLI wrapper (needs WebDriver; we used Puppeteer instead) | ✓ Installed, superseded by custom script |
| `eslint-plugin-jsx-a11y` | latest | Static JSX analysis at build time | ✓ Installed, enabled in `.eslintrc.json`, linted whole repo |
| `jest-axe` | latest | Component-unit a11y tests | ✓ Installed (not yet wired; reserved for next phase) |
| `pa11y-ci` | latest | Secondary CLI scanner (HTML_CS engine) | ✓ Installed (unused here; axe-core is our primary engine) |

**Custom scanner:** `scripts/a11y-scan.mjs` — Puppeteer launches headless Chrome, navigates each URL, injects `axe-core/axe.min.js`, runs with tagset `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa,best-practice`, writes per-URL JSON.

**Config changes:**
- `.eslintrc.json`: added `plugin:jsx-a11y/recommended` to `extends` and `jsx-a11y` to `plugins`. `jsx-a11y/anchor-is-valid` is set to `warn` level and recognizes Next.js `Link`.

---

## 3. Top-10 Common Issues (global — component-level fix resolves many pages)

Ranked by **(pages affected) × (total violating nodes)**. Every one of these has a single source of truth — fixing the component/token fixes every page at once.

### 🔴 #1 `color-contrast` — serious — WCAG 1.4.3 (Level AA)
- **Pages affected:** 18 / 19 (95%)
- **Total nodes:** 232
- **axe help:** <https://dequeuniversity.com/rules/axe/4.11/color-contrast>
- **Root causes** — three design-token combinations fail AA's 4.5:1 ratio:
  | fg (token) | bg (token) | actual | required | nodes | where |
  |---|---|---:|---:|---:|---|
  | `#717680` (`--text-quaternary`) | `#fafafa` (`--bg-secondary`) | **4.36** | 4.5 | 131 | `TabBar` inactive buttons, `TableHeader` cells, pagination meta |
  | `#717680` (`--text-quaternary`) | `#eff1f5` (`--utility-gray-100` / `--bg-tertiary`) | **4.03** | 4.5 | 91 | `Avatar` gray-100 fallback, sub-nav separators, heatmap density-0 cells (text hidden but computed) |
  | `#079455` (`--text-success-primary`) | `#ffffff` (white card) | **3.90** | 4.5 | 10 | `Badge` trend "↑ 5.2%" success text |
- **Fix direction (token-level, global):**
  - Darken `--text-quaternary` from `#717680` → `#61677A` or similar to pass 4.5:1 on both light-gray backgrounds. (Alternatively: never pair `text-quaternary` with `bg-secondary`/`gray-100`; use `text-tertiary` = `#535862` which passes.)
  - For the success badge, swap to `--utility-success-700` (`#067647`) on the green-50 variant; or darken the on-white variant.
- **Why 131 + 91 is one root cause:** both combinations are the same foreground token, just on different gray backgrounds. One token adjustment fixes ~222 of 232 nodes.

### 🔴 #2 `select-name` — critical — WCAG 4.1.2 (Level A)
- **Pages affected:** 9 / 19 (47%)
- **Total nodes:** 10 (one per page that renders `Pagination`)
- **axe help:** <https://dequeuniversity.com/rules/axe/4.11/select-name>
- **Root cause:** `src/components/ui/Pagination.tsx:34` — `<select>` for "rows per page" has no `aria-label`, no `<label htmlFor>`, no `aria-labelledby`.
- **Fix:** one line — add `aria-label="Rows per page"` to the `<select>`. Resolves all 10 nodes across all 9 pages.

### 🟠 #3 `aria-progressbar-name` — serious — WCAG 1.1.1 (Level A)
- **Pages affected:** 7 / 19 (37%)
- **Total nodes:** 44
- **axe help:** <https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name>
- **Root cause:** `src/components/ui/ProgressBar.tsx` — sets `role="progressbar"` + `aria-valuenow/min/max` but no `aria-label` or `aria-labelledby`. Screen readers announce "progressbar, 78" with no context.
- **Fix:** add `aria-label` prop (required) — e.g. `<ProgressBar value={r.score} aria-label={`${r.name} safety score`} />`. Propagate through every call site (Driver Leaderboard, Driver Info Card, Vehicle Info Card, Priority Actions, Compliance Status).

### 🟠 #4 `nested-interactive` — serious — WCAG 4.1.2 (Level A)
- **Pages affected:** 2 / 19 (`/forms/templates`, `/deep-dive/lytx-safety`)
- **Total nodes:** 20
- **axe help:** <https://dequeuniversity.com/rules/axe/4.11/nested-interactive>
- **Root cause:** `src/components/tables/TableRow.tsx` sets `role="button"` + `tabindex="0"` on `<tr>` to make the whole row clickable; but cells inside contain real `<a>` (templates: "Linked Rules") or `<button>` (DotsMenu). A button cannot contain another button.
- **Fix options:**
  - Remove `role="button"` on the row, keep the row click handler but rely on a dedicated "Open" column (chevron-right button already exists in detail cell) to carry the actual `role="button"`.
  - Or: keep the row click but make it a right-arrow-keyboard shortcut only, not a `role="button"`.

### 🟡 #5 `target-size` — serious — WCAG 2.5.8 (Level AA, **WCAG 2.2 only**)
- **Pages affected:** 1 / 19 (`/forms/templates`)
- **Total nodes:** 10
- **axe help:** <https://dequeuniversity.com/rules/axe/4.11/target-size>
- **Root cause:** `src/app/(dashboard)/forms/templates/page.tsx:214` — `<Link href="#">` rendering a single digit ("4", "1", "5", …) in the "Linked Rules" column. Tap target is 6-9px wide × 17px tall, well below 24×24 minimum.
- **Fix:** make the link a `inline-flex items-center justify-center min-h-[24px] min-w-[24px] px-xs` pill, or replace with a button-styled component that has proper padding. Bonus: `href="#"` is the jsx-a11y violation below; if these are placeholder stubs, swap `<Link>` for `<button>` until the target exists.

### ⚙️ #6 `anchor-is-valid` (jsx-a11y static) — WCAG 2.4.4 (Level A)
- **Pages affected:** 1 file (`forms/templates/page.tsx:214`)
- **Root cause:** `href="#"` on the Linked Rules `<Link>` — same element as #5.
- **Fix:** Use `<button>` if there's no real destination yet.

### ⚙️ #7 `aria-role` (jsx-a11y static)
- **Pages affected:** 1 file (`efficiency/driver-deep-dive/[id]/page.tsx:141`)
- **Status:** **false positive.** The lint rule interpreted the custom `role` prop on `<DriverInfoCard>` (which takes a job title string, e.g. `"Delivery Driver · North Region · #1"`) as an ARIA role attribute. Fix = rename the prop to `title`/`jobTitle`/`subtitle`, or add an ESLint inline disable.

### 🟣 #8 `aria-prohibited-attr` (incomplete — manual review) — WCAG 4.1.2 (Level A)
- **Pages affected:** 4 (activity + group-comparison pages)
- **Total nodes:** 1,050 (one per heatmap cell — 7×24 × 2 heatmaps × 3 pages ≈ 1008)
- **Root cause:** `src/components/charts/ActivityHeatmap.tsx` — `<div aria-label="Mon activity">` and `<div aria-label="Mon 00:00 density 0">` have no `role`. `aria-label` on a generic `<div>` is "not well supported" per axe.
- **Fix options:**
  - Add `role="group"` or `role="gridcell"` (if building a proper grid structure) to satisfy the rule.
  - Simpler: since the tooltip (added in the recent commit `7e1c9d4`) already exposes the same info visually, we can safely drop the per-cell `aria-label` and instead announce it via `role="img"` + an outer `role="figure"` / `role="grid"` semantic layer on the whole heatmap.

### 🟣 #9 `aria-valid-attr-value` (incomplete — manual review) — WCAG 4.1.2 (Level A)
- **Pages affected:** 11 / 19
- **Total nodes:** 42
- **Root cause:** `DotsMenu` component uses Radix-style `aria-controls` referencing an ID (`:R1kl7rrufj6:`) that doesn't exist on the page because the menu isn't open yet. axe can't confirm it will exist. Not a true violation — it's correct dynamic behavior — but worth verifying the IDs match when open.
- **Action:** manual spot-check: open a DotsMenu, confirm the popover's `id` matches `aria-controls`. Likely nothing to fix.

### 🟣 #10 `color-contrast` (incomplete — chart SVG text) — WCAG 1.4.3 (Level AA)
- **Pages affected:** 15 / 19
- **Total nodes:** 288
- **Root cause:** Recharts renders axis tick `<tspan>` labels over gridlines. axe can't compute the background because the text sits atop multiple SVG image nodes. These are **likely false positives** — the gridlines are light gray (#e5e7eb) and the tick text is dark (#535862). Should pass AA comfortably; verify with manual spot-check on a screenshot.

---

## 4. Dashboard-specific checks (axe cannot auto-detect — manual review)

These are the domain-specific items you called out; I audited them via `grep` across the codebase.

| Check | Current state | WCAG | Status |
|---|---|---|---|
| **Chart `aria-label` + tabular alternative** | Recharts charts render raw SVG with no `role="img"` / `<title>` / `<desc>` / `aria-label`. No alt data-table exists for any chart. | 1.1.1 A | 🔴 Missing globally |
| **Table `scope="col"` / `scope="row"`** | No `scope` attribute anywhere (`grep -r scope= src/` empty). `TableHeader` component renders plain `<th>`. | 1.3.1 A | 🔴 Missing — easy one-line fix in TableHeader |
| **`aria-sort` for sortable columns** | No `aria-sort` in any component. Many tables (drivers, vehicles, events) likely intend to be sortable. | 1.3.1 A | 🔴 Missing — but only matters once sort is wired up (currently columns are static) |
| **Form field `<label for=>`** | No real forms yet — only the `<select>` in Pagination (covered by #2) and the search `<input>` in filter chips. | 3.3.2 A | ⚠️ Partial — search input uses `placeholder` only; should add `aria-label="Search"` |
| **Color tokens WCAG AA** | 3 failing combinations (see #1). | 1.4.3 AA | 🔴 Token-level fix needed |
| **Focus management — visible ring** | `focus:ring-*` / `focus-visible:*` used in 19 files (nav, buttons, tabs, filter chips, table rows, pagination). Most interactive components have visible focus. | 2.4.7 AA | 🟡 Mostly present, but no audit of consistency — need to verify across all interactive types |
| **Focus order / tab order** | Natural DOM order, no `tabindex>0`. Looks correct but untested with keyboard-only nav. | 2.4.3 A | ⚠️ Needs keyboard walk-through |
| **Keyboard activation of row-as-button** | TableRow has `onKeyDown` handler stub but triggers `nested-interactive` — row click competes with nested buttons. | 2.1.1 A | 🔴 Broken by #4 |
| **Skip-to-main-content link** | No skip link in app shell (`src/app/(dashboard)/layout.tsx` confirmed). | 2.4.1 A | 🔴 Missing — blocks keyboard users from skipping the full side/top nav every page |
| **`prefers-reduced-motion`** | Zero matches in `src/`. All motion (`fs-fade-slide-up`, `fs-scale-pop`, hover transforms, Recharts animations) plays unconditionally. | 2.3.3 AAA (2.2) + vestibular-safety baseline | 🔴 Missing — breaks SC 2.3.3 for users with vestibular conditions |
| **Reduced-motion for Recharts** | No `isAnimationActive={false}` wiring driven by media query. | 2.3.3 AAA | 🔴 Missing |
| **Heading outline** | Pages use single `<h1>` (PageHeader) + `<h2>` section heads. Looks correct in source read. | 1.3.1 A | 🟢 Looks OK — confirm with `axe heading-order` (it didn't flag) |
| **Landmarks** | `<header>`, `<nav>` used in layout. No explicit `<main>` wrapper. | 1.3.1 A + 2.4.1 A | 🟡 Verify `dashboard/layout.tsx` wraps page content in `<main>` |

---

## 5. Unique per-page issues (not covered by component-level fixes above)

| Route | Unique issue |
|---|---|
| `/forms/templates` | The only page triggering both `target-size` + `anchor-is-valid` + `nested-interactive`. Page-specific fix for the "Linked Rules" column. |
| `/deep-dive/lytx-safety` | Only other `nested-interactive` site. Shares TableRow root cause with `/forms/templates` but its cells have DotsMenu buttons rather than Links. |
| `/efficiency/group-comparison` | **Clean** (0 violations). Already passes except the same incomplete/chart false-positives. Use it as a regression reference. |

All other pages' violations are 100% explained by the component/token-level roots in §3.

---

## 6. WCAG 2.2 SC coverage matrix (compact)

Only Level A / AA SCs that either triggered or are at-risk are listed.

| SC | Title | Level | Status | Where |
|---|---|---|---|---|
| 1.1.1 | Non-text content | A | 🔴 Fail | ProgressBar (§3.3), charts (§4), heatmap cells (§3.8) |
| 1.3.1 | Info and Relationships | A | 🔴 Fail | Table `scope`, `aria-sort`, landmarks (§4) |
| 1.4.3 | Contrast (min) | AA | 🔴 Fail | 3 token combos, 232 nodes (§3.1) |
| 2.1.1 | Keyboard | A | 🟡 At risk | nested-interactive rows (§3.4) |
| 2.3.3 | Animation from Interactions | AAA (recommended baseline) | 🔴 Fail | no `prefers-reduced-motion` (§4) |
| 2.4.1 | Bypass Blocks | A | 🔴 Fail | no skip-nav (§4) |
| 2.4.3 | Focus Order | A | ⚠️ Untested | (§4) |
| 2.4.4 | Link Purpose | A | 🔴 Fail | `href="#"` in forms/templates (§3.6) |
| 2.4.7 | Focus Visible | AA | 🟢 Mostly pass | focus-visible present in 19 components (§4) |
| 2.5.8 | Target Size (min) | AA | 🔴 Fail | forms/templates tiny Link (§3.5) |
| 3.3.2 | Labels or Instructions | A | 🟡 At risk | search inputs use placeholder only (§4) |
| 4.1.2 | Name, Role, Value | A | 🔴 Fail | Pagination `<select>` (§3.2), ProgressBar (§3.3), nested-interactive (§3.4), heatmap aria on div (§3.8) |

---

## 7. Priority-ordered fix plan

Ordered by (impact level) × (pages affected) × (implementation cost). **No code changes made in this audit — this is your decision matrix.**

### P0 — Critical, global, cheap (do first)
1. **Add `aria-label="Rows per page"` to `Pagination.tsx:34`** — 1 line, fixes 10 nodes on 9 pages (§3.2, SC 4.1.2 A).
2. **Make `ProgressBar` require `aria-label`** — adjust prop type to require it; update all call sites. Fixes 44 nodes on 7 pages (§3.3, SC 1.1.1 A).
3. **Darken `--text-quaternary` token** from `#717680` to e.g. `#61677A`. Fixes 222 of 232 color-contrast nodes across 18 pages in one token change (§3.1, SC 1.4.3 AA). Visually imperceptible; still lighter than `--text-tertiary`.
4. **Fix `--text-success-primary` pairing** — either darken to `#067647` for on-white use, or restrict the green badge to the `success-50` green chip (which we already use for `Badge`). Fixes remaining 10 color-contrast nodes (§3.1).

### P1 — Serious, global, moderate cost
5. **Remove `role="button"` from `TableRow` when cells contain interactive children.** Keep keyboard handler as a row-level shortcut but rely on the per-row chevron or a dedicated primary action for semantic "button" role. Fixes 20 nodes on 2 pages (§3.4, SC 4.1.2 A, SC 2.1.1 A).
6. **Add skip-link** (`<a href="#main" className="sr-only focus:not-sr-only ...">Skip to main content</a>`) + wrap page `<div>` in `<main id="main">` in `app/(dashboard)/layout.tsx`. Single-file fix; covers all pages (§4, SC 2.4.1 A).
7. **Add `prefers-reduced-motion` guard** in `globals.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after { animation-duration: 0ms !important; transition-duration: 0ms !important; }
     .fs-animate-enter { animation: none !important; }
   }
   ```
   Plus an `isAnimationActive={!prefersReduced}` wire-up on Recharts components via a small `useReducedMotion()` hook. (§4, SC 2.3.3)

### P2 — Serious, local, cheap
8. **`/forms/templates` "Linked Rules" column** — turn the numeric `<Link>` into a `<button>` (no real destination exists) with `min-h-[24px] min-w-[24px] px-xs` padding. Fixes `target-size` + `anchor-is-valid` + contributes to `nested-interactive` on that page (§3.5–3.7).

### P3 — Semantic correctness, low-risk
9. **Add `scope="col"` to `TableHeader`** component. Single-line fix; applies to every table (§4, SC 1.3.1 A).
10. **Chart accessibility layer**: wrap every Recharts chart in a `<figure role="img" aria-label="…">` with an adjacent visually-hidden `<table>` providing the underlying data. Cover `GroupedColumnChart`, `DualAreaLineChart`, `TimeBreakdownDonut`, `DefectsStackedBar`, `ActivityHeatmap`, `USHotspotMap`, `ComplianceTrendChart`, `HorizontalBarChart`, `AreaLineChart` (9 components). (§4, SC 1.1.1 A)
11. **`ActivityHeatmap` — drop `aria-label` on naked `<div>` cells**; wrap whole grid in `role="img"` + `aria-label="Activity heatmap, Mon 00:00 to Sun 23:00"` and move detail into the existing hover tooltip (§3.8, SC 4.1.2 A).
12. **Rename `DriverInfoCard` `role` prop** to `subtitle` or `jobTitle` to silence jsx-a11y false positive (§3.7).
13. **Add `aria-label="Search"` or `<label className="sr-only">Search</label>`** to every search input (currently placeholder-only). (§4, SC 3.3.2 A)

### P4 — Nice-to-have / prepare for future
14. Wire `jest-axe` into a component-unit test file (`__tests__/a11y.test.tsx`) that renders every UI component and asserts `toHaveNoViolations()` — catches regressions before they reach pages.
15. Add `aria-sort` + arrow-key column-header navigation when real sorting is introduced.
16. Manual keyboard walk-through of every page (focus order, trap checks on DotsMenu/GroupSelector dropdowns). Not automatable.

---

## 8. What's next?

> As requested, **no code was modified in this audit.** The only repo changes are:
> - `.eslintrc.json` — added `jsx-a11y/recommended` (so future lints catch regressions)
> - `scripts/a11y-scan.mjs` — the scanner script
> - `package.json` + lockfile — 5 dev-dependencies
> - `A11Y_AUDIT.md` — this report
> - `.a11y-reports/` — raw JSON artifacts (already in `.gitignore`? confirm before committing)
>
> Please review the priority plan in §7 and tell me which tier(s) to execute. P0 (4 items) is the highest ROI — four touch points fix ~286 of 316 violation nodes across the entire app.

### Re-audit workflow after fixes

```bash
# 1. Re-run axe against all pages
node scripts/a11y-scan.mjs

# 2. Re-run static lint
npx next lint --format json --output-file .a11y-reports/eslint.json

# 3. Compare: number of rules should drop from 5 → near 0
jq '[.[].results.violations[].id] | unique' .a11y-reports/localhost_3000_*.json
```
