"use client";

import { useState, useMemo } from "react";

import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  darkSidebarConfig,
  SidebarConfig,
  SidebarMode,
  sidebarModePresets,
} from "@/lib/sidebarConfig";
import {
  generateSidebarCSS,
  generateSidebarTailwind,
  generateSidebarTSX,
} from "@/lib/generateSidebarCode";
import { generateSidebarJSX } from "@/lib/generateSidebarCode";
import { SidebarControlPanel } from "@/components/playground/SidebarControlPanel";
import { SidebarPreview } from "@/components/playground/SidebarPreview";

export default function SidebarPlayground() {
  const [mode, setMode] = useState<SidebarMode>("dark");
  const [config, setConfig] = useState<SidebarConfig>(darkSidebarConfig);

  function handleChange(patch: Partial<SidebarConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: SidebarMode) {
    setMode(newMode);
    // Preserve current selectionMode when switching dark/light
    setConfig({
      ...sidebarModePresets[newMode],
    });
  }

  function handleReset() {
    setConfig({
      ...sidebarModePresets[mode],
    });
  }

  const jsxCode = useMemo(() => generateSidebarJSX(config), [config]);
  const cssCode = useMemo(() => generateSidebarCSS(config), [config]);
  const tsxCode = useMemo(() => generateSidebarTSX(config), [config]);
  const tailwindCode = useMemo(() => generateSidebarTailwind(config), [config]);
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
      componentName="Sidebar"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · selection mode preserved"
      preview={<SidebarPreview config={config} />}
      controls={
        <SidebarControlPanel
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
