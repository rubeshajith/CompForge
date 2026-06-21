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
import {
  darkDateTimeInputConfig,
  DateTimeInputConfig,
  DateTimeInputMode,
  dateTimeInputModePresets,
} from "@/lib/dateTimeInputConfig";
import { DateTimeInputPreview } from "@/components/playground/DateTimeInputPreview";
import { DateTimeInputControlPanel } from "@/components/playground/DateTimeInputControlPanel";
import {
  generateDateTimeInputCSS,
  generateDateTimeInputJSX,
  generateDateTimeInputTailwind,
  generateDateTimeInputTSX,
} from "@/lib/generateDateTimeInputCode";

export default function WeekStripPlayground() {
  const [mode, setMode] = useState<DateTimeInputMode>("dark");
  const [config, setConfig] = useState<DateTimeInputConfig>(
    darkDateTimeInputConfig,
  );

  function handleChange(patch: Partial<DateTimeInputConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: DateTimeInputMode) {
    setMode(newMode);
    // Preserve current showMonthLabel when switching dark/light
    setConfig({
      ...dateTimeInputModePresets[newMode],
    });
  }

  function handleReset() {
    setConfig({
      ...dateTimeInputModePresets[mode],
    });
  }

  const jsxCode = useMemo(() => generateDateTimeInputJSX(config), [config]);
  const cssCode = useMemo(() => generateDateTimeInputCSS(config), [config]);
  const tsxCode = useMemo(() => generateDateTimeInputTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateDateTimeInputTailwind(config),
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
      componentName="Week Strip"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · selection mode preserved"
      preview={<DateTimeInputPreview config={config} />}
      controls={
        <DateTimeInputControlPanel
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
