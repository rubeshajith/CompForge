// /app/playground/stepProgress/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  StepProgressConfig,
  StepProgressMode,
  stepProgressModePresets,
  darkStepProgressConfig,
} from "@/lib/stepProgressConfig";
import {
  generateStepProgressJSX,
  generateStepProgressCSS,
} from "@/lib/generateStepProgressCode";
import { StepProgressPreview } from "@/components/playground/StepProgressPreview";
import { StepProgressControlPanel } from "@/components/playground/StepProgressControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function StepProgressPlayground() {
  const [mode, setMode] = useState<StepProgressMode>("dark");
  const [config, setConfig] = useState<StepProgressConfig>(
    darkStepProgressConfig,
  );

  function handleChange(patch: Partial<StepProgressConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: StepProgressMode) {
    setMode(newMode);
    setConfig({
      ...stepProgressModePresets[newMode],
      // Preserve behavioral props
      stepCount: config.stepCount,
      orientation: config.orientation,
      nodeShape: config.nodeShape,
      labelType: config.labelType,
      connectorStyle: config.connectorStyle,
      showStepLabels: config.showStepLabels,
      animateTransitions: config.animateTransitions,
      activeGlow: config.activeGlow,
      showNodeShadow: config.showNodeShadow,
    });
  }

  function handleReset() {
    setConfig({
      ...stepProgressModePresets[mode],
      // Preserve behavioral props
      stepCount: config.stepCount,
      orientation: config.orientation,
      nodeShape: config.nodeShape,
      labelType: config.labelType,
      connectorStyle: config.connectorStyle,
      showStepLabels: config.showStepLabels,
      animateTransitions: config.animateTransitions,
      activeGlow: config.activeGlow,
      showNodeShadow: config.showNodeShadow,
    });
  }

  const jsxCode = useMemo(() => generateStepProgressJSX(config), [config]);
  const cssCode = useMemo(() => generateStepProgressCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Step Progress"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · shape, labels, steps & orientation preserved"
      preview={<StepProgressPreview config={config} />}
      controls={
        <StepProgressControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
