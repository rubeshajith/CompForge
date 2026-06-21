"use client";

import { useState, useMemo } from "react";
import {
  KanbanConfig,
  KanbanMode,
  kanbanModePresets,
} from "@/lib/kanbanConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface KanbanControlPanelProps {
  config: KanbanConfig;
  mode: KanbanMode;
  onChange: (patch: Partial<KanbanConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

// Small inline select for column count
function CountSelect({
  value,
  onChange,
  config,
}: {
  value: number;
  onChange: (v: 3 | 4 | 5) => void;
  config: KanbanConfig;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontFamily: "DM Mono, monospace",
          color: "#9090a8",
        }}
      >
        Column count
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {([3, 4, 5] as const).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 30,
              height: 26,
              background: value === n ? "#7c6cfc22" : "#141418",
              border: `1px solid ${value === n ? "#7c6cfc" : "#2a2a38"}`,
              borderRadius: 6,
              color: value === n ? "#9d91fd" : "#5a5a72",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function KanbanControlPanel({
  config,
  mode,
  onChange,
  onReset,
  isDark = true,
}: KanbanControlPanelProps) {
  const [local, setLocal] = useState(config);

  // Sync local when mode switches reset config
  if (
    local.columnBackground !== config.columnBackground ||
    local.cardBackground !== config.cardBackground
  ) {
    setLocal(config);
  }

  const debouncedChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function slider(key: keyof KanbanConfig, value: number) {
    setLocal((p) => ({ ...p, [key]: value }));
    debouncedChange({ [key]: value });
  }
  function sliderEnd(key: keyof KanbanConfig, value: number) {
    onChange({ [key]: value });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Board ── */}
      <Section title="Board">
        <ColorRow
          label="Background"
          value={config.boardBackground}
          onChange={(v) => onChange({ boardBackground: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Column gap"
          value={local.boardGap}
          min={8}
          max={40}
          unit="px"
          onChange={(v) => slider("boardGap", v)}
          onChangeEnd={(v) => sliderEnd("boardGap", v)}
        />
        <CountSelect
          value={config.columnCount}
          onChange={(v) => onChange({ columnCount: v })}
          config={config}
        />
      </Section>

      {/* ── Column ── */}
      <Section title="Column">
        <ColorRow
          label="Background"
          value={config.columnBackground}
          onChange={(v) => onChange({ columnBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.columnBorderColor}
          onChange={(v) => onChange({ columnBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Header text"
          value={config.columnHeaderTextColor}
          onChange={(v) => onChange({ columnHeaderTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Corner radius"
          value={local.columnBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => slider("columnBorderRadius", v)}
          onChangeEnd={(v) => sliderEnd("columnBorderRadius", v)}
        />
        <SliderRow
          label="Width"
          value={local.columnWidth}
          min={220}
          max={400}
          unit="px"
          onChange={(v) => slider("columnWidth", v)}
          onChangeEnd={(v) => sliderEnd("columnWidth", v)}
        />
      </Section>

      {/* ── Card ── */}
      <Section title="Card">
        <ColorRow
          label="Background"
          value={config.cardBackground}
          onChange={(v) => onChange({ cardBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.cardBorderColor}
          onChange={(v) => onChange({ cardBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Hover border"
          value={config.cardHoverBorderColor}
          onChange={(v) => onChange({ cardHoverBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Title color"
          value={config.cardTitleColor}
          onChange={(v) => onChange({ cardTitleColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Desc color"
          value={config.cardDescColor}
          onChange={(v) => onChange({ cardDescColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Corner radius"
          value={local.cardBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => slider("cardBorderRadius", v)}
          onChangeEnd={(v) => sliderEnd("cardBorderRadius", v)}
        />
        <SliderRow
          label="Padding"
          value={local.cardPadding}
          min={8}
          max={24}
          unit="px"
          onChange={(v) => slider("cardPadding", v)}
          onChangeEnd={(v) => sliderEnd("cardPadding", v)}
        />
        <SliderRow
          label="Card gap"
          value={local.cardGap}
          min={4}
          max={24}
          unit="px"
          onChange={(v) => slider("cardGap", v)}
          onChangeEnd={(v) => sliderEnd("cardGap", v)}
        />
        <SliderRow
          label="Title size"
          value={local.cardTitleFontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => slider("cardTitleFontSize", v)}
          onChangeEnd={(v) => sliderEnd("cardTitleFontSize", v)}
        />
        <ToggleRow
          label="Card shadow"
          value={config.cardShadow}
          onChange={(v) => onChange({ cardShadow: v })}
        />
        <ToggleRow
          label="Drag rotation"
          value={config.cardDragRotation}
          onChange={(v) => onChange({ cardDragRotation: v })}
        />
      </Section>

      {/* ── Progress ── */}
      <Section title="Progress">
        <ColorRow
          label="Track"
          value={config.progressTrackColor}
          onChange={(v) => onChange({ progressTrackColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Fill"
          value={config.progressFillColor}
          onChange={(v) => onChange({ progressFillColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Done color"
          value={config.progressFillColorDone}
          onChange={(v) => onChange({ progressFillColorDone: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Priority ── */}
      <Section title="Priority Badges">
        <ColorRow
          label="High bg"
          value={config.priorityHighBg}
          onChange={(v) => onChange({ priorityHighBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="High text"
          value={config.priorityHighText}
          onChange={(v) => onChange({ priorityHighText: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Medium bg"
          value={config.priorityMediumBg}
          onChange={(v) => onChange({ priorityMediumBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Medium text"
          value={config.priorityMediumText}
          onChange={(v) => onChange({ priorityMediumText: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Low bg"
          value={config.priorityLowBg}
          onChange={(v) => onChange({ priorityLowBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Low text"
          value={config.priorityLowText}
          onChange={(v) => onChange({ priorityLowText: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Tags ── */}
      <Section title="Tag Badge">
        <ColorRow
          label="Background"
          value={config.tagBg}
          onChange={(v) => onChange({ tagBg: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.tagText}
          onChange={(v) => onChange({ tagText: v })}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
