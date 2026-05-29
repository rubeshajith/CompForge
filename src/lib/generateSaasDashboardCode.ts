import { SaasDashboardConfig, getSaasDashboardTheme } from "./saasDashboardConfig";

export function generateSaasDashboardJSX(_config: SaasDashboardConfig): string {
  return `"use client";

import "./SaasDashboard.css";

const nav = ["FinTech", "HealthTech", "E-commerce", "Cybersecurity", "Logistics", "Marketing", "SaaS", "Energy", "HR/EdTech", "Gaming"];
const metrics = [
  ["MRR", "$284,500", "+12.4%", "Vs. $253,100 last month"],
  ["Active Users", "42,891", "+8.1%", "Current concurrent: 4,102"],
  ["Churn Rate", "1.8%", "-0.2%", "Benchmark: 2.5%"],
  ["ARR Forecast", "$3.41M", "Elite", "Projected by Dec 2024"],
];
const conversions = [
  ["Stark Industries", "Enterprise Tier - 500 Seats", "+$12,400/mo", "2 mins ago"],
  ["Nexus Soft", "Pro Tier - 25 Seats", "+$450/mo", "14 mins ago"],
  ["Elena Rodriguez", "Pro Tier - 1 Seat", "+$49/mo", "1 hour ago"],
];

export default function SaasDashboard() {
  return (
    <div className="saas">
      <aside className="saas__side">
        <div className="saas__brand"><i>D</i><div><h1>OmniDash Pro</h1><p>Enterprise Suite</p></div></div>
        <button className="saas__new">+ New Dashboard</button>
        <nav>{nav.map((item) => <a className={item === "SaaS" ? "is-active" : ""} href="#" key={item}>{item}</a>)}</nav>
        <footer><a href="#">Settings</a><a href="#">Support</a></footer>
      </aside>
      <main className="saas__main">
        <header className="saas__topbar">
          <div className="saas__search">Search enterprise metrics...</div>
          <div className="saas__user"><span>Notifications</span><span>Apps</span><strong>Alex Rivera</strong><i /></div>
        </header>
        <section className="saas__content">
          <div className="saas__heading">
            <div><h2>SaaS Growth Engine</h2><p>Real-time subscription health and revenue forecasting.</p></div>
            <div><button>Last 30 Days</button><button>Export Report</button></div>
          </div>
          <div className="saas__metrics">
            {metrics.map(([label, value, delta, note]) => (
              <article className="saas__card saas__metric" key={label}>
                <div><i /><span>{delta}</span></div>
                <small>{label}</small>
                <strong>{value}</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
          <div className="saas__charts">
            <article className="saas__card saas__arr">
              <div className="saas__card-head"><div><h3>Annual Recurring Revenue</h3><p>Trailing 12-month performance trajectory.</p></div><span>Actual / Projected</span></div>
              <div className="saas__bars">{[40,45,55,65,60,75,82,90,95,98,100].map((height, index) => <i key={index} style={{ height: height + "%" }} />)}</div>
              <div className="saas__months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span></div>
            </article>
            <article className="saas__card saas__donut">
              <h3>User Tier Distribution</h3><p>Composition by subscription value.</p>
              <div><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="40" /></svg><strong>92%<span>Paid Share</span></strong></div>
              <footer><span>Free 8%</span><span>Pro 64%</span><span>Ent. 28%</span></footer>
            </article>
          </div>
          <div className="saas__lower">
            <article className="saas__card saas__heat"><h3>Cohort Retention</h3><p>User stickiness over 12 months.</p><table><tbody>{["Jan 24","Feb 24","Mar 24","Apr 24"].map((m) => <tr key={m}><th>{m}</th>{[100,94,91,88,83,79].map((v) => <td key={v}><span>{v}</span></td>)}</tr>)}</tbody></table></article>
            <article className="saas__card saas__conversions"><h3>Recent Conversions</h3><p>Latest Enterprise and Pro wins.</p>{conversions.map(([name, plan, amount, time]) => <div className="saas__conversion" key={name}><i /><div><strong>{name}</strong><span>{plan}</span></div><b>{amount}<small>{time}</small></b></div>)}</article>
          </div>
          <footer className="saas__status"><strong>Live Systems</strong><span>AWS-US-EAST: 99.9%</span><span>API V3: Operational</span><span>SEC-WAF: Protected</span></footer>
        </section>
      </main>
      <button className="saas__fab">AI</button>
    </div>
  );
}`;
}

