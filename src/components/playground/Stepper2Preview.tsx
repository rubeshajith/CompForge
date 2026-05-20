"use client";

// /components/playground/StepperPreview.tsx

import { StepperConfig } from "@/lib/stepper2Config";

interface StepperPreviewProps {
  config: StepperConfig;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function CheckIcon({
  size = 12,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Clip-path helpers for chevrons
const chevronClip = {
  first:
    "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)",
  middle:
    "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%)",
  last: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 14px 50%)",
  sharpFirst:
    "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)",
  sharpMiddle:
    "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%)",
};

// ─── Variant renderers ───────────────────────────────────────────────────────

function SegmentedPill({ config }: { config: StepperConfig }) {
  const {
    height,
    borderRadius,
    fontSize,
    stepTextColor,
    color1,
    color2,
    color3,
    color4,
  } = config;
  const colors = [color1, color2, color3, color4];
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, config.totalSteps);

  return (
    <div
      style={{
        display: "flex",
        height,
        width: "100%",
        borderRadius,
        overflow: "hidden",
      }}
    >
      {steps.map((label, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: colors[i] || color4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize,
            fontWeight: 700,
            color: stepTextColor,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {config.showNumbers ? `STEP ${i + 1}` : label}
        </div>
      ))}
    </div>
  );
}

function BreadcrumbGray({ config }: { config: StepperConfig }) {
  const {
    height,
    fontSize,
    activeColor,
    activeTextColor,
    inactiveColor,
    inactiveTextColor,
  } = config;
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, config.totalSteps);

