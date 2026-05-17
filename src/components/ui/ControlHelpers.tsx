"use client";

import styles from "./ControlHelpers.module.css";
import { useRef, useState, useEffect, useCallback } from "react";
// ── Section wrapper ──────────────────────────────────────────────────────────
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <span className={styles.sectionTitle}>{title}</span>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

// ── Color picker row ─────────────────────────────────────────────────────────
// ─── ColorRow ────────────────────────────────────────────────────────────────
// Drop-in replacement for the old <input type="color"> ColorRow.
// Paste this function (and the helpers above it) into ControlHelpers.tsx,
// replacing your existing ColorRow export.
//
// Also add this one CSS rule to ControlPanel.module.css (bottom of file):
//   .colorPopover { position: absolute; right: 0; top: calc(100% + 6px); z-index: 99; }
// ─────────────────────────────────────────────────────────────────────────────

// ── Palette ──────────────────────────────────────────────────────────────────
// Two sets: one loads when the parent panel is dark, one for light.
// CompForge tokens first, then broader palette, then neutrals.

const DARK_SWATCHES = [
  {
    label: "Tokens",
    colors: [
      "#7c6cfc",
      "#9d91fd",
      "#4ade80",
      "#f87171",
      "#facc15",
      "#60a5fa",
      "#fb923c",
      "#c084fc",
    ],
  },
  {
    label: "Palette",
    colors: [
      "#e879f9",
      "#22d3ee",
      "#34d399",
      "#a78bfa",
      "#f472b6",
      "#38bdf8",
      "#fbbf24",
      "#fb7185",
    ],
  },
  {
    label: "Neutrals",
    colors: [
      "#f0f0f5",
      "#c0c0d8",
      "#9090a8",
      "#5a5a72",
      "#3a3a52",
      "#2a2a38",
      "#1c1c22",
      "#0c0c0f",
    ],
  },
];

const LIGHT_SWATCHES = [
  {
    label: "Tokens",
    colors: [
      "#6c5ce7",
      "#8b7cf8",
      "#22c55e",
      "#ef4444",
      "#eab308",
      "#3b82f6",
      "#f97316",
      "#a855f7",
    ],
  },
  {
    label: "Palette",
    colors: [
      "#d946ef",
      "#06b6d4",
      "#10b981",
      "#8b5cf6",
      "#ec4899",
      "#0ea5e9",
      "#f59e0b",
      "#f43f5e",
    ],
  },
  {
    label: "Neutrals",
    colors: [
      "#1a1a2e",
      "#3a3a60",
      "#6060a0",
      "#9090a8",
      "#c8c8da",
      "#dddbe8",
      "#eae8f2",
      "#f4f4f8",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidHex(h: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h);
}

// Normalise 3-char shorthand → 6-char
function normaliseHex(h: string): string {
  const v = h.startsWith("#") ? h : `#${h}`;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SwatchDotProps {
  color: string;
  active: boolean;
  onSelect: (c: string) => void;
}

function SwatchDot({ color, active, onSelect }: SwatchDotProps) {
  return (
    <div
      onClick={() => onSelect(color)}
      title={color}
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        background: color,
        cursor: "pointer",
        flexShrink: 0,
        border: active ? "2px solid #fff" : "2px solid transparent",
        boxShadow: active ? "0 0 0 1px rgba(0,0,0,0.35)" : "none",
        transition: "transform 0.1s, border-color 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    />
  );
}

interface PopoverProps {
  value: string;
  isDark: boolean;
  onChange: (hex: string) => void;
  onClose: () => void;
}

function ColorPopover({ value, isDark, onChange, onClose }: PopoverProps) {
  const [inputVal, setInputVal] = useState(value);
  const [inputInvalid, setInputInvalid] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  const swatches = isDark ? DARK_SWATCHES : LIGHT_SWATCHES;

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  // Keep input in sync if parent value changes (e.g. theme switch)
  useEffect(() => {
    setInputVal(value);
    setInputInvalid(false);
  }, [value]);

  function handleSwatchSelect(color: string) {
    setInputVal(color);
    setInputInvalid(false);
    onChange(color);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputVal(raw);
    const candidate = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(candidate)) {
      setInputInvalid(false);
      onChange(normaliseHex(candidate));
    } else {
      setInputInvalid(true);
    }
  }

  function handleInputBlur() {
    // On blur, if still invalid, revert to last valid
    const candidate = inputVal.startsWith("#") ? inputVal : `#${inputVal}`;
    if (!isValidHex(candidate)) {
      setInputVal(value);
      setInputInvalid(false);
    }
  }

  // Styles — dark vs light surface
  const popBg = isDark ? "#141418" : "#ffffff";
  const popBorder = isDark ? "#2a2a38" : "#d4d4e0";
  const sectionLabelColor = isDark ? "#3a3a52" : "#b0aec0";
  const hexRowBg = isDark ? "#0c0c0f" : "#f4f4f8";
  const hexRowBorder = isDark ? "#2a2a38" : "#dddbe8";
  const inputColor = isDark ? "#f0f0f5" : "#1a1a2e";
  const shadow = isDark
    ? "0 16px 40px rgba(0,0,0,0.65)"
    : "0 8px 32px rgba(0,0,0,0.12)";

  return (
    <div
      ref={popRef}
      // .colorPopover only sets position:absolute; right:0; top:calc(100%+6px); z-index:99
      className={styles.colorPopover}
      style={{
        background: popBg,
        border: `1px solid ${popBorder}`,
        borderRadius: 12,
        padding: 14,
        width: 222,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: shadow,
      }}
      // Prevent row hover from firing while interacting with popover
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Swatch groups */}
      {swatches.map((group) => (
        <div
          key={group.label}
          style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: sectionLabelColor,
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            }}
          >
            {group.label}
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 22px)",
              gap: 4,
            }}
          >
            {group.colors.map((c) => (
              <SwatchDot
                key={c}
                color={c}
                active={normaliseHex(value) === normaliseHex(c)}
                onSelect={handleSwatchSelect}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Hex input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          borderRadius: 8,
          background: hexRowBg,
          border: `1px solid ${inputInvalid ? "#f87171" : hexRowBorder}`,
          transition: "border-color 0.15s",
        }}
      >
        {/* Live preview dot */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: inputInvalid ? hexRowBg : value,
            flexShrink: 0,
            border: `1px solid ${hexRowBorder}`,
            transition: "background 0.1s",
          }}
        />
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          maxLength={7}
          spellCheck={false}
          placeholder="#000000"
          style={{
            flex: 1,
            minWidth: 0,
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 12,
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            letterSpacing: "0.04em",
            color: inputInvalid ? "#f87171" : inputColor,
          }}
        />
      </div>
    </div>
  );
}

