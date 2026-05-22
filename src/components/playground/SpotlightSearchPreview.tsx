"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SpotlightConfig } from "@/lib/spotlightSearchConfig";

interface SpotlightItem {
  id: string;
  icon: string;
  label: string;
  sublabel?: string;
  kbd?: string;
  category: string;
}

const ITEMS: SpotlightItem[] = [
  {
    id: "new-project",
    icon: "add_circle",
    label: "Create New Project",
    kbd: "⌘ N",
    category: "Quick Actions",
  },
  {
    id: "dashboard",
    icon: "dashboard",
    label: "Go to Dashboard",
    kbd: "G D",
    category: "Quick Actions",
  },
  {
    id: "settings",
    icon: "settings",
    label: "System Settings",
    kbd: "⌘ ,",
    category: "Quick Actions",
  },
  {
    id: "report",
    icon: "description",
    label: "Q4 Financial Report.pdf",
    sublabel: "Edited 2h ago",
    kbd: "⌘ 1",
    category: "Recent Items",
  },
  {
    id: "brand",
    icon: "folder",
    label: "Brand Identity Assets",
    sublabel: "Modified by Alex",
    kbd: "⌘ 2",
    category: "Recent Items",
  },
  {
    id: "design-sys",
    icon: "palette",
    label: "Design System v3.figma",
    sublabel: "Modified yesterday",
    kbd: "⌘ 3",
    category: "Recent Items",
  },
  {
    id: "marcus",
    icon: "person",
    label: "Marcus Chen",
    sublabel: "Product Director",
    kbd: "P M",
    category: "People",
  },
  {
    id: "sarah",
    icon: "person",
    label: "Sarah Miller",
    sublabel: "Lead Architect",
    kbd: "P S",
    category: "People",
  },
];

const CATEGORIES = ["Quick Actions", "Recent Items", "People"];

function getIconSvg(icon: string, color: string, size = 16): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    add_circle: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    dashboard: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    settings: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    description: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
    folder: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
    palette: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="8.5" cy="9.5" r="1.5" fill={color} stroke="none" />
        <circle cx="15.5" cy="9.5" r="1.5" fill={color} stroke="none" />
        <circle cx="12" cy="15" r="1.5" fill={color} stroke="none" />
      </svg>
    ),
    person: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  };
  return icons[icon] ?? icons["search"];
}

interface Props {
  config: SpotlightConfig;
}

