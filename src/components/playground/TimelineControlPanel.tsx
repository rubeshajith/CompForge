"use client";

import { useState, useMemo, useEffect } from "react";
import { TimelineConfig, TimelineMode } from "@/lib/timelineConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface TimelineControlPanelProps {
  config: TimelineConfig;
  onChange: (patch: Partial<TimelineConfig>) => void;
  onReset: () => void;
  isDark: boolean;
}

export function TimelineControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: TimelineControlPanelProps) {
  const [localConfig, setLocalConfig] = useState<TimelineConfig>(config);

  // Keep local in sync when parent resets / mode switches
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<TimelineConfig>) => onChange(patch), 100),
    [onChange],
  );

  function handleSlider<K extends keyof TimelineConfig>(
    key: K,
    value: TimelineConfig[K],
  ) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value } as Partial<TimelineConfig>);
  }

  function handleImmediate<K extends keyof TimelineConfig>(
    key: K,
    value: TimelineConfig[K],
  ) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<TimelineConfig>);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ──────────────────────────────────────────────── */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleImmediate("backgroundColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate("borderColor", v)}
          isDark={isDark}
        />
        <SliderRow
          label="Border radius"
          value={localConfig.borderRadius}
          min={0}
          max={28}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <ToggleRow
          label="Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate("showShadow", v)}
        />
      </Section>

      {/* ── Row / Card ─────────────────────────────────────────────── */}
      <Section title="Row Card">
        <ColorRow
          label="Row background"
          value={localConfig.rowBackground}
          onChange={(v) => handleImmediate("rowBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Hover border"
          value={localConfig.rowHoverBorderColor}
          onChange={(v) => handleImmediate("rowHoverBorderColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Expanded bg"
          value={localConfig.expandedRowBackground}
          onChange={(v) => handleImmediate("expandedRowBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Header strip"
          value={localConfig.headerStripBackground}
          onChange={(v) => handleImmediate("headerStripBackground", v)}
          isDark={isDark}
        />
        <ToggleRow
          label="Animate expand"
          value={localConfig.animateExpand}
          onChange={(v) => handleImmediate("animateExpand", v)}
        />
      </Section>

      {/* ── Path Connector ─────────────────────────────────────────── */}
      <Section title="Path Connector">
        <ColorRow
          label="Connector line"
          value={localConfig.pathConnectorColor}
          onChange={(v) => handleImmediate("pathConnectorColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Icon active bg"
          value={localConfig.iconActiveBackground}
          onChange={(v) => handleImmediate("iconActiveBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Icon active color"
          value={localConfig.iconActiveColor}
          onChange={(v) => handleImmediate("iconActiveColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Icon idle bg"
          value={localConfig.iconIdleBackground}
          onChange={(v) => handleImmediate("iconIdleBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Icon idle border"
          value={localConfig.iconIdleBorderColor}
          onChange={(v) => handleImmediate("iconIdleBorderColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Icon idle color"
          value={localConfig.iconIdleColor}
          onChange={(v) => handleImmediate("iconIdleColor", v)}
          isDark={isDark}
        />
        <SliderRow
          label="Icon radius"
          value={localConfig.iconBorderRadius}
          min={0}
          max={50}
          unit="%"
          onChange={(v) => handleSlider("iconBorderRadius", v)}
          onChangeEnd={(v) => onChange({ iconBorderRadius: v })}
        />
      </Section>

      {/* ── Typography ─────────────────────────────────────────────── */}
      <Section title="Typography">
        <ColorRow
          label="Title color"
          value={localConfig.titleColor}
          onChange={(v) => handleImmediate("titleColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Subtitle color"
          value={localConfig.subtitleColor}
          onChange={(v) => handleImmediate("subtitleColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Date active"
          value={localConfig.dateActiveColor}
          onChange={(v) => handleImmediate("dateActiveColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Date idle"
          value={localConfig.dateIdleColor}
          onChange={(v) => handleImmediate("dateIdleColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Year color"
          value={localConfig.yearColor}
          onChange={(v) => handleImmediate("yearColor", v)}
          isDark={isDark}
        />
        <SliderRow
          label="Body font size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
        <SliderRow
          label="Title font size"
          value={localConfig.titleFontSize}
          min={12}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("titleFontSize", v)}
          onChangeEnd={(v) => onChange({ titleFontSize: v })}
        />
      </Section>

      {/* ── KPI Colors ─────────────────────────────────────────────── */}
      <Section title="KPI Colors">
        <ColorRow
          label="Volatility"
          value={localConfig.volatilityColor}
          onChange={(v) => handleImmediate("volatilityColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Delta positive"
          value={localConfig.deltaPositiveColor}
          onChange={(v) => handleImmediate("deltaPositiveColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Delta negative"
          value={localConfig.deltaNegativeColor}
          onChange={(v) => handleImmediate("deltaNegativeColor", v)}
          isDark={isDark}
        />
      </Section>

      {/* ── Risk Badges ────────────────────────────────────────────── */}
      <Section title="Risk Badges">
        <ColorRow
          label="Low — bg"
          value={localConfig.riskLowBackground}
          onChange={(v) => handleImmediate("riskLowBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Low — text"
          value={localConfig.riskLowColor}
          onChange={(v) => handleImmediate("riskLowColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Minimal — bg"
          value={localConfig.riskMinimalBackground}
          onChange={(v) => handleImmediate("riskMinimalBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Minimal — text"
          value={localConfig.riskMinimalColor}
          onChange={(v) => handleImmediate("riskMinimalColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Moderate — bg"
          value={localConfig.riskModerateBackground}
          onChange={(v) => handleImmediate("riskModerateBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Moderate — text"
          value={localConfig.riskModerateColor}
          onChange={(v) => handleImmediate("riskModerateColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="High — bg"
          value={localConfig.riskHighBackground}
          onChange={(v) => handleImmediate("riskHighBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="High — text"
          value={localConfig.riskHighColor}
          onChange={(v) => handleImmediate("riskHighColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Critical — bg"
          value={localConfig.riskCriticalBackground}
          onChange={(v) => handleImmediate("riskCriticalBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Critical — text"
          value={localConfig.riskCriticalColor}
          onChange={(v) => handleImmediate("riskCriticalColor", v)}
          isDark={isDark}
        />
      </Section>

      {/* ── Expanded Panel ─────────────────────────────────────────── */}
      <Section title="Expanded Panel">
        <ColorRow
          label="Section label"
          value={localConfig.sectionLabelColor}
          onChange={(v) => handleImmediate("sectionLabelColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Narrative text"
          value={localConfig.narrativeTextColor}
          onChange={(v) => handleImmediate("narrativeTextColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Impact card bg"
          value={localConfig.impactCardBackground}
          onChange={(v) => handleImmediate("impactCardBackground", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Bar track"
          value={localConfig.impactBarTrackColor}
          onChange={(v) => handleImmediate("impactBarTrackColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Bar fill"
          value={localConfig.impactBarFillColor}
          onChange={(v) => handleImmediate("impactBarFillColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Impact label"
          value={localConfig.impactLabelColor}
          onChange={(v) => handleImmediate("impactLabelColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Impact value"
          value={localConfig.impactValueColor}
          onChange={(v) => handleImmediate("impactValueColor", v)}
          isDark={isDark}
        />
        <ColorRow
          label="Divider"
          value={localConfig.expandedDividerColor}
          onChange={(v) => handleImmediate("expandedDividerColor", v)}
          isDark={isDark}
        />
      </Section>
    </ControlPanelShell>
  );
}
