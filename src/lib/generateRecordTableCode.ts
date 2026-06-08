import { RecordTableConfig } from "@/lib/recordTableConfig";

export function generateRecordTableJSX(config: RecordTableConfig): string {
  return `import { useMemo, useState } from "react";
import "./RecordTable.css";

const records = [
  { id: "CF-101", name: "Command Palette", status: "Ready", category: "Navigation", owner: "Core UI", updated: "Today", variants: 8, usage: "2.4k", quality: 98 },
  { id: "CF-118", name: "Data Grid", status: "Review", category: "Tables", owner: "Forge Lab", updated: "Yesterday", variants: 5, usage: "1.8k", quality: 92 },
  { id: "CF-124", name: "Metric Card", status: "Ready", category: "Dashboard", owner: "Analytics", updated: "2d ago", variants: 12, usage: "3.1k", quality: 96 },
  { id: "CF-139", name: "Upload Zone", status: "Draft", category: "Forms", owner: "Inputs", updated: "4d ago", variants: 3, usage: "846", quality: 84 },
  { id: "CF-146", name: "Timeline Feed", status: "Archived", category: "Content", owner: "Patterns", updated: "12d ago", variants: 4, usage: "519", quality: 79 },
];

const statuses = ["All", "Ready", "Review", "Draft", "Archived"];

function Icon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg {...common}>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    );
  }

  if (name === "list") {
    return (
      <svg {...common}>
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg {...common}>
        <path d="M12 3l1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3Z" />
        <path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function StatusBadge({ status }) {
  return <span className={"rt__badge rt__badge--" + status.toLowerCase()}>{status}</span>;
}

export default function RecordTable({ onRecordSelect }) {
  const [viewMode, setViewMode] = useState("${config.viewMode}");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery =
        !normalized ||
        record.name.toLowerCase().includes(normalized) ||
        record.id.toLowerCase().includes(normalized) ||
        record.category.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || record.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <section className="rt-wrap">
      <div className="rt__header">
        <div>
          <span className="rt__eyebrow"><Icon name="spark" /> Component registry</span>
          <h2>Forge Components</h2>
          <p>{filtered.length} records shown</p>
        </div>
        <div className="rt__view-toggle" aria-label="Switch view">
          <button className={viewMode === "grid" ? "rt__view-btn rt__view-btn--active" : "rt__view-btn"} onClick={() => setViewMode("grid")} aria-label="Grid view" title="Grid view"><Icon name="grid" /></button>
          <button className={viewMode === "list" ? "rt__view-btn rt__view-btn--active" : "rt__view-btn"} onClick={() => setViewMode("list")} aria-label="List view" title="List view"><Icon name="list" /></button>
        </div>
      </div>

      ${
        config.showSearch || config.showFilters
          ? `<div className="rt__controls">
        ${
          config.showSearch
            ? `<label className="rt__search">
          <Icon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components..." />
        </label>`
            : ""
        }
        ${
          config.showFilters
            ? `<div className="rt__filters">
          <span className="rt__filter-icon"><Icon name="filter" /></span>
          {statuses.map((status) => (
            <button key={status} className={filter === status ? "rt__filter rt__filter--active" : "rt__filter"} onClick={() => setFilter(status)}>
              {status}
            </button>
          ))}
        </div>`
            : ""
        }
      </div>`
          : ""
      }

      {viewMode === "grid" ? (
        <div className="rt__grid">
          {filtered.map((record) => (
            <article key={record.id} className="rt__card" onClick={() => onRecordSelect?.(record)}>
              <div className="rt__card-top">
                <div className="rt__avatar">{record.name.slice(0, 2).toUpperCase()}</div>
                <div className="rt__identity">
                  <strong>{record.name}</strong>
                  <span>{record.id} / {record.category}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>
              ${
                config.showMetrics
                  ? `<div className="rt__metrics">
                <div><span>Variants</span><strong>{record.variants}</strong></div>
                <div><span>Usage</span><strong>{record.usage}</strong></div>
                <div><span>Quality</span><strong>{record.quality}%</strong></div>
              </div>`
                  : ""
              }
              <div className="rt__footer">
                <span>{record.owner}</span>
                <span>{record.updated}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rt__table">
          <div className="rt__table-inner">
            <div className="rt__table-head">
              <span>Component</span><span>Category</span><span>Owner</span><span>Updated</span><span>Quality</span><span>Status</span>
            </div>
            {filtered.map((record) => (
              <button key={record.id} className="rt__row" onClick={() => onRecordSelect?.(record)}>
                <span className="rt__row-name"><span className="rt__row-avatar">{record.name[0]}</span><span><strong>{record.name}</strong><em>{record.id}</em></span></span>
                <span>{record.category}</span>
                <span>{record.owner}</span>
                <span>{record.updated}</span>
                <strong>{record.quality}%</strong>
                <StatusBadge status={record.status} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
`;
}

