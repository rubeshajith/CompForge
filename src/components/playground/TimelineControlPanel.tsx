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
  mode: "dark" | "light";
}

export function TimelineControlPanel({
  config,
  onChange,
  onReset,
  mode,
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
        />
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate("borderColor", v)}
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
        />
        <ColorRow
          label="Hover border"
          value={localConfig.rowHoverBorderColor}
          onChange={(v) => handleImmediate("rowHoverBorderColor", v)}
        />
        <ColorRow
          label="Expanded bg"
          value={localConfig.expandedRowBackground}
          onChange={(v) => handleImmediate("expandedRowBackground", v)}
        />
        <ColorRow
          label="Header strip"
          value={localConfig.headerStripBackground}
          onChange={(v) => handleImmediate("headerStripBackground", v)}
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
        />
        <ColorRow
          label="Icon active bg"
          value={localConfig.iconActiveBackground}
          onChange={(v) => handleImmediate("iconActiveBackground", v)}
        />
        <ColorRow
          label="Icon active color"
          value={localConfig.iconActiveColor}
          onChange={(v) => handleImmediate("iconActiveColor", v)}
        />
        <ColorRow
          label="Icon idle bg"
          value={localConfig.iconIdleBackground}
          onChange={(v) => handleImmediate("iconIdleBackground", v)}
        />
        <ColorRow
          label="Icon idle border"
          value={localConfig.iconIdleBorderColor}
          onChange={(v) => handleImmediate("iconIdleBorderColor", v)}
        />
        <ColorRow
          label="Icon idle color"
          value={localConfig.iconIdleColor}
          onChange={(v) => handleImmediate("iconIdleColor", v)}
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
        />
        <ColorRow
          label="Subtitle color"
          value={localConfig.subtitleColor}
          onChange={(v) => handleImmediate("subtitleColor", v)}
        />
        <ColorRow
          label="Date active"
          value={localConfig.dateActiveColor}
          onChange={(v) => handleImmediate("dateActiveColor", v)}
        />
        <ColorRow
          label="Date idle"
          value={localConfig.dateIdleColor}
          onChange={(v) => handleImmediate("dateIdleColor", v)}
        />
        <ColorRow
          label="Year color"
          value={localConfig.yearColor}
          onChange={(v) => handleImmediate("yearColor", v)}
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
        />
        <ColorRow
          label="Delta positive"
          value={localConfig.deltaPositiveColor}
          onChange={(v) => handleImmediate("deltaPositiveColor", v)}
        />
        <ColorRow
          label="Delta negative"
          value={localConfig.deltaNegativeColor}
          onChange={(v) => handleImmediate("deltaNegativeColor", v)}
        />
      </Section>

      {/* ── Risk Badges ────────────────────────────────────────────── */}
      <Section title="Risk Badges">
        <ColorRow
          label="Low — bg"
          value={localConfig.riskLowBackground}
          onChange={(v) => handleImmediate("riskLowBackground", v)}
        />
        <ColorRow
          label="Low — text"
          value={localConfig.riskLowColor}
          onChange={(v) => handleImmediate("riskLowColor", v)}
        />
        <ColorRow
          label="Minimal — bg"
          value={localConfig.riskMinimalBackground}
          onChange={(v) => handleImmediate("riskMinimalBackground", v)}
        />
        <ColorRow
          label="Minimal — text"
          value={localConfig.riskMinimalColor}
          onChange={(v) => handleImmediate("riskMinimalColor", v)}
        />
        <ColorRow
          label="Moderate — bg"
          value={localConfig.riskModerateBackground}
          onChange={(v) => handleImmediate("riskModerateBackground", v)}
        />
        <ColorRow
          label="Moderate — text"
          value={localConfig.riskModerateColor}
          onChange={(v) => handleImmediate("riskModerateColor", v)}
        />
        <ColorRow
          label="High — bg"
          value={localConfig.riskHighBackground}
          onChange={(v) => handleImmediate("riskHighBackground", v)}
        />
        <ColorRow
          label="High — text"
          value={localConfig.riskHighColor}
          onChange={(v) => handleImmediate("riskHighColor", v)}
        />
        <ColorRow
          label="Critical — bg"
          value={localConfig.riskCriticalBackground}
          onChange={(v) => handleImmediate("riskCriticalBackground", v)}
        />
        <ColorRow
          label="Critical — text"
          value={localConfig.riskCriticalColor}
          onChange={(v) => handleImmediate("riskCriticalColor", v)}
        />
      </Section>

      {/* ── Expanded Panel ─────────────────────────────────────────── */}
      <Section title="Expanded Panel">
        <ColorRow
          label="Section label"
          value={localConfig.sectionLabelColor}
          onChange={(v) => handleImmediate("sectionLabelColor", v)}
        />
        <ColorRow
          label="Narrative text"
          value={localConfig.narrativeTextColor}
          onChange={(v) => handleImmediate("narrativeTextColor", v)}
        />
        <ColorRow
          label="Impact card bg"
          value={localConfig.impactCardBackground}
          onChange={(v) => handleImmediate("impactCardBackground", v)}
        />
        <ColorRow
          label="Bar track"
          value={localConfig.impactBarTrackColor}
          onChange={(v) => handleImmediate("impactBarTrackColor", v)}
        />
        <ColorRow
          label="Bar fill"
          value={localConfig.impactBarFillColor}
          onChange={(v) => handleImmediate("impactBarFillColor", v)}
        />
        <ColorRow
          label="Impact label"
          value={localConfig.impactLabelColor}
          onChange={(v) => handleImmediate("impactLabelColor", v)}
        />
        <ColorRow
          label="Impact value"
          value={localConfig.impactValueColor}
          onChange={(v) => handleImmediate("impactValueColor", v)}
        />
        <ColorRow
          label="Divider"
          value={localConfig.expandedDividerColor}
          onChange={(v) => handleImmediate("expandedDividerColor", v)}
        />
      </Section>
    </ControlPanelShell>
  );
}
