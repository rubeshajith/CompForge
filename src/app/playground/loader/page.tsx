"use client";

import { useState, useMemo } from "react";
import {
  LoaderConfig,
  LoaderMode,
  loaderModePresets,
  darkLoaderConfig,
} from "@/lib/loaderConfig";
import {
  generateLoaderJSX,
  generateLoaderCSS,
  generateLoaderTailwind,
  generateLoaderTSX,
} from "@/lib/generateLoaderCode";
import { LoaderPreview } from "@/components/playground/LoaderPreview";
import { LoaderControlPanel } from "@/components/playground/LoaderControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function LoaderPlayground() {
  const [mode, setMode] = useState<LoaderMode>("dark");
  const [config, setConfig] = useState<LoaderConfig>(darkLoaderConfig);

  function handleChange(patch: Partial<LoaderConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: LoaderMode) {
    setMode(newMode);
    setConfig({
      ...loaderModePresets[newMode],
      // preserve behavioral props across theme switch
      variant: config.variant,
      size: config.size,
      speed: config.speed,
      strokeWidth: config.strokeWidth,
      showLabel: config.showLabel,
      labelText: config.labelText,
    });
  }

  function handleReset() {
    setConfig({
      ...loaderModePresets[mode],
      // preserve behavioral props on reset
      variant: config.variant,
      size: config.size,
      speed: config.speed,
      strokeWidth: config.strokeWidth,
      showLabel: config.showLabel,
      labelText: config.labelText,
    });
  }

  const jsxCode = useMemo(() => generateLoaderJSX(config), [config]);
  const cssCode = useMemo(() => generateLoaderCSS(config), [config]);
  const tsxCode = useMemo(() => generateLoaderTSX(config), [config]);
  const tailwindCode = useMemo(() => generateLoaderTailwind(config), [config]);
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="CSS Loader"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, size & speed preserved"
      preview={<LoaderPreview config={config} />}
      controls={
        <LoaderControlPanel
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
