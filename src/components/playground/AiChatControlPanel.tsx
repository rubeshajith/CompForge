"use client";

// /components/playground/AIChatControlPanel.tsx

import { useState, useMemo } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { AIChatConfig, BubbleStyle, TypingStyle } from "@/lib/aiChatConfig";
import { debounce } from "@/utils/debounce";
import styles from "@/components/playground/ControlPanel.module.css";

interface AIChatControlPanelProps {
  config: AIChatConfig;
  onChange: (patch: Partial<AIChatConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function AIChatControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: AIChatControlPanelProps) {
  const [localConfig, setLocalConfig] = useState<AIChatConfig>(config);

  // Sync when config changes from outside (e.g. mode toggle)
  if (
    localConfig.containerBackground !== config.containerBackground ||
    localConfig.accentColor !== config.accentColor
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<AIChatConfig>) => onChange(patch), 80),
    [onChange],
  );

  function handleSlider<K extends keyof AIChatConfig>(
    key: K,
    value: AIChatConfig[K],
  ) {
    const patch = { [key]: value } as Partial<AIChatConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate<K extends keyof AIChatConfig>(
    key: K,
    value: AIChatConfig[K],
  ) {
    const patch = { [key]: value } as Partial<AIChatConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ── */}
      <Section title="Container">
        <SliderRow
          label="Width"
          value={localConfig.containerWidth}
          min={300}
          max={560}
          unit="px"
          onChange={(v) => handleSlider("containerWidth", v)}
          onChangeEnd={(v) => onChange({ containerWidth: v })}
        />
        <SliderRow
          label="Height"
          value={localConfig.containerHeight}
          min={400}
          max={800}
          unit="px"
          onChange={(v) => handleSlider("containerHeight", v)}
          onChangeEnd={(v) => onChange({ containerHeight: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.containerBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider("containerBorderRadius", v)}
          onChangeEnd={(v) => onChange({ containerBorderRadius: v })}
        />
        <ColorRow
          label="Background"
          value={localConfig.containerBackground}
          onChange={(v) => handleImmediate("containerBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.containerBorderColor}
          onChange={(v) => handleImmediate("containerBorderColor", v)}
          isDark={isDark}
/>
        <ToggleRow
          label="Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate("showShadow", v)}
        />
      </Section>

      {/* ── Header ── */}
      <Section title="Header">
        <ColorRow
          label="Background"
          value={localConfig.headerBackground}
          onChange={(v) => handleImmediate("headerBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text Color"
          value={localConfig.headerTextColor}
          onChange={(v) => handleImmediate("headerTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.headerBorderColor}
          onChange={(v) => handleImmediate("headerBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Avatar BG"
          value={localConfig.avatarBackground}
          onChange={(v) => handleImmediate("avatarBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Avatar Icon"
          value={localConfig.avatarColor}
          onChange={(v) => handleImmediate("avatarColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Status Dot"
          value={localConfig.statusDotColor}
          onChange={(v) => handleImmediate("statusDotColor", v)}
          isDark={isDark}
/>
      </Section>

      {/* ── Chat Bubbles ── */}
      <Section title="Chat Bubbles">
        {/* Bubble style selector */}
        <div className={styles.row}>
          <span className={styles.label}>Bubble Style</span>
          <select
            value={localConfig.bubbleStyle}
            onChange={(e) =>
              handleImmediate("bubbleStyle", e.target.value as BubbleStyle)
            }
            style={{
              background: "#1c1c22",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "4px 8px",
              fontFamily: "'DM Mono', monospace",
              cursor: "pointer",
            }}
          >
            <option value="rounded">Rounded</option>
            <option value="pill">Pill</option>
            <option value="sharp">Sharp</option>
          </select>
        </div>

        <SliderRow
          label="Bubble Radius"
          value={localConfig.aiBubbleBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => {
            handleSlider("aiBubbleBorderRadius", v);
            handleSlider("userBubbleBorderRadius", v);
          }}
          onChangeEnd={(v) =>
            onChange({ aiBubbleBorderRadius: v, userBubbleBorderRadius: v })
          }
        />
        <SliderRow
          label="Font Size"
          value={localConfig.messageFontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("messageFontSize", v)}
          onChangeEnd={(v) => onChange({ messageFontSize: v })}
        />

        {/* User bubble */}
        <ColorRow
          label="User BG"
          value={localConfig.userBubbleBackground}
          onChange={(v) => handleImmediate("userBubbleBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="User Text"
          value={localConfig.userBubbleTextColor}
          onChange={(v) => handleImmediate("userBubbleTextColor", v)}
          isDark={isDark}
/>

        {/* AI bubble */}
        <ColorRow
          label="AI BG"
          value={localConfig.aiBubbleBackground}
          onChange={(v) => handleImmediate("aiBubbleBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="AI Text"
          value={localConfig.aiBubbleTextColor}
          onChange={(v) => handleImmediate("aiBubbleTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="AI Border"
          value={localConfig.aiBubbleBorderColor}
          onChange={(v) => handleImmediate("aiBubbleBorderColor", v)}
          isDark={isDark}
/>

        <ToggleRow
          label="Timestamps"
          value={localConfig.showTimestamps}
          onChange={(v) => handleImmediate("showTimestamps", v)}
        />
        <ToggleRow
          label="Animate"
          value={localConfig.animateMessages}
          onChange={(v) => handleImmediate("animateMessages", v)}
        />
      </Section>

      {/* ── Typing Indicator ── */}
      <Section title="Typing Indicator">
        <div className={styles.row}>
          <span className={styles.label}>Style</span>
          <select
            value={localConfig.typingStyle}
            onChange={(e) =>
              handleImmediate("typingStyle", e.target.value as TypingStyle)
            }
            style={{
              background: "#1c1c22",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "4px 8px",
              fontFamily: "'DM Mono', monospace",
              cursor: "pointer",
            }}
          >
            <option value="dots">Dots</option>
            <option value="pulse">Pulse</option>
            <option value="bar">Bar Wave</option>
          </select>
        </div>
        <ColorRow
          label="Dot Color"
          value={localConfig.typingDotColor}
          onChange={(v) => handleImmediate("typingDotColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Background"
          value={localConfig.typingBackground}
          onChange={(v) => handleImmediate("typingBackground", v)}
          isDark={isDark}
/>
      </Section>

      {/* ── Streaming ── */}
      <Section title="Streaming Text">
        <ColorRow
          label="Text Color"
          value={localConfig.streamingTextColor}
          onChange={(v) => handleImmediate("streamingTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Cursor"
          value={localConfig.streamingCursorColor}
          onChange={(v) => handleImmediate("streamingCursorColor", v)}
          isDark={isDark}
/>
      </Section>

      {/* ── Response Card ── */}
      <Section title="Response Card">
        <ColorRow
          label="Background"
          value={localConfig.cardBackground}
          onChange={(v) => handleImmediate("cardBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.cardBorderColor}
          onChange={(v) => handleImmediate("cardBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Bar"
          value={localConfig.cardAccentColor}
          onChange={(v) => handleImmediate("cardAccentColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={localConfig.cardTextColor}
          onChange={(v) => handleImmediate("cardTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Label"
          value={localConfig.cardLabelColor}
          onChange={(v) => handleImmediate("cardLabelColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Border Radius"
          value={localConfig.cardBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("cardBorderRadius", v)}
          onChangeEnd={(v) => onChange({ cardBorderRadius: v })}
        />
      </Section>

      {/* ── Prompt Suggestions ── */}
      <Section title="Prompt Suggestions">
        <ColorRow
          label="Background"
          value={localConfig.suggestionBackground}
          onChange={(v) => handleImmediate("suggestionBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.suggestionBorderColor}
          onChange={(v) => handleImmediate("suggestionBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={localConfig.suggestionTextColor}
          onChange={(v) => handleImmediate("suggestionTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Hover BG"
          value={localConfig.suggestionHoverBackground}
          onChange={(v) => handleImmediate("suggestionHoverBackground", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Pill Radius"
          value={localConfig.suggestionBorderRadius}
          min={4}
          max={999}
          unit="px"
          onChange={(v) => handleSlider("suggestionBorderRadius", v)}
          onChangeEnd={(v) => onChange({ suggestionBorderRadius: v })}
        />
      </Section>

      {/* ── Input Area ── */}
      <Section title="Input Area">
        <ColorRow
          label="Background"
          value={localConfig.inputBackground}
          onChange={(v) => handleImmediate("inputBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.inputBorderColor}
          onChange={(v) => handleImmediate("inputBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={localConfig.inputTextColor}
          onChange={(v) => handleImmediate("inputTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Placeholder"
          value={localConfig.inputPlaceholderColor}
          onChange={(v) => handleImmediate("inputPlaceholderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Send Button"
          value={localConfig.sendButtonBackground}
          onChange={(v) => handleImmediate("sendButtonBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Send Icon"
          value={localConfig.sendButtonColor}
          onChange={(v) => handleImmediate("sendButtonColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Send Radius"
          value={localConfig.sendButtonBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("sendButtonBorderRadius", v)}
          onChangeEnd={(v) => onChange({ sendButtonBorderRadius: v })}
        />
      </Section>

      {/* ── Global ── */}
      <Section title="Global">
        <ColorRow
          label="Accent"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate("accentColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="UI Font Size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
