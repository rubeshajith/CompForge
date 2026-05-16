"use client";

import { useEffect, useMemo, useState } from "react";
import { ControlPanelShell, Section, ColorRow, SliderRow, ToggleRow } from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import type { UploadModalConfig } from "@/lib/uploadModalConfig";

interface Props {
  config: UploadModalConfig;
  onChange: (patch: Partial<UploadModalConfig>) => void;
  onReset: () => void;
}

export function UploadModalControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => setLocalConfig(config), [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function updateSlider<K extends keyof UploadModalConfig>(key: K, value: UploadModalConfig[K]) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value } as Partial<UploadModalConfig>);
  }

  function commitSlider<K extends keyof UploadModalConfig>(key: K, value: UploadModalConfig[K]) {
    onChange({ [key]: value } as Partial<UploadModalConfig>);
  }

  function updateImmediate<K extends keyof UploadModalConfig>(key: K, value: UploadModalConfig[K]) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<UploadModalConfig>);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      <Section title="Layout">
        <SliderRow label="Modal width" value={localConfig.modalWidth} min={480} max={820} unit="px" onChange={(value) => updateSlider("modalWidth", value)} onChangeEnd={(value) => commitSlider("modalWidth", value)} />
        <SliderRow label="Border radius" value={localConfig.borderRadius} min={16} max={36} unit="px" onChange={(value) => updateSlider("borderRadius", value)} onChangeEnd={(value) => commitSlider("borderRadius", value)} />
        <SliderRow label="Quota used" value={localConfig.quotaUsed} min={0} max={localConfig.quotaTotal} unit="GB" onChange={(value) => updateSlider("quotaUsed", value)} onChangeEnd={(value) => commitSlider("quotaUsed", value)} />
      </Section>

      <Section title="Shell">
        <ColorRow label="Panel background" value={localConfig.panelBackground} onChange={(value) => updateImmediate("panelBackground", value)} />
        <ColorRow label="Panel border" value={localConfig.panelBorderColor} onChange={(value) => updateImmediate("panelBorderColor", value)} />
        <ColorRow label="Overlay" value={localConfig.overlayColor} onChange={(value) => updateImmediate("overlayColor", value)} />
        <ColorRow label="Title" value={localConfig.titleColor} onChange={(value) => updateImmediate("titleColor", value)} />
        <ColorRow label="Subtitle" value={localConfig.subtitleColor} onChange={(value) => updateImmediate("subtitleColor", value)} />
      </Section>

      <Section title="Dropzone">
        <ColorRow label="Dropzone background" value={localConfig.dropzoneBackground} onChange={(value) => updateImmediate("dropzoneBackground", value)} />
        <ColorRow label="Active background" value={localConfig.dropzoneActiveBackground} onChange={(value) => updateImmediate("dropzoneActiveBackground", value)} />
        <ColorRow label="Dropzone border" value={localConfig.dropzoneBorderColor} onChange={(value) => updateImmediate("dropzoneBorderColor", value)} />
        <ColorRow label="Icon background" value={localConfig.dropzoneIconBackground} onChange={(value) => updateImmediate("dropzoneIconBackground", value)} />
        <ColorRow label="Primary button" value={localConfig.actionButtonBackground} onChange={(value) => updateImmediate("actionButtonBackground", value)} />
      </Section>

      <Section title="Uploads">
        <ColorRow label="Item background" value={localConfig.itemBackground} onChange={(value) => updateImmediate("itemBackground", value)} />
        <ColorRow label="Item border" value={localConfig.itemBorderColor} onChange={(value) => updateImmediate("itemBorderColor", value)} />
        <ColorRow label="Progress fill" value={localConfig.progressFillColor} onChange={(value) => updateImmediate("progressFillColor", value)} />
        <ColorRow label="Error background" value={localConfig.errorBackground} onChange={(value) => updateImmediate("errorBackground", value)} />
        <ColorRow label="Error text" value={localConfig.errorTextColor} onChange={(value) => updateImmediate("errorTextColor", value)} />
      </Section>

      <Section title="Options">
        <ToggleRow label="Animate open" value={localConfig.animateOpen} onChange={(value) => updateImmediate("animateOpen", value)} />
        <ToggleRow label="Show shadow" value={localConfig.showShadow} onChange={(value) => updateImmediate("showShadow", value)} />
      </Section>
    </ControlPanelShell>
  );
}
