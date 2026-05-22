"use client";

import { useState, useMemo } from "react";
import {
  AccordionConfig,
  AccordionMode,
  accordionModePresets,
  darkAccordionConfig,
} from "@/lib/accordionConfig";
import {
  generateAccordionJSX,
  generateAccordionCSS,
} from "@/lib/generateAccordionCode";
import { AccordionPreview } from "@/components/playground/AccordionPreview";
import { AccordionControlPanel } from "@/components/playground/AccordionControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function AccordionPlayground() {
  const [mode, setMode] = useState<AccordionMode>("dark");
  const [config, setConfig] = useState<AccordionConfig>(darkAccordionConfig);

  function handleChange(patch: Partial<AccordionConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: AccordionMode) {
    setMode(newMode);
    // Preserve behavioral props across theme switches
    setConfig({
      ...accordionModePresets[newMode],
      variant: config.variant,
      allowMultiple: config.allowMultiple,
      animationDuration: config.animationDuration,
      accordionWidth: config.accordionWidth,
    });
  }

  function handleReset() {
    setConfig({
      ...accordionModePresets[mode],
      variant: config.variant,
      allowMultiple: config.allowMultiple,
      animationDuration: config.animationDuration,
      accordionWidth: config.accordionWidth,
    });
  }

  const jsxCode = useMemo(() => generateAccordionJSX(config), [config]);
  const cssCode = useMemo(() => generateAccordionCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Accordion"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, behavior & width preserved"
      preview={<AccordionPreview config={config} />}
      controls={
        <AccordionControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
