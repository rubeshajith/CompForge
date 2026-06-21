"use client";

// /components/playground/AnalyticsTableControlPanel.tsx

import { useState, useMemo, useCallback } from "react";
import { AnalyticsTableConfig } from "@/lib/analyticsTableConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: AnalyticsTableConfig;
  onChange: (patch: Partial<AnalyticsTableConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function AnalyticsTableControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: Props) {
  const [lc, setLc] = useState<AnalyticsTableConfig>(config);

  useMemo(() => setLc(config), [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 90), [onChange]);

  const handleSlider = useCallback(
    (key: keyof AnalyticsTableConfig) => (value: number) => {
      setLc((prev) => ({ ...prev, [key]: value }));
      debouncedOnChange({ [key]: value });
    },
    [debouncedOnChange],
  );

  const handleSliderEnd = useCallback(
    (key: keyof AnalyticsTableConfig) => (value: number) => {
      onChange({ [key]: value });
    },
    [onChange],
  );

  const handleColor = useCallback(
    (key: keyof AnalyticsTableConfig) => (value: string) => {
      setLc((prev) => ({ ...prev, [key]: value }));
      onChange({ [key]: value });
    },
    [onChange],
  );

  const handleToggle = useCallback(
    (key: keyof AnalyticsTableConfig) => (value: boolean) => {
      setLc((prev) => ({ ...prev, [key]: value }));
      onChange({ [key]: value });
    },
    [onChange],
  );

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Behavior ── */}
      <Section title="Behavior">
        <ToggleRow
          label="Show Checkboxes"
          value={lc.showCheckboxes}
          onChange={handleToggle("showCheckboxes")}
        />
        <ToggleRow
          label="Show Sparklines"
          value={lc.showSparklines}
          onChange={handleToggle("showSparklines")}
        />
        <ToggleRow
          label="Show Churn Bar"
          value={lc.showChurnBar}
          onChange={handleToggle("showChurnBar")}
        />
        <ToggleRow
          label="Show Pagination"
          value={lc.showPagination}
          onChange={handleToggle("showPagination")}
        />
        <ToggleRow
          label="Animate Expand"
          value={lc.animateExpand}
          onChange={handleToggle("animateExpand")}
        />
        <ToggleRow
          label="Sync Footer"
          value={lc.showSyncFooter}
          onChange={handleToggle("showSyncFooter")}
        />
        <ToggleRow
          label="Drop Shadow"
          value={lc.showShadow}
          onChange={handleToggle("showShadow")}
        />
        <SliderRow
          label="Rows per Page"
          value={lc.rowsPerPage}
          min={2}
          max={8}
          unit=""
          onChange={handleSlider("rowsPerPage")}
          onChangeEnd={handleSliderEnd("rowsPerPage")}
        />
      </Section>

      {/* ── Layout ── */}
      <Section title="Layout">
        <SliderRow
          label="Table Radius"
          value={lc.tableBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={handleSlider("tableBorderRadius")}
          onChangeEnd={handleSliderEnd("tableBorderRadius")}
        />
        <SliderRow
          label="Cell / Badge Radius"
          value={lc.borderRadius}
          min={0}
          max={16}
          unit="px"
          onChange={handleSlider("borderRadius")}
          onChangeEnd={handleSliderEnd("borderRadius")}
        />
        <SliderRow
          label="Avatar Radius"
          value={lc.avatarRadius}
          min={0}
          max={50}
          unit="%"
          onChange={handleSlider("avatarRadius")}
          onChangeEnd={handleSliderEnd("avatarRadius")}
        />
        <SliderRow
          label="Font Size"
          value={lc.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={handleSlider("fontSize")}
          onChangeEnd={handleSliderEnd("fontSize")}
        />
      </Section>

      {/* ── Table Surface ── */}
      <Section title="Table Surface">
        <ColorRow
          label="Table BG"
          value={lc.tableBackground}
          onChange={handleColor("tableBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={lc.tableBorderColor}
          onChange={handleColor("tableBorderColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Header BG"
          value={lc.headerBackground}
          onChange={handleColor("headerBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Header Text"
          value={lc.headerTextColor}
          onChange={handleColor("headerTextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Rows ── */}
      <Section title="Rows">
        <ColorRow
          label="Row BG"
          value={lc.rowBackground}
          onChange={handleColor("rowBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Hover BG"
          value={lc.rowHoverBackground}
          onChange={handleColor("rowHoverBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Selected BG"
          value={lc.rowSelectedBackground}
          onChange={handleColor("rowSelectedBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Row Border"
          value={lc.rowBorderColor}
          onChange={handleColor("rowBorderColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Primary Text"
          value={lc.rowTextColor}
          onChange={handleColor("rowTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Subtext"
          value={lc.rowSubtextColor}
          onChange={handleColor("rowSubtextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Status Badges ── */}
      <Section title="Status Badges">
        <ColorRow
          label="Active BG"
          value={lc.activeBackground}
          onChange={handleColor("activeBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Active Text"
          value={lc.activeTextColor}
          onChange={handleColor("activeTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Pending BG"
          value={lc.pendingBackground}
          onChange={handleColor("pendingBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Pending Text"
          value={lc.pendingTextColor}
          onChange={handleColor("pendingTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="At-Risk BG"
          value={lc.atRiskBackground}
          onChange={handleColor("atRiskBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="At-Risk Text"
          value={lc.atRiskTextColor}
          onChange={handleColor("atRiskTextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Churn Risk Bar ── */}
      <Section title="Churn Risk Bar">
        <ColorRow
          label="Track Color"
          value={lc.riskBarTrackColor}
          onChange={handleColor("riskBarTrackColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Low Risk"
          value={lc.riskLowColor}
          onChange={handleColor("riskLowColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Med Risk"
          value={lc.riskMedColor}
          onChange={handleColor("riskMedColor")}
          isDark={isDark}
/>
        <ColorRow
          label="High Risk"
          value={lc.riskHighColor}
          onChange={handleColor("riskHighColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Sparklines ── */}
      <Section title="Sparklines">
        <ColorRow
          label="Healthy"
          value={lc.sparklineColorHealthy}
          onChange={handleColor("sparklineColorHealthy")}
          isDark={isDark}
/>
        <ColorRow
          label="Declining"
          value={lc.sparklineColorDeclining}
          onChange={handleColor("sparklineColorDeclining")}
          isDark={isDark}
/>
        <ColorRow
          label="At-Risk"
          value={lc.sparklineColorAtRisk}
          onChange={handleColor("sparklineColorAtRisk")}
          isDark={isDark}
/>
      </Section>

      {/* ── Expanded Panel ── */}
      <Section title="Expanded Panel">
        <ColorRow
          label="Panel BG"
          value={lc.expandedBackground}
          onChange={handleColor("expandedBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Border"
          value={lc.expandedBorderAccentColor}
          onChange={handleColor("expandedBorderAccentColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Chart BG"
          value={lc.expandedChartBackground}
          onChange={handleColor("expandedChartBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Chart Bar"
          value={lc.expandedChartBarColor}
          onChange={handleColor("expandedChartBarColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Chart Highlight"
          value={lc.expandedChartBarHighlight}
          onChange={handleColor("expandedChartBarHighlight")}
          isDark={isDark}
/>
        <ColorRow
          label="Meta BG"
          value={lc.expandedMetaBackground}
          onChange={handleColor("expandedMetaBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Meta Border"
          value={lc.expandedMetaBorderColor}
          onChange={handleColor("expandedMetaBorderColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Meta Label"
          value={lc.expandedMetaLabelColor}
          onChange={handleColor("expandedMetaLabelColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Meta Value"
          value={lc.expandedMetaValueColor}
          onChange={handleColor("expandedMetaValueColor")}
          isDark={isDark}
/>
        <ColorRow
          label="CTA Button"
          value={lc.ctaBackground}
          onChange={handleColor("ctaBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="CTA Text"
          value={lc.ctaTextColor}
          onChange={handleColor("ctaTextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Accent ── */}
      <Section title="Accent">
        <ColorRow
          label="Accent Color"
          value={lc.accentColor}
          onChange={handleColor("accentColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Text"
          value={lc.accentTextColor}
          onChange={handleColor("accentTextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ── Pagination ── */}
      <Section title="Pagination">
        <ColorRow
          label="Bar BG"
          value={lc.paginationBackground}
          onChange={handleColor("paginationBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Active BG"
          value={lc.paginationActiveBackground}
          onChange={handleColor("paginationActiveBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Active Text"
          value={lc.paginationActiveTextColor}
          onChange={handleColor("paginationActiveTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Page Text"
          value={lc.paginationTextColor}
          onChange={handleColor("paginationTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={lc.paginationBorderColor}
          onChange={handleColor("paginationBorderColor")}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
