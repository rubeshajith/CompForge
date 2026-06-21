"use client";

// /app/playground/productTable/page.tsx

import { useState, useMemo } from "react";
import {
  DataTableConfig,
  DataTableMode,
  dataTableModePresets,
  darkDataTableConfig,
} from "@/lib/productTableConfig";

import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  generateProductTableCSS,
  generateProductTableTailwind,
  generateProductTableTSX,
} from "@/lib/generateProductTableCode";
import { generateProductTableJSX } from "@/lib/generateProductTableCode";
import { ProductTablePreview } from "@/components/playground/ProductTablePreview";
import { ProductTableControlPanel } from "@/components/playground/ProductTableControlPanel";

export default function DataTablePlayground() {
  const [mode, setMode] = useState<DataTableMode>("dark");
  const [config, setConfig] = useState<DataTableConfig>(darkDataTableConfig);

  function handleChange(patch: Partial<DataTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: DataTableMode) {
    setMode(newMode);
    // Preserve behavioral / layout props that shouldn't reset on theme switch
    setConfig({
      ...dataTableModePresets[newMode],
      density: config.density,
      tableWidth: config.tableWidth,
      detailPanelWidth: config.detailPanelWidth,
      borderRadius: config.borderRadius,
      showRowNumbers: config.showRowNumbers,
      showBulkActions: config.showBulkActions,
      stickyHeader: config.stickyHeader,
      stickyFirstColumn: config.stickyFirstColumn,
      animateDetailPanel: config.animateDetailPanel,
      showSearchBar: config.showSearchBar,
      showColumnVisibilityToggle: config.showColumnVisibilityToggle,
      showSortIndicators: config.showSortIndicators,
      showColumnFilters: config.showColumnFilters,
      lowStockThreshold: config.lowStockThreshold,
      columnVisibility: config.columnVisibility,
    });
  }

  function handleReset() {
    setConfig({
      ...dataTableModePresets[mode],
      density: config.density,
      tableWidth: config.tableWidth,
      detailPanelWidth: config.detailPanelWidth,
      borderRadius: config.borderRadius,
      showRowNumbers: config.showRowNumbers,
      showBulkActions: config.showBulkActions,
      stickyHeader: config.stickyHeader,
      stickyFirstColumn: config.stickyFirstColumn,
      animateDetailPanel: config.animateDetailPanel,
      showSearchBar: config.showSearchBar,
      showColumnVisibilityToggle: config.showColumnVisibilityToggle,
      showSortIndicators: config.showSortIndicators,
      showColumnFilters: config.showColumnFilters,
      lowStockThreshold: config.lowStockThreshold,
      columnVisibility: config.columnVisibility,
    });
  }

  const jsxCode = useMemo(() => generateProductTableJSX(config), [config]);
  const cssCode = useMemo(() => generateProductTableCSS(config), [config]);
  const tsxCode = useMemo(() => generateProductTableTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateProductTableTailwind(config),
    [config],
  );
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
      componentName="Data Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · layout, density & features preserved"
      preview={<ProductTablePreview config={config} />}
      controls={
        <ProductTableControlPanel
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
