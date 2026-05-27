import type { BreadcrumbConfig } from "./breadcrumbsConfig";

// ─── Sample crumbs baked into generated output ───────────────────────
const SAMPLE_CRUMBS = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb", href: null },
];

// ════════════════════════════════════════════════════════════════════════
// JSX GENERATOR
// ════════════════════════════════════════════════════════════════════════
export function generateBreadcrumbJSX(config: BreadcrumbConfig): string {
  switch (config.variant) {
    case "pill":
      return generatePillJSX(config);
    case "arrow":
      return generateArrowJSX(config);
    case "underline":
      return generateUnderlineJSX(config);
    case "mono":
      return generateMonoJSX(config);
    default:
      return generateDefaultJSX(config);
  }
}

// ─── Shared helpers ──────────────────────────────────────────────────
const crumbsConst = `const crumbs = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb", href: null },
];`;

function homeIconJSX(color: string): string {
  return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2 6.5L8 1.5L14 6.5V14H10V10H6V14H2V6.5Z" stroke="${color}" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>`;
}

function chevronSepJSX(color: string): string {
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M4 2L8 6L4 10" stroke="${color}" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>`;
}

// ─── 1. Default variant ───────────────────────────────────────────────
function generateDefaultJSX(c: BreadcrumbConfig): string {
  return `import { useState } from "react";
import "./Breadcrumb.css";

${crumbsConst}

export default function Breadcrumb({ onCrumbClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav aria-label="breadcrumb">
      <ol className="bc">
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;

          return (
            <li key={i} className="bc__item">
              {i > 0 && <span className="bc__sep">/</span>}
              <span
                className={\`bc__crumb\${isActive ? " bc__crumb--active" : ""}\${isHovered ? " bc__crumb--hover" : ""}\`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => !isActive && onCrumbClick?.(crumb)}
              >
                {i === 0 && (
                  ${homeIconJSX(c.textColor)}
                )}
                {crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`;
}

// ─── 2. Pill variant ──────────────────────────────────────────────────
function generatePillJSX(c: BreadcrumbConfig): string {
  return `import { useState } from "react";
import "./Breadcrumb.css";

${crumbsConst}

export default function Breadcrumb({ onCrumbClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav aria-label="breadcrumb">
      <ol className="bc bc--pill">
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;

          return (
            <li key={i} className="bc__item">
              {i > 0 && (
                <span className="bc__sep">
                  ${chevronSepJSX(c.separatorColor)}
                </span>
              )}
              <span
                className={\`bc__crumb\${isActive ? " bc__crumb--active" : ""}\${isHovered ? " bc__crumb--hover" : ""}\`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => !isActive && onCrumbClick?.(crumb)}
              >
                {i === 0 && (
                  ${homeIconJSX(c.textColor)}
                )}
                {crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`;
}

// ─── 3. Arrow variant ─────────────────────────────────────────────────
function generateArrowJSX(c: BreadcrumbConfig): string {
  return `import { useState } from "react";
import "./Breadcrumb.css";

${crumbsConst}

const ARROW_OVERLAP = 12;
const total = crumbs.length;

export default function Breadcrumb({ onCrumbClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav aria-label="breadcrumb">
      <ol className="bc bc--arrow">
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isFirst = i === 0;
          const isLast = i === total - 1;

          return (
            <li
              key={i}
              className={\`bc__crumb bc__crumb--arrow-item\${isActive ? " bc__crumb--active" : ""}\${isHovered ? " bc__crumb--hover" : ""}\${isFirst ? " bc__crumb--first" : ""}\${isLast ? " bc__crumb--last" : ""}\`}
              style={{ zIndex: total - i }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => !isActive && onCrumbClick?.(crumb)}
            >
              {i === 0 && (
                ${homeIconJSX("#ffffff")}
              )}
              {crumb.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`;
}

// ─── 4. Underline variant ─────────────────────────────────────────────
function generateUnderlineJSX(c: BreadcrumbConfig): string {
  return `import { useState } from "react";
import "./Breadcrumb.css";

${crumbsConst}

export default function Breadcrumb({ onCrumbClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav aria-label="breadcrumb">
      <ol className="bc bc--underline">
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;

          return (
            <li key={i} className="bc__item">
              {i > 0 && <span className="bc__sep">·</span>}
              <span
                className={\`bc__crumb\${isActive ? " bc__crumb--active" : ""}\${isHovered ? " bc__crumb--hover" : ""}\`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => !isActive && onCrumbClick?.(crumb)}
              >
                {i === 0 && (
                  ${homeIconJSX(c.textColor)}
                )}
                {crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`;
}

