"use client";

import { useMemo } from "react";
import {
  StepperConfig,
  StepperVariant,
  VARIANT_LABELS,
} from "@/lib/stepper1Config";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/CodePanel.module.css";

interface Props {
  config: StepperConfig;
  onChange: (patch: Partial<StepperConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const VARIANTS: StepperVariant[] = [
  "segmented-loading",
  "slider-tooltip",
  "multi-point-slider",
  "gradient-progress",
  "stepper-dots",
  "status-stepper",
  "color-segments",
  "completeness",
  "verification",
];

// Variants that use fillPercent
const HAS_FILL: StepperVariant[] = [
  "slider-tooltip",
  "gradient-progress",
  "completeness",
  "verification",
];

// Variants that use step dots / active step
const HAS_STEPS: StepperVariant[] = [
  "stepper-dots",
  "status-stepper",
  "verification",
];

// Variants with tooltip
const HAS_TOOLTIP: StepperVariant[] = ["slider-tooltip", "completeness"];

// Variants with stripes
const HAS_STRIPES: StepperVariant[] = ["completeness", "verification"];

export function StepperControlPanel({ config, onChange, onReset }: Props) {
  const debouncedChange = useMemo(() => debounce(onChange, 80), [onChange]);

  const v = config.variant;
  const hasSteps = HAS_STEPS.includes(v);
  const hasFill = HAS_FILL.includes(v);
  const hasTooltip = HAS_TOOLTIP.includes(v);
  const hasStripes = HAS_STRIPES.includes(v);
  const isSegmented = v === "segmented-loading";
  const isMultiPoint = v === "multi-point-slider";
  const isColorSeg = v === "color-segments";
  const isSlider = v === "slider-tooltip" || v === "multi-point-slider";

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Picker ── */}
      <Section title="Variant">
        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <select
            value={v}
            onChange={(e) =>
              onChange({ variant: e.target.value as StepperVariant })
            }
            style={{
              flex: 1,
              background: "var(--bg-3)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "4px 8px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            {VARIANTS.map((vnt) => (
              <option key={vnt} value={vnt}>
                {VARIANT_LABELS[vnt]}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* ── Track ── */}
      <Section title="Track">
        <ColorRow
          label="Track Color"
          value={config.trackColor}
          onChange={(v) => onChange({ trackColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Track Height"
          value={config.trackHeight}
          min={1}
          max={12}
          unit="px"
          onChange={(v) => debouncedChange({ trackHeight: v })}
          onChangeEnd={(v) => onChange({ trackHeight: v })}
        />
        <SliderRow
          label="Border Radius"
          value={config.borderRadius}
          min={0}
          max={99}
          unit="px"
          onChange={(v) => debouncedChange({ borderRadius: v })}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
      </Section>

      {/* ── Progress / Fill ── */}
      {(hasFill || isMultiPoint) && (
        <Section title="Progress">
          <ColorRow
            label="Accent"
            value={config.accentColor}
            onChange={(v) => onChange({ accentColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Accent 2"
            value={config.accentColorSecondary}
            onChange={(v) => onChange({ accentColorSecondary: v })}
            isDark={isDark}
/>
          {hasFill && (
            <SliderRow
              label="Fill %"
              value={config.fillPercent}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => debouncedChange({ fillPercent: v })}
              onChangeEnd={(v) => onChange({ fillPercent: v })}
            />
          )}
        </Section>
      )}

      {/* ── Segmented Loading ── */}
      {isSegmented && (
        <Section title="Segments">
          <ColorRow
            label="Color 1"
            value={config.accentColor}
            onChange={(v) => onChange({ accentColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Color 2"
            value={config.accentColorSecondary}
            onChange={(v) => onChange({ accentColorSecondary: v })}
            isDark={isDark}
/>
          <SliderRow
            label="Fill %"
            value={config.fillPercent}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => debouncedChange({ fillPercent: v })}
            onChangeEnd={(v) => onChange({ fillPercent: v })}
          />
          <SliderRow
            label="Segment Count"
            value={config.segmentCount}
            min={4}
            max={12}
            unit=""
            onChange={(v) => debouncedChange({ segmentCount: Math.round(v) })}
            onChangeEnd={(v) => onChange({ segmentCount: Math.round(v) })}
          />
          <SliderRow
            label="Segment Width"
            value={config.segmentWidth}
            min={12}
            max={60}
            unit="px"
            onChange={(v) => debouncedChange({ segmentWidth: v })}
            onChangeEnd={(v) => onChange({ segmentWidth: v })}
          />
          <SliderRow
            label="Gap"
            value={config.segmentGap}
            min={1}
            max={8}
            unit="px"
            onChange={(v) => debouncedChange({ segmentGap: v })}
            onChangeEnd={(v) => onChange({ segmentGap: v })}
          />
        </Section>
      )}

      {/* ── Multi-point colors ── */}
      {isMultiPoint && (
        <Section title="Point Colors">
          <ColorRow
            label="Point 1"
            value={config.point1Color}
            onChange={(v) => onChange({ point1Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Point 2"
            value={config.point2Color}
            onChange={(v) => onChange({ point2Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Point 3"
            value={config.point3Color}
            onChange={(v) => onChange({ point3Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Point 4"
            value={config.point4Color}
            onChange={(v) => onChange({ point4Color: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {/* ── Slider Thumb ── */}
      {isSlider && (
        <Section title="Thumb">
          <ColorRow
            label="Thumb Bg"
            value={config.thumbBackground}
            onChange={(v) => onChange({ thumbBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Thumb Border"
            value={config.thumbBorderColor}
            onChange={(v) => onChange({ thumbBorderColor: v })}
            isDark={isDark}
/>
          <SliderRow
            label="Thumb Size"
            value={config.thumbSize}
            min={8}
            max={28}
            unit="px"
            onChange={(v) => debouncedChange({ thumbSize: v })}
            onChangeEnd={(v) => onChange({ thumbSize: v })}
          />
        </Section>
      )}

      {/* ── Tooltip ── */}
      {hasTooltip && (
        <Section title="Tooltip">
          <ToggleRow
            label="Show Tooltip"
            value={config.showTooltip}
            onChange={(v) => onChange({ showTooltip: v })}
          />
          <ColorRow
            label="Tooltip Bg"
            value={config.tooltipBackground}
            onChange={(v) => onChange({ tooltipBackground: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Tooltip Text"
            value={config.tooltipTextColor}
            onChange={(v) => onChange({ tooltipTextColor: v })}
            isDark={isDark}
/>
          <SliderRow
            label="Radius"
            value={config.tooltipBorderRadius}
            min={0}
            max={12}
            unit="px"
            onChange={(v) => debouncedChange({ tooltipBorderRadius: v })}
            onChangeEnd={(v) => onChange({ tooltipBorderRadius: v })}
          />
        </Section>
      )}

      {/* ── Stepper Steps ── */}
      {hasSteps && (
        <Section title="Steps">
          <SliderRow
            label="Step Count"
            value={config.stepCount}
            min={2}
            max={6}
            unit=""
            onChange={(v) => debouncedChange({ stepCount: Math.round(v) })}
            onChangeEnd={(v) => onChange({ stepCount: Math.round(v) })}
          />
          <SliderRow
            label="Active Step"
            value={config.activeStep}
            min={1}
            max={config.stepCount}
            unit=""
            onChange={(v) => debouncedChange({ activeStep: Math.round(v) })}
            onChangeEnd={(v) => onChange({ activeStep: Math.round(v) })}
          />
          <SliderRow
            label="Dot Size"
            value={config.stepDotSize}
            min={8}
            max={24}
            unit="px"
            onChange={(v) => debouncedChange({ stepDotSize: v })}
            onChangeEnd={(v) => onChange({ stepDotSize: v })}
          />
          <ToggleRow
            label="Show Labels"
            value={config.showStepLabels}
            onChange={(v) => onChange({ showStepLabels: v })}
          />
          <ColorRow
            label="Active"
            value={config.stepActiveColor}
            onChange={(v) => onChange({ stepActiveColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Complete"
            value={config.stepCompleteColor}
            onChange={(v) => onChange({ stepCompleteColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Inactive"
            value={config.stepInactiveColor}
            onChange={(v) => onChange({ stepInactiveColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Label"
            value={config.stepLabelColor}
            onChange={(v) => onChange({ stepLabelColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Connector"
            value={config.stepConnectorColor}
            onChange={(v) => onChange({ stepConnectorColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {/* ── Color Segments (checkout) ── */}
      {isColorSeg && (
        <Section title="Segment Colors">
          <ColorRow
            label="Cart"
            value={config.seg1Color}
            onChange={(v) => onChange({ seg1Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Shipping"
            value={config.seg2Color}
            onChange={(v) => onChange({ seg2Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Review"
            value={config.seg3Color}
            onChange={(v) => onChange({ seg3Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Payment"
            value={config.seg4Color}
            onChange={(v) => onChange({ seg4Color: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Label Color"
            value={config.segLabelColor}
            onChange={(v) => onChange({ segLabelColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {/* ── Stripes ── */}
      {hasStripes && (
        <Section title="Stripes">
          <ToggleRow
            label="Show Stripes"
            value={config.showStripes}
            onChange={(v) => onChange({ showStripes: v })}
          />
          <ColorRow
            label="Stripe Color"
            value={config.stripeColor}
            onChange={(v) => onChange({ stripeColor: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {/* ── Verification nodes ── */}
      {v === "verification" && (
        <Section title="Nodes">
          <ColorRow
            label="Node Border"
            value={config.verificationNodeBorderColor}
            onChange={(v) => onChange({ verificationNodeBorderColor: v })}
            isDark={isDark}
/>
          <ColorRow
            label="Node Bg"
            value={config.verificationNodeBackground}
            onChange={(v) => onChange({ verificationNodeBackground: v })}
            isDark={isDark}
/>
        </Section>
      )}

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={config.fontSize}
          min={8}
          max={14}
          unit="px"
          onChange={(v) => debouncedChange({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
        <ColorRow
          label="Label Color"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
          isDark={isDark}
/>
      </Section>
    </ControlPanelShell>
  );
}
