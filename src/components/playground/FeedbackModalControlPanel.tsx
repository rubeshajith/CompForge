"use client";

import { useMemo } from "react";
import { FeedbackModalConfig } from "@/lib/feedbackModalConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface FeedbackModalControlPanelProps {
  config: FeedbackModalConfig;
  onChange: (patch: Partial<FeedbackModalConfig>) => void;
  onReset: () => void;
}

export function FeedbackModalControlPanel({
  config,
  onChange,
  onReset,
}: FeedbackModalControlPanelProps) {
  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  return (
    <ControlPanelShell onReset={onReset}>
      {/* Layout */}
      <Section title="Layout">
        <SliderRow
          label="Modal Width"
          value={config.modalWidth}
          min={360}
          max={680}
          unit="px"
          onChange={(v) => debouncedOnChange({ modalWidth: v })}
          onChangeEnd={(v) => onChange({ modalWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={config.modalBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => debouncedOnChange({ modalBorderRadius: v })}
          onChangeEnd={(v) => onChange({ modalBorderRadius: v })}
        />
        <SliderRow
          label="Font Size"
          value={config.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => debouncedOnChange({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
        <ToggleRow
          label="Show Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
        <ToggleRow
          label="Animate Open"
          value={config.animateOpen}
          onChange={(v) => onChange({ animateOpen: v })}
        />
      </Section>

      {/* Modal Colors */}
      <Section title="Modal">
        <ColorRow
          label="Background"
          value={config.modalBackground}
          onChange={(v) => onChange({ modalBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.modalBorderColor}
          onChange={(v) => onChange({ modalBorderColor: v })}
        />
        <ColorRow
          label="Backdrop"
          value={config.backdropColor}
          onChange={(v) => onChange({ backdropColor: v })}
        />
      </Section>

      {/* Header */}
      <Section title="Header">
        <ColorRow
          label="Background"
          value={config.headerBackground}
          onChange={(v) => onChange({ headerBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.headerBorderColor}
          onChange={(v) => onChange({ headerBorderColor: v })}
        />
        <ColorRow
          label="Icon Color"
          value={config.headerIconColor}
          onChange={(v) => onChange({ headerIconColor: v })}
        />
        <ColorRow
          label="Title Text"
          value={config.headerTextColor}
          onChange={(v) => onChange({ headerTextColor: v })}
        />
        <ColorRow
          label="Close Button"
          value={config.closeButtonColor}
          onChange={(v) => onChange({ closeButtonColor: v })}
        />
        <ColorRow
          label="Close Hover BG"
          value={config.closeButtonHoverBackground}
          onChange={(v) => onChange({ closeButtonHoverBackground: v })}
        />
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <ColorRow
          label="Label Color"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
        />
        <ColorRow
          label="Input Background"
          value={config.inputBackground}
          onChange={(v) => onChange({ inputBackground: v })}
        />
        <ColorRow
          label="Input Border"
          value={config.inputBorderColor}
          onChange={(v) => onChange({ inputBorderColor: v })}
        />
        <ColorRow
          label="Focus Border"
          value={config.inputFocusBorderColor}
          onChange={(v) => onChange({ inputFocusBorderColor: v })}
        />
        <ColorRow
          label="Input Text"
          value={config.inputTextColor}
          onChange={(v) => onChange({ inputTextColor: v })}
        />
        <ColorRow
          label="Placeholder"
          value={config.inputPlaceholderColor}
          onChange={(v) => onChange({ inputPlaceholderColor: v })}
        />
        <SliderRow
          label="Input Radius"
          value={config.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => debouncedOnChange({ inputBorderRadius: v })}
          onChangeEnd={(v) => onChange({ inputBorderRadius: v })}
        />
      </Section>

      {/* Stars */}
      <Section title="Star Rating">
        <ColorRow
          label="Empty Star"
          value={config.starEmptyColor}
          onChange={(v) => onChange({ starEmptyColor: v })}
        />
        <ColorRow
          label="Filled Star"
          value={config.starFilledColor}
          onChange={(v) => onChange({ starFilledColor: v })}
        />
        <ColorRow
          label="Hover Star"
          value={config.starHoverColor}
          onChange={(v) => onChange({ starHoverColor: v })}
        />
        <SliderRow
          label="Star Size"
          value={config.starSize}
          min={20}
          max={48}
          unit="px"
          onChange={(v) => debouncedOnChange({ starSize: v })}
          onChangeEnd={(v) => onChange({ starSize: v })}
        />
      </Section>

      {/* Attachments */}
      <Section title="Attachments">
        <ColorRow
          label="Button Background"
          value={config.attachButtonBackground}
          onChange={(v) => onChange({ attachButtonBackground: v })}
        />
        <ColorRow
          label="Button Border"
          value={config.attachButtonBorderColor}
          onChange={(v) => onChange({ attachButtonBorderColor: v })}
        />
        <ColorRow
          label="Button Text"
          value={config.attachButtonTextColor}
          onChange={(v) => onChange({ attachButtonTextColor: v })}
        />
        <ColorRow
          label="Thumbnail Border"
          value={config.thumbnailBorderColor}
          onChange={(v) => onChange({ thumbnailBorderColor: v })}
        />
        <ColorRow
          label="Remove Button"
          value={config.removeBtnBackground}
          onChange={(v) => onChange({ removeBtnBackground: v })}
        />
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <ColorRow
          label="Footer Background"
          value={config.footerBackground}
          onChange={(v) => onChange({ footerBackground: v })}
        />
        <ColorRow
          label="Footer Border"
          value={config.footerBorderColor}
          onChange={(v) => onChange({ footerBorderColor: v })}
        />
        <ColorRow
          label="Badge Background"
          value={config.badgeBackground}
          onChange={(v) => onChange({ badgeBackground: v })}
        />
        <ColorRow
          label="Badge Text"
          value={config.badgeTextColor}
          onChange={(v) => onChange({ badgeTextColor: v })}
        />
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <ColorRow
          label="Cancel Text"
          value={config.cancelTextColor}
          onChange={(v) => onChange({ cancelTextColor: v })}
        />
        <ColorRow
          label="Cancel Hover BG"
          value={config.cancelHoverBackground}
          onChange={(v) => onChange({ cancelHoverBackground: v })}
        />
        <ColorRow
          label="Submit Background"
          value={config.submitBackground}
          onChange={(v) => onChange({ submitBackground: v })}
        />
        <ColorRow
          label="Submit Text"
          value={config.submitTextColor}
          onChange={(v) => onChange({ submitTextColor: v })}
        />
        <ColorRow
          label="Submit Hover"
          value={config.submitHoverBackground}
          onChange={(v) => onChange({ submitHoverBackground: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