// ── ColorRow (the actual export) ──────────────────────────────────────────────

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  /** Pass isDark={false} for light-theme control panels. Defaults to true. */
  isDark?: boolean;
}

export function ColorRow({
  label,
  value,
  onChange,
  isDark = true,
}: ColorRowProps) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);

  // Trigger colour — the pill swatch + hex text
  const triggerBg = isDark ? "#141418" : "#ffffff";
  const triggerBorder = isDark ? "#2a2a38" : "#d4d4e0";
  const triggerBorderHover = isDark ? "#3a3a52" : "#b0aec0";
  const hexTextColor = isDark ? "#9090a8" : "#6060a0";

  return (
    // .row comes from ControlPanel.module.css — it already has position:relative baked in
    // If it doesn't, add: position: relative to the .row rule.
    <div ref={rowRef} className={styles.row} style={{ position: "relative" }}>
      <span className={styles.label}>{label}</span>

      {/* Trigger pill */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "4px 8px 4px 5px",
          borderRadius: 7,
          cursor: "pointer",
          background: triggerBg,
          border: `1px solid ${open ? triggerBorderHover : triggerBorder}`,
          transition: "border-color 0.15s",
          userSelect: "none",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor =
            triggerBorderHover)
        }
        onMouseLeave={(e) => {
          if (!open)
            (e.currentTarget as HTMLDivElement).style.borderColor =
              triggerBorder;
        }}
      >
        {/* Color swatch square */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: value,
            flexShrink: 0,
          }}
        />
        {/* Hex label */}
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            letterSpacing: "0.04em",
            color: hexTextColor,
          }}
        >
          {value}
        </span>
      </div>

      {/* Popover */}
      {open && (
        <ColorPopover
          value={value}
          isDark={isDark}
          onChange={(hex) => {
            onChange(hex);
          }}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

// ── Slider row ───────────────────────────────────────────────────────────────
export function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  onChangeEnd,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  onChangeEnd?: (v: number) => void;
}) {
  return (
    <div className={styles.sliderRow}>
      <div className={styles.sliderTop}>
        <span className={styles.label}>{label}</span>
        <span className={styles.sliderValue}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseUp={(e) =>
          onChangeEnd?.(Number((e.target as HTMLInputElement).value))
        }
        onTouchEnd={(e) =>
          onChangeEnd?.(Number((e.target as HTMLInputElement).value))
        }
        className={styles.slider}
      />
    </div>
  );
}

// ── Toggle row ───────────────────────────────────────────────────────────────
export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <button
        className={`${styles.toggle} ${value ? styles.toggleOn : ""}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

// ── Text input row ───────────────────────────────────────────────────────────
export function TextRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.textRow}>
      <span className={styles.label}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.textInput}
      />
    </div>
  );
}

// ── Panel shell (header + scrollable body) ───────────────────────────────────
export function ControlPanelShell({
  onReset,
  children,
}: {
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Controls</span>
        <button className={styles.resetBtn} onClick={onReset}>
          ↺ Reset
        </button>
      </div>
      <div className={styles.sections}>{children}</div>
    </div>
  );
}
