"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AccordionConfig, AccordionVariant } from "@/lib/accordionConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  children?: AccordionItem[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_ITEMS: AccordionItem[] = [
  {
    id: "1",
    title: "What is CompForge?",
    content:
      "CompForge is a component playground and code generator. Customize UI components visually, preview changes in real time, and copy ready-to-use JSX and CSS with a single click.",
  },
  {
    id: "2",
    title: "How does live preview work?",
    content:
      "Every change you make in the control panel is reflected instantly in the preview panel. The generated code is always in sync with what you see — no compilation step needed.",
  },
  {
    id: "3",
    title: "Can I use the generated code in my project?",
    content:
      "Yes. The generated JSX and CSS are fully self-contained. No extra dependencies are required — just drop them into your project and they work out of the box.",
  },
  {
    id: "4",
    title: "Are dark and light themes supported?",
    content:
      "Absolutely. Every component ships with carefully tuned dark and light presets. Toggle between them using the mode button at the top of the playground.",
  },
];

const NESTED_ITEMS: AccordionItem[] = [
  {
    id: "a",
    title: "Design System",
    content: "Global tokens and guidelines that power every component.",
    children: [
      { id: "a1", title: "Color Palette", content: "Purple accent on dark neutrals; designed for accessibility and aesthetic cohesion." },
      { id: "a2", title: "Typography Scale", content: "Syne for headings, Instrument Sans for body, DM Mono for code." },
    ],
  },
  {
    id: "b",
    title: "Components",
    content: "Pre-built, configurable UI primitives ready to drop into any project.",
    children: [
      { id: "b1", title: "Calendar", content: "Single and range selection, month/year picker, animated open." },
      { id: "b2", title: "Dropdown", content: "Searchable single-select with keyboard navigation." },
      { id: "b3", title: "Accordion", content: "Multiple variants: animated height, nested, bordered cards, icon reveal." },
    ],
  },
  {
    id: "c",
    title: "Code Generation",
    content: "Every customization bakes down into plain JSX + CSS you can copy instantly.",
  },
];

// ─── Animated-height item ────────────────────────────────────────────────────

function AnimatedItem({
  item,
  isOpen,
  onToggle,
  config,
  isLast,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  config: AccordionConfig;
  isLast: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight("auto"), config.animationDuration + 20);
      return () => clearTimeout(t);
    } else {
      if (height === "auto") {
        setHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setHeight(0));
        });
      } else {
        setHeight(0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const chevronStyle: React.CSSProperties = {
    width: config.iconSize,
    height: config.iconSize,
    color: isOpen ? config.accentColor : config.iconColor,
    transition: `transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1), color ${config.animationDuration}ms`,
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        background: config.headerBackground,
        border: `1px solid ${config.borderColor}`,
        borderRadius: config.itemBorderRadius,
        overflow: "hidden",
        boxShadow: config.showShadow ? `0 2px 8px ${config.shadowColor}` : "none",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${config.headerPaddingY}px ${config.headerPaddingX}px`,
          background: config.headerBackground,
          border: "none",
          cursor: "pointer",
          color: config.headerTextColor,
          fontSize: config.headerFontSize,
          fontWeight: config.headerFontWeight,
          fontFamily: "inherit",
          textAlign: "left",
          transition: `background ${config.animationDuration}ms`,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = config.headerHoverBackground)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = config.headerBackground)}
      >
        <span>{item.title}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={chevronStyle}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Animated content */}
      <div
        style={{
          height: height === "auto" ? "auto" : `${height}px`,
          overflow: "hidden",
          transition: height === "auto" ? "none" : `height ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`,
        }}
      >
        <div ref={contentRef}>
          {!isLast && (
            <div style={{ height: 1, background: config.separatorColor, margin: `0 ${config.headerPaddingX}px` }} />
          )}
          <div
            style={{
              padding: `${config.contentPadding}px ${config.headerPaddingX}px`,
              background: config.contentBackground,
              color: config.contentTextColor,
              fontSize: config.contentFontSize,
              lineHeight: 1.7,
            }}
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Nested Accordion ─────────────────────────────────────────────────────────

function NestedAccordion({ config }: { config: AccordionConfig }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["a"]));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: config.itemGap }}>
      {NESTED_ITEMS.map((item) => (
        <div
          key={item.id}
          style={{
            border: `1px solid ${config.borderColor}`,
            borderRadius: config.itemBorderRadius,
            overflow: "hidden",
            boxShadow: config.showShadow ? `0 2px 8px ${config.shadowColor}` : "none",
          }}
        >
          {/* Top-level header */}
          <button
            onClick={() => toggle(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${config.headerPaddingY}px ${config.headerPaddingX}px`,
              background: openIds.has(item.id) ? config.nestedHeaderBackground : config.headerBackground,
              border: "none",
              cursor: "pointer",
              color: config.headerTextColor,
              fontSize: config.headerFontSize,
              fontWeight: 600,
              fontFamily: "inherit",
              textAlign: "left",
              transition: `background ${config.animationDuration}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: openIds.has(item.id) ? config.accentColor : "transparent",
                  transition: `background ${config.animationDuration}ms`,
                }}
              />
              {item.title}
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              style={{
                width: config.iconSize,
                height: config.iconSize,
                color: openIds.has(item.id) ? config.accentColor : config.iconColor,
                transform: openIds.has(item.id) ? "rotate(180deg)" : "rotate(0deg)",
                transition: `transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1), color ${config.animationDuration}ms`,
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Content + nested children */}
          {openIds.has(item.id) && (
            <div style={{ background: config.contentBackground }}>
              {item.content && (
                <div
                  style={{
                    padding: `12px ${config.headerPaddingX}px`,
                    color: config.contentTextColor,
                    fontSize: config.contentFontSize,
                    lineHeight: 1.65,
                    borderBottom: item.children ? `1px solid ${config.separatorColor}` : "none",
                  }}
                >
                  {item.content}
                </div>
              )}
              {item.children && (
                <div style={{ padding: "8px 12px 12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      style={{
                        border: `1px solid ${config.borderColor}`,
                        borderRadius: config.itemBorderRadius - 2,
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => toggle(child.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: `10px 14px`,
                          background: openIds.has(child.id) ? config.nestedHeaderBackground : config.headerBackground,
                          border: "none",
                          cursor: "pointer",
                          color: config.nestedHeaderTextColor,
                          fontSize: config.headerFontSize - 1,
                          fontWeight: 500,
                          fontFamily: "inherit",
                          textAlign: "left",
                        }}
                      >
                        {child.title}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{
                            width: config.iconSize - 2,
                            height: config.iconSize - 2,
                            color: openIds.has(child.id) ? config.nestedAccentColor : config.iconColor,
                            transform: openIds.has(child.id) ? "rotate(90deg)" : "rotate(0deg)",
                            transition: `transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`,
                            flexShrink: 0,
                          }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                      {openIds.has(child.id) && (
                        <div
                          style={{
                            padding: "10px 14px 14px",
                            background: config.contentBackground,
                            color: config.contentTextColor,
                            fontSize: config.contentFontSize - 1,
                            lineHeight: 1.65,
                            borderTop: `1px solid ${config.separatorColor}`,
                          }}
                        >
                          {child.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Bordered Cards variant ───────────────────────────────────────────────────

function BorderedCards({ config, openIds, toggle }: { config: AccordionConfig; openIds: Set<string>; toggle: (id: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: config.itemGap }}>
      {SAMPLE_ITEMS.map((item, idx) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            style={{
              border: `1.5px solid ${isOpen ? config.accentColor : config.borderColor}`,
              borderRadius: config.itemBorderRadius,
              overflow: "hidden",
              transition: `border-color ${config.animationDuration}ms`,
              boxShadow: isOpen && config.showShadow ? `0 0 0 3px ${config.accentColor}18` : config.showShadow ? `0 2px 8px ${config.shadowColor}` : "none",
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${config.headerPaddingY}px ${config.headerPaddingX}px`,
                background: isOpen ? `${config.accentColor}10` : config.headerBackground,
                border: "none",
                cursor: "pointer",
                color: isOpen ? config.accentColor : config.headerTextColor,
                fontSize: config.headerFontSize,
                fontWeight: config.headerFontWeight,
                fontFamily: "inherit",
                textAlign: "left",
                transition: `background ${config.animationDuration}ms, color ${config.animationDuration}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: isOpen ? config.accentColor : config.borderColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: isOpen ? "#fff" : config.iconColor,
                    transition: `background ${config.animationDuration}ms, color ${config.animationDuration}ms`,
                    flexShrink: 0,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
                {item.title}
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                style={{
                  width: config.iconSize,
                  height: config.iconSize,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: `transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`,
                  flexShrink: 0,
                }}
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: `${config.contentPadding}px ${config.headerPaddingX}px`,
                  background: config.contentBackground,
                  color: config.contentTextColor,
                  fontSize: config.contentFontSize,
                  lineHeight: 1.7,
                  borderTop: `1px solid ${config.accentColor}30`,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Icon Reveal variant ──────────────────────────────────────────────────────

const ICONS = ["✦", "◈", "⬡", "◉"];

function IconReveal({ config, openIds, toggle }: { config: AccordionConfig; openIds: Set<string>; toggle: (id: string) => void }) {
  return (
    <div
      style={{
        border: `1px solid ${config.borderColor}`,
        borderRadius: config.itemBorderRadius,
        overflow: "hidden",
        boxShadow: config.showShadow ? `0 4px 24px ${config.shadowColor}` : "none",
      }}
    >
      {SAMPLE_ITEMS.map((item, idx) => {
        const isOpen = openIds.has(item.id);
        const isLast = idx === SAMPLE_ITEMS.length - 1;
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: `${config.headerPaddingY}px ${config.headerPaddingX}px`,
                background: isOpen ? config.headerHoverBackground : config.headerBackground,
                border: "none",
                cursor: "pointer",
                color: config.headerTextColor,
                fontSize: config.headerFontSize,
                fontWeight: config.headerFontWeight,
                fontFamily: "inherit",
                textAlign: "left",
                transition: `background ${config.animationDuration}ms`,
              }}
              onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = config.headerHoverBackground; }}
              onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = config.headerBackground; }}
            >
              {/* Animated icon box */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1.5px solid ${isOpen ? config.accentColor : config.borderColor}`,
                  background: isOpen ? `${config.accentColor}18` : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isOpen ? config.accentColor : config.iconColor,
                  fontSize: 14,
                  transition: `border-color ${config.animationDuration}ms, background ${config.animationDuration}ms, color ${config.animationDuration}ms`,
                  flexShrink: 0,
                }}
              >
                {ICONS[idx]}
              </div>
              <span style={{ flex: 1 }}>{item.title}</span>
              {/* Dash indicator */}
              <div
                style={{
                  width: config.iconSize,
                  height: 2,
                  background: isOpen ? config.accentColor : config.iconColor,
                  borderRadius: 1,
                  position: "relative",
                  transition: `background ${config.animationDuration}ms`,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 2,
                    height: config.iconSize,
                    background: isOpen ? config.accentColor : config.iconColor,
                    borderRadius: 1,
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scaleY(${isOpen ? 0 : 1})`,
                    transition: `transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1), background ${config.animationDuration}ms`,
                  }}
                />
              </div>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: `${config.contentPadding}px ${config.headerPaddingX}px ${config.contentPadding}px ${config.headerPaddingX + 46}px`,
                  background: config.contentBackground,
                  color: config.contentTextColor,
                  fontSize: config.contentFontSize,
                  lineHeight: 1.7,
                }}
              >
                {item.content}
              </div>
            )}
            {!isLast && (
              <div style={{ height: 1, background: config.separatorColor }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Preview Component ───────────────────────────────────────────────────

export function AccordionPreview({ config }: { config: AccordionConfig }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!config.allowMultiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [config.allowMultiple]
  );

  const wrapperStyle: React.CSSProperties = {
    width: config.accordionWidth,
    maxWidth: "100%",
  };

  const renderVariant = (variant: AccordionVariant) => {
    switch (variant) {
      case "animated-height":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: config.itemGap }}>
            {SAMPLE_ITEMS.map((item, idx) => (
              <AnimatedItem
                key={item.id}
                item={item}
                isOpen={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
                config={config}
                isLast={idx === SAMPLE_ITEMS.length - 1}
              />
            ))}
          </div>
        );
      case "nested":
        return <NestedAccordion config={config} />;
      case "bordered-cards":
        return <BorderedCards config={config} openIds={openIds} toggle={toggle} />;
      case "icon-reveal":
        return <IconReveal config={config} openIds={openIds} toggle={toggle} />;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px" }}>
      <div style={wrapperStyle}>{renderVariant(config.variant)}</div>
    </div>
  );
}