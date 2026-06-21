"use client";

// /app/playground/stepper/page.tsx

import { useState, useMemo } from "react";
import {
  StepperConfig,
  StepperMode,
  stepperModePresets,
  darkStepperConfig,
} from "@/lib/stepper2Config";
import {
  generateStepperJSX,
  generateStepperCSS,
  generateStepperTSX,
  generateStepperTailwind,
} from "@/lib/generateStepper2Code";
import { StepperPreview } from "@/components/playground/Stepper2Preview";
import { StepperControlPanel } from "@/components/playground/Stepper2ControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Behavioral props to preserve across mode switches
type BehavioralProps = Pick<
  StepperConfig,
  | "variant"
  | "activeStep"
  | "totalSteps"
  | "step1Label"
  | "step2Label"
  | "step3Label"
  | "step4Label"
  | "showLabels"
  | "showNumbers"
  | "showCheckmarks"
  | "animateDots"
>;

function pickBehavioral(c: StepperConfig): BehavioralProps {
  return {
    variant: c.variant,
    activeStep: c.activeStep,
    totalSteps: c.totalSteps,
    step1Label: c.step1Label,
    step2Label: c.step2Label,
    step3Label: c.step3Label,
    step4Label: c.step4Label,
    showLabels: c.showLabels,
    showNumbers: c.showNumbers,
    showCheckmarks: c.showCheckmarks,
    animateDots: c.animateDots,
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
    setConfig({ ...stepperModePresets[newMode], ...pickBehavioral(config) });
  }

  function handleReset() {
    setConfig({ ...stepperModePresets[mode], ...pickBehavioral(config) });
  }

  const jsxCode = useMemo(() => generateStepperJSX(config), [config]);
  const cssCode = useMemo(() => generateStepperCSS(config), [config]);
  const tsxCode = useMemo(() => generateStepperTSX(config), [config]);
  const tailwindCode = useMemo(() => generateStepperTailwind(config), [config]);
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(to right, #d4d4e0 1px, transparent 1px),
            linear-gradient(to bottom, #d4d4e0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Stepper"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & labels preserved"
      preview={<StepperPreview config={config} />}
      controls={
        <StepperControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
          isDark={mode === "dark"}
        />
      }
      code={
        <CodePanel
          jsx={jsxCode}
          css={cssCode}
          tsx={tsxCode}
          tailwind={tailwindCode}
        />
      }
    />
  );
}
