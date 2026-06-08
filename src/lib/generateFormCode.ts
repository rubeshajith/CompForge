import { FormConfig, FormField, FieldType } from "./formConfig";

// ─── Which field types are present? ─────────────────────────────────────────

function usedTypes(config: FormConfig): Set<FieldType> {
  return new Set(config.fields.map((f) => f.type));
}

// ─── JSX Generator ──────────────────────────────────────────────────────────

export function generateFormJSX(config: FormConfig): string {
  const types = usedTypes(config);
  const needsCalendar = types.has("date-single") || types.has("date-range");
  const needsDatetime = types.has("datetime");
  const needsDropdown = types.has("dropdown");
  const needsMultiSel = types.has("multiselect");
  const needsStars = types.has("star-rating");
  const needsChips = types.has("chips");
  const needsRadio = types.has("radio");

  const imports = [
    `import { useState, useRef, useEffect } from "react";`,
    `import "./Form.css";`,
  ].join("\n");

  const months = `const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];`;
  const dayNames = `const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];`;

  const utils = `
function getDaysInMonth(month, year) {
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}
function isSameDay(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate();
}
function fmtDate(d) {
  if (!d) return "";
  return \`\${String(d.getUTCMonth()+1).padStart(2,"0")}/\${String(d.getUTCDate()).padStart(2,"0")}/\${d.getUTCFullYear()}\`;
}`;

  // ── Sub-components ──

  const calendarPopup =
    needsCalendar || needsDatetime
      ? `
function CalendarPopup({ mode, onSelect, onClose }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth2, setViewMonth2] = useState((today.getUTCMonth() + 1) % 12);
  const [viewYear2, setViewYear2] = useState(today.getUTCMonth() === 11 ? today.getUTCFullYear() + 1 : today.getUTCFullYear());
  const [single, setSingle] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    if (mode === "range") {
      if (viewMonth2 === 0) { setViewMonth2(11); setViewYear2(y => y - 1); }
      else setViewMonth2(m => m - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    if (mode === "range") {
      if (viewMonth2 === 11) { setViewMonth2(0); setViewYear2(y => y + 1); }
      else setViewMonth2(m => m + 1);
    }
  }
  function handleDayClick(day) {
    if (mode === "single") {
      setSingle(day);
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(day); setRangeEnd(null); }
      else {
        const start = day < rangeStart ? day : rangeStart;
        const end   = day < rangeStart ? rangeStart : day;
        setRangeEnd(end);
      }
    }
  }
  function handleOk() {
    if (mode === "single" && single) {
      onSelect(fmtDate(single));
      onClose();
    } else if (mode === "range" && rangeStart && rangeEnd) {
      onSelect(\`\${fmtDate(rangeStart)} – \${fmtDate(rangeEnd)}\`);
      onClose();
    }
  }
  function dayClass(day) {
    if (!day) return "form-cal__day form-cal__day--empty";
    if (mode === "single" && single && isSameDay(day, single)) return "form-cal__day form-cal__day--selected";
    if (mode === "range") {
      if (rangeStart && isSameDay(day, rangeStart)) return "form-cal__day form-cal__day--start";
      if (rangeEnd && isSameDay(day, rangeEnd)) return "form-cal__day form-cal__day--end";
      if (rangeStart && (rangeEnd || hoveredDay) && day > rangeStart && day < (rangeEnd ?? hoveredDay))
        return "form-cal__day form-cal__day--range";
    }
    return "form-cal__day";
  }
  function renderMonth(month, year, isFirst) {
    const cells = getDaysInMonth(month, year);
    return (
      <div className="form-cal__month">
        <div className="form-cal__header">
          {isFirst
            ? <button className="form-cal__chev" onClick={prevMonth}>&#8249;</button>
            : <span className="form-cal__chev-placeholder" />}
          <span className="form-cal__title">{MONTHS[month]} {year}</span>
          {!isFirst || mode !== "range"
            ? <button className="form-cal__chev" onClick={nextMonth}>&#8250;</button>
            : <span className="form-cal__chev-placeholder" />}
        </div>
        <div className="form-cal__grid">
          {DAY_NAMES.map(n => <div key={n} className="form-cal__day-name">{n}</div>)}
          {cells.map((day, i) => (
            <button key={i} className={dayClass(day)}
              onClick={() => day && handleDayClick(day)}
              onMouseEnter={() => day && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}>
              {day ? day.getUTCDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} className={\`form-cal__popup \${mode === "range" ? "form-cal__popup--range" : ""}\`}>
      <div className="form-cal__months">
        {renderMonth(viewMonth, viewYear, true)}
        {mode === "range" && renderMonth(viewMonth2, viewYear2, false)}
      </div>
      <div className="form-cal__footer">
        <button
          className="form-cal__ok"
          onClick={handleOk}
          disabled={mode === "single" ? !single : !(rangeStart && rangeEnd)}>
          OK
        </button>
      </div>
    </div>
  );
}`
      : "";

  const datetimePopup = needsDatetime
    ? `
function DateTimePopup({ onSelect, onClose }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("AM");
  const ref = useRef(null);
  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);
  function confirm() {
    if (!selectedDay) return;
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    onSelect(\`\${fmtDate(selectedDay)} \${h}:\${m} \${ampm}\`);
  }
  const cells = getDaysInMonth(viewMonth, viewYear);
  return (
    <div ref={ref} className="form-dt__popup">
      <div className="form-cal__header">
        <button className="form-cal__chev" onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }}>&#8249;</button>
        <span className="form-cal__title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="form-cal__chev" onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }}>&#8250;</button>
      </div>
      <div className="form-cal__grid">
        {DAY_NAMES.map(n => <div key={n} className="form-cal__day-name">{n}</div>)}
        {cells.map((day, i) => {
          const sel = day && selectedDay && isSameDay(day, selectedDay);
          return <button key={i} className={\`form-cal__day \${sel ? "form-cal__day--selected" : ""} \${!day ? "form-cal__day--empty" : ""}\`}
            onClick={() => day && setSelectedDay(day)}>{day ? day.getUTCDate() : ""}</button>;
        })}
      </div>
      <div className="form-dt__time-row">
        <input type="number" min={1} max={12} value={hour} onChange={e => setHour(Math.max(1,Math.min(12,+e.target.value)))} className="form-dt__time-input" />
        <span className="form-dt__colon">:</span>
        <input type="number" min={0} max={59} value={minute} onChange={e => setMinute(Math.max(0,Math.min(59,+e.target.value)))} className="form-dt__time-input" />
        <button onClick={() => setAmpm(a => a === "AM" ? "PM" : "AM")} className="form-dt__ampm">{ampm}</button>
        <button onClick={confirm} disabled={!selectedDay} className="form-dt__ok">OK</button>
      </div>
    </div>
  );
}`
    : "";

  const dropdownComp = needsDropdown
    ? `
function DropdownField({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  return (
    <div ref={ref} className="form-dd__wrap">
      <button className="form-input form-dd__trigger" onClick={() => setOpen(o => !o)}>
        <span style={{ color: value ? "inherit" : undefined }} className={value ? "" : "form-input--placeholder"}>{value || "Select…"}</span>
        <svg className={\`form-dd__arrow \${open ? "form-dd__arrow--open" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="form-dd__menu">
          {options.map(opt => (
            <button key={opt} className={\`form-dd__item \${opt === value ? "form-dd__item--selected" : ""}\`}
              onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}`
    : "";

  const multiSelectComp = needsMultiSel
    ? `
function MultiSelectField({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  function toggle(opt) { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div ref={ref} className="form-dd__wrap">
      <button className="form-input form-dd__trigger form-dd__trigger--multi" onClick={() => setOpen(o => !o)}>
        <div className="form-ms__tags">
          {value.length === 0
            ? <span className="form-input--placeholder">Select…</span>
            : value.map(v => <span key={v} className="form-ms__tag">{v}</span>)}
        </div>
        <svg className={\`form-dd__arrow \${open ? "form-dd__arrow--open" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="form-dd__menu">
          {options.map(opt => {
            const active = value.includes(opt);
            return (
              <button key={opt} className={\`form-dd__item \${active ? "form-dd__item--selected" : ""}\`}
                onClick={() => toggle(opt)}>
                <span className={\`form-ms__check \${active ? "form-ms__check--active" : ""}\`}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}`
    : "";

  const starsComp = needsStars
    ? `
function StarRatingField({ maxStars, value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="form-stars">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
        <button key={star} className="form-stars__btn"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}>
          <svg className={\`form-stars__icon \${(hovered || value) >= star ? "form-stars__icon--filled" : ""}\`}
            width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </button>
      ))}
    </div>
  );
}`
    : "";

  const chipsComp = needsChips
    ? `
function ChipsField({ options, value, onChange }) {
  function toggle(opt) { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div className="form-chips">
      {options.map(opt => (
        <button key={opt} className={\`form-chips__chip \${value.includes(opt) ? "form-chips__chip--active" : ""}\`}
          onClick={() => toggle(opt)}>{opt}</button>
      ))}
    </div>
  );
}`
    : "";

  const radioComp = needsRadio
    ? `
function RadioField({ options, value, onChange }) {
  return (
    <div className="form-radio">
      {options.map(opt => (
        <button key={opt} className="form-radio__item" onClick={() => onChange(opt)}>
          <span className={\`form-radio__dot \${value === opt ? "form-radio__dot--active" : ""}\`}>
            {value === opt && <span className="form-radio__inner" />}
          </span>
          <span className="form-radio__label">{opt}</span>
        </button>
      ))}
    </div>
  );
}`
    : "";

  // ── Date input fields ──
  const dateInputComp =
    needsCalendar || needsDatetime
      ? `
function DateInputField({ placeholder, mode, onDatetimeMode }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div className="form-date__wrap">
      <button className="form-input form-date__trigger" onClick={() => setOpen(o => !o)}>
        <span className={value ? "" : "form-input--placeholder"}>{value || placeholder || "Select…"}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="form-date__icon">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 1v2M10 1v2M1 5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          {onDatetimeMode && <><circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1"/><path d="M10 8v1.2l.7.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></>}
        </svg>
      </button>
      {open && !onDatetimeMode && (
        <CalendarPopup mode={mode} onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
      {open && onDatetimeMode && (
        <DateTimePopup onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}`
      : "";

  // ── Form state & render ──
  const fieldStateLines: string[] = [];
  const fieldRenderLines: string[] = [];

  config.fields.forEach((field, idx) => {
    const stateVar = `field${idx}Value`;
    const setVar = `setField${idx}Value`;
    let defaultVal = `""`;
    if (field.type === "multiselect" || field.type === "chips")
      defaultVal = `[]`;
    if (field.type === "star-rating") defaultVal = `0`;

    fieldStateLines.push(
      `  const [${stateVar}, ${setVar}] = useState(${defaultVal});`,
    );

    let fieldJSX = "";
    const opts = field.options ? JSON.stringify(field.options) : "[]";
    const ph = JSON.stringify(field.placeholder ?? "");

    switch (field.type) {
      case "text":
        fieldJSX = `<input type="text" className="form-input" placeholder={${ph}} value={${stateVar}} onChange={e => ${setVar}(e.target.value)} />`;
        break;
      case "dropdown":
        fieldJSX = `<DropdownField options={${opts}} value={${stateVar}} onChange={${setVar}} />`;
        break;
      case "multiselect":
        fieldJSX = `<MultiSelectField options={${opts}} value={${stateVar}} onChange={${setVar}} />`;
        break;
      case "date-single":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" />`;
        break;
      case "date-range":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="range" />`;
        break;
      case "datetime":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" onDatetimeMode={true} />`;
        break;
      case "star-rating":
        fieldJSX = `<StarRatingField maxStars={${field.maxStars ?? 5}} value={${stateVar}} onChange={${setVar}} />`;
        break;
      case "chips":
        fieldJSX = `<ChipsField options={${opts}} value={${stateVar}} onChange={${setVar}} />`;
        break;
      case "radio":
        fieldJSX = `<RadioField options={${opts}} value={${stateVar}} onChange={${setVar}} />`;
        break;
    }

    const requiredStar = field.required
      ? ` <span className="form__required">*</span>`
      : "";
    fieldRenderLines.push(`
        <div className="form__field">
          <label className="form__label">${field.label}${requiredStar}</label>
          ${fieldJSX}
        </div>`);
  });

  const handleSubmit = `
  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit({ ${config.fields.map((_, i) => `field${i}Value`).join(", ")} });
  }`;

  const mainComponent = `
export default function CustomForm({ onSubmit }) {
${fieldStateLines.join("\n")}
${handleSubmit}

  return (
    <div className="form__wrap">
      <form className="form" onSubmit={handleSubmit}>
${fieldRenderLines.join("\n")}
        <button type="submit" className="form__submit">${config.buttonLabel}</button>
      </form>
    </div>
  );
}`;

  return [
    imports,
    months,
    dayNames,
    utils,
    calendarPopup,
    datetimePopup,
    dropdownComp,
    multiSelectComp,
    starsComp,
    chipsComp,
    radioComp,
    dateInputComp,
    mainComponent,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ─── CSS Generator ───────────────────────────────────────────────────────────

export function generateFormCSS(config: FormConfig): string {
  const c = config;
  const types = usedTypes(config);
  const needsCalendar =
    types.has("date-single") ||
    types.has("date-range") ||
    types.has("datetime");
  const needsDropdown = types.has("dropdown") || types.has("multiselect");
  const needsStars = types.has("star-rating");
  const needsChips = types.has("chips");
  const needsRadio = types.has("radio");

  return `
/* ── Form Wrapper ─────────────────────────────────────────────── */
.form__wrap {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.form {
  background: ${c.formBackground};
  border: 1px solid ${c.formBorderColor};
  border-radius: ${c.formBorderRadius}px;
  padding: ${c.formPadding}px;
  display: flex;
  flex-direction: column;
  gap: ${c.fieldGap}px;
  font-family: "Instrument Sans", sans-serif;
  ${c.showShadow ? "box-shadow: 0 8px 40px rgba(0,0,0,0.45);" : ""}
}

/* ── Fields ───────────────────────────────────────────────────── */
.form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form__label {
  font-size: ${c.labelFontSize}px;
  color: ${c.labelColor};
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form__required { color: ${c.requiredColor}; }

/* ── Generic Input ────────────────────────────────────────────── */
.form-input {
  width: 100%;
  background: ${c.inputBackground};
  border: 1px solid ${c.inputBorderColor};
  border-radius: ${c.inputBorderRadius}px;
  color: ${c.inputTextColor};
  font-size: ${c.inputFontSize}px;
  padding: 9px 12px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
  text-align: left;
}
.form-input:focus {
  border-color: ${c.inputFocusBorderColor};
}
.form-input--placeholder { color: ${c.inputPlaceholderColor}; }

/* ── Submit Button ────────────────────────────────────────────── */
.form__submit {
  margin-top: 4px;
  background: ${c.buttonBackground};
  color: ${c.buttonTextColor};
  border: none;
  border-radius: ${c.buttonBorderRadius}px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  align-self: flex-start;
  transition: opacity 0.15s;
}
.form__submit:hover { opacity: 0.88; }

${
  needsDropdown
    ? `
/* ── Dropdown ─────────────────────────────────────────────────── */
.form-dd__wrap { position: relative; }

.form-dd__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  gap: 8px;
}
.form-dd__trigger--multi { flex-wrap: wrap; }

.form-dd__arrow {
  flex-shrink: 0;
  transition: transform 0.2s;
  color: ${c.inputPlaceholderColor};
}
.form-dd__arrow--open { transform: rotate(180deg); }

.form-dd__menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  z-index: 50;
  background: ${c.dropdownBackground};
  border: 1px solid ${c.dropdownBorderColor};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.4);
}

