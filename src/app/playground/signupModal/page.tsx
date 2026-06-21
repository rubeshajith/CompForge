"use client";

// /app/playground/signupModal/page.tsx

import { useState, useMemo } from "react";
import {
  SignupModalConfig,
  SignupModalMode,
  signupModalModePresets,
  darkSignupModalConfig,
} from "@/lib/signupModalConfig";
import {
  generateSignupModalJSX,
  generateSignupModalCSS,
  generateSignupModalTSX,
  generateSignupModalTailwind,
} from "@/lib/generateSignupModalCode";
import { SignupModalPreview } from "@/components/playground/SignupModalPreview";
import { SignupModalControlPanel } from "@/components/playground/SignupModalControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";

export default function SignupModalPlayground() {
  const [mode, setMode] = useState<SignupModalMode>("dark");
  const [config, setConfig] = useState<SignupModalConfig>(
    darkSignupModalConfig,
  );

  function handleChange(patch: Partial<SignupModalConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: SignupModalMode) {
    setMode(newMode);
    // Preserve dynamic/behavioral fields when switching theme
    setConfig({
      ...signupModalModePresets[newMode],
      customFields: config.customFields,
      customDropdowns: config.customDropdowns,
      showFullName: config.showFullName,
      showEmail: config.showEmail,
      showPassword: config.showPassword,
      showPasswordStrength: config.showPasswordStrength,
      showTermsCheckbox: config.showTermsCheckbox,
      showSocialButtons: config.showSocialButtons,
      headingText: config.headingText,
      subheadingText: config.subheadingText,
      ctaLabel: config.ctaLabel,
    });
  }

  function handleReset() {
    setConfig({
      ...signupModalModePresets[mode],
      customFields: config.customFields,
      customDropdowns: config.customDropdowns,
    });
  }

  const jsxCode = useMemo(() => generateSignupModalJSX(config), [config]);
  const cssCode = useMemo(() => generateSignupModalCSS(config), [config]);
  const tsxCode = useMemo(() => generateSignupModalTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateSignupModalTailwind(config),
    [config],
  );
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
      componentName="Signup Modal"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · custom fields & text preserved"
      preview={<SignupModalPreview config={config} />}
      controls={
        <SignupModalControlPanel
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
