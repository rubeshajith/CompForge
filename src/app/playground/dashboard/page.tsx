"use client";

import { useState, useMemo } from "react";
import {
  DashboardConfig,
  DashboardMode,
  dashboardModePresets,
  darkDashboardConfig,
} from "@/lib/dashboardConfig";
import {
  generateDashboardJSX,
  generateDashboardCSS,
} from "@/lib/generateDashboardCode";
import { DashboardPreview } from "@/components/playground/DashboardPreview";
import { DashboardControlPanel } from "@/components/playground/DashboardControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function DashboardPlayground() {
  const [mode] = useState<DashboardMode>("dark");
  const [config, setConfig] = useState<DashboardConfig>(darkDashboardConfig);

  function handleChange(patch: Partial<DashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setConfig({ ...dashboardModePresets[mode] });
  }

  const jsxCode = useMemo(() => generateDashboardJSX(config), [config]);
  const cssCode = useMemo(() => generateDashboardCSS(config), [config]);

  return (
    <ResizablePlayground
      componentName="Dashboard"
      mode={mode}
      onModeToggle={() => {}}
      modeHint="Change accent color to theme the entire dashboard"
      preview={<DashboardPreview config={config} />}
      controls={
        <DashboardControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
