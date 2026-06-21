"use client";

import { useState, useMemo } from "react";
import {
  SystemStateConfig,
  SystemStateMode,
  systemStateModePresets,
  darkSystemStateConfig,
} from "@/lib/systemStateConfig";
import {
  generateSystemStateJSX,
  generateSystemStateCSS,
  generateSystemStateTSX,
  generateSystemStateTailwind,
} from "@/lib/generateSystemStateCode";
import { SystemStatePreview } from "@/components/playground/SystemStatePreview";
import { SystemStateControlPanel } from "@/components/playground/SystemStateControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function SystemStatePlayground() {
  const [mode, setMode] = useState<SystemStateMode>("dark");
  const [config, setConfig] = useState<SystemStateConfig>(
    darkSystemStateConfig,
  );

  function handleChange(patch: Partial<SystemStateConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: SystemStateMode) {
    setMode(newMode);
    // Preserve variant and animation when switching themes
    setConfig({
      ...systemStateModePresets[newMode],
      variant: config.variant,
      animateIn: config.animateIn,
    });
  }

  function handleReset() {
    setConfig({
      ...systemStateModePresets[mode],
      variant: config.variant,
      animateIn: config.animateIn,
    });
  }

  const jsxCode = useMemo(() => generateSystemStateJSX(config), [config]);
  const cssCode = useMemo(() => generateSystemStateCSS(config), [config]);
  const tsxCode = useMemo(() => generateSystemStateTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateSystemStateTailwind(config),
    [config],
  );
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="System State"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & animation preserved"
      preview={<SystemStatePreview config={config} />}
      controls={
        <SystemStateControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
          mode={mode}
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
