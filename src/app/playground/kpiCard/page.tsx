"use client";

// /app/playground/kpiCard/page.tsx

import { useState, useMemo } from "react";
import {
  KpiCardConfig,
  KpiCardMode,
  kpiCardModePresets,
  darkKpiCardConfig,
} from "@/lib/kpiCardConfig";
import { generateKpiCardJSX, generateKpiCardCSS } from "@/lib/generateKpiCardCode";
import { KpiCardPreview } from "@/components/playground/KpiCardPreview";
import { KpiCardControlPanel } from "@/components/playground/KpiCardControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Behavioral props preserved across mode switches
type BehavioralProps = Pick<
  KpiCardConfig,
  "chartVariant" | "label" | "value" | "percentChange" | "changeDirection" | "subText" | "showBadge" | "animateChart"
>;

function pickBehavioral(c: KpiCardConfig): BehavioralProps {
  return {
    chartVariant: c.chartVariant,
    label: c.label,
    value: c.value,
    percentChange: c.percentChange,
    changeDirection: c.changeDirection,
    subText: c.subText,
    showBadge: c.showBadge,
    animateChart: c.animateChart,
  };
}

export default function KpiCardPlayground() {
  const [mode, setMode] = useState<KpiCardMode>("dark");
  const [config, setConfig] = useState<KpiCardConfig>(darkKpiCardConfig);

  function handleChange(patch: Partial<KpiCardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: KpiCardMode) {
    setMode(newMode);
    setConfig({ ...kpiCardModePresets[newMode], ...pickBehavioral(config) });
  }

  function handleReset() {
    setConfig({ ...kpiCardModePresets[mode], ...pickBehavioral(config) });
  }

  const jsxCode = useMemo(() => generateKpiCardJSX(config), [config]);
  const cssCode = useMemo(() => generateKpiCardCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="KPI Card"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · chart variant, label & data preserved"
      stageStyle={stageStyle}
      preview={<KpiCardPreview config={config} />}
      controls={
        <KpiCardControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
