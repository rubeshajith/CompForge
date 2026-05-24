"use client";

// /app/playground/invoiceTable/page.tsx

import { useState, useMemo } from "react";
import {
  InvoiceTableConfig,
  InvoiceTableMode,
  invoiceTableModePresets,
  darkInvoiceTableConfig,
} from "@/lib/invoiceTableConfig";
import {
  generateInvoiceTableJSX,
  generateInvoiceTableCSS,
} from "@/lib/generateInvoiceTableCode";
import { InvoiceTablePreview } from "@/components/playground/InvoiceTablePreview";
import { InvoiceTableControlPanel } from "@/components/playground/InvoiceTableControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// Layout / behavioural keys that survive a theme reset
const PRESERVED_KEYS: (keyof InvoiceTableConfig)[] = [
  "borderRadius",
  "tableWidth",
  "headerFontSize",
  "cellFontSize",
  "showShadow",
  "showSearch",
  "showStatusTabs",
  "showBulkCheckboxes",
  "showDownloadAction",
  "showMoreAction",
  "stickyHeader",
  "animateRows",
];

function pickPreserved(
  base: InvoiceTableConfig,
  source: InvoiceTableConfig,
): Partial<InvoiceTableConfig> {
  const result: Partial<InvoiceTableConfig> = {};
  PRESERVED_KEYS.forEach((key) => {
    (result as Record<string, unknown>)[key] = source[key];
  });
  return result;
}

export default function InvoiceTablePlayground() {
  const [mode, setMode] = useState<InvoiceTableMode>("dark");
  const [config, setConfig] = useState<InvoiceTableConfig>(
    darkInvoiceTableConfig,
  );

  function handleChange(patch: Partial<InvoiceTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: InvoiceTableMode) {
    setMode(newMode);
    setConfig({
      ...invoiceTableModePresets[newMode],
      ...pickPreserved(invoiceTableModePresets[newMode], config),
    });
  }

  function handleReset() {
    setConfig({
      ...invoiceTableModePresets[mode],
      ...pickPreserved(invoiceTableModePresets[mode], config),
    });
  }

  const jsxCode = useMemo(() => generateInvoiceTableJSX(config), [config]);
  const cssCode = useMemo(() => generateInvoiceTableCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f0f2f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Invoice Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · layout, density & features preserved"
      preview={<InvoiceTablePreview config={config} />}
      controls={
        <InvoiceTableControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
