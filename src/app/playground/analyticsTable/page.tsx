"use client";

// /app/playground/dataTable/page.tsx

import { useState, useMemo } from "react";
import {
  DataTableConfig,
  DataTableMode,
  dataTableModePresets,
  darkDataTableConfig,
} from "@/lib/dataTableConfig";
import {
  generateDataTableJSX,
  generateDataTableCSS,
} from "@/lib/generateDataTableCode";
import { DataTablePreview } from "@/components/playground/DataTablePreview";
import { DataTableControlPanel } from "@/components/playground/DataTableControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  AnalyticsTableConfig,
  AnalyticsTableMode,
  analyticsTableModePresets,
} from "@/lib/analyticsTableConfig";
import { darkAnalyticsTableConfig } from "@/lib/analyticsTableConfig";
import { AnalyticsTableControlPanel } from "@/components/playground/AnalyticsTableControlPanel";
import { AnalyticsTablePreview } from "@/components/playground/AnalyticsTablePreview";
import {
  generateAnalyticsTableCSS,
  generateAnalyticsTableJSX,
} from "@/lib/generateAnalyticsTableCode";

export default function DataTablePlayground() {
  const [mode, setMode] = useState<AnalyticsTableMode>("dark");
  const [config, setConfig] = useState<AnalyticsTableConfig>(
    darkAnalyticsTableConfig,
  );

  function handleChange(patch: Partial<AnalyticsTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: AnalyticsTableMode) {
    setMode(newMode);
    // Preserve behavioral props that shouldn't reset on theme switch
    setConfig({
      ...analyticsTableModePresets[newMode],
      showPagination: config.showPagination,
      showCheckboxes: config.showCheckboxes,

      animateExpand: config.animateExpand,
      rowsPerPage: config.rowsPerPage,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      tableBorderRadius: config.tableBorderRadius,
    });
  }

  function handleReset() {
    setConfig({
      ...analyticsTableModePresets[mode],
      showPagination: config.showPagination,
      showCheckboxes: config.showCheckboxes,

      animateExpand: config.animateExpand,
      rowsPerPage: config.rowsPerPage,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      tableBorderRadius: config.tableBorderRadius,
    });
  }

  const jsxCode = useMemo(() => generateAnalyticsTableJSX(config), [config]);
  const cssCode = useMemo(() => generateAnalyticsTableCSS(config), [config]);

  // Light mode stage: crosshatch grid
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(to right, #e8e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e8e8f0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Data Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · behavior & layout preserved"
      preview={<AnalyticsTablePreview config={config} />}
      controls={
        <AnalyticsTableControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
