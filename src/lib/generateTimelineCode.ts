// lib/generateTimelineCode.ts
import {
  TimelineConfig,
  TimelineMilestone,
  RiskLevel,
  defaultMilestones,
} from "./timelineConfig";

// ─── Helper ──────────────────────────────────────────────────────────────────
function getRiskColors(
  risk: RiskLevel,
  config: TimelineConfig,
): { bg: string; color: string } {
  const map: Record<RiskLevel, { bg: string; color: string }> = {
    Low: { bg: config.riskLowBackground, color: config.riskLowColor },
    Minimal: {
      bg: config.riskMinimalBackground,
      color: config.riskMinimalColor,
    },
    Moderate: {
      bg: config.riskModerateBackground,
      color: config.riskModerateColor,
    },
    High: { bg: config.riskHighBackground, color: config.riskHighColor },
    Critical: {
      bg: config.riskCriticalBackground,
      color: config.riskCriticalColor,
    },
  };
  return map[risk];
}

// ─── JSX Generator ───────────────────────────────────────────────────────────
export function generateTimelineJSX(
  config: TimelineConfig,
  milestones: TimelineMilestone[] = defaultMilestones,
): string {
  const riskMap = Object.fromEntries(
    (["Low", "Minimal", "Moderate", "High", "Critical"] as RiskLevel[]).map(
      (r) => {
        const { bg, color } = getRiskColors(r, config);
        return [r, { bg, color }];
      },
    ),
  );

  const milestonesJSON = JSON.stringify(milestones, null, 2);

  return `import { useState } from "react";
import "./Timeline.css";

const MILESTONES = ${milestonesJSON};

const RISK_COLORS = {
  Low:      { bg: "${riskMap.Low.bg}",      color: "${riskMap.Low.color}" },
  Minimal:  { bg: "${riskMap.Minimal.bg}",  color: "${riskMap.Minimal.color}" },
  Moderate: { bg: "${riskMap.Moderate.bg}", color: "${riskMap.Moderate.color}" },
  High:     { bg: "${riskMap.High.bg}",     color: "${riskMap.High.color}" },
  Critical: { bg: "${riskMap.Critical.bg}", color: "${riskMap.Critical.color}" },
};

function getDeltaColor(delta) {
  if (delta.startsWith("+")) return "${config.deltaPositiveColor}";
  if (delta.startsWith("-")) return "${config.deltaNegativeColor}";
  return "${config.deltaNeutralColor}";
}

export default function Timeline({ onMilestoneExpand }) {
  const [expandedId, setExpandedId] = useState(MILESTONES[0]?.id ?? null);

  function toggle(id) {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    if (onMilestoneExpand) onMilestoneExpand(next);
  }

  return (
    <div className="tl-wrap">
      {/* Column headers */}
      <div className="tl__headers">
        <span className="tl__col-label">Path</span>
        <span className="tl__col-label">Date</span>
        <span className="tl__col-label">Strategic Event</span>
        <div className="tl__kpi-headers">
          <span>Vol.</span>
          <span>Delta</span>
          <span>Risk</span>
        </div>
      </div>

      {/* Rows */}
      <div className="tl__rows">
        {MILESTONES.map((m, idx) => {
          const isExpanded = expandedId === m.id;
          const isFirst = idx === 0;
          const isLast = idx === MILESTONES.length - 1;
          const riskStyle = RISK_COLORS[m.risk] || RISK_COLORS.Minimal;

          return (
            <div
              key={m.id}
              className={"tl__row" + (isExpanded ? " tl__row--expanded" : "")}
            >
              {/* Row header */}
              <div
                className="tl__row-header"
                onClick={() => toggle(m.id)}
              >
                {/* Path connector */}
                <div className="tl__path">
                  {!isFirst && (
                    <div
                      className="tl__connector tl__connector--top"
                      style={{ background: isExpanded ? "${config.pathConnectorColor}" : "${config.borderColor}" }}
                    />
                  )}
                  <div
                    className={"tl__icon" + (isExpanded ? " tl__icon--active" : "")}
                  >
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>
                  {!isLast && (
                    <div
                      className="tl__connector tl__connector--bottom"
                      style={{ background: "${config.borderColor}" }}
                    />
                  )}
                </div>

                {/* Date */}
                <div className="tl__date">
                  <p className={"tl__date-main" + (isExpanded ? " tl__date-main--active" : "")}>
                    {m.date}
                  </p>
                  <p className="tl__date-year">{m.year}</p>
                </div>

                {/* Event */}
                <div className="tl__event">
                  <h3 className="tl__event-title">{m.title}</h3>
                  <p className="tl__event-sub">{m.subtitle}</p>
                </div>

                {/* KPIs */}
                <div className="tl__kpis">
                  <span className="tl__kpi-vol">{m.volatility}</span>
                  <span className="tl__kpi-delta" style={{ color: getDeltaColor(m.delta) }}>
                    {m.delta}
                  </span>
                  <div className="tl__kpi-risk-wrap">
                    <span
                      className="tl__risk-badge"
                      style={{ background: riskStyle.bg, color: riskStyle.color }}
                    >
                      {m.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="tl__panel">
                  <div className="tl__panel-section">
                    <p className="tl__section-label">◆ Narrative</p>
                    <p className="tl__narrative">{m.narrative}</p>
                  </div>
                  <div className="tl__panel-section">
                    <p className="tl__section-label">◆ Impact Analysis</p>
                    <div className="tl__impact-card">
                      {m.impactItems.map((item, i) => (
                        <div key={i} className="tl__impact-item">
                          <div className="tl__impact-row">
                            <span className="tl__impact-label">{item.label}</span>
                            <span className="tl__impact-value">{item.value}</span>
                          </div>
                          <div className="tl__bar-track">
                            <div className="tl__bar-fill" style={{ width: item.barWidth }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;
}

// ─── CSS Generator ───────────────────────────────────────────────────────────
export function generateTimelineCSS(config: TimelineConfig): string {
  return `/* Timeline.css — generated by CompForge */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
  font-family: 'Material Symbols Outlined';
}

