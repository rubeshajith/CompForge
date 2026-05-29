"use client";

import { useState, useMemo } from "react";
import type {
  EmojiConfig,
  EmojiVariant,
  EmojiAnimation,
} from "@/lib/emojiConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: EmojiConfig;
  onChange: (patch: Partial<EmojiConfig>) => void;
  onReset: () => void;
}

const VARIANTS: EmojiVariant[] = [
  "happy",
  "cool",
  "love",
  "fire",
  "explode",
  "sleepy",
];
const ANIMATIONS: EmojiAnimation[] = [
  "bounce",
  "spin",
  "pulse",
  "shake",
  "float",
  "rubber",
];

const VARIANT_LABELS: Record<EmojiVariant, string> = {
  happy: "😊 Happy",
  cool: "😎 Cool",
  love: "😍 Love",
  fire: "😤 Fire",
  explode: "😲 Explode",
  sleepy: "😴 Sleepy",
};

const ANIM_LABELS: Record<EmojiAnimation, string> = {
  bounce: "↕ Bounce",
  spin: "↻ Spin",
  pulse: "◎ Pulse",
  shake: "↔ Shake",
  float: "↑ Float",
  rubber: "⤢ Rubber",
};

export function EmojiControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof EmojiConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    background: "#1c1c22",
    border: "1px solid #2a2a38",
    borderRadius: 6,
    color: "#f0f0f5",
    padding: "6px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  };

  const chipWrap: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  };

  function chipStyle(active: boolean): React.CSSProperties {
    return {
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 12,
      cursor: "pointer",
      border: active ? "1px solid #7c6cfc" : "1px solid #2a2a38",
      background: active ? "#7c6cfc22" : "#141418",
      color: active ? "#9d91fd" : "#9090a8",
      fontFamily: "inherit",
      transition: "all 0.15s",
    };
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Variant */}
      <Section title="Emoji">
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#9090a8", marginBottom: 6 }}>
            Variant
          </div>
          <div style={chipWrap}>
            {VARIANTS.map((v) => (
              <button
                key={v}
                style={chipStyle(config.variant === v)}
                onClick={() => onChange({ variant: v })}
              >
                {VARIANT_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Animation */}
      <Section title="Animation">
        <ToggleRow
          label="Enable animation"
          value={config.animationEnabled}
          onChange={(v) => onChange({ animationEnabled: v })}
        />
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#9090a8", marginBottom: 6 }}>
            Style
          </div>
          <div style={chipWrap}>
            {ANIMATIONS.map((a) => (
              <button
                key={a}
                style={chipStyle(config.animation === a)}
                onClick={() => onChange({ animation: a })}
              >
                {ANIM_LABELS[a]}
              </button>
            ))}
          </div>
        </div>
        <SliderRow
          label="Speed (ms)"
          value={localConfig.animationDuration}
          min={300}
          max={2000}
          unit="ms"
          onChange={(v) => handleSlider("animationDuration", v)}
          onChangeEnd={(v) => onChange({ animationDuration: v })}
        />
      </Section>

      {/* Size */}
      <Section title="Size">
        <SliderRow
          label="Emoji size"
          value={localConfig.size}
          min={60}
          max={240}
          unit="px"
          onChange={(v) => handleSlider("size", v)}
          onChangeEnd={(v) => onChange({ size: v })}
        />
        <SliderRow
          label="Padding"
          value={localConfig.backgroundPadding}
          min={0}
          max={60}
          unit="px"
          onChange={(v) => handleSlider("backgroundPadding", v)}
          onChangeEnd={(v) => onChange({ backgroundPadding: v })}
        />
      </Section>

      {/* Face colors */}
      <Section title="Face">
        <ColorRow
          label="Face color"
          value={config.faceColor}
          onChange={(v) => onChange({ faceColor: v })}
        />
        <ColorRow
          label="Face shade"
          value={config.faceShadeColor}
          onChange={(v) => onChange({ faceShadeColor: v })}
        />
        <ColorRow
          label="Outline"
          value={config.outlineColor}
          onChange={(v) => onChange({ outlineColor: v })}
        />
        <ColorRow
          label="Cheeks"
          value={config.cheekColor}
          onChange={(v) => onChange({ cheekColor: v })}
        />
      </Section>

      {/* Features */}
      <Section title="Features">
        <ColorRow
          label="Eyes"
          value={config.eyeColor}
          onChange={(v) => onChange({ eyeColor: v })}
        />
        <ColorRow
          label="Pupils"
          value={config.pupilColor}
          onChange={(v) => onChange({ pupilColor: v })}
        />
        <ColorRow
          label="Mouth"
          value={config.mouthColor}
          onChange={(v) => onChange({ mouthColor: v })}
        />
        <ColorRow
          label="Accent (details)"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
      </Section>

      {/* Container */}
      <Section title="Background">
        <ToggleRow
          label="Show background"
          value={config.showBackground}
          onChange={(v) => onChange({ showBackground: v })}
        />
        <ColorRow
          label="Background color"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
        />
        <SliderRow
          label="Corner radius"
          value={localConfig.backgroundRadius}
          min={0}
          max={50}
          unit="%"
          onChange={(v) => handleSlider("backgroundRadius", v)}
          onChangeEnd={(v) => onChange({ backgroundRadius: v })}
        />
        <ToggleRow
          label="Show shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
