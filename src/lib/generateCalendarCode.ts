import { CalendarConfig } from "./calendarConfig";

// ─── JSX + CSS ────────────────────────────────────────────────────────────────

export function generateCalendarJSX(config: CalendarConfig): string {
  const viewCount = config.selectionMode === "range" ? 2 : 1;

  return `import { useState, useRef, useEffect } from "react";
import "./Calendar.css";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const YEAR_RANGE = Array.from({ length: 31 }, (_, i) => new Date().getFullYear() - 20 + i);

function getDaysInMonth(month, year) {
  const days = [];
  const firstDayIndex = new Date(Date.UTC(year, month, 1)).getUTCDay();
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  let day = 1;
  while (true) {
    const date = new Date(Date.UTC(year, month, day));
    if (date.getUTCMonth() !== month) break;
    days.push(date);
    day++;
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

export function Calendar({ onDateChange }) {
  const today = new Date();
  const viewCount = ${viewCount};
  const mode = "${config.selectionMode}";

  const [startDate, setStartDate] = useState(null);
  const [endDate,   setEndDate]   = useState(null);
  const [months, setMonths] = useState(() =>
    Array.from({ length: viewCount }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i);
      return { month: d.getMonth(), year: d.getFullYear() };
    })
  );
  const [dropdowns, setDropdowns] = useState(() =>
    Array.from({ length: viewCount }, () => ({
      showPicker: false, showMonth: false, showYear: false,
    }))
  );
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setDropdowns((prev) => prev.map(() => ({
          showPicker: false, showMonth: false, showYear: false,
        })));
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDateClick(date) {
    if (mode === "single") {
      setStartDate(date);
      setEndDate(null);
      onDateChange?.(date);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
        onDateChange?.({ startDate, endDate: date });
      }
    }
  }

  function isInRange(date) {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  }

  function prevMonth(index) {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
      return u;
    });
  }

  function nextMonth(index) {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
      return u;
    });
  }

  function selectMonth(m, index) {
    setMonths((prev) => { const u = [...prev]; u[index].month = m; return u; });
    closeDropdown(index);
  }

  function selectYear(y, index) {
    setMonths((prev) => { const u = [...prev]; u[index].year = y; return u; });
    closeDropdown(index);
  }

  function closeDropdown(index) {
    setDropdowns((prev) => {
      const u = [...prev];
      u[index] = { showPicker: false, showMonth: false, showYear: false };
      return u;
    });
  }

  return (
    <div className="cal-wrap" ref={pickerRef}>
      {months.map(({ month, year }, index) => {
        const days = getDaysInMonth(month, year);
        const { showPicker, showMonth, showYear } = dropdowns[index];

        return (
          <div key={index} className="cal">
            {/* Header */}
            <div className="cal__header">
              <button className="cal__chevron" onClick={() => prevMonth(index)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span className="cal__title"
                onClick={() => setDropdowns((prev) => {
                  const u = [...prev];
                  u[index] = { showPicker: !u[index].showPicker, showMonth: false, showYear: false };
                  return u;
                })}
              >
                {MONTH_NAMES[month]} {year}

                {showPicker && (
                  <div className="cal__picker" onClick={(e) => e.stopPropagation()}>
                    {/* Month picker */}
                    <div className="cal__picker-col">
                      <button className="cal__picker-btn"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showMonth: !u[index].showMonth, showYear: false };
                            return u; });
                        }}
                      >{MONTH_NAMES[month]}</button>
                      {showMonth && (
                        <ul className="cal__picker-list">
                          {MONTH_NAMES.map((m, i) => (
                            <li key={m}
                              className={\`cal__picker-item \${i === month ? "cal__picker-item--selected" : ""}\`}
                              onClick={() => selectMonth(i, index)}
                            >{m}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Year picker */}
                    <div className="cal__picker-col">
                      <button className="cal__picker-btn"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showYear: !u[index].showYear, showMonth: false };
                            return u; });
                        }}
                      >{year}</button>
                      {showYear && (
                        <ul className="cal__picker-list">
                          {YEAR_RANGE.map((y) => (
                            <li key={y}
                              className={\`cal__picker-item \${y === year ? "cal__picker-item--selected" : ""}\`}
                              onClick={() => selectYear(y, index)}
                            >{y}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </span>

              <button className="cal__chevron" onClick={() => nextMonth(index)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Day grid */}
            <div className="cal__grid">
              {DAY_NAMES.map((d) => (
                <div key={d} className="cal__day-name">{d}</div>
              ))}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;
                const isStart = isSameDay(date, startDate);
                const isEnd   = isSameDay(date, endDate);
                const inRange = mode === "range" && isInRange(date);
                let cls = "cal__day";
                if (isStart) cls += mode === "range" ? " cal__day--start" : " cal__day--selected";
                else if (isEnd) cls += " cal__day--end";
                else if (inRange) cls += " cal__day--range";
                return (
                  <div key={i} className={cls} onClick={() => handleDateClick(date)}>
                    {date.getUTCDate()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}`;
}

