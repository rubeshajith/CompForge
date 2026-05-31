"use client";

import { useState, useMemo } from "react";
import {
  ButtonConfig,
  ButtonMode,
  buttonModePresets,
  darkButtonConfig,
} from "@/lib/buttonConfig";
import { generateButtonJSX, generateButtonCSS } from "@/lib/generateButtonCode";
import { ButtonPreview } from "@/components/playground/ButtonPreview";
import { ButtonControlPanel } from "@/components/playground/ButtonControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Behavioral props preserved across mode switches
type BehavioralProps = Pick<
  ButtonConfig,
  | "variant"
  | "size"
  | "radius"
  | "groupEnabled"
  | "groupOrientation"
  | "groupItemCount"
  | "loading"
  | "disabled"
  | "iconLeft"
  | "iconRight"
  | "animateHover"
  | "showRipple"
  | "fontWeight"
  | "letterSpacing"
>;

function getBehavioralProps(config: ButtonConfig): BehavioralProps {
  return {
    variant: config.variant,
    size: config.size,
    radius: config.radius,
    groupEnabled: config.groupEnabled,
    groupOrientation: config.groupOrientation,
    groupItemCount: config.groupItemCount,
    loading: config.loading,
    disabled: config.disabled,
    iconLeft: config.iconLeft,
    iconRight: config.iconRight,
    animateHover: config.animateHover,
    showRipple: config.showRipple,
    fontWeight: config.fontWeight,
    letterSpacing: config.letterSpacing,
  };
}

export default function ButtonPlayground() {
  const [mode, setMode] = useState<ButtonMode>("dark");
  const [config, setConfig] = useState<ButtonConfig>(darkButtonConfig);

  function handleChange(patch: Partial<ButtonConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: ButtonMode) {
    setMode(newMode);
    setConfig({ ...buttonModePresets[newMode], ...getBehavioralProps(config) });
  }

  function handleReset() {
    setConfig({ ...buttonModePresets[mode], ...getBehavioralProps(config) });
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

  const jsxCode = useMemo(() => generateButtonJSX(config), [config]);
  const cssCode = useMemo(() => generateButtonCSS(config), [config]);

  return (
    <ResizablePlayground
      componentName="Button & Button Group"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, size, states preserved"
      preview={<ButtonPreview config={config} />}
      controls={
        <ButtonControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
