"use client";

// /app/playground/filterModal/page.tsx

import { useState, useMemo } from "react";
import {
  FilterModalConfig,
  FilterModalMode,
  filterModalModePresets,
  darkFilterModalConfig,
} from "@/lib/filterModalConfig";
import {
  generateFilterModalJSX,
  generateFilterModalCSS,
} from "@/lib/generateFilterModalCode";
import { FilterModalPreview } from "@/components/playground/FilterModalPreview";
import { FilterModalControlPanel } from "@/components/playground/FilterModalControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import { FeedbackModalControlPanel } from "@/components/playground/FeedbackModalControlPanel";
import {
  darkFeedbackModalConfig,
  FeedbackModalMode,
  dark,
  FeedbackModalModeFeedbackModalConfig,
  feedbackModalModePresets,
} from "@/lib/feedbackModalConfig";
import { FeedbackModalConfig } from "@/lib/feedbackModalConfig";
import { generateFeedbackModalCSS } from "@/lib/generateFeedbackModalCode";
import { generateFeedbackModalJSX } from "@/lib/generateFeedbackModalCode";
import { FeedbackModalPreview } from "@/components/playground/FeedbackModalPreview";

export default function FeedbackModalPlayground() {
  const [mode, setMode] = useState<FeedbackModalMode>("dark");
  const [config, setConfig] = useState<FeedbackModalConfig>(
    darkFeedbackModalConfig,
  );

  function handleChange(patch: Partial<FeedbackModalConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: FeedbackModalMode) {
    setMode(newMode);
    // Preserve behavioral / state props across theme switch
    setConfig({
      ...feedbackModalModePresets[newMode],
    });
  }

  function handleReset() {
    setConfig({
      ...feedbackModalModePresets[mode],
    });
  }

  const jsxCode = useMemo(() => generateFeedbackModalJSX(config), [config]);
  const cssCode = useMemo(() => generateFeedbackModalCSS(config), [config]);

  // Light mode stage: subtle grid
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
      componentName="Feedback Modal"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · filters & sort preserved"
      preview={<FeedbackModalPreview config={config} />}
      controls={
        <FeedbackModalControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
