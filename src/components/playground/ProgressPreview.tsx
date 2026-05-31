"use client";

import { useEffect, useRef, useState } from "react";
import type { ProgressConfig, ProgressVariant } from "@/lib/progressConfig";

interface ProgressPreviewProps {
  config: ProgressConfig;
}

// ─── tiny shared helpers ────────────────────────────────────────────────────

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

function circumference(r: number) {
  return 2 * Math.PI * r;
}

// ─── individual variant renderers ───────────────────────────────────────────

function LinearStandard({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {(config.showLabel || config.showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {config.showLabel && (
            <span
              style={{
                fontSize: config.fontSize,
                color: config.mutedColor,
                fontFamily: "inherit",
              }}
            >
              Uploading assets…
            </span>
          )}
          {config.showValue && (
            <span
              style={{
                fontSize: config.fontSize,
                color: config.valueColor,
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: config.barHeight,
          width: "100%",
          background: config.trackColor,
          borderRadius: config.barHeight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: config.accentColor,
            borderRadius: config.barHeight,
            transition: config.animated
              ? "width 0.6s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

function ClassicRing({ config }: { config: ProgressConfig }) {
  const size = config.ringSize;
  const cx = size / 2;
  const r = cx - config.strokeWidth / 2 - 2;
  const circ = circumference(r);
  const offset = circ * (1 - clamp(config.value) / 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.accentColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: config.animated
                ? "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpinIcon
            color={config.accentColor}
            animated={config.animated}
            size={20}
          />
        </div>
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Processing data
        </span>
      )}
    </div>
  );
}

function SpinIcon({
  color,
  animated,
  size,
}: {
  color: string;
  animated: boolean;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      style={
        animated ? { animation: "progress-spin 1s linear infinite" } : undefined
      }
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ProcessQueue({ config }: { config: ProgressConfig }) {
  const items = [
    { name: "hero_banner_v2.psd", status: "done", icon: "🖼" },
    { name: "brand_guidelines.pdf", status: "processing", icon: "📄" },
    { name: "icon_set_v3.zip", status: "waiting", icon: "📦" },
  ];
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {config.showLabel && (
        <span
          style={{
            fontSize: config.fontSize - 1,
            color: config.mutedColor,
            marginBottom: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Process Queue
        </span>
      )}
      {items.map((item, i) => {
        const isDone = item.status === "done";
        const isProcessing = item.status === "processing";
        const statusColor = isDone
          ? config.successColor
          : isProcessing
            ? config.accentColor
            : config.mutedColor;
        const statusLabel = isDone
          ? "Complete"
          : isProcessing
            ? "Processing…"
            : "Waiting…";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              background: isProcessing
                ? `${config.accentColor}14`
                : config.trackColor,
              borderRadius: config.borderRadius * 0.7,
              border: `1px solid ${isProcessing ? config.accentColor + "33" : config.borderColor}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: isProcessing
                  ? `${config.accentColor}22`
                  : `${config.mutedColor}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: config.fontSize,
                  color: config.labelColor,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </div>
              <div
                style={{ fontSize: config.fontSize - 1, color: statusColor }}
              >
                {statusLabel}
              </div>
            </div>
            {isDone && (
              <span style={{ color: config.successColor, fontSize: 16 }}>
                ✓
              </span>
            )}
            {isProcessing && (
              <SpinIcon
                color={config.accentColor}
                animated={config.animated}
                size={16}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Segmented({ config }: { config: ProgressConfig }) {
  const total = 5;
  const filled = Math.round((clamp(config.value) / 100) * total);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: config.barHeight + 2,
              borderRadius: 4,
              background: i < filled ? config.accentColor : config.trackColor,
              transition: config.animated ? "background 0.3s ease" : "none",
            }}
          />
        ))}
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Batch Processing: {filled} of {total}
        </span>
      )}
    </div>
  );
}

function PercentageRing({ config }: { config: ProgressConfig }) {
  const size = config.ringSize;
  const cx = size / 2;
  const r = cx - config.strokeWidth / 2 - 2;
  const circ = circumference(r);
  const pct = clamp(config.value);
  const offset = circ * (1 - pct / 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.accentSecondary}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: config.animated
                ? "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {config.showValue && (
            <span
              style={{
                fontSize: config.fontSize + 4,
                fontWeight: 700,
                color: config.labelColor,
                lineHeight: 1,
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Completion Rate
        </span>
      )}
    </div>
  );
}

function SpeedGauge({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  const isHigh = pct > 75;
  const isMed = pct > 40;
  const gaugeColor = isHigh
    ? config.dangerColor
    : isMed
      ? config.warningColor
      : config.successColor;
  const label = isHigh ? "CRITICAL" : isMed ? "NORMAL" : "IDLE";

  // Arc from 180° to 0° (half circle)
  // SVG arc path for the filled portion
  const R = 40;
  const cx = 50,
    cy = 50;
  const startAngle = Math.PI; // 180°
  const endAngle = Math.PI - (pct / 100) * Math.PI;
  const sx = cx + R * Math.cos(startAngle);
  const sy = cy + R * Math.sin(startAngle);
  const ex = cx + R * Math.cos(endAngle);
  const ey = cy + R * Math.sin(endAngle);
  const largeArc = pct > 50 ? 1 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: 120, height: 70 }}>
        <svg viewBox="0 0 100 60" width={120} height={70}>
          {/* Track */}
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={10}
            strokeLinecap="round"
          />
          {/* Fill */}
          {pct > 0 && (
            <path
              d={`M ${sx} ${sy} A ${R} ${R} 0 ${largeArc} 1 ${ex} ${ey}`}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={10}
              strokeLinecap="round"
              style={{
                transition: config.animated
                  ? "all 0.6s cubic-bezier(0.4,0,0.2,1)"
                  : "none",
              }}
            />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: config.fontSize - 1,
              fontWeight: 700,
              color: gaugeColor,
              letterSpacing: "0.1em",
            }}
          >
            {label}
          </span>
        </div>
      </div>
      {config.showValue && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          {pct}% load
        </span>
      )}
    </div>
  );
}

function MultiRing({ config }: { config: ProgressConfig }) {
  const rings = [
    { r: 40, color: config.accentColor, pct: clamp(config.value) },
    { r: 30, color: config.accentSecondary, pct: clamp(config.value * 0.72) },
    { r: 20, color: config.accentTertiary, pct: clamp(config.value * 0.55) },
  ];
  const size = config.ringSize;
  const cx = size / 2;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {rings.map(({ r: rawR, color, pct }, i) => {
            const scaled = (rawR / 40) * (cx - config.strokeWidth / 2 - 2);
            const circ = circumference(scaled);
            const offset = circ * (1 - pct / 100);
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cx}
                  r={scaled}
                  fill="none"
                  stroke={config.trackColor}
                  strokeWidth={config.strokeWidth * 0.6}
                />
                <circle
                  cx={cx}
                  cy={cx}
                  r={scaled}
                  fill="none"
                  stroke={color}
                  strokeWidth={config.strokeWidth * 0.6}
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{
                    transition: config.animated
                      ? `stroke-dashoffset ${0.6 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)`
                      : "none",
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      {config.showLabel && (
        <div style={{ display: "flex", gap: 12 }}>
          {["CPU", "GPU", "RAM"].map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: config.fontSize - 1,
                color: config.mutedColor,
              }}
            >
              <span style={{ color: rings[i].color, marginRight: 4 }}>●</span>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LevelLadder({ config }: { config: ProgressConfig }) {
  const levels = [
    { label: "Arch-Mage", id: "L4", active: false, completed: false },
    { label: "Wizard", id: "L3", active: true, completed: false },
    { label: "Apprentice", id: "L2", active: false, completed: true },
    { label: "Novice", id: "L1", active: false, completed: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {config.showLabel && (
        <span
          style={{
            fontSize: config.fontSize - 1,
            color: config.mutedColor,
            marginBottom: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Character Level
        </span>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingLeft: 16,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 4,
            bottom: 4,
            width: 2,
            background: config.borderColor,
            borderRadius: 2,
          }}
        />
        {levels.map((lv, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px 8px 4px",
              background: lv.active ? `${config.accentColor}18` : "transparent",
              borderRadius: 8,
              position: "relative",
              opacity: lv.active || lv.completed ? 1 : 0.45,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                flexShrink: 0,
                background: lv.active
                  ? config.accentColor
                  : lv.completed
                    ? `${config.accentColor}44`
                    : config.trackColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: lv.active ? "#fff" : config.mutedColor,
                zIndex: 1,
              }}
            >
              {lv.completed && !lv.active ? "✓" : lv.id}
            </div>
            <span
              style={{
                fontSize: config.fontSize,
                color: lv.active ? config.accentColor : config.labelColor,
                fontWeight: lv.active ? 600 : 400,
              }}
            >
              {lv.label}
              {lv.active ? " (Active)" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmWave({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Optimizing render pipeline…
        </span>
      )}
      <div
        style={{
          height: config.barHeight + 14,
          width: "100%",
          background: config.trackColor,
          borderRadius: config.barHeight + 14,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${config.accentColor} 0%, ${config.accentTertiary} 50%, ${config.accentColor} 100%)`,
            backgroundSize: "200% 100%",
            borderRadius: config.barHeight + 14,
            animation: config.animated
              ? "progress-wave 2s linear infinite"
              : "none",
            transition: config.animated ? "width 0.6s ease" : "none",
            position: "relative",
          }}
        />
      </div>
      {config.showValue && (
        <span
          style={{
            fontSize: config.fontSize,
            color: config.valueColor,
            fontWeight: 600,
          }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}

function PowerNode({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  const battColor =
    pct <= 25
      ? config.dangerColor
      : pct <= 50
        ? config.warningColor
        : config.successColor;
  const label =
    pct <= 25 ? "Low Energy Mode" : pct <= 50 ? "Normal Mode" : "Charging";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 72,
            height: 34,
            border: `2px solid ${config.borderColor}`,
            borderRadius: 6,
            padding: 3,
            display: "flex",
            alignItems: "stretch",
            position: "relative",
            background: config.backgroundColor,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: battColor,
              borderRadius: 3,
              transition: config.animated
                ? "width 0.6s ease, background 0.3s ease"
                : "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -6,
              top: "50%",
              transform: "translateY(-50%)",
              width: 4,
              height: 14,
              background: config.borderColor,
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
        {config.showValue && (
          <span
            style={{
              fontSize: config.fontSize + 2,
              fontWeight: 700,
              color: battColor,
            }}
          >
            {pct}%
          </span>
        )}
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          {label}
        </span>
      )}
    </div>
  );
}

function IconPath({ config }: { config: ProgressConfig }) {
  const badges = [
    { icon: "⭐", earned: true, label: "Explorer" },
    { icon: "🏆", earned: true, label: "Champion" },
    { icon: "🎖", earned: false, label: "Legend" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 280,
        }}
      >
        {badges.map((badge, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < badges.length - 1 ? 1 : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                opacity: badge.earned ? 1 : 0.35,
              }}
            >
              <span style={{ fontSize: 22 }}>{badge.icon}</span>
              {config.showLabel && (
                <span
                  style={{
                    fontSize: config.fontSize - 2,
                    color: badge.earned
                      ? config.accentSecondary
                      : config.mutedColor,
                  }}
                >
                  {badge.label}
                </span>
              )}
            </div>
            {i < badges.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: `repeating-linear-gradient(90deg, ${config.accentSecondary} 0, ${config.accentSecondary} 5px, transparent 5px, transparent 10px)`,
                  margin: "0 8px",
                  marginBottom: config.showLabel ? 20 : 0,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
        2 of 3 badges earned
      </span>
    </div>
  );
}

function DonutThin({ config }: { config: ProgressConfig }) {
  const size = config.ringSize;
  const cx = size / 2;
  const sw = Math.max(2, config.strokeWidth * 0.3);
  const r = cx - sw / 2 - 2;
  const circ = circumference(r);
  const pct = clamp(config.value);
  const offset = circ * (1 - pct / 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={sw}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.accentTertiary}
            strokeWidth={sw}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: config.animated
                ? "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {config.showValue && (
            <span
              style={{
                fontSize: config.fontSize + 1,
                fontWeight: 700,
                color: config.accentTertiary,
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Sync progress
        </span>
      )}
    </div>
  );
}

function VerticalFill({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 32,
          height: 120,
          background: config.trackColor,
          borderRadius: 16,
          padding: 4,
          position: "relative",
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 4,
            right: 4,
            height: `calc(${pct}% - 8px)`,
            background: `linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary})`,
            borderRadius: 12,
            transition: config.animated
              ? "height 0.7s cubic-bezier(0.4,0,0.2,1)"
              : "none",
            minHeight: pct > 0 ? 4 : 0,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {config.showValue && (
          <span
            style={{
              fontSize: config.fontSize + 4,
              fontWeight: 700,
              color: config.labelColor,
            }}
          >
            {pct}%
          </span>
        )}
        {config.showLabel && (
          <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
            Target
          </span>
        )}
      </div>
    </div>
  );
}

function GlassFluid({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          height: 128,
          width: 56,
          background: config.trackColor,
          border: `3px solid ${config.borderColor}`,
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          boxShadow: config.showShadow
            ? `inset 0 2px 8px rgba(0,0,0,0.3)`
            : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `${pct}%`,
            background: `linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary})`,
            transition: config.animated
              ? "height 0.8s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -8,
              left: "-20%",
              width: "140%",
              height: 16,
              borderRadius: "40%",
              background: "rgba(255,255,255,0.2)",
              animation: config.animated
                ? "progress-wave-rot 8s linear infinite"
                : "none",
            }}
          />
        </div>
        {config.showValue && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: config.fontSize - 1,
              fontWeight: 700,
              color: "#fff",
              mixBlendMode: "overlay",
            }}
          >
            {pct}%
          </div>
        )}
      </div>
      {config.showLabel && (
        <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
          Storage used
        </span>
      )}
    </div>
  );
}

function GamifiedXP({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  const xp = Math.round((pct / 100) * 2000);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {config.showLabel && (
          <span style={{ fontSize: config.fontSize, color: config.mutedColor }}>
            Next Level
          </span>
        )}
        <span
          style={{
            background: config.accentColor,
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: config.fontSize - 1,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          LVL 42
        </span>
      </div>
      {config.showValue && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: config.fontSize, color: config.labelColor }}>
            {xp.toLocaleString()} / 2,000 XP
          </span>
        </div>
      )}
      <div
        style={{
          height: config.barHeight + 4,
          width: "100%",
          background: config.trackColor,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${config.accentColor}, ${config.accentSecondary})`,
            borderRadius: 8,
            transition: config.animated
              ? "width 0.6s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

function ConversionFunnel({ config }: { config: ProgressConfig }) {
  const stages = [
    { label: "Visitors", value: 10000, w: "100%" },
    { label: "Qualified", value: 4000, w: "78%" },
    { label: "Trial", value: 1000, w: "52%" },
    { label: "Sale", value: 200, w: "22%" },
  ];
  const baseOpacity = 0.45;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {config.showLabel && (
        <span
          style={{
            fontSize: config.fontSize - 1,
            color: config.mutedColor,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Conversion Funnel
        </span>
      )}
      {stages.map((stage, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: stage.w,
              height: 28,
              background: config.accentColor,
              opacity:
                baseOpacity +
                (i === 0 ? 0.55 : i === 1 ? 0.3 : i === 2 ? 0.2 : 0),
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: config.fontSize - 2,
                color: "#fff",
                fontWeight: 500,
              }}
            >
              {stage.label} (
              {stage.value >= 1000 ? `${stage.value / 1000}k` : stage.value})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkDistribution({ config }: { config: ProgressConfig }) {
  const bars = [
    { label: "To Do", height: 72, color: config.accentColor },
    { label: "Active", height: 28, color: config.accentTertiary },
    { label: "Done", height: 52, color: config.accentSecondary },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {config.showLabel && (
        <span
          style={{
            fontSize: config.fontSize - 1,
            color: config.mutedColor,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Work Distribution
        </span>
      )}
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 90 }}
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 90,
                background: config.trackColor,
                borderRadius: "4px 4px 0 0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: bar.height,
                  background: bar.color,
                  transition: config.animated ? "height 0.6s ease" : "none",
                }}
              />
            </div>
            <span
              style={{
                fontSize: config.fontSize - 2,
                color: config.mutedColor,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorageStack({ config }: { config: ProgressConfig }) {
  const segments = [
    { label: "System", pct: 40, color: config.accentColor },
    { label: "Apps", pct: 30, color: config.accentTertiary },
    { label: "Media", pct: 15, color: config.accentSecondary },
    { label: "Free", pct: 15, color: config.trackColor },
  ];
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {config.showLabel && (
        <span
          style={{
            fontSize: config.fontSize - 1,
            color: config.mutedColor,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Storage Stack
        </span>
      )}
      <div
        style={{
          height: config.barHeight + 8,
          width: "100%",
          background: config.trackColor,
          borderRadius: 4,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {segments
          .filter((s) => s.label !== "Free")
          .map((seg, i) => (
            <div
              key={i}
              style={{
                height: "100%",
                width: `${seg.pct}%`,
                background: seg.color,
              }}
            />
          ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {segments
          .filter((s) => s.label !== "Free")
          .map((seg, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: seg.color,
                }}
              />
              <span
                style={{
                  fontSize: config.fontSize - 1,
                  color: config.mutedColor,
                }}
              >
                {seg.label}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function TaskProgress({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  const tasks = Math.round((pct / 100) * 3);
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <div
        style={{
          padding: 16,
          background: config.backgroundColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: config.borderRadius,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: config.showShadow ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: config.fontSize,
                fontWeight: 600,
                color: config.labelColor,
              }}
            >
              Data Migration
            </div>
            <div
              style={{
                fontSize: config.fontSize - 1,
                color: config.mutedColor,
              }}
            >
              Due Tomorrow
            </div>
          </div>
          <span style={{ fontSize: 20 }}>📋</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              height: config.barHeight,
              background: config.trackColor,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: config.accentColor,
                transition: config.animated ? "width 0.6s ease" : "none",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: config.fontSize - 1,
                color: config.accentColor,
                fontWeight: 600,
              }}
            >
              {tasks}/3 Tasks
            </span>
            {config.showValue && (
              <span
                style={{
                  fontSize: config.fontSize - 1,
                  color: config.mutedColor,
                }}
              >
                {pct}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GPUCapacity({ config }: { config: ProgressConfig }) {
  const pct = clamp(config.value);
  const used = ((pct / 100) * 10).toFixed(1);
  const size = config.ringSize * 0.75;
  const cx = size / 2;
  const r = cx - config.strokeWidth / 2 - 2;
  const circ = circumference(r);
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={config.accentColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: config.animated
                ? "stroke-dashoffset 0.7s ease"
                : "none",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: config.fontSize - 2,
              fontWeight: 700,
              color: config.valueColor,
            }}
          >
            GPU
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {config.showValue && (
          <span
            style={{
              fontSize: config.fontSize + 4,
              fontWeight: 700,
              color: config.labelColor,
            }}
          >
            {used} GB
          </span>
        )}
        {config.showLabel && (
          <span
            style={{ fontSize: config.fontSize - 1, color: config.mutedColor }}
          >
            / 10 GB Used
          </span>
        )}
      </div>
    </div>
  );
}

// ─── variant map ─────────────────────────────────────────────────────────────

const VARIANT_MAP: Record<
  ProgressVariant,
  React.FC<{ config: ProgressConfig }>
> = {
  linear: LinearStandard,
  ring: ClassicRing,
  processQueue: ProcessQueue,
  segmented: Segmented,
  percentageRing: PercentageRing,
  speedGauge: SpeedGauge,
  multiRing: MultiRing,
  levelLadder: LevelLadder,
  rhythmWave: RhythmWave,
  powerNode: PowerNode,
  iconPath: IconPath,
  donutThin: DonutThin,
  verticalFill: VerticalFill,
  glassFluid: GlassFluid,
  gamifiedXP: GamifiedXP,
  conversionFunnel: ConversionFunnel,
  workDistribution: WorkDistribution,
  storageStack: StorageStack,
  taskProgress: TaskProgress,
  gpuCapacity: GPUCapacity,
};

// ─── main preview ─────────────────────────────────────────────────────────────

export function ProgressPreview({ config }: ProgressPreviewProps) {
  const ActiveVariant = VARIANT_MAP[config.variant];

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes progress-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress-wave {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }
        @keyframes progress-wave-rot {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: 200,
          padding: 32,
          fontFamily: "'Instrument Sans', sans-serif",
        }}
      >
        <ActiveVariant config={config} />
      </div>
    </>
  );
}
