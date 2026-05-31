// ─── generateButtonCode.ts ────────────────────────────────────────────────────

import { ButtonConfig } from "./buttonConfig";

const SIZE_MAP = {
  xs: { height: 28, px: 10, fontSize: 11, iconSize: 12, gap: 5 },
  sm: { height: 32, px: 14, fontSize: 12, iconSize: 13, gap: 6 },
  md: { height: 38, px: 18, fontSize: 13, iconSize: 14, gap: 7 },
  lg: { height: 44, px: 22, fontSize: 14, iconSize: 16, gap: 8 },
  xl: { height: 52, px: 28, fontSize: 16, iconSize: 18, gap: 10 },
};

const RADIUS_MAP: Record<string, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 14,
  full: 9999,
};

export function generateButtonJSX(config: ButtonConfig): string {
  const s = SIZE_MAP[config.size];
  const r = RADIUS_MAP[config.radius];
  const transition = config.animateHover ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none";

  const groupItems = config.groupEnabled
    ? Array.from({ length: config.groupItemCount }, (_, i) => i)
    : [];

  const rippleAttr = config.showRipple ? 'onMouseDown={handleRipple}' : '';

  return `import { useState, useRef } from "react";
import "./Button.css";

${config.showRipple ? `
function addRippleToEvent(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement("span");
  ripple.className = "btn__ripple";
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
` : ""}

${!config.groupEnabled ? `
export function Button({ children = "${config.variant === "link" ? "Link" : "Button"}", onClick, disabled = ${config.disabled}, loading = ${config.loading} }) {
  const [hovered, setHovered] = useState(false);
  const isDisabled = disabled || loading;

  return (
    <button
      className={\`btn btn--${config.variant}\${isDisabled ? " btn--disabled" : ""}\${hovered ? " btn--hovered" : ""}\`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ${rippleAttr}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      style={{ fontFamily: "${config.fontFamily}", fontWeight: ${config.fontWeight}, letterSpacing: "${config.letterSpacing}em" }}
    >
      {loading && (
        <svg className="btn__spinner" width="${s.iconSize}" height="${s.iconSize}" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.25" />
          <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      ${config.iconLeft ? `{!loading && (
        <svg width="${s.iconSize}" height="${s.iconSize}" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v3M8 11v3M2 8h3M11 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}` : ""}
      <span>{loading ? "Loading…" : children}</span>
      ${config.iconRight ? `{!loading && (
        <svg width="${s.iconSize}" height="${s.iconSize}" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}` : ""}
    </button>
  );
}
` : `
const GROUP_LABELS = [${groupItems.map((_, i) => `"Option ${i + 1}"`).join(", ")}];

export function ButtonGroup({ onChange }) {
  const [active, setActive] = useState(0);

  function handleSelect(i) {
    setActive(i);
    if (onChange) onChange(i);
  }

  return (
    <div className="btn-group btn-group--${config.groupOrientation}">
      {GROUP_LABELS.map((label, i) => (
        <button
          key={i}
          className={\`btn-group__item btn-group__item--${config.variant}\${active === i ? " btn-group__item--active" : ""}\${i === 0 ? " btn-group__item--first" : ""}\${i === GROUP_LABELS.length - 1 ? " btn-group__item--last" : ""}\`}
          onClick={() => handleSelect(i)}
          style={{ fontFamily: "${config.fontFamily}", fontWeight: ${config.fontWeight} }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
`}
`;
}

export function generateButtonCSS(config: ButtonConfig): string {
  const s = SIZE_MAP[config.size];
  const r = RADIUS_MAP[config.radius];
  const groupR = RADIUS_MAP[config.radius];
  const isH = config.groupOrientation === "horizontal";

  return `/* ── Button ────────────────────────────────── */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${s.gap}px;
  height: ${s.height}px;
  padding: 0 ${s.px}px;
  font-size: ${s.fontSize}px;
  font-family: ${config.fontFamily};
  font-weight: ${config.fontWeight};
  letter-spacing: ${config.letterSpacing}em;
  border-radius: ${r}px;
  border: 1.5px solid transparent;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  transition: ${config.animateHover ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none"};
}

.btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Solid */
.btn--solid {
  background: ${config.solidBg};
  color: ${config.solidText};
  border-color: ${config.solidBorder};
}
.btn--solid.btn--hovered,
.btn--solid:hover {
  background: ${config.solidHoverBg};
  ${config.animateHover ? `transform: translateY(-1px);
  box-shadow: 0 4px 16px ${config.solidBg}55;` : ""}
}

/* Outline */
.btn--outline {
  background: transparent;
  color: ${config.outlineText};
  border-color: ${config.outlineBorder};
}
.btn--outline:hover {
  background: ${config.outlineHoverBg};
}

/* Ghost */
.btn--ghost {
  background: transparent;
  color: ${config.ghostText};
  border-color: transparent;
}
.btn--ghost:hover {
  background: ${config.ghostHoverBg};
}

/* Soft */
.btn--soft {
  background: ${config.softBg};
  color: ${config.softText};
  border-color: transparent;
}
.btn--soft:hover {
  background: ${config.softHoverBg};
}

/* Link */
.btn--link {
  background: transparent;
  color: ${config.linkText};
  border-color: transparent;
  padding: 0 2px;
}
.btn--link:hover {
  color: ${config.linkHoverText};
  text-decoration: underline;
}

/* Spinner */
.btn__spinner {
  animation: btn-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

${config.showRipple ? `
/* Ripple */
.btn__ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  pointer-events: none;
  animation: btn-ripple 0.55s ease-out forwards;
}

@keyframes btn-ripple {
  from { transform: scale(0); opacity: 1; }
  to   { transform: scale(1); opacity: 0; }
}
` : ""}

/* ── Button Group ──────────────────────────────── */

.btn-group {
  display: inline-flex;
  flex-direction: ${isH ? "row" : "column"};
}

.btn-group__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${s.height}px;
  padding: 0 ${s.px}px;
  font-size: ${s.fontSize}px;
  font-family: ${config.fontFamily};
  font-weight: ${config.fontWeight};
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.16s cubic-bezier(0.4,0,0.2,1);
  border: 1.5px solid transparent;
}

/* Group item radii */
.btn-group--horizontal .btn-group__item--first { border-radius: ${groupR}px 0 0 ${groupR}px; }
.btn-group--horizontal .btn-group__item--last  { border-radius: 0 ${groupR}px ${groupR}px 0; }
.btn-group--vertical   .btn-group__item--first { border-radius: ${groupR}px ${groupR}px 0 0; }
.btn-group--vertical   .btn-group__item--last  { border-radius: 0 0 ${groupR}px ${groupR}px; }

/* Group — Solid */
.btn-group__item--solid {
  background: ${config.solidBg};
  color: ${config.solidText};
  border-color: ${config.solidBorder};
}
.btn-group__item--solid:hover,
.btn-group__item--solid.btn-group__item--active {
  background: ${config.solidHoverBg};
}

/* Group — Outline */
.btn-group__item--outline {
  background: transparent;
  color: ${config.outlineText};
  border-color: ${config.outlineBorder};
}
.btn-group__item--outline:hover,
.btn-group__item--outline.btn-group__item--active {
  background: ${config.outlineHoverBg};
  font-weight: 600;
}

/* Group — Ghost */
.btn-group__item--ghost {
  background: transparent;
  color: ${config.ghostText};
  border-color: transparent;
}
.btn-group__item--ghost:hover,
.btn-group__item--ghost.btn-group__item--active {
  background: ${config.ghostHoverBg};
}

/* Group — Soft */
.btn-group__item--soft {
  background: ${config.softBg};
  color: ${config.softText};
  border-color: transparent;
}
.btn-group__item--soft:hover,
.btn-group__item--soft.btn-group__item--active {
  background: ${config.softHoverBg};
}
`;
}
