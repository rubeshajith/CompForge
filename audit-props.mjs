#!/usr/bin/env node
/**
 * CompForge — Prop Coverage Audit Script
 *
 * For every component it checks:
 *   1. PREVIEW  — every control panel prop is used in the Preview file
 *   2. JSX      — every control panel prop is used in generateJSX output
 *   3. CSS      — every control panel prop is used in generateCSS output
 *   4. TSX      — every control panel prop is used in generateTSX output
 *   5. TAILWIND — every control panel prop is used in generateTailwind output
 *
 * A prop is "used" if its exact name appears anywhere in the file text.
 * Missing = BLOCKER candidate — needs manual confirmation.
 *
 * Usage:
 *   node audit-props.mjs                        # audit all components
 *   node audit-props.mjs analyticsTable         # audit one component
 *   node audit-props.mjs --json                 # output as JSON
 *   node audit-props.mjs analyticsTable --json  # one component as JSON
 */

import fs from "fs";
import path from "path";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// Adjust this to point at your CompForge/src directory
const SRC = process.argv[2]?.startsWith("--")
  ? path.resolve("src")
  : process.argv[2]
    ? path.resolve("src") // single-component mode still uses src
    : path.resolve("src");

const CONTROL_PANEL_DIR = path.join(SRC, "components/playground");
const LIB_DIR = path.join(SRC, "lib");

const JSON_MODE =
  process.argv.includes("--json") || process.argv[3] === "--json";
const SINGLE =
  process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

/**
 * Extract prop names from a control panel file.
 *
 * Strategy: look for the config interface prop accesses in the component.
 * Control panels receive a `config` prop and read fields like:
 *   config.accentColor   onChange("accentColor", ...)   value={config.fontSize}
 *
 * We extract every identifier that follows `config.` — these are the
 * props the user can actually change.
 */
