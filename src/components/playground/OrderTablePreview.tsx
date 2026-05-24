"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { OrderTableConfig } from "@/lib/orderTableConfig";

interface OrderTablePreviewProps {
  config: OrderTableConfig;
}

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: OrderStatus;
  initials: string;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: "#ORD-9421",
    customer: "Jane Doe",
    email: "jane.doe@example.com",
    date: "Oct 24, 2023 - 14:20",
    total: "$1,240.00",
    status: "Processing",
    initials: "JD",
    items: [
      {
        name: "Quantum X1 Laptop",
        sku: "QX1-842",
        quantity: 1,
        price: "$899.00",
      },
      {
        name: "Pro Audio Headphones",
        sku: "PA-202",
        quantity: 1,
        price: "$299.00",
      },
      {
        name: "Wireless Ergonomic Mouse",
        sku: "WM-045",
        quantity: 1,
        price: "$42.00",
      },
    ],
  },
  {
    id: "#ORD-9420",
    customer: "Mark Kingston",
    email: "m.king@corp.net",
    date: "Oct 24, 2023 - 11:05",
    total: "$450.20",
    status: "Shipped",
    initials: "MK",
    items: [
      {
        name: "Studio Docking Station",
        sku: "DS-118",
        quantity: 1,
        price: "$219.20",
      },
      {
        name: "USB-C Display Cable",
        sku: "UC-091",
        quantity: 3,
        price: "$77.00",
      },
    ],
  },
  {
    id: "#ORD-9418",
    customer: "Sarah Williams",
    email: "sarah.w@web.com",
    date: "Oct 23, 2023 - 18:45",
    total: "$89.00",
    status: "Delivered",
    initials: "SW",
    items: [
      { name: "Desk Mat Pro", sku: "DM-304", quantity: 1, price: "$89.00" },
    ],
  },
  {
    id: "#ORD-9415",
    customer: "Thomas Blunt",
    email: "tb@startup.co",
    date: "Oct 23, 2023 - 09:12",
    total: "$32.50",
    status: "Cancelled",
    initials: "TB",
    items: [
      {
        name: "Replacement Keycap Set",
        sku: "KC-032",
        quantity: 1,
        price: "$32.50",
      },
    ],
  },
];

const statusStyles: Record<OrderStatus, { background: string; color: string }> =
  {
    Processing: { background: "#e0f2fe", color: "#0369a1" },
    Shipped: { background: "#fef3c7", color: "#92400e" },
    Delivered: { background: "#dcfce7", color: "#166534" },
    Cancelled: { background: "#fee2e2", color: "#991b1b" },
  };

