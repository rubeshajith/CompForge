// /lib/generateOmnidashCode.ts

import { OmnidashConfig } from "./healthDashConfig";

export function generateOmnidashJSX(config: OmnidashConfig): string {
  const c = config;
  return `import { useState, useEffect, useRef } from "react";
import "./OmniDash.css";

// ─── OmniDash HealthTech Dashboard ───────────────────────────────────────────
export default function OmniDash() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const offsetRef = useRef(0);

  const navItems = [
    { label: "HealthTech", icon: "🫀", active: true },
    { label: "FinTech", icon: "💳" },
    { label: "E-commerce", icon: "🛒" },
    { label: "Cybersecurity", icon: "🔐" },
    { label: "Logistics", icon: "🚚" },
    { label: "Marketing", icon: "📣" },
    { label: "SaaS", icon: "📊" },
    { label: "Energy", icon: "⚡" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ecgPoints = [
      0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,
    ];

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += W / 5) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += H / 3) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "${c.accentColor}";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "${c.accentColor}";
      ctx.shadowBlur = 8;
      const step = W / (ecgPoints.length * 2);
      const midY = H / 2;
      let x = offsetRef.current;
      for (let i = 0; i < ecgPoints.length; i++) {
        const px = ((x + i * step) % W + W) % W;
        const py = midY + ecgPoints[i] * (H / 200);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      offsetRef.current = (offsetRef.current - 1 + W) % W;
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="omni-root">
      {/* Sidebar */}
      <aside className="omni-sidebar">
        <div className="omni-logo">
          <div className="omni-logo__icon">🫀</div>
          <div>
            <div className="omni-logo__title">OmniDash Pro</div>
            <div className="omni-logo__sub">Enterprise Suite</div>
          </div>
        </div>
        <nav className="omni-nav">
          {navItems.map((item) => (
            <div key={item.label} className={\`omni-nav__item\${item.active ? " omni-nav__item--active" : ""}\`}>
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="omni-sidebar__footer">
          <button className="omni-btn-new">+ New Dashboard</button>
          <div className="omni-sidebar__utils">
            <div className="omni-nav__item">⚙ Settings</div>
            <div className="omni-nav__item">? Support</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="omni-main">
        {/* Topbar */}
        <header className="omni-topbar">
          <input className="omni-search" placeholder="Search patients, vitals, or medical records..." readOnly />
          <div className="omni-topbar__right">
            <button className="omni-topbar__icon">🔔</button>
            <div className="omni-topbar__user">
              <div>
                <div className="omni-topbar__name">Dr. Sarah Chen</div>
                <div className="omni-topbar__role">Senior Cardiologist</div>
              </div>
              <div className="omni-avatar">👩‍⚕️</div>
            </div>
          </div>
        </header>

        <main className="omni-content">
          {/* Page header */}
          <div className="omni-page-header">
            <div>
              <h2 className="omni-page-header__title">Clinical Overview</h2>
              <p className="omni-page-header__sub">Real-time surveillance for cardiac care unit (CCU-4).</p>
            </div>
            <div className="omni-live-badge">
              <span className="omni-live-dot"></span>
              Live Monitoring Active
            </div>
          </div>

          {/* Metrics */}
          <div className="omni-metrics">
            <div className="omni-card">
              <div className="omni-card__header">
                <span className="omni-card__label">Active Patients</span>
                <span>👥</span>
              </div>
              <div className="omni-card__value">1,284</div>
              <div className="omni-card__trend omni-card__trend--up">↑ +4.2% from last week</div>
            </div>
            <div className="omni-card omni-card--alert">
              <div className="omni-card__header">
                <span className="omni-card__label omni-card__label--error">Critical Alerts</span>
                <span>⚠</span>
              </div>
              <div className="omni-card__value omni-card__value--error">07</div>
              <div className="omni-card__sub">Requiring immediate clinician review</div>
            </div>
            <div className="omni-card">
              <div className="omni-card__header">
                <span className="omni-card__label">Avg Recovery Time</span>
                <span>⏱</span>
              </div>
              <div className="omni-card__value">4.2 <span className="omni-card__value-unit">days</span></div>
              <div className="omni-card__trend omni-card__trend--up">↓ -12% vs National Average</div>
            </div>
          </div>

          {/* ECG + Procedures */}
          <div className="omni-central">
            <div className="omni-ecg-panel">
              <div className="omni-ecg-panel__header">
                <div className="omni-ecg-panel__title-row">
                  <h3 className="omni-ecg-panel__title">Patient Vitals: Room 402</h3>
                  <span className="omni-ecg-panel__badge">ECG Lead II</span>
                </div>
                <div className="omni-ecg-panel__bpm">
                  <div>
                    <div className="omni-ecg-panel__bpm-label">Heart Rate</div>
                    <div className="omni-ecg-panel__bpm-value">72 BPM</div>
                  </div>
                  <span className="omni-heart-icon">♥</span>
                </div>
              </div>
              <div className="omni-ecg-canvas-wrap">
                <canvas ref={canvasRef} width={600} height={160} className="omni-ecg-canvas" />
              </div>
            </div>

            <div className="omni-procedures">
              <div className="omni-procedures__header">
                <h3 className="omni-procedures__title">Upcoming Procedures</h3>
                <span className="omni-link">View Calendar</span>
              </div>
              <div className="omni-procedures__list">
                {[
                  { time: "08:00", period: "AM", title: "Coronary Bypass", patient: "John D.", room: "OR-3", cls: "omni-proc--accent" },
                  { time: "10:30", period: "AM", title: "Valve Replacement", patient: "Sarah M.", room: "OR-1", cls: "omni-proc--secondary" },
                  { time: "01:15", period: "PM", title: "Angioplasty", patient: "Robert K.", room: "OR-5", cls: "omni-proc--muted" },
                ].map((p) => (
                  <div key={p.title} className={\`omni-proc \${p.cls}\`}>
                    <div className="omni-proc__time">
                      <div className="omni-proc__time-val">{p.time}</div>
                      <div className="omni-proc__period">{p.period}</div>
                    </div>
                    <div>
                      <div className="omni-proc__name">{p.title}</div>
                      <div className="omni-proc__detail">{p.patient} · {p.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="omni-bottom">
            <div className="omni-chart-panel">
              <div className="omni-chart-panel__header">
                <h3 className="omni-chart-panel__title">Weekly Patient Intake</h3>
                <select className="omni-select"><option>Last 7 Days</option><option>Last 30 Days</option></select>
              </div>
              <div className="omni-chart-area">
                <svg viewBox="0 0 700 150" preserveAspectRatio="none" className="omni-chart-svg">
                  <defs>
                    <linearGradient id="omniAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="${c.accentColor}" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="${c.accentColor}" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130 V 150 H 0 Z" fill="url(#omniAreaGrad)" />
                  <path d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130" fill="none" stroke="${c.accentColor}" strokeWidth="2.5" />
                  <circle cx="300" cy="10" r="4" fill="${c.accentColor}" />
                </svg>
              </div>
              <div className="omni-chart-days">
                {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d) => (
                  <span key={d} className={\`omni-day\${d === "WED" ? " omni-day--active" : ""}\`}>{d}</span>
                ))}
              </div>
            </div>

            <div className="omni-pathology">
              <div className="omni-pathology__bars">
                <h3 className="omni-pathology__title">Pathology Distribution</h3>
                {[
                  { label: "Cardiovascular", pct: 64, cls: "omni-bar--accent" },
                  { label: "Post-Surgical", pct: 22, cls: "omni-bar--secondary" },
                  { label: "Diagnostics", pct: 14, cls: "omni-bar--primary" },
                ].map((item) => (
                  <div key={item.label} className="omni-bar-row">
                    <div className="omni-bar-row__labels">
                      <span>{item.label}</span><span>{item.pct}%</span>
                    </div>
                    <div className="omni-bar-track">
                      <div className={\`omni-bar-fill \${item.cls}\`} style={{ width: \`\${item.pct}%\` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="omni-donut-wrap">
                <svg viewBox="0 0 36 36" className="omni-donut">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.accentColor}" strokeWidth="3" strokeDasharray="64 100" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.secondaryColor}" strokeWidth="3" strokeDasharray="22 100" strokeDashoffset="-64" />
                </svg>
                <div className="omni-donut__label">
                  <div className="omni-donut__value">1.2k</div>
                  <div className="omni-donut__sub">Total</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <button className="omni-fab" title="Code Blue Alert">🚨</button>
    </div>
  );
}
`;
}

