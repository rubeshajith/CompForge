"use client";

import { useState, useMemo, useCallback } from "react";
import { SkeletonConfig, SkeletonBox, BoxShape } from "@/lib/skeletonConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface SkeletonControlPanelProps {
  config: SkeletonConfig;
  onChange: (patch: Partial<SkeletonConfig>) => void;
  onReset: () => void;
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
  isDark: boolean;
}

let boxCounter = 8;
function genId() {
  return `box-${boxCounter++}`;
}

const SHAPE_DEFAULTS: Record<BoxShape, Partial<SkeletonBox>> = {
  rect: { width: 120, height: 40, borderRadius: 6 },
  circle: { width: 48, height: 48, borderRadius: 24 },
  line: { width: 200, height: 12, borderRadius: 4 },
};

export function SkeletonControlPanel({
  config,
  onChange,
  onReset,
  selectedBoxId,
  onSelectBox,
  isDark = true,
}: SkeletonControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  // Keep local in sync when mode switches reset config externally
  if (
    localConfig.shimmerBaseColor !== config.shimmerBaseColor ||
    localConfig.canvasBackground !== config.canvasBackground
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  const handleSlider = (key: keyof SkeletonConfig, value: number) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  };

  const handleSliderEnd = (key: keyof SkeletonConfig, value: number) => {
    onChange({ [key]: value });
  };

  const selectedBox = config.boxes.find((b) => b.id === selectedBoxId) ?? null;

  const updateBox = (patch: Partial<SkeletonBox>) => {
    if (!selectedBox) return;
    onChange({
      boxes: config.boxes.map((b) =>
        b.id === selectedBox.id ? { ...b, ...patch } : b,
      ),
    });
  };

  const addBox = (shape: BoxShape) => {
    const defaults = SHAPE_DEFAULTS[shape];
    const newBox: SkeletonBox = {
      id: genId(),
      x: 16,
      y: 16,
      width: defaults.width!,
      height: defaults.height!,
      borderRadius: defaults.borderRadius!,
      shape,
    };
    onChange({ boxes: [...config.boxes, newBox] });
    onSelectBox(newBox.id);
  };

  const deleteBox = () => {
    if (!selectedBox) return;
    onChange({ boxes: config.boxes.filter((b) => b.id !== selectedBox.id) });
    onSelectBox(null);
  };

  const clearAll = () => {
    onChange({ boxes: [] });
    onSelectBox(null);
  };

  // Styles for the add-shape buttons
  const shapeBtnStyle = (active?: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "7px 4px",
    background: active ? "#7c6cfc22" : "#1c1c22",
    border: `1px solid ${active ? "#7c6cfc" : "#2a2a38"}`,
    borderRadius: 6,
    color: active ? "#9d91fd" : "#9090a8",
    fontSize: 11,
    fontFamily: "DM Mono, monospace",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    transition: "all 0.15s",
  });

  const numInputStyle: React.CSSProperties = {
    width: "100%",
    background: "#141418",
    border: "1px solid #2a2a38",
    borderRadius: 6,
    color: "#f0f0f5",
    fontSize: 12,
    fontFamily: "DM Mono, monospace",
    padding: "5px 8px",
    outline: "none",
    appearance: "none" as React.CSSProperties["appearance"],
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "#5a5a72",
    fontFamily: "DM Mono, monospace",
    marginBottom: 4,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
  };

  const fieldStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Canvas */}
      <Section title="Canvas">
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <div style={labelStyle}>Width</div>
            <input
              type="number"
              style={numInputStyle}
              value={localConfig.canvasWidth}
              min={100}
              max={800}
              onChange={(e) =>
                handleSlider("canvasWidth", Number(e.target.value))
              }
              onBlur={(e) =>
                handleSliderEnd("canvasWidth", Number(e.target.value))
              }
            />
          </div>
          <div style={fieldStyle}>
            <div style={labelStyle}>Height</div>
            <input
              type="number"
              style={numInputStyle}
              value={localConfig.canvasHeight}
              min={60}
              max={800}
              onChange={(e) =>
                handleSlider("canvasHeight", Number(e.target.value))
              }
              onBlur={(e) =>
                handleSliderEnd("canvasHeight", Number(e.target.value))
              }
            />
          </div>
        </div>
        <ColorRow
          label="Background"
          value={config.canvasBackground}
          onChange={(v) => onChange({ canvasBackground: v })}
          isDark={isDark}
        />
        <ColorRow
          label="Border"
          value={config.canvasBorder}
          onChange={(v) => onChange({ canvasBorder: v })}
          isDark={isDark}
        />
        <SliderRow
          label="Corner radius"
          value={localConfig.canvasBorderRadius}
          min={0}
          max={40}
          unit="px"
          onChange={(v) => handleSlider("canvasBorderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("canvasBorderRadius", v)}
        />
        <ToggleRow
          label="Shadow"
          value={config.showCanvasShadow}
          onChange={(v) => onChange({ showCanvasShadow: v })}
        />
      </Section>

      {/* Shimmer */}
      <Section title="Shimmer">
        <ColorRow
          label="Base color"
          value={config.shimmerBaseColor}
          onChange={(v) => onChange({ shimmerBaseColor: v })}
          isDark={isDark}
        />
        <ColorRow
          label="Highlight"
          value={config.shimmerHighlightColor}
          onChange={(v) => onChange({ shimmerHighlightColor: v })}
          isDark={isDark}
        />
        <SliderRow
          label="Speed"
          value={localConfig.shimmerSpeed}
          min={0.4}
          max={4}
          unit="s"
          onChange={(v) => handleSlider("shimmerSpeed", v)}
          onChangeEnd={(v) => handleSliderEnd("shimmerSpeed", v)}
        />
      </Section>

      {/* Add Box */}
      <Section title="Add Box">
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <button style={shapeBtnStyle()} onClick={() => addBox("rect")}>
            <svg width="20" height="14" viewBox="0 0 20 14">
              <rect
                x="1"
                y="1"
                width="18"
                height="12"
                rx="2"
                fill="none"
                stroke="#9090a8"
                strokeWidth="1.5"
              />
            </svg>
            Rectangle
          </button>
          <button style={shapeBtnStyle()} onClick={() => addBox("circle")}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle
                cx="8"
                cy="8"
                r="7"
                fill="none"
                stroke="#9090a8"
                strokeWidth="1.5"
              />
            </svg>
            Circle
          </button>
          <button style={shapeBtnStyle()} onClick={() => addBox("line")}>
            <svg width="24" height="8" viewBox="0 0 24 8">
              <rect
                x="0"
                y="2"
                width="24"
                height="4"
                rx="2"
                fill="none"
                stroke="#9090a8"
                strokeWidth="1.5"
              />
            </svg>
            Line
          </button>
        </div>
        {config.boxes.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              width: "100%",
              padding: "6px",
              background: "transparent",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f87171",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Clear all boxes
          </button>
        )}
      </Section>

      {/* Selected Box */}
      {selectedBox ? (
        <Section title="Selected Box">
          {/* Shape label */}
          <div style={{ ...labelStyle, marginBottom: 8 }}>
            Shape: <span style={{ color: "#9d91fd" }}>{selectedBox.shape}</span>
          </div>

          {/* Position */}
          <div style={{ ...labelStyle }}>Position</div>
          <div style={{ ...rowStyle, marginBottom: 10 }}>
            <div style={fieldStyle}>
              <div style={{ ...labelStyle, fontSize: 10 }}>X</div>
              <input
                type="number"
                style={numInputStyle}
                value={Math.round(selectedBox.x)}
                onChange={(e) => updateBox({ x: Number(e.target.value) })}
              />
            </div>
            <div style={fieldStyle}>
              <div style={{ ...labelStyle, fontSize: 10 }}>Y</div>
              <input
                type="number"
                style={numInputStyle}
                value={Math.round(selectedBox.y)}
                onChange={(e) => updateBox({ y: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Size */}
          <div style={{ ...labelStyle }}>Size</div>
          <div style={{ ...rowStyle, marginBottom: 10 }}>
            <div style={fieldStyle}>
              <div style={{ ...labelStyle, fontSize: 10 }}>W</div>
              <input
                type="number"
                style={numInputStyle}
                value={Math.round(selectedBox.width)}
                min={MIN_BOX}
                onChange={(e) =>
                  updateBox({
                    width: Math.max(MIN_BOX, Number(e.target.value)),
                  })
                }
              />
            </div>
            <div style={fieldStyle}>
              <div style={{ ...labelStyle, fontSize: 10 }}>H</div>
              <input
                type="number"
                style={numInputStyle}
                value={Math.round(selectedBox.height)}
                min={MIN_BOX}
                onChange={(e) =>
                  updateBox({
                    height: Math.max(MIN_BOX, Number(e.target.value)),
                  })
                }
              />
            </div>
          </div>

          {/* Border radius (not for circle) */}
          {selectedBox.shape !== "circle" && (
            <SliderRow
              label="Corner radius"
              value={selectedBox.borderRadius}
              min={0}
              max={Math.min(selectedBox.width, selectedBox.height) / 2}
              unit="px"
              onChange={(v) => updateBox({ borderRadius: v })}
              onChangeEnd={(v) => updateBox({ borderRadius: v })}
            />
          )}

          <button
            onClick={deleteBox}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "7px",
              background: "#f8717115",
              border: "1px solid #f8717133",
              borderRadius: 6,
              color: "#f87171",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              cursor: "pointer",
            }}
          >
            Delete box
          </button>
        </Section>
      ) : (
        <Section title="Selected Box">
          <div
            style={{
              textAlign: "center",
              color: "#5a5a72",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              padding: "12px 0",
            }}
          >
            Click a box on the canvas to edit it
          </div>
        </Section>
      )}
    </ControlPanelShell>
  );
}

const MIN_BOX = 10;
