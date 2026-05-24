"use client";

// /components/playground/DataTablePreview.tsx

import { useState, useMemo } from "react";
import { DataTableConfig } from "@/lib/dataTableConfig";

interface DataTablePreviewProps {
  config: DataTableConfig;
}

const SAMPLE_DATA = [
  {
    id: "TXN-98234-A",
    uid: "449202394",
    entity: "AWS Infrastructure",
    category: "Infrastructure / SaaS",
    icon: "☁",
    amount: -12450.0,
    date: "Oct 24, 2023",
    status: "completed" as const,
    summary:
      "Monthly recurring billing for US-East-1 instances and S3 bucket storage. Tier-3 support included.",
    tags: ["Auto-renew", "Compliance-OK"],
    lineItems: [
      { label: "EC2 Reserved Instances", value: "$8,200.00" },
      { label: "S3 Glacier Storage", value: "$1,450.00" },
      { label: "Enterprise Support Tax", value: "$2,800.00" },
    ],
    invoice: "AWS-8820-INV",
    approver: "Sarah Connor",
  },
  {
    id: "TXN-44210-B",
    uid: "881023945",
    entity: "Google Ads Global",
    category: "Marketing / Advertising",
    icon: "📢",
    amount: -45000.0,
    date: "Oct 23, 2023",
    status: "pending" as const,
    summary:
      "Payment exceeded standard marketing budget threshold of $25,000. Requires CMO approval before disbursement.",
    tags: ["Over Budget", "Needs Approval"],
    lineItems: [
      { label: "Search Campaigns", value: "$28,000.00" },
      { label: "Display Network", value: "$12,000.00" },
      { label: "YouTube Ads", value: "$5,000.00" },
    ],
    invoice: "GADS-4421-INV",
    approver: "Pending CMO",
  },
  {
    id: "TXN-22119-C",
    uid: "102239103",
    entity: "Stripe Payout",
    category: "Revenue / Deposits",
    icon: "🏦",
    amount: 242500.0,
    date: "Oct 22, 2023",
    status: "completed" as const,
    summary:
      "Batch payout for sales period Oct 15–21. Settlement successful via Chase JP Morgan.",
    tags: ["Auto-deposited", "Reconciled"],
    lineItems: [
      { label: "Product Sales", value: "$198,400.00" },
      { label: "Subscription Revenue", value: "$44,100.00" },
    ],
    invoice: "STR-2211-PAY",
    approver: "Auto-cleared",
  },
  {
    id: "TXN-11029-F",
    uid: "992384722",
    entity: "Turing Hotels",
    category: "Travel / Entertainment",
    icon: "⚠",
    amount: -1240.5,
    date: "Oct 21, 2023",
    status: "flagged" as const,
    summary:
      "DUPLICATE DETECTED: Similar charge found for TXN-11028-F. Please review and dispute if necessary.",
    tags: ["Duplicate Risk", "Review Required"],
    lineItems: [
      { label: "Room Rate (3 nights)", value: "$900.00" },
      { label: "Room Service", value: "$220.50" },
      { label: "Incidentals", value: "$120.00" },
    ],
    invoice: "TUR-1102-REC",
    approver: "Under Review",
  },
  {
    id: "TXN-33440-D",
    uid: "773820109",
    entity: "Figma Teams",
    category: "Design / SaaS",
    icon: "✦",
    amount: -840.0,
    date: "Oct 20, 2023",
    status: "completed" as const,
    summary: "Annual team subscription renewal for 12 seats. Enterprise plan.",
    tags: ["Annual", "Compliance-OK"],
    lineItems: [
      { label: "12 Seats × $60", value: "$720.00" },
      { label: "FigJam Add-on", value: "$120.00" },
    ],
    invoice: "FIG-3344-INV",
    approver: "James Liu",
  },
  {
    id: "TXN-55201-E",
    uid: "661023847",
    entity: "Payroll — Oct",
    category: "Payroll / Staff",
    icon: "👥",
    amount: -186200.0,
    date: "Oct 15, 2023",
    status: "completed" as const,
    summary:
      "Monthly payroll disbursement for 43 full-time employees. Includes bonuses.",
    tags: ["Payroll", "Compliant"],
    lineItems: [
      { label: "Base Salaries", value: "$162,000.00" },
      { label: "Performance Bonuses", value: "$18,200.00" },
      { label: "Benefits Overhead", value: "$6,000.00" },
    ],
    invoice: "PAY-OCT-2023",
    approver: "HR / Finance",
  },
  {
    id: "TXN-66812-G",
    uid: "554129033",
    entity: "Vercel Pro",
    category: "Infrastructure / SaaS",
    icon: "▲",
    amount: -200.0,
    date: "Oct 12, 2023",
    status: "completed" as const,
    summary: "Monthly hosting subscription — Pro team plan.",
    tags: ["Auto-renew"],
    lineItems: [{ label: "Pro Plan (monthly)", value: "$200.00" }],
    invoice: "VCL-6681-INV",
    approver: "Auto-cleared",
  },
  {
    id: "TXN-79904-H",
    uid: "882031994",
    entity: "LinkedIn Recruiting",
    category: "HR / Advertising",
    icon: "🔗",
    amount: -3500.0,
    date: "Oct 10, 2023",
    status: "pending" as const,
    summary: "Job slot credits for Q4 hiring push. Awaiting finance sign-off.",
    tags: ["Q4 Hiring", "Pending"],
    lineItems: [
      { label: "5 Job Slots (30 days)", value: "$2,500.00" },
      { label: "InMail Credits Pack", value: "$1,000.00" },
    ],
    invoice: "LIN-7990-INV",
    approver: "Finance Dept",
  },
];

