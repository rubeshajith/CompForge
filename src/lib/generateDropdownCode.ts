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
        ${config.showArrowIcon ? `{/* Arrow icon */}
        <svg
          className={\`dropdown__arrow \${isOpen ? "dropdown__arrow--open" : ""}\`}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>` : ""}
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
