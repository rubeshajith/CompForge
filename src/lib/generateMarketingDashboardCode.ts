import {
  MarketingDashboardConfig,
  getMarketingDashboardTheme,
} from "./marketingDashboardConfig";

export function generateMarketingDashboardJSX(
  _config: MarketingDashboardConfig,
): string {
  return `"use client";

import "./MarketingDashboard.css";

const navItems = ["Marketing", "FinTech", "HealthTech", "E-commerce", "Cybersecurity", "Logistics", "SaaS"];
const metrics = [
  ["Total Ad Spend", "$428,500", "+12.5%", "76"],
  ["Conversion ROI", "342%", "+4.2%", "62"],
  ["Social Impressions", "1.2M", "-0.8%", "90"],
];
const rows = [
  ["enterprise analytics suite", "$12.45", "$84,200", "Scaling"],
  ["real-time marketing roi", "$8.12", "$52,150", "Active"],
  ["data visualization dashboard", "$15.90", "$41,800", "Paused"],
  ["b2b saas growth tools", "$6.75", "$38,200", "Active"],
];

export default function MarketingDashboard() {
  return (
    <div className="dash">
      <aside className="dash__side">
        <div className="dash__brand">
          <div className="dash__logo">A</div>
          <div>
            <h1>OmniDash Pro</h1>
            <p>Enterprise Suite</p>
          </div>
        </div>
        <nav className="dash__nav">
          {navItems.map((item, index) => (
            <a className={index === 0 ? "dash__nav-item dash__nav-item--active" : "dash__nav-item"} href="#" key={item}>
              <span>{item}</span>
            </a>
          ))}
        </nav>
        <button className="dash__new">+ New Dashboard</button>
      </aside>
      <main className="dash__main">
        <header className="dash__topbar">
          <div className="dash__search">Search analytics...</div>
          <div className="dash__actions"><span>Notifications</span><span>Apps</span><i /></div>
        </header>
        <div className="dash__content">
          <section className="dash__hero">
            <div>
              <span>Performance Overview</span>
              <h2>Marketing ROI Dashboard</h2>
              <p>Real-time engagement metrics across all active channels.</p>
            </div>
            <div className="dash__segments"><b>Daily</b><span>Weekly</span><span>Monthly</span></div>
          </section>
          <section className="dash__metrics">
            {metrics.map(([label, value, delta, width], index) => (
              <article className="dash__card dash__metric" key={label}>
                <div className="dash__metric-top"><i data-tone={index} /><span>{delta}</span></div>
                <small>{label}</small>
                <strong>{value}</strong>
                <div className="dash__progress"><b style={{ width: width + "%" }} /></div>
              </article>
            ))}
          </section>
          <section className="dash__grid">
            <article className="dash__card dash__chart">
              <div className="dash__card-head">
                <h3>Channel Performance Trends</h3>
                <div><span>Google</span><span>Meta</span><span>LinkedIn</span></div>
              </div>
              <svg viewBox="0 0 1000 300" role="img" aria-label="Channel performance area chart">
                <path className="dash__area dash__area--three" d="M0,300 L0,220 Q150,180 300,240 T600,190 T1000,210 L1000,300 Z" />
                <path className="dash__area dash__area--two" d="M0,300 L0,180 Q200,120 400,180 T700,140 T1000,160 L1000,300 Z" />
                <path className="dash__area dash__area--one" d="M0,300 L0,120 Q250,60 500,130 T800,80 T1000,100 L1000,300 Z" />
              </svg>
              <div className="dash__months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span></div>
            </article>
            <article className="dash__card dash__funnel">
              <h3>Lead Conversion Funnel</h3>
              {["Total Impressions 1.2M", "Clicks 84.2K", "Qualified Leads 12.5K", "Conversions 3.8K"].map((item, index) => (
                <div className="dash__funnel-step" data-step={index} key={item}><span>{item}</span></div>
              ))}
              <footer><span>Global Conv. Rate</span><b>4.5%</b></footer>
            </article>
          </section>
          <section className="dash__lower">
            <article className="dash__card dash__table">
              <div className="dash__card-head"><h3>High-Value Keyword Performance</h3><a href="#">View Full Report</a></div>
              <table><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
            </article>
            <article className="dash__promo"><h3>Maximize Your Campaign Impact</h3><p>Upgrade to OmniDash Elite for predictive AI modeling and automated bidding strategies.</p><button>Get Started</button></article>
          </section>
        </div>
      </main>
    </div>
  );
}`;
}

