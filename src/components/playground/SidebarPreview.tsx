"use client";

// /components/playground/SidebarPreview.tsx
// Self-contained sidebar preview — all styles inline, driven by SidebarConfig.
// No external CSS. Includes collapsed/expanded toggle, submenu accordion,
// popout panels (collapsed + submenu), and tooltips (collapsed + no-submenu).

import React, { useState, useRef, useCallback, useEffect } from "react";
import { SidebarConfig } from "@/lib/sidebarConfig";

// ─── Nav data ─────────────────────────────────────────────────────────────────

interface SubMenuItem {
  label: string;
  id: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; color?: string }>;
  badge?: string;
  submenus?: SubMenuItem[];
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const IconComponents = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="6" height="6" rx="1.5" />
    <rect x="10" y="2" width="6" height="6" rx="1.5" />
    <rect x="2" y="10" width="6" height="6" rx="1.5" />
    <rect x="10" y="10" width="6" height="6" rx="1.5" />
  </svg>
);

const IconPalette = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 2a7 7 0 100 14c1.1 0 2-.9 2-2v-.5c0-.5.4-1 1-1H14a2 2 0 002-2 7 7 0 00-7-8.5z" />
    <circle cx="6.5" cy="7.5" r="1" fill={color} stroke="none" />
    <circle cx="9" cy="5.5" r="1" fill={color} stroke="none" />
    <circle cx="11.5" cy="7.5" r="1" fill={color} stroke="none" />
  </svg>
);

const IconCode = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 6l-3 3 3 3M13 6l3 3-3 3M10 3l-2 12" />
  </svg>
);

const IconDocs = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 2h7l4 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
    <path d="M11 2v4h4M6 9h6M6 12h4" />
  </svg>
);

const IconChangelog = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.5l-3.7 1.8.7-4.1L3 6.3l4.2-.7z" />
  </svg>
);

const IconSettings = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="9" r="2.5" />
    <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" />
  </svg>
);

const IconHelp = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="9" r="7" />
    <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-2 2" />
    <circle cx="9" cy="13" r="0.8" fill={color} stroke="none" />
  </svg>
);

