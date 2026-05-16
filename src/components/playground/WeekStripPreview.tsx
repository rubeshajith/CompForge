"use client";

import { useState, useMemo } from "react";
import { WeekStripConfig } from "@/lib/weekStripConfig";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Static marked dates for preview (offsets from today)
const MARKED_OFFSETS = [-1, 1, 3, 5];

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

function isSameDay(a: Date, b: Date) {
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
  // Spans two months — show both
  const a = dates[0].toLocaleString("en-US", { month: "short" });
  const b = dates[6].toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
  return `${a} / ${b}`;
}

interface Props {
  config: WeekStripConfig;
}

export function WeekStripPreview({ config: c }: Props) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const markedDates = useMemo(
    () =>
      MARKED_OFFSETS.map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return d;
      }),
    [today],
  );

  const weekDates = useMemo(() => {
    const anchor = new Date(today);
    anchor.setDate(today.getDate() + weekOffset * 7);
    return getWeekDates(anchor);
  }, [today, weekOffset]);

  const monthLabel = getMonthLabel(weekDates);

  const shadow = c.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";

  return (
    <div
      style={{
        background: c.backgroundColor,
        border: `1px solid ${c.borderColor}`,
        borderRadius: `${c.borderRadius}px`,
        padding: "16px 12px",
        boxShadow: shadow,
        display: "inline-flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "340px",
      }}
    >
      {/* Month label — top, standalone */}
      <div style={{ paddingLeft: "4px" }}>
        <span
          style={{
            fontSize: `${c.monthLabelSize}px`,
            fontWeight: 600,
            color: c.showMonthLabel ? c.monthLabelColor : "transparent",
            letterSpacing: "0.01em",
            userSelect: "none",
            fontFamily: "var(--font-body, inherit)",
            transition: "color 0.15s",
          }}
        >
          {monthLabel}
        </span>
      </div>

      {/* Day strip with flanking chevrons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <ChevronBtn
          direction="left"
          color={c.chevronColor}
          onClick={() => setWeekOffset((w) => w - 1)}
        />
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasDot =
            c.showDots && markedDates.some((m) => isSameDay(m, date));
          const isPast = date < today && !isToday;
          const isHovered = hoveredIndex === i && !isSelected;

          let bg = "transparent";
          let dayNameColor = c.dayNameColor;
          let dayNumberColor =
            isToday && !isSelected ? c.todayColor : c.dayNumberColor;

          if (isSelected) {
            bg = c.selectedBackground;
            dayNameColor = c.selectedTextColor;
            dayNumberColor = c.selectedTextColor;
          } else if (isHovered) {
            bg = c.hoverBackground;
          }

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: `${c.dayButtonWidth}px`,
                height: `${c.dayButtonHeight}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: bg,
                border: "none",
                borderRadius: `${c.selectedBorderRadius}px`,
                cursor: "pointer",
                opacity: isPast && !isSelected ? c.pastDayOpacity / 100 : 1,
                transition: c.animateSelection
                  ? "background 0.15s ease, opacity 0.15s ease"
                  : "none",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: `${c.dayNameSize}px`,
                  fontWeight: 500,
                  color: dayNameColor,
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  transition: c.animateSelection ? "color 0.15s" : "none",
                }}
              >
                {DAY_NAMES[date.getDay()]}
              </span>
              <span
                style={{
                  fontSize: `${c.dayNumberSize}px`,
                  fontWeight: 600,
                  color: dayNumberColor,
                  lineHeight: 1,
                  transition: c.animateSelection ? "color 0.15s" : "none",
                }}
              >
                {date.getDate()}
              </span>

              {/* Event dot */}
              {hasDot && !isSelected && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: c.dotColor,
                  }}
                />
              )}
            </button>
          );
        })}
        <ChevronBtn
          direction="right"
          color={c.chevronColor}
          onClick={() => setWeekOffset((w) => w + 1)}
        />
      </div>
    </div>
  );
}

// ── Chevron button ────────────────────────────────────────────────────────────

function ChevronBtn({
  direction,
  color,
  onClick,
}: {
  direction: "left" | "right";
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(128,128,160,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "none";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        {direction === "left" ? (
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 12l4-4-4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
