"use client";

// /components/playground/KpiCardControlPanel.tsx

import { useMemo, useState } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { KpiCardConfig, KpiChartVariant } from "@/lib/kpiCardConfig";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/ControlPanel.module.css";

interface Props {
  config: KpiCardConfig;
  onChange: (patch: Partial<KpiCardConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const CHART_VARIANTS: { value: KpiChartVariant; label: string }[] = [
  { value: "sparkline", label: "Sparkline" },
  { value: "bar", label: "Bar" },
  { value: "donut", label: "Donut" },
  { value: "progress", label: "Progress" },
  { value: "area", label: "Area" },
];

export function KpiCardControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(patch: Partial<KpiCardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<KpiCardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  // Keep localConfig in sync when parent config changes (e.g. mode switch)
  useMemo(() => setLocalConfig(config), [config]);

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Chart variant selector */}
      <Section title="Chart Variant">
        <div
          className={styles.row}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <span className={styles.label}>Type</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 4,
            }}
          >
            {CHART_VARIANTS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleImmediate({ chartVariant: value })}
                style={{
                  padding: "6px 4px",
                  borderRadius: 8,
                  border:
                    localConfig.chartVariant === value
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  background:
                    localConfig.chartVariant === value
                      ? "var(--accent-dim)"
                      : "var(--bg-3)",
                  color:
                    localConfig.chartVariant === value
                      ? "var(--accent-light)"
                      : "var(--text-secondary)",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Content */}
      <Section title="Content">
        <div className={styles.row}>
          <span className={styles.label}>Label</span>
          <input
            type="text"
            value={localConfig.label}
            onChange={(e) => handleImmediate({ label: e.target.value })}
            style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "var(--text-primary)",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              width: "100%",
              outline: "none",
            }}
          />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Value</span>
          <input
            type="text"
            value={localConfig.value}
            onChange={(e) => handleImmediate({ value: e.target.value })}
            style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "var(--text-primary)",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              width: "100%",
              outline: "none",
            }}
          />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Sub-text</span>
          <input
            type="text"
            value={localConfig.subText}
            onChange={(e) => handleImmediate({ subText: e.target.value })}
            style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "var(--text-primary)",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              width: "100%",
              outline: "none",
            }}
          />
        </div>
        <SliderRow
          label="% Change"
          value={localConfig.percentChange}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => handleSlider({ percentChange: v })}
          onChangeEnd={(v) => onChange({ percentChange: v })}
        />
        <div className={styles.row}>
          <span className={styles.label}>Direction</span>
          <div style={{ display: "flex", gap: 6 }}>
            {(["up", "down"] as const).map((d) => (
              <button
                key={d}
                onClick={() => handleImmediate({ changeDirection: d })}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: 8,
                  border:
                    localConfig.changeDirection === d
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  background:
                    localConfig.changeDirection === d
                      ? "var(--accent-dim)"
                      : "var(--bg-3)",
                  color:
                    localConfig.changeDirection === d
                      ? "var(--accent-light)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {d === "up" ? "▲ Up" : "▼ Down"}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Container */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={localConfig.cardBackground}
          onChange={(v) => handleImmediate({ cardBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.cardBorderColor}
          onChange={(v) => handleImmediate({ cardBorderColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Border Radius"
          value={localConfig.cardBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider({ cardBorderRadius: v })}
          onChangeEnd={(v) => onChange({ cardBorderRadius: v })}
        />
        <SliderRow
          label="Width"
          value={localConfig.cardWidth}
          min={240}
          max={480}
          unit="px"
          onChange={(v) => handleSlider({ cardWidth: v })}
          onChangeEnd={(v) => onChange({ cardWidth: v })}
        />
        <ToggleRow
          label="Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
        <ToggleRow
          label="Glow Effect"
          value={localConfig.glowEffect}
          onChange={(v) => handleImmediate({ glowEffect: v })}
        />
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <ColorRow
          label="Value Color"
          value={localConfig.valueColor}
          onChange={(v) => handleImmediate({ valueColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Label Color"
          value={localConfig.labelColor}
          onChange={(v) => handleImmediate({ labelColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Sub-text Color"
          value={localConfig.subTextColor}
          onChange={(v) => handleImmediate({ subTextColor: v })}
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

      {/* Colors */}
      <Section title="Accent & Chart">
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Dim"
          value={localConfig.accentColorDim}
          onChange={(v) => handleImmediate({ accentColorDim: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Track / Empty"
          value={localConfig.chartTrackColor}
          onChange={(v) => handleImmediate({ chartTrackColor: v })}
        />
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <ToggleRow
          label="Show Badge"
          value={localConfig.showBadge}
          onChange={(v) => handleImmediate({ showBadge: v })}
        />
        <ColorRow
          label="Badge BG"
          value={localConfig.badgeColor}
          onChange={(v) => handleImmediate({ badgeColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Badge Text"
          value={localConfig.badgeTextColor}
          onChange={(v) => handleImmediate({ badgeTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Animation */}
      <Section title="Animation">
        <ToggleRow
          label="Animate Chart"
          value={localConfig.animateChart}
          onChange={(v) => handleImmediate({ animateChart: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
