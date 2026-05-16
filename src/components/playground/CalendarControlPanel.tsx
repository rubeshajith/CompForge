"use client";

import { CalendarConfig } from "@/lib/calendarConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import styles from "./ControlPanel.module.css";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";

interface Props {
  config: CalendarConfig;
  onChange: (patch: Partial<CalendarConfig>) => void;
  onReset: () => void;
}

export function CalendarControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  const debouncedOnChange = useMemo(
    () =>
      debounce((patch: Partial<CalendarConfig>) => {
        onChange(patch);
      }, 80), // try 80–150ms
    [onChange],
  );
  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Selection Mode">
        <div className={styles.row}>
          <span className={styles.label}>Mode</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {(["single", "range"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onChange({ selectionMode: m })}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: `1px solid ${config.selectionMode === m ? "var(--accent)" : "var(--border-light)"}`,
                  background:
                    config.selectionMode === m ? "var(--accent-dim)" : "none",
                  color:
                    config.selectionMode === m
                      ? "var(--accent-light)"
                      : "var(--text-muted)",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Size & Layout">
        <SliderRow
          label="Calendar Width"
          value={localConfig.calendarWidth}
          min={220}
          max={420}
          unit="px"
          onChange={(v) => {
            setLocalConfig((prev) => ({ ...prev, calendarWidth: v }));
            debouncedOnChange({ calendarWidth: v });
          }}
          onChangeEnd={(v) => onChange({ calendarWidth: v })}
        />
        <SliderRow
          label="Day Cell Size"
          value={config.dayCellSize}
          min={24}
          max={52}
          unit="px"
          onChange={(v) => onChange({ dayCellSize: v })}
        />
      </Section>
      <Section title="Container">
        <ColorRow
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
        />
        <ColorRow
          label="Border"
          value={config.borderColor}
          onChange={(v) => onChange({ borderColor: v })}
        />
        <SliderRow
          label="Radius"
          value={config.borderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => onChange({ borderRadius: v })}
        />
      </Section>

      <Section title="Header">
        <ColorRow
          label="Text"
          value={config.headerTextColor}
          onChange={(v) => onChange({ headerTextColor: v })}
        />
        <ColorRow
          label="Arrows"
          value={config.chevronColor}
          onChange={(v) => onChange({ chevronColor: v })}
        />
      </Section>

      <Section title="Days">
        <ColorRow
          label="Day Names"
          value={config.dayNameColor}
          onChange={(v) => onChange({ dayNameColor: v })}
        />
        <ColorRow
          label="Date Text"
          value={config.dayTextColor}
          onChange={(v) => onChange({ dayTextColor: v })}
        />
        <ColorRow
          label="Hover BG"
          value={config.dayHoverBackground}
          onChange={(v) => onChange({ dayHoverBackground: v })}
        />
        <ColorRow
          label="Hover Text"
          value={config.dayHoverTextColor}
          onChange={(v) => onChange({ dayHoverTextColor: v })}
        />
        <SliderRow
          label="Cell Radius"
          value={config.dayBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => onChange({ dayBorderRadius: v })}
        />
      </Section>

      <Section title="Selection Colors">
        <ColorRow
          label="Accent BG"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
        <ColorRow
          label="Accent Text"
          value={config.accentTextColor}
          onChange={(v) => onChange({ accentTextColor: v })}
        />
        <ColorRow
          label="Range BG"
          value={config.rangeBackground}
          onChange={(v) => onChange({ rangeBackground: v })}
        />
        <ColorRow
          label="Range Text"
          value={config.rangeTextColor}
          onChange={(v) => onChange({ rangeTextColor: v })}
        />
      </Section>

      <Section title="Picker Popup">
        <ColorRow
          label="Background"
          value={config.pickerBackground}
          onChange={(v) => onChange({ pickerBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.pickerBorderColor}
          onChange={(v) => onChange({ pickerBorderColor: v })}
        />
        <ColorRow
          label="Hover"
          value={config.pickerOptionHover}
          onChange={(v) => onChange({ pickerOptionHover: v })}
        />
      </Section>

      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={config.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => onChange({ fontSize: v })}
        />
      </Section>

      <Section title="Options">
        <ToggleRow
          label="Drop Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
        <ToggleRow
          label="Picker Animation"
          value={config.animateOpen}
          onChange={(v) => onChange({ animateOpen: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
