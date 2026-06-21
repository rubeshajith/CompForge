"use client";

import { useMemo, useState } from "react";
import { ButtonConfig } from "@/lib/buttonConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface ButtonControlPanelProps {
  config: ButtonConfig;
  onChange: (patch: Partial<ButtonConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

// ─── Inline select row (shared local primitive) ───────────────────────────────
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

export function ButtonControlPanel({ config, onChange, onReset }: ButtonControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<ButtonConfig>) => onChange(patch), 100),
    [onChange]
  );

  function handleSlider(key: keyof ButtonConfig, value: number) {
    setLocalConfig((p) => ({ ...p, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleSliderEnd(key: keyof ButtonConfig, value: number) {
    onChange({ [key]: value });
  }

  // Sync when parent resets
  if (
    config.variant !== localConfig.variant ||
    config.solidBg !== localConfig.solidBg
  ) {
    // shallow check for reset
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant & Appearance ── */}
      <Section title="Variant & Shape">
        <SelectRow
          label="Variant"
          value={config.variant}
          options={[
            { value: "solid", label: "Solid" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
            { value: "soft", label: "Soft" },
            { value: "link", label: "Link" },
          ]}
          onChange={(v) => onChange({ variant: v })}
        />
        <SelectRow
          label="Size"
          value={config.size}
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
          ]}
          onChange={(v) => onChange({ size: v })}
        />
        <SelectRow
          label="Radius"
          value={config.radius}
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "full", label: "Pill" },
          ]}
          onChange={(v) => onChange({ radius: v })}
        />
      </Section>

      {/* ── Solid Colors ── */}
      {config.variant === "solid" && (
        <Section title="Solid Colors">
          <ColorRow label="Background" value={config.solidBg} onChange={(v) => onChange({ solidBg: v })}   isDark={isDark}
/>
          <ColorRow label="Text" value={config.solidText} onChange={(v) => onChange({ solidText: v })}   isDark={isDark}
/>
          <ColorRow label="Hover BG" value={config.solidHoverBg} onChange={(v) => onChange({ solidHoverBg: v })}   isDark={isDark}
/>
          <ColorRow label="Border" value={config.solidBorder} onChange={(v) => onChange({ solidBorder: v })}   isDark={isDark}
/>
        </Section>
      )}

      {/* ── Outline Colors ── */}
      {config.variant === "outline" && (
        <Section title="Outline Colors">
          <ColorRow label="Border" value={config.outlineBorder} onChange={(v) => onChange({ outlineBorder: v })}   isDark={isDark}
/>
          <ColorRow label="Text" value={config.outlineText} onChange={(v) => onChange({ outlineText: v })}   isDark={isDark}
/>
          <ColorRow label="Hover BG" value={config.outlineHoverBg} onChange={(v) => onChange({ outlineHoverBg: v })}   isDark={isDark}
/>
        </Section>
      )}

      {/* ── Ghost Colors ── */}
      {config.variant === "ghost" && (
        <Section title="Ghost Colors">
          <ColorRow label="Text" value={config.ghostText} onChange={(v) => onChange({ ghostText: v })}   isDark={isDark}
/>
          <ColorRow label="Hover BG" value={config.ghostHoverBg} onChange={(v) => onChange({ ghostHoverBg: v })}   isDark={isDark}
/>
        </Section>
      )}

      {/* ── Soft Colors ── */}
      {config.variant === "soft" && (
        <Section title="Soft Colors">
          <ColorRow label="Background" value={config.softBg} onChange={(v) => onChange({ softBg: v })}   isDark={isDark}
/>
          <ColorRow label="Text" value={config.softText} onChange={(v) => onChange({ softText: v })}   isDark={isDark}
/>
          <ColorRow label="Hover BG" value={config.softHoverBg} onChange={(v) => onChange({ softHoverBg: v })}   isDark={isDark}
/>
        </Section>
      )}

      {/* ── Link Colors ── */}
      {config.variant === "link" && (
        <Section title="Link Colors">
          <ColorRow label="Text" value={config.linkText} onChange={(v) => onChange({ linkText: v })}   isDark={isDark}
/>
          <ColorRow label="Hover Text" value={config.linkHoverText} onChange={(v) => onChange({ linkHoverText: v })}   isDark={isDark}
/>
        </Section>
      )}

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label="Font Weight"
          value={config.fontWeight}
          min={300}
          max={800}
          unit=""
          onChange={(v) => handleSlider("fontWeight", v)}
          onChangeEnd={(v) => handleSliderEnd("fontWeight", v)}
        />
        <SliderRow
          label="Letter Spacing"
          value={config.letterSpacing}
          min={-0.05}
          max={0.2}
          unit="em"
          onChange={(v) => handleSlider("letterSpacing", v)}
          onChangeEnd={(v) => handleSliderEnd("letterSpacing", v)}
        />
      </Section>

      {/* ── States ── */}
      <Section title="States">
        <ToggleRow label="Loading" value={config.loading} onChange={(v) => onChange({ loading: v })} />
        <ToggleRow label="Disabled" value={config.disabled} onChange={(v) => onChange({ disabled: v })} />
        <ToggleRow label="Icon Left" value={config.iconLeft} onChange={(v) => onChange({ iconLeft: v })} />
        <ToggleRow label="Icon Right" value={config.iconRight} onChange={(v) => onChange({ iconRight: v })} />
      </Section>

      {/* ── Behaviour ── */}
      <Section title="Behaviour">
        <ToggleRow label="Hover Animation" value={config.animateHover} onChange={(v) => onChange({ animateHover: v })} />
        <ToggleRow label="Ripple Effect" value={config.showRipple} onChange={(v) => onChange({ showRipple: v })} />
      </Section>

      {/* ── Button Group ── */}
      <Section title="Button Group">
        <ToggleRow label="Enable Group" value={config.groupEnabled} onChange={(v) => onChange({ groupEnabled: v })} />
        {config.groupEnabled && (
          <>
            <SelectRow
              label="Orientation"
              value={config.groupOrientation}
              options={[
                { value: "horizontal", label: "Horizontal" },
                { value: "vertical", label: "Vertical" },
              ]}
              onChange={(v) => onChange({ groupOrientation: v })}
            />
            <SliderRow
              label="Item Count"
              value={config.groupItemCount}
              min={2}
              max={5}
              unit=""
              onChange={(v) => handleSlider("groupItemCount", v)}
              onChangeEnd={(v) => handleSliderEnd("groupItemCount", v)}
            />
          </>
        )}
      </Section>
    </ControlPanelShell>
  );
}