// ─── 5. Mono variant ──────────────────────────────────────────────────
function generateMonoJSX(c: BreadcrumbConfig): string {
  return `import { useState } from "react";
import "./Breadcrumb.css";

${crumbsConst}

export default function Breadcrumb({ onCrumbClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav aria-label="breadcrumb">
      <ol className="bc bc--mono">
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;

          return (
            <li key={i} className="bc__item">
              {i > 0 && <span className="bc__sep">/</span>}
              <span
                className={\`bc__crumb\${isActive ? " bc__crumb--active" : ""}\${isHovered ? " bc__crumb--hover" : ""}\`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => !isActive && onCrumbClick?.(crumb)}
              >
                {i === 0 && <span className="bc__tilde">~</span>}
                {crumb.label.toLowerCase()}
                {isActive && <span className="bc__cursor">_</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`;
}

// ════════════════════════════════════════════════════════════════════════
// CSS GENERATOR
// ════════════════════════════════════════════════════════════════════════
export function generateBreadcrumbCSS(config: BreadcrumbConfig): string {
  switch (config.variant) {
    case "pill":
      return generatePillCSS(config);
    case "arrow":
      return generateArrowCSS(config);
    case "underline":
      return generateUnderlineCSS(config);
    case "mono":
      return generateMonoCSS(config);
    default:
      return generateDefaultCSS(config);
  }
}

const transition = (animate: boolean) =>
  animate
    ? "transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;"
    : "";

// ─── 1. Default CSS ───────────────────────────────────────────────────
function generateDefaultCSS(c: BreadcrumbConfig): string {
  return `/* Breadcrumb — Default variant */
.bc {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.bc__item {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  list-style: none;
}

.bc__sep {
  color: ${c.separatorColor};
  font-size: ${c.fontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  user-select: none;
}

.bc__crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${c.textColor};
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  font-family: 'Instrument Sans', sans-serif;
  padding: ${c.itemPaddingY}px ${c.itemPaddingX}px;
  cursor: pointer;
  ${transition(c.animate)}
}

.bc__crumb--hover {
  color: ${c.textHoverColor};
}

.bc__crumb--active {
  color: ${c.activeTextColor};
  font-weight: ${c.fontWeight + 100};
  cursor: default;
}`;
}

// ─── 2. Pill CSS ──────────────────────────────────────────────────────
function generatePillCSS(c: BreadcrumbConfig): string {
  return `/* Breadcrumb — Pill variant */
.bc--pill {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 4px;
  background: ${c.backgroundColor};
  border: 1px solid ${c.borderColor};
  border-radius: ${c.borderRadius + 4}px;
  width: fit-content;
}

.bc__item {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  list-style: none;
}

.bc__sep {
  display: flex;
  align-items: center;
  color: ${c.separatorColor};
}

.bc__crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${c.itemPaddingY}px ${c.itemPaddingX}px;
  border-radius: ${c.borderRadius}px;
  border: 1px solid transparent;
  background: transparent;
  color: ${c.textColor};
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  font-family: 'Instrument Sans', sans-serif;
  cursor: pointer;
  ${transition(c.animate)}
}

.bc__crumb--hover {
  background: ${c.itemHoverBackground};
  color: ${c.textHoverColor};
}

.bc__crumb--active {
  background: ${c.activeBackground};
  border-color: ${c.activeBorderColor}40;
  color: ${c.activeTextColor};
  font-weight: ${c.fontWeight + 100};
  cursor: default;
}`;
}