// ─── CSS (shared between JSX+CSS and TSX+CSS) ─────────────────────────────────

export function generateCalendarCSS(config: CalendarConfig): string {
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";

  const animation = config.animateOpen
    ? `@keyframes calPickerIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}`
    : "";

  return `.cal-wrap {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  font-family: inherit;
}

.cal {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  padding: 20px;
  box-shadow: ${shadow};
  width: ${config.calendarWidth}px;
}

/* Header */
.cal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.cal__chevron {
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
.cal__chevron:hover {
  background: rgba(128,128,160,0.12);
}

.cal__title {
  font-size: ${config.fontSize + 1}px;
  font-weight: 600;
  color: ${config.headerTextColor};
  cursor: pointer;
  position: relative;
  user-select: none;
  padding: 2px 6px;
  border-radius: 6px;
}

/* Month/year picker popup */
.cal__picker {
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: ${config.pickerBackground};
  border: 1px solid ${config.pickerBorderColor};
  border-radius: ${config.borderRadius}px;
  padding: 12px 16px;
  z-index: 20;
  min-width: 220px;
  display: flex;
  gap: 12px;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  ${config.animateOpen ? "animation: calPickerIn 0.15s ease;" : ""}
}
${animation}

.cal__picker-col {
  position: relative;
}

.cal__picker-btn {
  background: ${config.pickerBackground};
  border: 1px solid ${config.pickerBorderColor};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: ${config.fontSize}px;
  font-weight: 500;
  color: ${config.headerTextColor};
  cursor: pointer;
  min-width: 90px;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s;
}
.cal__picker-btn:hover {
  background: ${config.pickerOptionHover};
}

.cal__picker-list {
  position: absolute;
  top: 110%;
  left: 0;
  background: ${config.pickerBackground};
  border: 1px solid ${config.pickerBorderColor};
  border-radius: 6px;
  min-width: 120px;
  max-height: 180px;
  overflow-y: auto;
  z-index: 30;
  margin-top: 2px;
  list-style: none;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.cal__picker-item {
  padding: 8px 14px;
  font-size: ${config.fontSize}px;
  color: ${config.headerTextColor};
  cursor: pointer;
  transition: background 0.1s;
}
.cal__picker-item:hover {
  background: ${config.pickerOptionHover};
}
.cal__picker-item--selected {
  color: ${config.accentColor};
  background: ${config.accentColor}18;
  font-weight: 600;
}

/* Day grid */
.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, ${config.dayCellSize}px);
  row-gap: 2px;
}

.cal__day-name {
  font-size: ${config.fontSize - 1}px;
  font-weight: 500;
  color: ${config.dayNameColor};
  text-align: center;
  padding: 4px 0 8px;
}

.cal__day {
  width: ${config.dayCellSize}px;
  height: ${config.dayCellSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${config.fontSize}px;
  font-weight: 500;
  color: ${config.dayTextColor};
  cursor: pointer;
  border-radius: ${config.dayBorderRadius}px;
  transition: background 0.12s ease, color 0.12s ease;
}
.cal__day:hover {
  background: ${config.dayHoverBackground};
  color: ${config.dayHoverTextColor};
}

.cal__day--selected {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
  border-radius: ${config.dayBorderRadius}px;
}
.cal__day--selected:hover {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
}

.cal__day--start {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
  border-radius: ${config.dayBorderRadius}px 0 0 ${config.dayBorderRadius}px;
}
.cal__day--end {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
  border-radius: 0 ${config.dayBorderRadius}px ${config.dayBorderRadius}px 0;
}
.cal__day--range {
  background: ${config.rangeBackground};
  color: ${config.rangeTextColor};
  border-radius: 0;
}
.cal__day--start:hover,
.cal__day--end:hover {
  background: ${config.accentColor};
  color: ${config.accentTextColor};
}`;
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateCalendarTSX(config: CalendarConfig): string {
  const viewCount = config.selectionMode === "range" ? 2 : 1;

  return `import { useState, useRef, useEffect } from "react";
import "./Calendar.css";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const YEAR_RANGE = Array.from({ length: 31 }, (_, i) => new Date().getFullYear() - 20 + i);

interface MonthState {
  month: number;
  year: number;
}

interface DropdownState {
  showPicker: boolean;
  showMonth: boolean;
  showYear: boolean;
}

interface SingleDateChange {
  (date: Date): void;
}

interface RangeDateChange {
  (range: { startDate: Date; endDate: Date }): void;
}

interface CalendarProps {
  onDateChange?: SingleDateChange | RangeDateChange;
}

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const days: (Date | null)[] = [];
  const firstDayIndex = new Date(Date.UTC(year, month, 1)).getUTCDay();
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  let day = 1;
  while (true) {
    const date = new Date(Date.UTC(year, month, day));
    if (date.getUTCMonth() !== month) break;
    days.push(date);
    day++;
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

export function Calendar({ onDateChange }: CalendarProps) {
  const today = new Date();
  const viewCount = ${viewCount};
  const mode = "${config.selectionMode}";

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate,   setEndDate]   = useState<Date | null>(null);
  const [months, setMonths] = useState<MonthState[]>(() =>
    Array.from({ length: viewCount }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i);
      return { month: d.getMonth(), year: d.getFullYear() };
    })
  );
  const [dropdowns, setDropdowns] = useState<DropdownState[]>(() =>
    Array.from({ length: viewCount }, () => ({
      showPicker: false, showMonth: false, showYear: false,
    }))
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setDropdowns((prev) => prev.map(() => ({
          showPicker: false, showMonth: false, showYear: false,
        })));
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDateClick(date: Date): void {
    if (mode === "single") {
      setStartDate(date);
      setEndDate(null);
      (onDateChange as SingleDateChange)?.(date);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
        (onDateChange as RangeDateChange)?.({ startDate, endDate: date });
      }
    }
  }

  function isInRange(date: Date): boolean {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  }

  function prevMonth(index: number): void {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
      return u;
    });
  }

  function nextMonth(index: number): void {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
      return u;
    });
  }

  function selectMonth(m: number, index: number): void {
    setMonths((prev) => { const u = [...prev]; u[index].month = m; return u; });
    closeDropdown(index);
  }

  function selectYear(y: number, index: number): void {
    setMonths((prev) => { const u = [...prev]; u[index].year = y; return u; });
    closeDropdown(index);
  }

  function closeDropdown(index: number): void {
    setDropdowns((prev) => {
      const u = [...prev];
      u[index] = { showPicker: false, showMonth: false, showYear: false };
      return u;
    });
  }

  return (
    <div className="cal-wrap" ref={pickerRef}>
      {months.map(({ month, year }, index) => {
        const days = getDaysInMonth(month, year);
        const { showPicker, showMonth, showYear } = dropdowns[index];

        return (
          <div key={index} className="cal">
            {/* Header */}
            <div className="cal__header">
              <button className="cal__chevron" onClick={() => prevMonth(index)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span className="cal__title"
                onClick={() => setDropdowns((prev) => {
                  const u = [...prev];
                  u[index] = { showPicker: !u[index].showPicker, showMonth: false, showYear: false };
                  return u;
                })}
              >
                {MONTH_NAMES[month]} {year}

                {showPicker && (
                  <div className="cal__picker" onClick={(e) => e.stopPropagation()}>
                    {/* Month picker */}
                    <div className="cal__picker-col">
                      <button className="cal__picker-btn"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showMonth: !u[index].showMonth, showYear: false };
                            return u; });
                        }}
                      >{MONTH_NAMES[month]}</button>
                      {showMonth && (
                        <ul className="cal__picker-list">
                          {MONTH_NAMES.map((m, i) => (
                            <li key={m}
                              className={\`cal__picker-item \${i === month ? "cal__picker-item--selected" : ""}\`}
                              onClick={() => selectMonth(i, index)}
                            >{m}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Year picker */}
                    <div className="cal__picker-col">
                      <button className="cal__picker-btn"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showYear: !u[index].showYear, showMonth: false };
                            return u; });
                        }}
                      >{year}</button>
                      {showYear && (
                        <ul className="cal__picker-list">
                          {YEAR_RANGE.map((y) => (
                            <li key={y}
                              className={\`cal__picker-item \${y === year ? "cal__picker-item--selected" : ""}\`}
                              onClick={() => selectYear(y, index)}
                            >{y}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </span>

              <button className="cal__chevron" onClick={() => nextMonth(index)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Day grid */}
            <div className="cal__grid">
              {DAY_NAMES.map((d) => (
                <div key={d} className="cal__day-name">{d}</div>
              ))}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;
                const isStart = isSameDay(date, startDate);
                const isEnd   = isSameDay(date, endDate);
                const inRange = mode === "range" && isInRange(date);
                let cls = "cal__day";
                if (isStart) cls += mode === "range" ? " cal__day--start" : " cal__day--selected";
                else if (isEnd) cls += " cal__day--end";
                else if (inRange) cls += " cal__day--range";
                return (
                  <div key={i} className={cls} onClick={() => handleDateClick(date)}>
                    {date.getUTCDate()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}`;
}

// ─── TSX + Tailwind (CSS vars on root, Tailwind arbitrary values) ─────────────

export function generateCalendarTailwind(config: CalendarConfig): string {
  const viewCount = config.selectionMode === "range" ? 2 : 1;
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";
  // Font sizes baked as literals — avoids text-[length:calc(var(...))] which is
  // unreliable across Tailwind versions. These are static numbers from config,
  // not live-updated by the control panel, so baking is safe and simpler.
  const fsBase = config.fontSize; // days, picker items, picker buttons
  const fsTitle = config.fontSize + 1; // month+year header title
  const fsDays = config.fontSize - 1; // day name row (Sun Mon Tue...)

  return `import { useState, useRef, useEffect, CSSProperties } from "react";

// All config colors are injected as CSS variables on the root wrapper.
// Tailwind arbitrary-value classes then reference them — e.g. bg-[var(--cal-accent)].
// This keeps the copy-pasteable output exact to your design, even with custom colors.

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const YEAR_RANGE = Array.from({ length: 31 }, (_, i) => new Date().getFullYear() - 20 + i);

interface MonthState {
  month: number;
  year: number;
}

interface DropdownState {
  showPicker: boolean;
  showMonth: boolean;
  showYear: boolean;
}

interface SingleDateChange {
  (date: Date): void;
}

interface RangeDateChange {
  (range: { startDate: Date; endDate: Date }): void;
}

interface CalendarProps {
  onDateChange?: SingleDateChange | RangeDateChange;
}

// Baked-in CSS variable tokens — update these to reskin the calendar
const calendarVars: CSSProperties = {
  "--cal-bg":               "${config.backgroundColor}",
  "--cal-border":           "${config.borderColor}",
  "--cal-radius":           "${config.borderRadius}px",
  "--cal-width":            "${config.calendarWidth}px",
  "--cal-shadow":           "${shadow}",
  "--cal-header-text":      "${config.headerTextColor}",
  "--cal-chevron":          "${config.chevronColor}",
  "--cal-day-name":         "${config.dayNameColor}",
  "--cal-day-text":         "${config.dayTextColor}",
  "--cal-day-hover-bg":     "${config.dayHoverBackground}",
  "--cal-day-hover-text":   "${config.dayHoverTextColor}",
  "--cal-day-radius":       "${config.dayBorderRadius}px",
  "--cal-day-size":         "${config.dayCellSize}px",
  "--cal-accent":           "${config.accentColor}",
  "--cal-accent-text":      "${config.accentTextColor}",
  "--cal-range-bg":         "${config.rangeBackground}",
  "--cal-range-text":       "${config.rangeTextColor}",
  "--cal-picker-bg":        "${config.pickerBackground}",
  "--cal-picker-border":    "${config.pickerBorderColor}",
  "--cal-picker-hover":     "${config.pickerOptionHover}",
} as CSSProperties;

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const days: (Date | null)[] = [];
  const firstDayIndex = new Date(Date.UTC(year, month, 1)).getUTCDay();
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  let day = 1;
  while (true) {
    const date = new Date(Date.UTC(year, month, day));
    if (date.getUTCMonth() !== month) break;
    days.push(date);
    day++;
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

export function Calendar({ onDateChange }: CalendarProps) {
  const today = new Date();
  const viewCount = ${viewCount};
  const mode = "${config.selectionMode}";

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate,   setEndDate]   = useState<Date | null>(null);
  const [months, setMonths] = useState<MonthState[]>(() =>
    Array.from({ length: viewCount }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i);
      return { month: d.getMonth(), year: d.getFullYear() };
    })
  );
  const [dropdowns, setDropdowns] = useState<DropdownState[]>(() =>
    Array.from({ length: viewCount }, () => ({
      showPicker: false, showMonth: false, showYear: false,
    }))
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setDropdowns((prev) => prev.map(() => ({
          showPicker: false, showMonth: false, showYear: false,
        })));
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDateClick(date: Date): void {
    if (mode === "single") {
      setStartDate(date);
      setEndDate(null);
      (onDateChange as SingleDateChange)?.(date);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
        (onDateChange as RangeDateChange)?.({ startDate, endDate: date });
      }
    }
  }

  function isInRange(date: Date): boolean {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  }

  function prevMonth(index: number): void {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
      return u;
    });
  }

  function nextMonth(index: number): void {
    setMonths((prev) => {
      const u = [...prev];
      const { month, year } = u[index];
      u[index] = month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
      return u;
    });
  }

  function selectMonth(m: number, index: number): void {
    setMonths((prev) => { const u = [...prev]; u[index].month = m; return u; });
    closeDropdown(index);
  }

  function selectYear(y: number, index: number): void {
    setMonths((prev) => { const u = [...prev]; u[index].year = y; return u; });
    closeDropdown(index);
  }

  function closeDropdown(index: number): void {
    setDropdowns((prev) => {
      const u = [...prev];
      u[index] = { showPicker: false, showMonth: false, showYear: false };
      return u;
    });
  }

  return (
    <div
      className="flex gap-5 items-start font-[inherit]"
      style={calendarVars}
      ref={pickerRef}
    >
      ${
        config.animateOpen
          ? `<style>{\`
        @keyframes calPickerIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      \`}</style>`
          : ""
      }
      {months.map(({ month, year }, index) => {
        const days = getDaysInMonth(month, year);
        const { showPicker, showMonth, showYear } = dropdowns[index];

        return (
          <div
            key={index}
            className="bg-[var(--cal-bg)] border border-[var(--cal-border)] rounded-[var(--cal-radius)] p-5 w-[var(--cal-width)]"
            style={{ boxShadow: "var(--cal-shadow)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-transparent border-none cursor-pointer p-1 text-[var(--cal-chevron)] flex items-center rounded-md transition-colors hover:bg-white/10"
                onClick={() => prevMonth(index)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span
                className="text-[${fsTitle}px] font-semibold text-[var(--cal-header-text)] cursor-pointer relative select-none px-1.5 py-0.5 rounded-md"
                onClick={() => setDropdowns((prev) => {
                  const u = [...prev];
                  u[index] = { showPicker: !u[index].showPicker, showMonth: false, showYear: false };
                  return u;
                })}
              >
                {MONTH_NAMES[month]} {year}

                {showPicker && (
                  <div
                    className="absolute top-[130%] left-1/2 -translate-x-1/2 bg-[var(--cal-picker-bg)] border border-[var(--cal-picker-border)] rounded-[var(--cal-radius)] px-4 py-3 z-20 min-w-[220px] flex gap-3 justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)]${config.animateOpen ? " [animation:calPickerIn_0.15s_ease]" : ""}"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Month picker */}
                    <div className="relative">
                      <button
                        className="bg-[var(--cal-picker-bg)] border border-[var(--cal-picker-border)] rounded-md px-3 py-1.5 text-[${fsBase}px] font-medium text-[var(--cal-header-text)] cursor-pointer min-w-[90px] text-left font-[inherit] transition-colors hover:bg-[var(--cal-picker-hover)]"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showMonth: !u[index].showMonth, showYear: false };
                            return u; });
                        }}
                      >{MONTH_NAMES[month]}</button>
                      {showMonth && (
                        <ul className="absolute top-[110%] left-0 bg-[var(--cal-picker-bg)] border border-[var(--cal-picker-border)] rounded-md min-w-[120px] max-h-[180px] overflow-y-auto z-30 mt-0.5 list-none p-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                          {MONTH_NAMES.map((m, i) => (
                            <li
                              key={m}
                              className={\`px-3.5 py-2 text-[${fsBase}px] text-[var(--cal-header-text)] cursor-pointer transition-colors hover:bg-[var(--cal-picker-hover)] \${
                                i === month
                                      ? \`text-[${config.accentColor}] bg-[${config.accentColor}18] font-semibold\`
                                  : ""
                              }\`}
                              onClick={() => selectMonth(i, index)}
                            >{m}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Year picker */}
                    <div className="relative">
                      <button
                        className="bg-[var(--cal-picker-bg)] border border-[var(--cal-picker-border)] rounded-md px-3 py-1.5 text-[${fsBase}px] font-medium text-[var(--cal-header-text)] cursor-pointer min-w-[90px] text-left font-[inherit] transition-colors hover:bg-[var(--cal-picker-hover)]"
                        onClick={(e) => { e.stopPropagation();
                          setDropdowns((prev) => { const u = [...prev];
                            u[index] = { ...u[index], showYear: !u[index].showYear, showMonth: false };
                            return u; });
                        }}
                      >{year}</button>
                      {showYear && (
                        <ul className="absolute top-[110%] left-0 bg-[var(--cal-picker-bg)] border border-[var(--cal-picker-border)] rounded-md min-w-[120px] max-h-[180px] overflow-y-auto z-30 mt-0.5 list-none p-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                          {YEAR_RANGE.map((y) => (
                            <li
                              key={y}
                              className={\`px-3.5 py-2 text-[${fsBase}px] text-[var(--cal-header-text)] cursor-pointer transition-colors hover:bg-[var(--cal-picker-hover)] \${
                                y === year
                                      ? \`text-[${config.accentColor}] bg-[${config.accentColor}18] font-semibold\`
                                  : ""
                              }\`}
                              onClick={() => selectYear(y, index)}
                            >{y}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </span>

              <button
                className="bg-transparent border-none cursor-pointer p-1 text-[var(--cal-chevron)] flex items-center rounded-md transition-colors hover:bg-white/10"
                onClick={() => nextMonth(index)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Day grid */}
            <div
              className="grid"
              style={{ gridTemplateColumns: \`repeat(7, var(--cal-day-size))\`, rowGap: "2px" }}
            >
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="text-[${fsDays}px] font-medium text-[var(--cal-day-name)] text-center pb-2 pt-1"
                >
                  {d}
                </div>
              ))}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;
                const isStart = isSameDay(date, startDate);
                const isEnd   = isSameDay(date, endDate);
                const inRange = mode === "range" && isInRange(date);

                let cls = "w-[var(--cal-day-size)] h-[var(--cal-day-size)] flex items-center justify-center text-[${fsBase}px] font-medium cursor-pointer transition-[background,color] duration-[120ms] ease-in-out";

                if (isStart && mode === "range") {
                  cls += " bg-[var(--cal-accent)] text-[var(--cal-accent-text)] rounded-l-[var(--cal-day-radius)]";
                } else if (isStart) {
                  cls += " bg-[var(--cal-accent)] text-[var(--cal-accent-text)] rounded-[var(--cal-day-radius)]";
                } else if (isEnd) {
                  cls += " bg-[var(--cal-accent)] text-[var(--cal-accent-text)] rounded-r-[var(--cal-day-radius)]";
                } else if (inRange) {
                  cls += " bg-[var(--cal-range-bg)] text-[var(--cal-range-text)] rounded-none";
                } else {
                  cls += " text-[var(--cal-day-text)] rounded-[var(--cal-day-radius)] hover:bg-[var(--cal-day-hover-bg)] hover:text-[var(--cal-day-hover-text)]";
                }

                return (
                  <div key={i} className={cls} onClick={() => handleDateClick(date)}>
                    {date.getUTCDate()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}`;
}
