// /app/playground/toast/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ToastConfig,
  ToastMode,
  ToastVariant,
  VARIANT_META,
  toastModePresets,
  darkToastConfig,
} from "@/lib/toastConfig";
import { generateToastJSX, generateToastCSS } from "@/lib/generateToastCode";
import { ToastPreview } from "@/components/playground/ToastPreview";
import { ToastControlPanel } from "@/components/playground/ToastControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// ─── Behavioral props that survive a mode/color reset ─────────────
const BEHAVIORAL_KEYS: (keyof ToastConfig)[] = [
  "variant",
  "position",
  "title",
  "message",
  "actionLabel",
  "showProgressBar",
  "autoDismissDuration",
  "showCloseButton",
];

function extractBehavioral(config: ToastConfig): Partial<ToastConfig> {
  return Object.fromEntries(
    BEHAVIORAL_KEYS.map((k) => [k, config[k]]),
  ) as Partial<ToastConfig>;
}

export default function ToastPlayground() {
  const [mode, setMode] = useState<ToastMode>("dark");
  const [config, setConfig] = useState<ToastConfig>(darkToastConfig);

  // ── Patch handler ──
  function handleChange(patch: Partial<ToastConfig>) {
    setConfig((prev) => {
      const next = { ...prev, ...patch };

      // When variant changes, sync title/message to variant defaults
      // only if the variant key is in the patch and content wasn't also patched
      if (patch.variant && !patch.title && !patch.message) {
        const meta = VARIANT_META[patch.variant];
        next.title = meta.defaultTitle;
        next.message = meta.defaultMessage;
      }

      return next;
    });
  }

  // ── Mode toggle — preserves behavioral props ──
  function handleModeToggle(newMode: ToastMode) {
    setMode(newMode);
    setConfig({
      ...toastModePresets[newMode],
      ...extractBehavioral(config),
    });
  }

  // ── Reset — preserves behavioral props ──
  function handleReset() {
    setConfig({
      ...toastModePresets[mode],
      ...extractBehavioral(config),
    });
  }

  // ── Generated code (memoized) ──
  const jsxCode = useMemo(() => generateToastJSX(config), [config]);
  const cssCode = useMemo(() => generateToastCSS(config), [config]);

  // ── Stage background ──
  const stageStyle =
    mode === "light"
      ? {
          background: "#f0eff8",
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(107,92,231,0.06) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(0,184,148,0.04) 0%, transparent 50%),
            linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, 24px 24px, 24px 24px",
        }
      : {
          background: "#0c0c0f",
          backgroundImage: `
            radial-gradient(circle at 25% 15%, rgba(124,108,252,0.07) 0%, transparent 50%),
            radial-gradient(circle at 75% 85%, rgba(0,212,170,0.04) 0%, transparent 50%)
          `,
        };

  return (
    <ResizablePlayground
      componentName="Toast"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · variant, content & behavior preserved"
      preview={<ToastPreview config={config} />}
      controls={
        <ToastControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
