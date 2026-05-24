import { OrderTableConfig } from "./orderTableConfig";

export function generateOrderTableJSX(config: OrderTableConfig): string {
  return `import { Fragment, useMemo, useState } from "react";
import "./OrderTable.css";

const orders = [
  {
    id: "#ORD-9421",
    customer: "Jane Doe",
    email: "jane.doe@example.com",
    date: "Oct 24, 2023 - 14:20",
    total: "$1,240.00",
    status: "Processing",
    initials: "JD",
    items: [
      { name: "Quantum X1 Laptop", sku: "QX1-842", quantity: 1, price: "$899.00" },
      { name: "Pro Audio Headphones", sku: "PA-202", quantity: 1, price: "$299.00" },
      { name: "Wireless Ergonomic Mouse", sku: "WM-045", quantity: 1, price: "$42.00" },
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
      { name: "Studio Docking Station", sku: "DS-118", quantity: 1, price: "$219.20" },
      { name: "USB-C Display Cable", sku: "UC-091", quantity: 3, price: "$77.00" },
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
    items: [{ name: "Desk Mat Pro", sku: "DM-304", quantity: 1, price: "$89.00" }],
  },
  {
    id: "#ORD-9415",
    customer: "Thomas Blunt",
    email: "tb@startup.co",
    date: "Oct 23, 2023 - 09:12",
    total: "$32.50",
    status: "Cancelled",
    initials: "TB",
    items: [{ name: "Replacement Keycap Set", sku: "KC-032", quantity: 1, price: "$32.50" }],
  },
];

export default function OrderTable({ onOrderSelect, onStatusFilter }) {
  const [expandedId, setExpandedId] = useState(${config.expandableRows ? "orders[0].id" : '""'});
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All Statuses" || order.status === statusFilter;
      const searchBlob = \`\${order.id} \${order.customer} \${order.email}\`.toLowerCase();
      return matchesStatus && searchBlob.includes(query.toLowerCase());
    });
  }, [query, statusFilter]);

  const allSelected = filteredOrders.length > 0 && filteredOrders.every((order) => selectedIds.includes(order.id));

  function toggleSelected(orderId) {
    setSelectedIds((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
    onOrderSelect?.(orderId);
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : filteredOrders.map((order) => order.id));
  }

  function handleStatusChange(event) {
    setStatusFilter(event.target.value);
    onStatusFilter?.(event.target.value);
  }

  function toggleExpanded(orderId) {
    ${config.expandableRows ? `setExpandedId((current) => (current === orderId ? "" : orderId));` : `return;`}
  }

  return (
    <div className="ot-wrap">
      ${
        config.showFilters
          ? `<div className="ot-filters">
        <label className="ot-search">
          <span className="ot-search__icon">search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by customer, email or order ID..." />
        </label>
        <select value={statusFilter} onChange={handleStatusChange}>
          <option>All Statuses</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <button className="ot-icon-btn" type="button">filter_list</button>
      </div>`
          : ""
      }
      <div className="ot">
        <div className="ot__scroll">
          <table className="ot__table">
            <thead>
              <tr>
                <th><input checked={allSelected} onChange={toggleAll} type="checkbox" /></th>
                <th>Order ID <span>-</span></th>
                <th>Customer <span>-</span></th>
                <th>Date <span className="ot__sort-active">v</span></th>
                <th className="ot__right">Total <span>-</span></th>
                <th>Status</th>
                <th></th>
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
                    <tr className={isSelected ? "ot__row ot__row--selected" : "ot__row"} onClick={() => toggleExpanded(order.id)}>
                      <td onClick={(event) => event.stopPropagation()}><input checked={isSelected} onChange={() => toggleSelected(order.id)} type="checkbox" /></td>
                      <td className="ot__order-id">{order.id}</td>
                      <td>
                        <div className="ot__customer">
                          ${config.showAvatars ? `<div className="ot__avatar">{order.initials}</div>` : ""}
                          <div><strong>{order.customer}</strong><span>{order.email}</span></div>
                        </div>
                      </td>
                      <td className="ot__muted">{order.date}</td>
                      <td className="ot__right"><strong>{order.total}</strong></td>
                      <td><span className={\`ot__chip ot__chip--\${order.status.toLowerCase()}\`}>{order.status}</span></td>
                      <td className="ot__right"><span className={isExpanded ? "ot__chevron ot__chevron--open" : "ot__chevron"}>v</span></td>
                    </tr>
                    {isExpanded && (
                      <tr className="ot__details-row">
                        <td colSpan="7">
                          <div className="ot__details">
                            <h4>Order Items ({order.items.length})</h4>
                            {order.items.map((item) => (
                              <div className="ot__item" key={item.sku}>
                                <div className="ot__item-main">
                                  <div className="ot__thumb">{item.name.charAt(0)}</div>
                                  <div><strong>{item.name}</strong><span>SKU: {item.sku}</span></div>
                                </div>
                                <strong>{item.quantity} x {item.price}</strong>
                              </div>
                            ))}
                            <div className="ot__summary">
                              <div className="ot__summary-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                              </div>
                              <div className="ot__summary-row">
                                <span>Tax (0%)</span>
                                <span>{formatCurrency(tax)}</span>
                              </div>
                              <div className="ot__summary-row ot__summary-row--total">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
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
        ${
          config.showFooter
            ? `<div className="ot__footer">
          <span>Showing <strong>1 - {filteredOrders.length}</strong> of <strong>1,248</strong> orders</span>
          <div className="ot__pages">
            {["<", "1", "2", "3", "...", "125", ">"].map((page) => (
              <button className={page === "1" ? "ot__page ot__page--active" : "ot__page"} key={page} type="button">{page}</button>
            ))}
          </div>
        </div>`
            : ""
        }
      </div>
    </div>
  );
}

function getOrderSubtotal(order) {
  return order.items.reduce((sum, item) => sum + item.quantity * parseCurrency(item.price), 0);
}

function parseCurrency(value) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}`;
}

