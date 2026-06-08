import { WeekStripConfig } from "./weekStripConfig";

export function generateWeekStripJSX(config: WeekStripConfig): string {
  return `import { useState, useMemo } from "react";
import "./WeekStrip.css";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Replace with your actual event/marked dates
const MARKED_DATES = [];

function getWeekDates(anchor) {
  const day = anchor.getDay();
  const sunday = new Date(anchor);
  sunday.setDate(anchor.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function isSameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function getMonthLabel(dates) {
  const months = [...new Set(dates.map((d) => d.getMonth()))];
  if (months.length === 1) {
    return dates[0].toLocaleString("en-US", { month: "long", year: "numeric" });
  }
  const a = dates[0].toLocaleString("en-US", { month: "short" });
  const b = dates[6].toLocaleString("en-US", { month: "short", year: "numeric" });
  return \`\${a} / \${b}\`;
}

export function WeekStrip({ onDateChange }) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const weekDates = useMemo(() => {
    const anchor = new Date(today);
    anchor.setDate(today.getDate() + weekOffset * 7);
    return getWeekDates(anchor);
  }, [today, weekOffset]);

  const monthLabel = getMonthLabel(weekDates);

  function handleSelect(date) {
    setSelectedDate(date);
    onDateChange?.(date);
  }

  return (
    <div className="ws">
      {/* Top row */}
      <div className="ws__top">
        ${config.showMonthLabel ? `<span className="ws__month">{monthLabel}</span>` : `<span />`}
        <div className="ws__navs">
          <button className="ws__nav" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="ws__nav" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="ws__strip">
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasDot = MARKED_DATES.some((m) => isSameDay(m, date));
          const isPast = date < today && !isToday;
          let cls = "ws__day";
          if (isSelected) cls += " ws__day--selected";
          else if (isPast) cls += " ws__day--past";
          else if (isToday) cls += " ws__day--today";

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(date)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="ws__day-name">{DAY_NAMES[date.getDay()]}</span>
              <span className="ws__day-num">{date.getDate()}</span>
              {hasDot && !isSelected && <span className="ws__dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

export function generateWeekStripCSS(config: WeekStripConfig): string {
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";

  const transition = config.animateSelection
    ? "background 0.15s ease, color 0.15s ease, opacity 0.15s ease"
    : "none";

  return `.ws {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  padding: 16px 12px;
  box-shadow: ${shadow};
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  min-width: 340px;
  font-family: inherit;
}

/* Top row: month + chevrons */
.ws__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.ws__month {
  font-size: ${config.monthLabelSize}px;
  font-weight: 600;
  color: ${config.monthLabelColor};
  letter-spacing: 0.01em;
  user-select: none;
}

.ws__navs {
  display: flex;
  gap: 4px;
}

.ws__nav {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${config.chevronColor};
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background 0.15s;
}
.ws__nav:hover {
  background: rgba(128, 128, 160, 0.12);
}

/* Day strip */
.ws__strip {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Day button — base */
.ws__day {
  width: ${config.dayButtonWidth}px;
  height: ${config.dayButtonHeight}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: none;
  border-radius: ${config.selectedBorderRadius}px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: ${transition};
}
.ws__day:hover {
  background: ${config.hoverBackground};
}

/* Past days */
.ws__day--past {
  opacity: ${config.pastDayOpacity / 100};
}
.ws__day--past:hover {
  opacity: 1;
}

/* Selected */
.ws__day--selected {
  background: ${config.selectedBackground};
}
.ws__day--selected:hover {
  background: ${config.selectedBackground};
}
.ws__day--selected .ws__day-name,
.ws__day--selected .ws__day-num {
  color: ${config.selectedTextColor};
}

/* Day name label (SUN, MON …) */
.ws__day-name {
  font-size: ${config.dayNameSize}px;
  font-weight: 500;
  color: ${config.dayNameColor};
  letter-spacing: 0.06em;
  line-height: 1;
  transition: ${transition};
}

/* Day number */
.ws__day-num {
  font-size: ${config.dayNumberSize}px;
  font-weight: 600;
  color: ${config.dayNumberColor};
  line-height: 1;
  transition: ${transition};
}

/* Today — unselected */
.ws__day--today .ws__day-num {
  color: ${config.todayColor};
}

/* Event dot */
.ws__dot {
  position: absolute;
  bottom: 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${config.dotColor};
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateWeekStripTSX(config: WeekStripConfig): string {
  return `import { useState, useMemo } from "react";
import "./WeekStrip.css";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Replace with your actual event/marked dates
const MARKED_DATES: Date[] = [];

interface WeekStripProps {
  onDateChange?: (date: Date) => void;
}

function getWeekDates(anchor: Date): Date[] {
  const day = anchor.getDay();
  const sunday = new Date(anchor);
  sunday.setDate(anchor.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function getMonthLabel(dates: Date[]): string {
  const months = [...new Set(dates.map((d) => d.getMonth()))];
  if (months.length === 1) {
    return dates[0].toLocaleString("en-US", { month: "long", year: "numeric" });
  }
  const a = dates[0].toLocaleString("en-US", { month: "short" });
  const b = dates[6].toLocaleString("en-US", { month: "short", year: "numeric" });
  return \`\${a} / \${b}\`;
}

export function WeekStrip({ onDateChange }: WeekStripProps) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const weekDates = useMemo(() => {
    const anchor = new Date(today);
    anchor.setDate(today.getDate() + weekOffset * 7);
    return getWeekDates(anchor);
  }, [today, weekOffset]);

  const monthLabel = getMonthLabel(weekDates);

  function handleSelect(date: Date): void {
    setSelectedDate(date);
    onDateChange?.(date);
  }

  return (
    <div className="ws">
      {/* Top row */}
      <div className="ws__top">
        ${config.showMonthLabel ? `<span className="ws__month">{monthLabel}</span>` : `<span />`}
        <div className="ws__navs">
          <button className="ws__nav" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="ws__nav" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="ws__strip">
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasDot = MARKED_DATES.some((m) => isSameDay(m, date));
          const isPast = date < today && !isToday;
          let cls = "ws__day";
          if (isSelected) cls += " ws__day--selected";
          else if (isPast) cls += " ws__day--past";
          else if (isToday) cls += " ws__day--today";

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(date)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="ws__day-name">{DAY_NAMES[date.getDay()]}</span>
              <span className="ws__day-num">{date.getDate()}</span>
              {hasDot && !isSelected && <span className="ws__dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateWeekStripTailwind(config: WeekStripConfig): string {
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";

  const transition = config.animateSelection
    ? "[animation:background_0.15s_ease,color_0.15s_ease,opacity_0.15s_ease]"
    : "";

  const monthFs = config.monthLabelSize;
  const dayNameFs = config.dayNameSize;
  const dayNumFs = config.dayNumberSize;
  const dayW = config.dayButtonWidth;
  const dayH = config.dayButtonHeight;
  const pastOpacity = config.pastDayOpacity / 100;

  return `import { useState, useMemo, CSSProperties } from "react";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Replace with your actual event/marked dates
const MARKED_DATES: Date[] = [];

interface WeekStripProps {
  onDateChange?: (date: Date) => void;
}

function getWeekDates(anchor: Date): Date[] {
  const day = anchor.getDay();
  const sunday = new Date(anchor);
  sunday.setDate(anchor.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function getMonthLabel(dates: Date[]): string {
  const months = [...new Set(dates.map((d) => d.getMonth()))];
  if (months.length === 1) {
    return dates[0].toLocaleString("en-US", { month: "long", year: "numeric" });
  }
  const a = dates[0].toLocaleString("en-US", { month: "short" });
  const b = dates[6].toLocaleString("en-US", { month: "short", year: "numeric" });
  return \`\${a} / \${b}\`;
}

// Baked-in CSS variable tokens — update these to reskin the WeekStrip
const wsVars: CSSProperties = {
  "--ws-bg":              "${config.backgroundColor}",
  "--ws-border":         "${config.borderColor}",
  "--ws-radius":         "${config.borderRadius}px",
  "--ws-month-color":    "${config.monthLabelColor}",
  "--ws-chevron":        "${config.chevronColor}",
  "--ws-day-name-color": "${config.dayNameColor}",
  "--ws-day-num-color":  "${config.dayNumberColor}",
  "--ws-today-color":    "${config.todayColor}",
  "--ws-selected-bg":    "${config.selectedBackground}",
  "--ws-selected-text":  "${config.selectedTextColor}",
  "--ws-hover-bg":       "${config.hoverBackground}",
  "--ws-dot-color":      "${config.dotColor}",
  "--ws-selected-radius":"${config.selectedBorderRadius}px",
  "--ws-shadow":         "${shadow}",
} as CSSProperties;

export function WeekStrip({ onDateChange }: WeekStripProps) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const weekDates = useMemo(() => {
    const anchor = new Date(today);
    anchor.setDate(today.getDate() + weekOffset * 7);
    return getWeekDates(anchor);
  }, [today, weekOffset]);

  const monthLabel = getMonthLabel(weekDates);

  function handleSelect(date: Date): void {
    setSelectedDate(date);
    onDateChange?.(date);
  }

  return (
    <div
      className="inline-flex flex-col gap-3 min-w-[340px] font-sans bg-[var(--ws-bg)] border border-[var(--ws-border)] rounded-[var(--ws-radius)] p-4"
      style={{ ...wsVars, boxShadow: "var(--ws-shadow)" }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-1">
        ${
          config.showMonthLabel
            ? `<span className="text-[${monthFs}px] font-semibold text-[var(--ws-month-color)] tracking-[0.01em] select-none">
          {monthLabel}
        </span>`
            : `<span />`
        }
        <div className="flex gap-1">
          <button
            className="bg-transparent border-none cursor-pointer p-1 text-[var(--ws-chevron)] flex items-center rounded-md hover:bg-black/10 transition-colors duration-[150ms]"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="bg-transparent border-none cursor-pointer p-1 text-[var(--ws-chevron)] flex items-center rounded-md hover:bg-black/10 transition-colors duration-[150ms]"
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Next week"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="flex items-center gap-1">
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasDot = MARKED_DATES.some((m) => isSameDay(m, date));
          const isPast = date < today && !isToday;

          let cls = "relative shrink-0 flex flex-col items-center justify-center gap-1 border-none cursor-pointer rounded-[var(--ws-selected-radius)] ${transition}";
          if (isSelected) {
            cls += " bg-[var(--ws-selected-bg)]";
          } else if (isPast) {
            cls += " bg-transparent hover:bg-[var(--ws-hover-bg)] opacity-[${pastOpacity}] hover:opacity-100";
          } else {
            cls += " bg-transparent hover:bg-[var(--ws-hover-bg)]";
          }

          const dayNameCls = isSelected
            ? "text-[${dayNameFs}px] font-medium text-[var(--ws-selected-text)] tracking-[0.06em] leading-none ${transition}"
            : "text-[${dayNameFs}px] font-medium text-[var(--ws-day-name-color)] tracking-[0.06em] leading-none ${transition}";

          const dayNumCls = isSelected
            ? "text-[${dayNumFs}px] font-semibold text-[var(--ws-selected-text)] leading-none ${transition}"
            : isToday
            ? "text-[${dayNumFs}px] font-semibold text-[var(--ws-today-color)] leading-none ${transition}"
            : "text-[${dayNumFs}px] font-semibold text-[var(--ws-day-num-color)] leading-none ${transition}";

          return (
            <button
              key={i}
              className={cls}
              style={{ width: "${dayW}px", height: "${dayH}px" }}
              onClick={() => handleSelect(date)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className={dayNameCls}>{DAY_NAMES[date.getDay()]}</span>
              <span className={dayNumCls}>{date.getDate()}</span>
              {hasDot && !isSelected && (
                <span className="absolute bottom-[6px] w-1 h-1 rounded-full bg-[var(--ws-dot-color)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}`;
}
