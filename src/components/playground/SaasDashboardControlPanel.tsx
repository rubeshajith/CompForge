"use client";

import { ColorRow, ControlPanelShell, Section } from "@/components/ui/ControlHelpers";
import {
  SaasDashboardConfig,
  SaasDashboardTheme,
  saasDashboardThemes,
} from "@/lib/saasDashboardConfig";

interface SaasDashboardControlPanelProps {
  config: SaasDashboardConfig;
  onChange: (patch: Partial<SaasDashboardConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const themeOptions: SaasDashboardTheme[] = [
  "omni",
  "compforge",
  "mintOps",
  "blueSignal",
  "rosePulse",
];

export function SaasDashboardControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: SaasDashboardControlPanelProps) {
  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Theme">
        <div style={{ display: "grid", gap: 10 }}>
          {themeOptions.map((themeKey) => {
            const theme = saasDashboardThemes[themeKey];
            const selected = config.theme === themeKey;

            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => onChange({ theme: themeKey, customAccent: theme.accent })}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: selected ? `1px solid ${theme.accent}` : "1px solid var(--border)",
                  background: selected ? `${theme.accent}18` : "var(--bg-3)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>{theme.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {[theme.accent, theme.accent2, theme.accent3].map((color) => (
                    <span
                      key={color}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: color,
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <ColorRow
          label="Custom accent"
          value={config.customAccent}
          onChange={(customAccent) => onChange({ theme: "custom", customAccent })}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
