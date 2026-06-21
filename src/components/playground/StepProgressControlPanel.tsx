// /components/playground/StepProgressControlPanel.tsx
"use client";

import { useState, useMemo } from "react";
import {
  StepProgressConfig,
  StepShape,
  StepLabelType,
  ConnectorStyle,
  Orientation,
} from "@/lib/stepProgressConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "./CodePanel.module.css";

interface StepProgressControlPanelProps {
  config: StepProgressConfig;
  onChange: (patch: Partial<StepProgressConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

type SegmentOption<T extends string> = { value: T; label: string };

function SegmentedRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.row} style={{ gap: 8, alignItems: "center" }}>
      <span className={styles.label}>{label}</span>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              border: "1px solid",
              borderColor: value === opt.value ? "#7c6cfc" : "#2a2a38",
              background: value === opt.value ? "#7c6cfc22" : "transparent",
              color: value === opt.value ? "#9d91fd" : "#5a5a72",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              cursor: "pointer",
              transition: "all 0.15s ease",
              letterSpacing: "0.04em",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepProgressControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: StepProgressControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<StepProgressConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider(key: keyof StepProgressConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  // Sync local config when config changes externally (e.g. reset)
  if (
    localConfig.completedBackground !== config.completedBackground ||
    localConfig.nodeShape !== config.nodeShape
  ) {
    setLocalConfig(config);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Layout */}
      <Section title="Layout">
        <SegmentedRow<Orientation>
          label="Orientation"
          value={config.orientation}
          options={[
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
          onChange={(v) => onChange({ orientation: v })}
        />
        {/* Step count — 2 to 5 */}
        <div className={styles.row} style={{ gap: 8, alignItems: "center" }}>
          <span className={styles.label}>Steps</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onChange({ stepCount: n })}
                style={{
                  width: 32,
                  height: 28,
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: config.stepCount === n ? "#7c6cfc" : "#2a2a38",
                  background:
                    config.stepCount === n ? "#7c6cfc22" : "transparent",
                  color: config.stepCount === n ? "#9d91fd" : "#5a5a72",
                  fontSize: 12,
                  fontFamily: "'DM Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontWeight: config.stepCount === n ? 700 : 400,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Node Shape */}
      <Section title="Node Shape">
        <SegmentedRow<StepShape>
          label="Shape"
          value={config.nodeShape}
          options={[
            { value: "circle", label: "● Circle" },
            { value: "square", label: "■ Square" },
            { value: "diamond", label: "◆ Diamond" },
            { value: "hexagon", label: "⬡ Hexagon" },
          ]}
          onChange={(v) => onChange({ nodeShape: v })}
        />
        <SegmentedRow<StepLabelType>
          label="Label"
          value={config.labelType}
          options={[
            { value: "number", label: "1 2 3" },
            { value: "letter", label: "A B C" },
            { value: "roman", label: "I II" },
            { value: "icon", label: "Icon" },
            { value: "none", label: "None" },
          ]}
          onChange={(v) => onChange({ labelType: v })}
        />
        <SliderRow
          label="Node Size"
          value={localConfig.nodeSize}
          min={24}
          max={64}
          unit="px"
          onChange={(v) => handleSlider("nodeSize", v)}
          onChangeEnd={(v) => onChange({ nodeSize: v })}
        />
        <SliderRow
          label="Label Size"
          value={localConfig.nodeFontSize}
          min={10}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("nodeFontSize", v)}
          onChangeEnd={(v) => onChange({ nodeFontSize: v })}
        />
      </Section>

      {/* Completed Step */}
      <Section title="Completed Step">
        <ColorRow
          label="Background"
          value={config.completedBackground}
          onChange={(v) => onChange({ completedBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.completedBorderColor}
          onChange={(v) => onChange({ completedBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text / Icon"
          value={config.completedTextColor}
          onChange={(v) => onChange({ completedTextColor: v })}
        />
      </Section>

      {/* Active Step */}
      <Section title="Active Step">
        <ColorRow
          label="Background"
          value={config.activeBackground}
          onChange={(v) => onChange({ activeBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.activeBorderColor}
          onChange={(v) => onChange({ activeBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.activeTextColor}
          onChange={(v) => onChange({ activeTextColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Glow Ring"
          value={config.activeGlow}
          onChange={(v) => onChange({ activeGlow: v })}
        />
      </Section>

      {/* Incomplete Step */}
      <Section title="Incomplete Step">
        <ColorRow
          label="Background"
          value={config.incompleteBackground}
          onChange={(v) => onChange({ incompleteBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.incompleteBorderColor}
          onChange={(v) => onChange({ incompleteBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.incompleteTextColor}
          onChange={(v) => onChange({ incompleteTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Connector */}
      <Section title="Connector">
        <SegmentedRow<ConnectorStyle>
          label="Style"
          value={config.connectorStyle}
          options={[
            { value: "solid", label: "───" },
            { value: "dashed", label: "- - -" },
            { value: "dotted", label: "· · ·" },
          ]}
          onChange={(v) => onChange({ connectorStyle: v })}
        />
        <SliderRow
          label="Thickness"
          value={localConfig.connectorThickness}
          min={1}
          max={6}
          unit="px"
          onChange={(v) => handleSlider("connectorThickness", v)}
          onChangeEnd={(v) => onChange({ connectorThickness: v })}
        />
        <SliderRow
          label="Length"
          value={localConfig.connectorLength}
          min={32}
          max={160}
          unit="px"
          onChange={(v) => handleSlider("connectorLength", v)}
          onChangeEnd={(v) => onChange({ connectorLength: v })}
        />
        <ColorRow
          label="Completed"
          value={config.connectorCompletedColor}
          onChange={(v) => onChange({ connectorCompletedColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Incomplete"
          value={config.connectorIncompleteColor}
          onChange={(v) => onChange({ connectorIncompleteColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* Step Labels */}
      <Section title="Step Labels">
        <ToggleRow
          label="Show Labels"
          value={config.showStepLabels}
          onChange={(v) => onChange({ showStepLabels: v })}
        />
        {config.showStepLabels && (
          <>
            <SliderRow
              label="Font Size"
              value={localConfig.stepLabelFontSize}
              min={10}
              max={18}
              unit="px"
              onChange={(v) => handleSlider("stepLabelFontSize", v)}
              onChangeEnd={(v) => onChange({ stepLabelFontSize: v })}
            />
            <ColorRow
              label="Default Color"
              value={config.stepLabelColor}
              onChange={(v) => onChange({ stepLabelColor: v })}
              isDark={isDark}
/>
            <ColorRow
              label="Active Color"
              value={config.stepLabelActiveColor}
              onChange={(v) => onChange({ stepLabelActiveColor: v })}
              isDark={isDark}
/>
          </>
        )}
      </Section>

      {/* Effects */}
      <Section title="Effects">
        <ToggleRow
          label="Animate Transitions"
          value={config.animateTransitions}
          onChange={(v) => onChange({ animateTransitions: v })}
        />
        <ToggleRow
          label="Node Shadow"
          value={config.showNodeShadow}
          onChange={(v) => onChange({ showNodeShadow: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
