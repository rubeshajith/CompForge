"use client";

import { MarketingDashboardConfig, getMarketingDashboardTheme } from "@/lib/marketingDashboardConfig";

interface MarketingDashboardPreviewProps {
  config: MarketingDashboardConfig;
}

const navItems = [
  ["campaign", "Marketing"],
  ["payments", "FinTech"],
  ["monitor_heart", "HealthTech"],
  ["shopping_cart", "E-commerce"],
  ["security", "Cybersecurity"],
  ["local_shipping", "Logistics"],
  ["analytics", "SaaS"],
];

const metrics = [
  ["account_balance_wallet", "Total Ad Spend", "$428,500", "+12.5%", 76],
  ["donut_large", "Conversion ROI", "342%", "+4.2%", 62],
  ["hub", "Social Impressions", "1.2M", "-0.8%", 90],
];

const rows = [
  ["enterprise analytics suite", "$12.45", "$84,200", "Scaling"],
  ["real-time marketing roi", "$8.12", "$52,150", "Active"],
  ["data visualization dashboard", "$15.90", "$41,800", "Paused"],
  ["b2b saas growth tools", "$6.75", "$38,200", "Active"],
];

function Icon({ children }: { children: string }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontFamily: "Material Symbols Outlined", fontSize: 22, lineHeight: 1 }}
    >
      {children}
    </span>
  );
}

