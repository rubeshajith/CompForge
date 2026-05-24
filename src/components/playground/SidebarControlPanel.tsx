"use client";

// /components/playground/SidebarControlPanel.tsx

import { useState, useMemo } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { SidebarConfig } from "@/lib/sidebarConfig";
import { debounce } from "@/utils/debounce";

interface Props {
  config: SidebarConfig;
  onChange: (patch: Partial<SidebarConfig>) => void;
  onReset: () => void;
}

export function SidebarControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  // Sync local when parent resets
  if (
    localConfig.accentColor !== config.accentColor ||
    localConfig.backgroundColor !== config.backgroundColor
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSlider(patch: Partial<SidebarConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<SidebarConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Layout */}
      <Section title="Layout">
        <SliderRow
          label="Expanded width"
          value={localConfig.sidebarWidth}
          min={200}
          max={300}
          unit="px"
          onChange={(v) => handleSlider({ sidebarWidth: v })}
          onChangeEnd={(v) => onChange({ sidebarWidth: v })}
        />
        <SliderRow
          label="Collapsed width"
          value={localConfig.collapsedWidth}
          min={48}
          max={80}
          unit="px"
          onChange={(v) => handleSlider({ collapsedWidth: v })}
          onChangeEnd={(v) => onChange({ collapsedWidth: v })}
        />
        <SliderRow
          label="Border radius"
          value={localConfig.borderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider({ borderRadius: v })}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <ToggleRow
          label="Start collapsed"
          value={localConfig.defaultCollapsed}
          onChange={(v) => handleImmediate({ defaultCollapsed: v })}
        />
        <ToggleRow
          label="Show shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>

      {/* Shell colors */}
      <Section title="Shell">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleImmediate({ backgroundColor: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate({ borderColor: v })}
        />
        <ColorRow
          label="Logo area border"
          value={localConfig.logoAreaBorderColor}
          onChange={(v) => handleImmediate({ logoAreaBorderColor: v })}
        />
        <ColorRow
          label="Footer border"
          value={localConfig.footerBorderColor}
          onChange={(v) => handleImmediate({ footerBorderColor: v })}
        />
      </Section>

      {/* Accent */}
      <Section title="Accent">
        <ColorRow
          label="Accent color"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
        />
        <ColorRow
          label="Accent dim"
          value={localConfig.accentDim}
          onChange={(v) => handleImmediate({ accentDim: v })}
        />
      </Section>

      {/* Nav items */}
      <Section title="Nav Items">
        <ColorRow
          label="Text"
          value={localConfig.itemTextColor}
          onChange={(v) => handleImmediate({ itemTextColor: v })}
        />
        <ColorRow
          label="Icon"
          value={localConfig.itemIconColor}
          onChange={(v) => handleImmediate({ itemIconColor: v })}
        />
        <ColorRow
          label="Hover bg"
          value={localConfig.itemHoverBackground}
          onChange={(v) => handleImmediate({ itemHoverBackground: v })}
        />
        <ColorRow
          label="Hover text"
          value={localConfig.itemHoverTextColor}
          onChange={(v) => handleImmediate({ itemHoverTextColor: v })}
        />
        <SliderRow
          label="Item radius"
          value={localConfig.itemBorderRadius}
          min={0}
          max={16}
          unit="px"
          onChange={(v) => handleSlider({ itemBorderRadius: v })}
          onChangeEnd={(v) => onChange({ itemBorderRadius: v })}
        />
      </Section>

      {/* Active state */}
      <Section title="Active State">
        <ColorRow
          label="Active bg"
          value={localConfig.itemActiveBackground}
          onChange={(v) => handleImmediate({ itemActiveBackground: v })}
        />
        <ColorRow
          label="Active text"
          value={localConfig.itemActiveTextColor}
          onChange={(v) => handleImmediate({ itemActiveTextColor: v })}
        />
        <ColorRow
          label="Active icon"
          value={localConfig.itemActiveIconColor}
          onChange={(v) => handleImmediate({ itemActiveIconColor: v })}
        />
        <ColorRow
          label="Indicator bar"
          value={localConfig.itemActiveIndicatorColor}
          onChange={(v) => handleImmediate({ itemActiveIndicatorColor: v })}
        />
      </Section>

      {/* Section label */}
      <Section title="Section Labels">
        <ColorRow
          label="Label color"
          value={localConfig.sectionLabelColor}
          onChange={(v) => handleImmediate({ sectionLabelColor: v })}
        />
        <ColorRow
          label="Chevron color"
          value={localConfig.chevronColor}
          onChange={(v) => handleImmediate({ chevronColor: v })}
        />
      </Section>

      {/* Submenu */}
      <Section title="Submenu">
        <ColorRow
          label="Text"
          value={localConfig.submenuTextColor}
          onChange={(v) => handleImmediate({ submenuTextColor: v })}
        />
        <ColorRow
          label="Active text"
          value={localConfig.submenuActiveTextColor}
          onChange={(v) => handleImmediate({ submenuActiveTextColor: v })}
        />
        <ColorRow
          label="Active bg"
          value={localConfig.submenuActiveBackground}
          onChange={(v) => handleImmediate({ submenuActiveBackground: v })}
        />
        <ColorRow
          label="Active dot"
          value={localConfig.submenuDotColor}
          onChange={(v) => handleImmediate({ submenuDotColor: v })}
        />
      </Section>

      {/* Popout panel */}
      <Section title="Popout Panel">
        <ColorRow
          label="Background"
          value={localConfig.popoutBackground}
          onChange={(v) => handleImmediate({ popoutBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.popoutBorderColor}
          onChange={(v) => handleImmediate({ popoutBorderColor: v })}
        />
        <ColorRow
          label="Header text"
          value={localConfig.popoutHeaderColor}
          onChange={(v) => handleImmediate({ popoutHeaderColor: v })}
        />
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip">
        <ColorRow
          label="Background"
          value={localConfig.tooltipBackground}
          onChange={(v) => handleImmediate({ tooltipBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.tooltipBorderColor}
          onChange={(v) => handleImmediate({ tooltipBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.tooltipTextColor}
          onChange={(v) => handleImmediate({ tooltipTextColor: v })}
        />
      </Section>

      {/* Collapse button */}
      <Section title="Collapse Button">
        <ColorRow
          label="Background"
          value={localConfig.collapseButtonBackground}
          onChange={(v) => handleImmediate({ collapseButtonBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.collapseButtonBorderColor}
          onChange={(v) => handleImmediate({ collapseButtonBorderColor: v })}
        />
        <ColorRow
          label="Icon"
          value={localConfig.collapseButtonIconColor}
          onChange={(v) => handleImmediate({ collapseButtonIconColor: v })}
        />
        <ColorRow
          label="Hover border"
          value={localConfig.collapseButtonHoverBorderColor}
          onChange={(v) =>
            handleImmediate({ collapseButtonHoverBorderColor: v })
          }
        />
        <ColorRow
          label="Hover icon"
          value={localConfig.collapseButtonHoverIconColor}
          onChange={(v) => handleImmediate({ collapseButtonHoverIconColor: v })}
        />
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <ColorRow
          label="Background"
          value={localConfig.badgeBackground}
          onChange={(v) => handleImmediate({ badgeBackground: v })}
        />
        <ColorRow
          label="Border"
          value={localConfig.badgeBorderColor}
          onChange={(v) => handleImmediate({ badgeBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.badgeTextColor}
          onChange={(v) => handleImmediate({ badgeTextColor: v })}
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
          onChange={(v) => handleSlider({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
