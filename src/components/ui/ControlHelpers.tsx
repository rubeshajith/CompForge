"use client";

import styles from "./ControlHelpers.module.css";

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
export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.colorControl}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.colorInput}
        />
        <span className={styles.colorHex}>{value}</span>
      </div>
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
