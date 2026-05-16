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
        />
        <ColorRow
          label="Border"
          value={config.modalBorderColor}
          onChange={(v) => onChange({ modalBorderColor: v })}
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
        />
        <ColorRow
          label="Icon Color"
          value={config.accentIconColor}
          onChange={(v) => onChange({ accentIconColor: v })}
        />
        <ColorRow
          label="Heading"
          value={config.headingColor}
          onChange={(v) => onChange({ headingColor: v })}
        />
        <ColorRow
          label="Subheading"
          value={config.subheadingColor}
          onChange={(v) => onChange({ subheadingColor: v })}
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
        />
        <ColorRow
          label="Border"
          value={config.socialButtonBorderColor}
          onChange={(v) => onChange({ socialButtonBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={config.socialButtonTextColor}
          onChange={(v) => onChange({ socialButtonTextColor: v })}
        />
      </Section>

      {/* ── Input Styling ────────────────────────────────────── */}
      <Section title="Input Styling">
        <ColorRow
          label="Input Background"
          value={config.inputBackground}
          onChange={(v) => onChange({ inputBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.inputBorderColor}
          onChange={(v) => onChange({ inputBorderColor: v })}
        />
        <ColorRow
          label="Focus Border"
          value={config.inputFocusBorderColor}
          onChange={(v) => onChange({ inputFocusBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={config.inputTextColor}
          onChange={(v) => onChange({ inputTextColor: v })}
        />
        <ColorRow
          label="Placeholder"
          value={config.inputPlaceholderColor}
          onChange={(v) => onChange({ inputPlaceholderColor: v })}
        />
        <ColorRow
          label="Label"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
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
        />
      </Section>

      {/* ── CTA Button ──────────────────────────────────────── */}
      <Section title="CTA Button">
        <ColorRow
          label="Background"
          value={config.ctaBackground}
          onChange={(v) => onChange({ ctaBackground: v })}
        />
        <ColorRow
          label="Text Color"
          value={config.ctaTextColor}
          onChange={(v) => onChange({ ctaTextColor: v })}
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
        />
        <ColorRow
          label="Text Color"
          value={config.footerTextColor}
          onChange={(v) => onChange({ footerTextColor: v })}
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
