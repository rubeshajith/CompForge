"use client";

// /app/playground/indiaMap/page.tsx

import { useState, useMemo } from "react";
import {
  IndiaMapConfig,
  IndiaMapMode,
  indiaMapModePresets,
  darkIndiaMapConfig,
  MapMetric,
  ChartType,
} from "@/lib/indiaMapConfig";
import { generateIndiaMapJSX, generateIndiaMapCSS } from "@/lib/generateIndiaMapCode";
import { IndiaMapPreview } from "@/components/playground/IndiaMapPreview";
import { IndiaMapControlPanel } from "@/components/playground/IndiaMapControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function IndiaMapPlayground() {
  const [mode, setMode] = useState<IndiaMapMode>("dark");
  const [config, setConfig] = useState<IndiaMapConfig>(darkIndiaMapConfig);

  // Behavioral props that survive theme switches
  const behavioralProps: (keyof IndiaMapConfig)[] = [
    "activeMetric",
    "chartType",
    "showChoropleth",
    "showStateLabels",
    "animateTransition",
    "showShadow",
    "mapWidth",
    "mapHeight",
  ];

  function handleChange(patch: Partial<IndiaMapConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: IndiaMapMode) {
    setMode(newMode);
    const preset = indiaMapModePresets[newMode];
    // Preserve all behavioral props
    const preserved = Object.fromEntries(
      behavioralProps.map((k) => [k, config[k]])
    ) as Partial<IndiaMapConfig>;
    setConfig({ ...preset, ...preserved });
  }

  function handleReset() {
    const preset = indiaMapModePresets[mode];
    const preserved = Object.fromEntries(
      behavioralProps.map((k) => [k, config[k]])
    ) as Partial<IndiaMapConfig>;
    setConfig({ ...preset, ...preserved });
  }

  const jsxCode = useMemo(() => generateIndiaMapJSX(config), [config]);
  const cssCode = useMemo(() => generateIndiaMapCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="India Map"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · metric, chart type & size preserved"

      preview={<IndiaMapPreview config={config} />}
      controls={
        <IndiaMapControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}