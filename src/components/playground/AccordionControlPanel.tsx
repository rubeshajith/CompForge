"use client";

import { useState, useMemo } from "react";
import {
  AccordionConfig,
  AccordionVariant,
  ACCORDION_VARIANT_LABELS,
} from "@/lib/accordionConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface AccordionControlPanelProps {
  config: AccordionConfig;
  onChange: (patch: Partial<AccordionConfig>) => void;
  onReset: () => void;
}

const VARIANTS: AccordionVariant[] = [
  "animated-height",
  "nested",
  "bordered-cards",
  "icon-reveal",
];

export function AccordionControlPanel({
  config,
  onChange,
  onReset,
}: AccordionControlPanelProps) {
  const [localConfig, setLocalConfig] = useState<AccordionConfig>(config);

  // Keep localConfig in sync when parent resets
  if (
    localConfig.backgroundColor !== config.backgroundColor ||
    localConfig.variant !== config.variant
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSlider(key: keyof AccordionConfig, value: number) {
    const patch = { [key]: value } as Partial<AccordionConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleSliderEnd(key: keyof AccordionConfig, value: number) {
    const patch = { [key]: value } as Partial<AccordionConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  function handleColor(key: keyof AccordionConfig, value: string) {
    const patch = { [key]: value } as Partial<AccordionConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  function handleToggle(key: keyof AccordionConfig, value: boolean) {
    const patch = { [key]: value } as Partial<AccordionConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Selector ─────────────────────────────── */}
      <Section title="Variant">
        <div className="row">
          <span className="label">Style</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setLocalConfig((prev) => ({ ...prev, variant: v }));
                  onChange({ variant: v });
                }}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  fontFamily: "inherit",
                  fontWeight: 500,
                  borderRadius: 6,
                  border: `1.5px solid ${localConfig.variant === v ? localConfig.accentColor : "#2a2a38"}`,
                  background:
                    localConfig.variant === v
                      ? `${localConfig.accentColor}20`
                      : "transparent",
                  color:
                    localConfig.variant === v
                      ? localConfig.accentColor
                      : "#9090a8",
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                {ACCORDION_VARIANT_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Layout ───────────────────────────────────────── */}
      <Section title="Layout">
        <SliderRow
          label="Width"
          value={localConfig.accordionWidth}
          min={300}
          max={720}
          unit="px"
          onChange={(v) => handleSlider("accordionWidth", v)}
          onChangeEnd={(v) => handleSliderEnd("accordionWidth", v)}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.itemBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("itemBorderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("itemBorderRadius", v)}
        />
        <SliderRow
          label="Item Gap"
          value={localConfig.itemGap}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("itemGap", v)}
          onChangeEnd={(v) => handleSliderEnd("itemGap", v)}
        />
        <SliderRow
          label="Content Padding"
          value={localConfig.contentPadding}
          min={8}
          max={40}
          unit="px"
          onChange={(v) => handleSlider("contentPadding", v)}
          onChangeEnd={(v) => handleSliderEnd("contentPadding", v)}
        />
      </Section>

      {/* ── Header ───────────────────────────────────────── */}
      <Section title="Header">
        <ColorRow
          label="Background"
          value={localConfig.headerBackground}
          onChange={(v) => handleColor("headerBackground", v)}
        />
        <ColorRow
          label="Hover BG"
          value={localConfig.headerHoverBackground}
          onChange={(v) => handleColor("headerHoverBackground", v)}
        />
        <ColorRow
          label="Text"
          value={localConfig.headerTextColor}
          onChange={(v) => handleColor("headerTextColor", v)}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.headerFontSize}
          min={11}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("headerFontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("headerFontSize", v)}
        />
        <SliderRow
          label="Font Weight"
          value={localConfig.headerFontWeight}
          min={400}
          max={700}
          unit=""
          onChange={(v) => handleSlider("headerFontWeight", v)}
          onChangeEnd={(v) => handleSliderEnd("headerFontWeight", v)}
        />
        <SliderRow
          label="Padding Y"
          value={localConfig.headerPaddingY}
          min={8}
          max={28}
          unit="px"
          onChange={(v) => handleSlider("headerPaddingY", v)}
          onChangeEnd={(v) => handleSliderEnd("headerPaddingY", v)}
        />
        <SliderRow
          label="Padding X"
          value={localConfig.headerPaddingX}
          min={8}
          max={36}
          unit="px"
          onChange={(v) => handleSlider("headerPaddingX", v)}
          onChangeEnd={(v) => handleSliderEnd("headerPaddingX", v)}
        />
      </Section>

      {/* ── Content ──────────────────────────────────────── */}
      <Section title="Content">
        <ColorRow
          label="Background"
          value={localConfig.contentBackground}
          onChange={(v) => handleColor("contentBackground", v)}
        />
        <ColorRow
          label="Text"
          value={localConfig.contentTextColor}
          onChange={(v) => handleColor("contentTextColor", v)}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.contentFontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("contentFontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("contentFontSize", v)}
        />
      </Section>

      {/* ── Colors ───────────────────────────────────────── */}
      <Section title="Colors">
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleColor("borderColor", v)}
        />
        <ColorRow
          label="Separator"
          value={localConfig.separatorColor}
          onChange={(v) => handleColor("separatorColor", v)}
        />
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleColor("accentColor", v)}
        />
        <ColorRow
          label="Icon"
          value={localConfig.iconColor}
          onChange={(v) => handleColor("iconColor", v)}
        />
        <SliderRow
          label="Icon Size"
          value={localConfig.iconSize}
          min={10}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("iconSize", v)}
          onChangeEnd={(v) => handleSliderEnd("iconSize", v)}
        />
      </Section>

      {/* ── Nested Colors (shown for all but useful for nested) ── */}
      <Section title="Nested Colors">
        <ColorRow
          label="Nested Header BG"
          value={localConfig.nestedHeaderBackground}
          onChange={(v) => handleColor("nestedHeaderBackground", v)}
        />
        <ColorRow
          label="Nested Text"
          value={localConfig.nestedHeaderTextColor}
          onChange={(v) => handleColor("nestedHeaderTextColor", v)}
        />
        <ColorRow
          label="Nested Accent"
          value={localConfig.nestedAccentColor}
          onChange={(v) => handleColor("nestedAccentColor", v)}
        />
      </Section>

      {/* ── Behavior ─────────────────────────────────────── */}
      <Section title="Behavior">
        <ToggleRow
          label="Allow Multiple Open"
          value={localConfig.allowMultiple}
          onChange={(v) => handleToggle("allowMultiple", v)}
        />
        <SliderRow
          label="Animation Duration"
          value={localConfig.animationDuration}
          min={80}
          max={600}
          unit="ms"
          onChange={(v) => handleSlider("animationDuration", v)}
          onChangeEnd={(v) => handleSliderEnd("animationDuration", v)}
        />
      </Section>

      {/* ── Shadow ───────────────────────────────────────── */}
      <Section title="Shadow">
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleToggle("showShadow", v)}
        />
        {localConfig.showShadow && (
          <ColorRow
            label="Shadow Color"
            value={localConfig.shadowColor}
            onChange={(v) => handleColor("shadowColor", v)}
          />
        )}
      </Section>
    </ControlPanelShell>
  );
}
