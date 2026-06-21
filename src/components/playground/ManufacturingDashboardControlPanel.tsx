"use client";

import { useEffect, useMemo, useState } from "react";
import type { ManufacturingDashboardConfig, ManufacturingDashboardDensity } from "@/lib/manufacturingDashboardConfig";
import { debounce } from "@/utils/debounce";
import { ColorRow, ControlPanelShell, Section, SliderRow, ToggleRow } from "@/components/ui/ControlHelpers";

interface ManufacturingDashboardControlPanelProps {
  config: ManufacturingDashboardConfig;
  onChange: (patch: Partial<ManufacturingDashboardConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function ManufacturingDashboardControlPanel({ config, onChange, onReset }: ManufacturingDashboardControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  function updateSlider(patch: Partial<ManufacturingDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function commitSlider(patch: Partial<ManufacturingDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  function updateImmediate(patch: Partial<ManufacturingDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Behavior">
        <div className="row">
          <label className="label">Density</label>
          <select value={localConfig.density} onChange={(event) => updateImmediate({ density: event.target.value as ManufacturingDashboardDensity })}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
        <ToggleRow label="Show sidebar" value={localConfig.showSidebar} onChange={(value) => updateImmediate({ showSidebar: value })} />
        <ToggleRow label="Show download card" value={localConfig.showDownloadCard} onChange={(value) => updateImmediate({ showDownloadCard: value })} />
        <ToggleRow label="Show profile" value={localConfig.showProfile} onChange={(value) => updateImmediate({ showProfile: value })} />
        <ToggleRow label="Animated cards" value={localConfig.animateCards} onChange={(value) => updateImmediate({ animateCards: value })} />
      </Section>

      <Section title="Layout">
        <SliderRow label="Dashboard width" value={localConfig.dashboardWidth} min={900} max={1420} unit="px" onChange={(value) => updateSlider({ dashboardWidth: value })} onChangeEnd={(value) => commitSlider({ dashboardWidth: value })} />
        <SliderRow label="Shell radius" value={localConfig.shellRadius} min={16} max={48} unit="px" onChange={(value) => updateSlider({ shellRadius: value })} onChangeEnd={(value) => commitSlider({ shellRadius: value })} />
        <SliderRow label="Card radius" value={localConfig.cardRadius} min={8} max={32} unit="px" onChange={(value) => updateSlider({ cardRadius: value })} onChangeEnd={(value) => commitSlider({ cardRadius: value })} />
        <SliderRow label="Card padding" value={localConfig.cardPadding} min={14} max={34} unit="px" onChange={(value) => updateSlider({ cardPadding: value })} onChangeEnd={(value) => commitSlider({ cardPadding: value })} />
        <SliderRow label="Font size" value={localConfig.fontSize} min={12} max={16} unit="px" onChange={(value) => updateSlider({ fontSize: value })} onChangeEnd={(value) => commitSlider({ fontSize: value })} />
      </Section>

      <Section title="Colors">
        <ColorRow label="Background" value={localConfig.backgroundColor} onChange={(value) => updateImmediate({ backgroundColor: value })}   isDark={isDark}
/>
        <ColorRow label="Shell" value={localConfig.shellColor} onChange={(value) => updateImmediate({ shellColor: value })}   isDark={isDark}
/>
        <ColorRow label="Cards" value={localConfig.cardColor} onChange={(value) => updateImmediate({ cardColor: value })}   isDark={isDark}
/>
        <ColorRow label="Card hover" value={localConfig.cardHoverColor} onChange={(value) => updateImmediate({ cardHoverColor: value })}   isDark={isDark}
/>
        <ColorRow label="Border" value={localConfig.borderColor} onChange={(value) => updateImmediate({ borderColor: value })}   isDark={isDark}
/>
        <ColorRow label="Text" value={localConfig.textColor} onChange={(value) => updateImmediate({ textColor: value })}   isDark={isDark}
/>
        <ColorRow label="Muted text" value={localConfig.mutedTextColor} onChange={(value) => updateImmediate({ mutedTextColor: value })}   isDark={isDark}
/>
        <ColorRow label="Accent" value={localConfig.accentColor} onChange={(value) => updateImmediate({ accentColor: value })}   isDark={isDark}
/>
        <ColorRow label="Success" value={localConfig.successColor} onChange={(value) => updateImmediate({ successColor: value })}   isDark={isDark}
/>
        <ColorRow label="Warning" value={localConfig.warningColor} onChange={(value) => updateImmediate({ warningColor: value })}   isDark={isDark}
/>
        <ColorRow label="Danger" value={localConfig.dangerColor} onChange={(value) => updateImmediate({ dangerColor: value })}   isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
