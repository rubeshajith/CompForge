"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /app/playground/emailTemplate/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import {
  EmailTemplateConfig,
  EmailTemplateMode,
  emailTemplateModePresets,
  darkEmailTemplateConfig,
} from "@/lib/emailTemplateConfig";
import { generateEmailTemplateHTML } from "@/lib/generateEmailTemplate";
import { EmailTemplatePreview } from "@/components/playground/EmailTemplatePreview";
import { EmailTemplateControlPanel } from "@/components/playground/EmailTemplateControlPanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

// ── Code Panel adapter ────────────────────────────────────────────────────────
// Email templates generate a single HTML string (inline CSS, no separate CSS
// file). We display it in the JSX slot and leave the CSS slot empty / hidden.
// ─────────────────────────────────────────────────────────────────────────────

import { CodePanel } from "@/components/playground/CodePanel";

export default function EmailTemplatePlayground() {
  const [mode, setMode] = useState<EmailTemplateMode>("dark");
  const [config, setConfig] = useState<EmailTemplateConfig>(
    darkEmailTemplateConfig,
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(patch: Partial<EmailTemplateConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: EmailTemplateMode) {
    setMode(newMode);
    // Preserve the active template variant when switching themes
    setConfig({
      ...emailTemplateModePresets[newMode],
      variant: config.variant,
    });
  }

  function handleReset() {
    setConfig({
      ...emailTemplateModePresets[mode],
      variant: config.variant,
    });
  }

  // ── Generated code ────────────────────────────────────────────────────────
  // Email templates are pure HTML + inline CSS — no separate CSS file needed.
  // We pass the HTML as the "jsx" slot and an empty string for the CSS slot so
  // the existing CodePanel renders correctly with just one tab active.

  const htmlCode = useMemo(() => generateEmailTemplateHTML(config), [config]);

  // ── Stage background ─────────────────────────────────────────────────────

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
      componentName="Email Templates"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · template variant preserved"
      preview={<EmailTemplatePreview config={config} />}
      controls={
        <EmailTemplateControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={htmlCode} css="" />}
    />
  );
}
