// /lib/generateDateTimeInputCode.ts

import { DateTimeInputConfig } from "./dateTimeInputConfig";

export function generateDateTimeInputJSX(config: DateTimeInputConfig): string {
  const c = config;
  const isDateOnly = c.pickerMode === "date";
  const isTimeOnly = c.pickerMode === "time";

  return `import { useState, useRef, useEffect } from "react";
import "./DateTimeInput.css";

// ─── Calendar Sub-component ─────────────────────────────────────────────────
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(month, year) {
  const first = new Date(Date.UTC(year, month, 1)).getDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

function isSameDay(a, b) {
  return a.toISOString().slice(0,10) === b.toISOString().slice(0,10);
}

function CalendarPicker({ value, onChange, minDate, maxDate }) {
  const [calView, setCalView] = useState("days");
  const [cursor, setCursor] = useState(value || new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date();
  const yearStart = today.getFullYear() - 100;
  const yearEnd = today.getFullYear() + 10;
  const years = Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i);
  const cells = getDaysInMonth(month, year);

  const isDisabled = (date) => {
    if (minDate && date < new Date(minDate.setHours(0,0,0,0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23,59,59,999))) return true;
    return false;
  };

  return (
    <div className="dti__cal">
      {calView === "days" && (
        <>
          <div className="dti__cal-header">
            <button className="dti__cal-nav" onClick={() => {
              const d = new Date(cursor); d.setMonth(d.getMonth() - 1); setCursor(d);
            }}>‹</button>
            <span className="dti__cal-title" onClick={() => setCalView("months")}>
              {MONTHS[month]} {year}
            </span>
            <button className="dti__cal-nav" onClick={() => {
              const d = new Date(cursor); d.setMonth(d.getMonth() + 1); setCursor(d);
            }}>›</button>
          </div>
          <div className="dti__cal-weekdays">
            {WEEKDAYS.map(d => <div key={d} className="dti__cal-weekday">{d}</div>)}
          </div>
          <div className="dti__cal-grid">
            {cells.map((date, i) => {
              if (!date) return <div key={"e-"+i} />;
              const isSelected = value && isSameDay(date, value);
              const isToday = isSameDay(date, today);
              const disabled = isDisabled(date);
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => onChange(date)}
                  className={[
                    "dti__cal-day",
                    isSelected ? "dti__cal-day--selected" : "",
                    isToday && !isSelected ? "dti__cal-day--today" : "",
                    disabled ? "dti__cal-day--disabled" : "",
                  ].filter(Boolean).join(" ")}
                >{date.getUTCDate()}</button>
              );
            })}
          </div>
        </>
      )}
      {calView === "months" && (
        <>
          <div className="dti__cal-header">
            <button className="dti__cal-nav" onClick={() => {
              const d = new Date(cursor); d.setFullYear(d.getFullYear() - 1); setCursor(d);
            }}>‹</button>
            <span className="dti__cal-title" onClick={() => setCalView("years")}>{year}</span>
            <button className="dti__cal-nav" onClick={() => {
              const d = new Date(cursor); d.setFullYear(d.getFullYear() + 1); setCursor(d);
            }}>›</button>
          </div>
          <div className="dti__picker-grid">
            {MONTHS.map((m, i) => (
              <button key={m}
                className={["dti__picker-item", cursor.getMonth() === i ? "dti__picker-item--selected" : ""].filter(Boolean).join(" ")}
                onClick={() => { const d = new Date(cursor); d.setMonth(i); setCursor(d); setCalView("days"); }}
              >{m.slice(0,3)}</button>
            ))}
          </div>
        </>
      )}
      {calView === "years" && (
        <>
          <div className="dti__cal-header">
            <span className="dti__cal-title">Select Year</span>
          </div>
          <div className="dti__picker-grid dti__picker-grid--scroll">
            {years.map(y => (
              <button key={y}
                className={["dti__picker-item", cursor.getFullYear() === y ? "dti__picker-item--selected" : ""].filter(Boolean).join(" ")}
                onClick={() => { const d = new Date(cursor); d.setFullYear(y); setCursor(d); setCalView("months"); }}
              >{y}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Time Clock Sub-component ────────────────────────────────────────────────
function TimeClockPicker({ value, onChange, minTime, maxTime }) {
  const [clockMode, setClockMode] = useState("hours");
  const [isDragging, setIsDragging] = useState(false);
  const faceRef = useRef(null);

  const FACE_SIZE = 220;
  const CENTER = FACE_SIZE / 2;
  const RADIUS = 82;

  const hour24 = value.getHours();
  const minute = value.getMinutes();
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const handAngle = clockMode === "hours" ? ((hour12 % 12) / 12) * 360 : (minute / 60) * 360;
  const handLength = clockMode === "hours" ? 62 : 76;

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const getPos = (index, total, r) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
  };

  const updateTimeFromPosition = (clientX, clientY) => {
    if (!faceRef.current) return;
    const rect = faceRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const degrees = (angle * 180) / Math.PI;

    if (clockMode === "hours") {
      let h = Math.round(degrees / 30);
      if (h === 0) h = 12;
      handleHourClick(h, false);
    } else {
      const normalized = (degrees + 360) % 360;
      let m = Math.floor(normalized / 6);
      if (m === 60) m = 0;
      handleMinuteClick(m);
    }
  };

  useEffect(() => {
    const move = (e) => {
      if (!isDragging) return;
      updateTimeFromPosition(e.clientX, e.clientY);
    };
    const up = () => setIsDragging(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isDragging, clockMode]);

  const handleHourClick = (h12, switchToMinutes = true) => {
    const h24 = isPM ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
    const d = new Date(value); d.setHours(h24); onChange(d);
    if (switchToMinutes) setClockMode("minutes");
  };

  const handleMinuteClick = (m) => {
    const d = new Date(value); d.setMinutes(m); onChange(d);
  };

  const toggleAmPm = (pm) => {
    const d = new Date(value);
    if (pm && !isPM) d.setHours(hour24 + 12);
    else if (!pm && isPM) d.setHours(hour24 - 12);
    onChange(d);
  };

  return (
    <div className="dti__clock">
      <div className="dti__clock-display">
        <div className="dti__clock-digits">
          <span className={"dti__clock-seg" + (clockMode === "hours" ? " dti__clock-seg--active" : "")}
            onClick={() => setClockMode("hours")}>
            {String(hour12).padStart(2,"0")}
          </span>
          <span className="dti__clock-colon">:</span>
          <span className={"dti__clock-seg" + (clockMode === "minutes" ? " dti__clock-seg--active" : "")}
            onClick={() => setClockMode("minutes")}>
            {String(minute).padStart(2,"0")}
          </span>
        </div>
        <div className="dti__ampm">
          <button className={"dti__ampm-btn" + (!isPM ? " dti__ampm-btn--active" : "")} onClick={() => toggleAmPm(false)}>AM</button>
          <button className={"dti__ampm-btn" + (isPM ? " dti__ampm-btn--active" : "")} onClick={() => toggleAmPm(true)}>PM</button>
        </div>
      </div>

      <div
        ref={faceRef}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="dti__clock-face"
        style={{ width: FACE_SIZE, height: FACE_SIZE }}
      >
        <div className="dti__clock-center" />

        {/* Hand */}
        <div
          className="dti__clock-hand-wrap"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          style={{
            height: handLength,
            transform: \`translateX(-50%) rotate(\${handAngle}deg)\`,
            cursor: "grab",
          }}
        >
          <div
            className="dti__clock-hand"
            style={{
              height: handLength,
              transition: isDragging ? "none" : "transform 0.15s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>

        {/* Hour numbers */}
        {clockMode === "hours" && hourNumbers.map(h => {
          const pos = getPos(h, 12, RADIUS);
          const active = hour12 === h;
          return (
            <span key={h}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
                handleHourClick(h, false);
              }}
              className={"dti__clock-num" + (active ? " dti__clock-num--active" : "")}
              style={{ left: pos.x, top: pos.y }}>
              {h}
            </span>
          );
        })}

        {/* Minute numbers */}
        {clockMode === "minutes" && minuteNumbers.map(m => {
          const pos = getPos(m / 5, 12, RADIUS);
          const active = minute === m;
          return (
            <span key={m}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
                handleMinuteClick(m);
              }}
              className={"dti__clock-num" + (active ? " dti__clock-num--active" : "")}
              style={{ left: pos.x, top: pos.y }}>
              {String(m).padStart(2,"0")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DateTimeInput({
  label = "${isTimeOnly ? "Select Time" : isDateOnly ? "Select Date" : "Select Date & Time"}",
  name = "dateTimeInput",
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("${isTimeOnly ? "time" : "date"}");
  const [tempValue, setTempValue] = useState(value ? new Date(value) : new Date());
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleOpen = () => {
    if (disabled) return;
    setStep("${isTimeOnly ? "time" : "date"}");
    setTempValue(value ? new Date(value) : new Date());
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleOk = () => {${
    isDateOnly
      ? `
    onChange?.({ target: { name, value: tempValue.toISOString().slice(0,10) } });
    handleClose();`
      : isTimeOnly
        ? `
    onChange?.({ target: { name, value: tempValue.toISOString() } });
    handleClose();`
        : `
    if (step === "date") {
      setStep("time");
    } else {
      onChange?.({ target: { name, value: tempValue.toISOString() } });
      handleClose();
    }`
  }
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const formatDisplay = (d) => {
    if (!d) return null;
    const date = new Date(d);
    const pad = (n) => String(n).padStart(2,"0");
    const dd = pad(date.getDate()), mm = pad(date.getMonth()+1), yyyy = date.getFullYear();
    const h = date.getHours(), m = pad(date.getMinutes());
    const ampm = h >= 12 ? "PM" : "AM"; const h12 = h % 12 === 0 ? 12 : h % 12;
    ${isTimeOnly ? "return `${pad(h12)}:${m} ${ampm}`;" : isDateOnly ? "return `${dd}/${mm}/${yyyy}`;" : "return `${dd}/${mm}/${yyyy} ${pad(h12)}:${m} ${ampm}`;"}
  };

  const displayValue = formatDisplay(value);
  const maxDate = ${c.allowFutureTime ? "null" : "new Date()"};

  return (
    <div className="dti-wrap">
      {label && <label className="dti__label">{label}</label>}
      <div
        ref={triggerRef}
        className={"dti__input" + (disabled ? " dti__input--disabled" : "") + (error && !value ? " dti__input--error" : "")}
        onClick={handleOpen}
      >
        <span className={displayValue ? "dti__value" : "dti__placeholder"}>
          {displayValue ?? placeholder ?? "${isTimeOnly ? "hh:mm AM/PM" : isDateOnly ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm AM/PM"}"}
        </span>
        <svg className="dti__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          ${isTimeOnly ? '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>' : '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'}
        </svg>
      </div>
      {error && !value && <div className="dti__error">{error}</div>}

      {open && <div className="dti__overlay" onClick={handleClose} />}

      {open && (
        <div ref={popoverRef} className="dti__popover">
          <div className="dti__popover-body">
            ${
              !isTimeOnly
                ? `{step === "date" && (
              <CalendarPicker
                value={tempValue}
                onChange={(d) => setTempValue(new Date(tempValue.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())))}
                maxDate={maxDate}
              />
            )}`
                : ""
            }
            {step === "time" && (
              <TimeClockPicker
                value={tempValue}
                onChange={(d) => setTempValue(d)}
              />
            )}
          </div>
          <div className="dti__footer">
            <button className="dti__btn dti__btn--cancel" onClick={handleClose}>Cancel</button>
            <button className="dti__btn dti__btn--ok" onClick={handleOk}>
              ${!isTimeOnly && !isDateOnly ? '{step === "date" ? "Next →" : "OK"}' : '"OK"'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
}

export function generateDateTimeInputCSS(config: DateTimeInputConfig): string {
  const c = config;
  return `/* DateTimeInput.css */
