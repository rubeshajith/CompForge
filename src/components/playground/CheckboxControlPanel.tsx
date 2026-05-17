"use client";

import { useState, useMemo } from "react";
import {
  CheckboxConfig,
  CheckboxVariant,
  CHECKBOX_VARIANTS,
  VARIANT_LABELS,
  VARIANT_DESCRIPTIONS,
} from "@/lib/checkboxConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import styles from "@/components/playground/ControlPanel.module.css";
import { debounce } from "@/utils/debounce";

interface Props {
  config: CheckboxConfig;
  onChange: (patch: Partial<CheckboxConfig>) => void;
  onReset: () => void;
}

export function CheckboxControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof CheckboxConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }
  function handleSliderEnd(key: keyof CheckboxConfig, value: number) {
    onChange({ [key]: value });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Picker ────────────────────────────────────────────── */}
      <Section title="Variant">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CHECKBOX_VARIANTS.map((variant) => {
            const active = config.variant === variant;
            return (
              <button
                key={variant}
                onClick={() => onChange({ variant })}
                style={{
                  width: "100%",
                  background: active ? `${config.accentColor}22` : "#141418",
                  border: `1px solid ${active ? config.accentColor : "#2a2a38"}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? config.accentColor : "#f0f0f5",
                      fontFamily: "Instrument Sans, sans-serif",
                    }}
                  >
                    {VARIANT_LABELS[variant]}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: active ? `${config.accentColor}cc` : "#5a5a72",
                      fontFamily: "Instrument Sans, sans-serif",
                    }}
                  >
                    {VARIANT_DESCRIPTIONS[variant]}
                  </span>
                </div>
                {active && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke={config.accentColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Geometry ─────────────────────────────────────────────────── */}
      <Section title="Geometry">
        <SliderRow
          label="Size"
          value={localConfig.size}
          min={16}
          max={36}
          unit="px"
          onChange={(v) => handleSlider("size", v)}
          onChangeEnd={(v) => handleSliderEnd("size", v)}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("borderRadius", v)}
        />
        <SliderRow
          label="Border Width"
          value={localConfig.uncheckedBorderWidth}
          min={1}
          max={4}
          unit="px"
          onChange={(v) => handleSlider("uncheckedBorderWidth", v)}
          onChangeEnd={(v) => handleSliderEnd("uncheckedBorderWidth", v)}
        />
      </Section>

      {/* ── Unchecked State ───────────────────────────────────────────── */}
      <Section title="Unchecked State">
        <ColorRow
          label="Background"
          value={config.uncheckedBackground}
          onChange={(v) => onChange({ uncheckedBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.uncheckedBorderColor}
          onChange={(v) => onChange({ uncheckedBorderColor: v })}
        />
      </Section>

      {/* ── Checked State ─────────────────────────────────────────────── */}
      <Section title="Checked State">
        <ColorRow
          label="Background"
          value={config.checkedBackground}
          onChange={(v) => onChange({ checkedBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.checkedBorderColor}
          onChange={(v) => onChange({ checkedBorderColor: v })}
        />
        <ColorRow
          label="Checkmark"
          value={config.checkmarkColor}
          onChange={(v) => onChange({ checkmarkColor: v })}
        />
      </Section>

      {/* ── Accent ───────────────────────────────────────────────────── */}
      <Section title="Accent (Ripple · Neon · Glitch)">
        <ColorRow
          label="Primary"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
        <ColorRow
          label="Secondary"
          value={config.accentSecondary}
          onChange={(v) => onChange({ accentSecondary: v })}
        />
      </Section>

      {/* ── Label ────────────────────────────────────────────────────── */}
      <Section title="Label">
        <ColorRow
          label="Color"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.labelFontSize}
          min={11}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("labelFontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("labelFontSize", v)}
        />
        <SliderRow
          label="Gap"
          value={localConfig.labelGap}
          min={4}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("labelGap", v)}
          onChangeEnd={(v) => handleSliderEnd("labelGap", v)}
        />
        <ToggleRow
          label="Show Labels"
          value={config.showLabels}
          onChange={(v) => onChange({ showLabels: v })}
        />
      </Section>

      {/* ── Layout ───────────────────────────────────────────────────── */}
      <Section title="Layout">
        <SliderRow
          label="Item Gap"
          value={localConfig.itemGap}
          min={8}
          max={40}
          unit="px"
          onChange={(v) => handleSlider("itemGap", v)}
          onChangeEnd={(v) => handleSliderEnd("itemGap", v)}
        />
      </Section>
    </ControlPanelShell>
  );
}
