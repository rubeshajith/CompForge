import { MultiSelectConfig, MULTI_SELECT_OPTIONS } from "./multiSelectConfig";

export function generateMultiSelectJSX(config: MultiSelectConfig): string {
  return `import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "./MultiSelect.css";

const OPTIONS = [
${MULTI_SELECT_OPTIONS.map((o) => `  { value: "${o.value}", label: "${o.label}" }`).join(",\n")}
];

export function MultiSelect({ placeholder = "${config.placeholder}" }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return OPTIONS;
    return OPTIONS.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleOption = useCallback((value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  function toggleDropdown() {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => inputRef.current?.focus(), 80);
  }

  const maxCount = ${config.maxCount};
  const overflow = selected.slice(maxCount);

  return (
    <div className="ms" ref={dropdownRef}>
      <div
        className={\`ms__trigger \${open ? "ms__trigger--open" : ""}\`}
        onClick={toggleDropdown}
      >
        <div className="ms__values">
          {selected.length === 0 && (
            <span className="ms__placeholder">{placeholder}</span>
          )}
          {selected.slice(0, maxCount).map((val) => {
            const opt = OPTIONS.find((o) => o.value === val);
            return (
              <span key={val} className="ms__badge">{opt?.label}</span>
            );
          })}
          {selected.length > maxCount && (
            <span className="ms__badge ms__badge--overflow">
              +{selected.length - maxCount} more
            </span>
          )}
        </div>
        <svg className={\`ms__arrow \${open ? "ms__arrow--open" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <div className="ms__dropdown">
          <div className="ms__search-wrap">
            <input
              ref={inputRef}
              className="ms__search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            />
            {search && (
              <span className="ms__clear-search" onClick={() => setSearch("")}>✕</span>
            )}
          </div>

          {selected.length > 0 && (
            <div className="ms__actions">
              <button className="ms__clear-all" onClick={() => setSelected([])}>
                Clear all
              </button>
              <button className="ms__done" onClick={() => { setOpen(false); setSearch(""); }}>
                Done
              </button>
            </div>
          )}

          <div className="ms__options">
            {filteredOptions.length === 0 ? (
              <div className="ms__empty">No results found.</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={\`ms__option \${isSelected ? "ms__option--selected" : ""}\`}
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className={\`ms__checkbox \${isSelected ? "ms__checkbox--checked" : ""}\`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}`;
}

