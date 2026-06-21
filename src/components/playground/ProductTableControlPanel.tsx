"use client";

// /components/playground/ProductTableControlPanel.tsx

import { useMemo, useState, useEffect } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { DataTableConfig } from "@/lib/productTableConfig";
import { debounce } from "@/utils/debounce";

interface DataTableControlPanelProps {
  config: DataTableConfig;
  onChange: (patch: Partial<DataTableConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function ProductTableControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: DataTableControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<DataTableConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(key: keyof DataTableConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleChange(patch: Partial<DataTableConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Layout & Sizing ── */}
      <Section title="Layout & Sizing">
        <div className="row">
          <span className="label">Density</span>
          <select
            value={localConfig.density}
            onChange={(e) =>
              handleChange({
                density: e.target.value as DataTableConfig["density"],
              })
            }
            style={{
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 4,
              background: "var(--bg-3)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
        <SliderRow
          label="Table Max Width"
          value={localConfig.tableWidth}
          min={600}
          max={1600}
          unit="px"
          onChange={(v) => handleSlider("tableWidth", v)}
          onChangeEnd={(v) => onChange({ tableWidth: v })}
        />
        <SliderRow
          label="Detail Panel Width"
          value={localConfig.detailPanelWidth}
          min={240}
          max={480}
          unit="px"
          onChange={(v) => handleSlider("detailPanelWidth", v)}
          onChangeEnd={(v) => onChange({ detailPanelWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <SliderRow
          label="Low Stock Threshold"
          value={localConfig.lowStockThreshold}
          min={0}
          max={100}
          unit=""
          onChange={(v) => handleSlider("lowStockThreshold", v)}
          onChangeEnd={(v) => onChange({ lowStockThreshold: v })}
        />
      </Section>

      {/* ── Shell Colors ── */}
      <Section title="Shell Colors">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleChange({ backgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Header Background"
          value={localConfig.headerBackgroundColor}
          onChange={(v) => handleChange({ headerBackgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Row Hover"
          value={localConfig.rowHoverColor}
          onChange={(v) => handleChange({ rowHoverColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Selected Row"
          value={localConfig.selectedRowColor}
          onChange={(v) => handleChange({ selectedRowColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleChange({ borderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Row Divider"
          value={localConfig.dividerColor}
          onChange={(v) => handleChange({ dividerColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <ColorRow
          label="Header Text"
          value={localConfig.headerTextColor}
          onChange={(v) => handleChange({ headerTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Header Font Size"
          value={localConfig.headerFontSize}
          min={9}
          max={14}
          unit="px"
          onChange={(v) => handleSlider("headerFontSize", v)}
          onChangeEnd={(v) => onChange({ headerFontSize: v })}
        />
        <ColorRow
          label="Cell Text"
          value={localConfig.cellTextColor}
          onChange={(v) => handleChange({ cellTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Cell Muted Text"
          value={localConfig.cellMutedColor}
          onChange={(v) => handleChange({ cellMutedColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Cell Font Size"
          value={localConfig.cellFontSize}
          min={10}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("cellFontSize", v)}
          onChangeEnd={(v) => onChange({ cellFontSize: v })}
        />
      </Section>

      {/* ── Accent ── */}
      <Section title="Accent & SKU">
        <ColorRow
          label="Accent Color"
          value={localConfig.accentColor}
          onChange={(v) => handleChange({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Text"
          value={localConfig.accentTextColor}
          onChange={(v) => handleChange({ accentTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="SKU Color"
          value={localConfig.skuColor}
          onChange={(v) => handleChange({ skuColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Status Badges ── */}
      <Section title="Status Badge Colors">
        <ColorRow
          label="In Stock — Bg"
          value={localConfig.inStockBg}
          onChange={(v) => handleChange({ inStockBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="In Stock — Text"
          value={localConfig.inStockText}
          onChange={(v) => handleChange({ inStockText: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Low Stock — Bg"
          value={localConfig.lowStockBg}
          onChange={(v) => handleChange({ lowStockBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Low Stock — Text"
          value={localConfig.lowStockText}
          onChange={(v) => handleChange({ lowStockText: v })}
          isDark={isDark}
/>
        <ColorRow
          label="OOS — Bg"
          value={localConfig.oosBg}
          onChange={(v) => handleChange({ oosBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="OOS — Text"
          value={localConfig.oosText}
          onChange={(v) => handleChange({ oosText: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Discontinued — Bg"
          value={localConfig.discontinuedBg}
          onChange={(v) => handleChange({ discontinuedBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Discontinued — Text"
          value={localConfig.discontinuedText}
          onChange={(v) => handleChange({ discontinuedText: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Toolbar ── */}
      <Section title="Toolbar">
        <ColorRow
          label="Toolbar Bg"
          value={localConfig.toolbarBackgroundColor}
          onChange={(v) => handleChange({ toolbarBackgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Toolbar Border"
          value={localConfig.toolbarBorderColor}
          onChange={(v) => handleChange({ toolbarBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Filter Chip Bg"
          value={localConfig.filterChipBg}
          onChange={(v) => handleChange({ filterChipBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Filter Chip Text"
          value={localConfig.filterChipText}
          onChange={(v) => handleChange({ filterChipText: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Detail Panel ── */}
      <Section title="Detail Panel">
        <ColorRow
          label="Panel Background"
          value={localConfig.panelBackgroundColor}
          onChange={(v) => handleChange({ panelBackgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Border"
          value={localConfig.panelBorderColor}
          onChange={(v) => handleChange({ panelBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Header Text"
          value={localConfig.panelHeaderColor}
          onChange={(v) => handleChange({ panelHeaderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Label"
          value={localConfig.panelLabelColor}
          onChange={(v) => handleChange({ panelLabelColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Value"
          value={localConfig.panelValueColor}
          onChange={(v) => handleChange({ panelValueColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Accent"
          value={localConfig.panelAccentColor}
          onChange={(v) => handleChange({ panelAccentColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Pagination / Footer ── */}
      <Section title="Pagination & Footer">
        <ColorRow
          label="Footer Bg"
          value={localConfig.footerBackgroundColor}
          onChange={(v) => handleChange({ footerBackgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer Text"
          value={localConfig.footerTextColor}
          onChange={(v) => handleChange({ footerTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Page Bg"
          value={localConfig.paginationActiveBg}
          onChange={(v) => handleChange({ paginationActiveBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Page Text"
          value={localConfig.paginationActiveText}
          onChange={(v) => handleChange({ paginationActiveText: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Bulk Action Bar ── */}
      <Section title="Bulk Action Bar">
        <ColorRow
          label="Bulk Bar Bg"
          value={localConfig.bulkBarBg}
          onChange={(v) => handleChange({ bulkBarBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Bulk Bar Text"
          value={localConfig.bulkBarText}
          onChange={(v) => handleChange({ bulkBarText: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Feature Toggles ── */}
      <Section title="Features">
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleChange({ showShadow: v })}
        />
        <ToggleRow
          label="Search Bar"
          value={localConfig.showSearchBar}
          onChange={(v) => handleChange({ showSearchBar: v })}
        />
        <ToggleRow
          label="Row Numbers"
          value={localConfig.showRowNumbers}
          onChange={(v) => handleChange({ showRowNumbers: v })}
        />
        <ToggleRow
          label="Bulk Actions"
          value={localConfig.showBulkActions}
          onChange={(v) => handleChange({ showBulkActions: v })}
        />
        <ToggleRow
          label="Sticky Header"
          value={localConfig.stickyHeader}
          onChange={(v) => handleChange({ stickyHeader: v })}
        />
        <ToggleRow
          label="Sticky First Column"
          value={localConfig.stickyFirstColumn}
          onChange={(v) => handleChange({ stickyFirstColumn: v })}
        />
        <ToggleRow
          label="Animate Detail Panel"
          value={localConfig.animateDetailPanel}
          onChange={(v) => handleChange({ animateDetailPanel: v })}
        />
        <ToggleRow
          label="Column Visibility Toggle"
          value={localConfig.showColumnVisibilityToggle}
          onChange={(v) => handleChange({ showColumnVisibilityToggle: v })}
        />
        <ToggleRow
          label="Sort Indicators"
          value={localConfig.showSortIndicators}
          onChange={(v) => handleChange({ showSortIndicators: v })}
        />
      </Section>

      {/* ── Default Column Visibility ── */}
      <Section title="Default Columns">
        {(
          Object.keys(
            localConfig.columnVisibility,
          ) as (keyof typeof localConfig.columnVisibility)[]
        ).map((col) => (
          <ToggleRow
            key={col}
            label={col.charAt(0).toUpperCase() + col.slice(1)}
            value={localConfig.columnVisibility[col]}
            onChange={(v) =>
              handleChange({
                columnVisibility: { ...localConfig.columnVisibility, [col]: v },
              })
            }
          />
        ))}
      </Section>
    </ControlPanelShell>
  );
}
