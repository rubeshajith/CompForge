"use client";

// /app/playground/loginModal/page.tsx

import { useState, useMemo } from "react";
import {
  LoginModalConfig,
  LoginModalMode,
  loginModalModePresets,
  darkLoginModalConfig,
} from "@/lib/loginModalConfig";
import {
  generateLoginModalJSX,
  generateLoginModalCSS,
} from "@/lib/generateLoginModalCode";
import { LoginModalPreview } from "@/components/playground/LoginModalPreview";
import { LoginModalControlPanel } from "@/components/playground/LoginModalControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function LoginModalPlayground() {
  const [mode, setMode] = useState<LoginModalMode>("dark");
  const [config, setConfig] = useState<LoginModalConfig>(darkLoginModalConfig);

  function handleChange(patch: Partial<LoginModalConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: LoginModalMode) {
    setMode(newMode);
    // Preserve behavioral/text props across theme switch
    setConfig({
      ...loginModalModePresets[newMode],
      headingText: config.headingText,
      subheadingText: config.subheadingText,
      ctaLabel: config.ctaLabel,
      rememberMeText: config.rememberMeText,
      showBrandingHeader: config.showBrandingHeader,
      showSocialButtons: config.showSocialButtons,
      showForgotPassword: config.showForgotPassword,
      showRememberMe: config.showRememberMe,
    });
  }

  function handleReset() {
    setConfig({
      ...loginModalModePresets[mode],
      headingText: config.headingText,
      subheadingText: config.subheadingText,
      ctaLabel: config.ctaLabel,
      rememberMeText: config.rememberMeText,
      showBrandingHeader: config.showBrandingHeader,
      showSocialButtons: config.showSocialButtons,
      showForgotPassword: config.showForgotPassword,
      showRememberMe: config.showRememberMe,
    });
  }

  const jsxCode = useMemo(() => generateLoginModalJSX(config), [config]);
  const cssCode = useMemo(() => generateLoginModalCSS(config), [config]);

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
      componentName="Login Modal"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · text & toggles preserved"
      preview={<LoginModalPreview config={config} />}
      controls={
        <LoginModalControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
        />
      }
      code={<CodePanel jsx={jsxCode} css={cssCode} />}
    />
  );
}
