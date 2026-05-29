"use client";

import type { EcommerceDashboardConfig } from "@/lib/ecommerceDashboardConfig";
import {
  ecommerceDashboardThemeLabels,
  ecommerceDashboardThemePresets,
} from "@/lib/ecommerceDashboardConfig";
import { ColorRow, ControlPanelShell, Section } from "@/components/ui/ControlHelpers";

interface EcommerceDashboardControlPanelProps {
  config: EcommerceDashboardConfig;
  onChange: (patch: Partial<EcommerceDashboardConfig>) => void;
  onReset: () => void;
}

const themes = Object.entries(ecommerceDashboardThemePresets);

function customAccentPatch(value: string): Partial<EcommerceDashboardConfig> {
  return {
    theme: "custom",
    accentColor: value,
    accentSoft: value,
    borderColor: `${value}33`,
  };
}

export function EcommerceDashboardControlPanel({
  config,
  onChange,
  onReset,
}: EcommerceDashboardControlPanelProps) {
  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Theme">
        <div style={{ display: "grid", gap: 8 }}>
          {themes.map(([theme, preset]) => {
            const selected = config.theme === theme;

            return (
              <button
                key={theme}
                onClick={() => onChange({ ...preset })}
                style={{
                  alignItems: "center",
                  background: selected ? "var(--bg-4)" : "var(--bg-3)",
                  border: selected ? `1px solid ${preset.accentColor}` : "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  font: "inherit",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  textAlign: "left",
                }}
                type="button"
              >
                <span>{ecommerceDashboardThemeLabels[theme as keyof typeof ecommerceDashboardThemeLabels]}</span>
                <span
                  aria-hidden="true"
                  style={{
                    background: preset.accentColor,
                    borderRadius: 999,
                    boxShadow: `0 0 16px ${preset.accentColor}55`,
                    height: 18,
                    width: 18,
                  }}
                />
              </button>
            );
          })}
        </div>
        <ColorRow
          label="Custom accent"
          value={config.accentColor}
          onChange={(value) => onChange(customAccentPatch(value))}
        />
      </Section>
    </ControlPanelShell>
  );
}
