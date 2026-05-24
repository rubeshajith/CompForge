"use client";

// /components/playground/AnalyticsTablePreview.tsx

import { useState, useMemo } from "react";
import { AnalyticsTableConfig } from "@/lib/analyticsTableConfig";

interface AnalyticsTablePreviewProps {
  config: AnalyticsTableConfig;
}

type CustomerStatus = "active" | "pending" | "at-risk";

interface Customer {
  id: string;
  name: string;
  domain: string;
  initials: string;
  avatarColor: string;
  status: CustomerStatus;
  mrr: number;
  churnRisk: number; // 0–100
  activeUsers: number;
  healthData: number[]; // 6 values, 0–100
  plan: string;
  owner: string;
  renewal: string;
  chartData: number[]; // 7 values for expanded chart, 0–100
  note: string;
}

const CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Nexus Global",
    domain: "nexus-enterprise.com",
    initials: "NG",
    avatarColor: "#7c6cfc",
    status: "active",
    mrr: 12450,
    churnRisk: 2,
    activeUsers: 1240,
    healthData: [60, 80, 50, 90, 100, 85],
    plan: "Enterprise Unlimited",
    owner: "Sarah Jenkins",
    renewal: "Dec 12, 2024",
    chartData: [40, 60, 80, 50, 70, 100, 65],
    note: "Top performer this quarter. Usage trending upward since feature launch in Sep.",
  },
  {
    id: "c2",
    name: "Aetheric Labs",
    domain: "aetheric.io",
    initials: "AL",
    avatarColor: "#facc15",
    status: "pending",
    mrr: 4200,
    churnRisk: 18,
    activeUsers: 450,
    healthData: [30, 25, 40, 20, 35, 50],
    plan: "Growth",
    owner: "Marcus Zhao",
    renewal: "Jan 5, 2025",
    chartData: [70, 60, 50, 45, 40, 38, 35],
    note: "Usage declining since Oct. Follow-up call scheduled with CSM.",
  },
  {
    id: "c3",
    name: "Vanguard Security",
    domain: "vanguard.tech",
    initials: "VS",
    avatarColor: "#f87171",
    status: "at-risk",
    mrr: 28900,
    churnRisk: 62,
    activeUsers: 8200,
    healthData: [100, 80, 40, 20, 10, 5],
    plan: "Enterprise Pro",
    owner: "Priya Mehta",
    renewal: "Nov 30, 2024",
    chartData: [95, 85, 70, 50, 30, 15, 8],
    note: "Critical churn risk. High activity drop post-incident. Exec outreach needed.",
  },
  {
    id: "c4",
    name: "Orbit Systems",
    domain: "orbitsys.co",
    initials: "OS",
    avatarColor: "#4ade80",
    status: "active",
    mrr: 7800,
    churnRisk: 5,
    activeUsers: 920,
    healthData: [55, 65, 70, 80, 88, 92],
    plan: "Business",
    owner: "Lena Fischer",
    renewal: "Feb 14, 2025",
    chartData: [45, 50, 62, 70, 78, 88, 95],
    note: "Strong upward trend. Potential upsell to Enterprise next quarter.",
  },
  {
    id: "c5",
    name: "Helix Data",
    domain: "helixdata.ai",
    initials: "HD",
    avatarColor: "#fb923c",
    status: "pending",
    mrr: 9600,
    churnRisk: 31,
    activeUsers: 1100,
    healthData: [80, 75, 60, 55, 50, 48],
    plan: "Growth Plus",
    owner: "Tom Reyes",
    renewal: "Mar 2, 2025",
    chartData: [82, 78, 70, 62, 55, 50, 47],
    note: "Onboarding stalled. Training sessions incomplete — 3 of 8 modules done.",
  },
  {
    id: "c6",
    name: "Stellar Works",
    domain: "stellarworks.io",
    initials: "SW",
    avatarColor: "#38bdf8",
    status: "active",
    mrr: 21300,
    churnRisk: 8,
    activeUsers: 3400,
    healthData: [70, 72, 75, 80, 82, 90],
    plan: "Enterprise Unlimited",
    owner: "Amara Osei",
    renewal: "Apr 18, 2025",
    chartData: [60, 65, 70, 75, 80, 86, 92],
    note: "Healthy account. Expanded team by 400 users this month.",
  },
  {
    id: "c7",
    name: "Phantom Analytics",
    domain: "phantom.ly",
    initials: "PA",
    avatarColor: "#c084fc",
    status: "at-risk",
    mrr: 5100,
    churnRisk: 74,
    activeUsers: 310,
    healthData: [90, 60, 35, 20, 12, 6],
    plan: "Starter Pro",
    owner: "Unassigned",
    renewal: "Oct 31, 2024",
    chartData: [88, 72, 50, 32, 20, 12, 5],
    note: "Renewal due this month. No CSM assigned. Immediate action required.",
  },
  {
    id: "c8",
    name: "Ironclad Finance",
    domain: "ironclad.finance",
    initials: "IF",
    avatarColor: "#34d399",
    status: "active",
    mrr: 44000,
    churnRisk: 3,
    activeUsers: 6800,
    healthData: [85, 88, 90, 92, 95, 98],
    plan: "Enterprise Unlimited",
    owner: "Chris Wattson",
    renewal: "Jun 1, 2025",
    chartData: [80, 83, 86, 89, 93, 96, 99],
    note: "Top-tier account. Nominated for case study partnership.",
  },
];

