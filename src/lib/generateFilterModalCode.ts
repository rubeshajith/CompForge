// /lib/generateFilterModalCode.ts

import { FilterModalConfig } from "./filterModalConfig";

export function generateFilterModalJSX(config: FilterModalConfig): string {
  return `import { useState } from "react";
import "./FilterModal.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  inProgress: "In Progress", completed: "Completed", review: "Review",
  onHold: "On Hold", cancelled: "Cancelled",
};

const SORT_FIELDS = [
  { value: "creationDate", label: "Creation Date" },
  { value: "projectName", label: "Project Name" },
  { value: "dueDate",     label: "Due Date" },
  { value: "priority",    label: "Priority" },
];

const ALL_STATUSES = ["inProgress", "completed", "review", "onHold", "cancelled"];

const CATEGORIES = [
  { value: "operations",  label: "Operations",  count: 24 },
  { value: "compliance",  label: "Compliance",  count: 12 },
  { value: "marketing",   label: "Marketing",   count: 38 },
  { value: "engineering", label: "Engineering", count: 19 },
  { value: "design",      label: "Design",      count: 7  },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Calendar helpers (UTC-safe) ──────────────────────────────────────────────

function getDaysInMonth(month, year) {
  const firstDow  = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

function sameDay(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
         a.getUTCMonth()    === b.getUTCMonth()    &&
         a.getUTCDate()     === b.getUTCDate();
}

function isBefore(a, b) { return a.getTime() < b.getTime(); }

function formatDate(d) {
  const day = String(d.getUTCDate()).padStart(2, "0");
  return MONTH_NAMES[d.getUTCMonth()].slice(0, 3) + " " + day + ", " + d.getUTCFullYear();
}

// ─── DayCell — connected range highlight ─────────────────────────────────────
// Outer div = full grid column width, carries the range fill strip (gap:0 on grid).
// Inner div = 28px bubble for the day number.
// Start endpoint → right-half strip. End endpoint → left-half strip. In-range → full strip.

function DayCell({ date, isStart, isEnd, inRange, isHovered, isSingle, onMouseEnter, onClick }) {
  const dayNum = date.getUTCDate();
  const isEndpoint = isStart || isEnd;
  const rangeColor = "${config.calendarRangeBackground}";

  let outerBg = "transparent";
  if (!isSingle && isStart && inRange) {
    outerBg = "linear-gradient(to right, transparent 50%, " + rangeColor + " 50%)";
  } else if (!isSingle && isEnd) {
    outerBg = "linear-gradient(to left, transparent 50%, " + rangeColor + " 50%)";
  } else if (inRange) {
    outerBg = rangeColor;
  }

  let bubbleBg     = "transparent";
  let bubbleRadius = "8px";
  let textColor    = "${config.calendarDayTextColor}";
  let fontWeight   = 400;

  if (isEndpoint && !isSingle) {
    bubbleBg = "${config.calendarSelectedBackground}";
    bubbleRadius = "50%";
    textColor = "${config.calendarSelectedTextColor}";
    fontWeight = 700;
  } else if (isSingle && isStart) {
    bubbleBg = "${config.calendarSelectedBackground}";
    bubbleRadius = "50%";
    textColor = "${config.calendarSelectedTextColor}";
    fontWeight = 700;
  } else if (inRange) {
    textColor = "${config.calendarRangeTextColor}";
  } else if (isHovered) {
    bubbleBg = "${config.calendarDayHoverBackground}";
  }

  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter}
      style={{ position: "relative", height: "34px", display: "flex", alignItems: "center",
               justifyContent: "center", cursor: "pointer", background: outerBg }}>
      <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center",
                    justifyContent: "center", borderRadius: bubbleRadius, background: bubbleBg,
                    color: textColor, fontSize: ${config.fontSize}, fontWeight,
                    transition: "background 0.1s", position: "relative", zIndex: 1,
                    flexShrink: 0, userSelect: "none" }}>
        {dayNum}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FilterModal({ onApply, onClose }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());

  const [rangeStart, setRangeStart] = useState(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  );
  const [rangeEnd,   setRangeEnd]   = useState(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 15))
  );
  const [hoverDate,  setHoverDate]  = useState(null);
  const [selecting,  setSelecting]  = useState(false);

  const [selectedStatuses,   setSelectedStatuses]   = useState(${JSON.stringify(config.selectedStatuses)});
  const [selectedCategories, setSelectedCategories] = useState(${JSON.stringify(config.selectedCategories)});
  const [sortField,          setSortField]          = useState("${config.sortField}");
  const [sortDirection,      setSortDirection]      = useState("${config.sortDirection}");

  const cells = getDaysInMonth(viewMonth, viewYear);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(date) {
    if (!selecting) {
      setRangeStart(date); setRangeEnd(null); setSelecting(true);
    } else {
      if (rangeStart && isBefore(date, rangeStart)) {
        setRangeEnd(rangeStart); setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelecting(false); setHoverDate(null);
    }
  }

  const effectiveEnd = selecting && hoverDate ? hoverDate : rangeEnd;
  const lo = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? rangeStart : effectiveEnd) : rangeStart;
  const hi = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? effectiveEnd : rangeStart) : null;

  const isStart   = d => lo && sameDay(d, lo);
  const isEnd     = d => hi && sameDay(d, hi);
  const inRange   = d => lo && hi && d.getTime() > lo.getTime() && d.getTime() < hi.getTime();
  const isSingle  = () => lo && hi && sameDay(lo, hi);

  function toggleStatus(s) {
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleCategory(c) {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }
  function handleReset() {
    const y = today.getUTCFullYear(), m = today.getUTCMonth();
    setSelectedStatuses(${JSON.stringify(config.selectedStatuses)});
    setSelectedCategories(${JSON.stringify(config.selectedCategories)});
    setSortField("${config.sortField}");
    setSortDirection("${config.sortDirection}");
    setRangeStart(new Date(Date.UTC(y, m, 1)));
    setRangeEnd(new Date(Date.UTC(y, m, 15)));
    setSelecting(false); setViewYear(y); setViewMonth(m);
  }
  function handleApply() {
    onApply?.({ selectedStatuses, selectedCategories, sortField, sortDirection,
      dateRange: { start: lo, end: hi } });
  }

  return (
    <div className="fm">

      {/* Header */}
      <div className="fm__header">
        <div className="fm__header-left">
          <svg className="fm__tune-icon" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
            <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
          </svg>
          <span className="fm__title">Advanced Filters</span>
        </div>
        <button className="fm__close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="fm__body">

        {/* Sort */}
        <section className="fm__section">
          <span className="fm__section-label">Sort By</span>
          <div className="fm__sort-grid">
            {SORT_FIELDS.map(({ value, label }) => (
              <button key={value}
                className={\`fm__sort-btn \${sortField === value ? "fm__sort-btn--active" : ""}\`}
                onClick={() => {
                  if (sortField === value) setSortDirection(d => d === "desc" ? "asc" : "desc");
                  else { setSortField(value); setSortDirection("desc"); }
                }}>
                <span>{label}</span>
                {sortField === value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="5 12 12 19 19 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Status */}
        <section className="fm__section">
          <span className="fm__section-label">Filter by Status</span>
          <div className="fm__chips">
            {ALL_STATUSES.map(status => (
              <button key={status}
                className={\`fm__chip \${selectedStatuses.includes(status) ? "fm__chip--active" : ""}\`}
                onClick={() => toggleStatus(status)}>
                {selectedStatuses.includes(status) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>

        {/* Date Range */}
        <section className="fm__section">
          <span className="fm__section-label">Date Range</span>
          <div className="fm__cal">
            <div className="fm__cal-header">
              <button className="fm__cal-chevron" onClick={prevMonth}>&#8249;</button>
              <span className="fm__cal-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button className="fm__cal-chevron" onClick={nextMonth}>&#8250;</button>
            </div>
            <div className="fm__cal-daynames">
              {DAY_NAMES.map(d => <div key={d} className="fm__cal-dayname">{d}</div>)}
            </div>
            {/* gap:0 grid is critical — lets the range strips connect seamlessly */}
            <div className="fm__cal-grid" onMouseLeave={() => setHoverDate(null)}>
              {cells.map((date, idx) =>
                !date
                  ? <div key={\`b\${idx}\`} className="fm__cal-blank" />
                  : <DayCell key={date.toISOString()} date={date}
                      isStart={isStart(date)} isEnd={isEnd(date)}
                      inRange={!!hi && inRange(date)}
                      isHovered={hoverDate && sameDay(date, hoverDate)}
                      isSingle={isSingle()}
                      onMouseEnter={() => setHoverDate(date)}
                      onClick={() => handleDayClick(date)} />
              )}
            </div>
            {selecting && (
              <div className="fm__cal-hint">Click a day to set end date</div>
            )}
            <div className="fm__cal-footer">
              <div>
                <div className="fm__cal-footer-label">Start Date</div>
                <div className="fm__cal-footer-value">{lo ? formatDate(lo) : "—"}</div>
              </div>
              <div className="fm__cal-footer-right">
                <div className="fm__cal-footer-label">End Date</div>
                <div className="fm__cal-footer-value">{hi ? formatDate(hi) : "—"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="fm__section">
          <span className="fm__section-label">Category</span>
          <div className="fm__categories">
            {CATEGORIES.map(({ value, label, count }) => (
              <label key={value} className="fm__category-row">
                <div className={\`fm__checkbox \${selectedCategories.includes(value) ? "fm__checkbox--checked" : ""}\`}
                  onClick={() => toggleCategory(value)}>
                  {selectedCategories.includes(value) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="fm__category-label" onClick={() => toggleCategory(value)}>
                  {label}
                </span>
                ${config.showCategoryCount ? `<span className="fm__category-count">{count}</span>` : ""}
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="fm__footer">
        <button className="fm__reset" onClick={handleReset}>Reset all filters</button>
        <div className="fm__footer-actions">
          <button className="fm__cancel" onClick={onClose}>Cancel</button>
          <button className="fm__apply" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}`;
}

