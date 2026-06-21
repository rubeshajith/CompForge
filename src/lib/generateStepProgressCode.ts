// /lib/generateStepProgressCode.ts

import {
  StepProgressConfig,
  StepShape,
  StepLabelType,
} from "./stepProgressConfig";

function toRoman(n: number): string {
  const vals = [1, 4, 5, 9, 10];
  const syms = ["I", "IV", "V", "IX", "X"];
  let result = "";
  for (let i = vals.length - 1; i >= 0; i--) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

// ─── JSX + CSS ────────────────────────
export function generateStepProgressJSX(config: StepProgressConfig): string {
  const {
    orientation,
    nodeShape,
    nodeSize,
    labelType,
    nodeFontSize,
    completedBackground,
    completedBorderColor,
    completedTextColor,
    activeBackground,
    activeBorderColor,
    activeTextColor,
    activeGlow,
    incompleteBackground,
    incompleteBorderColor,
    incompleteTextColor,
    connectorStyle,
    connectorThickness,
    connectorCompletedColor,
    connectorIncompleteColor,
    connectorLength,
    stepLabelColor,
    stepLabelActiveColor,
    stepLabelFontSize,
    showStepLabels,
    animateTransitions,
    showNodeShadow,
  } = config;

  const isHorizontal = orientation === "horizontal";
  const isDiamond = nodeShape === "diamond";

  return `import { useState } from "react";
import "./StepProgress.css";

function toRoman(n) {
  const vals = [1, 4, 5, 9, 10];
  const syms = ["I", "IV", "V", "IX", "X"];
  let result = "";
  for (let i = vals.length - 1; i >= 0; i--) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function getLabelContent(index, isCompleted) {
  if (isCompleted && "${labelType}" !== "none") return "✓";
  switch ("${labelType}") {
    case "number": return String(index + 1);
    case "letter": return String.fromCharCode(65 + index);
    case "roman":  return toRoman(index + 1);
    case "icon":   return "○";
    case "none":   return "";
  }
}

export default function StepProgress({
  steps = ["Step 1", "Step 2", "Step 3", "Step 4"],
  currentStep = 0,
  onStepChange,
}) {
  ${
    isHorizontal
      ? `return (
    <div className="sp sp--horizontal">
      <div className="sp__nodes-row">
        {steps.map((step, index) => (
          <div key={index} className="sp__item-group">
            <div
              className={\`sp__node \${
                index < currentStep ? "sp__node--completed"
                : index === currentStep ? "sp__node--active"
                : "sp__node--incomplete"
              }\`}
              onClick={() => onStepChange?.(index)}
            >
              <span className="sp__node-inner">
                {getLabelContent(index, index < currentStep)}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={\`sp__connector \${index < currentStep - 1 ? "sp__connector--completed" : ""}\`} />
            )}
          </div>
        ))}
      </div>
      ${
        showStepLabels
          ? `<div className="sp__labels-row">
        {steps.map((step, index) => (
          <div key={index} className="sp__label-cell">
            <span className={\`sp__label \${index === currentStep ? "sp__label--active" : ""}\`}>
              {step}
            </span>
            {index < steps.length - 1 && <div className="sp__label-spacer" />}
          </div>
        ))}
      </div>`
          : ""
      }
    </div>
  );`
      : `return (
    <div className="sp sp--vertical">
      {steps.map((step, index) => (
        <div key={index} className="sp__item-group">
          <div
            className={\`sp__node \${
              index < currentStep ? "sp__node--completed"
              : index === currentStep ? "sp__node--active"
              : "sp__node--incomplete"
            }\`}
            onClick={() => onStepChange?.(index)}
          >
            <span className="sp__node-inner">
              {getLabelContent(index, index < currentStep)}
            </span>
          </div>
          ${
            showStepLabels
              ? `<span className={\`sp__label \${index === currentStep ? "sp__label--active" : ""}\`}>
              {step}
            </span>`
              : ""
          }
          {index < steps.length - 1 && (
            <div className={\`sp__connector \${index < currentStep - 1 ? "sp__connector--completed" : ""}\`} />
          )}
        </div>
      ))}
    </div>
  );`
  }
}`;
}

// ─── CSS ──────────────────────────────
export function generateStepProgressCSS(config: StepProgressConfig): string {
  const {
    orientation,
    nodeShape,
    nodeSize,
    nodeFontSize,
    completedBackground,
    completedBorderColor,
    completedTextColor,
    activeBackground,
    activeBorderColor,
    activeTextColor,
    activeGlow,
    incompleteBackground,
    incompleteBorderColor,
    incompleteTextColor,
    connectorStyle,
    connectorThickness,
    connectorCompletedColor,
    connectorIncompleteColor,
    connectorLength,
    stepLabelColor,
    stepLabelActiveColor,
    stepLabelFontSize,
    showStepLabels,
    animateTransitions,
    showNodeShadow,
  } = config;

  const isHorizontal = orientation === "horizontal";
  const transition = animateTransitions ? "all 0.3s ease" : "none";
  const connectorBorderStyle = connectorStyle;

  let nodeShapeCSS = "";
  switch (nodeShape) {
    case "circle":
      nodeShapeCSS = "border-radius: 50%;";
      break;
    case "square":
      nodeShapeCSS = "border-radius: 6px;";
      break;
    case "diamond":
      nodeShapeCSS = "border-radius: 4px;\n  transform: rotate(45deg);";
      break;
    case "hexagon":
      nodeShapeCSS = `clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n  border-radius: 0;`;
      break;
  }

  const innerRotate =
    nodeShape === "diamond"
      ? `\n.sp__node-inner {\n  transform: rotate(-45deg);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}`
      : "";

  const glowCSS = activeGlow
    ? `box-shadow: 0 0 0 4px ${activeBorderColor}33, 0 0 16px ${activeBorderColor}44;`
    : "";

  const shadowCSS = showNodeShadow
    ? `box-shadow: 0 4px 12px ${completedBackground}66;`
    : "";

  return `/* StepProgress Component */

.sp {
  display: flex;
  align-items: ${isHorizontal ? "flex-start" : "flex-start"};
  flex-direction: ${isHorizontal ? "row" : "column"};
  padding: 2rem 1rem;
  font-family: 'DM Mono', monospace;
}

.sp--horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.sp--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.sp__item-group {
  display: flex;
  flex-direction: ${isHorizontal ? "column" : "row"};
  align-items: center;
}

/* Node */
.sp__node {
  width: ${nodeSize}px;
  height: ${nodeSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${nodeFontSize}px;
  font-weight: 700;
  border: 2px solid;
  cursor: pointer;
  transition: ${transition};
  position: relative;
  z-index: 2;
  user-select: none;
  ${nodeShapeCSS}
}

.sp__node--completed {
  background: ${completedBackground};
  border-color: ${completedBorderColor};
  color: ${completedTextColor};
  ${shadowCSS}
}

.sp__node--active {
  background: ${activeBackground};
  border-color: ${activeBorderColor};
  color: ${activeTextColor};
  ${glowCSS}
}

.sp__node--incomplete {
  background: ${incompleteBackground};
  border-color: ${incompleteBorderColor};
  color: ${incompleteTextColor};
}

${innerRotate}

/* Connector */
.sp__connector {
  background: transparent;
  flex-shrink: 0;
  transition: border-color ${animateTransitions ? "0.4s ease" : "0s"};
  ${
    isHorizontal
      ? `width: ${connectorLength}px;\n  border-bottom: ${connectorThickness}px ${connectorBorderStyle} ${connectorIncompleteColor};\n  align-self: center;`
      : `min-height: ${connectorLength}px;\n  border-left: ${connectorThickness}px ${connectorBorderStyle} ${connectorIncompleteColor};\n  margin-left: ${nodeSize / 2 - connectorThickness / 2}px;`
  }
}

.sp__connector--completed {
  ${
    isHorizontal
      ? `border-bottom-color: ${connectorCompletedColor};`
      : `border-left-color: ${connectorCompletedColor};`
  }
}

/* Labels */
.sp__label {
  margin-top: 8px;
  font-size: ${stepLabelFontSize}px;
  font-weight: 400;
  color: ${stepLabelColor};
  text-align: center;
  white-space: nowrap;
  font-family: 'Instrument Sans', sans-serif;
  transition: color ${animateTransitions ? "0.3s ease" : "0s"};
  display: ${showStepLabels ? "block" : "none"};
}

.sp__label--active {
  color: ${stepLabelActiveColor};
  font-weight: 600;
}
  ${
    isHorizontal
      ? `
/* Horizontal two-row layout */
.sp__nodes-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.sp__item-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sp__labels-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-top: 8px;
}

.sp__label-cell {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sp__label-spacer {
  width: ${connectorLength}px;
  min-width: ${connectorLength}px;
  flex-shrink: 0;
}`
      : ""
  }

`;
}

// ─── TSX + CSS ────────────────────────
export function generateStepProgressTSX(config: StepProgressConfig): string {
  const {
    orientation,
    nodeShape,
    nodeSize,
    labelType,
    nodeFontSize,
    completedBackground,
    completedBorderColor,
    completedTextColor,
    activeBackground,
    activeBorderColor,
    activeTextColor,
    activeGlow,
    incompleteBackground,
    incompleteBorderColor,
    incompleteTextColor,
    connectorStyle,
    connectorThickness,
    connectorCompletedColor,
    connectorIncompleteColor,
    connectorLength,
    stepLabelColor,
    stepLabelActiveColor,
    stepLabelFontSize,
    showStepLabels,
    animateTransitions,
    showNodeShadow,
  } = config;

  const isHorizontal = orientation === "horizontal";

  return `import { useState } from "react";
import "./StepProgress.css";

function toRoman(n: number): string {
  const vals = [1, 4, 5, 9, 10];
  const syms = ["I", "IV", "V", "IX", "X"];
  let result = "";
  for (let i = vals.length - 1; i >= 0; i--) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function getLabelContent(index: number, isCompleted: boolean): string {
  if (isCompleted && "${labelType}" !== "none") return "✓";
  switch ("${labelType}") {
    case "number": return String(index + 1);
    case "letter": return String.fromCharCode(65 + index);
    case "roman":  return toRoman(index + 1);
    case "icon":   return "○";
    case "none":   return "";
    default:       return "";
  }
}

interface StepProgressProps {
  steps?: string[];
  currentStep?: number;
  onStepChange?: (index: number) => void;
}

export default function StepProgress({
  steps = ["Step 1", "Step 2", "Step 3", "Step 4"],
  currentStep = 0,
  onStepChange,
}: StepProgressProps) {
  return (
    <div className="sp${isHorizontal ? " sp--horizontal" : " sp--vertical"}">
      {steps.map((step, index) => (
        <div key={index} className="sp__item-group">
          <div
            className={\`sp__node \${
              index < currentStep ? "sp__node--completed"
              : index === currentStep ? "sp__node--active"
              : "sp__node--incomplete"
            }\`}
            onClick={() => onStepChange?.(index)}
          >
            <span className="sp__node-inner">
              {getLabelContent(index, index < currentStep)}
            </span>
          </div>
          ${
            showStepLabels
              ? `{${isHorizontal ? "!isHorizontal &&" : ""} (
            <span className={\`sp__label \${index === currentStep ? "sp__label--active" : ""}\`}>
              {step}
            </span>
          )}`
              : ""
          }
          {index < steps.length - 1 && (
            <div className={\`sp__connector \${index < currentStep - 1 ? "sp__connector--completed" : ""}\`} />
          )}
        </div>
      ))}
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateStepProgressTailwind(
  config: StepProgressConfig,
): string {
  const {
    orientation,
    nodeShape,
    nodeSize,
    labelType,
    nodeFontSize,
    completedBackground,
    completedBorderColor,
    completedTextColor,
    activeBackground,
    activeBorderColor,
    activeTextColor,
    activeGlow,
    incompleteBackground,
    incompleteBorderColor,
    incompleteTextColor,
    connectorStyle,
    connectorThickness,
    connectorCompletedColor,
    connectorIncompleteColor,
    connectorLength,
    stepLabelColor,
    stepLabelActiveColor,
    stepLabelFontSize,
    showStepLabels,
    animateTransitions,
    showNodeShadow,
  } = config;

  const isHorizontal = orientation === "horizontal";

  // Pre-compute node shape classes / styles
  let nodeShapeClass = "";
  let nodeShapeStyle = "";
  switch (nodeShape) {
    case "circle":
      nodeShapeClass = "rounded-full";
      break;
    case "square":
      nodeShapeClass = "rounded-[6px]";
      break;
    case "diamond":
      nodeShapeClass = "rounded-[4px]";
      nodeShapeStyle = " rotate-45";
      break;
    case "hexagon":
      // clip-path can't be expressed as Tailwind arbitrary value reliably; use inline style
      nodeShapeClass = "";
      break;
  }

  // Pre-compute glow shadow (complex multi-part value)
  const glowShadow = activeGlow
    ? `0 0 0 4px ${activeBorderColor}33, 0 0 16px ${activeBorderColor}44`
    : "none";

  // Pre-compute node shadow
  const nodeShadow = showNodeShadow
    ? `0 4px 12px ${completedBackground}66`
    : "none";

  // Connector border style for inline style (Tailwind can't express dashed/dotted border-bottom easily)
  const connectorBorderStyle = connectorStyle;

  // Bake font sizes as literals
  const nodeFontSizePx = nodeFontSize;
  const stepLabelFontSizePx = stepLabelFontSize;

  return `import { useState, CSSProperties } from "react";

function toRoman(n: number): string {
  const vals = [1, 4, 5, 9, 10];
  const syms = ["I", "IV", "V", "IX", "X"];
  let result = "";
  for (let i = vals.length - 1; i >= 0; i--) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function getLabelContent(index: number, isCompleted: boolean): string {
  if (isCompleted && "${labelType}" !== "none") return "✓";
  switch ("${labelType}") {
    case "number": return String(index + 1);
    case "letter": return String.fromCharCode(65 + index);
    case "roman":  return toRoman(index + 1);
    case "icon":   return "○";
    case "none":   return "";
    default:       return "";
  }
}

interface StepProgressProps {
  steps?: string[];
  currentStep?: number;
  onStepChange?: (index: number) => void;
}

// Baked-in CSS variable tokens — update these to reskin the StepProgress
const spVars: CSSProperties = {
  "--sp-completed-bg":         "${completedBackground}",
  "--sp-completed-border":     "${completedBorderColor}",
  "--sp-completed-text":       "${completedTextColor}",
  "--sp-active-bg":            "${activeBackground}",
  "--sp-active-border":        "${activeBorderColor}",
  "--sp-active-text":          "${activeTextColor}",
  "--sp-incomplete-bg":        "${incompleteBackground}",
  "--sp-incomplete-border":    "${incompleteBorderColor}",
  "--sp-incomplete-text":      "${incompleteTextColor}",
  "--sp-connector-completed":  "${connectorCompletedColor}",
  "--sp-connector-incomplete": "${connectorIncompleteColor}",
  "--sp-node-size":            "${nodeSize}px",
  "--sp-label-color":          "${stepLabelColor}",
  "--sp-label-active-color":   "${stepLabelActiveColor}",
} as CSSProperties;

export default function StepProgress({
  steps = ["Step 1", "Step 2", "Step 3", "Step 4"],
  currentStep = 0,
  onStepChange,
}: StepProgressProps) {
  return (
    <div
      className="flex ${isHorizontal ? "flex-row items-start" : "flex-col items-start"} p-8 font-mono"
      style={spVars}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        // Node classes
        let nodeCls = "flex items-center justify-content-center border-2 cursor-pointer select-none relative z-[2] text-[${nodeFontSizePx}px] font-bold w-[var(--sp-node-size)] h-[var(--sp-node-size)]${nodeShapeClass ? ` ${nodeShapeClass}` : ""}${nodeShapeStyle ? ` ${nodeShapeStyle}` : ""}${animateTransitions ? " transition-all duration-300 ease-in-out" : ""}";
        if (isCompleted) {
          nodeCls += " bg-[var(--sp-completed-bg)] border-[var(--sp-completed-border)] text-[var(--sp-completed-text)]";
        } else if (isActive) {
          nodeCls += " bg-[var(--sp-active-bg)] border-[var(--sp-active-border)] text-[var(--sp-active-text)]";
        } else {
          nodeCls += " bg-[var(--sp-incomplete-bg)] border-[var(--sp-incomplete-border)] text-[var(--sp-incomplete-text)]";
        }

        // Node shadow / glow via inline style (complex multi-part box-shadow)
        const nodeBoxShadow =
          isCompleted && ${showNodeShadow} ? "${nodeShadow}"
          : isActive && ${activeGlow} ? "${glowShadow}"
          : undefined;

        // Connector completed?
        const connectorCompleted = index < currentStep - 1;

        return (
          <div
            key={index}
            className="flex ${isHorizontal ? "flex-col items-center" : "flex-row items-center"}"
          >
            <div
              className={nodeCls}
              style={nodeBoxShadow ? { boxShadow: nodeBoxShadow } : undefined}
              onClick={() => onStepChange?.(index)}
            >
              <span className="${nodeShape === "diamond" ? "rotate-[-45deg] flex items-center justify-center w-full h-full" : "flex items-center justify-center w-full h-full"}">
                {getLabelContent(index, isCompleted)}
              </span>
            </div>
            ${
              showStepLabels
                ? `{${isHorizontal ? "!isHorizontal &&" : ""} (
              <span
                className={\`mt-2 text-[${stepLabelFontSizePx}px] whitespace-nowrap font-sans${animateTransitions ? " transition-colors duration-300" : ""} \${
                  isActive
                    ? "text-[var(--sp-label-active-color)] font-semibold"
                    : "text-[var(--sp-label-color)] font-normal"
                }\`}
              >
                {step}
              </span>
            )}`
                : ""
            }
            {index < steps.length - 1 && (
              <div
                className="shrink-0${animateTransitions ? " transition-[border-color] duration-[400ms]" : ""}"
                style={${
                  isHorizontal
                    ? `{
                  width: "${connectorLength}px",
                  borderBottom: \`${connectorThickness}px ${connectorBorderStyle} \${connectorCompleted ? "var(--sp-connector-completed)" : "var(--sp-connector-incomplete)"}\`,
                  alignSelf: "center",
                  position: "relative",
                  top: \`-${showStepLabels ? nodeSize / 2 + 12 : 0}px\`,
                }`
                    : `{
                  minHeight: "${connectorLength}px",
                  borderLeft: \`${connectorThickness}px ${connectorBorderStyle} \${connectorCompleted ? "var(--sp-connector-completed)" : "var(--sp-connector-incomplete)"}\`,
                  marginLeft: "${nodeSize / 2 - connectorThickness / 2}px",
                }`
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}`;
}
