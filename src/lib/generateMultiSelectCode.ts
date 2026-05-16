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
