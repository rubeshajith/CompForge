"use client";

// /components/playground/InvoiceTablePreview.tsx

import { useState, useMemo, useRef, useEffect } from "react";
import { InvoiceTableConfig } from "@/lib/invoiceTableConfig";

interface InvoiceTablePreviewProps {
  config: InvoiceTableConfig;
}

type StatusTab = "All" | "Pending" | "Paid" | "Overdue";
type SortField =
  | "invoiceNum"
  | "client"
  | "dateIssued"
  | "amount"
  | "status"
  | null;
type SortDir = "asc" | "desc" | null;
type PaymentMethod =
  | "Visa"
  | "Mastercard"
  | "Wire Transfer"
  | "Apple Pay"
  | "PayPal";

interface Invoice {
  id: number;
  invoiceNum: string;
  clientInitials: string;
  clientName: string;
  dateIssued: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  paymentMethod: PaymentMethod;
  cardLast4?: string;
  daysOverdue?: number;
}

const CLIENTS: { name: string; initials: string }[] = [
  { name: "Apex Labs Inc.", initials: "AL" },
  { name: "NovaSoft Global", initials: "NS" },
  { name: "Blue Rocket Co.", initials: "BR" },
  { name: "Quantum Drive", initials: "QD" },
  { name: "Stellar Systems", initials: "SS" },
  { name: "Forge Digital", initials: "FD" },
  { name: "IronPeak Ltd.", initials: "IP" },
  { name: "ClearWave Inc.", initials: "CW" },
  { name: "Pinnacle Tech", initials: "PT" },
  { name: "Zenith Corp.", initials: "ZC" },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  "Visa",
  "Mastercard",
  "Wire Transfer",
  "Apple Pay",
  "PayPal",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUSES: Invoice["status"][] = ["Paid", "Pending", "Overdue"];
const CARDS = ["4242", "9901", "1234", "5678", "3344"];

function generateInvoices(): Invoice[] {
  const list: Invoice[] = [];
  for (let i = 0; i < 48; i++) {
    const status = STATUSES[(i * 7 + 1) % STATUSES.length];
    const client = CLIENTS[i % CLIENTS.length];
    const pm = PAYMENT_METHODS[(i * 3) % PAYMENT_METHODS.length];
    const month = MONTHS[(i * 5) % 12];
    const day = String(((i * 7 + 1) % 28) + 1).padStart(2, "0");
    const year = i < 24 ? "2024" : "2023";
    const amount = parseFloat((((i * 317.5 + 800) % 9000) + 500).toFixed(2));
    const daysOverdue =
      status === "Overdue" ? ((i * 3 + 2) % 28) + 1 : undefined;
    const cardLast4 =
      pm === "Visa" || pm === "Mastercard"
        ? CARDS[i % CARDS.length]
        : undefined;
    list.push({
      id: i + 1,
      invoiceNum: `INV-${8800 + i}`,
      clientInitials: client.initials,
      clientName: client.name,
      dateIssued: `${month} ${day}, ${year}`,
      amount,
      status,
      paymentMethod: pm,
      cardLast4,
      daysOverdue,
    });
  }
  return list;
}

const ALL_INVOICES = generateInvoices();
const PAGE_SIZE = 10;

// ── SVG icon helpers (inline, no deps) ────────────────────────────────────────
function IconDownload({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconMoreVert({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function IconSearch({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconCreditCard({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconBank({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function IconWallet({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12V22H4a2 2 0 0 1-2-2V6l4-2h14v8z" />
      <line x1="16" y1="12" x2="16" y2="12" strokeWidth="3" />
    </svg>
  );
}

function IconPayPal({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path
        d="M7.5 21H3L6.5 3H13c3 0 5 1.5 4.5 4.5C17 10 14.5 12 11 12H8.5L7.5 21z"
        opacity=".6"
      />
      <path d="M10.5 21H6l3.5-18H16c3 0 5 1.5 4.5 4.5C20 10 17.5 12 14 12h-2.5L10.5 21z" />
    </svg>
  );
}

function PaymentIcon({
  method,
  color,
}: {
  method: PaymentMethod;
  color: string;
}) {
  switch (method) {
    case "Visa":
    case "Mastercard":
      return <IconCreditCard color={color} />;
    case "Wire Transfer":
      return <IconBank color={color} />;
    case "Apple Pay":
      return <IconWallet color={color} />;
    case "PayPal":
      return <IconPayPal color={color} />;
  }
}

function paymentLabel(inv: Invoice): string {
  if (inv.paymentMethod === "Visa") return `Visa •••• ${inv.cardLast4}`;
  if (inv.paymentMethod === "Mastercard")
    return `Mastercard •••• ${inv.cardLast4}`;
  return inv.paymentMethod;
}

function SortArrow({
  field,
  sortField,
  sortDir,
  color,
}: {
  field: string;
  sortField: SortField;
  sortDir: SortDir;
  color: string;
}) {
  const active = sortField === field;
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : "#5a5a72"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: active ? 1 : 0.4 }}
    >
      {(!active || sortDir === "asc") && <polyline points="18 15 12 9 6 15" />}
      {active && sortDir === "desc" && <polyline points="6 9 12 15 18 9" />}
    </svg>
  );
}

export function InvoiceTablePreview({ config }: InvoiceTablePreviewProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const TABS: StatusTab[] = ["All", "Pending", "Paid", "Overdue"];

  const tabCounts = useMemo(() => {
    const counts: Record<StatusTab, number> = {
      All: ALL_INVOICES.length,
      Pending: 0,
      Paid: 0,
      Overdue: 0,
    };
    ALL_INVOICES.forEach((inv) => {
      counts[inv.status]++;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let list = [...ALL_INVOICES];
    if (activeTab !== "All")
      list = list.filter((inv) => inv.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.invoiceNum.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q),
      );
    }
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av: string | number;
        let bv: string | number;
        switch (sortField) {
          case "invoiceNum":
            av = a.invoiceNum;
            bv = b.invoiceNum;
            break;
          case "client":
            av = a.clientName;
            bv = b.clientName;
            break;
          case "dateIssued":
            av = a.dateIssued;
            bv = b.dateIssued;
            break;
          case "amount":
            av = a.amount;
            bv = b.amount;
            break;
          case "status":
            av = a.status;
            bv = b.status;
            break;
          default:
            return 0;
        }
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [activeTab, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const allChecked =
    paginated.length > 0 && paginated.every((inv) => selectedIds.has(inv.id));
  const someChecked =
    paginated.some((inv) => selectedIds.has(inv.id)) && !allChecked;

  function handleSort(field: SortField) {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortField(null);
        setSortDir(null);
      }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  function toggleAll(checked: boolean) {
    if (checked) setSelectedIds(new Set(paginated.map((inv) => inv.id)));
    else setSelectedIds(new Set());
  }

  function toggleRow(id: number) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function statusStyle(status: Invoice["status"]): React.CSSProperties {
    switch (status) {
      case "Paid":
        return { background: config.paidBg, color: config.paidText };
      case "Pending":
        return { background: config.pendingBg, color: config.pendingText };
      case "Overdue":
        return { background: config.overdueBg, color: config.overdueText };
    }
  }

  function pageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  const thBase: React.CSSProperties = {
    padding: "0 16px",
    height: 44,
    textAlign: "left",
    fontSize: config.headerFontSize,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: config.headerTextColor,
    backgroundColor: config.headerBackgroundColor,
    borderBottom: `1px solid ${config.borderColor}`,
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  const thSortable: React.CSSProperties = { ...thBase, cursor: "pointer" };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.tableWidth,
        display: "flex",
        flexDirection: "column",
        background: config.backgroundColor,
        borderRadius: config.borderRadius,
        border: `1px solid ${config.borderColor}`,
        overflow: "hidden",
        boxShadow: config.showShadow ? "0 8px 40px rgba(0,0,0,0.45)" : "none",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: config.toolbarBackgroundColor,
          borderBottom: `1px solid ${config.toolbarBorderColor}`,
          gap: 12,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {/* Status Tabs */}
        {config.showStatusTabs && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 14px",
                    borderRadius: 999,
                    border: "none",
                    background: isActive ? config.tabActiveBg : "transparent",
                    color: isActive
                      ? config.tabActiveText
                      : config.tabInactiveText,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.12s",
                    fontFamily: "'Instrument Sans', sans-serif",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        config.tabHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  {tab}
                  {tab === "All" && (
                    <span
                      style={{
                        background: config.tabBadgeBg,
                        color: config.tabBadgeText,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 999,
                      }}
                    >
                      {tabCounts.All}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        {config.showSearch && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              minWidth: 200,
            }}
          >
            <span
              style={{ position: "absolute", left: 10, pointerEvents: "none" }}
            >
              <IconSearch color={config.searchPlaceholderColor} />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by invoice # or client..."
              style={{
                width: "100%",
                background: config.searchBackgroundColor,
                border: `1px solid ${config.searchBorderColor}`,
                borderRadius: config.borderRadius * 0.6,
                padding: "6px 12px 6px 32px",
                fontSize: 12,
                color: config.searchTextColor,
                outline: "none",
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            />
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}
        >
          <thead
            style={{
              position: config.stickyHeader ? "sticky" : "static",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              {config.showBulkCheckboxes && (
                <th style={{ ...thBase, width: 48, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked;
                    }}
                    onChange={(e) => toggleAll(e.target.checked)}
                    style={{
                      accentColor: config.accentColor,
                      cursor: "pointer",
                      width: 14,
                      height: 14,
                    }}
                  />
                </th>
              )}
              <th style={thSortable} onClick={() => handleSort("invoiceNum")}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Invoice #
                  <SortArrow
                    field="invoiceNum"
                    sortField={sortField}
                    sortDir={sortDir}
                    color={config.accentColor}
                  />
                </span>
              </th>
              <th style={thSortable} onClick={() => handleSort("client")}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Client
                  <SortArrow
                    field="client"
                    sortField={sortField}
                    sortDir={sortDir}
                    color={config.accentColor}
                  />
                </span>
              </th>
              <th style={{ ...thBase }}>Date Issued</th>
              <th style={thSortable} onClick={() => handleSort("amount")}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Amount
                  <SortArrow
                    field="amount"
                    sortField={sortField}
                    sortDir={sortDir}
                    color={config.accentColor}
                  />
                </span>
              </th>
              <th style={thSortable} onClick={() => handleSort("status")}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Status
                  <SortArrow
                    field="status"
                    sortField={sortField}
                    sortDir={sortDir}
                    color={config.accentColor}
                  />
                </span>
              </th>
              <th style={{ ...thBase }}>Payment Method</th>
              <th style={{ ...thBase }}>Days Overdue</th>
              <th style={{ ...thBase, textAlign: "right", paddingRight: 20 }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((inv, idx) => {
              const isSelected = selectedIds.has(inv.id);
              return (
                <tr
                  key={inv.id}
                  onClick={() => config.showBulkCheckboxes && toggleRow(inv.id)}
                  style={{
                    background: isSelected
                      ? config.selectedRowColor
                      : idx % 2 === 1
                        ? `${config.backgroundColor}ee`
                        : config.backgroundColor,
                    borderBottom: `1px solid ${config.dividerColor}`,
                    cursor: config.showBulkCheckboxes ? "pointer" : "default",
                    transition: "background 0.1s",
                    animation: config.animateRows
                      ? `invFadeIn 0.18s ease ${idx * 0.025}s both`
                      : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background =
                        config.rowHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      isSelected
                        ? config.selectedRowColor
                        : idx % 2 === 1
                          ? `${config.backgroundColor}ee`
                          : config.backgroundColor;
                  }}
                >
                  {/* Checkbox */}
                  {config.showBulkCheckboxes && (
                    <td
                      style={{
                        padding: "0 16px",
                        textAlign: "center",
                        width: 48,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(inv.id)}
                        style={{
                          accentColor: config.accentColor,
                          cursor: "pointer",
                          width: 14,
                          height: 14,
                        }}
                      />
                    </td>
                  )}

                  {/* Invoice # */}
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        color: config.invoiceNumColor,
                      }}
                    >
                      {inv.invoiceNum}
                    </span>
                  </td>

                  {/* Client */}
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 9 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: config.avatarBackgroundColor,
                          color: config.avatarTextColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.03em",
                          flexShrink: 0,
                        }}
                      >
                        {inv.clientInitials}
                      </div>
                      <span
                        style={{
                          fontSize: config.cellFontSize,
                          color: config.cellTextColor,
                        }}
                      >
                        {inv.clientName}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: config.cellFontSize,
                      color: config.cellMutedColor,
                    }}
                  >
                    {inv.dateIssued}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 13,
                        fontWeight: 700,
                        color: config.cellTextColor,
                      }}
                    >
                      $
                      {inv.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        ...statusStyle(inv.status),
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <PaymentIcon
                        method={inv.paymentMethod}
                        color={config.paymentIconColor}
                      />
                      <span
                        style={{ fontSize: 12, color: config.paymentTextColor }}
                      >
                        {paymentLabel(inv)}
                      </span>
                    </div>
                  </td>

                  {/* Days Overdue */}
                  <td style={{ padding: "12px 16px" }}>
                    {inv.status === "Overdue" && inv.daysOverdue ? (
                      <span
                        style={{
                          fontSize: config.cellFontSize,
                          fontWeight: 700,
                          color: config.overdueDaysColor,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {inv.daysOverdue} Days
                      </span>
                    ) : (
                      <span
                        style={{ color: config.cellMutedColor, fontSize: 14 }}
                      >
                        —
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 4,
                      }}
                    >
                      {config.showDownloadAction && (
                        <button
                          title="Download Invoice"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            borderRadius: config.borderRadius * 0.5,
                            background: "transparent",
                            cursor: "pointer",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              config.actionHoverBg)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <IconDownload
                            color={config.actionIconColor}
                            size={15}
                          />
                        </button>
                      )}
                      {config.showMoreAction && (
                        <button
                          title="More options"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            borderRadius: config.borderRadius * 0.5,
                            background: "transparent",
                            cursor: "pointer",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              config.actionHoverBg)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <IconMoreVert
                            color={config.actionIconColor}
                            size={15}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "48px 20px",
                    color: config.cellMutedColor,
                    fontSize: 13,
                  }}
                >
                  No invoices match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderTop: `1px solid ${config.borderColor}`,
          background: config.footerBackgroundColor,
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: config.footerTextColor }}>
          Showing{" "}
          <strong style={{ color: config.cellTextColor }}>
            {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </strong>{" "}
          of{" "}
          <strong style={{ color: config.cellTextColor }}>
            {filtered.length}
          </strong>{" "}
          invoices
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <PagBtn
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            active={false}
            config={config}
          >
            «
          </PagBtn>
          <PagBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            active={false}
            config={config}
          >
            ‹
          </PagBtn>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? (
              <span
                key={`e${i}`}
                style={{
                  fontSize: 12,
                  color: config.footerTextColor,
                  padding: "0 4px",
                }}
              >
                …
              </span>
            ) : (
              <PagBtn
                key={pg}
                onClick={() => setCurrentPage(pg as number)}
                disabled={false}
                active={pg === currentPage}
                config={config}
              >
                {pg}
              </PagBtn>
            ),
          )}
          <PagBtn
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            active={false}
            config={config}
          >
            ›
          </PagBtn>
          <PagBtn
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            active={false}
            config={config}
          >
            »
          </PagBtn>
        </div>
      </div>

      <style>{`
        @keyframes invFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function PagBtn({
  children,
  onClick,
  disabled,
  active,
  config,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  active: boolean;
  config: InvoiceTableConfig;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: config.borderRadius * 0.4,
        border: active ? "none" : `1px solid ${config.paginationBorderColor}`,
        background: active ? config.paginationActiveBg : "transparent",
        color: active ? config.paginationActiveText : config.footerTextColor,
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        fontFamily: "'Instrument Sans', sans-serif",
        transition: "all 0.12s",
      }}
    >
      {children}
    </button>
  );
}
