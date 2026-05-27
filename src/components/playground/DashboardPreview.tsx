"use client";

import { DashboardConfig } from "@/lib/dashboardConfig";
import { useEffect, useRef } from "react";

interface DashboardPreviewProps {
  config: DashboardConfig;
}

// Derive full palette from a single accent color
function deriveTheme(accent: string) {
  return {
    accent,
    accentAlpha10: accent + "1a",
    accentAlpha20: accent + "33",
    accentAlpha30: accent + "4d",
    accentAlpha60: accent + "99",
    glow: `drop-shadow(0 0 8px ${accent}99)`,
    glowBox: `0 0 12px ${accent}55`,
  };
}

const STYLE_ID = "db-preview-styles";

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @keyframes dash { to { stroke-dashoffset: 0; } }
  .dash-anim {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 3s ease-out forwards;
  }
`;

export function DashboardPreview({ config }: DashboardPreviewProps) {
  const theme = deriveTheme(config.accentColor);
  const chartRef = useRef<SVGPathElement>(null);
  const chart2Ref = useRef<SVGPathElement>(null);

  // Inject styles via DOM to avoid SSR hydration mismatch
  useEffect(() => {
    let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = STYLE_ID;
      document.head.appendChild(tag);
    }
    tag.textContent = BASE_CSS;
    return () => {
      // Leave the tag in place; removing causes flicker on re-render
    };
  }, []);

  useEffect(() => {
    // Re-trigger draw animation when accent changes
    [chartRef, chart2Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = "none";
        void ref.current.offsetWidth;
        ref.current.style.animation = "dash 3s ease-out forwards";
      }
    });
  }, [config.accentColor]);

  const s: Record<string, React.CSSProperties> = {
    root: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#0a0a0a",
      color: "#f9f9ff",
      display: "flex",
      minHeight: "100%",
      width: "100%",
      overflow: "hidden",
    },
    aside: {
      width: 220,
      flexShrink: 0,
      backgroundColor: "#121212",
      borderRight: "1px solid #2a2a2a",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 20px 28px",
    },
    logoIcon: {
      width: 30,
      height: 30,
      backgroundColor: theme.accent,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    logoText: {
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: "-0.02em",
      color: "#f9f9ff",
    },
    navItem: (active: boolean): React.CSSProperties => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 20px",
      margin: "1px 8px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      color: active ? theme.accent : "#737685",
      backgroundColor: active ? theme.accentAlpha10 : "transparent",
      borderLeft: active
        ? `3px solid ${theme.accent}`
        : "3px solid transparent",
      transition: "all 0.15s",
    }),
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0a0a0a",
      minWidth: 0,
    },
    header: {
      height: 52,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 24px",
      borderBottom: "1px solid #1e1e1e",
      backgroundColor: "rgba(10,10,10,0.85)",
      backdropFilter: "blur(10px)",
      flexShrink: 0,
    },
    pageTitle: {
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: "0.1em",
      color: "#f9f9ff",
      opacity: 0.5,
      textTransform: "uppercase" as const,
    },
    searchWrap: {
      position: "relative" as const,
    },
    searchInput: {
      backgroundColor: "#1e1e1e",
      border: "none",
      borderRadius: 9999,
      padding: "6px 14px 6px 32px",
      fontSize: 11,
      color: "#f9f9ff",
      width: 200,
      outline: "none",
    },
    searchIcon: {
      position: "absolute" as const,
      left: 10,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 14,
      color: "#737685",
    },
    canvas: {
      flex: 1,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      overflowY: "auto" as const,
    },
    glassCard: {
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(18,18,18,0.85)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 14,
      padding: 24,
    },
    heroMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    heroLabel: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: "#737685",
      fontSize: 12,
      marginBottom: 8,
    },
    heroAmount: {
      fontSize: 48,
      fontWeight: 900,
      color: "#f9f9ff",
      lineHeight: 1,
      letterSpacing: "-0.03em",
    },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      backgroundColor: theme.accentAlpha20,
      color: theme.accent,
      padding: "2px 8px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      marginLeft: 12,
    },
    bentoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
    },
    kpiCard: {
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(18,18,18,0.85)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 14,
      padding: 18,
      display: "flex",
      flexDirection: "column" as const,
    },
    kpiLabel: {
      fontSize: 11,
      color: "#737685",
      fontWeight: 500,
      marginBottom: 10,
    },
    kpiValue: {
      fontSize: 26,
      fontWeight: 800,
      color: "#f9f9ff",
      letterSpacing: "-0.02em",
      lineHeight: 1,
    },
    kpiDelta: {
      fontSize: 11,
      fontWeight: 700,
      color: theme.accent,
      marginTop: 4,
    },
    splitGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 14,
    },
    bottomGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 14,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#f9f9ff",
      marginBottom: 4,
    },
    sectionSub: {
      fontSize: 10,
      color: "#737685",
      marginBottom: 18,
    },
    legend: {
      display: "flex",
      gap: 14,
    },
    legendDot: (color: string, dashed?: boolean): React.CSSProperties => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: dashed ? "transparent" : color,
      border: dashed ? `2px dashed ${color}` : "none",
      flexShrink: 0,
    }),
    legendLabel: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 10,
      fontWeight: 700,
      color: "#f9f9ff",
    },
    barRegion: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 14,
    },
    regionRow: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 5,
    },
    regionMeta: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
      color: "#737685",
    },
    regionAmt: { color: "#f9f9ff" },
    barTrack: {
      height: 10,
      backgroundColor: "#232323",
      borderRadius: 999,
      overflow: "hidden",
    },
    activityItem: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
    },
    activityIcon: (accent: boolean): React.CSSProperties => ({
      width: 34,
      height: 34,
      borderRadius: "50%",
      backgroundColor: accent ? theme.accentAlpha20 : "rgba(90,90,90,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 15,
    }),
    activityTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: "#f9f9ff",
      marginBottom: 2,
    },
    activitySub: {
      fontSize: 10,
      color: "#737685",
    },
    activityTime: {
      fontSize: 9,
      fontWeight: 700,
      color: "#4a4a5a",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginTop: 3,
    },
    viewLogBtn: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#1e1e1e",
      border: "1px solid #2a2a2a",
      borderRadius: 10,
      color: "#f9f9ff",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "auto",
    },
    donutWrap: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: 16,
    },
    channelRow: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      fontSize: 11,
    },
  };

  const regions = [
    { name: "North America", amount: "$142,500", pct: 85, opacity: 1 },
    { name: "European Union", amount: "$98,200", pct: 60, opacity: 0.7 },
    { name: "Asia Pacific", amount: "$76,400", pct: 45, opacity: 0.5 },
    { name: "Latin America", amount: "$34,100", pct: 22, opacity: 0.3 },
    { name: "Middle East & Africa", amount: "$12,800", pct: 10, opacity: 0.2 },
  ];

  const channels = [
    {
      label: "Organic Search",
      pct: "45%",
      cx: 50,
      cy: 50,
      r: 40,
      dash: 45,
      offset: 0,
      color: theme.accent,
    },
    {
      label: "Paid Advertising",
      pct: "25%",
      cx: 50,
      cy: 50,
      r: 40,
      dash: 25,
      offset: -45,
      color: theme.accentAlpha60,
    },
    {
      label: "Social Media",
      pct: "20%",
      cx: 50,
      cy: 50,
      r: 40,
      dash: 20,
      offset: -70,
      color: theme.accentAlpha30,
    },
    {
      label: "Direct Referral",
      pct: "10%",
      cx: 50,
      cy: 50,
      r: 40,
      dash: 10,
      offset: -90,
      color: theme.accentAlpha10,
    },
  ];

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.aside}>
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span style={s.logoText}>ArchitectCore</span>
        </div>
        <nav>
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "↗", label: "Analytics", active: false },
            { icon: "▤", label: "Projects", active: false },
            { icon: "⚇", label: "Team", active: false },
            { icon: "☰", label: "Reports", active: false },
          ].map((item) => (
            <div key={item.label} style={s.navItem(item.active)}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ marginTop: "auto" }}>
          {[
            { icon: "⚙", label: "Settings" },
            { icon: "?", label: "Support" },
          ].map((item) => (
            <div key={item.label} style={s.navItem(false)}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <header style={s.header}>
          <span style={s.pageTitle}>Overview</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={s.searchWrap}>
              <span style={s.searchIcon}>⌕</span>
              <input
                style={s.searchInput}
                placeholder="Global search..."
                readOnly
              />
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#2a2a2a",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: theme.accentAlpha30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: theme.accent,
                }}
              >
                A
              </div>
            </div>
          </div>
        </header>

        <div style={s.canvas}>
          {/* Hero KPI */}
          <div
            style={{ ...s.glassCard, position: "relative", overflow: "hidden" }}
          >
            <div style={s.heroMeta}>
              <div>
                <div style={s.heroLabel}>
                  <span style={{ color: theme.accent, fontSize: 14 }}>↗</span>
                  Monthly Profit Overview
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={s.heroAmount}>$456,789</span>
                  <span style={s.heroBadge}>▲ 16%</span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: 10,
                  color: "#737685",
                  fontWeight: 500,
                }}
              >
                <div>18 Dec — 18 Jan</div>
                <div style={{ opacity: 0.5, marginTop: 2 }}>Updated 2m ago</div>
              </div>
            </div>
            <div style={{ marginTop: 20, height: 160 }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 160"
                preserveAspectRatio="none"
                style={{ filter: `drop-shadow(0 0 8px ${theme.accent}99)` }}
              >
                <defs>
                  <linearGradient
                    id={`cg-${theme.accent.replace("#", "")}`}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={theme.accent}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={theme.accent}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  ref={chartRef}
                  className="dash-anim"
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70"
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70 L1000,160 L0,160 Z"
                  fill={`url(#cg-${theme.accent.replace("#", "")})`}
                />
              </svg>
            </div>
          </div>

          {/* KPI Bento */}
          <div style={s.bentoGrid}>
            {[
              {
                label: "Total Revenue",
                value: "$98,450",
                delta: "▲ 12.5%",
                bars: [2, 4, 6, 8],
              },
              {
                label: "Units Sold",
                value: "3,285",
                delta: "▲ 12.6%",
                bars: null,
                progress: 78,
              },
              {
                label: "New Customers",
                value: "486",
                delta: "▲ 4.2%",
                bars: null,
                progress: 72,
              },
              {
                label: "Purchase Rate",
                value: "45.2%",
                delta: "▲ 9.2%",
                bars: [6, 4, 5, 8],
              },
            ].map((kpi, i) => (
              <div key={i} style={s.kpiCard}>
                <div style={s.kpiLabel}>{kpi.label}</div>
                <div style={s.kpiValue}>{kpi.value}</div>
                <div style={s.kpiDelta}>{kpi.delta}</div>
                {kpi.bars ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      height: 28,
                      marginTop: 10,
                    }}
                  >
                    {kpi.bars.map((h, j) => (
                      <div
                        key={j}
                        style={{
                          flex: 1,
                          height: `${h * 3.5}px`,
                          backgroundColor:
                            j === kpi.bars!.length - 1
                              ? theme.accent
                              : theme.accentAlpha20,
                          borderRadius: 3,
                          boxShadow:
                            j === kpi.bars!.length - 1 ? theme.glowBox : "none",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 10,
                      height: 5,
                      backgroundColor: "#232323",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${kpi.progress}%`,
                        backgroundColor: theme.accent,
                        boxShadow: theme.glowBox,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue vs Target + Donut */}
          <div style={s.splitGrid}>
            <div style={s.glassCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={s.sectionTitle}>Revenue vs. Target</div>
                  <div style={s.sectionSub}>
                    Real-time performance tracking against quarterly goals
                  </div>
                </div>
                <div style={s.legend}>
                  <div style={s.legendLabel}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: theme.accent,
                        boxShadow: theme.glowBox,
                      }}
                    />
                    Actual
                  </div>
                  <div style={s.legendLabel}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: "2px dashed #737685",
                      }}
                    />
                    <span style={{ color: "#737685" }}>Target</span>
                  </div>
                </div>
              </div>
              <div style={{ height: 160 }}>
                <svg width="100%" height="100%" viewBox="0 0 800 160">
                  <line
                    x1="0"
                    y1="30"
                    x2="800"
                    y2="30"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="800"
                    y2="80"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="130"
                    x2="800"
                    y2="130"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,130 L100,120 L200,110 L300,95 L400,85 L500,70 L600,60 L700,50 L800,45"
                    fill="none"
                    stroke="#737685"
                    strokeDasharray="8,8"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  <path
                    ref={chart2Ref}
                    className="dash-anim"
                    d="M0,145 L100,120 L200,100 L300,130 L400,60 L500,85 L600,30 L700,55 L800,20"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                {[
                  "Wk 1",
                  "Wk 2",
                  "Wk 3",
                  "Wk 4",
                  "Wk 5",
                  "Wk 6",
                  "Wk 7",
                  "Wk 8",
                ].map((w) => (
                  <span
                    key={w}
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#4a4a5a",
                      textTransform: "uppercase",
                    }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div style={s.glassCard}>
              <div style={{ ...s.sectionTitle, marginBottom: 16 }}>
                Acquisition Channels
              </div>
              <div style={s.donutWrap}>
                <div style={{ position: "relative", width: 130, height: 130 }}>
                  <svg
                    width="130"
                    height="130"
                    viewBox="0 0 100 100"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    {channels.map((ch, i) => (
                      <circle
                        key={i}
                        cx={ch.cx}
                        cy={ch.cy}
                        r={ch.r}
                        fill="none"
                        stroke={ch.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${ch.dash} ${100 - ch.dash}`}
                        strokeDashoffset={ch.offset}
                      />
                    ))}
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
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#f9f9ff",
                        lineHeight: 1,
                      }}
                    >
                      4.8k
                    </span>
                    <span
                      style={{
                        fontSize: 8,
                        color: "#737685",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Total Leads
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {channels.map((ch) => (
                    <div key={ch.label} style={s.channelRow}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: ch.color,
                          }}
                        />
                        <span style={{ fontSize: 10, color: "#737685" }}>
                          {ch.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#f9f9ff",
                        }}
                      >
                        {ch.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regional + Activities */}
          <div style={s.bottomGrid}>
            <div style={s.glassCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div style={s.sectionTitle}>Regional Performance</div>
                <select
                  style={{
                    backgroundColor: "#1e1e1e",
                    border: "none",
                    borderRadius: 8,
                    color: "#f9f9ff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    outline: "none",
                  }}
                >
                  <option>Current Quarter</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div style={s.barRegion}>
                {regions.map((r) => (
                  <div key={r.name} style={s.regionRow}>
                    <div style={s.regionMeta}>
                      <span>{r.name}</span>
                      <span style={s.regionAmt}>{r.amount}</span>
                    </div>
                    <div style={s.barTrack}>
                      <div
                        style={{
                          height: "100%",
                          width: `${r.pct}%`,
                          backgroundColor: theme.accent,
                          opacity: r.opacity,
                          borderRadius: 999,
                          boxShadow: r.opacity === 1 ? theme.glowBox : "none",
                          transition: "background-color 0.4s",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                ...s.glassCard,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ ...s.sectionTitle, marginBottom: 18 }}>
                Recent Activities
              </div>
              {[
                {
                  icon: "🛒",
                  accent: true,
                  title: "New transaction recorded",
                  sub: "2,450 USD from client #092",
                  time: "12:45 PM",
                },
                {
                  icon: "👤",
                  accent: false,
                  title: "New user onboarded",
                  sub: "Marketing lead: Sarah Jenkins",
                  time: "11:20 AM",
                },
                {
                  icon: "⚡",
                  accent: true,
                  title: "System Update",
                  sub: "V4.2 successfully deployed",
                  time: "09:00 AM",
                },
                {
                  icon: "🔒",
                  accent: false,
                  title: "Security Audit",
                  sub: "Automated scan completed",
                  time: "Yesterday",
                },
              ].map((item, i) => (
                <div key={i} style={s.activityItem}>
                  <div style={s.activityIcon(item.accent)}>{item.icon}</div>
                  <div>
                    <div style={s.activityTitle}>{item.title}</div>
                    <div style={s.activitySub}>{item.sub}</div>
                    <div style={s.activityTime}>{item.time}</div>
                  </div>
                </div>
              ))}
              <button style={s.viewLogBtn}>View Audit Log</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
