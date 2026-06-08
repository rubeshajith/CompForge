"use client";

import type { CSSProperties } from "react";
import type { ManufacturingDashboardConfig } from "@/lib/manufacturingDashboardConfig";

interface ManufacturingDashboardPreviewProps {
  config: ManufacturingDashboardConfig;
}

const navItems = ["Overview", "Production", "Analytics", "Maintenance", "Tasks", "Alerts"];
const alerts = [
  "Machine #3 is currently down for maintenance.",
  "Inventory level for raw material XYZ is critically low.",
  "Work order #123 for production line 2 is delayed.",
  "Maintenance for Machine #1 is overdue.",
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Icon({ path, color }: { path: string; color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function ManufacturingDashboardPreview({ config }: ManufacturingDashboardPreviewProps) {
  const gap = config.density === "compact" ? 14 : 24;
  const pad = config.density === "compact" ? Math.max(14, config.cardPadding - 8) : config.cardPadding;

  const rootStyle: CSSProperties = {
    width: "min(100%, " + config.dashboardWidth + "px)",
    minHeight: 760,
    display: "grid",
    gridTemplateColumns: config.showSidebar ? "240px 1fr" : "1fr",
    gap: 16,
    padding: 16,
    background: config.backgroundColor,
    color: config.textColor,
    fontFamily: "Instrument Sans, Inter, system-ui, sans-serif",
    fontSize: config.fontSize,
    border: "1px solid " + config.borderColor,
    borderRadius: config.shellRadius,
    boxShadow: "0 28px 80px rgba(0,0,0,0.36)",
  };

  const cardStyle: CSSProperties = {
    background: config.cardColor + (config.cardColor.length === 7 ? "aa" : ""),
    border: "1px solid " + config.borderColor,
    borderRadius: config.cardRadius,
    padding: pad,
    transition: config.animateCards ? "transform 180ms ease, background 180ms ease" : "none",
  };

  return (
    <div style={rootStyle}>
      {config.showSidebar ? (
        <aside style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 14px", background: config.sidebarColor, borderRadius: Math.max(18, config.shellRadius - 10) }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 34, padding: "0 8px" }}>
              <span style={{ width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: 9, background: config.successColor, color: config.backgroundColor, fontWeight: 900 }}>X</span>
              <strong style={{ fontSize: 25, letterSpacing: -0.6 }}>XMES</strong>
            </div>
            <nav style={{ display: "grid", gap: 6 }}>
              {navItems.map((item) => {
                const active = item === "Production";
                return (
                  <button key={item} style={{ display: "flex", alignItems: "center", gap: 12, border: 0, background: active ? config.cardColor : "transparent", color: active ? config.textColor : config.mutedTextColor, borderRadius: 10, padding: "10px 12px", textAlign: "left", fontWeight: active ? 700 : 500 }}>
                    <Icon path={active ? "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" : "M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v4H4zM14 16h6v4h-6z"} />
                    {item}
                  </button>
                );
              })}
            </nav>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ background: config.cardColor, border: "1px solid " + config.borderColor, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: config.successColor }} />
                <strong>New Version</strong>
              </div>
              <p style={{ margin: 0, color: config.mutedTextColor, fontSize: 12 }}>Running on latest version 3.5.11.</p>
            </div>
            <span style={{ color: config.mutedTextColor, display: "flex", gap: 10, alignItems: "center" }}><Icon path="M10.3 4.3a1.7 1.7 0 0 1 3.4 0 1.7 1.7 0 0 0 2.6 1.1 1.7 1.7 0 0 1 2.4 2.4 1.7 1.7 0 0 0 1.1 2.6 1.7 1.7 0 0 1 0 3.4 1.7 1.7 0 0 0-1.1 2.6 1.7 1.7 0 0 1-2.4 2.4 1.7 1.7 0 0 0-2.6 1.1 1.7 1.7 0 0 1-3.4 0 1.7 1.7 0 0 0-2.6-1.1 1.7 1.7 0 0 1-2.4-2.4 1.7 1.7 0 0 0-1.1-2.6 1.7 1.7 0 0 1 0-3.4 1.7 1.7 0 0 0 1.1-2.6 1.7 1.7 0 0 1 2.4-2.4 1.7 1.7 0 0 0 2.6-1.1z" /> Settings</span>
          </div>
        </aside>
      ) : null}

      <main style={{ position: "relative", background: config.shellColor, border: "1px solid " + config.borderColor, borderRadius: config.shellRadius, padding: 28, overflow: "hidden" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 25, fontWeight: 700 }}>Good Afternoon</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {config.showProfile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, " + config.accentColor + ", " + config.successColor + ")", border: "1px solid " + config.borderColor }} />
                <div><strong style={{ fontSize: 13 }}>Mr. Asif Ali</strong><div style={{ color: config.mutedTextColor, fontSize: 11 }}>Manager</div></div>
              </div>
            ) : null}
            <div style={{ width: 190, borderRadius: 999, background: config.cardColor, border: "1px solid " + config.borderColor, color: config.mutedTextColor, padding: "9px 14px" }}>Search here</div>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap }}>
          <section style={{ ...cardStyle, gridColumn: "span 8", minHeight: 310 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 36 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Production Efficiency</h2>
              <span style={{ color: config.mutedTextColor }}>2023</span>
            </div>
            <div style={{ position: "relative", height: 190 }}>
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110 L800,200 L0,200 Z" fill={config.accentColor} opacity="0.28" />
                <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110" fill="none" stroke={config.accentColor} strokeWidth="3" />
                <circle cx="400" cy="100" r="5" fill={config.successColor} />
                <line x1="400" x2="400" y1="100" y2="200" stroke={config.successColor} strokeDasharray="2 4" />
              </svg>
              <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", background: "#ffffff", color: "#000000", padding: "8px 10px", borderRadius: 9, textAlign: "center", boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}>
                <strong style={{ display: "block", fontSize: 12 }}>90.34%</strong>
                <span style={{ fontSize: 10, color: "#6b7280" }}>120 units/day</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: config.mutedTextColor, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2 }}>
              {months.map((month) => <span key={month} style={{ color: month === "Jul" ? config.successColor : undefined, fontWeight: month === "Jul" ? 800 : 500 }}>{month}</span>)}
            </div>
          </section>

          <section style={{ ...cardStyle, gridColumn: "span 4" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>Alerts</h2>
            <div style={{ display: "grid", gap: 16 }}>
              {alerts.map((alert, index) => (
                <div key={alert} style={{ display: "flex", gap: 13, alignItems: "start", opacity: index > 1 ? 0.55 : 1 }}>
                  <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid " + (index > 1 ? config.borderColor : "transparent"), background: index > 1 ? "transparent" : config.successColor + "22", color: index > 1 ? config.mutedTextColor : config.successColor }}><Icon path="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h11" /></span>
                  <p style={{ margin: 0, color: config.mutedTextColor, fontSize: 12, lineHeight: 1.45 }}>{alert}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...cardStyle, gridColumn: "span 3" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>Pending Tasks</h2>
            <strong style={{ color: config.successColor, display: "block", marginBottom: 12 }}>Quality Inspection for Product X.</strong>
            <ul style={{ margin: 0, paddingLeft: 18, color: config.mutedTextColor, fontSize: 12, lineHeight: 1.8 }}>
              <li>Conduct quality inspection before packaging.</li>
              <li>Due Date: 05/05/2024</li>
              <li>Priority: High</li>
            </ul>
            <button style={{ width: "100%", border: 0, marginTop: 18, borderRadius: 13, padding: "11px 12px", background: config.accentColor, color: config.accentTextColor, fontWeight: 800 }}>Start Inspection</button>
          </section>

          <section style={{ ...cardStyle, gridColumn: "span 5" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>Defect Rate</h2>
            <div style={{ display: "grid", placeItems: "center", gap: 20 }}>
              <svg width="230" height="230" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="32" fill="none" stroke={config.chartGridColor} strokeWidth="18" strokeDasharray="20.1 201.06" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="32" fill="none" stroke={config.accentColor} strokeWidth="18" strokeDasharray="60.32 201.06" strokeDashoffset="-20.1" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="32" fill="none" stroke={config.successColor} strokeWidth="18" strokeDasharray="120.64 201.06" strokeDashoffset="-80.42" transform="rotate(-90 50 50)" />
                <text x="50" y="54" textAnchor="middle" fill={config.textColor} fontSize="10" fontWeight="800">May</text>
              </svg>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", color: config.mutedTextColor, fontSize: 12 }}>
                <span><b style={{ color: config.successColor }}>●</b> Material 60%</span>
                <span><b style={{ color: config.accentColor }}>●</b> Process 30%</span>
                <span><b style={{ color: config.chartGridColor }}>●</b> Design 10%</span>
              </div>
            </div>
          </section>

          <section style={{ ...cardStyle, gridColumn: "span 4" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>Sales Performance</h2>
            <svg width="100%" height="130" viewBox="0 0 300 100" preserveAspectRatio="none">
              {[20, 80, 140, 200, 260].map((x, index) => <rect key={x} x={x} y={[40, 25, 45, 30, 15][index]} width="8" height={[60, 75, 55, 70, 85][index]} rx="4" fill={config.cardHoverColor} />)}
              <path d="M10,75 C30,20 50,85 70,85 C100,50 120,55 140,85 C160,50 180,60 200,80 C230,100 250,20 280,10" fill="none" stroke={config.successColor} strokeLinecap="round" strokeWidth="3" />
              <rect x="120" y="30" width="100" height="16" rx="4" fill="#ffffff" />
              <text x="126" y="41" fill="#000000" fontSize="6" fontWeight="800">4500</text>
              <text x="150" y="41" fill="#6b7280" fontSize="5">Low sales in May</text>
            </svg>
          </section>
        </div>

        {config.showDownloadCard ? (
          <div style={{ position: "absolute", right: 26, bottom: 24, display: "flex", alignItems: "center", gap: 12, background: "#ffffff", color: "#111827", borderRadius: 16, padding: 14, boxShadow: "0 16px 40px rgba(0,0,0,0.28)" }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "#f3f4f6" }}><Icon path="M9 12h6m-6 4h6M7 21h10a2 2 0 0 0 2-2V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" color="#111827" /></span>
            <div><strong style={{ display: "block", fontSize: 13 }}>Download Report</strong><span style={{ color: "#6b7280", fontSize: 10 }}>April 2024</span></div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