export function generateFilterModalCSS(config: FilterModalConfig): string {
  return `.fm {
  background: ${config.modalBackground};
  border: 1px solid ${config.modalBorderColor};
  border-radius: ${config.modalBorderRadius}px;
  width: 100%;
  max-width: ${config.modalWidth}px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${config.showShadow ? "box-shadow: 0 8px 48px rgba(0,0,0,0.6);" : ""}
  ${config.animateOpen ? "animation: fm-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both;" : ""}
}
${
  config.animateOpen
    ? `
@keyframes fm-in {
  from { opacity: 0; transform: scale(0.94) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}`
    : ""
}

/* ── Header ──────────────────────────────────────────────── */
.fm__header {
  background: ${config.headerBackground};
  border-bottom: 1px solid ${config.headerBorderColor};
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fm__header-left { display: flex; align-items: center; gap: 10px; }
.fm__tune-icon   { color: ${config.headerIconColor}; }
.fm__title {
  font-size: 16px;
  font-weight: 600;
  color: ${config.headerTextColor};
  letter-spacing: -0.01em;
}
.fm__close {
  background: none;
  border: none;
  cursor: pointer;
  color: ${config.sectionLabelColor};
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.fm__close:hover { background: ${config.closeButtonHoverBackground}; }

/* ── Body ────────────────────────────────────────────────── */
.fm__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 520px;
}
.fm__body::-webkit-scrollbar       { width: 4px; }
.fm__body::-webkit-scrollbar-thumb { background: ${config.modalBorderColor}; border-radius: 4px; }

.fm__section-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${config.sectionLabelColor};
  margin-bottom: 10px;
}

/* ── Sort ────────────────────────────────────────────────── */
.fm__sort-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.fm__sort-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: ${config.sortButtonBackground};
  border: 1.5px solid ${config.sortButtonBorderColor};
  border-radius: ${config.sortButtonBorderRadius}px;
  color: ${config.sortButtonTextColor};
  font-size: ${config.fontSize}px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s;
}
.fm__sort-btn--active {
  background: ${config.sortButtonActiveBackground};
  border-color: ${config.sortButtonActiveBorderColor};
  color: ${config.sortButtonActiveTextColor};
  font-weight: 600;
}

/* ── Status chips ────────────────────────────────────────── */
.fm__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.fm__chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: ${config.statusChipBackground};
  border: 1px solid ${config.statusChipBorderColor};
  border-radius: ${config.statusChipBorderRadius}px;
  color: ${config.statusChipTextColor};
  font-size: ${config.fontSize}px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s;
}
.fm__chip--active {
  background: ${config.statusChipActiveBackground};
  border-color: ${config.statusChipActiveBackground};
  color: ${config.statusChipActiveTextColor};
  font-weight: 600;
}

/* ── Calendar ────────────────────────────────────────────── */
.fm__cal {
  background: ${config.calendarBackground};
  border: 1px solid ${config.calendarBorderColor};
  border-radius: ${config.calendarBorderRadius}px;
  padding: 14px;
}
.fm__cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.fm__cal-chevron {
  background: none;
  border: none;
  cursor: pointer;
  color: ${config.calendarChevronColor};
  font-size: 22px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.fm__cal-chevron:hover { background: ${config.calendarDayHoverBackground}; }
.fm__cal-title {
  font-size: ${config.fontSize}px;
  font-weight: 600;
  color: ${config.calendarHeaderTextColor};
}
.fm__cal-daynames {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 2px;
}
.fm__cal-dayname {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: ${config.calendarDayNameColor};
  padding: 2px 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* gap:0 is what makes the range strips connect — do not add gap here */
.fm__cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}
.fm__cal-blank { height: 34px; }

/* Day cell: outer = strip layer, inner = bubble */
.fm__cal-day-outer {
  position: relative;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* background set inline per-cell (start/end/range/none) */
}
.fm__cal-day-bubble {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: ${config.fontSize}px;
  font-weight: 400;
  color: ${config.calendarDayTextColor};
  transition: background 0.1s;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  user-select: none;
}
.fm__cal-day-outer:hover .fm__cal-day-bubble {
  background: ${config.calendarDayHoverBackground};
}
/* Selected endpoints (start / end) */
.fm__cal-day-outer--start .fm__cal-day-bubble,
.fm__cal-day-outer--end   .fm__cal-day-bubble {
  background: ${config.calendarSelectedBackground};
  color: ${config.calendarSelectedTextColor};
  border-radius: 50%;
  font-weight: 700;
}
/* In-range day text */
.fm__cal-day-outer--range .fm__cal-day-bubble {
  color: ${config.calendarRangeTextColor};
}
/* Range strip directions — applied inline as background shorthand */
/* .fm__cal-day-outer--start: gradient right-half  */
/* .fm__cal-day-outer--end:   gradient left-half   */
/* .fm__cal-day-outer--range: solid range color    */

.fm__cal-hint {
  text-align: center;
  margin-top: 8px;
  font-size: 11px;
  color: ${config.sectionLabelColor};
}
.fm__cal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid ${config.calendarBorderColor};
}
.fm__cal-footer-right { text-align: right; }
.fm__cal-footer-label {
  font-size: 10px;
  font-weight: 700;
  color: ${config.sectionLabelColor};
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.fm__cal-footer-value {
  font-size: ${config.fontSize}px;
  font-weight: 500;
  color: ${config.calendarHeaderTextColor};
  margin-top: 2px;
}

/* ── Categories ──────────────────────────────────────────── */
.fm__categories { display: flex; flex-direction: column; gap: 6px; }
.fm__category-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  background: ${config.categoryRowBackground};
  border: 1px solid ${config.categoryRowBorderColor};
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.fm__category-row:hover { background: ${config.categoryRowHoverBackground}; }
.fm__checkbox {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid ${config.checkboxBorderColor};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  color: ${config.checkboxActiveTextColor};
}
.fm__checkbox--checked {
  background: ${config.checkboxActiveBackground};
  border-color: ${config.checkboxActiveBackground};
}
.fm__category-label {
  flex: 1;
  font-size: ${config.fontSize}px;
  color: ${config.calendarHeaderTextColor};
}
.fm__category-count { font-size: 12px; color: ${config.categoryCountColor}; }

/* ── Footer ──────────────────────────────────────────────── */
.fm__footer {
  background: ${config.footerBackground};
  border-top: 1px solid ${config.footerBorderColor};
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.fm__reset {
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${config.fontSize}px;
  font-weight: 500;
  color: ${config.resetButtonTextColor};
  padding: 8px 4px;
  transition: color 0.15s;
}
.fm__reset:hover { color: ${config.calendarHeaderTextColor}; }
.fm__footer-actions { display: flex; gap: 8px; }
.fm__cancel {
  padding: 8px 18px;
  background: ${config.cancelButtonBackground};
  border: 1px solid ${config.cancelButtonBorderColor};
  border-radius: ${config.applyButtonBorderRadius}px;
  color: ${config.cancelButtonTextColor};
  font-size: ${config.fontSize}px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.fm__cancel:hover { opacity: 0.8; }
.fm__apply {
  padding: 8px 18px;
  background: ${config.applyButtonBackground};
  border: none;
  border-radius: ${config.applyButtonBorderRadius}px;
  color: ${config.applyButtonTextColor};
  font-size: ${config.fontSize}px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 16px ${config.applyButtonBackground}44;
}
.fm__apply:hover  { opacity: 0.9; transform: translateY(-1px); }
.fm__apply:active { transform: scale(0.97); }`;
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateFilterModalTSX(config: FilterModalConfig): string {
  return `import { useState } from "react";
import "./FilterModal.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  inProgress: "In Progress", completed: "Completed", review: "Review",
  onHold: "On Hold", cancelled: "Cancelled",
};

const SORT_FIELDS: { value: string; label: string }[] = [
  { value: "creationDate", label: "Creation Date" },
  { value: "projectName", label: "Project Name" },
  { value: "dueDate",     label: "Due Date" },
  { value: "priority",    label: "Priority" },
];

const ALL_STATUSES: string[] = ["inProgress", "completed", "review", "onHold", "cancelled"];

interface Category {
  value: string;
  label: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { value: "operations",  label: "Operations",  count: 24 },
  { value: "compliance",  label: "Compliance",  count: 12 },
  { value: "marketing",   label: "Marketing",   count: 38 },
  { value: "engineering", label: "Engineering", count: 19 },
  { value: "design",      label: "Design",      count: 7  },
];

const MONTH_NAMES: string[] = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES: string[] = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Calendar helpers (UTC-safe) ──────────────────────────────────────────────

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDow  = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
         a.getUTCMonth()    === b.getUTCMonth()    &&
         a.getUTCDate()     === b.getUTCDate();
}

function isBefore(a: Date, b: Date): boolean { return a.getTime() < b.getTime(); }

function formatDate(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, "0");
  return MONTH_NAMES[d.getUTCMonth()].slice(0, 3) + " " + day + ", " + d.getUTCFullYear();
}

// ─── DayCell ──────────────────────────────────────────────────────────────────

interface DayCellProps {
  date: Date;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHovered: boolean;
  isSingle: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

function DayCell({ date, isStart, isEnd, inRange, isHovered, isSingle, onMouseEnter, onClick }: DayCellProps) {
  const dayNum = date.getUTCDate();
  const isEndpoint = isStart || isEnd;
  const rangeColor = "${config.calendarRangeBackground}";

  let outerBg = "transparent";
  if (!isSingle && isStart && inRange) {
    outerBg = "linear-gradient(to right, transparent 50%, " + rangeColor + " 50%)";
  } else if (!isSingle && isEnd) {
    outerBg = "linear-gradient(to left, transparent 50%, " + rangeColor + " 50%)";
  } else if (inRange) {
    outerBg = rangeColor;
  }

  let bubbleBg     = "transparent";
  let bubbleRadius = "8px";
  let textColor    = "${config.calendarDayTextColor}";
  let fontWeight   = 400;

  if (isEndpoint && !isSingle) {
    bubbleBg = "${config.calendarSelectedBackground}";
    bubbleRadius = "50%";
    textColor = "${config.calendarSelectedTextColor}";
    fontWeight = 700;
  } else if (isSingle && isStart) {
    bubbleBg = "${config.calendarSelectedBackground}";
    bubbleRadius = "50%";
    textColor = "${config.calendarSelectedTextColor}";
    fontWeight = 700;
  } else if (inRange) {
    textColor = "${config.calendarRangeTextColor}";
  } else if (isHovered) {
    bubbleBg = "${config.calendarDayHoverBackground}";
  }

  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter}
      style={{ position: "relative", height: "34px", display: "flex", alignItems: "center",
               justifyContent: "center", cursor: "pointer", background: outerBg }}>
      <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center",
                    justifyContent: "center", borderRadius: bubbleRadius, background: bubbleBg,
                    color: textColor, fontSize: ${config.fontSize}, fontWeight,
                    transition: "background 0.1s", position: "relative", zIndex: 1,
                    flexShrink: 0, userSelect: "none" }}>
        {dayNum}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FilterModalProps {
  onApply?: (filters: {
    selectedStatuses: string[];
    selectedCategories: string[];
    sortField: string;
    sortDirection: string;
    dateRange: { start: Date | null; end: Date | null };
  }) => void;
  onClose?: () => void;
}

export default function FilterModal({ onApply, onClose }: FilterModalProps) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState<number>(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());

  const [rangeStart, setRangeStart] = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  );
  const [rangeEnd,   setRangeEnd]   = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 15))
  );
  const [hoverDate,  setHoverDate]  = useState<Date | null>(null);
  const [selecting,  setSelecting]  = useState<boolean>(false);

  const [selectedStatuses,   setSelectedStatuses]   = useState<string[]>(${JSON.stringify(config.selectedStatuses)});
  const [selectedCategories, setSelectedCategories] = useState<string[]>(${JSON.stringify(config.selectedCategories)});
  const [sortField,          setSortField]          = useState<string>("${config.sortField}");
  const [sortDirection,      setSortDirection]      = useState<string>("${config.sortDirection}");

  const cells = getDaysInMonth(viewMonth, viewYear);

  function prevMonth(): void {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth(): void {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(date: Date): void {
    if (!selecting) {
      setRangeStart(date); setRangeEnd(null); setSelecting(true);
    } else {
      if (rangeStart && isBefore(date, rangeStart)) {
        setRangeEnd(rangeStart); setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelecting(false); setHoverDate(null);
    }
  }

  const effectiveEnd = selecting && hoverDate ? hoverDate : rangeEnd;
  const lo = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? rangeStart : effectiveEnd) : rangeStart;
  const hi = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? effectiveEnd : rangeStart) : null;

  const isStart  = (d: Date): boolean => !!(lo && sameDay(d, lo));
  const isEnd    = (d: Date): boolean => !!(hi && sameDay(d, hi));
  const inRange  = (d: Date): boolean => !!(lo && hi && d.getTime() > lo.getTime() && d.getTime() < hi.getTime());
  const isSingle = (): boolean => !!(lo && hi && sameDay(lo, hi));

  function toggleStatus(s: string): void {
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleCategory(c: string): void {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }
  function handleReset(): void {
    const y = today.getUTCFullYear(), m = today.getUTCMonth();
    setSelectedStatuses(${JSON.stringify(config.selectedStatuses)});
    setSelectedCategories(${JSON.stringify(config.selectedCategories)});
    setSortField("${config.sortField}");
    setSortDirection("${config.sortDirection}");
    setRangeStart(new Date(Date.UTC(y, m, 1)));
    setRangeEnd(new Date(Date.UTC(y, m, 15)));
    setSelecting(false); setViewYear(y); setViewMonth(m);
  }
  function handleApply(): void {
    onApply?.({ selectedStatuses, selectedCategories, sortField, sortDirection,
      dateRange: { start: lo, end: hi } });
  }

  return (
    <div className="fm">

      {/* Header */}
      <div className="fm__header">
        <div className="fm__header-left">
          <svg className="fm__tune-icon" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
            <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
          </svg>
          <span className="fm__title">Advanced Filters</span>
        </div>
        <button className="fm__close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="fm__body">

        {/* Sort */}
        <section className="fm__section">
          <span className="fm__section-label">Sort By</span>
          <div className="fm__sort-grid">
            {SORT_FIELDS.map(({ value, label }) => (
              <button key={value}
                className={\`fm__sort-btn \${sortField === value ? "fm__sort-btn--active" : ""}\`}
                onClick={() => {
                  if (sortField === value) setSortDirection(d => d === "desc" ? "asc" : "desc");
                  else { setSortField(value); setSortDirection("desc"); }
                }}>
                <span>{label}</span>
                {sortField === value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="5 12 12 19 19 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Status */}
        <section className="fm__section">
          <span className="fm__section-label">Filter by Status</span>
          <div className="fm__chips">
            {ALL_STATUSES.map(status => (
              <button key={status}
                className={\`fm__chip \${selectedStatuses.includes(status) ? "fm__chip--active" : ""}\`}
                onClick={() => toggleStatus(status)}>
                {selectedStatuses.includes(status) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>

        {/* Date Range */}
        <section className="fm__section">
          <span className="fm__section-label">Date Range</span>
          <div className="fm__cal">
            <div className="fm__cal-header">
              <button className="fm__cal-chevron" onClick={prevMonth}>&#8249;</button>
              <span className="fm__cal-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button className="fm__cal-chevron" onClick={nextMonth}>&#8250;</button>
            </div>
            <div className="fm__cal-daynames">
              {DAY_NAMES.map(d => <div key={d} className="fm__cal-dayname">{d}</div>)}
            </div>
            <div className="fm__cal-grid" onMouseLeave={() => setHoverDate(null)}>
              {cells.map((date, idx) =>
                !date
                  ? <div key={\`b\${idx}\`} className="fm__cal-blank" />
                  : <DayCell key={date.toISOString()} date={date}
                      isStart={isStart(date)} isEnd={isEnd(date)}
                      inRange={!!hi && inRange(date)}
                      isHovered={!!(hoverDate && sameDay(date, hoverDate))}
                      isSingle={isSingle()}
                      onMouseEnter={() => setHoverDate(date)}
                      onClick={() => handleDayClick(date)} />
              )}
            </div>
            {selecting && (
              <div className="fm__cal-hint">Click a day to set end date</div>
            )}
            <div className="fm__cal-footer">
              <div>
                <div className="fm__cal-footer-label">Start Date</div>
                <div className="fm__cal-footer-value">{lo ? formatDate(lo) : "—"}</div>
              </div>
              <div className="fm__cal-footer-right">
                <div className="fm__cal-footer-label">End Date</div>
                <div className="fm__cal-footer-value">{hi ? formatDate(hi) : "—"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="fm__section">
          <span className="fm__section-label">Category</span>
          <div className="fm__categories">
            {CATEGORIES.map(({ value, label, count }) => (
              <label key={value} className="fm__category-row">
                <div className={\`fm__checkbox \${selectedCategories.includes(value) ? "fm__checkbox--checked" : ""}\`}
                  onClick={() => toggleCategory(value)}>
                  {selectedCategories.includes(value) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="fm__category-label" onClick={() => toggleCategory(value)}>
                  {label}
                </span>
                ${config.showCategoryCount ? `<span className="fm__category-count">{count}</span>` : ""}
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="fm__footer">
        <button className="fm__reset" onClick={handleReset}>Reset all filters</button>
        <div className="fm__footer-actions">
          <button className="fm__cancel" onClick={onClose}>Cancel</button>
          <button className="fm__apply" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateFilterModalTailwind(config: FilterModalConfig): string {
  // Pre-compute values that need JS logic
  const shadow = config.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none";

  // Bake font sizes as literals
  const fs = config.fontSize;

  return `import { useState, CSSProperties } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  inProgress: "In Progress", completed: "Completed", review: "Review",
  onHold: "On Hold", cancelled: "Cancelled",
};

const SORT_FIELDS: { value: string; label: string }[] = [
  { value: "creationDate", label: "Creation Date" },
  { value: "projectName", label: "Project Name" },
  { value: "dueDate",     label: "Due Date" },
  { value: "priority",    label: "Priority" },
];

const ALL_STATUSES: string[] = ["inProgress", "completed", "review", "onHold", "cancelled"];

interface Category {
  value: string;
  label: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { value: "operations",  label: "Operations",  count: 24 },
  { value: "compliance",  label: "Compliance",  count: 12 },
  { value: "marketing",   label: "Marketing",   count: 38 },
  { value: "engineering", label: "Engineering", count: 19 },
  { value: "design",      label: "Design",      count: 7  },
];

const MONTH_NAMES: string[] = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES: string[] = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Calendar helpers (UTC-safe) ──────────────────────────────────────────────

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDow  = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
         a.getUTCMonth()    === b.getUTCMonth()    &&
         a.getUTCDate()     === b.getUTCDate();
}

function isBefore(a: Date, b: Date): boolean { return a.getTime() < b.getTime(); }

function formatDate(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, "0");
  return MONTH_NAMES[d.getUTCMonth()].slice(0, 3) + " " + day + ", " + d.getUTCFullYear();
}

