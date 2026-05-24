"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import {
  RecordTableConfig,
  RecordTableViewMode,
} from "@/lib/recordTableConfig";

type ComponentStatus = "Ready" | "Draft" | "Review" | "Archived";

interface ComponentRecord {
  id: string;
  name: string;
  status: ComponentStatus;
  category: string;
  owner: string;
  updated: string;
  variants: number;
  usage: string;
  quality: number;
}

const RECORDS: ComponentRecord[] = [
  {
    id: "CF-101",
    name: "Command Palette",
    status: "Ready",
    category: "Navigation",
    owner: "Core UI",
    updated: "Today",
    variants: 8,
    usage: "2.4k",
    quality: 98,
  },
  {
    id: "CF-118",
    name: "Data Grid",
    status: "Review",
    category: "Tables",
    owner: "Forge Lab",
    updated: "Yesterday",
    variants: 5,
    usage: "1.8k",
    quality: 92,
  },
  {
    id: "CF-124",
    name: "Metric Card",
    status: "Ready",
    category: "Dashboard",
    owner: "Analytics",
    updated: "2d ago",
    variants: 12,
    usage: "3.1k",
    quality: 96,
  },
  {
    id: "CF-139",
    name: "Upload Zone",
    status: "Draft",
    category: "Forms",
    owner: "Inputs",
    updated: "4d ago",
    variants: 3,
    usage: "846",
    quality: 84,
  },
  {
    id: "CF-146",
    name: "Timeline Feed",
    status: "Archived",
    category: "Content",
    owner: "Patterns",
    updated: "12d ago",
    variants: 4,
    usage: "519",
    quality: 79,
  },
];

const STATUSES: Array<ComponentStatus | "All"> = [
  "All",
  "Ready",
  "Review",
  "Draft",
  "Archived",
];

function Icon({
  name,
  size = 16,
}: {
  name: "search" | "filter" | "grid" | "list" | "spark";
  size?: number;
}) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
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

function statusColor(config: RecordTableConfig, status: ComponentStatus) {
  if (status === "Ready") return config.readyColor;
  if (status === "Draft") return config.draftColor;
  if (status === "Review") return config.reviewColor;
  return config.archivedColor;
}

function StatusBadge({
  config,
  status,
}: {
  config: RecordTableConfig;
  status: ComponentStatus;
}) {
  const color = statusColor(config, status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        padding: "5px 9px",
        border: `1px solid ${color}45`,
        background: `${color}18`,
        color,
        fontSize: config.fontSize - 2,
        fontWeight: 700,
      }}
    >
      {status}
    </span>
  );
}

