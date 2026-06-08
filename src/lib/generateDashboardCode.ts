import { DashboardConfig } from "./dashboardConfig";

// Derive alpha variants from hex accent
function hex(base: string, alpha: string) {
  return base + alpha;
}

export function generateDashboardJSX(config: DashboardConfig): string {
  const accent = config.accentColor;

  return `import { useEffect, useRef } from "react";
import "./Dashboard.css";

const ACCENT = "${accent}";
const ACCENT_10 = "${hex(accent, "1a")}";
const ACCENT_20 = "${hex(accent, "33")}";
const ACCENT_30 = "${hex(accent, "4d")}";
const ACCENT_60 = "${hex(accent, "99")}";
const GLOW_BOX = \`0 0 12px \${ACCENT}55\`;

const regions = [
  { name: "North America", amount: "$142,500", pct: 85, opacity: 1 },
  { name: "European Union", amount: "$98,200", pct: 60, opacity: 0.7 },
  { name: "Asia Pacific", amount: "$76,400", pct: 45, opacity: 0.5 },
  { name: "Latin America", amount: "$34,100", pct: 22, opacity: 0.3 },
  { name: "Middle East & Africa", amount: "$12,800", pct: 10, opacity: 0.2 },
];

const channels = [
  { label: "Organic Search", pct: "45%", dash: 45, offset: 0, color: ACCENT },
  { label: "Paid Advertising", pct: "25%", dash: 25, offset: -45, color: ACCENT_60 },
  { label: "Social Media", pct: "20%", dash: 20, offset: -70, color: ACCENT_30 },
  { label: "Direct Referral", pct: "10%", dash: 10, offset: -90, color: ACCENT_10 },
];

export default function Dashboard() {
  const chartRef = useRef(null);
  const chart2Ref = useRef(null);

  useEffect(() => {
    [chartRef, chart2Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = "none";
        void ref.current.offsetWidth;
        ref.current.style.animation = "dash 3s ease-out forwards";
      }
    });
  }, []);

  return (
    <div className="db-root">
      <aside className="db-aside">
        <div className="db-logo">
          <div className="db-logo__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="db-logo__text">ArchitectCore</span>
        </div>
        <nav className="db-nav">
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "↗", label: "Analytics", active: false },
            { icon: "▤", label: "Projects", active: false },
            { icon: "⚇", label: "Team", active: false },
            { icon: "☰", label: "Reports", active: false },
          ].map((item) => (
            <div key={item.label} className={\`db-nav__item\${item.active ? " db-nav__item--active" : ""}\`}>
              <span className="db-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="db-nav db-nav--footer">
          {[{ icon: "⚙", label: "Settings" }, { icon: "?", label: "Support" }].map((item) => (
            <div key={item.label} className="db-nav__item">
              <span className="db-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <span className="db-header__title">Overview</span>
          <div className="db-header__actions">
            <div className="db-search">
              <span className="db-search__icon">⌕</span>
              <input className="db-search__input" placeholder="Global search..." readOnly />
            </div>
            <div className="db-avatar">A</div>
          </div>
        </header>

        <div className="db-canvas">
          {/* Hero KPI */}
          <div className="db-card db-hero">
            <div className="db-hero__meta">
              <div>
                <div className="db-hero__label">↗ Monthly Profit Overview</div>
                <div className="db-hero__amount">
                  $456,789
                  <span className="db-hero__badge">▲ 16%</span>
                </div>
              </div>
              <div className="db-hero__date">
                <div>18 Dec — 18 Jan</div>
                <div className="db-hero__updated">Updated 2m ago</div>
              </div>
            </div>
            <div className="db-hero__chart">
              <svg width="100%" height="100%" viewBox="0 0 1000 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path ref={chartRef} className="db-chart-line"
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70"
                  fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70 L1000,160 L0,160 Z"
                  fill="url(#cg)"
                />
              </svg>
            </div>
          </div>

          {/* KPIs */}
          <div className="db-bento">
            {[
              { label: "Total Revenue", value: "$98,450", delta: "▲ 12.5%", bars: [2, 4, 6, 8] },
              { label: "Units Sold", value: "3,285", delta: "▲ 12.6%", progress: 78 },
              { label: "New Customers", value: "486", delta: "▲ 4.2%", progress: 72 },
              { label: "Purchase Rate", value: "45.2%", delta: "▲ 9.2%", bars: [6, 4, 5, 8] },
            ].map((kpi, i) => (
              <div key={i} className="db-kpi">
                <div className="db-kpi__label">{kpi.label}</div>
                <div className="db-kpi__value">{kpi.value}</div>
                <div className="db-kpi__delta">{kpi.delta}</div>
                {kpi.bars ? (
                  <div className="db-kpi__bars">
                    {kpi.bars.map((h, j) => (
                      <div key={j} className={\`db-kpi__bar\${j === kpi.bars.length - 1 ? " db-kpi__bar--accent" : ""}\`}
                        style={{ height: \`\${h * 3.5}px\` }} />
                    ))}
                  </div>
                ) : (
                  <div className="db-kpi__progress-track">
                    <div className="db-kpi__progress-fill" style={{ width: \`\${kpi.progress}%\` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue vs Target + Donut */}
          <div className="db-split">
            <div className="db-card">
              <div className="db-section-head">
                <div>
                  <div className="db-section-title">Revenue vs. Target</div>
                  <div className="db-section-sub">Real-time performance tracking</div>
                </div>
                <div className="db-legend">
                  <div className="db-legend__item"><div className="db-legend__dot db-legend__dot--accent" />Actual</div>
                  <div className="db-legend__item db-legend__item--muted"><div className="db-legend__dot db-legend__dot--dashed" />Target</div>
                </div>
              </div>
              <div className="db-linechart">
                <svg width="100%" height="100%" viewBox="0 0 800 160">
                  <line x1="0" y1="30" x2="800" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <path d="M0,130 L100,120 L200,110 L300,95 L400,85 L500,70 L600,60 L700,50 L800,45"
                    fill="none" stroke="#737685" strokeDasharray="8,8" strokeWidth="2" opacity="0.4" />
                  <path ref={chart2Ref} className="db-chart-line"
                    d="M0,145 L100,120 L200,100 L300,130 L400,60 L500,85 L600,30 L700,55 L800,20"
                    fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="db-week-labels">
                {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7","Wk 8"].map(w => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-section-title" style={{ marginBottom: 16 }}>Acquisition Channels</div>
              <div className="db-donut-wrap">
                <div className="db-donut">
                  <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    {channels.map((ch, i) => (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={ch.color}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={\`\${ch.dash} \${100 - ch.dash}\`} strokeDashoffset={ch.offset} />
                    ))}
                  </svg>
                  <div className="db-donut__center">
                    <span className="db-donut__value">4.8k</span>
                    <span className="db-donut__label">Total Leads</span>
                  </div>
                </div>
                <div className="db-channels">
                  {channels.map((ch) => (
                    <div key={ch.label} className="db-channel-row">
                      <div className="db-channel-row__left">
                        <div className="db-channel-row__dot" style={{ backgroundColor: ch.color }} />
                        <span>{ch.label}</span>
                      </div>
                      <span className="db-channel-row__pct">{ch.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regional + Activities */}
          <div className="db-split">
            <div className="db-card">
              <div className="db-section-head" style={{ marginBottom: 20 }}>
                <div className="db-section-title">Regional Performance</div>
                <select className="db-select">
                  <option>Current Quarter</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="db-regions">
                {regions.map((r) => (
                  <div key={r.name} className="db-region">
                    <div className="db-region__meta">
                      <span>{r.name}</span>
                      <span className="db-region__amount">{r.amount}</span>
                    </div>
                    <div className="db-region__track">
                      <div className="db-region__fill" style={{ width: \`\${r.pct}%\`, opacity: r.opacity }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="db-card db-activities">
              <div className="db-section-title" style={{ marginBottom: 18 }}>Recent Activities</div>
              {[
                { icon: "🛒", accent: true, title: "New transaction recorded", sub: "2,450 USD from client #092", time: "12:45 PM" },
                { icon: "👤", accent: false, title: "New user onboarded", sub: "Marketing lead: Sarah Jenkins", time: "11:20 AM" },
                { icon: "⚡", accent: true, title: "System Update", sub: "V4.2 successfully deployed", time: "09:00 AM" },
                { icon: "🔒", accent: false, title: "Security Audit", sub: "Automated scan completed", time: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="db-activity">
                  <div className={\`db-activity__icon\${item.accent ? " db-activity__icon--accent" : ""}\`}>{item.icon}</div>
                  <div>
                    <div className="db-activity__title">{item.title}</div>
                    <div className="db-activity__sub">{item.sub}</div>
                    <div className="db-activity__time">{item.time}</div>
                  </div>
                </div>
              ))}
              <button className="db-audit-btn">View Audit Log</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generateDashboardCSS(config: DashboardConfig): string {
  const accent = config.accentColor;
  const a10 = accent + "1a";
  const a20 = accent + "33";
  const a30 = accent + "4d";
  const a60 = accent + "99";
  const glow = `0 0 12px ${accent}55`;

  return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@keyframes dash {
  to { stroke-dashoffset: 0; }
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.db-root {
  font-family: 'Inter', sans-serif;
  background-color: #0a0a0a;
  color: #f9f9ff;
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Sidebar */
.db-aside {
  width: 220px;
  flex-shrink: 0;
  background-color: #121212;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.db-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 28px;
}

.db-logo__icon {
  width: 30px;
  height: 30px;
  background-color: ${accent};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.db-logo__text {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: -0.02em;
}

.db-nav { display: flex; flex-direction: column; gap: 1px; }
.db-nav--footer { margin-top: auto; }

.db-nav__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  margin: 1px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #737685;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}
.db-nav__item:hover { background-color: rgba(255,255,255,0.04); }
.db-nav__item--active {
  color: ${accent};
  background-color: ${a10};
  border-left-color: ${accent};
}
.db-nav__icon { font-size: 14px; font-weight: 600; }

/* Header */
.db-header {
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #1e1e1e;
  background-color: rgba(10,10,10,0.85);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}
.db-header__title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  opacity: 0.5;
  text-transform: uppercase;
}
.db-header__actions { display: flex; align-items: center; gap: 12px; }

.db-search { position: relative; }
.db-search__icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #737685;
}
.db-search__input {
  background-color: #1e1e1e;
  border: none;
  border-radius: 9999px;
  padding: 6px 14px 6px 32px;
  font-size: 11px;
  color: #f9f9ff;
  width: 200px;
  outline: none;
  font-family: inherit;
}

.db-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background-color: ${a30};
  color: ${accent};
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}

/* Main canvas */
.db-main { flex: 1; display: flex; flex-direction: column; background-color: #0a0a0a; min-width: 0; }
.db-canvas { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }

/* Cards */
.db-card {
  backdrop-filter: blur(12px);
  background-color: rgba(18,18,18,0.85);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px;
  padding: 24px;
}

/* Hero */
.db-hero { position: relative; overflow: hidden; }
.db-hero__meta { display: flex; justify-content: space-between; align-items: flex-start; }
.db-hero__label { display: flex; align-items: center; gap: 6px; color: #737685; font-size: 12px; margin-bottom: 8px; }
.db-hero__amount { font-size: 48px; font-weight: 900; line-height: 1; letter-spacing: -0.03em; display: flex; align-items: baseline; }
.db-hero__badge {
  display: inline-flex; align-items: center; gap: 4px;
  background-color: ${a20}; color: ${accent};
  padding: 2px 8px; border-radius: 6px;
  font-size: 12px; font-weight: 700; margin-left: 12px;
}
.db-hero__date { text-align: right; font-size: 10px; color: #737685; font-weight: 500; }
.db-hero__updated { opacity: 0.5; margin-top: 2px; }
.db-hero__chart { margin-top: 20px; height: 160px; filter: drop-shadow(0 0 8px ${a60}); }

/* Chart animation */
.db-chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 3s ease-out forwards;
}

/* KPI bento */
.db-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.db-kpi {
  backdrop-filter: blur(12px);
  background-color: rgba(18,18,18,0.85);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; padding: 18px;
  display: flex; flex-direction: column;
  transition: border-color 0.2s;
}
.db-kpi:hover { border-color: ${a20}; }
.db-kpi__label { font-size: 11px; color: #737685; font-weight: 500; margin-bottom: 10px; }
.db-kpi__value { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.db-kpi__delta { font-size: 11px; font-weight: 700; color: ${accent}; margin-top: 4px; }
.db-kpi__bars { display: flex; align-items: flex-end; gap: 3px; height: 28px; margin-top: 10px; }
.db-kpi__bar { flex: 1; background-color: ${a20}; border-radius: 3px; }
.db-kpi__bar--accent { background-color: ${accent}; box-shadow: ${glow}; }
.db-kpi__progress-track { margin-top: 10px; height: 5px; background-color: #232323; border-radius: 999px; overflow: hidden; }
.db-kpi__progress-fill { height: 100%; background-color: ${accent}; box-shadow: ${glow}; border-radius: 999px; }

/* Split layout */
.db-split { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }

/* Section head */
.db-section-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.db-section-title { font-size: 13px; font-weight: 700; color: #f9f9ff; margin-bottom: 4px; }
.db-section-sub { font-size: 10px; color: #737685; }

/* Legend */
.db-legend { display: flex; gap: 14px; }
.db-legend__item { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; }
.db-legend__item--muted { color: #737685; }
.db-legend__dot { width: 10px; height: 10px; border-radius: 50%; }
.db-legend__dot--accent { background-color: ${accent}; box-shadow: ${glow}; }
.db-legend__dot--dashed { background: transparent; border: 2px dashed #737685; }

/* Line chart */
.db-linechart { height: 160px; }
.db-week-labels { display: flex; justify-content: space-between; margin-top: 8px; }
.db-week-labels span { font-size: 9px; font-weight: 700; color: #4a4a5a; text-transform: uppercase; }

/* Donut */
.db-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.db-donut { position: relative; width: 130px; height: 130px; }
.db-donut__center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.db-donut__value { font-size: 18px; font-weight: 900; line-height: 1; }
.db-donut__label { font-size: 8px; color: #737685; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.db-channels { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.db-channel-row { display: flex; justify-content: space-between; align-items: center; }
.db-channel-row__left { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #737685; }
.db-channel-row__dot { width: 6px; height: 6px; border-radius: 50%; }
.db-channel-row__pct { font-size: 10px; font-weight: 700; }

/* Regions */
.db-regions { display: flex; flex-direction: column; gap: 14px; }
.db-region { display: flex; flex-direction: column; gap: 5px; }
.db-region__meta { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #737685; }
.db-region__amount { color: #f9f9ff; }
.db-region__track { height: 10px; background-color: #232323; border-radius: 999px; overflow: hidden; }
.db-region__fill { height: 100%; background-color: ${accent}; border-radius: 999px; transition: background-color 0.4s; }

/* Select */
.db-select {
  background-color: #1e1e1e; border: none; border-radius: 8px;
  color: #f9f9ff; font-size: 10px; font-weight: 700;
  padding: 4px 10px; outline: none; font-family: inherit; cursor: pointer;
}

/* Activities */
.db-activities { display: flex; flex-direction: column; }
.db-activity { display: flex; gap: 12px; margin-bottom: 20px; }
.db-activity__icon {
  width: 34px; height: 34px; border-radius: 50%;
  background-color: rgba(90,90,90,0.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 15px;
}
.db-activity__icon--accent { background-color: ${a20}; }
.db-activity__title { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
.db-activity__sub { font-size: 10px; color: #737685; }
.db-activity__time { font-size: 9px; font-weight: 700; color: #4a4a5a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3px; }

.db-audit-btn {
  width: 100%; padding: 10px;
  background-color: #1e1e1e; border: 1px solid #2a2a2a;
  border-radius: 10px; color: #f9f9ff;
  font-size: 11px; font-weight: 700;
  cursor: pointer; margin-top: auto; font-family: inherit;
  transition: background-color 0.15s;
}
.db-audit-btn:hover { background-color: #252525; }

@media (max-width: 1024px) {
  .db-bento { grid-template-columns: repeat(2, 1fr); }
  .db-split { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .db-aside { display: none; }
  .db-bento { grid-template-columns: 1fr; }
}
`;
}

