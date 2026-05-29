"use client";

import { SaasDashboardConfig, getSaasDashboardTheme } from "@/lib/saasDashboardConfig";

interface SaasDashboardPreviewProps {
  config: SaasDashboardConfig;
}

const nav = ["FinTech", "HealthTech", "E-commerce", "Cybersecurity", "Logistics", "Marketing", "SaaS", "Energy", "HR/EdTech", "Gaming"];
const metrics = [
  ["monetization_on", "MRR", "$284,500", "+12.4%", "Vs. $253,100 last month"],
  ["group", "Active Users", "42,891", "+8.1%", "Current concurrent: 4,102"],
  ["heart_broken", "Churn Rate", "1.8%", "-0.2%", "Benchmark: 2.5%"],
  ["bolt", "ARR Forecast", "$3.41M", "Elite", "Projected by Dec 2024"],
];
const conversions = [
  ["business", "Stark Industries", "Enterprise Tier - 500 Seats", "+$12,400/mo", "2 mins ago"],
  ["rocket_launch", "Nexus Soft", "Pro Tier - 25 Seats", "+$450/mo", "14 mins ago"],
  ["person", "Elena Rodriguez", "Pro Tier - 1 Seat", "+$49/mo", "1 hour ago"],
];

function Icon({ children, size = 22 }: { children: string; size?: number }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontFamily: "Material Symbols Outlined", fontSize: size, lineHeight: 1 }}
    >
      {children}
    </span>
  );
}

