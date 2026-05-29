"use client";

import { useState, useMemo } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import {
  MenuBarConfig,
  MenuBarVariant,
  PopupAnimation,
} from "@/lib/menuBarConfig";
import { debounce } from "@/utils/debounce";

interface Props {
  config: MenuBarConfig;
  onChange: (patch: Partial<MenuBarConfig>) => void;
  onReset: () => void;
}

const VARIANT_OPTIONS: {
  value: MenuBarVariant;
  label: string;
  desc: string;
}[] = [
  { value: "topnav", label: "Top Nav", desc: "Classic horizontal menubar" },
  {
    value: "segmented",
    label: "Segmented",
    desc: "Pill-style rounded segments",
  },
  {
    value: "commandbar",
    label: "Command Bar",
    desc: "Vertical icon + label bar",
  },
];

const ANIMATION_OPTIONS: { value: PopupAnimation; label: string }[] = [
  { value: "scale", label: "Scale" },
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "none", label: "None" },
];

export function MenuBarControlPanel({ config, onChange, onReset }: Props) {
  const [local, setLocal] = useState(config);

  const debouncedChange = useMemo(
    () => debounce((patch: Partial<MenuBarConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(key: keyof MenuBarConfig, value: number) {
    setLocal((prev) => ({ ...prev, [key]: value }));
    debouncedChange({ [key]: value });
  }

  function handleImmediate(patch: Partial<MenuBarConfig>) {
    setLocal((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  // Keep local in sync when parent resets
  const syncedLocal = { ...local, ...config };

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant ── */}
      <Section title="Variant">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {VARIANT_OPTIONS.map((v) => (
            <button
              key={v.value}
              onClick={() => handleImmediate({ variant: v.value })}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${config.variant === v.value ? "#7c6cfc" : "#2a2a38"}`,
                background:
                  config.variant === v.value ? "#7c6cfc18" : "transparent",
                color: config.variant === v.value ? "#9d91fd" : "#9090a8",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 120ms ease",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600 }}>{v.label}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{v.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Bar ── */}
      <Section title="Bar">
        <ColorRow
          label="Background"
          value={config.barBackground}
          onChange={(v) => handleImmediate({ barBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.barBorderColor}
          onChange={(v) => handleImmediate({ barBorderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={syncedLocal.barBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("barBorderRadius", v)}
          onChangeEnd={(v) => onChange({ barBorderRadius: v })}
        />
        <SliderRow
          label="Padding X"
          value={syncedLocal.barPaddingX}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("barPaddingX", v)}
          onChangeEnd={(v) => onChange({ barPaddingX: v })}
        />
        <SliderRow
          label="Padding Y"
          value={syncedLocal.barPaddingY}
          min={0}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("barPaddingY", v)}
          onChangeEnd={(v) => onChange({ barPaddingY: v })}
        />
        <ToggleRow
          label="Shadow"
          value={config.showBarShadow}
          onChange={(v) => handleImmediate({ showBarShadow: v })}
        />
        <ToggleRow
          label="Blur (backdrop)"
          value={config.barBlur}
          onChange={(v) => handleImmediate({ barBlur: v })}
        />
      </Section>

      {/* ── Items ── */}
      <Section title="Menu Items">
        <ColorRow
          label="Text"
          value={config.itemTextColor}
          onChange={(v) => handleImmediate({ itemTextColor: v })}
        />
        <ColorRow
          label="Hover Background"
          value={config.itemHoverBackground}
          onChange={(v) => handleImmediate({ itemHoverBackground: v })}
        />
        <ColorRow
          label="Hover Text"
          value={config.itemHoverTextColor}
          onChange={(v) => handleImmediate({ itemHoverTextColor: v })}
        />
        <ColorRow
          label="Active Background"
          value={config.itemActiveBackground}
          onChange={(v) => handleImmediate({ itemActiveBackground: v })}
        />
        <ColorRow
          label="Active Text"
          value={config.itemActiveTextColor}
          onChange={(v) => handleImmediate({ itemActiveTextColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={syncedLocal.itemBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("itemBorderRadius", v)}
          onChangeEnd={(v) => onChange({ itemBorderRadius: v })}
        />
        <SliderRow
          label="Font Size"
          value={syncedLocal.itemFontSize}
          min={10}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("itemFontSize", v)}
          onChangeEnd={(v) => onChange({ itemFontSize: v })}
        />
        <SliderRow
          label="Item Gap"
          value={syncedLocal.itemGap}
          min={0}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("itemGap", v)}
          onChangeEnd={(v) => onChange({ itemGap: v })}
        />
      </Section>

      {/* ── Popup ── */}
      <Section title="Options Popup">
        <ColorRow
          label="Background"
          value={config.popupBackground}
          onChange={(v) => handleImmediate({ popupBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.popupBorderColor}
          onChange={(v) => handleImmediate({ popupBorderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={syncedLocal.popupBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("popupBorderRadius", v)}
          onChangeEnd={(v) => onChange({ popupBorderRadius: v })}
        />
        <SliderRow
          label="Min Width"
          value={syncedLocal.popupMinWidth}
          min={120}
          max={320}
          unit="px"
          onChange={(v) => handleSlider("popupMinWidth", v)}
          onChangeEnd={(v) => onChange({ popupMinWidth: v })}
        />
        <ToggleRow
          label="Shadow"
          value={config.popupShadow}
          onChange={(v) => handleImmediate({ popupShadow: v })}
        />
      </Section>

      {/* ── Options ── */}
      <Section title="Option Rows">
        <ColorRow
          label="Text"
          value={config.optionTextColor}
          onChange={(v) => handleImmediate({ optionTextColor: v })}
        />
        <ColorRow
          label="Hover Background"
          value={config.optionHoverBackground}
          onChange={(v) => handleImmediate({ optionHoverBackground: v })}
        />
        <ColorRow
          label="Hover Text"
          value={config.optionHoverTextColor}
          onChange={(v) => handleImmediate({ optionHoverTextColor: v })}
        />
        <SliderRow
          label="Font Size"
          value={syncedLocal.optionFontSize}
          min={10}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("optionFontSize", v)}
          onChangeEnd={(v) => onChange({ optionFontSize: v })}
        />
        <SliderRow
          label="Border Radius"
          value={syncedLocal.optionBorderRadius}
          min={0}
          max={12}
          unit="px"
          onChange={(v) => handleSlider("optionBorderRadius", v)}
          onChangeEnd={(v) => onChange({ optionBorderRadius: v })}
        />
        <ToggleRow
          label="Show Icons"
          value={config.showOptionIcons}
          onChange={(v) => handleImmediate({ showOptionIcons: v })}
        />
        <ToggleRow
          label="Show Shortcuts"
          value={config.showOptionShortcuts}
          onChange={(v) => handleImmediate({ showOptionShortcuts: v })}
        />
      </Section>

      {/* ── Dividers ── */}
      <Section title="Dividers">
        <ToggleRow
          label="Show Dividers"
          value={config.showDividers}
          onChange={(v) => handleImmediate({ showDividers: v })}
        />
        <ColorRow
          label="Divider Color"
          value={config.dividerColor}
          onChange={(v) => handleImmediate({ dividerColor: v })}
        />
      </Section>

      {/* ── Animation ── */}
      <Section title="Animation">
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              color: "#5a5a72",
              marginBottom: 6,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Popup Animation
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ANIMATION_OPTIONS.map((a) => (
              <button
                key={a.value}
                onClick={() => handleImmediate({ popupAnimation: a.value })}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${config.popupAnimation === a.value ? "#7c6cfc" : "#2a2a38"}`,
                  background:
                    config.popupAnimation === a.value
                      ? "#7c6cfc18"
                      : "transparent",
                  color:
                    config.popupAnimation === a.value ? "#9d91fd" : "#9090a8",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 120ms ease",
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
        <SliderRow
          label="Duration"
          value={syncedLocal.animationDuration}
          min={80}
          max={400}
          unit="ms"
          onChange={(v) => handleSlider("animationDuration", v)}
          onChangeEnd={(v) => onChange({ animationDuration: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
