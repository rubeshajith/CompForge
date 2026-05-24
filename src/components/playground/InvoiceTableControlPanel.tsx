"use client";

// /components/playground/InvoiceTableControlPanel.tsx

import { useMemo, useState, useEffect } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { InvoiceTableConfig } from "@/lib/invoiceTableConfig";
import { debounce } from "@/utils/debounce";

interface InvoiceTableControlPanelProps {
  config: InvoiceTableConfig;
  onChange: (patch: Partial<InvoiceTableConfig>) => void;
  onReset: () => void;
}

export function InvoiceTableControlPanel({
  config,
  onChange,
  onReset,
}: InvoiceTableControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<InvoiceTableConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(key: keyof InvoiceTableConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleChange(patch: Partial<InvoiceTableConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Layout ── */}
      <Section title="Layout & Sizing">
        <SliderRow
          label="Table Max Width"
          value={localConfig.tableWidth}
          min={600}
          max={1400}
          unit="px"
          onChange={(v) => handleSlider("tableWidth", v)}
          onChangeEnd={(v) => onChange({ tableWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
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

      {/* ── Shell Colors ── */}
      <Section title="Shell Colors">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleChange({ backgroundColor: v })}
        />
        <ColorRow
          label="Toolbar Background"
          value={localConfig.toolbarBackgroundColor}
          onChange={(v) => handleChange({ toolbarBackgroundColor: v })}
        />
        <ColorRow
          label="Toolbar Border"
          value={localConfig.toolbarBorderColor}
          onChange={(v) => handleChange({ toolbarBorderColor: v })}
        />
        <ColorRow
          label="Header Background"
          value={localConfig.headerBackgroundColor}
          onChange={(v) => handleChange({ headerBackgroundColor: v })}
        />
        <ColorRow
          label="Header Text"
          value={localConfig.headerTextColor}
          onChange={(v) => handleChange({ headerTextColor: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleChange({ borderColor: v })}
        />
        <ColorRow
          label="Row Divider"
          value={localConfig.dividerColor}
          onChange={(v) => handleChange({ dividerColor: v })}
        />
      </Section>

      {/* ── Rows & Cells ── */}
      <Section title="Rows & Cells">
        <ColorRow
          label="Row Hover"
          value={localConfig.rowHoverColor}
          onChange={(v) => handleChange({ rowHoverColor: v })}
        />
        <ColorRow
          label="Selected Row"
          value={localConfig.selectedRowColor}
          onChange={(v) => handleChange({ selectedRowColor: v })}
        />
        <ColorRow
          label="Cell Text"
          value={localConfig.cellTextColor}
          onChange={(v) => handleChange({ cellTextColor: v })}
        />
        <ColorRow
          label="Cell Muted Text"
          value={localConfig.cellMutedColor}
          onChange={(v) => handleChange({ cellMutedColor: v })}
        />
      </Section>

      {/* ── Accent ── */}
      <Section title="Accent & Invoice #">
        <ColorRow
          label="Accent Color"
          value={localConfig.accentColor}
          onChange={(v) => handleChange({ accentColor: v })}
        />
        <ColorRow
          label="Accent Text"
          value={localConfig.accentTextColor}
          onChange={(v) => handleChange({ accentTextColor: v })}
        />
        <ColorRow
          label="Invoice # Color"
          value={localConfig.invoiceNumColor}
          onChange={(v) => handleChange({ invoiceNumColor: v })}
        />
      </Section>

      {/* ── Avatar ── */}
      <Section title="Client Avatar">
        <ColorRow
          label="Avatar Background"
          value={localConfig.avatarBackgroundColor}
          onChange={(v) => handleChange({ avatarBackgroundColor: v })}
        />
        <ColorRow
          label="Avatar Text"
          value={localConfig.avatarTextColor}
          onChange={(v) => handleChange({ avatarTextColor: v })}
        />
      </Section>

      {/* ── Status Tabs ── */}
      <Section title="Status Tabs">
        <ColorRow
          label="Active Tab Background"
          value={localConfig.tabActiveBg}
          onChange={(v) => handleChange({ tabActiveBg: v })}
        />
        <ColorRow
          label="Active Tab Text"
          value={localConfig.tabActiveText}
          onChange={(v) => handleChange({ tabActiveText: v })}
        />
        <ColorRow
          label="Tab Hover Background"
          value={localConfig.tabHoverBg}
          onChange={(v) => handleChange({ tabHoverBg: v })}
        />
        <ColorRow
          label="Inactive Tab Text"
          value={localConfig.tabInactiveText}
          onChange={(v) => handleChange({ tabInactiveText: v })}
        />
        <ColorRow
          label="Badge Background"
          value={localConfig.tabBadgeBg}
          onChange={(v) => handleChange({ tabBadgeBg: v })}
        />
        <ColorRow
          label="Badge Text"
          value={localConfig.tabBadgeText}
          onChange={(v) => handleChange({ tabBadgeText: v })}
        />
      </Section>

      {/* ── Status Badges ── */}
      <Section title="Status Badges">
        <ColorRow
          label="Paid — Background"
          value={localConfig.paidBg}
          onChange={(v) => handleChange({ paidBg: v })}
        />
        <ColorRow
          label="Paid — Text"
          value={localConfig.paidText}
          onChange={(v) => handleChange({ paidText: v })}
        />
        <ColorRow
          label="Pending — Background"
          value={localConfig.pendingBg}
          onChange={(v) => handleChange({ pendingBg: v })}
        />
        <ColorRow
          label="Pending — Text"
          value={localConfig.pendingText}
          onChange={(v) => handleChange({ pendingText: v })}
        />
        <ColorRow
          label="Overdue — Background"
          value={localConfig.overdueBg}
          onChange={(v) => handleChange({ overdueBg: v })}
        />
        <ColorRow
          label="Overdue — Text"
          value={localConfig.overdueText}
          onChange={(v) => handleChange({ overdueText: v })}
        />
        <ColorRow
          label="Overdue Days Color"
          value={localConfig.overdueDaysColor}
          onChange={(v) => handleChange({ overdueDaysColor: v })}
        />
      </Section>

      {/* ── Payment ── */}
      <Section title="Payment Method">
        <ColorRow
          label="Icon Color"
          value={localConfig.paymentIconColor}
          onChange={(v) => handleChange({ paymentIconColor: v })}
        />
        <ColorRow
          label="Text Color"
          value={localConfig.paymentTextColor}
          onChange={(v) => handleChange({ paymentTextColor: v })}
        />
      </Section>

      {/* ── Actions ── */}
      <Section title="Action Buttons">
        <ColorRow
          label="Icon Color"
          value={localConfig.actionIconColor}
          onChange={(v) => handleChange({ actionIconColor: v })}
        />
        <ColorRow
          label="Hover Background"
          value={localConfig.actionHoverBg}
          onChange={(v) => handleChange({ actionHoverBg: v })}
        />
      </Section>

      {/* ── Search ── */}
      <Section title="Search Input">
        <ColorRow
          label="Background"
          value={localConfig.searchBackgroundColor}
          onChange={(v) => handleChange({ searchBackgroundColor: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.searchBorderColor}
          onChange={(v) => handleChange({ searchBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.searchTextColor}
          onChange={(v) => handleChange({ searchTextColor: v })}
        />
        <ColorRow
          label="Placeholder"
          value={localConfig.searchPlaceholderColor}
          onChange={(v) => handleChange({ searchPlaceholderColor: v })}
        />
      </Section>

      {/* ── Pagination ── */}
      <Section title="Pagination & Footer">
        <ColorRow
          label="Footer Background"
          value={localConfig.footerBackgroundColor}
          onChange={(v) => handleChange({ footerBackgroundColor: v })}
        />
        <ColorRow
          label="Footer Text"
          value={localConfig.footerTextColor}
          onChange={(v) => handleChange({ footerTextColor: v })}
        />
        <ColorRow
          label="Active Page Background"
          value={localConfig.paginationActiveBg}
          onChange={(v) => handleChange({ paginationActiveBg: v })}
        />
        <ColorRow
          label="Active Page Text"
          value={localConfig.paginationActiveText}
          onChange={(v) => handleChange({ paginationActiveText: v })}
        />
        <ColorRow
          label="Page Button Border"
          value={localConfig.paginationBorderColor}
          onChange={(v) => handleChange({ paginationBorderColor: v })}
        />
      </Section>

      {/* ── Features ── */}
      <Section title="Features">
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleChange({ showShadow: v })}
        />
        <ToggleRow
          label="Search Bar"
          value={localConfig.showSearch}
          onChange={(v) => handleChange({ showSearch: v })}
        />
        <ToggleRow
          label="Status Tabs"
          value={localConfig.showStatusTabs}
          onChange={(v) => handleChange({ showStatusTabs: v })}
        />
        <ToggleRow
          label="Bulk Checkboxes"
          value={localConfig.showBulkCheckboxes}
          onChange={(v) => handleChange({ showBulkCheckboxes: v })}
        />
        <ToggleRow
          label="Download Action"
          value={localConfig.showDownloadAction}
          onChange={(v) => handleChange({ showDownloadAction: v })}
        />
        <ToggleRow
          label="More Action (⋮)"
          value={localConfig.showMoreAction}
          onChange={(v) => handleChange({ showMoreAction: v })}
        />
        <ToggleRow
          label="Sticky Header"
          value={localConfig.stickyHeader}
          onChange={(v) => handleChange({ stickyHeader: v })}
        />
        <ToggleRow
          label="Animate Rows"
          value={localConfig.animateRows}
          onChange={(v) => handleChange({ animateRows: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
