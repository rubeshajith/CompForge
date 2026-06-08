// /lib/generateProductTableCode.ts

import { DataTableConfig } from "./productTableConfig";

export function generateProductTableJSX(config: DataTableConfig): string {
  const rowHeight =
    config.density === "compact"
      ? 36
      : config.density === "comfortable"
        ? 48
        : 60;

  return `import { useState, useMemo, useRef, useEffect } from "react";
import "./DataTable.css";

// ─── Sample data generator (replace with your real data source) ───────────────
const STATUSES = ["In Stock", "Low Stock", "OOS", "Discontinued"];
const CATEGORIES = ["Electronics", "Home Office", "Hardware", "Networking", "Storage"];
const WAREHOUSES = ["CHI-01", "LAX-04", "NYC-09", "DFW-02"];
const BRANDS = ["PrecisionCore", "NovaTech", "CircuitEdge", "DataForge", "StellarIO"];
const DESCRIPTIONS = [
  "High-performance enterprise-grade controller unit with advanced I/O capabilities.",
  "Next-generation networking interface designed for high-density deployments.",
  "Ultra-low latency storage module with NVMe protocol support.",
];
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80",
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
];

function generateProducts() {
  return Array.from({ length: 48 }, (_, i) => {
    i += 1;
    return {
      id: i,
      sku: \`DEV-SKU-\${1000 + i}\`,
      name: \`\${CATEGORIES[(i * 3) % CATEGORIES.length]} Controller Gen \${(i % 4) + 1}\`,
      category: CATEGORIES[(i * 3) % CATEGORIES.length],
      stock: (i * 37 + 13) % 500,
      price: parseFloat(((i * 47.3 + 49) % 2000 + 49).toFixed(2)),
      status: STATUSES[(i * 7) % STATUSES.length],
      warehouse: WAREHOUSES[(i * 5) % WAREHOUSES.length],
      lastModified: \`2024-\${String(((i % 12) + 1)).padStart(2, "0")}-\${String(((i % 28) + 1)).padStart(2, "0")}\`,
      brand: BRANDS[(i * 11) % BRANDS.length],
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      imageUrl: SAMPLE_IMAGES[(i - 1) % SAMPLE_IMAGES.length],
      warehouseBreakdown: [
        { name: WAREHOUSES[(i * 5) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.6) },
        { name: WAREHOUSES[(i * 13) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.4) },
      ],
    };
  });
}

const ALL_PRODUCTS = generateProducts();
const PAGE_SIZE = 15;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DataTable({ onRowSelect }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeProduct, setActiveProduct] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showColMenu, setShowColMenu] = useState(false);
  const [colVis, setColVis] = useState({
    sku: ${config.columnVisibility.sku},
    name: ${config.columnVisibility.name},
    category: ${config.columnVisibility.category},
    stock: ${config.columnVisibility.stock},
    price: ${config.columnVisibility.price},
    status: ${config.columnVisibility.status},
    warehouse: ${config.columnVisibility.warehouse},
    lastModified: ${config.columnVisibility.lastModified},
  });
  const colMenuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSort(field) {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir(null); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter(p => p.category === categoryFilter);
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [searchQuery, statusFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allChecked = paginated.length > 0 && paginated.every(p => selectedIds.has(p.id));

  function toggleAll(checked) {
    setSelectedIds(checked ? new Set(paginated.map(p => p.id)) : new Set());
  }
  function toggleRow(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }

  function statusStyle(status) {
    switch (status) {
      case "In Stock":     return { background: "${config.inStockBg}",     color: "${config.inStockText}" };
      case "Low Stock":    return { background: "${config.lowStockBg}",    color: "${config.lowStockText}" };
      case "OOS":          return { background: "${config.oosBg}",         color: "${config.oosText}" };
      case "Discontinued": return { background: "${config.discontinuedBg}", color: "${config.discontinuedText}" };
      default:             return {};
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

  const hasBulkBar = ${config.showBulkActions} && selectedIds.size > 0;

  return (
    <div className="dt-wrap">
      {/* Toolbar */}
      <div className="dt__toolbar">
        <div className="dt__toolbar-left">
          <span className="dt__title">Product Catalog</span>
          {statusFilter !== "all" && (
            <span className="dt__chip">
              {statusFilter} <button className="dt__chip-clear" onClick={() => setStatusFilter("all")}>×</button>
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="dt__chip">
              {categoryFilter} <button className="dt__chip-clear" onClick={() => setCategoryFilter("all")}>×</button>
            </span>
          )}
        </div>
        <div className="dt__toolbar-right">
          ${
            config.showSearchBar
              ? `<div className="dt__search-wrap">
            <span className="dt__search-icon">⌕</span>
            <input
              className="dt__search"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search SKU, name…"
            />
          </div>`
              : ""
          }
          <select className="dt__select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Status</option>
            {["In Stock","Low Stock","OOS","Discontinued"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="dt__select" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Categories</option>
            {["Electronics","Home Office","Hardware","Networking","Storage"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          ${
            config.showColumnVisibilityToggle
              ? `<div ref={colMenuRef} className="dt__col-vis-wrap">
            <button className="dt__btn" onClick={() => setShowColMenu(!showColMenu)}>⊞ Columns</button>
            {showColMenu && (
              <div className="dt__col-menu">
                {Object.keys(colVis).map(col => (
                  <label key={col} className="dt__col-label">
                    <input type="checkbox" checked={colVis[col]} onChange={() => setColVis(prev => ({ ...prev, [col]: !prev[col] }))} />
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>`
              : ""
          }
        </div>
      </div>

      {/* Bulk Actions */}
      {hasBulkBar && (
        <div className="dt__bulk-bar">
          <div className="dt__bulk-left">
            <span className="dt__bulk-count">{selectedIds.size} selected</span>
            {["Bulk Update","Change Category","Export Selected"].map(label => (
              <button key={label} className="dt__bulk-btn">{label}</button>
            ))}
            <button className="dt__bulk-btn dt__bulk-btn--danger">Delete</button>
          </div>
          <button className="dt__bulk-close" onClick={() => setSelectedIds(new Set())}>×</button>
        </div>
      )}

      {/* Table + Detail Panel */}
      <div className="dt__body">
        <div className="dt__scroll">
          <table className="dt__table">
            <thead className="dt__thead">
              <tr>
                <th className="dt__th dt__th--check">
                  <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)} />
                </th>
                ${config.showRowNumbers ? '<th className="dt__th">#</th>' : ""}
                {colVis.sku && <th className="dt__th dt__th--sticky" onClick={() => handleSort("sku")}>SKU ID {sortField==="sku" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.name && <th className="dt__th" onClick={() => handleSort("name")}>Product Name {sortField==="name" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.category && <th className="dt__th" onClick={() => handleSort("category")}>Category {sortField==="category" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.stock && <th className="dt__th" onClick={() => handleSort("stock")}>Stock {sortField==="stock" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.price && <th className="dt__th" onClick={() => handleSort("price")}>Price {sortField==="price" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.status && <th className="dt__th" onClick={() => handleSort("status")}>Status {sortField==="status" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.warehouse && <th className="dt__th" onClick={() => handleSort("warehouse")}>Warehouse {sortField==="warehouse" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.lastModified && <th className="dt__th" onClick={() => handleSort("lastModified")}>Modified {sortField==="lastModified" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                <th className="dt__th" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((product, idx) => {
                const isSelected = selectedIds.has(product.id);
                const isActive = activeProduct?.id === product.id;
                const isLow = product.stock < ${config.lowStockThreshold};
                return (
                  <tr
                    key={product.id}
                    className={\`dt__row \${isActive ? "dt__row--active" : ""} \${isSelected ? "dt__row--selected" : ""} \${idx % 2 === 1 ? "dt__row--alt" : ""}\`}
                    onClick={() => { setActiveProduct(isActive ? null : product); onRowSelect?.(isActive ? null : product); }}
                  >
                    <td className="dt__td dt__td--check" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(product.id)} />
                    </td>
                    ${config.showRowNumbers ? "{<td className='dt__td dt__td--num'>{(currentPage-1)*PAGE_SIZE+idx+1}</td>}" : ""}
                    {colVis.sku && <td className="dt__td dt__td--sticky"><span className="dt__sku">{product.sku}</span></td>}
                    {colVis.name && <td className="dt__td dt__td--name">{product.name}</td>}
                    {colVis.category && <td className="dt__td dt__td--muted">{product.category}</td>}
                    {colVis.stock && <td className={\`dt__td dt__td--mono \${isLow ? "dt__td--warn" : ""}\`}>{isLow && "⚠ "}{product.stock.toLocaleString()}</td>}
                    {colVis.price && <td className="dt__td dt__td--mono">\${product.price.toFixed(2)}</td>}
                    {colVis.status && (
                      <td className="dt__td">
                        <span className="dt__badge" style={statusStyle(product.status)}>{product.status}</span>
                      </td>
                    )}
                    {colVis.warehouse && <td className="dt__td dt__td--mono dt__td--muted">{product.warehouse}</td>}
                    {colVis.lastModified && <td className="dt__td dt__td--mono dt__td--muted">{product.lastModified}</td>}
                    <td className="dt__td dt__td--actions"><span className="dt__more">⋮</span></td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={12} className="dt__empty">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {activeProduct && (
          <div className="dt__panel">
            <div className="dt__panel-header">
              <span className="dt__panel-title">SKU Details</span>
              <button className="dt__panel-close" onClick={() => setActiveProduct(null)}>×</button>
            </div>
            <div className="dt__panel-img-wrap">
              <img className="dt__panel-img" src={activeProduct.imageUrl} alt={activeProduct.name}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80"; }} />
            </div>
            <div className="dt__panel-body">
              <div className="dt__panel-name">{activeProduct.name}</div>
              <p className="dt__panel-desc">{activeProduct.description}</p>
              <div className="dt__panel-section-label">General Information</div>
              {[
                { label: "SKU",       value: activeProduct.sku,                  accent: true },
                { label: "Brand",     value: activeProduct.brand },
                { label: "Category",  value: activeProduct.category },
                { label: "Price",     value: \`$\${activeProduct.price.toFixed(2)}\` },
                { label: "Warehouse", value: activeProduct.warehouse },
                { label: "Modified",  value: activeProduct.lastModified },
              ].map(row => (
                <div key={row.label} className="dt__panel-row">
                  <span className="dt__panel-label">{row.label}</span>
                  <span className={\`dt__panel-value \${row.accent ? "dt__panel-value--accent" : ""}\`}>{row.value}</span>
                </div>
              ))}
              <div className="dt__panel-section-label" style={{ marginTop: 14 }}>Status</div>
              <span className="dt__badge" style={{ ...{ background: activeProduct.status === "In Stock" ? "${config.inStockBg}" : activeProduct.status === "Low Stock" ? "${config.lowStockBg}" : activeProduct.status === "OOS" ? "${config.oosBg}" : "${config.discontinuedBg}", color: activeProduct.status === "In Stock" ? "${config.inStockText}" : activeProduct.status === "Low Stock" ? "${config.lowStockText}" : activeProduct.status === "OOS" ? "${config.oosText}" : "${config.discontinuedText}" }, padding: "4px 12px" }}>{activeProduct.status}</span>
              <div className="dt__panel-section-label" style={{ marginTop: 14 }}>Inventory Breakdown</div>
              <div className="dt__panel-inventory">
                {activeProduct.warehouseBreakdown.map((wh, i) => (
                  <div key={i} className="dt__panel-wh">
                    <div className="dt__panel-wh-row">
                      <span>{wh.name}</span><span className="dt__panel-wh-qty">{wh.qty}</span>
                    </div>
                    <div className="dt__panel-bar-bg">
                      <div className="dt__panel-bar-fill" style={{ width: \`\${activeProduct.stock > 0 ? (wh.qty / activeProduct.stock) * 100 : 0}%\`, background: i === 0 ? "${config.accentColor}" : "${config.skuColor}" }} />
                    </div>
                  </div>
                ))}
                <div className="dt__panel-total">
                  <span>Total</span><span>{activeProduct.stock}</span>
                </div>
              </div>
              <button className="dt__panel-action">View Full History Log →</button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="dt__footer">
        <span className="dt__footer-info">
          Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
        </span>
        <div className="dt__pagination">
          <button className="dt__page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? <span key={\`e\${i}\`} className="dt__page-ellipsis">…</span>
            : <button key={pg} className={\`dt__page-btn \${pg === currentPage ? "dt__page-btn--active" : ""}\`} onClick={() => setCurrentPage(pg)}>{pg}</button>
          )}
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          <button className="dt__page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateProductTableCSS(config: DataTableConfig): string {
  const rowHeight =
    config.density === "compact"
      ? 36
      : config.density === "comfortable"
        ? 48
        : 60;

  return `/* DataTable.css — generated by CompForge */

/* ── Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Instrument+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

/* ── Shell ── */
.dt-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${config.tableWidth}px;
  height: 100%;
  background: ${config.backgroundColor};
  border-radius: ${config.borderRadius}px;
  border: 1px solid ${config.borderColor};
  overflow: hidden;
  box-shadow: ${config.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none"};
  font-family: 'Instrument Sans', sans-serif;
}

/* ── Toolbar ── */
.dt__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${config.toolbarBorderColor};
  background: ${config.toolbarBackgroundColor};
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}
.dt__toolbar-left, .dt__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dt__title {
  font-size: 15px;
  font-weight: 700;
  color: ${config.cellTextColor};
  font-family: 'Syne', sans-serif;
}
.dt__chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${config.filterChipBg};
  color: ${config.filterChipText};
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.dt__chip-clear {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  padding: 0;
}

/* ── Toolbar Controls ── */
.dt__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.dt__search-icon {
  position: absolute;
  left: 8px;
  color: ${config.cellMutedColor};
  font-size: 13px;
  pointer-events: none;
}
.dt__search {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  padding: 5px 10px 5px 26px;
  font-size: 12px;
  color: ${config.cellTextColor};
  outline: none;
  width: 160px;
  font-family: 'Instrument Sans', sans-serif;
  transition: border-color 0.15s;
}
.dt__search:focus { border-color: ${config.accentColor}; }
.dt__select {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  padding: 5px 8px;
  font-size: 12px;
  color: ${config.cellTextColor};
  cursor: pointer;
  outline: none;
  font-family: 'Instrument Sans', sans-serif;
}
.dt__btn {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  padding: 5px 10px;
  font-size: 12px;
  color: ${config.cellTextColor};
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  transition: border-color 0.15s;
}
.dt__btn:hover { border-color: ${config.accentColor}; }
.dt__col-vis-wrap { position: relative; }
.dt__col-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: ${config.panelBackgroundColor};
  border: 1px solid ${config.panelBorderColor};
  border-radius: ${config.borderRadius}px;
  padding: 10px 14px;
  z-index: 100;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.dt__col-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 6px;
  font-size: 12px;
  color: ${config.panelValueColor};
}
.dt__col-label input { accent-color: ${config.accentColor}; cursor: pointer; }

/* ── Bulk Bar ── */
.dt__bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: ${config.bulkBarBg};
  flex-shrink: 0;
  animation: dtSlideDown 0.15s ease;
}
.dt__bulk-left { display: flex; align-items: center; gap: 10px; }
.dt__bulk-count { font-weight: 700; font-size: 13px; color: ${config.bulkBarText}; }
.dt__bulk-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  color: ${config.bulkBarText};
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  transition: background 0.12s;
}
.dt__bulk-btn:hover { background: rgba(255,255,255,0.25); }
.dt__bulk-btn--danger {
  background: rgba(248,113,113,0.3);
  border-color: rgba(248,113,113,0.5);
  color: #fecaca;
}
.dt__bulk-close {
  background: none;
  border: none;
  color: ${config.bulkBarText};
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
  line-height: 1;
}

/* ── Body (table + panel) ── */
.dt__body {
  flex: 1;
  overflow: hidden;
  display: flex;
}
.dt__scroll {
  flex: 1;
  overflow: auto;
}

/* ── Table ── */
.dt__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}
.dt__thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
.dt__th {
  padding: 0 10px;
  height: 36px;
  text-align: left;
  font-size: ${config.headerFontSize}px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${config.headerTextColor};
  border-bottom: 1px solid ${config.borderColor};
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background: ${config.headerBackgroundColor};
  transition: color 0.12s;
}
.dt__th:hover { color: ${config.accentColor}; }
.dt__th--check, .dt__th--actions { cursor: default; }
.dt__th--check { width: 40px; text-align: center; }
.dt__th--sticky {
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${config.headerBackgroundColor};
  box-shadow: 4px 0 6px -2px rgba(0,0,0,0.2);
}
.dt__sort-icon { opacity: 0.3; font-size: 10px; }

/* ── Rows ── */
.dt__row {
  height: ${rowHeight}px;
  background: ${config.backgroundColor};
  cursor: pointer;
  border-bottom: 1px solid ${config.dividerColor};
  transition: background 0.1s, outline 0.1s;
}
.dt__row:hover { background: ${config.rowHoverColor}; }
.dt__row--alt { background: ${config.backgroundColor}cc; }
.dt__row--selected { background: ${config.selectedRowColor}; }
.dt__row--active {
  background: ${config.selectedRowColor};
  outline: 1px solid ${config.accentColor};
  outline-offset: -1px;
}

/* ── Cells ── */
.dt__td {
  padding: 0 10px;
  font-size: ${config.cellFontSize}px;
  color: ${config.cellTextColor};
  white-space: nowrap;
}
.dt__td--check { text-align: center; width: 40px; }
.dt__td--num { text-align: center; font-size: 11px; color: ${config.cellMutedColor}; }
.dt__td--sticky {
  position: sticky;
  left: 0;
  z-index: 1;
  background: inherit;
  box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15);
}
.dt__td--name { font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.dt__td--muted { color: ${config.cellMutedColor}; }
.dt__td--mono { font-family: 'DM Mono', monospace; font-size: 12px; }
.dt__td--warn { color: ${config.oosText}; font-weight: 700; }
.dt__td--actions { text-align: center; }
.dt__more { font-size: 16px; color: ${config.cellMutedColor}; opacity: 0.5; }
.dt__sku { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600; color: ${config.skuColor}; }

/* ── Badge ── */
.dt__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Empty state ── */
.dt__empty {
  text-align: center;
  padding: 40px 20px;
  color: ${config.cellMutedColor};
  font-size: 13px;
}

/* ── Detail Panel ── */
.dt__panel {
  width: ${config.detailPanelWidth}px;
  flex-shrink: 0;
  border-left: 1px solid ${config.panelBorderColor};
  background: ${config.panelBackgroundColor};
  overflow-y: auto;
  animation: dtSlideInRight 0.2s ease;
}
.dt__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid ${config.panelBorderColor};
}
.dt__panel-title {
  font-size: 13px;
  font-weight: 700;
  color: ${config.panelHeaderColor};
  font-family: 'Syne', sans-serif;
}
.dt__panel-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${config.cellMutedColor};
  line-height: 1;
  transition: color 0.12s;
}
.dt__panel-close:hover { color: ${config.panelHeaderColor}; }
.dt__panel-img-wrap {
  padding: 14px 14px 0;
}
.dt__panel-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${Math.round(config.borderRadius * 0.8)}px;
  border: 1px solid ${config.panelBorderColor};
  display: block;
}
.dt__panel-body { padding: 14px; }
.dt__panel-name {
  font-size: 14px;
  font-weight: 700;
  color: ${config.panelHeaderColor};
  font-family: 'Syne', sans-serif;
  margin-bottom: 4px;
}
.dt__panel-desc {
  font-size: 11px;
  color: ${config.panelLabelColor};
  line-height: 1.5;
  margin: 0 0 12px;
}
.dt__panel-section-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${config.panelLabelColor};
  margin-bottom: 8px;
}
.dt__panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid ${config.panelBorderColor}40;
}
.dt__panel-label { font-size: 11px; color: ${config.panelLabelColor}; }
.dt__panel-value { font-size: 11px; color: ${config.panelValueColor}; }
.dt__panel-value--accent {
  color: ${config.panelAccentColor};
  font-family: 'DM Mono', monospace;
  font-weight: 700;
}
.dt__panel-inventory {
  background: ${config.backgroundColor};
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  padding: 10px 12px;
  border: 1px solid ${config.borderColor};
  margin-top: 8px;
}
.dt__panel-wh { margin-bottom: 10px; }
.dt__panel-wh-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 11px;
  color: ${config.panelValueColor};
}
.dt__panel-wh-qty { font-family: 'DM Mono', monospace; font-weight: 700; }
.dt__panel-bar-bg {
  height: 3px;
  border-radius: 999px;
  background: ${config.borderColor};
  overflow: hidden;
}
.dt__panel-bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
.dt__panel-total {
  border-top: 1px solid ${config.borderColor};
  margin-top: 10px;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: ${config.panelValueColor};
}
.dt__panel-action {
  width: 100%;
  margin-top: 14px;
  padding: 8px;
  background: transparent;
  border: 1px solid ${config.panelAccentColor};
  border-radius: ${Math.round(config.borderRadius * 0.6)}px;
  color: ${config.panelAccentColor};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  letter-spacing: 0.03em;
  transition: background 0.15s;
}
.dt__panel-action:hover { background: ${config.panelAccentColor}18; }

