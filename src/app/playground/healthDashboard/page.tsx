"use client";

import { useState, useMemo } from "react";
import {
  OmnidashConfig,
  OmnidashTheme,
  omnidashThemePresets,
  defaultOmnidashConfig,
} from "@/lib/healthDashConfig";
import {
  generateOmnidashJSX,
  generateOmnidashCSS,
  generateOmnidashTSX,
  generateOmnidashTailwind,
} from "@/lib/generateHealthDashCode";
import { OmnidashPreview } from "@/components/playground/HealthDashPreview";
import { OmnidashControlPanel } from "@/components/playground/HealthDashControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function OmnidashPlayground() {
  const [config, setConfig] = useState<OmnidashConfig>(defaultOmnidashConfig);

  function handleChange(patch: Partial<OmnidashConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setConfig(omnidashThemePresets.emerald);
  }

  const jsxCode = useMemo(() => generateOmnidashJSX(config), [config]);
  const cssCode = useMemo(() => generateOmnidashCSS(config), [config]);
  const tsxCode = useMemo(() => generateOmnidashTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateOmnidashTailwind(config),
    [config],
  );
  return (
    <ResizablePlayground
      componentName="OmniDash — HealthTech Clinician Dashboard"
      mode="dark"
      onModeToggle={() => {}}
      modeHint="Select a theme to repaint the entire dashboard"
      preview={<OmnidashPreview config={config} />}
      controls={
        <OmnidashControlPanel
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