type StatusType = "completed" | "pending" | "flagged";
type FilterStatus = "all" | StatusType;
type FilterCategory =
  | "all"
  | "Infrastructure / SaaS"
  | "Marketing / Advertising"
  | "Revenue / Deposits"
  | "Travel / Entertainment"
  | "Payroll / Staff"
  | "Design / SaaS"
  | "HR / Advertising";

export function DataTablePreview({ config }: DataTablePreviewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const c = config;
  const fs = `${c.fontSize}px`;

  const filtered = useMemo(() => {
    let rows = [...SAMPLE_DATA];
    if (statusFilter !== "all")
      rows = rows.filter((r) => r.status === statusFilter);
    if (categoryFilter !== "all")
      rows = rows.filter((r) => r.category === categoryFilter);
    rows.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });
    return rows;
  }, [statusFilter, categoryFilter, sortDir]);

  const rowsPerPage = config.rowsPerPage;
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

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

  function toggleSelectAll() {
    if (selectedRows.size === pageRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pageRows.map((r) => r.id)));
    }
  }

  const statusBadgeStyle = (status: StatusType) => {
    const map = {
      completed: {
        background: c.completedBackground,
        color: c.completedTextColor,
        border: `1px solid ${c.completedBorderColor}`,
      },
      pending: {
        background: c.pendingBackground,
        color: c.pendingTextColor,
        border: `1px solid ${c.pendingBorderColor}`,
      },
      flagged: {
        background: c.flaggedBackground,
        color: c.flaggedTextColor,
        border: `1px solid ${c.flaggedBorderColor}`,
      },
    };
    return map[status];
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: fs,
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const tableWrapStyle: React.CSSProperties = {
    background: c.tableBackground,
    border: `1px solid ${c.tableBorderColor}`,
    borderRadius: `${c.tableBorderRadius}px`,
    overflow: "hidden",
    boxShadow: c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none",
  };

  const filterBarStyle: React.CSSProperties = {
    background: c.filterBarBackground,
    borderBottom: `1px solid ${c.filterBarBorderColor}`,
    padding: "12px 16px",
    display: c.showFilters ? "flex" : "none",
    flexWrap: "wrap" as const,
    alignItems: "center",
    gap: "8px",
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    background: active ? c.accentColor : c.filterChipBackground,
    color: active ? c.accentTextColor : c.filterChipTextColor,
    border: `1px solid ${active ? c.accentColor : c.filterChipBorderColor}`,
    borderRadius: `${c.borderRadius}px`,
    padding: "4px 10px",
    fontSize: `${c.fontSize - 1}px`,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
    letterSpacing: "0.03em",
    whiteSpace: "nowrap" as const,
  });

  const thStyle: React.CSSProperties = {
    background: c.headerBackground,
    color: c.headerTextColor,
    fontSize: `${c.fontSize - 1}px`,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    padding: "10px 14px",
    borderBottom: `1px solid ${c.headerBorderColor}`,
    whiteSpace: "nowrap" as const,
  };

  const paginationStyle: React.CSSProperties = {
    background: c.paginationBackground,
    borderTop: `1px solid ${c.paginationBorderColor}`,
    padding: "10px 16px",
    display: c.showPagination ? "flex" : "none",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <div style={containerStyle}>
      <div style={tableWrapStyle}>
        {/* Filter Bar */}
        {c.showFilters && (
          <div style={filterBarStyle}>
            <span
              style={{
                color: c.rowSubtextColor,
                fontSize: `${c.fontSize - 1}px`,
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginRight: "4px",
              }}
            >
              STATUS
            </span>
            {(["all", "completed", "pending", "flagged"] as FilterStatus[]).map(
              (s) => (
                <button
                  key={s}
                  style={chipStyle(statusFilter === s)}
                  onClick={() => {
                    setStatusFilter(s);
                    setCurrentPage(1);
                  }}
                >
                  {s.toUpperCase()}
                </button>
              ),
            )}
            <div
              style={{
                width: "1px",
                height: "20px",
                background: c.filterBarBorderColor,
                margin: "0 4px",
              }}
            />
            <span
              style={{
                color: c.rowSubtextColor,
                fontSize: `${c.fontSize - 1}px`,
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginRight: "4px",
              }}
            >
              SORT
            </span>
            <button
              style={chipStyle(false)}
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            >
              DATE {sortDir === "desc" ? "↓" : "↑"}
            </button>
            <span
              style={{
                marginLeft: "auto",
                color: c.rowSubtextColor,
                fontSize: `${c.fontSize - 1}px`,
              }}
            >
              {filtered.length} records
            </span>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr>
                {c.showCheckboxes && (
                  <th style={{ ...thStyle, width: "44px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === pageRows.length &&
                        pageRows.length > 0
                      }
                      onChange={toggleSelectAll}
                      style={{
                        accentColor: c.accentColor,
                        width: "14px",
                        height: "14px",
                        cursor: "pointer",
                      }}
                    />
                  </th>
                )}
                <th style={thStyle}>Transaction ID</th>
                <th style={thStyle}>Entity / Category</th>
                <th style={{ ...thStyle, textAlign: "right" as const }}>
                  Amount
                </th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => {
                const isExpanded = expandedRows.has(row.id);
                const isSelected = selectedRows.has(row.id);
                const isCredit = row.amount > 0;

                const rowBg =
                  c.stripedRows && idx % 2 === 1
                    ? c.rowBackground === "#1c1c22"
                      ? "#191920"
                      : "#fafafa"
                    : c.rowBackground;

                const rowStyle: React.CSSProperties = {
                  background: isSelected ? `${c.accentColor}12` : rowBg,
                  borderBottom: `1px solid ${c.rowBorderColor}`,
                  cursor: "pointer",
                  transition: "background 0.12s ease",
                };

                const tdStyle: React.CSSProperties = {
                  padding: "12px 14px",
                  color: c.rowTextColor,
                  fontSize: fs,
                  verticalAlign: "middle" as const,
                };

                return [
                  <tr
                    key={row.id}
                    style={rowStyle}
                    onClick={() => toggleExpand(row.id)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        isSelected
                          ? `${c.accentColor}18`
                          : c.rowHoverBackground;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        isSelected ? `${c.accentColor}12` : rowBg;
                    }}
                  >
                    {c.showCheckboxes && (
                      <td
                        style={{ ...tdStyle, width: "44px" }}
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
                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: c.rowTextColor,
                          letterSpacing: "0.02em",
                        }}
                      >
                        #{row.id}
                      </div>
                      <div
                        style={{
                          fontSize: `${c.fontSize - 1}px`,
                          color: c.rowSubtextColor,
                          marginTop: "2px",
                        }}
                      >
                        ID: {row.uid}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: `${c.borderRadius}px`,
                            background: `${c.accentColor}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            flexShrink: 0,
                          }}
                        >
                          {row.icon}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 600, color: c.rowTextColor }}
                          >
                            {row.entity}
                          </div>
                          <div
                            style={{
                              fontSize: `${c.fontSize - 1}px`,
                              color: c.rowSubtextColor,
                              marginTop: "2px",
                            }}
                          >
                            {row.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right" as const,
                        fontWeight: 700,
                        color: isCredit ? c.creditColor : c.debitColor,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {isCredit ? "+" : ""}$
                      {Math.abs(row.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ ...tdStyle, color: c.rowSubtextColor }}>
                      {row.date}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusBadgeStyle(row.status),
                          padding: "3px 8px",
                          borderRadius: `${c.borderRadius - 2}px`,
                          fontSize: `${c.fontSize - 2}px`,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" as const }}>
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

                  // Expanded detail row
                  isExpanded && (
                    <tr
                      key={`${row.id}-detail`}
                      style={{ background: c.expandedRowBackground }}
                    >
                      <td
                        colSpan={c.showCheckboxes ? 7 : 6}
                        style={{ padding: 0 }}
                      >
                        <div
                          style={{
                            borderLeft: `3px solid ${row.status === "flagged" ? c.flaggedTextColor : row.status === "pending" ? c.pendingTextColor : c.expandedBorderAccentColor}`,
                            padding: "16px 20px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "24px",
                            animation: c.animateExpand
                              ? "expandIn 0.18s ease"
                              : "none",
                          }}
                        >
                          {/* Summary */}
                          <div>
                            <div
                              style={{
                                fontSize: `${c.fontSize - 2}px`,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: c.accentColor,
                                marginBottom: "8px",
                              }}
                            >
                              {row.status === "flagged"
                                ? "⚠ ALERT"
                                : row.status === "pending"
                                  ? "ACTION REQUIRED"
                                  : "TRANSACTION SUMMARY"}
                            </div>
                            <p
                              style={{
                                color: c.rowTextColor,
                                fontSize: `${c.fontSize}px`,
                                lineHeight: "1.6",
                                marginBottom: "10px",
                              }}
                            >
                              {row.summary}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap" as const,
                                gap: "6px",
                              }}
                            >
                              {row.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: `${c.borderRadius - 2}px`,
                                    border: `1px solid ${c.tableBorderColor}`,
                                    color: c.rowSubtextColor,
                                    fontSize: `${c.fontSize - 2}px`,
                                    fontWeight: 600,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Line Items */}
                          <div>
                            <div
                              style={{
                                fontSize: `${c.fontSize - 2}px`,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: c.rowSubtextColor,
                                marginBottom: "10px",
                              }}
                            >
                              LINE ITEMS
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: "6px",
                              }}
                            >
                              {row.lineItems.map((item) => (
                                <div
                                  key={item.label}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: `${c.fontSize}px`,
                                    color: c.rowTextColor,
                                    borderBottom: `1px solid ${c.rowBorderColor}`,
                                    paddingBottom: "4px",
                                  }}
                                >
                                  <span style={{ color: c.rowSubtextColor }}>
                                    {item.label}
                                  </span>
                                  <span style={{ fontWeight: 600 }}>
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Receipt */}
                          <div>
                            <div
                              style={{
                                fontSize: `${c.fontSize - 2}px`,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: c.rowSubtextColor,
                                marginBottom: "10px",
                              }}
                            >
                              RECEIPT / ACTIONS
                            </div>
                            <div
                              style={{
                                background: c.tableBackground,
                                border: `1px solid ${c.tableBorderColor}`,
                                borderRadius: `${c.borderRadius}px`,
                                padding: "12px",
                                position: "relative" as const,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute" as const,
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: "2px",
                                  background: c.accentColor,
                                }}
                              />
                              <div
                                style={{
                                  fontSize: `${c.fontSize - 2}px`,
                                  fontWeight: 700,
                                  color: c.rowSubtextColor,
                                  letterSpacing: "0.08em",
                                  marginBottom: "6px",
                                }}
                              >
                                DIGITAL RECEIPT
                              </div>
                              <div
                                style={{
                                  fontSize: `${c.fontSize + 1}px`,
                                  fontWeight: 700,
                                  color: c.rowTextColor,
                                  marginBottom: "4px",
                                }}
                              >
                                {row.invoice}
                              </div>
                              <div
                                style={{
                                  fontSize: `${c.fontSize - 2}px`,
                                  color: c.rowSubtextColor,
                                  marginBottom: "10px",
                                }}
                              >
                                Approved by: {row.approver}
                              </div>
                              {row.status === "flagged" && (
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    style={{
                                      flex: 1,
                                      padding: "5px 8px",
                                      border: `1px solid ${c.flaggedTextColor}`,
                                      color: c.flaggedTextColor,
                                      borderRadius: `${c.borderRadius - 2}px`,
                                      background: "transparent",
                                      fontSize: `${c.fontSize - 1}px`,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    DISPUTE
                                  </button>
                                  <button
                                    style={{
                                      flex: 1,
                                      padding: "5px 8px",
                                      border: `1px solid ${c.tableBorderColor}`,
                                      color: c.rowSubtextColor,
                                      borderRadius: `${c.borderRadius - 2}px`,
                                      background: "transparent",
                                      fontSize: `${c.fontSize - 1}px`,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    IGNORE
                                  </button>
                                </div>
                              )}
                              {row.status === "pending" && (
                                <button
                                  style={{
                                    width: "100%",
                                    padding: "5px 0",
                                    background: c.accentColor,
                                    color: c.accentTextColor,
                                    borderRadius: `${c.borderRadius - 2}px`,
                                    border: "none",
                                    fontSize: `${c.fontSize - 1}px`,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  APPROVE NOW
                                </button>
                              )}
                              {row.status === "completed" && (
                                <button
                                  style={{
                                    width: "100%",
                                    padding: "5px 0",
                                    background: "transparent",
                                    color: c.accentColor,
                                    borderRadius: `${c.borderRadius - 2}px`,
                                    border: `1px solid ${c.accentColor}`,
                                    fontSize: `${c.fontSize - 1}px`,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  VIEW INVOICE
                                </button>
                              )}
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
        {c.showPagination && (
          <div style={paginationStyle}>
            <span
              style={{
                color: c.paginationTextColor,
                fontSize: `${c.fontSize - 1}px`,
              }}
            >
              Showing{" "}
              <strong style={{ color: c.rowTextColor }}>
                {(currentPage - 1) * rowsPerPage + 1}–
                {Math.min(currentPage * rowsPerPage, filtered.length)}
              </strong>{" "}
              of {filtered.length} transactions
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${c.paginationBorderColor}`,
                  borderRadius: `${c.borderRadius - 2}px`,
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
                const isActive = pg === currentPage;
                return (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${isActive ? c.paginationActiveBackground : c.paginationBorderColor}`,
                      borderRadius: `${c.borderRadius - 2}px`,
                      fontWeight: isActive ? 700 : 400,
                      background: isActive
                        ? c.paginationActiveBackground
                        : "transparent",
                      color: isActive
                        ? c.paginationActiveTextColor
                        : c.paginationTextColor,
                      cursor: "pointer",
                      fontSize: `${c.fontSize - 1}px`,
                    }}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${c.paginationBorderColor}`,
                  borderRadius: `${c.borderRadius - 2}px`,
                  background: "transparent",
                  color: c.paginationTextColor,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  fontSize: "14px",
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Context Cards */}
      {c.showContextCards && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {[
            {
              icon: "📊",
              title: "Spending Analytics",
              desc: "Infrastructure costs are up 14% vs Q3. Review orphaned storage buckets.",
              accent: c.accentColor,
            },
            {
              icon: "🔒",
              title: "Compliance Check",
              desc: "12 transactions missing digital receipts. May affect end-of-year audit.",
              accent: c.flaggedTextColor,
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: c.tableBackground,
                border: `1px solid ${c.tableBorderColor}`,
                borderRadius: `${c.borderRadius + 2}px`,
                padding: "14px 16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: `${card.accent}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: c.rowTextColor,
                    marginBottom: "4px",
                    fontSize: `${c.fontSize + 1}px`,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    color: c.rowSubtextColor,
                    fontSize: `${c.fontSize - 1}px`,
                    lineHeight: "1.5",
                  }}
                >
                  {card.desc}
                </div>
                <button
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    color: card.accent,
                    fontWeight: 700,
                    fontSize: `${c.fontSize - 1}px`,
                    cursor: "pointer",
                    padding: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
