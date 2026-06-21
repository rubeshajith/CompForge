// /components/playground/StepProgressPreview.tsx
"use client";

import React, { useState } from "react";
import {
  StepProgressConfig,
  StepShape,
  StepLabelType,
} from "@/lib/stepProgressConfig";

interface StepProgressPreviewProps {
  config: StepProgressConfig;
}

const ALL_STEP_LABELS = ["Account", "Details", "Review", "Confirm", "Done"];

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

function getLabelContent(
  index: number,
  labelType: StepLabelType,
  isCompleted: boolean,
): string {
  if (isCompleted && labelType !== "none") return "✓";
  switch (labelType) {
    case "number":
      return String(index + 1);
    case "letter":
      return String.fromCharCode(65 + index); // A, B, C...
    case "roman":
      return toRoman(index + 1);
    case "icon":
      return "○";
    case "none":
      return "";
  }
}

function getShapeStyle(shape: StepShape): React.CSSProperties {
  switch (shape) {
    case "circle":
      return { borderRadius: "50%" };
    case "square":
      return { borderRadius: "6px" };
    case "diamond":
      return { borderRadius: "4px", transform: "rotate(45deg)" };
    case "hexagon":
      return {
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        borderRadius: 0,
      };
  }
}

// Hexagon border: renders a slightly larger hexagon in the border color behind the node
function HexagonNode({
  size,
  borderColor,
  bgColor,
  color,
  fontSize,
  glow,
  shadow,
  transition,
  onClick,
  children,
}: {
  size: number;
  borderColor: string;
  bgColor: string;
  color: string;
  fontSize: number;
  glow: boolean;
  shadow: boolean;
  transition: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const borderThickness = 2;
  const outerSize = size + borderThickness * 2;
  const hexClip =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: outerSize,
        height: outerSize,
        clipPath: hexClip,
        background: borderColor,
        flexShrink: 0,
        transition,
        cursor: "pointer",
        filter: glow
          ? `drop-shadow(0 0 6px ${borderColor}99) drop-shadow(0 0 12px ${borderColor}55)`
          : shadow
            ? `drop-shadow(0 4px 6px ${bgColor}66)`
            : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: borderThickness,
          left: borderThickness,
          width: size,
          height: size,
          clipPath: hexClip,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize,
          fontWeight: 700,
          color,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "-0.02em",
          userSelect: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function StepProgressPreview({ config }: StepProgressPreviewProps) {
  const [currentStep, setCurrentStep] = useState(2);
  const isHorizontal = config.orientation === "horizontal";
  const isHexagon = config.nodeShape === "hexagon";
  const isDiamond = config.nodeShape === "diamond";

  const steps = ALL_STEP_LABELS.slice(0, config.stepCount);

  // Clamp currentStep if stepCount shrinks
  const activeStep = Math.min(currentStep, steps.length - 1);

  function getStateColors(index: number) {
    const isCompleted = index < activeStep;
    const isActive = index === activeStep;
    if (isCompleted)
      return {
        bg: config.completedBackground,
        border: config.completedBorderColor,
        color: config.completedTextColor,
        isCompleted,
        isActive,
      };
    if (isActive)
      return {
        bg: config.activeBackground,
        border: config.activeBorderColor,
        color: config.activeTextColor,
        isCompleted,
        isActive,
      };
    return {
      bg: config.incompleteBackground,
      border: config.incompleteBorderColor,
      color: config.incompleteTextColor,
      isCompleted,
      isActive,
    };
  }

  const nodeStyle = (index: number): React.CSSProperties => {
    const { bg, border, color, isCompleted, isActive } = getStateColors(index);
    const shapeStyles = getShapeStyle(config.nodeShape);

    return {
      width: config.nodeSize,
      height: config.nodeSize,
      minWidth: config.nodeSize,
      minHeight: config.nodeSize,
      background: bg,
      // hexagon border is handled by wrapper — skip border here
      border: isHexagon ? "none" : `2px solid ${border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: config.nodeFontSize,
      fontWeight: 700,
      color,
      cursor: "pointer",
      transition: config.animateTransitions ? "all 0.3s ease" : "none",
      boxShadow: isHexagon
        ? "none"
        : isActive && config.activeGlow
          ? `0 0 0 4px ${border}33, 0 0 16px ${border}44`
          : config.showNodeShadow && isCompleted
            ? `0 4px 12px ${bg}66`
            : "none",
      position: "relative",
      zIndex: 2,
      flexShrink: 0,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "-0.02em",
      ...shapeStyles,
    };
  };

  const innerContentStyle = (): React.CSSProperties => ({
    transform: isDiamond ? "rotate(-45deg)" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    userSelect: "none",
  });

  const connectorStyle = (index: number): React.CSSProperties => {
    const isCompleted = index < activeStep - 1;
    const borderStyleMap = {
      solid: "solid",
      dashed: "dashed",
      dotted: "dotted",
    };

    if (isHorizontal) {
      return {
        flex: 1,
        minWidth: config.connectorLength,
        height: config.connectorThickness,
        background: "none",
        borderBottom: `${config.connectorThickness}px ${borderStyleMap[config.connectorStyle]} ${isCompleted ? config.connectorCompletedColor : config.connectorIncompleteColor}`,
        transition: config.animateTransitions
          ? "border-color 0.4s ease"
          : "none",
        alignSelf: "center",
        zIndex: 1,
        flexShrink: 0,
      };
    } else {
      return {
        width: config.connectorThickness,
        minHeight: config.connectorLength,
        flex: 1,
        borderLeft: `${config.connectorThickness}px ${borderStyleMap[config.connectorStyle]} ${isCompleted ? config.connectorCompletedColor : config.connectorIncompleteColor}`,
        marginLeft: config.nodeSize / 2 - config.connectorThickness / 2,
        transition: config.animateTransitions
          ? "border-color 0.4s ease"
          : "none",
        zIndex: 1,
      };
    }
  };

  const labelStyle = (index: number): React.CSSProperties => ({
    marginTop: 0,
    fontSize: config.stepLabelFontSize,
    fontWeight: index === activeStep ? 600 : 400,
    color:
      index === activeStep
        ? config.stepLabelActiveColor
        : config.stepLabelColor,
    textAlign: "center",
    maxWidth: config.nodeSize + 40,
    whiteSpace: "nowrap",
    transition: config.animateTransitions ? "color 0.3s ease" : "none",
    fontFamily: "'Instrument Sans', sans-serif",
    letterSpacing: "-0.01em",
  });

  function renderNode(index: number) {
    const { bg, border, color, isCompleted, isActive } = getStateColors(index);
    const label = getLabelContent(index, config.labelType, isCompleted);

    if (isHexagon) {
      return (
        <HexagonNode
          size={config.nodeSize}
          borderColor={border}
          bgColor={bg}
          color={color}
          fontSize={config.nodeFontSize}
          glow={isActive && config.activeGlow}
          shadow={config.showNodeShadow && isCompleted}
          transition={config.animateTransitions ? "all 0.3s ease" : "none"}
          onClick={() => setCurrentStep(index)}
        >
          {label}
        </HexagonNode>
      );
    }

    return (
      <div
        style={nodeStyle(index)}
        onClick={() => setCurrentStep(index)}
        title={`Click to set step to ${index}`}
      >
        <span style={innerContentStyle()}>{label}</span>
      </div>
    );
  }

  if (isHorizontal) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        {/* Row 1: nodes + connectors only */}
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {renderNode(index)}
              {index < steps.length - 1 && (
                <div style={connectorStyle(index)} />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Row 2: labels, aligned under each node */}
        {config.showStepLabels && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              marginTop: 8,
            }}
          >
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  style={{
                    width: config.nodeSize,
                    minWidth: config.nodeSize,
                    display: "flex",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={labelStyle(index)}>{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      minWidth: config.connectorLength,
                      flexShrink: 0,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "#5a5a72",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          ← click a node to set active step →
        </p>
      </div>
    );
  }

  // Vertical layout
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "2rem 3rem",
        gap: 0,
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {renderNode(index)}
            {config.showStepLabels && (
              <span
                style={{
                  ...labelStyle(index),
                  marginTop: 0,
                  maxWidth: 160,
                  whiteSpace: "nowrap",
                  textAlign: "left",
                }}
              >
                {step}
              </span>
            )}
          </div>
          {index < steps.length - 1 && <div style={connectorStyle(index)} />}
        </React.Fragment>
      ))}
      <p
        style={{
          marginTop: 16,
          marginLeft: 4,
          fontSize: 12,
          color: "#5a5a72",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.04em",
        }}
      >
        ← click a node to set active step
      </p>
    </div>
  );
}
