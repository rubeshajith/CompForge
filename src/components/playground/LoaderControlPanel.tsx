"use client";

import { useMemo } from "react";
import { LoaderConfig, LOADER_VARIANTS } from "@/lib/loaderConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "./CodePanel.module.css";

interface Props {
  config: LoaderConfig;
  onChange: (patch: Partial<LoaderConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function LoaderControlPanel({ config, onChange, onReset }: Props) {
  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Tabs ── */}
      <Section title="Variant">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            padding: "4px 0",
          }}
        >
          {LOADER_VARIANTS.map(({ id, label }) => {
            const active = config.variant === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ variant: id })}
                style={{
                  padding: "6px 4px",
                  borderRadius: 6,
                  border: active
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                  background: active ? "var(--accent-dim)" : "var(--bg-3)",
                  color: active
                    ? "var(--accent-light)"
                    : "var(--text-secondary)",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  textAlign: "center",
                  lineHeight: 1.3,
                  transition: "all 0.15s ease",
                  fontWeight: active ? 600 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Colors ── */}
      <Section title="Colors">
        <ColorRow
          label="Primary"
          value={config.primaryColor}
          onChange={(v) => onChange({ primaryColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Secondary"
          value={config.secondaryColor}
          onChange={(v) => onChange({ secondaryColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Sizing ── */}
      <Section title="Sizing">
        <SliderRow
          label="Size"
          value={config.size}
          min={32}
          max={120}
          unit="px"
          onChange={(v) => debouncedOnChange({ size: v })}
          onChangeEnd={(v) => onChange({ size: v })}
        />
        <SliderRow
          label="Stroke"
          value={config.strokeWidth}
          min={1}
          max={10}
          unit="px"
          onChange={(v) => debouncedOnChange({ strokeWidth: v })}
          onChangeEnd={(v) => onChange({ strokeWidth: v })}
        />
      </Section>

      {/* ── Animation ── */}
      <Section title="Animation">
        <SliderRow
          label="Speed"
          value={config.speed}
          min={0.4}
          max={3.0}
          unit="×"
          onChange={(v) => debouncedOnChange({ speed: v })}
          onChangeEnd={(v) => onChange({ speed: v })}
        />
      </Section>

      {/* ── Label ── */}
      <Section title="Label">
        <ToggleRow
          label="Show label"
          value={config.showLabel}
          onChange={(v) => onChange({ showLabel: v })}
        />
        {config.showLabel && (
          <>
            <div className={styles.row}>
              <span className={styles.label}>Text</span>
              <input
                type="text"
                value={config.labelText}
                maxLength={32}
                onChange={(e) => onChange({ labelText: e.target.value })}
                style={{
                  background: "var(--bg-3)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  padding: "4px 8px",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>
            <ColorRow
              label="Label color"
              value={config.labelColor}
              onChange={(v) => onChange({ labelColor: v })}
              isDark={isDark}
/>
          </>
        )}
      </Section>
    </ControlPanelShell>
  );
}
