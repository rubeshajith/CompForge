"use client";

// /app/playground/imageCarousel/page.tsx

import { useState, useMemo } from "react";
import {
  ImageCarouselConfig,
  ImageCarouselMode,
  imageCarouselModePresets,
  darkImageCarouselConfig,
} from "@/lib/imageCarouselConfig";
import {
  generateImageCarouselJSX,
  generateImageCarouselCSS,
  generateImageCarouselTSX,
  generateImageCarouselTailwind,
} from "@/lib/generateImageCarouselCode";
import { ImageCarouselPreview } from "@/components/playground/ImageCarouselPreview";
import { ImageCarouselControlPanel } from "@/components/playground/ImageCarouselControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function ImageCarouselPlayground() {
  const [mode, setMode] = useState<ImageCarouselMode>("dark");
  const [config, setConfig] = useState<ImageCarouselConfig>(
    darkImageCarouselConfig,
  );

  function handleChange(patch: Partial<ImageCarouselConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: ImageCarouselMode) {
    setMode(newMode);
    // Preserve behavioral props that shouldn't reset on theme switch
    setConfig({
      ...imageCarouselModePresets[newMode],
      showZoom: config.showZoom,
      zoomFactor: config.zoomFactor,
      images: config.images,
    });
  }

  function handleReset() {
    setConfig({
      ...imageCarouselModePresets[mode],
      showZoom: config.showZoom,
      zoomFactor: config.zoomFactor,
      images: config.images,
    });
  }

  const jsxCode = useMemo(() => generateImageCarouselJSX(config), [config]);
  const cssCode = useMemo(() => generateImageCarouselCSS(config), [config]);
  const tsxCode = useMemo(() => generateImageCarouselTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateImageCarouselTailwind(config),
    [config],
  );
  // Light-mode stage: clean grid background
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
      componentName="Image Carousel"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · zoom & images preserved"
      preview={<ImageCarouselPreview config={config} />}
      controls={
        <ImageCarouselControlPanel
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