.form-dd__item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 9px 12px;
  color: ${c.dropdownItemTextColor};
  text-align: left;
  cursor: pointer;
  font-size: ${c.inputFontSize}px;
  font-family: inherit;
  transition: background 0.12s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-dd__item:hover { background: ${c.dropdownItemHoverBg}; }
.form-dd__item--selected {
  background: ${c.accentColor}22;
  color: ${c.accentColor};
}

/* Multi-select tags */
.form-ms__tags { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; }
.form-ms__tag {
  background: ${c.accentColor}22;
  color: ${c.accentColor};
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
}
.form-ms__check {
  width: 16px; height: 16px;
  border-radius: 4px;
  border: 1.5px solid ${c.dropdownBorderColor};
  background: transparent;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: ${c.accentTextColor};
}
.form-ms__check--active {
  background: ${c.accentColor};
  border-color: ${c.accentColor};
}
`
    : ""
}

${
  needsCalendar
    ? `
/* ── Calendar Popup ───────────────────────────────────────────── */
.form-date__wrap { position: relative; }
.form-date__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
}
.form-date__icon { flex-shrink: 0; color: ${c.inputPlaceholderColor}; }

.form-cal__popup {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  background: ${c.dropdownBackground};
  border: 1px solid ${c.dropdownBorderColor};
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  display: flex;
  gap: 20px;
  min-width: 280px;
}
.form-cal__popup--range { min-width: 580px; }

