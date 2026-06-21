"use client";

import { useMemo, useState } from "react";
import { CodePanel } from "@/components/playground/CodePanel";
import { EcommerceDashboardControlPanel } from "@/components/playground/EcommerceDashboardControlPanel";
import { EcommerceDashboardPreview } from "@/components/playground/EcommerceDashboardPreview";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  EcommerceDashboardConfig,
  defaultEcommerceDashboardConfig,
} from "@/lib/ecommerceDashboardConfig";
import {
  generateEcommerceDashboardCSS,
  generateEcommerceDashboardJSX,
  generateEcommerceDashboardTailwind,
  generateEcommerceDashboardTSX,
} from "@/lib/generateEcommerceDashboardCode";

export default function EcommerceDashboardPlayground() {
  const [config, setConfig] = useState<EcommerceDashboardConfig>(
    defaultEcommerceDashboardConfig,
  );

  function handleChange(patch: Partial<EcommerceDashboardConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setConfig(defaultEcommerceDashboardConfig);
  }

  const jsxCode = useMemo(
    () => generateEcommerceDashboardJSX(config),
    [config],
  );
  const cssCode = useMemo(
    () => generateEcommerceDashboardCSS(config),
    [config],
  );
  const tsxCode = useMemo(
    () => generateEcommerceDashboardTSX(config),
    [config],
  );
  const tailwindCode = useMemo(
    () => generateEcommerceDashboardTailwind(config),
    [config],
  );
  return (
    <ResizablePlayground
      componentName="E-commerce Dashboard"
      mode="dark"
      onModeToggle={() => undefined}
      modeHint="Use the theme controls to recolor the full dashboard"
      preview={<EcommerceDashboardPreview config={config} />}
      controls={
        <EcommerceDashboardControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
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
