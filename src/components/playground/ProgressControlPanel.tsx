"use client";

import { useMemo, useState } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import type { ProgressConfig, ProgressVariant } from "@/lib/progressConfig";
import { progressVariantLabels } from "@/lib/progressConfig";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/ControlPanel.module.css";

interface ProgressControlPanelProps {
  config: ProgressConfig;
  onChange: (patch: Partial<ProgressConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const ALL_VARIANTS = Object.keys(progressVariantLabels) as ProgressVariant[];

export function ProgressControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: ProgressControlPanelProps) {
  const [localConfig, setLocalConfig] = useState<ProgressConfig>(config);

  // Sync local when external config changes (e.g. mode switch)
  useMemo(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(patch: Partial<ProgressConfig>) {
    const next = { ...localConfig, ...patch };
    setLocalConfig(next);
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<ProgressConfig>) {
    const next = { ...localConfig, ...patch };
    setLocalConfig(next);
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Selector ────────────────────────────────────── */}
      <Section title="Variant">
        <div
          className={styles.row}
          style={{ flexDirection: "column", alignItems: "stretch", gap: 0 }}
        >
          <span className={styles.label} style={{ marginBottom: 8 }}>
            Type
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: 280,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {ALL_VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => handleImmediate({ variant: v })}
                style={{
                  textAlign: "left",
                  padding: "7px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: "'DM Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background:
                    localConfig.variant === v
                      ? "var(--accent-dim, #7c6cfc22)"
                      : "transparent",
                  border: `1px solid ${localConfig.variant === v ? "var(--accent, #7c6cfc)" : "transparent"}`,
                  color:
                    localConfig.variant === v
                      ? "var(--accent-light, #9d91fd)"
                      : "var(--text-secondary, #9090a8)",
                  fontWeight: localConfig.variant === v ? 500 : 400,
                }}
              >
                {progressVariantLabels[v]}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Value ───────────────────────────────────────────────── */}
      <Section title="Progress Value">
        <SliderRow
          label="Value"
          value={localConfig.value}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => handleSlider({ value: v })}
          onChangeEnd={(v) => onChange({ value: v })}
        />
      </Section>

      {/* ── Colors ──────────────────────────────────────────────── */}
      <Section title="Colors">
        <ColorRow
          label="Accent Primary"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Secondary"
          value={localConfig.accentSecondary}
          onChange={(v) => handleImmediate({ accentSecondary: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Tertiary"
          value={localConfig.accentTertiary}
          onChange={(v) => handleImmediate({ accentTertiary: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Track / BG"
          value={localConfig.trackColor}
          onChange={(v) => handleImmediate({ trackColor: v })}
        />
        <ColorRow
          label="Surface"
          value={localConfig.backgroundColor}
          onChange={(v) => handleImmediate({ backgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate({ borderColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Text Colors ─────────────────────────────────────────── */}
      <Section title="Text">
        <ColorRow
          label="Label Color"
          value={localConfig.labelColor}
          onChange={(v) => handleImmediate({ labelColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Muted Color"
          value={localConfig.mutedColor}
          onChange={(v) => handleImmediate({ mutedColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Value Color"
          value={localConfig.valueColor}
          onChange={(v) => handleImmediate({ valueColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={10}
          max={18}
          unit="px"
          onChange={(v) => handleSlider({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>

      {/* ── Status Colors ───────────────────────────────────────── */}
      <Section title="Status Colors">
        <ColorRow
          label="Success"
          value={localConfig.successColor}
          onChange={(v) => handleImmediate({ successColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Warning"
          value={localConfig.warningColor}
          onChange={(v) => handleImmediate({ warningColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Danger"
          value={localConfig.dangerColor}
          onChange={(v) => handleImmediate({ dangerColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Dimensions ──────────────────────────────────────────── */}
      <Section title="Dimensions">
        <SliderRow
          label="Bar Height"
          value={localConfig.barHeight}
          min={2}
          max={20}
          unit="px"
          onChange={(v) => handleSlider({ barHeight: v })}
          onChangeEnd={(v) => onChange({ barHeight: v })}
        />
        <SliderRow
          label="Ring Size"
          value={localConfig.ringSize}
          min={60}
          max={160}
          unit="px"
          onChange={(v) => handleSlider({ ringSize: v })}
          onChangeEnd={(v) => onChange({ ringSize: v })}
        />
        <SliderRow
          label="Stroke Width"
          value={localConfig.strokeWidth}
          min={2}
          max={20}
          unit="px"
          onChange={(v) => handleSlider({ strokeWidth: v })}
          onChangeEnd={(v) => onChange({ strokeWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider({ borderRadius: v })}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
      </Section>

      {/* ── Options ─────────────────────────────────────────────── */}
      <Section title="Options">
        <ToggleRow
          label="Show Label"
          value={localConfig.showLabel}
          onChange={(v) => handleImmediate({ showLabel: v })}
        />
        <ToggleRow
          label="Show Value"
          value={localConfig.showValue}
          onChange={(v) => handleImmediate({ showValue: v })}
        />
        <ToggleRow
          label="Animated"
          value={localConfig.animated}
          onChange={(v) => handleImmediate({ animated: v })}
        />
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
