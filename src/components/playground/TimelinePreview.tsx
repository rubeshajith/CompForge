"use client";

import { useState } from "react";
import {
  TimelineConfig,
  TimelineMilestone,
  RiskLevel,
  defaultMilestones,
} from "@/lib/timelineConfig";

interface TimelinePreviewProps {
  config: TimelineConfig;
  milestones?: TimelineMilestone[];
}

function getRiskBadgeStyle(
  risk: RiskLevel,
  config: TimelineConfig,
): React.CSSProperties {
  const map: Record<RiskLevel, { background: string; color: string }> = {
    Low: { background: config.riskLowBackground, color: config.riskLowColor },
    Minimal: {
      background: config.riskMinimalBackground,
      color: config.riskMinimalColor,
    },
    Moderate: {
      background: config.riskModerateBackground,
      color: config.riskModerateColor,
    },
    High: {
      background: config.riskHighBackground,
      color: config.riskHighColor,
    },
    Critical: {
      background: config.riskCriticalBackground,
      color: config.riskCriticalColor,
    },
  };
  return map[risk];
}

function getDeltaColor(delta: string, config: TimelineConfig): string {
  if (delta.startsWith("+")) return config.deltaPositiveColor;
  if (delta.startsWith("-")) return config.deltaNegativeColor;
  return config.deltaNeutralColor;
}

export function TimelinePreview({
  config,
  milestones = defaultMilestones,
}: TimelinePreviewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    milestones[0]?.id ?? null,
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: config.fontSize,
      }}
    >
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "48px 72px 1fr 140px",
          gap: 12,
          padding: "0 16px 10px",
          borderBottom: `1px solid ${config.borderColor}`,
          marginBottom: 12,
        }}
      >
        {["Path", "Date", "Strategic Event", ""].map((h, i) => (
          <span
            key={i}
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: config.sectionLabelColor,
              fontFamily: "'DM Mono', monospace",
              ...(i === 3
                ? {
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    textAlign: "center" as const,
                    gap: 4,
                  }
                : {}),
            }}
          >
            {i === 3 ? (
              <>
                <span style={{ textAlign: "center" }}>Vol.</span>
                <span style={{ textAlign: "center" }}>Delta</span>
                <span style={{ textAlign: "center" }}>Risk</span>
              </>
            ) : (
              h
            )}
          </span>
        ))}
      </div>

      {/* Milestone rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {milestones.map((m, idx) => {
          const isExpanded = expandedId === m.id;
          const isFirst = idx === 0;
          const isLast = idx === milestones.length - 1;

          return (
            <div
              key={m.id}
              style={{
                background: config.rowBackground,
                border: `1px solid ${isExpanded ? config.rowHoverBorderColor : config.borderColor}`,
                borderRadius: config.borderRadius,
                overflow: "hidden",
                boxShadow: config.showShadow
                  ? "0 2px 8px rgba(0,0,0,0.35)"
                  : "none",
                transition: "border-color 0.2s",
              }}
            >
              {/* Row header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 72px 1fr 140px",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 16px",
                  background: isExpanded
                    ? config.headerStripBackground
                    : "transparent",
                  borderBottom: isExpanded
                    ? `1px solid ${config.expandedDividerColor}`
                    : "none",
                  cursor: "pointer",
                }}
              >
                {/* Path connector */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {!isFirst && (
                    <div
                      style={{
                        position: "absolute",
                        top: -30,
                        width: 1,
                        height: 30,
                        background: isExpanded
                          ? config.pathConnectorColor
                          : config.borderColor,
                        transition: "background 0.2s",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: config.iconBorderRadius,
                      background: isExpanded
                        ? config.iconActiveBackground
                        : config.iconIdleBackground,
                      border: `2px solid ${isExpanded ? config.pathConnectorColor : config.iconIdleBorderColor}`,
                      color: isExpanded
                        ? config.iconActiveColor
                        : config.iconIdleColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, lineHeight: 1 }}
                    >
                      {m.icon}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -30,
                        width: 1,
                        height: 30,
                        background: config.borderColor,
                      }}
                    />
                  )}
                </div>

                {/* Date */}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: isExpanded
                        ? config.dateActiveColor
                        : config.dateIdleColor,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.date}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: config.yearColor,
                    }}
                  >
                    {m.year}
                  </p>
                </div>

                {/* Event */}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: config.titleFontSize,
                      fontWeight: 600,
                      color: config.titleColor,
                      fontFamily: "'Syne', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: config.fontSize - 1,
                      color: config.subtitleColor,
                    }}
                  >
                    {m.subtitle}
                  </p>
                </div>

                {/* KPIs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      color: config.volatilityColor,
                    }}
                  >
                    {m.volatility}
                  </span>
                  <span
                    style={{
                      textAlign: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: getDeltaColor(m.delta, config),
                    }}
                  >
                    {m.delta}
                  </span>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontFamily: "'DM Mono', monospace",
                        ...getRiskBadgeStyle(m.risk, config),
                      }}
                    >
                      {m.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    padding: "20px 20px 20px 76px",
                    background: config.expandedRowBackground,
                    ...(config.animateExpand
                      ? { animation: "tlExpand 0.2s ease" }
                      : {}),
                  }}
                >
                  {/* Narrative */}
                  <div>
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: config.sectionLabelColor,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ◆ Narrative
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: config.fontSize,
                        color: config.narrativeTextColor,
                        lineHeight: 1.7,
                      }}
                    >
                      {m.narrative}
                    </p>
                  </div>

                  {/* Impact */}
                  <div>
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: config.sectionLabelColor,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ◆ Impact Analysis
                    </p>
                    <div
                      style={{
                        background: config.impactCardBackground,
                        borderRadius: 10,
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {m.impactItems.map((item, i) => (
                        <div key={i}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: config.fontSize - 1,
                                color: config.impactLabelColor,
                              }}
                            >
                              {item.label}
                            </span>
                            <span
                              style={{
                                fontSize: config.fontSize - 1,
                                fontWeight: 700,
                                color: config.impactValueColor,
                                fontFamily: "'DM Mono', monospace",
                              }}
                            >
                              {item.value}
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 4,
                              borderRadius: 99,
                              background: config.impactBarTrackColor,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: item.barWidth,
                                height: "100%",
                                background: config.impactBarFillColor,
                                borderRadius: 99,
                                transition: "width 0.4s ease",
                              }}
                            />
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

      {/* Keyframe for expand animation */}
      <style>{`
        @keyframes tlExpand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
          font-family: 'Material Symbols Outlined';
        }
      `}</style>
    </div>
  );
}
