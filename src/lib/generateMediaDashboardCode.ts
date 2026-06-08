import type { MediaDashboardConfig } from "./mediaDashboardConfig";

export function generateMediaDashboardJSX(
  config: MediaDashboardConfig,
): string {
  const ranges = ["realtime", "day", "week"];
  const selectedIndex = Math.max(0, ranges.indexOf(config.selectedRange));

  return `import { useState } from "react";
import "./MediaDashboard.css";

const navItems = ["Dashboard", "Streaming", "Content", "Audience", "Revenue"];
const rangeOptions = [
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
  { title: "Neo-Horizon: Echoes", views: "4.2M views", score: 92, tone: "secondary" },
  { title: "The Last Protocol", views: "2.8M views", score: 88, tone: "accent" },
  { title: "CyberPulse Live", views: "1.9M views", score: 76, tone: "tertiary" },
];

export default function MediaDashboard({ onRangeChange }) {
  const [range, setRange] = useState(rangeOptions[${selectedIndex}].value);

  function handleRangeChange(value) {
    setRange(value);
    onRangeChange?.(value);
  }

  return (
    <div className="mdash-wrap">
      <div className="mdash">
        ${
          config.showSidebar
            ? `<aside className="mdash__sidebar">
          <div className="mdash__brand">
            <strong>Luminous</strong>
            <span>Media & Ent.</span>
          </div>
          <nav className="mdash__nav" aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <button key={item} className={item === "Content" ? "mdash__nav-item mdash__nav-item--active" : "mdash__nav-item"}>
                <span className="mdash__nav-icon" aria-hidden="true">{item === "Content" ? "movie" : item === "Revenue" ? "payments" : item.toLowerCase()}</span>
                {item}
              </button>
            ))}
          </nav>
          <button className="mdash__export">Export Reports</button>
        </aside>`
            : ""
        }

        <main className="mdash__main">
          ${
            config.showTopBar
              ? `<header className="mdash__topbar">
            <div className="mdash__search">Search analytics...</div>
            <div className="mdash__actions" aria-label="Account actions">
              <span>notifications</span>
              <span>settings</span>
              <span className="mdash__avatar" />
            </div>
          </header>`
              : ""
          }

          <section className="mdash__content">
            <div className="mdash__header">
              <div>
                <h2>Content Performance</h2>
                <p>Real-time engagement and distribution insights across global clusters.</p>
              </div>
              <div className="mdash__range" role="tablist" aria-label="Time range">
                {rangeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={range === option.value ? "mdash__range-btn mdash__range-btn--active" : "mdash__range-btn"}
                    onClick={() => handleRangeChange(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mdash__metrics">
              {metrics.map((metric, index) => (
                <article key={metric.label} className="mdash__card mdash__metric">
                  <div className="mdash__metric-top">
                    <span className={index === 1 ? "mdash__symbol mdash__symbol--secondary" : "mdash__symbol"}>{metric.icon}</span>
                    <span className={metric.delta === "Stable" ? "mdash__delta" : "mdash__delta mdash__delta--up"}>{metric.delta}</span>
                  </div>
                  <span className="mdash__label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>

            <div className="mdash__primary-grid">
              <article className="mdash__card mdash__chart-card">
                <div className="mdash__card-head">
                  <h3>Live Viewership Trends</h3>
                  <div className="mdash__legend">
                    <span><b className="mdash__dot mdash__dot--accent" /> North America</span>
                    <span><b className="mdash__dot mdash__dot--tertiary" /> EMEA</span>
                  </div>
                </div>
                <svg className="mdash__chart" viewBox="0 0 800 230" role="img" aria-label="Live viewership trend chart">
                  {[40, 90, 140, 190].map((y) => <line key={y} x1="0" x2="800" y1={y} y2={y} className="mdash__chart-grid" />)}
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80 V230 H0 Z" className="mdash__area mdash__area--accent" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130 V230 H0 Z" className="mdash__area mdash__area--tertiary" />
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80" className="mdash__line mdash__line--accent" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130" className="mdash__line mdash__line--tertiary" />
                  <circle cx="600" cy="60" r="6" className="mdash__pulse" />
                  <text x="615" y="55" className="mdash__chart-text">8.4M LIVE</text>
                </svg>
              </article>

              <article className="mdash__card mdash__leaderboard">
                <h3>Top Performers</h3>
                <div className="mdash__performers">
                  {performers.map((item, index) => (
                    <div key={item.title} className="mdash__performer">
                      <div className={"mdash__poster mdash__poster--" + item.tone} />
                      <div className="mdash__performer-body">
                        <strong>{item.title}</strong>
                        <span>{item.views}</span>
                        <div className="mdash__score-row">
                          <div className="mdash__score-track"><div className={"mdash__score mdash__score--" + item.tone} style={{ width: item.score + "%" }} /></div>
                          <b className={"mdash__score-text mdash__score-text--" + item.tone}>{item.score}%</b>
                        </div>
                      </div>
                      <span className="mdash__rank">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="mdash__secondary-grid">
              <article className="mdash__card mdash__map-card">
                <h3>Global Streaming Density</h3>
                <div className="mdash__map">
                  <span className="mdash__globe">public</span>
                  <i className="mdash__marker mdash__marker--la" />
                  <i className="mdash__marker mdash__marker--london" />
                  <i className="mdash__marker mdash__marker--tokyo" />
                  <div className="mdash__map-callout">
                    <span>Peak Region</span>
                    <strong>APAC Cluster <b>+22%</b></strong>
                  </div>
                </div>
              </article>

              <article className="mdash__card mdash__demo-card">
                <h3>Audience Demographics</h3>
                <div className="mdash__demo">
                  <div className="mdash__donut">
                    <svg viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" className="mdash__donut-track" />
                      <circle cx="18" cy="18" r="16" className="mdash__donut-main" />
                      <circle cx="18" cy="18" r="16" className="mdash__donut-alt" />
                    </svg>
                    <strong>18-34</strong>
                  </div>
                  <div className="mdash__bars">
                    {[
                      ["Mobile App", 68, "accent"],
                      ["Smart TV", 24, "secondary"],
                      ["Desktop", 8, "muted"],
                    ].map(([label, value, tone]) => (
                      <div key={label} className="mdash__bar-item">
                        <span>{label}<b>{value}%</b></span>
                        <div className="mdash__bar-track"><i className={"mdash__bar mdash__bar--" + tone} style={{ width: value + "%" }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
`;
}