/* ── Wrapper ─────────────────────────────────────────────────────────── */
.tl-wrap {
  width: 100%;
  max-width: 760px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: ${config.fontSize}px;
}

/* ── Column headers ───────────────────────────────────────────────────── */
.tl__headers {
  display: grid;
  grid-template-columns: 48px 72px 1fr 140px;
  gap: 12px;
  padding: 0 16px 10px;
  border-bottom: 1px solid ${config.borderColor};
  margin-bottom: 12px;
}
.tl__col-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${config.sectionLabelColor};
}
.tl__kpi-headers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${config.sectionLabelColor};
  text-align: center;
}

/* ── Row list ─────────────────────────────────────────────────────────── */
.tl__rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Single row ───────────────────────────────────────────────────────── */
.tl__row {
  background: ${config.rowBackground};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  overflow: hidden;
  ${config.showShadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.35);" : ""}
  transition: border-color 0.2s;
}
.tl__row:hover {
  border-color: ${config.rowHoverBorderColor};
  cursor: pointer;
}
.tl__row--expanded {
  border-color: ${config.rowHoverBorderColor};
}

/* ── Row header (the always-visible strip) ────────────────────────────── */
.tl__row-header {
  display: grid;
  grid-template-columns: 48px 72px 1fr 140px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: transparent;
  border-bottom: none;
  cursor: pointer;
}
.tl__row--expanded .tl__row-header {
  background: ${config.headerStripBackground};
  border-bottom: 1px solid ${config.expandedDividerColor};
}

/* ── Path connector ───────────────────────────────────────────────────── */
.tl__path {
  display: flex;
  justify-content: center;
  position: relative;
}
.tl__connector {
  position: absolute;
  width: 1px;
  height: 30px;
}
.tl__connector--top  { top: -30px; }
.tl__connector--bottom { bottom: -30px; }

.tl__icon {
  width: 32px;
  height: 32px;
  border-radius: ${config.iconBorderRadius}%;
  background: ${config.iconIdleBackground};
  border: 2px solid ${config.iconIdleBorderColor};
  color: ${config.iconIdleColor};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s;
  font-size: 16px;
}
.tl__icon--active {
  background: ${config.iconActiveBackground};
  border-color: ${config.pathConnectorColor};
  color: ${config.iconActiveColor};
}

/* ── Date ─────────────────────────────────────────────────────────────── */
.tl__date {}
.tl__date-main {
  margin: 0;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${config.dateIdleColor};
  line-height: 1.4;
  transition: color 0.2s;
}
.tl__date-main--active {
  color: ${config.dateActiveColor};
}
.tl__date-year {
  margin: 0;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: ${config.yearColor};
}

/* ── Event ────────────────────────────────────────────────────────────── */
.tl__event {}
.tl__event-title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: ${config.titleFontSize}px;
  font-weight: 600;
  color: ${config.titleColor};
  line-height: 1.3;
}
.tl__event-sub {
  margin: 3px 0 0;
  font-size: ${config.fontSize - 1}px;
  color: ${config.subtitleColor};
}

/* ── KPIs ─────────────────────────────────────────────────────────────── */
.tl__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 4px;
}
.tl__kpi-vol {
  text-align: center;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: ${config.volatilityColor};
}
.tl__kpi-delta {
  text-align: center;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.tl__kpi-risk-wrap {
  display: flex;
  justify-content: center;
}
.tl__risk-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Expanded panel ───────────────────────────────────────────────────── */
.tl__panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px 20px 20px 76px;
  background: ${config.expandedRowBackground};
  ${config.animateExpand ? "animation: tlExpand 0.2s ease;" : ""}
}
@keyframes tlExpand {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tl__panel-section {}

.tl__section-label {
  margin: 0 0 10px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${config.sectionLabelColor};
}

.tl__narrative {
  margin: 0;
  font-size: ${config.fontSize}px;
  color: ${config.narrativeTextColor};
  line-height: 1.7;
}

/* Impact card */
.tl__impact-card {
  background: ${config.impactCardBackground};
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tl__impact-item {}
.tl__impact-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.tl__impact-label {
  font-size: ${config.fontSize - 1}px;
  color: ${config.impactLabelColor};
}
.tl__impact-value {
  font-family: 'DM Mono', monospace;
  font-size: ${config.fontSize - 1}px;
  font-weight: 700;
  color: ${config.impactValueColor};
}
.tl__bar-track {
  width: 100%;
  height: 4px;
  border-radius: 99px;
  background: ${config.impactBarTrackColor};
  overflow: hidden;
}
.tl__bar-fill {
  height: 100%;
  border-radius: 99px;
  background: ${config.impactBarFillColor};
  transition: width 0.4s ease;
}
`;
}
