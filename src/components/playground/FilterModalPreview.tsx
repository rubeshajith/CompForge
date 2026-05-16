"use client";

// /components/playground/FilterModalPreview.tsx

import { useState } from "react";
import {
  FilterModalConfig,
  StatusOption,
  CategoryOption,
  SortField,
  SortDirection,
} from "@/lib/filterModalConfig";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<StatusOption, string> = {
  inProgress: "In Progress",
  completed: "Completed",
  review: "Review",
  onHold: "On Hold",
  cancelled: "Cancelled",
};

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "creationDate", label: "Creation Date" },
  { value: "projectName", label: "Project Name" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
];

const ALL_STATUSES: StatusOption[] = [
  "inProgress",
  "completed",
  "review",
  "onHold",
  "cancelled",
];

const CATEGORIES: { value: CategoryOption; label: string; count: number }[] = [
  { value: "operations", label: "Operations", count: 24 },
  { value: "compliance", label: "Compliance", count: 12 },
  { value: "marketing", label: "Marketing", count: 38 },
  { value: "engineering", label: "Engineering", count: 19 },
  { value: "design", label: "Design", count: 7 },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Calendar helpers (UTC-safe) ──────────────────────────────────────────────

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++)
    cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function isBefore(a: Date, b: Date) {
  return a.getTime() < b.getTime();
}

