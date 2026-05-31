"use client";

import { useState, useMemo } from "react";
import {
  ProgressConfig,
  ProgressMode,
  progressModePresets,
  darkProgressConfig,
} from "@/lib/progressConfig";
import {
  generateProgressJSX,
  generateProgressCSS,
} from "@/lib/generateProgressCode";
import { ProgressPreview } from "@/components/playground/ProgressPreview";
import { ProgressControlPanel } from "@/components/playground/ProgressControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function ProgressPlayground() {
  const [mode, setMode] = useState<ProgressMode>("dark");
  const [config, setConfig] = useState<ProgressConfig>(darkProgressConfig);

  function handleChange(patch: Partial<ProgressConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: ProgressMode) {
    setMode(newMode);
    // Preserve behavioral props that shouldn't reset on theme switch
    setConfig({
      ...progressModePresets[newMode],
      variant: config.variant,
      value: config.value,
      showLabel: config.showLabel,
      showValue: config.showValue,
      animated: config.animated,
    });
  }

  function handleReset() {
    setConfig({
      ...progressModePresets[mode],
      variant: config.variant,
      value: config.value,
      animated: config.animated,
    });
  }

  const jsxCode = useMemo(() => generateProgressJSX(config), [config]);
  const cssCode = useMemo(() => generateProgressCSS(config), [config]);

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
      componentName="Progress Indicators"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant + value + animation preserved"
      preview={<ProgressPreview config={config} />}
      controls={
        <ProgressControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
