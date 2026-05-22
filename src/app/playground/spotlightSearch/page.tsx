"use client";

import { useState, useMemo } from "react";
import {
  SpotlightConfig,
  SpotlightMode,
  spotlightModePresets,
  darkSpotlightConfig,
} from "@/lib/spotlightSearchConfig";
import {
  generateSpotlightSearchJSX,
  generateSpotlightSearchCSS,
} from "@/lib/generateSpotlightSearchCode";
import { SpotlightSearchPreview } from "@/components/playground/SpotlightSearchPreview";
import { SpotlightSearchControlPanel } from "@/components/playground/SpotlightSearchControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function SpotlightSearchPlayground() {
  const [mode, setMode] = useState<SpotlightMode>("dark");
  const [config, setConfig] = useState<SpotlightConfig>(darkSpotlightConfig);

  function handleChange(patch: Partial<SpotlightConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: SpotlightMode) {
    setMode(newMode);
    setConfig({
      ...spotlightModePresets[newMode],
      // preserve behavioral props across theme switch
      panelWidth: config.panelWidth,
      animateOpen: config.animateOpen,
      showFooter: config.showFooter,
      showCategories: config.showCategories,
    });
  }

  function handleReset() {
    setConfig({
      ...spotlightModePresets[mode],
      panelWidth: config.panelWidth,
      animateOpen: config.animateOpen,
      showFooter: config.showFooter,
      showCategories: config.showCategories,
    });
  }

  const jsxCode = useMemo(() => generateSpotlightSearchJSX(config), [config]);
  const cssCode = useMemo(() => generateSpotlightSearchCSS(config), [config]);

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
      componentName="Spotlight Search"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · width, animate & toggles preserved"
      preview={<SpotlightSearchPreview config={config} />}
      controls={
        <SpotlightSearchControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
