"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarConfig } from "@/lib/calendarConfig";

interface MonthView {
  month: number;
  year: number;
}
interface DropdownState {
  showPicker: boolean;
  showMonth: boolean;
  showYear: boolean;
}

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
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentYear = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 31 }, (_, i) => currentYear - 20 + i);

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
  // Pad to complete last row (multiple of 7)
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function isSameDay(d1: Date | null, d2: Date | null) {
  if (!d1 || !d2) return false;
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

interface Props {
  config: CalendarConfig;
}

export function CalendarPreview({ config: c }: Props) {
  const today = new Date();
  const viewCount = c.selectionMode === "range" ? 2 : 1;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [months, setMonths] = useState<MonthView[]>(() =>
    Array.from({ length: viewCount }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i);
      return { month: d.getMonth(), year: d.getFullYear() };
    }),
  );

  const [dropdowns, setDropdowns] = useState<DropdownState[]>(() =>
    Array.from({ length: viewCount }, () => ({
      showPicker: false,
      showMonth: false,
      showYear: false,
    })),
  );

  const pickerRef = useRef<HTMLDivElement>(null);

  // Reset selection and adjust month count when selectionMode changes
  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
    setMonths(
      Array.from({ length: viewCount }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() + i);
        return { month: d.getMonth(), year: d.getFullYear() };
      }),
    );
    setDropdowns(
      Array.from({ length: viewCount }, () => ({
        showPicker: false,
        showMonth: false,
        showYear: false,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.selectionMode]);

  // Close pickers on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setDropdowns((prev) =>
          prev.map(() => ({
            showPicker: false,
            showMonth: false,
            showYear: false,
          })),
        );
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDateClick(date: Date) {
    if (c.selectionMode === "single") {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  }

  function isInRange(date: Date) {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  }

  function prevMonth(index: number) {
    setMonths((prev) => {
      const updated = [...prev];
      const { month, year } = updated[index];
      updated[index] =
        month === 0
          ? { month: 11, year: year - 1 }
          : { month: month - 1, year };
      return updated;
    });
  }

  function nextMonth(index: number) {
    setMonths((prev) => {
      const updated = [...prev];
      const { month, year } = updated[index];
      updated[index] =
        month === 11
          ? { month: 0, year: year + 1 }
          : { month: month + 1, year };
      return updated;
    });
  }

  function selectMonth(m: number, index: number) {
    setMonths((prev) => {
      const u = [...prev];
      u[index] = { ...u[index], month: m };
      return u;
    });
    closeDropdown(index);
  }

  function selectYear(y: number, index: number) {
    setMonths((prev) => {
      const u = [...prev];
      u[index] = { ...u[index], year: y };
      return u;
    });
    closeDropdown(index);
  }

  function closeDropdown(index: number) {
    setDropdowns((prev) => {
      const u = [...prev];
      u[index] = { showPicker: false, showMonth: false, showYear: false };
      return u;
    });
  }

  const shadow = c.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.15)"
    : "none";

  const pickerShadow = "0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)";

  return (
    <div
      style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
      ref={pickerRef}
    >
      {months.map(({ month, year }, index) => {
        const days = getDaysInMonth(month, year);
        const { showPicker, showMonth, showYear } = dropdowns[index];

        return (
          <div
            key={index}
            style={{
              background: c.backgroundColor,
              border: `1px solid ${c.borderColor}`,
              borderRadius: `${c.borderRadius}px`,
              padding: "20px",
              boxShadow: shadow,
              width: `${c.calendarWidth}px`,
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <ChevronBtn
                direction="left"
                color={c.chevronColor}
                onClick={() => prevMonth(index)}
              />

              {/* Month + Year label — click to open picker */}
              <span
                style={{
                  fontSize: `${c.fontSize + 1}px`,
                  fontWeight: 600,
                  color: c.headerTextColor,
                  cursor: "pointer",
                  position: "relative",
                  userSelect: "none",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  transition: "background 0.15s",
                }}
                onClick={() =>
                  setDropdowns((prev) => {
                    const u = [...prev];
                    u[index] = {
                      showPicker: !u[index].showPicker,
                      showMonth: false,
                      showYear: false,
                    };
                    return u;
                  })
                }
              >
                {MONTH_NAMES[month]} {year}
                {/* ── Month/Year picker popup ── */}
                {showPicker && (
                  <div
                    style={{
                      position: "absolute",
                      top: "130%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: c.pickerBackground,
                      border: `1px solid ${c.pickerBorderColor}`,
                      borderRadius: `${c.borderRadius}px`,
                      boxShadow: pickerShadow,
                      padding: "12px 16px",
                      zIndex: 20,
                      minWidth: "220px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      animation: c.animateOpen
                        ? "calPickerIn 0.15s ease"
                        : "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <style>{`
                      @keyframes calPickerIn {
                        from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
                        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                      }
                    `}</style>

                    <div style={{ display: "flex", gap: "12px" }}>
                      {/* Month dropdown */}
                      <PickerDropdown
                        label={MONTH_NAMES[month]}
                        isOpen={showMonth}
                        onToggle={(e) => {
                          e.stopPropagation();
                          setDropdowns((prev) => {
                            const u = [...prev];
                            u[index] = {
                              ...u[index],
                              showMonth: !u[index].showMonth,
                              showYear: false,
                            };
                            return u;
                          });
                        }}
                        config={c}
                      >
                        {MONTH_NAMES.map((m, i) => (
                          <PickerOption
                            key={m}
                            label={m}
                            selected={i === month}
                            config={c}
                            onClick={() => selectMonth(i, index)}
                          />
                        ))}
                      </PickerDropdown>

                      {/* Year dropdown */}
                      <PickerDropdown
                        label={String(year)}
                        isOpen={showYear}
                        onToggle={(e) => {
                          e.stopPropagation();
                          setDropdowns((prev) => {
                            const u = [...prev];
                            u[index] = {
                              ...u[index],
                              showYear: !u[index].showYear,
                              showMonth: false,
                            };
                            return u;
                          });
                        }}
                        config={c}
                      >
                        {YEAR_RANGE.map((y) => (
                          <PickerOption
                            key={y}
                            label={String(y)}
                            selected={y === year}
                            config={c}
                            onClick={() => selectYear(y, index)}
                          />
                        ))}
                      </PickerDropdown>
                    </div>
                  </div>
                )}
              </span>

              <ChevronBtn
                direction="right"
                color={c.chevronColor}
                onClick={() => nextMonth(index)}
              />
            </div>

            {/* ── Day grid ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(7, ${c.dayCellSize}px)`,
                gap: "0px",
                rowGap: "2px",
              }}
            >
              {/* Day name headers */}
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  style={{
                    fontSize: `${c.fontSize - 1}px`,
                    fontWeight: 500,
                    color: c.dayNameColor,
                    textAlign: "center",
                    padding: "4px 0 8px",
                  }}
                >
                  {d}
                </div>
              ))}

              {/* Day cells */}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;

                const isStart = isSameDay(date, startDate);
                const isEnd = isSameDay(date, endDate);
                const inRange = c.selectionMode === "range" && isInRange(date);
                const isSingleSel = c.selectionMode === "single" && isStart;
                const isAccent = isStart || isEnd || isSingleSel;

                let bg = "transparent";
                let color = c.dayTextColor;
                let borderRadius = `${c.dayBorderRadius}px`;

                if (isAccent) {
                  bg = c.accentColor;
                  color = c.accentTextColor;
                  if (c.selectionMode === "range") {
                    borderRadius = isStart
                      ? `${c.dayBorderRadius}px 0 0 ${c.dayBorderRadius}px`
                      : `0 ${c.dayBorderRadius}px ${c.dayBorderRadius}px 0`;
                  }
                } else if (inRange) {
                  bg = c.rangeBackground;
                  color = c.rangeTextColor;
                  borderRadius = "0";
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={(e) => {
                      if (!isAccent && !inRange) {
                        (e.currentTarget as HTMLElement).style.background =
                          c.dayHoverBackground;
                        (e.currentTarget as HTMLElement).style.color =
                          c.dayHoverTextColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAccent && !inRange) {
                        (e.currentTarget as HTMLElement).style.background = bg;
                        (e.currentTarget as HTMLElement).style.color = color;
                      }
                    }}
                    style={{
                      width: `${c.dayCellSize}px`,
                      height: `${c.dayCellSize}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: `${c.fontSize}px`,
                      fontWeight: 500,
                      cursor: "pointer",
                      background: bg,
                      color,
                      borderRadius,
                      transition: "background 0.12s ease, color 0.12s ease",
                      userSelect: "none",
                    }}
                  >
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
}

// ── Small helpers ────────────────────────────────────────────────────────────

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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {direction === "left" ? (
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 12l4-4-4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function PickerDropdown({
  label,
  isOpen,
  onToggle,
  config: c,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  config: CalendarConfig;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          background: c.pickerBackground,
          border: `1px solid ${c.pickerBorderColor}`,
          borderRadius: "6px",
          padding: "6px 12px",
          fontSize: `${c.fontSize}px`,
          fontWeight: 500,
          color: c.headerTextColor,
          cursor: "pointer",
          minWidth: "90px",
          textAlign: "left",
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            c.pickerOptionHover;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            c.pickerBackground;
        }}
      >
        {label}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            background: c.pickerBackground,
            border: `1px solid ${c.pickerBorderColor}`,
            borderRadius: "6px",
            minWidth: "120px",
            maxHeight: "180px",
            overflowY: "auto",
            zIndex: 30,
            marginTop: "2px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function PickerOption({
  label,
  selected,
  config: c,
  onClick,
}: {
  label: string;
  selected: boolean;
  config: CalendarConfig;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 14px",
        fontSize: `${c.fontSize}px`,
        color: selected ? c.accentColor : c.headerTextColor,
        background: selected ? `${c.accentColor}18` : "transparent",
        fontWeight: selected ? 600 : 400,
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!selected)
          (e.currentTarget as HTMLElement).style.background =
            c.pickerOptionHover;
      }}
      onMouseLeave={(e) => {
        if (!selected)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {label}
    </div>
  );
}
