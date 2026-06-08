"use client";

import type { CSSProperties } from "react";
import type { MediaDashboardConfig, MediaDashboardRange } from "@/lib/mediaDashboardConfig";

interface MediaDashboardPreviewProps {
  config: MediaDashboardConfig;
}

const navItems = ["Dashboard", "Streaming", "Content", "Audience", "Revenue"];
const ranges: { label: string; value: MediaDashboardRange }[] = [
  { label: "Real-time", value: "realtime" },
  { label: "24 Hours", value: "day" },
  { label: "7 Days", value: "week" },
];

const metrics = [
  { label: "Global Viewers", value: "12.4M", delta: "+4.2%", icon: "visibility" },
  { label: "Content ROI", value: "18.2%", delta: "+18.2%", icon: "monetization_on" },
  { label: "Avg. Watch Time", value: "42m", delta: "Stable", icon: "schedule" },
  { label: "Active Streams", value: "1.2M", delta: "+12%", icon: "sensors" },
];

const performers = [
  { title: "Neo-Horizon: Echoes", views: "4.2M views", score: 92, color: "secondary" },
  { title: "The Last Protocol", views: "2.8M views", score: 88, color: "accent" },
  { title: "CyberPulse Live", views: "1.9M views", score: 76, color: "tertiary" },
];

