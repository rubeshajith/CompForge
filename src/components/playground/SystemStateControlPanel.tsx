"use client";

import { useMemo, useState } from "react";
import {
  SystemStateConfig,
  SystemStateVariant,
  VARIANT_LABELS,
} from "@/lib/systemStateConfig";
import { debounce } from "@/utils/debounce";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import styles from "@/components/ui/ControlPanel.module.css";

const ALL_VARIANTS = Object.keys(VARIANT_LABELS) as SystemStateVariant[];

interface Props {
  config: SystemStateConfig;
  onChange: (patch: Partial<SystemStateConfig>) => void;
  onReset: () => void;
  mode: "dark" | "light";
}

export function SystemStateControlPanel({
  config,
  onChange,
  onReset,
  mode,
}: Props) {
  const [localConfig, setLocalConfig] = useState(config);
  const isDarkMode = mode === "dark";
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSlider(key: keyof SystemStateConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Selector ── */}
      <Section title="Variant">
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {ALL_VARIANTS.map((v) => {
            const active = config.variant === v;
            return (
              <button
                key={v}
                onClick={() => onChange({ variant: v })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: active
                    ? "1px solid #7c6cfc50"
                    : "1px solid transparent",
                  background: active ? "#7c6cfc18" : "transparent",
                  color: active ? "#9d91fd" : "#5a5a72",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{VARIANT_LABELS[v]}</span>
                {active && (
                  <span
                    style={{
                      fontSize: 10,
                      background: "#7c6cfc30",
                      color: "#9d91fd",
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Card ── */}
      <Section title="Card">
        <ColorRow
          label="Background"
          value={config.cardBackground}
          onChange={(v) => onChange({ cardBackground: v })}
          isDark={isDarkMode}
        />
        <ColorRow
          label="Border"
          value={config.cardBorderColor}
          onChange={(v) => onChange({ cardBorderColor: v })}
          isDark={isDarkMode}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.cardBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider("cardBorderRadius", v)}
          onChangeEnd={(v) => onChange({ cardBorderRadius: v })}
        />
        <SliderRow
          label="Padding"
          value={localConfig.cardPadding}
          min={16}
          max={64}
          unit="px"
          onChange={(v) => handleSlider("cardPadding", v)}
          onChangeEnd={(v) => onChange({ cardPadding: v })}
        />
        <ToggleRow
          label="Show Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
      </Section>

      {/* ── Icon ── */}
      <Section title="Icon">
        <SliderRow
          label="Container Size"
          value={localConfig.iconContainerSize}
          min={40}
          max={100}
          unit="px"
          onChange={(v) => handleSlider("iconContainerSize", v)}
          onChangeEnd={(v) => onChange({ iconContainerSize: v })}
        />
        <SliderRow
          label="Icon Size"
          value={localConfig.iconSize}
          min={16}
          max={56}
          unit="px"
          onChange={(v) => handleSlider("iconSize", v)}
          onChangeEnd={(v) => onChange({ iconSize: v })}
        />
        <SliderRow
          label="Container Radius"
          value={localConfig.iconContainerRadius}
          min={0}
          max={50}
          unit="px"
          onChange={(v) => handleSlider("iconContainerRadius", v)}
          onChangeEnd={(v) => onChange({ iconContainerRadius: v })}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <ColorRow
          label="Title"
          value={config.titleColor}
          onChange={(v) => onChange({ titleColor: v })}
          isDark={isDarkMode}
        />
        <SliderRow
          label="Title Size"
          value={localConfig.titleSize}
          min={14}
          max={28}
          unit="px"
          onChange={(v) => handleSlider("titleSize", v)}
          onChangeEnd={(v) => onChange({ titleSize: v })}
        />
        <ColorRow
          label="Body"
          value={config.bodyColor}
          onChange={(v) => onChange({ bodyColor: v })}
          isDark={isDarkMode}
        />
        <SliderRow
          label="Body Size"
          value={localConfig.bodySize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("bodySize", v)}
          onChangeEnd={(v) => onChange({ bodySize: v })}
        />
        <ColorRow
          label="Label"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
          isDark={isDarkMode}
        />
      </Section>

      {/* ── Primary Button ── */}
      <Section title="Primary Button">
        <ColorRow
          label="Background"
          value={config.primaryBg}
          onChange={(v) => onChange({ primaryBg: v })}
          isDark={isDarkMode}
        />
        <ColorRow
          label="Text"
          value={config.primaryText}
          onChange={(v) => onChange({ primaryText: v })}
          isDark={isDarkMode}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.primaryBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("primaryBorderRadius", v)}
          onChangeEnd={(v) => onChange({ primaryBorderRadius: v })}
        />
      </Section>

      {/* ── Secondary Button ── */}
      <Section title="Secondary Button">
        <ColorRow
          label="Background"
          value={config.secondaryBg}
          onChange={(v) => onChange({ secondaryBg: v })}
          isDark={isDarkMode}
        />
        <ColorRow
          label="Border"
          value={config.secondaryBorderColor}
          onChange={(v) => onChange({ secondaryBorderColor: v })}
          isDark={isDarkMode}
        />
        <ColorRow
          label="Text"
          value={config.secondaryText}
          onChange={(v) => onChange({ secondaryText: v })}
          isDark={isDarkMode}
        />
      </Section>

      {/* ── Log / Code Box ── */}
      <Section title="Log Box">
        <ColorRow
          label="Background"
          value={config.logBoxBackground}
          onChange={(v) => onChange({ logBoxBackground: v })}
          isDark={isDarkMode}
        />
        <ColorRow
          label="Text"
          value={config.logBoxText}
          onChange={(v) => onChange({ logBoxText: v })}
          isDark={isDarkMode}
        />
      </Section>

      {/* ── Animation ── */}
      <Section title="Animation">
        <ToggleRow
          label="Animate In"
          value={config.animateIn}
          onChange={(v) => onChange({ animateIn: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
