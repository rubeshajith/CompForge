"use client";

// /app/playground/filterModal/page.tsx

import { useState, useMemo } from "react";
import {
  FilterModalConfig,
  FilterModalMode,
  filterModalModePresets,
  darkFilterModalConfig,
} from "@/lib/filterModalConfig";
import {
  generateFilterModalJSX,
  generateFilterModalCSS,
} from "@/lib/generateFilterModalCode";
import { FilterModalPreview } from "@/components/playground/FilterModalPreview";
import { FilterModalControlPanel } from "@/components/playground/FilterModalControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function FilterModalPlayground() {
  const [mode, setMode] = useState<FilterModalMode>("dark");
  const [config, setConfig] = useState<FilterModalConfig>(
    darkFilterModalConfig,
  );

  function handleChange(patch: Partial<FilterModalConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: FilterModalMode) {
    setMode(newMode);
    // Preserve behavioral / state props across theme switch
    setConfig({
      ...filterModalModePresets[newMode],
      selectedStatuses: config.selectedStatuses,
      selectedCategories: config.selectedCategories,
      sortField: config.sortField,
      sortDirection: config.sortDirection,
      showCategoryCount: config.showCategoryCount,
      animateOpen: config.animateOpen,
      backdropBlur: config.backdropBlur,
    });
  }

  function handleReset() {
    setConfig({
      ...filterModalModePresets[mode],
      selectedStatuses: config.selectedStatuses,
      selectedCategories: config.selectedCategories,
      sortField: config.sortField,
      sortDirection: config.sortDirection,
      showCategoryCount: config.showCategoryCount,
      animateOpen: config.animateOpen,
      backdropBlur: config.backdropBlur,
    });
  }

  const jsxCode = useMemo(() => generateFilterModalJSX(config), [config]);
  const cssCode = useMemo(() => generateFilterModalCSS(config), [config]);

  // Light mode stage: subtle grid
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Filter Modal"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · filters & sort preserved"
      preview={<FilterModalPreview config={config} />}
      controls={
        <FilterModalControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
