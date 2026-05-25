"use client";

// /components/playground/IndiaMapControlPanel.tsx

import { useState, useMemo } from "react";
import { IndiaMapConfig, MapMetric, ChartType } from "@/lib/indiaMapConfig";
import { debounce } from "@/utils/debounce";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";

interface IndiaMapControlPanelProps {
  config: IndiaMapConfig;
  onChange: (patch: Partial<IndiaMapConfig>) => void;
  onReset: () => void;
}

const METRIC_OPTIONS: { value: MapMetric; label: string }[] = [
  { value: "gdp", label: "GDP" },
  { value: "population", label: "Population" },
  { value: "literacy", label: "Literacy" },
  { value: "healthIndex", label: "Health Index" },
];

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "scatter", label: "Scatter" },
  { value: "bar", label: "Bar" },
  { value: "bubble", label: "Bubble" },
];

export function IndiaMapControlPanel({
  config,
  onChange,
  onReset,
}: IndiaMapControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSliderChange(patch: Partial<IndiaMapConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleSliderEnd(patch: Partial<IndiaMapConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  // Sync when config resets externally
  if (
    localConfig.mapBackground !== config.mapBackground &&
    localConfig.stateSelectedFill !== config.stateSelectedFill
  ) {
    setLocalConfig(config);
  }

  const selectStyle: React.CSSProperties = {
    background: "#141418",
    border: "1px solid #2a2a38",
    color: "#f0f0f5",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    width: "100%",
    cursor: "pointer",
    outline: "none",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "0 0 10px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "#9090a8",
    fontFamily: "'DM Mono', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Metric & Chart Type ── */}
      <Section title="Data">
        <div style={rowStyle}>
          <span style={labelStyle}>Active Metric</span>
          <select
            value={localConfig.activeMetric}
            onChange={(e) => {
              const v = e.target.value as MapMetric;
              setLocalConfig((p) => ({ ...p, activeMetric: v }));
              onChange({ activeMetric: v });
            }}
            style={selectStyle}
          >
            {METRIC_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Chart Type</span>
          <select
            value={localConfig.chartType}
            onChange={(e) => {
              const v = e.target.value as ChartType;
              setLocalConfig((p) => ({ ...p, chartType: v }));
              onChange({ chartType: v });
            }}
            style={selectStyle}
          >
            {CHART_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <ToggleRow
          label="Choropleth Fill"
          value={localConfig.showChoropleth}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, showChoropleth: v }));
            onChange({ showChoropleth: v });
          }}
        />
        <ToggleRow
          label="State Labels"
          value={localConfig.showStateLabels}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, showStateLabels: v }));
            onChange({ showStateLabels: v });
          }}
        />
      </Section>

      {/* ── Map Colors ── */}
      <Section title="Map Colors">
        <ColorRow
          label="Map Background"
          value={localConfig.mapBackground}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, mapBackground: v }));
            onChange({ mapBackground: v });
          }}
        />
        <ColorRow
          label="State Default Fill"
          value={localConfig.stateDefaultFill}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, stateDefaultFill: v }));
            onChange({ stateDefaultFill: v });
          }}
        />
        <ColorRow
          label="State Hover Fill"
          value={localConfig.stateHoverFill}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, stateHoverFill: v }));
            onChange({ stateHoverFill: v });
          }}
        />
        <ColorRow
          label="State Selected"
          value={localConfig.stateSelectedFill}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, stateSelectedFill: v }));
            onChange({ stateSelectedFill: v });
          }}
        />
        <ColorRow
          label="State Borders"
          value={localConfig.stateBorderColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, stateBorderColor: v }));
            onChange({ stateBorderColor: v });
          }}
        />
        <SliderRow
          label="Border Width"
          value={localConfig.stateBorderWidth}
          min={0}
          max={4}
          unit="px"
          onChange={(v) => handleSliderChange({ stateBorderWidth: v })}
          onChangeEnd={(v) => handleSliderEnd({ stateBorderWidth: v })}
        />
      </Section>

      {/* ── Choropleth ── */}
      <Section title="Choropleth Gradient">
        <ColorRow
          label="Low Value Color"
          value={localConfig.choroplethLow}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, choroplethLow: v }));
            onChange({ choroplethLow: v });
          }}
        />
        <ColorRow
          label="High Value Color"
          value={localConfig.choroplethHigh}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, choroplethHigh: v }));
            onChange({ choroplethHigh: v });
          }}
        />
      </Section>

      {/* ── Chart Panel ── */}
      <Section title="Chart Panel">
        <ColorRow
          label="Panel Background"
          value={localConfig.chartBackground}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, chartBackground: v }));
            onChange({ chartBackground: v });
          }}
        />
        <ColorRow
          label="Panel Border"
          value={localConfig.chartBorderColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, chartBorderColor: v }));
            onChange({ chartBorderColor: v });
          }}
        />
        <ColorRow
          label="Accent Color"
          value={localConfig.chartAccentColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, chartAccentColor: v }));
            onChange({ chartAccentColor: v });
          }}
        />
        <ColorRow
          label="Secondary Color"
          value={localConfig.chartSecondaryColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, chartSecondaryColor: v }));
            onChange({ chartSecondaryColor: v });
          }}
        />
        <ColorRow
          label="Grid Color"
          value={localConfig.chartGridColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, chartGridColor: v }));
            onChange({ chartGridColor: v });
          }}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.chartBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSliderChange({ chartBorderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ chartBorderRadius: v })}
        />
        <SliderRow
          label="Dot Size"
          value={localConfig.chartDotSize}
          min={3}
          max={14}
          unit="px"
          onChange={(v) => handleSliderChange({ chartDotSize: v })}
          onChangeEnd={(v) => handleSliderEnd({ chartDotSize: v })}
        />
      </Section>

      {/* ── Tooltip ── */}
      <Section title="Tooltip">
        <ColorRow
          label="Background"
          value={localConfig.tooltipBackground}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, tooltipBackground: v }));
            onChange({ tooltipBackground: v });
          }}
        />
        <ColorRow
          label="Text Color"
          value={localConfig.tooltipTextColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, tooltipTextColor: v }));
            onChange({ tooltipTextColor: v });
          }}
        />
        <ColorRow
          label="Border Color"
          value={localConfig.tooltipBorderColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, tooltipBorderColor: v }));
            onChange({ tooltipBorderColor: v });
          }}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.tooltipBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSliderChange({ tooltipBorderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ tooltipBorderRadius: v })}
        />
      </Section>

      {/* ── Labels ── */}
      <Section title="Labels">
        <ColorRow
          label="Label Color"
          value={localConfig.stateLabelColor}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, stateLabelColor: v }));
            onChange({ stateLabelColor: v });
          }}
        />
        <SliderRow
          label="Label Size"
          value={localConfig.stateLabelSize}
          min={6}
          max={14}
          unit="px"
          onChange={(v) => handleSliderChange({ stateLabelSize: v })}
          onChangeEnd={(v) => handleSliderEnd({ stateLabelSize: v })}
        />
      </Section>

      {/* ── Size ── */}
      <Section title="Dimensions">
        <SliderRow
          label="Map Width"
          value={localConfig.mapWidth}
          min={320}
          max={600}
          unit="px"
          onChange={(v) => handleSliderChange({ mapWidth: v })}
          onChangeEnd={(v) => handleSliderEnd({ mapWidth: v })}
        />
        <SliderRow
          label="Map Height"
          value={localConfig.mapHeight}
          min={360}
          max={700}
          unit="px"
          onChange={(v) => handleSliderChange({ mapHeight: v })}
          onChangeEnd={(v) => handleSliderEnd({ mapHeight: v })}
        />
      </Section>

      {/* ── Behavior ── */}
      <Section title="Behavior">
        <ToggleRow
          label="Shadow"
          value={localConfig.showShadow}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, showShadow: v }));
            onChange({ showShadow: v });
          }}
        />
        <ToggleRow
          label="Animate Transitions"
          value={localConfig.animateTransition}
          onChange={(v) => {
            setLocalConfig((p) => ({ ...p, animateTransition: v }));
            onChange({ animateTransition: v });
          }}
        />
      </Section>
    </ControlPanelShell>
  );
}
