// /lib/generateInvoiceTableCode.ts

import { InvoiceTableConfig } from "./invoiceTableConfig";

export function generateInvoiceTableJSX(config: InvoiceTableConfig): string {
  return `import { useState, useMemo } from "react";
import "./InvoiceTable.css";

// ── Data ────────────────────────────────────────────────────────────────────
const CLIENTS = [
  { name: "Apex Labs Inc.",    initials: "AL" },
  { name: "NovaSoft Global",   initials: "NS" },
  { name: "Blue Rocket Co.",   initials: "BR" },
  { name: "Quantum Drive",     initials: "QD" },
  { name: "Stellar Systems",   initials: "SS" },
  { name: "Forge Digital",     initials: "FD" },
  { name: "IronPeak Ltd.",     initials: "IP" },
  { name: "ClearWave Inc.",    initials: "CW" },
  { name: "Pinnacle Tech",     initials: "PT" },
  { name: "Zenith Corp.",      initials: "ZC" },
];
const PAYMENT_METHODS = ["Visa","Mastercard","Wire Transfer","Apple Pay","PayPal"];
const STATUSES = ["Paid","Pending","Overdue"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CARDS = ["4242","9901","1234","5678","3344"];

function generateInvoices() {
  return Array.from({ length: 48 }, (_, i) => {
    i += 1;
    const status = STATUSES[(i * 7 + 1) % STATUSES.length];
    const client = CLIENTS[i % CLIENTS.length];
    const pm = PAYMENT_METHODS[(i * 3) % PAYMENT_METHODS.length];
    const month = MONTHS[(i * 5) % 12];
    const day = String(((i * 7 + 1) % 28) + 1).padStart(2, "0");
    return {
      id: i,
      invoiceNum: \`INV-\${8800 + i}\`,
      clientInitials: client.initials,
      clientName: client.name,
      dateIssued: \`\${month} \${day}, \${i < 25 ? "2024" : "2023"}\`,
      amount: parseFloat(((i * 317.5 + 800) % 9000 + 500).toFixed(2)),
      status,
      paymentMethod: pm,
      cardLast4: (pm === "Visa" || pm === "Mastercard") ? CARDS[i % CARDS.length] : undefined,
      daysOverdue: status === "Overdue" ? ((i * 3 + 2) % 28) + 1 : undefined,
    };
  });
}

const ALL_INVOICES = generateInvoices();
const PAGE_SIZE = 10;

// ── Icons ────────────────────────────────────────────────────────────────────
function IconDownload({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconMoreVert({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="5"  r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
function IconSearch({ color, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function PaymentIcon({ method, color }) {
  if (method === "Visa" || method === "Mastercard") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
  if (method === "Wire Transfer") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4a2 2 0 0 1-2-2V6l4-2h14v8z" />
    </svg>
  );
}

function paymentLabel(inv) {
  if (inv.paymentMethod === "Visa")       return \`Visa •••• \${inv.cardLast4}\`;
  if (inv.paymentMethod === "Mastercard") return \`Mastercard •••• \${inv.cardLast4}\`;
  return inv.paymentMethod;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function InvoiceTable() {
  const TABS = ["All", "Pending", "Paid", "Overdue"];
  const [activeTab, setActiveTab]       = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedIds, setSelectedIds]   = useState(new Set());
  const [sortField, setSortField]       = useState(null);
  const [sortDir, setSortDir]           = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);

  const tabCounts = useMemo(() => {
    const c = { All: ALL_INVOICES.length, Pending: 0, Paid: 0, Overdue: 0 };
    ALL_INVOICES.forEach(inv => c[inv.status]++);
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = [...ALL_INVOICES];
    if (activeTab !== "All") list = list.filter(inv => inv.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(inv =>
        inv.invoiceNum.toLowerCase().includes(q) || inv.clientName.toLowerCase().includes(q)
      );
    }
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [activeTab, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allChecked = paginated.length > 0 && paginated.every(inv => selectedIds.has(inv.id));

  function handleSort(field) {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir(null); }
    } else { setSortField(field); setSortDir("asc"); }
    setCurrentPage(1);
  }
  function toggleAll(checked) {
    setSelectedIds(checked ? new Set(paginated.map(inv => inv.id)) : new Set());
  }
  function toggleRow(id) {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  }
  function statusClass(status) {
    switch (status) {
      case "Paid":    return "inv__badge inv__badge--paid";
      case "Pending": return "inv__badge inv__badge--pending";
      case "Overdue": return "inv__badge inv__badge--overdue";
      default:        return "inv__badge";
    }
  }

  function pageNumbers() {
    const pages = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="inv-wrap">

      {/* Toolbar */}
      <div className="inv__toolbar">
        ${
          config.showStatusTabs
            ? `<div className="inv__tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={\`inv__tab \${tab === activeTab ? "inv__tab--active" : ""}\`}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            >
              {tab}
              {tab === "All" && <span className="inv__tab-badge">{tabCounts.All}</span>}
            </button>
          ))}
        </div>`
            : ""
        }
        ${
          config.showSearch
            ? `<div className="inv__search-wrap">
          <span className="inv__search-icon"><IconSearch color="var(--inv-search-ph)" /></span>
          <input
            className="inv__search"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Filter by invoice # or client..."
          />
        </div>`
            : ""
        }
      </div>

      {/* Table */}
      <div className="inv__scroll">
        <table className="inv__table">
          <thead className="inv__thead">
            <tr>
              ${
                config.showBulkCheckboxes
                  ? `<th className="inv__th inv__th--check">
                <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)} />
              </th>`
                  : ""
              }
              <th className="inv__th inv__th--sort" onClick={() => handleSort("invoiceNum")}>
                Invoice # {sortField === "invoiceNum" ? (sortDir === "asc" ? "↑" : "↓") : <span className="inv__sort-dim">↕</span>}
              </th>
              <th className="inv__th inv__th--sort" onClick={() => handleSort("client")}>
                Client {sortField === "client" ? (sortDir === "asc" ? "↑" : "↓") : <span className="inv__sort-dim">↕</span>}
              </th>
              <th className="inv__th">Date Issued</th>
              <th className="inv__th inv__th--sort" onClick={() => handleSort("amount")}>
                Amount {sortField === "amount" ? (sortDir === "asc" ? "↑" : "↓") : <span className="inv__sort-dim">↕</span>}
              </th>
              <th className="inv__th inv__th--sort" onClick={() => handleSort("status")}>
                Status {sortField === "status" ? (sortDir === "asc" ? "↑" : "↓") : <span className="inv__sort-dim">↕</span>}
              </th>
              <th className="inv__th">Payment Method</th>
              <th className="inv__th">Days Overdue</th>
              <th className="inv__th inv__th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv, idx) => {
              const isSelected = selectedIds.has(inv.id);
              return (
                <tr
                  key={inv.id}
                  className={\`inv__row \${isSelected ? "inv__row--selected" : ""} \${idx % 2 === 1 ? "inv__row--alt" : ""}\`}
                  onClick={() => toggleRow(inv.id)}
                >
                  ${
                    config.showBulkCheckboxes
                      ? `<td className="inv__td inv__td--check" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(inv.id)} />
                  </td>`
                      : ""
                  }
                  <td className="inv__td">
                    <span className="inv__num">{inv.invoiceNum}</span>
                  </td>
                  <td className="inv__td">
                    <div className="inv__client">
                      <div className="inv__avatar">{inv.clientInitials}</div>
                      <span>{inv.clientName}</span>
                    </div>
                  </td>
                  <td className="inv__td inv__td--muted">{inv.dateIssued}</td>
                  <td className="inv__td">
                    <span className="inv__amount">\${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="inv__td">
                    <span className={statusClass(inv.status)}>{inv.status}</span>
                  </td>
                  <td className="inv__td">
                    <div className="inv__payment">
                      <PaymentIcon method={inv.paymentMethod} color="var(--inv-payment-icon)" />
                      <span>{paymentLabel(inv)}</span>
                    </div>
                  </td>
                  <td className="inv__td">
                    {inv.status === "Overdue" && inv.daysOverdue
                      ? <span className="inv__overdue-days">{inv.daysOverdue} Days</span>
                      : <span className="inv__td--muted">—</span>
                    }
                  </td>
                  <td className="inv__td inv__td--actions" onClick={e => e.stopPropagation()}>
                    ${
                      config.showDownloadAction
                        ? `<button className="inv__action-btn" title="Download Invoice">
                      <IconDownload color="var(--inv-action-icon)" size={15} />
                    </button>`
                        : ""
                    }
                    ${
                      config.showMoreAction
                        ? `<button className="inv__action-btn" title="More options">
                      <IconMoreVert color="var(--inv-action-icon)" size={15} />
                    </button>`
                        : ""
                    }
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr><td colSpan={9} className="inv__empty">No invoices match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="inv__footer">
        <span className="inv__footer-info">
          Showing <strong>{filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> invoices
        </span>
        <div className="inv__pagination">
          <button className="inv__page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          <button className="inv__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? <span key={\`e\${i}\`} className="inv__page-ellipsis">…</span>
            : <button key={pg} className={\`inv__page-btn \${pg === currentPage ? "inv__page-btn--active" : ""}\`} onClick={() => setCurrentPage(pg)}>{pg}</button>
          )}
          <button className="inv__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          <button className="inv__page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateInvoiceTableCSS(config: InvoiceTableConfig): string {
  return `/* InvoiceTable.css — generated by CompForge */

/* ── Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');

/* ── CSS Variables ── */
.inv-wrap {
  --inv-bg:             ${config.backgroundColor};
  --inv-toolbar-bg:     ${config.toolbarBackgroundColor};
  --inv-toolbar-border: ${config.toolbarBorderColor};
  --inv-header-bg:      ${config.headerBackgroundColor};
  --inv-header-text:    ${config.headerTextColor};
  --inv-border:         ${config.borderColor};
  --inv-divider:        ${config.dividerColor};
  --inv-row-hover:      ${config.rowHoverColor};
  --inv-row-selected:   ${config.selectedRowColor};
  --inv-cell-text:      ${config.cellTextColor};
  --inv-cell-muted:     ${config.cellMutedColor};
  --inv-accent:         ${config.accentColor};
  --inv-accent-text:    ${config.accentTextColor};
  --inv-num-color:      ${config.invoiceNumColor};
  --inv-avatar-bg:      ${config.avatarBackgroundColor};
  --inv-avatar-text:    ${config.avatarTextColor};
  --inv-tab-active-bg:  ${config.tabActiveBg};
  --inv-tab-active:     ${config.tabActiveText};
  --inv-tab-hover:      ${config.tabHoverBg};
  --inv-tab-inactive:   ${config.tabInactiveText};
  --inv-badge-bg:       ${config.tabBadgeBg};
  --inv-badge-text:     ${config.tabBadgeText};
  --inv-paid-bg:        ${config.paidBg};
  --inv-paid-text:      ${config.paidText};
  --inv-pending-bg:     ${config.pendingBg};
  --inv-pending-text:   ${config.pendingText};
  --inv-overdue-bg:     ${config.overdueBg};
  --inv-overdue-text:   ${config.overdueText};
  --inv-overdue-days:   ${config.overdueDaysColor};
  --inv-payment-icon:   ${config.paymentIconColor};
  --inv-payment-text:   ${config.paymentTextColor};
  --inv-action-icon:    ${config.actionIconColor};
  --inv-action-hover:   ${config.actionHoverBg};
  --inv-footer-bg:      ${config.footerBackgroundColor};
  --inv-footer-text:    ${config.footerTextColor};
  --inv-pag-active-bg:  ${config.paginationActiveBg};
  --inv-pag-active:     ${config.paginationActiveText};
  --inv-pag-border:     ${config.paginationBorderColor};
  --inv-search-bg:      ${config.searchBackgroundColor};
  --inv-search-border:  ${config.searchBorderColor};
  --inv-search-text:    ${config.searchTextColor};
  --inv-search-ph:      ${config.searchPlaceholderColor};
  --inv-radius:         ${config.borderRadius}px;
  --inv-cell-size:      ${config.cellFontSize}px;
  --inv-header-size:    ${config.headerFontSize}px;
}

