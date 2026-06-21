"use client";

import { DashboardConfig, accentPresets } from "@/lib/dashboardConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
} from "@/components/ui/ControlHelpers";
import styles from "@/components/playground/ControlPanel.module.css";

interface DashboardControlPanelProps {
  config: DashboardConfig;
  onChange: (patch: Partial<DashboardConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function DashboardControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: DashboardControlPanelProps) {
  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Theme Color">
        {/* Preset swatches */}
        <div
          className={styles.row}
          style={{ flexDirection: "column", gap: 10 }}
        >
          <span className={styles.label}>Accent Preset</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {accentPresets.map((preset) => {
              const isActive = config.accentColor === preset.color;
              return (
                <button
                  key={preset.color}
                  title={preset.label}
                  onClick={() => onChange({ accentColor: preset.color })}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    padding: "8px 4px",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                    border: isActive
                      ? `1.5px solid ${preset.color}`
                      : "1.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: preset.color,
                      boxShadow: isActive
                        ? `0 0 8px ${preset.color}88`
                        : "none",
                      transition: "box-shadow 0.15s",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: isActive
                        ? preset.color
                        : "var(--text-secondary, #9090a8)",
                      letterSpacing: "0.03em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom color picker */}
        <ColorRow
          label="Custom Color"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