  return (
    <div style={{ display: "flex", height, width: "100%" }}>
      {steps.map((label, i) => {
        const isActive = i + 1 === config.activeStep;
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;
        const clip = isFirst
          ? chevronClip.first
          : isLast
            ? chevronClip.last
            : chevronClip.middle;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              background: isActive ? activeColor : inactiveColor,
              color: isActive ? activeTextColor : inactiveTextColor,
              clipPath: clip,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginLeft: i > 0 ? -12 : 0,
              zIndex: isActive ? 10 : steps.length - i,
              borderRadius: isFirst
                ? `${config.borderRadius}px 0 0 ${config.borderRadius}px`
                : isLast
                  ? `0 ${config.borderRadius}px ${config.borderRadius}px 0`
                  : 0,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

function BreadcrumbColorful({ config }: { config: StepperConfig }) {
  const { height, fontSize, stepTextColor, color1, color2, color3, color4 } =
    config;
  const colors = [color1, color2, color3, color4];
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, config.totalSteps);

  return (
    <div
      style={{
        display: "flex",
        height,
        width: "100%",
        overflow: "hidden",
        borderRadius: config.borderRadius,
      }}
    >
      {steps.map((label, i) => {
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;
        const clip = isFirst
          ? chevronClip.first
          : isLast
            ? chevronClip.last
            : chevronClip.middle;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              background: colors[i] || color4,
              color: stepTextColor,
              clipPath: clip,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginLeft: i > 0 ? -12 : 0,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

function NumberedLine({ config }: { config: StepperConfig }) {
  const {
    color1,
    color2,
    color3,
    color4,
    inactiveColor,
    inactiveTextColor,
    activeStep,
    totalSteps,
    showLabels,
    labelColor,
    connectorHeight,
  } = config;
  const stepColors = [color1, color2, color3, color4];
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, totalSteps);
  const progressPct = ((activeStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2px",
        }}
      >
        {/* Track */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: connectorHeight,
            background: inactiveColor,
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        {/* Progress fill */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${progressPct}%`,
            height: connectorHeight,
            background: color3,
            transform: "translateY(-50%)",
            zIndex: 0,
            transition: "width 0.3s ease",
          }}
        />
        {steps.map((_, i) => {
          const done = i + 1 < activeStep;
          const active = i + 1 === activeStep;
          const bg = done || active ? stepColors[i] || color3 : inactiveColor;
          const textColor = done || active ? "#fff" : inactiveTextColor;
          return (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: bg,
                color: textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                zIndex: 1,
                outline: "4px solid var(--bg-3, #1c1c22)",
                position: "relative",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {steps.map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: labelColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckmarkHorizontal({ config }: { config: StepperConfig }) {
  const {
    completedColor,
    completedTextColor,
    inactiveColor,
    inactiveTextColor,
    activeStep,
    totalSteps,
    showLabels,
    showCheckmarks,
    labelColor,
    connectorHeight,
  } = config;
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, totalSteps);
  const progressPct = ((activeStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: connectorHeight,
            background: inactiveColor,
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${progressPct}%`,
            height: connectorHeight,
            background: completedColor,
            transform: "translateY(-50%)",
            zIndex: 0,
            transition: "width 0.3s ease",
          }}
        />
        {steps.map((_, i) => {
          const done = i + 1 < activeStep;
          const active = i + 1 === activeStep;
          const bg = done
            ? completedColor
            : active
              ? config.activeColor
              : "transparent";
          const border =
            !done && !active ? `2px solid ${inactiveColor}` : "none";
          return (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: bg,
                border,
                color: done
                  ? completedTextColor
                  : active
                    ? config.activeTextColor
                    : inactiveTextColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                zIndex: 1,
                outline: "3px solid var(--bg-3, #1c1c22)",
                position: "relative",
              }}
            >
              {done && showCheckmarks ? (
                <CheckIcon size={11} color={completedTextColor} />
              ) : (
                i + 1
              )}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            padding: "0 2px",
          }}
        >
          {steps.map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: labelColor,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronLoading({ config }: { config: StepperConfig }) {
  const { color1, color2, color3, inactiveColor, activeStep, totalSteps } =
    config;
  const total = 11;
  const filled = Math.round((activeStep / totalSteps) * total);
  const fillColors = [color1, color2, color3];

  const chevronStyle = {
    clipPath: "polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)",
  } as React.CSSProperties;

  return (
    <div>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          const colorIndex = Math.floor((i / filled) * fillColors.length);
          const bg = isFilled
            ? fillColors[Math.min(colorIndex, fillColors.length - 1)] || color3
            : inactiveColor;
          return (
            <div
              key={i}
              style={{
                width: 16,
                height: 24,
                background: bg,
                ...chevronStyle,
                transition: "background 0.2s",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: config.labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginTop: 6,
        }}
      >
        Loading…
      </div>
    </div>
  );
}

function DotLoading({ config }: { config: StepperConfig }) {
  const { completedColor, inactiveColor, activeStep, totalSteps } = config;
  const total = 10;
  const filled = Math.round((activeStep / totalSteps) * total);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          const fadeSteps = 3;
          const fromFade = filled - fadeSteps;
          const opacity = isFilled
            ? i >= fromFade
              ? 0.4 + 0.6 * ((i - fromFade) / fadeSteps)
              : 1
            : 0.3;
          const size = isFilled
            ? i >= fromFade
              ? 8 + 4 * ((total - filled + i - fromFade + 1) / fadeSteps)
              : 12
            : 8;
          return (
            <div
              key={i}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: isFilled ? completedColor : inactiveColor,
                opacity,
                transition: "all 0.2s",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: config.labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginTop: 8,
        }}
      >
        Loading…
      </div>
    </div>
  );
}

function SharpChevron({ config }: { config: StepperConfig }) {
  const { color1, color2, color3, color4, stepTextColor, height, fontSize } =
    config;
  const colors = [color1, color2, color3, color4];
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, config.totalSteps);

  return (
    <div style={{ display: "flex", height, width: "100%" }}>
      {steps.map((label, i) => {
        const isFirst = i === 0;
        const clip = isFirst ? chevronClip.sharpFirst : chevronClip.sharpMiddle;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              background: colors[i] || color4,
              color: stepTextColor,
              clipPath: clip,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginLeft: i > 0 ? -8 : 0,
            }}
          >
            {config.showNumbers ? `Step ${i + 1}` : label}
          </div>
        );
      })}
    </div>
  );
}

function DashedConfirmation({ config }: { config: StepperConfig }) {
  const {
    completedColor,
    completedTextColor,
    activeColor,
    activeTextColor,
    inactiveColor,
    inactiveTextColor,
    activeStep,
    totalSteps,
    showLabels,
    showCheckmarks,
    labelColor,
    connectorHeight,
  } = config;
  const labels = [
    config.step1Label,
    config.step2Label,
    config.step3Label,
    config.step4Label,
  ];
  const steps = labels.slice(0, totalSteps);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: connectorHeight,
            borderTop: `1px dashed ${inactiveTextColor}`,
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        {steps.map((_, i) => {
          const done = i + 1 < activeStep;
          const active = i + 1 === activeStep;
          const bg = done
            ? completedColor
            : active
              ? activeColor
              : "transparent";
          const border =
            !done && !active ? `1px solid ${inactiveColor}` : "none";
          return (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: bg,
                border,
                color: done
                  ? completedTextColor
                  : active
                    ? activeTextColor
                    : inactiveTextColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                zIndex: 1,
                outline: "3px solid var(--bg-3, #1c1c22)",
                position: "relative",
              }}
            >
              {done && showCheckmarks ? (
                <CheckIcon size={11} color={completedTextColor} />
              ) : (
                i + 1
              )}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            padding: "0 2px",
          }}
        >
          {steps.map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: labelColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Preview ────────────────────────────────────────────────────────────

export function StepperPreview({ config }: StepperPreviewProps) {
  const wrapStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 480,
    padding: "0 4px",
  };

  function renderVariant() {
    switch (config.variant) {
      case "segmented-pill":
        return <SegmentedPill config={config} />;
      case "breadcrumb-gray":
        return <BreadcrumbGray config={config} />;
      case "breadcrumb-colorful":
        return <BreadcrumbColorful config={config} />;
      case "numbered-line":
        return <NumberedLine config={config} />;
      case "checkmark-horizontal":
        return <CheckmarkHorizontal config={config} />;
      case "chevron-loading":
        return <ChevronLoading config={config} />;
      case "dot-loading":
        return <DotLoading config={config} />;
      case "sharp-chevron":
        return <SharpChevron config={config} />;
      case "dashed-confirmation":
        return <DashedConfirmation config={config} />;
      default:
        return null;
    }
  }

  return <div style={wrapStyle}>{renderVariant()}</div>;
}