/* ── Shell ── */
.inv-wrap {
  width: 100%;
  max-width: ${config.tableWidth}px;
  display: flex;
  flex-direction: column;
  background: var(--inv-bg);
  border-radius: var(--inv-radius);
  border: 1px solid var(--inv-border);
  overflow: hidden;
  box-shadow: ${config.showShadow ? "0 8px 40px rgba(0,0,0,0.45)" : "none"};
  font-family: 'Instrument Sans', sans-serif;
}

/* ── Toolbar ── */
.inv__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--inv-toolbar-bg);
  border-bottom: 1px solid var(--inv-toolbar-border);
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* ── Tabs ── */
.inv__tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.inv__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--inv-tab-inactive);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s;
  font-family: 'Instrument Sans', sans-serif;
  letter-spacing: 0.02em;
}
.inv__tab:hover { background: var(--inv-tab-hover); }
.inv__tab--active {
  background: var(--inv-tab-active-bg);
  color: var(--inv-tab-active);
}
.inv__tab-badge {
  background: var(--inv-badge-bg);
  color: var(--inv-badge-text);
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 999px;
}

/* ── Search ── */
.inv__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 200px;
}
.inv__search-icon {
  position: absolute;
  left: 10px;
  pointer-events: none;
  display: flex;
  align-items: center;
}
.inv__search {
  width: 100%;
  background: var(--inv-search-bg);
  border: 1px solid var(--inv-search-border);
  border-radius: calc(var(--inv-radius) * 0.6);
  padding: 6px 12px 6px 32px;
  font-size: 12px;
  color: var(--inv-search-text);
  outline: none;
  font-family: 'Instrument Sans', sans-serif;
  transition: border-color 0.15s;
}
.inv__search:focus { border-color: var(--inv-accent); }
.inv__search::placeholder { color: var(--inv-search-ph); }