function formatDate(d: Date) {
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${MONTH_NAMES[d.getUTCMonth()].slice(0, 3)} ${day}, ${d.getUTCFullYear()}`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

function TuneIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="2" fill={color} stroke="none" />
      <circle cx="16" cy="12" r="2" fill={color} stroke="none" />
      <circle cx="10" cy="18" r="2" fill={color} stroke="none" />
    </svg>
  );
}

function ArrowDownIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="5 12 12 19 19 12" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── DayCell — the key to gapless connected range highlight ──────────────────
//
// Layout: outer div fills the full grid column (no padding/gap), inner circle is the bubble.
// The OUTER div carries a half or full-width background strip for the range fill.
// Because the grid has gap:0, these strips butt up perfectly forming a continuous band.
//
//  blank | [START→] [←range→] [←range→] [←END] | blank
//         ╰──half──╯╰───full──╯╰───full──╯╰─half─╯
//            circle                             circle

interface DayCellProps {
  date: Date;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHovered: boolean;
  isSingle: boolean;
  config: FilterModalConfig;
  onMouseEnter: () => void;
  onClick: () => void;
}

function DayCell({
  date,
  isStart,
  isEnd,
  inRange,
  isHovered,
  isSingle,
  config,
  onMouseEnter,
  onClick,
}: DayCellProps) {
  const dayNum = date.getUTCDate();
  const isEndpoint = isStart || isEnd;
  const rangeColor = config.calendarRangeBackground;

  // Outer strip: bleeds the range fill edge-to-edge
  // Start with active end: right half only (circle is on the left edge of the strip)
  // End: left half only
  // In-range: full width
  let outerBg = "transparent";
  if (!isSingle && isStart && !isEnd) {
    // There IS an end — fill right half so the strip connects rightward
    outerBg = `linear-gradient(to right, transparent 45%, ${rangeColor} 45%)`;
  } else if (!isSingle && isEnd) {
    outerBg = `linear-gradient(to left, transparent 45%, ${rangeColor} 45%)`;
  } else if (inRange) {
    outerBg = rangeColor;
  }

  // Inner bubble
  let bubbleBg = "transparent";
  let bubbleRadius = "8px";
  let textColor = config.calendarDayTextColor;
  let fontWeight = 400;

  if (isEndpoint && !isSingle) {
    bubbleBg = config.calendarSelectedBackground;
    bubbleRadius = "50%";
    textColor = config.calendarSelectedTextColor;
    fontWeight = 700;
  } else if (isSingle && isStart) {
    bubbleBg = config.calendarSelectedBackground;
    bubbleRadius = "50%";
    textColor = config.calendarSelectedTextColor;
    fontWeight = 700;
  } else if (inRange) {
    textColor = config.calendarRangeTextColor;
  } else if (isHovered) {
    bubbleBg = config.calendarDayHoverBackground;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        position: "relative",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: outerBg,
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: bubbleRadius,
          background: bubbleBg,
          color: textColor,
          fontSize: config.fontSize,
          fontWeight,
          transition: "background 0.1s",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {dayNum}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface FilterModalPreviewProps {
  config: FilterModalConfig;
}

export function FilterModalPreview({ config }: FilterModalPreviewProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());

  // Range state: null rangeEnd means "waiting for second click"
  const [rangeStart, setRangeStart] = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)),
  );
  const [rangeEnd, setRangeEnd] = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 15)),
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState<StatusOption[]>(
    config.selectedStatuses,
  );
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >(config.selectedCategories);
  const [sortField, setSortField] = useState<SortField>(config.sortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    config.sortDirection,
  );

  const cells = getDaysInMonth(viewMonth, viewYear);

  // Navigation
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  // Two-click range selection
  function handleDayClick(date: Date) {
    if (!selecting) {
      setRangeStart(date);
      setRangeEnd(null);
      setSelecting(true);
    } else {
      if (rangeStart && isBefore(date, rangeStart)) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelecting(false);
      setHoverDate(null);
    }
  }

  // When selecting, use hoverDate as tentative end for live preview
  const effectiveEnd = selecting && hoverDate ? hoverDate : rangeEnd;

  // Normalise lo <= hi
  const lo =
    rangeStart && effectiveEnd
      ? isBefore(rangeStart, effectiveEnd)
        ? rangeStart
        : effectiveEnd
      : rangeStart;
  const hi =
    rangeStart && effectiveEnd
      ? isBefore(rangeStart, effectiveEnd)
        ? effectiveEnd
        : rangeStart
      : null;

  const isOnlyStart = (d: Date) => !!lo && sameDay(d, lo);
  const isOnlyEnd = (d: Date) => !!hi && sameDay(d, hi);
  const isBetween = (d: Date) =>
    !!lo && !!hi && d.getTime() > lo.getTime() && d.getTime() < hi.getTime();
  const isSingleSel = () => !!lo && !!hi && sameDay(lo, hi);

  function toggleStatus(s: StatusOption) {
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }
  function toggleCategory(c: CategoryOption) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }
  function handleReset() {
    const y = today.getUTCFullYear(),
      m = today.getUTCMonth();
    setSelectedStatuses(["inProgress", "review"]);
    setSelectedCategories(["operations", "compliance"]);
    setSortField("creationDate");
    setSortDirection("desc");
    setRangeStart(new Date(Date.UTC(y, m, 1)));
    setRangeEnd(new Date(Date.UTC(y, m, 15)));
    setSelecting(false);
    setViewYear(y);
    setViewMonth(m);
  }

  const sectionLabel: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: config.sectionLabelColor,
    marginBottom: "10px",
    display: "block",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fm-scroll::-webkit-scrollbar { width: 4px; }
        .fm-scroll::-webkit-scrollbar-track { background: transparent; }
        .fm-scroll::-webkit-scrollbar-thumb { background: ${config.modalBorderColor}; border-radius: 4px; }
      `}</style>

      <div
        style={{
          background: config.modalBackground,
          border: `1px solid ${config.modalBorderColor}`,
          borderRadius: config.modalBorderRadius,
          width: "100%",
          maxWidth: config.modalWidth,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: config.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none",
          animation: config.animateOpen
            ? "modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
            : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: config.headerBackground,
            borderBottom: `1px solid ${config.headerBorderColor}`,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TuneIcon color={config.headerIconColor} />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: config.headerTextColor,
                letterSpacing: "-0.01em",
              }}
            >
              Advanced Filters
            </span>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: config.sectionLabelColor,
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                config.closeButtonHoverBackground)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          className="fm-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxHeight: "520px",
          }}
        >
          {/* Sort By */}
          <section>
            <span style={sectionLabel}>Sort By</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {SORT_FIELDS.map(({ value, label }) => {
                const isActive = sortField === value;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      if (sortField === value)
                        setSortDirection((d) =>
                          d === "desc" ? "asc" : "desc",
                        );
                      else {
                        setSortField(value);
                        setSortDirection("desc");
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      background: isActive
                        ? config.sortButtonActiveBackground
                        : config.sortButtonBackground,
                      border: `1.5px solid ${isActive ? config.sortButtonActiveBorderColor : config.sortButtonBorderColor}`,
                      borderRadius: config.sortButtonBorderRadius,
                      color: isActive
                        ? config.sortButtonActiveTextColor
                        : config.sortButtonTextColor,
                      fontSize: config.fontSize,
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <ArrowDownIcon
                        color={config.sortButtonActiveBorderColor}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Status */}
          <section>
            <span style={sectionLabel}>Filter by Status</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ALL_STATUSES.map((status) => {
                const isActive = selectedStatuses.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 12px",
                      background: isActive
                        ? config.statusChipActiveBackground
                        : config.statusChipBackground,
                      border: `1px solid ${isActive ? config.statusChipActiveBackground : config.statusChipBorderColor}`,
                      borderRadius: config.statusChipBorderRadius,
                      color: isActive
                        ? config.statusChipActiveTextColor
                        : config.statusChipTextColor,
                      fontSize: config.fontSize,
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {isActive && (
                      <CheckIcon color={config.statusChipActiveTextColor} />
                    )}
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Date Range Calendar */}
          <section>
            <span style={sectionLabel}>Date Range</span>
            <div
              style={{
                background: config.calendarBackground,
                border: `1px solid ${config.calendarBorderColor}`,
                borderRadius: config.calendarBorderRadius,
                padding: "14px",
              }}
            >
              {/* Month navigation */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={prevMonth}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: config.calendarChevronColor,
                    display: "flex",
                    padding: "4px",
                    borderRadius: "6px",
                  }}
                >
                  <ChevronIcon direction="left" />
                </button>
                <span
                  style={{
                    fontSize: config.fontSize,
                    fontWeight: 600,
                    color: config.calendarHeaderTextColor,
                  }}
                >
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={nextMonth}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: config.calendarChevronColor,
                    display: "flex",
                    padding: "4px",
                    borderRadius: "6px",
                  }}
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>

              {/* Day name row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  marginBottom: "2px",
                }}
              >
                {DAY_NAMES.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: config.calendarDayNameColor,
                      padding: "2px 0 6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid — gap:0 is critical for connected strips */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0,
                }}
                onMouseLeave={() => setHoverDate(null)}
              >
                {cells.map((date, idx) => {
                  if (!date)
                    return <div key={`b${idx}`} style={{ height: "34px" }} />;
                  const single = isSingleSel();
                  const start = isOnlyStart(date);
                  const end = isOnlyEnd(date);
                  const between = isBetween(date);
                  // "inRange" for DayCell means: has an end AND this day is between lo/hi
                  // We pass `inRange` as true only when there IS a hi (otherwise the strip would
                  // render on hover before the range is committed)
                  const rangeActive = !!hi;
                  return (
                    <DayCell
                      key={date.toISOString()}
                      date={date}
                      isStart={start}
                      isEnd={end}
                      inRange={rangeActive && between}
                      isHovered={!!hoverDate && sameDay(date, hoverDate)}
                      isSingle={single}
                      config={config}
                      onMouseEnter={() => setHoverDate(date)}
                      onClick={() => handleDayClick(date)}
                    />
                  );
                })}
              </div>

              {/* Hint when awaiting second click */}
              {selecting && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "8px",
                    fontSize: "11px",
                    color: config.sectionLabelColor,
                  }}
                >
                  Click a day to set end date
                </div>
              )}

              {/* Range summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  paddingTop: "8px",
                  borderTop: `1px solid ${config.calendarBorderColor}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: config.sectionLabelColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Start Date
                  </div>
                  <div
                    style={{
                      fontSize: config.fontSize,
                      fontWeight: 500,
                      color: config.calendarHeaderTextColor,
                      marginTop: "2px",
                    }}
                  >
                    {lo ? formatDate(lo) : "—"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: config.sectionLabelColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    End Date
                  </div>
                  <div
                    style={{
                      fontSize: config.fontSize,
                      fontWeight: 500,
                      color: config.calendarHeaderTextColor,
                      marginTop: "2px",
                    }}
                  >
                    {hi ? formatDate(hi) : "—"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Category */}
          <section>
            <span style={sectionLabel}>Category</span>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {CATEGORIES.map(({ value, label, count }) => {
                const isChecked = selectedCategories.includes(value);
                return (
                  <label
                    key={value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "9px 12px",
                      background: config.categoryRowBackground,
                      border: `1px solid ${config.categoryRowBorderColor}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        config.categoryRowHoverBackground)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        config.categoryRowBackground)
                    }
                  >
                    <div
                      onClick={() => toggleCategory(value)}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        border: `2px solid ${isChecked ? config.checkboxActiveBackground : config.checkboxBorderColor}`,
                        background: isChecked
                          ? config.checkboxActiveBackground
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >
                      {isChecked && (
                        <CheckIcon color={config.checkboxActiveTextColor} />
                      )}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: config.fontSize,
                        color: config.calendarHeaderTextColor,
                      }}
                      onClick={() => toggleCategory(value)}
                    >
                      {label}
                    </span>
                    {config.showCategoryCount && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: config.categoryCountColor,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            background: config.footerBackground,
            borderTop: `1px solid ${config.footerBorderColor}`,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <button
            onClick={handleReset}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: config.fontSize,
              fontWeight: 500,
              color: config.resetButtonTextColor,
              padding: "8px 4px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = config.calendarHeaderTextColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = config.resetButtonTextColor)
            }
          >
            Reset all filters
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                padding: "8px 18px",
                background: config.cancelButtonBackground,
                border: `1px solid ${config.cancelButtonBorderColor}`,
                borderRadius: config.applyButtonBorderRadius,
                color: config.cancelButtonTextColor,
                fontSize: config.fontSize,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "8px 18px",
                background: config.applyButtonBackground,
                border: "none",
                borderRadius: config.applyButtonBorderRadius,
                color: config.applyButtonTextColor,
                fontSize: config.fontSize,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: `0 4px 16px ${config.applyButtonBackground}44`,
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
