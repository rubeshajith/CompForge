// lib/generateStepperCode.ts

import { StepperConfig } from "./stepper1Config";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function stripesCSS(stripeColor: string) {
  return `linear-gradient(45deg, ${hex2rgba(stripeColor, 0.35)} 25%, transparent 25%, transparent 50%, ${hex2rgba(stripeColor, 0.35)} 50%, ${hex2rgba(stripeColor, 0.35)} 75%, transparent 75%, transparent)`;
}

// ─── JSX generators per variant ──────────────────────────────────────────────

function genSegmentedLoading(c: StepperConfig): string {
  const filled = Math.round((c.fillPercent / 100) * c.segmentCount);
  const colors = [
    c.accentColor,
    c.accentColorSecondary,
    c.accentColor,
    c.point1Color,
    c.point2Color,
  ];
  const segs = Array.from(
    { length: c.segmentCount },
    (_, i) =>
      `  <div className="stp__seg${i < filled ? " stp__seg--filled" : ""}" data-idx="${i}" />`,
  ).join("\n");
  return `import "./Stepper.css";

export default function SegmentedLoading() {
  return (
    <div className="stp-wrap">
      <p className="stp__label">Loading...</p>
      <div className="stp__track">
${segs}
      </div>
    </div>
  );
}`;
}

