// lib/generateStepperCode.ts

import { StepperConfig, STEP_LABELS } from "./stepperConfig";

// ─── Helpers ─────────────────────────────────────────────────────

function accentBg(c: StepperConfig) {
  if (c.useGradient) {
    return `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`;
  }
  return c.accentColor;
}

function glowShadow(c: StepperConfig, fallback = "") {
  if (!c.accentGlow) return fallback;
  return `0 0 14px ${c.accentColor}66`;
}

// ─── Progress Pin ─────────────────────────────────────────────────

function genProgressPinJSX(c: StepperConfig) {
  const pct = Math.max(0, Math.min(100, c.progressValue));
  const pinSvg = `data:image/svg+xml,%3Csvg width='32' height='44' viewBox='0 0 32 44' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 44L32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16L16 44Z' fill='${encodeURIComponent(c.pinColor)}'/%3E%3C/svg%3E`;

  return `import { useState } from "react";
import "./Stepper.css";

export default function ProgressPinStepper({ value = ${pct}, onValueChange }) {
  const [progress, setProgress] = useState(value);

  function handleChange(e) {
    const v = Number(e.target.value);
    setProgress(v);
    onValueChange?.(v);
  }

  return (
    <div className="stp-wrap">
      <div className="stp__track-wrap">
        <div className="stp__track">
          <div className="stp__fill" style={{ width: progress + "%" }} />
          <div className="stp__pin-wrap" style={{ left: progress + "%" }}>
            <span className="stp__pin-label">{progress}%</span>
            <div className="stp__pin">
              <div className="stp__pin-dot" />
            </div>
          </div>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleChange}
        className="stp__range-input"
      />
    </div>
  );
}`;
}

function genProgressPinCSS(c: StepperConfig) {
  const glow = glowShadow(c);
  const pinSvg = `url("data:image/svg+xml,%3Csvg width='32' height='44' viewBox='0 0 32 44' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 44L32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16L16 44Z' fill='${encodeURIComponent(c.pinColor)}'/%3E%3C/svg%3E")`;

  return `.stp-wrap {
  background: ${c.backgroundColor};
  border-radius: ${c.borderRadius}px;
  padding: 64px 40px 32px;
  ${c.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.5);" : ""}
}

.stp__track-wrap {
  position: relative;
  padding-top: 56px;
}

.stp__track {
  position: relative;
  width: 100%;
  height: ${c.trackHeight}px;
  background: ${c.trackColor};
  border-radius: 999px;
}

.stp__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: ${accentBg(c)};
  border-radius: 999px;
  ${glow ? `box-shadow: ${glow};` : ""}
  transition: width 0.3s ease;
}

.stp__pin-wrap {
  position: absolute;
  top: -52px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.stp__pin-label {
  font-size: ${c.fontSize}px;
  font-weight: 700;
  color: ${c.activeLabelColor};
  margin-bottom: 4px;
}

.stp__pin {
  width: 32px;
  height: 44px;
  background-image: ${pinSvg};
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  padding-top: 7px;
  ${c.accentGlow ? `filter: drop-shadow(0 4px 8px ${c.accentColor}88);` : "filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));"}
}

.stp__pin-dot {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
}

.stp__range-input {
  width: 100%;
  margin-top: 20px;
  appearance: none;
  height: 4px;
  background: ${c.trackColor};
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.stp__range-input::-webkit-slider-thumb {
  appearance: none;
  width: ${c.thumbWidth}px;
  height: ${c.thumbHeight}px;
  background: ${c.thumbColor};
  border-radius: ${c.thumbBorderRadius}px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}`;
}

// ─── Multi-Step ───────────────────────────────────────────────────

