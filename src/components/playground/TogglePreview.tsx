"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToggleConfig } from "@/lib/toggleConfig";

interface TogglePreviewProps {
  config: ToggleConfig;
}

// ─── Size map ─────────────────────────────────────────────────────────────────
const SIZE = {
  sm: { h: 28, px: 12, font: 11, gap: 6, switchW: 40, switchH: 22, thumb: 16, thumbOff: 3, thumbOn: 19 },
  md: { h: 34, px: 16, font: 12, gap: 8, switchW: 48, switchH: 26, thumb: 20, thumbOff: 3, thumbOn: 25 },
  lg: { h: 42, px: 20, font: 14, gap: 10, switchW: 58, switchH: 30, thumb: 24, thumbOff: 3, thumbOn: 31 },
};

const RADIUS_MAP = { sm: 6, md: 10, lg: 16, full: 9999 };

// ─── Icons for groups ─────────────────────────────────────────────────────────
const GROUP_ICONS = [
  // Sun
  (sz: number) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Moon
  (sz: number) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none">
      <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // System
  (sz: number) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 14h6M8 11v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Grid
  (sz: number) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  // List
  (sz: number) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none">
      <path d="M6 4h8M6 8h8M6 12h8M3 4h.01M3 8h.01M3 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
];

const GROUP_LABELS = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
const GROUP_SHORT_LABELS = ["Sun", "Moon", "Auto", "Grid", "List"];

// ─── PILL TOGGLE ──────────────────────────────────────────────────────────────
function PillToggle({ config, value, onChange }: { config: ToggleConfig; value: boolean; onChange: (v: boolean) => void }) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP[config.borderRadius];
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: s.gap,
    height: s.h,
    paddingLeft: s.px,
    paddingRight: s.px,
    borderRadius: r,
    border: `1.5px solid ${value ? config.activeBorder : config.trackBorder}`,
    background: value ? config.activeBg : hovered ? config.inactiveHoverBg : config.trackBg,
    color: value ? config.activeText : config.inactiveText,
    cursor: "pointer",
    fontSize: s.font,
    fontFamily: "'Instrument Sans', sans-serif",
    fontWeight: 500,
    userSelect: "none",
    transition: config.animateToggle ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none",
  };

  return (
    <button style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onChange(!value)}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: value ? config.activeText : config.inactiveText,
        opacity: value ? 1 : 0.5,
        transition: config.animateToggle ? "all 0.18s ease" : "none",
        flexShrink: 0,
      }} />
      {value ? "Active" : "Inactive"}
    </button>
  );
}

// ─── CHIP TOGGLE ──────────────────────────────────────────────────────────────
function ChipToggle({ config, value, onChange }: { config: ToggleConfig; value: boolean; onChange: (v: boolean) => void }) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP["md"];
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        height: s.h,
        paddingLeft: s.px,
        paddingRight: s.px,
        borderRadius: r,
        border: `1.5px solid ${value ? config.activeBorder : config.trackBorder}`,
        background: value ? `${config.activeBg}22` : hovered ? config.inactiveHoverBg : "transparent",
        color: value ? config.activeBg : config.inactiveText,
        cursor: "pointer",
        fontSize: s.font,
        fontFamily: "'Instrument Sans', sans-serif",
        fontWeight: value ? 600 : 500,
        userSelect: "none",
        transition: config.animateToggle ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onChange(!value)}
    >
      {value && (
        <svg width={s.font} height={s.font} viewBox="0 0 16 16" fill="none">
          <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {value ? "Selected" : "Select"}
    </button>
  );
}

// ─── SWITCH TOGGLE ────────────────────────────────────────────────────────────
function SwitchToggle({ config, value, onChange }: { config: ToggleConfig; value: boolean; onChange: (v: boolean) => void }) {
  const s = SIZE[config.size];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onChange(!value)}>
      <div style={{
        position: "relative",
        width: s.switchW,
        height: s.switchH,
        borderRadius: 9999,
        background: value ? config.activeBg : config.trackBg,
        border: `1.5px solid ${value ? config.activeBorder : config.trackBorder}`,
        transition: config.animateToggle ? "all 0.22s cubic-bezier(0.4,0,0.2,1)" : "none",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute",
          top: (s.switchH - s.thumb) / 2 - 1.5,
          left: value ? s.thumbOn : s.thumbOff,
          width: s.thumb,
          height: s.thumb,
          borderRadius: "50%",
          background: config.thumbColor,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          transition: config.animateToggle ? "left 0.22s cubic-bezier(0.4,0,0.2,1)" : "none",
        }} />
      </div>
      <span style={{
        fontSize: s.font,
        color: value ? config.activeText : config.inactiveText,
        fontFamily: "'Instrument Sans', sans-serif",
        fontWeight: 500,
        transition: "color 0.18s ease",
      }}>
        {value ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

// ─── UNDERLINE TOGGLE ─────────────────────────────────────────────────────────
function UnderlineToggle({ config, value, onChange }: { config: ToggleConfig; value: boolean; onChange: (v: boolean) => void }) {
  const s = SIZE[config.size];

  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        height: s.h,
        paddingLeft: s.px / 2,
        paddingRight: s.px / 2,
        background: "transparent",
        border: "none",
        borderBottom: `2px solid ${value ? config.activeBg : "transparent"}`,
        color: value ? config.activeText : config.inactiveText,
        cursor: "pointer",
        fontSize: s.font,
        fontFamily: "'Instrument Sans', sans-serif",
        fontWeight: value ? 600 : 500,
        userSelect: "none",
        transition: config.animateToggle ? "all 0.18s ease" : "none",
        paddingBottom: 2,
      }}
      onClick={() => onChange(!value)}
    >
      {value ? "Active" : "Inactive"}
    </button>
  );
}