/* ── Footer / Pagination ── */
.dt__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-top: 1px solid ${config.borderColor};
  background: ${config.footerBackgroundColor};
  flex-shrink: 0;
}
.dt__footer-info { font-size: 11px; color: ${config.footerTextColor}; }
.dt__footer-info strong { color: ${config.cellTextColor}; }
.dt__pagination { display: flex; align-items: center; gap: 4px; }
.dt__page-ellipsis { font-size: 12px; color: ${config.footerTextColor}; padding: 0 4px; }
.dt__page-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${Math.round(config.borderRadius * 0.4)}px;
  border: 1px solid ${config.borderColor};
  background: transparent;
  color: ${config.footerTextColor};
  font-size: 12px;
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  transition: all 0.12s;
}
.dt__page-btn:hover:not(:disabled) {
  border-color: ${config.accentColor};
  color: ${config.accentColor};
}
.dt__page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.dt__page-btn--active {
  background: ${config.paginationActiveBg};
  color: ${config.paginationActiveText};
  border-color: ${config.paginationActiveBg};
  font-weight: 700;
}

/* ── Animations ── */
@keyframes dtSlideDown {
  from { transform: translateY(-8px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes dtSlideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
`;
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateProductTableTSX(config: DataTableConfig): string {
  const rowHeight =
    config.density === "compact"
      ? 36
      : config.density === "comfortable"
        ? 48
        : 60;

  return `import { useState, useMemo, useRef, useEffect } from "react";
import "./DataTable.css";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface WarehouseBreakdown {
  name: string;
  qty: number;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  warehouse: string;
  lastModified: string;
  brand: string;
  description: string;
  imageUrl: string;
  warehouseBreakdown: WarehouseBreakdown[];
}

interface ColVis {
  sku: boolean;
  name: boolean;
  category: boolean;
  stock: boolean;
  price: boolean;
  status: boolean;
  warehouse: boolean;
  lastModified: boolean;
}

interface DataTableProps {
  onRowSelect?: (product: Product | null) => void;
}

// ─── Sample data generator (replace with your real data source) ───────────────
const STATUSES = ["In Stock", "Low Stock", "OOS", "Discontinued"];
const CATEGORIES = ["Electronics", "Home Office", "Hardware", "Networking", "Storage"];
const WAREHOUSES = ["CHI-01", "LAX-04", "NYC-09", "DFW-02"];
const BRANDS = ["PrecisionCore", "NovaTech", "CircuitEdge", "DataForge", "StellarIO"];
const DESCRIPTIONS = [
  "High-performance enterprise-grade controller unit with advanced I/O capabilities.",
  "Next-generation networking interface designed for high-density deployments.",
  "Ultra-low latency storage module with NVMe protocol support.",
];
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80",
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
];

function generateProducts(): Product[] {
  return Array.from({ length: 48 }, (_, i) => {
    i += 1;
    return {
      id: i,
      sku: \`DEV-SKU-\${1000 + i}\`,
      name: \`\${CATEGORIES[(i * 3) % CATEGORIES.length]} Controller Gen \${(i % 4) + 1}\`,
      category: CATEGORIES[(i * 3) % CATEGORIES.length],
      stock: (i * 37 + 13) % 500,
      price: parseFloat(((i * 47.3 + 49) % 2000 + 49).toFixed(2)),
      status: STATUSES[(i * 7) % STATUSES.length],
      warehouse: WAREHOUSES[(i * 5) % WAREHOUSES.length],
      lastModified: \`2024-\${String(((i % 12) + 1)).padStart(2, "0")}-\${String(((i % 28) + 1)).padStart(2, "0")}\`,
      brand: BRANDS[(i * 11) % BRANDS.length],
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      imageUrl: SAMPLE_IMAGES[(i - 1) % SAMPLE_IMAGES.length],
      warehouseBreakdown: [
        { name: WAREHOUSES[(i * 5) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.6) },
        { name: WAREHOUSES[(i * 13) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.4) },
      ],
    };
  });
}

const ALL_PRODUCTS = generateProducts();
const PAGE_SIZE = 15;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DataTable({ onRowSelect }: DataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showColMenu, setShowColMenu] = useState<boolean>(false);
  const [colVis, setColVis] = useState<ColVis>({
    sku: ${config.columnVisibility.sku},
    name: ${config.columnVisibility.name},
    category: ${config.columnVisibility.category},
    stock: ${config.columnVisibility.stock},
    price: ${config.columnVisibility.price},
    status: ${config.columnVisibility.status},
    warehouse: ${config.columnVisibility.warehouse},
    lastModified: ${config.columnVisibility.lastModified},
  });
  const colMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSort(field: string): void {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir(null); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered = useMemo<Product[]>(() => {
    let list = [...ALL_PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter(p => p.category === categoryFilter);
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av: string | number = a[sortField as keyof Product] as string | number;
        let bv: string | number = b[sortField as keyof Product] as string | number;
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [searchQuery, statusFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allChecked = paginated.length > 0 && paginated.every(p => selectedIds.has(p.id));

  function toggleAll(checked: boolean): void {
    setSelectedIds(checked ? new Set(paginated.map(p => p.id)) : new Set());
  }
  function toggleRow(id: number): void {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }

  function statusStyle(status: string): React.CSSProperties {
    switch (status) {
      case "In Stock":     return { background: "${config.inStockBg}",     color: "${config.inStockText}" };
      case "Low Stock":    return { background: "${config.lowStockBg}",    color: "${config.lowStockText}" };
      case "OOS":          return { background: "${config.oosBg}",         color: "${config.oosText}" };
      case "Discontinued": return { background: "${config.discontinuedBg}", color: "${config.discontinuedText}" };
      default:             return {};
    }
  }

  function pageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
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

  const hasBulkBar = ${config.showBulkActions} && selectedIds.size > 0;

  return (
    <div className="dt-wrap">
      {/* Toolbar */}
      <div className="dt__toolbar">
        <div className="dt__toolbar-left">
          <span className="dt__title">Product Catalog</span>
          {statusFilter !== "all" && (
            <span className="dt__chip">
              {statusFilter} <button className="dt__chip-clear" onClick={() => setStatusFilter("all")}>×</button>
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="dt__chip">
              {categoryFilter} <button className="dt__chip-clear" onClick={() => setCategoryFilter("all")}>×</button>
            </span>
          )}
        </div>
        <div className="dt__toolbar-right">
          ${
            config.showSearchBar
              ? `<div className="dt__search-wrap">
            <span className="dt__search-icon">⌕</span>
            <input
              className="dt__search"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search SKU, name…"
            />
          </div>`
              : ""
          }
          <select className="dt__select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Status</option>
            {["In Stock","Low Stock","OOS","Discontinued"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="dt__select" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Categories</option>
            {["Electronics","Home Office","Hardware","Networking","Storage"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          ${
            config.showColumnVisibilityToggle
              ? `<div ref={colMenuRef} className="dt__col-vis-wrap">
            <button className="dt__btn" onClick={() => setShowColMenu(!showColMenu)}>⊞ Columns</button>
            {showColMenu && (
              <div className="dt__col-menu">
                {(Object.keys(colVis) as Array<keyof ColVis>).map(col => (
                  <label key={col} className="dt__col-label">
                    <input type="checkbox" checked={colVis[col]} onChange={() => setColVis(prev => ({ ...prev, [col]: !prev[col] }))} />
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>`
              : ""
          }
        </div>
      </div>

      {/* Bulk Actions */}
      {hasBulkBar && (
        <div className="dt__bulk-bar">
          <div className="dt__bulk-left">
            <span className="dt__bulk-count">{selectedIds.size} selected</span>
            {["Bulk Update","Change Category","Export Selected"].map(label => (
              <button key={label} className="dt__bulk-btn">{label}</button>
            ))}
            <button className="dt__bulk-btn dt__bulk-btn--danger">Delete</button>
          </div>
          <button className="dt__bulk-close" onClick={() => setSelectedIds(new Set())}>×</button>
        </div>
      )}

      {/* Table + Detail Panel */}
      <div className="dt__body">
        <div className="dt__scroll">
          <table className="dt__table">
            <thead className="dt__thead">
              <tr>
                <th className="dt__th dt__th--check">
                  <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)} />
                </th>
                ${config.showRowNumbers ? '<th className="dt__th">#</th>' : ""}
                {colVis.sku && <th className="dt__th dt__th--sticky" onClick={() => handleSort("sku")}>SKU ID {sortField==="sku" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.name && <th className="dt__th" onClick={() => handleSort("name")}>Product Name {sortField==="name" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.category && <th className="dt__th" onClick={() => handleSort("category")}>Category {sortField==="category" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.stock && <th className="dt__th" onClick={() => handleSort("stock")}>Stock {sortField==="stock" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.price && <th className="dt__th" onClick={() => handleSort("price")}>Price {sortField==="price" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.status && <th className="dt__th" onClick={() => handleSort("status")}>Status {sortField==="status" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.warehouse && <th className="dt__th" onClick={() => handleSort("warehouse")}>Warehouse {sortField==="warehouse" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                {colVis.lastModified && <th className="dt__th" onClick={() => handleSort("lastModified")}>Modified {sortField==="lastModified" ? (sortDir==="asc"?"↑":"↓") : <span className="dt__sort-icon">↕</span>}</th>}
                <th className="dt__th" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((product, idx) => {
                const isSelected = selectedIds.has(product.id);
                const isActive = activeProduct?.id === product.id;
                const isLow = product.stock < ${config.lowStockThreshold};
                return (
                  <tr
                    key={product.id}
                    className={\`dt__row \${isActive ? "dt__row--active" : ""} \${isSelected ? "dt__row--selected" : ""} \${idx % 2 === 1 ? "dt__row--alt" : ""}\`}
                    onClick={() => { setActiveProduct(isActive ? null : product); onRowSelect?.(isActive ? null : product); }}
                  >
                    <td className="dt__td dt__td--check" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(product.id)} />
                    </td>
                    ${config.showRowNumbers ? "{<td className='dt__td dt__td--num'>{(currentPage-1)*PAGE_SIZE+idx+1}</td>}" : ""}
                    {colVis.sku && <td className="dt__td dt__td--sticky"><span className="dt__sku">{product.sku}</span></td>}
                    {colVis.name && <td className="dt__td dt__td--name">{product.name}</td>}
                    {colVis.category && <td className="dt__td dt__td--muted">{product.category}</td>}
                    {colVis.stock && <td className={\`dt__td dt__td--mono \${isLow ? "dt__td--warn" : ""}\`}>{isLow && "⚠ "}{product.stock.toLocaleString()}</td>}
                    {colVis.price && <td className="dt__td dt__td--mono">\${product.price.toFixed(2)}</td>}
                    {colVis.status && (
                      <td className="dt__td">
                        <span className="dt__badge" style={statusStyle(product.status)}>{product.status}</span>
                      </td>
                    )}
                    {colVis.warehouse && <td className="dt__td dt__td--mono dt__td--muted">{product.warehouse}</td>}
                    {colVis.lastModified && <td className="dt__td dt__td--mono dt__td--muted">{product.lastModified}</td>}
                    <td className="dt__td dt__td--actions"><span className="dt__more">⋮</span></td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={12} className="dt__empty">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {activeProduct && (
          <div className="dt__panel">
            <div className="dt__panel-header">
              <span className="dt__panel-title">SKU Details</span>
              <button className="dt__panel-close" onClick={() => setActiveProduct(null)}>×</button>
            </div>
            <div className="dt__panel-img-wrap">
              <img className="dt__panel-img" src={activeProduct.imageUrl} alt={activeProduct.name}
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80"; }} />
            </div>
            <div className="dt__panel-body">
              <div className="dt__panel-name">{activeProduct.name}</div>
              <p className="dt__panel-desc">{activeProduct.description}</p>
              <div className="dt__panel-section-label">General Information</div>
              {[
                { label: "SKU",       value: activeProduct.sku,                  accent: true },
                { label: "Brand",     value: activeProduct.brand },
                { label: "Category",  value: activeProduct.category },
                { label: "Price",     value: \`$\${activeProduct.price.toFixed(2)}\` },
                { label: "Warehouse", value: activeProduct.warehouse },
                { label: "Modified",  value: activeProduct.lastModified },
              ].map(row => (
                <div key={row.label} className="dt__panel-row">
                  <span className="dt__panel-label">{row.label}</span>
                  <span className={\`dt__panel-value \${row.accent ? "dt__panel-value--accent" : ""}\`}>{row.value}</span>
                </div>
              ))}
              <div className="dt__panel-section-label" style={{ marginTop: 14 }}>Status</div>
              <span className="dt__badge" style={{ ...{ background: activeProduct.status === "In Stock" ? "${config.inStockBg}" : activeProduct.status === "Low Stock" ? "${config.lowStockBg}" : activeProduct.status === "OOS" ? "${config.oosBg}" : "${config.discontinuedBg}", color: activeProduct.status === "In Stock" ? "${config.inStockText}" : activeProduct.status === "Low Stock" ? "${config.lowStockText}" : activeProduct.status === "OOS" ? "${config.oosText}" : "${config.discontinuedText}" }, padding: "4px 12px" }}>{activeProduct.status}</span>
              <div className="dt__panel-section-label" style={{ marginTop: 14 }}>Inventory Breakdown</div>
              <div className="dt__panel-inventory">
                {activeProduct.warehouseBreakdown.map((wh, i) => (
                  <div key={i} className="dt__panel-wh">
                    <div className="dt__panel-wh-row">
                      <span>{wh.name}</span><span className="dt__panel-wh-qty">{wh.qty}</span>
                    </div>
                    <div className="dt__panel-bar-bg">
                      <div className="dt__panel-bar-fill" style={{ width: \`\${activeProduct.stock > 0 ? (wh.qty / activeProduct.stock) * 100 : 0}%\`, background: i === 0 ? "${config.accentColor}" : "${config.skuColor}" }} />
                    </div>
                  </div>
                ))}
                <div className="dt__panel-total">
                  <span>Total</span><span>{activeProduct.stock}</span>
                </div>
              </div>
              <button className="dt__panel-action">View Full History Log →</button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="dt__footer">
        <span className="dt__footer-info">
          Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
        </span>
        <div className="dt__pagination">
          <button className="dt__page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? <span key={\`e\${i}\`} className="dt__page-ellipsis">…</span>
            : <button key={pg} className={\`dt__page-btn \${pg === currentPage ? "dt__page-btn--active" : ""}\`} onClick={() => setCurrentPage(pg as number)}>{pg}</button>
          )}
          <button className="dt__page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          <button className="dt__page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateProductTableTailwind(config: DataTableConfig): string {
  const rowHeight =
    config.density === "compact"
      ? 36
      : config.density === "comfortable"
        ? 48
        : 60;

  const shadow = config.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";

  const headerFs = config.headerFontSize;
  const cellFs = config.cellFontSize;

  const radiusSm = Math.round(config.borderRadius * 0.4);
  const radiusMd = Math.round(config.borderRadius * 0.6);
  const radiusLg = Math.round(config.borderRadius * 0.8);

  return `import { useState, useMemo, useRef, useEffect, CSSProperties } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface WarehouseBreakdown {
  name: string;
  qty: number;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  warehouse: string;
  lastModified: string;
  brand: string;
  description: string;
  imageUrl: string;
  warehouseBreakdown: WarehouseBreakdown[];
}

interface ColVis {
  sku: boolean;
  name: boolean;
  category: boolean;
  stock: boolean;
  price: boolean;
  status: boolean;
  warehouse: boolean;
  lastModified: boolean;
}

interface DataTableProps {
  onRowSelect?: (product: Product | null) => void;
}

// ─── Sample data generator (replace with your real data source) ───────────────
const STATUSES = ["In Stock", "Low Stock", "OOS", "Discontinued"];
const CATEGORIES = ["Electronics", "Home Office", "Hardware", "Networking", "Storage"];
const WAREHOUSES = ["CHI-01", "LAX-04", "NYC-09", "DFW-02"];
const BRANDS = ["PrecisionCore", "NovaTech", "CircuitEdge", "DataForge", "StellarIO"];
const DESCRIPTIONS = [
  "High-performance enterprise-grade controller unit with advanced I/O capabilities.",
  "Next-generation networking interface designed for high-density deployments.",
  "Ultra-low latency storage module with NVMe protocol support.",
];
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80",
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
];

function generateProducts(): Product[] {
  return Array.from({ length: 48 }, (_, i) => {
    i += 1;
    return {
      id: i,
      sku: \`DEV-SKU-\${1000 + i}\`,
      name: \`\${CATEGORIES[(i * 3) % CATEGORIES.length]} Controller Gen \${(i % 4) + 1}\`,
      category: CATEGORIES[(i * 3) % CATEGORIES.length],
      stock: (i * 37 + 13) % 500,
      price: parseFloat(((i * 47.3 + 49) % 2000 + 49).toFixed(2)),
      status: STATUSES[(i * 7) % STATUSES.length],
      warehouse: WAREHOUSES[(i * 5) % WAREHOUSES.length],
      lastModified: \`2024-\${String(((i % 12) + 1)).padStart(2, "0")}-\${String(((i % 28) + 1)).padStart(2, "0")}\`,
      brand: BRANDS[(i * 11) % BRANDS.length],
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      imageUrl: SAMPLE_IMAGES[(i - 1) % SAMPLE_IMAGES.length],
      warehouseBreakdown: [
        { name: WAREHOUSES[(i * 5) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.6) },
        { name: WAREHOUSES[(i * 13) % WAREHOUSES.length], qty: Math.floor(((i * 37 + 13) % 500) * 0.4) },
      ],
    };
  });
}

const ALL_PRODUCTS = generateProducts();
const PAGE_SIZE = 15;

// ─── CSS variable tokens — update these to reskin the DataTable ───────────────
const dtVars: CSSProperties = {
  "--dt-bg":                   "${config.backgroundColor}",
  "--dt-border":               "${config.borderColor}",
  "--dt-radius":               "${config.borderRadius}px",
  "--dt-accent":               "${config.accentColor}",
  "--dt-sku-color":            "${config.skuColor}",
  "--dt-divider":              "${config.dividerColor}",
  "--dt-row-hover":            "${config.rowHoverColor}",
  "--dt-row-selected":         "${config.selectedRowColor}",
  "--dt-cell-text":            "${config.cellTextColor}",
  "--dt-cell-muted":           "${config.cellMutedColor}",
  "--dt-header-bg":            "${config.headerBackgroundColor}",
  "--dt-header-text":          "${config.headerTextColor}",
  "--dt-toolbar-bg":           "${config.toolbarBackgroundColor}",
  "--dt-toolbar-border":       "${config.toolbarBorderColor}",
  "--dt-chip-bg":              "${config.filterChipBg}",
  "--dt-chip-text":            "${config.filterChipText}",
  "--dt-bulk-bg":              "${config.bulkBarBg}",
  "--dt-bulk-text":            "${config.bulkBarText}",
  "--dt-panel-bg":             "${config.panelBackgroundColor}",
  "--dt-panel-border":         "${config.panelBorderColor}",
  "--dt-panel-header":         "${config.panelHeaderColor}",
  "--dt-panel-label":          "${config.panelLabelColor}",
  "--dt-panel-value":          "${config.panelValueColor}",
  "--dt-panel-accent":         "${config.panelAccentColor}",
  "--dt-footer-bg":            "${config.footerBackgroundColor}",
  "--dt-footer-text":          "${config.footerTextColor}",
  "--dt-pagination-active-bg": "${config.paginationActiveBg}",
  "--dt-pagination-active-fg": "${config.paginationActiveText}",
  "--dt-in-stock-bg":          "${config.inStockBg}",
  "--dt-in-stock-text":        "${config.inStockText}",
  "--dt-low-stock-bg":         "${config.lowStockBg}",
  "--dt-low-stock-text":       "${config.lowStockText}",
  "--dt-oos-bg":               "${config.oosBg}",
  "--dt-oos-text":             "${config.oosText}",
  "--dt-discontinued-bg":      "${config.discontinuedBg}",
  "--dt-discontinued-text":    "${config.discontinuedText}",
} as CSSProperties;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DataTable({ onRowSelect }: DataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showColMenu, setShowColMenu] = useState<boolean>(false);
  const [colVis, setColVis] = useState<ColVis>({
    sku: ${config.columnVisibility.sku},
    name: ${config.columnVisibility.name},
    category: ${config.columnVisibility.category},
    stock: ${config.columnVisibility.stock},
    price: ${config.columnVisibility.price},
    status: ${config.columnVisibility.status},
    warehouse: ${config.columnVisibility.warehouse},
    lastModified: ${config.columnVisibility.lastModified},
  });
  const colMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSort(field: string): void {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir(null); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered = useMemo<Product[]>(() => {
    let list = [...ALL_PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter(p => p.category === categoryFilter);
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av: string | number = a[sortField as keyof Product] as string | number;
        let bv: string | number = b[sortField as keyof Product] as string | number;
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [searchQuery, statusFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allChecked = paginated.length > 0 && paginated.every(p => selectedIds.has(p.id));

  function toggleAll(checked: boolean): void {
    setSelectedIds(checked ? new Set(paginated.map(p => p.id)) : new Set());
  }
  function toggleRow(id: number): void {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }

  function statusBg(status: string): string {
    switch (status) {
      case "In Stock":     return "var(--dt-in-stock-bg)";
      case "Low Stock":    return "var(--dt-low-stock-bg)";
      case "OOS":          return "var(--dt-oos-bg)";
      case "Discontinued": return "var(--dt-discontinued-bg)";
      default:             return "transparent";
    }
  }
  function statusFg(status: string): string {
    switch (status) {
      case "In Stock":     return "var(--dt-in-stock-text)";
      case "Low Stock":    return "var(--dt-low-stock-text)";
      case "OOS":          return "var(--dt-oos-text)";
      case "Discontinued": return "var(--dt-discontinued-text)";
      default:             return "inherit";
    }
  }

  function pageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
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

  const hasBulkBar = ${config.showBulkActions} && selectedIds.size > 0;

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden font-sans"
      style={{ ...dtVars, maxWidth: "${config.tableWidth}px", borderRadius: "var(--dt-radius)", border: "1px solid var(--dt-border)", background: "var(--dt-bg)", boxShadow: "${shadow}" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between flex-wrap gap-2 flex-shrink-0"
        style={{ padding: "10px 14px", borderBottom: "1px solid var(--dt-toolbar-border)", background: "var(--dt-toolbar-bg)" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-bold" style={{ color: "var(--dt-cell-text)", fontFamily: "'Syne', sans-serif" }}>
            Product Catalog
          </span>
          {statusFilter !== "all" && (
            <span
              className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
              style={{ background: "var(--dt-chip-bg)", color: "var(--dt-chip-text)" }}
            >
              {statusFilter}
              <button
                className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0"
                style={{ color: "inherit" }}
                onClick={() => setStatusFilter("all")}
              >×</button>
            </span>
          )}
          {categoryFilter !== "all" && (
            <span
              className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
              style={{ background: "var(--dt-chip-bg)", color: "var(--dt-chip-text)" }}
            >
              {categoryFilter}
              <button
                className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0"
                style={{ color: "inherit" }}
                onClick={() => setCategoryFilter("all")}
              >×</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          ${
            config.showSearchBar
              ? `<div className="relative flex items-center">
            <span className="absolute left-2 text-[13px] pointer-events-none" style={{ color: "var(--dt-cell-muted)" }}>⌕</span>
            <input
              className="pl-6 pr-2.5 py-1.5 text-[12px] outline-none w-40 transition-colors duration-150"
              style={{ background: "var(--dt-bg)", border: "1px solid var(--dt-border)", borderRadius: "${radiusMd}px", color: "var(--dt-cell-text)", fontFamily: "'Instrument Sans', sans-serif" }}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search SKU, name…"
              onFocus={e => (e.target.style.borderColor = "var(--dt-accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--dt-border)")}
            />
          </div>`
              : ""
          }
          <select
            className="text-[12px] cursor-pointer outline-none px-2 py-1.5"
            style={{ background: "var(--dt-bg)", border: "1px solid var(--dt-border)", borderRadius: "${radiusMd}px", color: "var(--dt-cell-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Status</option>
            {["In Stock","Low Stock","OOS","Discontinued"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="text-[12px] cursor-pointer outline-none px-2 py-1.5"
            style={{ background: "var(--dt-bg)", border: "1px solid var(--dt-border)", borderRadius: "${radiusMd}px", color: "var(--dt-cell-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Categories</option>
            {["Electronics","Home Office","Hardware","Networking","Storage"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          ${
            config.showColumnVisibilityToggle
              ? `<div ref={colMenuRef} className="relative">
            <button
              className="text-[12px] cursor-pointer px-2.5 py-1.5 transition-colors duration-150"
              style={{ background: "var(--dt-bg)", border: "1px solid var(--dt-border)", borderRadius: "${radiusMd}px", color: "var(--dt-cell-text)", fontFamily: "'Instrument Sans', sans-serif" }}
              onClick={() => setShowColMenu(!showColMenu)}
              onMouseEnter={e => ((e.target as HTMLButtonElement).style.borderColor = "var(--dt-accent)")}
              onMouseLeave={e => ((e.target as HTMLButtonElement).style.borderColor = "var(--dt-border)")}
            >⊞ Columns</button>
            {showColMenu && (
              <div
                className="absolute right-0 z-[100] min-w-[160px] p-[10px_14px]"
                style={{ top: "calc(100% + 6px)", background: "var(--dt-panel-bg)", border: "1px solid var(--dt-panel-border)", borderRadius: "var(--dt-radius)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
              >
                {(Object.keys(colVis) as Array<keyof ColVis>).map(col => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer mb-1.5 text-[12px]" style={{ color: "var(--dt-panel-value)" }}>
                    <input
                      type="checkbox"
                      checked={colVis[col]}
                      onChange={() => setColVis(prev => ({ ...prev, [col]: !prev[col] }))}
                      style={{ accentColor: "var(--dt-accent)", cursor: "pointer" }}
                    />
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>`
              : ""
          }
        </div>
      </div>

      {/* Bulk Actions */}
      {hasBulkBar && (
        <div
          className="flex items-center justify-between flex-shrink-0 [animation:dtSlideDown_0.15s_ease]"
          style={{ padding: "6px 14px", background: "var(--dt-bulk-bg)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[13px]" style={{ color: "var(--dt-bulk-text)" }}>{selectedIds.size} selected</span>
            {["Bulk Update","Change Category","Export Selected"].map(label => (
              <button
                key={label}
                className="text-[11px] font-bold cursor-pointer px-2.5 py-[3px] transition-[background] duration-[120ms] hover:bg-white/25"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "${radiusMd}px", color: "var(--dt-bulk-text)", fontFamily: "'Instrument Sans', sans-serif" }}
              >{label}</button>
            ))}
            <button
              className="text-[11px] font-bold cursor-pointer px-2.5 py-[3px]"
              style={{ background: "rgba(248,113,113,0.3)", border: "1px solid rgba(248,113,113,0.5)", borderRadius: "${radiusMd}px", color: "#fecaca", fontFamily: "'Instrument Sans', sans-serif" }}
            >Delete</button>
          </div>
          <button
            className="bg-transparent border-none cursor-pointer text-[18px] opacity-70 leading-none"
            style={{ color: "var(--dt-bulk-text)" }}
            onClick={() => setSelectedIds(new Set())}
          >×</button>
        </div>
      )}

      {/* Table + Detail Panel */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="w-10 text-center cursor-default h-9 px-2.5 select-none" style={{ background: "var(--dt-header-bg)", borderBottom: "1px solid var(--dt-border)" }}>
                  <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)} />
                </th>
                ${config.showRowNumbers ? `<th className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms]" style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}>#</th>` : ""}
                {colVis.sku && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] sticky left-0 z-[2] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)", boxShadow: "4px 0 6px -2px rgba(0,0,0,0.2)" }}
                    onClick={() => handleSort("sku")}
                  >SKU ID {sortField==="sku" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.name && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("name")}
                  >Product Name {sortField==="name" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.category && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("category")}
                  >Category {sortField==="category" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.stock && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("stock")}
                  >Stock {sortField==="stock" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.price && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("price")}
                  >Price {sortField==="price" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.status && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("status")}
                  >Status {sortField==="status" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.warehouse && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("warehouse")}
                  >Warehouse {sortField==="warehouse" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                {colVis.lastModified && (
                  <th
                    className="h-9 px-2.5 text-left text-[${headerFs}px] font-bold tracking-[0.07em] uppercase whitespace-nowrap cursor-pointer select-none transition-colors duration-[120ms] hover:text-[var(--dt-accent)]"
                    style={{ background: "var(--dt-header-bg)", color: "var(--dt-header-text)", borderBottom: "1px solid var(--dt-border)" }}
                    onClick={() => handleSort("lastModified")}
                  >Modified {sortField==="lastModified" ? (sortDir==="asc"?"↑":"↓") : <span className="opacity-30 text-[10px]">↕</span>}</th>
                )}
                <th className="h-9 px-2.5 cursor-default" style={{ background: "var(--dt-header-bg)", borderBottom: "1px solid var(--dt-border)" }} />
              </tr>
            </thead>
            <tbody>
              {paginated.map((product, idx) => {
                const isSelected = selectedIds.has(product.id);
                const isActive = activeProduct?.id === product.id;
                const isLow = product.stock < ${config.lowStockThreshold};
                let rowCls = "cursor-pointer transition-[background,outline] duration-100 border-b border-[var(--dt-divider)]";
                if (isActive) rowCls += " outline outline-1 outline-[var(--dt-accent)] -outline-offset-1";
                if (isActive || isSelected) rowCls += " bg-[var(--dt-row-selected)]";
                else if (idx % 2 === 1) rowCls += " bg-[var(--dt-bg)]/80";
                else rowCls += " bg-[var(--dt-bg)]";
                return (
                  <tr
                    key={product.id}
                    className={rowCls}
                    style={{ height: "${rowHeight}px" }}
                    onClick={() => { setActiveProduct(isActive ? null : product); onRowSelect?.(isActive ? null : product); }}
                    onMouseEnter={e => { if (!isActive && !isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "var(--dt-row-hover)"; }}
                    onMouseLeave={e => { if (!isActive && !isSelected) (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 1 ? "color-mix(in srgb, var(--dt-bg) 80%, transparent)" : "var(--dt-bg)"; }}
                  >
                    <td className="px-2.5 text-center w-10" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(product.id)} />
                    </td>
                    ${config.showRowNumbers ? `<td className="px-2.5 text-center text-[11px]" style={{ color: "var(--dt-cell-muted)" }}>{(currentPage-1)*PAGE_SIZE+idx+1}</td>` : ""}
                    {colVis.sku && (
                      <td className="px-2.5 whitespace-nowrap sticky left-0 z-[1] bg-inherit text-[${cellFs}px]" style={{ boxShadow: "4px 0 6px -2px rgba(0,0,0,0.15)" }}>
                        <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--dt-sku-color)" }}>{product.sku}</span>
                      </td>
                    )}
                    {colVis.name && <td className="px-2.5 whitespace-nowrap font-medium max-w-[200px] overflow-hidden text-ellipsis text-[${cellFs}px]" style={{ color: "var(--dt-cell-text)" }}>{product.name}</td>}
                    {colVis.category && <td className="px-2.5 whitespace-nowrap text-[${cellFs}px]" style={{ color: "var(--dt-cell-muted)" }}>{product.category}</td>}
                    {colVis.stock && (
                      <td className={\`px-2.5 whitespace-nowrap font-mono text-[12px] \${isLow ? "font-bold" : ""}\`} style={{ color: isLow ? "var(--dt-oos-text)" : "var(--dt-cell-text)" }}>
                        {isLow && "⚠ "}{product.stock.toLocaleString()}
                      </td>
                    )}
                    {colVis.price && <td className="px-2.5 whitespace-nowrap font-mono text-[12px]" style={{ color: "var(--dt-cell-text)" }}>\${product.price.toFixed(2)}</td>}
                    {colVis.status && (
                      <td className="px-2.5 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-[0.06em] uppercase whitespace-nowrap"
                          style={{ background: statusBg(product.status), color: statusFg(product.status) }}
                        >{product.status}</span>
                      </td>
                    )}
                    {colVis.warehouse && <td className="px-2.5 whitespace-nowrap font-mono text-[12px]" style={{ color: "var(--dt-cell-muted)" }}>{product.warehouse}</td>}
                    {colVis.lastModified && <td className="px-2.5 whitespace-nowrap font-mono text-[12px]" style={{ color: "var(--dt-cell-muted)" }}>{product.lastModified}</td>}
                    <td className="px-2.5 text-center">
                      <span className="text-[16px] opacity-50" style={{ color: "var(--dt-cell-muted)" }}>⋮</span>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center py-10 text-[13px]" style={{ color: "var(--dt-cell-muted)" }}>
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {activeProduct && (
          <div
            className="flex-shrink-0 overflow-y-auto [animation:dtSlideInRight_0.2s_ease]"
            style={{ width: "${config.detailPanelWidth}px", borderLeft: "1px solid var(--dt-panel-border)", background: "var(--dt-panel-bg)" }}
          >
            <div className="flex items-center justify-between px-3.5 py-3" style={{ borderBottom: "1px solid var(--dt-panel-border)" }}>
              <span className="text-[13px] font-bold" style={{ color: "var(--dt-panel-header)", fontFamily: "'Syne', sans-serif" }}>SKU Details</span>
              <button
                className="bg-transparent border-none cursor-pointer text-[18px] leading-none transition-colors duration-[120ms]"
                style={{ color: "var(--dt-cell-muted)" }}
                onClick={() => setActiveProduct(null)}
                onMouseEnter={e => ((e.target as HTMLButtonElement).style.color = "var(--dt-panel-header)")}
                onMouseLeave={e => ((e.target as HTMLButtonElement).style.color = "var(--dt-cell-muted)")}
              >×</button>
            </div>
            <div className="p-3.5 pb-0">
              <img
                className="w-full object-cover block"
                style={{ aspectRatio: "1", borderRadius: "${radiusLg}px", border: "1px solid var(--dt-panel-border)" }}
                src={activeProduct.imageUrl}
                alt={activeProduct.name}
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80"; }}
              />
            </div>
            <div className="p-3.5">
              <div className="text-[14px] font-bold mb-1" style={{ color: "var(--dt-panel-header)", fontFamily: "'Syne', sans-serif" }}>{activeProduct.name}</div>
              <p className="text-[11px] leading-[1.5] m-0 mb-3" style={{ color: "var(--dt-panel-label)" }}>{activeProduct.description}</p>
              <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase mb-2" style={{ color: "var(--dt-panel-label)" }}>General Information</div>
              {[
                { label: "SKU",       value: activeProduct.sku,                  accent: true },
                { label: "Brand",     value: activeProduct.brand },
                { label: "Category",  value: activeProduct.category },
                { label: "Price",     value: \`$\${activeProduct.price.toFixed(2)}\` },
                { label: "Warehouse", value: activeProduct.warehouse },
                { label: "Modified",  value: activeProduct.lastModified },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid color-mix(in srgb, var(--dt-panel-border) 25%, transparent)" }}>
                  <span className="text-[11px]" style={{ color: "var(--dt-panel-label)" }}>{row.label}</span>
                  <span className={\`text-[11px] \${row.accent ? "font-mono font-bold" : ""}\`} style={{ color: row.accent ? "var(--dt-panel-accent)" : "var(--dt-panel-value)" }}>{row.value}</span>
                </div>
              ))}
              <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase mt-3.5 mb-2" style={{ color: "var(--dt-panel-label)" }}>Status</div>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold tracking-[0.06em] uppercase whitespace-nowrap"
                style={{ background: statusBg(activeProduct.status), color: statusFg(activeProduct.status) }}
              >{activeProduct.status}</span>
              <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase mt-3.5 mb-2" style={{ color: "var(--dt-panel-label)" }}>Inventory Breakdown</div>
              <div className="mt-2 p-[10px_12px]" style={{ background: "var(--dt-bg)", borderRadius: "${radiusMd}px", border: "1px solid var(--dt-border)" }}>
                {activeProduct.warehouseBreakdown.map((wh, i) => (
                  <div key={i} className="mb-2.5">
                    <div className="flex justify-between mb-1 text-[11px]" style={{ color: "var(--dt-panel-value)" }}>
                      <span>{wh.name}</span>
                      <span className="font-mono font-bold">{wh.qty}</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "var(--dt-border)" }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: \`\${activeProduct.stock > 0 ? (wh.qty / activeProduct.stock) * 100 : 0}%\`, background: i === 0 ? "var(--dt-accent)" : "var(--dt-sku-color)" }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-[11px] font-bold pt-2 mt-2.5" style={{ borderTop: "1px solid var(--dt-border)", color: "var(--dt-panel-value)" }}>
                  <span>Total</span><span>{activeProduct.stock}</span>
                </div>
              </div>
              <button
                className="w-full mt-3.5 py-2 bg-transparent text-[12px] font-bold cursor-pointer tracking-[0.03em] transition-[background] duration-150"
                style={{ border: "1px solid var(--dt-panel-accent)", borderRadius: "${radiusMd}px", color: "var(--dt-panel-accent)", fontFamily: "'Instrument Sans', sans-serif" }}
                onMouseEnter={e => ((e.target as HTMLButtonElement).style.background = "color-mix(in srgb, var(--dt-panel-accent) 9%, transparent)")}
                onMouseLeave={e => ((e.target as HTMLButtonElement).style.background = "transparent")}
              >View Full History Log →</button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ padding: "8px 14px", borderTop: "1px solid var(--dt-border)", background: "var(--dt-footer-bg)" }}
      >
        <span className="text-[11px]" style={{ color: "var(--dt-footer-text)" }}>
          Showing{" "}
          <strong style={{ color: "var(--dt-cell-text)" }}>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong>
          {" "}of{" "}
          <strong style={{ color: "var(--dt-cell-text)" }}>{filtered.length}</strong>
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-[26px] h-[26px] flex items-center justify-center text-[12px] cursor-pointer transition-all duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: "${radiusSm}px", border: "1px solid var(--dt-border)", background: "transparent", color: "var(--dt-footer-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
          >«</button>
          <button
            className="w-[26px] h-[26px] flex items-center justify-center text-[12px] cursor-pointer transition-all duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: "${radiusSm}px", border: "1px solid var(--dt-border)", background: "transparent", color: "var(--dt-footer-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
          >‹</button>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? (
              <span key={\`e\${i}\`} className="text-[12px] px-1" style={{ color: "var(--dt-footer-text)" }}>…</span>
            ) : (
              <button
                key={pg}
                className="w-[26px] h-[26px] flex items-center justify-center text-[12px] cursor-pointer transition-all duration-[120ms]"
                style={{
                  borderRadius: "${radiusSm}px",
                  border: pg === currentPage ? "1px solid var(--dt-pagination-active-bg)" : "1px solid var(--dt-border)",
                  background: pg === currentPage ? "var(--dt-pagination-active-bg)" : "transparent",
                  color: pg === currentPage ? "var(--dt-pagination-active-fg)" : "var(--dt-footer-text)",
                  fontWeight: pg === currentPage ? 700 : 400,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
                onClick={() => setCurrentPage(pg as number)}
              >{pg}</button>
            )
          )}
          <button
            className="w-[26px] h-[26px] flex items-center justify-center text-[12px] cursor-pointer transition-all duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: "${radiusSm}px", border: "1px solid var(--dt-border)", background: "transparent", color: "var(--dt-footer-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
          >›</button>
          <button
            className="w-[26px] h-[26px] flex items-center justify-center text-[12px] cursor-pointer transition-all duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: "${radiusSm}px", border: "1px solid var(--dt-border)", background: "transparent", color: "var(--dt-footer-text)", fontFamily: "'Instrument Sans', sans-serif" }}
            onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
          >»</button>
        </div>
      </div>
    </div>
  );
}`;
}
