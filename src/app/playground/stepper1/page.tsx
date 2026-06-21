"use client";

import { useState, useMemo } from "react";
import {
  StepperConfig,
  StepperMode,
  stepperModePresets,
  darkStepperConfig,
} from "@/lib/stepper1Config";
import {
  generateStepperJSX,
  generateStepperCSS,
  generateStepperTSX,
  generateStepperTailwind,
} from "@/lib/generateStepper1Code";
import { StepperPreview } from "@/components/playground/Stepper1Preview";
import { StepperControlPanel } from "@/components/playground/Stepper1ControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function StepperPlayground() {
  const [mode, setMode] = useState<StepperMode>("dark");
  const [config, setConfig] = useState<StepperConfig>(darkStepperConfig);

  function handleChange(patch: Partial<StepperConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: StepperMode) {
    setMode(newMode);
    // Preserve behavioral / structural props across theme switch
    setConfig({
      ...stepperModePresets[newMode],
      variant: config.variant,
      stepCount: config.stepCount,
      activeStep: config.activeStep,
      segmentCount: config.segmentCount,
      fillPercent: config.fillPercent,
      showStepLabels: config.showStepLabels,
      showTooltip: config.showTooltip,
      showStripes: config.showStripes,
    });
  }

  function handleReset() {
    setConfig({
      ...stepperModePresets[mode],
      variant: config.variant,
      stepCount: config.stepCount,
      activeStep: config.activeStep,
      segmentCount: config.segmentCount,
      fillPercent: config.fillPercent,
      showStepLabels: config.showStepLabels,
      showTooltip: config.showTooltip,
      showStripes: config.showStripes,
    });
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
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Steppers & Sliders"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, steps & fill preserved"
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
