"use client";

import { useState, useMemo } from "react";
import {
  TimelineConfig,
  TimelineMode,
  timelineModePresets,
  darkTimelineConfig,
  defaultMilestones,
} from "@/lib/timelineConfig";
import {
  generateTimelineJSX,
  generateTimelineCSS,
  generateTimelineTSX,
  generateTimelineTailwind,
} from "@/lib/generateTimelineCode";
import { TimelinePreview } from "@/components/playground/TimelinePreview";
import { TimelineControlPanel } from "@/components/playground/TimelineControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function TimelinePlayground() {
  const [mode, setMode] = useState<TimelineMode>("dark");
  const [config, setConfig] = useState<TimelineConfig>(darkTimelineConfig);

  function handleChange(patch: Partial<TimelineConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: TimelineMode) {
    setMode(newMode);
    // Preserve behavioral/animation props across theme switches
    setConfig({
      ...timelineModePresets[newMode],
      animateExpand: config.animateExpand,
      showShadow: config.showShadow,
    });
  }

  function handleReset() {
    setConfig({
      ...timelineModePresets[mode],
      animateExpand: config.animateExpand,
      showShadow: config.showShadow,
    });
  }

  const jsxCode = useMemo(
    () => generateTimelineJSX(config, defaultMilestones),
    [config],
  );
  const cssCode = useMemo(() => generateTimelineCSS(config), [config]);
  const tsxCode = useMemo(
    () => generateTimelineTSX(config, defaultMilestones),
    [config],
  );
  const tailwindCode = useMemo(
    () => generateTimelineTailwind(config, defaultMilestones),
    [config],
  );
  // Light mode: subtle crosshatch stage
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
      componentName="Timeline"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · animate & shadow preserved"
      preview={
        <TimelinePreview config={config} milestones={defaultMilestones} />
      }
      controls={
        <TimelineControlPanel
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
