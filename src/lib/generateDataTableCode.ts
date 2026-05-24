// /lib/generateDataTableCode.ts

import { DataTableConfig } from "./dataTableConfig";

export function generateDataTableJSX(config: DataTableConfig): string {
  const c = config;

  return `import { useState, useMemo } from "react";
import "./DataTable.css";

const SAMPLE_DATA = [
  {
    id: "TXN-98234-A", uid: "449202394", entity: "AWS Infrastructure",
    category: "Infrastructure / SaaS", icon: "☁", amount: -12450,
    date: "Oct 24, 2023", status: "completed",
    summary: "Monthly recurring billing for US-East-1 instances and S3 bucket storage.",
    tags: ["Auto-renew", "Compliance-OK"],
    lineItems: [
      { label: "EC2 Reserved Instances", value: "$8,200.00" },
      { label: "S3 Glacier Storage", value: "$1,450.00" },
      { label: "Enterprise Support Tax", value: "$2,800.00" },
    ],
    invoice: "AWS-8820-INV", approver: "Sarah Connor",
  },
  {
    id: "TXN-44210-B", uid: "881023945", entity: "Google Ads Global",
    category: "Marketing / Advertising", icon: "📢", amount: -45000,
    date: "Oct 23, 2023", status: "pending",
    summary: "Payment exceeded the standard marketing budget threshold of $25,000.",
    tags: ["Over Budget", "Needs Approval"],
    lineItems: [
      { label: "Search Campaigns", value: "$28,000.00" },
      { label: "Display Network", value: "$12,000.00" },
      { label: "YouTube Ads", value: "$5,000.00" },
    ],
    invoice: "GADS-4421-INV", approver: "Pending CMO",
  },
  {
    id: "TXN-22119-C", uid: "102239103", entity: "Stripe Payout",
    category: "Revenue / Deposits", icon: "🏦", amount: 242500,
    date: "Oct 22, 2023", status: "completed",
    summary: "Batch payout for sales period Oct 15–21. Settlement via Chase JP Morgan.",
    tags: ["Auto-deposited", "Reconciled"],
    lineItems: [
      { label: "Product Sales", value: "$198,400.00" },
      { label: "Subscription Revenue", value: "$44,100.00" },
    ],
    invoice: "STR-2211-PAY", approver: "Auto-cleared",
  },
  {
    id: "TXN-11029-F", uid: "992384722", entity: "Turing Hotels",
    category: "Travel / Entertainment", icon: "⚠", amount: -1240.50,
    date: "Oct 21, 2023", status: "flagged",
    summary: "DUPLICATE DETECTED: Similar charge found for TXN-11028-F.",
    tags: ["Duplicate Risk", "Review Required"],
    lineItems: [
      { label: "Room Rate (3 nights)", value: "$900.00" },
      { label: "Room Service", value: "$220.50" },
      { label: "Incidentals", value: "$120.00" },
    ],
    invoice: "TUR-1102-REC", approver: "Under Review",
  },
];

export default function DataTable({ onRowSelect }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = ${c.rowsPerPage};

  const filtered = useMemo(() => {
    let rows = [...SAMPLE_DATA];
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    rows.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortDir === "desc" ? dB - dA : dA - dB;
    });
    return rows;
  }, [statusFilter, sortDir]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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

  return (
    <div className="dt-wrap">
      {/* Filter Bar */}
      <div className="dt__filters">
        {["all", "completed", "pending", "flagged"].map(s => (
          <button
            key={s}
            className={\`dt__chip \${statusFilter === s ? "dt__chip--active" : ""}\`}
            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
          >
            {s.toUpperCase()}
          </button>
        ))}
        <button
          className="dt__chip"
          onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
          style={{ marginLeft: "auto" }}
        >
          DATE {sortDir === "desc" ? "↓" : "↑"}
        </button>
      </div>

      {/* Table */}
      <div className="dt">
        <table className="dt__table">
          <thead>
            <tr className="dt__header-row">
              <th className="dt__th dt__th--checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.size === pageRows.length && pageRows.length > 0}
                  onChange={() => {
                    if (selectedRows.size === pageRows.length) setSelectedRows(new Set());
                    else setSelectedRows(new Set(pageRows.map(r => r.id)));
                  }}
                />
              </th>
              <th className="dt__th">Transaction ID</th>
              <th className="dt__th">Entity / Category</th>
              <th className="dt__th dt__th--right">Amount</th>
              <th className="dt__th">Date</th>
              <th className="dt__th">Status</th>
              <th className="dt__th"></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              const isExpanded = expandedRows.has(row.id);
              const isCredit = row.amount > 0;
              return [
                <tr
                  key={row.id}
                  className={\`dt__row \${isExpanded ? "dt__row--expanded" : ""}\`}
                  onClick={() => toggleExpand(row.id)}
                >
                  <td className="dt__td" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td className="dt__td">
                    <div className="dt__txn-id">#{row.id}</div>
                    <div className="dt__txn-uid">ID: {row.uid}</div>
                  </td>
                  <td className="dt__td">
                    <div className="dt__entity">
                      <div className="dt__entity-icon">{row.icon}</div>
                      <div>
                        <div className="dt__entity-name">{row.entity}</div>
                        <div className="dt__entity-cat">{row.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className={\`dt__td dt__td--right \${isCredit ? "dt__amount--credit" : "dt__amount--debit"}\`}>
                    {isCredit ? "+" : ""}$\{Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="dt__td dt__date">{row.date}</td>
                  <td className="dt__td">
                    <span className={\`dt__badge dt__badge--\${row.status}\`}>{row.status.toUpperCase()}</span>
                  </td>
                  <td className="dt__td dt__td--center">
                    <span className={\`dt__chevron \${isExpanded ? "dt__chevron--open" : ""}\`}>▾</span>
                  </td>
                </tr>,
                isExpanded && (
                  <tr key={\`\${row.id}-detail\`} className="dt__detail-row">
                    <td colSpan={7} className="dt__detail-cell">
                      <div className={\`dt__detail-inner dt__detail-inner--\${row.status}\`}>
                        <div className="dt__detail-section">
                          <div className="dt__detail-label">
                            {row.status === "flagged" ? "⚠ ALERT" : row.status === "pending" ? "ACTION REQUIRED" : "TRANSACTION SUMMARY"}
                          </div>
                          <p className="dt__detail-summary">{row.summary}</p>
                          <div className="dt__tags">
                            {row.tags.map(tag => <span key={tag} className="dt__tag">{tag}</span>)}
                          </div>
                        </div>
                        <div className="dt__detail-section">
                          <div className="dt__detail-label">LINE ITEMS</div>
                          {row.lineItems.map(item => (
                            <div key={item.label} className="dt__line-item">
                              <span>{item.label}</span><span>{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="dt__detail-section">
                          <div className="dt__detail-label">RECEIPT / ACTIONS</div>
                          <div className="dt__receipt">
                            <div className="dt__receipt-accent" />
                            <div className="dt__receipt-id">{row.invoice}</div>
                            <div className="dt__receipt-approver">Approved by: {row.approver}</div>
                            {row.status === "flagged" && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button className="dt__btn dt__btn--danger">DISPUTE</button>
                                <button className="dt__btn dt__btn--ghost">IGNORE</button>
                              </div>
                            )}
                            {row.status === "pending" && (
                              <button className="dt__btn dt__btn--primary">APPROVE NOW</button>
                            )}
                            {row.status === "completed" && (
                              <button className="dt__btn dt__btn--outline">VIEW INVOICE</button>
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
      <div className="dt__pagination">
        <span className="dt__pagination-info">
          Showing <strong>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)}</strong> of {filtered.length}
        </span>
        <div className="dt__pages">
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button
              key={i + 1}
              className={\`dt__page-btn \${currentPage === i + 1 ? "dt__page-btn--active" : ""}\`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
        </div>
      </div>
    </div>
  );
}`;
}

