"use client";

// /components/playground/ProductTablePreview.tsx

import { useState, useMemo, useRef, useEffect } from "react";
import { DataTableConfig } from "@/lib/productTableConfig";

interface ProductTablePreviewProps {
  config: DataTableConfig;
}

type SortDirection = "asc" | "desc" | null;
type SortField =
  | "sku"
  | "name"
  | "category"
  | "stock"
  | "price"
  | "status"
  | "warehouse"
  | "lastModified"
  | null;

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: "In Stock" | "Low Stock" | "OOS" | "Discontinued";
  warehouse: string;
  lastModified: string;
  brand: string;
  description: string;
  imageUrl: string;
  warehouseBreakdown: { name: string; qty: number }[];
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80",
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
];

const CATEGORIES = [
  "Electronics",
  "Home Office",
  "Hardware",
  "Networking",
  "Storage",
];
const WAREHOUSES = ["CHI-01", "LAX-04", "NYC-09", "DFW-02"];
const STATUSES: Product["status"][] = [
  "In Stock",
  "Low Stock",
  "OOS",
  "Discontinued",
];
const BRANDS = [
  "PrecisionCore",
  "NovaTech",
  "CircuitEdge",
  "DataForge",
  "StellarIO",
];
const DESCRIPTIONS = [
  "High-performance enterprise-grade controller unit with advanced I/O capabilities.",
  "Next-generation networking interface designed for high-density deployments.",
  "Ultra-low latency storage module with NVMe protocol support.",
  "Professional-grade hardware accelerator for compute-intensive workloads.",
  "Modular rack-mount unit with redundant power and hot-swap support.",
];

function generateProducts(): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= 48; i++) {
    const status = STATUSES[Math.floor((i * 7) % STATUSES.length)];
    const cat = CATEGORIES[Math.floor((i * 3) % CATEGORIES.length)];
    const wh = WAREHOUSES[Math.floor((i * 5) % WAREHOUSES.length)];
    const stock = Math.floor((i * 37 + 13) % 500);
    const price = parseFloat((((i * 47.3 + 49) % 2000) + 49).toFixed(2));
    const brand = BRANDS[Math.floor((i * 11) % BRANDS.length)];
    const img = SAMPLE_IMAGES[Math.floor((i - 1) % SAMPLE_IMAGES.length)];
    const wh2 = WAREHOUSES[Math.floor((i * 13) % WAREHOUSES.length)];
    products.push({
      id: i,
      sku: `DEV-SKU-${1000 + i}`,
      name: `${cat} Controller Gen ${(i % 4) + 1}`,
      category: cat,
      stock,
      price,
      status,
      warehouse: wh,
      lastModified: `2024-${String(Math.floor((i % 12) + 1)).padStart(2, "0")}-${String(Math.floor((i % 28) + 1)).padStart(2, "0")}`,
      brand,
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      imageUrl: img,
      warehouseBreakdown: [
        { name: wh, qty: Math.floor(stock * 0.6) },
        { name: wh2, qty: Math.floor(stock * 0.4) },
      ],
    });
  }
  return products;
}

const ALL_PRODUCTS = generateProducts();