export function SaasDashboardPreview({ config }: SaasDashboardPreviewProps) {
  const t = getSaasDashboardTheme(config);
  const card = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: 12,
  };

  return (
    <div
      style={{
        width: "min(1120px, 100%)",
        height: 760,
        overflow: "hidden",
        borderRadius: 14,
        background: t.bg,
        color: t.text,
        border: `1px solid ${t.border}`,
        fontFamily: "Inter, Instrument Sans, sans-serif",
        boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        position: "relative",
      }}
    >
      <aside
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 250,
          background: t.surface,
          borderRight: `1px solid ${t.border}`,
          padding: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: t.accent,
              color: t.buttonText,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon>dashboard</Icon>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, lineHeight: "28px" }}>OmniDash Pro</h1>
            <p style={{ margin: 0, color: t.softText, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
              Enterprise Suite
            </p>
          </div>
        </div>
        <button
          style={{
            border: 0,
            borderRadius: 12,
            padding: "13px 16px",
            background: t.accent,
            color: t.buttonText,
            fontWeight: 800,
            marginBottom: 18,
          }}
        >
          + New Dashboard
        </button>
        <nav style={{ display: "grid", gap: 4, overflow: "hidden" }}>
          {nav.map((item) => {
            const active = item === "SaaS";
            return (
              <div
                key={item}
                style={{
                  padding: "12px 14px",
                  borderRadius: 9,
                  color: active ? t.accent : t.softText,
                  background: active ? t.surface3 : "transparent",
                  borderRight: active ? `2px solid ${t.accent}` : "2px solid transparent",
                  fontWeight: active ? 800 : 500,
                  fontSize: 14,
                }}
              >
                {item}
              </div>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", borderTop: `1px solid ${t.border}`, paddingTop: 18, color: t.softText, display: "grid", gap: 6 }}>
          <span>Settings</span>
          <span>Support</span>
        </div>
      </aside>

      <main style={{ marginLeft: 250, height: "100%" }}>
        <header
          style={{
            height: 64,
            background: `${t.surface}dd`,
            borderBottom: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <div style={{ width: 350, borderRadius: 999, background: t.surface2, border: `1px solid ${t.border}`, padding: "10px 18px", color: t.muted, fontSize: 13 }}>
            Search enterprise metrics...
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: t.softText }}>
            <Icon>notifications</Icon>
            <Icon>apps</Icon>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <strong style={{ display: "block", color: t.text }}>Alex Rivera</strong>
              <span style={{ color: t.muted, fontSize: 10 }}>CTO & Founder</span>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${t.accent}55`, background: `linear-gradient(135deg, ${t.accent}, ${t.accent3})` }} />
          </div>
        </header>

        <section style={{ height: 696, overflow: "hidden", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 43, lineHeight: "50px", letterSpacing: 0 }}>SaaS Growth Engine</h2>
              <p style={{ margin: "4px 0 0", color: t.softText, fontSize: 17 }}>Real-time subscription health and revenue forecasting.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.text, borderRadius: 9, padding: "9px 14px", fontWeight: 800 }}>
                Last 30 Days
              </button>
              <button style={{ background: t.accent2, color: "#062013", border: 0, borderRadius: 9, padding: "9px 14px", fontWeight: 800 }}>
                Export Report
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
            {metrics.map(([icon, label, value, delta, caption], index) => {
              const tone = index === 0 ? t.accent : index === 1 ? t.accent3 : index === 2 ? t.danger : t.accent2;
              return (
                <article key={label} style={{ ...card, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, color: tone }}>
                    <Icon>{icon}</Icon>
                    <span style={{ color: index === 2 ? t.danger : t.accent2, fontSize: 12, fontWeight: 800 }}>{delta}</span>
                  </div>
                  <div style={{ color: t.softText, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{label}</div>
                  <strong style={{ display: "block", fontSize: 29, lineHeight: "38px" }}>{value}</strong>
                  <p style={{ margin: "8px 0 0", color: t.muted, fontSize: 10 }}>{caption}</p>
                </article>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22, marginBottom: 22 }}>
            <article style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20 }}>Annual Recurring Revenue</h3>
                  <p style={{ margin: "4px 0 0", color: t.softText, fontSize: 13 }}>Trailing 12-month performance trajectory.</p>
                </div>
                <div style={{ display: "flex", gap: 16, color: t.softText, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                  <span>Actual</span>
                  <span>Projected</span>
                </div>
              </div>
              <div style={{ height: 218, display: "flex", alignItems: "end", justifyContent: "space-between", gap: 13, padding: "0 12px", borderBottom: `1px solid ${t.border}` }}>
                {[40, 45, 55, 65, 60, 75, 82, 90, 95, 98, 100].map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    style={{
                      width: 28,
                      height: `${height}%`,
                      borderRadius: "8px 8px 0 0",
                      background: index === 10 ? t.accent2 : `${t.accent}${Math.min(95, 18 + index * 7).toString(16).padStart(2, "0")}`,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: t.muted, fontSize: 10, marginTop: 12 }}>
                {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"].map((m) => <span key={m}>{m}</span>)}
              </div>
            </article>

            <article style={{ ...card, padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>User Tier Distribution</h3>
              <p style={{ margin: "4px 0 20px", color: t.softText, fontSize: 13 }}>Composition by subscription value.</p>
              <div style={{ height: 210, position: "relative", display: "grid", placeItems: "center" }}>
                <svg viewBox="0 0 100 100" style={{ width: 180, height: 180, transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke={t.surface2} strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={t.accent} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="100.48" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={t.accent3} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200.96" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={t.accent2} strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="226.08" />
                </svg>
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <strong style={{ display: "block", fontSize: 31 }}>92%</strong>
                  <span style={{ color: t.muted, fontSize: 10, textTransform: "uppercase" }}>Paid Share</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, textAlign: "center", fontSize: 12 }}>
                {["Free 8%", "Pro 64%", "Ent. 28%"].map((item) => <span key={item}>{item}</span>)}
              </div>
            </article>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            <article style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20 }}>Cohort Retention</h3>
                  <p style={{ margin: "4px 0 0", color: t.softText, fontSize: 13 }}>User stickiness over 12 months.</p>
                </div>
                <Icon>info</Icon>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <tbody>
                  {["Jan 24", "Feb 24", "Mar 24", "Apr 24"].map((month, row) => (
                    <tr key={month}>
                      <td style={{ padding: "8px 10px", fontWeight: 800 }}>{month}</td>
                      {[100, 94 - row * 2, 91 - row * 2, 88 - row * 2, row < 2 ? 83 : null, row === 0 ? 79 : null].map((value, i) => (
                        <td key={`${month}-${i}`} style={{ padding: 4 }}>
                          {value ? (
                            <div style={{ aspectRatio: "1", borderRadius: 3, background: t.accent, opacity: value / 100, display: "grid", placeItems: "center", color: t.buttonText }}>{value}</div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20 }}>Recent Conversions</h3>
                  <p style={{ margin: "4px 0 0", color: t.softText, fontSize: 13 }}>Latest Enterprise and Pro wins.</p>
                </div>
                <span style={{ color: t.accent, fontSize: 12, fontWeight: 800 }}>View All</span>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {conversions.map(([icon, name, plan, amount, time]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 9 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 9, display: "grid", placeItems: "center", background: `${t.accent}22`, color: t.accent }}>
                        <Icon>{icon}</Icon>
                      </div>
                      <div>
                        <strong style={{ display: "block", fontSize: 13 }}>{name}</strong>
                        <span style={{ color: t.muted, fontSize: 10 }}>{plan}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 11 }}>
                      <strong style={{ display: "block", color: t.accent2 }}>{amount}</strong>
                      <span style={{ color: t.muted }}>{time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>

      <button
        style={{
          position: "absolute",
          right: 24,
          bottom: 24,
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: 0,
          background: t.accent,
          color: t.buttonText,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon>settings_suggest</Icon>
      </button>
    </div>
  );
}
