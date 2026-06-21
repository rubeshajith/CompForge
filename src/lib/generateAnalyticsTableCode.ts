// /lib/generateAnalyticsTableCode.ts

import { AnalyticsTableConfig } from "./analyticsTableConfig";

export function generateAnalyticsTableJSX(
  config: AnalyticsTableConfig,
): string {
  const c = config;

  return `import { useState, useMemo } from "react";
import "./AnalyticsTable.css";

const CUSTOMERS = [
  {
    id: "c1", name: "Nexus Global", domain: "nexus-enterprise.com",
    initials: "NG", avatarColor: "#7c6cfc", status: "active",
    mrr: 12450, churnRisk: 2, activeUsers: 1240,
    healthData: [60, 80, 50, 90, 100, 85],
    plan: "Enterprise Unlimited", owner: "Sarah Jenkins", renewal: "Dec 12, 2024",
    chartData: [40, 60, 80, 50, 70, 100, 65],
    note: "Top performer this quarter. Usage trending upward since feature launch in Sep.",
  },
  {
    id: "c2", name: "Aetheric Labs", domain: "aetheric.io",
    initials: "AL", avatarColor: "#facc15", status: "pending",
    mrr: 4200, churnRisk: 18, activeUsers: 450,
    healthData: [30, 25, 40, 20, 35, 50],
    plan: "Growth", owner: "Marcus Zhao", renewal: "Jan 5, 2025",
    chartData: [70, 60, 50, 45, 40, 38, 35],
    note: "Usage declining since Oct. Follow-up call scheduled with CSM.",
  },
  {
    id: "c3", name: "Vanguard Security", domain: "vanguard.tech",
    initials: "VS", avatarColor: "#f87171", status: "at-risk",
    mrr: 28900, churnRisk: 62, activeUsers: 8200,
    healthData: [100, 80, 40, 20, 10, 5],
    plan: "Enterprise Pro", owner: "Priya Mehta", renewal: "Nov 30, 2024",
    chartData: [95, 85, 70, 50, 30, 15, 8],
    note: "Critical churn risk. High activity drop post-incident. Exec outreach needed.",
  },
  {
    id: "c4", name: "Orbit Systems", domain: "orbitsys.co",
    initials: "OS", avatarColor: "#4ade80", status: "active",
    mrr: 7800, churnRisk: 5, activeUsers: 920,
    healthData: [55, 65, 70, 80, 88, 92],
    plan: "Business", owner: "Lena Fischer", renewal: "Feb 14, 2025",
    chartData: [45, 50, 62, 70, 78, 88, 95],
    note: "Strong upward trend. Potential upsell to Enterprise next quarter.",
  },
];

function getRiskColor(risk) {
  if (risk < 20) return "${c.riskLowColor}";
  if (risk < 50) return "${c.riskMedColor}";
  return "${c.riskHighColor}";
}

function getSparklineColor(status) {
  if (status === "active")  return "${c.sparklineColorHealthy}";
  if (status === "pending") return "${c.sparklineColorDeclining}";
  return "${c.sparklineColorAtRisk}";
}

function Sparkline({ data, color }) {
  return (
    <div className="at__sparkline">
      {data.map((v, i) => (
        <div key={i} className="at__spark-bar" style={{ height: \`\${v}%\`, background: color, opacity: 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  );
}

function ExpandedChart({ data, barColor, barHighlight, bg }) {
  const maxIdx = data.indexOf(Math.max(...data));
  return (
    <div className="at__chart" style={{ background: bg }}>
      <div className="at__chart-bars">
        {data.map((v, i) => (
          <div key={i} className="at__chart-bar"
            style={{ height: \`\${v}%\`, background: i === maxIdx ? barHighlight : barColor }} />
        ))}
      </div>
      <div className="at__chart-labels">
        {["W1","W2","W3","W4","W5","W6","W7"].map(w => (
          <span key={w} className="at__chart-label" style={{ color: barColor }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsTable({ onRowSelect }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = ${c.rowsPerPage};

  const totalPages = Math.ceil(CUSTOMERS.length / rowsPerPage);
  const pageRows = CUSTOMERS.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function toggleExpand(id) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id) {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (onRowSelect) onRowSelect([...next]);
      return next;
    });
  }

  const statusLabel = { active: "ACTIVE", pending: "PENDING", "at-risk": "AT RISK" };
  const accentBorderByStatus = {
    active: "${c.expandedBorderAccentColor}",
    pending: "${c.pendingTextColor}",
    "at-risk": "${c.atRiskTextColor}",
  };

  return (
    <div className="at-wrap">
      <div className="at">
        <table className="at__table">
          <thead>
            <tr className="at__header-row">
              <th className="at__th at__th--cb">
                <input type="checkbox"
                  checked={selectedRows.size === pageRows.length && pageRows.length > 0}
                  onChange={() => {
                    if (selectedRows.size === pageRows.length) setSelectedRows(new Set());
                    else setSelectedRows(new Set(pageRows.map(r => r.id)));
                  }}
                />
              </th>
              <th className="at__th">Customer Name</th>
              <th className="at__th">Status</th>
              <th className="at__th at__th--right">MRR</th>
              <th className="at__th at__th--right">Churn Risk</th>
              <th className="at__th at__th--center">Active Users</th>
              <th className="at__th">Health (30d)</th>
              <th className="at__th at__th--w40"></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              const isExpanded = expandedRows.has(row.id);
              const isSelected = selectedRows.has(row.id);
              const riskColor = getRiskColor(row.churnRisk);
              const accentBorder = accentBorderByStatus[row.status];
              return [
                <tr
                  key={row.id}
                  className={\`at__row \${isSelected ? "at__row--selected" : ""}\`}
                  onClick={() => toggleExpand(row.id)}
                >
                  <td className="at__td at__td--cb" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} />
                  </td>
                  <td className="at__td">
                    <div className="at__customer">
                      <div className="at__avatar" style={{ background: \`\${row.avatarColor}22\`, border: \`1px solid \${row.avatarColor}44\`, color: row.avatarColor }}>
                        {row.initials}
                      </div>
                      <div>
                        <div className="at__name">{row.name}</div>
                        <div className="at__domain">{row.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="at__td">
                    <span className={\`at__badge at__badge--\${row.status.replace("-","")}\`}>{statusLabel[row.status]}</span>
                  </td>
                  <td className="at__td at__td--right at__mrr">\${row.mrr.toLocaleString()}</td>
                  <td className="at__td at__td--right">
                    <div className="at__risk-cell">
                      <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                      <div className="at__risk-track">
                        <div className="at__risk-fill" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                      </div>
                    </div>
                  </td>
                  <td className="at__td at__td--center at__users">{row.activeUsers.toLocaleString()}</td>
                  <td className="at__td">
                    <Sparkline data={row.healthData} color={getSparklineColor(row.status)} />
                  </td>
                  <td className="at__td at__td--center">
                    <span className={\`at__chevron \${isExpanded ? "at__chevron--open" : ""}\`}>▾</span>
                  </td>
                </tr>,
                isExpanded && (
                  <tr key={\`\${row.id}-exp\`} className="at__expanded-row">
                    <td colSpan={8} className="at__expanded-cell">
                      <div className="at__expanded-inner" style={{ borderLeftColor: accentBorder }}>
                        <div className="at__expanded-left">
                          <div className="at__expanded-title">Usage Activity — Last 7 Weeks</div>
                          <ExpandedChart
                            data={row.chartData}
                            barColor="${c.expandedChartBarColor}"
                            barHighlight="${c.expandedChartBarHighlight}"
                            bg="${c.expandedChartBackground}"
                          />
                          <div className="at__note" style={{ borderColor: \`\${accentBorder}30\`, background: \`\${accentBorder}10\` }}>
                            <span style={{ color: accentBorder, fontWeight: 700, marginRight: 6 }}>Note:</span>
                            {row.note}
                          </div>
                        </div>
                        <div className="at__expanded-right">
                          <div className="at__expanded-title">Account Details</div>
                          <div className="at__meta">
                            {[
                              { label: "Plan", value: row.plan },
                              { label: "Owner", value: row.owner },
                              { label: "Renewal", value: row.renewal },
                              { label: "MRR", value: \`\$\${row.mrr.toLocaleString()}\` },
                              { label: "Active Users", value: row.activeUsers.toLocaleString() },
                            ].map((item, i, arr) => (
                              <div key={item.label} className="at__meta-row" style={{ borderBottomWidth: i < arr.length - 1 ? "1px" : "0" }}>
                                <span className="at__meta-label">{item.label}</span>
                                <span className="at__meta-value">{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="at__risk-expanded">
                            <div className="at__risk-expanded-header">
                              <span>Churn Risk</span>
                              <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                            </div>
                            <div className="at__risk-track">
                              <div className="at__risk-fill" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                            </div>
                          </div>
                          <button className="at__cta">View Full Profile →</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ),
              ].filter(Boolean);
            })}
          </tbody>
        </table>
      </div>
      <div className="at__pagination">
        <span className="at__pagination-info">
          Showing <strong>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, CUSTOMERS.length)}</strong> of {CUSTOMERS.length} customers
        </span>
        <div className="at__pages">
          <button className="at__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button key={i+1} className={\`at__page-btn \${currentPage === i+1 ? "at__page-btn--active" : ""}\`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
          ))}
          <button className="at__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>›</button>
        </div>
      </div>
    </div>
  );
}`;
}

