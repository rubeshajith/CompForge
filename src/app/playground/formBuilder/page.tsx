"use client";

import { useState, useMemo } from "react";
import {
  FormConfig,
  FormMode,
  formModePresets,
  darkFormConfig,
} from "@/lib/formConfig";
import { generateFormJSX, generateFormCSS } from "@/lib/generateFormCode";
import { FormPreview } from "@/components/playground/FormPreview";
import { FormControlPanel } from "@/components/playground/FormControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function FormPlayground() {
  const [mode, setMode] = useState<FormMode>("dark");
  const [config, setConfig] = useState<FormConfig>(darkFormConfig);

  function handleChange(patch: Partial<FormConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: FormMode) {
    setMode(newMode);
    // Preserve user's field definitions when switching theme
    setConfig({ ...formModePresets[newMode], fields: config.fields });
  }

  function handleReset() {
    setConfig({ ...formModePresets[mode], fields: config.fields });
  }

  const jsxCode = useMemo(() => generateFormJSX(config), [config]);
  const cssCode = useMemo(() => generateFormCSS(config), [config]);

  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Form Generator"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · field definitions preserved"
      preview={<FormPreview config={config} />}
      controls={
        <FormControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