export function generateSaasDashboardCSS(config: SaasDashboardConfig): string {
  const t = getSaasDashboardTheme(config);

  return `.saas {
  --s-bg: ${t.bg};
  --s-surface: ${t.surface};
  --s-surface-2: ${t.surface2};
  --s-surface-3: ${t.surface3};
  --s-border: ${t.border};
  --s-text: ${t.text};
  --s-muted: ${t.muted};
  --s-soft: ${t.softText};
  --s-accent: ${t.accent};
  --s-accent-2: ${t.accent2};
  --s-accent-3: ${t.accent3};
  --s-danger: ${t.danger};
  --s-button-text: ${t.buttonText};
  min-height: 100vh;
  display: flex;
  background: var(--s-bg);
  color: var(--s-text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.saas * { box-sizing: border-box; }
.saas__side { width: 280px; min-height: 100vh; padding: 24px; background: var(--s-surface); border-right: 1px solid var(--s-border); display: flex; flex-direction: column; gap: 20px; }
.saas__brand { display: flex; align-items: center; gap: 12px; }
.saas__brand i { width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center; background: var(--s-accent); color: var(--s-button-text); font-style: normal; font-weight: 900; }
.saas__brand h1 { margin: 0; font-size: 24px; }
.saas__brand p { margin: 0; color: var(--s-soft); font-size: 11px; text-transform: uppercase; font-weight: 800; }
.saas__new { border: 0; border-radius: 12px; padding: 14px 16px; background: var(--s-accent); color: var(--s-button-text); font-weight: 800; cursor: pointer; }
.saas__side nav { display: grid; gap: 4px; }
.saas__side a { color: var(--s-soft); text-decoration: none; padding: 12px 14px; border-radius: 9px; border-right: 2px solid transparent; }
.saas__side a:hover, .saas__side .is-active { color: var(--s-accent); background: var(--s-surface-3); border-right-color: var(--s-accent); font-weight: 800; }
.saas__side footer { margin-top: auto; padding-top: 18px; border-top: 1px solid var(--s-border); display: grid; gap: 6px; }
.saas__main { flex: 1; min-width: 0; }
.saas__topbar { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 0 24px; background: color-mix(in srgb, var(--s-surface) 86%, transparent); border-bottom: 1px solid var(--s-border); backdrop-filter: blur(16px); }
.saas__search { width: min(420px, 45vw); border: 1px solid var(--s-border); border-radius: 999px; background: var(--s-surface-2); color: var(--s-muted); padding: 11px 18px; font-size: 14px; }
.saas__user { display: flex; align-items: center; gap: 16px; color: var(--s-soft); font-size: 13px; }
.saas__user i { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--s-accent), var(--s-accent-3)); border: 1px solid color-mix(in srgb, var(--s-accent) 40%, transparent); }
.saas__content { padding: 32px; max-width: 1280px; margin: 0 auto; }
.saas__heading { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 24px; }
.saas__heading h2 { margin: 0; font-size: 48px; line-height: 56px; letter-spacing: 0; }
.saas__heading p { margin: 4px 0 0; color: var(--s-soft); font-size: 18px; }
.saas__heading button { border-radius: 9px; padding: 10px 14px; font-weight: 800; margin-left: 10px; border: 1px solid var(--s-border); background: transparent; color: var(--s-text); }
.saas__heading button:last-child { background: var(--s-accent-2); color: #062013; border-color: transparent; }
.saas__metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.saas__card { background: var(--s-surface); border: 1px solid var(--s-border); border-radius: 12px; transition: .25s ease; }
.saas__card:hover { background: var(--s-surface-2); border-color: color-mix(in srgb, var(--s-accent) 35%, var(--s-border)); box-shadow: 0 0 20px color-mix(in srgb, var(--s-accent) 8%, transparent); }
.saas__metric { padding: 24px; }
.saas__metric > div { display: flex; justify-content: space-between; color: var(--s-accent-2); font-size: 12px; font-weight: 800; margin-bottom: 16px; }
.saas__metric i { width: 22px; height: 22px; border-radius: 50%; background: var(--s-accent); }
.saas__metric small { color: var(--s-soft); font-size: 11px; text-transform: uppercase; font-weight: 900; }
.saas__metric strong { display: block; font-size: 32px; line-height: 40px; }
.saas__metric p { margin: 8px 0 0; color: var(--s-muted); font-size: 11px; }
.saas__charts { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px; }
.saas__arr, .saas__donut, .saas__heat, .saas__conversions { padding: 24px; }
.saas__card-head { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.saas__card-head h3, .saas__donut h3, .saas__heat h3, .saas__conversions h3 { margin: 0; font-size: 20px; }
.saas__card-head p, .saas__donut p, .saas__heat p, .saas__conversions p { margin: 4px 0 0; color: var(--s-soft); font-size: 14px; }
.saas__card-head span { color: var(--s-soft); font-size: 10px; font-weight: 900; text-transform: uppercase; }
.saas__bars { height: 240px; display: flex; align-items: end; justify-content: space-between; gap: 14px; padding: 0 12px; border-bottom: 1px solid var(--s-border); }
.saas__bars i { width: 30px; border-radius: 8px 8px 0 0; background: color-mix(in srgb, var(--s-accent) 45%, transparent); }
.saas__bars i:last-child { background: var(--s-accent-2); }
.saas__months { display: flex; justify-content: space-between; color: var(--s-muted); font-size: 10px; margin-top: 12px; }
.saas__donut > div { height: 220px; display: grid; place-items: center; position: relative; }
.saas__donut svg { width: 190px; height: 190px; transform: rotate(-90deg); }
.saas__donut circle { fill: none; stroke-width: 12; }
.saas__donut circle:nth-child(1) { stroke: var(--s-surface-2); }
.saas__donut circle:nth-child(2) { stroke: var(--s-accent); stroke-dasharray: 251.2; stroke-dashoffset: 100.48; }
.saas__donut circle:nth-child(3) { stroke: var(--s-accent-3); stroke-dasharray: 251.2; stroke-dashoffset: 200.96; }
.saas__donut circle:nth-child(4) { stroke: var(--s-accent-2); stroke-dasharray: 251.2; stroke-dashoffset: 226.08; }
.saas__donut strong { position: absolute; text-align: center; font-size: 32px; }
.saas__donut strong span { display: block; color: var(--s-muted); font-size: 10px; text-transform: uppercase; }
.saas__donut footer { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; font-size: 12px; }
.saas__lower { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.saas__heat table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 10px; }
.saas__heat th { text-align: left; padding: 8px 10px; }
.saas__heat td { padding: 4px; }
.saas__heat td span { aspect-ratio: 1; border-radius: 3px; background: var(--s-accent); color: var(--s-button-text); display: grid; place-items: center; }
.saas__conversions { display: grid; gap: 12px; }
.saas__conversion { display: grid; grid-template-columns: 40px 1fr auto; align-items: center; gap: 12px; padding: 14px; background: var(--s-surface-2); border: 1px solid var(--s-border); border-radius: 9px; }
.saas__conversion i { width: 40px; height: 40px; border-radius: 9px; background: color-mix(in srgb, var(--s-accent) 16%, transparent); }
.saas__conversion span, .saas__conversion small { display: block; color: var(--s-muted); font-size: 10px; font-weight: 400; }
.saas__conversion b { color: var(--s-accent-2); text-align: right; font-size: 13px; }
.saas__status { margin-top: 24px; padding: 18px 24px; border: 1px solid var(--s-border); border-radius: 12px; background: var(--s-surface); display: flex; flex-wrap: wrap; gap: 20px; align-items: center; color: var(--s-soft); font-size: 12px; }
.saas__status strong { color: var(--s-text); text-transform: uppercase; letter-spacing: .08em; }
.saas__fab { position: fixed; right: 24px; bottom: 24px; width: 56px; height: 56px; border-radius: 50%; border: 0; background: var(--s-accent); color: var(--s-button-text); font-weight: 900; cursor: pointer; }
@media (max-width: 980px) {
  .saas { display: block; }
  .saas__side { display: none; }
  .saas__heading, .saas__charts, .saas__lower { display: grid; grid-template-columns: 1fr; }
  .saas__metrics { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .saas__metrics { grid-template-columns: 1fr; }
  .saas__content { padding: 20px; }
  .saas__heading h2 { font-size: 34px; line-height: 40px; }
}`;
}