// ─── Baked-in CSS variable tokens — update these to reskin the FilterModal ───

const fmVars: CSSProperties = {
  "--fm-modal-bg":                    "${config.modalBackground}",
  "--fm-modal-border":                "${config.modalBorderColor}",
  "--fm-modal-radius":                "${config.modalBorderRadius}px",
  "--fm-modal-width":                 "${config.modalWidth}px",
  "--fm-header-bg":                   "${config.headerBackground}",
  "--fm-header-border":               "${config.headerBorderColor}",
  "--fm-header-text":                 "${config.headerTextColor}",
  "--fm-header-icon":                 "${config.headerIconColor}",
  "--fm-section-label":               "${config.sectionLabelColor}",
  "--fm-close-hover-bg":              "${config.closeButtonHoverBackground}",
  "--fm-sort-btn-bg":                 "${config.sortButtonBackground}",
  "--fm-sort-btn-border":             "${config.sortButtonBorderColor}",
  "--fm-sort-btn-radius":             "${config.sortButtonBorderRadius}px",
  "--fm-sort-btn-text":               "${config.sortButtonTextColor}",
  "--fm-sort-btn-active-bg":          "${config.sortButtonActiveBackground}",
  "--fm-sort-btn-active-border":      "${config.sortButtonActiveBorderColor}",
  "--fm-sort-btn-active-text":        "${config.sortButtonActiveTextColor}",
  "--fm-chip-bg":                     "${config.statusChipBackground}",
  "--fm-chip-border":                 "${config.statusChipBorderColor}",
  "--fm-chip-radius":                 "${config.statusChipBorderRadius}px",
  "--fm-chip-text":                   "${config.statusChipTextColor}",
  "--fm-chip-active-bg":              "${config.statusChipActiveBackground}",
  "--fm-chip-active-text":            "${config.statusChipActiveTextColor}",
  "--fm-cal-bg":                      "${config.calendarBackground}",
  "--fm-cal-border":                  "${config.calendarBorderColor}",
  "--fm-cal-radius":                  "${config.calendarBorderRadius}px",
  "--fm-cal-header-text":             "${config.calendarHeaderTextColor}",
  "--fm-cal-chevron":                 "${config.calendarChevronColor}",
  "--fm-cal-dayname":                 "${config.calendarDayNameColor}",
  "--fm-cal-day-text":                "${config.calendarDayTextColor}",
  "--fm-cal-day-hover-bg":            "${config.calendarDayHoverBackground}",
  "--fm-cal-selected-bg":             "${config.calendarSelectedBackground}",
  "--fm-cal-selected-text":           "${config.calendarSelectedTextColor}",
  "--fm-cal-range-bg":                "${config.calendarRangeBackground}",
  "--fm-cal-range-text":              "${config.calendarRangeTextColor}",
  "--fm-cat-row-bg":                  "${config.categoryRowBackground}",
  "--fm-cat-row-border":              "${config.categoryRowBorderColor}",
  "--fm-cat-row-hover-bg":            "${config.categoryRowHoverBackground}",
  "--fm-checkbox-border":             "${config.checkboxBorderColor}",
  "--fm-checkbox-active-bg":          "${config.checkboxActiveBackground}",
  "--fm-checkbox-active-text":        "${config.checkboxActiveTextColor}",
  "--fm-cat-count":                   "${config.categoryCountColor}",
  "--fm-footer-bg":                   "${config.footerBackground}",
  "--fm-footer-border":               "${config.footerBorderColor}",
  "--fm-reset-text":                  "${config.resetButtonTextColor}",
  "--fm-cancel-bg":                   "${config.cancelButtonBackground}",
  "--fm-cancel-border":               "${config.cancelButtonBorderColor}",
  "--fm-cancel-text":                 "${config.cancelButtonTextColor}",
  "--fm-apply-bg":                    "${config.applyButtonBackground}",
  "--fm-apply-text":                  "${config.applyButtonTextColor}",
  "--fm-apply-radius":                "${config.applyButtonBorderRadius}px",
} as CSSProperties;