export function generateMultiSelectCSS(config: MultiSelectConfig): string {
  const shadow = config.showShadow
    ? "0 10px 30px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
    : "none";

  const animation = config.animateOpen
    ? `@keyframes msDropIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}`
    : "";

  return `.ms {
  position: relative;
  width: ${config.width}px;
  font-family: inherit;
  font-size: ${config.fontSize}px;
}

.ms__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: ${config.padding - 4}px ${config.padding + 2}px;
  background: ${config.triggerBackground};
  border: 1px solid ${config.triggerBorderColor};
  border-radius: ${config.triggerBorderRadius}px;
  cursor: pointer;
  color: ${config.triggerTextColor};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.ms__trigger--open,
.ms__trigger:hover {
  border-color: ${config.accentColor};
  box-shadow: 0 0 0 3px ${config.accentColor}33;
}

.ms__values {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.ms__placeholder {
  color: ${config.placeholderColor};
}

.ms__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: ${config.badgeBackground};
  color: ${config.badgeTextColor};
  border-radius: ${config.badgeBorderRadius}px;
  font-size: ${config.fontSize - 2}px;
  font-weight: 500;
}

.ms__badge--overflow {
  background: ${config.accentColor}22;
  color: ${config.accentColor};
}

.ms__arrow {
  margin-left: 8px;
  flex-shrink: 0;
  color: ${config.placeholderColor};
  transition: transform 0.2s ease;
}

.ms__arrow--open {
  transform: rotate(180deg);
}

.ms__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${config.dropdownBackground};
  border: 1px solid ${config.dropdownBorderColor};
  border-radius: ${config.dropdownBorderRadius}px;
  box-shadow: ${shadow};
  z-index: 50;
  overflow: hidden;
  ${config.animateOpen ? "animation: msDropIn 0.15s ease;" : ""}
}
${animation}

.ms__search-wrap {
  position: relative;
  border-bottom: 1px solid ${config.dropdownBorderColor};
}

.ms__search {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: none;
  outline: none;
  background: ${config.dropdownBackground};
  color: ${config.triggerTextColor};
  font-size: ${config.fontSize}px;
  font-family: inherit;
}

.ms__search::placeholder {
  color: ${config.placeholderColor};
}

.ms__clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${config.placeholderColor};
  font-size: 14px;
}

.ms__actions {
  display: flex;
  border-bottom: 1px solid ${config.dropdownBorderColor};
}

.ms__clear-all,
.ms__done {
  flex: 1;
  padding: 7px 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.12s ease;
}

.ms__clear-all {
  color: #f87171;
}
.ms__clear-all:hover { background: rgba(248,113,113,0.08); }

.ms__done {
  color: ${config.accentColor};
  border-left: 1px solid ${config.dropdownBorderColor};
}
.ms__done:hover { background: ${config.accentColor}11; }

.ms__options {
  max-height: 180px;
  overflow-y: auto;
}

.ms__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${config.padding - 2}px 12px;
  cursor: pointer;
  color: ${config.triggerTextColor};
  transition: background 0.12s ease;
}

.ms__option:hover {
  background: ${config.optionHoverBackground};
}

.ms__option--selected {
  background: ${config.selectedOptionBackground};
  color: ${config.selectedOptionColor};
}

.ms__checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 2px solid ${config.triggerBorderColor};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.ms__checkbox--checked {
  background: ${config.accentColor};
  border-color: ${config.accentColor};
}

.ms__empty {
  padding: 16px;
  text-align: center;
  color: ${config.placeholderColor};
  font-size: ${config.fontSize}px;
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateMultiSelectTSX(config: MultiSelectConfig): string {
  return `import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "./MultiSelect.css";

const OPTIONS = [
${MULTI_SELECT_OPTIONS.map((o) => `  { value: "${o.value}", label: "${o.label}" }`).join(",\n")}
];

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  placeholder?: string;
}

