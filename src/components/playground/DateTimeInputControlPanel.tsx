"use client";

// /components/playground/DateTimeInputControlPanel.tsx

import React, { useState, useMemo } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { DateTimeInputConfig } from "@/lib/dateTimeInputConfig";
import { debounce } from "@/utils/debounce";

interface Props {
  config: DateTimeInputConfig;
  onChange: (patch: Partial<DateTimeInputConfig>) => void;
  onReset: () => void;
}

export function DateTimeInputControlPanel({
  config,
  onChange,
  onReset,
}: Props) {
  const [localConfig, setLocalConfig] = useState<DateTimeInputConfig>(config);

  // Sync local when parent resets
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  const handleSlider = (key: keyof DateTimeInputConfig, value: number) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  };

  const handleColor = (key: keyof DateTimeInputConfig, value: string) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  };

  const handleToggle = (key: keyof DateTimeInputConfig, value: boolean) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  };

  const handleSelect = (key: keyof DateTimeInputConfig, value: string) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  };

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Behaviour */}
      <Section title="Behaviour">
        {/* Picker Mode — custom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 0",
          }}
        >
          <span className="label">Picker mode</span>
          <select
            value={localConfig.pickerMode}
            onChange={(e) => handleSelect("pickerMode", e.target.value)}
            style={{
              background: "#1c1c22",
              border: "1px solid #2a2a38",
              color: "#f0f0f5",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="datetime">Date + Time</option>
            <option value="date">Date only</option>
            <option value="time">Time only</option>
          </select>
        </div>
        <ToggleRow
          label="Allow future time"
          value={localConfig.allowFutureTime}
          onChange={(v) => handleToggle("allowFutureTime", v)}
        />
        <ToggleRow
          label="Animate open"
          value={localConfig.animateOpen}
          onChange={(v) => handleToggle("animateOpen", v)}
        />
      </Section>

      {/* Input Field */}
      <Section title="Input Field">
        <ColorRow
          label="Background"
          value={localConfig.inputBackground}
          onChange={(v) => handleColor("inputBackground", v)}
        />
        <ColorRow
          label="Border"
          value={localConfig.inputBorderColor}
          onChange={(v) => handleColor("inputBorderColor", v)}
        />
        <ColorRow
          label="Focus border"
          value={localConfig.inputFocusBorderColor}
          onChange={(v) => handleColor("inputFocusBorderColor", v)}
        />
        <ColorRow
          label="Text"
          value={localConfig.inputTextColor}
          onChange={(v) => handleColor("inputTextColor", v)}
        />
        <ColorRow
          label="Placeholder"
          value={localConfig.inputPlaceholderColor}
          onChange={(v) => handleColor("inputPlaceholderColor", v)}
        />
        <ColorRow
          label="Icon"
          value={localConfig.inputIconColor}
          onChange={(v) => handleColor("inputIconColor", v)}
        />
        <SliderRow
          label="Border radius"
          value={localConfig.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("inputBorderRadius", v)}
          onChangeEnd={(v) => onChange({ inputBorderRadius: v })}
        />
        <ColorRow
          label="Label color"
          value={localConfig.labelTextColor}
          onChange={(v) => handleColor("labelTextColor", v)}
        />
        <SliderRow
          label="Label size"
          value={localConfig.labelFontSize}
          min={10}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("labelFontSize", v)}
          onChangeEnd={(v) => onChange({ labelFontSize: v })}
        />
      </Section>

      {/* Popover */}
      <Section title="Popover Panel">
        <ColorRow
          label="Background"
          value={localConfig.popoverBackground}
          onChange={(v) => handleColor("popoverBackground", v)}
        />
        <ColorRow
          label="Border"
          value={localConfig.popoverBorderColor}
          onChange={(v) => handleColor("popoverBorderColor", v)}
        />
        <SliderRow
          label="Border radius"
          value={localConfig.popoverBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("popoverBorderRadius", v)}
          onChangeEnd={(v) => onChange({ popoverBorderRadius: v })}
        />
        <ToggleRow
          label="Shadow"
          value={localConfig.popoverShadow}
          onChange={(v) => handleToggle("popoverShadow", v)}
        />
      </Section>

      {/* Calendar */}
      <Section title="Calendar">
        <ColorRow
          label="Header text"
          value={localConfig.calHeaderTextColor}
          onChange={(v) => handleColor("calHeaderTextColor", v)}
        />
        <ColorRow
          label="Nav arrows"
          value={localConfig.calNavButtonColor}
          onChange={(v) => handleColor("calNavButtonColor", v)}
        />
        <ColorRow
          label="Day names"
          value={localConfig.dayNameColor}
          onChange={(v) => handleColor("dayNameColor", v)}
        />
        <ColorRow
          label="Day text"
          value={localConfig.dayTextColor}
          onChange={(v) => handleColor("dayTextColor", v)}
        />
        <ColorRow
          label="Day hover bg"
          value={localConfig.dayHoverBackground}
          onChange={(v) => handleColor("dayHoverBackground", v)}
        />
        <ColorRow
          label="Today text"
          value={localConfig.todayTextColor}
          onChange={(v) => handleColor("todayTextColor", v)}
        />
        <SliderRow
          label="Day cell size"
          value={localConfig.dayCellSize}
          min={28}
          max={48}
          unit="px"
          onChange={(v) => handleSlider("dayCellSize", v)}
          onChangeEnd={(v) => onChange({ dayCellSize: v })}
        />
        <SliderRow
          label="Day border radius"
          value={localConfig.dayBorderRadius}
          min={0}
          max={50}
          unit="px"
          onChange={(v) => handleSlider("dayBorderRadius", v)}
          onChangeEnd={(v) => onChange({ dayBorderRadius: v })}
        />
      </Section>

      {/* Accent */}
      <Section title="Accent / Selection">
        <ColorRow
          label="Accent color"
          value={localConfig.accentColor}
          onChange={(v) => handleColor("accentColor", v)}
        />
        <ColorRow
          label="Accent text"
          value={localConfig.accentTextColor}
          onChange={(v) => handleColor("accentTextColor", v)}
        />
      </Section>

      {/* Clock */}
      <Section title="Clock">
        <ColorRow
          label="Face background"
          value={localConfig.clockFaceBackground}
          onChange={(v) => handleColor("clockFaceBackground", v)}
        />
        <ColorRow
          label="Hand color"
          value={localConfig.clockHandColor}
          onChange={(v) => handleColor("clockHandColor", v)}
        />
        <ColorRow
          label="Number color"
          value={localConfig.clockNumberColor}
          onChange={(v) => handleColor("clockNumberColor", v)}
        />
        <ColorRow
          label="Display bg"
          value={localConfig.clockDisplayBackground}
          onChange={(v) => handleColor("clockDisplayBackground", v)}
        />
        <ColorRow
          label="Display text"
          value={localConfig.clockDisplayTextColor}
          onChange={(v) => handleColor("clockDisplayTextColor", v)}
        />
        <ColorRow
          label="AM/PM active"
          value={localConfig.clockAmPmActiveBackground}
          onChange={(v) => handleColor("clockAmPmActiveBackground", v)}
        />
      </Section>

      {/* Footer Buttons */}
      <Section title="Footer Buttons">
        <ColorRow
          label="Cancel text"
          value={localConfig.cancelButtonColor}
          onChange={(v) => handleColor("cancelButtonColor", v)}
        />
        <ColorRow
          label="OK background"
          value={localConfig.okButtonBackground}
          onChange={(v) => handleColor("okButtonBackground", v)}
        />
        <ColorRow
          label="OK text"
          value={localConfig.okButtonTextColor}
          onChange={(v) => handleColor("okButtonTextColor", v)}
        />
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <SliderRow
          label="Font size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
