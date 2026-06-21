"use client";

import { useMemo, useState } from "react";
import {
  UploadModalConfig,
  UploadModalMode,
  uploadModalModePresets,
  darkUploadModalConfig,
} from "@/lib/uploadModalConfig";
import {
  generateUploadModalCSS,
  generateUploadModalJSX,
  generateUploadModalTailwind,
  generateUploadModalTSX,
} from "@/lib/generateUploadModalCode";
import { UploadModalPreview } from "@/components/playground/UploadModalPreview";
import { UploadModalControlPanel } from "@/components/playground/UploadModalControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function UploadModalPlayground() {
  const [mode, setMode] = useState<UploadModalMode>("dark");
  const [config, setConfig] = useState<UploadModalConfig>(
    darkUploadModalConfig,
  );

  function handleChange(patch: Partial<UploadModalConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: UploadModalMode) {
    setMode(newMode);
    setConfig({
      ...uploadModalModePresets[newMode],
      quotaUsed: config.quotaUsed,
      quotaTotal: config.quotaTotal,
      pendingUploads: config.pendingUploads,
      animateOpen: config.animateOpen,
      showShadow: config.showShadow,
    });
  }

  function handleReset() {
    setConfig({
      ...uploadModalModePresets[mode],
      quotaUsed: config.quotaUsed,
      quotaTotal: config.quotaTotal,
      pendingUploads: config.pendingUploads,
      animateOpen: config.animateOpen,
      showShadow: config.showShadow,
    });
  }

  const jsxCode = useMemo(() => generateUploadModalJSX(config), [config]);
  const cssCode = useMemo(() => generateUploadModalCSS(config), [config]);
  const tsxCode = useMemo(() => generateUploadModalTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateUploadModalTailwind(config),
    [config],
  );
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
      componentName="Upload Modal"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · upload queue, quota, and behavior preserved"
      preview={<UploadModalPreview config={config} />}
      controls={
        <UploadModalControlPanel
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
