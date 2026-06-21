// /components/playground/LoaderControlPanel.tsx
"use client";

import { useState, useMemo, useRef } from "react";
import { LoaderConfig, ImageAnimation } from "@/lib/customLoaderConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "./ControlPanel.module.css";

interface LoaderControlPanelProps {
  config: LoaderConfig;
  imageDataUrl: string | null;
  onChange: (patch: Partial<LoaderConfig>) => void;
  onReset: () => void;
  onImageUpload: (dataUrl: string) => void;
  onImageClear: () => void;
  isDark: boolean;
}

const ANIMATION_OPTIONS: {
  value: ImageAnimation;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "diagonal-reveal",
    label: "Diagonal Reveal",
    description: "Blurred image wipes sharp diagonally",
    icon: "◪",
  },
  {
    value: "tile-assemble",
    label: "Tile Assemble",
    description: "Grid tiles fly in and lock into place",
    icon: "⊞",
  },
  {
    value: "scanline",
    label: "Scanline",
    description: "Horizontal scan lines fade image in",
    icon: "≡",
  },
  {
    value: "glitch",
    label: "Glitch",
    description: "RGB channel split & pixel distortion",
    icon: "⚡",
  },
  {
    value: "dissolve",
    label: "Ink Bleed",
    description: "Ink drops spread and reveal image like watercolor",
    icon: "⬡",
  },
  {
    value: "shatter",
    label: "Shatter",
    description: "Fragments explode then reassemble",
    icon: "✦",
  },
];