// ─── 3. Arrow CSS ─────────────────────────────────────────────────────
function generateArrowCSS(c: BreadcrumbConfig): string {
  const overlap = 12;
  return `/* Breadcrumb — Arrow variant */
.bc--arrow {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${c.borderColor};
  border-radius: ${c.borderRadius}px;
  overflow: hidden;
  width: fit-content;
}

.bc__crumb--arrow-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${c.itemPaddingY}px ${c.itemPaddingX + overlap}px ${c.itemPaddingY}px ${c.itemPaddingX}px;
  background: ${c.itemBackground};
  color: ${c.textColor};
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  font-family: 'Instrument Sans', sans-serif;
  cursor: pointer;
  position: relative;
  margin-left: -${overlap}px;
  list-style: none;
  clip-path: polygon(${overlap}px 0, calc(100% - ${overlap}px) 0, 100% 50%, calc(100% - ${overlap}px) 100%, ${overlap}px 100%, 0 50%);
  ${transition(c.animate)}
}

.bc__crumb--arrow-item.bc__crumb--first {
  margin-left: 0;
  clip-path: polygon(0 0, calc(100% - ${overlap}px) 0, 100% 50%, calc(100% - ${overlap}px) 100%, 0 100%);
}

.bc__crumb--arrow-item.bc__crumb--last {
  clip-path: polygon(${overlap}px 0, 100% 0, 100% 100%, ${overlap}px 100%, 0 50%);
  padding-right: ${c.itemPaddingX}px;
}

.bc__crumb--arrow-item.bc__crumb--first.bc__crumb--last {
  margin-left: 0;
  clip-path: none;
}

.bc__crumb--arrow-item.bc__crumb--hover {
  background: ${c.itemHoverBackground};
  color: ${c.textHoverColor};
}

.bc__crumb--arrow-item.bc__crumb--active {
  background: ${c.accentColor};
  color: #ffffff;
  font-weight: ${c.fontWeight + 100};
  cursor: default;
}`;
}

// ─── 4. Underline CSS ─────────────────────────────────────────────────
function generateUnderlineCSS(c: BreadcrumbConfig): string {
  return `/* Breadcrumb — Underline variant */
.bc--underline {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.bc__item {
  display: flex;
  align-items: center;
  gap: ${c.gap}px;
  list-style: none;
}

.bc__sep {
  color: ${c.separatorColor};
  font-size: ${c.fontSize - 1}px;
  font-family: 'Instrument Sans', sans-serif;
  user-select: none;
  padding-bottom: 2px;
}

.bc__crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${c.textColor};
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  font-family: 'Instrument Sans', sans-serif;
  padding: ${c.itemPaddingY}px ${c.itemPaddingX}px ${c.itemPaddingY + 2}px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  ${transition(c.animate)}
}

.bc__crumb--hover {
  color: ${c.textHoverColor};
  border-bottom-color: ${c.separatorColor};
}

.bc__crumb--active {
  color: ${c.activeTextColor};
  font-weight: ${c.fontWeight + 100};
  border-bottom-color: ${c.accentColor};
  cursor: default;
}`;
}

// ─── 5. Mono CSS ──────────────────────────────────────────────────────
function generateMonoCSS(c: BreadcrumbConfig): string {
  return `/* Breadcrumb — Mono variant */
.bc--mono {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 2px 4px;
  background: ${c.backgroundColor};
  border: 1px solid ${c.borderColor};
  border-radius: ${c.borderRadius}px;
  width: fit-content;
}

.bc__item {
  display: flex;
  align-items: center;
  list-style: none;
}

.bc__sep {
  color: ${c.accentColor};
  font-family: 'DM Mono', monospace;
  font-size: ${c.fontSize - 1}px;
  padding: 0 2px;
  user-select: none;
  opacity: 0.7;
}

.bc__crumb {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: ${c.itemPaddingY}px ${c.itemPaddingX}px;
  color: ${c.textColor};
  font-size: ${c.fontSize - 1}px;
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.02em;
  cursor: pointer;
  border-radius: ${Math.max(0, c.borderRadius - 2)}px;
  ${transition(c.animate)}
}

.bc__crumb--hover {
  background: ${c.itemHoverBackground};
  color: ${c.textHoverColor};
}

.bc__crumb--active {
  background: ${c.accentColor}14;
  color: ${c.accentColor};
  cursor: default;
}

.bc__tilde {
  opacity: 0.6;
  font-size: ${c.fontSize - 2}px;
}

.bc__cursor {
  color: ${c.accentColor};
  opacity: 0.9;
  animation: bc-blink 1s step-end infinite;
}

@keyframes bc-blink {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0; }
}`;
}
