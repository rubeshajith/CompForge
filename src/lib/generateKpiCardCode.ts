// /lib/generateKpiCardCode.ts

import { KpiCardConfig } from "./kpiCardConfig";

export function generateKpiCardJSX(config: KpiCardConfig): string {
  const arrow = config.changeDirection === "up" ? "↑" : "↓";
  const badge = config.changeDirection === "up" ? "▲" : "▼";

  const chartJSX = (() => {
    switch (config.chartVariant) {
      case "sparkline":
        return `
      {/* Sparkline */}
      <svg className="kpi__chart-svg" viewBox="0 0 280 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="kpiAreaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="${config.accentColor}" stopOpacity="0.25" />
            <stop offset="100%" stopColor="${config.accentColor}" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="kpi__chart-area" d="M 4,52 L 30,36 L 52,46 L 75,28 L 100,40 L 122,24 L 148,32 L 170,28 L 196,18 L 218,8 L 244,8 L 268,16 L 276,12 L 276,64 L 4,64 Z" />
        <path className="kpi__chart-line" d="M 4,52 L 30,36 L 52,46 L 75,28 L 100,40 L 122,24 L 148,32 L 170,28 L 196,18 L 218,8 L 244,8 L 268,16 L 276,12" />
        <circle className="kpi__chart-dot" cx="276" cy="12" r="4" />
      </svg>`;

      case "bar":
        const barHeights = [40, 60, 50, 75, 55, 90, 70, 100];
        const barsHTML = barHeights
          .map(
            (h, i) =>
              `<div className="kpi__bar${i === barHeights.length - 1 ? " kpi__bar--accent" : ""}" style={{ height: "${h}%" }} />`
          )
          .join("\n          ");
        return `
      {/* Bar chart */}
      <div className="kpi__bars">
        ${barsHTML}
      </div>`;

      case "donut":
        return `
      {/* Donut chart */}
      <div className="kpi__donut-wrap">
        <svg className="kpi__donut-svg" viewBox="0 0 68 68">
          <circle className="kpi__donut-track" cx="34" cy="34" r="26" />
          <circle className="kpi__donut-fill" cx="34" cy="34" r="26"
            strokeDasharray="${Math.min(Math.abs(config.percentChange) * 3.5, 85) / 100 * 163.4} 163.4"
            strokeDashoffset="40.85"
          />
          <text className="kpi__donut-label" x="34" y="39" textAnchor="middle">${Math.round(Math.min(Math.abs(config.percentChange) * 3.5, 85))}%</text>
        </svg>
        <div className="kpi__donut-legend">
          <div className="kpi__legend-item">
            <span className="kpi__legend-dot kpi__legend-dot--primary" />
            <span className="kpi__legend-label">Direct</span>
            <span className="kpi__legend-value">65%</span>
          </div>
          <div className="kpi__legend-item">
            <span className="kpi__legend-dot kpi__legend-dot--secondary" />
            <span className="kpi__legend-label">Referral</span>
            <span className="kpi__legend-value">35%</span>
          </div>
        </div>
      </div>`;

      case "progress":
        return `
      {/* Progress chart */}
      <div className="kpi__progress-list">
        <div className="kpi__progress-item">
          <div className="kpi__progress-header">
            <span className="kpi__progress-label">Direct Store</span>
            <span className="kpi__progress-val">302</span>
          </div>
          <div className="kpi__progress-track">
            <div className="kpi__progress-fill kpi__progress-fill--primary" style={{ width: "62%" }} />
          </div>
        </div>
        <div className="kpi__progress-item">
          <div className="kpi__progress-header">
            <span className="kpi__progress-label">Referral</span>
            <span className="kpi__progress-val">184</span>
          </div>
          <div className="kpi__progress-track">
            <div className="kpi__progress-fill kpi__progress-fill--secondary" style={{ width: "38%" }} />
          </div>
        </div>
      </div>`;

      case "area":
        return `
      {/* Area chart (dual series) */}
      <svg className="kpi__chart-svg" viewBox="0 0 280 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="kpiAreaA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="${config.accentColor}" stopOpacity="0.3" />
            <stop offset="100%" stopColor="${config.accentColor}" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="kpiAreaB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="${config.accentColor}" stopOpacity="0.12" />
            <stop offset="100%" stopColor="${config.accentColor}" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="kpi__area-b" d="M 4,55 L 28,47 L 53,50 L 78,43 L 103,49 L 128,38 L 153,44 L 178,37 L 203,32 L 228,25 L 253,28 L 276,20 L 276,64 L 4,64 Z" />
        <path className="kpi__line-b" d="M 4,55 L 28,47 L 53,50 L 78,43 L 103,49 L 128,38 L 153,44 L 178,37 L 203,32 L 228,25 L 253,28 L 276,20" />
        <path className="kpi__area-a" d="M 4,46 L 28,36 L 53,42 L 78,28 L 103,38 L 128,20 L 153,30 L 178,22 L 203,14 L 228,4 L 253,10 L 276,4 L 276,64 L 4,64 Z" />
        <path className="kpi__line-a" d="M 4,46 L 28,36 L 53,42 L 78,28 L 103,38 L 128,20 L 153,30 L 178,22 L 203,14 L 228,4 L 253,10 L 276,4" />
      </svg>`;
    }
  })();

  return `import { useEffect, useRef } from "react";
import "./KpiCard.css";

export function KpiCard({ onValueChange }) {
  return (
    <div className="kpi">
      {/* Header */}
      <div className="kpi__header">
        <span className="kpi__label">${config.label}</span>
        ${config.showBadge ? `<span className="kpi__badge">${badge} ${Math.abs(config.percentChange)}%</span>` : ""}
      </div>

      {/* Value */}
      <div className="kpi__body">
        <div className="kpi__value">${config.value}</div>
        <div className="kpi__sub">
          <span className="kpi__change kpi__change--${config.changeDirection}">${arrow} ${Math.abs(config.percentChange)}%</span>
          <span className="kpi__sub-text">${config.subText}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="kpi__chart">${chartJSX}
      </div>
    </div>
  );
}
`;
}

