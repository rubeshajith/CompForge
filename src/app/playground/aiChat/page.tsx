"use client";

// /app/playground/aiChat/page.tsx

import { useState, useMemo } from "react";
import {
  AIChatConfig,
  AIChatMode,
  aiChatModePresets,
  darkAIChatConfig,
} from "@/lib/aiChatConfig";
import { generateAIChatJSX, generateAIChatCSS } from "@/lib/generateAiChatCode";
import { AIChatPreview } from "@/components/playground/AiChatPreview";
import { AIChatControlPanel } from "@/components/playground/AiChatControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function AIChatPlayground() {
  const [mode, setMode] = useState<AIChatMode>("dark");
  const [config, setConfig] = useState<AIChatConfig>(darkAIChatConfig);

  function handleChange(patch: Partial<AIChatConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: AIChatMode) {
    setMode(newMode);
    // Preserve behavioral props that shouldn't reset on theme switch
    setConfig({
      ...aiChatModePresets[newMode],
      bubbleStyle: config.bubbleStyle,
      typingStyle: config.typingStyle,
      animateMessages: config.animateMessages,
      showTimestamps: config.showTimestamps,
      containerWidth: config.containerWidth,
      containerHeight: config.containerHeight,
    });
  }

  function handleReset() {
    setConfig({
      ...aiChatModePresets[mode],
      bubbleStyle: config.bubbleStyle,
      typingStyle: config.typingStyle,
      animateMessages: config.animateMessages,
      showTimestamps: config.showTimestamps,
      containerWidth: config.containerWidth,
      containerHeight: config.containerHeight,
    });
  }

  const jsxCode = useMemo(() => generateAIChatJSX(config), [config]);
  const cssCode = useMemo(() => generateAIChatCSS(config), [config]);

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
      componentName="AI Chat"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · bubble style, typing style, size & toggles preserved"
      preview={<AIChatPreview config={config} />}
      controls={
        <AIChatControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
