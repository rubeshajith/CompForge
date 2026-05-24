"use client";

import { useMemo, useState } from "react";
import {
  RecordTableConfig,
  RecordTableMode,
  darkRecordTableConfig,
  recordTableModePresets,
} from "@/lib/recordTableConfig";
import { generateRecordTableCSS, generateRecordTableJSX } from "@/lib/generateRecordTableCode";
import { RecordTableControlPanel } from "@/components/playground/RecordTableControlPanel";
import { RecordTablePreview } from "@/components/playground/RecordTablePreview";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function RecordTablePlayground() {
  const [mode, setMode] = useState<RecordTableMode>("dark");
  const [config, setConfig] = useState<RecordTableConfig>(darkRecordTableConfig);

  function handleChange(patch: Partial<RecordTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function getBehavior(configToPreserve: RecordTableConfig) {
    return {
      viewMode: configToPreserve.viewMode,
      showSearch: configToPreserve.showSearch,
      showFilters: configToPreserve.showFilters,
      showMetrics: configToPreserve.showMetrics,
      animateItems: configToPreserve.animateItems,
    };
  }

  function handleModeToggle(newMode: RecordTableMode) {
    setMode(newMode);
    setConfig({ ...recordTableModePresets[newMode], ...getBehavior(config) });
  }

  function handleReset() {
    setConfig({ ...recordTableModePresets[mode], ...getBehavior(config) });
  }

  const jsxCode = useMemo(() => generateRecordTableJSX(config), [config]);
  const cssCode = useMemo(() => generateRecordTableCSS(config), [config]);

  const stageStyle = mode === "light" ? {
    background: "#f4f4f8",
    backgroundImage: `
      radial-gradient(circle at 30% 40%, rgba(108,92,231,0.05) 0%, transparent 60%),
      linear-gradient(45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%),
      linear-gradient(-45deg, transparent 49.5%, #d4d4e0 49.5%, #d4d4e0 50.5%, transparent 50.5%)
    `,
    backgroundSize: "100% 100%, 24px 24px, 24px 24px",
  } : undefined;

  return (
    <ResizablePlayground
      componentName="Record Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors - view, controls, metrics, and animation preserved"
      stageStyle={stageStyle}
      preview={<RecordTablePreview config={config} />}
      controls={<RecordTableControlPanel config={config} onChange={handleChange} onReset={handleReset} />}
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
