"use client";

import { useMemo, useState } from "react";
import { CodePanel } from "@/components/playground/CodePanel";
import { ManufacturingDashboardControlPanel } from "@/components/playground/ManufacturingDashboardControlPanel";
import { ManufacturingDashboardPreview } from "@/components/playground/ManufacturingDashboardPreview";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  darkManufacturingDashboardConfig,
  manufacturingDashboardModePresets,
  type ManufacturingDashboardConfig,
  type ManufacturingDashboardMode,
} from "@/lib/manufacturingDashboardConfig";
import {
  generateManufacturingDashboardCSS,
  generateManufacturingDashboardJSX,
  generateManufacturingDashboardTailwind,
  generateManufacturingDashboardTSX,
} from "@/lib/generateManufacturingDashboardCode";

export default function ManufacturingDashboardPlayground() {
  const [mode, setMode] = useState<ManufacturingDashboardMode>("dark");
  const [config, setConfig] = useState<ManufacturingDashboardConfig>(
    darkManufacturingDashboardConfig,
  );

  function handleChange(patch: Partial<ManufacturingDashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function preservedBehavior(prev: ManufacturingDashboardConfig) {
    return {
      density: prev.density,
      showSidebar: prev.showSidebar,
      showDownloadCard: prev.showDownloadCard,
      showProfile: prev.showProfile,
      animateCards: prev.animateCards,
    };
  }

  function handleModeToggle(newMode: ManufacturingDashboardMode) {
    setMode(newMode);
    setConfig((prev) => ({
      ...manufacturingDashboardModePresets[newMode],
      ...preservedBehavior(prev),
    }));
  }

  function handleReset() {
    setConfig((prev) => ({
      ...manufacturingDashboardModePresets[mode],
      ...preservedBehavior(prev),
    }));
  }

  const jsxCode = useMemo(
    () => generateManufacturingDashboardJSX(config),
    [config],
  );
  const cssCode = useMemo(
    () => generateManufacturingDashboardCSS(config),
    [config],
  );
  const tsxCode = useMemo(
    () => generateManufacturingDashboardTSX(config),
    [config],
  );
  const tailwindCode = useMemo(
    () => generateManufacturingDashboardTailwind(config),
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
      componentName="Manufacturing Dashboard"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors - layout toggles preserved"
      preview={<ManufacturingDashboardPreview config={config} />}
      controls={
        <ManufacturingDashboardControlPanel
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
