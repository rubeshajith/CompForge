import type { ManufacturingDashboardConfig } from "./manufacturingDashboardConfig";

export function generateManufacturingDashboardJSX(
  config: ManufacturingDashboardConfig,
): string {
  return `import { useState } from "react";
import "./ManufacturingDashboard.css";

const navItems = ["Overview", "Production", "Analytics", "Maintenance", "Tasks", "Alerts"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const alerts = [
  "Machine #3 is currently down for maintenance.",
  "Inventory level for raw material XYZ is critically low.",
  "Work order #123 for production line 2 is delayed.",
  "Maintenance for Machine #1 is overdue.",
];

function Icon({ path }) {
  return (
    <svg className="mfg__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function ManufacturingDashboard({ onDownloadReport }) {
  const [activeNav, setActiveNav] = useState("Production");

  return (
    <div className="mfg-wrap">
      <div className="mfg">
        ${
          config.showSidebar
            ? `<aside className="mfg__sidebar">
          <div>
            <div className="mfg__brand">
              <span className="mfg__logo">X</span>
              <strong>XMES</strong>
            </div>
            <nav className="mfg__nav" aria-label="Manufacturing dashboard">
              {navItems.map((item) => {
                const active = activeNav === item;
                return (
                  <button key={item} className={active ? "mfg__nav-item mfg__nav-item--active" : "mfg__nav-item"} onClick={() => setActiveNav(item)} type="button">
                    <Icon path={active ? "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" : "M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v4H4zM14 16h6v4h-6z"} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mfg__sidebar-foot">
            <div className="mfg__version">
              <div><span className="mfg__status-dot" /><strong>New Version</strong></div>
              <p>Running on latest version 3.5.11.</p>
            </div>
            <span className="mfg__settings"><Icon path="M10.3 4.3a1.7 1.7 0 0 1 3.4 0 1.7 1.7 0 0 0 2.6 1.1 1.7 1.7 0 0 1 2.4 2.4 1.7 1.7 0 0 0 1.1 2.6 1.7 1.7 0 0 1 0 3.4 1.7 1.7 0 0 0-1.1 2.6 1.7 1.7 0 0 1-2.4 2.4 1.7 1.7 0 0 0-2.6 1.1 1.7 1.7 0 0 1-3.4 0 1.7 1.7 0 0 0-2.6-1.1 1.7 1.7 0 0 1-2.4-2.4 1.7 1.7 0 0 0-1.1-2.6 1.7 1.7 0 0 1 0-3.4 1.7 1.7 0 0 0 1.1-2.6 1.7 1.7 0 0 1 2.4-2.4 1.7 1.7 0 0 0 2.6-1.1z" /> Settings</span>
          </div>
        </aside>`
            : ""
        }

        <main className="mfg__main">
          <header className="mfg__topbar">
            <h1>Good Afternoon</h1>
            <div className="mfg__top-actions">
              ${
                config.showProfile
                  ? `<div className="mfg__profile">
                <span className="mfg__avatar" />
                <div><strong>Mr. Asif Ali</strong><span>Manager</span></div>
              </div>`
                  : ""
              }
              <label className="mfg__search">
                <span>Search here</span>
                <input aria-label="Search manufacturing dashboard" />
              </label>
            </div>
          </header>

          <div className="mfg__grid">
            <section className="mfg__card mfg__efficiency">
              <div className="mfg__card-head">
                <h2>Production Efficiency</h2>
                <button type="button">2023</button>
              </div>
              <div className="mfg__chart-wrap">
                <svg className="mfg__area-chart" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Production efficiency chart">
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110 L800,200 L0,200 Z" className="mfg__area-fill" />
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110" className="mfg__area-line" />
                  <circle cx="400" cy="100" r="5" className="mfg__chart-point" />
                  <line x1="400" x2="400" y1="100" y2="200" className="mfg__chart-guide" />
                </svg>
                <div className="mfg__tooltip"><strong>90.34%</strong><span>120 units/day</span></div>
              </div>
              <div className="mfg__months">
                {months.map((month) => <span key={month} className={month === "Jul" ? "mfg__month mfg__month--active" : "mfg__month"}>{month}</span>)}
              </div>
            </section>

            <section className="mfg__card mfg__alerts">
              <h2>Alerts</h2>
              <div className="mfg__alert-list">
                {alerts.map((alert, index) => (
                  <div key={alert} className={index > 1 ? "mfg__alert mfg__alert--muted" : "mfg__alert"}>
                    <span className="mfg__alert-icon"><Icon path="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h11" /></span>
                    <p>{alert}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mfg__card mfg__tasks">
              <h2>Pending Tasks</h2>
              <strong>Quality Inspection for Product X.</strong>
              <ul>
                <li>Conduct quality inspection before packaging.</li>
                <li>Due Date: 05/05/2024</li>
                <li>Priority: High</li>
              </ul>
              <button type="button">Start Inspection</button>
            </section>

            <section className="mfg__card mfg__defects">
              <div className="mfg__card-head">
                <h2>Defect Rate</h2>
                <button type="button">May</button>
              </div>
              <div className="mfg__donut-wrap">
                <svg className="mfg__donut" viewBox="0 0 100 100" role="img" aria-label="Defect rate donut chart">
                  <circle cx="50" cy="50" r="32" className="mfg__donut-design" />
                  <circle cx="50" cy="50" r="32" className="mfg__donut-process" />
                  <circle cx="50" cy="50" r="32" className="mfg__donut-material" />
                  <text x="50" y="54">May</text>
                </svg>
                <div className="mfg__legend">
                  <span><b className="mfg__legend-dot mfg__legend-dot--success" /> Material 60%</span>
                  <span><b className="mfg__legend-dot mfg__legend-dot--accent" /> Process 30%</span>
                  <span><b className="mfg__legend-dot mfg__legend-dot--muted" /> Design 10%</span>
                </div>
              </div>
            </section>

            <section className="mfg__card mfg__sales">
              <div className="mfg__card-head">
                <h2>Sales Performance</h2>
                <button type="button">2024</button>
              </div>
              <svg className="mfg__sales-chart" viewBox="0 0 300 100" preserveAspectRatio="none" role="img" aria-label="Sales performance chart">
                {[20, 80, 140, 200, 260].map((x, index) => <rect key={x} x={x} y={[40, 25, 45, 30, 15][index]} width="8" height={[60, 75, 55, 70, 85][index]} rx="4" className="mfg__sales-bar" />)}
                <path d="M10,75 C30,20 50,85 70,85 C100,50 120,55 140,85 C160,50 180,60 200,80 C230,100 250,20 280,10" className="mfg__sales-line" />
                <rect x="120" y="30" width="100" height="16" rx="4" className="mfg__sales-tip" />
                <text x="126" y="41" className="mfg__sales-tip-value">4500</text>
                <text x="150" y="41" className="mfg__sales-tip-label">Low sales in May</text>
              </svg>
            </section>
          </div>

          ${
            config.showDownloadCard
              ? `<button className="mfg__download" onClick={() => onDownloadReport?.()} type="button">
            <span><Icon path="M9 12h6m-6 4h6M7 21h10a2 2 0 0 0 2-2V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" /></span>
            <div><strong>Download Report</strong><small>April 2024</small></div>
          </button>`
              : ""
          }
        </main>
      </div>
    </div>
  );
}
`;
}

export function generateManufacturingDashboardCSS(
  config: ManufacturingDashboardConfig,
): string {
  const gap = config.density === "compact" ? 14 : 24;
  const contentPadding = config.density === "compact" ? 20 : 28;
  const cardPadding =
    config.density === "compact"
      ? Math.max(14, config.cardPadding - 8)
      : config.cardPadding;
  const sidebarColumns = config.showSidebar ? "240px 1fr" : "1fr";
  const cardTransition = config.animateCards
    ? "transform 180ms ease, background 180ms ease, border-color 180ms ease"
    : "none";
  const cardHoverTransform = config.animateCards ? "translateY(-2px)" : "none";

  return `.mfg-wrap {
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${config.backgroundColor};
  color: ${config.textColor};
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.mfg {
  width: min(100%, ${config.dashboardWidth}px);
  min-height: 760px;
  display: grid;
  grid-template-columns: ${sidebarColumns};
  gap: 16px;
  padding: 16px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.shellRadius}px;
  background: ${config.backgroundColor};
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
  font-size: ${config.fontSize}px;
}

.mfg__sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 14px;
  border-radius: ${Math.max(18, config.shellRadius - 10)}px;
  background: ${config.sidebarColor};
}

.mfg__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 34px;
  padding: 0 8px;
}

.mfg__brand strong {
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.mfg__logo {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: ${config.successColor};
  color: ${config.backgroundColor};
  font-weight: 900;
}

.mfg__nav {
  display: grid;
  gap: 6px;
}

.mfg__nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 10px 12px;
  background: transparent;
  color: ${config.mutedTextColor};
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.mfg__nav-item--active {
  background: ${config.cardColor};
  color: ${config.textColor};
}

.mfg__icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
}

.mfg__sidebar-foot {
  display: grid;
  gap: 18px;
}

.mfg__version {
  border: 1px solid ${config.borderColor};
  border-radius: 14px;
  padding: 16px;
  background: ${config.cardColor};
}

.mfg__version div,
.mfg__settings {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mfg__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${config.successColor};
}

.mfg__version p,
.mfg__settings {
  color: ${config.mutedTextColor};
}

.mfg__version p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
}

.mfg__main {
  position: relative;
  overflow: hidden;
  padding: ${contentPadding}px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.shellRadius}px;
  background: ${config.shellColor};
}

.mfg__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: ${gap + 4}px;
}

.mfg__topbar h1,
.mfg__card h2 {
  margin: 0;
  color: ${config.textColor};
}

.mfg__topbar h1 {
  font-size: 25px;
  line-height: 1.2;
}

.mfg__top-actions,
.mfg__profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mfg__profile {
  gap: 10px;
}

.mfg__profile strong,
.mfg__profile span,
.mfg__download strong,
.mfg__download small {
  display: block;
}

.mfg__profile strong {
  font-size: 13px;
}

.mfg__profile span,
.mfg__download small {
  color: ${config.mutedTextColor};
  font-size: 11px;
}

.mfg__avatar {
  width: 40px;
  height: 40px;
  border: 1px solid ${config.borderColor};
  border-radius: 50%;
  background: linear-gradient(135deg, ${config.accentColor}, ${config.successColor});
}

.mfg__search {
  position: relative;
  width: 190px;
  display: block;
}

.mfg__search span {
  position: absolute;
  inset: 9px 14px auto;
  color: ${config.mutedTextColor};
  pointer-events: none;
}

.mfg__search input {
  width: 100%;
  border: 1px solid ${config.borderColor};
  border-radius: 999px;
  padding: 9px 14px;
  background: ${config.cardColor};
  color: ${config.textColor};
}

.mfg__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${gap}px;
}

.mfg__card {
  border: 1px solid ${config.borderColor};
  border-radius: ${config.cardRadius}px;
  padding: ${cardPadding}px;
  background: ${config.cardColor};
  transition: ${cardTransition};
}

.mfg__card:hover {
  background: ${config.cardHoverColor};
  transform: ${cardHoverTransform};
}

.mfg__efficiency {
  grid-column: span 8;
  min-height: 310px;
}

.mfg__alerts {
  grid-column: span 4;
}

.mfg__tasks {
  grid-column: span 3;
}

.mfg__defects {
  grid-column: span 5;
}

.mfg__sales {
  grid-column: span 4;
}

.mfg__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.mfg__card h2 {
  font-size: 20px;
}

.mfg__card-head button {
  border: 0;
  background: transparent;
  color: ${config.mutedTextColor};
  font: inherit;
  cursor: pointer;
}

.mfg__chart-wrap {
  position: relative;
  height: 190px;
}

.mfg__area-chart,
.mfg__sales-chart {
  width: 100%;
  height: 100%;
  display: block;
}

.mfg__area-fill {
  fill: ${config.accentColor};
  opacity: 0.28;
}

.mfg__area-line {
  fill: none;
  stroke: ${config.accentColor};
  stroke-width: 3px;
}

.mfg__chart-point {
  fill: ${config.successColor};
}

.mfg__chart-guide {
  stroke: ${config.successColor};
  stroke-dasharray: 2 4;
}

.mfg__tooltip {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 10px;
  border-radius: 9px;
  background: #ffffff;
  color: #000000;
  text-align: center;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.mfg__tooltip strong,
.mfg__tooltip span {
  display: block;
}

.mfg__tooltip strong {
  font-size: 12px;
}

.mfg__tooltip span {
  color: #6b7280;
  font-size: 10px;
}

.mfg__months {
  display: flex;
  justify-content: space-between;
  color: ${config.mutedTextColor};
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mfg__month--active {
  color: ${config.successColor};
  font-weight: 900;
}

.mfg__alert-list {
  display: grid;
  gap: 16px;
}

.mfg__alert {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.mfg__alert--muted {
  opacity: 0.55;
}

.mfg__alert-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: color-mix(in srgb, ${config.successColor} 16%, transparent);
  color: ${config.successColor};
}

.mfg__alert--muted .mfg__alert-icon {
  border: 1px solid ${config.borderColor};
  background: transparent;
  color: ${config.mutedTextColor};
}

.mfg__alert p {
  margin: 0;
  color: ${config.mutedTextColor};
  font-size: 12px;
  line-height: 1.45;
}

.mfg__tasks strong {
  display: block;
  margin: 14px 0 12px;
  color: ${config.successColor};
}

.mfg__tasks ul {
  margin: 0;
  padding-left: 18px;
  color: ${config.mutedTextColor};
  font-size: 12px;
  line-height: 1.8;
}

.mfg__tasks button {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 13px;
  padding: 11px 12px;
  background: ${config.accentColor};
  color: ${config.accentTextColor};
  font-weight: 900;
  cursor: pointer;
}

.mfg__donut-wrap {
  display: grid;
  place-items: center;
  gap: 20px;
}

.mfg__donut {
  width: 230px;
  height: 230px;
  overflow: visible;
}

.mfg__donut circle {
  fill: none;
  stroke-width: 18px;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
}

.mfg__donut-design {
  stroke: ${config.chartGridColor};
  stroke-dasharray: 20.1 201.06;
}

.mfg__donut-process {
  stroke: ${config.accentColor};
  stroke-dasharray: 60.32 201.06;
  stroke-dashoffset: -20.1;
}

.mfg__donut-material {
  stroke: ${config.successColor};
  stroke-dasharray: 120.64 201.06;
  stroke-dashoffset: -80.42;
}

.mfg__donut text {
  fill: ${config.textColor};
  font-size: 10px;
  font-weight: 900;
  text-anchor: middle;
}

.mfg__legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  color: ${config.mutedTextColor};
  font-size: 12px;
}

.mfg__legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 50%;
}

.mfg__legend-dot--success {
  background: ${config.successColor};
}

.mfg__legend-dot--accent {
  background: ${config.accentColor};
}

.mfg__legend-dot--muted {
  background: ${config.chartGridColor};
}

.mfg__sales-chart {
  height: 130px;
}

.mfg__sales-bar {
  fill: ${config.cardHoverColor};
}

.mfg__sales-line {
  fill: none;
  stroke: ${config.successColor};
  stroke-linecap: round;
  stroke-width: 3px;
}

.mfg__sales-tip {
  fill: #ffffff;
}

.mfg__sales-tip-value {
  fill: #000000;
  font-size: 6px;
  font-weight: 900;
}

.mfg__sales-tip-label {
  fill: #6b7280;
  font-size: 5px;
}

.mfg__download {
  position: absolute;
  right: 26px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 16px;
  padding: 14px;
  background: #ffffff;
  color: #111827;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  cursor: pointer;
}

.mfg__download > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f3f4f6;
}

.mfg__download small {
  color: #6b7280;
  font-size: 10px;
}

@media (max-width: 980px) {
  .mfg {
    grid-template-columns: 1fr;
  }

  .mfg__sidebar {
    display: none;
  }

  .mfg__efficiency,
  .mfg__alerts,
  .mfg__tasks,
  .mfg__defects,
  .mfg__sales {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .mfg-wrap {
    padding: 12px;
  }

  .mfg {
    padding: 10px;
  }

  .mfg__main {
    padding: 16px;
  }

  .mfg__top-actions,
  .mfg__search {
    width: 100%;
  }

  .mfg__download {
    position: static;
    margin-top: 18px;
  }
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateManufacturingDashboardTSX(
  config: ManufacturingDashboardConfig,
): string {
  return `import { useState } from "react";
import "./ManufacturingDashboard.css";

const navItems = ["Overview", "Production", "Analytics", "Maintenance", "Tasks", "Alerts"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const alerts = [
  "Machine #3 is currently down for maintenance.",
  "Inventory level for raw material XYZ is critically low.",
  "Work order #123 for production line 2 is delayed.",
  "Maintenance for Machine #1 is overdue.",
];

interface IconProps {
  path: string;
}

interface ManufacturingDashboardProps {
  onDownloadReport?: () => void;
}

function Icon({ path }: IconProps) {
  return (
    <svg className="mfg__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function ManufacturingDashboard({ onDownloadReport }: ManufacturingDashboardProps) {
  const [activeNav, setActiveNav] = useState<string>("Production");

  return (
    <div className="mfg-wrap">
      <div className="mfg">
        ${
          config.showSidebar
            ? `<aside className="mfg__sidebar">
          <div>
            <div className="mfg__brand">
              <span className="mfg__logo">X</span>
              <strong>XMES</strong>
            </div>
            <nav className="mfg__nav" aria-label="Manufacturing dashboard">
              {navItems.map((item) => {
                const active = activeNav === item;
                return (
                  <button key={item} className={active ? "mfg__nav-item mfg__nav-item--active" : "mfg__nav-item"} onClick={() => setActiveNav(item)} type="button">
                    <Icon path={active ? "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" : "M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v4H4zM14 16h6v4h-6z"} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mfg__sidebar-foot">
            <div className="mfg__version">
              <div><span className="mfg__status-dot" /><strong>New Version</strong></div>
              <p>Running on latest version 3.5.11.</p>
            </div>
            <span className="mfg__settings"><Icon path="M10.3 4.3a1.7 1.7 0 0 1 3.4 0 1.7 1.7 0 0 0 2.6 1.1 1.7 1.7 0 0 1 2.4 2.4 1.7 1.7 0 0 0 1.1 2.6 1.7 1.7 0 0 1 0 3.4 1.7 1.7 0 0 0-1.1 2.6 1.7 1.7 0 0 1-2.4 2.4 1.7 1.7 0 0 0-2.6 1.1 1.7 1.7 0 0 1-3.4 0 1.7 1.7 0 0 0-2.6-1.1 1.7 1.7 0 0 1-2.4-2.4 1.7 1.7 0 0 0-1.1-2.6 1.7 1.7 0 0 1 0-3.4 1.7 1.7 0 0 0 1.1-2.6 1.7 1.7 0 0 1 2.4-2.4 1.7 1.7 0 0 0 2.6-1.1z" /> Settings</span>
          </div>
        </aside>`
            : ""
        }

        <main className="mfg__main">
          <header className="mfg__topbar">
            <h1>Good Afternoon</h1>
            <div className="mfg__top-actions">
              ${
                config.showProfile
                  ? `<div className="mfg__profile">
                <span className="mfg__avatar" />
                <div><strong>Mr. Asif Ali</strong><span>Manager</span></div>
              </div>`
                  : ""
              }
              <label className="mfg__search">
                <span>Search here</span>
                <input aria-label="Search manufacturing dashboard" />
              </label>
            </div>
          </header>

          <div className="mfg__grid">
            <section className="mfg__card mfg__efficiency">
              <div className="mfg__card-head">
                <h2>Production Efficiency</h2>
                <button type="button">2023</button>
              </div>
              <div className="mfg__chart-wrap">
                <svg className="mfg__area-chart" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Production efficiency chart">
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110 L800,200 L0,200 Z" className="mfg__area-fill" />
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110" className="mfg__area-line" />
                  <circle cx="400" cy="100" r="5" className="mfg__chart-point" />
                  <line x1="400" x2="400" y1="100" y2="200" className="mfg__chart-guide" />
                </svg>
                <div className="mfg__tooltip"><strong>90.34%</strong><span>120 units/day</span></div>
              </div>
              <div className="mfg__months">
                {months.map((month) => <span key={month} className={month === "Jul" ? "mfg__month mfg__month--active" : "mfg__month"}>{month}</span>)}
              </div>
            </section>

            <section className="mfg__card mfg__alerts">
              <h2>Alerts</h2>
              <div className="mfg__alert-list">
                {alerts.map((alert, index) => (
                  <div key={alert} className={index > 1 ? "mfg__alert mfg__alert--muted" : "mfg__alert"}>
                    <span className="mfg__alert-icon"><Icon path="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h11" /></span>
                    <p>{alert}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mfg__card mfg__tasks">
              <h2>Pending Tasks</h2>
              <strong>Quality Inspection for Product X.</strong>
              <ul>
                <li>Conduct quality inspection before packaging.</li>
                <li>Due Date: 05/05/2024</li>
                <li>Priority: High</li>
              </ul>
              <button type="button">Start Inspection</button>
            </section>

            <section className="mfg__card mfg__defects">
              <div className="mfg__card-head">
                <h2>Defect Rate</h2>
                <button type="button">May</button>
              </div>
              <div className="mfg__donut-wrap">
                <svg className="mfg__donut" viewBox="0 0 100 100" role="img" aria-label="Defect rate donut chart">
                  <circle cx="50" cy="50" r="32" className="mfg__donut-design" />
                  <circle cx="50" cy="50" r="32" className="mfg__donut-process" />
                  <circle cx="50" cy="50" r="32" className="mfg__donut-material" />
                  <text x="50" y="54">May</text>
                </svg>
                <div className="mfg__legend">
                  <span><b className="mfg__legend-dot mfg__legend-dot--success" /> Material 60%</span>
                  <span><b className="mfg__legend-dot mfg__legend-dot--accent" /> Process 30%</span>
                  <span><b className="mfg__legend-dot mfg__legend-dot--muted" /> Design 10%</span>
                </div>
              </div>
            </section>

            <section className="mfg__card mfg__sales">
              <div className="mfg__card-head">
                <h2>Sales Performance</h2>
                <button type="button">2024</button>
              </div>
              <svg className="mfg__sales-chart" viewBox="0 0 300 100" preserveAspectRatio="none" role="img" aria-label="Sales performance chart">
                {[20, 80, 140, 200, 260].map((x, index) => <rect key={x} x={x} y={([40, 25, 45, 30, 15] as number[])[index]} width="8" height={([60, 75, 55, 70, 85] as number[])[index]} rx="4" className="mfg__sales-bar" />)}
                <path d="M10,75 C30,20 50,85 70,85 C100,50 120,55 140,85 C160,50 180,60 200,80 C230,100 250,20 280,10" className="mfg__sales-line" />
                <rect x="120" y="30" width="100" height="16" rx="4" className="mfg__sales-tip" />
                <text x="126" y="41" className="mfg__sales-tip-value">4500</text>
                <text x="150" y="41" className="mfg__sales-tip-label">Low sales in May</text>
              </svg>
            </section>
          </div>

          ${
            config.showDownloadCard
              ? `<button className="mfg__download" onClick={() => onDownloadReport?.()} type="button">
            <span><Icon path="M9 12h6m-6 4h6M7 21h10a2 2 0 0 0 2-2V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" /></span>
            <div><strong>Download Report</strong><small>April 2024</small></div>
          </button>`
              : ""
          }
        </main>
      </div>
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateManufacturingDashboardTailwind(
  config: ManufacturingDashboardConfig,
): string {
  // Pre-compute values that require JS logic
  const gap = config.density === "compact" ? 14 : 24;
  const contentPadding = config.density === "compact" ? 20 : 28;
  const cardPadding =
    config.density === "compact"
      ? Math.max(14, config.cardPadding - 8)
      : config.cardPadding;
  const sidebarRadius = Math.max(18, config.shellRadius - 10);
  const cardTransition = config.animateCards
    ? "transform 180ms ease, background 180ms ease, border-color 180ms ease"
    : "none";
  const cardHoverTransform = config.animateCards ? "translateY(-2px)" : "none";

  // Font sizes — baked as literals
  const fs = config.fontSize;

  return `import { useState, CSSProperties } from "react";

const navItems = ["Overview", "Production", "Analytics", "Maintenance", "Tasks", "Alerts"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const alerts = [
  "Machine #3 is currently down for maintenance.",
  "Inventory level for raw material XYZ is critically low.",
  "Work order #123 for production line 2 is delayed.",
  "Maintenance for Machine #1 is overdue.",
];

interface IconProps {
  path: string;
}

interface ManufacturingDashboardProps {
  onDownloadReport?: () => void;
}

// Baked-in CSS variable tokens — update these to reskin the ManufacturingDashboard
const mfgVars: CSSProperties = {
  "--mfg-bg":               "${config.backgroundColor}",
  "--mfg-shell":            "${config.shellColor}",
  "--mfg-sidebar":          "${config.sidebarColor}",
  "--mfg-card":             "${config.cardColor}",
  "--mfg-card-hover":       "${config.cardHoverColor}",
  "--mfg-border":           "${config.borderColor}",
  "--mfg-text":             "${config.textColor}",
  "--mfg-muted":            "${config.mutedTextColor}",
  "--mfg-accent":           "${config.accentColor}",
  "--mfg-accent-text":      "${config.accentTextColor}",
  "--mfg-success":          "${config.successColor}",
  "--mfg-chart-grid":       "${config.chartGridColor}",
  "--mfg-shell-radius":     "${config.shellRadius}px",
  "--mfg-card-radius":      "${config.cardRadius}px",
  "--mfg-sidebar-radius":   "${sidebarRadius}px",
  "--mfg-dashboard-width":  "${config.dashboardWidth}px",
  "--mfg-gap":              "${gap}px",
  "--mfg-content-padding":  "${contentPadding}px",
  "--mfg-card-padding":     "${cardPadding}px",
  "--mfg-card-transition":  "${cardTransition}",
  "--mfg-card-hover-tf":    "${cardHoverTransform}",
} as CSSProperties;

function Icon({ path }: IconProps) {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function ManufacturingDashboard({ onDownloadReport }: ManufacturingDashboardProps) {
  const [activeNav, setActiveNav] = useState<string>("Production");

  return (
    <div
      className="w-full grid place-items-center p-6 font-sans"
      style={{ ...mfgVars, background: "var(--mfg-bg)", color: "var(--mfg-text)" } as CSSProperties}
    >
      <div
        className="w-full min-h-[760px] grid gap-4 p-4 border border-[var(--mfg-border)] bg-[var(--mfg-bg)]"
        style={{
          maxWidth: "var(--mfg-dashboard-width)",
          gridTemplateColumns: ${config.showSidebar ? '"240px 1fr"' : '"1fr"'},
          borderRadius: "var(--mfg-shell-radius)",
          boxShadow: "0 28px 80px rgba(0,0,0,0.36)",
          fontSize: "${fs}px",
        }}
      >
        ${
          config.showSidebar
            ? `<aside
          className="flex flex-col justify-between py-5 px-3.5 bg-[var(--mfg-sidebar)]"
          style={{ borderRadius: "var(--mfg-sidebar-radius)" }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-8 px-2">
              <span
                className="w-8 h-8 grid place-items-center font-black bg-[var(--mfg-success)] text-[var(--mfg-bg)]"
                style={{ borderRadius: "9px" }}
              >
                X
              </span>
              <strong className="text-[25px] font-black tracking-[-0.04em]">XMES</strong>
            </div>
            <nav className="grid gap-1.5" aria-label="Manufacturing dashboard">
              {navItems.map((item) => {
                const active = activeNav === item;
                let cls = "flex items-center gap-3 w-full border-0 rounded-[10px] px-3 py-2.5 font-semibold text-left cursor-pointer text-[${fs}px]";
                cls += active
                  ? " bg-[var(--mfg-card)] text-[var(--mfg-text)]"
                  : " bg-transparent text-[var(--mfg-muted)]";
                return (
                  <button key={item} className={cls} onClick={() => setActiveNav(item)} type="button">
                    <Icon path={active ? "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" : "M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v4H4zM14 16h6v4h-6z"} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="grid gap-4">
            <div
              className="border border-[var(--mfg-border)] p-4 bg-[var(--mfg-card)]"
              style={{ borderRadius: "14px" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[var(--mfg-success)]" />
                <strong className="text-[${fs}px]">New Version</strong>
              </div>
              <p className="mt-2 text-[12px] leading-snug text-[var(--mfg-muted)]">Running on latest version 3.5.11.</p>
            </div>
            <span className="flex items-center gap-2.5 text-[var(--mfg-muted)] text-[${fs}px] cursor-pointer">
              <Icon path="M10.3 4.3a1.7 1.7 0 0 1 3.4 0 1.7 1.7 0 0 0 2.6 1.1 1.7 1.7 0 0 1 2.4 2.4 1.7 1.7 0 0 0 1.1 2.6 1.7 1.7 0 0 1 0 3.4 1.7 1.7 0 0 0-1.1 2.6 1.7 1.7 0 0 1-2.4 2.4 1.7 1.7 0 0 0-2.6 1.1 1.7 1.7 0 0 1-3.4 0 1.7 1.7 0 0 0-2.6-1.1 1.7 1.7 0 0 1-2.4-2.4 1.7 1.7 0 0 0-1.1-2.6 1.7 1.7 0 0 1 0-3.4 1.7 1.7 0 0 0 1.1-2.6 1.7 1.7 0 0 1 2.4-2.4 1.7 1.7 0 0 0 2.6-1.1z" />
              Settings
            </span>
          </div>
        </aside>`
            : ""
        }

        <main
          className="relative overflow-hidden border border-[var(--mfg-border)] bg-[var(--mfg-shell)]"
          style={{ padding: "var(--mfg-content-padding)", borderRadius: "var(--mfg-shell-radius)" }}
        >
          <header
            className="flex items-center justify-between gap-4 flex-wrap"
            style={{ marginBottom: "${gap + 4}px" }}
          >
            <h1 className="m-0 text-[25px] leading-tight font-bold text-[var(--mfg-text)]">Good Afternoon</h1>
            <div className="flex items-center gap-5">
              ${
                config.showProfile
                  ? `<div className="flex items-center gap-2.5">
                <span
                  className="w-10 h-10 border border-[var(--mfg-border)] rounded-full"
                  style={{ background: "linear-gradient(135deg, var(--mfg-accent), var(--mfg-success))" }}
                />
                <div>
                  <strong className="block text-[13px]">Mr. Asif Ali</strong>
                  <span className="block text-[11px] text-[var(--mfg-muted)]">Manager</span>
                </div>
              </div>`
                  : ""
              }
              <label className="relative w-[190px] block">
                <span className="absolute top-[9px] left-[14px] text-[var(--mfg-muted)] pointer-events-none text-[${fs}px]">Search here</span>
                <input
                  aria-label="Search manufacturing dashboard"
                  className="w-full border border-[var(--mfg-border)] rounded-full py-[9px] px-[14px] bg-[var(--mfg-card)] text-[var(--mfg-text)] text-[${fs}px] outline-none"
                />
              </label>
            </div>
          </header>

          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "var(--mfg-gap)" }}
          >
            {/* Production Efficiency */}
            <section
              className="border border-[var(--mfg-border)] bg-[var(--mfg-card)] min-h-[310px]"
              style={{
                gridColumn: "span 8",
                borderRadius: "var(--mfg-card-radius)",
                padding: "var(--mfg-card-padding)",
                transition: "var(--mfg-card-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "var(--mfg-card-hover-tf)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <div className="flex items-center justify-between gap-4 mb-7">
                <h2 className="m-0 text-[20px] text-[var(--mfg-text)]">Production Efficiency</h2>
                <button type="button" className="border-0 bg-transparent text-[var(--mfg-muted)] cursor-pointer text-[${fs}px]">2023</button>
              </div>
              <div className="relative h-[190px]">
                <svg className="w-full h-full block" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Production efficiency chart">
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110 L800,200 L0,200 Z" fill="var(--mfg-accent)" opacity="0.28" />
                  <path d="M0,150 Q50,130 100,140 T200,120 T300,130 T400,100 T500,130 T600,100 T700,140 T800,110" fill="none" stroke="var(--mfg-accent)" strokeWidth="3" />
                  <circle cx="400" cy="100" r="5" fill="var(--mfg-success)" />
                  <line x1="400" x2="400" y1="100" y2="200" stroke="var(--mfg-success)" strokeDasharray="2 4" />
                </svg>
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-2 text-center"
                  style={{ borderRadius: "9px", background: "#ffffff", color: "#000000", boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
                >
                  <strong className="block text-[12px]">90.34%</strong>
                  <span className="block text-[10px]" style={{ color: "#6b7280" }}>120 units/day</span>
                </div>
              </div>
              <div className="flex justify-between text-[var(--mfg-muted)] text-[10px] uppercase tracking-widest mt-2">
                {months.map((month) => (
                  <span
                    key={month}
                    className={month === "Jul" ? "font-black text-[var(--mfg-success)]" : ""}
                  >
                    {month}
                  </span>
                ))}
              </div>
            </section>

            {/* Alerts */}
            <section
              className="border border-[var(--mfg-border)] bg-[var(--mfg-card)]"
              style={{
                gridColumn: "span 4",
                borderRadius: "var(--mfg-card-radius)",
                padding: "var(--mfg-card-padding)",
                transition: "var(--mfg-card-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "var(--mfg-card-hover-tf)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <h2 className="m-0 text-[20px] text-[var(--mfg-text)] mb-4">Alerts</h2>
              <div className="grid gap-4">
                {alerts.map((alert, index) => (
                  <div key={alert} className={\`flex items-start gap-3 \${index > 1 ? "opacity-55" : ""}\`}>
                    <span
                      className="w-[38px] h-[38px] grid place-items-center shrink-0 rounded-full text-[var(--mfg-success)]"
                      style={{ background: index > 1 ? "transparent" : \`color-mix(in srgb, var(--mfg-success) 16%, transparent)\`, border: index > 1 ? "1px solid var(--mfg-border)" : "none", color: index > 1 ? "var(--mfg-muted)" : "var(--mfg-success)" }}
                    >
                      <Icon path="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h11" />
                    </span>
                    <p className="m-0 text-[12px] leading-snug text-[var(--mfg-muted)]">{alert}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pending Tasks */}
            <section
              className="border border-[var(--mfg-border)] bg-[var(--mfg-card)]"
              style={{
                gridColumn: "span 3",
                borderRadius: "var(--mfg-card-radius)",
                padding: "var(--mfg-card-padding)",
                transition: "var(--mfg-card-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "var(--mfg-card-hover-tf)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <h2 className="m-0 text-[20px] text-[var(--mfg-text)]">Pending Tasks</h2>
              <strong className="block my-3.5 text-[var(--mfg-success)] text-[${fs}px]">Quality Inspection for Product X.</strong>
              <ul className="m-0 pl-[18px] text-[var(--mfg-muted)] text-[12px] leading-[1.8]">
                <li>Conduct quality inspection before packaging.</li>
                <li>Due Date: 05/05/2024</li>
                <li>Priority: High</li>
              </ul>
              <button
                type="button"
                className="w-full mt-4 border-0 py-[11px] px-3 bg-[var(--mfg-accent)] text-[var(--mfg-accent-text)] font-black cursor-pointer text-[${fs}px]"
                style={{ borderRadius: "13px" }}
              >
                Start Inspection
              </button>
            </section>

            {/* Defect Rate */}
            <section
              className="border border-[var(--mfg-border)] bg-[var(--mfg-card)]"
              style={{
                gridColumn: "span 5",
                borderRadius: "var(--mfg-card-radius)",
                padding: "var(--mfg-card-padding)",
                transition: "var(--mfg-card-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "var(--mfg-card-hover-tf)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <div className="flex items-center justify-between gap-4 mb-7">
                <h2 className="m-0 text-[20px] text-[var(--mfg-text)]">Defect Rate</h2>
                <button type="button" className="border-0 bg-transparent text-[var(--mfg-muted)] cursor-pointer text-[${fs}px]">May</button>
              </div>
              <div className="grid place-items-center gap-5">
                <svg className="w-[230px] h-[230px] overflow-visible" viewBox="0 0 100 100" role="img" aria-label="Defect rate donut chart">
                  <circle cx="50" cy="50" r="32" fill="none" stroke="var(--mfg-chart-grid)" strokeWidth="18" style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", strokeDasharray: "20.1 201.06" }} />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="var(--mfg-accent)" strokeWidth="18" style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", strokeDasharray: "60.32 201.06", strokeDashoffset: "-20.1" }} />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="var(--mfg-success)" strokeWidth="18" style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", strokeDasharray: "120.64 201.06", strokeDashoffset: "-80.42" }} />
                  <text x="50" y="54" fill="var(--mfg-text)" fontSize="10" fontWeight="900" textAnchor="middle">May</text>
                </svg>
                <div className="flex justify-center gap-4 flex-wrap text-[var(--mfg-muted)] text-[12px]">
                  <span><b className="inline-block w-2.5 h-2.5 mr-1.5 rounded-full bg-[var(--mfg-success)]" /> Material 60%</span>
                  <span><b className="inline-block w-2.5 h-2.5 mr-1.5 rounded-full bg-[var(--mfg-accent)]" /> Process 30%</span>
                  <span><b className="inline-block w-2.5 h-2.5 mr-1.5 rounded-full bg-[var(--mfg-chart-grid)]" /> Design 10%</span>
                </div>
              </div>
            </section>

            {/* Sales Performance */}
            <section
              className="border border-[var(--mfg-border)] bg-[var(--mfg-card)]"
              style={{
                gridColumn: "span 4",
                borderRadius: "var(--mfg-card-radius)",
                padding: "var(--mfg-card-padding)",
                transition: "var(--mfg-card-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "var(--mfg-card-hover-tf)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--mfg-card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <div className="flex items-center justify-between gap-4 mb-7">
                <h2 className="m-0 text-[20px] text-[var(--mfg-text)]">Sales Performance</h2>
                <button type="button" className="border-0 bg-transparent text-[var(--mfg-muted)] cursor-pointer text-[${fs}px]">2024</button>
              </div>
              <svg className="w-full block h-[130px]" viewBox="0 0 300 100" preserveAspectRatio="none" role="img" aria-label="Sales performance chart">
                {[20, 80, 140, 200, 260].map((x, index) => (
                  <rect key={x} x={x} y={([40, 25, 45, 30, 15] as number[])[index]} width="8" height={([60, 75, 55, 70, 85] as number[])[index]} rx="4" fill="var(--mfg-card-hover)" />
                ))}
                <path d="M10,75 C30,20 50,85 70,85 C100,50 120,55 140,85 C160,50 180,60 200,80 C230,100 250,20 280,10" fill="none" stroke="var(--mfg-success)" strokeLinecap="round" strokeWidth="3" />
                <rect x="120" y="30" width="100" height="16" rx="4" fill="#ffffff" />
                <text x="126" y="41" fill="#000000" fontSize="6" fontWeight="900">4500</text>
                <text x="150" y="41" fill="#6b7280" fontSize="5">Low sales in May</text>
              </svg>
            </section>
          </div>

          ${
            config.showDownloadCard
              ? `<button
            className="absolute right-[26px] bottom-6 flex items-center gap-3 border-0 rounded-[16px] p-3.5 cursor-pointer"
            style={{ background: "#ffffff", color: "#111827", boxShadow: "0 16px 40px rgba(0,0,0,0.28)" }}
            onClick={() => onDownloadReport?.()}
            type="button"
          >
            <span className="w-[38px] h-[38px] grid place-items-center rounded-[10px]" style={{ background: "#f3f4f6" }}>
              <Icon path="M9 12h6m-6 4h6M7 21h10a2 2 0 0 0 2-2V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
            </span>
            <div>
              <strong className="block text-[${fs}px]">Download Report</strong>
              <small className="block text-[10px]" style={{ color: "#6b7280" }}>April 2024</small>
            </div>
          </button>`
              : ""
          }
        </main>
      </div>
    </div>
  );
}
`;
}
