"use client";

import { useState, useMemo } from "react";
import {
  PopoverConfig,
  PopoverMode,
  popoverModePresets,
  darkPopoverConfig,
} from "@/lib/popOverConfig";
import {
  generatePopoverJSX,
  generatePopoverCSS,
  generatePopoverTSX,
  generatePopoverTailwind,
} from "@/lib/generatePopOverCode";

import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import { DEFAULT_VARIANT, PopoverVariantId } from "@/lib/popOverVariants";
import { PopoverControlPanel } from "@/components/playground/PopOverControlPanel";
import { PopoverPreview } from "@/components/playground/PopOverPreview";

// Behavioral props that survive a theme switch
const PRESERVED_KEYS: (keyof PopoverConfig)[] = [
  "statusProgress",
  "statusModelName",
  "statusLoss",
  "statusAccuracy",
  "statusEpoch",
  "statusAnimatePulse",
  "dtModels",
  "dtShowStats",
  "userInitial",
  "userName",
  "userRole",
  "userStat1Label",
  "userStat1Value",
  "userStat2Label",
  "userStat2Value",
  "userStat3Label",
  "userStat3Value",
  "menuShowExport",
  "menuExportFormats",
  "menuDangerLabel",
  "menuItemBorderRadius",
  "notifications",
  "notifShowDot",
  "commands",
  "cmdShowKbd",
  "cmdAccentOnHover",
  "tokSystemCount",
  "tokPromptCount",
  "tokCompletionCount",
  "tokModelName",
  "tokAnimateBars",
  "basicHeading",
  "basicDescription",
  "borderRadius",
];

function pickPreserved(config: PopoverConfig): Partial<PopoverConfig> {
  return Object.fromEntries(
    PRESERVED_KEYS.map((k) => [k, config[k]]),
  ) as Partial<PopoverConfig>;
}

export default function PopoverPlayground() {
  const [mode, setMode] = useState<PopoverMode>("dark");
  const [config, setConfig] = useState<PopoverConfig>(darkPopoverConfig);
  const [selectedVariant, setSelectedVariant] =
    useState<PopoverVariantId>(DEFAULT_VARIANT);

  function handleChange(patch: Partial<PopoverConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: PopoverMode) {
    setMode(newMode);
    setConfig({ ...popoverModePresets[newMode], ...pickPreserved(config) });
  }

  function handleReset() {
    setConfig({ ...popoverModePresets[mode], ...pickPreserved(config) });
  }

  const jsxCode = useMemo(
    () => generatePopoverJSX(config, selectedVariant),
    [config, selectedVariant],
  );
  const cssCode = useMemo(
    () => generatePopoverCSS(config, selectedVariant),
    [config, selectedVariant],
  );
  const tsxCode = useMemo(
    () => generatePopoverTSX(config, selectedVariant),
    [config, selectedVariant],
  );
  const tailwindCode = useMemo(
    () => generatePopoverTailwind(config, selectedVariant),
    [config, selectedVariant],
  );
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
      componentName="AI Popovers"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · content & behavior preserved"
      preview={
        <PopoverPreview config={config} selectedVariant={selectedVariant} />
      }
      controls={
        <PopoverControlPanel
          config={config}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
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
