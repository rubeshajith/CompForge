"use client";

import { useState, useMemo } from "react";

import {
  WeekStripConfig,
  WeekStripMode,
  weekStripModePresets,
  darkWeekStripConfig,
} from "@/lib/weekStripConfig";
import {
  generateCalendarJSX,
  generateCalendarCSS,
} from "@/lib/generateCalendarCode";
import { CalendarPreview } from "@/components/playground/CalendarPreview";
import { CalendarControlPanel } from "@/components/playground/CalendarControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import { generateWeekStripCSS } from "@/lib/generateWeekStripCode";
import { generateWeekStripJSX } from "@/lib/generateWeekStripCode";
import { WeekStripPreview } from "@/components/playground/WeekStripPreview";
import { WeekStripControlPanel } from "@/components/playground/WeekStripControlPanel";

export default function WeekStripPlayground() {
  const [mode, setMode] = useState<WeekStripMode>("dark");
  const [config, setConfig] = useState<WeekStripConfig>(darkWeekStripConfig);

  function handleChange(patch: Partial<WeekStripConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: WeekStripMode) {
    setMode(newMode);
    // Preserve current showMonthLabel when switching dark/light
    setConfig({
      ...weekStripModePresets[newMode],
      showMonthLabel: config.showMonthLabel,
    });
  }

  function handleReset() {
    setConfig({
      ...weekStripModePresets[mode],
      showMonthLabel: config.showMonthLabel,
    });
  }

  const jsxCode = useMemo(() => generateWeekStripJSX(config), [config]);
  const cssCode = useMemo(() => generateWeekStripCSS(config), [config]);

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
      componentName="Week Strip"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · selection mode preserved"
      preview={<WeekStripPreview config={config} />}
      controls={
        <WeekStripControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
