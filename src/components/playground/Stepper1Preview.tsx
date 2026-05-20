"use client";

import React from "react";
import { StepperConfig } from "@/lib/stepper1Config";

interface Props {
  config: StepperConfig;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function stripesStyle(stripeColor: string) {
  return {
    backgroundImage: `linear-gradient(45deg, ${hex2rgba(stripeColor, 0.35)} 25%, transparent 25%, transparent 50%, ${hex2rgba(stripeColor, 0.35)} 50%, ${hex2rgba(stripeColor, 0.35)} 75%, transparent 75%, transparent)`,
    backgroundSize: "10px 10px",
  };
}

// ─── Variant renderers ───────────────────────────────────────────────────────

function SegmentedLoading({ c }: { c: StepperConfig }) {
  const filled = Math.round((c.fillPercent / 100) * c.segmentCount);
  const colors = [
    c.accentColor,
    c.accentColorSecondary,
    c.accentColor,
    c.point1Color,
    c.point2Color,
  ];
  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          fontSize: c.fontSize,
          color: c.labelColor,
          fontWeight: c.fontWeight,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Loading...
      </p>
      <div style={{ display: "flex", gap: c.segmentGap }}>
        {Array.from({ length: c.segmentCount }).map((_, i) => (
          <div
            key={i}
            style={{
              width: c.segmentWidth,
              height: c.trackHeight * 2.5,
              borderRadius: c.borderRadius,
              background: i < filled ? colors[i % colors.length] : c.trackColor,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SliderTooltip({ c }: { c: StepperConfig }) {
  const pct = c.fillPercent;
  return (
    <div
      style={{
        width: "100%",
        paddingTop: c.showTooltip ? 28 : 4,
        position: "relative",
      }}
    >
      {c.showTooltip && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${pct}%`,
            transform: "translateX(-50%)",
            background: c.tooltipBackground,
            color: c.tooltipTextColor,
            fontSize: c.fontSize,
            fontWeight: c.fontWeight,
            padding: "2px 6px",
            borderRadius: c.tooltipBorderRadius,
            whiteSpace: "nowrap",
            border: `1px solid ${c.accentColor}44`,
          }}
        >
          {pct}
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `5px solid ${c.tooltipBackground}`,
            }}
          />
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: c.trackHeight,
          background: c.trackColor,
          borderRadius: c.borderRadius,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: c.accentColor,
            borderRadius: c.borderRadius,
            transition: "width 0.2s",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: c.thumbSize,
            height: c.thumbSize,
            background: c.thumbBackground,
            border: `3px solid ${c.thumbBorderColor}`,
            borderRadius: "50%",
            boxShadow: `0 0 0 3px ${hex2rgba(c.thumbBorderColor, 0.2)}`,
          }}
        />
      </div>
    </div>
  );
}

function MultiPointSlider({ c }: { c: StepperConfig }) {
  const points = [
    { pct: 13, color: c.point1Color, label: "13" },
    { pct: 31, color: c.point2Color, label: "31" },
    { pct: 64, color: c.point3Color, label: "64" },
    { pct: 86, color: c.point4Color, label: "86" },
  ];
  return (
    <div style={{ width: "100%", paddingTop: 28, position: "relative" }}>
      {/* Tooltips */}
      {points.map((p) => (
        <div
          key={p.label}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.pct}%`,
            transform: "translateX(-50%)",
            background: p.color,
            color: "#fff",
            fontSize: c.fontSize,
            fontWeight: c.fontWeight,
            padding: "2px 6px",
            borderRadius: c.tooltipBorderRadius,
          }}
        >
          {p.label}
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `5px solid ${p.color}`,
            }}
          />
        </div>
      ))}
      {/* Track */}
      <div
        style={{
          width: "100%",
          height: c.trackHeight - 1,
          background: c.trackColor,
          borderRadius: c.borderRadius,
          position: "relative",
        }}
      >
        {points.map((p) => (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: `${p.pct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: c.thumbSize - 4,
              height: c.thumbSize - 4,
              background: p.color,
              borderRadius: "50%",
              boxShadow: `0 0 0 3px ${hex2rgba(p.color, 0.25)}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GradientProgress({ c }: { c: StepperConfig }) {
  const pct = c.fillPercent;
  return (
    <div style={{ width: "100%", paddingTop: 20, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: `${100 - pct}%`,
          transform: "translateX(50%)",
          fontSize: c.fontSize,
          fontWeight: c.fontWeight,
          color: c.labelColor,
        }}
      >
        {pct}%
      </div>
      <div
        style={{
          width: "100%",
          height: c.trackHeight,
          background: c.trackColor,
          borderRadius: c.borderRadius,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(to right, ${c.accentColorSecondary}, ${c.accentColor})`,
            borderRadius: c.borderRadius,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

function StepperDots({ c }: { c: StepperConfig }) {
  const steps = Array.from({ length: c.stepCount }, (_, i) => i + 1);
  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Connector line */}
      <div
        style={{
          position: "absolute",
          top: c.stepDotSize / 2,
          left: 0,
          right: 0,
          height: c.trackHeight,
          background: c.stepConnectorColor,
          zIndex: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {steps.map((s) => {
          const isActive = s === c.activeStep;
          const isComplete = s < c.activeStep;
          const dotColor = isActive
            ? c.stepActiveColor
            : isComplete
              ? c.stepCompleteColor
              : c.stepInactiveColor;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: c.stepDotSize,
                  height: c.stepDotSize,
                  borderRadius: "50%",
                  background: dotColor,
                  boxShadow: isActive
                    ? `0 0 0 3px ${hex2rgba(c.stepActiveColor, 0.3)}`
                    : undefined,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {isComplete && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1.5 4L3 5.5L6.5 2"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {c.showStepLabels && (
                <span
                  style={{
                    fontSize: c.fontSize,
                    fontWeight: c.fontWeight,
                    color: isActive ? c.stepActiveColor : c.stepLabelColor,
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Step {s}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_LABELS = ["Start", "Process", "Review", "Done", "Ship", "Close"];

function StatusStepper({ c }: { c: StepperConfig }) {
  const steps = Array.from(
    { length: Math.min(c.stepCount, 4) },
    (_, i) => i + 1,
  );
  const stepColors = [
    c.point1Color,
    c.point2Color,
    c.point3Color,
    c.stepActiveColor,
  ];
  return (
    <div style={{ width: "100%", position: "relative", padding: "0 12px" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          height: 1,
          background: c.stepConnectorColor,
          zIndex: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        {steps.map((s, i) => {
          const isActive = s === c.activeStep;
          const isComplete = s < c.activeStep;
          const dotColor =
            isActive || isComplete ? stepColors[i] : c.stepInactiveColor;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: c.stepDotSize + 8,
                  height: c.stepDotSize + 8,
                  borderRadius: "50%",
                  background: dotColor,
                  color: "#fff",
                  fontSize: c.fontSize,
                  fontWeight: c.fontWeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive
                    ? `0 0 0 4px ${hex2rgba(dotColor, 0.25)}`
                    : undefined,
                }}
              >
                {isComplete ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5L4.5 7L8 3"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {c.showStepLabels && (
                <span
                  style={{
                    fontSize: c.fontSize,
                    fontWeight: c.fontWeight,
                    color: isActive ? dotColor : c.stepLabelColor,
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {STATUS_LABELS[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SEGMENT_LABELS = ["Cart", "Shipping", "Review", "Payment"];

function ColorSegments({ c }: { c: StepperConfig }) {
  const colors = [c.seg1Color, c.seg2Color, c.seg3Color, c.seg4Color];
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          height: c.trackHeight * 2,
          borderRadius: c.borderRadius,
          overflow: "hidden",
        }}
      >
        {colors.map((col, i) => (
          <div key={i} style={{ flex: 1, background: col }} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          padding: "0 4px",
        }}
      >
        {SEGMENT_LABELS.map((lbl, i) => (
          <span
            key={i}
            style={{
              fontSize: c.fontSize,
              fontWeight: c.fontWeight,
              color: c.segLabelColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompletenessBar({ c }: { c: StepperConfig }) {
  const pct = c.fillPercent;
  const fillStyle = c.showStripes
    ? { ...stripesStyle(c.stripeColor), background: c.accentColor }
    : { background: c.accentColor };
  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          fontSize: c.fontSize,
          fontWeight: c.fontWeight,
          color: c.labelColor,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Completeness
      </p>
      <div style={{ position: "relative", paddingTop: 20 }}>
        {c.showTooltip && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${pct}%`,
              transform: "translateX(-50%)",
              background: c.accentColor,
              color: "#fff",
              fontSize: c.fontSize,
              fontWeight: c.fontWeight,
              padding: "2px 6px",
              borderRadius: c.tooltipBorderRadius,
            }}
          >
            {pct}
            <div
              style={{
                position: "absolute",
                bottom: -5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `5px solid ${c.accentColor}`,
              }}
            />
          </div>
        )}
        <div
          style={{
            width: "100%",
            height: c.trackHeight * 3,
            background: c.trackColor,
            borderRadius: c.borderRadius,
            overflow: "hidden",
            border: `1px solid ${c.trackColor}`,
          }}
        >
          <div
            style={{
              ...fillStyle,
              height: "100%",
              width: `${pct}%`,
              borderRadius: c.borderRadius,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function VerificationTrack({ c }: { c: StepperConfig }) {
  const nodeCount = 4;
  const activeNode = Math.min(c.activeStep, nodeCount);
  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          fontSize: c.fontSize,
          fontWeight: c.fontWeight,
          color: c.labelColor,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Verification
      </p>
      <div style={{ display: "flex", alignItems: "center" }}>
        {Array.from({ length: nodeCount }).map((_, i) => {
          const nodeNum = i + 1;
          const isActive = nodeNum <= activeNode;
          const borderColor = isActive
            ? c.verificationNodeBorderColor
            : c.trackColor;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  width: c.stepDotSize + 8,
                  height: c.stepDotSize + 8,
                  borderRadius: "50%",
                  background: c.verificationNodeBackground,
                  border: `3px solid ${borderColor}`,
                  flexShrink: 0,
                  zIndex: 1,
                  boxShadow: isActive
                    ? `0 0 0 3px ${hex2rgba(borderColor, 0.2)}`
                    : undefined,
                  transition: "border-color 0.2s",
                }}
              />
              {i < nodeCount - 1 &&
                (() => {
                  const segFilled = nodeNum < activeNode;
                  const segPartial = nodeNum === activeNode;
                  const fillStyle = c.showStripes
                    ? {
                        ...stripesStyle(c.stripeColor),
                        background: c.accentColor,
                      }
                    : { background: c.accentColor };
                  return (
                    <div
                      style={{
                        flex: 1,
                        height: c.trackHeight * 2.5,
                        background: c.trackColor,
                        margin: "0 -2px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {(segFilled || segPartial) && (
                        <div
                          style={{
                            ...fillStyle,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: segFilled ? "100%" : "40%",
                            transition: "width 0.3s",
                          }}
                        />
                      )}
                    </div>
                  );
                })()}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Preview ────────────────────────────────────────────────────────────

export function StepperPreview({ config: c }: Props) {
  return (
    <div style={{ width: "100%", maxWidth: 420, padding: "0 8px" }}>
      {c.variant === "segmented-loading" && <SegmentedLoading c={c} />}
      {c.variant === "slider-tooltip" && <SliderTooltip c={c} />}
      {c.variant === "multi-point-slider" && <MultiPointSlider c={c} />}
      {c.variant === "gradient-progress" && <GradientProgress c={c} />}
      {c.variant === "stepper-dots" && <StepperDots c={c} />}
      {c.variant === "status-stepper" && <StatusStepper c={c} />}
      {c.variant === "color-segments" && <ColorSegments c={c} />}
      {c.variant === "completeness" && <CompletenessBar c={c} />}
      {c.variant === "verification" && <VerificationTrack c={c} />}
    </div>
  );
}
