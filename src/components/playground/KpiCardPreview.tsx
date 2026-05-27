"use client";

// /components/playground/KpiCardPreview.tsx

import { useEffect, useRef, useState } from "react";
import { KpiCardConfig } from "@/lib/kpiCardConfig";

interface Props {
  config: KpiCardConfig;
}

// ─── Sparkline chart ───────────────────────────────────────────────────────────
function SparklineChart({ config }: { config: KpiCardConfig }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [animated, setAnimated] = useState(false);

  const points = [28, 45, 32, 55, 38, 60, 48, 52, 44, 68, 55, 72, 50, 78, 62, 85];
  const w = 280;
  const h = 64;
  const pad = 4;

  const coords = points.map((v, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v / 100) * (h - pad * 2));
    return [x, y];
  });

  const linePath =
    "M " + coords.map(([x, y]) => `${x},${y}`).join(" L ");
  const areaPath =
    linePath + ` L ${coords[coords.length - 1][0]},${h} L ${coords[0][0]},${h} Z`;

  useEffect(() => {
    if (!config.animateChart) { setAnimated(true); return; }
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [config.animateChart, config.chartVariant]);

  const pathLen = 600;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="kpi-area-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
        </linearGradient>
        {config.glowEffect && (
          <filter id="kpi-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <path d={areaPath} fill="url(#kpi-area-grad)" />
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke={config.accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={config.glowEffect ? "url(#kpi-glow)" : undefined}
        style={{
          strokeDasharray: pathLen,
          strokeDashoffset: animated ? 0 : pathLen,
          transition: config.animateChart ? "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" : "none",
        }}
      />
      {/* Last dot */}
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="4"
        fill={config.accentColor}
        filter={config.glowEffect ? "url(#kpi-glow)" : undefined}
        style={{ opacity: animated ? 1 : 0, transition: "opacity 0.3s ease 1.2s" }}
      />
    </svg>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ config }: { config: KpiCardConfig }) {
  const [animated, setAnimated] = useState(false);
  const bars = [0.4, 0.6, 0.5, 0.75, 0.55, 0.9, 0.7, 1.0];

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [config.chartVariant]);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64, width: "100%" }}>
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: 4,
            background: i === bars.length - 1 ? config.accentColor : config.accentColorDim,
            height: animated ? `${v * 100}%` : "4px",
            transition: config.animateChart
              ? `height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms`
              : "none",
            filter: i === bars.length - 1 && config.glowEffect
              ? `drop-shadow(0 0 6px ${config.accentColor})`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ config }: { config: KpiCardConfig }) {
  const [animated, setAnimated] = useState(false);
  const pct = Math.min(Math.abs(config.percentChange) * 3.5, 85) / 100;
  const r = 26;
  const cx = 34;
  const cy = 34;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [config.chartVariant, config.percentChange]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={68} height={68} viewBox="0 0 68 68">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={config.chartTrackColor} strokeWidth="8" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={config.accentColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${animated ? dash : 0} ${circ}`}
          strokeDashoffset={circ / 4}
          filter={config.glowEffect ? `drop-shadow(0 0 4px ${config.accentColor})` : undefined}
          style={{ transition: config.animateChart ? "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" : "none" }}
        />
        <text
          x={cx} y={cy + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={config.valueColor}
          fontFamily="DM Mono, monospace"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { label: "Direct", pct: 65, color: config.accentColor },
          { label: "Referral", pct: 35, color: config.accentColorDim.replace("33", "80") },
        ].map((seg) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: config.subTextColor, fontFamily: "Instrument Sans, sans-serif" }}>
              {seg.label}
            </span>
            <span style={{ fontSize: 11, color: config.labelColor, fontFamily: "DM Mono, monospace", marginLeft: "auto" }}>
              {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Progress bar chart ───────────────────────────────────────────────────────
function ProgressChart({ config }: { config: KpiCardConfig }) {
  const [animated, setAnimated] = useState(false);
  const fillPct = 42;

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [config.chartVariant]);

  const segments = [
    { label: "Direct Store", value: 302, pct: 62, color: config.accentColor },
    { label: "Referral", value: 184, pct: 38, color: config.accentColorDim.replace("33", "66") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: config.subTextColor, fontFamily: "Instrument Sans, sans-serif" }}>
              {seg.label}
            </span>
            <span style={{ fontSize: 11, color: config.valueColor, fontFamily: "DM Mono, monospace" }}>
              {seg.value.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 6, background: config.chartTrackColor, borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animated ? `${seg.pct}%` : "0%",
              background: seg.color,
              borderRadius: 99,
              filter: config.glowEffect && i === 0 ? `drop-shadow(0 0 4px ${config.accentColor})` : undefined,
              transition: config.animateChart
                ? `width 1s cubic-bezier(0.34,1.56,0.64,1) ${i * 200}ms`
                : "none",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Area mini chart ──────────────────────────────────────────────────────────
function AreaChart({ config }: { config: KpiCardConfig }) {
  const [animated, setAnimated] = useState(false);

  // Two series
  const s1 = [30, 45, 35, 55, 42, 60, 50, 65, 58, 72, 65, 80];
  const s2 = [20, 30, 25, 38, 28, 45, 35, 48, 42, 55, 48, 62];
  const w = 280; const h = 64; const pad = 4;

  function toPath(pts: number[]) {
    const coords = pts.map((v, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v / 100) * (h - pad * 2));
      return [x, y];
    });
    const line = "M " + coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
    const area = line + ` L ${coords[coords.length - 1][0]},${h} L ${coords[0][0]},${h} Z`;
    return { line, area, coords };
  }

  const p1 = toPath(s1);
  const p2 = toPath(s2);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [config.chartVariant]);

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="kpi-area2a" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kpi-area2b" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
        </linearGradient>
        {config.glowEffect && (
          <filter id="kpi-glow2">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <path d={p2.area} fill="url(#kpi-area2b)" />
      <path d={p2.line} fill="none" stroke={config.accentColor} strokeWidth="1.5" strokeOpacity="0.4"
        style={{
          strokeDasharray: 500,
          strokeDashoffset: animated ? 0 : 500,
          transition: config.animateChart ? "stroke-dashoffset 1.6s ease 0.2s" : "none",
        }}
      />
      <path d={p1.area} fill="url(#kpi-area2a)" />
      <path d={p1.line} fill="none" stroke={config.accentColor} strokeWidth="2.5" strokeLinecap="round"
        filter={config.glowEffect ? "url(#kpi-glow2)" : undefined}
        style={{
          strokeDasharray: 500,
          strokeDashoffset: animated ? 0 : 500,
          transition: config.animateChart ? "stroke-dashoffset 1.4s ease" : "none",
        }}
      />
    </svg>
  );
}

// ─── Main preview ─────────────────────────────────────────────────────────────
export function KpiCardPreview({ config }: Props) {
  const card: React.CSSProperties = {
    background: config.cardBackground,
    border: `1px solid ${config.cardBorderColor}`,
    borderRadius: config.cardBorderRadius,
    width: config.cardWidth,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: config.showShadow ? "0 8px 40px rgba(0,0,0,0.45)" : "none",
    fontFamily: "Instrument Sans, sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: config.badgeColor,
    color: config.badgeTextColor,
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "DM Mono, monospace",
  };

  return (
    <div style={card}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: config.fontSize, color: config.labelColor, fontWeight: 500, letterSpacing: "0.02em" }}>
          {config.label}
        </span>
        {config.showBadge && (
          <span style={badgeStyle}>
            {config.changeDirection === "up" ? "▲" : "▼"} {Math.abs(config.percentChange)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <div style={{
          fontSize: 36,
          fontWeight: 800,
          color: config.valueColor,
          fontFamily: "Syne, sans-serif",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}>
          {config.value}
        </div>
        {config.subText && (
          <div style={{
            fontSize: 11,
            color: config.changeDirection === "up" ? config.accentColor : "#f87171",
            fontWeight: 600,
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "DM Mono, monospace",
          }}>
            <span>{config.changeDirection === "up" ? "↑" : "↓"} {Math.abs(config.percentChange)}%</span>
            <span style={{ color: config.subTextColor, fontWeight: 400 }}>{config.subText}</span>
          </div>
        )}
      </div>

      {/* Chart area */}
      <div style={{ marginTop: 4 }}>
        {config.chartVariant === "sparkline" && <SparklineChart config={config} />}
        {config.chartVariant === "bar" && <BarChart config={config} />}
        {config.chartVariant === "donut" && <DonutChart config={config} />}
        {config.chartVariant === "progress" && <ProgressChart config={config} />}
        {config.chartVariant === "area" && <AreaChart config={config} />}
      </div>
    </div>
  );
}
