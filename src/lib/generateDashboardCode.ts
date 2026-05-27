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