export function generateOmnidashCSS(config: OmnidashConfig): string {
  const c = config;
  return `/* OmniDash HealthTech Dashboard */

@keyframes omnipulse {
  0%,100% { opacity: 1; }
  50%      { opacity: 0; }
}
@keyframes omnipulse-slow {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.4; }
}

/* ─── Root ─────────────────────────────────────────────────────────────── */
.omni-root {
  font-family: 'Inter', sans-serif;
  background: ${c.pageBackground};
  color: ${c.textPrimary};
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* ─── Sidebar ──────────────────────────────────────────────────────────── */
.omni-sidebar {
  width: 220px;
  min-width: 220px;
  background: ${c.sidebarBackground};
  border-right: 1px solid ${c.borderColor};
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.omni-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 20px;
}
.omni-logo__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${c.accentColor}22;
  border: 1px solid ${c.accentColor}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.omni-logo__title { font-weight: 700; font-size: 15px; line-height: 1.2; }
.omni-logo__sub {
  font-size: 9px;
  letter-spacing: 0.1em;
  color: ${c.textMuted};
  text-transform: uppercase;
}
.omni-nav { flex: 1; padding: 0 8px; }
.omni-nav__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 2px;
  cursor: pointer;
  font-size: 14px;
  color: ${c.textMuted};
  border-right: 2px solid transparent;
  transition: all 0.15s;
}
.omni-nav__item:hover {
  background: ${c.sidebarActiveBackground};
  color: ${c.textPrimary};
}
.omni-nav__item--active {
  color: ${c.accentColor};
  font-weight: 700;
  background: ${c.sidebarActiveBackground};
  border-right-color: ${c.accentColor};
}
.omni-sidebar__footer { padding: 16px 12px 0; }
.omni-btn-new {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: ${c.accentColor};
  color: #000;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
}
.omni-sidebar__utils {
  border-top: 1px solid ${c.borderColor};
  margin-top: 12px;
  padding-top: 8px;
}

/* ─── Main ─────────────────────────────────────────────────────────────── */
.omni-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.omni-topbar {
  height: 56px;
  border-bottom: 1px solid ${c.borderColor};
  background: ${c.pageBackground}cc;
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  gap: 16px;
}
.omni-search {
  flex: 1;
  max-width: 360px;
  background: ${c.sidebarActiveBackground};
  border: none;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  color: ${c.textMuted};
  outline: none;
}
.omni-topbar__right { display: flex; align-items: center; gap: 16px; }
.omni-topbar__icon { background: none; border: none; cursor: pointer; font-size: 16px; }
.omni-topbar__user {
  border-left: 1px solid ${c.borderColor};
  padding-left: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.omni-topbar__name { font-size: 13px; font-weight: 700; line-height: 1.2; }
.omni-topbar__role { font-size: 10px; color: ${c.textMuted}; }
.omni-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${c.accentColor}33;
  border: 2px solid ${c.accentColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* ─── Content ──────────────────────────────────────────────────────────── */
.omni-content {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.omni-page-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.omni-page-header__title { font-size: 26px; font-weight: 700; margin: 0; line-height: 1.2; }
.omni-page-header__sub { font-size: 13px; color: ${c.textMuted}; margin: 4px 0 0; }
.omni-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  background: ${c.accentColor}18;
  border: 1px solid ${c.accentColor}33;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${c.accentColor};
}
.omni-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${c.accentColor};
  animation: omnipulse 1.5s ease-in-out infinite;
}

/* ─── Metric cards ─────────────────────────────────────────────────────── */
.omni-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.omni-card {
  background: ${c.panelBackground};
  backdrop-filter: blur(20px);
  border: 1px solid ${c.borderColor};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.omni-card:hover { border-color: ${c.accentColor}44; }
.omni-card--alert { border-color: ${c.errorColor}33; }
.omni-card--alert:hover { border-color: ${c.errorColor}; }
.omni-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.omni-card__label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${c.textMuted}; }
.omni-card__label--error { color: ${c.errorColor}; }
.omni-card__value { font-size: 42px; font-weight: 900; line-height: 1; color: ${c.textPrimary}; }
.omni-card__value--error { color: ${c.errorColor}; }
.omni-card__value-unit { font-size: 20px; font-weight: 600; }
.omni-card__trend { font-size: 11px; font-weight: 700; margin-top: 6px; }
.omni-card__trend--up { color: ${c.accentColor}; }
.omni-card__sub { font-size: 11px; color: ${c.textMuted}; margin-top: 6px; }

/* ─── ECG + Procedures ─────────────────────────────────────────────────── */
.omni-central { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }
.omni-ecg-panel {
  background: ${c.panelBackground};
  backdrop-filter: blur(20px);
  border: 1px solid ${c.borderColor};
  border-radius: 12px;
  padding: 20px;
  height: 280px;
  display: flex;
  flex-direction: column;
}
.omni-ecg-panel__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.omni-ecg-panel__title-row { display: flex; align-items: center; gap: 10px; }
.omni-ecg-panel__title { margin: 0; font-size: 15px; font-weight: 700; }
.omni-ecg-panel__badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: ${c.sidebarActiveBackground};
  font-size: 11px;
  font-family: monospace;
  color: ${c.accentColor};
}
.omni-ecg-panel__bpm { display: flex; align-items: center; gap: 10px; }
.omni-ecg-panel__bpm-label { font-size: 10px; color: ${c.textMuted}; }
.omni-ecg-panel__bpm-value { font-size: 20px; font-weight: 700; font-family: monospace; color: ${c.accentColor}; line-height: 1; }
.omni-heart-icon { font-size: 24px; color: ${c.accentColor}; animation: omnipulse-slow 3s ease-in-out infinite; }
.omni-ecg-canvas-wrap {
  flex: 1;
  border-radius: 8px;
  background: ${c.pageBackground}88;
  border: 1px solid ${c.borderColor};
  overflow: hidden;
  position: relative;
}
.omni-ecg-canvas { width: 100%; height: 100%; display: block; }

.omni-procedures {
  background: ${c.panelBackground};
  backdrop-filter: blur(20px);
  border: 1px solid ${c.borderColor};
  border-radius: 12px;
  padding: 20px;
  height: 280px;
  display: flex;
  flex-direction: column;
}
.omni-procedures__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.omni-procedures__title { margin: 0; font-size: 15px; font-weight: 700; }
.omni-procedures__list { flex: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
.omni-link { font-size: 12px; color: ${c.accentColor}; cursor: pointer; }
.omni-proc {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${c.sidebarActiveBackground};
  border-left: 3px solid;
}
.omni-proc--accent { border-left-color: ${c.accentColor}; }
.omni-proc--secondary { border-left-color: ${c.secondaryColor}; }
.omni-proc--muted { border-left-color: ${c.textMuted}; }
.omni-proc__time { background: ${c.pageBackground}88; padding: 4px 8px; border-radius: 6px; text-align: center; min-width: 44px; }
.omni-proc__time-val { font-size: 10px; color: ${c.textMuted}; line-height: 1; }
.omni-proc__period { font-size: 11px; font-weight: 700; color: ${c.textPrimary}; }
.omni-proc__name { font-size: 13px; font-weight: 700; }
.omni-proc__detail { font-size: 11px; color: ${c.textMuted}; }

/* ─── Bottom row ───────────────────────────────────────────────────────── */
.omni-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.omni-chart-panel {
  background: ${c.panelBackground};
  backdrop-filter: blur(20px);
  border: 1px solid ${c.borderColor};
  border-radius: 12px;
  padding: 20px;
  height: 220px;
  display: flex;
  flex-direction: column;
}
.omni-chart-panel__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.omni-chart-panel__title { margin: 0; font-size: 15px; font-weight: 700; }
.omni-select { background: transparent; border: none; color: ${c.textMuted}; font-size: 12px; outline: none; cursor: pointer; }
.omni-chart-area { flex: 1; position: relative; }
.omni-chart-svg { width: 100%; height: 100%; }
.omni-chart-days { display: flex; justify-content: space-between; padding-top: 6px; }
.omni-day { font-size: 10px; color: ${c.textMuted}; font-family: monospace; }
.omni-day--active { color: ${c.accentColor}; font-weight: 700; }

.omni-pathology {
  background: ${c.panelBackground};
  backdrop-filter: blur(20px);
  border: 1px solid ${c.borderColor};
  border-radius: 12px;
  padding: 20px;
  height: 220px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.omni-pathology__bars { flex: 1; }
.omni-pathology__title { margin: 0 0 14px; font-size: 15px; font-weight: 700; }
.omni-bar-row { margin-bottom: 10px; }
.omni-bar-row__labels { display: flex; justify-content: space-between; font-size: 12px; color: ${c.textMuted}; margin-bottom: 4px; }
.omni-bar-track { height: 4px; background: ${c.sidebarActiveBackground}; border-radius: 999px; overflow: hidden; }
.omni-bar-fill { height: 100%; border-radius: 999px; }
.omni-bar--accent { background: ${c.accentColor}; }
.omni-bar--secondary { background: ${c.secondaryColor}; }
.omni-bar--primary { background: #adc6ff; }
.omni-donut-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
.omni-donut { width: 100%; height: 100%; transform: rotate(-90deg); }
.omni-donut__label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.omni-donut__value { font-size: 16px; font-weight: 700; line-height: 1; }
.omni-donut__sub { font-size: 9px; text-transform: uppercase; color: ${c.textMuted}; letter-spacing: 0.06em; }

/* ─── FAB ──────────────────────────────────────────────────────────────── */
.omni-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${c.accentColor};
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px ${c.accentColor}33;
  z-index: 10;
  transition: transform 0.15s;
}
.omni-fab:hover { transform: scale(1.1); }
`;
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateOmnidashTSX(config: OmnidashConfig): string {
  const c = config;
  return `import { useState, useEffect, useRef } from "react";
import "./OmniDash.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
}

interface ProcedureItem {
  time: string;
  period: string;
  title: string;
  patient: string;
  room: string;
  cls: string;
}

interface PathologyItem {
  label: string;
  pct: number;
  cls: string;
}

// ─── OmniDash HealthTech Dashboard ───────────────────────────────────────────
export default function OmniDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const navItems: NavItem[] = [
    { label: "HealthTech", icon: "🫀", active: true },
    { label: "FinTech", icon: "💳" },
    { label: "E-commerce", icon: "🛒" },
    { label: "Cybersecurity", icon: "🔐" },
    { label: "Logistics", icon: "🚚" },
    { label: "Marketing", icon: "📣" },
    { label: "SaaS", icon: "📊" },
    { label: "Energy", icon: "⚡" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ecgPoints: number[] = [
      0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,
    ];

    function draw(): void {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);

      ctx!.strokeStyle = "rgba(255,255,255,0.04)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += W / 5) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke();
      }
      for (let y = 0; y < H; y += H / 3) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke();
      }

      ctx!.beginPath();
      ctx!.strokeStyle = "${c.accentColor}";
      ctx!.lineWidth = 2.5;
      ctx!.shadowColor = "${c.accentColor}";
      ctx!.shadowBlur = 8;
      const step = W / (ecgPoints.length * 2);
      const midY = H / 2;
      let x = offsetRef.current;
      for (let i = 0; i < ecgPoints.length; i++) {
        const px = ((x + i * step) % W + W) % W;
        const py = midY + ecgPoints[i] * (H / 200);
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      offsetRef.current = (offsetRef.current - 1 + W) % W;
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="omni-root">
      {/* Sidebar */}
      <aside className="omni-sidebar">
        <div className="omni-logo">
          <div className="omni-logo__icon">🫀</div>
          <div>
            <div className="omni-logo__title">OmniDash Pro</div>
            <div className="omni-logo__sub">Enterprise Suite</div>
          </div>
        </div>
        <nav className="omni-nav">
          {navItems.map((item: NavItem) => (
            <div key={item.label} className={\`omni-nav__item\${item.active ? " omni-nav__item--active" : ""}\`}>
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="omni-sidebar__footer">
          <button className="omni-btn-new">+ New Dashboard</button>
          <div className="omni-sidebar__utils">
            <div className="omni-nav__item">⚙ Settings</div>
            <div className="omni-nav__item">? Support</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="omni-main">
        {/* Topbar */}
        <header className="omni-topbar">
          <input className="omni-search" placeholder="Search patients, vitals, or medical records..." readOnly />
          <div className="omni-topbar__right">
            <button className="omni-topbar__icon">🔔</button>
            <div className="omni-topbar__user">
              <div>
                <div className="omni-topbar__name">Dr. Sarah Chen</div>
                <div className="omni-topbar__role">Senior Cardiologist</div>
              </div>
              <div className="omni-avatar">👩‍⚕️</div>
            </div>
          </div>
        </header>

        <main className="omni-content">
          {/* Page header */}
          <div className="omni-page-header">
            <div>
              <h2 className="omni-page-header__title">Clinical Overview</h2>
              <p className="omni-page-header__sub">Real-time surveillance for cardiac care unit (CCU-4).</p>
            </div>
            <div className="omni-live-badge">
              <span className="omni-live-dot"></span>
              Live Monitoring Active
            </div>
          </div>

          {/* Metrics */}
          <div className="omni-metrics">
            <div className="omni-card">
              <div className="omni-card__header">
                <span className="omni-card__label">Active Patients</span>
                <span>👥</span>
              </div>
              <div className="omni-card__value">1,284</div>
              <div className="omni-card__trend omni-card__trend--up">↑ +4.2% from last week</div>
            </div>
            <div className="omni-card omni-card--alert">
              <div className="omni-card__header">
                <span className="omni-card__label omni-card__label--error">Critical Alerts</span>
                <span>⚠</span>
              </div>
              <div className="omni-card__value omni-card__value--error">07</div>
              <div className="omni-card__sub">Requiring immediate clinician review</div>
            </div>
            <div className="omni-card">
              <div className="omni-card__header">
                <span className="omni-card__label">Avg Recovery Time</span>
                <span>⏱</span>
              </div>
              <div className="omni-card__value">4.2 <span className="omni-card__value-unit">days</span></div>
              <div className="omni-card__trend omni-card__trend--up">↓ -12% vs National Average</div>
            </div>
          </div>

          {/* ECG + Procedures */}
          <div className="omni-central">
            <div className="omni-ecg-panel">
              <div className="omni-ecg-panel__header">
                <div className="omni-ecg-panel__title-row">
                  <h3 className="omni-ecg-panel__title">Patient Vitals: Room 402</h3>
                  <span className="omni-ecg-panel__badge">ECG Lead II</span>
                </div>
                <div className="omni-ecg-panel__bpm">
                  <div>
                    <div className="omni-ecg-panel__bpm-label">Heart Rate</div>
                    <div className="omni-ecg-panel__bpm-value">72 BPM</div>
                  </div>
                  <span className="omni-heart-icon">♥</span>
                </div>
              </div>
              <div className="omni-ecg-canvas-wrap">
                <canvas ref={canvasRef} width={600} height={160} className="omni-ecg-canvas" />
              </div>
            </div>

            <div className="omni-procedures">
              <div className="omni-procedures__header">
                <h3 className="omni-procedures__title">Upcoming Procedures</h3>
                <span className="omni-link">View Calendar</span>
              </div>
              <div className="omni-procedures__list">
                {([
                  { time: "08:00", period: "AM", title: "Coronary Bypass", patient: "John D.", room: "OR-3", cls: "omni-proc--accent" },
                  { time: "10:30", period: "AM", title: "Valve Replacement", patient: "Sarah M.", room: "OR-1", cls: "omni-proc--secondary" },
                  { time: "01:15", period: "PM", title: "Angioplasty", patient: "Robert K.", room: "OR-5", cls: "omni-proc--muted" },
                ] as ProcedureItem[]).map((p: ProcedureItem) => (
                  <div key={p.title} className={\`omni-proc \${p.cls}\`}>
                    <div className="omni-proc__time">
                      <div className="omni-proc__time-val">{p.time}</div>
                      <div className="omni-proc__period">{p.period}</div>
                    </div>
                    <div>
                      <div className="omni-proc__name">{p.title}</div>
                      <div className="omni-proc__detail">{p.patient} · {p.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="omni-bottom">
            <div className="omni-chart-panel">
              <div className="omni-chart-panel__header">
                <h3 className="omni-chart-panel__title">Weekly Patient Intake</h3>
                <select className="omni-select"><option>Last 7 Days</option><option>Last 30 Days</option></select>
              </div>
              <div className="omni-chart-area">
                <svg viewBox="0 0 700 150" preserveAspectRatio="none" className="omni-chart-svg">
                  <defs>
                    <linearGradient id="omniAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="${c.accentColor}" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="${c.accentColor}" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130 V 150 H 0 Z" fill="url(#omniAreaGrad)" />
                  <path d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130" fill="none" stroke="${c.accentColor}" strokeWidth="2.5" />
                  <circle cx="300" cy="10" r="4" fill="${c.accentColor}" />
                </svg>
              </div>
              <div className="omni-chart-days">
                {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d: string) => (
                  <span key={d} className={\`omni-day\${d === "WED" ? " omni-day--active" : ""}\`}>{d}</span>
                ))}
              </div>
            </div>

            <div className="omni-pathology">
              <div className="omni-pathology__bars">
                <h3 className="omni-pathology__title">Pathology Distribution</h3>
                {([
                  { label: "Cardiovascular", pct: 64, cls: "omni-bar--accent" },
                  { label: "Post-Surgical", pct: 22, cls: "omni-bar--secondary" },
                  { label: "Diagnostics", pct: 14, cls: "omni-bar--primary" },
                ] as PathologyItem[]).map((item: PathologyItem) => (
                  <div key={item.label} className="omni-bar-row">
                    <div className="omni-bar-row__labels">
                      <span>{item.label}</span><span>{item.pct}%</span>
                    </div>
                    <div className="omni-bar-track">
                      <div className={\`omni-bar-fill \${item.cls}\`} style={{ width: \`\${item.pct}%\` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="omni-donut-wrap">
                <svg viewBox="0 0 36 36" className="omni-donut">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.accentColor}" strokeWidth="3" strokeDasharray="64 100" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.secondaryColor}" strokeWidth="3" strokeDasharray="22 100" strokeDashoffset="-64" />
                </svg>
                <div className="omni-donut__label">
                  <div className="omni-donut__value">1.2k</div>
                  <div className="omni-donut__sub">Total</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <button className="omni-fab" title="Code Blue Alert">🚨</button>
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateOmnidashTailwind(config: OmnidashConfig): string {
  const c = config;
  return `import { useEffect, useRef, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
}

interface ProcedureItem {
  time: string;
  period: string;
  title: string;
  patient: string;
  room: string;
  accentVar: string;
}

interface PathologyItem {
  label: string;
  pct: number;
  barVar: string;
}

// Baked-in CSS variable tokens — update these to reskin OmniDash
const omniVars: CSSProperties = {
  "--omni-page-bg":          "${c.pageBackground}",
  "--omni-sidebar-bg":       "${c.sidebarBackground}",
  "--omni-sidebar-active-bg":"${c.sidebarActiveBackground}",
  "--omni-panel-bg":         "${c.panelBackground}",
  "--omni-border":           "${c.borderColor}",
  "--omni-accent":           "${c.accentColor}",
  "--omni-accent-18":        "${c.accentColor}18",
  "--omni-accent-22":        "${c.accentColor}22",
  "--omni-accent-33":        "${c.accentColor}33",
  "--omni-accent-44":        "${c.accentColor}44",
  "--omni-secondary":        "${c.secondaryColor}",
  "--omni-text-primary":     "${c.textPrimary}",
  "--omni-text-muted":       "${c.textMuted}",
  "--omni-error":            "${c.errorColor}",
  "--omni-error-33":         "${c.errorColor}33",
} as CSSProperties;

// ─── OmniDash HealthTech Dashboard ───────────────────────────────────────────
export default function OmniDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const navItems: NavItem[] = [
    { label: "HealthTech", icon: "🫀", active: true },
    { label: "FinTech", icon: "💳" },
    { label: "E-commerce", icon: "🛒" },
    { label: "Cybersecurity", icon: "🔐" },
    { label: "Logistics", icon: "🚚" },
    { label: "Marketing", icon: "📣" },
    { label: "SaaS", icon: "📊" },
    { label: "Energy", icon: "⚡" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ecgPoints: number[] = [
      0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,0,0,0,-8,0,0,-60,60,0,10,-10,0,0,
    ];

    function draw(): void {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);

      ctx!.strokeStyle = "rgba(255,255,255,0.04)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += W / 5) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke();
      }
      for (let y = 0; y < H; y += H / 3) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke();
      }

      ctx!.beginPath();
      ctx!.strokeStyle = "${c.accentColor}";
      ctx!.lineWidth = 2.5;
      ctx!.shadowColor = "${c.accentColor}";
      ctx!.shadowBlur = 8;
      const step = W / (ecgPoints.length * 2);
      const midY = H / 2;
      let x = offsetRef.current;
      for (let i = 0; i < ecgPoints.length; i++) {
        const px = ((x + i * step) % W + W) % W;
        const py = midY + ecgPoints[i] * (H / 200);
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      offsetRef.current = (offsetRef.current - 1 + W) % W;
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      className="flex min-h-screen relative font-sans"
      style={{ ...omniVars, backgroundColor: "var(--omni-page-bg)", color: "var(--omni-text-primary)" }}
    >
      <style>{\`
        @keyframes omnipulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes omnipulse-slow {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      \`}</style>

      {/* Sidebar */}
      <aside
        className="flex flex-col min-w-[220px] w-[220px] py-5 border-r border-[var(--omni-border)]"
        style={{ backgroundColor: "var(--omni-sidebar-bg)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-[10px] px-4 pb-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[18px] border border-[var(--omni-accent-44)]"
            style={{ backgroundColor: "var(--omni-accent-22)" }}
          >
            🫀
          </div>
          <div>
            <div className="font-bold text-[15px] leading-tight">OmniDash Pro</div>
            <div
              className="text-[9px] uppercase tracking-widest"
              style={{ color: "var(--omni-text-muted)" }}
            >
              Enterprise Suite
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2">
          {navItems.map((item: NavItem) => {
            let cls = "flex items-center gap-[10px] px-3 py-2 rounded-lg mb-[2px] cursor-pointer text-[14px] border-r-2 transition-all duration-150 ";
            if (item.active) {
              cls += "font-bold border-r-[var(--omni-accent)] bg-[var(--omni-sidebar-active-bg)] text-[var(--omni-accent)]";
            } else {
              cls += "border-r-transparent text-[var(--omni-text-muted)] hover:bg-[var(--omni-sidebar-active-bg)] hover:text-[var(--omni-text-primary)]";
            }
            return (
              <div key={item.label} className={cls}>
                <span>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pt-4">
          <button
            className="w-full py-[10px] rounded-[10px] font-bold text-[13px] border-none cursor-pointer text-black"
            style={{ backgroundColor: "var(--omni-accent)" }}
          >
            + New Dashboard
          </button>
          <div className="border-t border-[var(--omni-border)] mt-3 pt-2">
            <div className="flex items-center gap-[10px] px-3 py-2 rounded-lg cursor-pointer text-[14px] text-[var(--omni-text-muted)] hover:bg-[var(--omni-sidebar-active-bg)] hover:text-[var(--omni-text-primary)] transition-all duration-150">
              ⚙ Settings
            </div>
            <div className="flex items-center gap-[10px] px-3 py-2 rounded-lg cursor-pointer text-[14px] text-[var(--omni-text-muted)] hover:bg-[var(--omni-sidebar-active-bg)] hover:text-[var(--omni-text-primary)] transition-all duration-150">
              ? Support
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-6 gap-4 border-b border-[var(--omni-border)] backdrop-blur-[16px]"
          style={{ backgroundColor: "${c.pageBackground}cc" }}
        >
          <input
            className="flex-1 max-w-[360px] rounded-full px-[14px] py-[7px] text-[12px] border-none outline-none text-[var(--omni-text-muted)]"
            style={{ backgroundColor: "var(--omni-sidebar-active-bg)" }}
            placeholder="Search patients, vitals, or medical records..."
            readOnly
          />
          <div className="flex items-center gap-4">
            <button className="bg-transparent border-none cursor-pointer text-[16px]">🔔</button>
            <div className="flex items-center gap-[10px] border-l border-[var(--omni-border)] pl-4">
              <div>
                <div className="text-[13px] font-bold leading-tight">Dr. Sarah Chen</div>
                <div className="text-[10px] text-[var(--omni-text-muted)]">Senior Cardiologist</div>
              </div>
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[16px] border-2 border-[var(--omni-accent)]"
                style={{ backgroundColor: "var(--omni-accent-33)" }}
              >
                👩‍⚕️
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {/* Page header */}
          <div className="flex items-end justify-between flex-wrap gap-[10px]">
            <div>
              <h2 className="text-[26px] font-bold m-0 leading-tight">Clinical Overview</h2>
              <p className="text-[13px] text-[var(--omni-text-muted)] mt-1 mb-0">
                Real-time surveillance for cardiac care unit (CCU-4).
              </p>
            </div>
            <div
              className="flex items-center gap-[6px] px-[14px] py-[5px] rounded-full text-[10px] font-bold uppercase tracking-[0.08em] border text-[var(--omni-accent)] border-[var(--omni-accent-33)]"
              style={{ backgroundColor: "var(--omni-accent-18)" }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-[var(--omni-accent)]"
                style={{ animation: "omnipulse 1.5s ease-in-out infinite" }}
              />
              Live Monitoring Active
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {/* Card: Active Patients */}
            <div
              className="rounded-xl p-5 cursor-pointer border border-[var(--omni-border)] hover:border-[var(--omni-accent-44)] transition-colors duration-200 backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--omni-text-muted)]">
                  Active Patients
                </span>
                <span>👥</span>
              </div>
              <div className="text-[42px] font-black leading-none text-[var(--omni-text-primary)]">1,284</div>
              <div className="text-[11px] font-bold mt-[6px] text-[var(--omni-accent)]">↑ +4.2% from last week</div>
            </div>

            {/* Card: Critical Alerts */}
            <div
              className="rounded-xl p-5 cursor-pointer border border-[var(--omni-error-33)] hover:border-[var(--omni-error)] transition-colors duration-200 backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--omni-error)]">
                  Critical Alerts
                </span>
                <span>⚠</span>
              </div>
              <div className="text-[42px] font-black leading-none text-[var(--omni-error)]">07</div>
              <div className="text-[11px] text-[var(--omni-text-muted)] mt-[6px]">
                Requiring immediate clinician review
              </div>
            </div>

            {/* Card: Avg Recovery */}
            <div
              className="rounded-xl p-5 cursor-pointer border border-[var(--omni-border)] hover:border-[var(--omni-accent-44)] transition-colors duration-200 backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--omni-text-muted)]">
                  Avg Recovery Time
                </span>
                <span>⏱</span>
              </div>
              <div className="text-[42px] font-black leading-none text-[var(--omni-text-primary)]">
                4.2 <span className="text-[20px] font-semibold">days</span>
              </div>
              <div className="text-[11px] font-bold mt-[6px] text-[var(--omni-accent)]">↓ -12% vs National Average</div>
            </div>
          </div>

          {/* ECG + Procedures */}
          <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
            {/* ECG Panel */}
            <div
              className="rounded-xl p-5 h-[280px] flex flex-col border border-[var(--omni-border)] backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-[14px]">
                <div className="flex items-center gap-[10px]">
                  <h3 className="m-0 text-[15px] font-bold">Patient Vitals: Room 402</h3>
                  <span
                    className="px-[10px] py-[2px] rounded-full text-[11px] font-mono text-[var(--omni-accent)]"
                    style={{ backgroundColor: "var(--omni-sidebar-active-bg)" }}
                  >
                    ECG Lead II
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <div>
                    <div className="text-[10px] text-[var(--omni-text-muted)]">Heart Rate</div>
                    <div className="text-[20px] font-bold font-mono leading-none text-[var(--omni-accent)]">72 BPM</div>
                  </div>
                  <span
                    className="text-[24px] text-[var(--omni-accent)]"
                    style={{ animation: "omnipulse-slow 3s ease-in-out infinite" }}
                  >
                    ♥
                  </span>
                </div>
              </div>
              <div
                className="flex-1 rounded-lg border border-[var(--omni-border)] overflow-hidden relative"
                style={{ backgroundColor: "${c.pageBackground}88" }}
              >
                <canvas ref={canvasRef} width={600} height={160} className="w-full h-full block" />
              </div>
            </div>

            {/* Procedures */}
            <div
              className="rounded-xl p-5 h-[280px] flex flex-col border border-[var(--omni-border)] backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-[14px]">
                <h3 className="m-0 text-[15px] font-bold">Upcoming Procedures</h3>
                <span className="text-[12px] cursor-pointer text-[var(--omni-accent)]">View Calendar</span>
              </div>
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {([
                  { time: "08:00", period: "AM", title: "Coronary Bypass",  patient: "John D.",   room: "OR-3", accentVar: "var(--omni-accent)" },
                  { time: "10:30", period: "AM", title: "Valve Replacement", patient: "Sarah M.",  room: "OR-1", accentVar: "var(--omni-secondary)" },
                  { time: "01:15", period: "PM", title: "Angioplasty",       patient: "Robert K.", room: "OR-5", accentVar: "var(--omni-text-muted)" },
                ] as ProcedureItem[]).map((p: ProcedureItem) => (
                  <div
                    key={p.title}
                    className="flex gap-[10px] px-3 py-[10px] rounded-lg border-l-[3px]"
                    style={{
                      backgroundColor: "var(--omni-sidebar-active-bg)",
                      borderLeftColor: p.accentVar,
                    }}
                  >
                    <div
                      className="px-2 py-1 rounded-md text-center min-w-[44px]"
                      style={{ backgroundColor: "${c.pageBackground}88" }}
                    >
                      <div className="text-[10px] text-[var(--omni-text-muted)] leading-none">{p.time}</div>
                      <div className="text-[11px] font-bold text-[var(--omni-text-primary)]">{p.period}</div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold">{p.title}</div>
                      <div className="text-[11px] text-[var(--omni-text-muted)]">{p.patient} · {p.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Chart Panel */}
            <div
              className="rounded-xl p-5 h-[220px] flex flex-col border border-[var(--omni-border)] backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex items-center justify-between mb-[10px]">
                <h3 className="m-0 text-[15px] font-bold">Weekly Patient Intake</h3>
                <select
                  className="bg-transparent border-none outline-none cursor-pointer text-[12px] text-[var(--omni-text-muted)]"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <svg viewBox="0 0 700 150" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="omniAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="${c.accentColor}" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="${c.accentColor}" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130 V 150 H 0 Z"
                    fill="url(#omniAreaGrad)"
                  />
                  <path
                    d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130"
                    fill="none"
                    stroke="${c.accentColor}"
                    strokeWidth="2.5"
                  />
                  <circle cx="300" cy="10" r="4" fill="${c.accentColor}" />
                </svg>
              </div>
              <div className="flex justify-between pt-[6px]">
                {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d: string) => (
                  <span
                    key={d}
                    className={\`text-[10px] font-mono \${d === "WED" ? "font-bold text-[var(--omni-accent)]" : "text-[var(--omni-text-muted)]"}\`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Pathology */}
            <div
              className="rounded-xl p-5 h-[220px] flex items-center gap-6 border border-[var(--omni-border)] backdrop-blur-[20px]"
              style={{ backgroundColor: "var(--omni-panel-bg)" }}
            >
              <div className="flex-1">
                <h3 className="m-0 mb-[14px] text-[15px] font-bold">Pathology Distribution</h3>
                {([
                  { label: "Cardiovascular", pct: 64, barVar: "var(--omni-accent)" },
                  { label: "Post-Surgical",  pct: 22, barVar: "var(--omni-secondary)" },
                  { label: "Diagnostics",    pct: 14, barVar: "#adc6ff" },
                ] as PathologyItem[]).map((item: PathologyItem) => (
                  <div key={item.label} className="mb-[10px]">
                    <div className="flex justify-between text-[12px] text-[var(--omni-text-muted)] mb-1">
                      <span>{item.label}</span><span>{item.pct}%</span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--omni-sidebar-active-bg)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: \`\${item.pct}%\`, backgroundColor: item.barVar }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.accentColor}" strokeWidth="3" strokeDasharray="64 100" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${c.secondaryColor}" strokeWidth="3" strokeDasharray="22 100" strokeDashoffset="-64" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-[16px] font-bold leading-none">1.2k</div>
                  <div className="text-[9px] uppercase text-[var(--omni-text-muted)] tracking-[0.06em]">Total</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-6 right-6 w-[52px] h-[52px] rounded-full border-none cursor-pointer text-[22px] flex items-center justify-center z-20 hover:scale-110 transition-transform duration-150 text-black"
        style={{
          backgroundColor: "var(--omni-accent)",
          boxShadow: "0 0 20px var(--omni-accent-33)",
        }}
        title="Code Blue Alert"
      >
        🚨
      </button>
    </div>
  );
}
`;
}