/* ─── Wrap ──────────────────────────────────────────────────────────────── */
.dti-wrap {
  font-family: 'Instrument Sans', 'DM Sans', system-ui, sans-serif;
  position: relative;
  display: inline-block;
  width: 300px;
}

/* ─── Label ─────────────────────────────────────────────────────────────── */
.dti__label {
  display: block;
  font-size: ${c.labelFontSize}px;
  font-weight: 500;
  color: ${c.labelTextColor};
  margin-bottom: 5px;
  letter-spacing: 0.01em;
}

/* ─── Input Row ──────────────────────────────────────────────────────────── */
.dti__input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid ${c.inputBorderColor};
  border-radius: ${c.inputBorderRadius}px;
  padding: 9px 12px;
  background: ${c.inputBackground};
  cursor: pointer;
  min-height: 42px;
  user-select: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dti__input:hover { border-color: ${c.inputFocusBorderColor}80; }
.dti__input:focus-within { border-color: ${c.inputFocusBorderColor}; box-shadow: 0 0 0 3px ${c.inputFocusBorderColor}22; }
.dti__input--error { border-color: ${c.inputErrorBorderColor} !important; }
.dti__input--disabled { opacity: 0.5; cursor: not-allowed; }

.dti__value { font-size: 14px; color: ${c.inputTextColor}; line-height: 1.5; }
.dti__placeholder { font-size: 14px; color: ${c.inputPlaceholderColor}; line-height: 1.5; }
.dti__icon { color: ${c.inputIconColor}; flex-shrink: 0; margin-left: 8px; }
.dti__error { color: ${c.inputErrorBorderColor}; font-size: 12px; margin-top: 4px; }

