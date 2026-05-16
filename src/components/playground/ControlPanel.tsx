"use client";

import { DropdownConfig } from "@/lib/dropdownConfig";
import styles from "./ControlPanel.module.css";
import {
  ColorRow,
  Section,
  SliderRow,
  TextRow,
  ToggleRow,
} from "../ui/ControlHelpers";
import { useState } from "react";

interface Props {
  config: DropdownConfig;
  onChange: (patch: Partial<DropdownConfig>) => void;
  onReset: () => void;
}

export function ControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Controls</span>
        <button className={styles.resetBtn} onClick={onReset}>
          ↺ Reset
        </button>
      </div>

      <div className={styles.sections}>
        {/* COLORS */}
        <Section title="Colors">
          <ColorRow
            label="Background"
            value={config.backgroundColor}
            onChange={(v) => onChange({ backgroundColor: v })}
          />
          <ColorRow
            label="Text"
            value={config.textColor}
            onChange={(v) => onChange({ textColor: v })}
          />
          <ColorRow
            label="Border"
            value={config.borderColor}
            onChange={(v) => onChange({ borderColor: v })}
          />
          <ColorRow
            label="Accent"
            value={config.accentColor}
            onChange={(v) => onChange({ accentColor: v })}
          />
          <ColorRow
            label="Placeholder"
            value={config.placeholderColor}
            onChange={(v) => onChange({ placeholderColor: v })}
          />
        </Section>

        {/* SHAPE */}
        <Section title="Shape">
          <SliderRow
            label="Border Radius"
            value={config.borderRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => onChange({ borderRadius: v })}
          />
          <SliderRow
            label="Border Width"
            value={config.borderWidth}
            min={0}
            max={4}
            unit="px"
            onChange={(v) => onChange({ borderWidth: v })}
          />
        </Section>

        {/* SIZE */}
        <Section title="Size & Spacing">
          <SliderRow
            label="Font Size"
            value={config.fontSize}
            min={11}
            max={20}
            unit="px"
            onChange={(v) => onChange({ fontSize: v })}
          />
          <SliderRow
            label="Padding"
            value={config.padding}
            min={6}
            max={24}
            unit="px"
            onChange={(v) => onChange({ padding: v })}
          />
          <SliderRow
            label="Width"
            value={config.width}
            min={160}
            max={480}
            unit="px"
            onChange={(v) => onChange({ width: v })}
          />
        </Section>

        {/* TOGGLES */}
        <Section title="Options">
          <ToggleRow
            label="Drop Shadow"
            value={config.showShadow}
            onChange={(v) => onChange({ showShadow: v })}
          />
          <ToggleRow
            label="Arrow Icon"
            value={config.showArrowIcon}
            onChange={(v) => onChange({ showArrowIcon: v })}
          />
          <ToggleRow
            label="Open Animation"
            value={config.animateOpen}
            onChange={(v) => onChange({ animateOpen: v })}
          />
        </Section>

        {/* TEXT */}
        <Section title="Content">
          <TextRow
            label="Placeholder"
            value={config.placeholder}
            onChange={(v) => onChange({ placeholder: v })}
          />
        </Section>
      </div>
    </div>
  );
}
