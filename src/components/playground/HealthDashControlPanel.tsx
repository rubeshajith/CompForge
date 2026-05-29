"use client";

import React, { useState } from "react";
import {
  OmnidashConfig,
  OmnidashTheme,
  omnidashThemePresets,
} from "@/lib/healthDashConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
} from "@/components/ui/ControlHelpers";

interface Props {
  config: OmnidashConfig;
  onChange: (patch: Partial<OmnidashConfig>) => void;
  onReset: () => void;
}

// ─── Theme metadata (label + preview swatch colors) ──────────────────────────
const THEMES: {
  id: Exclude<OmnidashTheme, "custom">;
  label: string;
  accent: string;
  bg: string;
}[] = [
  { id: "emerald", label: "Emerald", accent: "#4edea3", bg: "#131313" },
  { id: "compforge", label: "CompForge", accent: "#7c6cfc", bg: "#0c0c0f" },
  { id: "cobalt", label: "Cobalt", accent: "#38bdf8", bg: "#080e1a" },
  { id: "amber", label: "Amber", accent: "#fbbf24", bg: "#0e0b04" },
  { id: "rose", label: "Rose", accent: "#fb7185", bg: "#120a0e" },
];

export function OmnidashControlPanel({ config, onChange, onReset }: Props) {
  const [activeTheme, setActiveTheme] = useState<OmnidashTheme>("emerald");

  function applyPreset(id: Exclude<OmnidashTheme, "custom">) {
    setActiveTheme(id);
    onChange(omnidashThemePresets[id]);
  }

  function handleCustomAccent(hex: string) {
    setActiveTheme("custom");
    // Keep the current theme's other values but swap the accent + glow
    onChange({ accentColor: hex });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Color Theme">
        {/* Theme swatch grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            padding: "4px 0 12px",
          }}
        >
          {THEMES.map((t) => {
            const isActive = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => applyPreset(t.id)}
                title={t.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 4px",
                  borderRadius: 10,
                  border: isActive
                    ? `2px solid ${t.accent}`
                    : "2px solid transparent",
                  background: isActive ? t.accent + "14" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {/* Mini dashboard preview chip */}
                <div
                  style={{
                    width: 32,
                    height: 24,
                    borderRadius: 6,
                    background: t.bg,
                    border: `1px solid ${t.accent}44`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* fake sidebar stripe */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      background: t.accent + "22",
                    }}
                  />
                  {/* fake accent dot */}
                  <div
                    style={{
                      position: "absolute",
                      right: 4,
                      top: 4,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: t.accent,
                    }}
                  />
                  {/* fake ecg line */}
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      bottom: 5,
                      right: 2,
                      height: 2,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: isActive
                      ? t.accent
                      : "var(--text-secondary, #9090a8)",
                    fontWeight: isActive ? 700 : 400,
                    letterSpacing: "0.02em",
                  }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom accent color row */}
        <ColorRow
          label="Custom Accent"
          value={config.accentColor}
          onChange={handleCustomAccent}
        />

        {/* Active theme accent preview */}
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 8,
            background: config.accentColor + "12",
            border: `1px solid ${config.accentColor}30`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: config.accentColor,
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: config.accentColor,
                letterSpacing: "0.04em",
              }}
            >
              {activeTheme === "custom"
                ? "Custom Theme"
                : THEMES.find((t) => t.id === activeTheme)?.label + " Theme"}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted, #5a5a72)",
                marginTop: 2,
              }}
            >
              {config.accentColor} · applied across all elements
            </div>
          </div>
        </div>
      </Section>
    </ControlPanelShell>
  );
}