.form-cal__month { min-width: 260px; }

.form-cal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.form-cal__chev {
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${c.inputPlaceholderColor};
  font-size: 20px;
  line-height: 1;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
}
.form-cal__chev-placeholder { width: 24px; }
.form-cal__title {
  color: ${c.inputTextColor};
  font-weight: 600;
  font-size: 13px;
}
.form-cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 32px);
  gap: 2px;
  justify-content: center;
}
.form-cal__day-name {
  width: 32px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  color: ${c.inputPlaceholderColor};
}
.form-cal__day {
  width: 32px; height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${c.inputTextColor};
  font-size: 13px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s;
  font-family: inherit;
}
.form-cal__day:hover { background: ${c.dropdownItemHoverBg}; }
.form-cal__day--empty { visibility: hidden; pointer-events: none; }
.form-cal__day--selected,
.form-cal__day--start,
.form-cal__day--end {
  background: ${c.accentColor};
  color: ${c.accentTextColor};
}
.form-cal__day--range {
  background: ${c.accentColor}22;
  color: ${c.accentColor};
}

/* ── DateTime Popup ───────────────────────────────────────────── */
.form-dt__popup {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  background: ${c.dropdownBackground};
  border: 1px solid ${c.dropdownBorderColor};
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  width: 340px;
}
.form-dt__time-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}
.form-dt__time-input {
  width: 48px;
  background: ${c.inputBackground};
  border: 1px solid ${c.inputBorderColor};
  border-radius: 6px;
  color: ${c.inputTextColor};
  font-size: 14px;
  padding: 4px 6px;
  text-align: center;
  font-family: inherit;
}
.form-dt__colon { color: ${c.inputTextColor}; }
.form-dt__ampm {
  background: ${c.accentColor};
  color: ${c.accentTextColor};
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
}
.form-dt__ok {
  margin-left: auto;
  background: ${c.accentColor};
  color: ${c.accentTextColor};
  border: none;
  border-radius: 6px;
  padding: 5px 14px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
}
.form-dt__ok:disabled { opacity: 0.5; cursor: not-allowed; }
`
    : ""
}

${
  needsStars
    ? `
/* ── Star Rating ──────────────────────────────────────────────── */
.form-stars { display: flex; gap: 6px; }
.form-stars__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
}
.form-stars__icon {
  fill: transparent;
  stroke: ${c.accentColor};
  transition: fill 0.12s;
}
.form-stars__icon--filled { fill: ${c.accentColor}; }
`
    : ""
}

${
  needsChips
    ? `
/* ── Chips ────────────────────────────────────────────────────── */
.form-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.form-chips__chip {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid ${c.inputBorderColor};
  background: ${c.inputBackground};
  color: ${c.inputPlaceholderColor};
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.form-chips__chip--active {
  border-color: ${c.accentColor};
  background: ${c.accentColor}22;
  color: ${c.accentColor};
}
`
    : ""
}

${
  needsRadio
    ? `
/* ── Radio ────────────────────────────────────────────────────── */
.form-radio { display: flex; flex-direction: column; gap: 10px; }
.form-radio__item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
}
.form-radio__dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid ${c.inputBorderColor};
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}
.form-radio__dot--active { border-color: ${c.accentColor}; }
.form-radio__inner {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${c.accentColor};
  display: block;
}
.form-radio__label {
  color: ${c.inputTextColor};
  font-size: ${c.inputFontSize}px;
  font-family: inherit;
}
`
    : ""
}
`.trim();
}

// ─── TSX + CSS Generator ─────────────────────────────────────────────────────

