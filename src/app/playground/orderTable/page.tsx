"use client";

import { useMemo, useState } from "react";
import { CodePanel } from "@/components/playground/CodePanel";
import { OrderTableControlPanel } from "@/components/playground/OrderTableControlPanel";
import { OrderTablePreview } from "@/components/playground/OrderTablePreview";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  generateOrderTableCSS,
  generateOrderTableJSX,
  generateOrderTableTailwind,
  generateOrderTableTSX,
} from "@/lib/generateOrderTableCode";
import {
  OrderTableConfig,
  OrderTableMode,
  darkOrderTableConfig,
  orderTableModePresets,
} from "@/lib/orderTableConfig";

export default function OrderTablePlayground() {
  const [mode, setMode] = useState<OrderTableMode>("dark");
  const [config, setConfig] = useState<OrderTableConfig>(darkOrderTableConfig);

  function handleChange(patch: Partial<OrderTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function getBehaviorPreservedConfig(nextMode: OrderTableMode) {
    return {
      ...orderTableModePresets[nextMode],
      width: config.width,
      tableMinWidth: config.tableMinWidth,
      rowHeight: config.rowHeight,
      showFilters: config.showFilters,
      showFooter: config.showFooter,
      showAvatars: config.showAvatars,
      expandableRows: config.expandableRows,
      animateRows: config.animateRows,
    };
  }

  function handleModeToggle(newMode: OrderTableMode) {
    setMode(newMode);
    setConfig(getBehaviorPreservedConfig(newMode));
  }

  function handleReset() {
    setConfig(getBehaviorPreservedConfig(mode));
  }

  const jsxCode = useMemo(() => generateOrderTableJSX(config), [config]);
  const cssCode = useMemo(() => generateOrderTableCSS(config), [config]);
  const tsxCode = useMemo(() => generateOrderTableTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateOrderTableTailwind(config),
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
      componentName="Order Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors - layout and behavior preserved"
      preview={<OrderTablePreview config={config} />}
      controls={
        <OrderTableControlPanel
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
