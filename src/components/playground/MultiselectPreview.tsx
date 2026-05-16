"use client";

import {
  MULTI_SELECT_OPTIONS,
  MultiSelectConfig,
} from "@/lib/multiSelectConfig";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  config: MultiSelectConfig;
}

export function MultiSelectPreview({ config }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showMoreTooltip, setShowMoreTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shadow = config.showShadow
    ? "0 10px 30px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
    : "none";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return MULTI_SELECT_OPTIONS;
    return MULTI_SELECT_OPTIONS.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const overflowSelected = useMemo(() => {
    return selected
      .slice(config.maxCount)
      .map((val) => MULTI_SELECT_OPTIONS.find((o) => o.value === val))
      .filter(Boolean) as Option[];
  }, [selected, config.maxCount]);

  const toggleOption = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  function toggleDropdown() {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => inputRef.current?.focus(), 80);
  }

  // Shared style helpers
  const s = config;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: `${s.width}px`,
        fontFamily: "inherit",
      }}
    >
      {/* Trigger */}
      <div
        onClick={toggleDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "40px",
          padding: `${s.padding - 4}px ${s.padding + 2}px`,
          background: s.triggerBackground,
          border: `1px solid ${open ? s.accentColor : s.triggerBorderColor}`,
          borderRadius: `${s.triggerBorderRadius}px`,
          cursor: "pointer",
          fontSize: `${s.fontSize}px`,
          color: s.triggerTextColor,
          boxShadow: open ? `0 0 0 3px ${s.accentColor}33` : "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
          {selected.length === 0 && (
            <span style={{ color: s.placeholderColor }}>{s.placeholder}</span>
          )}
          {selected.slice(0, s.maxCount).map((val) => {
            const opt = MULTI_SELECT_OPTIONS.find((o) => o.value === val);
            return (
              <span
                key={val}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  background: s.badgeBackground,
                  color: s.badgeTextColor,
                  borderRadius: `${s.badgeBorderRadius}px`,
                  fontSize: `${s.fontSize - 2}px`,
                  fontWeight: 500,
                }}
              >
                {opt?.label}
              </span>
            );
          })}
          {selected.length > s.maxCount && (
            <span
              onMouseEnter={() => setShowMoreTooltip(true)}
              onMouseLeave={() => setShowMoreTooltip(false)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                background: `${s.accentColor}22`,
                color: s.accentColor,
                borderRadius: `${s.badgeBorderRadius}px`,
                fontSize: `${s.fontSize - 2}px`,
                fontWeight: 500,
                cursor: "default",
              }}
            >
              +{selected.length - s.maxCount} more
              {showMoreTooltip && overflowSelected.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    background: s.dropdownBackground,
                    border: `1px solid ${s.dropdownBorderColor}`,
                    borderRadius: `${s.dropdownBorderRadius}px`,
                    padding: "8px",
                    minWidth: "140px",
                    boxShadow: shadow,
                    zIndex: 60,
                    animation: "msDropIn 0.15s ease",
                  }}
                >
                  {overflowSelected.map((o) => (
                    <div
                      key={o.value}
                      style={{
                        fontSize: "12px",
                        padding: "4px 0",
                        color: s.triggerTextColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.label}
                    </div>
                  ))}
                </div>
              )}
            </span>
          )}
        </div>

        {/* Arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            marginLeft: "8px",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: s.placeholderColor,
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
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: s.dropdownBackground,
            border: `1px solid ${s.dropdownBorderColor}`,
            borderRadius: `${s.dropdownBorderRadius}px`,
            boxShadow: shadow,
            zIndex: 50,
            overflow: "hidden",
            animation: s.animateOpen ? "msDropIn 0.15s ease" : "none",
          }}
        >
          <style>{`
            @keyframes msDropIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Search */}
          <div
            style={{
              position: "relative",
              borderBottom: `1px solid ${s.dropdownBorderColor}`,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "10px 36px 10px 12px",
                border: "none",
                outline: "none",
                background: s.dropdownBackground,
                color: s.searchTextColor,
                fontSize: `${s.fontSize}px`,
              }}
            />
            {search && (
              <span
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: s.placeholderColor,
                  fontSize: "14px",
                }}
              >
                ✕
              </span>
            )}
          </div>

          {/* Clear all + Done row */}
          {selected.length > 0 && (
            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${s.dropdownBorderColor}`,
              }}
            >
              <button
                onClick={() => setSelected([])}
                style={{
                  flex: 1,
                  padding: "7px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#f87171",
                  fontFamily: "inherit",
                }}
              >
                Clear all
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  flex: 1,
                  padding: "7px 12px",
                  border: "none",
                  borderLeft: `1px solid ${s.dropdownBorderColor}`,
                  background: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: s.accentColor,
                  fontFamily: "inherit",
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* Options list */}
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: s.placeholderColor,
                  fontSize: `${s.fontSize}px`,
                }}
              >
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: `${s.padding - 2}px 12px`,
                      cursor: "pointer",
                      fontSize: `${s.fontSize}px`,
                      color: isSelected
                        ? s.selectedOptionColor
                        : s.triggerTextColor,
                      background: isSelected
                        ? s.selectedOptionBackground
                        : "transparent",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background =
                          s.optionHoverBackground;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
                        border: `2px solid ${isSelected ? s.accentColor : s.triggerBorderColor}`,
                        borderRadius: "4px",
                        background: isSelected ? s.accentColor : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isSelected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
}