/* ── Table scroll wrapper ── */
.inv__scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
}

/* ── Table ── */
.inv__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
}
.inv__thead {
  ${config.stickyHeader ? "position: sticky; top: 0; z-index: 10;" : ""}
}
.inv__th {
  padding: 0 16px;
  height: 44px;
  text-align: left;
  font-size: var(--inv-header-size);
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--inv-header-text);
  background: var(--inv-header-bg);
  border-bottom: 1px solid var(--inv-border);
  white-space: nowrap;
  user-select: none;
}
.inv__th--sort { cursor: pointer; transition: color 0.12s; }
.inv__th--sort:hover { color: var(--inv-accent); }
.inv__th--check { width: 48px; text-align: center; }
.inv__th--right { text-align: right; padding-right: 20px; }
.inv__sort-dim { opacity: 0.35; }

/* ── Rows ── */
.inv__row {
  background: var(--inv-bg);
  border-bottom: 1px solid var(--inv-divider);
  cursor: pointer;
  transition: background 0.1s;
  ${config.animateRows ? "animation: invFadeIn 0.18s ease both;" : ""}
}
.inv__row:hover { background: var(--inv-row-hover); }
.inv__row--alt { background: color-mix(in srgb, var(--inv-bg) 95%, transparent); }
.inv__row--selected { background: var(--inv-row-selected); }

/* ── Cells ── */
.inv__td {
  padding: 12px 16px;
  font-size: var(--inv-cell-size);
  color: var(--inv-cell-text);
  white-space: nowrap;
}
.inv__td--check { text-align: center; width: 48px; }
.inv__td--muted { color: var(--inv-cell-muted); }
.inv__td--actions {
  text-align: right;
  padding-right: 12px;
}

/* ── Invoice number ── */
.inv__num {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--inv-num-color);
}

/* ── Client cell ── */
.inv__client {
  display: flex;
  align-items: center;
  gap: 9px;
}
.inv__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--inv-avatar-bg);
  color: var(--inv-avatar-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

/* ── Amount ── */
.inv__amount {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--inv-cell-text);
}

/* ── Status badge ── */
.inv__badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
}
.inv__badge--paid     { background: var(--inv-paid-bg);    color: var(--inv-paid-text); }
.inv__badge--pending  { background: var(--inv-pending-bg); color: var(--inv-pending-text); }
.inv__badge--overdue  { background: var(--inv-overdue-bg); color: var(--inv-overdue-text); }

/* ── Payment method ── */
.inv__payment {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--inv-payment-text);
}

/* ── Overdue days ── */
.inv__overdue-days {
  font-family: 'DM Mono', monospace;
  font-size: var(--inv-cell-size);
  font-weight: 700;
  color: var(--inv-overdue-days);
}

/* ── Action buttons ── */
.inv__action-btn {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: calc(var(--inv-radius) * 0.5);
  cursor: pointer;
  transition: background 0.12s;
}
.inv__action-btn:hover { background: var(--inv-action-hover); }

/* ── Empty state ── */
.inv__empty {
  text-align: center;
  padding: 48px 20px;
  font-size: 13px;
  color: var(--inv-cell-muted);
}

/* ── Footer ── */
.inv__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--inv-border);
  background: var(--inv-footer-bg);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
}
.inv__footer-info {
  font-size: 12px;
  color: var(--inv-footer-text);
}
.inv__footer-info strong { color: var(--inv-cell-text); }

/* ── Pagination ── */
.inv__pagination { display: flex; align-items: center; gap: 4px; }
.inv__page-ellipsis { font-size: 12px; color: var(--inv-footer-text); padding: 0 4px; }
.inv__page-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--inv-radius) * 0.4);
  border: 1px solid var(--inv-pag-border);
  background: transparent;
  color: var(--inv-footer-text);
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.12s;
  font-family: 'Instrument Sans', sans-serif;
}
.inv__page-btn:hover:not(:disabled) {
  border-color: var(--inv-accent);
  color: var(--inv-accent);
}
.inv__page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.inv__page-btn--active {
  background: var(--inv-pag-active-bg);
  color: var(--inv-pag-active);
  border-color: var(--inv-pag-active-bg);
  font-weight: 700;
}

/* ── Animations ── */
@keyframes invFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
}
