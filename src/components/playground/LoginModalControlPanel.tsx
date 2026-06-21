"use client";

// /components/playground/LoginModalControlPanel.tsx

import { useMemo } from "react";
import { LoginModalConfig } from "@/lib/loginModalConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: LoginModalConfig;
  onChange: (patch: Partial<LoginModalConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function LoginModalControlPanel({ config, onChange, onReset }: Props) {
  const debouncedChange = useMemo(() => debounce(onChange, 80), [onChange]);

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ───────────────────────────────────────── */}
      <Section title="Container">
        <SliderRow
          label="Width"
          value={config.modalWidth}
          min={360}
          max={640}
          unit="px"
          onChange={(v) => debouncedChange({ modalWidth: v })}
          onChangeEnd={(v) => onChange({ modalWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={config.modalBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => debouncedChange({ modalBorderRadius: v })}
          onChangeEnd={(v) => onChange({ modalBorderRadius: v })}
        />
        <ColorRow
          label="Background"
          value={config.modalBackground}
          onChange={(v) => onChange({ modalBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.modalBorderColor}
          onChange={(v) => onChange({ modalBorderColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Show Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
      </Section>

      {/* ── Branding ────────────────────────────────────────── */}
      <Section title="Branding">
        <ToggleRow
          label="Show Header"
          value={config.showBrandingHeader}
          onChange={(v) => onChange({ showBrandingHeader: v })}
        />
        <ColorRow
          label="Accent Color"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Icon Color"
          value={config.accentIconColor}
          onChange={(v) => onChange({ accentIconColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Heading"
          value={config.headingColor}
          onChange={(v) => onChange({ headingColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Subheading"
          value={config.subheadingColor}
          onChange={(v) => onChange({ subheadingColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Social Buttons ───────────────────────────────────── */}
      <Section title="Social Buttons">
        <ToggleRow
          label="Show Social Buttons"
          value={config.showSocialButtons}
          onChange={(v) => onChange({ showSocialButtons: v })}
        />
        <ColorRow
          label="Background"
          value={config.socialButtonBackground}
          onChange={(v) => onChange({ socialButtonBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.socialButtonBorderColor}
          onChange={(v) => onChange({ socialButtonBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.socialButtonTextColor}
          onChange={(v) => onChange({ socialButtonTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Input Styling ────────────────────────────────────── */}
      <Section title="Input Styling">
        <ColorRow
          label="Input Background"
          value={config.inputBackground}
          onChange={(v) => onChange({ inputBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.inputBorderColor}
          onChange={(v) => onChange({ inputBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Focus Border"
          value={config.inputFocusBorderColor}
          onChange={(v) => onChange({ inputFocusBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.inputTextColor}
          onChange={(v) => onChange({ inputTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Placeholder"
          value={config.inputPlaceholderColor}
          onChange={(v) => onChange({ inputPlaceholderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Label"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Input Radius"
          value={config.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => debouncedChange({ inputBorderRadius: v })}
          onChangeEnd={(v) => onChange({ inputBorderRadius: v })}
        />
      </Section>

      {/* ── Behaviour ────────────────────────────────────────── */}
      <Section title="Behaviour">
        <ToggleRow
          label="Forgot Password Link"
          value={config.showForgotPassword}
          onChange={(v) => onChange({ showForgotPassword: v })}
        />
        <ColorRow
          label="Forgot Password Color"
          value={config.forgotPasswordColor}
          onChange={(v) => onChange({ forgotPasswordColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Remember Me"
          value={config.showRememberMe}
          onChange={(v) => onChange({ showRememberMe: v })}
        />
        <ColorRow
          label="Remember Me Text"
          value={config.rememberMeColor}
          onChange={(v) => onChange({ rememberMeColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── CTA Button ──────────────────────────────────────── */}
      <Section title="CTA Button">
        <ColorRow
          label="Background"
          value={config.ctaBackground}
          onChange={(v) => onChange({ ctaBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text Color"
          value={config.ctaTextColor}
          onChange={(v) => onChange({ ctaTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Radius"
          value={config.ctaBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => debouncedChange({ ctaBorderRadius: v })}
          onChangeEnd={(v) => onChange({ ctaBorderRadius: v })}
        />
      </Section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Section title="Footer">
        <ColorRow
          label="Background"
          value={config.footerBackground}
          onChange={(v) => onChange({ footerBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text Color"
          value={config.footerTextColor}
          onChange={(v) => onChange({ footerTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Typography ───────────────────────────────────────── */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={config.fontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => debouncedChange({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
