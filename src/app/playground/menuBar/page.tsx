"use client";

import { useState, useMemo } from "react";
import {
  MenuBarConfig,
  MenuBarMode,
  menuBarModePresets,
  darkMenuBarConfig,
} from "@/lib/menuBarConfig";
import { generateMenuBarJSX, generateMenuBarCSS } from "@/lib/generateMenuBarCode";
import { MenuBarPreview } from "@/components/playground/MenuBarPreview";
import { MenuBarControlPanel } from "@/components/playground/MenuBarControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function MenuBarPlayground() {
  const [mode, setMode] = useState<MenuBarMode>("dark");
  const [config, setConfig] = useState<MenuBarConfig>(darkMenuBarConfig);

  function handleChange(patch: Partial<MenuBarConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: MenuBarMode) {
    setMode(newMode);
    setConfig({
      ...menuBarModePresets[newMode],
      // Preserve behavioral/structural props across theme switches
      variant: config.variant,
      showOptionIcons: config.showOptionIcons,
      showOptionShortcuts: config.showOptionShortcuts,
      showDividers: config.showDividers,
      popupAnimation: config.popupAnimation,
      animationDuration: config.animationDuration,
    });
  }

  function handleReset() {
    setConfig({
      ...menuBarModePresets[mode],
      variant: config.variant,
      showOptionIcons: config.showOptionIcons,
      showOptionShortcuts: config.showOptionShortcuts,
      showDividers: config.showDividers,
      popupAnimation: config.popupAnimation,
      animationDuration: config.animationDuration,
    });
  }

  const jsxCode = useMemo(() => generateMenuBarJSX(config), [config]);
  const cssCode = useMemo(() => generateMenuBarCSS(config), [config]);

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
      componentName="Menu Bar"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant & animation preserved"

      preview={<MenuBarPreview config={config} />}
      controls={
        <MenuBarControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}