"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FormConfig, FormField, FieldType } from "@/lib/formConfig";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++)
    cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}
function fmt(d: Date | null): string {
  if (!d) return "";
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;
}
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
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Sub-components ──────────────────────────────────────────────────────────

// --- CalendarPopup (single or range) ---
function CalendarPopup({
  mode,
  config,
  onSelect,
  onClose,
}: {
  mode: "single" | "range";
  config: FormConfig;
  onSelect: (val: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth2, setViewMonth2] = useState((today.getUTCMonth() + 1) % 12);
  const [viewYear2, setViewYear2] = useState(
    today.getUTCMonth() === 11
      ? today.getUTCFullYear() + 1
      : today.getUTCFullYear(),
  );
  const [single, setSingle] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
    if (mode === "range") {
      if (viewMonth2 === 0) {
        setViewMonth2(11);
        setViewYear2((y) => y - 1);
      } else setViewMonth2((m) => m - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
    if (mode === "range") {
      if (viewMonth2 === 11) {
        setViewMonth2(0);
        setViewYear2((y) => y + 1);
      } else setViewMonth2((m) => m + 1);
    }
  }

  function handleDayClick(day: Date) {
    if (mode === "single") {
      setSingle(day);
      // Don't call onSelect here anymore
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(day);
        setRangeEnd(null);
      } else {
        if (day < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(day);
        } else setRangeEnd(day);
        // Don't call onSelect here anymore
      }
    }
  }

  // Add this helper just below handleDayClick
  function handleOk() {
    if (mode === "single" && single) {
      onSelect(fmt(single));
      onClose();
    } else if (mode === "range" && rangeStart && rangeEnd) {
      onSelect(`${fmt(rangeStart)} – ${fmt(rangeEnd)}`);
      onClose();
    }
  }

  function dayStyle(day: Date | null): React.CSSProperties {
    if (!day) return { visibility: "hidden" };
    const isSelected = mode === "single" && single && isSameDay(day, single);
    const isStart =
      mode === "range" && rangeStart && isSameDay(day, rangeStart);
    const isEnd = mode === "range" && rangeEnd && isSameDay(day, rangeEnd);
    const inRange =
      mode === "range" &&
      rangeStart &&
      (rangeEnd || hoveredDay) &&
      day > rangeStart &&
      day < (rangeEnd ?? hoveredDay!);
    const base: React.CSSProperties = {
      width: 32,
      height: 32,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "inherit",
      border: "none",
      outline: "none",
      transition: "background 0.15s",
    };
    if (isSelected || isStart || isEnd)
      return {
        ...base,
        background: config.accentColor,
        color: config.accentTextColor,
      };
    if (inRange)
      return {
        ...base,
        background: `${config.accentColor}22`,
        color: config.accentColor,
      };
    return { ...base, background: "transparent", color: config.inputTextColor };
  }

  const popupW = mode === "range" ? 580 : 280;

  function renderMonth(month: number, year: number) {
    const cells = getDaysInMonth(month, year);
    return (
      <div style={{ minWidth: 260 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          {month === viewMonth && (
            <button onClick={prevMonth} style={chevStyle(config)}>
              &#8249;
            </button>
          )}
          {month !== viewMonth && <span style={{ width: 24 }} />}
          <span
            style={{
              color: config.inputTextColor,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {MONTHS[month]} {year}
          </span>
          {month === (mode === "range" ? viewMonth2 : viewMonth) && (
            <button onClick={nextMonth} style={chevStyle(config)}>
              &#8250;
            </button>
          )}
          {month !== (mode === "range" ? viewMonth2 : viewMonth) && (
            <span style={{ width: 24 }} />
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 32px)",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {DAY_NAMES.map((n) => (
            <div
              key={n}
              style={{
                width: 32,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: config.inputPlaceholderColor,
                fontFamily: "inherit",
              }}
            >
              {n}
            </div>
          ))}
          {cells.map((day, i) => (
            <button
              key={i}
              style={dayStyle(day)}
              onClick={() => day && handleDayClick(day)}
              onMouseEnter={() => day && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day ? day.getUTCDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        zIndex: 100,
        background: config.dropdownBackground,
        border: `1px solid ${config.dropdownBorderColor}`,
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: popupW,
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        {renderMonth(viewMonth, viewYear)}
        {mode === "range" && renderMonth(viewMonth2, viewYear2)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          borderTop: `1px solid ${config.dropdownBorderColor}`,
          paddingTop: 10,
        }}
      >
        <button
          onClick={handleOk}
          disabled={mode === "single" ? !single : !(rangeStart && rangeEnd)}
          style={{
            background: config.accentColor,
            color: config.accentTextColor,
            border: "none",
            borderRadius: 6,
            padding: "6px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            opacity: (mode === "single" ? !single : !(rangeStart && rangeEnd))
              ? 0.45
              : 1,
            transition: "opacity 0.15s",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function chevStyle(config: FormConfig): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: config.inputPlaceholderColor,
    fontSize: 20,
    lineHeight: 1,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontFamily: "inherit",
  };
}

// --- DateTimePopup ---
function DateTimePopup({
  config,
  onSelect,
  onClose,
}: {
  config: FormConfig;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);

  function confirm() {
    if (!selectedDay) return;
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    onSelect(`${fmt(selectedDay)} ${h}:${m} ${ampm}`);
  }

  const cells = getDaysInMonth(viewMonth, viewYear);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        zIndex: 100,
        background: config.dropdownBackground,
        border: `1px solid ${config.dropdownBorderColor}`,
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        width: 340,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <button
          onClick={() => {
            if (viewMonth === 0) {
              setViewMonth(11);
              setViewYear((y) => y - 1);
            } else setViewMonth((m) => m - 1);
          }}
          style={chevStyle(config)}
        >
          &#8249;
        </button>
        <span
          style={{
            color: config.inputTextColor,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={() => {
            if (viewMonth === 11) {
              setViewMonth(0);
              setViewYear((y) => y + 1);
            } else setViewMonth((m) => m + 1);
          }}
          style={chevStyle(config)}
        >
          &#8250;
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 32px)",
          gap: 2,
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {DAY_NAMES.map((n) => (
          <div
            key={n}
            style={{
              width: 32,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: config.inputPlaceholderColor,
            }}
          >
            {n}
          </div>
        ))}
        {cells.map((day, i) => {
          const isSel = day && selectedDay && isSameDay(day, selectedDay);
          return (
            <button
              key={i}
              onClick={() => day && setSelectedDay(day)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "none",
                cursor: day ? "pointer" : "default",
                background: isSel ? config.accentColor : "transparent",
                color: isSel
                  ? config.accentTextColor
                  : day
                    ? config.inputTextColor
                    : "transparent",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {day?.getUTCDate() ?? ""}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <input
          type="number"
          min={1}
          max={12}
          value={hour}
          onChange={(e) => setHour(Math.max(1, Math.min(12, +e.target.value)))}
          style={{
            width: 48,
            background: config.inputBackground,
            border: `1px solid ${config.inputBorderColor}`,
            borderRadius: 6,
            color: config.inputTextColor,
            fontSize: 14,
            padding: "4px 6px",
            textAlign: "center",
            fontFamily: "inherit",
          }}
        />
        <span style={{ color: config.inputTextColor }}>:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={minute}
          onChange={(e) =>
            setMinute(Math.max(0, Math.min(59, +e.target.value)))
          }
          style={{
            width: 48,
            background: config.inputBackground,
            border: `1px solid ${config.inputBorderColor}`,
            borderRadius: 6,
            color: config.inputTextColor,
            fontSize: 14,
            padding: "4px 6px",
            textAlign: "center",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => setAmpm((a) => (a === "AM" ? "PM" : "AM"))}
          style={{
            background: config.accentColor,
            color: config.accentTextColor,
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          {ampm}
        </button>
        <button
          onClick={confirm}
          disabled={!selectedDay}
          style={{
            marginLeft: "auto",
            background: config.accentColor,
            color: config.accentTextColor,
            border: "none",
            borderRadius: 6,
            padding: "5px 14px",
            cursor: selectedDay ? "pointer" : "not-allowed",
            opacity: selectedDay ? 1 : 0.5,
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// --- DropdownField ---
function DropdownField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputBase(config),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            color: value ? config.inputTextColor : config.inputPlaceholderColor,
          }}
        >
          {value || "Select…"}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: config.dropdownBackground,
            border: `1px solid ${config.dropdownBorderColor}`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
          }}
        >
          {(field.options ?? []).map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
              style={{
                width: "100%",
                background:
                  opt === value ? `${config.accentColor}22` : "transparent",
                border: "none",
                padding: "9px 12px",
                color:
                  opt === value
                    ? config.accentColor
                    : config.dropdownItemTextColor,
                textAlign: "left",
                cursor: "pointer",
                fontSize: config.inputFontSize,
                fontFamily: "inherit",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MultiSelectField ---
function MultiSelectField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  function toggle(opt: string) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputBase(config),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
          {selected.length === 0 ? (
            <span style={{ color: config.inputPlaceholderColor }}>Select…</span>
          ) : (
            selected.map((s) => (
              <span
                key={s}
                style={{
                  background: `${config.accentColor}22`,
                  color: config.accentColor,
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 12,
                }}
              >
                {s}
              </span>
            ))
          )}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: config.dropdownBackground,
            border: `1px solid ${config.dropdownBorderColor}`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
          }}
        >
          {(field.options ?? []).map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                style={{
                  width: "100%",
                  background: active
                    ? `${config.accentColor}22`
                    : "transparent",
                  border: "none",
                  padding: "9px 12px",
                  color: active
                    ? config.accentColor
                    : config.dropdownItemTextColor,
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: config.inputFontSize,
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1.5px solid ${active ? config.accentColor : config.dropdownBorderColor}`,
                    background: active ? config.accentColor : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke={config.accentTextColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- StarRatingField ---
function StarRatingField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const max = field.maxStars ?? 5;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={
              (hovered || rating) >= star ? config.accentColor : "transparent"
            }
            stroke={config.accentColor}
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// --- ChipsField ---
function ChipsField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(opt: string) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {(field.options ?? []).map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: `1.5px solid ${active ? config.accentColor : config.inputBorderColor}`,
              background: active
                ? `${config.accentColor}22`
                : config.inputBackground,
              color: active ? config.accentColor : config.inputPlaceholderColor,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// --- RadioField ---
function RadioField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [selected, setSelected] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {(field.options ?? []).map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${active ? config.accentColor : config.inputBorderColor}`,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {active && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: config.accentColor,
                    display: "block",
                  }}
                />
              )}
            </span>
            <span
              style={{
                color: config.inputTextColor,
                fontSize: config.inputFontSize,
                fontFamily: "inherit",
              }}
            >
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// --- DateInputField (single or range) ---
function DateInputField({
  field,
  config,
  mode,
}: {
  field: FormField;
  config: FormConfig;
  mode: "single" | "range";
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputBase(config),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: 8,
        }}
      >
        <span
          style={{
            color: value ? config.inputTextColor : config.inputPlaceholderColor,
          }}
        >
          {value || (field.placeholder ?? "Select date…")}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <rect
            x="1"
            y="2"
            width="12"
            height="11"
            rx="2"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.2"
          />
          <path
            d="M4 1v2M10 1v2M1 5h12"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <CalendarPopup
          mode={mode}
          config={config}
          onSelect={(v) => {
            setValue(v);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// --- DateTimeInputField ---
function DateTimeInputField({
  field,
  config,
}: {
  field: FormField;
  config: FormConfig;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputBase(config),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: 8,
        }}
      >
        <span
          style={{
            color: value ? config.inputTextColor : config.inputPlaceholderColor,
          }}
        >
          {value || (field.placeholder ?? "Select date & time…")}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <rect
            x="1"
            y="2"
            width="12"
            height="11"
            rx="2"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.2"
          />
          <path
            d="M4 1v2M10 1v2M1 5h12"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle
            cx="10"
            cy="9"
            r="2.5"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1"
          />
          <path
            d="M10 8v1.2l.7.7"
            stroke={config.inputPlaceholderColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <DateTimePopup
          config={config}
          onSelect={(v) => {
            setValue(v);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Input base style ────────────────────────────────────────────────────────

function inputBase(config: FormConfig): React.CSSProperties {
  return {
    width: "100%",
    background: config.inputBackground,
    border: `1px solid ${config.inputBorderColor}`,
    borderRadius: config.inputBorderRadius,
    color: config.inputTextColor,
    fontSize: config.inputFontSize,
    padding: "9px 12px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  };
}

// ─── Field Renderer ──────────────────────────────────────────────────────────

function renderField(field: FormField, config: FormConfig) {
  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          placeholder={field.placeholder}
          style={inputBase(config)}
        />
      );
    case "dropdown":
      return <DropdownField field={field} config={config} />;
    case "multiselect":
      return <MultiSelectField field={field} config={config} />;
    case "date-single":
      return <DateInputField field={field} config={config} mode="single" />;
    case "date-range":
      return <DateInputField field={field} config={config} mode="range" />;
    case "datetime":
      return <DateTimeInputField field={field} config={config} />;
    case "star-rating":
      return <StarRatingField field={field} config={config} />;
    case "chips":
      return <ChipsField field={field} config={config} />;
    case "radio":
      return <RadioField field={field} config={config} />;
    default:
      return null;
  }
}

// ─── Main Preview ────────────────────────────────────────────────────────────

export function FormPreview({ config }: { config: FormConfig }) {
  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <div
        style={{
          background: config.formBackground,
          border: `1px solid ${config.formBorderColor}`,
          borderRadius: config.formBorderRadius,
          padding: config.formPadding,
          boxShadow: config.showShadow ? "0 8px 40px rgba(0,0,0,0.45)" : "none",
          display: "flex",
          flexDirection: "column",
          gap: config.fieldGap,
          fontFamily: "Instrument Sans, sans-serif",
        }}
      >
        {config.fields.map((field) => (
          <div
            key={field.id}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <label
              style={{
                fontSize: config.labelFontSize,
                color: config.labelColor,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: config.requiredColor }}>*</span>
              )}
            </label>
            <div style={{ position: "relative" }}>
              {renderField(field, config)}
            </div>
          </div>
        ))}

        <button
          style={{
            marginTop: 4,
            background: config.buttonBackground,
            color: config.buttonTextColor,
            border: "none",
            borderRadius: config.buttonBorderRadius,
            padding: "11px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            alignSelf: "flex-start",
          }}
        >
          {config.buttonLabel}
        </button>
      </div>
    </div>
  );
}
