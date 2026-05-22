"use client";

// /components/playground/ImageCarouselControlPanel.tsx

import { useState, useMemo } from "react";
import { ImageCarouselConfig } from "@/lib/imageCarouselConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: ImageCarouselConfig;
  onChange: (patch: Partial<ImageCarouselConfig>) => void;
  onReset: () => void;
}

export function ImageCarouselControlPanel({
  config,
  onChange,
  onReset,
}: Props) {
  const [local, setLocal] = useState(config);

  // Keep local in sync when config changes externally (e.g. theme switch / reset)
  if (
    local.btnBackground !== config.btnBackground ||
    local.lensBorderColor !== config.lensBorderColor ||
    local.thumbnailBorderColor !== config.thumbnailBorderColor ||
    local.zoomPreviewBorderColor !== config.zoomPreviewBorderColor
  ) {
    setLocal(config);
  }

  const debouncedChange = useMemo(
    () =>
      debounce((patch: Partial<ImageCarouselConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(patch: Partial<ImageCarouselConfig>) {
    setLocal((prev) => ({ ...prev, ...patch }));
    debouncedChange(patch);
  }

  function handleSliderEnd(patch: Partial<ImageCarouselConfig>) {
    onChange(patch);
  }

  function handleImmediate(patch: Partial<ImageCarouselConfig>) {
    setLocal((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ───────────────────────────────── */}
      <Section title="Container">
        <SliderRow
          label="Width"
          value={local.containerWidth}
          min={280}
          max={640}
          unit="px"
          onChange={(v) => handleSlider({ containerWidth: v })}
          onChangeEnd={(v) => handleSliderEnd({ containerWidth: v })}
        />
        <SliderRow
          label="Border radius"
          value={local.borderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider({ borderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ borderRadius: v })}
        />
        <ToggleRow
          label="Drop shadow"
          value={local.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>

      {/* ── Navigation buttons ──────────────────────── */}
      <Section title="Nav Buttons">
        <ColorRow
          label="Button bg"
          value={local.btnBackground}
          onChange={(v) => handleImmediate({ btnBackground: v })}
        />
        <ColorRow
          label="Arrow colour"
          value={local.btnColor}
          onChange={(v) => handleImmediate({ btnColor: v })}
        />
        <SliderRow
          label="Button radius"
          value={local.btnBorderRadius}
          min={0}
          max={50}
          unit="px"
          onChange={(v) => handleSlider({ btnBorderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ btnBorderRadius: v })}
        />
      </Section>

      {/* ── Thumbnails ──────────────────────────────── */}
      <Section title="Thumbnails">
        <SliderRow
          label="Size"
          value={local.thumbnailSize}
          min={40}
          max={120}
          unit="px"
          onChange={(v) => handleSlider({ thumbnailSize: v })}
          onChangeEnd={(v) => handleSliderEnd({ thumbnailSize: v })}
        />
        <SliderRow
          label="Border radius"
          value={local.thumbnailBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider({ thumbnailBorderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ thumbnailBorderRadius: v })}
        />
        <ColorRow
          label="Active border"
          value={local.thumbnailBorderColor}
          onChange={(v) => handleImmediate({ thumbnailBorderColor: v })}
        />
        <SliderRow
          label="Inactive opacity"
          value={Math.round(local.thumbnailOpacity * 100)}
          min={10}
          max={90}
          unit="%"
          onChange={(v) => handleSlider({ thumbnailOpacity: v / 100 })}
          onChangeEnd={(v) => handleSliderEnd({ thumbnailOpacity: v / 100 })}
        />
      </Section>

      {/* ── Zoom ────────────────────────────────────── */}
      <Section title="Zoom">
        <ToggleRow
          label="Enable zoom"
          value={local.showZoom}
          onChange={(v) => handleImmediate({ showZoom: v })}
        />
        <SliderRow
          label="Zoom factor"
          value={local.zoomFactor}
          min={1.5}
          max={6}
          unit="×"
          onChange={(v) => handleSlider({ zoomFactor: v })}
          onChangeEnd={(v) => handleSliderEnd({ zoomFactor: v })}
        />
        <ColorRow
          label="Lens border"
          value={local.lensBorderColor}
          onChange={(v) => handleImmediate({ lensBorderColor: v })}
        />
        <ColorRow
          label="Lens fill"
          value={local.lensBackground}
          onChange={(v) => handleImmediate({ lensBackground: v })}
        />
        <SliderRow
          label="Preview size"
          value={local.zoomPreviewSize}
          min={160}
          max={480}
          unit="px"
          onChange={(v) => handleSlider({ zoomPreviewSize: v })}
          onChangeEnd={(v) => handleSliderEnd({ zoomPreviewSize: v })}
        />
        <SliderRow
          label="Preview radius"
          value={local.zoomPreviewBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider({ zoomPreviewBorderRadius: v })}
          onChangeEnd={(v) => handleSliderEnd({ zoomPreviewBorderRadius: v })}
        />
        <ColorRow
          label="Preview border"
          value={local.zoomPreviewBorderColor}
          onChange={(v) => handleImmediate({ zoomPreviewBorderColor: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
