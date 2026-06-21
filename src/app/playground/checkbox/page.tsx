"use client";

import { useState, useMemo } from "react";
import {
  CheckboxConfig,
  CheckboxMode,
  checkboxModePresets,
  darkCheckboxConfig,
} from "@/lib/checkboxConfig";
import {
  generateCheckboxJSX,
  generateCheckboxCSS,
  generateCheckboxTSX,
  generateCheckboxTailwind,
} from "@/lib/generateCheckboxCode";
import { CheckboxPreview } from "@/components/playground/CheckboxPreview";
import { CheckboxControlPanel } from "@/components/playground/CheckboxControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function CheckboxPlayground() {
  const [mode, setMode] = useState<CheckboxMode>("dark");
  const [config, setConfig] = useState<CheckboxConfig>(darkCheckboxConfig);

  function handleChange(patch: Partial<CheckboxConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: CheckboxMode) {
    setMode(newMode);
    // Preserve variant + geometry + label visibility when switching theme
    setConfig({
      ...checkboxModePresets[newMode],
      variant: config.variant,
      size: config.size,
      borderRadius: config.borderRadius,
      uncheckedBorderWidth: config.uncheckedBorderWidth,
      showLabels: config.showLabels,
      itemGap: config.itemGap,
      labelGap: config.labelGap,
      labelFontSize: config.labelFontSize,
    });
  }

  function handleReset() {
    setConfig({
      ...checkboxModePresets[mode],
      variant: config.variant,
    });
  }

  const jsxCode = useMemo(() => generateCheckboxJSX(config), [config]);
  const cssCode = useMemo(() => generateCheckboxCSS(config), [config]);
  const tsxCode = useMemo(() => generateCheckboxTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateCheckboxTailwind(config),
    [config],
  );
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Checkbox"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & geometry preserved"
      preview={<CheckboxPreview config={config} />}
      controls={
        <CheckboxControlPanel
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
