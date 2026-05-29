"use client";

import { useState, useMemo } from "react";
import {
  EmojiConfig,
  EmojiMode,
  emojiModePresets,
  darkEmojiConfig,
} from "@/lib/emojiConfig";
import { generateEmojiJSX, generateEmojiCSS } from "@/lib/generateEmojiCode";
import { EmojiPreview } from "@/components/playground/EmojiPreview";
import { EmojiControlPanel } from "@/components/playground/EmojiControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function EmojiPlayground() {
  const [mode, setMode] = useState<EmojiMode>("dark");
  const [config, setConfig] = useState<EmojiConfig>(darkEmojiConfig);

  function handleChange(patch: Partial<EmojiConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: EmojiMode) {
    setMode(newMode);
    // Preserve behavioral props across theme switch
    setConfig({
      ...emojiModePresets[newMode],
      variant: config.variant,
      animation: config.animation,
      animationEnabled: config.animationEnabled,
      animationDuration: config.animationDuration,
      size: config.size,
    });
  }

  function handleReset() {
    setConfig({
      ...emojiModePresets[mode],
      variant: config.variant,
      animation: config.animation,
      animationEnabled: config.animationEnabled,
      animationDuration: config.animationDuration,
      size: config.size,
    });
  }

  const jsxCode = useMemo(() => generateEmojiJSX(config), [config]);
  const cssCode = useMemo(() => generateEmojiCSS(config), [config]);

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
      componentName="Animated Emoji"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, animation & size preserved"
      preview={<EmojiPreview config={config} />}
      controls={
        <EmojiControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