export function generateMarketingDashboardCSS(
  config: MarketingDashboardConfig,
): string {
  const t = getMarketingDashboardTheme(config);

  return `.dash {
  --dash-bg: ${t.bg};
  --dash-surface: ${t.surface};
  --dash-surface-2: ${t.surface2};
  --dash-surface-3: ${t.surface3};
  --dash-border: ${t.border};
  --dash-text: ${t.text};
  --dash-muted: ${t.muted};
  --dash-soft: ${t.softText};
  --dash-accent: ${t.accent};
  --dash-accent-2: ${t.accent2};
  --dash-accent-3: ${t.accent3};
  --dash-danger: ${t.danger};
  --dash-gradient: ${t.gradient};
  min-height: 100vh;
  background: var(--dash-bg);
  color: var(--dash-text);
  display: flex;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.dash * { box-sizing: border-box; }
.dash__side { width: 280px; min-height: 100vh; padding: 24px; background: var(--dash-surface); border-right: 1px solid var(--dash-border); display: flex; flex-direction: column; gap: 28px; }
.dash__brand { display: flex; align-items: center; gap: 12px; }
.dash__brand h1 { margin: 0; font-size: 24px; line-height: 30px; }
.dash__brand p { margin: 0; color: var(--dash-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.dash__logo { width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center; background: var(--dash-gradient); color: #fff; font-weight: 900; }
.dash__nav { display: grid; gap: 4px; }
.dash__nav-item { padding: 11px 16px; color: var(--dash-soft); text-decoration: none; border-right: 2px solid transparent; transition: .2s ease; }
.dash__nav-item:hover, .dash__nav-item--active { color: var(--dash-accent); background: color-mix(in srgb, var(--dash-accent) 10%, transparent); border-right-color: var(--dash-accent); }
.dash__new, .dash__promo button { border: 0; border-radius: 12px; padding: 14px 16px; background: var(--dash-gradient); color: #fff; font-weight: 800; cursor: pointer; }
.dash__new { margin-top: auto; }
.dash__main { flex: 1; min-width: 0; }
.dash__topbar { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: color-mix(in srgb, var(--dash-surface) 88%, transparent); border-bottom: 1px solid var(--dash-border); backdrop-filter: blur(16px); }
.dash__search { width: min(420px, 45vw); border-radius: 999px; padding: 12px 18px; background: var(--dash-surface-2); color: var(--dash-muted); font-size: 14px; }
.dash__actions { display: flex; align-items: center; gap: 18px; color: var(--dash-soft); font-size: 13px; }
.dash__actions i { width: 34px; height: 34px; border-radius: 50%; background: var(--dash-gradient); }
.dash__content { padding: 32px; }
.dash__hero { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; }
.dash__hero > div > span { color: var(--dash-accent-2); font-size: 12px; font-weight: 900; text-transform: uppercase; }
.dash__hero h2 { margin: 6px 0 4px; font-size: 32px; line-height: 40px; letter-spacing: 0; }
.dash__hero p { margin: 0; color: var(--dash-soft); }
.dash__segments { display: flex; gap: 4px; padding: 4px; background: var(--dash-surface-2); border-radius: 10px; }
.dash__segments span, .dash__segments b { padding: 9px 16px; border-radius: 7px; font-size: 12px; }
.dash__segments b { background: var(--dash-surface-3); }
.dash__metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px; }
.dash__card { background: rgba(18,18,18,.68); border: 1px solid var(--dash-border); border-radius: 12px; backdrop-filter: blur(12px); }
.dash__metric { padding: 24px; transition: transform .2s ease, border-color .2s ease; }
.dash__metric:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--dash-accent) 35%, var(--dash-border)); }
.dash__metric-top { display: flex; justify-content: space-between; margin-bottom: 18px; color: var(--dash-accent-2); font-size: 12px; font-weight: 800; }
.dash__metric-top i { width: 42px; height: 42px; border-radius: 10px; background: color-mix(in srgb, var(--dash-accent) 18%, transparent); }
.dash__metric small { color: var(--dash-soft); font-size: 11px; font-weight: 900; text-transform: uppercase; }
.dash__metric strong { display: block; font-size: 48px; line-height: 56px; }
.dash__progress { height: 4px; margin-top: 16px; border-radius: 999px; background: var(--dash-surface-2); overflow: hidden; }
.dash__progress b { display: block; height: 100%; background: var(--dash-accent); }
.dash__grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
.dash__chart, .dash__funnel, .dash__table { padding: 24px; }
.dash__card-head { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-bottom: 22px; }
.dash__card-head h3, .dash__funnel h3 { margin: 0; font-size: 20px; }
.dash__card-head div { display: flex; gap: 14px; color: var(--dash-soft); font-size: 12px; }
.dash__chart svg { width: 100%; height: 250px; }
.dash__area { stroke-width: 2; }
.dash__area--one { fill: color-mix(in srgb, var(--dash-accent) 24%, transparent); stroke: var(--dash-accent); }
.dash__area--two { fill: color-mix(in srgb, var(--dash-accent-2) 24%, transparent); stroke: var(--dash-accent-2); }
.dash__area--three { fill: color-mix(in srgb, var(--dash-accent-3) 24%, transparent); stroke: var(--dash-accent-3); }
.dash__months { display: flex; justify-content: space-between; color: var(--dash-muted); font-size: 11px; font-weight: 800; }
.dash__funnel-step { height: 54px; margin: 0 auto 8px; border-left: 4px solid var(--dash-accent); border-radius: 10px; background: color-mix(in srgb, var(--dash-accent) 22%, transparent); transform: skewX(12deg); display: flex; align-items: center; justify-content: center; font-weight: 800; }
.dash__funnel-step span { transform: skewX(-12deg); }
.dash__funnel-step[data-step="1"] { width: 90%; }
.dash__funnel-step[data-step="2"] { width: 80%; border-left-color: var(--dash-accent-2); background: color-mix(in srgb, var(--dash-accent-2) 22%, transparent); }
.dash__funnel-step[data-step="3"] { width: 70%; border-left-color: var(--dash-accent-3); background: color-mix(in srgb, var(--dash-accent-3) 22%, transparent); }
.dash__funnel footer { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--dash-border); color: var(--dash-soft); }
.dash__funnel footer b { color: var(--dash-accent-2); font-size: 24px; }
.dash__lower { display: grid; grid-template-columns: 3fr 1fr; gap: 24px; margin-top: 24px; }
.dash__table { overflow: hidden; padding: 0; }
.dash__table .dash__card-head { margin: 0; padding: 20px 24px; border-bottom: 1px solid var(--dash-border); }
.dash__table a { color: var(--dash-accent); text-decoration: none; font-size: 12px; font-weight: 800; }
.dash__table table { width: 100%; border-collapse: collapse; font-size: 14px; }
.dash__table td { padding: 14px 24px; border-bottom: 1px solid color-mix(in srgb, var(--dash-border) 55%, transparent); }
.dash__table td:nth-child(3) { color: var(--dash-accent-2); }
.dash__promo { border-radius: 12px; padding: 24px; background: var(--dash-gradient); color: #fff; display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; }
.dash__promo h3 { margin: 0 0 10px; font-size: 25px; line-height: 31px; }
.dash__promo p { color: rgba(255,255,255,.82); line-height: 1.55; }
.dash__promo button { background: #fff; color: #111; }
@media (max-width: 900px) {
  .dash { display: block; }
  .dash__side { display: none; }
  .dash__hero, .dash__grid, .dash__lower { grid-template-columns: 1fr; display: grid; }
  .dash__metrics { grid-template-columns: 1fr; }
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateMarketingDashboardTSX(
  _config: MarketingDashboardConfig,
): string {
  return `"use client";

import "./MarketingDashboard.css";

const navItems: string[] = ["Marketing", "FinTech", "HealthTech", "E-commerce", "Cybersecurity", "Logistics", "SaaS"];
const metrics: string[][] = [
  ["Total Ad Spend", "$428,500", "+12.5%", "76"],
  ["Conversion ROI", "342%", "+4.2%", "62"],
  ["Social Impressions", "1.2M", "-0.8%", "90"],
];
const rows: string[][] = [
  ["enterprise analytics suite", "$12.45", "$84,200", "Scaling"],
  ["real-time marketing roi", "$8.12", "$52,150", "Active"],
  ["data visualization dashboard", "$15.90", "$41,800", "Paused"],
  ["b2b saas growth tools", "$6.75", "$38,200", "Active"],
];

export default function MarketingDashboard(): JSX.Element {
  return (
    <div className="dash">
      <aside className="dash__side">
        <div className="dash__brand">
          <div className="dash__logo">A</div>
          <div>
            <h1>OmniDash Pro</h1>
            <p>Enterprise Suite</p>
          </div>
        </div>
        <nav className="dash__nav">
          {navItems.map((item: string, index: number) => (
            <a className={index === 0 ? "dash__nav-item dash__nav-item--active" : "dash__nav-item"} href="#" key={item}>
              <span>{item}</span>
            </a>
          ))}
        </nav>
        <button className="dash__new">+ New Dashboard</button>
      </aside>
      <main className="dash__main">
        <header className="dash__topbar">
          <div className="dash__search">Search analytics...</div>
          <div className="dash__actions"><span>Notifications</span><span>Apps</span><i /></div>
        </header>
        <div className="dash__content">
          <section className="dash__hero">
            <div>
              <span>Performance Overview</span>
              <h2>Marketing ROI Dashboard</h2>
              <p>Real-time engagement metrics across all active channels.</p>
            </div>
            <div className="dash__segments"><b>Daily</b><span>Weekly</span><span>Monthly</span></div>
          </section>
          <section className="dash__metrics">
            {metrics.map(([label, value, delta, width]: string[], index: number) => (
              <article className="dash__card dash__metric" key={label}>
                <div className="dash__metric-top"><i data-tone={index} /><span>{delta}</span></div>
                <small>{label}</small>
                <strong>{value}</strong>
                <div className="dash__progress"><b style={{ width: width + "%" }} /></div>
              </article>
            ))}
          </section>
          <section className="dash__grid">
            <article className="dash__card dash__chart">
              <div className="dash__card-head">
                <h3>Channel Performance Trends</h3>
                <div><span>Google</span><span>Meta</span><span>LinkedIn</span></div>
              </div>
              <svg viewBox="0 0 1000 300" role="img" aria-label="Channel performance area chart">
                <path className="dash__area dash__area--three" d="M0,300 L0,220 Q150,180 300,240 T600,190 T1000,210 L1000,300 Z" />
                <path className="dash__area dash__area--two" d="M0,300 L0,180 Q200,120 400,180 T700,140 T1000,160 L1000,300 Z" />
                <path className="dash__area dash__area--one" d="M0,300 L0,120 Q250,60 500,130 T800,80 T1000,100 L1000,300 Z" />
              </svg>
              <div className="dash__months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span></div>
            </article>
            <article className="dash__card dash__funnel">
              <h3>Lead Conversion Funnel</h3>
              {["Total Impressions 1.2M", "Clicks 84.2K", "Qualified Leads 12.5K", "Conversions 3.8K"].map((item: string, index: number) => (
                <div className="dash__funnel-step" data-step={index} key={item}><span>{item}</span></div>
              ))}
              <footer><span>Global Conv. Rate</span><b>4.5%</b></footer>
            </article>
          </section>
          <section className="dash__lower">
            <article className="dash__card dash__table">
              <div className="dash__card-head"><h3>High-Value Keyword Performance</h3><a href="#">View Full Report</a></div>
              <table><tbody>{rows.map((row: string[]) => <tr key={row[0]}>{row.map((cell: string) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
            </article>
            <article className="dash__promo"><h3>Maximize Your Campaign Impact</h3><p>Upgrade to OmniDash Elite for predictive AI modeling and automated bidding strategies.</p><button>Get Started</button></article>
          </section>
        </div>
      </main>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateMarketingDashboardTailwind(
  config: MarketingDashboardConfig,
): string {
  const t = getMarketingDashboardTheme(config);

  return `"use client";

import { CSSProperties } from "react";

const navItems: string[] = ["Marketing", "FinTech", "HealthTech", "E-commerce", "Cybersecurity", "Logistics", "SaaS"];
const metrics: string[][] = [
  ["Total Ad Spend", "$428,500", "+12.5%", "76"],
  ["Conversion ROI", "342%", "+4.2%", "62"],
  ["Social Impressions", "1.2M", "-0.8%", "90"],
];
const rows: string[][] = [
  ["enterprise analytics suite", "$12.45", "$84,200", "Scaling"],
  ["real-time marketing roi", "$8.12", "$52,150", "Active"],
  ["data visualization dashboard", "$15.90", "$41,800", "Paused"],
  ["b2b saas growth tools", "$6.75", "$38,200", "Active"],
];

// Baked-in CSS variable tokens — update these to reskin the MarketingDashboard
const dashVars: CSSProperties = {
  "--dash-bg":         "${t.bg}",
  "--dash-surface":    "${t.surface}",
  "--dash-surface-2":  "${t.surface2}",
  "--dash-surface-3":  "${t.surface3}",
  "--dash-border":     "${t.border}",
  "--dash-text":       "${t.text}",
  "--dash-muted":      "${t.muted}",
  "--dash-soft":       "${t.softText}",
  "--dash-accent":     "${t.accent}",
  "--dash-accent-2":   "${t.accent2}",
  "--dash-accent-3":   "${t.accent3}",
  "--dash-danger":     "${t.danger}",
  "--dash-gradient":   "${t.gradient}",
} as CSSProperties;

export default function MarketingDashboard(): JSX.Element {
  return (
    <div
      className="flex min-h-screen font-sans bg-[var(--dash-bg)] text-[var(--dash-text)]"
      style={dashVars}
    >
      {/* Sidebar */}
      <aside className="w-[280px] min-h-screen p-6 bg-[var(--dash-surface)] border-r border-[var(--dash-border)] flex flex-col gap-7">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[10px] grid place-items-center font-black text-white" style={{ background: "var(--dash-gradient)" }}>
            A
          </div>
          <div>
            <h1 className="m-0 text-[24px] leading-[30px] font-bold">OmniDash Pro</h1>
            <p className="m-0 text-[var(--dash-muted)] text-[11px] font-extrabold uppercase">Enterprise Suite</p>
          </div>
        </div>
        <nav className="grid gap-1">
          {navItems.map((item: string, index: number) => {
            let cls = "px-4 py-[11px] text-[var(--dash-soft)] no-underline border-r-2 border-transparent transition-[color,background,border-color] duration-200";
            if (index === 0) {
              cls += " text-[var(--dash-accent)] bg-[color-mix(in_srgb,var(--dash-accent)_10%,transparent)] border-r-[var(--dash-accent)]";
            } else {
              cls += " hover:text-[var(--dash-accent)] hover:bg-[color-mix(in_srgb,var(--dash-accent)_10%,transparent)] hover:border-r-[var(--dash-accent)]";
            }
            return (
              <a className={cls} href="#" key={item}>
                <span>{item}</span>
              </a>
            );
          })}
        </nav>
        <button
          className="mt-auto border-0 rounded-[12px] py-[14px] px-4 text-white font-extrabold cursor-pointer"
          style={{ background: "var(--dash-gradient)" }}
        >
          + New Dashboard
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--dash-border)] backdrop-blur-[16px]" style={{ background: "color-mix(in srgb, var(--dash-surface) 88%, transparent)" }}>
          <div className="w-[min(420px,45vw)] rounded-full py-3 px-[18px] bg-[var(--dash-surface-2)] text-[var(--dash-muted)] text-[14px]">
            Search analytics...
          </div>
          <div className="flex items-center gap-[18px] text-[var(--dash-soft)] text-[13px]">
            <span>Notifications</span>
            <span>Apps</span>
            <i className="w-[34px] h-[34px] rounded-full block" style={{ background: "var(--dash-gradient)" }} />
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Hero */}
          <section className="flex justify-between items-end gap-6 mb-7">
            <div>
              <span className="text-[var(--dash-accent-2)] text-[12px] font-black uppercase">Performance Overview</span>
              <h2 className="mt-1.5 mb-1 text-[32px] leading-[40px] font-bold tracking-normal">Marketing ROI Dashboard</h2>
              <p className="m-0 text-[var(--dash-soft)]">Real-time engagement metrics across all active channels.</p>
            </div>
            <div className="flex gap-1 p-1 bg-[var(--dash-surface-2)] rounded-[10px] shrink-0">
              <b className="px-4 py-[9px] rounded-[7px] text-[12px] bg-[var(--dash-surface-3)] font-semibold">Daily</b>
              <span className="px-4 py-[9px] rounded-[7px] text-[12px]">Weekly</span>
              <span className="px-4 py-[9px] rounded-[7px] text-[12px]">Monthly</span>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-3 gap-6 mb-6">
            {metrics.map(([label, value, delta, width]: string[], index: number) => (
              <article
                key={label}
                className="p-6 bg-[rgba(18,18,18,0.68)] border border-[var(--dash-border)] rounded-[12px] backdrop-blur-[12px] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex justify-between mb-[18px] text-[var(--dash-accent-2)] text-[12px] font-extrabold">
                  <i className="w-[42px] h-[42px] rounded-[10px] block" style={{ background: "color-mix(in srgb, var(--dash-accent) 18%, transparent)" }} />
                  <span>{delta}</span>
                </div>
                <small className="text-[var(--dash-soft)] text-[11px] font-black uppercase">{label}</small>
                <strong className="block text-[48px] leading-[56px]">{value}</strong>
                <div className="h-1 mt-4 rounded-full bg-[var(--dash-surface-2)] overflow-hidden">
                  <b className="block h-full bg-[var(--dash-accent)]" style={{ width: width + "%" }} />
                </div>
              </article>
            ))}
          </section>

          {/* Chart + Funnel */}
          <section className="grid gap-6" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <article className="p-6 bg-[rgba(18,18,18,0.68)] border border-[var(--dash-border)] rounded-[12px] backdrop-blur-[12px]">
              <div className="flex justify-between items-center gap-[18px] mb-[22px]">
                <h3 className="m-0 text-[20px] font-semibold">Channel Performance Trends</h3>
                <div className="flex gap-3.5 text-[var(--dash-soft)] text-[12px]">
                  <span>Google</span><span>Meta</span><span>LinkedIn</span>
                </div>
              </div>
              <svg viewBox="0 0 1000 300" role="img" aria-label="Channel performance area chart" className="w-full h-[250px]">
                <path
                  d="M0,300 L0,220 Q150,180 300,240 T600,190 T1000,210 L1000,300 Z"
                  strokeWidth="2"
                  style={{ fill: "color-mix(in srgb, var(--dash-accent-3) 24%, transparent)", stroke: "var(--dash-accent-3)" }}
                />
                <path
                  d="M0,300 L0,180 Q200,120 400,180 T700,140 T1000,160 L1000,300 Z"
                  strokeWidth="2"
                  style={{ fill: "color-mix(in srgb, var(--dash-accent-2) 24%, transparent)", stroke: "var(--dash-accent-2)" }}
                />
                <path
                  d="M0,300 L0,120 Q250,60 500,130 T800,80 T1000,100 L1000,300 Z"
                  strokeWidth="2"
                  style={{ fill: "color-mix(in srgb, var(--dash-accent) 24%, transparent)", stroke: "var(--dash-accent)" }}
                />
              </svg>
              <div className="flex justify-between text-[var(--dash-muted)] text-[11px] font-extrabold">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
              </div>
            </article>
            <article className="p-6 bg-[rgba(18,18,18,0.68)] border border-[var(--dash-border)] rounded-[12px] backdrop-blur-[12px]">
              <h3 className="m-0 text-[20px] font-semibold mb-4">Lead Conversion Funnel</h3>
              {["Total Impressions 1.2M", "Clicks 84.2K", "Qualified Leads 12.5K", "Conversions 3.8K"].map((item: string, index: number) => {
                let stepCls = "h-[54px] mx-auto mb-2 border-l-4 rounded-[10px] flex items-center justify-center font-extrabold [transform:skewX(12deg)]";
                if (index === 1) {
                  stepCls += " w-[90%] border-l-[var(--dash-accent)] bg-[color-mix(in_srgb,var(--dash-accent)_22%,transparent)]";
                } else if (index === 2) {
                  stepCls += " w-[80%] border-l-[var(--dash-accent-2)] bg-[color-mix(in_srgb,var(--dash-accent-2)_22%,transparent)]";
                } else if (index === 3) {
                  stepCls += " w-[70%] border-l-[var(--dash-accent-3)] bg-[color-mix(in_srgb,var(--dash-accent-3)_22%,transparent)]";
                } else {
                  stepCls += " w-full border-l-[var(--dash-accent)] bg-[color-mix(in_srgb,var(--dash-accent)_22%,transparent)]";
                }
                return (
                  <div className={stepCls} key={item}>
                    <span className="[transform:skewX(-12deg)]">{item}</span>
                  </div>
                );
              })}
              <footer className="flex justify-between mt-5 pt-4 border-t border-[var(--dash-border)] text-[var(--dash-soft)]">
                <span>Global Conv. Rate</span>
                <b className="text-[var(--dash-accent-2)] text-[24px]">4.5%</b>
              </footer>
            </article>
          </section>

          {/* Lower */}
          <section className="grid gap-6 mt-6" style={{ gridTemplateColumns: "3fr 1fr" }}>
            <article className="bg-[rgba(18,18,18,0.68)] border border-[var(--dash-border)] rounded-[12px] backdrop-blur-[12px] overflow-hidden">
              <div className="flex justify-between items-center gap-[18px] px-6 py-5 border-b border-[var(--dash-border)]">
                <h3 className="m-0 text-[20px] font-semibold">High-Value Keyword Performance</h3>
                <a href="#" className="text-[var(--dash-accent)] no-underline text-[12px] font-extrabold">View Full Report</a>
              </div>
              <table className="w-full border-collapse text-[14px]">
                <tbody>
                  {rows.map((row: string[]) => (
                    <tr key={row[0]}>
                      {row.map((cell: string, i: number) => (
                        <td
                          key={cell}
                          className={\`px-6 py-[14px] border-b border-[color-mix(in_srgb,var(--dash-border)_55%,transparent)]\${i === 2 ? " text-[var(--dash-accent-2)]" : ""}\`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article
              className="rounded-[12px] p-6 text-white flex flex-col justify-between min-h-[220px]"
              style={{ background: "var(--dash-gradient)" }}
            >
              <div>
                <h3 className="m-0 mb-2.5 text-[25px] leading-[31px] font-bold">Maximize Your Campaign Impact</h3>
                <p className="text-[rgba(255,255,255,0.82)] leading-[1.55]">Upgrade to OmniDash Elite for predictive AI modeling and automated bidding strategies.</p>
              </div>
              <button className="border-0 rounded-[12px] py-[14px] px-4 bg-white text-[#111] font-extrabold cursor-pointer">
                Get Started
              </button>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}`;
}