export function generateKpiCardCSS(config: KpiCardConfig): string {
  const glowFilter = config.glowEffect
    ? `filter: drop-shadow(0 0 6px ${config.accentColor});`
    : "";

  return `.kpi {
  background: ${config.cardBackground};
  border: 1px solid ${config.cardBorderColor};
  border-radius: ${config.cardBorderRadius}px;
  width: ${config.cardWidth}px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Instrument Sans', sans-serif;
  ${config.showShadow ? "box-shadow: 0 8px 40px rgba(0,0,0,0.45);" : ""}
}

/* Header */
.kpi__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi__label {
  font-size: ${config.fontSize}px;
  color: ${config.labelColor};
  font-weight: 500;
  letter-spacing: 0.02em;
}

.kpi__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${config.badgeColor};
  color: ${config.badgeTextColor};
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 700;
  font-family: 'DM Mono', monospace;
}

/* Value */
.kpi__body { display: flex; flex-direction: column; gap: 4px; }

.kpi__value {
  font-size: 36px;
  font-weight: 800;
  color: ${config.valueColor};
  font-family: 'Syne', sans-serif;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.kpi__sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: 'DM Mono', monospace;
}

.kpi__change--up   { color: ${config.accentColor}; font-weight: 600; }
.kpi__change--down { color: #f87171; font-weight: 600; }
.kpi__sub-text     { color: ${config.subTextColor}; font-weight: 400; }

/* Chart container */
.kpi__chart { width: 100%; }

/* ── Sparkline / Area ─────────────────────────────── */
.kpi__chart-svg {
  width: 100%;
  height: 64px;
  overflow: visible;
}

.kpi__chart-area {
  fill: url(#kpiAreaGrad);
}

.kpi__chart-line {
  fill: none;
  stroke: ${config.accentColor};
  stroke-width: 2.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  ${glowFilter}
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: kpiDash 1.4s cubic-bezier(0.4,0,0.2,1) forwards;
}

.kpi__chart-dot {
  fill: ${config.accentColor};
  ${glowFilter}
  opacity: 0;
  animation: kpiFadeIn 0.3s ease 1.2s forwards;
}

@keyframes kpiDash { to { stroke-dashoffset: 0; } }
@keyframes kpiFadeIn { to { opacity: 1; } }

/* ── Area dual series ─────────────────────────────── */
.kpi__area-a { fill: url(#kpiAreaA); }
.kpi__area-b { fill: url(#kpiAreaB); }

.kpi__line-a {
  fill: none;
  stroke: ${config.accentColor};
  stroke-width: 2.5px;
  stroke-linecap: round;
  ${glowFilter}
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: kpiDash 1.4s ease forwards;
}

.kpi__line-b {
  fill: none;
  stroke: ${config.accentColor};
  stroke-width: 1.5px;
  stroke-opacity: 0.4;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: kpiDash 1.6s ease 0.2s forwards;
}

/* ── Bar chart ────────────────────────────────────── */
.kpi__bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 64px;
  width: 100%;
}

.kpi__bar {
  flex: 1;
  border-radius: 4px;
  background: ${config.accentColorDim};
  height: 0;
  animation: kpiBarGrow 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
}

.kpi__bar--accent {
  background: ${config.accentColor};
  ${glowFilter}
}

@keyframes kpiBarGrow { to { height: var(--h, 100%); } }

/* ── Donut ────────────────────────────────────────── */
.kpi__donut-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kpi__donut-svg { width: 68px; height: 68px; }

.kpi__donut-track {
  fill: none;
  stroke: ${config.chartTrackColor};
  stroke-width: 8;
}

.kpi__donut-fill {
  fill: none;
  stroke: ${config.accentColor};
  stroke-width: 8;
  stroke-linecap: round;
  ${glowFilter}
  stroke-dasharray: 0 163.4;
  animation: kpiDonut 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
}

.kpi__donut-label {
  font-size: 12px;
  font-weight: 700;
  fill: ${config.valueColor};
  font-family: 'DM Mono', monospace;
}

@keyframes kpiDonut {
  to { stroke-dasharray: ${Math.min(Math.abs(config.percentChange) * 3.5, 85) / 100 * 163.4} 163.4; }
}

.kpi__donut-legend { display: flex; flex-direction: column; gap: 8px; }

.kpi__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-family: 'Instrument Sans', sans-serif;
}

.kpi__legend-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kpi__legend-dot--primary   { background: ${config.accentColor}; }
.kpi__legend-dot--secondary { background: ${config.accentColorDim}; }
.kpi__legend-label { color: ${config.subTextColor}; }
.kpi__legend-value { color: ${config.labelColor}; font-family: 'DM Mono', monospace; margin-left: auto; }

/* ── Progress ─────────────────────────────────────── */
.kpi__progress-list { display: flex; flex-direction: column; gap: 10px; }

.kpi__progress-item { display: flex; flex-direction: column; gap: 4px; }

.kpi__progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi__progress-label { font-size: 11px; color: ${config.subTextColor}; font-family: 'Instrument Sans', sans-serif; }
.kpi__progress-val   { font-size: 11px; color: ${config.valueColor}; font-family: 'DM Mono', monospace; }

.kpi__progress-track {
  height: 6px;
  background: ${config.chartTrackColor};
  border-radius: 99px;
  overflow: hidden;
}

.kpi__progress-fill {
  height: 100%;
  border-radius: 99px;
  width: 0;
  animation: kpiProgress 1s cubic-bezier(0.34,1.56,0.64,1) forwards;
}

.kpi__progress-fill--primary {
  background: ${config.accentColor};
  ${glowFilter}
  animation-delay: 0ms;
}

.kpi__progress-fill--secondary {
  background: ${config.accentColorDim};
  animation-delay: 200ms;
}

@keyframes kpiProgress { to { width: var(--w, 100%); } }
`;
}
