"use client";

import { useState, useMemo } from "react";
import type { SpotlightConfig } from "@/lib/spotlightSearchConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: SpotlightConfig;
  onChange: (patch: Partial<SpotlightConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function SpotlightSearchControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: Props) {
  const [localConfig, setLocalConfig] = useState<SpotlightConfig>(config);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<SpotlightConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(key: keyof SpotlightConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleImmediate(patch: Partial<SpotlightConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Panel */}
      <Section title="Panel">
        <ColorRow
          label="Panel Background"
          value={localConfig.panelBackground}
          onChange={(v) => handleImmediate({ panelBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Panel Border"
          value={localConfig.panelBorderColor}
          onChange={(v) => handleImmediate({ panelBorderColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Border Radius"
          value={localConfig.panelBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("panelBorderRadius", v)}
          onChangeEnd={(v) => onChange({ panelBorderRadius: v })}
        />
        <SliderRow
          label="Width"
          value={localConfig.panelWidth}
          min={400}
          max={800}
          unit="px"
          onChange={(v) => handleSlider("panelWidth", v)}
          onChangeEnd={(v) => onChange({ panelWidth: v })}
        />
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>

      {/* Search Input */}
      <Section title="Search Input">
        <ColorRow
          label="Input Background"
          value={localConfig.inputBackground}
          onChange={(v) => handleImmediate({ inputBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Input Border"
          value={localConfig.inputBorderColor}
          onChange={(v) => handleImmediate({ inputBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Input Text"
          value={localConfig.inputTextColor}
          onChange={(v) => handleImmediate({ inputTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Placeholder"
          value={localConfig.inputPlaceholderColor}
          onChange={(v) => handleImmediate({ inputPlaceholderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Icon"
          value={localConfig.inputIconColor}
          onChange={(v) => handleImmediate({ inputIconColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Input Radius"
          value={localConfig.inputBorderRadius}
          min={0}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("inputBorderRadius", v)}
          onChangeEnd={(v) => onChange({ inputBorderRadius: v })}
        />
      </Section>

      {/* Items */}
      <Section title="Items">
        <ColorRow
          label="Item Hover BG"
          value={localConfig.itemHoverBackground}
          onChange={(v) => handleImmediate({ itemHoverBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Item Text"
          value={localConfig.itemTextColor}
          onChange={(v) => handleImmediate({ itemTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Subtext"
          value={localConfig.itemSubtextColor}
          onChange={(v) => handleImmediate({ itemSubtextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Icon Color"
          value={localConfig.itemIconColor}
          onChange={(v) => handleImmediate({ itemIconColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Item Radius"
          value={localConfig.itemBorderRadius}
          min={0}
          max={14}
          unit="px"
          onChange={(v) => handleSlider("itemBorderRadius", v)}
          onChangeEnd={(v) => onChange({ itemBorderRadius: v })}
        />
      </Section>

      {/* Active Item */}
      <Section title="Active Item">
        <ColorRow
          label="Active Background"
          value={localConfig.activeItemBackground}
          onChange={(v) => handleImmediate({ activeItemBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Text"
          value={localConfig.activeItemTextColor}
          onChange={(v) => handleImmediate({ activeItemTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Icon"
          value={localConfig.activeItemIconColor}
          onChange={(v) => handleImmediate({ activeItemIconColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Keyboard Badges */}
      <Section title="Keyboard Badges">
        <ColorRow
          label="KBD Background"
          value={localConfig.kbdBackground}
          onChange={(v) => handleImmediate({ kbdBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="KBD Border"
          value={localConfig.kbdBorderColor}
          onChange={(v) => handleImmediate({ kbdBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="KBD Text"
          value={localConfig.kbdTextColor}
          onChange={(v) => handleImmediate({ kbdTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <ColorRow
          label="Footer Background"
          value={localConfig.footerBackground}
          onChange={(v) => handleImmediate({ footerBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer Border"
          value={localConfig.footerBorderColor}
          onChange={(v) => handleImmediate({ footerBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer Text"
          value={localConfig.footerTextColor}
          onChange={(v) => handleImmediate({ footerTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer KBD BG"
          value={localConfig.footerKbdBackground}
          onChange={(v) => handleImmediate({ footerKbdBackground: v })}
          isDark={isDark}
/>
      </Section>

      {/* Section Labels */}
      <Section title="Section Labels">
        <ColorRow
          label="Label Color"
          value={localConfig.sectionLabelColor}
          onChange={(v) => handleImmediate({ sectionLabelColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>

      {/* Behavior */}
      <Section title="Behavior">
        <ToggleRow
          label="Animate Open"
          value={localConfig.animateOpen}
          onChange={(v) => handleImmediate({ animateOpen: v })}
        />
        <ToggleRow
          label="Show Footer"
          value={localConfig.showFooter}
          onChange={(v) => handleImmediate({ showFooter: v })}
        />
        <ToggleRow
          label="Show Categories"
          value={localConfig.showCategories}
          onChange={(v) => handleImmediate({ showCategories: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
