"use client";

import { useState, useMemo } from "react";
import {
  StepperConfig,
  StepperMode,
  StepperVariant,
  stepperModePresets,
  darkStepperConfig,
} from "@/lib/stepperConfig";
import {
  generateStepperJSX,
  generateStepperCSS,
} from "@/lib/generateStepperCode";
import { StepperPreview } from "@/components/playground/StepperPreview";
import { StepperControlPanel } from "@/components/playground/StepperControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Behavioral props to preserve on mode/reset switches
type BehavioralProps = Pick<
  StepperConfig,
  | "variant"
  | "progressValue"
  | "totalSteps"
  | "activeStep"
  | "activeSegments"
  | "segmentCount"
  | "showPin"
  | "showLabels"
  | "useGradient"
  | "accentGlow"
>;

function extractBehavioral(c: StepperConfig): BehavioralProps {
  return {
    variant: c.variant,
    progressValue: c.progressValue,
    totalSteps: c.totalSteps,
    activeStep: c.activeStep,
    activeSegments: c.activeSegments,
    segmentCount: c.segmentCount,
    showPin: c.showPin,
    showLabels: c.showLabels,
    useGradient: c.useGradient,
    accentGlow: c.accentGlow,
  };
}

export default function StepperPlayground() {
  const [mode, setMode] = useState<StepperMode>("dark");
  const [config, setConfig] = useState<StepperConfig>(darkStepperConfig);

  function handleChange(patch: Partial<StepperConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: StepperMode) {
    setMode(newMode);
    setConfig({ ...stepperModePresets[newMode], ...extractBehavioral(config) });
  }

  function handleReset() {
    setConfig({ ...stepperModePresets[mode], ...extractBehavioral(config) });
  }

  const jsxCode = useMemo(() => generateStepperJSX(config), [config]);
  const cssCode = useMemo(() => generateStepperCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Steppers & Sliders"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & values preserved"
      preview={<StepperPreview config={config} />}
      controls={
        <StepperControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
