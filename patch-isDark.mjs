// patch-isDark.mjs
// Run from your CompForge project root:
//   node patch-isDark.mjs
//
// What it does:
//   1. All src/components/playground/*ControlPanel.tsx
//      - Adds `isDark?: boolean` to the Props interface
//      - Adds `isDark = true` to the destructure
//      - Adds `isDark={isDark}` to every <ColorRow that doesn't already have it
//
//   2. All src/app/playground/*/page.tsx
//      - Adds `isDark={mode === "dark"}` to the <*ControlPanel usage
//        (only when the prop isn't already there)
//
// Safe to re-run — skips files that are already patched.

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

import { fileURLToPath } from "url";
const ROOT = fileURLToPath(new URL(".", import.meta.url));

// ─── helpers ──────────────────────────────────────────────────────────────────

function read(p) {
  return readFileSync(p, "utf8");
}

function write(p, content) {
  writeFileSync(p, content, "utf8");
}

function findFiles(dir, predicate) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, predicate));
    } else if (entry.isFile() && predicate(entry.name, full)) {
      results.push(full);
    }
  }
  return results;
}

// ─── 1. Patch ControlPanel files ─────────────────────────────────────────────

const controlPanelDir = join(ROOT, "src/components/playground");

const controlPanelFiles = findFiles(
  controlPanelDir,
  (name) => name.endsWith("ControlPanel.tsx")
);

let cpPatched = 0;
let cpSkipped = 0;

for (const file of controlPanelFiles) {
  let src = read(file);
  let changed = false;

  // --- Step A: add isDark? to Props interface ---
  // Matches the closing of any Props interface that has onReset but not isDark
  if (!src.includes("isDark?:")) {
    src = src.replace(
      /(onReset\s*:\s*\(\)\s*=>\s*void;\s*\n)(})/,
      "$1  isDark?: boolean;\n$2"
    );
    changed = true;
  }

  // --- Step B: add isDark = true to destructure ---
  // Matches `onReset,\n}:` pattern (the last prop before the closing brace of destructure)
  if (!src.includes("isDark = true")) {
    src = src.replace(
      /(onReset,\s*\n)(}\s*:)/,
      "$1  isDark = true,\n$2"
    );
    changed = true;
  }

  // --- Step C: add isDark={isDark} to all ColorRow usages that lack it ---
  // Matches <ColorRow ...> that don't already have isDark
  const colorRowRegex = /(<ColorRow\b(?![^>]*isDark)[^/]*)\/>/g;
  if (colorRowRegex.test(src)) {
    src = src.replace(
      /(<ColorRow\b(?![^>]*isDark)[^/]*)\/>/g,
      "$1  isDark={isDark}\n/>"
    );
    changed = true;
  }

  if (changed) {
    write(file, src);
    console.log(`✓ ControlPanel patched: ${basename(file)}`);
    cpPatched++;
  } else {
    console.log(`· ControlPanel skipped (already patched): ${basename(file)}`);
    cpSkipped++;
  }
}

// ─── 2. Patch playground page.tsx files ──────────────────────────────────────

const playgroundDir = join(ROOT, "src/app/playground");

const pageFiles = findFiles(
  playgroundDir,
  (name, fullPath) => name === "page.tsx"
);

let pagePatched = 0;
let pageSkipped = 0;

for (const file of pageFiles) {
  let src = read(file);
  let changed = false;

  // Matches <AnyNameControlPanel ... onReset={handleReset} without isDark already
  // The prop order from ResizablePlayground usage is always:
  //   config={config} onChange={handleChange} onReset={handleReset}
  if (
    src.includes("ControlPanel") &&
    src.includes("onReset={handleReset}") &&
    !src.includes("isDark={mode")
  ) {
    src = src.replace(
      /(onReset=\{handleReset\})/g,
      "$1\n          isDark={mode === \"dark\"}"
    );
    changed = true;
  }

  if (changed) {
    write(file, src);
    console.log(`✓ Page patched:        ${file.replace(ROOT, "")}`);
    pagePatched++;
  } else {
    console.log(`· Page skipped:        ${file.replace(ROOT, "")}`);
    pageSkipped++;
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log("\n─────────────────────────────────────");
console.log(`ControlPanels  patched: ${cpPatched}  skipped: ${cpSkipped}`);
console.log(`Pages          patched: ${pagePatched}  skipped: ${pageSkipped}`);
console.log("─────────────────────────────────────");
console.log("Done. Run `next dev` to verify.");
