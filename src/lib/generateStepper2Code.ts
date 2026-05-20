// /lib/generateStepperCode.ts

import { StepperConfig } from "./stepper2Config";

// ─── JSX Generator ──────────────────────────────────────────────────────────

export function generateStepperJSX(config: StepperConfig): string {
  const {
    variant,
    totalSteps,
    activeStep,
    step1Label,
    step2Label,
    step3Label,
    step4Label,
    color1,
    color2,
    color3,
    color4,
    inactiveColor,
    inactiveTextColor,
    activeColor,
    activeTextColor,
    completedColor,
    completedTextColor,
    stepTextColor,
    labelColor,
    height,
    fontSize,
    borderRadius,
    connectorHeight,
    showLabels,
    showNumbers,
    showCheckmarks,
    animateDots,
  } = config;

  const allLabels = [step1Label, step2Label, step3Label, step4Label].slice(
    0,
    totalSteps,
  );
  const colors = [color1, color2, color3, color4];
  const labelsArr = JSON.stringify(allLabels);
  const colorsArr = JSON.stringify(colors.slice(0, totalSteps));

  const checkSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>`;

  switch (variant) {
    // ── Segmented Pill ───────────────────────────────────────────────────────
    case "segmented-pill":
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const COLORS = ${colorsArr};

export default function SegmentedPillStepper() {
  return (
    <div className="stp stp--pill">
      {LABELS.map((label, i) => (
        <div key={i} className="stp__segment" style={{ background: COLORS[i] }}>
          {${showNumbers} ? \`STEP \${i + 1}\` : label}
        </div>
      ))}
    </div>
  );
}`;

    // ── Breadcrumb Gray ──────────────────────────────────────────────────────
    case "breadcrumb-gray": {
      const clipFirst =
        "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)";
      const clipMid =
        "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%)";
      const clipLast = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 14px 50%)";
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const CLIPS = [
  "${clipFirst}",
  "${clipMid}",
  "${clipMid}",
  "${clipLast}",
];
const ACTIVE_STEP = ${activeStep};

export default function BreadcrumbStepper() {
  return (
    <div className="stp stp--breadcrumb">
      {LABELS.map((label, i) => (
        <div
          key={i}
          className={\`stp__crumb\${i + 1 === ACTIVE_STEP ? " stp__crumb--active" : ""}\`}
          style={{ clipPath: CLIPS[Math.min(i, CLIPS.length - 1)] }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}`;
    }

    // ── Breadcrumb Colorful ──────────────────────────────────────────────────
    case "breadcrumb-colorful": {
      const clipFirst =
        "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)";
      const clipMid =
        "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%)";
      const clipLast = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 14px 50%)";
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const COLORS = ${colorsArr};
const CLIPS = [
  "${clipFirst}",
  "${clipMid}",
  "${clipMid}",
  "${clipLast}",
];

export default function ColorfulBreadcrumbStepper() {
  return (
    <div className="stp stp--colorful-crumb">
      {LABELS.map((label, i) => (
        <div
          key={i}
          className="stp__crumb"
          style={{ background: COLORS[i], clipPath: CLIPS[Math.min(i, CLIPS.length - 1)] }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}`;
    }

    // ── Numbered Line ────────────────────────────────────────────────────────
    case "numbered-line": {
      const progressPct = Math.round(
        ((activeStep - 1) / (totalSteps - 1)) * 100,
      );
      const stepColorsArr = JSON.stringify(colors.slice(0, totalSteps));
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const COLORS = ${stepColorsArr};
const ACTIVE = ${activeStep};

export default function NumberedLineStepper() {
  return (
    <div className="stp stp--line">
      <div className="stp__track">
        <div className="stp__track-fill" style={{ width: "${progressPct}%" }} />
        {LABELS.map((_, i) => (
          <div
            key={i}
            className={\`stp__node\${i + 1 <= ACTIVE ? " stp__node--done" : ""}\`}
            style={i + 1 <= ACTIVE ? { background: COLORS[i] } : {}}
          >
            {i + 1}
          </div>
        ))}
      </div>
      ${
        showLabels
          ? `<div className="stp__labels">
        {LABELS.map((l, i) => <span key={i} className="stp__label">{l}</span>)}
      </div>`
          : ""
      }
    </div>
  );
}`;
    }

    // ── Checkmark Horizontal ─────────────────────────────────────────────────
    case "checkmark-horizontal": {
      const progressPct = Math.round(
        ((activeStep - 1) / (totalSteps - 1)) * 100,
      );
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const ACTIVE = ${activeStep};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CheckmarkStepper() {
  return (
    <div className="stp stp--check">
      <div className="stp__track">
        <div className="stp__track-fill" style={{ width: "${progressPct}%" }} />
        {LABELS.map((_, i) => {
          const done = i + 1 < ACTIVE;
          const active = i + 1 === ACTIVE;
          return (
            <div key={i} className={\`stp__node\${done ? " stp__node--done" : active ? " stp__node--active" : ""}\`}>
              {done && ${showCheckmarks} ? <CheckIcon /> : i + 1}
            </div>
          );
        })}
      </div>
      ${
        showLabels
          ? `<div className="stp__labels">
        {LABELS.map((l, i) => <span key={i} className="stp__label">{l}</span>)}
      </div>`
          : ""
      }
    </div>
  );
}`;
    }

    // ── Chevron Loading ──────────────────────────────────────────────────────
    case "chevron-loading": {
      const total = 11;
      const filled = Math.round((activeStep / totalSteps) * total);
      return `import React from "react";
import "./Stepper.css";

const TOTAL = ${total};
const FILLED = ${filled};

export default function ChevronLoadingStepper() {
  return (
    <div className="stp stp--chevron-load">
      <div className="stp__chevrons">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={\`stp__chevron\${i < FILLED ? " stp__chevron--filled" : ""}\`} />
        ))}
      </div>
      <div className="stp__loading-label">Loading…</div>
    </div>
  );
}`;
    }

    // ── Dot Loading ──────────────────────────────────────────────────────────
    case "dot-loading": {
      const total = 10;
      const filled = Math.round((activeStep / totalSteps) * total);
      return `import React from "react";
import "./Stepper.css";

const TOTAL = ${total};
const FILLED = ${filled};

export default function DotLoadingStepper() {
  return (
    <div className="stp stp--dot-load">
      <div className="stp__dots">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={\`stp__dot\${i < FILLED ? " stp__dot--filled" : ""}\`} />
        ))}
      </div>
      <div className="stp__loading-label">Loading…</div>
    </div>
  );
}`;
    }

    // ── Sharp Chevron ────────────────────────────────────────────────────────
    case "sharp-chevron": {
      const clipFirst =
        "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)";
      const clipOthers =
        "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%)";
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const COLORS = ${colorsArr};

export default function SharpChevronStepper() {
  return (
    <div className="stp stp--sharp">
      {LABELS.map((label, i) => (
        <div
          key={i}
          className="stp__sharp-step"
          style={{
            background: COLORS[i],
            clipPath: i === 0 ? "${clipFirst}" : "${clipOthers}",
          }}
        >
          {${showNumbers} ? \`Step \${i + 1}\` : label}
        </div>
      ))}
    </div>
  );
}`;
    }

    // ── Dashed Confirmation ──────────────────────────────────────────────────
    case "dashed-confirmation": {
      const progressPct = Math.round(
        ((activeStep - 1) / (totalSteps - 1)) * 100,
      );
      return `import React from "react";
import "./Stepper.css";

const LABELS = ${labelsArr};
const ACTIVE = ${activeStep};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function DashedConfirmationStepper() {
  return (
    <div className="stp stp--dashed">
      <div className="stp__track">
        {LABELS.map((_, i) => {
          const done = i + 1 < ACTIVE;
          const active = i + 1 === ACTIVE;
          return (
            <div key={i} className={\`stp__node\${done ? " stp__node--done" : active ? " stp__node--active" : ""}\`}>
              {done && ${showCheckmarks} ? <CheckIcon /> : i + 1}
            </div>
          );
        })}
      </div>
      ${
        showLabels
          ? `<div className="stp__labels">
        {LABELS.map((l, i) => <span key={i} className="stp__label">{l}</span>)}
      </div>`
          : ""
      }
    </div>
  );
}`;
    }

    default:
      return "// Unknown variant";
  }
}

// ─── CSS Generator ──────────────────────────────────────────────────────────

export function generateStepperCSS(config: StepperConfig): string {
  const {
    variant,
    height,
    fontSize,
    borderRadius,
    connectorHeight,
    color1,
    color2,
    color3,
    inactiveColor,
    inactiveTextColor,
    activeColor,
    activeTextColor,
    completedColor,
    completedTextColor,
    stepTextColor,
    labelColor,
    animateDots,
  } = config;

  const base = `
/* ── Stepper Base ─────────────────────────────── */
.stp {
  width: 100%;
  font-family: 'Instrument Sans', sans-serif;
  box-sizing: border-box;
}
`;

  const variantCSS: Record<string, string> = {
    "segmented-pill": `
.stp--pill {
  display: flex;
  height: ${height}px;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}
.stp--pill .stp__segment {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize}px;
  font-weight: 700;
  color: ${stepTextColor};
  letter-spacing: 0.08em;
  text-transform: uppercase;
}`,

    "breadcrumb-gray": `
.stp--breadcrumb {
  display: flex;
  height: ${height}px;
}
.stp--breadcrumb .stp__crumb {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize}px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${inactiveColor};
  color: ${inactiveTextColor};
  margin-left: -12px;
  transition: background 0.2s;
}
.stp--breadcrumb .stp__crumb:first-child { margin-left: 0; }
.stp--breadcrumb .stp__crumb--active {
  background: ${activeColor};
  color: ${activeTextColor};
  z-index: 10;
}`,

    "breadcrumb-colorful": `
.stp--colorful-crumb {
  display: flex;
  height: ${height}px;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}
.stp--colorful-crumb .stp__crumb {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize}px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${stepTextColor};
  margin-left: -12px;
}
.stp--colorful-crumb .stp__crumb:first-child { margin-left: 0; }`,

    "numbered-line": `
.stp--line { width: 100%; }
.stp--line .stp__track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}
.stp--line .stp__track::before {
  content: '';
  position: absolute;
  top: 50%; left: 0;
  width: 100%;
  height: ${connectorHeight}px;
  background: ${inactiveColor};
  transform: translateY(-50%);
  z-index: 0;
}
.stp--line .stp__track-fill {
  position: absolute;
  top: 50%; left: 0;
  height: ${connectorHeight}px;
  background: ${color3};
  transform: translateY(-50%);
  z-index: 0;
  transition: width 0.3s ease;
}
.stp--line .stp__node {
  position: relative; z-index: 1;
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  background: ${inactiveColor};
  color: ${inactiveTextColor};
  outline: 4px solid transparent;
  transition: background 0.2s;
}
.stp--line .stp__node--done { color: #fff; }
.stp--line .stp__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
.stp--line .stp__label {
  font-size: 9px; font-weight: 700;
  color: ${labelColor};
  text-transform: uppercase; letter-spacing: 0.1em;
}`,

    "checkmark-horizontal": `
.stp--check { width: 100%; }
.stp--check .stp__track {
  position: relative;
  display: flex; align-items: center; justify-content: space-between;
}
.stp--check .stp__track::before {
  content: '';
  position: absolute; top: 50%; left: 0;
  width: 100%; height: ${connectorHeight}px;
  background: ${inactiveColor};
  transform: translateY(-50%); z-index: 0;
}
.stp--check .stp__track-fill {
  position: absolute; top: 50%; left: 0;
  height: ${connectorHeight}px;
  background: ${completedColor};
  transform: translateY(-50%); z-index: 0;
  transition: width 0.3s ease;
}
.stp--check .stp__node {
  position: relative; z-index: 1;
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  background: transparent;
  border: 2px solid ${inactiveColor};
  color: ${inactiveTextColor};
  outline: 3px solid transparent;
}
.stp--check .stp__node--done {
  background: ${completedColor};
  color: ${completedTextColor};
  border: none;
}
.stp--check .stp__node--active {
  background: ${activeColor};
  color: ${activeTextColor};
  border: none;
}
.stp--check .stp__labels {
  display: flex; justify-content: space-between;
  margin-top: 8px; padding: 0 2px;
}
.stp--check .stp__label {
  font-size: 9px; font-weight: 700;
  color: ${labelColor};
  text-transform: uppercase; letter-spacing: 0.08em;
}`,

    "chevron-loading": `
.stp--chevron-load {}
.stp--chevron-load .stp__chevrons { display: flex; gap: 3px; }
.stp--chevron-load .stp__chevron {
  width: 16px; height: 24px;
  background: ${inactiveColor};
  clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%);
  transition: background 0.2s;
}
.stp--chevron-load .stp__chevron--filled { background: ${color2}; }
.stp--chevron-load .stp__chevron:nth-child(-n+3) { background: ${color1}; }
.stp--chevron-load .stp__chevron:nth-last-child(-n+3).stp__chevron--filled { background: ${color3}; }
.stp--chevron-load .stp__loading-label {
  margin-top: 6px;
  font-size: 9px; font-weight: 700;
  color: ${labelColor};
  text-transform: uppercase; letter-spacing: 0.15em;
}`,

    "dot-loading": `
.stp--dot-load {}
.stp--dot-load .stp__dots { display: flex; align-items: center; gap: 6px; }
.stp--dot-load .stp__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: ${inactiveColor};
  transition: all 0.3s ease;
  ${animateDots ? "animation: dotPulse 1.2s ease-in-out infinite alternate;" : ""}
}
.stp--dot-load .stp__dot--filled { background: ${completedColor}; width: 12px; height: 12px; }
@keyframes dotPulse {
  from { transform: scale(1); opacity: 0.7; }
  to   { transform: scale(1.15); opacity: 1; }
}
.stp--dot-load .stp__loading-label {
  margin-top: 8px;
  font-size: 9px; font-weight: 700;
  color: ${labelColor};
  text-transform: uppercase; letter-spacing: 0.15em;
}`,

    "sharp-chevron": `
.stp--sharp {
  display: flex;
  height: ${height}px;
  width: 100%;
}
.stp--sharp .stp__sharp-step {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: ${fontSize}px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: ${stepTextColor};
  margin-left: -8px;
  transition: filter 0.2s;
}
.stp--sharp .stp__sharp-step:first-child { margin-left: 0; }
.stp--sharp .stp__sharp-step:hover { filter: brightness(1.1); }`,

    "dashed-confirmation": `
.stp--dashed { width: 100%; }
.stp--dashed .stp__track {
  position: relative;
  display: flex; align-items: center; justify-content: space-between;
}
.stp--dashed .stp__track::before {
  content: '';
  position: absolute; top: 50%; left: 0;
  width: 100%;
  height: 0;
  border-top: 1px dashed ${inactiveTextColor};
  transform: translateY(-50%); z-index: 0;
}
.stp--dashed .stp__node {
  position: relative; z-index: 1;
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  background: transparent;
  border: 1px solid ${inactiveColor};
  color: ${inactiveTextColor};
  outline: 3px solid transparent;
}
.stp--dashed .stp__node--done {
  background: ${completedColor};
  color: ${completedTextColor};
  border: none;
}
.stp--dashed .stp__node--active {
  background: ${activeColor};
  color: ${activeTextColor};
  border: none;
}
.stp--dashed .stp__labels {
  display: flex; justify-content: space-between;
  margin-top: 8px; padding: 0 2px;
}
.stp--dashed .stp__label {
  font-size: 9px; font-weight: 700;
  color: ${labelColor};
  text-transform: uppercase; letter-spacing: 0.1em;
}`,
  };

  return `${base}${variantCSS[variant] ?? "/* variant styles */"}`;
}
