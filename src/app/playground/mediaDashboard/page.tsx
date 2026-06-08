"use client";

import { useMemo, useState } from "react";
import { CodePanel } from "@/components/playground/CodePanel";
import { MediaDashboardControlPanel } from "@/components/playground/MediaDashboardControlPanel";
import { MediaDashboardPreview } from "@/components/playground/MediaDashboardPreview";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  darkMediaDashboardConfig,
  mediaDashboardModePresets,
  type MediaDashboardConfig,
  type MediaDashboardMode,
} from "@/lib/mediaDashboardConfig";
import { generateMediaDashboardCSS, generateMediaDashboardJSX } from "@/lib/generateMediaDashboardCode";

export default function MediaDashboardPlayground() {
  const [mode, setMode] = useState<MediaDashboardMode>("dark");
  const [config, setConfig] = useState<MediaDashboardConfig>(darkMediaDashboardConfig);

  function handleChange(patch: Partial<MediaDashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function preservedBehavior(prev: MediaDashboardConfig) {
    return {
      density: prev.density,
      selectedRange: prev.selectedRange,
      showSidebar: prev.showSidebar,
      showTopBar: prev.showTopBar,
      showGlow: prev.showGlow,
      animateCards: prev.animateCards,
    };
  }

  function handleModeToggle(newMode: MediaDashboardMode) {
    setMode(newMode);
    setConfig((prev) => ({ ...mediaDashboardModePresets[newMode], ...preservedBehavior(prev) }));
  }

  function handleReset() {
    setConfig((prev) => ({ ...mediaDashboardModePresets[mode], ...preservedBehavior(prev) }));
  }

  const jsxCode = useMemo(() => generateMediaDashboardJSX(config), [config]);
  const cssCode = useMemo(() => generateMediaDashboardCSS(config), [config]);

  const stageStyle = mode === "light" ? {
    background: "#f4f4f8",
    backgroundImage: `
      radial-gradient(circle at 30% 40%, rgba(108,92,231,0.05) 0%, transparent 60%),
      linear-gradient(45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%),
      linear-gradient(-45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%)
    `,
    backgroundSize: "100% 100%, 24px 24px, 24px 24px",
  } : undefined;

  return (
    <ResizablePlayground
      componentName="Media Dashboard"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors - layout and behavior preserved"
      stageStyle={stageStyle}
      preview={<MediaDashboardPreview config={config} />}
      controls={<MediaDashboardControlPanel config={config} onChange={handleChange} onReset={handleReset} />}
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
