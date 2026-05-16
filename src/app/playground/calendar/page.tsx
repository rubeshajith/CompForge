"use client";

import { useState, useMemo } from "react";

import {
  CalendarConfig,
  CalendarMode,
  calendarModePresets,
  darkCalendarConfig,
} from "@/lib/calendarConfig";
import {
  generateCalendarJSX,
  generateCalendarCSS,
} from "@/lib/generateCalendarCode";
import { CalendarPreview } from "@/components/playground/CalendarPreview";
import { CalendarControlPanel } from "@/components/playground/CalendarControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function CalendarPlayground() {
  const [mode, setMode] = useState<CalendarMode>("dark");
  const [config, setConfig] = useState<CalendarConfig>(darkCalendarConfig);

  function handleChange(patch: Partial<CalendarConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: CalendarMode) {
    setMode(newMode);
    // Preserve current selectionMode when switching dark/light
    setConfig({
      ...calendarModePresets[newMode],
      selectionMode: config.selectionMode,
    });
  }

  function handleReset() {
    setConfig({
      ...calendarModePresets[mode],
      selectionMode: config.selectionMode,
    });
  }

  const jsxCode = useMemo(() => generateCalendarJSX(config), [config]);
  const cssCode = useMemo(() => generateCalendarCSS(config), [config]);

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
      componentName="Calendar"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · selection mode preserved"
      preview={<CalendarPreview config={config} />}
      controls={
        <CalendarControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
