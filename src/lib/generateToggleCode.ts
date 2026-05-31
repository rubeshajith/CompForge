// ─── generateToggleCode.ts ────────────────────────────────────────────────────

import { ToggleConfig } from "./toggleConfig";

const SIZE_MAP = {
  sm: { h: 28, px: 12, font: 11, gap: 6, switchW: 40, switchH: 22, thumb: 16, thumbOff: 3, thumbOn: 19 },
  md: { h: 34, px: 16, font: 12, gap: 8, switchW: 48, switchH: 26, thumb: 20, thumbOff: 3, thumbOn: 25 },
  lg: { h: 42, px: 20, font: 14, gap: 10, switchW: 58, switchH: 30, thumb: 24, thumbOff: 3, thumbOn: 31 },
};

const RADIUS_MAP: Record<string, number> = { sm: 6, md: 10, lg: 16, full: 9999 };

export function generateToggleJSX(config: ToggleConfig): string {
  const s = SIZE_MAP[config.size];
  const r = RADIUS_MAP[config.borderRadius];

  if (!config.groupEnabled) {
    // Single toggle variants
    if (config.variant === "switch") {
      return `import { useState } from "react";
import "./Toggle.css";

export function Toggle({ defaultOn = false, onChange }) {
  const [on, setOn] = useState(defaultOn);

  function toggle() {
    const next = !on;
    setOn(next);
    if (onChange) onChange(next);
  }

  return (
    <div className="tgl-switch" onClick={toggle}>
      <div className={\`tgl-switch__track\${on ? " tgl-switch__track--on" : ""}\`}>
        <div className={\`tgl-switch__thumb\${on ? " tgl-switch__thumb--on" : ""}\`} />
      </div>
      <span className={\`tgl-switch__label\${on ? " tgl-switch__label--on" : ""}\`}>
        {on ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}
`;
    }

    if (config.variant === "chip") {
      return `import { useState } from "react";
import "./Toggle.css";

export function Toggle({ defaultOn = false, onChange }) {
  const [on, setOn] = useState(defaultOn);

  function toggle() {
    const next = !on;
    setOn(next);
    if (onChange) onChange(next);
  }

  return (
    <button className={\`tgl-chip\${on ? " tgl-chip--on" : ""}\`} onClick={toggle}>
      {on && (
        <svg width="${s.font}" height="${s.font}" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {on ? "Selected" : "Select"}
    </button>
  );
}
`;
    }

    // Default: pill
    return `import { useState } from "react";
import "./Toggle.css";

export function Toggle({ defaultOn = false, onChange }) {
  const [on, setOn] = useState(defaultOn);

  function toggle() {
    const next = !on;
    setOn(next);
    if (onChange) onChange(next);
  }

  return (
    <button className={\`tgl-pill\${on ? " tgl-pill--on" : ""}\`} onClick={toggle}>
      <span className="tgl-pill__dot" />
      {on ? "Active" : "Inactive"}
    </button>
  );
}
`;
  }

  // Group
  const count = config.groupItemCount;
  const labels = Array.from({ length: count }, (_, i) => `"Option ${i + 1}"`).join(", ");
  const isMulti = config.groupMode === "multi";

  if (config.groupVariant === "segmented") {
    return `import { useState, useRef, useEffect } from "react";
import "./Toggle.css";

const LABELS = [${labels}];

export function ToggleGroup({ onChange }) {
  const [active, setActive] = useState(${isMulti ? "[0]" : "0"});
  const itemRefs = useRef([]);
  const indicatorRef = useRef(null);

  ${!isMulti && config.animateIndicator ? `
  useEffect(() => {
    const el = itemRefs.current[active];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    indicator.style.transform = \`translateX(\${el.offsetLeft}px)\`;
    indicator.style.width = \`\${el.offsetWidth}px\`;
  }, [active]);
  ` : ""}

  function handleClick(i) {
    ${isMulti
      ? `const next = active.includes(i) ? active.filter(x => x !== i) : [...active, i];
    setActive(next);
    if (onChange) onChange(next);`
      : `setActive(i);
    if (onChange) onChange(i);`}
  }

  return (
    <div className="tgl-seg">
      ${!isMulti && config.animateIndicator ? `<div className="tgl-seg__indicator" ref={indicatorRef} />` : ""}
      {LABELS.map((label, i) => {
        const isActive = ${isMulti ? "active.includes(i)" : "active === i"};
        return (
          <button
            key={i}
            ref={el => { itemRefs.current[i] = el; }}
            className={\`tgl-seg__item\${isActive ? " tgl-seg__item--active" : ""}\`}
            onClick={() => handleClick(i)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
`;
  }

  // Chip row / pill row / icon tabs — generic
  const groupClass = config.groupVariant === "chip-row"
    ? "tgl-chip-row" : config.groupVariant === "pill-row"
    ? "tgl-pill-row" : "tgl-tabs";

  return `import { useState } from "react";
import "./Toggle.css";

const LABELS = [${labels}];

export function ToggleGroup({ onChange }) {
  const [active, setActive] = useState(${isMulti ? "[0]" : "0"});

  function handleClick(i) {
    ${isMulti
      ? `const next = active.includes(i) ? active.filter(x => x !== i) : [...active, i];
    setActive(next);
    if (onChange) onChange(next);`
      : `setActive(i);
    if (onChange) onChange(i);`}
  }

  return (
    <div className="${groupClass}">
      {LABELS.map((label, i) => {
        const isActive = ${isMulti ? "active.includes(i)" : "active === i"};
        return (
          <button
            key={i}
            className={\`${groupClass}__item\${isActive ? " ${groupClass}__item--active" : ""}\`}
            onClick={() => handleClick(i)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
`;
}

export function generateToggleCSS(config: ToggleConfig): string {
  const s = SIZE_MAP[config.size];
  const r = RADIUS_MAP[config.borderRadius];
  const transition = config.animateToggle ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none";
  const groupR = RADIUS_MAP[config.borderRadius];

  return `/* ── Toggle ───────────────────────────────────── */

/* Pill */
.tgl-pill {
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  height: ${s.h}px;
  padding: 0 ${s.px}px;
  border-radius: ${r}px;
  border: 1.5px solid ${config.trackBorder};
  background: ${config.trackBg};
  color: ${config.inactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: ${transition};
}
.tgl-pill:hover { background: ${config.inactiveHoverBg}; }
.tgl-pill--on {
  background: ${config.activeBg};
  color: ${config.activeText};
  border-color: ${config.activeBorder};
}
.tgl-pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  transition: ${transition};
}
.tgl-pill--on .tgl-pill__dot { opacity: 1; }

/* Chip */
.tgl-chip {
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  height: ${s.h}px;
  padding: 0 ${s.px}px;
  border-radius: 10px;
  border: 1.5px solid ${config.trackBorder};
  background: transparent;
  color: ${config.inactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: ${transition};
}
.tgl-chip:hover { background: ${config.inactiveHoverBg}; }
.tgl-chip--on {
  border-color: ${config.activeBorder};
  background: ${config.activeBg}22;
  color: ${config.activeBg};
  font-weight: 600;
}

/* Switch */
.tgl-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
.tgl-switch__track {
  position: relative;
  width: ${s.switchW}px;
  height: ${s.switchH}px;
  border-radius: 9999px;
  background: ${config.trackBg};
  border: 1.5px solid ${config.trackBorder};
  transition: ${transition};
  flex-shrink: 0;
}
.tgl-switch__track--on {
  background: ${config.activeBg};
  border-color: ${config.activeBorder};
}
.tgl-switch__thumb {
  position: absolute;
  top: ${(s.switchH - s.thumb) / 2 - 1.5}px;
  left: ${s.thumbOff}px;
  width: ${s.thumb}px;
  height: ${s.thumb}px;
  border-radius: 50%;
  background: ${config.thumbColor};
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  transition: ${config.animateToggle ? "left 0.22s cubic-bezier(0.4,0,0.2,1)" : "none"};
}
.tgl-switch__thumb--on { left: ${s.thumbOn}px; }
.tgl-switch__label {
  font-size: ${s.font}px;
  color: ${config.inactiveText};
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  transition: color 0.18s ease;
}
.tgl-switch__label--on { color: ${config.activeText}; }

/* ── Toggle Group ──────────────────────────────── */

/* Segmented */
.tgl-seg {
  position: relative;
  display: inline-flex;
  background: ${config.groupBg};
  border: 1.5px solid ${config.groupBorder};
  border-radius: ${groupR + 2}px;
  padding: 3px;
  gap: 1px;
}
.tgl-seg__indicator {
  position: absolute;
  top: 3px;
  left: 0;
  height: calc(100% - 6px);
  background: ${config.groupActiveIndicatorBg};
  border-radius: ${groupR}px;
  transition: ${config.animateIndicator ? "transform 0.2s cubic-bezier(0.4,0,0.2,1), width 0.2s cubic-bezier(0.4,0,0.2,1)" : "none"};
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  pointer-events: none;
}
.tgl-seg__item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${s.gap}px;
  height: ${s.h - 6}px;
  padding: 0 ${s.px}px;
  border-radius: ${groupR}px;
  border: none;
  background: transparent;
  color: ${config.groupInactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  transition: color 0.18s ease;
  white-space: nowrap;
}
.tgl-seg__item--active {
  color: ${config.groupActiveText};
  font-weight: 600;
}

/* Chip Row */
.tgl-chip-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tgl-chip-row__item {
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  height: ${s.h}px;
  padding: 0 ${s.px}px;
  border-radius: 10px;
  border: 1.5px solid ${config.trackBorder};
  background: transparent;
  color: ${config.inactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  transition: ${transition};
}
.tgl-chip-row__item--active {
  border-color: ${config.activeBorder};
  background: ${config.activeBg}22;
  color: ${config.activeBg};
  font-weight: 600;
}

/* Pill Row */
.tgl-pill-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tgl-pill-row__item {
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  height: ${s.h}px;
  padding: 0 ${s.px}px;
  border-radius: 9999px;
  border: 1.5px solid ${config.trackBorder};
  background: ${config.trackBg};
  color: ${config.inactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  transition: ${transition};
}
.tgl-pill-row__item--active {
  border-color: ${config.activeBorder};
  background: ${config.activeBg};
  color: ${config.activeText};
  font-weight: 600;
}

/* Icon Tabs */
.tgl-tabs {
  display: inline-flex;
  border-bottom: 2px solid ${config.trackBorder};
}
.tgl-tabs__item {
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  height: ${s.h}px;
  padding: 0 ${s.px}px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: ${config.inactiveText};
  font-size: ${s.font}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  transition: ${transition};
}
.tgl-tabs__item--active {
  border-bottom-color: ${config.activeBg};
  color: ${config.activeBg};
  font-weight: 600;
}
`;
}
