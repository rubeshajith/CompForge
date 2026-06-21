"use client";

import { useState, useMemo } from "react";
import {
  ToggleConfig,
  ToggleMode,
  toggleModePresets,
  darkToggleConfig,
} from "@/lib/toggleConfig";
import {
  generateToggleJSX,
  generateToggleCSS,
  generateToggleTSX,
  generateToggleTailwind,
} from "@/lib/generateToggleCode";
import { TogglePreview } from "@/components/playground/TogglePreview";
import { ToggleControlPanel } from "@/components/playground/ToggleControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Behavioral props preserved across mode switches
type BehavioralProps = Pick<
  ToggleConfig,
  | "variant"
  | "toggleValue"
  | "groupEnabled"
  | "groupVariant"
  | "groupMode"
  | "groupItemCount"
  | "showGroupIcons"
  | "size"
  | "borderRadius"
  | "animateToggle"
  | "animateIndicator"
>;

function getBehavioralProps(config: ToggleConfig): BehavioralProps {
  return {
    variant: config.variant,
    toggleValue: config.toggleValue,
    groupEnabled: config.groupEnabled,
    groupVariant: config.groupVariant,
    groupMode: config.groupMode,
    groupItemCount: config.groupItemCount,
    showGroupIcons: config.showGroupIcons,
    size: config.size,
    borderRadius: config.borderRadius,
    animateToggle: config.animateToggle,
    animateIndicator: config.animateIndicator,
  };
}

export default function TogglePlayground() {
  const [mode, setMode] = useState<ToggleMode>("dark");
  const [config, setConfig] = useState<ToggleConfig>(darkToggleConfig);

  function handleChange(patch: Partial<ToggleConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: ToggleMode) {
    setMode(newMode);
    setConfig({ ...toggleModePresets[newMode], ...getBehavioralProps(config) });
  }

  function handleReset() {
    setConfig({ ...toggleModePresets[mode], ...getBehavioralProps(config) });
  }

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

  const jsxCode = useMemo(() => generateToggleJSX(config), [config]);
  const cssCode = useMemo(() => generateToggleCSS(config), [config]);
  const tsxCode = useMemo(() => generateToggleTSX(config), [config]);
  const tailwindCode = useMemo(() => generateToggleTailwind(config), [config]);
  return (
    <ResizablePlayground
      componentName="Toggle & Toggle Group"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, size, group settings preserved"
      preview={<TogglePreview config={config} />}
      controls={
        <ToggleControlPanel
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
