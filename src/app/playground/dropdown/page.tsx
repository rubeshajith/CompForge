"use client";

import { useState, useMemo } from "react";

import {
  DropdownConfig,
  DropdownMode,
  modePresets,
  darkDropdownConfig,
} from "@/lib/dropdownConfig";
import {
  generateDropdownJSX,
  generateDropdownCSS,
  generateDropdownTSX,
  generateDropdownTailwind,
} from "@/lib/generateDropdownCode";
import { DropdownPreview } from "@/components/playground/DropdownPreview";
import { ControlPanel } from "@/components/playground/ControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";

import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function DropdownPlayground() {
  const [mode, setMode] = useState<DropdownMode>("dark");
  const [config, setConfig] = useState<DropdownConfig>(darkDropdownConfig);

  function handleChange(patch: Partial<DropdownConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  // Switching mode resets config to that mode's preset
  function handleModeToggle(newMode: DropdownMode) {
    setMode(newMode);
    setConfig(modePresets[newMode]);
  }

  // Reset goes back to current mode's preset (not always dark)
  function handleReset() {
    setConfig(modePresets[mode]);
  }

  const jsxCode = useMemo(() => generateDropdownJSX(config), [config]);
  const cssCode = useMemo(() => generateDropdownCSS(config), [config]);
  const tsxCode = useMemo(() => generateDropdownTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateDropdownTailwind(config),
    [config],
  );
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(108,92,231,0.05) 0%, transparent 60%),
            linear-gradient(45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%),
            linear-gradient(-45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Dropdown"
      mode={mode}
      onModeToggle={handleModeToggle}
      preview={<DropdownPreview config={config} />}
      controls={
        <ControlPanel
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