const IconChevronLeft = ({
  size = 14,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 12L6 8l4-4" />
  </svg>
);

const IconChevronDown = ({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  {
    section: "Playground",
    items: [
      {
        id: "components",
        label: "Components",
        icon: IconComponents,
        submenus: [
          { label: "Calendar", id: "calendar" },
          { label: "Dropdown", id: "dropdown" },
          { label: "Multiselect", id: "multiselect" },
          { label: "Week Strip", id: "weekstrip" },
        ],
      },
      { id: "theme", label: "Theme Builder", icon: IconPalette, badge: "NEW" },
      { id: "codegen", label: "Code Export", icon: IconCode },
    ],
  },
  {
    section: "Resources",
    items: [
      { id: "docs", label: "Documentation", icon: IconDocs },
      { id: "changelog", label: "Changelog", icon: IconChangelog },
    ],
  },
  {
    section: "Account",
    items: [
      { id: "settings", label: "Settings", icon: IconSettings },
      { id: "help", label: "Help", icon: IconHelp },
    ],
  },
];

// ─── CompForge Logo ───────────────────────────────────────────────────────────

function CompForgeLogo({
  collapsed,
  accentColor,
}: {
  collapsed: boolean;
  accentColor: string;
}) {
  if (collapsed) {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
          fill={accentColor}
          fillOpacity="0.15"
          stroke={accentColor}
          strokeWidth="1.5"
        />
        <rect x="10" y="22" width="16" height="3" rx="1.5" fill={accentColor} />
        <path
          d="M11 22V17C11 15.895 11.895 15 13 15H16"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M25 22V17C25 15.895 24.105 15 23 15H20"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <circle cx="18" cy="12" r="2.5" fill={accentColor} />
        <circle cx="18" cy="12" r="1.2" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <svg width="148" height="36" viewBox="0 0 148 36" fill="none">
      <path
        d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
        fill={accentColor}
        fillOpacity="0.15"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <rect x="10" y="22" width="16" height="3" rx="1.5" fill={accentColor} />
      <path
        d="M11 22V17C11 15.895 11.895 15 13 15H16"
        stroke={accentColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M25 22V17C25 15.895 24.105 15 23 15H20"
        stroke={accentColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <circle cx="18" cy="12" r="2.5" fill={accentColor} />
      <circle cx="18" cy="12" r="1.2" fill="#ffffff" />
      <text
        x="42"
        y="23"
        fontFamily="'Syne', sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="var(--text-primary, #f0f0f5)"
        letterSpacing="-0.3"
      >
        Comp
      </text>
      <text
        x="89"
        y="23"
        fontFamily="'Syne', sans-serif"
        fontWeight="700"
        fontSize="15"
        fill={accentColor}
        letterSpacing="-0.3"
      >
        Forge
      </text>
    </svg>
  );
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

interface SidebarPreviewProps {
  config: SidebarConfig;
}

export function SidebarPreview({ config }: SidebarPreviewProps) {
  const [collapsed, setCollapsed] = useState(config.defaultCollapsed);
  const [openMenus, setOpenMenus] = useState<Set<string>>(
    new Set(["components"]),
  );
  const [activeItem, setActiveItem] = useState<string>("components");
  const [activeSub, setActiveSub] = useState<string | null>("calendar");
  const [popout, setPopout] = useState<{ id: string; top: number } | null>(
    null,
  );
  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(
    null,
  );

  const popoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync collapsed when config.defaultCollapsed changes
  useEffect(() => {
    setCollapsed(config.defaultCollapsed);
  }, [config.defaultCollapsed]);

  const c = config; // shorthand

  const isActive = (itemId: string) =>
    activeItem === itemId ||
    NAV.flatMap((s) => s.items)
      .find((i) => i.id === itemId)
      ?.submenus?.some((s) => s.id === activeSub && activeItem === itemId) !==
      undefined;

  const isParentOfActiveSub = (item: NavItem) =>
    item.submenus
      ? item.submenus.some((s) => s.id === activeSub) && activeItem === item.id
      : false;

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleItemClick = (item: NavItem) => {
    if (item.submenus) {
      if (!collapsed) toggleMenu(item.id);
    } else {
      // FIX: always select on click, even in collapsed mode
      setActiveItem(item.id);
      setActiveSub(null);
      setPopout(null);
      setTooltip(null);
    }
  };

  const handleSubClick = (parentId: string, subId: string) => {
    setActiveItem(parentId);
    setActiveSub(subId);
    setPopout(null);
  };

  const showPopout = useCallback((itemId: string, el: HTMLElement) => {
    if (popoutTimerRef.current) clearTimeout(popoutTimerRef.current);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setPopout({ id: itemId, top: rect.top - containerTop });
    setTooltip(null);
  }, []);

  const scheduleHidePopout = useCallback(() => {
    popoutTimerRef.current = setTimeout(() => setPopout(null), 120);
  }, []);

  const cancelHidePopout = useCallback(() => {
    if (popoutTimerRef.current) clearTimeout(popoutTimerRef.current);
  }, []);

  const showTooltip = useCallback((label: string, el: HTMLElement) => {
    setTooltip(null);
    setPopout(null);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setTooltip({ label, top: rect.top - containerTop + rect.height / 2 - 14 });
  }, []);

  // ─── Style helpers ──────────────────────────────────────────────────────────

  const sidebarStyle: React.CSSProperties = {
    position: "relative",
    width: collapsed ? c.collapsedWidth : c.sidebarWidth,
    minWidth: collapsed ? c.collapsedWidth : c.sidebarWidth,
    height: "100%",
    background: c.backgroundColor,
    borderRight: `1px solid ${c.borderColor}`,
    borderRadius: c.borderRadius,
    display: "flex",
    flexDirection: "column",
    overflow: "visible",
    transition:
      "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)",
    boxShadow: c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none",
    flexShrink: 0,
    zIndex: 10,
    fontFamily: "'Instrument Sans', 'Inter', sans-serif",
    fontSize: c.fontSize,
  };

  const itemStyleBase = (
    isItemActive: boolean,
    isHovered: boolean,
  ): React.CSSProperties => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "0 14px",
    height: 40,
    cursor: "pointer",
    borderRadius: c.itemBorderRadius,
    margin: "1px 8px",
    color: isItemActive
      ? c.itemActiveTextColor
      : isHovered
        ? c.itemHoverTextColor
        : c.itemTextColor,
    background: isItemActive
      ? c.itemActiveBackground
      : isHovered
        ? c.itemHoverBackground
        : "transparent",
    fontSize: c.fontSize,
    fontWeight: 500,
    whiteSpace: "nowrap",
    transition: "background 0.15s, color 0.15s",
    userSelect: "none",
    overflow: "visible",
  });

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        height: 560,
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        background: c.backgroundColor === "#ffffff" ? "#f0f0f6" : "#0c0c0f",
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${c.borderColor}`,
        position: "relative",
      }}
    >
      {/* ── Sidebar ── */}
      <div style={sidebarStyle}>
        {/* Logo */}
        <div
          style={{
            height: 64,
            minHeight: 64,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            borderBottom: `1px solid ${c.logoAreaBorderColor}`,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <CompForgeLogo collapsed={collapsed} accentColor={c.accentColor} />
        </div>

        {/* Collapse button */}
        <CollapseButton
          collapsed={collapsed}
          config={c}
          onClick={() => {
            setCollapsed((v) => !v);
            setPopout(null);
            setTooltip(null);
          }}
        />

        {/* Nav */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "visible",
            padding: "8px 0",
            scrollbarWidth: "none",
          }}
        >
          {NAV.map((section) => (
            <div key={section.section}>
              {/* Section label */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9.5,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: c.sectionLabelColor,
                  padding: collapsed ? "0" : "12px 18px 5px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxHeight: collapsed ? 0 : 36,
                  opacity: collapsed ? 0 : 1,
                  transition: "max-height 0.2s, opacity 0.15s, padding 0.2s",
                  pointerEvents: "none",
                }}
              >
                {section.section}
              </div>

              {section.items.map((item) => {
                const itemActive =
                  isParentOfActiveSub(item) ||
                  (!item.submenus && activeItem === item.id);
                const submenuOpen = openMenus.has(item.id);
                const IconComp = item.icon;

                return (
                  <div key={item.id}>
                    <HoverableItem
                      onHover={(el) => {
                        if (!collapsed) return;
                        if (item.submenus) showPopout(item.id, el);
                        else showTooltip(item.label, el);
                      }}
                      onLeave={() => {
                        if (!collapsed) return;
                        if (item.submenus) scheduleHidePopout();
                        else setTooltip(null);
                      }}
                      render={(hovered) => (
                        <div
                          style={{
                            ...itemStyleBase(itemActive, hovered),
                            ...(itemActive
                              ? {
                                  // active indicator bar
                                }
                              : {}),
                          }}
                          onClick={() => handleItemClick(item)}
                        >
                          {/* Active indicator bar */}
                          {itemActive && (
                            <div
                              style={{
                                position: "absolute",
                                left: -8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 3,
                                height: 18,
                                background: c.itemActiveIndicatorColor,
                                borderRadius: "0 3px 3px 0",
                              }}
                            />
                          )}

                          {/* Icon */}
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <IconComp
                              color={
                                itemActive
                                  ? c.itemActiveIconColor
                                  : hovered
                                    ? c.itemHoverTextColor
                                    : c.itemIconColor
                              }
                            />
                          </span>

                          {/* Label */}
                          <span
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              opacity: collapsed ? 0 : 1,
                              width: collapsed ? 0 : "auto",
                              transition: "opacity 0.15s",
                              pointerEvents: collapsed ? "none" : "auto",
                            }}
                          >
                            {item.label}
                          </span>

                          {/* Badge */}
                          {item.badge && (
                            <span
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 9,
                                background: c.badgeBackground,
                                color: c.badgeTextColor,
                                border: `1px solid ${c.badgeBorderColor}`,
                                borderRadius: 4,
                                padding: "1px 5px",
                                flexShrink: 0,
                                opacity: collapsed ? 0 : 1,
                                transition: "opacity 0.15s",
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Chevron */}
                          {item.submenus && (
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                flexShrink: 0,
                                color: c.chevronColor,
                                display: "flex",
                                opacity: collapsed ? 0 : 1,
                                transition: "transform 0.2s, opacity 0.15s",
                                transform: submenuOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                pointerEvents: "none",
                              }}
                            >
                              <IconChevronDown color={c.chevronColor} />
                            </span>
                          )}
                        </div>
                      )}
                    />

                    {/* Inline submenu (expanded mode) */}
                    {item.submenus && !collapsed && (
                      <div
                        style={{
                          overflow: "hidden",
                          maxHeight: submenuOpen
                            ? `${item.submenus.length * 34 + 8}px`
                            : "0px",
                          opacity: submenuOpen ? 1 : 0,
                          transition:
                            "max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                        }}
                      >
                        {item.submenus.map((sub) => {
                          const subActive =
                            activeSub === sub.id && activeItem === item.id;
                          return (
                            <HoverableItem
                              key={sub.id}
                              render={(hovered) => (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: 33,
                                    padding: "0 14px 0 44px",
                                    margin: "1px 8px",
                                    borderRadius: c.itemBorderRadius - 1,
                                    fontSize: c.fontSize - 0.5,
                                    color: subActive
                                      ? c.submenuActiveTextColor
                                      : hovered
                                        ? c.itemHoverTextColor
                                        : c.submenuTextColor,
                                    background: subActive
                                      ? c.submenuActiveBackground
                                      : hovered
                                        ? c.itemHoverBackground
                                        : "transparent",
                                    cursor: "pointer",
                                    transition: "background 0.12s, color 0.12s",
                                    position: "relative",
                                  }}
                                  onClick={() =>
                                    handleSubClick(item.id, sub.id)
                                  }
                                >
                                  {/* Dot indicator */}
                                  <span
                                    style={{
                                      position: "absolute",
                                      left: 30,
                                      width: 5,
                                      height: 5,
                                      borderRadius: "50%",
                                      background: subActive
                                        ? c.submenuDotColor
                                        : "currentColor",
                                      opacity: subActive ? 1 : 0.5,
                                      boxShadow: subActive
                                        ? `0 0 6px ${c.submenuDotColor}88`
                                        : "none",
                                    }}
                                  />
                                  {sub.label}
                                </div>
                              )}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${c.footerBorderColor}`,
            padding: "12px 8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "0 14px",
              height: 36,
              borderRadius: c.itemBorderRadius,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: c.accentDim,
                border: `1px solid ${c.accentColor}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                color: c.itemActiveTextColor,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              CF
            </div>
            <span
              style={{
                fontSize: 12.5,
                color: c.itemTextColor,
                opacity: collapsed ? 0 : 1,
                transition: "opacity 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              compforge.dev
            </span>
          </div>
        </div>

        {/* ── Popout panel (collapsed + submenu) ── */}
        {collapsed &&
          popout &&
          (() => {
            const popItem = NAV.flatMap((s) => s.items).find(
              (i) => i.id === popout.id,
            );
            if (!popItem?.submenus) return null;
            return (
              <div
                style={{
                  position: "absolute",
                  left: c.collapsedWidth - 4,
                  top: popout.top,
                  background: c.popoutBackground,
                  border: `1px solid ${c.popoutBorderColor}`,
                  borderRadius: 10,
                  padding: 6,
                  minWidth: 160,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  zIndex: 999,
                }}
                onMouseEnter={cancelHidePopout}
                onMouseLeave={() => {
                  scheduleHidePopout();
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: c.popoutHeaderColor,
                    textTransform: "uppercase",
                    padding: "4px 8px 6px",
                    borderBottom: `1px solid ${c.logoAreaBorderColor}`,
                    marginBottom: 4,
                  }}
                >
                  {popItem.label}
                </div>
                {popItem.submenus.map((sub) => {
                  const subActive =
                    activeSub === sub.id && activeItem === popItem.id;
                  return (
                    <HoverableItem
                      key={sub.id}
                      render={(hovered) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            height: 32,
                            padding: "0 10px",
                            borderRadius: 7,
                            fontSize: c.fontSize,
                            color: subActive
                              ? c.submenuActiveTextColor
                              : hovered
                                ? c.itemHoverTextColor
                                : c.itemTextColor,
                            background: hovered
                              ? c.itemHoverBackground
                              : "transparent",
                            cursor: "pointer",
                            transition: "background 0.1s, color 0.1s",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => handleSubClick(popItem.id, sub.id)}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: subActive
                                ? c.submenuDotColor
                                : "currentColor",
                              opacity: subActive ? 1 : 0.4,
                              boxShadow: subActive
                                ? `0 0 5px ${c.submenuDotColor}88`
                                : "none",
                            }}
                          />
                          {sub.label}
                        </div>
                      )}
                    />
                  );
                })}
              </div>
            );
          })()}

        {/* ── Tooltip (collapsed + no submenu) ── */}
        {collapsed && tooltip && (
          <div
            style={{
              position: "absolute",
              left: c.collapsedWidth - 4,
              top: tooltip.top,
              background: c.tooltipBackground,
              border: `1px solid ${c.tooltipBorderColor}`,
              borderRadius: 7,
              padding: "5px 10px",
              fontSize: c.fontSize - 0.5,
              color: c.tooltipTextColor,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {tooltip.label}
          </div>
        )}
      </div>

      {/* ── Main content stage ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: c.backgroundColor === "#ffffff" ? "#eaeaf2" : "#141418",
            borderRadius: 12,
            border: `1px solid ${c.borderColor}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: c.sectionLabelColor,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            currently viewing
          </div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: c.itemHoverTextColor,
            }}
          >
            {activeSub
              ? NAV.flatMap((s) => s.items)
                  .flatMap((i) => i.submenus ?? [])
                  .find((s) => s.id === activeSub)?.label
              : (NAV.flatMap((s) => s.items).find((i) => i.id === activeItem)
                  ?.label ?? "—")}
          </div>
          <div style={{ width: 36, height: 1, background: c.borderColor }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: c.sectionLabelColor,
            }}
          >
            {activeSub && (
              <>
                <span>
                  {
                    NAV.flatMap((s) => s.items).find((i) => i.id === activeItem)
                      ?.label
                  }
                </span>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke={c.sectionLabelColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 2l4 3-4 3" />
                </svg>
              </>
            )}
            <span style={{ color: c.itemActiveTextColor }}>
              {activeSub
                ? NAV.flatMap((s) => s.items)
                    .flatMap((i) => i.submenus ?? [])
                    .find((s) => s.id === activeSub)?.label
                : (NAV.flatMap((s) => s.items).find((i) => i.id === activeItem)
                    ?.label ?? "—")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hoverable helper (avoids useState in map) ────────────────────────────────

function HoverableItem({
  render,
  onHover,
  onLeave,
}: {
  render: (hovered: boolean) => React.ReactNode;
  onHover?: (el: HTMLElement) => void;
  onLeave?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={(e) => {
        setHovered(true);
        onHover?.(e.currentTarget);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onLeave?.();
      }}
      style={{ display: "contents" }}
    >
      {render(hovered)}
    </div>
  );
}

// ─── Collapse button ──────────────────────────────────────────────────────────

function CollapseButton({
  collapsed,
  config: c,
  onClick,
}: {
  collapsed: boolean;
  config: SidebarConfig;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        position: "absolute",
        right: -12,
        top: 20,
        width: 24,
        height: 24,
        background: hovered
          ? c.itemHoverBackground
          : c.collapseButtonBackground,
        border: `1px solid ${hovered ? c.collapseButtonHoverBorderColor : c.collapseButtonBorderColor}`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 20,
        color: hovered
          ? c.collapseButtonHoverIconColor
          : c.collapseButtonIconColor,
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        padding: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          display: "flex",
          transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <IconChevronLeft
          color={
            hovered ? c.collapseButtonHoverIconColor : c.collapseButtonIconColor
          }
        />
      </span>
    </button>
  );
}
