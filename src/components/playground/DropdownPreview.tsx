"use client";

import { useState, useRef, useEffect } from "react";
import { DropdownConfig, DROPDOWN_OPTIONS } from "@/lib/dropdownConfig";
import styles from "./DropdownPreview.module.css";

interface Props {
  config: DropdownConfig;
}

export function DropdownPreview({ config }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shadow = config.showShadow
    ? "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)"
    : "none";

  const triggerStyle: React.CSSProperties = {
    width: `${config.width}px`,
    padding: `${config.padding}px ${config.padding + 4}px`,
    background: config.backgroundColor,
    color: selected ? config.textColor : config.placeholderColor,
    border: `${config.borderWidth}px solid ${isOpen ? config.accentColor : config.borderColor}`,
    borderRadius: `${config.borderRadius}px`,
    fontSize: `${config.fontSize}px`,
    boxShadow: isOpen ? `0 0 0 3px ${config.accentColor}33, ${shadow}` : shadow,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: "inherit",
  };

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: config.backgroundColor,
    border: `${config.borderWidth}px solid ${config.borderColor}`,
    borderRadius: `${config.borderRadius}px`,
    padding: "6px",
    boxShadow: shadow,
    zIndex: 100,
    animation: config.animateOpen ? "dropdownFadeIn 0.15s ease" : "none",
  };

  return (
    <div
      className={styles.wrapper}
      ref={ref}
      style={{ position: "relative", width: `${config.width}px` }}
    >
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <button style={triggerStyle} onClick={() => setIsOpen(!isOpen)}>
        <span>{selected ?? config.placeholder}</span>
        {config.showArrowIcon && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              color: config.placeholderColor,
              flexShrink: 0,
            }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <ul style={menuStyle}>
          {DROPDOWN_OPTIONS.map((option) => {
            const isSelected = selected === option;
            return (
              <li
                key={option}
                style={{
                  padding: `${config.padding - 2}px ${config.padding}px`,
                  borderRadius: `${Math.max(config.borderRadius - 4, 4)}px`,
                  cursor: "pointer",
                  color: isSelected ? config.accentColor : config.textColor,
                  background: isSelected
                    ? `${config.accentColor}33`
                    : "transparent",
                  fontSize: `${config.fontSize}px`,
                  transition: "background 0.15s ease, color 0.15s ease",
                  fontWeight: isSelected ? 500 : 400,
                  listStyle: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background =
                      `${config.accentColor}22`;
                    (e.currentTarget as HTMLElement).style.color =
                      config.accentColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      config.textColor;
                  }
                }}
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
}