function genSliderTooltip(c: StepperConfig): string {
  return `import { useState } from "react";
import "./Stepper.css";

export default function SliderTooltip({ onValueChange }) {
  const [value, setValue] = useState(${c.fillPercent});

  return (
    <div className="stp-wrap">
      <div className="stp__slider-wrap">
        ${c.showTooltip ? `<div className="stp__tooltip" style={{ left: \`\${value}%\` }}>{value}</div>` : ""}
        <div className="stp__track">
          <div className="stp__fill" style={{ width: \`\${value}%\` }} />
          <div className="stp__thumb" style={{ left: \`\${value}%\` }} />
          <input
            type="range" min="0" max="100" value={value}
            className="stp__range-input"
            onChange={(e) => {
              setValue(Number(e.target.value));
              onValueChange?.(Number(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
}`;
}

function genMultiPoint(c: StepperConfig): string {
  return `import "./Stepper.css";

const POINTS = [
  { pct: 13, color: "${c.point1Color}", label: "13" },
  { pct: 31, color: "${c.point2Color}", label: "31" },
  { pct: 64, color: "${c.point3Color}", label: "64" },
  { pct: 86, color: "${c.point4Color}", label: "86" },
];

export default function MultiPointSlider() {
  return (
    <div className="stp-wrap">
      <div className="stp__multi-wrap">
        {POINTS.map((p) => (
          <div key={p.label} className="stp__mp-tooltip" style={{ left: \`\${p.pct}%\`, background: p.color }}>
            {p.label}
          </div>
        ))}
        <div className="stp__track">
          {POINTS.map((p) => (
            <div key={p.label} className="stp__mp-thumb" style={{ left: \`\${p.pct}%\`, background: p.color }} />
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

function genGradientProgress(c: StepperConfig): string {
  return `import "./Stepper.css";

export default function GradientProgress({ value = ${c.fillPercent} }) {
  return (
    <div className="stp-wrap">
      <div className="stp__gradient-wrap">
        <span className="stp__pct-label" style={{ right: \`\${100 - value}%\` }}>{value}%</span>
        <div className="stp__track">
          <div className="stp__fill stp__fill--gradient" style={{ width: \`\${value}%\` }} />
        </div>
      </div>
    </div>
  );
}`;
}

function genStepperDots(c: StepperConfig): string {
  return `import "./Stepper.css";

const STEPS = ${JSON.stringify(Array.from({ length: c.stepCount }, (_, i) => `Step ${i + 1}`))};
const ACTIVE = ${c.activeStep};

export default function StepperDots({ activeStep = ACTIVE }) {
  return (
    <div className="stp-wrap">
      <div className="stp__dots-wrap">
        <div className="stp__connector" />
        {STEPS.map((label, i) => {
          const isActive = i + 1 === activeStep;
          const isDone = i + 1 < activeStep;
          return (
            <div key={i} className="stp__step">
              <div className={\`stp__dot\${isActive ? " stp__dot--active" : ""}$\{isDone ? " stp__dot--done" : ""}\`}>
                {isDone && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              ${c.showStepLabels ? `<span className={\`stp__step-label\${isActive ? " stp__step-label--active" : ""}\`}>{label}</span>` : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genStatusStepper(c: StepperConfig): string {
  const labels = ["Start", "Process", "Review", "Done"].slice(
    0,
    Math.min(c.stepCount, 4),
  );
  return `import "./Stepper.css";

const STEPS = ${JSON.stringify(labels)};
const ACTIVE = ${c.activeStep};

export default function StatusStepper({ activeStep = ACTIVE }) {
  return (
    <div className="stp-wrap">
      <div className="stp__status-wrap">
        <div className="stp__connector" />
        {STEPS.map((label, i) => {
          const isActive = i + 1 === activeStep;
          const isDone = i + 1 < activeStep;
          return (
            <div key={i} className="stp__step">
              <div className={\`stp__status-dot stp__status-dot--\${i}\${isActive ? " stp__status-dot--active" : ""}$\{isDone ? " stp__status-dot--done" : ""}\`}>
                {isDone
                  ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1}
              </div>
              ${c.showStepLabels ? `<span className="stp__step-label">{label}</span>` : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genColorSegments(c: StepperConfig): string {
  return `import "./Stepper.css";

const SEGMENTS = [
  { label: "Cart",     color: "${c.seg1Color}" },
  { label: "Shipping", color: "${c.seg2Color}" },
  { label: "Review",   color: "${c.seg3Color}" },
  { label: "Payment",  color: "${c.seg4Color}" },
];

export default function ColorSegments() {
  return (
    <div className="stp-wrap">
      <div className="stp__seg-track">
        {SEGMENTS.map((s) => (
          <div key={s.label} className="stp__seg-block" style={{ background: s.color }} />
        ))}
      </div>
      <div className="stp__seg-labels">
        {SEGMENTS.map((s) => (
          <span key={s.label} className="stp__seg-label">{s.label}</span>
        ))}
      </div>
    </div>
  );
}`;
}

function genCompleteness(c: StepperConfig): string {
  return `import { useState } from "react";
import "./Stepper.css";

export default function CompletenessBar({ value = ${c.fillPercent} }) {
  return (
    <div className="stp-wrap">
      <p className="stp__label">Completeness</p>
      <div className="stp__complete-wrap">
        ${c.showTooltip ? `<div className="stp__tooltip stp__tooltip--accent" style={{ left: \`\${value}%\` }}>{value}</div>` : ""}
        <div className="stp__track stp__track--tall">
          <div className="stp__fill stp__fill--striped" style={{ width: \`\${value}%\` }} />
        </div>
      </div>
    </div>
  );
}`;
}

function genVerification(c: StepperConfig): string {
  return `import "./Stepper.css";

const NODE_COUNT = 4;

export default function VerificationTrack({ activeNode = ${c.activeStep} }) {
  return (
    <div className="stp-wrap">
      <p className="stp__label">Verification</p>
      <div className="stp__verify-wrap">
        {Array.from({ length: NODE_COUNT }).map((_, i) => {
          const isActive = i + 1 <= activeNode;
          const segFilled = i + 1 < activeNode;
          const segPartial = i + 1 === activeNode;
          return (
            <>
              <div key={\`n\${i}\`} className={\`stp__vnode\${isActive ? " stp__vnode--active" : ""}\`} />
              {i < NODE_COUNT - 1 && (
                <div key={\`s\${i}\`} className="stp__vseg">
                  {(segFilled || segPartial) && (
                    <div className="stp__vseg-fill stp__vseg-fill--striped" style={{ width: segFilled ? "100%" : "40%" }} />
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}`;
}

// ─── CSS generators ───────────────────────────────────────────────────────────

function genBaseCSS(c: StepperConfig): string {
  return `.stp-wrap {
  width: 100%;
  font-family: inherit;
  font-size: ${c.fontSize}px;
}

.stp__label {
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  color: ${c.labelColor};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.stp__track {
  width: 100%;
  height: ${c.trackHeight}px;
  background: ${c.trackColor};
  border-radius: ${c.borderRadius}px;
  position: relative;
  overflow: hidden;
}

.stp__track--tall {
  height: ${c.trackHeight * 3}px;
  overflow: hidden;
}

.stp__fill {
  height: 100%;
  background: ${c.accentColor};
  border-radius: ${c.borderRadius}px;
  transition: width 0.3s ease;
}

.stp__fill--gradient {
  background: linear-gradient(to right, ${c.accentColorSecondary}, ${c.accentColor});
  overflow: hidden;
}

.stp__fill--striped {
  background: ${c.accentColor};
  background-image: ${stripesCSS(c.stripeColor)};
  background-size: 10px 10px;
}`;
}

function genTooltipCSS(c: StepperConfig): string {
  return `.stp__tooltip {
  position: absolute;
  transform: translateX(-50%);
  background: ${c.tooltipBackground};
  color: ${c.tooltipTextColor};
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  padding: 2px 6px;
  border-radius: ${c.tooltipBorderRadius}px;
  white-space: nowrap;
  pointer-events: none;
}
.stp__tooltip::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${c.tooltipBackground};
}
.stp__tooltip--accent {
  background: ${c.accentColor};
}
.stp__tooltip--accent::after {
  border-top-color: ${c.accentColor};
}`;
}

function genSliderCSS(c: StepperConfig): string {
  return `.stp__slider-wrap,
.stp__gradient-wrap,
.stp__complete-wrap,
.stp__multi-wrap {
  position: relative;
  padding-top: 24px;
}

.stp__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${c.thumbSize}px;
  height: ${c.thumbSize}px;
  background: ${c.thumbBackground};
  border: 3px solid ${c.thumbBorderColor};
  border-radius: 50%;
  box-shadow: 0 0 0 3px ${hex2rgba(c.thumbBorderColor, 0.2)};
  pointer-events: none;
}

.stp__range-input {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  height: 100%;
}

.stp__mp-tooltip {
  position: absolute;
  transform: translateX(-50%);
  top: 0;
  color: #fff;
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  padding: 2px 6px;
  border-radius: ${c.tooltipBorderRadius}px;
  pointer-events: none;
}
.stp__mp-tooltip::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid currentColor;
}

.stp__mp-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${c.thumbSize - 4}px;
  height: ${c.thumbSize - 4}px;
  border-radius: 50%;
}

.stp__pct-label {
  position: absolute;
  top: 0;
  transform: translateX(50%);
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  color: ${c.labelColor};
}`;
}

function genSegCSS(c: StepperConfig): string {
  const filled = Math.round((c.fillPercent / 100) * c.segmentCount);
  const colors = [
    c.accentColor,
    c.accentColorSecondary,
    c.accentColor,
    c.point1Color,
    c.point2Color,
  ];
  const segRules = Array.from(
    { length: c.segmentCount },
    (_, i) =>
      `.stp__seg:nth-child(${i + 1}) { background: ${i < filled ? colors[i % colors.length] : c.trackColor}; }`,
  ).join("\n");
  return `.stp__track {
  overflow: visible;
  background: transparent;
}
.stp__seg {
  display: inline-block;
  width: ${c.segmentWidth}px;
  height: ${c.trackHeight * 2.5}px;
  border-radius: ${c.borderRadius}px;
  margin-right: ${c.segmentGap}px;
  transition: background 0.3s;
}
${segRules}`;
}

function genStepperDotsCSS(c: StepperConfig): string {
  return `.stp__dots-wrap,
.stp__status-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.stp__connector {
  position: absolute;
  top: ${c.stepDotSize / 2}px;
  left: 0;
  right: 0;
  height: ${c.trackHeight}px;
  background: ${c.stepConnectorColor};
  z-index: 0;
}

.stp__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.stp__dot {
  width: ${c.stepDotSize}px;
  height: ${c.stepDotSize}px;
  border-radius: 50%;
  background: ${c.stepInactiveColor};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.stp__dot--active {
  background: ${c.stepActiveColor};
  box-shadow: 0 0 0 3px ${hex2rgba(c.stepActiveColor, 0.3)};
}
.stp__dot--done {
  background: ${c.stepCompleteColor};
}

.stp__status-dot {
  width: ${c.stepDotSize + 8}px;
  height: ${c.stepDotSize + 8}px;
  border-radius: 50%;
  background: ${c.stepInactiveColor};
  color: #fff;
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.stp__status-dot--0 { background: ${c.point1Color}; }
.stp__status-dot--1 { background: ${c.point2Color}; }
.stp__status-dot--2 { background: ${c.point3Color}; }
.stp__status-dot--3 { background: ${c.stepActiveColor}; }
.stp__status-dot--active {
  box-shadow: 0 0 0 4px ${hex2rgba(c.stepActiveColor, 0.25)};
}

.stp__step-label {
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  color: ${c.stepLabelColor};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stp__step-label--active {
  color: ${c.stepActiveColor};
}`;
}

function genColorSegCSS(c: StepperConfig): string {
  return `.stp__seg-track {
  display: flex;
  height: ${c.trackHeight * 2}px;
  border-radius: ${c.borderRadius}px;
  overflow: hidden;
}
.stp__seg-block { flex: 1; }
.stp__seg-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  padding: 0 4px;
}
.stp__seg-label {
  font-size: ${c.fontSize}px;
  font-weight: ${c.fontWeight};
  color: ${c.segLabelColor};
  text-transform: uppercase;
  letter-spacing: 0.05em;
}`;
}

function genVerifyCSS(c: StepperConfig): string {
  return `.stp__verify-wrap {
  display: flex;
  align-items: center;
}
.stp__vnode {
  width: ${c.stepDotSize + 8}px;
  height: ${c.stepDotSize + 8}px;
  border-radius: 50%;
  background: ${c.verificationNodeBackground};
  border: 3px solid ${c.trackColor};
  flex-shrink: 0;
  z-index: 1;
  transition: border-color 0.2s;
}
.stp__vnode--active {
  border-color: ${c.verificationNodeBorderColor};
  box-shadow: 0 0 0 3px ${hex2rgba(c.verificationNodeBorderColor, 0.2)};
}
.stp__vseg {
  flex: 1;
  height: ${c.trackHeight * 2.5}px;
  background: ${c.trackColor};
  margin: 0 -2px;
  position: relative;
  overflow: hidden;
}
.stp__vseg-fill {
  position: absolute;
  left: 0; top: 0;
  height: 100%;
  background: ${c.accentColor};
  transition: width 0.3s ease;
}
.stp__vseg-fill--striped {
  background: ${c.accentColor};
  background-image: ${stripesCSS(c.stripeColor)};
  background-size: 10px 10px;
}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateStepperJSX(config: StepperConfig): string {
  switch (config.variant) {
    case "segmented-loading":
      return genSegmentedLoading(config);
    case "slider-tooltip":
      return genSliderTooltip(config);
    case "multi-point-slider":
      return genMultiPoint(config);
    case "gradient-progress":
      return genGradientProgress(config);
    case "stepper-dots":
      return genStepperDots(config);
    case "status-stepper":
      return genStatusStepper(config);
    case "color-segments":
      return genColorSegments(config);
    case "completeness":
      return genCompleteness(config);
    case "verification":
      return genVerification(config);
  }
}

export function generateStepperCSS(config: StepperConfig): string {
  const base = genBaseCSS(config);
  const tooltip = genTooltipCSS(config);
  const slider = genSliderCSS(config);

  switch (config.variant) {
    case "segmented-loading":
      return [base, genSegCSS(config)].join("\n\n");
    case "slider-tooltip":
      return [base, tooltip, slider].join("\n\n");
    case "multi-point-slider":
      return [base, slider].join("\n\n");
    case "gradient-progress":
      return [base, slider].join("\n\n");
    case "stepper-dots":
    case "status-stepper":
      return [base, genStepperDotsCSS(config)].join("\n\n");
    case "color-segments":
      return [base, genColorSegCSS(config)].join("\n\n");
    case "completeness":
      return [base, tooltip, slider].join("\n\n");
    case "verification":
      return [base, genVerifyCSS(config)].join("\n\n");
  }
}
