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
