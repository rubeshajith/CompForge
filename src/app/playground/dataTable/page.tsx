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

export default function DataTablePlayground() {
  const [mode, setMode] = useState<DataTableMode>("dark");
  const [config, setConfig] = useState<DataTableConfig>(darkDataTableConfig);

  function handleChange(patch: Partial<DataTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: DataTableMode) {
    setMode(newMode);
    // Preserve behavioral props that shouldn't reset on theme switch
    setConfig({
      ...dataTableModePresets[newMode],
      showFilters: config.showFilters,
      showPagination: config.showPagination,
      showCheckboxes: config.showCheckboxes,
      showContextCards: config.showContextCards,
      stripedRows: config.stripedRows,
      animateExpand: config.animateExpand,
      rowsPerPage: config.rowsPerPage,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      tableBorderRadius: config.tableBorderRadius,
    });
  }

  function handleReset() {
    setConfig({
      ...dataTableModePresets[mode],
      showFilters: config.showFilters,
      showPagination: config.showPagination,
      showCheckboxes: config.showCheckboxes,
      showContextCards: config.showContextCards,
      stripedRows: config.stripedRows,
      animateExpand: config.animateExpand,
      rowsPerPage: config.rowsPerPage,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      tableBorderRadius: config.tableBorderRadius,
    });
  }

  const jsxCode = useMemo(() => generateDataTableJSX(config), [config]);
  const cssCode = useMemo(() => generateDataTableCSS(config), [config]);

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
      preview={<DataTablePreview config={config} />}
      controls={
        <DataTableControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
