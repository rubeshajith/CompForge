"use client";

import { useState } from "react";
import type { BreadcrumbConfig } from "@/lib/breadcrumbsConfig";

const SAMPLE_CRUMBS = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb", href: null }, // active/current
];

interface BreadcrumbPreviewProps {
  config: BreadcrumbConfig;
}

export function BreadcrumbPreview({ config }: BreadcrumbPreviewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: "40px",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      <BreadcrumbInner
        config={config}
        crumbs={SAMPLE_CRUMBS}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
      />
    </div>
  );
}

// ─── Shared crumb type ───────────────────────────────────────────────
interface Crumb {
  label: string;
  href: string | null;
}

interface InnerProps {
  config: BreadcrumbConfig;
  crumbs: Crumb[];
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
}

function BreadcrumbInner({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  switch (config.variant) {
    case "pill":
      return (
        <PillVariant {...{ config, crumbs, hoveredIndex, setHoveredIndex }} />
      );
    case "arrow":
      return (
        <ArrowVariant {...{ config, crumbs, hoveredIndex, setHoveredIndex }} />
      );
    case "underline":
      return (
        <UnderlineVariant
          {...{ config, crumbs, hoveredIndex, setHoveredIndex }}
        />
      );
    case "mono":
      return (
        <MonoVariant {...{ config, crumbs, hoveredIndex, setHoveredIndex }} />
      );
    default:
      return (
        <DefaultVariant
          {...{ config, crumbs, hoveredIndex, setHoveredIndex }}
        />
      );
  }
}

// ─── Home Icon SVG ───────────────────────────────────────────────────
function HomeIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2 6.5L8 1.5L14 6.5V14H10V10H6V14H2V6.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Chevron separator ───────────────────────────────────────────────
function ChevronSep({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4 2L8 6L4 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT 1 — Default (slash separator)
// ═══════════════════════════════════════════════════════════════════════
function DefaultVariant({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: `${config.gap}px`,
    flexWrap: "wrap",
  };

  return (
    <nav aria-label="breadcrumb">
      <ol style={wrapStyle}>
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isFirst = i === 0;

          const itemStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: isActive
              ? config.activeTextColor
              : isHovered
                ? config.textHoverColor
                : config.textColor,
            fontSize: `${config.fontSize}px`,
            fontWeight: isActive ? config.fontWeight + 100 : config.fontWeight,
            fontFamily: "'Instrument Sans', sans-serif",
            cursor: isActive ? "default" : "pointer",
            transition: config.animate ? "color 0.15s ease" : "none",
            padding: `${config.itemPaddingY}px ${config.itemPaddingX}px`,
            textDecoration: "none",
            listStyle: "none",
          };

          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${config.gap}px`,
                listStyle: "none",
              }}
            >
              {i > 0 && (
                <span
                  style={{
                    color: config.separatorColor,
                    fontSize: `${config.fontSize}px`,
                    fontFamily: "'Instrument Sans', sans-serif",
                    userSelect: "none",
                  }}
                >
                  /
                </span>
              )}
              <span
                style={itemStyle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isFirst && config.showHomeIcon ? (
                  <HomeIcon
                    color={isHovered ? config.textHoverColor : config.textColor}
                    size={14}
                  />
                ) : null}
                {(!isFirst || !config.showHomeIcon) && crumb.label}
                {isFirst && config.showHomeIcon && crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT 2 — Pill
// ═══════════════════════════════════════════════════════════════════════
function PillVariant({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: `${config.gap}px`,
    flexWrap: "wrap",
    padding: "4px",
    background: config.backgroundColor,
    borderRadius: `${config.borderRadius + 4}px`,
    border: `1px solid ${config.borderColor}`,
    boxShadow: config.showShadow ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
    width: "fit-content",
  };

  return (
    <nav aria-label="breadcrumb">
      <ol style={wrapStyle}>
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isFirst = i === 0;

          const pillStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: `${config.itemPaddingY}px ${config.itemPaddingX}px`,
            borderRadius: `${config.borderRadius}px`,
            background: isActive
              ? config.activeBackground
              : isHovered
                ? config.itemHoverBackground
                : "transparent",
            color: isActive
              ? config.activeTextColor
              : isHovered
                ? config.textHoverColor
                : config.textColor,
            fontSize: `${config.fontSize}px`,
            fontWeight: isActive ? config.fontWeight + 100 : config.fontWeight,
            fontFamily: "'Instrument Sans', sans-serif",
            cursor: isActive ? "default" : "pointer",
            transition: config.animate
              ? "background 0.15s ease, color 0.15s ease"
              : "none",
            listStyle: "none",
            border: isActive
              ? `1px solid ${config.activeBorderColor}40`
              : "1px solid transparent",
          };

          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${config.gap}px`,
                listStyle: "none",
              }}
            >
              {i > 0 && <ChevronSep color={config.separatorColor} />}
              <span
                style={pillStyle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isFirst && config.showHomeIcon && (
                  <HomeIcon
                    color={
                      isActive
                        ? config.activeTextColor
                        : isHovered
                          ? config.textHoverColor
                          : config.textColor
                    }
                    size={13}
                  />
                )}
                {(!isFirst || !config.showHomeIcon) && crumb.label}
                {isFirst && config.showHomeIcon && crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT 3 — Arrow (ribbon style)
// ═══════════════════════════════════════════════════════════════════════
function ArrowVariant({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    boxShadow: config.showShadow ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
    borderRadius: `${config.borderRadius}px`,
    overflow: "hidden",
    border: `1px solid ${config.borderColor}`,
    width: "fit-content",
  };

  const ARROW_OVERLAP = 12;

  return (
    <nav aria-label="breadcrumb">
      <ol style={wrapStyle}>
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isLast = i === crumbs.length - 1;
          const isFirst = i === 0;

          const bg = isActive
            ? config.accentColor
            : isHovered
              ? config.itemHoverBackground
              : config.itemBackground;

          const textCol = isActive
            ? "#ffffff"
            : isHovered
              ? config.textHoverColor
              : config.textColor;

          const itemStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: `${config.itemPaddingY}px ${config.itemPaddingX + (i > 0 ? ARROW_OVERLAP : 0)}px ${config.itemPaddingY}px ${config.itemPaddingX}px`,
            background: bg,
            color: textCol,
            fontSize: `${config.fontSize}px`,
            fontWeight: isActive ? config.fontWeight + 100 : config.fontWeight,
            fontFamily: "'Instrument Sans', sans-serif",
            cursor: isActive ? "default" : "pointer",
            transition: config.animate
              ? "background 0.15s ease, color 0.15s ease"
              : "none",
            listStyle: "none",
            position: "relative",
            marginLeft: i > 0 ? `-${ARROW_OVERLAP}px` : 0,
            zIndex: crumbs.length - i,
            clipPath:
              isFirst && isLast
                ? "none"
                : isFirst
                  ? `polygon(0 0, calc(100% - ${ARROW_OVERLAP}px) 0, 100% 50%, calc(100% - ${ARROW_OVERLAP}px) 100%, 0 100%)`
                  : isLast
                    ? `polygon(${ARROW_OVERLAP}px 0, 100% 0, 100% 100%, ${ARROW_OVERLAP}px 100%, 0 50%)`
                    : `polygon(${ARROW_OVERLAP}px 0, calc(100% - ${ARROW_OVERLAP}px) 0, 100% 50%, calc(100% - ${ARROW_OVERLAP}px) 100%, ${ARROW_OVERLAP}px 100%, 0 50%)`,
          };

          return (
            <li key={i} style={{ display: "contents", listStyle: "none" }}>
              <span
                style={itemStyle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isFirst && config.showHomeIcon && (
                  <HomeIcon color={textCol} size={13} />
                )}
                {(!isFirst || !config.showHomeIcon) && crumb.label}
                {isFirst && config.showHomeIcon && crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT 4 — Underline (editorial)
// ═══════════════════════════════════════════════════════════════════════
function UnderlineVariant({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: `${config.gap}px`,
    flexWrap: "wrap",
  };

  return (
    <nav aria-label="breadcrumb">
      <ol style={wrapStyle}>
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isFirst = i === 0;

          const itemStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: isActive
              ? config.activeTextColor
              : isHovered
                ? config.textHoverColor
                : config.textColor,
            fontSize: `${config.fontSize}px`,
            fontWeight: isActive ? config.fontWeight + 100 : config.fontWeight,
            fontFamily: "'Instrument Sans', sans-serif",
            cursor: isActive ? "default" : "pointer",
            transition: config.animate ? "color 0.15s ease" : "none",
            padding: `${config.itemPaddingY}px ${config.itemPaddingX}px`,
            paddingBottom: `${config.itemPaddingY + 2}px`,
            position: "relative",
            borderBottom: isActive
              ? `2px solid ${config.accentColor}`
              : isHovered
                ? `2px solid ${config.separatorColor}`
                : "2px solid transparent",
            listStyle: "none",
          };

          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${config.gap}px`,
                listStyle: "none",
              }}
            >
              {i > 0 && (
                <span
                  style={{
                    color: config.separatorColor,
                    fontSize: `${config.fontSize - 1}px`,
                    fontFamily: "'Instrument Sans', sans-serif",
                    userSelect: "none",
                    paddingBottom: "2px",
                  }}
                >
                  ·
                </span>
              )}
              <span
                style={itemStyle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isFirst && config.showHomeIcon && (
                  <HomeIcon
                    color={
                      isActive
                        ? config.activeTextColor
                        : isHovered
                          ? config.textHoverColor
                          : config.textColor
                    }
                    size={13}
                  />
                )}
                {(!isFirst || !config.showHomeIcon) && crumb.label}
                {isFirst && config.showHomeIcon && crumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT 5 — Mono (terminal style)
// ═══════════════════════════════════════════════════════════════════════
function MonoVariant({
  config,
  crumbs,
  hoveredIndex,
  setHoveredIndex,
}: InnerProps) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0px",
    background: config.backgroundColor,
    border: `1px solid ${config.borderColor}`,
    borderRadius: `${config.borderRadius}px`,
    padding: "2px 4px",
    boxShadow: config.showShadow ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
    width: "fit-content",
  };

  return (
    <nav aria-label="breadcrumb">
      <ol style={wrapStyle}>
        {crumbs.map((crumb, i) => {
          const isActive = crumb.href === null;
          const isHovered = hoveredIndex === i && !isActive;
          const isFirst = i === 0;

          const itemStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: `${config.itemPaddingY}px ${config.itemPaddingX}px`,
            color: isActive
              ? config.accentColor
              : isHovered
                ? config.textHoverColor
                : config.textColor,
            fontSize: `${config.fontSize - 1}px`,
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            letterSpacing: "0.02em",
            cursor: isActive ? "default" : "pointer",
            transition: config.animate ? "color 0.1s ease" : "none",
            background: isActive
              ? `${config.accentColor}14`
              : isHovered
                ? config.itemHoverBackground
                : "transparent",
            borderRadius: `${config.borderRadius - 2}px`,
            listStyle: "none",
          };

          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                listStyle: "none",
              }}
            >
              {i > 0 && (
                <span
                  style={{
                    color: config.accentColor,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: `${config.fontSize - 1}px`,
                    padding: "0 2px",
                    userSelect: "none",
                    opacity: 0.7,
                  }}
                >
                  /
                </span>
              )}
              <span
                style={itemStyle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isFirst && config.showHomeIcon ? (
                  <>
                    <span
                      style={{
                        opacity: 0.6,
                        fontSize: `${config.fontSize - 2}px`,
                      }}
                    >
                      ~
                    </span>
                    {crumb.label.toLowerCase()}
                  </>
                ) : (
                  crumb.label.toLowerCase()
                )}
                {isActive && (
                  <span
                    style={{
                      color: config.accentColor,
                      opacity: 0.9,
                      animation: "none",
                    }}
                  >
                    _
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