export function generateDataTableCSS(config: DataTableConfig): string {
  const c = config;
  const r = `${c.borderRadius}px`;
  const tr = `${c.tableBorderRadius}px`;
  const fs = `${c.fontSize}px`;

  return `/* DataTable.css */

.dt-wrap {
  font-family: 'DM Mono', 'Courier New', monospace;
  font-size: ${fs};
  width: 100%;
}

/* ── Filter Bar ── */
.dt__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: ${c.filterBarBackground};
  border: 1px solid ${c.filterBarBorderColor};
  border-radius: ${tr} ${tr} 0 0;
}

.dt__chip {
  background: ${c.filterChipBackground};
  color: ${c.filterChipTextColor};
  border: 1px solid ${c.filterChipBorderColor};
  border-radius: ${r};
  padding: 4px 10px;
  font-size: ${c.fontSize - 1}px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;
  font-family: inherit;
}

.dt__chip--active {
  background: ${c.accentColor};
  color: ${c.accentTextColor};
  border-color: ${c.accentColor};
}

/* ── Table Container ── */
.dt {
  background: ${c.tableBackground};
  border: 1px solid ${c.tableBorderColor};
  border-top: none;
  overflow-x: auto;
  ${c.showShadow ? `box-shadow: 0 8px 48px rgba(0,0,0,0.5);` : ""}
}

.dt__table {
  width: 100%;
  border-collapse: collapse;
}

/* ── Header ── */
.dt__header-row {
  background: ${c.headerBackground};
  border-bottom: 1px solid ${c.headerBorderColor};
}

.dt__th {
  padding: 10px 14px;
  color: ${c.headerTextColor};
  font-size: ${c.fontSize - 1}px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  text-align: left;
  font-family: inherit;
}

.dt__th--right { text-align: right; }
.dt__th--checkbox { width: 44px; }

/* ── Rows ── */
.dt__row {
  background: ${c.rowBackground};
  border-bottom: 1px solid ${c.rowBorderColor};
  cursor: pointer;
  transition: background 0.12s ease;
}

.dt__row:hover {
  background: ${c.rowHoverBackground};
}

.dt__row--expanded {
  background: ${c.rowHoverBackground};
}

.dt__td {
  padding: 12px 14px;
  color: ${c.rowTextColor};
  font-size: ${fs};
  vertical-align: middle;
  font-family: inherit;
}

.dt__td--right { text-align: right; }
.dt__td--center { text-align: center; }

/* ── Cell Content ── */
.dt__txn-id {
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${c.rowTextColor};
}
.dt__txn-uid {
  font-size: ${c.fontSize - 1}px;
  color: ${c.rowSubtextColor};
  margin-top: 2px;
}

.dt__entity {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dt__entity-icon {
  width: 32px;
  height: 32px;
  border-radius: ${r};
  background: ${c.accentColor}18;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.dt__entity-name {
  font-weight: 600;
  color: ${c.rowTextColor};
}
.dt__entity-cat {
  font-size: ${c.fontSize - 1}px;
  color: ${c.rowSubtextColor};
  margin-top: 2px;
}

.dt__amount--debit { color: ${c.debitColor}; font-weight: 700; }
.dt__amount--credit { color: ${c.creditColor}; font-weight: 700; }
.dt__date { color: ${c.rowSubtextColor}; }

/* ── Status Badges ── */
.dt__badge {
  padding: 3px 8px;
  border-radius: ${Math.max(0, c.borderRadius - 2)}px;
  font-size: ${c.fontSize - 2}px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.dt__badge--completed {
  background: ${c.completedBackground};
  color: ${c.completedTextColor};
  border: 1px solid ${c.completedBorderColor};
}
.dt__badge--pending {
  background: ${c.pendingBackground};
  color: ${c.pendingTextColor};
  border: 1px solid ${c.pendingBorderColor};
}
.dt__badge--flagged {
  background: ${c.flaggedBackground};
  color: ${c.flaggedTextColor};
  border: 1px solid ${c.flaggedBorderColor};
}

/* ── Chevron ── */
.dt__chevron {
  color: ${c.rowSubtextColor};
  font-size: 16px;
  display: inline-block;
  transition: transform 0.2s ease;
}
.dt__chevron--open {
  transform: rotate(180deg);
}

/* ── Detail Row ── */
.dt__detail-row {
  background: ${c.expandedRowBackground};
}
.dt__detail-cell {
  padding: 0;
}
.dt__detail-inner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  padding: 16px 20px;
  border-left: 3px solid ${c.expandedBorderAccentColor};
  animation: ${c.animateExpand ? "dtExpandIn 0.18s ease" : "none"};
}
.dt__detail-inner--flagged { border-left-color: ${c.flaggedTextColor}; }
.dt__detail-inner--pending { border-left-color: ${c.pendingTextColor}; }
.dt__detail-inner--completed { border-left-color: ${c.expandedBorderAccentColor}; }

.dt__detail-section { display: flex; flex-direction: column; gap: 6px; }

.dt__detail-label {
  font-size: ${c.fontSize - 2}px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${c.accentColor};
  margin-bottom: 4px;
}
.dt__detail-summary {
  color: ${c.rowTextColor};
  font-size: ${fs};
  line-height: 1.6;
  margin: 0;
}

/* ── Tags ── */
.dt__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.dt__tag {
  padding: 2px 8px;
  border-radius: ${Math.max(0, c.borderRadius - 2)}px;
  border: 1px solid ${c.tableBorderColor};
  color: ${c.rowSubtextColor};
  font-size: ${c.fontSize - 2}px;
  font-weight: 600;
}

/* ── Line Items ── */
.dt__line-item {
  display: flex;
  justify-content: space-between;
  font-size: ${fs};
  color: ${c.rowTextColor};
  border-bottom: 1px solid ${c.rowBorderColor};
  padding-bottom: 4px;
}
.dt__line-item span:first-child { color: ${c.rowSubtextColor}; }
.dt__line-item span:last-child { font-weight: 600; }

/* ── Receipt ── */
.dt__receipt {
  background: ${c.tableBackground};
  border: 1px solid ${c.tableBorderColor};
  border-radius: ${r};
  padding: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dt__receipt-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: ${c.accentColor};
}
.dt__receipt-id {
  font-size: ${c.fontSize + 1}px;
  font-weight: 700;
  color: ${c.rowTextColor};
}
.dt__receipt-approver {
  font-size: ${c.fontSize - 2}px;
  color: ${c.rowSubtextColor};
  margin-bottom: 6px;
}

/* ── Buttons ── */
.dt__btn {
  padding: 5px 10px;
  border-radius: ${Math.max(0, c.borderRadius - 2)}px;
  font-size: ${c.fontSize - 1}px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: opacity 0.15s ease;
  width: 100%;
  margin-top: 4px;
}
.dt__btn:hover { opacity: 0.85; }

.dt__btn--primary {
  background: ${c.accentColor};
  color: ${c.accentTextColor};
  border: none;
}
.dt__btn--outline {
  background: transparent;
  color: ${c.accentColor};
  border: 1px solid ${c.accentColor};
}
.dt__btn--danger {
  background: transparent;
  color: ${c.flaggedTextColor};
  border: 1px solid ${c.flaggedTextColor};
  flex: 1;
}
.dt__btn--ghost {
  background: transparent;
  color: ${c.rowSubtextColor};
  border: 1px solid ${c.tableBorderColor};
  flex: 1;
}

/* ── Pagination ── */
.dt__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: ${c.paginationBackground};
  border: 1px solid ${c.paginationBorderColor};
  border-top: none;
  border-radius: 0 0 ${tr} ${tr};
}
.dt__pagination-info {
  font-size: ${c.fontSize - 1}px;
  color: ${c.paginationTextColor};
}
.dt__pagination-info strong { color: ${c.rowTextColor}; }

.dt__pages { display: flex; align-items: center; gap: 4px; }
.dt__page-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid ${c.paginationBorderColor};
  border-radius: ${Math.max(0, c.borderRadius - 2)}px;
  background: transparent;
  color: ${c.paginationTextColor};
  font-size: ${c.fontSize - 1}px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 400;
  transition: all 0.12s ease;
}
.dt__page-btn:hover { border-color: ${c.accentColor}; color: ${c.accentColor}; }
.dt__page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.dt__page-btn--active {
  background: ${c.paginationActiveBackground};
  color: ${c.paginationActiveTextColor};
  border-color: ${c.paginationActiveBackground};
  font-weight: 700;
}

/* ── Animations ── */
@keyframes dtExpandIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
}
