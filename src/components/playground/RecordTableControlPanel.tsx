"use client";

import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";
import { RecordTableConfig, RecordTableViewMode } from "@/lib/recordTableConfig";
import {
  ColorRow,
  ControlPanelShell,
  Section,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";

interface RecordTableControlPanelProps {
  config: RecordTableConfig;
  onChange: (patch: Partial<RecordTableConfig>) => void;
  onReset: () => void;
}

function SelectRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RecordTableViewMode;
  onChange: (value: RecordTableViewMode) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
      <label style={{ color: "var(--text-secondary)", fontSize: 12 }}>{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as RecordTableViewMode)}
        style={{
          width: "100%",
          height: 36,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg-3)",
          color: "var(--text-primary)",
          padding: "0 10px",
          font: "inherit",
        }}
      >
        <option value="grid">Grid</option>
        <option value="list">List</option>
      </select>
    </div>
  );
}

export function RecordTableControlPanel({
  config,
  onChange,
  onReset,
}: RecordTableControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  function updateSlider<K extends keyof RecordTableConfig>(key: K, value: RecordTableConfig[K]) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value } as Partial<RecordTableConfig>);
  }

  function updateImmediate<K extends keyof RecordTableConfig>(key: K, value: RecordTableConfig[K]) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<RecordTableConfig>);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Behavior">
        <SelectRow
          label="Default view"
          value={localConfig.viewMode}
          onChange={(value) => updateImmediate("viewMode", value)}
        />
        <ToggleRow label="Search" value={localConfig.showSearch} onChange={(value) => updateImmediate("showSearch", value)} />
        <ToggleRow label="Filters" value={localConfig.showFilters} onChange={(value) => updateImmediate("showFilters", value)} />
        <ToggleRow label="Metrics" value={localConfig.showMetrics} onChange={(value) => updateImmediate("showMetrics", value)} />
        <ToggleRow label="Shadow" value={localConfig.showShadow} onChange={(value) => updateImmediate("showShadow", value)} />
        <ToggleRow label="Animate items" value={localConfig.animateItems} onChange={(value) => updateImmediate("animateItems", value)} />
      </Section>

      <Section title="Layout">
        <SliderRow label="Table width" value={localConfig.tableWidth} min={620} max={1120} unit="px" onChange={(value) => updateSlider("tableWidth", value)} onChangeEnd={(value) => onChange({ tableWidth: value })} />
        <SliderRow label="Card minimum" value={localConfig.cardMinWidth} min={210} max={360} unit="px" onChange={(value) => updateSlider("cardMinWidth", value)} onChangeEnd={(value) => onChange({ cardMinWidth: value })} />
        <SliderRow label="Row height" value={localConfig.rowHeight} min={56} max={96} unit="px" onChange={(value) => updateSlider("rowHeight", value)} onChangeEnd={(value) => onChange({ rowHeight: value })} />
        <SliderRow label="Gap" value={localConfig.gap} min={6} max={28} unit="px" onChange={(value) => updateSlider("gap", value)} onChangeEnd={(value) => onChange({ gap: value })} />
        <SliderRow label="Radius" value={localConfig.borderRadius} min={4} max={24} unit="px" onChange={(value) => updateSlider("borderRadius", value)} onChangeEnd={(value) => onChange({ borderRadius: value })} />
        <SliderRow label="Font size" value={localConfig.fontSize} min={11} max={16} unit="px" onChange={(value) => updateSlider("fontSize", value)} onChangeEnd={(value) => onChange({ fontSize: value })} />
        <SliderRow label="Avatar size" value={localConfig.avatarSize} min={30} max={52} unit="px" onChange={(value) => updateSlider("avatarSize", value)} onChangeEnd={(value) => onChange({ avatarSize: value })} />
      </Section>

      <Section title="Colors">
        <ColorRow label="Background" value={localConfig.backgroundColor} onChange={(value) => updateImmediate("backgroundColor", value)} />
        <ColorRow label="Surface" value={localConfig.surfaceColor} onChange={(value) => updateImmediate("surfaceColor", value)} />
        <ColorRow label="Search" value={localConfig.searchBackground} onChange={(value) => updateImmediate("searchBackground", value)} />
        <ColorRow label="Border" value={localConfig.borderColor} onChange={(value) => updateImmediate("borderColor", value)} />
        <ColorRow label="Text" value={localConfig.textColor} onChange={(value) => updateImmediate("textColor", value)} />
        <ColorRow label="Muted text" value={localConfig.mutedTextColor} onChange={(value) => updateImmediate("mutedTextColor", value)} />
        <ColorRow label="Subtle text" value={localConfig.subtleTextColor} onChange={(value) => updateImmediate("subtleTextColor", value)} />
        <ColorRow label="Accent" value={localConfig.accentColor} onChange={(value) => updateImmediate("accentColor", value)} />
        <ColorRow label="Accent text" value={localConfig.accentTextColor} onChange={(value) => updateImmediate("accentTextColor", value)} />
        <ColorRow label="Hover" value={localConfig.hoverBackground} onChange={(value) => updateImmediate("hoverBackground", value)} />
      </Section>

      <Section title="Status Colors">
        <ColorRow label="Ready" value={localConfig.readyColor} onChange={(value) => updateImmediate("readyColor", value)} />
        <ColorRow label="Draft" value={localConfig.draftColor} onChange={(value) => updateImmediate("draftColor", value)} />
        <ColorRow label="Review" value={localConfig.reviewColor} onChange={(value) => updateImmediate("reviewColor", value)} />
        <ColorRow label="Archived" value={localConfig.archivedColor} onChange={(value) => updateImmediate("archivedColor", value)} />
      </Section>
    </ControlPanelShell>
  );
}