function extractControlPanelProps(controlPanelText) {
  const props = new Set();

  // Match config.propName patterns (the user-facing props)
  const configDotPattern = /\bconfig\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let m;
  while ((m = configDotPattern.exec(controlPanelText)) !== null) {
    props.add(m[1]);
  }

  // Also match onChange("propName", ...) — direct string key references
  const onChangeLiteralPattern =
    /onChange\(\s*["']([a-zA-Z_][a-zA-Z0-9_]*)["']/g;
  while ((m = onChangeLiteralPattern.exec(controlPanelText)) !== null) {
    props.add(m[1]);
  }

  // Remove known non-prop utility identifiers that appear after config.
  const IGNORE = new Set([
    "length",
    "map",
    "filter",
    "find",
    "forEach",
    "reduce",
    "includes",
    "some",
    "every",
    "keys",
    "values",
    "entries",
    "toString",
    "toFixed",
    "split",
    "join",
    "trim",
    "replace",
    "indexOf",
    "slice",
    "push",
    "pop",
    "shift",
    "unshift",
  ]);

  for (const p of props) {
    if (IGNORE.has(p)) props.delete(p);
  }

  return [...props].sort();
}

/**
 * Check which of the given props appear in a file's text.
 * Returns { present: string[], missing: string[] }
 */
function checkCoverage(fileText, props) {
  if (!fileText) return { present: [], missing: props, fileNotFound: true };

  const present = [];
  const missing = [];

  for (const prop of props) {
    // Look for the prop name as a word boundary match
    // This catches: config.propName, c.propName, ${config.propName}, "propName", propName:
    const pattern = new RegExp(`\\b${escapeRegex(prop)}\\b`);
    if (pattern.test(fileText)) {
      present.push(prop);
    } else {
      missing.push(prop);
    }
  }

  return { present, missing, fileNotFound: false };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── COMPONENT DISCOVERY ─────────────────────────────────────────────────────

/**
 * Build a map of componentName → { controlPanel, preview, generate }
 * by scanning the control panel directory for *ControlPanel.tsx files.
 */
function discoverComponents() {
  const files = fs.readdirSync(CONTROL_PANEL_DIR);
  const components = [];

  for (const file of files) {
    if (!file.endsWith("ControlPanel.tsx")) continue;

    // e.g. AnalyticsTableControlPanel.tsx → AnalyticsTable
    const componentName = file.replace("ControlPanel.tsx", "");
    const camelName = componentName[0]?.toLowerCase() + componentName.slice(1);

    // Preview file — e.g. AnalyticsTablePreview.tsx or BreadcrumbsPreview.tsx
    // Try exact match first, then scan for any file containing the component name + Preview
    let previewFile = path.join(
      CONTROL_PANEL_DIR,
      `${componentName}Preview.tsx`,
    );
    if (!fs.existsSync(previewFile)) {
      // Fuzzy search — some names differ (e.g. Breadcrumb → BreadcrumbsPreview)
      const match = files.find(
        (f) =>
          f.endsWith("Preview.tsx") &&
          f.toLowerCase().startsWith(camelName.toLowerCase().slice(0, 6)),
      );
      if (match) previewFile = path.join(CONTROL_PANEL_DIR, match);
      else previewFile = null;
    }

    // Generate file — in lib/ as generate<Name>Code.ts
    // Try camelCase name first, then some known variants
    const generateCandidates = [
      path.join(LIB_DIR, `generate${componentName}Code.ts`),
      path.join(LIB_DIR, `generate${componentName}.ts`), // emailTemplate uses this
    ];
    let generateFile = generateCandidates.find((p) => fs.existsSync(p)) || null;

    components.push({
      name: componentName,
      camelName,
      controlPanelFile: path.join(CONTROL_PANEL_DIR, file),
      previewFile: fs.existsSync(previewFile || "") ? previewFile : null,
      generateFile,
    });
  }

  return components;
}

// ─── GENERATE FUNCTION NAME DETECTION ────────────────────────────────────────

/**
 * From the generate file, identify which export functions exist and
 * extract the output string body of each so we can check prop usage
 * within just that export's output — not the whole file.
 *
 * Falls back to whole-file check if function extraction fails.
 */
function extractExportBodies(generateText, componentName) {
  if (!generateText) return {};

  // Find function names like generateAnalyticsTableJSX, generateAnalyticsTableTailwind etc.
  const fnPattern =
    /export\s+function\s+(generate\w+?(JSX|CSS|TSX|Tailwind|Jsx|Css|Tsx))\s*\(/g;
  const exports = {};
  let m;

  while ((m = fnPattern.exec(generateText)) !== null) {
    const fnName = m[1];
    const exportType =
      m[2].toUpperCase() === "TAILWIND" ? "Tailwind" : m[2].toUpperCase();

    // Extract function body — find matching braces
    const startIdx = generateText.indexOf("{", m.index + m[0].length - 1);
    if (startIdx === -1) continue;

    let depth = 1;
    let i = startIdx + 1;
    while (i < generateText.length && depth > 0) {
      if (generateText[i] === "{") depth++;
      else if (generateText[i] === "}") depth--;
      i++;
    }

    exports[exportType] = {
      fnName,
      body: generateText.slice(startIdx, i),
    };
  }

  // If no exports found via pattern, return whole file as fallback
  if (Object.keys(exports).length === 0) {
    return { FULL_FILE: { fnName: "unknown", body: generateText } };
  }

  return exports;
}

// ─── AUDIT ONE COMPONENT ─────────────────────────────────────────────────────

function auditComponent(component) {
  const cpText = read(component.controlPanelFile);
  if (!cpText) {
    return {
      name: component.name,
      error: "Control panel file not readable",
      props: [],
      results: {},
    };
  }

  const props = extractControlPanelProps(cpText);
  if (props.length === 0) {
    return {
      name: component.name,
      error: "No props extracted from control panel",
      props: [],
      results: {},
    };
  }

  const previewText = read(component.previewFile);
  const generateText = read(component.generateFile);
  const exportBodies = extractExportBodies(generateText, component.name);

  const results = {};

  // 1. Preview check
  results.PREVIEW = {
    file: component.previewFile
      ? path.basename(component.previewFile)
      : "NOT FOUND",
    ...checkCoverage(previewText, props),
  };

  // 2. Per-export checks
  const exportOrder = ["JSX", "CSS", "TSX", "TAILWIND"];
  for (const exportType of exportOrder) {
    const exportKey = Object.keys(exportBodies).find(
      (k) => k.toUpperCase() === exportType || k === "FULL_FILE",
    );

    if (exportKey) {
      results[exportType] = {
        file: component.generateFile
          ? path.basename(component.generateFile)
          : "NOT FOUND",
        fnName: exportBodies[exportKey].fnName,
        ...checkCoverage(exportBodies[exportKey].body, props),
      };
    } else {
      results[exportType] = {
        file: component.generateFile
          ? path.basename(component.generateFile)
          : "NOT FOUND",
        fnName: "NOT FOUND",
        present: [],
        missing: props,
        fileNotFound: !component.generateFile,
      };
    }
  }

  return { name: component.name, props, results };
}

// ─── REPORTING ────────────────────────────────────────────────────────────────

const COLS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function c(color, text) {
  return `${COLS[color]}${text}${COLS.reset}`;
}

function printReport(auditResults) {
  const CHECK_LABELS = {
    PREVIEW: "Preview",
    JSX: "JSX     ",
    CSS: "CSS     ",
    TSX: "TSX     ",
    TAILWIND: "Tailwind",
  };

  let totalComponents = 0;
  let totalBlockers = 0;
  let cleanComponents = 0;
  const blockerSummary = [];

  for (const result of auditResults) {
    totalComponents++;

    if (result.error) {
      console.log(
        `\n${c("yellow", "⚠")}  ${c("bold", result.name)} — ${result.error}`,
      );
      continue;
    }

    // Count total missing across all checks for this component
    let componentBlockers = 0;
    const checkResults = [];

    for (const [checkKey, checkLabel] of Object.entries(CHECK_LABELS)) {
      const r = result.results[checkKey];
      if (!r) continue;
      if (r.missing.length > 0) {
        componentBlockers += r.missing.length;
        checkResults.push({ checkKey, checkLabel, r });
      }
    }

    totalBlockers += componentBlockers;

    if (componentBlockers === 0) {
      cleanComponents++;
      console.log(
        `\n${c("green", "✅")} ${c("bold", result.name)} — all ${result.props.length} props wired`,
      );
    } else {
      console.log(
        `\n${c("red", "🔴")} ${c("bold", result.name)} — ${componentBlockers} missing prop reference(s) across checks`,
      );
      console.log(
        c("dim", `   Props in control panel: ${result.props.length}`),
      );

      for (const { checkKey, checkLabel, r } of checkResults) {
        if (r.fileNotFound) {
          console.log(`   ${c("yellow", checkLabel)} → file not found`);
        } else if (r.missing.length > 0) {
          console.log(
            `   ${c("red", checkLabel)} → missing: ${c("yellow", r.missing.join(", "))}`,
          );
        }
      }

      blockerSummary.push({
        component: result.name,
        blockers: componentBlockers,
        checks: checkResults.map(({ checkKey, r }) => ({
          check: checkKey,
          missing: r.missing,
        })),
      });
    }
  }

  // ── Summary ──
  console.log("\n" + "─".repeat(60));
  console.log(c("bold", "SUMMARY"));
  console.log("─".repeat(60));
  console.log(`Components audited : ${totalComponents}`);
  console.log(`Clean              : ${c("green", String(cleanComponents))}`);
  console.log(
    `Has missing props  : ${c("red", String(totalComponents - cleanComponents))}`,
  );
  console.log(`Total missing refs : ${c("red", String(totalBlockers))}`);

  if (blockerSummary.length > 0) {
    console.log(
      "\n" + c("bold", "Components needing attention (worst first):"),
    );
    blockerSummary
      .sort((a, b) => b.blockers - a.blockers)
      .forEach((s) => {
        console.log(
          `  ${c("red", "●")} ${s.component} (${s.blockers} missing)`,
        );
      });

    console.log(
      "\n" +
        c(
          "dim",
          "Note: 'missing' means the prop name does not appear anywhere in that\n" +
            "file. This is a strong BLOCKER signal but confirm manually — the prop\n" +
            "may be aliased or covered by a spread. Check each flagged prop before\n" +
            "treating it as confirmed broken.",
        ),
    );
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(
      `ERROR: src directory not found at ${SRC}\n` +
        `Run this script from your CompForge project root (where package.json is).`,
    );
    process.exit(1);
  }

  let components = discoverComponents();

  if (SINGLE) {
    // Allow partial match — "analytics" matches "AnalyticsTable"
    components = components.filter(
      (c) =>
        c.name.toLowerCase().includes(SINGLE.toLowerCase()) ||
        c.camelName.toLowerCase().includes(SINGLE.toLowerCase()),
    );

    if (components.length === 0) {
      console.error(`No component found matching "${SINGLE}"`);
      console.error(
        "Available: " +
          discoverComponents()
            .map((c) => c.camelName)
            .join(", "),
      );
      process.exit(1);
    }
  }

  const auditResults = components.map(auditComponent);

  if (JSON_MODE) {
    console.log(JSON.stringify(auditResults, null, 2));
  } else {
    console.log(c("bold", "\n🔍 CompForge Prop Coverage Audit\n"));
    printReport(auditResults);
  }
}

main();