function getRiskColor(risk: number, config: AnalyticsTableConfig) {
  if (risk < 20) return config.riskLowColor;
  if (risk < 50) return config.riskMedColor;
  return config.riskHighColor;
}

function getSparklineColor(
  status: CustomerStatus,
  config: AnalyticsTableConfig,
) {
  if (status === "active") return config.sparklineColorHealthy;
  if (status === "pending") return config.sparklineColorDeclining;
  return config.sparklineColorAtRisk;
}

// Mini sparkline bar chart
function Sparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <div
      style={{
        height: "32px",
        display: "flex",
        alignItems: "flex-end",
        gap: "2px",
        width: "80px",
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${v}%`,
            background: color,
            borderRadius: "2px 2px 0 0",
            opacity: 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

// Expanded chart — larger version
function ExpandedChart({
  data,
  barColor,
  barHighlight,
  bg,
}: {
  data: number[];
  barColor: string;
  barHighlight: string;
  bg: string;
}) {
  const maxIdx = data.indexOf(Math.max(...data));
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${barColor}33`,
        borderRadius: "8px",
        padding: "16px",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "6px" }}
      >
        {data.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${v}%`,
              background: i === maxIdx ? barHighlight : barColor,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: barColor,
          opacity: 0.6,
        }}
      >
        {["W1", "W2", "W3", "W4", "W5", "W6", "W7"].map((w) => (
          <span key={w} style={{ flex: 1, textAlign: "center" }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsTablePreview({ config }: AnalyticsTablePreviewProps) {
  const c = config;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const rpp = c.rowsPerPage;
  const totalPages = Math.ceil(CUSTOMERS.length / rpp);
  const pageRows = CUSTOMERS.slice((currentPage - 1) * rpp, currentPage * rpp);

  function toggleExpand(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const statusBadgeStyle = (status: CustomerStatus): React.CSSProperties =>
    ({
      active: {
        background: c.activeBackground,
        color: c.activeTextColor,
        border: `1px solid ${c.activeBorderColor}`,
      },
      pending: {
        background: c.pendingBackground,
        color: c.pendingTextColor,
        border: `1px solid ${c.pendingBorderColor}`,
      },
      "at-risk": {
        background: c.atRiskBackground,
        color: c.atRiskTextColor,
        border: `1px solid ${c.atRiskBorderColor}`,
      },
    })[status];

  const statusLabel: Record<CustomerStatus, string> = {
    active: "ACTIVE",
    pending: "PENDING",
    "at-risk": "AT RISK",
  };

  const expandAccentColor = (status: CustomerStatus) =>
    ({
      active: c.expandedBorderAccentColor,
      pending: c.pendingTextColor,
      "at-risk": c.atRiskTextColor,
    })[status];

  // Styles
  const tableWrap: React.CSSProperties = {
    background: c.tableBackground,
    border: `1px solid ${c.tableBorderColor}`,
    borderRadius: `${c.tableBorderRadius}px`,
    overflow: "hidden",
    boxShadow: c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none",
    fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif",
    fontSize: `${c.fontSize}px`,
  };

  const thStyle: React.CSSProperties = {
    background: c.headerBackground,
    color: c.headerTextColor,
    fontSize: `${c.fontSize - 1}px`,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "10px 14px",
    borderBottom: `1px solid ${c.headerBorderColor}`,
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const tdBase: React.CSSProperties = {
    padding: "13px 14px",
    color: c.rowTextColor,
    fontSize: `${c.fontSize}px`,
    verticalAlign: "middle",
  };

  const paginationBar: React.CSSProperties = {
    display: c.showPagination ? "flex" : "none",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: c.paginationBackground,
    borderTop: `1px solid ${c.paginationBorderColor}`,
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <div style={tableWrap}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {c.showCheckboxes && (
                  <th
                    style={{ ...thStyle, width: "44px", textAlign: "center" }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        accentColor: c.accentColor,
                        width: "14px",
                        height: "14px",
                        cursor: "pointer",
                      }}
                      checked={
                        selectedRows.size === pageRows.length &&
                        pageRows.length > 0
                      }
                      onChange={() => {
                        if (selectedRows.size === pageRows.length)
                          setSelectedRows(new Set());
                        else
                          setSelectedRows(new Set(pageRows.map((r) => r.id)));
                      }}
                    />
                  </th>
                )}
                <th style={{ ...thStyle, minWidth: "220px" }}>Customer Name</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>MRR</th>
                {c.showChurnBar && (
                  <th style={{ ...thStyle, textAlign: "right" }}>Churn Risk</th>
                )}
                <th style={{ ...thStyle, textAlign: "center" }}>
                  Active Users
                </th>
                {c.showSparklines && (
                  <th style={{ ...thStyle, minWidth: "100px" }}>
                    Health (30d)
                  </th>
                )}
                <th style={{ ...thStyle, width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => {
                const isExpanded = expandedRows.has(row.id);
                const isSelected = selectedRows.has(row.id);
                const sparkColor = getSparklineColor(row.status, c);
                const riskColor = getRiskColor(row.churnRisk, c);
                const accentBorder = expandAccentColor(row.status);

                const rowBg = isSelected
                  ? c.rowSelectedBackground
                  : c.rowBackground;

                return [
                  <tr
                    key={row.id}
                    style={{
                      background: rowBg,
                      borderBottom: `1px solid ${c.rowBorderColor}`,
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onClick={() => toggleExpand(row.id)}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background =
                          c.rowHoverBackground;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = rowBg;
                    }}
                  >
                    {c.showCheckboxes && (
                      <td
                        style={{
                          ...tdBase,
                          textAlign: "center",
                          width: "44px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(row.id)}
                          style={{
                            accentColor: c.accentColor,
                            width: "14px",
                            height: "14px",
                            cursor: "pointer",
                          }}
                        />
                      </td>
                    )}

                    {/* Customer name + avatar */}
                    <td style={tdBase}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: `${c.avatarRadius}%`,
                            background: `${row.avatarColor}22`,
                            border: `1px solid ${row.avatarColor}44`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: `${c.fontSize - 1}px`,
                            color: row.avatarColor,
                            flexShrink: 0,
                          }}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 600, color: c.rowTextColor }}
                          >
                            {row.name}
                          </div>
                          <div
                            style={{
                              fontSize: `${c.fontSize - 1}px`,
                              color: c.rowSubtextColor,
                              marginTop: "1px",
                            }}
                          >
                            {row.domain}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={tdBase}>
                      <span
                        style={{
                          ...statusBadgeStyle(row.status),
                          padding: "3px 8px",
                          borderRadius: `${Math.max(2, c.borderRadius - 2)}px`,
                          fontSize: `${c.fontSize - 2}px`,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {statusLabel[row.status]}
                      </span>
                    </td>

                    {/* MRR */}
                    <td
                      style={{
                        ...tdBase,
                        textAlign: "right",
                        fontWeight: 600,
                        color: c.rowTextColor,
                      }}
                    >
                      ${row.mrr.toLocaleString()}
                    </td>

                    {/* Churn Risk */}
                    {c.showChurnBar && (
                      <td style={{ ...tdBase, textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              color: riskColor,
                              minWidth: "28px",
                              textAlign: "right",
                            }}
                          >
                            {row.churnRisk}%
                          </span>
                          <div
                            style={{
                              width: "48px",
                              height: "5px",
                              background: c.riskBarTrackColor,
                              borderRadius: "99px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${row.churnRisk}%`,
                                background: riskColor,
                                borderRadius: "99px",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Active Users */}
                    <td
                      style={{
                        ...tdBase,
                        textAlign: "center",
                        color: c.rowSubtextColor,
                      }}
                    >
                      {row.activeUsers.toLocaleString()}
                    </td>

                    {/* Sparkline */}
                    {c.showSparklines && (
                      <td style={tdBase}>
                        <Sparkline data={row.healthData} color={sparkColor} />
                      </td>
                    )}

                    {/* Chevron */}
                    <td style={{ ...tdBase, textAlign: "center" }}>
                      <span
                        style={{
                          color: c.rowSubtextColor,
                          fontSize: "16px",
                          display: "inline-block",
                          transition: "transform 0.2s ease",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▾
                      </span>
                    </td>
                  </tr>,

                  // ── Expanded Analytics Row ──
                  isExpanded && (
                    <tr
                      key={`${row.id}-exp`}
                      style={{ background: c.expandedBackground }}
                    >
                      <td
                        colSpan={
                          c.showCheckboxes
                            ? c.showSparklines && c.showChurnBar
                              ? 8
                              : 6
                            : 7
                        }
                        style={{ padding: 0 }}
                      >
                        <div
                          style={{
                            borderLeft: `3px solid ${accentBorder}`,
                            padding: "20px 20px 20px 22px",
                            animation: c.animateExpand
                              ? "atExpand 0.2s ease"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 260px",
                              gap: "24px",
                            }}
                          >
                            {/* Left: Chart + note */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: c.rowTextColor,
                                  fontSize: `${c.fontSize + 1}px`,
                                }}
                              >
                                Usage Activity — Last 7 Weeks
                              </div>
                              <ExpandedChart
                                data={row.chartData}
                                barColor={c.expandedChartBarColor}
                                barHighlight={c.expandedChartBarHighlight}
                                bg={c.expandedChartBackground}
                              />
                              <div
                                style={{
                                  padding: "10px 12px",
                                  background: `${accentBorder}10`,
                                  border: `1px solid ${accentBorder}30`,
                                  borderRadius: `${c.borderRadius}px`,
                                  fontSize: `${c.fontSize - 1}px`,
                                  color: c.rowSubtextColor,
                                  lineHeight: "1.6",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: accentBorder,
                                    marginRight: "6px",
                                  }}
                                >
                                  Note:
                                </span>
                                {row.note}
                              </div>
                            </div>

                            {/* Right: Metadata + CTA */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: c.rowTextColor,
                                  fontSize: `${c.fontSize + 1}px`,
                                }}
                              >
                                Account Details
                              </div>
                              <div
                                style={{
                                  background: c.expandedMetaBackground,
                                  border: `1px solid ${c.expandedMetaBorderColor}`,
                                  borderRadius: `${c.borderRadius}px`,
                                  overflow: "hidden",
                                }}
                              >
                                {[
                                  { label: "Plan", value: row.plan },
                                  { label: "Owner", value: row.owner },
                                  { label: "Renewal", value: row.renewal },
                                  {
                                    label: "MRR",
                                    value: `$${row.mrr.toLocaleString()}`,
                                  },
                                  {
                                    label: "Active Users",
                                    value: row.activeUsers.toLocaleString(),
                                  },
                                ].map((item, i, arr) => (
                                  <div
                                    key={item.label}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      padding: "9px 12px",
                                      borderBottom:
                                        i < arr.length - 1
                                          ? `1px solid ${c.expandedMetaBorderColor}`
                                          : "none",
                                      fontSize: `${c.fontSize - 1}px`,
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: c.expandedMetaLabelColor,
                                      }}
                                    >
                                      {item.label}
                                    </span>
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        color: c.expandedMetaValueColor,
                                      }}
                                    >
                                      {item.value}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Risk indicator */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "6px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: `${c.fontSize - 1}px`,
                                  }}
                                >
                                  <span style={{ color: c.rowSubtextColor }}>
                                    Churn Risk
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: getRiskColor(row.churnRisk, c),
                                    }}
                                  >
                                    {row.churnRisk}%
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: "6px",
                                    background: c.riskBarTrackColor,
                                    borderRadius: "99px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "100%",
                                      width: `${row.churnRisk}%`,
                                      background: getRiskColor(
                                        row.churnRisk,
                                        c,
                                      ),
                                      borderRadius: "99px",
                                    }}
                                  />
                                </div>
                              </div>

                              <button
                                style={{
                                  background: c.ctaBackground,
                                  color: c.ctaTextColor,
                                  border: "none",
                                  borderRadius: `${c.borderRadius}px`,
                                  padding: "9px 0",
                                  fontWeight: 700,
                                  fontSize: `${c.fontSize}px`,
                                  cursor: "pointer",
                                  width: "100%",
                                  letterSpacing: "0.03em",
                                  transition: "opacity 0.15s",
                                  fontFamily: "inherit",
                                }}
                                onMouseEnter={(e) => {
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.opacity = "0.85";
                                }}
                                onMouseLeave={(e) => {
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.opacity = "1";
                                }}
                              >
                                View Full Profile →
                              </button>
                            </div>
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

        {/* Pagination */}
        <div style={paginationBar}>
          <span
            style={{
              fontSize: `${c.fontSize - 1}px`,
              color: c.paginationTextColor,
            }}
          >
            Showing{" "}
            <strong style={{ color: c.rowTextColor }}>
              {(currentPage - 1) * rpp + 1}–
              {Math.min(currentPage * rpp, CUSTOMERS.length)}
            </strong>{" "}
            of {CUSTOMERS.length} customers
          </span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: "28px",
                height: "28px",
                border: `1px solid ${c.paginationBorderColor}`,
                borderRadius: `${Math.max(2, c.borderRadius - 2)}px`,
                background: "transparent",
                color: c.paginationTextColor,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
                fontSize: "14px",
              }}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              const active = pg === currentPage;
              return (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${active ? c.paginationActiveBackground : c.paginationBorderColor}`,
                    borderRadius: `${Math.max(2, c.borderRadius - 2)}px`,
                    background: active
                      ? c.paginationActiveBackground
                      : "transparent",
                    color: active
                      ? c.paginationActiveTextColor
                      : c.paginationTextColor,
                    cursor: "pointer",
                    fontWeight: active ? 700 : 400,
                    fontSize: `${c.fontSize - 1}px`,
                  }}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: "28px",
                height: "28px",
                border: `1px solid ${c.paginationBorderColor}`,
                borderRadius: `${Math.max(2, c.borderRadius - 2)}px`,
                background: "transparent",
                color: c.paginationTextColor,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
                fontSize: "14px",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Sync footer */}
      {c.showSyncFooter && (
        <div
          style={{
            marginTop: "12px",
            textAlign: "center",
            color: c.rowSubtextColor,
            fontSize: `${c.fontSize - 2}px`,
            opacity: 0.7,
          }}
        >
          Data refreshed every 5 minutes · Last sync: Oct 24, 2023 — 14:32:01
          UTC
        </div>
      )}

      <style>{`
        @keyframes atExpand {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
