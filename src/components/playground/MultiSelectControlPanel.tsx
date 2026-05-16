"use client";

import styles from "./ControlPanel.module.css"; // reuse same CSS
import {
  ColorRow,
  Section,
  SliderRow,
  TextRow,
  ToggleRow,
} from "../ui/ControlHelpers";
import { MultiSelectConfig } from "@/lib/multiSelectConfig";

interface Props {
  config: MultiSelectConfig;
  onChange: (patch: Partial<MultiSelectConfig>) => void;
  onReset: () => void;
}

export function MultiSelectControlPanel({ config, onChange, onReset }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Controls</span>
        <button className={styles.resetBtn} onClick={onReset}>
          ↺ Reset
        </button>
      </div>

      <div className={styles.sections}>
        <Section title="Trigger Colors">
          <ColorRow
            label="Background"
            value={config.triggerBackground}
            onChange={(v) => onChange({ triggerBackground: v })}
          />
          <ColorRow
            label="Text"
            value={config.triggerTextColor}
            onChange={(v) => onChange({ triggerTextColor: v })}
          />
          <ColorRow
            label="Border"
            value={config.triggerBorderColor}
            onChange={(v) => onChange({ triggerBorderColor: v })}
          />
          <ColorRow
            label="Placeholder"
            value={config.placeholderColor}
            onChange={(v) => onChange({ placeholderColor: v })}
          />
          <ColorRow
            label="Accent"
            value={config.accentColor}
            onChange={(v) => onChange({ accentColor: v })}
          />
        </Section>

        <Section title="Dropdown Colors">
          <ColorRow
            label="Background"
            value={config.dropdownBackground}
            onChange={(v) => onChange({ dropdownBackground: v })}
          />
          <ColorRow
            label="Border"
            value={config.dropdownBorderColor}
            onChange={(v) => onChange({ dropdownBorderColor: v })}
          />
          <ColorRow
            label="Hover"
            value={config.optionHoverBackground}
            onChange={(v) => onChange({ optionHoverBackground: v })}
          />
          <ColorRow
            label="Selected BG"
            value={config.selectedOptionBackground}
            onChange={(v) => onChange({ selectedOptionBackground: v })}
          />
          <ColorRow
            label="Selected Text"
            value={config.selectedOptionColor}
            onChange={(v) => onChange({ selectedOptionColor: v })}
          />
        </Section>

        <Section title="Badge">
          <ColorRow
            label="Background"
            value={config.badgeBackground}
            onChange={(v) => onChange({ badgeBackground: v })}
          />
          <ColorRow
            label="Text"
            value={config.badgeTextColor}
            onChange={(v) => onChange({ badgeTextColor: v })}
          />
          <SliderRow
            label="Radius"
            value={config.badgeBorderRadius}
            min={0}
            max={20}
            unit="px"
            onChange={(v) => onChange({ badgeBorderRadius: v })}
          />
        </Section>

        <Section title="Shape & Size">
          <SliderRow
            label="Trigger Radius"
            value={config.triggerBorderRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => onChange({ triggerBorderRadius: v })}
          />
          <SliderRow
            label="Dropdown Radius"
            value={config.dropdownBorderRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => onChange({ dropdownBorderRadius: v })}
          />
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
            max={20}
            unit="px"
            onChange={(v) => onChange({ padding: v })}
          />
          <SliderRow
            label="Width"
            value={config.width}
            min={200}
            max={500}
            unit="px"
            onChange={(v) => onChange({ width: v })}
          />
          <SliderRow
            label="Max Badges"
            value={config.maxCount}
            min={1}
            max={5}
            unit=""
            onChange={(v) => onChange({ maxCount: v })}
          />
        </Section>

        <Section title="Options">
          <ToggleRow
            label="Drop Shadow"
            value={config.showShadow}
            onChange={(v) => onChange({ showShadow: v })}
          />
          <ToggleRow
            label="Open Animation"
            value={config.animateOpen}
            onChange={(v) => onChange({ animateOpen: v })}
          />
        </Section>

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
