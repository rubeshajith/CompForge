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
