"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MultiSelectConfig,
  MultiSelectMode,
  multiSelectModePresets,
  darkMultiSelectConfig,
} from "@/lib/multiSelectConfig";

import { MultiSelectControlPanel } from "@/components/playground/MultiSelectControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";

import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import { MultiSelectPreview } from "@/components/playground/MultiselectPreview";
import {
  generateMultiSelectCSS,
  generateMultiSelectJSX,
  generateMultiSelectTailwind,
  generateMultiSelectTSX,
} from "@/lib/generateMultiSelectCode";

export default function MultiSelectPlayground() {
  const [mode, setMode] = useState<MultiSelectMode>("dark");
  const [config, setConfig] = useState<MultiSelectConfig>(
    darkMultiSelectConfig,
  );

  function handleChange(patch: Partial<MultiSelectConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: MultiSelectMode) {
    setMode(newMode);
    setConfig(multiSelectModePresets[newMode]);
  }

  function handleReset() {
    setConfig(multiSelectModePresets[mode]);
  }

  const jsxCode = useMemo(() => generateMultiSelectJSX(config), [config]);
  const cssCode = useMemo(() => generateMultiSelectCSS(config), [config]);
  const tsxCode = useMemo(() => generateMultiSelectTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateMultiSelectTailwind(config),
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
      componentName="Multi Select"
      mode={mode}
      onModeToggle={handleModeToggle}
      preview={<MultiSelectPreview config={config} />}
      controls={
        <MultiSelectControlPanel
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
