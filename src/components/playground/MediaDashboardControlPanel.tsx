"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaDashboardConfig, MediaDashboardDensity, MediaDashboardRange } from "@/lib/mediaDashboardConfig";
import { debounce } from "@/utils/debounce";
import { ColorRow, ControlPanelShell, Section, SliderRow, ToggleRow } from "@/components/ui/ControlHelpers";

interface MediaDashboardControlPanelProps {
  config: MediaDashboardConfig;
  onChange: (patch: Partial<MediaDashboardConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function MediaDashboardControlPanel({ config, onChange, onReset }: MediaDashboardControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  function updateSlider(patch: Partial<MediaDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function commitSlider(patch: Partial<MediaDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  function updateImmediate(patch: Partial<MediaDashboardConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Behavior">
        <div className="row">
          <label className="label">Density</label>
          <select value={localConfig.density} onChange={(event) => updateImmediate({ density: event.target.value as MediaDashboardDensity })}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
        <div className="row">
          <label className="label">Range</label>
          <select value={localConfig.selectedRange} onChange={(event) => updateImmediate({ selectedRange: event.target.value as MediaDashboardRange })}>
            <option value="realtime">Real-time</option>
            <option value="day">24 Hours</option>
            <option value="week">7 Days</option>
          </select>
        </div>
        <ToggleRow label="Show sidebar" value={localConfig.showSidebar} onChange={(value) => updateImmediate({ showSidebar: value })} />
        <ToggleRow label="Show top bar" value={localConfig.showTopBar} onChange={(value) => updateImmediate({ showTopBar: value })} />
        <ToggleRow label="Glow" value={localConfig.showGlow} onChange={(value) => updateImmediate({ showGlow: value })} />
        <ToggleRow label="Animated cards" value={localConfig.animateCards} onChange={(value) => updateImmediate({ animateCards: value })} />
      </Section>

      <Section title="Layout">
        <SliderRow label="Dashboard width" value={localConfig.dashboardWidth} min={880} max={1400} unit="px" onChange={(value) => updateSlider({ dashboardWidth: value })} onChangeEnd={(value) => commitSlider({ dashboardWidth: value })} />
        <SliderRow label="Card radius" value={localConfig.cardRadius} min={4} max={24} unit="px" onChange={(value) => updateSlider({ cardRadius: value })} onChangeEnd={(value) => commitSlider({ cardRadius: value })} />
        <SliderRow label="Card padding" value={localConfig.cardPadding} min={14} max={34} unit="px" onChange={(value) => updateSlider({ cardPadding: value })} onChangeEnd={(value) => commitSlider({ cardPadding: value })} />
        <SliderRow label="Font size" value={localConfig.fontSize} min={12} max={16} unit="px" onChange={(value) => updateSlider({ fontSize: value })} onChangeEnd={(value) => commitSlider({ fontSize: value })} />
      </Section>

      <Section title="Colors">
        <ColorRow label="Background" value={localConfig.backgroundColor} onChange={(value) => updateImmediate({ backgroundColor: value })}   isDark={isDark}
/>
        <ColorRow label="Surface" value={localConfig.surfaceColor} onChange={(value) => updateImmediate({ surfaceColor: value })}   isDark={isDark}
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
        <ColorRow label="Secondary" value={localConfig.secondaryColor} onChange={(value) => updateImmediate({ secondaryColor: value })}   isDark={isDark}
/>
        <ColorRow label="Tertiary" value={localConfig.tertiaryColor} onChange={(value) => updateImmediate({ tertiaryColor: value })}   isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
