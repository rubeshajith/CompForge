"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EmailTemplateControlPanel.tsx
// Right-side control panel for the Email Template playground.
// Top section: variant switcher (Order Summary / Review / Shipped)
// Below: color + style controls via shared ControlHelpers
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import {
  EmailTemplateConfig,
  EmailTemplateVariant,
} from "@/lib/emailTemplateConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "@/components/ui/ControlPanel.module.css";

interface EmailTemplateControlPanelProps {
  config: EmailTemplateConfig;
  onChange: (patch: Partial<EmailTemplateConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const VARIANTS: { value: EmailTemplateVariant; label: string; icon: string }[] =
  [
    { value: "orderSummary", label: "Order Summary", icon: "🧾" },
    { value: "reviewRequest", label: "Review Request", icon: "⭐" },
    { value: "orderShipped", label: "Order Shipped", icon: "📦" },
    { value: "welcomeOnboard", label: "Welcome / Onboard", icon: "🎉" },
    { value: "flashSale", label: "Flash Sale", icon: "⚡" },
    { value: "refundProcessed", label: "Refund Processed", icon: "↩️" },
  ];

export function EmailTemplateControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: EmailTemplateControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  // Keep local in sync when parent resets
  useMemo(() => setLocalConfig(config), [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSliderChange(patch: Partial<EmailTemplateConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<EmailTemplateConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Switcher ────────────────────────────────────────────── */}
      <Section title="Template">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "4px 0 8px",
          }}
        >
          {VARIANTS.map((v) => {
            const active = localConfig.variant === v.value;
            return (
              <button
                key={v.value}
                onClick={() => handleImmediate({ variant: v.value })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 14px",
                  background: active ? "#7c6cfc22" : "transparent",
                  border: `1px solid ${active ? "#7c6cfc" : "#2a2a38"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>
                  {v.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#9d91fd" : "#9090a8",
                  }}
                >
                  {v.label}
                </span>
                {active && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#7c6cfc",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Layout ─────────────────────────────────────────────────────── */}
      <Section title="Layout">
        <SliderRow
          label="Card Width"
          value={localConfig.cardWidth}
          min={480}
          max={680}
          unit="px"
          onChange={(v) => handleSliderChange({ cardWidth: v })}
          onChangeEnd={(v) => onChange({ cardWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.cardBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSliderChange({ cardBorderRadius: v })}
          onChangeEnd={(v) => onChange({ cardBorderRadius: v })}
        />
        <ToggleRow
          label="Drop Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>

      {/* ── Colors: Background ─────────────────────────────────────────── */}
      <Section title="Backgrounds">
        <ColorRow
          label="Email BG"
          value={localConfig.emailBackground}
          onChange={(v) => handleImmediate({ emailBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Card BG"
          value={localConfig.cardBackground}
          onChange={(v) => handleImmediate({ cardBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Header BG"
          value={localConfig.headerBackground}
          onChange={(v) => handleImmediate({ headerBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Row BG"
          value={localConfig.tableRowBackground}
          onChange={(v) => handleImmediate({ tableRowBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Alt Row BG"
          value={localConfig.tableAltRowBackground}
          onChange={(v) => handleImmediate({ tableAltRowBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer BG"
          value={localConfig.footerBackground}
          onChange={(v) => handleImmediate({ footerBackground: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Colors: Typography ─────────────────────────────────────────── */}
      <Section title="Typography">
        <ColorRow
          label="Heading"
          value={localConfig.headingTextColor}
          onChange={(v) => handleImmediate({ headingTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Body Text"
          value={localConfig.bodyTextColor}
          onChange={(v) => handleImmediate({ bodyTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Muted Text"
          value={localConfig.mutedTextColor}
          onChange={(v) => handleImmediate({ mutedTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Logo"
          value={localConfig.logoTextColor}
          onChange={(v) => handleImmediate({ logoTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer Text"
          value={localConfig.footerTextColor}
          onChange={(v) => handleImmediate({ footerTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Colors: Accent ─────────────────────────────────────────────── */}
      <Section title="Accent & Borders">
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Button Text"
          value={localConfig.accentTextColor}
          onChange={(v) => handleImmediate({ accentTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Card Border"
          value={localConfig.cardBorderColor}
          onChange={(v) => handleImmediate({ cardBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Divider"
          value={localConfig.dividerColor}
          onChange={(v) => handleImmediate({ dividerColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Template-specific ──────────────────────────────────────────── */}
      {localConfig.variant === "reviewRequest" && (
        <Section title="Star Rating">
          <ColorRow
            label="Filled Star"
            value={localConfig.starFilledColor}
            onChange={(v) => handleImmediate({ starFilledColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Empty Star"
            value={localConfig.starEmptyColor}
            onChange={(v) => handleImmediate({ starEmptyColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {localConfig.variant === "orderShipped" && (
        <Section title="Tracking Badge">
          <ColorRow
            label="Badge BG"
            value={localConfig.trackingBadgeBackground}
            onChange={(v) => handleImmediate({ trackingBadgeBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Badge Text"
            value={localConfig.trackingBadgeTextColor}
            onChange={(v) => handleImmediate({ trackingBadgeTextColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {localConfig.variant === "welcomeOnboard" && (
        <Section title="Feature Pills">
          <ColorRow
            label="Pill BG"
            value={localConfig.featurePillBackground}
            onChange={(v) => handleImmediate({ featurePillBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Pill Text"
            value={localConfig.featurePillTextColor}
            onChange={(v) => handleImmediate({ featurePillTextColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {localConfig.variant === "flashSale" && (
        <Section title="Sale & Coupon">
          <ColorRow
            label="Sale Badge BG"
            value={localConfig.saleBadgeBackground}
            onChange={(v) => handleImmediate({ saleBadgeBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Sale Badge Text"
            value={localConfig.saleBadgeTextColor}
            onChange={(v) => handleImmediate({ saleBadgeTextColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Coupon BG"
            value={localConfig.couponBlockBackground}
            onChange={(v) => handleImmediate({ couponBlockBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Coupon Border"
            value={localConfig.couponBorderColor}
            onChange={(v) => handleImmediate({ couponBorderColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Coupon Text"
            value={localConfig.couponTextColor}
            onChange={(v) => handleImmediate({ couponTextColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {localConfig.variant === "refundProcessed" && (
        <Section title="Refund Status">
          <ColorRow
            label="Status BG"
            value={localConfig.refundStatusBackground}
            onChange={(v) => handleImmediate({ refundStatusBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Status Text"
            value={localConfig.refundStatusTextColor}
            onChange={(v) => handleImmediate({ refundStatusTextColor: v })}
            isDark={isDark}
/>
        </Section>
      )}
    </ControlPanelShell>
  );
}
