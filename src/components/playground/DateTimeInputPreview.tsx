"use client";

// /components/playground/DateTimeInputPreview.tsx

import React, { useState, useRef, useEffect, CSSProperties } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import { DateTimeInputConfig } from "@/lib/dateTimeInputConfig";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const TZ = "Asia/Kolkata";
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const first = new Date(Date.UTC(year, month, 1)).getDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++)
    cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}
function isSameDay(a: Dayjs, b: Dayjs) {
  return a.format("YYYY-MM-DD") === b.format("YYYY-MM-DD");
}

// ─── Calendar Sub-component ──────────────────────────────────────────────────
interface CalendarPickerProps {
  value: Dayjs;
  onChange: (d: Dayjs) => void;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  config: DateTimeInputConfig;
}

function CalendarPicker({
  value,
  onChange,
  minDate,
  maxDate,
  config,
}: CalendarPickerProps) {
  const [calView, setCalView] = useState<"days" | "months" | "years">("days");
  const [cursor, setCursor] = useState<Dayjs>(value || dayjs());

  const year = cursor.year();
  const month = cursor.month();
  const today = dayjs();
  const yearStart = today.year() - 100;
  const yearEnd = today.year() + 10;
  const years = Array.from(
    { length: yearEnd - yearStart + 1 },
    (_, i) => yearStart + i,
  );
  const cells = getDaysInMonth(month, year);

  const isDisabled = (date: Date) => {
    const d = dayjs(date);
    if (minDate && d.isBefore(minDate.startOf("day"))) return true;
    if (maxDate && d.isAfter(maxDate.endOf("day"))) return true;
    return false;
  };

  const s = config; // shorthand

  const navBtn: CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    width: 28,
    height: 28,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: s.calNavButtonColor,
    fontSize: 16,
    transition: "background 0.1s",
  };

  return (
    <div style={{ width: 280 }}>
      {calView === "days" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <button
              style={navBtn}
              onClick={() => setCursor(cursor.subtract(1, "month"))}
            >
              ‹
            </button>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: s.calHeaderTextColor,
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: 4,
              }}
              onClick={() => setCalView("months")}
            >
              {MONTHS[month]} {year}
            </span>
            <button
              style={navBtn}
              onClick={() => setCursor(cursor.add(1, "month"))}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: 4,
            }}
          >
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: s.dayNameColor,
                  padding: "3px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
            }}
          >
            {cells.map((date, i) => {
              if (!date) return <div key={`e-${i}`} />;
              const d = dayjs(date);
              const isSelected = isSameDay(d, value);
              const isToday = isSameDay(d, today);
              const disabled = isDisabled(date);
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => onChange(d)}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: s.fontSize,
                    borderRadius: s.dayBorderRadius,
                    cursor: disabled ? "not-allowed" : "pointer",
                    border: "none",
                    background: isSelected ? s.accentColor : "none",
                    color: disabled
                      ? s.dayNameColor
                      : isSelected
                        ? s.accentTextColor
                        : isToday
                          ? s.todayTextColor
                          : s.dayTextColor,
                    fontWeight: isToday ? 700 : 400,
                    transition: "background 0.1s, color 0.1s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !disabled) {
                      (e.target as HTMLButtonElement).style.background =
                        s.dayHoverBackground;
                      (e.target as HTMLButtonElement).style.color =
                        s.dayHoverTextColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !disabled) {
                      (e.target as HTMLButtonElement).style.background = "none";
                      (e.target as HTMLButtonElement).style.color = isToday
                        ? s.todayTextColor
                        : s.dayTextColor;
                    }
                  }}
                >
                  {d.date()}
                </button>
              );
            })}
          </div>
        </>
      )}

      {calView === "months" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <button
              style={navBtn}
              onClick={() => setCursor(cursor.subtract(1, "year"))}
            >
              ‹
            </button>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: s.calHeaderTextColor,
                cursor: "pointer",
              }}
              onClick={() => setCalView("years")}
            >
              {year}
            </span>
            <button
              style={navBtn}
              onClick={() => setCursor(cursor.add(1, "year"))}
            >
              ›
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
            }}
          >
            {MONTHS.map((m, i) => {
              const active = cursor.month() === i;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setCursor(cursor.month(i));
                    setCalView("days");
                  }}
                  style={{
                    padding: "6px 4px",
                    textAlign: "center",
                    fontSize: s.fontSize,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "inherit",
                    background: active
                      ? s.pickerPopupSelectedBackground
                      : "none",
                    color: active
                      ? s.pickerPopupSelectedTextColor
                      : s.dayTextColor,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.target as HTMLButtonElement).style.background =
                        s.pickerPopupItemHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.target as HTMLButtonElement).style.background = "none";
                  }}
                >
                  {m.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </>
      )}

      {calView === "years" && (
        <>
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: s.calHeaderTextColor,
              }}
            >
              Select Year
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {years.map((y) => {
              const active = cursor.year() === y;
              return (
                <button
                  key={y}
                  onClick={() => {
                    setCursor(cursor.year(y));
                    setCalView("months");
                  }}
                  style={{
                    padding: "6px 4px",
                    textAlign: "center",
                    fontSize: s.fontSize,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "inherit",
                    background: active
                      ? s.pickerPopupSelectedBackground
                      : "none",
                    color: active
                      ? s.pickerPopupSelectedTextColor
                      : s.dayTextColor,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.target as HTMLButtonElement).style.background =
                        s.pickerPopupItemHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.target as HTMLButtonElement).style.background = "none";
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Time Clock Sub-component ────────────────────────────────────────────────
interface TimeClockProps {
  value: Dayjs;
  onChange: (d: Dayjs) => void;
  minTime?: Dayjs | null;
  maxTime?: Dayjs | null;
  config: DateTimeInputConfig;
}

function TimeClockPicker({
  value,
  onChange,
  minTime,
  maxTime,
  config,
}: TimeClockProps) {
  const [clockMode, setClockMode] = useState<"hours" | "minutes">("hours");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const faceRef = useRef<HTMLDivElement>(null);

  const updateTimeFromPosition = (clientX: number, clientY: number) => {
    if (!faceRef.current) return;

    const rect = faceRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let angle = Math.atan2(dy, dx);

    angle = angle + Math.PI / 2;

    if (angle < 0) {
      angle += Math.PI * 2;
    }

    const degrees = (angle * 180) / Math.PI;

    if (clockMode === "hours") {
      let h = Math.round(degrees / 30);

      if (h === 0) h = 12;

      // IMPORTANT
      handleHourClick(h, false);
    } else {
      const normalized = (degrees + 360) % 360;

      let m = Math.floor(normalized / 6);

      if (m === 60) m = 0;

      handleMinuteClick(m);
    }
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!isDragging) return;

      updateTimeFromPosition(e.clientX, e.clientY);
    };

    const up = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isDragging, clockMode]);
  const s = config;
  const hour24 = value.hour();
  const minute = value.minute();
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const FACE_SIZE = 220;
  const CENTER = FACE_SIZE / 2;
  const RADIUS = 82;

  const getPos = (index: number, total: number, r: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
  };

  const handAngle =
    clockMode === "hours" ? ((hour12 % 12) / 12) * 360 : (minute / 60) * 360;
  const handLength = clockMode === "hours" ? 62 : 76;

  const isHourDisabled = (h12: number) => {
    const h24 = isPM ? (h12 === 12 ? 12 : h12 + 12) : h12 === 12 ? 0 : h12;
    const t = value.hour(h24).minute(0);
    if (minTime && t.isBefore(dayjs(minTime))) return true;
    if (maxTime && t.isAfter(dayjs(maxTime))) return true;
    return false;
  };

  const isMinuteDisabled = (m: number) => {
    const t = value.minute(m);
    if (minTime && t.isBefore(dayjs(minTime))) return true;
    if (maxTime && t.isAfter(dayjs(maxTime))) return true;
    return false;
  };

  const handleHourClick = (h12: number, switchToMinutes = true) => {
    if (isHourDisabled(h12)) return;
    const h24 = isPM ? (h12 === 12 ? 12 : h12 + 12) : h12 === 12 ? 0 : h12;
    onChange(value.hour(h24));

    if (switchToMinutes) {
      setClockMode("minutes");
    }
  };

  const handleMinuteClick = (m: number) => {
    if (isMinuteDisabled(m)) return;
    onChange(value.minute(m));
  };

  const toggleAmPm = (pm: boolean) => {
    if (pm && !isPM) onChange(value.hour(hour24 + 12));
    else if (!pm && isPM) onChange(value.hour(hour24 - 12));
  };

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Digital display */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            background: s.clockDisplayBackground,
            borderRadius: 8,
            padding: "4px 4px",
          }}
        >
          <span
            onClick={() => setClockMode("hours")}
            style={{
              padding: "2px 10px",
              borderRadius: 6,
              fontSize: 26,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              background: clockMode === "hours" ? s.accentColor : "none",
              color:
                clockMode === "hours"
                  ? s.accentTextColor
                  : s.clockDisplayTextColor,
              transition: "background 0.1s",
            }}
          >
            {String(hour12).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: s.dayNameColor,
              lineHeight: "36px",
            }}
          >
            :
          </span>
          <span
            onClick={() => setClockMode("minutes")}
            style={{
              padding: "2px 10px",
              borderRadius: 6,
              fontSize: 26,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              background: clockMode === "minutes" ? s.accentColor : "none",
              color:
                clockMode === "minutes"
                  ? s.accentTextColor
                  : s.clockDisplayTextColor,
              transition: "background 0.1s",
            }}
          >
            {String(minute).padStart(2, "0")}
          </span>
        </div>
        {/* AM/PM */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: `1.5px solid ${s.clockAmPmBorderColor}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {["AM", "PM"].map((label) => {
            const active = label === "PM" ? isPM : !isPM;
            return (
              <button
                key={label}
                onClick={() => toggleAmPm(label === "PM")}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "inherit",
                  background: active ? s.clockAmPmActiveBackground : "none",
                  color: active
                    ? s.clockAmPmActiveTextColor
                    : s.clockNumberColor,
                  transition: "background 0.1s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analog face */}
      <div
        ref={faceRef}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: FACE_SIZE,
          height: FACE_SIZE,
          borderRadius: "50%",
          background: s.clockFaceBackground,
        }}
      >
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: s.clockHandColor,
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
        {/* Hand */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setIsDragging(true);
          }}
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: 16,
            height: handLength,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${handAngle}deg)`,
            zIndex: 4,
            cursor: "grab",
          }}
        >
          <div
            style={{
              width: 2,
              height: handLength,
              margin: "0 auto",
              background: s.clockHandColor,
              borderRadius: "2px 2px 0 0",
              transition: isDragging
                ? "none"
                : "transform 0.15s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>

        {/* Hour numbers */}
        {clockMode === "hours" &&
          hourNumbers.map((h) => {
            const pos = getPos(h, 12, RADIUS);
            const active = hour12 === h;
            const disabled = isHourDisabled(h);
            return (
              <span
                key={h}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setIsDragging(true);

                  handleHourClick(h, false);
                }}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: s.fontSize,
                  fontWeight: 500,
                  borderRadius: "50%",
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: active ? s.clockNumberActiveBackground : "none",
                  color: disabled
                    ? s.dayNameColor
                    : active
                      ? s.clockNumberActiveTextColor
                      : s.clockNumberColor,
                  transition: "background 0.1s",
                  zIndex: 3,
                  userSelect: "none",
                }}
              >
                {h}
              </span>
            );
          })}

        {/* Minute numbers */}
        {clockMode === "minutes" &&
          minuteNumbers.map((m) => {
            const index = m / 5;
            const pos = getPos(index, 12, RADIUS);
            const active = minute === m || (m === 0 && minute >= 57);
            const displayActive = minute === m;
            const disabled = isMinuteDisabled(m);
            return (
              <span
                key={m}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setIsDragging(true);

                  handleMinuteClick(m);
                }}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: s.fontSize,
                  fontWeight: 500,
                  borderRadius: "50%",
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: displayActive
                    ? s.clockNumberActiveBackground
                    : "none",
                  color: disabled
                    ? s.dayNameColor
                    : displayActive
                      ? s.clockNumberActiveTextColor
                      : s.clockNumberColor,
                  transition: "background 0.1s",
                  zIndex: 3,
                  userSelect: "none",
                }}
              >
                {String(m).padStart(2, "0")}
              </span>
            );
          })}
      </div>
    </div>
  );
}