export function MultiSelect({ placeholder = "${config.placeholder}" }: MultiSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return OPTIONS;
    return OPTIONS.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleOption = useCallback((value: string): void => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  function toggleDropdown(): void {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => inputRef.current?.focus(), 80);
  }

  const maxCount = ${config.maxCount};
  const overflow = selected.slice(maxCount);

  return (
    <div className="ms" ref={dropdownRef}>
      <div
        className={\`ms__trigger \${open ? "ms__trigger--open" : ""}\`}
        onClick={toggleDropdown}
      >
        <div className="ms__values">
          {selected.length === 0 && (
            <span className="ms__placeholder">{placeholder}</span>
          )}
          {selected.slice(0, maxCount).map((val) => {
            const opt = OPTIONS.find((o) => o.value === val);
            return (
              <span key={val} className="ms__badge">{opt?.label}</span>
            );
          })}
          {selected.length > maxCount && (
            <span className="ms__badge ms__badge--overflow">
              +{selected.length - maxCount} more
            </span>
          )}
        </div>
        <svg className={\`ms__arrow \${open ? "ms__arrow--open" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <div className="ms__dropdown">
          <div className="ms__search-wrap">
            <input
              ref={inputRef}
              className="ms__search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            />
            {search && (
              <span className="ms__clear-search" onClick={() => setSearch("")}>✕</span>
            )}
          </div>

          {selected.length > 0 && (
            <div className="ms__actions">
              <button className="ms__clear-all" onClick={() => setSelected([])}>
                Clear all
              </button>
              <button className="ms__done" onClick={() => { setOpen(false); setSearch(""); }}>
                Done
              </button>
            </div>
          )}

          <div className="ms__options">
            {filteredOptions.length === 0 ? (
              <div className="ms__empty">No results found.</div>
            ) : (
              filteredOptions.map((option: Option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={\`ms__option \${isSelected ? "ms__option--selected" : ""}\`}
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className={\`ms__checkbox \${isSelected ? "ms__checkbox--checked" : ""}\`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateMultiSelectTailwind(config: MultiSelectConfig): string {
  const shadow = config.showShadow
    ? "0 10px 30px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
    : "none";

  const fsBase = config.fontSize;
  const fsBadge = config.fontSize - 2;

  return `import { useState, useCallback, useMemo, useRef, useEffect, CSSProperties } from "react";

const OPTIONS = [
${MULTI_SELECT_OPTIONS.map((o) => `  { value: "${o.value}", label: "${o.label}" }`).join(",\n")}
];

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  placeholder?: string;
}

// Baked-in CSS variable tokens — update these to reskin the MultiSelect
const msVars: CSSProperties = {
  "--ms-width":                  "${config.width}px",
  "--ms-trigger-bg":             "${config.triggerBackground}",
  "--ms-trigger-border":         "${config.triggerBorderColor}",
  "--ms-trigger-radius":         "${config.triggerBorderRadius}px",
  "--ms-trigger-text":           "${config.triggerTextColor}",
  "--ms-accent":                 "${config.accentColor}",
  "--ms-accent-ring":            "${config.accentColor}33",
  "--ms-placeholder":            "${config.placeholderColor}",
  "--ms-badge-bg":               "${config.badgeBackground}",
  "--ms-badge-text":             "${config.badgeTextColor}",
  "--ms-badge-radius":           "${config.badgeBorderRadius}px",
  "--ms-badge-overflow-bg":      "${config.accentColor}22",
  "--ms-dropdown-bg":            "${config.dropdownBackground}",
  "--ms-dropdown-border":        "${config.dropdownBorderColor}",
  "--ms-dropdown-radius":        "${config.dropdownBorderRadius}px",
  "--ms-option-hover-bg":        "${config.optionHoverBackground}",
  "--ms-selected-option-bg":     "${config.selectedOptionBackground}",
  "--ms-selected-option-text":   "${config.selectedOptionColor}",
  "--ms-padding":                "${config.padding}px",
  "--ms-padding-sm":             "${config.padding - 2}px",
  "--ms-padding-trigger-v":      "${config.padding - 4}px",
  "--ms-padding-trigger-h":      "${config.padding + 2}px",
} as CSSProperties;

export function MultiSelect({ placeholder = "${config.placeholder}" }: MultiSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return OPTIONS;
    return OPTIONS.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleOption = useCallback((value: string): void => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  function toggleDropdown(): void {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => inputRef.current?.focus(), 80);
  }

  const maxCount = ${config.maxCount};

  return (
    <div
      className="relative font-sans"
      style={{ ...msVars, width: "var(--ms-width)" } as CSSProperties}
      ref={dropdownRef}
    >
      ${
        config.animateOpen
          ? `<style>{\`
        @keyframes msDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      \`}</style>`
          : ""
      }
      <div
        className={\`flex items-center justify-between min-h-[40px] cursor-pointer select-none transition-[border-color,box-shadow] duration-200 border bg-[var(--ms-trigger-bg)] border-[var(--ms-trigger-border)] rounded-[var(--ms-trigger-radius)] text-[var(--ms-trigger-text)] \${
          open
            ? "border-[var(--ms-accent)] [box-shadow:0_0_0_3px_var(--ms-accent-ring)]"
            : "hover:border-[var(--ms-accent)] hover:[box-shadow:0_0_0_3px_var(--ms-accent-ring)]"
        }\`}
        style={{ padding: "var(--ms-padding-trigger-v) var(--ms-padding-trigger-h)" } as CSSProperties}
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 && (
            <span className="text-[var(--ms-placeholder)] text-[${fsBase}px]">{placeholder}</span>
          )}
          {selected.slice(0, maxCount).map((val) => {
            const opt = OPTIONS.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center px-2 py-0.5 bg-[var(--ms-badge-bg)] text-[var(--ms-badge-text)] rounded-[var(--ms-badge-radius)] font-medium text-[${fsBadge}px]"
              >
                {opt?.label}
              </span>
            );
          })}
          {selected.length > maxCount && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--ms-badge-overflow-bg)] text-[var(--ms-accent)] rounded-[var(--ms-badge-radius)] font-medium text-[${fsBadge}px]">
              +{selected.length - maxCount} more
            </span>
          )}
        </div>
        <svg
          className={\`ml-2 shrink-0 text-[var(--ms-placeholder)] transition-transform duration-200 \${open ? "rotate-180" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[var(--ms-dropdown-bg)] border border-[var(--ms-dropdown-border)] rounded-[var(--ms-dropdown-radius)] z-50 overflow-hidden${config.animateOpen ? " [animation:msDropIn_0.15s_ease]" : ""}"
          style={{ boxShadow: "${shadow}" }}
        >
          <div className="relative border-b border-[var(--ms-dropdown-border)]">
            <input
              ref={inputRef}
              className="w-full py-2.5 pl-3 pr-9 border-none outline-none bg-[var(--ms-dropdown-bg)] text-[var(--ms-trigger-text)] text-[${fsBase}px] font-[inherit] placeholder:text-[var(--ms-placeholder)]"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            />
            {search && (
              <span
                className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--ms-placeholder)] text-sm"
                onClick={() => setSearch("")}
              >
                ✕
              </span>
            )}
          </div>

          {selected.length > 0 && (
            <div className="flex border-b border-[var(--ms-dropdown-border)]">
              <button
                className="flex-1 py-[7px] px-3 border-none bg-transparent cursor-pointer text-xs font-[inherit] text-[#f87171] transition-[background] duration-[120ms] hover:bg-[rgba(248,113,113,0.08)]"
                onClick={() => setSelected([])}
              >
                Clear all
              </button>
              <button
                className="flex-1 py-[7px] px-3 border-none bg-transparent cursor-pointer text-xs font-[inherit] text-[var(--ms-accent)] border-l border-[var(--ms-dropdown-border)] transition-[background] duration-[120ms] hover:bg-[var(--ms-badge-overflow-bg)]"
                onClick={() => { setOpen(false); setSearch(""); }}
              >
                Done
              </button>
            </div>
          )}

          <div className="max-h-[180px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-[var(--ms-placeholder)] text-[${fsBase}px]">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option: Option) => {
                const isSelected = selected.includes(option.value);
                let cls = "flex items-center gap-2.5 cursor-pointer transition-[background] duration-[120ms] text-[${fsBase}px]";
                if (isSelected) {
                  cls += " bg-[var(--ms-selected-option-bg)] text-[var(--ms-selected-option-text)]";
                } else {
                  cls += " text-[var(--ms-trigger-text)] hover:bg-[var(--ms-option-hover-bg)]";
                }
                return (
                  <div
                    key={option.value}
                    className={cls}
                    style={{ padding: "var(--ms-padding-sm) 12px" } as CSSProperties}
                    onClick={() => toggleOption(option.value)}
                  >
                    <div
                      className={\`w-4 h-4 shrink-0 border-2 rounded flex items-center justify-center transition-all duration-[150ms] \${
                        isSelected
                          ? "bg-[var(--ms-accent)] border-[var(--ms-accent)]"
                          : "border-[var(--ms-trigger-border)]"
                      }\`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}`;
}
