#!/usr/bin/env node
// Verifies the "every other page unchanged (bundle diff = 0)" P0 criterion for Projects World.
//
// Reads the already-built `dist/` (run `pnpm build` first). Two checks:
//   1. Leak check   — no non-world page may reference a Phaser chunk or a `/world/` asset.
//   2. Baseline check — the JS/CSS a fixed set of shared pages reference must be byte-identical
//                       (same filenames + content hashes) to the committed baseline. Any drift
//                       fails, so a world slice can never silently alter a shared page's bundle.
//
// Regenerate the baseline (only for a *legitimate* unrelated change, called out in review):
//   node scripts/check-world-isolation.mjs --update-baseline
//
// Exit code 0 = PASS, 1 = FAIL. No dependencies beyond Node's stdlib.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const BASELINE_PATH = join(ROOT, 'scripts', 'world-isolation-baseline.json');

// dist-relative HTML files for the two world pages, excluded from the leak walk and the baseline.
const WORLD_PAGES = ['projects/world/index.html', 'en/projects/world/index.html'];

const updateBaseline = process.argv.includes('--update-baseline');

function fail(message) {
  console.error(`\n❌ world-isolation: FAIL\n${message}\n`);
  process.exit(1);
}

if (!existsSync(DIST)) {
  fail('dist/ not found. Run `pnpm build` before this script.');
}

/** Recursively collect every *.html file under dir, returned dist-relative with forward slashes. */
function walkHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      out.push(...walkHtml(abs));
    } else if (entry.endsWith('.html')) {
      out.push(relative(DIST, abs).split('\\').join('/'));
    }
  }
  return out;
}

/** All asset URLs referenced by an HTML string (src/href attrs + module preloads + import specifiers). */
function assetRefs(html) {
  const refs = new Set();
  // src="…" / href="…"
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) refs.add(m[1]);
  // any /_astro/… or /world/… path anywhere (inline import maps, modulepreload, etc.)
  for (const m of html.matchAll(/(?:\/_astro\/|\/world\/)[^"'\s)>]+/gi)) refs.add(m[0]);
  return [...refs];
}

/** Sorted, unique basenames of the /_astro/*.js and /_astro/*.css this HTML references. */
function bundleFilenames(html) {
  const names = new Set();
  for (const m of html.matchAll(/\/_astro\/([^"'\s)>]+?\.(?:js|css))/gi)) names.add(m[1]);
  return [...names].sort();
}

// Walk once; both checks read the same set of non-world pages.
const allHtml = walkHtml(DIST);
const nonWorldHtml = allHtml.filter((p) => !WORLD_PAGES.includes(p));

// ── Check 1: leak (per-page, by name/asset) ──────────────────────────────────
// Fast, specific signal for the two clearest leak vectors: the `phaser-vendor` manual chunk and
// any `/world/` static asset (paintings, audio) referenced from a page that isn't the world.
const leaks = [];
// Union of every `_astro/*.{js,css}` basename referenced across ALL non-world pages, plus which
// pages reference each (for attribution). Built in the same pass.
const chunkToPages = new Map();

for (const page of nonWorldHtml) {
  const html = readFileSync(join(DIST, page), 'utf8');
  for (const ref of assetRefs(html)) {
    if (/phaser/i.test(ref) || ref.startsWith('/world/')) {
      leaks.push(`  ${page} → ${ref}`);
    }
  }
  for (const name of bundleFilenames(html)) {
    if (!chunkToPages.has(name)) chunkToPages.set(name, []);
    chunkToPages.get(name).push(page);
  }
}

if (leaks.length > 0) {
  fail(`World assets leaked into non-world pages:\n${leaks.join('\n')}`);
}

// ── Check 2: bundle baseline (union over EVERY non-world page) ────────────────
// The name-based leak check above cannot catch world code that Rollup *merges* into an existing,
// non-world-named chunk (e.g. a shared component importing a world module → `SomeCard.<newhash>.js`).
// The only reliable signal for that is content-hash drift. So the baseline is the sorted union of
// the `_astro` chunk basenames referenced by every non-world page: any world code reaching any of
// them changes a hash → a basename appears/disappears → FAIL. World-only additions (Phaser, game
// scenes) never touch this set, so genuine world slices don't churn the baseline.
const currentChunks = [...chunkToPages.keys()].sort();

if (updateBaseline) {
  writeFileSync(BASELINE_PATH, JSON.stringify({ chunks: currentChunks }, null, 2) + '\n');
  console.log(`\n✅ world-isolation: baseline written to ${relative(ROOT, BASELINE_PATH)}\n`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  fail(
    `No baseline at ${relative(ROOT, BASELINE_PATH)}.\n` +
      'Generate it once with: node scripts/check-world-isolation.mjs --update-baseline'
  );
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const before = baseline.chunks ?? [];
const added = currentChunks.filter((c) => !before.includes(c));
const removed = before.filter((c) => !currentChunks.includes(c));

if (added.length || removed.length) {
  const addedLines = added.map(
    (c) => `    + ${c}  (on: ${(chunkToPages.get(c) ?? []).slice(0, 3).join(', ')})`
  );
  const removedLines = removed.map((c) => `    - ${c}`);
  fail(
    `Non-world page bundles changed vs baseline (union of ${nonWorldHtml.length} pages):\n` +
      [...addedLines, ...removedLines].join('\n') +
      '\n\nIf this is a legitimate unrelated change, regenerate the baseline in the same PR:\n' +
      '  node scripts/check-world-isolation.mjs --update-baseline'
  );
}

console.log(
  `\n✅ world-isolation: PASS — ${nonWorldHtml.length} non-world pages leak-free; ` +
    `${currentChunks.length} shared chunks unchanged.\n`
);