export function MediaDashboardPreview({ config }: MediaDashboardPreviewProps) {
  const gap = config.density === "compact" ? 14 : 24;
  const pad = config.density === "compact" ? Math.max(14, config.cardPadding - 8) : config.cardPadding;

  const shellStyle: CSSProperties = {
    width: "min(100%, " + config.dashboardWidth + "px)",
    minHeight: 760,
    display: "grid",
    gridTemplateColumns: config.showSidebar ? "220px 1fr" : "1fr",
    background: config.backgroundColor,
    color: config.textColor,
    border: "1px solid " + config.borderColor,
    borderRadius: config.cardRadius,
    overflow: "hidden",
    fontFamily: "Instrument Sans, Inter, system-ui, sans-serif",
    fontSize: config.fontSize,
    boxShadow: config.showGlow ? "0 28px 80px rgba(0,0,0,0.35)" : "none",
  };

  const cardStyle: CSSProperties = {
    background: config.cardColor,
    border: "1px solid " + config.borderColor,
    borderRadius: config.cardRadius,
    padding: pad,
    boxShadow: config.showGlow ? "0 0 24px color-mix(in srgb, " + config.accentColor + " 14%, transparent)" : "none",
    transition: config.animateCards ? "transform 180ms ease, background 180ms ease, border-color 180ms ease" : "none",
  };

  return (
    <div style={shellStyle}>
      {config.showSidebar ? (
        <aside style={{ background: config.sidebarColor, borderRight: "1px solid " + config.borderColor, padding: 20 }}>
          <div style={{ marginBottom: 34 }}>
            <div style={{ color: config.accentColor, fontWeight: 800, fontSize: 26, letterSpacing: -0.3 }}>Luminous</div>
            <div style={{ color: config.mutedTextColor, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Media & Ent.</div>
          </div>
          <nav style={{ display: "grid", gap: 6 }}>
            {navItems.map((item) => {
              const active = item === "Content";
              return (
                <button
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: 0,
                    borderRadius: 8,
                    padding: "11px 12px",
                    background: active ? config.accentColor : "transparent",
                    color: active ? config.accentTextColor : config.mutedTextColor,
                    fontWeight: active ? 700 : 500,
                    textAlign: "left",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item === "Content" ? "movie" : item === "Revenue" ? "payments" : item.toLowerCase()}</span>
                  {item}
                </button>
              );
            })}
          </nav>
          <button style={{ width: "100%", marginTop: 34, border: 0, borderRadius: 8, padding: "12px 14px", background: config.accentColor, color: config.accentTextColor, fontWeight: 800 }}>Export Reports</button>
        </aside>
      ) : null}

      <main style={{ minWidth: 0 }}>
        {config.showTopBar ? (
          <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid " + config.borderColor, padding: "0 28px", background: config.surfaceColor }}>
            <div style={{ width: 260, border: "1px solid " + config.borderColor, borderRadius: 999, padding: "8px 14px", color: config.mutedTextColor }}>Search analytics...</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="material-symbols-outlined" style={{ color: config.mutedTextColor }}>notifications</span>
              <span className="material-symbols-outlined" style={{ color: config.mutedTextColor }}>settings</span>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, " + config.accentColor + ", " + config.tertiaryColor + ")" }} />
            </div>
          </header>
        ) : null}

        <section style={{ padding: 28, display: "grid", gap }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 32, lineHeight: "40px", color: config.textColor }}>Content Performance</h2>
              <p style={{ margin: "5px 0 0", color: config.mutedTextColor }}>Real-time engagement and distribution insights across global clusters.</p>
            </div>
            <div style={{ display: "flex", padding: 4, background: config.surfaceColor, borderRadius: 8, border: "1px solid " + config.borderColor }}>
              {ranges.map((range) => {
                const active = range.value === config.selectedRange;
                return (
                  <span key={range.value} style={{ padding: "7px 13px", borderRadius: 6, color: active ? config.accentColor : config.mutedTextColor, background: active ? config.cardHoverColor : "transparent", fontSize: 12, fontWeight: 700 }}>{range.label}</span>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap }}>
            {metrics.map((metric, index) => (
              <article key={metric.label} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
                  <span className="material-symbols-outlined" style={{ color: index === 1 ? config.secondaryColor : config.accentColor }}>{metric.icon}</span>
                  <span style={{ color: metric.delta === "Stable" ? config.mutedTextColor : config.secondaryColor, fontSize: 12, fontWeight: 800 }}>{metric.delta}</span>
                </div>
                <div style={{ color: config.mutedTextColor, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{metric.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{metric.value}</div>
              </article>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap }}>
            <article style={{ ...cardStyle, minHeight: 360 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Live Viewership Trends</h3>
                <div style={{ display: "flex", gap: 16, color: config.mutedTextColor, fontSize: 12 }}>
                  <span><b style={{ color: config.accentColor }}>●</b> North America</span>
                  <span><b style={{ color: config.tertiaryColor }}>●</b> EMEA</span>
                </div>
              </div>
              <svg width="100%" height="230" viewBox="0 0 800 230" role="img" aria-label="Live viewership trends chart">
                {[40, 90, 140, 190].map((y) => <line key={y} x1="0" x2="800" y1={y} y2={y} stroke={config.chartGridColor} strokeOpacity="0.55" />)}
                <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80 V230 H0 Z" fill={config.accentColor} opacity="0.15" />
                <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130 V230 H0 Z" fill={config.tertiaryColor} opacity="0.11" />
                <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80" fill="none" stroke={config.accentColor} strokeWidth="3" />
                <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130" fill="none" stroke={config.tertiaryColor} strokeDasharray="8 4" strokeWidth="2" />
                <circle cx="600" cy="60" r="6" fill={config.accentColor} />
                <text x="615" y="55" fill={config.textColor} fontSize="12" fontWeight="800">8.4M LIVE</text>
              </svg>
            </article>

            <article style={cardStyle}>
              <h3 style={{ margin: "0 0 22px", fontSize: 20 }}>Top Performers</h3>
              <div style={{ display: "grid", gap: 18 }}>
                {performers.map((item, index) => {
                  const color = item.color === "secondary" ? config.secondaryColor : item.color === "tertiary" ? config.tertiaryColor : config.accentColor;
                  return (
                    <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 48, height: 70, borderRadius: 8, background: "linear-gradient(145deg, " + color + "33, " + config.surfaceColor + ")", border: "1px solid " + config.borderColor }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                        <div style={{ color: config.mutedTextColor, fontSize: 12, marginTop: 4 }}>{item.views}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                          <div style={{ height: 5, flex: 1, background: config.surfaceColor, borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", width: item.score + "%", background: color }} /></div>
                          <span style={{ color, fontSize: 12, fontWeight: 800 }}>{item.score}%</span>
                        </div>
                      </div>
                      <span style={{ color: config.mutedTextColor, fontSize: 12 }}>#{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            <article style={{ ...cardStyle, minHeight: 300 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 20 }}>Global Streaming Density</h3>
              <div style={{ position: "relative", minHeight: 210, borderRadius: 10, overflow: "hidden", background: config.surfaceColor, border: "1px solid " + config.borderColor }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", inset: "50% auto auto 50%", transform: "translate(-50%, -50%)", fontSize: 110, color: config.borderColor }}>public</span>
                <span style={{ position: "absolute", left: "25%", top: "35%", width: 12, height: 12, borderRadius: "50%", background: config.accentColor, boxShadow: "0 0 0 10px " + config.accentColor + "22" }} />
                <span style={{ position: "absolute", left: "48%", top: "40%", width: 10, height: 10, borderRadius: "50%", background: config.secondaryColor, boxShadow: "0 0 0 10px " + config.secondaryColor + "22" }} />
                <span style={{ position: "absolute", left: "75%", top: "55%", width: 12, height: 12, borderRadius: "50%", background: config.tertiaryColor, boxShadow: "0 0 0 10px " + config.tertiaryColor + "22" }} />
                <div style={{ position: "absolute", left: 14, bottom: 14, padding: 12, borderRadius: 8, background: config.backgroundColor + "cc", border: "1px solid " + config.borderColor }}>
                  <div style={{ color: config.mutedTextColor, fontSize: 11, textTransform: "uppercase" }}>Peak Region</div>
                  <strong>APAC Cluster <span style={{ color: config.secondaryColor }}>+22%</span></strong>
                </div>
              </div>
            </article>

            <article style={cardStyle}>
              <h3 style={{ margin: "0 0 20px", fontSize: 20 }}>Audience Demographics</h3>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 22, alignItems: "center" }}>
                <div style={{ position: "relative", width: 132, height: 132 }}>
                  <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="16" fill="none" stroke={config.borderColor} strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke={config.accentColor} strokeDasharray="65 100" strokeLinecap="round" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke={config.tertiaryColor} strokeDasharray="25 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
                    <strong style={{ fontSize: 20 }}>18-34</strong>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    ["Mobile App", 68, config.accentColor],
                    ["Smart TV", 24, config.secondaryColor],
                    ["Desktop", 8, config.mutedTextColor],
                  ].map(([label, value, color]) => (
                    <div key={String(label)}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}><span>{label}</span><strong style={{ color: String(color) }}>{value}%</strong></div>
                      <div style={{ height: 7, background: config.surfaceColor, borderRadius: 999 }}><div style={{ height: "100%", width: value + "%", background: String(color), borderRadius: 999 }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