export function generateRecordTableCSS(config: RecordTableConfig): string {
  return `.rt-wrap {
  width: min(100%, ${config.tableWidth}px);
  padding: 18px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius + 6}px;
  background: ${config.backgroundColor};
  color: ${config.textColor};
  font-family: "Instrument Sans", system-ui, sans-serif;
  font-size: ${config.fontSize}px;
  box-shadow: ${config.showShadow ? "0 18px 60px rgba(0,0,0,0.32)" : "none"};
}

.rt__header,
.rt__card-top,
.rt__footer,
.rt__controls {
  display: flex;
  align-items: center;
}

.rt__header {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.rt__eyebrow,
.rt__header p,
.rt__identity span,
.rt__footer,
.rt__row em {
  color: ${config.subtleTextColor};
}

.rt__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.rt__header h2 {
  margin: 0;
  font-size: ${config.fontSize + 9}px;
  letter-spacing: 0;
}

.rt__header p {
  margin: 5px 0 0;
}

.rt__view-toggle {
  display: flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  background: ${config.surfaceColor};
}

.rt__view-btn,
.rt__filter,
.rt__row {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.rt__view-btn {
  width: 34px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: ${Math.max(6, config.borderRadius - 4)}px;
  background: transparent;
  color: ${config.mutedTextColor};
}

.rt__view-btn--active,
.rt__filter--active {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
}

.rt__controls {
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.rt__search {
  flex: 1 1 240px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  background: ${config.searchBackground};
  color: ${config.mutedTextColor};
}

.rt__search span {
  font-size: ${config.fontSize - 2}px;
}

.rt__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${config.textColor};
  font: inherit;
}

.rt__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.rt__filter-icon {
  display: inline-grid;
  place-items: center;
  color: ${config.mutedTextColor};
}

.rt__filter {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid ${config.borderColor};
  border-radius: 999px;
  background: ${config.surfaceColor};
  color: ${config.mutedTextColor};
}

.rt__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${config.cardMinWidth}px, 1fr));
  gap: ${config.gap}px;
}

.rt__card {
  padding: 15px;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  background: ${config.surfaceColor};
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;
  ${config.animateItems ? "animation: rt-in 260ms ease both;" : ""}
}

.rt__card:hover,
.rt__row:hover {
  background: ${config.hoverBackground};
}

.rt__card:hover {
  transform: translateY(-2px);
}

.rt__card-top {
  align-items: flex-start;
  gap: 12px;
}

.rt__avatar,
.rt__row-avatar {
  display: grid;
  place-items: center;
  background: ${config.accentColor}20;
  color: ${config.accentColor};
  font-weight: 800;
}

.rt__avatar {
  width: ${config.avatarSize}px;
  height: ${config.avatarSize}px;
  flex: 0 0 auto;
  border-radius: ${Math.max(8, config.borderRadius - 2)}px;
}

.rt__identity {
  min-width: 0;
  flex: 1;
}

.rt__identity strong,
.rt__identity span {
  display: block;
}

.rt__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 15px;
}

.rt__metrics div {
  padding: 9px 8px;
  border-radius: ${Math.max(6, config.borderRadius - 4)}px;
  background: ${config.searchBackground};
}

.rt__metrics span {
  display: block;
  color: ${config.subtleTextColor};
  font-size: ${config.fontSize - 2}px;
}

.rt__footer {
  justify-content: space-between;
  margin-top: 14px;
}

.rt__badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: ${config.fontSize - 2}px;
  font-weight: 700;
}

.rt__badge--ready { border: 1px solid ${config.readyColor}45; background: ${config.readyColor}18; color: ${config.readyColor}; }
.rt__badge--draft { border: 1px solid ${config.draftColor}45; background: ${config.draftColor}18; color: ${config.draftColor}; }
.rt__badge--review { border: 1px solid ${config.reviewColor}45; background: ${config.reviewColor}18; color: ${config.reviewColor}; }
.rt__badge--archived { border: 1px solid ${config.archivedColor}45; background: ${config.archivedColor}18; color: ${config.archivedColor}; }

.rt__table {
  overflow-x: auto;
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  background: ${config.surfaceColor};
}

.rt__table-inner {
  min-width: 760px;
}

.rt__table-head,
.rt__row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr 0.8fr;
  gap: 12px;
  align-items: center;
}

.rt__table-head {
  padding: 12px 14px;
  border-bottom: 1px solid ${config.borderColor};
  color: ${config.subtleTextColor};
  font-size: ${config.fontSize - 2}px;
  text-transform: uppercase;
}

.rt__row {
  width: 100%;
  min-height: ${config.rowHeight}px;
  padding: 0 14px;
  border-bottom: 1px solid ${config.borderColor};
  background: transparent;
  color: ${config.textColor};
  text-align: left;
  ${config.animateItems ? "animation: rt-in 220ms ease both;" : ""}
}

.rt__row:last-child {
  border-bottom: 0;
}

.rt__row-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rt__row-avatar {
  width: ${config.avatarSize - 4}px;
  height: ${config.avatarSize - 4}px;
  border-radius: 10px;
}

.rt__row em {
  display: block;
  font-style: normal;
}

@keyframes rt-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 680px) {
  .rt__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;
}

// ─── TSX + CSS ────────────────────────
export function generateRecordTableTSX(config: RecordTableConfig): string {
  return `import { useMemo, useState } from "react";
import "./RecordTable.css";

interface Record {
  id: string;
  name: string;
  status: string;
  category: string;
  owner: string;
  updated: string;
  variants: number;
  usage: string;
  quality: number;
}

const records: Record[] = [
  { id: "CF-101", name: "Command Palette", status: "Ready", category: "Navigation", owner: "Core UI", updated: "Today", variants: 8, usage: "2.4k", quality: 98 },
  { id: "CF-118", name: "Data Grid", status: "Review", category: "Tables", owner: "Forge Lab", updated: "Yesterday", variants: 5, usage: "1.8k", quality: 92 },
  { id: "CF-124", name: "Metric Card", status: "Ready", category: "Dashboard", owner: "Analytics", updated: "2d ago", variants: 12, usage: "3.1k", quality: 96 },
  { id: "CF-139", name: "Upload Zone", status: "Draft", category: "Forms", owner: "Inputs", updated: "4d ago", variants: 3, usage: "846", quality: 84 },
  { id: "CF-146", name: "Timeline Feed", status: "Archived", category: "Content", owner: "Patterns", updated: "12d ago", variants: 4, usage: "519", quality: 79 },
];

const statuses: string[] = ["All", "Ready", "Review", "Draft", "Archived"];

function Icon({ name }: { name: string }): JSX.Element {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg {...common}>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    );
  }

  if (name === "list") {
    return (
      <svg {...common}>
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg {...common}>
        <path d="M12 3l1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3Z" />
        <path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }): JSX.Element {
  return <span className={"rt__badge rt__badge--" + status.toLowerCase()}>{status}</span>;
}