export function generateFormTSX(config: FormConfig): string {
  const types = usedTypes(config);
  const needsCalendar = types.has("date-single") || types.has("date-range");
  const needsDatetime = types.has("datetime");
  const needsDropdown = types.has("dropdown");
  const needsMultiSel = types.has("multiselect");
  const needsStars = types.has("star-rating");
  const needsChips = types.has("chips");
  const needsRadio = types.has("radio");

  const imports = [
    `import { useState, useRef, useEffect } from "react";`,
    `import "./Form.css";`,
  ].join("\n");

  const months = `const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];`;
  const dayNames = `const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];`;

  const utils = `
function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate();
}
function fmtDate(d: Date | null): string {
  if (!d) return "";
  return \`\${String(d.getUTCMonth()+1).padStart(2,"0")}/\${String(d.getUTCDate()).padStart(2,"0")}/\${d.getUTCFullYear()}\`;
}`;

  // ── Interfaces ──

  const calendarPopupInterface =
    needsCalendar || needsDatetime
      ? `
interface CalendarPopupProps {
  mode: "single" | "range";
  onSelect: (value: string) => void;
  onClose: () => void;
}`
      : "";

  const datetimePopupInterface = needsDatetime
    ? `
interface DateTimePopupProps {
  onSelect: (value: string) => void;
  onClose: () => void;
}`
    : "";

  const dropdownInterface = needsDropdown
    ? `
interface DropdownFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}`
    : "";

  const multiSelectInterface = needsMultiSel
    ? `
interface MultiSelectFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}`
    : "";

  const starsInterface = needsStars
    ? `
interface StarRatingFieldProps {
  maxStars: number;
  value: number;
  onChange: (value: number) => void;
}`
    : "";

  const chipsInterface = needsChips
    ? `
interface ChipsFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}`
    : "";

  const radioInterface = needsRadio
    ? `
interface RadioFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}`
    : "";

  const dateInputInterface =
    needsCalendar || needsDatetime
      ? `
interface DateInputFieldProps {
  placeholder?: string;
  mode: "single" | "range";
  onDatetimeMode?: boolean;
}`
      : "";

  // ── Sub-components ──

  const calendarPopup =
    needsCalendar || needsDatetime
      ? `
function CalendarPopup({ mode, onSelect, onClose }: CalendarPopupProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());
  const [viewYear, setViewYear] = useState<number>(today.getUTCFullYear());
  const [viewMonth2, setViewMonth2] = useState<number>((today.getUTCMonth() + 1) % 12);
  const [viewYear2, setViewYear2] = useState<number>(today.getUTCMonth() === 11 ? today.getUTCFullYear() + 1 : today.getUTCFullYear());
  const [single, setSingle] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);

  function prevMonth(): void {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    if (mode === "range") {
      if (viewMonth2 === 0) { setViewMonth2(11); setViewYear2(y => y - 1); }
      else setViewMonth2(m => m - 1);
    }
  }
  function nextMonth(): void {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    if (mode === "range") {
      if (viewMonth2 === 11) { setViewMonth2(0); setViewYear2(y => y + 1); }
      else setViewMonth2(m => m + 1);
    }
  }
  function handleDayClick(day: Date): void {
    if (mode === "single") {
      setSingle(day);
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(day); setRangeEnd(null); }
      else {
        const start = day < rangeStart ? day : rangeStart;
        const end   = day < rangeStart ? rangeStart : day;
        setRangeEnd(end);
      }
    }
  }
  function handleOk(): void {
    if (mode === "single" && single) {
      onSelect(fmtDate(single));
      onClose();
    } else if (mode === "range" && rangeStart && rangeEnd) {
      onSelect(\`\${fmtDate(rangeStart)} – \${fmtDate(rangeEnd)}\`);
      onClose();
    }
  }
  function dayClass(day: Date | null): string {
    if (!day) return "form-cal__day form-cal__day--empty";
    if (mode === "single" && single && isSameDay(day, single)) return "form-cal__day form-cal__day--selected";
    if (mode === "range") {
      if (rangeStart && isSameDay(day, rangeStart)) return "form-cal__day form-cal__day--start";
      if (rangeEnd && isSameDay(day, rangeEnd)) return "form-cal__day form-cal__day--end";
      if (rangeStart && (rangeEnd || hoveredDay) && day > rangeStart && day < (rangeEnd ?? hoveredDay!))
        return "form-cal__day form-cal__day--range";
    }
    return "form-cal__day";
  }
  function renderMonth(month: number, year: number, isFirst: boolean) {
    const cells = getDaysInMonth(month, year);
    return (
      <div className="form-cal__month">
        <div className="form-cal__header">
          {isFirst
            ? <button className="form-cal__chev" onClick={prevMonth}>&#8249;</button>
            : <span className="form-cal__chev-placeholder" />}
          <span className="form-cal__title">{MONTHS[month]} {year}</span>
          {!isFirst || mode !== "range"
            ? <button className="form-cal__chev" onClick={nextMonth}>&#8250;</button>
            : <span className="form-cal__chev-placeholder" />}
        </div>
        <div className="form-cal__grid">
          {DAY_NAMES.map(n => <div key={n} className="form-cal__day-name">{n}</div>)}
          {cells.map((day, i) => (
            <button key={i} className={dayClass(day)}
              onClick={() => day && handleDayClick(day)}
              onMouseEnter={() => day && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}>
              {day ? day.getUTCDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} className={\`form-cal__popup \${mode === "range" ? "form-cal__popup--range" : ""}\`}>
      <div className="form-cal__months">
        {renderMonth(viewMonth, viewYear, true)}
        {mode === "range" && renderMonth(viewMonth2, viewYear2, false)}
      </div>
      <div className="form-cal__footer">
        <button
          className="form-cal__ok"
          onClick={handleOk}
          disabled={mode === "single" ? !single : !(rangeStart && rangeEnd)}>
          OK
        </button>
      </div>
    </div>
  );
}`
      : "";

  const datetimePopup = needsDatetime
    ? `
function DateTimePopup({ onSelect, onClose }: DateTimePopupProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());
  const [viewYear, setViewYear] = useState<number>(today.getUTCFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmpm] = useState<string>("AM");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);
  function confirm(): void {
    if (!selectedDay) return;
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    onSelect(\`\${fmtDate(selectedDay)} \${h}:\${m} \${ampm}\`);
  }
  const cells = getDaysInMonth(viewMonth, viewYear);
  return (
    <div ref={ref} className="form-dt__popup">
      <div className="form-cal__header">
        <button className="form-cal__chev" onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }}>&#8249;</button>
        <span className="form-cal__title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="form-cal__chev" onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }}>&#8250;</button>
      </div>
      <div className="form-cal__grid">
        {DAY_NAMES.map(n => <div key={n} className="form-cal__day-name">{n}</div>)}
        {cells.map((day, i) => {
          const sel = day && selectedDay && isSameDay(day, selectedDay);
          return <button key={i} className={\`form-cal__day \${sel ? "form-cal__day--selected" : ""} \${!day ? "form-cal__day--empty" : ""}\`}
            onClick={() => day && setSelectedDay(day)}>{day ? day.getUTCDate() : ""}</button>;
        })}
      </div>
      <div className="form-dt__time-row">
        <input type="number" min={1} max={12} value={hour} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHour(Math.max(1,Math.min(12,+e.target.value)))} className="form-dt__time-input" />
        <span className="form-dt__colon">:</span>
        <input type="number" min={0} max={59} value={minute} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinute(Math.max(0,Math.min(59,+e.target.value)))} className="form-dt__time-input" />
        <button onClick={() => setAmpm(a => a === "AM" ? "PM" : "AM")} className="form-dt__ampm">{ampm}</button>
        <button onClick={confirm} disabled={!selectedDay} className="form-dt__ok">OK</button>
      </div>
    </div>
  );
}`
    : "";

  const dropdownComp = needsDropdown
    ? `
function DropdownField({ options, value, onChange }: DropdownFieldProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  return (
    <div ref={ref} className="form-dd__wrap">
      <button className="form-input form-dd__trigger" onClick={() => setOpen(o => !o)}>
        <span style={{ color: value ? "inherit" : undefined }} className={value ? "" : "form-input--placeholder"}>{value || "Select…"}</span>
        <svg className={\`form-dd__arrow \${open ? "form-dd__arrow--open" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="form-dd__menu">
          {options.map(opt => (
            <button key={opt} className={\`form-dd__item \${opt === value ? "form-dd__item--selected" : ""}\`}
              onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}`
    : "";

  const multiSelectComp = needsMultiSel
    ? `
function MultiSelectField({ options, value, onChange }: MultiSelectFieldProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  function toggle(opt: string): void { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div ref={ref} className="form-dd__wrap">
      <button className="form-input form-dd__trigger form-dd__trigger--multi" onClick={() => setOpen(o => !o)}>
        <div className="form-ms__tags">
          {value.length === 0
            ? <span className="form-input--placeholder">Select…</span>
            : value.map(v => <span key={v} className="form-ms__tag">{v}</span>)}
        </div>
        <svg className={\`form-dd__arrow \${open ? "form-dd__arrow--open" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="form-dd__menu">
          {options.map(opt => {
            const active = value.includes(opt);
            return (
              <button key={opt} className={\`form-dd__item \${active ? "form-dd__item--selected" : ""}\`}
                onClick={() => toggle(opt)}>
                <span className={\`form-ms__check \${active ? "form-ms__check--active" : ""}\`}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}`
    : "";

  const starsComp = needsStars
    ? `
function StarRatingField({ maxStars, value, onChange }: StarRatingFieldProps) {
  const [hovered, setHovered] = useState<number>(0);
  return (
    <div className="form-stars">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
        <button key={star} className="form-stars__btn"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}>
          <svg className={\`form-stars__icon \${(hovered || value) >= star ? "form-stars__icon--filled" : ""}\`}
            width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </button>
      ))}
    </div>
  );
}`
    : "";

  const chipsComp = needsChips
    ? `
function ChipsField({ options, value, onChange }: ChipsFieldProps) {
  function toggle(opt: string): void { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div className="form-chips">
      {options.map(opt => (
        <button key={opt} className={\`form-chips__chip \${value.includes(opt) ? "form-chips__chip--active" : ""}\`}
          onClick={() => toggle(opt)}>{opt}</button>
      ))}
    </div>
  );
}`
    : "";

  const radioComp = needsRadio
    ? `
function RadioField({ options, value, onChange }: RadioFieldProps) {
  return (
    <div className="form-radio">
      {options.map(opt => (
        <button key={opt} className="form-radio__item" onClick={() => onChange(opt)}>
          <span className={\`form-radio__dot \${value === opt ? "form-radio__dot--active" : ""}\`}>
            {value === opt && <span className="form-radio__inner" />}
          </span>
          <span className="form-radio__label">{opt}</span>
        </button>
      ))}
    </div>
  );
}`
    : "";

  const dateInputComp =
    needsCalendar || needsDatetime
      ? `
function DateInputField({ placeholder, mode, onDatetimeMode }: DateInputFieldProps) {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="form-date__wrap">
      <button className="form-input form-date__trigger" onClick={() => setOpen(o => !o)}>
        <span className={value ? "" : "form-input--placeholder"}>{value || placeholder || "Select…"}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="form-date__icon">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 1v2M10 1v2M1 5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          {onDatetimeMode && <><circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1"/><path d="M10 8v1.2l.7.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></>}
        </svg>
      </button>
      {open && !onDatetimeMode && (
        <CalendarPopup mode={mode} onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
      {open && onDatetimeMode && (
        <DateTimePopup onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}`
      : "";

  // ── Form state & render ──
  const fieldStateLines: string[] = [];
  const fieldRenderLines: string[] = [];

  config.fields.forEach((field, idx) => {
    const stateVar = `field${idx}Value`;
    const setVar = `setField${idx}Value`;
    let defaultVal = `""`;
    let stateType = "string";
    if (field.type === "multiselect" || field.type === "chips") {
      defaultVal = `[]`;
      stateType = "string[]";
    }
    if (field.type === "star-rating") {
      defaultVal = `0`;
      stateType = "number";
    }

    fieldStateLines.push(
      `  const [${stateVar}, ${setVar}] = useState<${stateType}>(${defaultVal});`,
    );

    let fieldJSX = "";
    const opts = field.options ? JSON.stringify(field.options) : "[]";
    const ph = JSON.stringify(field.placeholder ?? "");

    switch (field.type) {
      case "text":
        fieldJSX = `<input type="text" className="form-input" placeholder={${ph}} value={${stateVar} as string} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ${setVar}(e.target.value)} />`;
        break;
      case "dropdown":
        fieldJSX = `<DropdownField options={${opts}} value={${stateVar} as string} onChange={${setVar} as (v: string) => void} />`;
        break;
      case "multiselect":
        fieldJSX = `<MultiSelectField options={${opts}} value={${stateVar} as string[]} onChange={${setVar} as (v: string[]) => void} />`;
        break;
      case "date-single":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" />`;
        break;
      case "date-range":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="range" />`;
        break;
      case "datetime":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" onDatetimeMode={true} />`;
        break;
      case "star-rating":
        fieldJSX = `<StarRatingField maxStars={${field.maxStars ?? 5}} value={${stateVar} as number} onChange={${setVar} as (v: number) => void} />`;
        break;
      case "chips":
        fieldJSX = `<ChipsField options={${opts}} value={${stateVar} as string[]} onChange={${setVar} as (v: string[]) => void} />`;
        break;
      case "radio":
        fieldJSX = `<RadioField options={${opts}} value={${stateVar} as string} onChange={${setVar} as (v: string) => void} />`;
        break;
    }

    const requiredStar = field.required
      ? ` <span className="form__required">*</span>`
      : "";
    fieldRenderLines.push(`
        <div className="form__field">
          <label className="form__label">${field.label}${requiredStar}</label>
          ${fieldJSX}
        </div>`);
  });

  const formPropsInterface = `
interface CustomFormProps {
  onSubmit?: (values: Record<string, unknown>) => void;
}`;

  const handleSubmit = `
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (onSubmit) onSubmit({ ${config.fields.map((_, i) => `field${i}Value`).join(", ")} });
  }`;

  const mainComponent = `
export default function CustomForm({ onSubmit }: CustomFormProps) {
${fieldStateLines.join("\n")}
${handleSubmit}

  return (
    <div className="form__wrap">
      <form className="form" onSubmit={handleSubmit}>
${fieldRenderLines.join("\n")}
        <button type="submit" className="form__submit">${config.buttonLabel}</button>
      </form>
    </div>
  );
}`;

  return [
    imports,
    months,
    dayNames,
    utils,
    calendarPopupInterface,
    datetimePopupInterface,
    dropdownInterface,
    multiSelectInterface,
    starsInterface,
    chipsInterface,
    radioInterface,
    dateInputInterface,
    formPropsInterface,
    calendarPopup,
    datetimePopup,
    dropdownComp,
    multiSelectComp,
    starsComp,
    chipsComp,
    radioComp,
    dateInputComp,
    mainComponent,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ─── TSX + Tailwind Generator ────────────────────────────────────────────────

export function generateFormTailwind(config: FormConfig): string {
  const types = usedTypes(config);
  const needsCalendar = types.has("date-single") || types.has("date-range");
  const needsDatetime = types.has("datetime");
  const needsDropdown = types.has("dropdown");
  const needsMultiSel = types.has("multiselect");
  const needsStars = types.has("star-rating");
  const needsChips = types.has("chips");
  const needsRadio = types.has("radio");

  // Pre-compute font sizes as literals
  const labelFs = config.labelFontSize;
  const inputFs = config.inputFontSize;

  // Pre-compute shadow
  const shadow = config.showShadow ? "0 8px 40px rgba(0,0,0,0.45)" : "none";

  const imports = `import { useState, useRef, useEffect, CSSProperties } from "react";`;

  const months = `const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];`;
  const dayNames = `const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];`;

  const utils = `
function getDaysInMonth(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate();
}
function fmtDate(d: Date | null): string {
  if (!d) return "";
  return \`\${String(d.getUTCMonth()+1).padStart(2,"0")}/\${String(d.getUTCDate()).padStart(2,"0")}/\${d.getUTCFullYear()}\`;
}`;

  // ── CSS vars object ──
  const formVars = `
// Baked-in CSS variable tokens — update these to reskin the Form
const formVars: CSSProperties = {
  "--form-bg":                  "${config.formBackground}",
  "--form-border":              "${config.formBorderColor}",
  "--form-radius":              "${config.formBorderRadius}px",
  "--form-padding":             "${config.formPadding}px",
  "--form-gap":                 "${config.fieldGap}px",
  "--form-label-color":         "${config.labelColor}",
  "--form-required-color":      "${config.requiredColor}",
  "--form-input-bg":            "${config.inputBackground}",
  "--form-input-border":        "${config.inputBorderColor}",
  "--form-input-radius":        "${config.inputBorderRadius}px",
  "--form-input-text":          "${config.inputTextColor}",
  "--form-input-placeholder":   "${config.inputPlaceholderColor}",
  "--form-input-focus-border":  "${config.inputFocusBorderColor}",
  "--form-btn-bg":              "${config.buttonBackground}",
  "--form-btn-text":            "${config.buttonTextColor}",
  "--form-btn-radius":          "${config.buttonBorderRadius}px",
  "--form-accent":              "${config.accentColor}",
  "--form-accent-text":         "${config.accentTextColor}",
  "--form-dd-bg":               "${config.dropdownBackground}",
  "--form-dd-border":           "${config.dropdownBorderColor}",
  "--form-dd-item-text":        "${config.dropdownItemTextColor}",
  "--form-dd-hover-bg":         "${config.dropdownItemHoverBg}",
} as CSSProperties;`;

  // ── Interfaces ──

  const calendarPopupInterface =
    needsCalendar || needsDatetime
      ? `
interface CalendarPopupProps {
  mode: "single" | "range";
  onSelect: (value: string) => void;
  onClose: () => void;
}`
      : "";

  const datetimePopupInterface = needsDatetime
    ? `
interface DateTimePopupProps {
  onSelect: (value: string) => void;
  onClose: () => void;
}`
    : "";

  const dropdownInterface = needsDropdown
    ? `
interface DropdownFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}`
    : "";

  const multiSelectInterface = needsMultiSel
    ? `
interface MultiSelectFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}`
    : "";

  const starsInterface = needsStars
    ? `
interface StarRatingFieldProps {
  maxStars: number;
  value: number;
  onChange: (value: number) => void;
}`
    : "";

  const chipsInterface = needsChips
    ? `
interface ChipsFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}`
    : "";

  const radioInterface = needsRadio
    ? `
interface RadioFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}`
    : "";

  const dateInputInterface =
    needsCalendar || needsDatetime
      ? `
interface DateInputFieldProps {
  placeholder?: string;
  mode: "single" | "range";
  onDatetimeMode?: boolean;
}`
      : "";

  // ── Sub-components (Tailwind) ──

  const calendarPopup =
    needsCalendar || needsDatetime
      ? `
function CalendarPopup({ mode, onSelect, onClose }: CalendarPopupProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());
  const [viewYear, setViewYear] = useState<number>(today.getUTCFullYear());
  const [viewMonth2, setViewMonth2] = useState<number>((today.getUTCMonth() + 1) % 12);
  const [viewYear2, setViewYear2] = useState<number>(today.getUTCMonth() === 11 ? today.getUTCFullYear() + 1 : today.getUTCFullYear());
  const [single, setSingle] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);

  function prevMonth(): void {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    if (mode === "range") {
      if (viewMonth2 === 0) { setViewMonth2(11); setViewYear2(y => y - 1); }
      else setViewMonth2(m => m - 1);
    }
  }
  function nextMonth(): void {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    if (mode === "range") {
      if (viewMonth2 === 11) { setViewMonth2(0); setViewYear2(y => y + 1); }
      else setViewMonth2(m => m + 1);
    }
  }
  function handleDayClick(day: Date): void {
    if (mode === "single") {
      setSingle(day);
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(day); setRangeEnd(null); }
      else {
        const start = day < rangeStart ? day : rangeStart;
        const end   = day < rangeStart ? rangeStart : day;
        setRangeEnd(end);
      }
    }
  }
  function handleOk(): void {
    if (mode === "single" && single) {
      onSelect(fmtDate(single));
      onClose();
    } else if (mode === "range" && rangeStart && rangeEnd) {
      onSelect(\`\${fmtDate(rangeStart)} – \${fmtDate(rangeEnd)}\`);
      onClose();
    }
  }
  function dayClass(day: Date | null): string {
    if (!day) return "w-8 h-8 invisible pointer-events-none";
    if (mode === "single" && single && isSameDay(day, single))
      return "w-8 h-8 rounded-md border-none bg-[var(--form-accent)] text-[var(--form-accent-text)] flex items-center justify-center cursor-pointer font-[inherit] text-[13px]";
    if (mode === "range") {
      if (rangeStart && isSameDay(day, rangeStart))
        return "w-8 h-8 rounded-md border-none bg-[var(--form-accent)] text-[var(--form-accent-text)] flex items-center justify-center cursor-pointer font-[inherit] text-[13px]";
      if (rangeEnd && isSameDay(day, rangeEnd))
        return "w-8 h-8 rounded-md border-none bg-[var(--form-accent)] text-[var(--form-accent-text)] flex items-center justify-center cursor-pointer font-[inherit] text-[13px]";
      if (rangeStart && (rangeEnd || hoveredDay) && day > rangeStart && day < (rangeEnd ?? hoveredDay!))
        return "w-8 h-8 rounded-md border-none bg-[var(--form-accent)]/[.13] text-[var(--form-accent)] flex items-center justify-center cursor-pointer font-[inherit] text-[13px]";
    }
    return "w-8 h-8 rounded-md border-none bg-transparent text-[var(--form-input-text)] flex items-center justify-center cursor-pointer hover:bg-[var(--form-dd-hover-bg)] transition-colors duration-[120ms] font-[inherit] text-[13px]";
  }
  function renderMonth(month: number, year: number, isFirst: boolean) {
    const cells = getDaysInMonth(month, year);
    return (
      <div className="min-w-[260px]">
        <div className="flex items-center justify-between mb-[10px]">
          {isFirst
            ? <button className="bg-transparent border-none cursor-pointer text-[var(--form-input-placeholder)] text-[20px] w-6 h-6 flex items-center justify-center p-0" onClick={prevMonth}>&#8249;</button>
            : <span className="w-6" />}
          <span className="text-[var(--form-input-text)] font-semibold text-[13px]">{MONTHS[month]} {year}</span>
          {!isFirst || mode !== "range"
            ? <button className="bg-transparent border-none cursor-pointer text-[var(--form-input-placeholder)] text-[20px] w-6 h-6 flex items-center justify-center p-0" onClick={nextMonth}>&#8250;</button>
            : <span className="w-6" />}
        </div>
        <div className="grid gap-[2px] justify-center" style={{ gridTemplateColumns: "repeat(7, 32px)" }}>
          {DAY_NAMES.map(n => <div key={n} className="w-8 h-6 flex items-center justify-center text-[11px] text-[var(--form-input-placeholder)]">{n}</div>)}
          {cells.map((day, i) => (
            <button key={i} className={dayClass(day)}
              onClick={() => day && handleDayClick(day)}
              onMouseEnter={() => day && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}>
              {day ? day.getUTCDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} className={\`absolute top-[calc(100%+6px)] left-0 z-[100] bg-[var(--form-dd-bg)] border border-[var(--form-dd-border)] rounded-[10px] p-4 flex gap-5 min-w-[280px] \${mode === "range" ? "min-w-[580px]" : ""}\`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}>
      <div className="flex gap-5">
        {renderMonth(viewMonth, viewYear, true)}
        {mode === "range" && renderMonth(viewMonth2, viewYear2, false)}
      </div>
      <div className="flex justify-end mt-3">
        <button
          className="bg-[var(--form-accent)] text-[var(--form-accent-text)] border-none rounded-md px-4 py-[5px] text-[13px] cursor-pointer font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleOk}
          disabled={mode === "single" ? !single : !(rangeStart && rangeEnd)}>
          OK
        </button>
      </div>
    </div>
  );
}`
      : "";

  const datetimePopup = needsDatetime
    ? `
function DateTimePopup({ onSelect, onClose }: DateTimePopupProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth());
  const [viewYear, setViewYear] = useState<number>(today.getUTCFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmpm] = useState<string>("AM");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [onClose]);
  function confirm(): void {
    if (!selectedDay) return;
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    onSelect(\`\${fmtDate(selectedDay)} \${h}:\${m} \${ampm}\`);
  }
  const cells = getDaysInMonth(viewMonth, viewYear);
  return (
    <div ref={ref} className="absolute top-[calc(100%+6px)] left-0 z-[100] bg-[var(--form-dd-bg)] border border-[var(--form-dd-border)] rounded-[10px] p-4 w-[340px]"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}>
      <div className="flex items-center justify-between mb-[10px]">
        <button className="bg-transparent border-none cursor-pointer text-[var(--form-input-placeholder)] text-[20px] w-6 h-6 flex items-center justify-center p-0" onClick={() => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }}>&#8249;</button>
        <span className="text-[var(--form-input-text)] font-semibold text-[13px]">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="bg-transparent border-none cursor-pointer text-[var(--form-input-placeholder)] text-[20px] w-6 h-6 flex items-center justify-center p-0" onClick={() => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }}>&#8250;</button>
      </div>
      <div className="grid gap-[2px] justify-center" style={{ gridTemplateColumns: "repeat(7, 32px)" }}>
        {DAY_NAMES.map(n => <div key={n} className="w-8 h-6 flex items-center justify-center text-[11px] text-[var(--form-input-placeholder)]">{n}</div>)}
        {cells.map((day, i) => {
          const sel = day && selectedDay && isSameDay(day, selectedDay);
          let cls = "w-8 h-8 rounded-md border-none flex items-center justify-center cursor-pointer font-[inherit] text-[13px] transition-colors duration-[120ms]";
          if (!day) cls += " invisible pointer-events-none";
          else if (sel) cls += " bg-[var(--form-accent)] text-[var(--form-accent-text)]";
          else cls += " bg-transparent text-[var(--form-input-text)] hover:bg-[var(--form-dd-hover-bg)]";
          return <button key={i} className={cls} onClick={() => day && setSelectedDay(day)}>{day ? day.getUTCDate() : ""}</button>;
        })}
      </div>
      <div className="flex items-center gap-2 mt-[14px]">
        <input type="number" min={1} max={12} value={hour} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHour(Math.max(1,Math.min(12,+e.target.value)))} className="w-12 bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-md text-[var(--form-input-text)] text-[14px] px-[6px] py-1 text-center font-[inherit]" />
        <span className="text-[var(--form-input-text)]">:</span>
        <input type="number" min={0} max={59} value={minute} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinute(Math.max(0,Math.min(59,+e.target.value)))} className="w-12 bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-md text-[var(--form-input-text)] text-[14px] px-[6px] py-1 text-center font-[inherit]" />
        <button onClick={() => setAmpm(a => a === "AM" ? "PM" : "AM")} className="bg-[var(--form-accent)] text-[var(--form-accent-text)] border-none rounded-md px-[10px] py-1 cursor-pointer text-[13px] font-[inherit]">{ampm}</button>
        <button onClick={confirm} disabled={!selectedDay} className="ml-auto bg-[var(--form-accent)] text-[var(--form-accent-text)] border-none rounded-md px-[14px] py-[5px] cursor-pointer text-[13px] font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed">OK</button>
      </div>
    </div>
  );
}`
    : "";

  const dropdownComp = needsDropdown
    ? `
function DropdownField({ options, value, onChange }: DropdownFieldProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button className="w-full bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-[var(--form-input-radius)] text-[var(--form-input-text)] text-[${inputFs}px] px-3 py-[9px] font-[inherit] box-border outline-none text-left flex items-center justify-between gap-2 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span className={value ? "" : "text-[var(--form-input-placeholder)]"}>{value || "Select…"}</span>
        <svg className={\`shrink-0 text-[var(--form-input-placeholder)] transition-transform duration-200 \${open ? "rotate-180" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[50] bg-[var(--form-dd-bg)] border border-[var(--form-dd-border)] rounded-lg overflow-hidden" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.4)" }}>
          {options.map(opt => {
            let cls = "w-full bg-transparent border-none px-3 py-[9px] text-left cursor-pointer font-[inherit] text-[${inputFs}px] flex items-center gap-2 transition-colors duration-[120ms]";
            cls += opt === value ? " bg-[var(--form-accent)]/[.13] text-[var(--form-accent)]" : " text-[var(--form-dd-item-text)] hover:bg-[var(--form-dd-hover-bg)]";
            return (
              <button key={opt} className={cls} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}`
    : "";

  const multiSelectComp = needsMultiSel
    ? `
function MultiSelectField({ options, value, onChange }: MultiSelectFieldProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  function toggle(opt: string): void { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div ref={ref} className="relative">
      <button className="w-full bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-[var(--form-input-radius)] text-[${inputFs}px] px-3 py-[9px] font-[inherit] box-border outline-none text-left flex flex-wrap items-center gap-2 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0
            ? <span className="text-[var(--form-input-placeholder)]">Select…</span>
            : value.map(v => <span key={v} className="bg-[var(--form-accent)]/[.13] text-[var(--form-accent)] rounded px-2 py-[2px] text-[12px]">{v}</span>)}
        </div>
        <svg className={\`shrink-0 text-[var(--form-input-placeholder)] transition-transform duration-200 \${open ? "rotate-180" : ""}\`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[50] bg-[var(--form-dd-bg)] border border-[var(--form-dd-border)] rounded-lg overflow-hidden" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.4)" }}>
          {options.map(opt => {
            const active = value.includes(opt);
            let cls = "w-full bg-transparent border-none px-3 py-[9px] text-left cursor-pointer font-[inherit] text-[${inputFs}px] flex items-center gap-2 transition-colors duration-[120ms]";
            cls += active ? " bg-[var(--form-accent)]/[.13] text-[var(--form-accent)]" : " text-[var(--form-dd-item-text)] hover:bg-[var(--form-dd-hover-bg)]";
            return (
              <button key={opt} className={cls} onClick={() => toggle(opt)}>
                <span className={\`w-4 h-4 rounded border-[1.5px] inline-flex items-center justify-center shrink-0 \${active ? "bg-[var(--form-accent)] border-[var(--form-accent)] text-[var(--form-accent-text)]" : "border-[var(--form-dd-border)] bg-transparent"}\`}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}`
    : "";

  const starsComp = needsStars
    ? `
function StarRatingField({ maxStars, value, onChange }: StarRatingFieldProps) {
  const [hovered, setHovered] = useState<number>(0);
  return (
    <div className="flex gap-[6px]">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
        <button key={star} className="bg-none border-none cursor-pointer p-[2px]"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}>
          <svg className={\`\${(hovered || value) >= star ? "fill-[var(--form-accent)]" : "fill-transparent"} stroke-[var(--form-accent)] transition-[fill] duration-[120ms]\`}
            width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </button>
      ))}
    </div>
  );
}`
    : "";

  const chipsComp = needsChips
    ? `
function ChipsField({ options, value, onChange }: ChipsFieldProps) {
  function toggle(opt: string): void { onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]); }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        let cls = "px-4 py-[6px] rounded-[20px] border-[1.5px] text-[13px] cursor-pointer font-[inherit] transition-all duration-[150ms]";
        cls += value.includes(opt)
          ? " border-[var(--form-accent)] bg-[var(--form-accent)]/[.13] text-[var(--form-accent)]"
          : " border-[var(--form-input-border)] bg-[var(--form-input-bg)] text-[var(--form-input-placeholder)]";
        return <button key={opt} className={cls} onClick={() => toggle(opt)}>{opt}</button>;
      })}
    </div>
  );
}`
    : "";

  const radioComp = needsRadio
    ? `
function RadioField({ options, value, onChange }: RadioFieldProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      {options.map(opt => (
        <button key={opt} className="flex items-center gap-[10px] bg-none border-none cursor-pointer p-0 text-left" onClick={() => onChange(opt)}>
          <span className={\`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-[150ms] \${value === opt ? "border-[var(--form-accent)]" : "border-[var(--form-input-border)]"}\`}>
            {value === opt && <span className="w-2 h-2 rounded-full bg-[var(--form-accent)] block" />}
          </span>
          <span className="text-[var(--form-input-text)] text-[${inputFs}px] font-[inherit]">{opt}</span>
        </button>
      ))}
    </div>
  );
}`
    : "";

  const dateInputComp =
    needsCalendar || needsDatetime
      ? `
function DateInputField({ placeholder, mode, onDatetimeMode }: DateInputFieldProps) {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      <button className="w-full bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-[var(--form-input-radius)] text-[${inputFs}px] px-3 py-[9px] font-[inherit] box-border outline-none text-left flex items-center justify-between gap-2 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span className={value ? "text-[var(--form-input-text)]" : "text-[var(--form-input-placeholder)]"}>{value || placeholder || "Select…"}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[var(--form-input-placeholder)]">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 1v2M10 1v2M1 5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          {onDatetimeMode && <><circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1"/><path d="M10 8v1.2l.7.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></>}
        </svg>
      </button>
      {open && !onDatetimeMode && (
        <CalendarPopup mode={mode} onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
      {open && onDatetimeMode && (
        <DateTimePopup onSelect={v => { setValue(v); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}`
      : "";

  // ── Form state & render ──
  const fieldStateLines: string[] = [];
  const fieldRenderLines: string[] = [];

  config.fields.forEach((field, idx) => {
    const stateVar = `field${idx}Value`;
    const setVar = `setField${idx}Value`;
    let defaultVal = `""`;
    let stateType = "string";
    if (field.type === "multiselect" || field.type === "chips") {
      defaultVal = `[]`;
      stateType = "string[]";
    }
    if (field.type === "star-rating") {
      defaultVal = `0`;
      stateType = "number";
    }

    fieldStateLines.push(
      `  const [${stateVar}, ${setVar}] = useState<${stateType}>(${defaultVal});`,
    );

    let fieldJSX = "";
    const opts = field.options ? JSON.stringify(field.options) : "[]";
    const ph = JSON.stringify(field.placeholder ?? "");

    switch (field.type) {
      case "text":
        fieldJSX = `<input type="text" className="w-full bg-[var(--form-input-bg)] border border-[var(--form-input-border)] rounded-[var(--form-input-radius)] text-[var(--form-input-text)] text-[${inputFs}px] px-3 py-[9px] font-[inherit] box-border outline-none transition-colors duration-[150ms] placeholder:text-[var(--form-input-placeholder)] focus:border-[var(--form-input-focus-border)]" placeholder={${ph}} value={${stateVar} as string} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ${setVar}(e.target.value)} />`;
        break;
      case "dropdown":
        fieldJSX = `<DropdownField options={${opts}} value={${stateVar} as string} onChange={${setVar} as (v: string) => void} />`;
        break;
      case "multiselect":
        fieldJSX = `<MultiSelectField options={${opts}} value={${stateVar} as string[]} onChange={${setVar} as (v: string[]) => void} />`;
        break;
      case "date-single":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" />`;
        break;
      case "date-range":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="range" />`;
        break;
      case "datetime":
        fieldJSX = `<DateInputField placeholder={${ph}} mode="single" onDatetimeMode={true} />`;
        break;
      case "star-rating":
        fieldJSX = `<StarRatingField maxStars={${field.maxStars ?? 5}} value={${stateVar} as number} onChange={${setVar} as (v: number) => void} />`;
        break;
      case "chips":
        fieldJSX = `<ChipsField options={${opts}} value={${stateVar} as string[]} onChange={${setVar} as (v: string[]) => void} />`;
        break;
      case "radio":
        fieldJSX = `<RadioField options={${opts}} value={${stateVar} as string} onChange={${setVar} as (v: string) => void} />`;
        break;
    }

    const requiredStar = field.required
      ? ` <span className="text-[var(--form-required-color)]">*</span>`
      : "";
    fieldRenderLines.push(`
        <div className="flex flex-col gap-[6px]">
          <label className="text-[${labelFs}px] text-[var(--form-label-color)] font-medium tracking-[0.04em] uppercase flex items-center gap-1">${field.label}${requiredStar}</label>
          ${fieldJSX}
        </div>`);
  });

  const formPropsInterface = `
interface CustomFormProps {
  onSubmit?: (values: Record<string, unknown>) => void;
}`;

  const handleSubmit = `
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (onSubmit) onSubmit({ ${config.fields.map((_, i) => `field${i}Value`).join(", ")} });
  }`;

  const mainComponent = `
export default function CustomForm({ onSubmit }: CustomFormProps) {
${fieldStateLines.join("\n")}
${handleSubmit}

  return (
    <div className="w-full max-w-[520px] mx-auto font-sans" style={formVars}>
      <form
        className="bg-[var(--form-bg)] border border-[var(--form-border)] rounded-[var(--form-radius)] p-[var(--form-padding)] flex flex-col gap-[var(--form-gap)]"
        style={{ boxShadow: "${shadow}" }}
        onSubmit={handleSubmit}>
${fieldRenderLines.join("\n")}
        <button type="submit" className="mt-1 bg-[var(--form-btn-bg)] text-[var(--form-btn-text)] border-none rounded-[var(--form-btn-radius)] px-6 py-[11px] text-[14px] font-semibold cursor-pointer font-[inherit] self-start hover:opacity-[0.88] transition-opacity duration-[150ms]">${config.buttonLabel}</button>
      </form>
    </div>
  );
}`;

  return [
    imports,
    months,
    dayNames,
    utils,
    formVars,
    calendarPopupInterface,
    datetimePopupInterface,
    dropdownInterface,
    multiSelectInterface,
    starsInterface,
    chipsInterface,
    radioInterface,
    dateInputInterface,
    formPropsInterface,
    calendarPopup,
    datetimePopup,
    dropdownComp,
    multiSelectComp,
    starsComp,
    chipsComp,
    radioComp,
    dateInputComp,
    mainComponent,
  ]
    .filter(Boolean)
    .join("\n\n");
}