export function generateMediaDashboardCSS(
  config: MediaDashboardConfig,
): string {
  const compact = config.density === "compact";
  const gap = compact ? 14 : 24;
  const contentPadding = compact ? 20 : 28;
  const cardPadding = compact
    ? Math.max(14, config.cardPadding - 8)
    : config.cardPadding;
  const sidebar = config.showSidebar ? "220px 1fr" : "1fr";
  const topbarDisplay = config.showTopBar ? "flex" : "none";
  const shadow = config.showGlow
    ? `0 0 24px color-mix(in srgb, ${config.accentColor} 14%, transparent)`
    : "none";
  const transition = config.animateCards
    ? "transform 180ms ease, background 180ms ease, border-color 180ms ease"
    : "none";

  return `.mdash-wrap {
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${config.backgroundColor};
  color: ${config.textColor};
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.mdash {
  width: min(100%, ${config.dashboardWidth}px);
  min-height: 760px;
  display: grid;
  grid-template-columns: ${sidebar};
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.cardRadius}px;
  overflow: hidden;
  font-size: ${config.fontSize}px;
  box-shadow: ${config.showGlow ? "0 28px 80px rgba(0,0,0,0.35)" : "none"};
}

.mdash__sidebar {
  background: ${config.sidebarColor};
  border-right: 1px solid ${config.borderColor};
  padding: 20px;
}

.mdash__brand {
  margin-bottom: 34px;
}

.mdash__brand strong {
  display: block;
  color: ${config.accentColor};
  font-size: 26px;
  line-height: 1;
  font-weight: 900;
}

.mdash__brand span,
.mdash__label,
.mdash__map-callout span {
  color: ${config.mutedTextColor};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.mdash__nav {
  display: grid;
  gap: 6px;
}

.mdash__nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 11px 12px;
  background: transparent;
  color: ${config.mutedTextColor};
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.mdash__nav-item--active {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
}

.mdash__nav-icon,
.mdash__symbol,
.mdash__actions span,
.mdash__globe {
  font-family: "Material Symbols Outlined", Inter, sans-serif;
}

.mdash__export {
  width: 100%;
  margin-top: 34px;
  border: 0;
  border-radius: 8px;
  padding: 12px 14px;
  background: ${config.accentColor};
  color: ${config.accentTextColor};
  font-weight: 900;
  cursor: pointer;
}

.mdash__main {
  min-width: 0;
}

.mdash__topbar {
  height: 64px;
  display: ${topbarDisplay};
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${config.borderColor};
  padding: 0 28px;
  background: ${config.surfaceColor};
}

.mdash__search {
  width: 260px;
  border: 1px solid ${config.borderColor};
  border-radius: 999px;
  padding: 8px 14px;
  color: ${config.mutedTextColor};
}

.mdash__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${config.mutedTextColor};
}

.mdash__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${config.accentColor}, ${config.tertiaryColor});
}

.mdash__content {
  padding: ${contentPadding}px;
  display: grid;
  gap: ${gap}px;
}

.mdash__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.mdash__header h2,
.mdash__card h3 {
  margin: 0;
  color: ${config.textColor};
}

.mdash__header h2 {
  font-size: 32px;
  line-height: 40px;
}

.mdash__header p {
  margin: 5px 0 0;
  color: ${config.mutedTextColor};
}

.mdash__range {
  display: flex;
  padding: 4px;
  background: ${config.surfaceColor};
  border: 1px solid ${config.borderColor};
  border-radius: 8px;
}

.mdash__range-btn {
  border: 0;
  border-radius: 6px;
  padding: 7px 13px;
  background: transparent;
  color: ${config.mutedTextColor};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.mdash__range-btn--active {
  background: ${config.cardHoverColor};
  color: ${config.accentColor};
}

.mdash__metrics,
.mdash__secondary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${gap}px;
}

.mdash__primary-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${gap}px;
}

.mdash__secondary-grid {
  grid-template-columns: 1fr 1fr;
}

.mdash__card {
  background: ${config.cardColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.cardRadius}px;
  padding: ${cardPadding}px;
  box-shadow: ${shadow};
  transition: ${transition};
}

.mdash__card:hover {
  background: ${config.cardHoverColor};
  transform: ${config.animateCards ? "translateY(-2px)" : "none"};
}

.mdash__metric-top,
.mdash__card-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.mdash__metric-top {
  margin-bottom: 22px;
}

.mdash__metric strong {
  display: block;
  margin-top: 6px;
  font-size: 26px;
  line-height: 1.1;
}

.mdash__symbol {
  color: ${config.accentColor};
}

.mdash__symbol--secondary,
.mdash__delta--up,
.mdash__map-callout b {
  color: ${config.secondaryColor};
}

.mdash__delta {
  color: ${config.mutedTextColor};
  font-size: 12px;
  font-weight: 900;
}

.mdash__card-head {
  align-items: center;
  margin-bottom: 28px;
}

.mdash__legend {
  display: flex;
  gap: 16px;
  color: ${config.mutedTextColor};
  font-size: 12px;
}

.mdash__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.mdash__dot--accent {
  background: ${config.accentColor};
}

.mdash__dot--tertiary {
  background: ${config.tertiaryColor};
}

.mdash__chart {
  display: block;
  width: 100%;
  height: 230px;
}

.mdash__chart-grid {
  stroke: ${config.chartGridColor};
  stroke-opacity: 0.55;
}

.mdash__area--accent {
  fill: ${config.accentColor};
  opacity: 0.15;
}

.mdash__area--tertiary {
  fill: ${config.tertiaryColor};
  opacity: 0.11;
}

.mdash__line {
  fill: none;
}

.mdash__line--accent {
  stroke: ${config.accentColor};
  stroke-width: 3px;
}

.mdash__line--tertiary {
  stroke: ${config.tertiaryColor};
  stroke-width: 2px;
  stroke-dasharray: 8 4;
}

.mdash__pulse {
  fill: ${config.accentColor};
  animation: ${config.animateCards ? "mdashPulse 1.6s ease-in-out infinite" : "none"};
}

.mdash__chart-text {
  fill: ${config.textColor};
  font-size: 12px;
  font-weight: 900;
}

.mdash__leaderboard h3,
.mdash__map-card h3,
.mdash__demo-card h3 {
  margin-bottom: 20px;
}

.mdash__performers {
  display: grid;
  gap: 18px;
}

.mdash__performer {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mdash__poster {
  flex: 0 0 auto;
  width: 48px;
  height: 70px;
  border: 1px solid ${config.borderColor};
  border-radius: 8px;
  background: ${config.surfaceColor};
}

.mdash__poster--accent {
  background: linear-gradient(145deg, color-mix(in srgb, ${config.accentColor} 35%, transparent), ${config.surfaceColor});
}

.mdash__poster--secondary {
  background: linear-gradient(145deg, color-mix(in srgb, ${config.secondaryColor} 35%, transparent), ${config.surfaceColor});
}

.mdash__poster--tertiary {
  background: linear-gradient(145deg, color-mix(in srgb, ${config.tertiaryColor} 35%, transparent), ${config.surfaceColor});
}

.mdash__performer-body {
  min-width: 0;
  flex: 1;
}

.mdash__performer-body strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mdash__performer-body span,
.mdash__rank {
  display: block;
  margin-top: 4px;
  color: ${config.mutedTextColor};
  font-size: 12px;
}

.mdash__score-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.mdash__score-track,
.mdash__bar-track {
  flex: 1;
  height: 5px;
  overflow: hidden;
  background: ${config.surfaceColor};
  border-radius: 999px;
}

.mdash__score,
.mdash__bar {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.mdash__score--accent,
.mdash__bar--accent {
  background: ${config.accentColor};
}

.mdash__score--secondary,
.mdash__bar--secondary {
  background: ${config.secondaryColor};
}

.mdash__score--tertiary {
  background: ${config.tertiaryColor};
}

.mdash__score-text {
  font-size: 12px;
}

.mdash__score-text--accent {
  color: ${config.accentColor};
}

.mdash__score-text--secondary {
  color: ${config.secondaryColor};
}

.mdash__score-text--tertiary {
  color: ${config.tertiaryColor};
}

.mdash__map {
  position: relative;
  min-height: 210px;
  overflow: hidden;
  border: 1px solid ${config.borderColor};
  border-radius: 10px;
  background: ${config.surfaceColor};
}

.mdash__globe {
  position: absolute;
  left: 50%;
  top: 50%;
  color: ${config.borderColor};
  font-size: 110px;
  transform: translate(-50%, -50%);
}

.mdash__marker {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.mdash__marker--la {
  left: 25%;
  top: 35%;
  background: ${config.accentColor};
  box-shadow: 0 0 0 10px color-mix(in srgb, ${config.accentColor} 20%, transparent);
}

.mdash__marker--london {
  left: 48%;
  top: 40%;
  width: 10px;
  height: 10px;
  background: ${config.secondaryColor};
  box-shadow: 0 0 0 10px color-mix(in srgb, ${config.secondaryColor} 20%, transparent);
}

.mdash__marker--tokyo {
  left: 75%;
  top: 55%;
  background: ${config.tertiaryColor};
  box-shadow: 0 0 0 10px color-mix(in srgb, ${config.tertiaryColor} 20%, transparent);
}

.mdash__map-callout {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 12px;
  border: 1px solid ${config.borderColor};
  border-radius: 8px;
  background: color-mix(in srgb, ${config.backgroundColor} 82%, transparent);
}

.mdash__map-callout strong {
  display: block;
  margin-top: 4px;
}

.mdash__demo {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  gap: 22px;
}

.mdash__donut {
  position: relative;
  width: 132px;
  height: 132px;
}

.mdash__donut svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.mdash__donut circle {
  fill: none;
  stroke-width: 3;
}

.mdash__donut-track {
  stroke: ${config.borderColor};
}

.mdash__donut-main {
  stroke: ${config.accentColor};
  stroke-dasharray: 65 100;
  stroke-linecap: round;
}

.mdash__donut-alt {
  stroke: ${config.tertiaryColor};
  stroke-dasharray: 25 100;
  stroke-dashoffset: -65;
  stroke-linecap: round;
}

.mdash__donut strong {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.mdash__bars {
  display: grid;
  gap: 14px;
}

.mdash__bar-item span {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.mdash__bar--muted {
  background: ${config.mutedTextColor};
}

@keyframes mdashPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.55;
    transform: scale(1.35);
  }
}

@media (max-width: 980px) {
  .mdash {
    grid-template-columns: 1fr;
  }

  .mdash__sidebar {
    display: none;
  }

  .mdash__metrics,
  .mdash__primary-grid,
  .mdash__secondary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .mdash-wrap {
    padding: 12px;
  }

  .mdash__topbar {
    padding: 0 16px;
  }

  .mdash__search {
    width: 180px;
  }

  .mdash__content {
    padding: 16px;
  }

  .mdash__header h2 {
    font-size: 25px;
    line-height: 32px;
  }

  .mdash__range {
    width: 100%;
  }

  .mdash__range-btn {
    flex: 1;
  }

  .mdash__demo {
    grid-template-columns: 1fr;
  }
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateMediaDashboardTSX(
  config: MediaDashboardConfig,
): string {
  const ranges = ["realtime", "day", "week"];
  const selectedIndex = Math.max(0, ranges.indexOf(config.selectedRange));

  return `import { useState } from "react";
import "./MediaDashboard.css";

interface RangeOption {
  label: string;
  value: string;
}

interface Metric {
  label: string;
  value: string;
  delta: string;
  icon: string;
}

interface Performer {
  title: string;
  views: string;
  score: number;
  tone: string;
}

interface MediaDashboardProps {
  onRangeChange?: (value: string) => void;
}

const navItems: string[] = ["Dashboard", "Streaming", "Content", "Audience", "Revenue"];
const rangeOptions: RangeOption[] = [
  { label: "Real-time", value: "realtime" },
  { label: "24 Hours", value: "day" },
  { label: "7 Days", value: "week" },
];

const metrics: Metric[] = [
  { label: "Global Viewers", value: "12.4M", delta: "+4.2%", icon: "visibility" },
  { label: "Content ROI", value: "18.2%", delta: "+18.2%", icon: "monetization_on" },
  { label: "Avg. Watch Time", value: "42m", delta: "Stable", icon: "schedule" },
  { label: "Active Streams", value: "1.2M", delta: "+12%", icon: "sensors" },
];

const performers: Performer[] = [
  { title: "Neo-Horizon: Echoes", views: "4.2M views", score: 92, tone: "secondary" },
  { title: "The Last Protocol", views: "2.8M views", score: 88, tone: "accent" },
  { title: "CyberPulse Live", views: "1.9M views", score: 76, tone: "tertiary" },
];

export default function MediaDashboard({ onRangeChange }: MediaDashboardProps): JSX.Element {
  const [range, setRange] = useState<string>(rangeOptions[${selectedIndex}].value);

  function handleRangeChange(value: string): void {
    setRange(value);
    onRangeChange?.(value);
  }

  return (
    <div className="mdash-wrap">
      <div className="mdash">
        ${
          config.showSidebar
            ? `<aside className="mdash__sidebar">
          <div className="mdash__brand">
            <strong>Luminous</strong>
            <span>Media & Ent.</span>
          </div>
          <nav className="mdash__nav" aria-label="Dashboard navigation">
            {navItems.map((item: string) => (
              <button key={item} className={item === "Content" ? "mdash__nav-item mdash__nav-item--active" : "mdash__nav-item"}>
                <span className="mdash__nav-icon" aria-hidden="true">{item === "Content" ? "movie" : item === "Revenue" ? "payments" : item.toLowerCase()}</span>
                {item}
              </button>
            ))}
          </nav>
          <button className="mdash__export">Export Reports</button>
        </aside>`
            : ""
        }

        <main className="mdash__main">
          ${
            config.showTopBar
              ? `<header className="mdash__topbar">
            <div className="mdash__search">Search analytics...</div>
            <div className="mdash__actions" aria-label="Account actions">
              <span>notifications</span>
              <span>settings</span>
              <span className="mdash__avatar" />
            </div>
          </header>`
              : ""
          }

          <section className="mdash__content">
            <div className="mdash__header">
              <div>
                <h2>Content Performance</h2>
                <p>Real-time engagement and distribution insights across global clusters.</p>
              </div>
              <div className="mdash__range" role="tablist" aria-label="Time range">
                {rangeOptions.map((option: RangeOption) => (
                  <button
                    key={option.value}
                    className={range === option.value ? "mdash__range-btn mdash__range-btn--active" : "mdash__range-btn"}
                    onClick={() => handleRangeChange(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mdash__metrics">
              {metrics.map((metric: Metric, index: number) => (
                <article key={metric.label} className="mdash__card mdash__metric">
                  <div className="mdash__metric-top">
                    <span className={index === 1 ? "mdash__symbol mdash__symbol--secondary" : "mdash__symbol"}>{metric.icon}</span>
                    <span className={metric.delta === "Stable" ? "mdash__delta" : "mdash__delta mdash__delta--up"}>{metric.delta}</span>
                  </div>
                  <span className="mdash__label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>

            <div className="mdash__primary-grid">
              <article className="mdash__card mdash__chart-card">
                <div className="mdash__card-head">
                  <h3>Live Viewership Trends</h3>
                  <div className="mdash__legend">
                    <span><b className="mdash__dot mdash__dot--accent" /> North America</span>
                    <span><b className="mdash__dot mdash__dot--tertiary" /> EMEA</span>
                  </div>
                </div>
                <svg className="mdash__chart" viewBox="0 0 800 230" role="img" aria-label="Live viewership trend chart">
                  {[40, 90, 140, 190].map((y: number) => <line key={y} x1="0" x2="800" y1={y} y2={y} className="mdash__chart-grid" />)}
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80 V230 H0 Z" className="mdash__area mdash__area--accent" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130 V230 H0 Z" className="mdash__area mdash__area--tertiary" />
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80" className="mdash__line mdash__line--accent" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130" className="mdash__line mdash__line--tertiary" />
                  <circle cx="600" cy="60" r="6" className="mdash__pulse" />
                  <text x="615" y="55" className="mdash__chart-text">8.4M LIVE</text>
                </svg>
              </article>

              <article className="mdash__card mdash__leaderboard">
                <h3>Top Performers</h3>
                <div className="mdash__performers">
                  {performers.map((item: Performer, index: number) => (
                    <div key={item.title} className="mdash__performer">
                      <div className={"mdash__poster mdash__poster--" + item.tone} />
                      <div className="mdash__performer-body">
                        <strong>{item.title}</strong>
                        <span>{item.views}</span>
                        <div className="mdash__score-row">
                          <div className="mdash__score-track"><div className={"mdash__score mdash__score--" + item.tone} style={{ width: item.score + "%" }} /></div>
                          <b className={"mdash__score-text mdash__score-text--" + item.tone}>{item.score}%</b>
                        </div>
                      </div>
                      <span className="mdash__rank">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="mdash__secondary-grid">
              <article className="mdash__card mdash__map-card">
                <h3>Global Streaming Density</h3>
                <div className="mdash__map">
                  <span className="mdash__globe">public</span>
                  <i className="mdash__marker mdash__marker--la" />
                  <i className="mdash__marker mdash__marker--london" />
                  <i className="mdash__marker mdash__marker--tokyo" />
                  <div className="mdash__map-callout">
                    <span>Peak Region</span>
                    <strong>APAC Cluster <b>+22%</b></strong>
                  </div>
                </div>
              </article>

              <article className="mdash__card mdash__demo-card">
                <h3>Audience Demographics</h3>
                <div className="mdash__demo">
                  <div className="mdash__donut">
                    <svg viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" className="mdash__donut-track" />
                      <circle cx="18" cy="18" r="16" className="mdash__donut-main" />
                      <circle cx="18" cy="18" r="16" className="mdash__donut-alt" />
                    </svg>
                    <strong>18-34</strong>
                  </div>
                  <div className="mdash__bars">
                    {([
                      ["Mobile App", 68, "accent"],
                      ["Smart TV", 24, "secondary"],
                      ["Desktop", 8, "muted"],
                    ] as [string, number, string][]).map(([label, value, tone]) => (
                      <div key={label} className="mdash__bar-item">
                        <span>{label}<b>{value}%</b></span>
                        <div className="mdash__bar-track"><i className={"mdash__bar mdash__bar--" + tone} style={{ width: value + "%" }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateMediaDashboardTailwind(
  config: MediaDashboardConfig,
): string {
  const ranges = ["realtime", "day", "week"];
  const selectedIndex = Math.max(0, ranges.indexOf(config.selectedRange));

  const compact = config.density === "compact";
  const gap = compact ? 14 : 24;
  const contentPadding = compact ? 20 : 28;
  const cardPadding = compact
    ? Math.max(14, config.cardPadding - 8)
    : config.cardPadding;
  const sidebarCols = config.showSidebar
    ? "grid-cols-[220px_1fr]"
    : "grid-cols-1";
  const shadow = config.showGlow ? "0 28px 80px rgba(0,0,0,0.35)" : "none";
  const cardShadow = config.showGlow
    ? `0 0 24px color-mix(in srgb, ${config.accentColor} 14%, transparent)`
    : "none";

  // Baked font sizes
  const fs = config.fontSize;
  const fsBrand = 26;
  const fsMeta = 11;
  const fsH2 = 32;
  const fsH2Mobile = 25;
  const fsH3 = 16;
  const fsDelta = 12;
  const fsLegend = 12;
  const fsRangeBtn = 12;
  const fsPerformerMeta = 12;
  const fsScoreText = 12;
  const fsBarMeta = 12;
  const fsMetricValue = 26;
  const fsChartText = 12;
  const fsDonutLabel = 20;

  return `import { useState, CSSProperties } from "react";

interface RangeOption {
  label: string;
  value: string;
}

interface Metric {
  label: string;
  value: string;
  delta: string;
  icon: string;
}

interface Performer {
  title: string;
  views: string;
  score: number;
  tone: string;
}

interface MediaDashboardProps {
  onRangeChange?: (value: string) => void;
}

// Baked-in CSS variable tokens — update these to reskin the MediaDashboard
const mdashVars: CSSProperties = {
  "--mdash-bg":             "${config.backgroundColor}",
  "--mdash-text":           "${config.textColor}",
  "--mdash-muted":          "${config.mutedTextColor}",
  "--mdash-border":         "${config.borderColor}",
  "--mdash-radius":         "${config.cardRadius}px",
  "--mdash-surface":        "${config.surfaceColor}",
  "--mdash-sidebar":        "${config.sidebarColor}",
  "--mdash-card":           "${config.cardColor}",
  "--mdash-card-hover":     "${config.cardHoverColor}",
  "--mdash-accent":         "${config.accentColor}",
  "--mdash-accent-text":    "${config.accentTextColor}",
  "--mdash-secondary":      "${config.secondaryColor}",
  "--mdash-tertiary":       "${config.tertiaryColor}",
  "--mdash-chart-grid":     "${config.chartGridColor}",
  "--mdash-width":          "${config.dashboardWidth}px",
  "--mdash-card-padding":   "${cardPadding}px",
  "--mdash-gap":            "${gap}px",
  "--mdash-content-pad":    "${contentPadding}px",
  "--mdash-shadow":         "${shadow}",
  "--mdash-card-shadow":    "${cardShadow}",
} as CSSProperties;

const navItems: string[] = ["Dashboard", "Streaming", "Content", "Audience", "Revenue"];
const rangeOptions: RangeOption[] = [
  { label: "Real-time", value: "realtime" },
  { label: "24 Hours", value: "day" },
  { label: "7 Days", value: "week" },
];

const metrics: Metric[] = [
  { label: "Global Viewers", value: "12.4M", delta: "+4.2%", icon: "visibility" },
  { label: "Content ROI", value: "18.2%", delta: "+18.2%", icon: "monetization_on" },
  { label: "Avg. Watch Time", value: "42m", delta: "Stable", icon: "schedule" },
  { label: "Active Streams", value: "1.2M", delta: "+12%", icon: "sensors" },
];

const performers: Performer[] = [
  { title: "Neo-Horizon: Echoes", views: "4.2M views", score: 92, tone: "secondary" },
  { title: "The Last Protocol", views: "2.8M views", score: 88, tone: "accent" },
  { title: "CyberPulse Live", views: "1.9M views", score: 76, tone: "tertiary" },
];

export default function MediaDashboard({ onRangeChange }: MediaDashboardProps): JSX.Element {
  const [range, setRange] = useState<string>(rangeOptions[${selectedIndex}].value);

  function handleRangeChange(value: string): void {
    setRange(value);
    onRangeChange?.(value);
  }

  return (
    <div
      className="w-full grid place-items-center p-6 bg-[var(--mdash-bg)] text-[var(--mdash-text)] font-sans text-[${fs}px]"
      style={mdashVars}
    >
      ${
        config.animateCards
          ? `<style>{\`
        @keyframes mdashPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.35); }
        }
      \`}</style>`
          : ""
      }
      <div
        className="w-full min-h-[760px] grid ${sidebarCols} bg-[var(--mdash-bg)] border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] overflow-hidden"
        style={{ maxWidth: "var(--mdash-width)", boxShadow: "var(--mdash-shadow)" }}
      >
        ${
          config.showSidebar
            ? `<aside className="bg-[var(--mdash-sidebar)] border-r border-[var(--mdash-border)] p-5">
          <div className="mb-[34px]">
            <strong className="block text-[var(--mdash-accent)] text-[${fsBrand}px] leading-none font-black">Luminous</strong>
            <span className="text-[var(--mdash-muted)] text-[${fsMeta}px] uppercase tracking-[0.08em]">Media & Ent.</span>
          </div>
          <nav className="grid gap-[6px]" aria-label="Dashboard navigation">
            {navItems.map((item: string) => (
              <button
                key={item}
                className={item === "Content"
                  ? "flex items-center gap-[10px] w-full border-0 rounded-lg px-3 py-[11px] bg-[var(--mdash-accent)] text-[var(--mdash-accent-text)] font-semibold text-left cursor-pointer font-[inherit]"
                  : "flex items-center gap-[10px] w-full border-0 rounded-lg px-3 py-[11px] bg-transparent text-[var(--mdash-muted)] font-semibold text-left cursor-pointer font-[inherit]"}
              >
                <span className="font-['Material_Symbols_Outlined',sans-serif]" aria-hidden="true">
                  {item === "Content" ? "movie" : item === "Revenue" ? "payments" : item.toLowerCase()}
                </span>
                {item}
              </button>
            ))}
          </nav>
          <button className="w-full mt-[34px] border-0 rounded-lg px-[14px] py-3 bg-[var(--mdash-accent)] text-[var(--mdash-accent-text)] font-black cursor-pointer">
            Export Reports
          </button>
        </aside>`
            : ""
        }

        <main className="min-w-0">
          ${
            config.showTopBar
              ? `<header className="h-16 flex items-center justify-between border-b border-[var(--mdash-border)] px-7 bg-[var(--mdash-surface)]">
            <div className="w-[260px] border border-[var(--mdash-border)] rounded-full px-[14px] py-2 text-[var(--mdash-muted)]">
              Search analytics...
            </div>
            <div className="flex items-center gap-[14px] text-[var(--mdash-muted)]" aria-label="Account actions">
              <span className="font-['Material_Symbols_Outlined',sans-serif]">notifications</span>
              <span className="font-['Material_Symbols_Outlined',sans-serif]">settings</span>
              <span
                className="w-[34px] h-[34px] rounded-full shrink-0"
                style={{ background: \`linear-gradient(135deg, var(--mdash-accent), var(--mdash-tertiary))\` }}
              />
            </div>
          </header>`
              : ""
          }

          <section
            className="grid"
            style={{ padding: "var(--mdash-content-pad)", gap: "var(--mdash-gap)" }}
          >
            {/* Header */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="m-0 text-[var(--mdash-text)] text-[${fsH2}px] leading-10">Content Performance</h2>
                <p className="mt-[5px] mb-0 text-[var(--mdash-muted)]">
                  Real-time engagement and distribution insights across global clusters.
                </p>
              </div>
              <div
                className="flex p-1 bg-[var(--mdash-surface)] border border-[var(--mdash-border)] rounded-lg"
                role="tablist"
                aria-label="Time range"
              >
                {rangeOptions.map((option: RangeOption) => (
                  <button
                    key={option.value}
                    className={range === option.value
                      ? "border-0 rounded-md px-[13px] py-[7px] bg-[var(--mdash-card-hover)] text-[var(--mdash-accent)] text-[${fsRangeBtn}px] font-extrabold cursor-pointer"
                      : "border-0 rounded-md px-[13px] py-[7px] bg-transparent text-[var(--mdash-muted)] text-[${fsRangeBtn}px] font-extrabold cursor-pointer"}
                    onClick={() => handleRangeChange(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-[var(--mdash-gap)]">
              {metrics.map((metric: Metric, index: number) => (
                <article
                  key={metric.label}
                  className="${config.animateCards ? "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)] hover:bg-[var(--mdash-card-hover)] hover:-translate-y-0.5 transition-[transform,background] duration-[180ms]" : "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)]"}"
                  style={{ padding: "var(--mdash-card-padding)", boxShadow: "var(--mdash-card-shadow)" }}
                >
                  <div className="flex justify-between gap-4 mb-[22px]">
                    <span className={index === 1
                      ? "font-['Material_Symbols_Outlined',sans-serif] text-[var(--mdash-secondary)]"
                      : "font-['Material_Symbols_Outlined',sans-serif] text-[var(--mdash-accent)]"}>
                      {metric.icon}
                    </span>
                    <span className={metric.delta === "Stable"
                      ? "text-[var(--mdash-muted)] text-[${fsDelta}px] font-black"
                      : "text-[var(--mdash-secondary)] text-[${fsDelta}px] font-black"}>
                      {metric.delta}
                    </span>
                  </div>
                  <span className="text-[var(--mdash-muted)] text-[${fsMeta}px] uppercase tracking-[0.08em]">{metric.label}</span>
                  <strong className="block mt-[6px] text-[${fsMetricValue}px] leading-[1.1]">{metric.value}</strong>
                </article>
              ))}
            </div>

            {/* Primary Grid */}
            <div className="grid grid-cols-[2fr_1fr] gap-[var(--mdash-gap)]">
              {/* Chart Card */}
              <article
                className="${config.animateCards ? "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)] hover:bg-[var(--mdash-card-hover)] hover:-translate-y-0.5 transition-[transform,background] duration-[180ms]" : "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)]"}"
                style={{ padding: "var(--mdash-card-padding)", boxShadow: "var(--mdash-card-shadow)" }}
              >
                <div className="flex items-center justify-between gap-4 mb-7">
                  <h3 className="m-0 text-[var(--mdash-text)] text-[${fsH3}px]">Live Viewership Trends</h3>
                  <div className="flex gap-4 text-[var(--mdash-muted)] text-[${fsLegend}px]">
                    <span>
                      <b className="inline-block w-2 h-2 rounded-full mr-[5px] bg-[var(--mdash-accent)]" />
                      North America
                    </span>
                    <span>
                      <b className="inline-block w-2 h-2 rounded-full mr-[5px] bg-[var(--mdash-tertiary)]" />
                      EMEA
                    </span>
                  </div>
                </div>
                <svg className="block w-full h-[230px]" viewBox="0 0 800 230" role="img" aria-label="Live viewership trend chart">
                  {[40, 90, 140, 190].map((y: number) => (
                    <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="var(--mdash-chart-grid)" strokeOpacity="0.55" />
                  ))}
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80 V230 H0 Z" fill="var(--mdash-accent)" opacity="0.15" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130 V230 H0 Z" fill="var(--mdash-tertiary)" opacity="0.11" />
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,80" fill="none" stroke="var(--mdash-accent)" strokeWidth="3" />
                  <path d="M0,200 Q150,180 300,150 T500,170 T700,110 T800,130" fill="none" stroke="var(--mdash-tertiary)" strokeWidth="2" strokeDasharray="8 4" />
                  <circle
                    cx="600" cy="60" r="6"
                    fill="var(--mdash-accent)"
                    style={{ animation: "${config.animateCards ? "mdashPulse 1.6s ease-in-out infinite" : "none"}" }}
                  />
                  <text x="615" y="55" fill="var(--mdash-text)" fontSize="${fsChartText}" fontWeight="900">8.4M LIVE</text>
                </svg>
              </article>

              {/* Leaderboard Card */}
              <article
                className="${config.animateCards ? "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)] hover:bg-[var(--mdash-card-hover)] hover:-translate-y-0.5 transition-[transform,background] duration-[180ms]" : "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)]"}"
                style={{ padding: "var(--mdash-card-padding)", boxShadow: "var(--mdash-card-shadow)" }}
              >
                <h3 className="m-0 mb-5 text-[var(--mdash-text)] text-[${fsH3}px]">Top Performers</h3>
                <div className="grid gap-[18px]">
                  {performers.map((item: Performer, index: number) => {
                    let posterCls = "shrink-0 w-12 h-[70px] border border-[var(--mdash-border)] rounded-lg";
                    if (item.tone === "accent") posterCls += " bg-gradient-to-br from-[color-mix(in_srgb,var(--mdash-accent)_35%,transparent)] to-[var(--mdash-surface)]";
                    else if (item.tone === "secondary") posterCls += " bg-gradient-to-br from-[color-mix(in_srgb,var(--mdash-secondary)_35%,transparent)] to-[var(--mdash-surface)]";
                    else posterCls += " bg-gradient-to-br from-[color-mix(in_srgb,var(--mdash-tertiary)_35%,transparent)] to-[var(--mdash-surface)]";

                    let scoreBarCls = "block h-full rounded-[inherit]";
                    if (item.tone === "accent") scoreBarCls += " bg-[var(--mdash-accent)]";
                    else if (item.tone === "secondary") scoreBarCls += " bg-[var(--mdash-secondary)]";
                    else scoreBarCls += " bg-[var(--mdash-tertiary)]";

                    let scoreTextCls = "text-[${fsScoreText}px] font-bold";
                    if (item.tone === "accent") scoreTextCls += " text-[var(--mdash-accent)]";
                    else if (item.tone === "secondary") scoreTextCls += " text-[var(--mdash-secondary)]";
                    else scoreTextCls += " text-[var(--mdash-tertiary)]";

                    return (
                      <div key={item.title} className="flex items-center gap-[14px]">
                        <div className={posterCls} />
                        <div className="min-w-0 flex-1">
                          <strong className="block overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</strong>
                          <span className="block mt-1 text-[var(--mdash-muted)] text-[${fsPerformerMeta}px]">{item.views}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-[5px] overflow-hidden bg-[var(--mdash-surface)] rounded-full">
                              <div className={scoreBarCls} style={{ width: item.score + "%" }} />
                            </div>
                            <b className={scoreTextCls}>{item.score}%</b>
                          </div>
                        </div>
                        <span className="block mt-1 text-[var(--mdash-muted)] text-[${fsPerformerMeta}px]">#{index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-2 gap-[var(--mdash-gap)]">
              {/* Map Card */}
              <article
                className="${config.animateCards ? "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)] hover:bg-[var(--mdash-card-hover)] hover:-translate-y-0.5 transition-[transform,background] duration-[180ms]" : "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)]"}"
                style={{ padding: "var(--mdash-card-padding)", boxShadow: "var(--mdash-card-shadow)" }}
              >
                <h3 className="m-0 mb-5 text-[var(--mdash-text)] text-[${fsH3}px]">Global Streaming Density</h3>
                <div className="relative min-h-[210px] overflow-hidden border border-[var(--mdash-border)] rounded-[10px] bg-[var(--mdash-surface)]">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Material_Symbols_Outlined',sans-serif] text-[110px] text-[var(--mdash-border)]">
                    public
                  </span>
                  {/* LA marker */}
                  <i className="absolute left-[25%] top-[35%] w-3 h-3 rounded-full not-italic bg-[var(--mdash-accent)]"
                    style={{ boxShadow: "0 0 0 10px color-mix(in srgb, var(--mdash-accent) 20%, transparent)" }} />
                  {/* London marker */}
                  <i className="absolute left-[48%] top-[40%] w-[10px] h-[10px] rounded-full not-italic bg-[var(--mdash-secondary)]"
                    style={{ boxShadow: "0 0 0 10px color-mix(in srgb, var(--mdash-secondary) 20%, transparent)" }} />
                  {/* Tokyo marker */}
                  <i className="absolute left-[75%] top-[55%] w-3 h-3 rounded-full not-italic bg-[var(--mdash-tertiary)]"
                    style={{ boxShadow: "0 0 0 10px color-mix(in srgb, var(--mdash-tertiary) 20%, transparent)" }} />
                  <div
                    className="absolute left-[14px] bottom-[14px] p-3 border border-[var(--mdash-border)] rounded-lg"
                    style={{ background: "color-mix(in srgb, var(--mdash-bg) 82%, transparent)" }}
                  >
                    <span className="text-[var(--mdash-muted)] text-[${fsMeta}px] uppercase tracking-[0.08em]">Peak Region</span>
                    <strong className="block mt-1">
                      APAC Cluster <b className="text-[var(--mdash-secondary)]">+22%</b>
                    </strong>
                  </div>
                </div>
              </article>

              {/* Demographics Card */}
              <article
                className="${config.animateCards ? "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)] hover:bg-[var(--mdash-card-hover)] hover:-translate-y-0.5 transition-[transform,background] duration-[180ms]" : "border border-[var(--mdash-border)] rounded-[var(--mdash-radius)] bg-[var(--mdash-card)]"}"
                style={{ padding: "var(--mdash-card-padding)", boxShadow: "var(--mdash-card-shadow)" }}
              >
                <h3 className="m-0 mb-5 text-[var(--mdash-text)] text-[${fsH3}px]">Audience Demographics</h3>
                <div className="grid grid-cols-[160px_1fr] items-center gap-[22px]">
                  <div className="relative w-[132px] h-[132px]">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="var(--mdash-border)" />
                      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="var(--mdash-accent)" strokeDasharray="65 100" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="var(--mdash-tertiary)" strokeDasharray="25 100" strokeDashoffset="-65" strokeLinecap="round" />
                    </svg>
                    <strong className="absolute inset-0 grid place-items-center text-[${fsDonutLabel}px]">18-34</strong>
                  </div>
                  <div className="grid gap-[14px]">
                    {([
                      ["Mobile App", 68, "accent"],
                      ["Smart TV", 24, "secondary"],
                      ["Desktop", 8, "muted"],
                    ] as [string, number, string][]).map(([label, value, tone]) => {
                      let barCls = "block h-full rounded-[inherit]";
                      if (tone === "accent") barCls += " bg-[var(--mdash-accent)]";
                      else if (tone === "secondary") barCls += " bg-[var(--mdash-secondary)]";
                      else barCls += " bg-[var(--mdash-muted)]";
                      return (
                        <div key={label}>
                          <span className="flex justify-between mb-[6px] text-[${fsBarMeta}px]">
                            {label}<b>{value}%</b>
                          </span>
                          <div className="flex-1 h-[5px] overflow-hidden bg-[var(--mdash-surface)] rounded-full">
                            <i className={"not-italic " + barCls} style={{ display: "block", width: value + "%" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
`;
}
