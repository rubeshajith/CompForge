"use client";

// /components/playground/DataTableControlPanel.tsx

import { useState, useMemo, useCallback } from "react";
import { DataTableConfig } from "@/lib/dataTableConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface DataTableControlPanelProps {
  config: DataTableConfig;
  onChange: (patch: Partial<DataTableConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function DataTableControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: DataTableControlPanelProps) {
  const [localConfig, setLocalConfig] = useState<DataTableConfig>(config);

  // Keep localConfig in sync when config changes externally (e.g. mode switch)
  useMemo(() => setLocalConfig(config), [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 90), [onChange]);

  const handleSlider = useCallback(
    (key: keyof DataTableConfig) => (value: number) => {
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
      debouncedOnChange({ [key]: value });
    },
    [debouncedOnChange],
  );

  const handleSliderEnd = useCallback(
    (key: keyof DataTableConfig) => (value: number) => {
      onChange({ [key]: value });
    },
    [onChange],
  );

  const handleColor = useCallback(
    (key: keyof DataTableConfig) => (value: string) => {
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
      onChange({ [key]: value });
    },
    [onChange],
  );

  const handleToggle = useCallback(
    (key: keyof DataTableConfig) => (value: boolean) => {
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
      onChange({ [key]: value });
    },
    [onChange],
  );

  const lc = localConfig;

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ─── Behavior ─── */}
      <Section title="Behavior">
        <ToggleRow
          label="Show Filters Bar"
          value={lc.showFilters}
          onChange={handleToggle("showFilters")}
        />
        <ToggleRow
          label="Show Pagination"
          value={lc.showPagination}
          onChange={handleToggle("showPagination")}
        />
        <ToggleRow
          label="Show Checkboxes"
          value={lc.showCheckboxes}
          onChange={handleToggle("showCheckboxes")}
        />
        <ToggleRow
          label="Show Context Cards"
          value={lc.showContextCards}
          onChange={handleToggle("showContextCards")}
        />
        <ToggleRow
          label="Striped Rows"
          value={lc.stripedRows}
          onChange={handleToggle("stripedRows")}
        />
        <ToggleRow
          label="Animate Expand"
          value={lc.animateExpand}
          onChange={handleToggle("animateExpand")}
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

      {/* ─── Layout ─── */}
      <Section title="Layout">
        <SliderRow
          label="Border Radius"
          value={lc.tableBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={handleSlider("tableBorderRadius")}
          onChangeEnd={handleSliderEnd("tableBorderRadius")}
        />
        <SliderRow
          label="Cell Radius"
          value={lc.borderRadius}
          min={0}
          max={16}
          unit="px"
          onChange={handleSlider("borderRadius")}
          onChangeEnd={handleSliderEnd("borderRadius")}
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

      {/* ─── Table Surface ─── */}
      <Section title="Table Surface">
        <ColorRow
          label="Table Background"
          value={lc.tableBackground}
          onChange={handleColor("tableBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Border Color"
          value={lc.tableBorderColor}
          onChange={handleColor("tableBorderColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Header Background"
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

      {/* ─── Rows ─── */}
      <Section title="Rows">
        <ColorRow
          label="Row Background"
          value={lc.rowBackground}
          onChange={handleColor("rowBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Row Hover"
          value={lc.rowHoverBackground}
          onChange={handleColor("rowHoverBackground")}
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
          label="Subtext / Muted"
          value={lc.rowSubtextColor}
          onChange={handleColor("rowSubtextColor")}
        />
      </Section>

      {/* ─── Expanded Row ─── */}
      <Section title="Expanded Row">
        <ColorRow
          label="Expand Background"
          value={lc.expandedRowBackground}
          onChange={handleColor("expandedRowBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Border"
          value={lc.expandedBorderAccentColor}
          onChange={handleColor("expandedBorderAccentColor")}
          isDark={isDark}
/>
      </Section>

      {/* ─── Filters Bar ─── */}
      <Section title="Filters Bar">
        <ColorRow
          label="Bar Background"
          value={lc.filterBarBackground}
          onChange={handleColor("filterBarBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Chip Background"
          value={lc.filterChipBackground}
          onChange={handleColor("filterChipBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Chip Text"
          value={lc.filterChipTextColor}
          onChange={handleColor("filterChipTextColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Chip Border"
          value={lc.filterChipBorderColor}
          onChange={handleColor("filterChipBorderColor")}
          isDark={isDark}
/>
      </Section>

      {/* ─── Amounts ─── */}
      <Section title="Amounts">
        <ColorRow
          label="Debit Color"
          value={lc.debitColor}
          onChange={handleColor("debitColor")}
          isDark={isDark}
/>
        <ColorRow
          label="Credit Color"
          value={lc.creditColor}
          onChange={handleColor("creditColor")}
          isDark={isDark}
/>
      </Section>

      {/* ─── Status Badges ─── */}
      <Section title="Status Badges">
        <ColorRow
          label="Completed BG"
          value={lc.completedBackground}
          onChange={handleColor("completedBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Completed Text"
          value={lc.completedTextColor}
          onChange={handleColor("completedTextColor")}
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
          label="Flagged BG"
          value={lc.flaggedBackground}
          onChange={handleColor("flaggedBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Flagged Text"
          value={lc.flaggedTextColor}
          onChange={handleColor("flaggedTextColor")}
          isDark={isDark}
/>
      </Section>

      {/* ─── Accent ─── */}
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

      {/* ─── Pagination ─── */}
      <Section title="Pagination">
        <ColorRow
          label="Pagination BG"
          value={lc.paginationBackground}
          onChange={handleColor("paginationBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Active Page BG"
          value={lc.paginationActiveBackground}
          onChange={handleColor("paginationActiveBackground")}
          isDark={isDark}
/>
        <ColorRow
          label="Active Page Text"
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
          label="Page Border"
          value={lc.paginationBorderColor}
          onChange={handleColor("paginationBorderColor")}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