export function generateOrderTableCSS(config: OrderTableConfig): string {
  return `.ot-wrap {
  width: 100%;
  max-width: ${config.width}px;
  color: ${config.textColor};
  font-family: Inter, system-ui, sans-serif;
  font-size: ${config.fontSize}px;
}

.ot-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin-bottom: 14px;
  background: ${config.filterBackground};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  box-shadow: ${config.showShadow ? "0 14px 40px rgba(0,0,0,0.22)" : "none"};
}

.ot-search {
  position: relative;
  flex: 1 1 260px;
}

.ot-search__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${config.mutedTextColor};
}

.ot-filters input,
.ot-filters select {
  width: 100%;
  height: 38px;
  color: ${config.textColor};
  background: ${config.inputBackground};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.max(4, config.borderRadius - 4)}px;
  outline: none;
}

.ot-filters input {
  padding: 0 12px 0 42px;
}

.ot-filters select {
  width: auto;
  padding: 0 34px 0 12px;
}

.ot-icon-btn {
  width: 38px;
  height: 38px;
  color: ${config.mutedTextColor};
  background: ${config.inputBackground};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.max(4, config.borderRadius - 4)}px;
  cursor: pointer;
}

.ot {
  overflow: hidden;
  background: ${config.surfaceColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  box-shadow: ${config.showShadow ? "0 18px 54px rgba(0,0,0,0.28)" : "none"};
}

.ot__scroll {
  overflow-x: auto;
}

.ot__table {
  width: 100%;
  min-width: ${config.tableMinWidth}px;
  border-collapse: collapse;
  text-align: left;
}

.ot th {
  padding: 12px 14px;
  color: ${config.headerTextColor};
  background: ${config.headerBackground};
  border-bottom: 1px solid ${config.borderColor};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.ot td {
  padding: 10px 14px;
  height: ${config.rowHeight}px;
  border-bottom: 1px solid ${config.borderColor};
  vertical-align: middle;
  white-space: nowrap;
}

.ot input[type="checkbox"] {
  accent-color: ${config.accentColor};
}

.ot__row {
  cursor: ${config.expandableRows ? "pointer" : "default"};
  transition: background 160ms ease;
}

.ot__row:hover {
  background: ${config.hoverBackground};
}

.ot__row--selected {
  background: ${config.selectedBackground};
}

.ot__right {
  text-align: right;
}

.ot__sort-active,
.ot__order-id {
  color: ${config.accentColor};
}

.ot__order-id {
  font-weight: 800;
}

.ot__muted,
.ot__customer span,
.ot__item span,
.ot__footer {
  color: ${config.mutedTextColor};
}

.ot__customer,
.ot__item-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ot__customer strong,
.ot__customer span,
.ot__item strong,
.ot__item span {
  display: block;
}

.ot__customer span,
.ot__item span {
  font-size: ${config.fontSize - 2}px;
}

.ot__avatar,
.ot__thumb {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: ${config.accentColor};
  background: ${config.selectedBackground};
  border: 1px solid ${config.borderColor};
  font-weight: 800;
}

.ot__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 12px;
}

.ot__thumb {
  width: 44px;
  height: 44px;
  border-radius: ${Math.max(4, config.borderRadius - 4)}px;
}

.ot__chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: ${config.chipRadius}px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ot__chip--processing { color: #0369a1; background: #e0f2fe; }
.ot__chip--shipped { color: #92400e; background: #fef3c7; }
.ot__chip--delivered { color: #166534; background: #dcfce7; }
.ot__chip--cancelled { color: #991b1b; background: #fee2e2; }

.ot__chevron {
  display: inline-block;
  color: ${config.mutedTextColor};
  transition: transform 180ms ease, color 180ms ease;
}

.ot__chevron--open {
  color: ${config.accentColor};
  transform: rotate(180deg);
}

.ot__details-row {
  background: ${config.expandedBackground};
}

.ot__details-row td {
  height: auto;
  padding: 0;
}

.ot__details {
  padding: 22px;
  margin-left: 42px;
  border-left: 2px solid ${config.accentColor};
  animation: ${config.animateRows ? "ot-slide 180ms ease both" : "none"};
}

.ot__details h4 {
  margin: 0 0 14px;
  color: ${config.mutedTextColor};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ot__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${config.borderColor};
}

.ot__summary {
  display: grid;
  gap: 8px;
  width: 256px;
  margin-top: 22px;
  margin-left: auto;
  color: ${config.mutedTextColor};
  font-size: ${config.fontSize - 2}px;
  text-align: right;
}

.ot__summary-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.ot__summary-row--total {
  padding-top: 8px;
  color: ${config.textColor};
  border-top: 1px solid ${config.borderColor};
  font-size: ${config.fontSize}px;
  font-weight: 800;
}

.ot__summary-row--total span:last-child {
  color: ${config.accentColor};
}

.ot__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  background: ${config.filterBackground};
  border-top: 1px solid ${config.borderColor};
  font-size: ${config.fontSize - 2}px;
}

.ot__footer strong {
  color: ${config.textColor};
}

.ot__pages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ot__page {
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  color: ${config.textColor};
  background: ${config.surfaceColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.max(4, config.borderRadius - 5)}px;
  font-weight: 800;
}

.ot__page--active {
  color: ${config.accentTextColor};
  background: ${config.accentColor};
  border-color: ${config.accentColor};
}

@keyframes ot-slide {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 760px) {
  .ot__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}`;
}
