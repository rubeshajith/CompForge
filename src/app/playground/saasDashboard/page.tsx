"use client";

import { useMemo, useState } from "react";
import { SaasDashboardConfig, darkSaasDashboardConfig } from "@/lib/saasDashboardConfig";
import { generateSaasDashboardCSS, generateSaasDashboardJSX } from "@/lib/generateSaasDashboardCode";
import { SaasDashboardControlPanel } from "@/components/playground/SaasDashboardControlPanel";
import { SaasDashboardPreview } from "@/components/playground/SaasDashboardPreview";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function SaasDashboardPlayground() {
  const [config, setConfig] = useState<SaasDashboardConfig>(darkSaasDashboardConfig);

  function handleChange(patch: Partial<SaasDashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setConfig(darkSaasDashboardConfig);
  }

  const jsxCode = useMemo(() => generateSaasDashboardJSX(config), [config]);
  const cssCode = useMemo(() => generateSaasDashboardCSS(config), [config]);

  return (
    <ResizablePlayground
      componentName="SaaS Dashboard"
      mode="dark"
      onModeToggle={() => undefined}
      modeHint="Theme selection only"
      preview={<SaasDashboardPreview config={config} />}
      controls={<SaasDashboardControlPanel config={config} onChange={handleChange} onReset={handleReset} />}
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
