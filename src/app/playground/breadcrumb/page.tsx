"use client";

import { useState, useMemo } from "react";
import {
  BreadcrumbConfig,
  BreadcrumbMode,
  breadcrumbModePresets,
  darkBreadcrumbConfig,
} from "@/lib/breadcrumbsConfig";
import {
  generateBreadcrumbJSX,
  generateBreadcrumbCSS,
  generateBreadcrumbTSX,
  generateBreadcrumbTailwind,
} from "@/lib/generateBreadcrumbCode";
import { BreadcrumbPreview } from "@/components/playground/BreadcrumbsPreview";
import { BreadcrumbControlPanel } from "@/components/playground/BreadcrumbControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function BreadcrumbPlayground() {
  const [mode, setMode] = useState<BreadcrumbMode>("dark");
  const [config, setConfig] = useState<BreadcrumbConfig>(darkBreadcrumbConfig);

  function handleChange(patch: Partial<BreadcrumbConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: BreadcrumbMode) {
    setMode(newMode);
    // Preserve behavioral props across theme switch
    setConfig({
      ...breadcrumbModePresets[newMode],
      variant: config.variant,
      showHomeIcon: config.showHomeIcon,
      animate: config.animate,
    });
  }

  function handleReset() {
    setConfig({
      ...breadcrumbModePresets[mode],
      variant: config.variant,
      showHomeIcon: config.showHomeIcon,
      animate: config.animate,
    });
  }

  const jsxCode = useMemo(() => generateBreadcrumbJSX(config), [config]);
  const cssCode = useMemo(() => generateBreadcrumbCSS(config), [config]);
  const tsxCode = useMemo(() => generateBreadcrumbTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateBreadcrumbTailwind(config),
    [config],
  );

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
      componentName="Breadcrumb"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & options preserved"
      preview={<BreadcrumbPreview config={config} />}
      controls={
        <BreadcrumbControlPanel
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