// ─── DayCell ──────────────────────────────────────────────────────────────────

interface DayCellProps {
  date: Date;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHovered: boolean;
  isSingle: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

function DayCell({ date, isStart, isEnd, inRange, isHovered, isSingle, onMouseEnter, onClick }: DayCellProps) {
  const dayNum = date.getUTCDate();
  const isEndpoint = isStart || isEnd;
  const rangeColor = "var(--fm-cal-range-bg)";

  let outerBg = "transparent";
  if (!isSingle && isStart && inRange) {
    outerBg = "linear-gradient(to right, transparent 50%, " + rangeColor + " 50%)";
  } else if (!isSingle && isEnd) {
    outerBg = "linear-gradient(to left, transparent 50%, " + rangeColor + " 50%)";
  } else if (inRange) {
    outerBg = rangeColor;
  }

  let bubbleBg     = "transparent";
  let bubbleRadius = "8px";
  let textColor    = "var(--fm-cal-day-text)";
  let fontWeight   = 400;

  if (isEndpoint && !isSingle) {
    bubbleBg = "var(--fm-cal-selected-bg)";
    bubbleRadius = "50%";
    textColor = "var(--fm-cal-selected-text)";
    fontWeight = 700;
  } else if (isSingle && isStart) {
    bubbleBg = "var(--fm-cal-selected-bg)";
    bubbleRadius = "50%";
    textColor = "var(--fm-cal-selected-text)";
    fontWeight = 700;
  } else if (inRange) {
    textColor = "var(--fm-cal-range-text)";
  } else if (isHovered) {
    bubbleBg = "var(--fm-cal-day-hover-bg)";
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="relative h-[34px] flex items-center justify-center cursor-pointer"
      style={{ background: outerBg }}
    >
      <div
        className="w-[28px] h-[28px] flex items-center justify-center shrink-0 select-none relative z-[1] transition-[background] duration-[100ms]"
        style={{
          borderRadius: bubbleRadius,
          background: bubbleBg,
          color: textColor,
          fontSize: "${fs}px",
          fontWeight,
        }}
      >
        {dayNum}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FilterModalProps {
  onApply?: (filters: {
    selectedStatuses: string[];
    selectedCategories: string[];
    sortField: string;
    sortDirection: string;
    dateRange: { start: Date | null; end: Date | null };
  }) => void;
  onClose?: () => void;
}

export default function FilterModal({ onApply, onClose }: FilterModalProps) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState<number>(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());

  const [rangeStart, setRangeStart] = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  );
  const [rangeEnd,   setRangeEnd]   = useState<Date | null>(
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 15))
  );
  const [hoverDate,  setHoverDate]  = useState<Date | null>(null);
  const [selecting,  setSelecting]  = useState<boolean>(false);

  const [selectedStatuses,   setSelectedStatuses]   = useState<string[]>(${JSON.stringify(config.selectedStatuses)});
  const [selectedCategories, setSelectedCategories] = useState<string[]>(${JSON.stringify(config.selectedCategories)});
  const [sortField,          setSortField]          = useState<string>("${config.sortField}");
  const [sortDirection,      setSortDirection]      = useState<string>("${config.sortDirection}");

  const cells = getDaysInMonth(viewMonth, viewYear);

  function prevMonth(): void {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth(): void {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(date: Date): void {
    if (!selecting) {
      setRangeStart(date); setRangeEnd(null); setSelecting(true);
    } else {
      if (rangeStart && isBefore(date, rangeStart)) {
        setRangeEnd(rangeStart); setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelecting(false); setHoverDate(null);
    }
  }

  const effectiveEnd = selecting && hoverDate ? hoverDate : rangeEnd;
  const lo = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? rangeStart : effectiveEnd) : rangeStart;
  const hi = rangeStart && effectiveEnd
    ? (isBefore(rangeStart, effectiveEnd) ? effectiveEnd : rangeStart) : null;

  const isStart  = (d: Date): boolean => !!(lo && sameDay(d, lo));
  const isEnd    = (d: Date): boolean => !!(hi && sameDay(d, hi));
  const inRange  = (d: Date): boolean => !!(lo && hi && d.getTime() > lo.getTime() && d.getTime() < hi.getTime());
  const isSingle = (): boolean => !!(lo && hi && sameDay(lo, hi));

  function toggleStatus(s: string): void {
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleCategory(c: string): void {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }
  function handleReset(): void {
    const y = today.getUTCFullYear(), m = today.getUTCMonth();
    setSelectedStatuses(${JSON.stringify(config.selectedStatuses)});
    setSelectedCategories(${JSON.stringify(config.selectedCategories)});
    setSortField("${config.sortField}");
    setSortDirection("${config.sortDirection}");
    setRangeStart(new Date(Date.UTC(y, m, 1)));
    setRangeEnd(new Date(Date.UTC(y, m, 15)));
    setSelecting(false); setViewYear(y); setViewMonth(m);
  }
  function handleApply(): void {
    onApply?.({ selectedStatuses, selectedCategories, sortField, sortDirection,
      dateRange: { start: lo, end: hi } });
  }

  return (
    <div
      className="w-full flex flex-col overflow-hidden bg-[var(--fm-modal-bg)] border border-[var(--fm-modal-border)] rounded-[var(--fm-modal-radius)] max-w-[var(--fm-modal-width)]${config.animateOpen ? " [animation:fm-in_0.25s_cubic-bezier(0.34,1.56,0.64,1)_both]" : ""}"
      style={{ ...fmVars, boxShadow: "${shadow}" }}
    >
      ${
        config.animateOpen
          ? `<style>{\`
        @keyframes fm-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      \`}</style>`
          : ""
      }

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[var(--fm-header-bg)] border-b border-[var(--fm-header-border)]">
        <div className="flex items-center gap-[10px]">
          <svg className="text-[var(--fm-header-icon)]" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
            <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
          </svg>
          <span className="text-[16px] font-semibold text-[var(--fm-header-text)] tracking-[-0.01em]">
            Advanced Filters
          </span>
        </div>
        <button
          className="flex items-center p-1 rounded-md text-[var(--fm-section-label)] bg-transparent border-none cursor-pointer transition-colors duration-[150ms] hover:bg-[var(--fm-close-hover-bg)]"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 max-h-[520px] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[var(--fm-modal-border)] [&::-webkit-scrollbar-thumb]:rounded-[4px]">

        {/* Sort */}
        <section>
          <span className="block text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--fm-section-label)] mb-[10px]">
            Sort By
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SORT_FIELDS.map(({ value, label }) => {
              let cls = "flex items-center justify-between px-3 py-[9px] border-[1.5px] rounded-[var(--fm-sort-btn-radius)] text-[${fs}px] cursor-pointer transition-all duration-[150ms] border-none";
              if (sortField === value) {
                cls += " bg-[var(--fm-sort-btn-active-bg)] border-[var(--fm-sort-btn-active-border)] text-[var(--fm-sort-btn-active-text)] font-semibold";
              } else {
                cls += " bg-[var(--fm-sort-btn-bg)] border-[var(--fm-sort-btn-border)] text-[var(--fm-sort-btn-text)] font-normal";
              }
              return (
                <button key={value} className={cls}
                  onClick={() => {
                    if (sortField === value) setSortDirection(d => d === "desc" ? "asc" : "desc");
                    else { setSortField(value); setSortDirection("desc"); }
                  }}>
                  <span>{label}</span>
                  {sortField === value && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <polyline points="5 12 12 19 19 12"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Status */}
        <section>
          <span className="block text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--fm-section-label)] mb-[10px]">
            Filter by Status
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map(status => {
              let cls = "flex items-center gap-[5px] px-3 py-[5px] rounded-[var(--fm-chip-radius)] text-[${fs}px] cursor-pointer transition-all duration-[150ms] border";
              if (selectedStatuses.includes(status)) {
                cls += " bg-[var(--fm-chip-active-bg)] border-[var(--fm-chip-active-bg)] text-[var(--fm-chip-active-text)] font-semibold";
              } else {
                cls += " bg-[var(--fm-chip-bg)] border-[var(--fm-chip-border)] text-[var(--fm-chip-text)] font-normal";
              }
              return (
                <button key={status} className={cls} onClick={() => toggleStatus(status)}>
                  {selectedStatuses.includes(status) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Date Range */}
        <section>
          <span className="block text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--fm-section-label)] mb-[10px]">
            Date Range
          </span>
          <div className="bg-[var(--fm-cal-bg)] border border-[var(--fm-cal-border)] rounded-[var(--fm-cal-radius)] p-[14px]">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-[10px]">
              <button
                className="bg-transparent border-none cursor-pointer text-[var(--fm-cal-chevron)] text-[22px] leading-none px-[6px] py-[2px] rounded-md transition-colors duration-[150ms] hover:bg-[var(--fm-cal-day-hover-bg)]"
                onClick={prevMonth}
              >&#8249;</button>
              <span className="text-[${fs}px] font-semibold text-[var(--fm-cal-header-text)]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                className="bg-transparent border-none cursor-pointer text-[var(--fm-cal-chevron)] text-[22px] leading-none px-[6px] py-[2px] rounded-md transition-colors duration-[150ms] hover:bg-[var(--fm-cal-day-hover-bg)]"
                onClick={nextMonth}
              >&#8250;</button>
            </div>
            {/* Day names */}
            <div className="grid [grid-template-columns:repeat(7,1fr)] mb-[2px]">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-[var(--fm-cal-dayname)] pb-[6px] pt-[2px] uppercase tracking-[0.06em]">
                  {d}
                </div>
              ))}
            </div>
            {/* Day grid — gap:0 keeps range strips connected */}
            <div
              className="grid [grid-template-columns:repeat(7,1fr)] gap-0"
              onMouseLeave={() => setHoverDate(null)}
            >
              {cells.map((date, idx) =>
                !date
                  ? <div key={\`b\${idx}\`} className="h-[34px]" />
                  : <DayCell key={date.toISOString()} date={date}
                      isStart={isStart(date)} isEnd={isEnd(date)}
                      inRange={!!hi && inRange(date)}
                      isHovered={!!(hoverDate && sameDay(date, hoverDate))}
                      isSingle={isSingle()}
                      onMouseEnter={() => setHoverDate(date)}
                      onClick={() => handleDayClick(date)} />
              )}
            </div>
            {selecting && (
              <div className="text-center mt-2 text-[11px] text-[var(--fm-section-label)]">
                Click a day to set end date
              </div>
            )}
            {/* Footer */}
            <div className="flex justify-between mt-3 pt-2 border-t border-[var(--fm-cal-border)]">
              <div>
                <div className="text-[10px] font-bold text-[var(--fm-section-label)] uppercase tracking-[0.06em]">Start Date</div>
                <div className="text-[${fs}px] font-medium text-[var(--fm-cal-header-text)] mt-[2px]">{lo ? formatDate(lo) : "—"}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-[var(--fm-section-label)] uppercase tracking-[0.06em]">End Date</div>
                <div className="text-[${fs}px] font-medium text-[var(--fm-cal-header-text)] mt-[2px]">{hi ? formatDate(hi) : "—"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <span className="block text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--fm-section-label)] mb-[10px]">
            Category
          </span>
          <div className="flex flex-col gap-[6px]">
            {CATEGORIES.map(({ value, label, count }) => (
              <label key={value}
                className="flex items-center gap-3 px-3 py-[9px] bg-[var(--fm-cat-row-bg)] border border-[var(--fm-cat-row-border)] rounded-lg cursor-pointer transition-colors duration-[150ms] hover:bg-[var(--fm-cat-row-hover-bg)]">
                <div
                  className={\`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-[150ms] \${
                    selectedCategories.includes(value)
                      ? "bg-[var(--fm-checkbox-active-bg)] border-[var(--fm-checkbox-active-bg)] text-[var(--fm-checkbox-active-text)]"
                      : "bg-transparent border-[var(--fm-checkbox-border)] text-transparent"
                  }\`}
                  onClick={() => toggleCategory(value)}
                >
                  {selectedCategories.includes(value) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="flex-1 text-[${fs}px] text-[var(--fm-cal-header-text)]" onClick={() => toggleCategory(value)}>
                  {label}
                </span>
                ${config.showCategoryCount ? `<span className="text-[12px] text-[var(--fm-cat-count)]">{count}</span>` : ""}
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-[14px] bg-[var(--fm-footer-bg)] border-t border-[var(--fm-footer-border)]">
        <button
          className="bg-transparent border-none cursor-pointer text-[${fs}px] font-medium text-[var(--fm-reset-text)] px-1 py-2 transition-colors duration-[150ms] hover:text-[var(--fm-cal-header-text)]"
          onClick={handleReset}
        >
          Reset all filters
        </button>
        <div className="flex gap-2">
          <button
            className="px-[18px] py-2 bg-[var(--fm-cancel-bg)] border border-[var(--fm-cancel-border)] rounded-[var(--fm-apply-radius)] text-[var(--fm-cancel-text)] text-[${fs}px] font-medium cursor-pointer transition-all duration-[150ms] hover:opacity-80"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-[18px] py-2 bg-[var(--fm-apply-bg)] border-none rounded-[var(--fm-apply-radius)] text-[var(--fm-apply-text)] text-[${fs}px] font-semibold cursor-pointer transition-all duration-[150ms] hover:opacity-90 hover:-translate-y-px active:scale-[0.97]"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}`;
}