// ─── Main Preview Component ──────────────────────────────────────────────────
export function DateTimeInputPreview({
  config,
}: {
  config: DateTimeInputConfig;
}) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [tempValue, setTempValue] = useState<Dayjs>(dayjs());
  const [isError] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const s = config;
  const isDateOnly = s.pickerMode === "date";
  const isTimeOnly = s.pickerMode === "time";

  const handleOpen = () => {
    if (open) return;
    setStep(isTimeOnly ? "time" : "date");
    setTempValue(value ?? dayjs());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOk = () => {
    const final = tempValue.tz(TZ);
    if (isDateOnly || isTimeOnly) {
      setValue(final);
      handleClose();
      return;
    }
    if (step === "date") {
      setStep("time");
    } else {
      setValue(final);
      handleClose();
    }
  };

  // Outside click close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Popover position
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popH = isTimeOnly ? 320 : step === "date" ? 360 : 320;
    const below = rect.bottom + 8 + popH < window.innerHeight;
    setPopoverStyle({
      position: "fixed",
      top: below ? rect.bottom + 8 : rect.top - popH - 8,
      left: Math.min(rect.left, window.innerWidth - 320),
      zIndex: 1400,
    });
  }, [open, step, isTimeOnly]);

  // Display value
  const displayValue = value
    ? isTimeOnly
      ? value.tz(TZ).format("hh:mm A")
      : isDateOnly
        ? value.tz(TZ).format("DD/MM/YYYY")
        : value.tz(TZ).format("DD/MM/YYYY hh:mm A")
    : null;

  // Computed maxDate for calendar
  const calMaxDate = s.allowFutureTime ? null : dayjs();

  // Computed maxTime for clock
  const calMaxTime = s.allowFutureTime
    ? null
    : tempValue.isSame(dayjs(), "day")
      ? dayjs()
      : null;

  const inputBorder =
    isError && !value ? s.inputErrorBorderColor : `${s.inputBorderColor}`;

  return (
    <div
      style={{
        fontFamily: "'Instrument Sans', 'DM Sans', sans-serif",
        width: 300,
        position: "relative",
      }}
    >
      <label
        style={{
          display: "block",
          fontSize: s.labelFontSize,
          fontWeight: 500,
          color: s.labelTextColor,
          marginBottom: 5,
          letterSpacing: "0.01em",
        }}
      >
        {isTimeOnly
          ? "Select Time"
          : isDateOnly
            ? "Select Date"
            : "Select Date & Time"}
      </label>

      <div
        ref={triggerRef}
        onClick={handleOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: `1.5px solid ${inputBorder}`,
          borderRadius: s.inputBorderRadius,
          padding: "9px 12px",
          background: s.inputBackground,
          cursor: "pointer",
          minHeight: 42,
          userSelect: "none",
          transition: "border-color 0.15s",
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: displayValue ? s.inputTextColor : s.inputPlaceholderColor,
            lineHeight: 1.5,
          }}
        >
          {displayValue ??
            (isTimeOnly
              ? "hh:mm AM/PM"
              : isDateOnly
                ? "DD/MM/YYYY"
                : "DD/MM/YYYY hh:mm AM/PM")}
        </span>
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={s.inputIconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isTimeOnly ? (
            <>
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </>
          ) : (
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </>
          )}
        </svg>
      </div>

      {/* Overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1300,
          }}
          onClick={handleClose}
        />
      )}

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          style={{
            ...popoverStyle,
            background: s.popoverBackground,
            border: `1.5px solid ${s.popoverBorderColor}`,
            borderRadius: s.popoverBorderRadius,
            padding: "12px 12px 8px",
            minWidth: 304,
            boxShadow: s.popoverShadow
              ? "0 8px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)"
              : "none",
            animation: s.animateOpen ? "dtiSlide 0.15s ease" : "none",
          }}
        >
          <style>{`@keyframes dtiSlide { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>

          <div style={{ padding: "0 4px 4px" }}>
            {!isTimeOnly && step === "date" && (
              <CalendarPicker
                value={tempValue}
                onChange={(d) =>
                  setTempValue(
                    tempValue.year(d.year()).month(d.month()).date(d.date()),
                  )
                }
                maxDate={calMaxDate}
                config={s}
              />
            )}
            {step === "time" && (
              <TimeClockPicker
                value={tempValue}
                onChange={(t) => setTempValue(t)}
                maxTime={calMaxTime}
                config={s}
              />
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 4,
              paddingTop: 8,
              borderTop: `1px solid ${s.popoverBorderColor}`,
              marginTop: 4,
            }}
          >
            <button
              onClick={handleClose}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                border: "none",
                fontFamily: "inherit",
                background: "none",
                color: s.cancelButtonColor,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                border: "none",
                fontFamily: "inherit",
                background: s.okButtonBackground,
                color: s.okButtonTextColor,
              }}
            >
              {!isTimeOnly && !isDateOnly && step === "date" ? "Next →" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
