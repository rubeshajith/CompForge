"use client";

import { useMemo, useState } from "react";
import {
  MarketingDashboardConfig,
  darkMarketingDashboardConfig,
} from "@/lib/marketingDashboardConfig";
import {
  generateMarketingDashboardCSS,
  generateMarketingDashboardJSX,
} from "@/lib/generateMarketingDashboardCode";
import { MarketingDashboardControlPanel } from "@/components/playground/MarketingDashboardControlPanel";
import { MarketingDashboardPreview } from "@/components/playground/MarketingDashboardPreview";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function MarketingDashboardPlayground() {
  const [config, setConfig] = useState<MarketingDashboardConfig>(darkMarketingDashboardConfig);

  function handleChange(patch: Partial<MarketingDashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setConfig(darkMarketingDashboardConfig);
  }

  const jsxCode = useMemo(() => generateMarketingDashboardJSX(config), [config]);
  const cssCode = useMemo(() => generateMarketingDashboardCSS(config), [config]);

  return (
    <ResizablePlayground
      componentName="Marketing Dashboard"
      mode="dark"
      onModeToggle={() => undefined}
      modeHint="Theme selection only"
      preview={<MarketingDashboardPreview config={config} />}
      controls={
        <MarketingDashboardControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
