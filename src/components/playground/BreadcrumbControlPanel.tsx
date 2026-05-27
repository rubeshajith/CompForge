"use client";

import { useState, useMemo } from "react";
import type {
  BreadcrumbConfig,
  BreadcrumbVariant,
} from "@/lib/breadcrumbsConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/ControlPanel.module.css";

interface BreadcrumbControlPanelProps {
  config: BreadcrumbConfig;
  onChange: (patch: Partial<BreadcrumbConfig>) => void;
  onReset: () => void;
}

const VARIANTS: { value: BreadcrumbVariant; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "pill", label: "Pill" },
  { value: "arrow", label: "Arrow" },
  { value: "underline", label: "Underline" },
  { value: "mono", label: "Mono" },
];

export function BreadcrumbControlPanel({
  config,
  onChange,
  onReset,
}: BreadcrumbControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  // Keep localConfig in sync when parent resets or switches mode
  if (
    localConfig.variant !== config.variant ||
    localConfig.fontSize !== config.fontSize ||
    localConfig.borderRadius !== config.borderRadius ||
    localConfig.itemPaddingX !== config.itemPaddingX ||
    localConfig.itemPaddingY !== config.itemPaddingY ||
    localConfig.gap !== config.gap
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof BreadcrumbConfig, value: number) {
    const patch = { [key]: value } as Partial<BreadcrumbConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleSliderEnd(key: keyof BreadcrumbConfig, value: number) {
    const patch = { [key]: value } as Partial<BreadcrumbConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Picker ─────────────────────────────────── */}
      <Section title="Variant">
        <div className={styles.row}>
          <span className={styles.label}>Style</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "4px",
              flex: 1,
            }}
          >
            {VARIANTS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ variant: value })}
                style={{
                  padding: "5px 4px",
                  borderRadius: "6px",
                  border:
                    config.variant === value
                      ? "1px solid #7c6cfc"
                      : "1px solid #2a2a38",
                  background:
                    config.variant === value ? "#7c6cfc22" : "#1c1c22",
                  color: config.variant === value ? "#f0f0f5" : "#9090a8",
                  fontSize: "11px",
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: config.variant === value ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Colors ─────────────────────────────────────────── */}
      <Section title="Colors">
        <ColorRow
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
        />
        <ColorRow
          label="Item BG"
          value={config.itemBackground}
          onChange={(v) => onChange({ itemBackground: v })}
        />
        <ColorRow
          label="Item Hover BG"
          value={config.itemHoverBackground}
          onChange={(v) => onChange({ itemHoverBackground: v })}
        />
        <ColorRow
          label="Active BG"
          value={config.activeBackground}
          onChange={(v) => onChange({ activeBackground: v })}
        />
        <ColorRow
          label="Accent"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
      </Section>

      {/* ── Text ───────────────────────────────────────────── */}
      <Section title="Text">
        <ColorRow
          label="Text"
          value={config.textColor}
          onChange={(v) => onChange({ textColor: v })}
        />
        <ColorRow
          label="Text Hover"
          value={config.textHoverColor}
          onChange={(v) => onChange({ textHoverColor: v })}
        />
        <ColorRow
          label="Active Text"
          value={config.activeTextColor}
          onChange={(v) => onChange({ activeTextColor: v })}
        />
        <ColorRow
          label="Separator"
          value={config.separatorColor}
          onChange={(v) => onChange({ separatorColor: v })}
        />
      </Section>

      {/* ── Border ─────────────────────────────────────────── */}
      <Section title="Border">
        <ColorRow
          label="Border"
          value={config.borderColor}
          onChange={(v) => onChange({ borderColor: v })}
        />
        <ColorRow
          label="Active Border"
          value={config.activeBorderColor}
          onChange={(v) => onChange({ activeBorderColor: v })}
        />
      </Section>

      {/* ── Typography ─────────────────────────────────────── */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("fontSize", v)}
        />
        <SliderRow
          label="Font Weight"
          value={localConfig.fontWeight}
          min={300}
          max={700}
          unit=""
          onChange={(v) => handleSlider("fontWeight", v)}
          onChangeEnd={(v) => handleSliderEnd("fontWeight", v)}
        />
      </Section>

      {/* ── Shape ──────────────────────────────────────────── */}
      <Section title="Shape">
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("borderRadius", v)}
        />
        <SliderRow
          label="Padding X"
          value={localConfig.itemPaddingX}
          min={4}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("itemPaddingX", v)}
          onChangeEnd={(v) => handleSliderEnd("itemPaddingX", v)}
        />
        <SliderRow
          label="Padding Y"
          value={localConfig.itemPaddingY}
          min={2}
          max={14}
          unit="px"
          onChange={(v) => handleSlider("itemPaddingY", v)}
          onChangeEnd={(v) => handleSliderEnd("itemPaddingY", v)}
        />
        <SliderRow
          label="Gap"
          value={localConfig.gap}
          min={0}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("gap", v)}
          onChangeEnd={(v) => handleSliderEnd("gap", v)}
        />
      </Section>

      {/* ── Options ────────────────────────────────────────── */}
      <Section title="Options">
        <ToggleRow
          label="Home Icon"
          value={config.showHomeIcon}
          onChange={(v) => onChange({ showHomeIcon: v })}
        />
        <ToggleRow
          label="Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
        <ToggleRow
          label="Animate"
          value={config.animate}
          onChange={(v) => onChange({ animate: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