export function generateAnalyticsTableCSS(
  config: AnalyticsTableConfig,
): string {
  const c = config;
  const r = `${c.borderRadius}px`;
  const tr = `${c.tableBorderRadius}px`;
  const fs = `${c.fontSize}px`;

  return `/* AnalyticsTable.css */

.at-wrap {
  font-family: 'Instrument Sans', 'DM Sans', system-ui, sans-serif;
  font-size: ${fs};
  width: 100%;
}

/* ── Container ── */
.at {
  background: ${c.tableBackground};
  border: 1px solid ${c.tableBorderColor};
  border-radius: ${tr};
  overflow: hidden;
  ${c.showShadow ? `box-shadow: 0 8px 48px rgba(0,0,0,0.5);` : ""}
  overflow-x: auto;
}

.at__table {
  width: 100%;
  border-collapse: collapse;
}

/* ── Header ── */
.at__header-row {
  background: ${c.headerBackground};
  border-bottom: 1px solid ${c.headerBorderColor};
}
.at__th {
  padding: 10px 14px;
  color: ${c.headerTextColor};
  font-size: ${c.fontSize - 1}px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
  white-space: nowrap;
}
.at__th--right  { text-align: right; }
.at__th--center { text-align: center; }
.at__th--cb     { width: 44px; text-align: center; }
.at__th--w40    { width: 40px; }

/* ── Rows ── */
.at__row {
  background: ${c.rowBackground};
  border-bottom: 1px solid ${c.rowBorderColor};
  cursor: pointer;
  transition: background 0.12s ease;
}
.at__row:hover        { background: ${c.rowHoverBackground}; }
.at__row--selected    { background: ${c.rowSelectedBackground}; }

.at__td {
  padding: 13px 14px;
  color: ${c.rowTextColor};
  font-size: ${fs};
  vertical-align: middle;
}
.at__td--right  { text-align: right; }
.at__td--center { text-align: center; }
.at__td--cb     { width: 44px; text-align: center; }

/* ── Customer cell ── */
.at__customer {
  display: flex;
  align-items: center;
  gap: 10px;
}
.at__avatar {
  width: 34px;
  height: 34px;
  border-radius: ${c.avatarRadius}%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${c.fontSize - 1}px;
  flex-shrink: 0;
}
.at__name   { font-weight: 600; color: ${c.rowTextColor}; }
.at__domain { font-size: ${c.fontSize - 1}px; color: ${c.rowSubtextColor}; margin-top: 1px; }
.at__mrr    { font-weight: 600; }
.at__users  { color: ${c.rowSubtextColor}; }

/* ── Status Badges ── */
.at__badge {
  padding: 3px 8px;
  border-radius: ${Math.max(2, c.borderRadius - 2)}px;
  font-size: ${c.fontSize - 2}px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid transparent;
}
.at__badge--active   { background: ${c.activeBackground};  color: ${c.activeTextColor};  border-color: ${c.activeBorderColor}; }
.at__badge--pending  { background: ${c.pendingBackground}; color: ${c.pendingTextColor}; border-color: ${c.pendingBorderColor}; }
.at__badge--atrisk   { background: ${c.atRiskBackground};  color: ${c.atRiskTextColor};  border-color: ${c.atRiskBorderColor}; }

/* ── Churn Risk ── */
.at__risk-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.at__risk-track {
  width: 48px;
  height: 5px;
  background: ${c.riskBarTrackColor};
  border-radius: 99px;
  overflow: hidden;
}
.at__risk-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s ease;
}

/* ── Sparkline ── */
.at__sparkline {
  height: 32px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 80px;
}
.at__spark-bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
}

/* ── Chevron ── */
.at__chevron {
  color: ${c.rowSubtextColor};
  font-size: 16px;
  display: inline-block;
  transition: transform 0.2s ease;
}
.at__chevron--open { transform: rotate(180deg); }

/* ── Expanded Row ── */
.at__expanded-row { background: ${c.expandedBackground}; }
.at__expanded-cell { padding: 0; }

.at__expanded-inner {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 24px;
  padding: 20px 20px 20px 22px;
  border-left: 3px solid ${c.expandedBorderAccentColor};
  ${c.animateExpand ? "animation: atExpand 0.2s ease;" : ""}
}

.at__expanded-left  { display: flex; flex-direction: column; gap: 12px; }
.at__expanded-right { display: flex; flex-direction: column; gap: 12px; }

.at__expanded-title {
  font-weight: 600;
  color: ${c.rowTextColor};
  font-size: ${c.fontSize + 1}px;
}

/* ── Chart ── */
.at__chart {
  border-radius: ${r};
  padding: 16px;
  height: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${c.expandedChartBarColor}33;
}
.at__chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.at__chart-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}
.at__chart-labels {
  display: flex;
  justify-content: space-between;
}
.at__chart-label {
  flex: 1;
  text-align: center;
  font-size: 10px;
  opacity: 0.6;
}

/* ── Note ── */
.at__note {
  padding: 10px 12px;
  border: 1px solid;
  border-radius: ${r};
  font-size: ${c.fontSize - 1}px;
  color: ${c.rowSubtextColor};
  line-height: 1.6;
}

/* ── Metadata ── */
.at__meta {
  background: ${c.expandedMetaBackground};
  border: 1px solid ${c.expandedMetaBorderColor};
  border-radius: ${r};
  overflow: hidden;
}
.at__meta-row {
  display: flex;
  justify-content: space-between;
  padding: 9px 12px;
  border-bottom: 1px solid ${c.expandedMetaBorderColor};
  font-size: ${c.fontSize - 1}px;
}
.at__meta-label { color: ${c.expandedMetaLabelColor}; }
.at__meta-value { font-weight: 600; color: ${c.expandedMetaValueColor}; }

/* ── Risk in expanded ── */
.at__risk-expanded { display: flex; flex-direction: column; gap: 6px; }
.at__risk-expanded-header {
  display: flex;
  justify-content: space-between;
  font-size: ${c.fontSize - 1}px;
  color: ${c.rowSubtextColor};
}
.at__risk-expanded .at__risk-track { width: 100%; height: 6px; }

/* ── CTA ── */
.at__cta {
  background: ${c.ctaBackground};
  color: ${c.ctaTextColor};
  border: none;
  border-radius: ${r};
  padding: 9px 0;
  font-weight: 700;
  font-size: ${fs};
  cursor: pointer;
  width: 100%;
  font-family: inherit;
  letter-spacing: 0.03em;
  transition: opacity 0.15s ease;
}
.at__cta:hover { opacity: 0.85; }

/* ── Pagination ── */
.at__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: ${c.paginationBackground};
  border: 1px solid ${c.paginationBorderColor};
  border-top: none;
  border-radius: 0 0 ${tr} ${tr};
}
.at__pagination-info { font-size: ${c.fontSize - 1}px; color: ${c.paginationTextColor}; }
.at__pagination-info strong { color: ${c.rowTextColor}; }
.at__pages { display: flex; gap: 4px; align-items: center; }
.at__page-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid ${c.paginationBorderColor};
  border-radius: ${Math.max(2, c.borderRadius - 2)}px;
  background: transparent;
  color: ${c.paginationTextColor};
  font-size: ${c.fontSize - 1}px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s ease;
}
.at__page-btn:hover { border-color: ${c.accentColor}; color: ${c.accentColor}; }
.at__page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.at__page-btn--active {
  background: ${c.paginationActiveBackground};
  color: ${c.paginationActiveTextColor};
  border-color: ${c.paginationActiveBackground};
  font-weight: 700;
}

/* ── Animation ── */
@keyframes atExpand {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateAnalyticsTableTSX(
  config: AnalyticsTableConfig,
): string {
  const c = config;

  return `import { useState } from "react";
import "./AnalyticsTable.css";

interface Customer {
  id: string;
  name: string;
  domain: string;
  initials: string;
  avatarColor: string;
  status: "active" | "pending" | "at-risk";
  mrr: number;
  churnRisk: number;
  activeUsers: number;
  healthData: number[];
  plan: string;
  owner: string;
  renewal: string;
  chartData: number[];
  note: string;
}

interface AnalyticsTableProps {
  onRowSelect?: (selected: string[]) => void;
}

interface SparklineProps {
  data: number[];
  color: string;
}

interface ExpandedChartProps {
  data: number[];
  barColor: string;
  barHighlight: string;
  bg: string;
}

const CUSTOMERS: Customer[] = [
  {
    id: "c1", name: "Nexus Global", domain: "nexus-enterprise.com",
    initials: "NG", avatarColor: "#7c6cfc", status: "active",
    mrr: 12450, churnRisk: 2, activeUsers: 1240,
    healthData: [60, 80, 50, 90, 100, 85],
    plan: "Enterprise Unlimited", owner: "Sarah Jenkins", renewal: "Dec 12, 2024",
    chartData: [40, 60, 80, 50, 70, 100, 65],
    note: "Top performer this quarter. Usage trending upward since feature launch in Sep.",
  },
  {
    id: "c2", name: "Aetheric Labs", domain: "aetheric.io",
    initials: "AL", avatarColor: "#facc15", status: "pending",
    mrr: 4200, churnRisk: 18, activeUsers: 450,
    healthData: [30, 25, 40, 20, 35, 50],
    plan: "Growth", owner: "Marcus Zhao", renewal: "Jan 5, 2025",
    chartData: [70, 60, 50, 45, 40, 38, 35],
    note: "Usage declining since Oct. Follow-up call scheduled with CSM.",
  },
  {
    id: "c3", name: "Vanguard Security", domain: "vanguard.tech",
    initials: "VS", avatarColor: "#f87171", status: "at-risk",
    mrr: 28900, churnRisk: 62, activeUsers: 8200,
    healthData: [100, 80, 40, 20, 10, 5],
    plan: "Enterprise Pro", owner: "Priya Mehta", renewal: "Nov 30, 2024",
    chartData: [95, 85, 70, 50, 30, 15, 8],
    note: "Critical churn risk. High activity drop post-incident. Exec outreach needed.",
  },
  {
    id: "c4", name: "Orbit Systems", domain: "orbitsys.co",
    initials: "OS", avatarColor: "#4ade80", status: "active",
    mrr: 7800, churnRisk: 5, activeUsers: 920,
    healthData: [55, 65, 70, 80, 88, 92],
    plan: "Business", owner: "Lena Fischer", renewal: "Feb 14, 2025",
    chartData: [45, 50, 62, 70, 78, 88, 95],
    note: "Strong upward trend. Potential upsell to Enterprise next quarter.",
  },
];

function getRiskColor(risk: number): string {
  if (risk < 20) return "${c.riskLowColor}";
  if (risk < 50) return "${c.riskMedColor}";
  return "${c.riskHighColor}";
}

function getSparklineColor(status: string): string {
  if (status === "active")  return "${c.sparklineColorHealthy}";
  if (status === "pending") return "${c.sparklineColorDeclining}";
  return "${c.sparklineColorAtRisk}";
}

function Sparkline({ data, color }: SparklineProps) {
  return (
    <div className="at__sparkline">
      {data.map((v, i) => (
        <div key={i} className="at__spark-bar" style={{ height: \`\${v}%\`, background: color, opacity: 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  );
}

function ExpandedChart({ data, barColor, barHighlight, bg }: ExpandedChartProps) {
  const maxIdx = data.indexOf(Math.max(...data));
  return (
    <div className="at__chart" style={{ background: bg }}>
      <div className="at__chart-bars">
        {data.map((v, i) => (
          <div key={i} className="at__chart-bar"
            style={{ height: \`\${v}%\`, background: i === maxIdx ? barHighlight : barColor }} />
        ))}
      </div>
      <div className="at__chart-labels">
        {["W1","W2","W3","W4","W5","W6","W7"].map(w => (
          <span key={w} className="at__chart-label" style={{ color: barColor }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsTable({ onRowSelect }: AnalyticsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = ${c.rowsPerPage};

  const totalPages = Math.ceil(CUSTOMERS.length / rowsPerPage);
  const pageRows = CUSTOMERS.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function toggleExpand(id: string): void {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id: string): void {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (onRowSelect) onRowSelect([...next]);
      return next;
    });
  }

  const statusLabel: Record<string, string> = { active: "ACTIVE", pending: "PENDING", "at-risk": "AT RISK" };
  const accentBorderByStatus: Record<string, string> = {
    active: "${c.expandedBorderAccentColor}",
    pending: "${c.pendingTextColor}",
    "at-risk": "${c.atRiskTextColor}",
  };

  return (
    <div className="at-wrap">
      <div className="at">
        <table className="at__table">
          <thead>
            <tr className="at__header-row">
              <th className="at__th at__th--cb">
                <input type="checkbox"
                  checked={selectedRows.size === pageRows.length && pageRows.length > 0}
                  onChange={() => {
                    if (selectedRows.size === pageRows.length) setSelectedRows(new Set());
                    else setSelectedRows(new Set(pageRows.map(r => r.id)));
                  }}
                />
              </th>
              <th className="at__th">Customer Name</th>
              <th className="at__th">Status</th>
              <th className="at__th at__th--right">MRR</th>
              <th className="at__th at__th--right">Churn Risk</th>
              <th className="at__th at__th--center">Active Users</th>
              <th className="at__th">Health (30d)</th>
              <th className="at__th at__th--w40"></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              const isExpanded = expandedRows.has(row.id);
              const isSelected = selectedRows.has(row.id);
              const riskColor = getRiskColor(row.churnRisk);
              const accentBorder = accentBorderByStatus[row.status];
              return [
                <tr
                  key={row.id}
                  className={\`at__row \${isSelected ? "at__row--selected" : ""}\`}
                  onClick={() => toggleExpand(row.id)}
                >
                  <td className="at__td at__td--cb" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} />
                  </td>
                  <td className="at__td">
                    <div className="at__customer">
                      <div className="at__avatar" style={{ background: \`\${row.avatarColor}22\`, border: \`1px solid \${row.avatarColor}44\`, color: row.avatarColor }}>
                        {row.initials}
                      </div>
                      <div>
                        <div className="at__name">{row.name}</div>
                        <div className="at__domain">{row.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="at__td">
                    <span className={\`at__badge at__badge--\${row.status.replace("-","")}\`}>{statusLabel[row.status]}</span>
                  </td>
                  <td className="at__td at__td--right at__mrr">\${row.mrr.toLocaleString()}</td>
                  <td className="at__td at__td--right">
                    <div className="at__risk-cell">
                      <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                      <div className="at__risk-track">
                        <div className="at__risk-fill" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                      </div>
                    </div>
                  </td>
                  <td className="at__td at__td--center at__users">{row.activeUsers.toLocaleString()}</td>
                  <td className="at__td">
                    <Sparkline data={row.healthData} color={getSparklineColor(row.status)} />
                  </td>
                  <td className="at__td at__td--center">
                    <span className={\`at__chevron \${isExpanded ? "at__chevron--open" : ""}\`}>▾</span>
                  </td>
                </tr>,
                isExpanded && (
                  <tr key={\`\${row.id}-exp\`} className="at__expanded-row">
                    <td colSpan={8} className="at__expanded-cell">
                      <div className="at__expanded-inner" style={{ borderLeftColor: accentBorder }}>
                        <div className="at__expanded-left">
                          <div className="at__expanded-title">Usage Activity — Last 7 Weeks</div>
                          <ExpandedChart
                            data={row.chartData}
                            barColor="${c.expandedChartBarColor}"
                            barHighlight="${c.expandedChartBarHighlight}"
                            bg="${c.expandedChartBackground}"
                          />
                          <div className="at__note" style={{ borderColor: \`\${accentBorder}30\`, background: \`\${accentBorder}10\` }}>
                            <span style={{ color: accentBorder, fontWeight: 700, marginRight: 6 }}>Note:</span>
                            {row.note}
                          </div>
                        </div>
                        <div className="at__expanded-right">
                          <div className="at__expanded-title">Account Details</div>
                          <div className="at__meta">
                            {[
                              { label: "Plan", value: row.plan },
                              { label: "Owner", value: row.owner },
                              { label: "Renewal", value: row.renewal },
                              { label: "MRR", value: \`\$\${row.mrr.toLocaleString()}\` },
                              { label: "Active Users", value: row.activeUsers.toLocaleString() },
                            ].map((item, i, arr) => (
                              <div key={item.label} className="at__meta-row" style={{ borderBottomWidth: i < arr.length - 1 ? "1px" : "0" }}>
                                <span className="at__meta-label">{item.label}</span>
                                <span className="at__meta-value">{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="at__risk-expanded">
                            <div className="at__risk-expanded-header">
                              <span>Churn Risk</span>
                              <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                            </div>
                            <div className="at__risk-track">
                              <div className="at__risk-fill" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                            </div>
                          </div>
                          <button className="at__cta">View Full Profile →</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ),
              ].filter(Boolean);
            })}
          </tbody>
        </table>
      </div>
      <div className="at__pagination">
        <span className="at__pagination-info">
          Showing <strong>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, CUSTOMERS.length)}</strong> of {CUSTOMERS.length} customers
        </span>
        <div className="at__pages">
          <button className="at__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button key={i+1} className={\`at__page-btn \${currentPage === i+1 ? "at__page-btn--active" : ""}\`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
          ))}
          <button className="at__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>›</button>
        </div>
      </div>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateAnalyticsTableTailwind(
  config: AnalyticsTableConfig,
): string {
  const c = config;

  // Pre-compute complex values outside the returned string
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";

  // Baked font sizes (never in CSS vars)
  const fsBase = c.fontSize;
  const fsSub = c.fontSize - 1;
  const fsBadge = c.fontSize - 2;
  const fsTitle = c.fontSize + 1;

  // Badge radius baked
  const badgeRadius = Math.max(2, c.borderRadius - 2);
  const pageBtnRadius = Math.max(2, c.borderRadius - 2);

  return `import { useState, CSSProperties } from "react";

interface Customer {
  id: string;
  name: string;
  domain: string;
  initials: string;
  avatarColor: string;
  status: "active" | "pending" | "at-risk";
  mrr: number;
  churnRisk: number;
  activeUsers: number;
  healthData: number[];
  plan: string;
  owner: string;
  renewal: string;
  chartData: number[];
  note: string;
}

interface AnalyticsTableProps {
  onRowSelect?: (selected: string[]) => void;
}

interface SparklineProps {
  data: number[];
  color: string;
}

interface ExpandedChartProps {
  data: number[];
  barColor: string;
  barHighlight: string;
  bg: string;
}

// Baked-in CSS variable tokens — update these to reskin the AnalyticsTable
const atVars: CSSProperties = {
  "--at-table-bg":                   "${c.tableBackground}",
  "--at-table-border":               "${c.tableBorderColor}",
  "--at-table-radius":               "${c.tableBorderRadius}px",
  "--at-header-bg":                  "${c.headerBackground}",
  "--at-header-border":              "${c.headerBorderColor}",
  "--at-header-text":                "${c.headerTextColor}",
  "--at-row-bg":                     "${c.rowBackground}",
  "--at-row-border":                 "${c.rowBorderColor}",
  "--at-row-hover-bg":               "${c.rowHoverBackground}",
  "--at-row-selected-bg":            "${c.rowSelectedBackground}",
  "--at-row-text":                   "${c.rowTextColor}",
  "--at-row-subtext":                "${c.rowSubtextColor}",
  "--at-avatar-radius":              "${c.avatarRadius}%",
  "--at-radius":                     "${c.borderRadius}px",
  "--at-badge-radius":               "${badgeRadius}px",
  "--at-active-bg":                  "${c.activeBackground}",
  "--at-active-text":                "${c.activeTextColor}",
  "--at-active-border":              "${c.activeBorderColor}",
  "--at-pending-bg":                 "${c.pendingBackground}",
  "--at-pending-text":               "${c.pendingTextColor}",
  "--at-pending-border":             "${c.pendingBorderColor}",
  "--at-atrisk-bg":                  "${c.atRiskBackground}",
  "--at-atrisk-text":                "${c.atRiskTextColor}",
  "--at-atrisk-border":              "${c.atRiskBorderColor}",
  "--at-risk-low":                   "${c.riskLowColor}",
  "--at-risk-med":                   "${c.riskMedColor}",
  "--at-risk-high":                  "${c.riskHighColor}",
  "--at-risk-track":                 "${c.riskBarTrackColor}",
  "--at-sparkline-healthy":          "${c.sparklineColorHealthy}",
  "--at-sparkline-declining":        "${c.sparklineColorDeclining}",
  "--at-sparkline-atrisk":           "${c.sparklineColorAtRisk}",
  "--at-expanded-bg":                "${c.expandedBackground}",
  "--at-expanded-accent":            "${c.expandedBorderAccentColor}",
  "--at-chart-bar":                  "${c.expandedChartBarColor}",
  "--at-chart-highlight":            "${c.expandedChartBarHighlight}",
  "--at-chart-bg":                   "${c.expandedChartBackground}",
  "--at-meta-bg":                    "${c.expandedMetaBackground}",
  "--at-meta-border":                "${c.expandedMetaBorderColor}",
  "--at-meta-label":                 "${c.expandedMetaLabelColor}",
  "--at-meta-value":                 "${c.expandedMetaValueColor}",
  "--at-cta-bg":                     "${c.ctaBackground}",
  "--at-cta-text":                   "${c.ctaTextColor}",
  "--at-pagination-bg":              "${c.paginationBackground}",
  "--at-pagination-border":          "${c.paginationBorderColor}",
  "--at-pagination-text":            "${c.paginationTextColor}",
  "--at-pagination-active-bg":       "${c.paginationActiveBackground}",
  "--at-pagination-active-text":     "${c.paginationActiveTextColor}",
  "--at-accent":                     "${c.accentColor}",
  "--at-accent-text":                "${c.accentTextColor}",
  "--at-page-btn-radius":            "${pageBtnRadius}px",
} as CSSProperties;

const CUSTOMERS: Customer[] = [
  {
    id: "c1", name: "Nexus Global", domain: "nexus-enterprise.com",
    initials: "NG", avatarColor: "#7c6cfc", status: "active",
    mrr: 12450, churnRisk: 2, activeUsers: 1240,
    healthData: [60, 80, 50, 90, 100, 85],
    plan: "Enterprise Unlimited", owner: "Sarah Jenkins", renewal: "Dec 12, 2024",
    chartData: [40, 60, 80, 50, 70, 100, 65],
    note: "Top performer this quarter. Usage trending upward since feature launch in Sep.",
  },
  {
    id: "c2", name: "Aetheric Labs", domain: "aetheric.io",
    initials: "AL", avatarColor: "#facc15", status: "pending",
    mrr: 4200, churnRisk: 18, activeUsers: 450,
    healthData: [30, 25, 40, 20, 35, 50],
    plan: "Growth", owner: "Marcus Zhao", renewal: "Jan 5, 2025",
    chartData: [70, 60, 50, 45, 40, 38, 35],
    note: "Usage declining since Oct. Follow-up call scheduled with CSM.",
  },
  {
    id: "c3", name: "Vanguard Security", domain: "vanguard.tech",
    initials: "VS", avatarColor: "#f87171", status: "at-risk",
    mrr: 28900, churnRisk: 62, activeUsers: 8200,
    healthData: [100, 80, 40, 20, 10, 5],
    plan: "Enterprise Pro", owner: "Priya Mehta", renewal: "Nov 30, 2024",
    chartData: [95, 85, 70, 50, 30, 15, 8],
    note: "Critical churn risk. High activity drop post-incident. Exec outreach needed.",
  },
  {
    id: "c4", name: "Orbit Systems", domain: "orbitsys.co",
    initials: "OS", avatarColor: "#4ade80", status: "active",
    mrr: 7800, churnRisk: 5, activeUsers: 920,
    healthData: [55, 65, 70, 80, 88, 92],
    plan: "Business", owner: "Lena Fischer", renewal: "Feb 14, 2025",
    chartData: [45, 50, 62, 70, 78, 88, 95],
    note: "Strong upward trend. Potential upsell to Enterprise next quarter.",
  },
];

function getRiskColor(risk: number): string {
  if (risk < 20) return "var(--at-risk-low)";
  if (risk < 50) return "var(--at-risk-med)";
  return "var(--at-risk-high)";
}

function getSparklineColor(status: string): string {
  if (status === "active")  return "var(--at-sparkline-healthy)";
  if (status === "pending") return "var(--at-sparkline-declining)";
  return "var(--at-sparkline-atrisk)";
}

function Sparkline({ data, color }: SparklineProps) {
  return (
    <div className="flex items-end gap-[2px] h-8 w-20">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: \`\${v}%\`, background: color, opacity: 0.4 + (i / data.length) * 0.6 }}
        />
      ))}
    </div>
  );
}

function ExpandedChart({ data, barColor, barHighlight, bg }: ExpandedChartProps) {
  const maxIdx = data.indexOf(Math.max(...data));
  return (
    <div
      className={\`rounded-[var(--at-radius)] p-4 h-40 flex flex-col gap-2 border border-[\${c.expandedChartBarColor}33]\`}
      style={{ background: bg }}
    >
      <div className="flex-1 flex items-end gap-[6px]">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[4px] transition-[height] duration-300"
            style={{ height: \`\${v}%\`, background: i === maxIdx ? barHighlight : barColor }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {["W1","W2","W3","W4","W5","W6","W7"].map(w => (
          <span key={w} className="flex-1 text-center text-[10px] opacity-60" style={{ color: barColor }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsTable({ onRowSelect }: AnalyticsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = ${c.rowsPerPage};

  const totalPages = Math.ceil(CUSTOMERS.length / rowsPerPage);
  const pageRows = CUSTOMERS.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function toggleExpand(id: string): void {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id: string): void {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (onRowSelect) onRowSelect([...next]);
      return next;
    });
  }

  const statusLabel: Record<string, string> = { active: "ACTIVE", pending: "PENDING", "at-risk": "AT RISK" };
  const accentBorderByStatus: Record<string, string> = {
    active: "var(--at-expanded-accent)",
    pending: "var(--at-pending-text)",
    "at-risk": "var(--at-atrisk-text)",
  };

  return (
    <div className="font-[inherit] text-[${fsBase}px] w-full" style={atVars}>
      ${
        c.animateExpand
          ? `<style>{\`
        @keyframes atExpand {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      \`}</style>`
          : ""
      }
      <div
        className="bg-[var(--at-table-bg)] border border-[var(--at-table-border)] rounded-[var(--at-table-radius)] overflow-hidden overflow-x-auto"
        style={{ boxShadow: "${shadow}" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--at-header-bg)] border-b border-[var(--at-header-border)]">
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-left whitespace-nowrap w-11 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.size === pageRows.length && pageRows.length > 0}
                  onChange={() => {
                    if (selectedRows.size === pageRows.length) setSelectedRows(new Set());
                    else setSelectedRows(new Set(pageRows.map(r => r.id)));
                  }}
                />
              </th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-left whitespace-nowrap">Customer Name</th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-left whitespace-nowrap">Status</th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-right whitespace-nowrap">MRR</th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-right whitespace-nowrap">Churn Risk</th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-center whitespace-nowrap">Active Users</th>
              <th className="p-[10px_14px] text-[var(--at-header-text)] text-[${fsSub}px] font-bold tracking-[0.06em] uppercase text-left whitespace-nowrap">Health (30d)</th>
              <th className="p-[10px_14px] w-10"></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              const isExpanded = expandedRows.has(row.id);
              const isSelected = selectedRows.has(row.id);
              const riskColor = getRiskColor(row.churnRisk);
              const accentBorder = accentBorderByStatus[row.status];

              let rowCls = "border-b border-[var(--at-row-border)] cursor-pointer transition-colors duration-[120ms]";
              if (isSelected) {
                rowCls += " bg-[var(--at-row-selected-bg)]";
              } else {
                rowCls += " bg-[var(--at-row-bg)] hover:bg-[var(--at-row-hover-bg)]";
              }

              // Badge classes by status
              let badgeCls = "px-2 py-[3px] rounded-[var(--at-badge-radius)] text-[${fsBadge}px] font-bold tracking-[0.06em] border border-transparent";
              if (row.status === "active") {
                badgeCls += " bg-[var(--at-active-bg)] text-[var(--at-active-text)] border-[var(--at-active-border)]";
              } else if (row.status === "pending") {
                badgeCls += " bg-[var(--at-pending-bg)] text-[var(--at-pending-text)] border-[var(--at-pending-border)]";
              } else {
                badgeCls += " bg-[var(--at-atrisk-bg)] text-[var(--at-atrisk-text)] border-[var(--at-atrisk-border)]";
              }

              return [
                <tr key={row.id} className={rowCls} onClick={() => toggleExpand(row.id)}>
                  <td className="p-[13px_14px] align-middle w-11 text-center" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} />
                  </td>
                  <td className="p-[13px_14px] text-[var(--at-row-text)] text-[${fsBase}px] align-middle">
                    <div className="flex items-center gap-[10px]">
                      <div
                        className="w-[34px] h-[34px] rounded-[var(--at-avatar-radius)] flex items-center justify-center font-bold text-[${fsSub}px] shrink-0"
                        style={{ background: \`\${row.avatarColor}22\`, border: \`1px solid \${row.avatarColor}44\`, color: row.avatarColor }}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--at-row-text)]">{row.name}</div>
                        <div className="text-[${fsSub}px] text-[var(--at-row-subtext)] mt-[1px]">{row.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-[13px_14px] text-[var(--at-row-text)] text-[${fsBase}px] align-middle">
                    <span className={badgeCls}>{statusLabel[row.status]}</span>
                  </td>
                  <td className="p-[13px_14px] text-[var(--at-row-text)] text-[${fsBase}px] align-middle text-right font-semibold">\${row.mrr.toLocaleString()}</td>
                  <td className="p-[13px_14px] text-[var(--at-row-text)] text-[${fsBase}px] align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                      <div className="w-12 h-[5px] bg-[var(--at-risk-track)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-[width] duration-300" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-[13px_14px] text-[var(--at-row-subtext)] text-[${fsBase}px] align-middle text-center">{row.activeUsers.toLocaleString()}</td>
                  <td className="p-[13px_14px] text-[var(--at-row-text)] text-[${fsBase}px] align-middle">
                    <Sparkline data={row.healthData} color={getSparklineColor(row.status)} />
                  </td>
                  <td className="p-[13px_14px] align-middle text-center">
                    <span
                      className={\`text-[var(--at-row-subtext)] text-base inline-block transition-transform duration-200 \${isExpanded ? "rotate-180" : ""}\`}
                    >▾</span>
                  </td>
                </tr>,
                isExpanded && (
                  <tr key={\`\${row.id}-exp\`} className="bg-[var(--at-expanded-bg)]">
                    <td colSpan={8} className="p-0">
                      <div
                        className="grid gap-6 p-5 pl-[22px] border-l-[3px] ${c.animateExpand ? "[animation:atExpand_0.2s_ease]" : ""}"
                        style={{ gridTemplateColumns: "1fr 260px", borderLeftColor: accentBorder }}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="font-semibold text-[var(--at-row-text)] text-[${fsTitle}px]">Usage Activity — Last 7 Weeks</div>
                          <ExpandedChart
                            data={row.chartData}
                            barColor="var(--at-chart-bar)"
                            barHighlight="var(--at-chart-highlight)"
                            bg="var(--at-chart-bg)"
                          />
                          <div
                            className="p-[10px_12px] border rounded-[var(--at-radius)] text-[${fsSub}px] text-[var(--at-row-subtext)] leading-relaxed"
                            style={{ borderColor: \`\${accentBorder}30\`, background: \`\${accentBorder}10\` }}
                          >
                            <span style={{ color: accentBorder, fontWeight: 700, marginRight: 6 }}>Note:</span>
                            {row.note}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="font-semibold text-[var(--at-row-text)] text-[${fsTitle}px]">Account Details</div>
                          <div className="bg-[var(--at-meta-bg)] border border-[var(--at-meta-border)] rounded-[var(--at-radius)] overflow-hidden">
                            {[
                              { label: "Plan", value: row.plan },
                              { label: "Owner", value: row.owner },
                              { label: "Renewal", value: row.renewal },
                              { label: "MRR", value: \`\$\${row.mrr.toLocaleString()}\` },
                              { label: "Active Users", value: row.activeUsers.toLocaleString() },
                            ].map((item, i, arr) => (
                              <div
                                key={item.label}
                                className="flex justify-between p-[9px_12px] text-[${fsSub}px]"
                                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--at-meta-border)" : "none" }}
                              >
                                <span className="text-[var(--at-meta-label)]">{item.label}</span>
                                <span className="font-semibold text-[var(--at-meta-value)]">{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col gap-[6px]">
                            <div className="flex justify-between text-[${fsSub}px] text-[var(--at-row-subtext)]">
                              <span>Churn Risk</span>
                              <span style={{ color: riskColor, fontWeight: 700 }}>{row.churnRisk}%</span>
                            </div>
                            <div className="w-full h-[6px] bg-[var(--at-risk-track)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-[width] duration-300" style={{ width: \`\${row.churnRisk}%\`, background: riskColor }} />
                            </div>
                          </div>
                          <button
                            className="bg-[var(--at-cta-bg)] text-[var(--at-cta-text)] border-none rounded-[var(--at-radius)] py-[9px] font-bold text-[${fsBase}px] cursor-pointer w-full tracking-[0.03em] transition-opacity duration-150 hover:opacity-85"
                          >
                            View Full Profile →
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ),
              ].filter(Boolean);
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-[10px_16px] bg-[var(--at-pagination-bg)] border border-[var(--at-pagination-border)] border-t-0 rounded-b-[var(--at-table-radius)]">
        <span className="text-[${fsSub}px] text-[var(--at-pagination-text)]">
          Showing{" "}
          <strong className="text-[var(--at-row-text)]">
            {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, CUSTOMERS.length)}
          </strong>{" "}
          of {CUSTOMERS.length} customers
        </span>
        <div className="flex gap-1 items-center">
          <button
            className="w-7 h-7 flex items-center justify-center border border-[var(--at-pagination-border)] rounded-[var(--at-page-btn-radius)] bg-transparent text-[var(--at-pagination-text)] text-[${fsSub}px] cursor-pointer transition-all duration-[120ms] hover:border-[var(--at-accent)] hover:text-[var(--at-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let btnCls = "w-7 h-7 flex items-center justify-center border rounded-[var(--at-page-btn-radius)] text-[${fsSub}px] cursor-pointer transition-all duration-[120ms]";
            if (currentPage === i + 1) {
              btnCls += " bg-[var(--at-pagination-active-bg)] text-[var(--at-pagination-active-text)] border-[var(--at-pagination-active-bg)] font-bold";
            } else {
              btnCls += " bg-transparent text-[var(--at-pagination-text)] border-[var(--at-pagination-border)] hover:border-[var(--at-accent)] hover:text-[var(--at-accent)]";
            }
            return (
              <button key={i+1} className={btnCls} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
            );
          })}
          <button
            className="w-7 h-7 flex items-center justify-center border border-[var(--at-pagination-border)] rounded-[var(--at-page-btn-radius)] bg-transparent text-[var(--at-pagination-text)] text-[${fsSub}px] cursor-pointer transition-all duration-[120ms] hover:border-[var(--at-accent)] hover:text-[var(--at-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >›</button>
        </div>
      </div>
    </div>
  );
}`;
}
