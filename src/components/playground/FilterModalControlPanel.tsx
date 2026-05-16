"use client";

// /components/playground/FilterModalControlPanel.tsx

import { useMemo, useState } from "react";
import { FilterModalConfig } from "@/lib/filterModalConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface FilterModalControlPanelProps {
  config: FilterModalConfig;
  onChange: (patch: Partial<FilterModalConfig>) => void;
  onReset: () => void;
}

export function FilterModalControlPanel({
  config,
  onChange,
  onReset,
}: FilterModalControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  // Sync local config when parent resets
  useMemo(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSliderChange(patch: Partial<FilterModalConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleChange(patch: Partial<FilterModalConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Modal Container ─────────────────────────── */}
      <Section title="Modal Container">
        <ColorRow
          label="Background"
          value={localConfig.modalBackground}
          onChange={(v) => handleChange({ modalBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.modalBorderColor}
          onChange={(v) => handleChange({ modalBorderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.modalBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSliderChange({ modalBorderRadius: v })}
          onChangeEnd={(v) => onChange({ modalBorderRadius: v })}
        />
        <SliderRow
          label="Width"
          value={localConfig.modalWidth}
          min={360}
          max={720}
          unit="px"
          onChange={(v) => handleSliderChange({ modalWidth: v })}
          onChangeEnd={(v) => onChange({ modalWidth: v })}
        />
        <ToggleRow
          label="Drop Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleChange({ showShadow: v })}
        />
        <ToggleRow
          label="Backdrop Blur"
          value={localConfig.backdropBlur}
          onChange={(v) => handleChange({ backdropBlur: v })}
        />
        <ToggleRow
          label="Animate Open"
          value={localConfig.animateOpen}
          onChange={(v) => handleChange({ animateOpen: v })}
        />
      </Section>

      {/* ── Header ──────────────────────────────────── */}
      <Section title="Header">
        <ColorRow
          label="Background"
          value={localConfig.headerBackground}
          onChange={(v) => handleChange({ headerBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.headerBorderColor}
          onChange={(v) => handleChange({ headerBorderColor: v })}
        />
        <ColorRow
          label="Title Color"
          value={localConfig.headerTextColor}
          onChange={(v) => handleChange({ headerTextColor: v })}
        />
        <ColorRow
          label="Icon / Accent"
          value={localConfig.headerIconColor}
          onChange={(v) => handleChange({ headerIconColor: v })}
        />
        <ColorRow
          label="Close Hover BG"
          value={localConfig.closeButtonHoverBackground}
          onChange={(v) => handleChange({ closeButtonHoverBackground: v })}
        />
        <ColorRow
          label="Section Label"
          value={localConfig.sectionLabelColor}
          onChange={(v) => handleChange({ sectionLabelColor: v })}
        />
      </Section>

      {/* ── Sort Buttons ────────────────────────────── */}
      <Section title="Sort Buttons">
        <ColorRow
          label="Background"
          value={localConfig.sortButtonBackground}
          onChange={(v) => handleChange({ sortButtonBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.sortButtonBorderColor}
          onChange={(v) => handleChange({ sortButtonBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.sortButtonTextColor}
          onChange={(v) => handleChange({ sortButtonTextColor: v })}
        />
        <ColorRow
          label="Active Background"
          value={localConfig.sortButtonActiveBackground}
          onChange={(v) => handleChange({ sortButtonActiveBackground: v })}
        />
        <ColorRow
          label="Active Border"
          value={localConfig.sortButtonActiveBorderColor}
          onChange={(v) => handleChange({ sortButtonActiveBorderColor: v })}
        />
        <ColorRow
          label="Active Text"
          value={localConfig.sortButtonActiveTextColor}
          onChange={(v) => handleChange({ sortButtonActiveTextColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.sortButtonBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSliderChange({ sortButtonBorderRadius: v })}
          onChangeEnd={(v) => onChange({ sortButtonBorderRadius: v })}
        />
      </Section>

      {/* ── Status Chips ────────────────────────────── */}
      <Section title="Status Chips">
        <ColorRow
          label="Background"
          value={localConfig.statusChipBackground}
          onChange={(v) => handleChange({ statusChipBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.statusChipBorderColor}
          onChange={(v) => handleChange({ statusChipBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.statusChipTextColor}
          onChange={(v) => handleChange({ statusChipTextColor: v })}
        />
        <ColorRow
          label="Active Background"
          value={localConfig.statusChipActiveBackground}
          onChange={(v) => handleChange({ statusChipActiveBackground: v })}
        />
        <ColorRow
          label="Active Text"
          value={localConfig.statusChipActiveTextColor}
          onChange={(v) => handleChange({ statusChipActiveTextColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.statusChipBorderRadius}
          min={0}
          max={999}
          unit="px"
          onChange={(v) => handleSliderChange({ statusChipBorderRadius: v })}
          onChangeEnd={(v) => onChange({ statusChipBorderRadius: v })}
        />
      </Section>

      {/* ── Date Calendar ────────────────────────────── */}
      <Section title="Date Range Calendar">
        <ColorRow
          label="Background"
          value={localConfig.calendarBackground}
          onChange={(v) => handleChange({ calendarBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.calendarBorderColor}
          onChange={(v) => handleChange({ calendarBorderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.calendarBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSliderChange({ calendarBorderRadius: v })}
          onChangeEnd={(v) => onChange({ calendarBorderRadius: v })}
        />
        <ColorRow
          label="Header Text"
          value={localConfig.calendarHeaderTextColor}
          onChange={(v) => handleChange({ calendarHeaderTextColor: v })}
        />
        <ColorRow
          label="Chevron"
          value={localConfig.calendarChevronColor}
          onChange={(v) => handleChange({ calendarChevronColor: v })}
        />
        <ColorRow
          label="Day Names"
          value={localConfig.calendarDayNameColor}
          onChange={(v) => handleChange({ calendarDayNameColor: v })}
        />
        <ColorRow
          label="Day Text"
          value={localConfig.calendarDayTextColor}
          onChange={(v) => handleChange({ calendarDayTextColor: v })}
        />
        <ColorRow
          label="Day Hover"
          value={localConfig.calendarDayHoverBackground}
          onChange={(v) => handleChange({ calendarDayHoverBackground: v })}
        />
        <ColorRow
          label="Selected BG"
          value={localConfig.calendarSelectedBackground}
          onChange={(v) => handleChange({ calendarSelectedBackground: v })}
        />
        <ColorRow
          label="Selected Text"
          value={localConfig.calendarSelectedTextColor}
          onChange={(v) => handleChange({ calendarSelectedTextColor: v })}
        />
        <ColorRow
          label="Range Fill"
          value={localConfig.calendarRangeBackground}
          onChange={(v) => handleChange({ calendarRangeBackground: v })}
        />
        <ColorRow
          label="Range Text"
          value={localConfig.calendarRangeTextColor}
          onChange={(v) => handleChange({ calendarRangeTextColor: v })}
        />
      </Section>

      {/* ── Category Rows ───────────────────────────── */}
      <Section title="Category Rows">
        <ColorRow
          label="Row Background"
          value={localConfig.categoryRowBackground}
          onChange={(v) => handleChange({ categoryRowBackground: v })}
        />
        <ColorRow
          label="Row Border"
          value={localConfig.categoryRowBorderColor}
          onChange={(v) => handleChange({ categoryRowBorderColor: v })}
        />
        <ColorRow
          label="Row Hover"
          value={localConfig.categoryRowHoverBackground}
          onChange={(v) => handleChange({ categoryRowHoverBackground: v })}
        />
        <ColorRow
          label="Checkbox Active"
          value={localConfig.checkboxActiveBackground}
          onChange={(v) => handleChange({ checkboxActiveBackground: v })}
        />
        <ColorRow
          label="Checkbox Border"
          value={localConfig.checkboxBorderColor}
          onChange={(v) => handleChange({ checkboxBorderColor: v })}
        />
        <ColorRow
          label="Count Color"
          value={localConfig.categoryCountColor}
          onChange={(v) => handleChange({ categoryCountColor: v })}
        />
        <ToggleRow
          label="Show Count"
          value={localConfig.showCategoryCount}
          onChange={(v) => handleChange({ showCategoryCount: v })}
        />
      </Section>

      {/* ── Footer ──────────────────────────────────── */}
      <Section title="Footer">
        <ColorRow
          label="Background"
          value={localConfig.footerBackground}
          onChange={(v) => handleChange({ footerBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.footerBorderColor}
          onChange={(v) => handleChange({ footerBorderColor: v })}
        />
        <ColorRow
          label="Reset Text"
          value={localConfig.resetButtonTextColor}
          onChange={(v) => handleChange({ resetButtonTextColor: v })}
        />
        <ColorRow
          label="Cancel BG"
          value={localConfig.cancelButtonBackground}
          onChange={(v) => handleChange({ cancelButtonBackground: v })}
        />
        <ColorRow
          label="Cancel Border"
          value={localConfig.cancelButtonBorderColor}
          onChange={(v) => handleChange({ cancelButtonBorderColor: v })}
        />
        <ColorRow
          label="Cancel Text"
          value={localConfig.cancelButtonTextColor}
          onChange={(v) => handleChange({ cancelButtonTextColor: v })}
        />
        <ColorRow
          label="Apply BG"
          value={localConfig.applyButtonBackground}
          onChange={(v) => handleChange({ applyButtonBackground: v })}
        />
        <ColorRow
          label="Apply Text"
          value={localConfig.applyButtonTextColor}
          onChange={(v) => handleChange({ applyButtonTextColor: v })}
        />
        <SliderRow
          label="Button Radius"
          value={localConfig.applyButtonBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSliderChange({ applyButtonBorderRadius: v })}
          onChangeEnd={(v) => onChange({ applyButtonBorderRadius: v })}
        />
      </Section>

      {/* ── Typography ─────────────────────────────── */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSliderChange({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
