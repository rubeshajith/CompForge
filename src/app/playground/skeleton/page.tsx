"use client";

import { useState, useMemo } from "react";
import {
  SkeletonConfig,
  SkeletonMode,
  skeletonModePresets,
  darkSkeletonConfig,
} from "@/lib/skeletonConfig";
import {
  generateSkeletonJSX,
  generateSkeletonCSS,
} from "@/lib/generateSkeletonCode";
import { SkeletonPreview } from "@/components/playground/SkeletonPreview";
import { SkeletonControlPanel } from "@/components/playground/SkeletonControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function SkeletonPlayground() {
  const [mode, setMode] = useState<SkeletonMode>("dark");
  const [config, setConfig] = useState<SkeletonConfig>(darkSkeletonConfig);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  function handleChange(patch: Partial<SkeletonConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: SkeletonMode) {
    setMode(newMode);
    // Preserve boxes when switching theme — user's layout is behavioural
    setConfig({ ...skeletonModePresets[newMode], boxes: config.boxes });
  }

  function handleReset() {
    setConfig({ ...skeletonModePresets[mode], boxes: config.boxes });
  }

  const jsxCode = useMemo(() => generateSkeletonJSX(config), [config]);
  const cssCode = useMemo(() => generateSkeletonCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(#d4d4e022 1px, transparent 1px),
            linear-gradient(90deg, #d4d4e022 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Skeleton Loader"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · boxes preserved"
      preview={
        <SkeletonPreview
          config={config}
          onChange={handleChange}
          selectedBoxId={selectedBoxId}
          onSelectBox={setSelectedBoxId}
        />
      }
      controls={
        <SkeletonControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
          selectedBoxId={selectedBoxId}
          onSelectBox={setSelectedBoxId}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
