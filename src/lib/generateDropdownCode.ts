import { DropdownConfig, DROPDOWN_OPTIONS } from "./dropdownConfig";

export function generateDropdownJSX(config: DropdownConfig): string {
  return `import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

const options = [
${DROPDOWN_OPTIONS.map((o) => `  "${o}"`).join(",\n")}
];

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={\`dropdown__trigger \${isOpen ? "dropdown__trigger--open" : ""}\`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "dropdown__value" : "dropdown__placeholder"}>
          {selected ?? "${config.placeholder}"}
        </span>
        ${
          config.showArrowIcon
            ? `{/* Arrow icon */}
        <svg
          className={\`dropdown__arrow \${isOpen ? "dropdown__arrow--open" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>`
            : ""
        }
      </button>

      {isOpen && (
        <ul className="dropdown__menu">
          {options.map((option) => (
            <li
              key={option}
              className={\`dropdown__item \${selected === option ? "dropdown__item--selected" : ""}\`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`;
}

export function generateDropdownCSS(config: DropdownConfig): string {
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)"
    : "none";

  const animation = config.animateOpen
    ? `
  animation: dropdownFadeIn 0.15s ease;

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}`
    : "";

  return `.dropdown {
  position: relative;
  width: ${config.width}px;
  font-family: inherit;
  font-size: ${config.fontSize}px;
}

.dropdown__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${config.padding}px ${config.padding + 4}px;
  background: ${config.backgroundColor};
  color: ${config.textColor};
  border: ${config.borderWidth}px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  box-shadow: ${shadow};
}

.dropdown__trigger:hover,
.dropdown__trigger--open {
  border-color: ${config.accentColor};
  box-shadow: 0 0 0 3px ${config.accentColor}22${config.showShadow ? ", " + shadow : ""};
}

.dropdown__placeholder {
  color: ${config.placeholderColor};
}

.dropdown__value {
  color: ${config.textColor};
}

.dropdown__arrow {
  color: ${config.placeholderColor};
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown__arrow--open {
  transform: rotate(180deg);
}

.dropdown__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${config.backgroundColor};
  border: ${config.borderWidth}px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  list-style: none;
  padding: 6px;
  box-shadow: ${shadow};
  z-index: 100;
  ${animation ? `animation: dropdownFadeIn 0.15s ease;` : ""}
}
${animation}

.dropdown__item {
  padding: ${config.padding - 2}px ${config.padding}px;
  border-radius: ${Math.max(config.borderRadius - 4, 4)}px;
  cursor: pointer;
  color: ${config.textColor};
  transition: background 0.15s ease, color 0.15s ease;
}

.dropdown__item:hover {
  background: ${config.accentColor}22;
  color: ${config.accentColor};
}

.dropdown__item--selected {
  background: ${config.accentColor}33;
  color: ${config.accentColor};
  font-weight: 500;
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateDropdownTSX(config: DropdownConfig): string {
  return `import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

const options = [
${DROPDOWN_OPTIONS.map((o) => `  "${o}"`).join(",\n")}
];

interface DropdownProps {}

export function Dropdown({}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={\`dropdown__trigger \${isOpen ? "dropdown__trigger--open" : ""}\`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "dropdown__value" : "dropdown__placeholder"}>
          {selected ?? "${config.placeholder}"}
        </span>
        ${
          config.showArrowIcon
            ? `{/* Arrow icon */}
        <svg
          className={\`dropdown__arrow \${isOpen ? "dropdown__arrow--open" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>`
            : ""
        }
      </button>

      {isOpen && (
        <ul className="dropdown__menu">
          {options.map((option) => (
            <li
              key={option}
              className={\`dropdown__item \${selected === option ? "dropdown__item--selected" : ""}\`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateDropdownTailwind(config: DropdownConfig): string {
  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)"
    : "none";

  const fs = config.fontSize;
  const itemPadY = config.padding - 2;
  const itemPadX = config.padding;
  const triggerPadY = config.padding;
  const triggerPadX = config.padding + 4;
  const itemRadius = Math.max(config.borderRadius - 4, 4);

  return `import { useState, useRef, useEffect, CSSProperties } from "react";

const options = [
${DROPDOWN_OPTIONS.map((o) => `  "${o}"`).join(",\n")}
];

interface DropdownProps {}

// Baked-in CSS variable tokens — update these to reskin the Dropdown
const ddVars: CSSProperties = {
  "--dd-bg":          "${config.backgroundColor}",
  "--dd-text":        "${config.textColor}",
  "--dd-placeholder": "${config.placeholderColor}",
  "--dd-border":      "${config.borderColor}",
  "--dd-accent":      "${config.accentColor}",
  "--dd-radius":      "${config.borderRadius}px",
  "--dd-item-radius": "${itemRadius}px",
  "--dd-border-width":"${config.borderWidth}px",
  "--dd-width":       "${config.width}px",
  "--dd-shadow":      "${shadow}",
} as CSSProperties;

export function Dropdown({}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative font-sans"
      style={{ ...ddVars, width: "var(--dd-width)" }}
      ref={ref}
    >
      ${
        config.animateOpen
          ? `<style>{\`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      \`}</style>`
          : ""
      }
      <button
        className={\`w-full flex items-center justify-between bg-[var(--dd-bg)] text-[${fs}px] text-[var(--dd-text)] border-[length:var(--dd-border-width)] border-[var(--dd-border)] rounded-[var(--dd-radius)] cursor-pointer outline-none transition-[border-color,box-shadow] duration-200 \${isOpen ? "border-[var(--dd-accent)]" : "hover:border-[var(--dd-accent)]"}\`}
        style={{
          padding: "${triggerPadY}px ${triggerPadX}px",
          boxShadow: isOpen
            ? \`0 0 0 3px \${ddVars["--dd-accent"] as string}22${config.showShadow ? ", " + shadow : ""}\`
            : "var(--dd-shadow)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={\`text-[${fs}px] \${selected ? "text-[var(--dd-text)]" : "text-[var(--dd-placeholder)]"}\`}>
          {selected ?? "${config.placeholder}"}
        </span>
        ${
          config.showArrowIcon
            ? `{/* Arrow icon */}
        <svg
          className={\`shrink-0 text-[var(--dd-placeholder)] transition-transform duration-200 \${isOpen ? "rotate-180" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>`
            : ""
        }
      </button>

      {isOpen && (
        <ul
          className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[var(--dd-bg)] border-[length:var(--dd-border-width)] border-[var(--dd-border)] rounded-[var(--dd-radius)] list-none p-[6px] z-[100]${config.animateOpen ? " [animation:dropdownFadeIn_0.15s_ease]" : ""}"
          style={{ boxShadow: "var(--dd-shadow)" }}
        >
          {options.map((option) => {
            let cls = "text-[${fs}px] rounded-[var(--dd-item-radius)] cursor-pointer transition-[background,color] duration-150";
            if (selected === option) {
              cls += " bg-[color-mix(in_srgb,var(--dd-accent)_20%,transparent)] text-[var(--dd-accent)] font-medium";
            } else {
              cls += " text-[var(--dd-text)] hover:bg-[color-mix(in_srgb,var(--dd-accent)_13%,transparent)] hover:text-[var(--dd-accent)]";
            }
            return (
              <li
                key={option}
                className={cls}
                style={{ padding: "${itemPadY}px ${itemPadX}px" }}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`;
}
