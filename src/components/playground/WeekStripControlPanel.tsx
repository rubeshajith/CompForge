"use client";

import styles from "./ControlPanel.module.css";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";
import { WeekStripConfig } from "@/lib/weekStripConfig";
import {
  ColorRow,
  ControlPanelShell,
  Section,
  SliderRow,
  ToggleRow,
} from "../ui/ControlHelpers";

interface Props {
  config: WeekStripConfig;
  onChange: (patch: Partial<WeekStripConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function WeekStripControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((patch: Partial<WeekStripConfig>) => {
        onChange(patch);
      }, 80),
    [onChange],
  );

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ── */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.borderColor}
          onChange={(v) => onChange({ borderColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Radius"
          value={localConfig.borderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, borderRadius: v }));
            debouncedOnChange({ borderRadius: v });
          }}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <ToggleRow
          label="Drop Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
      </Section>

      {/* ── Month Label ── */}
      <Section title="Month Label">
        <ToggleRow
          label="Show Month"
          value={config.showMonthLabel}
          onChange={(v) => onChange({ showMonthLabel: v })}
        />
        <ColorRow
          label="Color"
          value={config.monthLabelColor}
          onChange={(v) => onChange({ monthLabelColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Font Size"
          value={localConfig.monthLabelSize}
          min={11}
          max={20}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, monthLabelSize: v }));
            debouncedOnChange({ monthLabelSize: v });
          }}
          onChangeEnd={(v) => onChange({ monthLabelSize: v })}
        />
      </Section>

      {/* ── Day Names ── */}
      <Section title="Day Names">
        <ColorRow
          label="Color"
          value={config.dayNameColor}
          onChange={(v) => onChange({ dayNameColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Font Size"
          value={localConfig.dayNameSize}
          min={9}
          max={14}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, dayNameSize: v }));
            debouncedOnChange({ dayNameSize: v });
          }}
          onChangeEnd={(v) => onChange({ dayNameSize: v })}
        />
      </Section>

      {/* ── Day Numbers ── */}
      <Section title="Day Numbers">
        <ColorRow
          label="Text"
          value={config.dayNumberColor}
          onChange={(v) => onChange({ dayNumberColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Font Size"
          value={localConfig.dayNumberSize}
          min={11}
          max={22}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, dayNumberSize: v }));
            debouncedOnChange({ dayNumberSize: v });
          }}
          onChangeEnd={(v) => onChange({ dayNumberSize: v })}
        />
        <ColorRow
          label="Today Color"
          value={config.todayColor}
          onChange={(v) => onChange({ todayColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Selection ── */}
      <Section title="Selected Day">
        <ColorRow
          label="Background"
          value={config.selectedBackground}
          onChange={(v) => onChange({ selectedBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.selectedTextColor}
          onChange={(v) => onChange({ selectedTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Radius"
          value={localConfig.selectedBorderRadius}
          min={0}
          max={28}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, selectedBorderRadius: v }));
            debouncedOnChange({ selectedBorderRadius: v });
          }}
          onChangeEnd={(v) => onChange({ selectedBorderRadius: v })}
        />
        <ColorRow
          label="Hover BG"
          value={config.hoverBackground}
          onChange={(v) => onChange({ hoverBackground: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Past Days ── */}
      <Section title="Past Days">
        <SliderRow
          label="Opacity"
          value={localConfig.pastDayOpacity}
          min={10}
          max={100}
          unit="%"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, pastDayOpacity: v }));
            debouncedOnChange({ pastDayOpacity: v });
          }}
          onChangeEnd={(v) => onChange({ pastDayOpacity: v })}
        />
      </Section>

      {/* ── Event Dots ── */}
      <Section title="Event Dots">
        <ToggleRow
          label="Show Dots"
          value={config.showDots}
          onChange={(v) => onChange({ showDots: v })}
        />
        <ColorRow
          label="Dot Color"
          value={config.dotColor}
          onChange={(v) => onChange({ dotColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Navigation ── */}
      <Section title="Navigation">
        <ColorRow
          label="Chevron Color"
          value={config.chevronColor}
          onChange={(v) => onChange({ chevronColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Day Button Size ── */}
      <Section title="Day Button Size">
        <SliderRow
          label="Width"
          value={localConfig.dayButtonWidth}
          min={32}
          max={64}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, dayButtonWidth: v }));
            debouncedOnChange({ dayButtonWidth: v });
          }}
          onChangeEnd={(v) => onChange({ dayButtonWidth: v })}
        />
        <SliderRow
          label="Height"
          value={localConfig.dayButtonHeight}
          min={44}
          max={80}
          unit="px"
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, dayButtonHeight: v }));
            debouncedOnChange({ dayButtonHeight: v });
          }}
          onChangeEnd={(v) => onChange({ dayButtonHeight: v })}
        />
      </Section>

      {/* ── Options ── */}
      <Section title="Options">
        <ToggleRow
          label="Animate Selection"
          value={config.animateSelection}
          onChange={(v) => onChange({ animateSelection: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