interface RecordTableProps {
  onRecordSelect?: (record: Record) => void;
}

export default function RecordTable({ onRecordSelect }: RecordTableProps): JSX.Element {
  const [viewMode, setViewMode] = useState<string>("${config.viewMode}");
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo<Record[]>(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery =
        !normalized ||
        record.name.toLowerCase().includes(normalized) ||
        record.id.toLowerCase().includes(normalized) ||
        record.category.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || record.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <section className="rt-wrap">
      <div className="rt__header">
        <div>
          <span className="rt__eyebrow"><Icon name="spark" /> Component registry</span>
          <h2>Forge Components</h2>
          <p>{filtered.length} records shown</p>
        </div>
        <div className="rt__view-toggle" aria-label="Switch view">
          <button className={viewMode === "grid" ? "rt__view-btn rt__view-btn--active" : "rt__view-btn"} onClick={() => setViewMode("grid")} aria-label="Grid view" title="Grid view"><Icon name="grid" /></button>
          <button className={viewMode === "list" ? "rt__view-btn rt__view-btn--active" : "rt__view-btn"} onClick={() => setViewMode("list")} aria-label="List view" title="List view"><Icon name="list" /></button>
        </div>
      </div>

      ${
        config.showSearch || config.showFilters
          ? `<div className="rt__controls">
        ${
          config.showSearch
            ? `<label className="rt__search">
          <Icon name="search" />
          <input value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search components..." />
        </label>`
            : ""
        }
        ${
          config.showFilters
            ? `<div className="rt__filters">
          <span className="rt__filter-icon"><Icon name="filter" /></span>
          {statuses.map((status) => (
            <button key={status} className={filter === status ? "rt__filter rt__filter--active" : "rt__filter"} onClick={() => setFilter(status)}>
              {status}
            </button>
          ))}
        </div>`
            : ""
        }
      </div>`
          : ""
      }

      {viewMode === "grid" ? (
        <div className="rt__grid">
          {filtered.map((record) => (
            <article key={record.id} className="rt__card" onClick={() => onRecordSelect?.(record)}>
              <div className="rt__card-top">
                <div className="rt__avatar">{record.name.slice(0, 2).toUpperCase()}</div>
                <div className="rt__identity">
                  <strong>{record.name}</strong>
                  <span>{record.id} / {record.category}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>
              ${
                config.showMetrics
                  ? `<div className="rt__metrics">
                <div><span>Variants</span><strong>{record.variants}</strong></div>
                <div><span>Usage</span><strong>{record.usage}</strong></div>
                <div><span>Quality</span><strong>{record.quality}%</strong></div>
              </div>`
                  : ""
              }
              <div className="rt__footer">
                <span>{record.owner}</span>
                <span>{record.updated}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rt__table">
          <div className="rt__table-inner">
            <div className="rt__table-head">
              <span>Component</span><span>Category</span><span>Owner</span><span>Updated</span><span>Quality</span><span>Status</span>
            </div>
            {filtered.map((record) => (
              <button key={record.id} className="rt__row" onClick={() => onRecordSelect?.(record)}>
                <span className="rt__row-name"><span className="rt__row-avatar">{record.name[0]}</span><span><strong>{record.name}</strong><em>{record.id}</em></span></span>
                <span>{record.category}</span>
                <span>{record.owner}</span>
                <span>{record.updated}</span>
                <strong>{record.quality}%</strong>
                <StatusBadge status={record.status} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateRecordTableTailwind(config: RecordTableConfig): string {
  const shadow = config.showShadow ? "0 18px 60px rgba(0,0,0,0.32)" : "none";

  const fsBase = config.fontSize;
  const fsTitle = config.fontSize + 9;
  const fsBadge = config.fontSize - 2;
  const fsSmall = config.fontSize - 2;

  const avatarRadius = Math.max(8, config.borderRadius - 2);
  const metricsRadius = Math.max(6, config.borderRadius - 4);
  const viewBtnRadius = Math.max(6, config.borderRadius - 4);

  return `import { useMemo, useState, CSSProperties } from "react";

interface Record {
  id: string;
  name: string;
  status: string;
  category: string;
  owner: string;
  updated: string;
  variants: number;
  usage: string;
  quality: number;
}

const records: Record[] = [
  { id: "CF-101", name: "Command Palette", status: "Ready", category: "Navigation", owner: "Core UI", updated: "Today", variants: 8, usage: "2.4k", quality: 98 },
  { id: "CF-118", name: "Data Grid", status: "Review", category: "Tables", owner: "Forge Lab", updated: "Yesterday", variants: 5, usage: "1.8k", quality: 92 },
  { id: "CF-124", name: "Metric Card", status: "Ready", category: "Dashboard", owner: "Analytics", updated: "2d ago", variants: 12, usage: "3.1k", quality: 96 },
  { id: "CF-139", name: "Upload Zone", status: "Draft", category: "Forms", owner: "Inputs", updated: "4d ago", variants: 3, usage: "846", quality: 84 },
  { id: "CF-146", name: "Timeline Feed", status: "Archived", category: "Content", owner: "Patterns", updated: "12d ago", variants: 4, usage: "519", quality: 79 },
];

const statuses: string[] = ["All", "Ready", "Review", "Draft", "Archived"];

// Baked-in CSS variable tokens — update these to reskin the RecordTable
const rtVars: CSSProperties = {
  "--rt-bg":              "${config.backgroundColor}",
  "--rt-border":          "${config.borderColor}",
  "--rt-radius":          "${config.borderRadius}px",
  "--rt-text":            "${config.textColor}",
  "--rt-subtle-text":     "${config.subtleTextColor}",
  "--rt-muted-text":      "${config.mutedTextColor}",
  "--rt-accent":          "${config.accentColor}",
  "--rt-accent-text":     "${config.accentTextColor}",
  "--rt-surface":         "${config.surfaceColor}",
  "--rt-search-bg":       "${config.searchBackground}",
  "--rt-hover-bg":        "${config.hoverBackground}",
  "--rt-ready":           "${config.readyColor}",
  "--rt-draft":           "${config.draftColor}",
  "--rt-review":          "${config.reviewColor}",
  "--rt-archived":        "${config.archivedColor}",
  "--rt-width":           "min(100%, ${config.tableWidth}px)",
  "--rt-card-min-width":  "${config.cardMinWidth}px",
  "--rt-gap":             "${config.gap}px",
  "--rt-avatar-size":     "${config.avatarSize}px",
  "--rt-row-avatar-size": "${config.avatarSize - 4}px",
  "--rt-row-height":      "${config.rowHeight}px",
  "--rt-wrap-radius":     "${config.borderRadius + 6}px",
  "--rt-avatar-radius":   "${avatarRadius}px",
  "--rt-metrics-radius":  "${metricsRadius}px",
  "--rt-view-btn-radius": "${viewBtnRadius}px",
  "--rt-shadow":          "${shadow}",
} as CSSProperties;

function Icon({ name }: { name: string }): JSX.Element {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg {...common}>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    );
  }

  if (name === "list") {
    return (
      <svg {...common}>
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg {...common}>
        <path d="M12 3l1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3Z" />
        <path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }): JSX.Element {
  let cls = "inline-flex items-center w-fit rounded-full px-[9px] py-[5px] text-[${fsBadge}px] font-bold border";
  if (status === "Ready")    cls += " border-[color-mix(in_srgb,var(--rt-ready)_27%,transparent)] bg-[color-mix(in_srgb,var(--rt-ready)_9%,transparent)] text-[var(--rt-ready)]";
  if (status === "Draft")    cls += " border-[color-mix(in_srgb,var(--rt-draft)_27%,transparent)] bg-[color-mix(in_srgb,var(--rt-draft)_9%,transparent)] text-[var(--rt-draft)]";
  if (status === "Review")   cls += " border-[color-mix(in_srgb,var(--rt-review)_27%,transparent)] bg-[color-mix(in_srgb,var(--rt-review)_9%,transparent)] text-[var(--rt-review)]";
  if (status === "Archived") cls += " border-[color-mix(in_srgb,var(--rt-archived)_27%,transparent)] bg-[color-mix(in_srgb,var(--rt-archived)_9%,transparent)] text-[var(--rt-archived)]";
  return <span className={cls}>{status}</span>;
}

interface RecordTableProps {
  onRecordSelect?: (record: Record) => void;
}

export default function RecordTable({ onRecordSelect }: RecordTableProps): JSX.Element {
  const [viewMode, setViewMode] = useState<string>("${config.viewMode}");
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo<Record[]>(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery =
        !normalized ||
        record.name.toLowerCase().includes(normalized) ||
        record.id.toLowerCase().includes(normalized) ||
        record.category.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || record.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <section
      className="w-[var(--rt-width)] p-[18px] border border-[var(--rt-border)] rounded-[var(--rt-wrap-radius)] bg-[var(--rt-bg)] text-[var(--rt-text)] font-sans text-[${fsBase}px]"
      style={{ ...rtVars, boxShadow: "var(--rt-shadow)" }}
    >
      ${
        config.animateItems
          ? `<style>{\`
        @keyframes rt-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      \`}</style>`
          : ""
      }
      <div className="flex items-center justify-between gap-4 mb-4 max-[680px]:flex-col max-[680px]:items-start">
        <div>
          <span className="inline-flex items-center gap-[6px] mb-1 text-[var(--rt-subtle-text)] text-[${fsSmall}px]">
            <Icon name="spark" /> Component registry
          </span>
          <h2 className="m-0 text-[${fsTitle}px] tracking-normal">Forge Components</h2>
          <p className="mt-[5px] mb-0 text-[var(--rt-subtle-text)] text-[${fsSmall}px]">{filtered.length} records shown</p>
        </div>
        <div className="flex gap-1 p-[3px] border border-[var(--rt-border)] rounded-[var(--rt-radius)] bg-[var(--rt-surface)]" aria-label="Switch view">
          <button
            className={\`w-[34px] h-[32px] grid place-items-center rounded-[var(--rt-view-btn-radius)] border-0 cursor-pointer \${viewMode === "grid" ? "bg-[var(--rt-accent)] text-[var(--rt-accent-text)]" : "bg-transparent text-[var(--rt-muted-text)]"}\`}
            onClick={() => setViewMode("grid")} aria-label="Grid view" title="Grid view"
          ><Icon name="grid" /></button>
          <button
            className={\`w-[34px] h-[32px] grid place-items-center rounded-[var(--rt-view-btn-radius)] border-0 cursor-pointer \${viewMode === "list" ? "bg-[var(--rt-accent)] text-[var(--rt-accent-text)]" : "bg-transparent text-[var(--rt-muted-text)]"}\`}
            onClick={() => setViewMode("list")} aria-label="List view" title="List view"
          ><Icon name="list" /></button>
        </div>
      </div>

      ${
        config.showSearch || config.showFilters
          ? `<div className="flex flex-wrap items-center gap-[10px] mb-4">
        ${
          config.showSearch
            ? `<label className="flex flex-1 basis-[240px] items-center gap-2 min-h-[38px] px-3 border border-[var(--rt-border)] rounded-[var(--rt-radius)] bg-[var(--rt-search-bg)] text-[var(--rt-muted-text)] text-[${fsSmall}px]">
          <Icon name="search" />
          <input
            className="w-full border-0 outline-none bg-transparent text-[var(--rt-text)] font-[inherit] text-[${fsBase}px]"
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            placeholder="Search components..."
          />
        </label>`
            : ""
        }
        ${
          config.showFilters
            ? `<div className="flex flex-wrap items-center gap-[6px]">
          <span className="inline-grid place-items-center text-[var(--rt-muted-text)]"><Icon name="filter" /></span>
          {statuses.map((status) => (
            <button
              key={status}
              className={\`min-h-[32px] px-[10px] border rounded-full cursor-pointer font-[inherit] text-[${fsSmall}px] transition-colors \${filter === status ? "border-[var(--rt-accent)] bg-[var(--rt-accent)] text-[var(--rt-accent-text)]" : "border-[var(--rt-border)] bg-[var(--rt-surface)] text-[var(--rt-muted-text)]"}\`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>`
            : ""
        }
      </div>`
          : ""
      }

      {viewMode === "grid" ? (
        <div
          className="grid gap-[var(--rt-gap)]"
          style={{ gridTemplateColumns: \`repeat(auto-fit, minmax(var(--rt-card-min-width), 1fr))\` }}
        >
          {filtered.map((record) => (
            <article
              key={record.id}
              className="p-[15px] border border-[var(--rt-border)] rounded-[var(--rt-radius)] bg-[var(--rt-surface)] cursor-pointer transition-[transform,background] duration-[180ms] ease-linear hover:bg-[var(--rt-hover-bg)] hover:-translate-y-0.5${config.animateItems ? " [animation:rt-in_260ms_ease_both]" : ""}"
              onClick={() => onRecordSelect?.(record)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid place-items-center shrink-0 bg-[color-mix(in_srgb,var(--rt-accent)_12%,transparent)] text-[var(--rt-accent)] font-extrabold text-[${fsSmall}px]"
                  style={{ width: "var(--rt-avatar-size)", height: "var(--rt-avatar-size)", borderRadius: "var(--rt-avatar-radius)" }}
                >{record.name.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[${fsBase}px]">{record.name}</strong>
                  <span className="block text-[var(--rt-subtle-text)] text-[${fsSmall}px]">{record.id} / {record.category}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>
              ${
                config.showMetrics
                  ? `<div className="grid grid-cols-3 gap-2 mt-[15px]">
                <div className="px-2 py-[9px] bg-[var(--rt-search-bg)] rounded-[var(--rt-metrics-radius)]">
                  <span className="block text-[var(--rt-subtle-text)] text-[${fsSmall}px]">Variants</span>
                  <strong className="text-[${fsBase}px]">{record.variants}</strong>
                </div>
                <div className="px-2 py-[9px] bg-[var(--rt-search-bg)] rounded-[var(--rt-metrics-radius)]">
                  <span className="block text-[var(--rt-subtle-text)] text-[${fsSmall}px]">Usage</span>
                  <strong className="text-[${fsBase}px]">{record.usage}</strong>
                </div>
                <div className="px-2 py-[9px] bg-[var(--rt-search-bg)] rounded-[var(--rt-metrics-radius)]">
                  <span className="block text-[var(--rt-subtle-text)] text-[${fsSmall}px]">Quality</span>
                  <strong className="text-[${fsBase}px]">{record.quality}%</strong>
                </div>
              </div>`
                  : ""
              }
              <div className="flex items-center justify-between mt-[14px] text-[var(--rt-subtle-text)] text-[${fsSmall}px]">
                <span>{record.owner}</span>
                <span>{record.updated}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--rt-border)] rounded-[var(--rt-radius)] bg-[var(--rt-surface)]">
          <div className="min-w-[760px]">
            <div
              className="grid gap-3 items-center px-[14px] py-3 border-b border-[var(--rt-border)] text-[var(--rt-subtle-text)] text-[${fsSmall}px] uppercase"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr" }}
            >
              <span>Component</span><span>Category</span><span>Owner</span><span>Updated</span><span>Quality</span><span>Status</span>
            </div>
            {filtered.map((record) => (
              <button
                key={record.id}
                className={\`grid gap-3 items-center w-full min-h-[var(--rt-row-height)] px-[14px] border-b border-[var(--rt-border)] last:border-b-0 bg-transparent text-[var(--rt-text)] text-left border-l-0 border-r-0 border-t-0 cursor-pointer font-[inherit] text-[${fsBase}px] transition-colors hover:bg-[var(--rt-hover-bg)]${config.animateItems ? " [animation:rt-in_220ms_ease_both]" : ""}\`}
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr" }}
                onClick={() => onRecordSelect?.(record)}
              >
                <span className="flex items-center gap-[10px]">
                  <span
                    className="grid place-items-center bg-[color-mix(in_srgb,var(--rt-accent)_12%,transparent)] text-[var(--rt-accent)] font-extrabold rounded-[10px] text-[${fsSmall}px]"
                    style={{ width: "var(--rt-row-avatar-size)", height: "var(--rt-row-avatar-size)" }}
                  >{record.name[0]}</span>
                  <span>
                    <strong className="block text-[${fsBase}px]">{record.name}</strong>
                    <em className="block not-italic text-[var(--rt-subtle-text)] text-[${fsSmall}px]">{record.id}</em>
                  </span>
                </span>
                <span>{record.category}</span>
                <span>{record.owner}</span>
                <span>{record.updated}</span>
                <strong>{record.quality}%</strong>
                <StatusBadge status={record.status} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
`;
}
