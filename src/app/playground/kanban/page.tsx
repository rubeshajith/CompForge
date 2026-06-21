"use client";

import { useState, useMemo } from "react";
import {
  KanbanConfig,
  KanbanMode,
  kanbanModePresets,
  darkKanbanConfig,
} from "@/lib/kanbanConfig";
import {
  generateKanbanJSX,
  generateKanbanCSS,
  generateKanbanTSX,
  generateKanbanTailwind,
} from "@/lib/generateKanbanCode";
import { KanbanPreview } from "@/components/playground/KanbanPreview";
import { KanbanControlPanel } from "@/components/playground/KanbanControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function KanbanPlayground() {
  const [mode, setMode] = useState<KanbanMode>("dark");
  const [config, setConfig] = useState<KanbanConfig>(darkKanbanConfig);

  function handleChange(patch: Partial<KanbanConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: KanbanMode) {
    setMode(newMode);
    setConfig({
      ...kanbanModePresets[newMode],
      columnCount: config.columnCount,
      columnWidth: config.columnWidth,
      boardGap: config.boardGap,
      cardGap: config.cardGap,
      cardPadding: config.cardPadding,
      cardTitleFontSize: config.cardTitleFontSize,
      cardDescFontSize: config.cardDescFontSize,
      columnHeaderFontSize: config.columnHeaderFontSize,
      cardBorderRadius: config.cardBorderRadius,
      columnBorderRadius: config.columnBorderRadius,
      cardShadow: config.cardShadow,
      cardDragRotation: config.cardDragRotation,
    });
  }

  function handleReset() {
    setConfig({
      ...kanbanModePresets[mode],
      columnCount: config.columnCount,
      columnWidth: config.columnWidth,
      boardGap: config.boardGap,
      cardGap: config.cardGap,
      cardPadding: config.cardPadding,
      cardTitleFontSize: config.cardTitleFontSize,
      cardDescFontSize: config.cardDescFontSize,
      columnHeaderFontSize: config.columnHeaderFontSize,
      cardBorderRadius: config.cardBorderRadius,
      columnBorderRadius: config.columnBorderRadius,
      cardShadow: config.cardShadow,
      cardDragRotation: config.cardDragRotation,
    });
  }

  const jsxCode = useMemo(() => generateKanbanJSX(config), [config]);
  const cssCode = useMemo(() => generateKanbanCSS(config), [config]);
  const tsxCode = useMemo(() => generateKanbanTSX(config), [config]);
  const tailwindCode = useMemo(() => generateKanbanTailwind(config), [config]);
  const stageStyle =
    mode === "light"
      ? {
          background: "#f0f0f8",
          backgroundImage: `
            linear-gradient(rgba(180,180,210,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,180,210,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Kanban Board"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · layout & toggles preserved"
      preview={<KanbanPreview config={config} mode={mode} />}
      controls={
        <KanbanControlPanel
          config={config}
          mode={mode}
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