export function MarketingDashboardPreview({ config }: MarketingDashboardPreviewProps) {
  const t = getMarketingDashboardTheme(config);

  const styles = {
    wrap: {
      width: "min(1120px, 100%)",
      height: 760,
      overflow: "hidden",
      borderRadius: 14,
      background: t.bg,
      color: t.text,
      border: `1px solid ${t.border}`,
      fontFamily: "Inter, Instrument Sans, sans-serif",
      position: "relative" as const,
      boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
    },
    glass: {
      background: "rgba(18,18,18,0.68)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${t.border}`,
      borderRadius: 12,
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={{ display: "flex", minHeight: "100%" }}>
        <aside
          style={{
            width: 248,
            flexShrink: 0,
            background: t.surface,
            borderRight: `1px solid ${t.border}`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: t.gradient,
                display: "grid",
                placeItems: "center",
                color: "#fff",
              }}
            >
              <Icon>analytics</Icon>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0 }}>OmniDash Pro</div>
              <div style={{ color: t.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                Enterprise Suite
              </div>
            </div>
          </div>

          <nav style={{ display: "grid", gap: 4 }}>
            {navItems.map(([icon, label], index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 14px",
                  color: index === 0 ? t.accent : t.softText,
                  background: index === 0 ? `${t.accent}14` : "transparent",
                  borderRight: index === 0 ? `2px solid ${t.accent}` : "2px solid transparent",
                  fontWeight: index === 0 ? 800 : 500,
                }}
              >
                <Icon>{icon}</Icon>
                <span style={{ fontSize: 14 }}>{label}</span>
              </div>
            ))}
          </nav>

          <button
            style={{
              marginTop: "auto",
              border: 0,
              borderRadius: 12,
              padding: "14px 16px",
              color: "#fff",
              background: t.gradient,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icon>add</Icon>
            New Dashboard
          </button>
        </aside>

        <main style={{ flex: 1, minWidth: 0, background: t.bg }}>
          <header
            style={{
              height: 64,
              background: `${t.surface}e6`,
              borderBottom: `1px solid ${t.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <div style={{ width: 330, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: 9, color: t.muted }}>
                <Icon>search</Icon>
              </span>
              <div
                style={{
                  height: 40,
                  borderRadius: 999,
                  background: t.surface2,
                  color: t.muted,
                  padding: "11px 16px 10px 48px",
                  fontSize: 13,
                }}
              >
                Search analytics...
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: t.softText }}>
              <Icon>notifications</Icon>
              <Icon>apps</Icon>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.gradient }} />
            </div>
          </header>

          <div style={{ height: 696, overflow: "hidden", padding: 24 }}>
            <section
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                gap: 20,
                marginBottom: 26,
              }}
            >
              <div>
                <div style={{ color: t.accent2, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                  Performance Overview
                </div>
                <h2 style={{ margin: "6px 0 3px", fontSize: 31, lineHeight: "38px", letterSpacing: 0 }}>
                  Marketing ROI Dashboard
                </h2>
                <p style={{ margin: 0, color: t.softText, fontSize: 14 }}>
                  Real-time engagement metrics across all active channels.
                </p>
              </div>
              <div style={{ display: "flex", gap: 4, padding: 4, background: t.surface2, borderRadius: 10 }}>
                {["Daily", "Weekly", "Monthly"].map((label, index) => (
                  <span
                    key={label}
                    style={{
                      padding: "9px 16px",
                      borderRadius: 7,
                      background: index === 0 ? t.surface3 : "transparent",
                      color: index === 0 ? t.text : t.muted,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginBottom: 22 }}>
              {metrics.map(([icon, label, value, delta, width], index) => {
                const accent = index === 0 ? t.accent : index === 1 ? t.accent2 : t.accent3;
                const isDown = String(delta).startsWith("-");
                return (
                  <div key={label} style={{ ...styles.glass, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: `${accent}22`,
                          color: accent,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon>{String(icon)}</Icon>
                      </div>
                      <span style={{ color: isDown ? t.danger : t.accent2, fontSize: 12, fontWeight: 800 }}>
                        {delta}
                      </span>
                    </div>
                    <div style={{ color: t.softText, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 43, lineHeight: "52px", fontWeight: 800 }}>{value}</div>
                    <div style={{ height: 4, borderRadius: 999, background: t.surface2, overflow: "hidden", marginTop: 16 }}>
                      <div style={{ width: `${width}%`, height: "100%", background: accent }} />
                    </div>
                  </div>
                );
              })}
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
              <div style={{ ...styles.glass, padding: 24, minHeight: 315 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 20 }}>Channel Performance Trends</h3>
                  <div style={{ display: "flex", gap: 14, color: t.softText, fontSize: 12 }}>
                    {[
                      [t.accent, "Google"],
                      [t.accent2, "Meta"],
                      [t.accent3, "LinkedIn"],
                    ].map(([color, label]) => (
                      <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ height: 220, position: "relative" }}>
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: `${line * 24}%`,
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                    />
                  ))}
                  <svg viewBox="0 0 1000 300" style={{ width: "100%", height: "100%", position: "absolute" }}>
                    <path d="M0,300 L0,220 Q150,180 300,240 T600,190 T1000,210 L1000,300 Z" fill={`${t.accent3}33`} stroke={t.accent3} strokeWidth="2" />
                    <path d="M0,300 L0,180 Q200,120 400,180 T700,140 T1000,160 L1000,300 Z" fill={`${t.accent2}33`} stroke={t.accent2} strokeWidth="2" />
                    <path d="M0,300 L0,120 Q250,60 500,130 T800,80 T1000,100 L1000,300 Z" fill={`${t.accent}33`} stroke={t.accent} strokeWidth="2" />
                  </svg>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: t.muted, fontSize: 11, fontWeight: 800 }}>
                  {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              <div style={{ ...styles.glass, padding: 24 }}>
                <h3 style={{ margin: "0 0 24px", fontSize: 20 }}>Lead Conversion Funnel</h3>
                {[
                  ["Total Impressions", "1.2M", "100%", t.accent],
                  ["Clicks", "84.2K", "90%", t.accent],
                  ["Qualified Leads", "12.5K", "80%", t.accent2],
                  ["Conversions", "3.8K", "70%", t.accent3],
                ].map(([label, value, width, color]) => (
                  <div key={label} style={{ width, height: 52, margin: "0 auto 8px", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 10,
                        background: `${color}33`,
                        borderLeft: `4px solid ${color}`,
                        transform: "skewX(12deg)",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 18px",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: t.softText, fontSize: 12, fontWeight: 700 }}>Global Conv. Rate</span>
                  <span style={{ color: t.accent2, fontSize: 24, fontWeight: 900 }}>4.5%</span>
                </div>
              </div>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 22, marginTop: 22 }}>
              <div style={{ ...styles.glass, overflow: "hidden" }}>
                <div style={{ padding: 20, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.border}` }}>
                  <h3 style={{ margin: 0, fontSize: 19 }}>High-Value Keyword Performance</h3>
                  <span style={{ color: t.accent, fontSize: 12, fontWeight: 800 }}>View Full Report</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {rows.map(([keyword, cpc, value, status], index) => (
                      <tr key={keyword} style={{ background: index % 2 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                        <td style={{ padding: "13px 20px", fontWeight: 800 }}>{keyword}</td>
                        <td style={{ padding: "13px 20px", textAlign: "right" }}>{cpc}</td>
                        <td style={{ padding: "13px 20px", textAlign: "right", color: t.accent2 }}>{value}</td>
                        <td style={{ padding: "13px 20px", textAlign: "right" }}>
                          <span style={{ color: status === "Paused" ? t.muted : t.accent2 }}>{status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ borderRadius: 12, background: t.gradient, padding: 22, color: "#fff", minHeight: 190 }}>
                <Icon>rocket_launch</Icon>
                <h4 style={{ fontSize: 23, lineHeight: "28px", margin: "16px 0 8px" }}>Maximize Your Campaign Impact</h4>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.82)", fontSize: 13, lineHeight: "19px" }}>
                  Upgrade to OmniDash Elite for predictive AI modeling and automated bidding strategies.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
