"use client";

import { ButtonConfig } from "@/lib/buttonConfig";

interface ButtonPreviewProps {
  config: ButtonConfig;
}

// ─── Size map ─────────────────────────────────────────────────────────────────
const SIZE_MAP = {
  xs: { height: 28, px: 10, fontSize: 11, iconSize: 12, gap: 5 },
  sm: { height: 32, px: 14, fontSize: 12, iconSize: 13, gap: 6 },
  md: { height: 38, px: 18, fontSize: 13, iconSize: 14, gap: 7 },
  lg: { height: 44, px: 22, fontSize: 14, iconSize: 16, gap: 8 },
  xl: { height: 52, px: 28, fontSize: 16, iconSize: 18, gap: 10 },
};

const RADIUS_MAP = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 14,
  full: 9999,
};

// ─── Ripple hook logic (inline) ───────────────────────────────────────────────
function useRipple(enabled: boolean) {
  function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
    if (!enabled) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${x}px;top:${y}px;border-radius:50%;
      background:rgba(255,255,255,0.18);pointer-events:none;
      animation:btn-ripple 0.55s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
  return addRipple;
}

// ─── Icon SVGs ────────────────────────────────────────────────────────────────
function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4.05 4.05l2.12 2.12M9.83 9.83l2.12 2.12M4.05 11.95l2.12-2.12M9.83 6.17l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LoadingSpinner({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ animation: "btn-spin 0.7s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── Single button builder ────────────────────────────────────────────────────
function buildButtonStyle(config: ButtonConfig, hovered: boolean): React.CSSProperties {
  const { variant, size, radius, disabled, loading, animateHover } = config;
  const s = SIZE_MAP[size];
  const r = RADIUS_MAP[radius];
  const isDisabled = disabled || loading;
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    height: s.height,
    paddingLeft: s.px,
    paddingRight: s.px,
    fontSize: s.fontSize,
    fontFamily: config.fontFamily,
    fontWeight: config.fontWeight,
    letterSpacing: `${config.letterSpacing}em`,
    borderRadius: r,
    border: "1.5px solid transparent",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.45 : 1,
    position: "relative",
    overflow: "hidden",
    textDecoration: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    transition: animateHover ? "all 0.18s cubic-bezier(0.4,0,0.2,1)" : "none",
    transform: animateHover && hovered && !isDisabled ? "translateY(-1px)" : "none",
    boxShadow: animateHover && hovered && !isDisabled && variant === "solid"
      ? `0 4px 16px ${config.solidBg}55`
      : "none",
  };

  if (variant === "solid") {
    return {
      ...base,
      background: hovered && !isDisabled ? config.solidHoverBg : config.solidBg,
      color: config.solidText,
      borderColor: config.solidBorder,
    };
  }
  if (variant === "outline") {
    return {
      ...base,
      background: hovered && !isDisabled ? config.outlineHoverBg : "transparent",
      color: config.outlineText,
      borderColor: config.outlineBorder,
    };
  }
  if (variant === "ghost") {
    return {
      ...base,
      background: hovered && !isDisabled ? config.ghostHoverBg : "transparent",
      color: config.ghostText,
      borderColor: "transparent",
    };
  }
  if (variant === "soft") {
    return {
      ...base,
      background: hovered && !isDisabled ? config.softHoverBg : config.softBg,
      color: config.softText,
      borderColor: "transparent",
    };
  }
  // link
  return {
    ...base,
    background: "transparent",
    color: hovered && !isDisabled ? config.linkHoverText : config.linkText,
    borderColor: "transparent",
    textDecoration: hovered && !isDisabled ? "underline" : "none",
    paddingLeft: 2,
    paddingRight: 2,
    transform: "none",
    boxShadow: "none",
  };
}

function SingleButton({ config, label }: { config: ButtonConfig; label: string }) {
  const [hovered, setHovered] = React.useState(false);
  const addRipple = useRipple(config.showRipple && config.variant !== "link");
  const s = SIZE_MAP[config.size];
  const style = buildButtonStyle(config, hovered);

  return (
    <button
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={addRipple}
      disabled={config.disabled}
    >
      {config.loading && <LoadingSpinner size={s.iconSize} />}
      {!config.loading && config.iconLeft && <SparkleIcon size={s.iconSize} />}
      <span style={{ lineHeight: 1 }}>{config.loading ? "Loading…" : label}</span>
      {!config.loading && config.iconRight && <ArrowRight size={s.iconSize} />}
    </button>
  );
}

// ─── Group button ─────────────────────────────────────────────────────────────
const GROUP_LABELS = ["Button 1", "Button 2", "Button 3", "Button 4", "Button 5"];

function GroupButton({ config, index, total, active, onClick }: {
  config: ButtonConfig;
  index: number;
  total: number;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const addRipple = useRipple(config.showRipple);
  const s = SIZE_MAP[config.size];
  const r = RADIUS_MAP[config.radius];
  const isH = config.groupOrientation === "horizontal";

  const firstR = isH
    ? `${r}px 0 0 ${r}px`
    : `${r}px ${r}px 0 0`;
  const lastR = isH
    ? `0 ${r}px ${r}px 0`
    : `0 0 ${r}px ${r}px`;
  const midR = "0";
  const borderRadius = index === 0 ? firstR : index === total - 1 ? lastR : midR;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: s.height,
    paddingLeft: s.px,
    paddingRight: s.px,
    fontSize: s.fontSize,
    fontFamily: config.fontFamily,
    fontWeight: config.fontWeight,
    letterSpacing: `${config.letterSpacing}em`,
    borderRadius,
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
    transition: config.animateHover ? "all 0.16s cubic-bezier(0.4,0,0.2,1)" : "none",
    whiteSpace: "nowrap",
  };

  if (config.variant === "solid" || config.variant === "soft") {
    const bg = config.variant === "solid"
      ? (active ? config.solidHoverBg : hovered ? config.solidHoverBg : config.solidBg)
      : (active ? config.softHoverBg : hovered ? config.softHoverBg : config.softBg);
    const text = config.variant === "solid" ? config.solidText : config.softText;
    return (
      <button
        style={{ ...baseStyle, background: bg, color: text, border: `1.5px solid ${config.solidBorder}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={addRipple}
        onClick={onClick}
      >
        {GROUP_LABELS[index]}
      </button>
    );
  }

  // outline / ghost
  const borderColor = config.variant === "ghost" ? "transparent" : config.outlineBorder;
  const textColor = config.variant === "ghost" ? config.ghostText : config.outlineText;
  const activeBg = config.variant === "ghost" ? config.ghostHoverBg : config.outlineHoverBg;
  const hovBg = config.variant === "ghost" ? config.ghostHoverBg : config.outlineHoverBg;

  return (
    <button
      style={{
        ...baseStyle,
        background: active ? activeBg : hovered ? hovBg : "transparent",
        color: active ? (config.variant === "outline" ? config.outlineText : config.ghostText) : textColor,
        border: `1.5px solid ${borderColor}`,
        fontWeight: active ? 600 : config.fontWeight,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={addRipple}
      onClick={onClick}
    >
      {GROUP_LABELS[index]}
    </button>
  );
}

// ─── Preview labels ───────────────────────────────────────────────────────────
const VARIANT_LABELS: Record<string, string> = {
  solid: "Solid",
  outline: "Outline",
  ghost: "Ghost",
  soft: "Soft",
  link: "Link",
};

// ─── Main Preview ─────────────────────────────────────────────────────────────
import React, { useState } from "react";

export function ButtonPreview({ config }: ButtonPreviewProps) {
  const [activeGroup, setActiveGroup] = useState(0);

  const label = VARIANT_LABELS[config.variant] ?? "Button";

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes btn-ripple {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(1); opacity: 0; }
        }
        @keyframes btn-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

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
        {/* Single Button Demo */}
        {!config.groupEnabled && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em",
              color: "#5a5a72",
              textTransform: "uppercase",
            }}>
              {label} · {config.size.toUpperCase()}
            </span>
            <SingleButton config={config} label={label} />
          </div>
        )}

        {/* All Variants Showcase — when group not enabled */}
        {!config.groupEnabled && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em",
              color: "#5a5a72",
              textTransform: "uppercase",
            }}>
              All variants
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {(["solid", "outline", "ghost", "soft", "link"] as const).map((v) => (
                <SingleButton
                  key={v}
                  config={{ ...config, variant: v, loading: false, disabled: false }}
                  label={VARIANT_LABELS[v]}
                />
              ))}
            </div>
          </div>
        )}

        {/* Group Demo */}
        {config.groupEnabled && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em",
              color: "#5a5a72",
              textTransform: "uppercase",
            }}>
              Button Group · {config.groupOrientation}
            </span>
            <div style={{
              display: "inline-flex",
              flexDirection: config.groupOrientation === "vertical" ? "column" : "row",
            }}>
              {Array.from({ length: config.groupItemCount }).map((_, i) => (
                <GroupButton
                  key={i}
                  config={config}
                  index={i}
                  total={config.groupItemCount}
                  active={activeGroup === i}
                  onClick={() => setActiveGroup(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