function genMultiStepJSX(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);

  return `import "./Stepper.css";

const STEPS = ${stepsLiteral};

export default function MultiStepStepper({ activeStep = ${c.activeStep}, onStepChange }) {
  return (
    <div className="stp-wrap">
      <div className="stp__steps">
        <div className="stp__steps-line" />
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isCompleted = n < activeStep;
          const isActive = n === activeStep;
          const isPending = n > activeStep;
          return (
            <button
              key={i}
              className={[
                "stp__step",
                isActive ? "stp__step--active" : "",
                isCompleted ? "stp__step--completed" : "",
                isPending ? "stp__step--pending" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onStepChange?.(n)}
            >
              ${c.showLabels ? '<span className="stp__step-label">{label}</span>' : ""}
              <div className="stp__step-node" />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genMultiStepCSS(c: StepperConfig) {
  const borderRadius =
    c.stepNodeBorderRadius >= 50 ? "50%" : `${c.stepNodeBorderRadius}px`;
  const glow = glowShadow(c);

  return `.stp-wrap {
  background: ${c.backgroundColor};
  border-radius: ${c.borderRadius}px;
  padding: 32px 24px;
  ${c.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.5);" : ""}
}

.stp__steps {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: relative;
}

.stp__steps-line {
  position: absolute;
  bottom: ${c.stepNodeSize / 2}px;
  left: 0;
  right: 0;
  height: ${c.trackHeight}px;
  background: ${c.trackColor};
  z-index: 0;
}

.stp__step {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.stp__step-label {
  font-size: ${c.fontSize}px;
  font-weight: 500;
  color: ${c.labelColor};
  text-align: center;
}

.stp__step--active .stp__step-label {
  font-weight: 700;
  color: ${c.activeLabelColor};
}

.stp__step-node {
  width: ${c.stepNodeSize}px;
  height: ${c.stepNodeSize}px;
  border-radius: ${borderRadius};
  background: transparent;
  border: 2px solid ${c.trackColor};
  transition: all 0.2s ease;
}

.stp__step--completed .stp__step-node {
  background: ${accentBg(c)};
  border: none;
}

.stp__step--active .stp__step-node {
  background: ${accentBg(c)};
  border: none;
  box-shadow: 0 0 0 8px ${c.accentColor}22${glow ? `, ${glow}` : ""};
}

.stp__step--pending .stp__step-node {
  background: transparent;
  border: 2px solid ${c.trackColor};
}`;
}

// ─── Range Slider ─────────────────────────────────────────────────

function genRangeSliderJSX(c: StepperConfig) {
  return `import { useState } from "react";
import "./Stepper.css";

export default function RangeSlider({ value = ${c.progressValue}, onValueChange }) {
  const [val, setVal] = useState(value);

  function handleChange(e) {
    const v = Number(e.target.value);
    setVal(v);
    onValueChange?.(v);
  }

  return (
    <div className="stp-wrap">
      <div className="stp__slider-row">
        <div className="stp__track">
          <div className="stp__fill" style={{ width: val + "%" }} />
          <div className="stp__thumb" style={{ left: val + "%" }} />
          <input
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={handleChange}
            className="stp__range-input"
          />
        </div>
        <span className="stp__slider-value">{val}</span>
      </div>
    </div>
  );
}`;
}

function genRangeSliderCSS(c: StepperConfig) {
  const glow = glowShadow(c);
  return `.stp-wrap {
  background: ${c.backgroundColor};
  border-radius: ${c.borderRadius}px;
  padding: 32px 40px;
  ${c.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.5);" : ""}
}

.stp__slider-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stp__track {
  position: relative;
  flex: 1;
  height: ${c.trackHeight}px;
  background: ${c.trackColor};
  border-radius: 999px;
}

.stp__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: ${accentBg(c)};
  border-radius: 999px;
  ${glow ? `box-shadow: ${glow};` : ""}
  pointer-events: none;
}

.stp__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${c.thumbWidth}px;
  height: ${c.thumbHeight}px;
  background: ${c.thumbColor};
  border-radius: ${c.thumbBorderRadius}px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  pointer-events: none;
}

.stp__range-input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  height: 100%;
}

.stp__slider-value {
  font-size: 14px;
  font-weight: 700;
  color: ${c.activeLabelColor};
  min-width: 28px;
  text-align: right;
}`;
}

// ─── Segmented ────────────────────────────────────────────────────

function genSegmentedJSX(c: StepperConfig) {
  const count = Math.max(2, Math.min(8, c.segmentCount));
  return `import { useState } from "react";
