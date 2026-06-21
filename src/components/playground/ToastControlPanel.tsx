// /components/playground/ToastControlPanel.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ToastConfig,
  ToastVariant,
  ToastPosition,
  VARIANT_META,
} from "@/lib/toastConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";
import styles from "./ControlPanel.module.css";

interface ToastControlPanelProps {
  config: ToastConfig;
  onChange: (patch: Partial<ToastConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

// ─── Shared pill button ────────────────────────────────────────────
function Pill({
  active,
  onClick,
  children,
  disabled = false,
  width,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  width?: number | string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "4px 10px",
        width,
        borderRadius: 7,
        border: "1px solid",
        borderColor: active ? "#7c6cfc" : "#2a2a38",
        background: active ? "#7c6cfc1a" : "transparent",
        color: active ? "#9d91fd" : disabled ? "#3a3a50" : "#5a5a72",
        fontSize: 11,
        fontFamily: "'DM Mono', monospace",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        letterSpacing: "0.04em",
        lineHeight: "1.6",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ─── Text input row ────────────────────────────────────────────────
function TextRow({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={styles.row} style={{ alignItems: "center", gap: 8 }}>
      <span className={styles.label}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Auto-generated" : placeholder}
        style={{
          flex: 1,
          padding: "5px 10px",
          borderRadius: 7,
          border: "1px solid",
          borderColor: disabled ? "#1f1f28" : "#2a2a38",
          background: disabled ? "#13131a" : "#1c1c22",
          color: disabled ? "#3a3a50" : "#e8e6f5",
          fontSize: 11,
          fontFamily: "'Instrument Sans', sans-serif",
          outline: "none",
          transition: "border-color 0.15s ease",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(e) => {
          if (!disabled) e.target.style.borderColor = "#7c6cfc55";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = disabled ? "#1f1f28" : "#2a2a38";
        }}
      />
    </div>
  );
}

// ─── Position picker (2×2 grid) ───────────────────────────────────
const POSITIONS: { value: ToastPosition; label: string; icon: string }[] = [
  { value: "top-left", label: "Top Left", icon: "↖" },
  { value: "top-right", label: "Top Right", icon: "↗" },
  { value: "bottom-left", label: "Bottom Left", icon: "↙" },
  { value: "bottom-right", label: "Bottom Right", icon: "↘" },
];

function PositionPicker({
  value,
  onChange,
}: {
  value: ToastPosition;
  onChange: (v: ToastPosition) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 5,
        width: "100%",
      }}
    >
      {POSITIONS.map((pos) => (
        <button
          key={pos.value}
          onClick={() => onChange(pos.value)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid",
            borderColor: value === pos.value ? "#7c6cfc" : "#2a2a38",
            background: value === pos.value ? "#7c6cfc1a" : "#161620",
            color: value === pos.value ? "#9d91fd" : "#5a5a72",
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.03em",
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>{pos.icon}</span>
          <span>{pos.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Variant pills (2 per row) ────────────────────────────────────
const VARIANTS: ToastVariant[] = [
  "success",
  "loading",
  "countdown",
  "multistep",
  "progress",
  "action",
  "gradient",
  "promise",
  "error",
  "streaming",
];

// ─── Main control panel ────────────────────────────────────────────
export function ToastControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: ToastControlPanelProps) {
  const [localRadius, setLocalRadius] = useState(config.borderRadius);
  const [localDuration, setLocalDuration] = useState(
    config.autoDismissDuration,
  );

  const debouncedOnChange = useMemo(
    () => debounce((patch: Partial<ToastConfig>) => onChange(patch), 80),
    [onChange],
  );

  // Sync on external reset
  if (
    localRadius !== config.borderRadius &&
    Math.abs(localRadius - config.borderRadius) > 5
  ) {
    setLocalRadius(config.borderRadius);
  }
  if (
    localDuration !== config.autoDismissDuration &&
    Math.abs(localDuration - config.autoDismissDuration) > 200
  ) {
    setLocalDuration(config.autoDismissDuration);
  }

  const isContentEditable = VARIANT_META[config.variant].contentEditable;

  function handleVariantChange(variant: ToastVariant) {
    const meta = VARIANT_META[variant];
    onChange({
      variant,
      // Reset content to defaults for the new variant
      title: meta.defaultTitle,
      message: meta.defaultMessage,
    });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant ── */}
      <Section title="Variant">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}
        >
          {VARIANTS.map((v) => (
            <Pill
              key={v}
              active={config.variant === v}
              onClick={() => handleVariantChange(v)}
            >
              {VARIANT_META[v].label}
            </Pill>
          ))}
        </div>

        {/* Lock notice for non-editable variants */}
        {!isContentEditable && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 7,
              background: "#1a1a24",
              border: "1px solid #2a2a38",
              marginTop: 2,
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5a5a72"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              style={{
                fontSize: 10,
                color: "#5a5a72",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              Content driven by animation logic
            </span>
          </div>
        )}
      </Section>

      {/* ── Content ── */}
      <Section title="Content">
        <TextRow
          label="Title"
          value={config.title}
          onChange={(v) => onChange({ title: v })}
          disabled={!isContentEditable}
          placeholder="Toast title"
        />
        <TextRow
          label="Message"
          value={config.message}
          onChange={(v) => onChange({ message: v })}
          disabled={!isContentEditable}
          placeholder="Toast message"
        />
        {config.variant === "action" && (
          <TextRow
            label="Action"
            value={config.actionLabel}
            onChange={(v) => onChange({ actionLabel: v })}
            placeholder="Button label"
          />
        )}
      </Section>

      {/* ── Position ── */}
      <Section title="Position">
        <div style={{ marginBottom: 2 }}>
          <PositionPicker
            value={config.position}
            onChange={(v) => onChange({ position: v })}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#3a3a50",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
            marginTop: 2,
          }}
        >
          Position applies to generated code only
        </div>
      </Section>

      {/* ── Appearance ── */}
      <Section title="Appearance">
        <ColorRow
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange({ backgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.borderColor}
          onChange={(v) => onChange({ borderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Icon"
          value={config.iconColor}
          onChange={(v) => onChange({ iconColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Title"
          value={config.titleColor}
          onChange={(v) => onChange({ titleColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Message"
          value={config.messageColor}
          onChange={(v) => onChange({ messageColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Radius"
          value={localRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => {
            setLocalRadius(v);
            debouncedOnChange({ borderRadius: v });
          }}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
      </Section>

      {/* ── Behavior ── */}
      <Section title="Behavior">
        <ToggleRow
          label="Progress Bar"
          value={config.showProgressBar}
          onChange={(v) => onChange({ showProgressBar: v })}
        />
        <ToggleRow
          label="Close Button"
          value={config.showCloseButton}
          onChange={(v) => onChange({ showCloseButton: v })}
        />
        <SliderRow
          label="Auto-dismiss"
          value={localDuration}
          min={1000}
          max={8000}
          //   step={500}
          unit="ms"
          onChange={(v) => {
            setLocalDuration(v);
            debouncedOnChange({ autoDismissDuration: v });
          }}
          onChangeEnd={(v) => onChange({ autoDismissDuration: v })}
        />
        <div
          style={{
            fontSize: 10,
            color: "#3a3a50",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          Auto-dismiss applies to generated code only
        </div>
      </Section>
    </ControlPanelShell>
  );
}
