"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import {
  StepperConfig,
  StepperVariant,
  VARIANT_LABELS,
} from "@/lib/stepperConfig";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/CodePanel.module.css";

interface StepperControlPanelProps {
  config: StepperConfig;
  onChange: (patch: Partial<StepperConfig>) => void;
  onReset: () => void;
}

const ALL_VARIANTS: StepperVariant[] = [
  "progressPin",
  "multiStep",
  "rangeSlider",
  "segmented",
  "dotStepper",
];

export function StepperControlPanel({
  config,
  onChange,
  onReset,
}: StepperControlPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  function handleSlider(patch: Partial<StepperConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<StepperConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  const v = localConfig.variant;

  // Which sections to show per variant
  const showProgress = v === "progressPin" || v === "rangeSlider";
  const showSteps = v === "multiStep" || v === "dotStepper";
  const showSegmented = v === "segmented";
  const showPin = v === "progressPin";
  const showThumb = v === "rangeSlider";
  const showDots = v === "dotStepper";
  const showNodes = v === "multiStep";

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant picker ── */}
      <Section title="Variant">
        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
            }}
          >
            {ALL_VARIANTS.map((vnt) => (
              <button
                key={vnt}
                onClick={() => handleImmediate({ variant: vnt })}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor:
                    localConfig.variant === vnt
                      ? "var(--accent)"
                      : "var(--border)",
                  background:
                    localConfig.variant === vnt
                      ? "var(--accent-dim)"
                      : "transparent",
                  color:
                    localConfig.variant === vnt
                      ? "var(--accent-light)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                {VARIANT_LABELS[vnt]}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Colors ── */}
      <Section title="Colors">
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
        />
        <ColorRow
          label="Accent 2nd"
          value={localConfig.accentColorSecondary}
          onChange={(v) => handleImmediate({ accentColorSecondary: v })}
        />
        <ColorRow
          label="Track"
          value={localConfig.trackColor}
          onChange={(v) => handleImmediate({ trackColor: v })}
        />
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleImmediate({ backgroundColor: v })}
        />
        <ToggleRow
          label="Gradient"
          value={localConfig.useGradient}
          onChange={(v) => handleImmediate({ useGradient: v })}
        />
        <ToggleRow
          label="Glow"
          value={localConfig.accentGlow}
          onChange={(v) => handleImmediate({ accentGlow: v })}
        />
      </Section>

      {/* ── Track ── */}
      <Section title="Track">
        <SliderRow
          label="Track Height"
          value={localConfig.trackHeight}
          min={1}
          max={8}
          unit="px"
          onChange={(v) => handleSlider({ trackHeight: v })}
          onChangeEnd={(v) => onChange({ trackHeight: v })}
        />
      </Section>

      {/* ── Progress value ── */}
      {showProgress && (
        <Section title="Progress">
          <SliderRow
            label="Value"
            value={localConfig.progressValue}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => handleSlider({ progressValue: v })}
            onChangeEnd={(v) => onChange({ progressValue: v })}
          />
        </Section>
      )}

      {/* ── Pin (progressPin) ── */}
      {showPin && (
        <Section title="Pin">
          <ToggleRow
            label="Show Pin"
            value={localConfig.showPin}
            onChange={(v) => handleImmediate({ showPin: v })}
          />
          <ColorRow
            label="Pin Color"
            value={localConfig.pinColor}
            onChange={(v) => handleImmediate({ pinColor: v })}
          />
        </Section>
      )}

      {/* ── Thumb (rangeSlider) ── */}
      {showThumb && (
        <Section title="Thumb">
          <ColorRow
            label="Thumb Color"
            value={localConfig.thumbColor}
            onChange={(v) => handleImmediate({ thumbColor: v })}
          />
          <SliderRow
            label="Width"
            value={localConfig.thumbWidth}
            min={4}
            max={20}
            unit="px"
            onChange={(v) => handleSlider({ thumbWidth: v })}
            onChangeEnd={(v) => onChange({ thumbWidth: v })}
          />
          <SliderRow
            label="Height"
            value={localConfig.thumbHeight}
            min={16}
            max={64}
            unit="px"
            onChange={(v) => handleSlider({ thumbHeight: v })}
            onChangeEnd={(v) => onChange({ thumbHeight: v })}
          />
          <SliderRow
            label="Radius"
            value={localConfig.thumbBorderRadius}
            min={0}
            max={12}
            unit="px"
            onChange={(v) => handleSlider({ thumbBorderRadius: v })}
            onChangeEnd={(v) => onChange({ thumbBorderRadius: v })}
          />
        </Section>
      )}

      {/* ── Multi-step nodes ── */}
      {showNodes && (
        <Section title="Steps">
          <SliderRow
            label="Total Steps"
            value={localConfig.totalSteps}
            min={2}
            max={7}
            unit=""
            onChange={(v) => handleSlider({ totalSteps: v })}
            onChangeEnd={(v) => onChange({ totalSteps: v })}
          />
          <SliderRow
            label="Active Step"
            value={localConfig.activeStep}
            min={1}
            max={localConfig.totalSteps}
            unit=""
            onChange={(v) => handleSlider({ activeStep: v })}
            onChangeEnd={(v) => onChange({ activeStep: v })}
          />
          <SliderRow
            label="Node Size"
            value={localConfig.stepNodeSize}
            min={20}
            max={64}
            unit="px"
            onChange={(v) => handleSlider({ stepNodeSize: v })}
            onChangeEnd={(v) => onChange({ stepNodeSize: v })}
          />
          <SliderRow
            label="Node Radius"
            value={localConfig.stepNodeBorderRadius}
            min={0}
            max={50}
            unit="%"
            onChange={(v) => handleSlider({ stepNodeBorderRadius: v })}
            onChangeEnd={(v) => onChange({ stepNodeBorderRadius: v })}
          />
        </Section>
      )}

      {/* ── Dot stepper ── */}
      {showDots && (
        <Section title="Dots">
          <SliderRow
            label="Total Steps"
            value={localConfig.totalSteps}
            min={2}
            max={7}
            unit=""
            onChange={(v) => handleSlider({ totalSteps: v })}
            onChangeEnd={(v) => onChange({ totalSteps: v })}
          />
          <SliderRow
            label="Active Step"
            value={localConfig.activeStep}
            min={1}
            max={localConfig.totalSteps}
            unit=""
            onChange={(v) => handleSlider({ activeStep: v })}
            onChangeEnd={(v) => onChange({ activeStep: v })}
          />
          <SliderRow
            label="Active Size"
            value={localConfig.dotActiveSize}
            min={24}
            max={72}
            unit="px"
            onChange={(v) => handleSlider({ dotActiveSize: v })}
            onChangeEnd={(v) => onChange({ dotActiveSize: v })}
          />
          <SliderRow
            label="Inactive Size"
            value={localConfig.dotInactiveSize}
            min={8}
            max={32}
            unit="px"
            onChange={(v) => handleSlider({ dotInactiveSize: v })}
            onChangeEnd={(v) => onChange({ dotInactiveSize: v })}
          />
        </Section>
      )}

      {/* ── Segmented ── */}
      {showSegmented && (
        <Section title="Segments">
          <SliderRow
            label="Segment Count"
            value={localConfig.segmentCount}
            min={2}
            max={8}
            unit=""
            onChange={(v) => handleSlider({ segmentCount: v })}
            onChangeEnd={(v) => onChange({ segmentCount: v })}
          />
          <SliderRow
            label="Active Segments"
            value={localConfig.activeSegments}
            min={0}
            max={localConfig.segmentCount}
            unit=""
            onChange={(v) => handleSlider({ activeSegments: v })}
            onChangeEnd={(v) => onChange({ activeSegments: v })}
          />
        </Section>
      )}

      {/* ── Labels ── */}
      <Section title="Labels">
        <ToggleRow
          label="Show Labels"
          value={localConfig.showLabels}
          onChange={(v) => handleImmediate({ showLabels: v })}
        />
        <ColorRow
          label="Label Color"
          value={localConfig.labelColor}
          onChange={(v) => handleImmediate({ labelColor: v })}
        />
        <ColorRow
          label="Active Label"
          value={localConfig.activeLabelColor}
          onChange={(v) => handleImmediate({ activeLabelColor: v })}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={9}
          max={16}
          unit="px"
          onChange={(v) => handleSlider({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>

      {/* ── Container ── */}
      <Section title="Container">
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider({ borderRadius: v })}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <ToggleRow
          label="Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
