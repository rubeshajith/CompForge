// /app/playground/loader/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  LoaderConfig,
  LoaderMode,
  loaderModePresets,
  darkLoaderConfig,
} from "@/lib/customLoaderConfig";
import {
  generateLoaderJSX,
  generateLoaderCSS,
} from "@/lib/generateCustomLoaderCode";
import { LoaderPreview } from "@/components/playground/CustomLoaderPreview";
import { LoaderControlPanel } from "@/components/playground/CustomLoaderControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function LoaderPlayground() {
  const [mode, setMode] = useState<LoaderMode>("dark");
  const [config, setConfig] = useState<LoaderConfig>(darkLoaderConfig);

  // Image data URL lives at page level so it survives mode switches and resets
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  function handleChange(patch: Partial<LoaderConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: LoaderMode) {
    setMode(newMode);
    // Preserve animation + image props; only swap color/visual theme
    setConfig({
      ...loaderModePresets[newMode],
      animation: config.animation,
      animationSpeed: config.animationSpeed,
      loopDelay: config.loopDelay,
      imageSize: config.imageSize,
      imageBorderRadius: config.imageBorderRadius,
      imageOpacity: config.imageOpacity,
      tileColumns: config.tileColumns,
      tileRows: config.tileRows,
      glitchIntensity: config.glitchIntensity,
      glitchSlices: config.glitchSlices,
      revealAngle: config.revealAngle,
      revealBlur: config.revealBlur,
      scanlineCount: config.scanlineCount,
      scanlineDirection: config.scanlineDirection,
      dissolveParticleSize: config.dissolveParticleSize,
      shatterPieces: config.shatterPieces,
      showLabel: config.showLabel,
      labelText: config.labelText,
      showGlow: config.showGlow,
    });
  }

  function handleReset() {
    setConfig({
      ...loaderModePresets[mode],
      animation: config.animation,
      animationSpeed: config.animationSpeed,
      loopDelay: config.loopDelay,
      imageSize: config.imageSize,
      imageBorderRadius: config.imageBorderRadius,
      imageOpacity: config.imageOpacity,
      tileColumns: config.tileColumns,
      tileRows: config.tileRows,
      glitchIntensity: config.glitchIntensity,
      glitchSlices: config.glitchSlices,
      revealAngle: config.revealAngle,
      revealBlur: config.revealBlur,
      scanlineCount: config.scanlineCount,
      scanlineDirection: config.scanlineDirection,
      dissolveParticleSize: config.dissolveParticleSize,
      shatterPieces: config.shatterPieces,
      showLabel: config.showLabel,
      labelText: config.labelText,
      showGlow: config.showGlow,
    });
  }

  const jsxCode = useMemo(() => generateLoaderJSX(config), [config]);
  const cssCode = useMemo(() => generateLoaderCSS(config), [config]);

  // Stage background adapts to mode
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(#e0e0ec 1px, transparent 1px),
            linear-gradient(90deg, #e0e0ec 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : {
          background: "#0d0d10",
          backgroundImage: `
            linear-gradient(#1c1c2610 1px, transparent 1px),
            linear-gradient(90deg, #1c1c2610 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        };

  return (
    <ResizablePlayground
      componentName="Image Morph Loader"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · animation & image preserved"
      preview={
        <LoaderPreview
          config={config}
          imageDataUrl={imageDataUrl}
          onImageUpload={setImageDataUrl}
        />
      }
      controls={
        <LoaderControlPanel
          config={config}
          imageDataUrl={imageDataUrl}
          onChange={handleChange}
          onReset={handleReset}
          onImageUpload={setImageDataUrl}
          onImageClear={() => setImageDataUrl(null)}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