import "./Stepper.css";

const SEGMENT_COUNT = ${count};

export default function SegmentedProgress({ active = ${c.activeSegments}, onSegmentChange }) {
  const fillPct = (active / SEGMENT_COUNT) * 100;

  return (
    <div className="stp-wrap">
      <div className="stp__seg">
        <div className="stp__seg-fill" style={{ width: \`calc(\${fillPct}% - 8px)\` }} />
        <div className="stp__seg-labels">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <button
              key={i}
              className={\`stp__seg-item \${i < active ? "stp__seg-item--active" : ""}\`}
              onClick={() => onSegmentChange?.(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

function genSegmentedCSS(c: StepperConfig) {
  const glow = glowShadow(c);
  return `.stp-wrap {
  background: ${c.backgroundColor};
  border-radius: ${c.borderRadius}px;
  padding: 32px 40px;
  ${c.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.5);" : ""}
}

.stp__seg {
  background: ${c.trackColor}55;
  border-radius: 999px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 4px;
  position: relative;
  overflow: hidden;
}

.stp__seg-fill {
  position: absolute;
  left: 4px;
  top: 4px;
  bottom: 4px;
  background: ${accentBg(c)};
  border-radius: 999px;
  ${glow ? `box-shadow: ${glow};` : ""}
  transition: width 0.3s ease;
  z-index: 0;
  pointer-events: none;
}

.stp__seg-labels {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
}

.stp__seg-item {
  flex: 1;
  text-align: center;
  font-size: ${c.fontSize}px;
  font-weight: 600;
  color: ${c.labelColor};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
}

.stp__seg-item--active {
  color: ${c.activeLabelColor};
}`;
}

// ─── Dot Stepper ──────────────────────────────────────────────────

function genDotStepperJSX(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);

  return `import "./Stepper.css";

const STEPS = ${stepsLiteral};

export default function DotStepper({ activeStep = ${c.activeStep}, onStepChange }) {
  return (
    <div className="stp-wrap">
      <div className="stp__dots">
        <div className="stp__dots-line" />
        {STEPS.map((_, i) => {
          const n = i + 1;
          const isActive = n === activeStep;
          const isCompleted = n < activeStep;
          return (
            <button
              key={i}
              className={[
                "stp__dot",
                isActive ? "stp__dot--active" : "",
                isCompleted ? "stp__dot--completed" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onStepChange?.(n)}
            >
              <div className="stp__dot-inner" />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genDotStepperCSS(c: StepperConfig) {
  const glow = glowShadow(c);
  const borderW = Math.max(2, Math.round(c.dotInactiveSize * 0.25));

  return `.stp-wrap {
  background: ${c.backgroundColor};
  border-radius: ${c.borderRadius}px;
  padding: 32px 40px;
  ${c.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.5);" : ""}
}

.stp__dots {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.stp__dots-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: ${c.trackHeight}px;
  background: ${c.trackColor};
  transform: translateY(-50%);
  z-index: 0;
}

.stp__dot {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${c.dotInactiveSize}px;
  height: ${c.dotInactiveSize}px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.stp__dot--active {
  width: ${c.dotActiveSize + 8}px;
  height: ${c.dotActiveSize + 8}px;
  background: rgba(255,255,255,0.12);
  ${c.accentGlow ? `box-shadow: 0 0 20px ${c.accentColor}44;` : ""}
}

.stp__dot-inner {
  width: ${c.dotInactiveSize}px;
  height: ${c.dotInactiveSize}px;
  border-radius: 50%;
  background: transparent;
  border: ${borderW}px solid ${c.trackColor};
  transition: all 0.2s ease;
}

.stp__dot--active .stp__dot-inner {
  width: ${c.dotActiveSize - 4}px;
  height: ${c.dotActiveSize - 4}px;
  background: ${accentBg(c)};
  border: none;
  ${glow ? `box-shadow: ${glow};` : ""}
}

.stp__dot--completed .stp__dot-inner {
  background: ${accentBg(c)};
  border: none;
}`;
}

// ─── JSX + CSS ────────────────────────────────────────────────────

export function generateStepperJSX(config: StepperConfig): string {
  switch (config.variant) {
    case "progressPin":
      return genProgressPinJSX(config);
    case "multiStep":
      return genMultiStepJSX(config);
    case "rangeSlider":
      return genRangeSliderJSX(config);
    case "segmented":
      return genSegmentedJSX(config);
    case "dotStepper":
      return genDotStepperJSX(config);
  }
}

// ─── CSS ──────────────────────────────────────────────────────────

export function generateStepperCSS(config: StepperConfig): string {
  switch (config.variant) {
    case "progressPin":
      return genProgressPinCSS(config);
    case "multiStep":
      return genMultiStepCSS(config);
    case "rangeSlider":
      return genRangeSliderCSS(config);
    case "segmented":
      return genSegmentedCSS(config);
    case "dotStepper":
      return genDotStepperCSS(config);
  }
}

// ─── TSX + CSS ────────────────────────────────────────────────────

function genProgressPinTSX(c: StepperConfig) {
  const pct = Math.max(0, Math.min(100, c.progressValue));

  return `import { useState } from "react";
import "./Stepper.css";

interface ProgressPinStepperProps {
  value?: number;
  onValueChange?: (value: number) => void;
}

export default function ProgressPinStepper({ value = ${pct}, onValueChange }: ProgressPinStepperProps) {
  const [progress, setProgress] = useState<number>(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const v = Number(e.target.value);
    setProgress(v);
    onValueChange?.(v);
  }

  return (
    <div className="stp-wrap">
      <div className="stp__track-wrap">
        <div className="stp__track">
          <div className="stp__fill" style={{ width: progress + "%" }} />
          <div className="stp__pin-wrap" style={{ left: progress + "%" }}>
            <span className="stp__pin-label">{progress}%</span>
            <div className="stp__pin">
              <div className="stp__pin-dot" />
            </div>
          </div>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleChange}
        className="stp__range-input"
      />
    </div>
  );
}`;
}

function genMultiStepTSX(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);

  return `import "./Stepper.css";

const STEPS: string[] = ${stepsLiteral};

interface MultiStepStepperProps {
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

export default function MultiStepStepper({ activeStep = ${c.activeStep}, onStepChange }: MultiStepStepperProps) {
  return (
    <div className="stp-wrap">
      <div className="stp__steps">
        <div className="stp__steps-line" />
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isCompleted = n < activeStep;
          const isActive = n === activeStep;
          const isPending = n > activeStep;
          return (
            <button
              key={i}
              className={[
                "stp__step",
                isActive ? "stp__step--active" : "",
                isCompleted ? "stp__step--completed" : "",
                isPending ? "stp__step--pending" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onStepChange?.(n)}
            >
              ${c.showLabels ? '<span className="stp__step-label">{label}</span>' : ""}
              <div className="stp__step-node" />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genRangeSliderTSX(c: StepperConfig) {
  return `import { useState } from "react";
import "./Stepper.css";

interface RangeSliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
}

export default function RangeSlider({ value = ${c.progressValue}, onValueChange }: RangeSliderProps) {
  const [val, setVal] = useState<number>(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const v = Number(e.target.value);
    setVal(v);
    onValueChange?.(v);
  }

  return (
    <div className="stp-wrap">
      <div className="stp__slider-row">
        <div className="stp__track">
          <div className="stp__fill" style={{ width: val + "%" }} />
          <div className="stp__thumb" style={{ left: val + "%" }} />
          <input
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={handleChange}
            className="stp__range-input"
          />
        </div>
        <span className="stp__slider-value">{val}</span>
      </div>
    </div>
  );
}`;
}

function genSegmentedTSX(c: StepperConfig) {
  const count = Math.max(2, Math.min(8, c.segmentCount));
  return `import "./Stepper.css";

const SEGMENT_COUNT = ${count};

interface SegmentedProgressProps {
  active?: number;
  onSegmentChange?: (segment: number) => void;
}

export default function SegmentedProgress({ active = ${c.activeSegments}, onSegmentChange }: SegmentedProgressProps) {
  const fillPct = (active / SEGMENT_COUNT) * 100;

  return (
    <div className="stp-wrap">
      <div className="stp__seg">
        <div className="stp__seg-fill" style={{ width: \`calc(\${fillPct}% - 8px)\` }} />
        <div className="stp__seg-labels">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <button
              key={i}
              className={\`stp__seg-item \${i < active ? "stp__seg-item--active" : ""}\`}
              onClick={() => onSegmentChange?.(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

function genDotStepperTSX(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);

  return `import "./Stepper.css";

const STEPS: string[] = ${stepsLiteral};

interface DotStepperProps {
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

export default function DotStepper({ activeStep = ${c.activeStep}, onStepChange }: DotStepperProps) {
  return (
    <div className="stp-wrap">
      <div className="stp__dots">
        <div className="stp__dots-line" />
        {STEPS.map((_, i) => {
          const n = i + 1;
          const isActive = n === activeStep;
          const isCompleted = n < activeStep;
          return (
            <button
              key={i}
              className={[
                "stp__dot",
                isActive ? "stp__dot--active" : "",
                isCompleted ? "stp__dot--completed" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onStepChange?.(n)}
            >
              <div className="stp__dot-inner" />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

export function generateStepperTSX(config: StepperConfig): string {
  switch (config.variant) {
    case "progressPin":
      return genProgressPinTSX(config);
    case "multiStep":
      return genMultiStepTSX(config);
    case "rangeSlider":
      return genRangeSliderTSX(config);
    case "segmented":
      return genSegmentedTSX(config);
    case "dotStepper":
      return genDotStepperTSX(config);
  }
}

// ─── TSX + Tailwind ───────────────────────────────────────────────

function genProgressPinTailwind(c: StepperConfig) {
  const pct = Math.max(0, Math.min(100, c.progressValue));
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const accentBgValue = c.useGradient
    ? `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`
    : c.accentColor;
  const glowValue = c.accentGlow ? `0 0 14px ${c.accentColor}66` : "none";
  const pinFilter = c.accentGlow
    ? `drop-shadow(0 4px 8px ${c.accentColor}88)`
    : "drop-shadow(0 4px 8px rgba(0,0,0,0.4))";
  const fs = c.fontSize;
  const pinSvgEncoded = encodeURIComponent(c.pinColor);

  return `import { useState, CSSProperties } from "react";

interface ProgressPinStepperProps {
  value?: number;
  onValueChange?: (value: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the ProgressPinStepper
const stpVars: CSSProperties = {
  "--stp-bg":           "${c.backgroundColor}",
  "--stp-radius":       "${c.borderRadius}px",
  "--stp-track":        "${c.trackColor}",
  "--stp-accent":       "${accentBgValue}",
  "--stp-accent-color": "${c.accentColor}",
  "--stp-pin":          "${c.pinColor}",
  "--stp-label-active": "${c.activeLabelColor}",
  "--stp-thumb":        "${c.thumbColor}",
  "--stp-thumb-w":      "${c.thumbWidth}px",
  "--stp-thumb-h":      "${c.thumbHeight}px",
  "--stp-thumb-radius": "${c.thumbBorderRadius}px",
  "--stp-track-h":      "${c.trackHeight}px",
  "--stp-glow":         "${glowValue}",
  "--stp-pin-filter":   "${pinFilter}",
} as CSSProperties;

export default function ProgressPinStepper({ value = ${pct}, onValueChange }: ProgressPinStepperProps) {
  const [progress, setProgress] = useState<number>(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const v = Number(e.target.value);
    setProgress(v);
    onValueChange?.(v);
  }

  return (
    <div
      className="bg-[var(--stp-bg)] rounded-[var(--stp-radius)] px-10 pt-16 pb-8 font-sans"
      style={{ ...stpVars, boxShadow: "${shadow}" }}
    >
      <div className="relative pt-14">
        <div
          className="relative w-full rounded-full bg-[var(--stp-track)]"
          style={{ height: "var(--stp-track-h)" }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-300 ease-[ease]"
            style={{
              width: progress + "%",
              background: "var(--stp-accent)",
              boxShadow: "var(--stp-glow)",
            }}
          />
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ top: "-52px", left: progress + "%" }}
          >
            <span className="text-[${fs}px] font-bold text-[var(--stp-label-active)] mb-1">
              {progress}%
            </span>
            <div
              className="w-8 flex justify-center pt-[7px]"
              style={{
                height: "44px",
                backgroundImage: \`url("data:image/svg+xml,%3Csvg width='32' height='44' viewBox='0 0 32 44' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 44L32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16L16 44Z' fill='${pinSvgEncoded}'/%3E%3C/svg%3E")\`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                filter: "var(--stp-pin-filter)",
              }}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleChange}
        className="w-full mt-5 appearance-none h-1 rounded-full outline-none cursor-pointer bg-[var(--stp-track)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[var(--stp-thumb-w)] [&::-webkit-slider-thumb]:h-[var(--stp-thumb-h)] [&::-webkit-slider-thumb]:bg-[var(--stp-thumb)] [&::-webkit-slider-thumb]:rounded-[var(--stp-thumb-radius)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
      />
    </div>
  );
}`;
}

function genMultiStepTailwind(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const accentBgValue = c.useGradient
    ? `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`
    : c.accentColor;
  const borderRadius =
    c.stepNodeBorderRadius >= 50 ? "50%" : `${c.stepNodeBorderRadius}px`;
  const fs = c.fontSize;

  return `import { CSSProperties } from "react";

const STEPS: string[] = ${stepsLiteral};

interface MultiStepStepperProps {
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the MultiStepStepper
const stpVars: CSSProperties = {
  "--stp-bg":           "${c.backgroundColor}",
  "--stp-radius":       "${c.borderRadius}px",
  "--stp-track":        "${c.trackColor}",
  "--stp-accent":       "${accentBgValue}",
  "--stp-accent-color": "${c.accentColor}",
  "--stp-label":        "${c.labelColor}",
  "--stp-label-active": "${c.activeLabelColor}",
  "--stp-node-size":    "${c.stepNodeSize}px",
  "--stp-node-radius":  "${borderRadius}",
  "--stp-track-h":      "${c.trackHeight}px",
  "--stp-glow":         "${c.accentGlow ? `0 0 14px ${c.accentColor}66` : "none"}",
  "--stp-ring":         "${c.accentColor}22",
} as CSSProperties;

export default function MultiStepStepper({ activeStep = ${c.activeStep}, onStepChange }: MultiStepStepperProps) {
  return (
    <div
      className="rounded-[var(--stp-radius)] px-6 py-8 font-sans bg-[var(--stp-bg)]"
      style={{ ...stpVars, boxShadow: "${shadow}" }}
    >
      <div className="flex items-end justify-between relative">
        {/* Track line */}
        <div
          className="absolute left-0 right-0 bg-[var(--stp-track)] z-0"
          style={{
            bottom: "calc(var(--stp-node-size) / 2)",
            height: "var(--stp-track-h)",
          }}
        />
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isCompleted = n < activeStep;
          const isActive = n === activeStep;

          let nodeClass = "border-2 border-[var(--stp-track)] bg-transparent transition-all duration-200";
          if (isCompleted || isActive) {
            nodeClass = "border-none transition-all duration-200";
          }

          return (
            <button
              key={i}
              className="relative z-10 flex flex-col items-center gap-2.5 bg-transparent border-none cursor-pointer p-0"
              onClick={() => onStepChange?.(n)}
            >
              ${
                c.showLabels
                  ? `<span
                className={\`text-[${fs}px] text-center \${isActive ? "font-bold text-[var(--stp-label-active)]" : "font-medium text-[var(--stp-label)]"}\`}
              >
                {label}
              </span>`
                  : ""
              }
              <div
                className={nodeClass}
                style={{
                  width: "var(--stp-node-size)",
                  height: "var(--stp-node-size)",
                  borderRadius: "var(--stp-node-radius)",
                  ...(isCompleted || isActive
                    ? { background: "var(--stp-accent)" }
                    : {}),
                  ...(isActive
                    ? {
                        boxShadow: \`0 0 0 8px var(--stp-ring)\${${c.accentGlow} ? ", var(--stp-glow)" : ""}\`,
                      }
                    : {}),
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

function genRangeSliderTailwind(c: StepperConfig) {
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const accentBgValue = c.useGradient
    ? `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`
    : c.accentColor;
  const glowValue = c.accentGlow ? `0 0 14px ${c.accentColor}66` : "none";

  return `import { useState, CSSProperties } from "react";

interface RangeSliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the RangeSlider
const stpVars: CSSProperties = {
  "--stp-bg":           "${c.backgroundColor}",
  "--stp-radius":       "${c.borderRadius}px",
  "--stp-track":        "${c.trackColor}",
  "--stp-accent":       "${accentBgValue}",
  "--stp-label-active": "${c.activeLabelColor}",
  "--stp-thumb":        "${c.thumbColor}",
  "--stp-thumb-w":      "${c.thumbWidth}px",
  "--stp-thumb-h":      "${c.thumbHeight}px",
  "--stp-thumb-radius": "${c.thumbBorderRadius}px",
  "--stp-track-h":      "${c.trackHeight}px",
  "--stp-glow":         "${glowValue}",
} as CSSProperties;

export default function RangeSlider({ value = ${c.progressValue}, onValueChange }: RangeSliderProps) {
  const [val, setVal] = useState<number>(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const v = Number(e.target.value);
    setVal(v);
    onValueChange?.(v);
  }

  return (
    <div
      className="rounded-[var(--stp-radius)] px-10 py-8 font-sans bg-[var(--stp-bg)]"
      style={{ ...stpVars, boxShadow: "${shadow}" }}
    >
      <div className="flex items-center gap-5">
        <div
          className="relative flex-1 rounded-full bg-[var(--stp-track)]"
          style={{ height: "var(--stp-track-h)" }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
            style={{
              width: val + "%",
              background: "var(--stp-accent)",
              boxShadow: "var(--stp-glow)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_2px_12px_rgba(0,0,0,0.4)] pointer-events-none"
            style={{
              left: val + "%",
              width: "var(--stp-thumb-w)",
              height: "var(--stp-thumb-h)",
              background: "var(--stp-thumb)",
              borderRadius: "var(--stp-thumb-radius)",
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full m-0 opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-[14px] font-bold text-[var(--stp-label-active)] min-w-[28px] text-right">
          {val}
        </span>
      </div>
    </div>
  );
}`;
}

function genSegmentedTailwind(c: StepperConfig) {
  const count = Math.max(2, Math.min(8, c.segmentCount));
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const accentBgValue = c.useGradient
    ? `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`
    : c.accentColor;
  const glowValue = c.accentGlow ? `0 0 14px ${c.accentColor}66` : "none";
  const fs = c.fontSize;

  return `import { CSSProperties } from "react";

const SEGMENT_COUNT = ${count};

interface SegmentedProgressProps {
  active?: number;
  onSegmentChange?: (segment: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the SegmentedProgress
const stpVars: CSSProperties = {
  "--stp-bg":           "${c.backgroundColor}",
  "--stp-radius":       "${c.borderRadius}px",
  "--stp-track":        "${c.trackColor}",
  "--stp-accent":       "${accentBgValue}",
  "--stp-label":        "${c.labelColor}",
  "--stp-label-active": "${c.activeLabelColor}",
  "--stp-glow":         "${glowValue}",
} as CSSProperties;

export default function SegmentedProgress({ active = ${c.activeSegments}, onSegmentChange }: SegmentedProgressProps) {
  const fillPct = (active / SEGMENT_COUNT) * 100;

  return (
    <div
      className="rounded-[var(--stp-radius)] px-10 py-8 font-sans bg-[var(--stp-bg)]"
      style={{ ...stpVars, boxShadow: "${shadow}" }}
    >
      <div className="rounded-full h-10 flex items-center p-1 relative overflow-hidden bg-[var(--stp-track)]/[.33]">
        <div
          className="absolute left-1 top-1 bottom-1 rounded-full transition-[width] duration-300 ease-[ease] z-0 pointer-events-none"
          style={{
            width: \`calc(\${fillPct}% - 8px)\`,
            background: "var(--stp-accent)",
            boxShadow: "var(--stp-glow)",
          }}
        />
        <div className="flex w-full relative z-10">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <button
              key={i}
              className={\`flex-1 text-center text-[${fs}px] font-semibold bg-transparent border-none cursor-pointer py-1 transition-colors duration-200 \${i < active ? "text-[var(--stp-label-active)]" : "text-[var(--stp-label)]"}\`}
              onClick={() => onSegmentChange?.(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

function genDotStepperTailwind(c: StepperConfig) {
  const steps = STEP_LABELS.slice(0, c.totalSteps);
  const stepsLiteral = JSON.stringify(steps);
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const accentBgValue = c.useGradient
    ? `linear-gradient(90deg, ${c.accentColor} 0%, ${c.accentColorSecondary} 100%)`
    : c.accentColor;
  const glowValue = c.accentGlow ? `0 0 14px ${c.accentColor}66` : "none";
  const borderW = Math.max(2, Math.round(c.dotInactiveSize * 0.25));

  return `import { CSSProperties } from "react";

const STEPS: string[] = ${stepsLiteral};

interface DotStepperProps {
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the DotStepper
const stpVars: CSSProperties = {
  "--stp-bg":             "${c.backgroundColor}",
  "--stp-radius":         "${c.borderRadius}px",
  "--stp-track":          "${c.trackColor}",
  "--stp-accent":         "${accentBgValue}",
  "--stp-accent-color":   "${c.accentColor}",
  "--stp-track-h":        "${c.trackHeight}px",
  "--stp-dot-inactive":   "${c.dotInactiveSize}px",
  "--stp-dot-active":     "${c.dotActiveSize + 8}px",
  "--stp-dot-inner-active": "${c.dotActiveSize - 4}px",
  "--stp-dot-border":     "${borderW}px",
  "--stp-glow":           "${glowValue}",
  "--stp-glow-ring":      "${c.accentGlow ? `0 0 20px ${c.accentColor}44` : "none"}",
} as CSSProperties;

export default function DotStepper({ activeStep = ${c.activeStep}, onStepChange }: DotStepperProps) {
  return (
    <div
      className="rounded-[var(--stp-radius)] px-10 py-8 font-sans bg-[var(--stp-bg)]"
      style={{ ...stpVars, boxShadow: "${shadow}" }}
    >
      <div className="flex items-center justify-between relative">
        {/* Track line */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-[var(--stp-track)] z-0"
          style={{ height: "var(--stp-track-h)" }}
        />
        {STEPS.map((_, i) => {
          const n = i + 1;
          const isActive = n === activeStep;
          const isCompleted = n < activeStep;

          return (
            <button
              key={i}
              className="relative z-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer p-0 transition-all duration-200"
              style={{
                width: isActive ? "var(--stp-dot-active)" : "var(--stp-dot-inactive)",
                height: isActive ? "var(--stp-dot-active)" : "var(--stp-dot-inactive)",
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                boxShadow: isActive ? "var(--stp-glow-ring)" : "none",
              }}
              onClick={() => onStepChange?.(n)}
            >
              <div
                className="rounded-full transition-all duration-200"
                style={{
                  width: isActive
                    ? "var(--stp-dot-inner-active)"
                    : "var(--stp-dot-inactive)",
                  height: isActive
                    ? "var(--stp-dot-inner-active)"
                    : "var(--stp-dot-inactive)",
                  background:
                    isActive || isCompleted ? "var(--stp-accent)" : "transparent",
                  border:
                    isActive || isCompleted
                      ? "none"
                      : "var(--stp-dot-border) solid var(--stp-track)",
                  boxShadow: isActive ? "var(--stp-glow)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

export function generateStepperTailwind(config: StepperConfig): string {
  switch (config.variant) {
    case "progressPin":
      return genProgressPinTailwind(config);
    case "multiStep":
      return genMultiStepTailwind(config);
    case "rangeSlider":
      return genRangeSliderTailwind(config);
    case "segmented":
      return genSegmentedTailwind(config);
    case "dotStepper":
      return genDotStepperTailwind(config);
  }
}
