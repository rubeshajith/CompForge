"use client";

// /components/playground/StepperControlPanel.tsx

import { useMemo, useState } from "react";
import {
  StepperConfig,
  StepperVariant,
  VARIANT_LABELS,
} from "@/lib/stepper2Config";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/CodePanel.module.css";

interface StepperControlPanelProps {
  config: StepperConfig;
  onChange: (patch: Partial<StepperConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const ALL_VARIANTS: StepperVariant[] = [
  "segmented-pill",
  "breadcrumb-gray",
  "breadcrumb-colorful",
  "numbered-line",
  "checkmark-horizontal",
  "chevron-loading",
  "dot-loading",
  "sharp-chevron",
  "dashed-confirmation",
];

export function StepperControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: StepperControlPanelProps) {
  const [local, setLocal] = useState(config);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof StepperConfig, value: number) {
    setLocal((p) => ({ ...p, [key]: value }));
    debouncedOnChange({ [key]: value });
  }

  function handleImmediate<K extends keyof StepperConfig>(
    key: K,
    value: StepperConfig[K],
  ) {
    setLocal((p) => ({ ...p, [key]: value }));
    onChange({ [key]: value });
  }

  // Which config fields matter per variant
  const v = config.variant;
  const isLoading = v === "chevron-loading" || v === "dot-loading";
  const isLine =
    v === "numbered-line" ||
    v === "checkmark-horizontal" ||
    v === "dashed-confirmation";
  const isBreadcrumb =
    v === "breadcrumb-gray" ||
    v === "breadcrumb-colorful" ||
    v === "sharp-chevron";
  const showStepColors =
    v !== "breadcrumb-gray" &&
    v !== "dashed-confirmation" &&
    v !== "checkmark-horizontal";
  const showActiveStep =
    !v.includes("segmented") && !v.includes("colorful") && !v.includes("sharp");

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Variant selector */}
      <Section title="Variant">
        <div className={styles.row}>
          <span className={styles.label}>Style</span>
          <select
            value={config.variant}
            onChange={(e) =>
              handleImmediate("variant", e.target.value as StepperVariant)
            }
            style={{
              flex: 1,
              background: "var(--bg-4)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              padding: "4px 8px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {ALL_VARIANTS.map((v) => (
              <option key={v} value={v}>
                {VARIANT_LABELS[v]}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* Steps */}
      <Section title="Steps">
        <SliderRow
          label="Total Steps"
          value={local.totalSteps}
          min={2}
          max={4}
          unit=""
          onChange={(v) => handleSlider("totalSteps", v)}
          onChangeEnd={(v) => onChange({ totalSteps: v })}
        />
        {showActiveStep && (
          <SliderRow
            label="Active Step"
            value={local.activeStep}
            min={1}
            unit=""
            max={config.totalSteps}
            onChange={(v) => handleSlider("activeStep", v)}
            onChangeEnd={(v) => onChange({ activeStep: v })}
          />
        )}
        {/* Step labels */}
        {(["step1Label", "step2Label", "step3Label", "step4Label"] as const)
          .slice(0, config.totalSteps)
          .map((key, i) => (
            <div key={key} className={styles.row}>
              <span className={styles.label}>Step {i + 1} Label</span>
              <input
                type="text"
                value={local[key] as string}
                maxLength={10}
                onChange={(e) => handleImmediate(key, e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--bg-4)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  padding: "4px 8px",
                  fontSize: 12,
                }}
              />
            </div>
          ))}
      </Section>

      {/* Colors */}
      {showStepColors && (
        <Section title="Step Colors">
          <ColorRow
            label="Color 1"
            value={local.color1}
            onChange={(v) => handleImmediate("color1", v)}
            isDark={isDark}
/>
          <ColorRow
            label="Color 2"
            value={local.color2}
            onChange={(v) => handleImmediate("color2", v)}
            isDark={isDark}
/>
          <ColorRow
            label="Color 3"
            value={local.color3}
            onChange={(v) => handleImmediate("color3", v)}
            isDark={isDark}
/>
          {config.totalSteps >= 4 && (
            <ColorRow
              label="Color 4"
              value={local.color4}
              onChange={(v) => handleImmediate("color4", v)}
              isDark={isDark}
/>
          )}
        </Section>
      )}

      {(isLine || v === "breadcrumb-gray") && (
        <Section title="State Colors">
          <ColorRow
            label="Active"
            value={local.activeColor}
            onChange={(v) => handleImmediate("activeColor", v)}
            isDark={isDark}
/>
          <ColorRow
            label="Completed"
            value={local.completedColor}
            onChange={(v) => handleImmediate("completedColor", v)}
            isDark={isDark}
/>
          <ColorRow
            label="Inactive"
            value={local.inactiveColor}
            onChange={(v) => handleImmediate("inactiveColor", v)}
            isDark={isDark}
/>
          <ColorRow
            label="Inactive Text"
            value={local.inactiveTextColor}
            onChange={(v) => handleImmediate("inactiveTextColor", v)}
            isDark={isDark}
/>
        </Section>
      )}

      {/* Text colors */}
      <Section title="Text">
        <ColorRow
          label="Step Text"
          value={local.stepTextColor}
          onChange={(v) => handleImmediate("stepTextColor", v)}
          isDark={isDark}
/>
        {isLine && (
          <ColorRow
            label="Labels"
            value={local.labelColor}
            onChange={(v) => handleImmediate("labelColor", v)}
            isDark={isDark}
/>
        )}
      </Section>

      {/* Size */}
      <Section title="Size">
        <SliderRow
          label="Height"
          value={local.height}
          min={28}
          max={60}
          unit="px"
          onChange={(v) => handleSlider("height", v)}
          onChangeEnd={(v) => onChange({ height: v })}
        />
        <SliderRow
          label="Font Size"
          value={local.fontSize}
          min={8}
          max={14}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
        {(v === "segmented-pill" || v === "breadcrumb-colorful") && (
          <SliderRow
            label="Border Radius"
            value={local.borderRadius}
            min={0}
            max={99}
            unit="px"
            onChange={(v) => handleSlider("borderRadius", v)}
            onChangeEnd={(v) => onChange({ borderRadius: v })}
          />
        )}
        {isLine && (
          <SliderRow
            label="Connector Height"
            value={local.connectorHeight}
            min={1}
            max={6}
            unit="px"
            onChange={(v) => handleSlider("connectorHeight", v)}
            onChangeEnd={(v) => onChange({ connectorHeight: v })}
          />
        )}
      </Section>

      {/* Options */}
      <Section title="Options">
        {isLine && (
          <ToggleRow
            label="Show Labels"
            value={local.showLabels}
            onChange={(v) => handleImmediate("showLabels", v)}
          />
        )}
        {(v === "numbered-line" ||
          v === "segmented-pill" ||
          v === "sharp-chevron") && (
          <ToggleRow
            label="Show Numbers"
            value={local.showNumbers}
            onChange={(v) => handleImmediate("showNumbers", v)}
          />
        )}
        {(v === "checkmark-horizontal" || v === "dashed-confirmation") && (
          <ToggleRow
            label="Show Checkmarks"
            value={local.showCheckmarks}
            onChange={(v) => handleImmediate("showCheckmarks", v)}
          />
        )}
        {v === "dot-loading" && (
          <ToggleRow
            label="Animate Dots"
            value={local.animateDots}
            onChange={(v) => handleImmediate("animateDots", v)}
          />
        )}
      </Section>
    </ControlPanelShell>
  );
}