// ─── ICON-LABEL TOGGLE ────────────────────────────────────────────────────────
function IconLabelToggle({ config, value, onChange }: { config: ToggleConfig; value: boolean; onChange: (v: boolean) => void }) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP[config.borderRadius];
  const [hovered, setHovered] = useState(false);
  const iconFn = value ? GROUP_ICONS[0] : GROUP_ICONS[1];

  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        height: s.h,
        paddingLeft: s.px,
        paddingRight: s.px,
        borderRadius: r,
        border: `1.5px solid ${value ? config.activeBorder : config.trackBorder}`,
        background: value ? config.activeBg : hovered ? config.inactiveHoverBg : config.trackBg,
        color: value ? config.activeText : config.inactiveText,
        cursor: "pointer",
        fontSize: s.font,
        fontFamily: "'Instrument Sans', sans-serif",
        fontWeight: 500,
        userSelect: "none",
        transition: config.animateToggle ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onChange(!value)}
    >
      {iconFn(s.font + 2)}
      {value ? "Light" : "Dark"}
    </button>
  );
}

// ─── SEGMENTED GROUP ──────────────────────────────────────────────────────────
function SegmentedGroup({ config, active, onToggle }: {
  config: ToggleConfig;
  active: Set<number>;
  onToggle: (i: number) => void;
}) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP[config.borderRadius];
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = config.groupItemCount;

  // Slide indicator to active (single mode only)
  useEffect(() => {
    if (!config.animateIndicator || config.groupMode !== "single") return;
    const idx = [...active][0] ?? 0;
    const el = itemRefs.current[idx];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    indicator.style.transform = `translateX(${el.offsetLeft}px)`;
    indicator.style.width = `${el.offsetWidth}px`;
  }, [active, config.groupItemCount, config.groupMode, config.animateIndicator]);

  return (
    <div style={{
      position: "relative",
      display: "inline-flex",
      background: config.groupBg,
      border: `1.5px solid ${config.groupBorder}`,
      borderRadius: r + 2,
      padding: 3,
      gap: 1,
    }}>
      {/* Sliding indicator */}
      {config.groupMode === "single" && config.animateIndicator && (
        <div
          ref={indicatorRef}
          style={{
            position: "absolute",
            top: 3,
            left: 0,
            height: `calc(100% - 6px)`,
            background: config.groupActiveIndicatorBg,
            borderRadius: r,
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), width 0.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            pointerEvents: "none",
          }}
        />
      )}
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active.has(i);
        return (
          <button
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            onClick={() => onToggle(i)}
            style={{
              position: "relative",
              zIndex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: config.showGroupIcons ? s.gap : 0,
              height: s.h - 6,
              paddingLeft: s.px,
              paddingRight: s.px,
              borderRadius: r,
              border: "none",
              background: (isActive && (config.groupMode === "multi" || !config.animateIndicator))
                ? config.groupActiveIndicatorBg
                : "transparent",
              color: isActive ? config.groupActiveText : config.groupInactiveText,
              fontSize: s.font,
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              userSelect: "none",
              transition: "color 0.18s ease, background 0.18s ease",
              whiteSpace: "nowrap",
            }}
          >
            {config.showGroupIcons && GROUP_ICONS[i] && GROUP_ICONS[i](s.font + 2)}
            {GROUP_SHORT_LABELS[i]}
          </button>
        );
      })}
    </div>
  );
}

// ─── CHIP ROW GROUP ───────────────────────────────────────────────────────────
function ChipRowGroup({ config, active, onToggle }: {
  config: ToggleConfig;
  active: Set<number>;
  onToggle: (i: number) => void;
}) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP["md"];
  const count = config.groupItemCount;

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active.has(i);
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: s.gap,
              height: s.h,
              paddingLeft: s.px,
              paddingRight: s.px,
              borderRadius: r,
              border: `1.5px solid ${isActive ? config.activeBorder : config.trackBorder}`,
              background: isActive ? `${config.activeBg}22` : "transparent",
              color: isActive ? config.activeBg : config.inactiveText,
              fontSize: s.font,
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              userSelect: "none",
              transition: config.animateToggle ? "all 0.18s ease" : "none",
            }}
          >
            {isActive && (
              <svg width={s.font} height={s.font} viewBox="0 0 16 16" fill="none">
                <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {GROUP_LABELS[i]}
          </button>
        );
      })}
    </div>
  );
}

