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
      ? `width: ${connectorLength}px;\n  border-bottom: ${connectorThickness}px ${connectorBorderStyle} ${connectorIncompleteColor};\n  align-self: center;\n  position: relative;\n  top: -${showStepLabels ? nodeSize / 2 + 12 : 0}px;`
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
`;
}