export function LoaderControlPanel({
  config,
  imageDataUrl,
  onChange,
  onReset,
  onImageUpload,
  onImageClear,
  isDark,
}: LoaderControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local config when parent config changes (e.g. mode switch / reset)
  useMemo(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof LoaderConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleImmediate(patch: Partial<LoaderConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onImageUpload(e.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  const anim = localConfig.animation;

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Image Upload ── */}
      <Section title="Image">
        {!imageDataUrl ? (
          <div className={styles.row}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 8,
                border: "1.5px dashed #2a2a38",
                background: "transparent",
                color: "#9090a8",
                fontSize: 12,
                fontFamily: "var(--font-body, sans-serif)",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#7c6cfc";
                (e.currentTarget as HTMLButtonElement).style.color = "#7c6cfc";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#2a2a38";
                (e.currentTarget as HTMLButtonElement).style.color = "#9090a8";
              }}
            >
              + Upload logo / image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
          </div>
        ) : (
          <>
            <div className={styles.row} style={{ gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: "1px solid #2a2a38",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#1c1c22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imageDataUrl}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div style={{ flex: 1, display: "flex", gap: 6 }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 6,
                    border: "1px solid #2a2a38",
                    background: "transparent",
                    color: "#9090a8",
                    fontSize: 11,
                    fontFamily: "var(--font-body, sans-serif)",
                    cursor: "pointer",
                  }}
                >
                  Replace
                </button>
                <button
                  onClick={onImageClear}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 6,
                    border: "1px solid #f8717120",
                    background: "transparent",
                    color: "#f87171",
                    fontSize: 11,
                    fontFamily: "var(--font-body, sans-serif)",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
            </div>

            <SliderRow
              label="Size"
              value={localConfig.imageSize}
              min={48}
              max={240}
              unit="px"
              onChange={(v) => handleSlider("imageSize", v)}
              onChangeEnd={(v) => onChange({ imageSize: v })}
            />
            <SliderRow
              label="Radius"
              value={localConfig.imageBorderRadius}
              min={0}
              max={120}
              unit="px"
              onChange={(v) => handleSlider("imageBorderRadius", v)}
              onChangeEnd={(v) => onChange({ imageBorderRadius: v })}
            />
          </>
        )}
      </Section>

      {/* ── Animation Style ── */}
      <Section title="Animation">
        <div className={styles.row} style={{ flexDirection: "column", gap: 4 }}>
          <span className={styles.label} style={{ marginBottom: 6 }}>
            Style
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
          >
            {ANIMATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleImmediate({ animation: opt.value })}
                title={opt.description}
                style={{
                  padding: "8px 8px",
                  borderRadius: 7,
                  border: `1px solid ${localConfig.animation === opt.value ? "#7c6cfc" : "#2a2a38"}`,
                  background:
                    localConfig.animation === opt.value
                      ? "#7c6cfc14"
                      : "transparent",
                  color:
                    localConfig.animation === opt.value ? "#9d91fd" : "#9090a8",
                  fontSize: 11,
                  fontFamily: "var(--font-body, sans-serif)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontWeight: localConfig.animation === opt.value ? 600 : 400,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <span style={{ fontSize: 14 }}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <SliderRow
          label="Speed"
          value={localConfig.animationSpeed}
          min={400}
          max={4000}
          unit="ms"
          onChange={(v) => handleSlider("animationSpeed", v)}
          onChangeEnd={(v) => onChange({ animationSpeed: v })}
        />
        <SliderRow
          label="Loop delay"
          value={localConfig.loopDelay}
          min={0}
          max={3000}
          unit="ms"
          onChange={(v) => handleSlider("loopDelay", v)}
          onChangeEnd={(v) => onChange({ loopDelay: v })}
        />
      </Section>

      {/* ── Diagonal Reveal options ── */}
      {anim === "diagonal-reveal" && (
        <Section title="Reveal">
          <SliderRow
            label="Angle"
            value={localConfig.revealAngle}
            min={0}
            max={90}
            unit="°"
            onChange={(v) => handleSlider("revealAngle", v)}
            onChangeEnd={(v) => onChange({ revealAngle: v })}
          />
          <SliderRow
            label="Blur"
            value={localConfig.revealBlur}
            min={0}
            max={30}
            unit="px"
            onChange={(v) => handleSlider("revealBlur", v)}
            onChangeEnd={(v) => onChange({ revealBlur: v })}
          />
        </Section>
      )}

      {/* ── Tile Assemble options ── */}
      {anim === "tile-assemble" && (
        <Section title="Tiles">
          <SliderRow
            label="Columns"
            value={localConfig.tileColumns}
            min={2}
            max={10}
            unit=""
            onChange={(v) => handleSlider("tileColumns", Math.round(v))}
            onChangeEnd={(v) => onChange({ tileColumns: Math.round(v) })}
          />
          <SliderRow
            label="Rows"
            value={localConfig.tileRows}
            min={2}
            max={10}
            unit=""
            onChange={(v) => handleSlider("tileRows", Math.round(v))}
            onChangeEnd={(v) => onChange({ tileRows: Math.round(v) })}
          />
          <SliderRow
            label="Scatter"
            value={localConfig.tileGap}
            min={0}
            max={12}
            unit="px"
            onChange={(v) => handleSlider("tileGap", v)}
            onChangeEnd={(v) => onChange({ tileGap: v })}
          />
        </Section>
      )}

      {/* ── Scanline options ── */}
      {anim === "scanline" && (
        <Section title="Scanlines">
          <SliderRow
            label="Lines"
            value={localConfig.scanlineCount}
            min={2}
            max={24}
            unit=""
            onChange={(v) => handleSlider("scanlineCount", Math.round(v))}
            onChangeEnd={(v) => onChange({ scanlineCount: Math.round(v) })}
          />
          <div
            className={styles.row}
            style={{ flexDirection: "column", gap: 4 }}
          >
            <span className={styles.label} style={{ marginBottom: 4 }}>
              Direction
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {(["top-down", "bottom-up", "alternating"] as const).map(
                (dir) => (
                  <button
                    key={dir}
                    onClick={() => handleImmediate({ scanlineDirection: dir })}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      borderRadius: 6,
                      fontSize: 10,
                      border: `1px solid ${localConfig.scanlineDirection === dir ? "#7c6cfc" : "#2a2a38"}`,
                      background:
                        localConfig.scanlineDirection === dir
                          ? "#7c6cfc14"
                          : "transparent",
                      color:
                        localConfig.scanlineDirection === dir
                          ? "#9d91fd"
                          : "#9090a8",
                      fontFamily: "var(--font-body, sans-serif)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {dir === "top-down"
                      ? "↓ Down"
                      : dir === "bottom-up"
                        ? "↑ Up"
                        : "↕ Alt"}
                  </button>
                ),
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ── Glitch options ── */}
      {anim === "glitch" && (
        <Section title="Glitch">
          <SliderRow
            label="Intensity"
            value={localConfig.glitchIntensity}
            min={1}
            max={10}
            unit=""
            onChange={(v) => handleSlider("glitchIntensity", v)}
            onChangeEnd={(v) => onChange({ glitchIntensity: v })}
          />
          <SliderRow
            label="Slices"
            value={localConfig.glitchSlices}
            min={4}
            max={20}
            unit=""
            onChange={(v) => handleSlider("glitchSlices", Math.round(v))}
            onChangeEnd={(v) => onChange({ glitchSlices: Math.round(v) })}
          />
        </Section>
      )}

      {/* ── Dissolve options ── */}
      {anim === "dissolve" && (
        <Section title="Ink Bleed">
          <SliderRow
            label="Drop count"
            value={localConfig.dissolveParticleSize}
            min={2}
            max={20}
            unit=""
            onChange={(v) => handleSlider("dissolveParticleSize", v)}
            onChangeEnd={(v) => onChange({ dissolveParticleSize: v })}
          />
        </Section>
      )}

      {/* ── Shatter options ── */}
      {anim === "shatter" && (
        <Section title="Shatter">
          <SliderRow
            label="Pieces"
            value={localConfig.shatterPieces}
            min={4}
            max={24}
            unit=""
            onChange={(v) => handleSlider("shatterPieces", Math.round(v))}
            onChangeEnd={(v) => onChange({ shatterPieces: Math.round(v) })}
          />
        </Section>
      )}

      {/* ── Glow ── */}
      <Section title="Glow">
        <ToggleRow
          label="Show glow"
          value={localConfig.showGlow}
          onChange={(v) => handleImmediate({ showGlow: v })}
        />
        {localConfig.showGlow && (
          <ColorRow
            label="Glow color"
            value={localConfig.glowColor}
            onChange={(v) => handleImmediate({ glowColor: v })}
            isDark={isDark}
          />
        )}
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
          isDark={isDark}
        />
      </Section>

      {/* ── Label ── */}
      <Section title="Label">
        <ToggleRow
          label="Show label"
          value={localConfig.showLabel}
          onChange={(v) => handleImmediate({ showLabel: v })}
        />
        {localConfig.showLabel && (
          <>
            <div className={styles.row}>
              <span className={styles.label}>Text</span>
              <input
                type="text"
                value={localConfig.labelText}
                maxLength={40}
                onChange={(e) => handleImmediate({ labelText: e.target.value })}
                style={{
                  flex: 1,
                  background: "#1c1c22",
                  border: "1px solid #2a2a38",
                  borderRadius: 6,
                  padding: "5px 8px",
                  color: "#f0f0f5",
                  fontSize: 12,
                  fontFamily: "var(--font-body, sans-serif)",
                  outline: "none",
                }}
              />
            </div>
            <ColorRow
              label="Color"
              value={localConfig.labelColor}
              onChange={(v) => handleImmediate({ labelColor: v })}
              isDark={isDark}
            />
            <SliderRow
              label="Size"
              value={localConfig.labelFontSize}
              min={10}
              max={20}
              unit="px"
              onChange={(v) => handleSlider("labelFontSize", v)}
              onChangeEnd={(v) => onChange({ labelFontSize: v })}
            />
            <SliderRow
              label="Gap"
              value={localConfig.labelGap}
              min={8}
              max={48}
              unit="px"
              onChange={(v) => handleSlider("labelGap", v)}
              onChangeEnd={(v) => onChange({ labelGap: v })}
            />
          </>
        )}
      </Section>

      {/* ── Container ── */}
      <Section title="Container">
        <ToggleRow
          label="Show background"
          value={localConfig.showBackground}
          onChange={(v) => handleImmediate({ showBackground: v })}
        />
        {localConfig.showBackground && (
          <>
            <ColorRow
              label="Background"
              value={localConfig.backgroundColor}
              onChange={(v) => handleImmediate({ backgroundColor: v })}
              isDark={isDark}
            />
            <SliderRow
              label="Padding"
              value={localConfig.containerPadding}
              min={12}
              max={80}
              unit="px"
              onChange={(v) => handleSlider("containerPadding", v)}
              onChangeEnd={(v) => onChange({ containerPadding: v })}
            />
            <SliderRow
              label="Radius"
              value={localConfig.containerBorderRadius}
              min={0}
              max={40}
              unit="px"
              onChange={(v) => handleSlider("containerBorderRadius", v)}
              onChangeEnd={(v) => onChange({ containerBorderRadius: v })}
            />
            <ToggleRow
              label="Shadow"
              value={localConfig.showShadow}
              onChange={(v) => handleImmediate({ showShadow: v })}
            />
          </>
        )}
      </Section>
    </ControlPanelShell>
  );
}