// ─── PILL ROW GROUP ───────────────────────────────────────────────────────────
function PillRowGroup({ config, active, onToggle }: {
  config: ToggleConfig;
  active: Set<number>;
  onToggle: (i: number) => void;
}) {
  const s = SIZE[config.size];
  const r = RADIUS_MAP["full"];
  const count = config.groupItemCount;

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active.has(i);
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: config.showGroupIcons ? s.gap : 0,
              height: s.h,
              paddingLeft: s.px,
              paddingRight: s.px,
              borderRadius: r,
              border: `1.5px solid ${isActive ? config.activeBorder : config.trackBorder}`,
              background: isActive ? config.activeBg : config.trackBg,
              color: isActive ? config.activeText : config.inactiveText,
              fontSize: s.font,
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              userSelect: "none",
              transition: config.animateToggle ? "all 0.18s ease" : "none",
            }}
          >
            {config.showGroupIcons && GROUP_ICONS[i] && GROUP_ICONS[i](s.font + 2)}
            {GROUP_SHORT_LABELS[i]}
          </button>
        );
      })}
    </div>
  );
}

// ─── ICON TABS GROUP ──────────────────────────────────────────────────────────
function IconTabsGroup({ config, active, onToggle }: {
  config: ToggleConfig;
  active: Set<number>;
  onToggle: (i: number) => void;
}) {
  const s = SIZE[config.size];
  const count = config.groupItemCount;

  return (
    <div style={{
      display: "inline-flex",
      borderBottom: `2px solid ${config.trackBorder}`,
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active.has(i);
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: config.showGroupIcons ? s.gap : 0,
              height: s.h,
              paddingLeft: s.px,
              paddingRight: s.px,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${isActive ? config.activeBg : "transparent"}`,
              marginBottom: -2,
              color: isActive ? config.activeBg : config.inactiveText,
              fontSize: s.font,
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              userSelect: "none",
              transition: config.animateToggle ? "all 0.18s ease" : "none",
            }}
          >
            {config.showGroupIcons && GROUP_ICONS[i] && GROUP_ICONS[i](s.font + 2)}
            {GROUP_SHORT_LABELS[i]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function PreviewLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.1em",
      color: "#5a5a72",
      textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

// ─── Main Preview ─────────────────────────────────────────────────────────────
export function TogglePreview({ config }: TogglePreviewProps) {
  const [singleValue, setSingleValue] = useState(config.toggleValue);
  const [groupActive, setGroupActive] = useState<Set<number>>(new Set([0]));

  function handleGroupToggle(i: number) {
    setGroupActive((prev) => {
      const next = new Set(prev);
      if (config.groupMode === "single") {
        next.clear();
        next.add(i);
      } else {
        if (next.has(i)) next.delete(i);
        else next.add(i);
      }
      return next;
    });
  }

  const renderSingleVariant = () => {
    switch (config.variant) {
      case "pill":     return <PillToggle config={config} value={singleValue} onChange={setSingleValue} />;
      case "chip":     return <ChipToggle config={config} value={singleValue} onChange={setSingleValue} />;
      case "switch":   return <SwitchToggle config={config} value={singleValue} onChange={setSingleValue} />;
      case "underline":return <UnderlineToggle config={config} value={singleValue} onChange={setSingleValue} />;
      case "icon-label":return <IconLabelToggle config={config} value={singleValue} onChange={setSingleValue} />;
      default:         return null;
    }
  };

  const renderGroupVariant = () => {
    switch (config.groupVariant) {
      case "segmented": return <SegmentedGroup config={config} active={groupActive} onToggle={handleGroupToggle} />;
      case "chip-row":  return <ChipRowGroup config={config} active={groupActive} onToggle={handleGroupToggle} />;
      case "pill-row":  return <PillRowGroup config={config} active={groupActive} onToggle={handleGroupToggle} />;
      case "icon-tabs": return <IconTabsGroup config={config} active={groupActive} onToggle={handleGroupToggle} />;
      default:          return null;
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 48,
      width: "100%",
      height: "100%",
      padding: 32,
    }}>
      {/* Single toggle */}
      {!config.groupEnabled && (
        <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <PreviewLabel>{config.variant} toggle</PreviewLabel>
            {renderSingleVariant()}
          </div>
          {/* All variant showcase */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <PreviewLabel>All variants</PreviewLabel>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              <PillToggle config={config} value={true} onChange={() => {}} />
              <ChipToggle config={config} value={true} onChange={() => {}} />
              <SwitchToggle config={config} value={true} onChange={() => {}} />
              <UnderlineToggle config={config} value={true} onChange={() => {}} />
              <IconLabelToggle config={config} value={true} onChange={() => {}} />
            </div>
          </div>
        </>
      )}

      {/* Group toggle */}
      {config.groupEnabled && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <PreviewLabel>
            {config.groupVariant} · {config.groupMode}-select
          </PreviewLabel>
          {renderGroupVariant()}
        </div>
      )}
    </div>
  );
}