export function ProductTablePreview({ config }: ProductTablePreviewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showColMenu, setShowColMenu] = useState(false);
  const [colVis, setColVis] = useState(config.columnVisibility);
  const colMenuRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 15;

  // Sync colVis when config changes externally
  useEffect(() => {
    setColVis(config.columnVisibility);
  }, [config.columnVisibility]);

  // Outside click to close col visibility menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        colMenuRef.current &&
        !colMenuRef.current.contains(e.target as Node)
      ) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const rowHeight =
    config.density === "compact"
      ? 36
      : config.density === "comfortable"
        ? 48
        : 60;

  function getStatusStyle(status: Product["status"]) {
    switch (status) {
      case "In Stock":
        return { background: config.inStockBg, color: config.inStockText };
      case "Low Stock":
        return { background: config.lowStockBg, color: config.lowStockText };
      case "OOS":
        return { background: config.oosBg, color: config.oosText };
      case "Discontinued":
        return {
          background: config.discontinuedBg,
          color: config.discontinuedText,
        };
    }
  }

  function handleSort(field: SortField) {
    if (!config.showSortIndicators) return;
    if (sortField === field) {
      setSortDir(
        sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc",
      );
      if (sortDir === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (!config.showSortIndicators) return null;
    if (sortField !== field)
      return <span style={{ opacity: 0.3, fontSize: 10 }}>↕</span>;
    return (
      <span style={{ fontSize: 10, color: config.accentColor }}>
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  }

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.sku.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all")
      list = list.filter((p) => p.status === statusFilter);
    if (categoryFilter !== "all")
      list = list.filter((p) => p.category === categoryFilter);
    if (sortField && sortDir) {
      list.sort((a, b) => {
        let av: number | string = a[sortField as keyof Product] as
          | number
          | string;
        let bv: number | string = b[sortField as keyof Product] as
          | number
          | string;
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
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function toggleRow(id: number) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleAll(checked: boolean) {
    if (checked) setSelectedIds(new Set(paginated.map((p) => p.id)));
    else setSelectedIds(new Set());
  }

  const allChecked =
    paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id));
  const someChecked =
    paginated.some((p) => selectedIds.has(p.id)) && !allChecked;

  const hasBulkBar = config.showBulkActions && selectedIds.size > 0;

  // Generate page numbers
  function pageNumbers() {
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

  const stickyColStyle: React.CSSProperties = config.stickyFirstColumn
    ? { position: "sticky", left: 0, zIndex: 2, backgroundColor: "inherit" }
    : {};

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: config.tableWidth,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: config.backgroundColor,
    borderRadius: config.borderRadius,
    border: `1px solid ${config.borderColor}`,
    overflow: "hidden",
    boxShadow: config.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
  };

  const thStyle = (field: SortField): React.CSSProperties => ({
    padding: "0 10px",
    height: 36,
    textAlign: "left",
    fontSize: config.headerFontSize,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: sortField === field ? config.accentColor : config.headerTextColor,
    borderBottom: `1px solid ${config.borderColor}`,
    whiteSpace: "nowrap",
    cursor: config.showSortIndicators ? "pointer" : "default",
    userSelect: "none",
    backgroundColor: config.headerBackgroundColor,
  });

  return (
    <div style={containerStyle}>
      {/* ─── Toolbar ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: `1px solid ${config.toolbarBorderColor}`,
          background: config.toolbarBackgroundColor,
          flexWrap: "wrap",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: config.cellTextColor,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Product Catalog
          </span>
          <div
            style={{ width: 1, height: 18, background: config.borderColor }}
          />
          {/* Active filters */}
          {statusFilter !== "all" && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: config.filterChipBg,
                color: config.filterChipText,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 99,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {statusFilter}
              <span
                style={{ cursor: "pointer", fontSize: 12, lineHeight: 1 }}
                onClick={() => setStatusFilter("all")}
              >
                ×
              </span>
            </span>
          )}
          {categoryFilter !== "all" && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: config.filterChipBg,
                color: config.filterChipText,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 99,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {categoryFilter}
              <span
                style={{ cursor: "pointer", fontSize: 12, lineHeight: 1 }}
                onClick={() => setCategoryFilter("all")}
              >
                ×
              </span>
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search */}
          {config.showSearchBar && (
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 8,
                  color: config.cellMutedColor,
                  fontSize: 13,
                  pointerEvents: "none",
                }}
              >
                ⌕
              </span>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search SKU, name…"
                style={{
                  background: config.backgroundColor,
                  border: `1px solid ${config.borderColor}`,
                  borderRadius: config.borderRadius * 0.6,
                  padding: "5px 10px 5px 26px",
                  fontSize: 12,
                  color: config.cellTextColor,
                  outline: "none",
                  width: 160,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              />
            </div>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: config.backgroundColor,
              border: `1px solid ${config.borderColor}`,
              borderRadius: config.borderRadius * 0.6,
              padding: "5px 8px",
              fontSize: 12,
              color: config.cellTextColor,
              cursor: "pointer",
              outline: "none",
              fontFamily: "'Instrument Sans', sans-serif",
            }}
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: config.backgroundColor,
              border: `1px solid ${config.borderColor}`,
              borderRadius: config.borderRadius * 0.6,
              padding: "5px 8px",
              fontSize: 12,
              color: config.cellTextColor,
              cursor: "pointer",
              outline: "none",
              fontFamily: "'Instrument Sans', sans-serif",
            }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Column Visibility */}
          {config.showColumnVisibilityToggle && (
            <div ref={colMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                style={{
                  background: config.backgroundColor,
                  border: `1px solid ${config.borderColor}`,
                  borderRadius: config.borderRadius * 0.6,
                  padding: "5px 10px",
                  fontSize: 12,
                  color: config.cellTextColor,
                  cursor: "pointer",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                ⊞ Columns
              </button>
              {showColMenu && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 6px)",
                    background: config.panelBackgroundColor,
                    border: `1px solid ${config.panelBorderColor}`,
                    borderRadius: config.borderRadius,
                    padding: "10px 14px",
                    zIndex: 100,
                    minWidth: 160,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: config.panelLabelColor,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Toggle Columns
                  </div>
                  {(Object.keys(colVis) as (keyof typeof colVis)[]).map(
                    (col) => (
                      <label
                        key={col}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          marginBottom: 6,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={colVis[col]}
                          onChange={() =>
                            setColVis((prev) => ({
                              ...prev,
                              [col]: !prev[col],
                            }))
                          }
                          style={{
                            accentColor: config.accentColor,
                            cursor: "pointer",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: config.panelValueColor,
                            textTransform: "capitalize",
                          }}
                        >
                          {col}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Bulk Action Bar ─── */}
      {hasBulkBar && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 14px",
            background: config.bulkBarBg,
            flexShrink: 0,
            animation: config.animateDetailPanel
              ? "slideDown 0.15s ease"
              : undefined,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: config.bulkBarText,
              }}
            >
              {selectedIds.size} selected
            </span>
            {["Bulk Update", "Change Category", "Export Selected"].map(
              (label) => (
                <button
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: config.borderRadius * 0.6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: config.bulkBarText,
                    cursor: "pointer",
                    fontFamily: "'Instrument Sans', sans-serif",
                  }}
                >
                  {label}
                </button>
              ),
            )}
            <button
              style={{
                background: "rgba(248,113,113,0.3)",
                border: "1px solid rgba(248,113,113,0.5)",
                borderRadius: config.borderRadius * 0.6,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#fecaca",
                cursor: "pointer",
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            >
              Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              background: "none",
              border: "none",
              color: config.bulkBarText,
              cursor: "pointer",
              fontSize: 16,
              opacity: 0.7,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ─── Table Scroll Wrapper ─── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
        <div style={{ flex: 1, overflow: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
          >
            <thead
              style={{
                position: config.stickyHeader ? "sticky" : "static",
                top: 0,
                zIndex: 10,
              }}
            >
              <tr>
                {/* Checkbox */}
                <th
                  style={{
                    ...thStyle(null),
                    width: 40,
                    textAlign: "center",
                    ...stickyColStyle,
                    zIndex: config.stickyFirstColumn ? 12 : undefined,
                  }}
                >
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
                      width: 13,
                      height: 13,
                    }}
                  />
                </th>

                {config.showRowNumbers && (
                  <th
                    style={{
                      ...thStyle(null),
                      width: 36,
                      color: config.headerTextColor,
                    }}
                  >
                    #
                  </th>
                )}

                {/* SKU */}
                {colVis.sku && (
                  <th
                    style={{ ...thStyle("sku"), ...stickyColStyle }}
                    onClick={() => handleSort("sku")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      SKU ID <SortIcon field="sku" />
                    </span>
                  </th>
                )}
                {colVis.name && (
                  <th
                    style={{ ...thStyle("name") }}
                    onClick={() => handleSort("name")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Product Name <SortIcon field="name" />
                    </span>
                  </th>
                )}
                {colVis.category && (
                  <th
                    style={{ ...thStyle("category") }}
                    onClick={() => handleSort("category")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Category <SortIcon field="category" />
                    </span>
                  </th>
                )}
                {colVis.stock && (
                  <th
                    style={{ ...thStyle("stock") }}
                    onClick={() => handleSort("stock")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Stock <SortIcon field="stock" />
                    </span>
                  </th>
                )}
                {colVis.price && (
                  <th
                    style={{ ...thStyle("price") }}
                    onClick={() => handleSort("price")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Price <SortIcon field="price" />
                    </span>
                  </th>
                )}
                {colVis.status && (
                  <th
                    style={{ ...thStyle("status") }}
                    onClick={() => handleSort("status")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Status <SortIcon field="status" />
                    </span>
                  </th>
                )}
                {colVis.warehouse && (
                  <th
                    style={{ ...thStyle("warehouse") }}
                    onClick={() => handleSort("warehouse")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Warehouse <SortIcon field="warehouse" />
                    </span>
                  </th>
                )}
                {colVis.lastModified && (
                  <th
                    style={{ ...thStyle("lastModified") }}
                    onClick={() => handleSort("lastModified")}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Modified <SortIcon field="lastModified" />
                    </span>
                  </th>
                )}
                <th style={{ ...thStyle(null), width: 36 }} />
              </tr>
            </thead>

            <tbody>
              {paginated.map((product, idx) => {
                const isSelected = selectedIds.has(product.id);
                const isActive = activeProduct?.id === product.id;
                const isLow = product.stock < config.lowStockThreshold;
                return (
                  <tr
                    key={product.id}
                    onClick={() => setActiveProduct(isActive ? null : product)}
                    style={{
                      height: rowHeight,
                      backgroundColor: isActive
                        ? config.selectedRowColor
                        : isSelected
                          ? config.selectedRowColor
                          : idx % 2 === 1
                            ? `${config.backgroundColor}cc`
                            : config.backgroundColor,
                      cursor: "pointer",
                      transition: "background 0.12s",
                      borderBottom: `1px solid ${config.dividerColor}`,
                      outline: isActive
                        ? `1px solid ${config.accentColor}`
                        : "none",
                      outlineOffset: -1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          config.rowHoverColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        isActive
                          ? config.selectedRowColor
                          : isSelected
                            ? config.selectedRowColor
                            : idx % 2 === 1
                              ? `${config.backgroundColor}cc`
                              : config.backgroundColor;
                    }}
                  >
                    {/* Checkbox */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0 10px",
                        ...stickyColStyle,
                        backgroundColor: "inherit",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(product.id)}
                        style={{
                          accentColor: config.accentColor,
                          cursor: "pointer",
                          width: 13,
                          height: 13,
                        }}
                      />
                    </td>

                    {config.showRowNumbers && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontSize: 11,
                          color: config.cellMutedColor,
                          textAlign: "center",
                        }}
                      >
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                    )}

                    {colVis.sku && (
                      <td
                        style={{
                          padding: "0 10px",
                          ...stickyColStyle,
                          backgroundColor: "inherit",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            fontWeight: 600,
                            color: config.skuColor,
                          }}
                        >
                          {product.sku}
                        </span>
                      </td>
                    )}
                    {colVis.name && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontSize: config.cellFontSize,
                          color: config.cellTextColor,
                          fontWeight: 500,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </td>
                    )}
                    {colVis.category && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontSize: config.cellFontSize,
                          color: config.cellMutedColor,
                        }}
                      >
                        {product.category}
                      </td>
                    )}
                    {colVis.stock && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          color: isLow ? config.oosText : config.cellTextColor,
                          fontWeight: isLow ? 700 : 400,
                        }}
                      >
                        {isLow && (
                          <span style={{ marginRight: 3, fontSize: 9 }}>⚠</span>
                        )}
                        {product.stock.toLocaleString()}
                      </td>
                    )}
                    {colVis.price && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          color: config.cellTextColor,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </td>
                    )}
                    {colVis.status && (
                      <td style={{ padding: "0 10px" }}>
                        <span
                          style={{
                            ...getStatusStyle(product.status),
                            padding: "2px 8px",
                            borderRadius: 99,
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.status}
                        </span>
                      </td>
                    )}
                    {colVis.warehouse && (
                      <td
                        style={
                          {
                            padding: "0 10px",
                            fontSize: config.cellFontSize,
                            color: config.cellMutedColor,
                            fontFamily: "'DM Mono', monospace",
                          } as React.CSSProperties
                        }
                      >
                        {product.warehouse}
                      </td>
                    )}
                    {colVis.lastModified && (
                      <td
                        style={{
                          padding: "0 10px",
                          fontSize: 11,
                          color: config.cellMutedColor,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {product.lastModified}
                      </td>
                    )}
                    <td style={{ padding: "0 8px", textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 16,
                          color: config.cellMutedColor,
                          lineHeight: 1,
                          display: "inline-block",
                          opacity: 0.5,
                        }}
                      >
                        ⋮
                      </span>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: config.cellMutedColor,
                      fontSize: 13,
                    }}
                  >
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Detail Panel ─── */}
        {activeProduct && (
          <div
            style={{
              width: config.detailPanelWidth,
              flexShrink: 0,
              borderLeft: `1px solid ${config.panelBorderColor}`,
              background: config.panelBackgroundColor,
              overflow: "auto",
              animation: config.animateDetailPanel
                ? "slideInRight 0.2s ease"
                : undefined,
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: `1px solid ${config.panelBorderColor}`,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: config.panelHeaderColor,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                SKU Details
              </span>
              <button
                onClick={() => setActiveProduct(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: config.cellMutedColor,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Product Image */}
            <div style={{ padding: "14px 14px 0" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: config.borderRadius * 0.8,
                  overflow: "hidden",
                  border: `1px solid ${config.panelBorderColor}`,
                  background: config.backgroundColor,
                }}
              >
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&q=80";
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: 14 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: config.panelHeaderColor,
                  marginBottom: 4,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {activeProduct.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: config.panelLabelColor,
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                {activeProduct.description}
              </div>

              {/* General Info Section */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: config.panelLabelColor,
                    marginBottom: 8,
                  }}
                >
                  General Information
                </div>
                {[
                  {
                    label: "SKU",
                    value: activeProduct.sku,
                    mono: true,
                    accent: true,
                  },
                  { label: "Brand", value: activeProduct.brand },
                  { label: "Category", value: activeProduct.category },
                  {
                    label: "Price",
                    value: `$${activeProduct.price.toFixed(2)}`,
                    mono: true,
                  },
                  {
                    label: "Warehouse",
                    value: activeProduct.warehouse,
                    mono: true,
                  },
                  {
                    label: "Modified",
                    value: activeProduct.lastModified,
                    mono: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 0",
                      borderBottom: `1px solid ${config.panelBorderColor}40`,
                    }}
                  >
                    <span
                      style={{ fontSize: 11, color: config.panelLabelColor }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: row.accent
                          ? config.panelAccentColor
                          : config.panelValueColor,
                        fontFamily: row.mono
                          ? "'DM Mono', monospace"
                          : undefined,
                        fontWeight: row.accent ? 700 : 400,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: config.panelLabelColor,
                    marginBottom: 8,
                  }}
                >
                  Status
                </div>
                <span
                  style={{
                    ...getStatusStyle(activeProduct.status),
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeProduct.status}
                </span>
              </div>

              {/* Inventory Breakdown */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: config.panelLabelColor,
                    marginBottom: 8,
                  }}
                >
                  Inventory Breakdown
                </div>
                <div
                  style={{
                    background: config.backgroundColor,
                    borderRadius: config.borderRadius * 0.6,
                    padding: "10px 12px",
                    border: `1px solid ${config.borderColor}`,
                  }}
                >
                  {activeProduct.warehouseBreakdown.map((wh, i) => {
                    const pct =
                      activeProduct.stock > 0
                        ? (wh.qty / activeProduct.stock) * 100
                        : 0;
                    return (
                      <div
                        key={i}
                        style={{
                          marginBottom:
                            i < activeProduct.warehouseBreakdown.length - 1
                              ? 10
                              : 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: config.panelValueColor,
                            }}
                          >
                            {wh.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontFamily: "'DM Mono', monospace",
                              fontWeight: 700,
                              color: config.panelValueColor,
                            }}
                          >
                            {wh.qty}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 3,
                            borderRadius: 99,
                            background: config.borderColor,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background:
                                i === 0 ? config.accentColor : config.skuColor,
                              borderRadius: 99,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      borderTop: `1px solid ${config.borderColor}`,
                      marginTop: 10,
                      paddingTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: config.panelLabelColor,
                        fontWeight: 700,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 700,
                        color: config.panelValueColor,
                      }}
                    >
                      {activeProduct.stock}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "transparent",
                  border: `1px solid ${config.panelAccentColor}`,
                  borderRadius: config.borderRadius * 0.6,
                  color: config.panelAccentColor,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Instrument Sans', sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                View Full History Log →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Pagination Footer ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderTop: `1px solid ${config.borderColor}`,
          background: config.footerBackgroundColor,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: config.footerTextColor }}>
          Showing{" "}
          <strong style={{ color: config.cellTextColor }}>
            {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </strong>{" "}
          of{" "}
          <strong style={{ color: config.cellTextColor }}>
            {filtered.length}
          </strong>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={paginationBtnStyle(false, config)}
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={paginationBtnStyle(false, config)}
          >
            ‹
          </button>
          {pageNumbers().map((pg, i) =>
            pg === "..." ? (
              <span
                key={`ellipsis-${i}`}
                style={{
                  fontSize: 12,
                  color: config.footerTextColor,
                  padding: "0 4px",
                }}
              >
                …
              </span>
            ) : (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg as number)}
                style={paginationBtnStyle(pg === currentPage, config)}
              >
                {pg}
              </button>
            ),
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={paginationBtnStyle(false, config)}
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            style={paginationBtnStyle(false, config)}
          >
            »
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function paginationBtnStyle(
  active: boolean,
  config: DataTableConfig,
): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: config.borderRadius * 0.4,
    border: active ? "none" : `1px solid ${config.borderColor}`,
    background: active ? config.paginationActiveBg : "transparent",
    color: active ? config.paginationActiveText : config.footerTextColor,
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    fontFamily: "'Instrument Sans', sans-serif",
    transition: "all 0.12s",
  };
}
