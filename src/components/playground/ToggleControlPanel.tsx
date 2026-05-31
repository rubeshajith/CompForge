"use client";

import { useState, useMemo } from "react";
import { ToggleConfig } from "@/lib/toggleConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface ToggleControlPanelProps {
  config: ToggleConfig;
  onChange: (patch: Partial<ToggleConfig>) => void;
  onReset: () => void;
}

function SelectRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
      <span className="label" style={{ fontSize: 12, color: "#9090a8" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          background: "#1c1c22",
          border: "1.5px solid #2a2a38",
          borderRadius: 6,
          color: "#f0f0f5",
          fontSize: 12,
          padding: "3px 8px",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ToggleControlPanel({ config, onChange, onReset }: ToggleControlPanelProps) {
  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<ToggleConfig>) => onChange(patch), 100),
    [onChange]
  );

  function handleSlider(key: keyof ToggleConfig, value: number) {
    debouncedOnChange({ [key]: value });
  }
  function handleSliderEnd(key: keyof ToggleConfig, value: number) {
    onChange({ [key]: value });
  }

  return (
    <ControlPanelShell onReset={onReset}>

      {/* ── Mode ── */}
      <Section title="Display Mode">
        <ToggleRow label="Show Group" value={config.groupEnabled} onChange={(v) => onChange({ groupEnabled: v })} />
      </Section>

      {/* ── Single Toggle ── */}
      {!config.groupEnabled && (
        <Section title="Toggle Variant">
          <SelectRow
            label="Variant"
            value={config.variant}
            options={[
              { value: "pill", label: "Pill" },
              { value: "chip", label: "Chip" },
              { value: "switch", label: "Switch" },
              { value: "underline", label: "Underline" },
              { value: "icon-label", label: "Icon + Label" },
            ]}
            onChange={(v) => onChange({ variant: v })}
          />
        </Section>
      )}

      {/* ── Group Settings ── */}
      {config.groupEnabled && (
        <Section title="Group Settings">
          <SelectRow
            label="Style"
            value={config.groupVariant}
            options={[
              { value: "segmented", label: "Segmented" },
              { value: "chip-row", label: "Chip Row" },
              { value: "pill-row", label: "Pill Row" },
              { value: "icon-tabs", label: "Icon Tabs" },
            ]}
            onChange={(v) => onChange({ groupVariant: v })}
          />
          <SelectRow
            label="Select Mode"
            value={config.groupMode}
            options={[
              { value: "single", label: "Single" },
              { value: "multi", label: "Multi" },
            ]}
            onChange={(v) => onChange({ groupMode: v })}
          />
          <SliderRow
            label="Items"
            value={config.groupItemCount}
            min={2}
            max={5}
            unit=""
            onChange={(v) => handleSlider("groupItemCount", v)}
            onChangeEnd={(v) => handleSliderEnd("groupItemCount", v)}
          />
          <ToggleRow label="Show Icons" value={config.showGroupIcons} onChange={(v) => onChange({ showGroupIcons: v })} />
          <ToggleRow label="Slide Indicator" value={config.animateIndicator} onChange={(v) => onChange({ animateIndicator: v })} />
        </Section>
      )}

      {/* ── Shape & Size ── */}
      <Section title="Shape & Size">
        <SelectRow
          label="Size"
          value={config.size}
          options={[
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
          ]}
          onChange={(v) => onChange({ size: v })}
        />
        <SelectRow
          label="Border Radius"
          value={config.borderRadius}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "full", label: "Pill" },
          ]}
          onChange={(v) => onChange({ borderRadius: v })}
        />
      </Section>

      {/* ── Inactive State Colors ── */}
      <Section title="Inactive Colors">
        <ColorRow label="Track BG" value={config.trackBg} onChange={(v) => onChange({ trackBg: v })} />
        <ColorRow label="Track Border" value={config.trackBorder} onChange={(v) => onChange({ trackBorder: v })} />
        <ColorRow label="Text" value={config.inactiveText} onChange={(v) => onChange({ inactiveText: v })} />
        <ColorRow label="Hover BG" value={config.inactiveHoverBg} onChange={(v) => onChange({ inactiveHoverBg: v })} />
      </Section>

      {/* ── Active State Colors ── */}
      <Section title="Active Colors">
        <ColorRow label="Background" value={config.activeBg} onChange={(v) => onChange({ activeBg: v })} />
        <ColorRow label="Text" value={config.activeText} onChange={(v) => onChange({ activeText: v })} />
        <ColorRow label="Border" value={config.activeBorder} onChange={(v) => onChange({ activeBorder: v })} />
        <ColorRow label="Thumb (Switch)" value={config.thumbColor} onChange={(v) => onChange({ thumbColor: v })} />
      </Section>

      {/* ── Group Colors ── */}
      {config.groupEnabled && (
        <Section title="Group Colors">
          <ColorRow label="Track BG" value={config.groupBg} onChange={(v) => onChange({ groupBg: v })} />
          <ColorRow label="Track Border" value={config.groupBorder} onChange={(v) => onChange({ groupBorder: v })} />
          <ColorRow label="Active Indicator" value={config.groupActiveIndicatorBg} onChange={(v) => onChange({ groupActiveIndicatorBg: v })} />
          <ColorRow label="Active Text" value={config.groupActiveText} onChange={(v) => onChange({ groupActiveText: v })} />
          <ColorRow label="Inactive Text" value={config.groupInactiveText} onChange={(v) => onChange({ groupInactiveText: v })} />
        </Section>
      )}

      {/* ── Animation ── */}
      <Section title="Animation">
        <ToggleRow label="Animate Toggle" value={config.animateToggle} onChange={(v) => onChange({ animateToggle: v })} />
      </Section>
    </ControlPanelShell>
  );
}