// ─── TSX + CSS ────────────────────────
export function generateDashboardTSX(config: DashboardConfig): string {
  const accent = config.accentColor;

  return `import { useEffect, useRef, MutableRefObject } from "react";
import "./Dashboard.css";

const ACCENT = "${accent}";
const ACCENT_10 = "${hex(accent, "1a")}";
const ACCENT_20 = "${hex(accent, "33")}";
const ACCENT_30 = "${hex(accent, "4d")}";
const ACCENT_60 = "${hex(accent, "99")}";
const GLOW_BOX = \`0 0 12px \${ACCENT}55\`;

interface Region {
  name: string;
  amount: string;
  pct: number;
  opacity: number;
}

interface Channel {
  label: string;
  pct: string;
  dash: number;
  offset: number;
  color: string;
}

interface KpiItem {
  label: string;
  value: string;
  delta: string;
  bars?: number[];
  progress?: number;
}

interface ActivityItem {
  icon: string;
  accent: boolean;
  title: string;
  sub: string;
  time: string;
}

const regions: Region[] = [
  { name: "North America", amount: "$142,500", pct: 85, opacity: 1 },
  { name: "European Union", amount: "$98,200", pct: 60, opacity: 0.7 },
  { name: "Asia Pacific", amount: "$76,400", pct: 45, opacity: 0.5 },
  { name: "Latin America", amount: "$34,100", pct: 22, opacity: 0.3 },
  { name: "Middle East & Africa", amount: "$12,800", pct: 10, opacity: 0.2 },
];

const channels: Channel[] = [
  { label: "Organic Search", pct: "45%", dash: 45, offset: 0, color: ACCENT },
  { label: "Paid Advertising", pct: "25%", dash: 25, offset: -45, color: ACCENT_60 },
  { label: "Social Media", pct: "20%", dash: 20, offset: -70, color: ACCENT_30 },
  { label: "Direct Referral", pct: "10%", dash: 10, offset: -90, color: ACCENT_10 },
];

export default function Dashboard() {
  const chartRef = useRef<SVGPathElement>(null);
  const chart2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    ([chartRef, chart2Ref] as MutableRefObject<SVGPathElement | null>[]).forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = "none";
        void ref.current.offsetWidth;
        ref.current.style.animation = "dash 3s ease-out forwards";
      }
    });
  }, []);

  return (
    <div className="db-root">
      <aside className="db-aside">
        <div className="db-logo">
          <div className="db-logo__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="db-logo__text">ArchitectCore</span>
        </div>
        <nav className="db-nav">
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "↗", label: "Analytics", active: false },
            { icon: "▤", label: "Projects", active: false },
            { icon: "⚇", label: "Team", active: false },
            { icon: "☰", label: "Reports", active: false },
          ].map((item) => (
            <div key={item.label} className={\`db-nav__item\${item.active ? " db-nav__item--active" : ""}\`}>
              <span className="db-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="db-nav db-nav--footer">
          {[{ icon: "⚙", label: "Settings" }, { icon: "?", label: "Support" }].map((item) => (
            <div key={item.label} className="db-nav__item">
              <span className="db-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <span className="db-header__title">Overview</span>
          <div className="db-header__actions">
            <div className="db-search">
              <span className="db-search__icon">⌕</span>
              <input className="db-search__input" placeholder="Global search..." readOnly />
            </div>
            <div className="db-avatar">A</div>
          </div>
        </header>

        <div className="db-canvas">
          {/* Hero KPI */}
          <div className="db-card db-hero">
            <div className="db-hero__meta">
              <div>
                <div className="db-hero__label">↗ Monthly Profit Overview</div>
                <div className="db-hero__amount">
                  $456,789
                  <span className="db-hero__badge">▲ 16%</span>
                </div>
              </div>
              <div className="db-hero__date">
                <div>18 Dec — 18 Jan</div>
                <div className="db-hero__updated">Updated 2m ago</div>
              </div>
            </div>
            <div className="db-hero__chart">
              <svg width="100%" height="100%" viewBox="0 0 1000 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path ref={chartRef} className="db-chart-line"
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70"
                  fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70 L1000,160 L0,160 Z"
                  fill="url(#cg)"
                />
              </svg>
            </div>
          </div>

          {/* KPIs */}
          <div className="db-bento">
            {([
              { label: "Total Revenue", value: "$98,450", delta: "▲ 12.5%", bars: [2, 4, 6, 8] },
              { label: "Units Sold", value: "3,285", delta: "▲ 12.6%", progress: 78 },
              { label: "New Customers", value: "486", delta: "▲ 4.2%", progress: 72 },
              { label: "Purchase Rate", value: "45.2%", delta: "▲ 9.2%", bars: [6, 4, 5, 8] },
            ] as KpiItem[]).map((kpi, i) => (
              <div key={i} className="db-kpi">
                <div className="db-kpi__label">{kpi.label}</div>
                <div className="db-kpi__value">{kpi.value}</div>
                <div className="db-kpi__delta">{kpi.delta}</div>
                {kpi.bars ? (
                  <div className="db-kpi__bars">
                    {kpi.bars.map((h: number, j: number) => (
                      <div key={j} className={\`db-kpi__bar\${j === kpi.bars!.length - 1 ? " db-kpi__bar--accent" : ""}\`}
                        style={{ height: \`\${h * 3.5}px\` }} />
                    ))}
                  </div>
                ) : (
                  <div className="db-kpi__progress-track">
                    <div className="db-kpi__progress-fill" style={{ width: \`\${kpi.progress}%\` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue vs Target + Donut */}
          <div className="db-split">
            <div className="db-card">
              <div className="db-section-head">
                <div>
                  <div className="db-section-title">Revenue vs. Target</div>
                  <div className="db-section-sub">Real-time performance tracking</div>
                </div>
                <div className="db-legend">
                  <div className="db-legend__item"><div className="db-legend__dot db-legend__dot--accent" />Actual</div>
                  <div className="db-legend__item db-legend__item--muted"><div className="db-legend__dot db-legend__dot--dashed" />Target</div>
                </div>
              </div>
              <div className="db-linechart">
                <svg width="100%" height="100%" viewBox="0 0 800 160">
                  <line x1="0" y1="30" x2="800" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <path d="M0,130 L100,120 L200,110 L300,95 L400,85 L500,70 L600,60 L700,50 L800,45"
                    fill="none" stroke="#737685" strokeDasharray="8,8" strokeWidth="2" opacity="0.4" />
                  <path ref={chart2Ref} className="db-chart-line"
                    d="M0,145 L100,120 L200,100 L300,130 L400,60 L500,85 L600,30 L700,55 L800,20"
                    fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="db-week-labels">
                {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7","Wk 8"].map((w: string) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>

            <div className="db-card">
              <div className="db-section-title" style={{ marginBottom: 16 }}>Acquisition Channels</div>
              <div className="db-donut-wrap">
                <div className="db-donut">
                  <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    {channels.map((ch: Channel, i: number) => (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={ch.color}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={\`\${ch.dash} \${100 - ch.dash}\`} strokeDashoffset={ch.offset} />
                    ))}
                  </svg>
                  <div className="db-donut__center">
                    <span className="db-donut__value">4.8k</span>
                    <span className="db-donut__label">Total Leads</span>
                  </div>
                </div>
                <div className="db-channels">
                  {channels.map((ch: Channel) => (
                    <div key={ch.label} className="db-channel-row">
                      <div className="db-channel-row__left">
                        <div className="db-channel-row__dot" style={{ backgroundColor: ch.color }} />
                        <span>{ch.label}</span>
                      </div>
                      <span className="db-channel-row__pct">{ch.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regional + Activities */}
          <div className="db-split">
            <div className="db-card">
              <div className="db-section-head" style={{ marginBottom: 20 }}>
                <div className="db-section-title">Regional Performance</div>
                <select className="db-select">
                  <option>Current Quarter</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="db-regions">
                {regions.map((r: Region) => (
                  <div key={r.name} className="db-region">
                    <div className="db-region__meta">
                      <span>{r.name}</span>
                      <span className="db-region__amount">{r.amount}</span>
                    </div>
                    <div className="db-region__track">
                      <div className="db-region__fill" style={{ width: \`\${r.pct}%\`, opacity: r.opacity }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="db-card db-activities">
              <div className="db-section-title" style={{ marginBottom: 18 }}>Recent Activities</div>
              {([
                { icon: "🛒", accent: true, title: "New transaction recorded", sub: "2,450 USD from client #092", time: "12:45 PM" },
                { icon: "👤", accent: false, title: "New user onboarded", sub: "Marketing lead: Sarah Jenkins", time: "11:20 AM" },
                { icon: "⚡", accent: true, title: "System Update", sub: "V4.2 successfully deployed", time: "09:00 AM" },
                { icon: "🔒", accent: false, title: "Security Audit", sub: "Automated scan completed", time: "Yesterday" },
              ] as ActivityItem[]).map((item: ActivityItem, i: number) => (
                <div key={i} className="db-activity">
                  <div className={\`db-activity__icon\${item.accent ? " db-activity__icon--accent" : ""}\`}>{item.icon}</div>
                  <div>
                    <div className="db-activity__title">{item.title}</div>
                    <div className="db-activity__sub">{item.sub}</div>
                    <div className="db-activity__time">{item.time}</div>
                  </div>
                </div>
              ))}
              <button className="db-audit-btn">View Audit Log</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateDashboardTailwind(config: DashboardConfig): string {
  const accent = config.accentColor;

  return `import { useEffect, useRef, MutableRefObject, CSSProperties } from "react";

interface Region {
  name: string;
  amount: string;
  pct: number;
  opacity: number;
}

interface Channel {
  label: string;
  pct: string;
  dash: number;
  offset: number;
  color: string;
}

interface KpiItem {
  label: string;
  value: string;
  delta: string;
  bars?: number[];
  progress?: number;
}

interface ActivityItem {
  icon: string;
  accent: boolean;
  title: string;
  sub: string;
  time: string;
}

// Baked-in CSS variable tokens — update these to reskin the Dashboard
const dbVars: CSSProperties = {
  "--db-accent":    "${accent}",
  "--db-accent-10": "${hex(accent, "1a")}",
  "--db-accent-20": "${hex(accent, "33")}",
  "--db-accent-30": "${hex(accent, "4d")}",
  "--db-accent-60": "${hex(accent, "99")}",
} as CSSProperties;

const ACCENT     = "var(--db-accent)";
const ACCENT_10  = "var(--db-accent-10)";
const ACCENT_20  = "var(--db-accent-20)";
const ACCENT_30  = "var(--db-accent-30)";
const ACCENT_60  = "var(--db-accent-60)";

const regions: Region[] = [
  { name: "North America", amount: "$142,500", pct: 85, opacity: 1 },
  { name: "European Union", amount: "$98,200", pct: 60, opacity: 0.7 },
  { name: "Asia Pacific", amount: "$76,400", pct: 45, opacity: 0.5 },
  { name: "Latin America", amount: "$34,100", pct: 22, opacity: 0.3 },
  { name: "Middle East & Africa", amount: "$12,800", pct: 10, opacity: 0.2 },
];

const channels: Channel[] = [
  { label: "Organic Search", pct: "45%", dash: 45, offset: 0, color: ACCENT },
  { label: "Paid Advertising", pct: "25%", dash: 25, offset: -45, color: ACCENT_60 },
  { label: "Social Media", pct: "20%", dash: 20, offset: -70, color: ACCENT_30 },
  { label: "Direct Referral", pct: "10%", dash: 10, offset: -90, color: ACCENT_10 },
];

export default function Dashboard() {
  const chartRef  = useRef<SVGPathElement>(null);
  const chart2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    ([chartRef, chart2Ref] as MutableRefObject<SVGPathElement | null>[]).forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = "none";
        void ref.current.offsetWidth;
        ref.current.style.animation = "db-dash 3s ease-out forwards";
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-hidden font-sans bg-[#0a0a0a] text-[#f9f9ff]" style={dbVars}>
      <style>{\`
        @keyframes db-dash {
          to { stroke-dashoffset: 0; }
        }
        .db-chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: db-dash 3s ease-out forwards;
        }
      \`}</style>

      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#121212] border-r border-[#2a2a2a] flex flex-col py-6">
        <div className="flex items-center gap-2.5 px-5 pb-7">
          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-[var(--db-accent)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-[13px] tracking-tight">ArchitectCore</span>
        </div>

        <nav className="flex flex-col gap-px">
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "↗", label: "Analytics", active: false },
            { icon: "▤", label: "Projects", active: false },
            { icon: "⚇", label: "Team", active: false },
            { icon: "☰", label: "Reports", active: false },
          ].map((item) => {
            let cls = "flex items-center gap-2.5 px-5 py-2 mx-2 rounded-lg text-[12px] font-medium cursor-pointer border-l-[3px] transition-all duration-150 ";
            if (item.active) {
              cls += "text-[var(--db-accent)] bg-[var(--db-accent-10)] border-[var(--db-accent)]";
            } else {
              cls += "text-[#737685] border-transparent hover:bg-white/[0.04]";
            }
            return (
              <div key={item.label} className={cls}>
                <span className="text-[14px] font-semibold">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="flex flex-col gap-px mt-auto">
          {[{ icon: "⚙", label: "Settings" }, { icon: "?", label: "Support" }].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 px-5 py-2 mx-2 rounded-lg text-[12px] font-medium cursor-pointer text-[#737685] border-l-[3px] border-transparent hover:bg-white/[0.04] transition-all duration-150">
              <span className="text-[14px] font-semibold">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0">
        <header className="h-[52px] flex justify-between items-center px-6 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.85)] backdrop-blur-[10px] shrink-0">
          <span className="text-[11px] font-extrabold tracking-[0.1em] opacity-50 uppercase">Overview</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#737685]">⌕</span>
              <input
                className="bg-[#1e1e1e] border-none rounded-full py-1.5 pr-3.5 pl-8 text-[11px] text-[#f9f9ff] w-[200px] outline-none font-[inherit]"
                placeholder="Global search..."
                readOnly
              />
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold bg-[var(--db-accent-30)] text-[var(--db-accent)]">A</div>
          </div>
        </header>

        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Hero KPI */}
          <div className="relative overflow-hidden backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 text-[#737685] text-[12px] mb-2">↗ Monthly Profit Overview</div>
                <div className="text-[48px] font-black leading-none tracking-[-0.03em] flex items-baseline">
                  $456,789
                  <span className="inline-flex items-center gap-1 bg-[var(--db-accent-20)] text-[var(--db-accent)] px-2 py-0.5 rounded-[6px] text-[12px] font-bold ml-3">▲ 16%</span>
                </div>
              </div>
              <div className="text-right text-[10px] text-[#737685] font-medium">
                <div>18 Dec — 18 Jan</div>
                <div className="opacity-50 mt-0.5">Updated 2m ago</div>
              </div>
            </div>
            <div className="mt-5 h-[160px]" style={{ filter: "drop-shadow(0 0 8px var(--db-accent-60))" }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path ref={chartRef} className="db-chart-line"
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70"
                  fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M0,120 L50,90 L80,140 L100,130 L120,155 L150,100 L200,90 L250,120 L300,105 L350,75 L400,100 L450,120 L500,115 L550,110 L600,120 L630,145 L660,95 L700,110 L750,85 L800,50 L850,55 L880,80 L900,60 L1000,70 L1000,160 L0,160 Z"
                  fill="url(#cg)"
                />
              </svg>
            </div>
          </div>

          {/* KPI Bento */}
          <div className="grid grid-cols-4 gap-[14px]">
            {([
              { label: "Total Revenue", value: "$98,450", delta: "▲ 12.5%", bars: [2, 4, 6, 8] },
              { label: "Units Sold", value: "3,285", delta: "▲ 12.6%", progress: 78 },
              { label: "New Customers", value: "486", delta: "▲ 4.2%", progress: 72 },
              { label: "Purchase Rate", value: "45.2%", delta: "▲ 9.2%", bars: [6, 4, 5, 8] },
            ] as KpiItem[]).map((kpi, i) => (
              <div key={i} className="backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-[18px] flex flex-col hover:border-[var(--db-accent-20)] transition-colors duration-200">
                <div className="text-[11px] text-[#737685] font-medium mb-2.5">{kpi.label}</div>
                <div className="text-[26px] font-extrabold tracking-[-0.02em] leading-none">{kpi.value}</div>
                <div className="text-[11px] font-bold text-[var(--db-accent)] mt-1">{kpi.delta}</div>
                {kpi.bars ? (
                  <div className="flex items-end gap-[3px] h-7 mt-2.5">
                    {kpi.bars.map((h: number, j: number) => (
                      <div
                        key={j}
                        className={j === kpi.bars!.length - 1 ? "flex-1 rounded-[3px] bg-[var(--db-accent)]" : "flex-1 rounded-[3px] bg-[var(--db-accent-20)]"}
                        style={{ height: \`\${h * 3.5}px\`, ...(j === kpi.bars!.length - 1 ? { boxShadow: "0 0 12px var(--db-accent)" } : {}) }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-2.5 h-[5px] bg-[#232323] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--db-accent)] rounded-full"
                      style={{ width: \`\${kpi.progress}%\`, boxShadow: "0 0 12px var(--db-accent)" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue vs Target + Donut */}
          <div className="grid gap-[14px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <div className="backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[13px] font-bold text-[#f9f9ff] mb-1">Revenue vs. Target</div>
                  <div className="text-[10px] text-[#737685]">Real-time performance tracking</div>
                </div>
                <div className="flex gap-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--db-accent)]" style={{ boxShadow: "0 0 12px var(--db-accent)" }} />
                    Actual
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#737685]">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#737685] bg-transparent" />
                    Target
                  </div>
                </div>
              </div>
              <div className="h-[160px]">
                <svg width="100%" height="100%" viewBox="0 0 800 160">
                  <line x1="0" y1="30" x2="800" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <path d="M0,130 L100,120 L200,110 L300,95 L400,85 L500,70 L600,60 L700,50 L800,45"
                    fill="none" stroke="#737685" strokeDasharray="8,8" strokeWidth="2" opacity="0.4" />
                  <path ref={chart2Ref} className="db-chart-line"
                    d="M0,145 L100,120 L200,100 L300,130 L400,60 L500,85 L600,30 L700,55 L800,20"
                    fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex justify-between mt-2">
                {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7","Wk 8"].map((w: string) => (
                  <span key={w} className="text-[9px] font-bold text-[#4a4a5a] uppercase">{w}</span>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-6">
              <div className="text-[13px] font-bold text-[#f9f9ff] mb-4">Acquisition Channels</div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-[130px] h-[130px]">
                  <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    {channels.map((ch: Channel, i: number) => (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={ch.color}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={\`\${ch.dash} \${100 - ch.dash}\`} strokeDashoffset={ch.offset} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[18px] font-black leading-none">4.8k</span>
                    <span className="text-[8px] text-[#737685] font-bold uppercase tracking-[0.05em]">Total Leads</span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  {channels.map((ch: Channel) => (
                    <div key={ch.label} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#737685]">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.color }} />
                        <span>{ch.label}</span>
                      </div>
                      <span className="text-[10px] font-bold">{ch.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regional + Activities */}
          <div className="grid gap-[14px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <div className="backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-6">
              <div className="flex justify-between items-start mb-5">
                <div className="text-[13px] font-bold text-[#f9f9ff]">Regional Performance</div>
                <select className="bg-[#1e1e1e] border-none rounded-lg text-[#f9f9ff] text-[10px] font-bold px-2.5 py-1 outline-none font-[inherit] cursor-pointer">
                  <option>Current Quarter</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="flex flex-col gap-3.5">
                {regions.map((r: Region) => (
                  <div key={r.name} className="flex flex-col gap-[5px]">
                    <div className="flex justify-between text-[10px] font-bold tracking-[0.05em] uppercase text-[#737685]">
                      <span>{r.name}</span>
                      <span className="text-[#f9f9ff]">{r.amount}</span>
                    </div>
                    <div className="h-2.5 bg-[#232323] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--db-accent)] rounded-full transition-colors duration-[400ms]"
                        style={{ width: \`\${r.pct}%\`, opacity: r.opacity }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-[12px] bg-[rgba(18,18,18,0.85)] border border-white/[0.05] rounded-[14px] p-6 flex flex-col">
              <div className="text-[13px] font-bold text-[#f9f9ff] mb-[18px]">Recent Activities</div>
              {([
                { icon: "🛒", accent: true, title: "New transaction recorded", sub: "2,450 USD from client #092", time: "12:45 PM" },
                { icon: "👤", accent: false, title: "New user onboarded", sub: "Marketing lead: Sarah Jenkins", time: "11:20 AM" },
                { icon: "⚡", accent: true, title: "System Update", sub: "V4.2 successfully deployed", time: "09:00 AM" },
                { icon: "🔒", accent: false, title: "Security Audit", sub: "Automated scan completed", time: "Yesterday" },
              ] as ActivityItem[]).map((item: ActivityItem, i: number) => (
                <div key={i} className="flex gap-3 mb-5">
                  <div
                    className={\`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 text-[15px] \${item.accent ? "bg-[var(--db-accent-20)]" : "bg-[rgba(90,90,90,0.2)]"}\`}
                  >{item.icon}</div>
                  <div>
                    <div className="text-[12px] font-semibold mb-0.5">{item.title}</div>
                    <div className="text-[10px] text-[#737685]">{item.sub}</div>
                    <div className="text-[9px] font-bold text-[#4a4a5a] uppercase tracking-[0.05em] mt-[3px]">{item.time}</div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] text-[#f9f9ff] text-[11px] font-bold cursor-pointer mt-auto font-[inherit] hover:bg-[#252525] transition-colors duration-150">
                View Audit Log
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}