/* ─── Overlay ────────────────────────────────────────────────────────────── */
.dti__overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1300;
  animation: dtiFade 0.12s ease;
}
@keyframes dtiFade { from { opacity: 0 } to { opacity: 1 } }

/* ─── Popover ────────────────────────────────────────────────────────────── */
.dti__popover {
  position: fixed;
  z-index: 1400;
  background: ${c.popoverBackground};
  border: 1.5px solid ${c.popoverBorderColor};
  border-radius: ${c.popoverBorderRadius}px;
  padding: 12px 12px 8px;
  min-width: 304px;
  ${c.popoverShadow ? "box-shadow: 0 8px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2);" : ""}
  ${c.animateOpen ? "animation: dtiSlide 0.15s ease;" : ""}
}
@keyframes dtiSlide { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
.dti__popover-body { padding: 0 4px 4px; }

/* ─── Footer ─────────────────────────────────────────────────────────────── */
.dti__footer {
  display: flex; justify-content: flex-end; gap: 4px;
  padding-top: 8px;
  border-top: 1px solid ${c.popoverBorderColor};
  margin-top: 4px;
}
.dti__btn {
  padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; font-family: inherit;
  transition: background 0.1s, opacity 0.1s;
}
.dti__btn--cancel { background: none; color: ${c.cancelButtonColor}; }
.dti__btn--cancel:hover { background: ${c.popoverBorderColor}44; }
.dti__btn--ok { background: ${c.okButtonBackground}; color: ${c.okButtonTextColor}; }
.dti__btn--ok:hover { opacity: 0.88; }

/* ─── Calendar ───────────────────────────────────────────────────────────── */
.dti__cal { width: 280px; }
.dti__cal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.dti__cal-title {
  font-size: 15px; font-weight: 600; color: ${c.calHeaderTextColor};
  cursor: pointer; padding: 2px 6px; border-radius: 4px;
  transition: background 0.1s;
}
.dti__cal-title:hover { background: ${c.dayHoverBackground}; }
.dti__cal-nav {
  background: none; border: none; cursor: pointer;
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: ${c.calNavButtonColor}; font-size: 16px;
  transition: background 0.1s;
}
.dti__cal-nav:hover { background: ${c.calNavButtonHoverBackground}; }
.dti__cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
.dti__cal-weekday {
  text-align: center; font-size: 11px; font-weight: 600;
  color: ${c.dayNameColor}; padding: 3px 0;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.dti__cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.dti__cal-day {
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: ${c.fontSize}px; border-radius: ${c.dayBorderRadius}px;
  cursor: pointer; border: none; background: none;
  color: ${c.dayTextColor}; font-family: inherit;
  transition: background 0.1s, color 0.1s;
}
.dti__cal-day:hover:not(:disabled) {
  background: ${c.dayHoverBackground};
  color: ${c.dayHoverTextColor};
}
.dti__cal-day--today { color: ${c.todayTextColor}; font-weight: 700; }
.dti__cal-day--selected { background: ${c.accentColor} !important; color: ${c.accentTextColor} !important; }
.dti__cal-day--disabled { color: ${c.dayNameColor}; cursor: not-allowed; }

/* ─── Month/Year Picker Grid ─────────────────────────────────────────────── */
.dti__picker-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
.dti__picker-grid--scroll { max-height: 200px; overflow-y: auto; }
.dti__picker-item {
  padding: 6px 4px; text-align: center; font-size: ${c.fontSize}px;
  border-radius: 6px; cursor: pointer; border: none;
  background: none; color: ${c.dayTextColor}; font-family: inherit;
  transition: background 0.1s;
}
.dti__picker-item:hover { background: ${c.pickerPopupItemHover}; }
.dti__picker-item--selected {
  background: ${c.pickerPopupSelectedBackground} !important;
  color: ${c.pickerPopupSelectedTextColor} !important;
}

/* ─── Clock ──────────────────────────────────────────────────────────────── */
.dti__clock { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.dti__clock-display { display: flex; align-items: center; gap: 8px; }
.dti__clock-digits {
  display: flex; align-items: center; gap: 2px;
  background: ${c.clockDisplayBackground};
  border-radius: 8px; padding: 4px;
}
.dti__clock-seg {
  padding: 2px 10px; border-radius: 6px; font-size: 26px; font-weight: 600;
  cursor: pointer; font-family: inherit; color: ${c.clockDisplayTextColor};
  transition: background 0.1s;
}
.dti__clock-seg--active { background: ${c.accentColor}; color: ${c.accentTextColor}; }
.dti__clock-colon { font-size: 26px; font-weight: 600; color: ${c.dayNameColor}; }
.dti__ampm {
  display: flex; flex-direction: column;
  border: 1.5px solid ${c.clockAmPmBorderColor}; border-radius: 8px; overflow: hidden;
}
.dti__ampm-btn {
  padding: 4px 10px; font-size: 12px; font-weight: 500; cursor: pointer;
  border: none; font-family: inherit; color: ${c.clockNumberColor};
  background: none; transition: background 0.1s, color 0.1s;
}
.dti__ampm-btn--active { background: ${c.clockAmPmActiveBackground}; color: ${c.clockAmPmActiveTextColor}; }
.dti__clock-face {
  position: relative; border-radius: 50%;
  background: ${c.clockFaceBackground};
}
.dti__clock-center {
  position: absolute; top: 50%; left: 50%;
  width: 8px; height: 8px; border-radius: 50%;
  background: ${c.clockHandColor};
  transform: translate(-50%, -50%); z-index: 2;
}
.dti__clock-hand-wrap {
  position: absolute; bottom: 50%; left: 50%;
  width: 16px;
  transform-origin: bottom center;
  z-index: 4;
  cursor: grab;
}
.dti__clock-hand {
  width: 2px; margin: 0 auto;
  background: ${c.clockHandColor};
  border-radius: 2px 2px 0 0;
}
.dti__clock-num {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  font-size: ${c.fontSize}px; font-weight: 500; cursor: pointer;
  border-radius: 50%; color: ${c.clockNumberColor};
  transition: background 0.1s, color 0.1s; z-index: 3; user-select: none;
}
.dti__clock-num:hover { background: ${c.dayHoverBackground}; }
.dti__clock-num--active { background: ${c.clockNumberActiveBackground} !important; color: ${c.clockNumberActiveTextColor} !important; }
`;
}