export function OrderTablePreview({ config }: OrderTablePreviewProps) {
  const [expandedId, setExpandedId] = useState(orders[0].id);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    OrderStatus | "All Statuses"
  >("All Statuses");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All Statuses" || order.status === statusFilter;
      const searchBlob =
        `${order.id} ${order.customer} ${order.email}`.toLowerCase();
      return matchesStatus && searchBlob.includes(query.toLowerCase());
    });
  }, [query, statusFilter]);

  const allSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.includes(order.id));

  function toggleSelected(orderId: string) {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : filteredOrders.map((order) => order.id));
  }

  function toggleExpanded(orderId: string) {
    if (!config.expandableRows) return;
    setExpandedId((current) => (current === orderId ? "" : orderId));
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        color: config.textColor,
        fontFamily: "'Instrument Sans', Inter, sans-serif",
        fontSize: config.fontSize,
      }}
    >
      {config.showFilters && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            padding: 14,
            marginBottom: 14,
            background: config.filterBackground,
            border: `1px solid ${config.borderColor}`,
            borderRadius: config.borderRadius,
            boxShadow: config.showShadow
              ? "0 14px 40px rgba(0,0,0,0.22)"
              : "none",
          }}
        >
          <label style={{ position: "relative", flex: "1 1 260px" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: config.mutedTextColor,
              }}
            >
              search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by customer, email or order ID..."
              style={{
                width: "100%",
                height: 38,
                padding: "0 12px 0 42px",
                color: config.textColor,
                background: config.inputBackground,
                border: `1px solid ${config.borderColor}`,
                borderRadius: Math.max(4, config.borderRadius - 4),
                outline: "none",
              }}
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as OrderStatus | "All Statuses",
              )
            }
            style={{
              height: 38,
              padding: "0 34px 0 12px",
              color: config.textColor,
              background: config.inputBackground,
              border: `1px solid ${config.borderColor}`,
              borderRadius: Math.max(4, config.borderRadius - 4),
              outline: "none",
            }}
          >
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button
            type="button"
            style={{
              width: 38,
              height: 38,
              border: `1px solid ${config.borderColor}`,
              borderRadius: Math.max(4, config.borderRadius - 4),
              color: config.mutedTextColor,
              background: config.inputBackground,
              cursor: "pointer",
            }}
          >
            filter_list
          </button>
        </div>
      )}

      <div
        style={{
          overflow: "hidden",
          background: config.surfaceColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: config.borderRadius,
          boxShadow: config.showShadow
            ? "0 18px 54px rgba(0,0,0,0.28)"
            : "none",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: config.tableMinWidth,
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead style={{ background: config.headerBackground }}>
              <tr>
                <th style={headerCell(config)}>
                  <input
                    checked={allSelected}
                    onChange={toggleAll}
                    type="checkbox"
                  />
                </th>
                {["Order ID", "Customer", "Date", "Total", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{
                        ...headerCell(config),
                        textAlign: heading === "Total" ? "right" : "left",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {heading}
                        <span
                          style={{
                            color:
                              heading === "Date"
                                ? config.accentColor
                                : config.mutedTextColor,
                            fontSize: 13,
                          }}
                        >
                          {heading === "Date" ? "v" : "-"}
                        </span>
                      </span>
                    </th>
                  ),
                )}
                <th style={headerCell(config)} />
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                const isSelected = selectedIds.includes(order.id);
                const subtotal = getOrderSubtotal(order);
                const tax = 0;
                const total = subtotal + tax;
                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => toggleExpanded(order.id)}
                      style={{
                        height: config.rowHeight,
                        background: isSelected
                          ? config.selectedBackground
                          : "transparent",
                        cursor: config.expandableRows ? "pointer" : "default",
                        transition: "background 160ms ease",
                      }}
                    >
                      <td
                        style={bodyCell(config)}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          checked={isSelected}
                          onChange={() => toggleSelected(order.id)}
                          type="checkbox"
                        />
                      </td>
                      <td
                        style={{
                          ...bodyCell(config),
                          color: config.accentColor,
                          fontWeight: 700,
                        }}
                      >
                        {order.id}
                      </td>
                      <td style={bodyCell(config)}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {config.showAvatars && (
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                display: "grid",
                                placeItems: "center",
                                flex: "0 0 auto",
                                borderRadius: "50%",
                                color: config.accentColor,
                                background: config.selectedBackground,
                                border: `1px solid ${config.borderColor}`,
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              {order.initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700 }}>
                              {order.customer}
                            </div>
                            <div
                              style={{
                                color: config.mutedTextColor,
                                fontSize: config.fontSize - 2,
                              }}
                            >
                              {order.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          ...bodyCell(config),
                          color: config.mutedTextColor,
                        }}
                      >
                        {order.date}
                      </td>
                      <td
                        style={{
                          ...bodyCell(config),
                          textAlign: "right",
                          fontWeight: 700,
                        }}
                      >
                        {order.total}
                      </td>
                      <td style={bodyCell(config)}>
                        <span style={statusChip(config, order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td
                        style={{
                          ...bodyCell(config),
                          textAlign: "right",
                          color: isExpanded
                            ? config.accentColor
                            : config.mutedTextColor,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 180ms ease",
                          }}
                        >
                          ⏷
                        </span>
                      </td>
                    </tr>
                    {config.expandableRows && isExpanded && (
                      <tr
                        key={`${order.id}-expanded`}
                        style={{ background: config.expandedBackground }}
                      >
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div
                            style={{
                              padding: 22,
                              marginLeft: 42,
                              borderLeft: `2px solid ${config.accentColor}`,
                              animation: config.animateRows
                                ? "orderTableSlide 180ms ease both"
                                : "none",
                            }}
                          >
                            <div
                              style={{
                                marginBottom: 14,
                                color: config.mutedTextColor,
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: "uppercase",
                              }}
                            >
                              Order Items ({order.items.length})
                            </div>
                            <div style={{ display: "grid", gap: 10 }}>
                              {order.items.map((item) => (
                                <div
                                  key={item.sku}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 16,
                                    paddingBottom: 10,
                                    borderBottom: `1px solid ${config.borderColor}`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 12,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 44,
                                        height: 44,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: Math.max(
                                          4,
                                          config.borderRadius - 4,
                                        ),
                                        color: config.accentColor,
                                        background: config.inputBackground,
                                        border: `1px solid ${config.borderColor}`,
                                        fontWeight: 800,
                                      }}
                                    >
                                      {item.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700 }}>
                                        {item.name}
                                      </div>
                                      <div
                                        style={{
                                          color: config.mutedTextColor,
                                          fontSize: config.fontSize - 2,
                                        }}
                                      >
                                        SKU: {item.sku}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.quantity} x {item.price}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 22,
                              }}
                            >
                              <div
                                style={{
                                  width: 256,
                                  display: "grid",
                                  gap: 8,
                                  textAlign: "right",
                                  color: config.mutedTextColor,
                                  fontSize: config.fontSize - 2,
                                }}
                              >
                                <div style={summaryRow()}>
                                  <span>Subtotal</span>
                                  <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div style={summaryRow()}>
                                  <span>Tax (0%)</span>
                                  <span>{formatCurrency(tax)}</span>
                                </div>
                                <div
                                  style={{
                                    ...summaryRow(),
                                    paddingTop: 8,
                                    color: config.textColor,
                                    borderTop: `1px solid ${config.borderColor}`,
                                    fontSize: config.fontSize,
                                    fontWeight: 800,
                                  }}
                                >
                                  <span>Total</span>
                                  <span style={{ color: config.accentColor }}>
                                    {formatCurrency(total)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {config.showFooter && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: 14,
              color: config.mutedTextColor,
              background: config.filterBackground,
              borderTop: `1px solid ${config.borderColor}`,
              fontSize: config.fontSize - 2,
            }}
          >
            <span>
              Showing{" "}
              <strong style={{ color: config.textColor }}>
                1 - {filteredOrders.length}
              </strong>{" "}
              of <strong style={{ color: config.textColor }}>1,248</strong>{" "}
              orders
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {["<", "1", "2", "3", "...", "125", ">"].map((page) => (
                <button
                  key={page}
                  type="button"
                  style={{
                    minWidth: 30,
                    height: 30,
                    padding: "0 8px",
                    border:
                      page === "1" ? "none" : `1px solid ${config.borderColor}`,
                    borderRadius: Math.max(4, config.borderRadius - 5),
                    color:
                      page === "1" ? config.accentTextColor : config.textColor,
                    background:
                      page === "1" ? config.accentColor : config.surfaceColor,
                    fontWeight: 700,
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes orderTableSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="checkbox"] { accent-color: ${config.accentColor}; }
        tr:hover { background: ${config.hoverBackground}; }
      `}</style>
    </div>
  );
}

function getOrderSubtotal(order: Order) {
  return order.items.reduce(
    (sum, item) => sum + item.quantity * parseCurrency(item.price),
    0,
  );
}

function parseCurrency(value: string) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function summaryRow(): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
  };
}

function headerCell(config: OrderTableConfig): CSSProperties {
  return {
    padding: "12px 14px",
    color: config.headerTextColor,
    borderBottom: `1px solid ${config.borderColor}`,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
}

function bodyCell(config: OrderTableConfig): CSSProperties {
  return {
    padding: "10px 14px",
    borderBottom: `1px solid ${config.borderColor}`,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  };
}

function statusChip(
  config: OrderTableConfig,
  status: OrderStatus,
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 9px",
    borderRadius: config.chipRadius,
    color: statusStyles[status].color,
    background: statusStyles[status].background,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };
}
