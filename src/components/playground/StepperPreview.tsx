"use client";

import {
  StepperConfig,
  StepperVariant,
  STEP_LABELS,
} from "@/lib/stepperConfig";

interface StepperPreviewProps {
  config: StepperConfig;
}

// ─── Shared helpers ───────────────────────────────────────────────
function makeAccentStyle(config: StepperConfig) {
  if (config.useGradient) {
    return `linear-gradient(90deg, ${config.accentColor} 0%, ${config.accentColorSecondary} 100%)`;
  }
  return config.accentColor;
}

function makeGlow(config: StepperConfig) {
  if (!config.accentGlow) return undefined;
  return `0 0 14px ${config.accentColor}66`;
}

// ─── Variant: Progress Pin ─────────────────────────────────────────
function ProgressPinVariant({ config }: { config: StepperConfig }) {
  const accent = makeAccentStyle(config);
  const glow = makeGlow(config);
  const pct = Math.max(0, Math.min(100, config.progressValue));

  // SVG pin shape inline
  const pinSvgPink = encodeURIComponent(
    `<svg width='32' height='44' viewBox='0 0 32 44' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M16 44L32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16L16 44Z' fill='${config.pinColor}'/></svg>`,
  );

  return (
    <div
      style={{ width: "100%", padding: "48px 0 16px", position: "relative" }}
    >
      {/* Track */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: config.trackHeight,
          background: config.trackColor,
          borderRadius: 99,
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct}%`,
            background: accent,
            boxShadow: glow,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }}
        />

        {/* Pin + label */}
        <div
          style={{
            position: "absolute",
            top: -52,
            left: `${pct}%`,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Label */}
          <span
            style={{
              fontSize: config.fontSize,
              fontWeight: 700,
              color: config.activeLabelColor,
              marginBottom: 4,
              whiteSpace: "nowrap",
            }}
          >
            {pct}%
          </span>
          {/* Pin shape */}
          {config.showPin && (
            <div
              style={{
                width: 32,
                height: 44,
                backgroundImage: `url("data:image/svg+xml,${pinSvgPink}")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                paddingTop: 7,
                filter: config.accentGlow
                  ? `drop-shadow(0 4px 8px ${config.accentColor}88)`
                  : "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "white",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Variant: Multi-Step ──────────────────────────────────────────
function MultiStepVariant({ config }: { config: StepperConfig }) {
  const accent = makeAccentStyle(config);
  const glow = makeGlow(config);
  const steps = STEP_LABELS.slice(0, config.totalSteps);

  return (
    <div style={{ width: "100%", padding: "8px 8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Background line */}
        <div
          style={{
            position: "absolute",
            bottom: config.stepNodeSize / 2,
            left: 0,
            right: 0,
            height: config.trackHeight,
            background: config.trackColor,
            zIndex: 0,
          }}
        />

        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < config.activeStep;
          const isActive = stepNum === config.activeStep;
          const isPending = stepNum > config.activeStep;

          let nodeBg: string;
          if (isActive) {
            nodeBg = config.accentColor;
          } else if (isCompleted) {
            nodeBg = config.accentColorSecondary;
          } else {
            nodeBg = "transparent";
          }

          const nodeSize = config.stepNodeSize;
          const borderRadius =
            config.stepNodeBorderRadius >= 50
              ? "50%"
              : `${config.stepNodeBorderRadius}px`;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Label */}
              <span
                style={{
                  fontSize: config.fontSize,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? config.activeLabelColor : config.labelColor,
                  textAlign: "center",
                }}
              >
                {config.showLabels ? label : ""}
              </span>
              {/* Node */}
              <div
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius,
                  background: isPending ? "transparent" : accent,
                  border: isPending ? `2px solid ${config.trackColor}` : "none",
                  boxShadow:
                    isActive && config.accentGlow
                      ? `0 0 0 8px ${config.accentColor}22, ${glow}`
                      : isActive
                        ? `0 0 0 8px ${config.accentColor}22`
                        : undefined,
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Variant: Range Slider ─────────────────────────────────────────
function RangeSliderVariant({ config }: { config: StepperConfig }) {
  const accent = makeAccentStyle(config);
  const glow = makeGlow(config);
  const pct = Math.max(0, Math.min(100, config.progressValue));

  return (
    <div style={{ width: "100%", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Track + thumb */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: config.trackHeight,
            background: config.trackColor,
            borderRadius: 99,
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${pct}%`,
              background: accent,
              boxShadow: glow,
              borderRadius: 99,
            }}
          />
          {/* Thumb */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${pct}%`,
              transform: "translate(-50%, -50%)",
              width: config.thumbWidth,
              height: config.thumbHeight,
              background: config.thumbColor,
              borderRadius: config.thumbBorderRadius,
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              transition: "left 0.2s ease",
            }}
          />
        </div>
        {/* Value label */}
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: config.activeLabelColor,
            minWidth: 28,
            textAlign: "right",
          }}
        >
          {pct}
        </span>
      </div>
    </div>
  );
}

// ─── Variant: Segmented ────────────────────────────────────────────
function SegmentedVariant({ config }: { config: StepperConfig }) {
  const accent = makeAccentStyle(config);
  const glow = makeGlow(config);
  const count = Math.max(2, Math.min(8, config.segmentCount));
  const active = Math.max(0, Math.min(count, config.activeSegments));
  const fillPct = (active / count) * 100;

  return (
    <div style={{ width: "100%", padding: "8px 0" }}>
      <div
        style={{
          background: `${config.trackColor}55`,
          borderRadius: 999,
          height: 40,
          display: "flex",
          alignItems: "center",
          padding: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent fill */}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            bottom: 4,
            width: `calc(${fillPct}% - 8px)`,
            background: accent,
            borderRadius: 999,
            boxShadow: glow,
            transition: "width 0.3s ease",
            zIndex: 0,
          }}
        />
        {/* Segment labels */}
        <div
          style={{
            display: "flex",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: config.fontSize,
                fontWeight: 600,
                color: i < active ? config.activeLabelColor : config.labelColor,
              }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Variant: Dot Stepper ──────────────────────────────────────────
function DotStepperVariant({ config }: { config: StepperConfig }) {
  const accent = makeAccentStyle(config);
  const glow = makeGlow(config);
  const steps = STEP_LABELS.slice(0, config.totalSteps);

  return (
    <div style={{ width: "100%", padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Background line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: config.trackHeight,
            background: config.trackColor,
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />

        {steps.map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === config.activeStep;
          const isCompleted = stepNum < config.activeStep;

          const size = isActive ? config.dotActiveSize : config.dotInactiveSize;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: isActive
                  ? config.dotActiveSize + 8
                  : config.dotInactiveSize,
                height: isActive
                  ? config.dotActiveSize + 8
                  : config.dotInactiveSize,
                borderRadius: "50%",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                boxShadow:
                  isActive && config.accentGlow
                    ? `0 0 20px ${config.accentColor}44`
                    : undefined,
              }}
            >
              <div
                style={{
                  width: isActive ? config.dotActiveSize - 4 : size,
                  height: isActive ? config.dotActiveSize - 4 : size,
                  borderRadius: "50%",
                  background: isActive || isCompleted ? accent : "transparent",
                  border:
                    !isActive && !isCompleted
                      ? `${Math.max(2, config.dotInactiveSize * 0.25)}px solid ${config.trackColor}`
                      : "none",
                  boxShadow: isActive && glow ? glow : undefined,
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Preview ──────────────────────────────────────────────────
export function StepperPreview({ config }: StepperPreviewProps) {
  function renderVariant() {
    switch (config.variant) {
      case "progressPin":
        return <ProgressPinVariant config={config} />;
      case "multiStep":
        return <MultiStepVariant config={config} />;
      case "rangeSlider":
        return <RangeSliderVariant config={config} />;
      case "segmented":
        return <SegmentedVariant config={config} />;
      case "dotStepper":
        return <DotStepperVariant config={config} />;
    }
  }

  return (
    <div
      style={{
        background: config.backgroundColor,
        borderRadius: config.borderRadius,
        padding: "32px 40px",
        minWidth: 340,
        maxWidth: 480,
        width: "100%",
        boxShadow: config.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : undefined,
      }}
    >
      {renderVariant()}
    </div>
  );
}