export function SpotlightSearchPreview({ config: c }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.sublabel ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  const visibleCategories = c.showCategories
    ? CATEGORIES.filter((cat) => filtered.some((i) => i.category === cat))
    : ["all"];

  // clamp activeIndex when filtered list shrinks
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((p) => Math.min(p + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((p) => Math.max(p - 1, 0));
      }
    },
    [filtered.length],
  );

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      "[data-active='true']",
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const panel: React.CSSProperties = {
    width: c.panelWidth,
    maxWidth: "100%",
    background: c.panelBackground,
    border: `1px solid ${c.panelBorderColor}`,
    borderRadius: c.panelBorderRadius,
    boxShadow: c.showShadow
      ? "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)"
      : "none",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
    fontSize: c.fontSize,
    ...(c.animateOpen
      ? { animation: "sp-open 0.18s cubic-bezier(0.16,1,0.3,1)" }
      : {}),
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: c.backdropColor,
        borderRadius: 12,
        minHeight: 480,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <style>{`
        @keyframes sp-open {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sp-scroll::-webkit-scrollbar { width: 4px; }
        .sp-scroll::-webkit-scrollbar-track { background: transparent; }
        .sp-scroll::-webkit-scrollbar-thumb { background: ${c.panelBorderColor}; border-radius: 99px; }
      `}</style>

      <div
        style={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight search"
      >
        {/* ── Input ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderBottom: `1px solid ${c.panelBorderColor}`,
            background: c.inputBackground,
          }}
        >
          {getIconSvg("search", c.inputIconColor, 18)}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKey}
            placeholder="Search actions, files, or people…"
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: c.inputTextColor,
              fontSize: c.fontSize + 1,
              fontFamily: "inherit",
              fontWeight: 500,
            }}
            aria-label="Search"
          />
          <kbd
            style={{
              fontSize: 10,
              padding: "2px 7px",
              background: c.kbdBackground,
              border: `1px solid ${c.kbdBorderColor}`,
              borderRadius: 5,
              color: c.kbdTextColor,
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* ── Results ── */}
        <div
          ref={listRef}
          className="sp-scroll"
          style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}
        >
          {filtered.length === 0 && (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                color: c.sectionLabelColor,
                fontFamily: "inherit",
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {(c.showCategories ? visibleCategories : ["all"]).map((cat) => {
            const catItems = c.showCategories
              ? filtered.filter((i) => i.category === cat)
              : filtered;

            return (
              <section key={cat} style={{ marginBottom: 4 }}>
                {c.showCategories && (
                  <div
                    style={{
                      padding: "6px 18px 4px",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: c.sectionLabelColor,
                      fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                    }}
                  >
                    {cat}
                  </div>
                )}

                {catItems.map((item) => {
                  const globalIndex = filtered.indexOf(item);
                  const isActive = globalIndex === activeIndex;

                  return (
                    <button
                      key={item.id}
                      data-active={isActive}
                      onClick={() => setActiveIndex(globalIndex)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "9px 18px",
                        background: isActive
                          ? c.activeItemBackground
                          : c.itemBackground,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: c.itemBorderRadius,
                        margin: "1px 8px",
                        width: "calc(100% - 16px)",
                        transition: "background 0.1s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            c.itemHoverBackground;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            c.itemBackground;
                      }}
                    >
                      {/* Left side */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 7,
                            background: isActive
                              ? "rgba(255,255,255,0.15)"
                              : c.inputBackground,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background 0.1s",
                          }}
                        >
                          {getIconSvg(
                            item.icon,
                            isActive ? c.activeItemIconColor : c.itemIconColor,
                            15,
                          )}
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div
                            style={{
                              fontSize: c.fontSize,
                              fontWeight: 500,
                              color: isActive
                                ? c.activeItemTextColor
                                : c.itemTextColor,
                              lineHeight: 1.3,
                              transition: "color 0.1s",
                            }}
                          >
                            {item.label}
                          </div>
                          {item.sublabel && (
                            <div
                              style={{
                                fontSize: c.fontSize - 1,
                                color: isActive
                                  ? "rgba(255,255,255,0.6)"
                                  : c.itemSubtextColor,
                                marginTop: 1,
                                lineHeight: 1.2,
                                transition: "color 0.1s",
                              }}
                            >
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Keyboard shortcut */}
                      {item.kbd && (
                        <kbd
                          style={{
                            fontSize: 10,
                            padding: "2px 7px",
                            background: isActive
                              ? c.kbdActiveBackground
                              : c.kbdBackground,
                            border: `1px solid ${isActive ? c.kbdActiveBorderColor : c.kbdBorderColor}`,
                            borderRadius: 5,
                            color: isActive
                              ? c.kbdActiveTextColor
                              : c.kbdTextColor,
                            fontFamily:
                              "var(--font-mono, 'DM Mono', monospace)",
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            lineHeight: 1.6,
                            transition: "all 0.1s",
                          }}
                        >
                          {item.kbd}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>

        {/* ── Footer ── */}
        {c.showFooter && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              height: 38,
              background: c.footerBackground,
              borderTop: `1px solid ${c.footerBorderColor}`,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {[
                { keys: ["↑", "↓"], label: "navigate" },
                { keys: ["↵"], label: "select" },
                { keys: ["ESC"], label: "close" },
              ].map(({ keys, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  {keys.map((k) => (
                    <kbd
                      key={k}
                      style={{
                        fontSize: 9,
                        padding: "1px 5px",
                        background: c.footerKbdBackground,
                        border: `1px solid ${c.footerKbdBorderColor}`,
                        borderRadius: 4,
                        color: c.footerTextColor,
                        fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                        lineHeight: 1.7,
                      }}
                    >
                      {k}
                    </kbd>
                  ))}
                  <span
                    style={{
                      fontSize: 10,
                      color: c.footerTextColor,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <span
              style={{
                fontSize: 10,
                color: c.footerTextColor,
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                opacity: 0.5,
                letterSpacing: "0.04em",
              }}
            >
              Spotlight Search
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
