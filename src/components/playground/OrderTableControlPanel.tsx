"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderTableConfig } from "@/lib/orderTableConfig";
import { debounce } from "@/utils/debounce";
import { ColorRow, ControlPanelShell, Section, SliderRow, ToggleRow } from "@/components/ui/ControlHelpers";

interface OrderTableControlPanelProps {
  config: OrderTableConfig;
  onChange: (patch: Partial<OrderTableConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function OrderTableControlPanel({ config, onChange, onReset }: OrderTableControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  function updateSlider<K extends keyof OrderTableConfig>(key: K, value: OrderTableConfig[K]) {
    const patch = { [key]: value } as Partial<OrderTableConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function update<K extends keyof OrderTableConfig>(key: K, value: OrderTableConfig[K]) {
    const patch = { [key]: value } as Partial<OrderTableConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Layout">
        <SliderRow label="Width" value={localConfig.width} min={720} max={1200} unit="px" onChange={(v) => updateSlider("width", v)} onChangeEnd={(v) => onChange({ width: v })} />
        <SliderRow label="Table min width" value={localConfig.tableMinWidth} min={720} max={1100} unit="px" onChange={(v) => updateSlider("tableMinWidth", v)} onChangeEnd={(v) => onChange({ tableMinWidth: v })} />
        <SliderRow label="Row height" value={localConfig.rowHeight} min={50} max={84} unit="px" onChange={(v) => updateSlider("rowHeight", v)} onChangeEnd={(v) => onChange({ rowHeight: v })} />
        <SliderRow label="Border radius" value={localConfig.borderRadius} min={2} max={24} unit="px" onChange={(v) => updateSlider("borderRadius", v)} onChangeEnd={(v) => onChange({ borderRadius: v })} />
        <SliderRow label="Chip radius" value={localConfig.chipRadius} min={2} max={999} unit="px" onChange={(v) => updateSlider("chipRadius", v)} onChangeEnd={(v) => onChange({ chipRadius: v })} />
        <SliderRow label="Font size" value={localConfig.fontSize} min={12} max={16} unit="px" onChange={(v) => updateSlider("fontSize", v)} onChangeEnd={(v) => onChange({ fontSize: v })} />
      </Section>

      <Section title="Surfaces">
        <ColorRow label="Page background" value={localConfig.backgroundColor} onChange={(v) => update("backgroundColor", v)}   isDark={isDark}
/>
        <ColorRow label="Table surface" value={localConfig.surfaceColor} onChange={(v) => update("surfaceColor", v)}   isDark={isDark}
/>
        <ColorRow label="Filters" value={localConfig.filterBackground} onChange={(v) => update("filterBackground", v)}   isDark={isDark}
/>
        <ColorRow label="Expanded row" value={localConfig.expandedBackground} onChange={(v) => update("expandedBackground", v)}   isDark={isDark}
/>
        <ColorRow label="Header" value={localConfig.headerBackground} onChange={(v) => update("headerBackground", v)}   isDark={isDark}
/>
        <ColorRow label="Inputs" value={localConfig.inputBackground} onChange={(v) => update("inputBackground", v)}   isDark={isDark}
/>
        <ColorRow label="Border" value={localConfig.borderColor} onChange={(v) => update("borderColor", v)}   isDark={isDark}
/>
      </Section>

      <Section title="Text & Accent">
        <ColorRow label="Text" value={localConfig.textColor} onChange={(v) => update("textColor", v)}   isDark={isDark}
/>
        <ColorRow label="Muted text" value={localConfig.mutedTextColor} onChange={(v) => update("mutedTextColor", v)}   isDark={isDark}
/>
        <ColorRow label="Header text" value={localConfig.headerTextColor} onChange={(v) => update("headerTextColor", v)}   isDark={isDark}
/>
        <ColorRow label="Accent" value={localConfig.accentColor} onChange={(v) => update("accentColor", v)}   isDark={isDark}
/>
        <ColorRow label="Accent text" value={localConfig.accentTextColor} onChange={(v) => update("accentTextColor", v)}   isDark={isDark}
/>
        <ColorRow label="Hover" value={localConfig.hoverBackground} onChange={(v) => update("hoverBackground", v)}   isDark={isDark}
/>
        <ColorRow label="Selected" value={localConfig.selectedBackground} onChange={(v) => update("selectedBackground", v)}   isDark={isDark}
/>
      </Section>

      <Section title="Behavior">
        <ToggleRow label="Filters bar" value={localConfig.showFilters} onChange={(v) => update("showFilters", v)} />
        <ToggleRow label="Footer pagination" value={localConfig.showFooter} onChange={(v) => update("showFooter", v)} />
        <ToggleRow label="Customer avatars" value={localConfig.showAvatars} onChange={(v) => update("showAvatars", v)} />
        <ToggleRow label="Expandable rows" value={localConfig.expandableRows} onChange={(v) => update("expandableRows", v)} />
        <ToggleRow label="Animated details" value={localConfig.animateRows} onChange={(v) => update("animateRows", v)} />
        <ToggleRow label="Shadow" value={localConfig.showShadow} onChange={(v) => update("showShadow", v)} />
      </Section>
    </ControlPanelShell>
  );
}