function ViewButton({
  active,
  children,
  onClick,
  config,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  config: RecordTableConfig;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        width: 34,
        height: 32,
        display: "grid",
        placeItems: "center",
        border: `1px solid ${active ? config.accentColor : "transparent"}`,
        borderRadius: Math.max(6, config.borderRadius - 4),
        background: active ? config.accentColor : "transparent",
        color: active ? config.accentTextColor : config.mutedTextColor,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function RecordTablePreview({ config }: { config: RecordTableConfig }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ComponentStatus | "All">("All");
  const [viewMode, setViewMode] = useState<RecordTableViewMode>(
    config.viewMode,
  );

  useEffect(() => {
    setViewMode(config.viewMode);
  }, [config.viewMode]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return RECORDS.filter((record) => {
      const matchesQuery =
        !normalized ||
        record.name.toLowerCase().includes(normalized) ||
        record.id.toLowerCase().includes(normalized) ||
        record.category.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || record.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const shellShadow = config.showShadow
    ? "0 18px 60px rgba(0,0,0,0.32)"
    : "none";

  return (
    <div
      style={{
        width: "min(100%, " + config.tableWidth + "px)",
        padding: 18,
        borderRadius: config.borderRadius + 6,
        border: `1px solid ${config.borderColor}`,
        background: config.backgroundColor,
        color: config.textColor,
        fontSize: config.fontSize,
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        boxShadow: shellShadow,
      }}
    >
      <style>{`
        @keyframes recordTableIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: config.mutedTextColor,
              fontSize: config.fontSize - 1,
              marginBottom: 4,
            }}
          >
            <Icon name="spark" size={14} />
            Component registry
          </div>
          <h2
            style={{
              margin: 0,
              color: config.textColor,
              fontSize: config.fontSize + 9,
              letterSpacing: 0,
            }}
          >
            Forge Components
          </h2>
          <p style={{ margin: "5px 0 0", color: config.subtleTextColor }}>
            {filtered.length} records shown
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 3,
            borderRadius: config.borderRadius,
            border: `1px solid ${config.borderColor}`,
            background: config.surfaceColor,
          }}
        >
          <ViewButton
            active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            config={config}
          >
            <Icon name="grid" size={16} />
          </ViewButton>
          <ViewButton
            active={viewMode === "list"}
            onClick={() => setViewMode("list")}
            config={config}
          >
            <Icon name="list" size={17} />
          </ViewButton>
        </div>
      </div>

      {(config.showSearch || config.showFilters) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {config.showSearch && (
            <label
              style={{
                flex: "1 1 240px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minHeight: 38,
                padding: "0 12px",
                borderRadius: config.borderRadius,
                border: `1px solid ${config.borderColor}`,
                background: config.searchBackground,
                color: config.mutedTextColor,
              }}
            >
              <Icon name="search" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search components..."
                style={{
                  width: "100%",
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: config.textColor,
                  font: "inherit",
                }}
              />
            </label>
          )}
          {config.showFilters && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  color: config.mutedTextColor,
                  display: "inline-grid",
                  placeItems: "center",
                }}
              >
                <Icon name="filter" size={14} />
              </span>
              {STATUSES.map((status) => {
                const active = filter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    style={{
                      minHeight: 32,
                      padding: "0 10px",
                      borderRadius: 999,
                      border: `1px solid ${active ? config.accentColor : config.borderColor}`,
                      background: active
                        ? config.accentColor
                        : config.surfaceColor,
                      color: active
                        ? config.accentTextColor
                        : config.mutedTextColor,
                      font: "inherit",
                      fontSize: config.fontSize - 1,
                      cursor: "pointer",
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardMinWidth}px, 1fr))`,
            gap: config.gap,
          }}
        >
          {filtered.map((record, index) => (
            <article
              key={record.id}
              style={{
                padding: 15,
                borderRadius: config.borderRadius,
                border: `1px solid ${config.borderColor}`,
                background: config.surfaceColor,
                animation: config.animateItems
                  ? `recordTableIn 260ms ease both ${index * 45}ms`
                  : undefined,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div
                  style={{
                    width: config.avatarSize,
                    height: config.avatarSize,
                    flex: "0 0 auto",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: Math.max(8, config.borderRadius - 2),
                    background: `${config.accentColor}20`,
                    color: config.accentColor,
                    fontWeight: 800,
                  }}
                >
                  {record.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong
                    style={{
                      display: "block",
                      color: config.textColor,
                      fontSize: config.fontSize + 2,
                    }}
                  >
                    {record.name}
                  </strong>
                  <span style={{ color: config.subtleTextColor }}>
                    {record.id} / {record.category}
                  </span>
                </div>
                <StatusBadge config={config} status={record.status} />
              </div>
              {config.showMetrics && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                    marginTop: 15,
                  }}
                >
                  {[
                    ["Variants", record.variants],
                    ["Usage", record.usage],
                    ["Quality", record.quality + "%"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        padding: "9px 8px",
                        borderRadius: Math.max(6, config.borderRadius - 4),
                        background: config.searchBackground,
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          color: config.subtleTextColor,
                          fontSize: config.fontSize - 2,
                        }}
                      >
                        {label}
                      </span>
                      <strong style={{ color: config.textColor }}>
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 14,
                  color: config.mutedTextColor,
                }}
              >
                <span>{record.owner}</span>
                <span>{record.updated}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            border: `1px solid ${config.borderColor}`,
            borderRadius: config.borderRadius,
            background: config.surfaceColor,
          }}
        >
          <div style={{ minWidth: 760 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr",
                gap: 12,
                padding: "12px 14px",
                color: config.subtleTextColor,
                borderBottom: `1px solid ${config.borderColor}`,
                fontSize: config.fontSize - 2,
                textTransform: "uppercase",
              }}
            >
              <span>Component</span>
              <span>Category</span>
              <span>Owner</span>
              <span>Updated</span>
              <span>Quality</span>
              <span>Status</span>
            </div>
            {filtered.map((record, index) => (
              <div
                key={record.id}
                style={{
                  minHeight: config.rowHeight,
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "0 14px",
                  borderBottom:
                    index === filtered.length - 1
                      ? "none"
                      : `1px solid ${config.borderColor}`,
                  animation: config.animateItems
                    ? `recordTableIn 220ms ease both ${index * 35}ms`
                    : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: config.avatarSize - 4,
                      height: config.avatarSize - 4,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background: `${config.accentColor}20`,
                      color: config.accentColor,
                      fontWeight: 800,
                    }}
                  >
                    {record.name[0]}
                  </div>
                  <div>
                    <strong style={{ display: "block" }}>{record.name}</strong>
                    <span style={{ color: config.subtleTextColor }}>
                      {record.id}
                    </span>
                  </div>
                </div>
                <span>{record.category}</span>
                <span style={{ color: config.mutedTextColor }}>
                  {record.owner}
                </span>
                <span style={{ color: config.mutedTextColor }}>
                  {record.updated}
                </span>
                <strong>{record.quality}%</strong>
                <StatusBadge config={config} status={record.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
