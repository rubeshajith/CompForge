// /lib/generateSidebarCode.ts

import { SidebarConfig } from "./sidebarConfig";

// ─── JSX + CSS ────────────────────────────────────────────────────────────────

export function generateSidebarJSX(config: SidebarConfig): string {
  const c = config;
  return `import { useState, useRef, useCallback, useEffect } from "react";
import "./Sidebar.css";

// Nav data — replace paths/labels as needed
const NAV = [
  {
    section: "Playground",
    items: [
      {
        id: "components", label: "Components", icon: IconComponents,
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

export default function Sidebar({ onNavigate }) {
  const [collapsed, setCollapsed] = useState(${c.defaultCollapsed});
  const [openMenus, setOpenMenus] = useState(new Set(["components"]));
  const [activeItem, setActiveItem] = useState("components");
  const [activeSub, setActiveSub] = useState("calendar");
  const [popout, setPopout] = useState(null);   // { id, top }
  const [tooltip, setTooltip] = useState(null); // { label, top }

  const popoutTimer = useRef(null);
  const containerRef = useRef(null);

  const isParentActive = (item) =>
    item.submenus
      ? item.submenus.some((s) => s.id === activeSub) && activeItem === item.id
      : activeItem === item.id;

  const toggleMenu = (id) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleItemClick = (item) => {
    if (item.submenus) {
      if (!collapsed) toggleMenu(item.id);
    } else {
      // Select on click — works in both expanded AND collapsed mode
      setActiveItem(item.id);
      setActiveSub(null);
      setPopout(null);
      setTooltip(null);
      onNavigate?.(item.id);
    }
  };

  const handleSubClick = (parentId, subId) => {
    setActiveItem(parentId);
    setActiveSub(subId);
    setPopout(null);
    onNavigate?.(subId);
  };

  const showPopout = useCallback((itemId, el) => {
    clearTimeout(popoutTimer.current);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setPopout({ id: itemId, top: rect.top - containerTop });
    setTooltip(null);
  }, []);

  const hidePopout = useCallback(() => {
    popoutTimer.current = setTimeout(() => setPopout(null), 120);
  }, []);

  const cancelHide = useCallback(() => clearTimeout(popoutTimer.current), []);

  const showTooltip = useCallback((label, el) => {
    setTooltip(null);
    setPopout(null);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setTooltip({ label, top: rect.top - containerTop + rect.height / 2 - 14 });
  }, []);

  return (
    <div ref={containerRef} className="sb-wrap">
      <aside className={\`sb\${collapsed ? " sb--collapsed" : ""}\`}>

        {/* Logo */}
        <div className="sb__logo">
          {collapsed ? (
            <svg className="sb__logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
            </svg>
          ) : (
            <svg className="sb__logo-full" width="148" height="36" viewBox="0 0 148 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
              <text x="42" y="23" className="sb__logo-comp">Comp</text>
              <text x="89" y="23" className="sb__logo-forge">Forge</text>
            </svg>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className="sb__toggle"
          onClick={() => { setCollapsed((v) => !v); setPopout(null); setTooltip(null); }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            className="sb__toggle-icon"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M10 12L6 8l4-4"/>
          </svg>
        </button>

        {/* Nav */}
        <nav className="sb__nav">
          {NAV.map((section) => (
            <div key={section.section}>
              <div className="sb__section-label">{section.section}</div>
              {section.items.map((item) => {
                const active = isParentActive(item);
                const subOpen = openMenus.has(item.id);
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <div
                      className={\`sb__item\${active ? " sb__item--active" : ""}\`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={(e) => {
                        if (!collapsed) return;
                        if (item.submenus) showPopout(item.id, e.currentTarget);
                        else showTooltip(item.label, e.currentTarget);
                      }}
                      onMouseLeave={() => {
                        if (!collapsed) return;
                        if (item.submenus) hidePopout();
                        else setTooltip(null);
                      }}
                    >
                      {active && <span className="sb__indicator" />}
                      <span className="sb__item-icon"><Icon /></span>
                      <span className="sb__item-label">{item.label}</span>
                      {item.badge && <span className="sb__badge">{item.badge}</span>}
                      {item.submenus && (
                        <span className={\`sb__chevron\${subOpen ? " sb__chevron--open" : ""}\`}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 6l4 4 4-4"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Inline submenu */}
                    {item.submenus && (
                      <div className={\`sb__submenu\${subOpen ? " sb__submenu--open" : ""}\`}>
                        {item.submenus.map((sub) => (
                          <div
                            key={sub.id}
                            className={\`sb__sub-item\${activeSub === sub.id && activeItem === item.id ? " sb__sub-item--active" : ""}\`}
                            onClick={() => handleSubClick(item.id, sub.id)}
                          >
                            <span className="sb__sub-dot" />
                            {sub.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb__footer">
          <div className="sb__item">
            <span className="sb__item-icon">
              <span className="sb__avatar">CF</span>
            </span>
            <span className="sb__item-label" style={{ fontSize: 12.5 }}>compforge.dev</span>
          </div>
        </div>

        {/* Popout panel (collapsed + submenu hover) */}
        {collapsed && popout && (() => {
          const popItem = NAV.flatMap((s) => s.items).find((i) => i.id === popout.id);
          if (!popItem?.submenus) return null;
          return (
            <div
              className="sb__popout"
              style={{ top: popout.top }}
              onMouseEnter={cancelHide}
              onMouseLeave={() => { hidePopout(); setPopout(null); }}
            >
              <div className="sb__popout-header">{popItem.label}</div>
              {popItem.submenus.map((sub) => (
                <div
                  key={sub.id}
                  className={\`sb__popout-item\${activeSub === sub.id && activeItem === popItem.id ? " sb__popout-item--active" : ""}\`}
                  onClick={() => handleSubClick(popItem.id, sub.id)}
                >
                  <span className="sb__sub-dot" />
                  {sub.label}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Tooltip (collapsed + no-submenu hover) */}
        {collapsed && tooltip && (
          <div className="sb__tooltip" style={{ top: tooltip.top }}>
            {tooltip.label}
          </div>
        )}

      </aside>
    </div>
  );
}

// ─── Icons (inline SVGs) ──────────────────────────────────────────────────────
function IconComponents() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a7 7 0 100 14c1.1 0 2-.9 2-2v-.5c0-.5.4-1 1-1H14a2 2 0 002-2 7 7 0 00-7-8.5z"/>
      <circle cx="6.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="5.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="11.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6l-3 3 3 3M13 6l3 3-3 3M10 3l-2 12"/>
    </svg>
  );
}
function IconDocs() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h7l4 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
      <path d="M11 2v4h4M6 9h6M6 12h4"/>
    </svg>
  );
}
function IconChangelog() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.5l-3.7 1.8.7-4.1L3 6.3l4.2-.7z"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5"/>
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4"/>
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7"/>
      <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-2 2"/>
      <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
`;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

export function generateSidebarCSS(config: SidebarConfig): string {
  const c = config;
  return `/* Sidebar.css — generated by CompForge */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');

.sb-wrap {
  display: flex;
  height: 100vh;
}

/* ── Shell ── */
.sb {
  position: relative;
  width: ${c.sidebarWidth}px;
  min-width: ${c.sidebarWidth}px;
  height: 100%;
  background: ${c.backgroundColor};
  border-right: 1px solid ${c.borderColor};
  border-radius: ${c.borderRadius}px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  transition: width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1);
  box-shadow: ${c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none"};
  z-index: 100;
  font-family: 'Instrument Sans', sans-serif;
  font-size: ${c.fontSize}px;
}
.sb--collapsed {
  width: ${c.collapsedWidth}px;
  min-width: ${c.collapsedWidth}px;
}

/* ── Logo ── */
.sb__logo {
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid ${c.logoAreaBorderColor};
  overflow: hidden;
  flex-shrink: 0;
}
.sb__logo-comp {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 15px;
  fill: #f0f0f5;
  letter-spacing: -0.3px;
}
.sb__logo-forge {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 15px;
  fill: ${c.accentColor};
  letter-spacing: -0.3px;
}

/* ── Collapse toggle ── */
.sb__toggle {
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  background: ${c.collapseButtonBackground};
  border: 1px solid ${c.collapseButtonBorderColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  color: ${c.collapseButtonIconColor};
  padding: 0;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.sb__toggle:hover {
  border-color: ${c.collapseButtonHoverBorderColor};
  color: ${c.collapseButtonHoverIconColor};
}
.sb__toggle-icon {
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
}

/* ── Nav ── */
.sb__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 8px 0;
  scrollbar-width: none;
}
.sb__nav::-webkit-scrollbar { display: none; }

/* ── Section label ── */
.sb__section-label {
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: ${c.sectionLabelColor};
  padding: 12px 18px 5px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  transition: max-height 0.2s, opacity 0.15s, padding 0.2s;
  max-height: 36px;
}
.sb--collapsed .sb__section-label {
  opacity: 0;
  max-height: 0;
  padding: 0;
  pointer-events: none;
}

/* ── Nav item ── */
.sb__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 14px;
  height: 40px;
  cursor: pointer;
  border-radius: ${c.itemBorderRadius}px;
  margin: 1px 8px;
  color: ${c.itemTextColor};
  font-size: ${c.fontSize}px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  user-select: none;
  overflow: visible;
}
.sb__item:hover {
  background: ${c.itemHoverBackground};
  color: ${c.itemHoverTextColor};
}
.sb__item--active {
  background: ${c.itemActiveBackground};
  color: ${c.itemActiveTextColor};
}
.sb__item--active .sb__item-icon {
  color: ${c.itemActiveIconColor};
}

/* ── Active indicator bar ── */
.sb__indicator {
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background: ${c.itemActiveIndicatorColor};
  border-radius: 0 3px 3px 0;
}

/* ── Icon ── */
.sb__item-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sb__item--active .sb__item-icon svg { stroke: ${c.itemActiveIconColor}; }
.sb__item:hover .sb__item-icon svg { stroke: ${c.itemHoverTextColor}; }

/* ── Label ── */
.sb__item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.15s;
}
.sb--collapsed .sb__item-label {
  opacity: 0;
  width: 0;
  pointer-events: none;
  overflow: hidden;
}

/* ── Badge ── */
.sb__badge {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  background: ${c.badgeBackground};
  color: ${c.badgeTextColor};
  border: 1px solid ${c.badgeBorderColor};
  border-radius: 4px;
  padding: 1px 5px;
  flex-shrink: 0;
  transition: opacity 0.15s;
  white-space: nowrap;
}
.sb--collapsed .sb__badge {
  opacity: 0;
  width: 0;
  padding: 0;
  border: none;
  overflow: hidden;
}

/* ── Chevron ── */
.sb__chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${c.chevronColor};
  display: flex;
  transition: transform 0.2s, opacity 0.15s;
}
.sb__chevron--open { transform: rotate(180deg); }
.sb--collapsed .sb__chevron {
  opacity: 0;
  width: 0;
  overflow: hidden;
  pointer-events: none;
}

/* ── Inline submenu ── */
.sb__submenu {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
}
.sb__submenu--open { max-height: 200px; opacity: 1; }
.sb--collapsed .sb__submenu { display: none; }

.sb__sub-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 33px;
  padding: 0 14px 0 44px;
  margin: 1px 8px;
  border-radius: ${Math.max(0, c.itemBorderRadius - 1)}px;
  font-size: ${c.fontSize - 0.5}px;
  color: ${c.submenuTextColor};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  position: relative;
}
.sb__sub-item:hover {
  background: ${c.itemHoverBackground};
  color: ${c.itemHoverTextColor};
}
.sb__sub-item--active {
  color: ${c.submenuActiveTextColor};
  background: ${c.submenuActiveBackground};
}

/* ── Submenu dot ── */
.sb__sub-dot {
  position: absolute;
  left: 30px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
  flex-shrink: 0;
}
.sb__sub-item--active .sb__sub-dot,
.sb__popout-item--active .sb__sub-dot {
  background: ${c.submenuDotColor};
  opacity: 1;
  box-shadow: 0 0 6px ${c.submenuDotColor}88;
}

/* ── Footer ── */
.sb__footer {
  border-top: 1px solid ${c.footerBorderColor};
  padding: 12px 8px;
  flex-shrink: 0;
}
.sb__avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${c.accentDim};
  border: 1px solid ${c.accentColor}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  color: ${c.itemActiveTextColor};
  font-weight: 500;
}

/* ── Popout panel ── */
.sb__popout {
  position: absolute;
  left: ${c.collapsedWidth - 4}px;
  background: ${c.popoutBackground};
  border: 1px solid ${c.popoutBorderColor};
  border-radius: 10px;
  padding: 6px;
  min-width: 160px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 999;
}
.sb__popout-header {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: ${c.popoutHeaderColor};
  text-transform: uppercase;
  padding: 4px 8px 6px;
  border-bottom: 1px solid ${c.logoAreaBorderColor};
  margin-bottom: 4px;
}
.sb__popout-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px 0 18px;
  border-radius: 7px;
  font-size: ${c.fontSize}px;
  color: ${c.itemTextColor};
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
  position: relative;
}
.sb__popout-item .sb__sub-dot { left: 6px; position: absolute; }
.sb__popout-item:hover {
  background: ${c.itemHoverBackground};
  color: ${c.itemHoverTextColor};
}
.sb__popout-item--active { color: ${c.submenuActiveTextColor}; }

/* ── Tooltip ── */
.sb__tooltip {
  position: absolute;
  left: ${c.collapsedWidth - 4}px;
  background: ${c.tooltipBackground};
  border: 1px solid ${c.tooltipBorderColor};
  border-radius: 7px;
  padding: 5px 10px;
  font-size: ${c.fontSize - 0.5}px;
  color: ${c.tooltipTextColor};
  white-space: nowrap;
  pointer-events: none;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
`;
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateSidebarTSX(config: SidebarConfig): string {
  const c = config;
  return `import { useState, useRef, useCallback, useEffect } from "react";
import "./Sidebar.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubMenuItem {
  label: string;
  id: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: () => JSX.Element;
  submenus?: SubMenuItem[];
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface PopoutState {
  id: string;
  top: number;
}

interface TooltipState {
  label: string;
  top: number;
}

interface SidebarProps {
  onNavigate?: (id: string) => void;
}

// Nav data — replace paths/labels as needed
const NAV: NavSection[] = [
  {
    section: "Playground",
    items: [
      {
        id: "components", label: "Components", icon: IconComponents,
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

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(${c.defaultCollapsed});
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(["components"]));
  const [activeItem, setActiveItem] = useState<string>("components");
  const [activeSub, setActiveSub] = useState<string | null>("calendar");
  const [popout, setPopout] = useState<PopoutState | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const popoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isParentActive = (item: NavItem): boolean =>
    item.submenus
      ? item.submenus.some((s) => s.id === activeSub) && activeItem === item.id
      : activeItem === item.id;

  const toggleMenu = (id: string): void => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleItemClick = (item: NavItem): void => {
    if (item.submenus) {
      if (!collapsed) toggleMenu(item.id);
    } else {
      setActiveItem(item.id);
      setActiveSub(null);
      setPopout(null);
      setTooltip(null);
      onNavigate?.(item.id);
    }
  };

  const handleSubClick = (parentId: string, subId: string): void => {
    setActiveItem(parentId);
    setActiveSub(subId);
    setPopout(null);
    onNavigate?.(subId);
  };

  const showPopout = useCallback((itemId: string, el: HTMLElement): void => {
    clearTimeout(popoutTimer.current ?? undefined);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setPopout({ id: itemId, top: rect.top - containerTop });
    setTooltip(null);
  }, []);

  const hidePopout = useCallback((): void => {
    popoutTimer.current = setTimeout(() => setPopout(null), 120);
  }, []);

  const cancelHide = useCallback((): void => clearTimeout(popoutTimer.current ?? undefined), []);

  const showTooltip = useCallback((label: string, el: HTMLElement): void => {
    setTooltip(null);
    setPopout(null);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setTooltip({ label, top: rect.top - containerTop + rect.height / 2 - 14 });
  }, []);

  return (
    <div ref={containerRef} className="sb-wrap">
      <aside className={\`sb\${collapsed ? " sb--collapsed" : ""}\`}>

        {/* Logo */}
        <div className="sb__logo">
          {collapsed ? (
            <svg className="sb__logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
            </svg>
          ) : (
            <svg className="sb__logo-full" width="148" height="36" viewBox="0 0 148 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
              <text x="42" y="23" className="sb__logo-comp">Comp</text>
              <text x="89" y="23" className="sb__logo-forge">Forge</text>
            </svg>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className="sb__toggle"
          onClick={() => { setCollapsed((v) => !v); setPopout(null); setTooltip(null); }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            className="sb__toggle-icon"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M10 12L6 8l4-4"/>
          </svg>
        </button>

        {/* Nav */}
        <nav className="sb__nav">
          {NAV.map((section) => (
            <div key={section.section}>
              <div className="sb__section-label">{section.section}</div>
              {section.items.map((item) => {
                const active = isParentActive(item);
                const subOpen = openMenus.has(item.id);
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <div
                      className={\`sb__item\${active ? " sb__item--active" : ""}\`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={(e) => {
                        if (!collapsed) return;
                        if (item.submenus) showPopout(item.id, e.currentTarget);
                        else showTooltip(item.label, e.currentTarget);
                      }}
                      onMouseLeave={() => {
                        if (!collapsed) return;
                        if (item.submenus) hidePopout();
                        else setTooltip(null);
                      }}
                    >
                      {active && <span className="sb__indicator" />}
                      <span className="sb__item-icon"><Icon /></span>
                      <span className="sb__item-label">{item.label}</span>
                      {item.badge && <span className="sb__badge">{item.badge}</span>}
                      {item.submenus && (
                        <span className={\`sb__chevron\${subOpen ? " sb__chevron--open" : ""}\`}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 6l4 4 4-4"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Inline submenu */}
                    {item.submenus && (
                      <div className={\`sb__submenu\${subOpen ? " sb__submenu--open" : ""}\`}>
                        {item.submenus.map((sub) => (
                          <div
                            key={sub.id}
                            className={\`sb__sub-item\${activeSub === sub.id && activeItem === item.id ? " sb__sub-item--active" : ""}\`}
                            onClick={() => handleSubClick(item.id, sub.id)}
                          >
                            <span className="sb__sub-dot" />
                            {sub.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb__footer">
          <div className="sb__item">
            <span className="sb__item-icon">
              <span className="sb__avatar">CF</span>
            </span>
            <span className="sb__item-label" style={{ fontSize: 12.5 }}>compforge.dev</span>
          </div>
        </div>

        {/* Popout panel (collapsed + submenu hover) */}
        {collapsed && popout && (() => {
          const popItem = NAV.flatMap((s) => s.items).find((i) => i.id === popout.id);
          if (!popItem?.submenus) return null;
          return (
            <div
              className="sb__popout"
              style={{ top: popout.top }}
              onMouseEnter={cancelHide}
              onMouseLeave={() => { hidePopout(); setPopout(null); }}
            >
              <div className="sb__popout-header">{popItem.label}</div>
              {popItem.submenus.map((sub) => (
                <div
                  key={sub.id}
                  className={\`sb__popout-item\${activeSub === sub.id && activeItem === popItem.id ? " sb__popout-item--active" : ""}\`}
                  onClick={() => handleSubClick(popItem.id, sub.id)}
                >
                  <span className="sb__sub-dot" />
                  {sub.label}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Tooltip (collapsed + no-submenu hover) */}
        {collapsed && tooltip && (
          <div className="sb__tooltip" style={{ top: tooltip.top }}>
            {tooltip.label}
          </div>
        )}

      </aside>
    </div>
  );
}

// ─── Icons (inline SVGs) ──────────────────────────────────────────────────────
function IconComponents(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}
function IconPalette(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a7 7 0 100 14c1.1 0 2-.9 2-2v-.5c0-.5.4-1 1-1H14a2 2 0 002-2 7 7 0 00-7-8.5z"/>
      <circle cx="6.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="5.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="11.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconCode(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6l-3 3 3 3M13 6l3 3-3 3M10 3l-2 12"/>
    </svg>
  );
}
function IconDocs(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h7l4 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
      <path d="M11 2v4h4M6 9h6M6 12h4"/>
    </svg>
  );
}
function IconChangelog(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.5l-3.7 1.8.7-4.1L3 6.3l4.2-.7z"/>
    </svg>
  );
}
function IconSettings(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5"/>
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4"/>
    </svg>
  );
}
function IconHelp(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7"/>
      <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-2 2"/>
      <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateSidebarTailwind(config: SidebarConfig): string {
  const c = config;

  // Pre-compute non-color values
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";
  const subItemRadius = Math.max(0, c.itemBorderRadius - 1);

  // Baked font sizes
  const fs = c.fontSize;
  const fsSmall = c.fontSize - 0.5;

  return `import { useState, useRef, useCallback, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubMenuItem {
  label: string;
  id: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: () => JSX.Element;
  submenus?: SubMenuItem[];
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface PopoutState {
  id: string;
  top: number;
}

interface TooltipState {
  label: string;
  top: number;
}

interface SidebarProps {
  onNavigate?: (id: string) => void;
}

// Nav data — replace paths/labels as needed
const NAV: NavSection[] = [
  {
    section: "Playground",
    items: [
      {
        id: "components", label: "Components", icon: IconComponents,
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

// Baked-in CSS variable tokens — update these to reskin the Sidebar
const sbVars: CSSProperties = {
  "--sb-bg":                        "${c.backgroundColor}",
  "--sb-border":                    "${c.borderColor}",
  "--sb-radius":                    "${c.borderRadius}px",
  "--sb-accent":                    "${c.accentColor}",
  "--sb-accent-dim":                "${c.accentDim}",
  "--sb-logo-border":               "${c.logoAreaBorderColor}",
  "--sb-collapse-btn-bg":           "${c.collapseButtonBackground}",
  "--sb-collapse-btn-border":       "${c.collapseButtonBorderColor}",
  "--sb-collapse-btn-icon":         "${c.collapseButtonIconColor}",
  "--sb-collapse-btn-hover-border": "${c.collapseButtonHoverBorderColor}",
  "--sb-collapse-btn-hover-icon":   "${c.collapseButtonHoverIconColor}",
  "--sb-section-label":             "${c.sectionLabelColor}",
  "--sb-item-text":                 "${c.itemTextColor}",
  "--sb-item-hover-bg":             "${c.itemHoverBackground}",
  "--sb-item-hover-text":           "${c.itemHoverTextColor}",
  "--sb-item-active-bg":            "${c.itemActiveBackground}",
  "--sb-item-active-text":          "${c.itemActiveTextColor}",
  "--sb-item-active-icon":          "${c.itemActiveIconColor}",
  "--sb-indicator":                 "${c.itemActiveIndicatorColor}",
  "--sb-item-radius":               "${c.itemBorderRadius}px",
  "--sb-badge-bg":                  "${c.badgeBackground}",
  "--sb-badge-text":                "${c.badgeTextColor}",
  "--sb-badge-border":              "${c.badgeBorderColor}",
  "--sb-chevron":                   "${c.chevronColor}",
  "--sb-sub-text":                  "${c.submenuTextColor}",
  "--sb-sub-active-text":           "${c.submenuActiveTextColor}",
  "--sb-sub-active-bg":             "${c.submenuActiveBackground}",
  "--sb-sub-dot":                   "${c.submenuDotColor}",
  "--sb-sub-radius":                "${subItemRadius}px",
  "--sb-footer-border":             "${c.footerBorderColor}",
  "--sb-popout-bg":                 "${c.popoutBackground}",
  "--sb-popout-border":             "${c.popoutBorderColor}",
  "--sb-popout-header":             "${c.popoutHeaderColor}",
  "--sb-tooltip-bg":                "${c.tooltipBackground}",
  "--sb-tooltip-border":            "${c.tooltipBorderColor}",
  "--sb-tooltip-text":              "${c.tooltipTextColor}",
  "--sb-width":                     "${c.sidebarWidth}px",
  "--sb-collapsed-width":           "${c.collapsedWidth}px",
} as CSSProperties;

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(${c.defaultCollapsed});
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(["components"]));
  const [activeItem, setActiveItem] = useState<string>("components");
  const [activeSub, setActiveSub] = useState<string | null>("calendar");
  const [popout, setPopout] = useState<PopoutState | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const popoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isParentActive = (item: NavItem): boolean =>
    item.submenus
      ? item.submenus.some((s) => s.id === activeSub) && activeItem === item.id
      : activeItem === item.id;

  const toggleMenu = (id: string): void => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleItemClick = (item: NavItem): void => {
    if (item.submenus) {
      if (!collapsed) toggleMenu(item.id);
    } else {
      setActiveItem(item.id);
      setActiveSub(null);
      setPopout(null);
      setTooltip(null);
      onNavigate?.(item.id);
    }
  };

  const handleSubClick = (parentId: string, subId: string): void => {
    setActiveItem(parentId);
    setActiveSub(subId);
    setPopout(null);
    onNavigate?.(subId);
  };

  const showPopout = useCallback((itemId: string, el: HTMLElement): void => {
    clearTimeout(popoutTimer.current ?? undefined);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setPopout({ id: itemId, top: rect.top - containerTop });
    setTooltip(null);
  }, []);

  const hidePopout = useCallback((): void => {
    popoutTimer.current = setTimeout(() => setPopout(null), 120);
  }, []);

  const cancelHide = useCallback((): void => clearTimeout(popoutTimer.current ?? undefined), []);

  const showTooltip = useCallback((label: string, el: HTMLElement): void => {
    setTooltip(null);
    setPopout(null);
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const rect = el.getBoundingClientRect();
    setTooltip({ label, top: rect.top - containerTop + rect.height / 2 - 14 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-screen"
      style={sbVars}
    >
      <aside
        className={\`relative flex flex-col overflow-visible z-[100] h-full
          bg-[var(--sb-bg)] border-r border-[var(--sb-border)] rounded-[var(--sb-radius)]
          font-['Instrument_Sans',sans-serif] text-[${fs}px]
          transition-[width,min-width] duration-[250ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]
          \${collapsed
            ? "w-[var(--sb-collapsed-width)] min-w-[var(--sb-collapsed-width)]"
            : "w-[var(--sb-width)] min-w-[var(--sb-width)]"
          }\`}
        style={{ boxShadow: "${shadow}" }}
      >

        {/* Logo */}
        <div className="h-16 min-h-[64px] flex items-center px-[14px] border-b border-[var(--sb-logo-border)] overflow-hidden shrink-0">
          {collapsed ? (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
            </svg>
          ) : (
            <svg width="148" height="36" viewBox="0 0 148 36" fill="none">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="${c.accentColor}" fillOpacity="0.15" stroke="${c.accentColor}" strokeWidth="1.5"/>
              <rect x="10" y="22" width="16" height="3" rx="1.5" fill="${c.accentColor}"/>
              <path d="M11 22V17C11 15.895 11.895 15 13 15H16" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M25 22V17C25 15.895 24.105 15 23 15H20" stroke="${c.accentColor}" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="18" cy="12" r="2.5" fill="${c.accentColor}"/>
              <circle cx="18" cy="12" r="1.2" fill="#fff"/>
              <text x="42" y="23"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, fill: "#f0f0f5", letterSpacing: "-0.3px" }}>
                Comp
              </text>
              <text x="89" y="23"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, fill: "${c.accentColor}", letterSpacing: "-0.3px" }}>
                Forge
              </text>
            </svg>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className="absolute -right-3 top-5 w-6 h-6 flex items-center justify-center
            rounded-full cursor-pointer z-20 p-0
            bg-[var(--sb-collapse-btn-bg)] border border-[var(--sb-collapse-btn-border)]
            text-[var(--sb-collapse-btn-icon)]
            hover:border-[var(--sb-collapse-btn-hover-border)] hover:text-[var(--sb-collapse-btn-hover-icon)]
            transition-[background,border-color,color] duration-[150ms]"
          onClick={() => { setCollapsed((v) => !v); setPopout(null); setTooltip(null); }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)" }}
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M10 12L6 8l4-4"/>
          </svg>
        </button>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((section) => (
            <div key={section.section}>
              {/* Section label */}
              <div
                className={\`font-['DM_Mono',monospace] font-medium uppercase tracking-[0.12em]
                  text-[var(--sb-section-label)] text-[9.5px] whitespace-nowrap overflow-hidden
                  transition-[max-height,opacity,padding] duration-[200ms]
                  \${collapsed ? "opacity-0 max-h-0 p-0 pointer-events-none" : "max-h-[36px] px-[18px] pt-3 pb-[5px]"}\`}
              >
                {section.section}
              </div>

              {section.items.map((item) => {
                const active = isParentActive(item);
                const subOpen = openMenus.has(item.id);
                const Icon = item.icon;

                return (
                  <div key={item.id}>
                    {/* Nav item */}
                    <div
                      className={\`relative flex items-center gap-[11px] px-[14px] h-10 cursor-pointer
                        mx-2 my-px select-none whitespace-nowrap overflow-visible
                        rounded-[var(--sb-item-radius)] font-medium text-[${fs}px]
                        transition-[background,color] duration-[150ms]
                        \${active
                          ? "bg-[var(--sb-item-active-bg)] text-[var(--sb-item-active-text)]"
                          : "text-[var(--sb-item-text)] hover:bg-[var(--sb-item-hover-bg)] hover:text-[var(--sb-item-hover-text)]"
                        }\`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={(e) => {
                        if (!collapsed) return;
                        if (item.submenus) showPopout(item.id, e.currentTarget);
                        else showTooltip(item.label, e.currentTarget);
                      }}
                      onMouseLeave={() => {
                        if (!collapsed) return;
                        if (item.submenus) hidePopout();
                        else setTooltip(null);
                      }}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[0_3px_3px_0] bg-[var(--sb-indicator)]" />
                      )}

                      {/* Icon */}
                      <span
                        className={\`w-[18px] h-[18px] shrink-0 flex items-center justify-center
                          \${active ? "text-[var(--sb-item-active-icon)] [&_svg]:stroke-[var(--sb-item-active-icon)]"
                                    : "[&:hover_svg]:stroke-[var(--sb-item-hover-text)]"}\`}
                      >
                        <Icon />
                      </span>

                      {/* Label */}
                      <span
                        className={\`flex-1 overflow-hidden text-ellipsis transition-opacity duration-[150ms]
                          \${collapsed ? "opacity-0 w-0 pointer-events-none overflow-hidden" : ""}\`}
                      >
                        {item.label}
                      </span>

                      {/* Badge */}
                      {item.badge && (
                        <span
                          className={\`font-['DM_Mono',monospace] text-[9px] shrink-0 whitespace-nowrap
                            rounded-[4px] px-[5px] py-px
                            bg-[var(--sb-badge-bg)] text-[var(--sb-badge-text)] border border-[var(--sb-badge-border)]
                            transition-opacity duration-[150ms]
                            \${collapsed ? "opacity-0 w-0 p-0 border-0 overflow-hidden" : ""}\`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Chevron */}
                      {item.submenus && (
                        <span
                          className={\`w-4 h-4 shrink-0 flex text-[var(--sb-chevron)]
                            transition-[transform,opacity] duration-[200ms]
                            \${subOpen ? "rotate-180" : ""}
                            \${collapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : ""}\`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 6l4 4 4-4"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Inline submenu */}
                    {item.submenus && (
                      <div
                        className={\`overflow-hidden transition-[max-height,opacity] duration-[250ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]
                          \${collapsed ? "hidden" : subOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}\`}
                      >
                        {item.submenus.map((sub) => {
                          const subActive = activeSub === sub.id && activeItem === item.id;
                          return (
                            <div
                              key={sub.id}
                              className={\`relative flex items-center gap-3 h-[33px] pl-[44px] pr-[14px]
                                mx-2 my-px cursor-pointer text-[${fsSmall}px]
                                rounded-[var(--sb-sub-radius)]
                                transition-[background,color] duration-[120ms]
                                \${subActive
                                  ? "text-[var(--sb-sub-active-text)] bg-[var(--sb-sub-active-bg)]"
                                  : "text-[var(--sb-sub-text)] hover:bg-[var(--sb-item-hover-bg)] hover:text-[var(--sb-item-hover-text)]"
                                }\`}
                              onClick={() => handleSubClick(item.id, sub.id)}
                            >
                              <span
                                className={\`absolute left-[30px] w-[5px] h-[5px] rounded-full shrink-0
                                  \${subActive
                                    ? "bg-[var(--sb-sub-dot)] opacity-100 [box-shadow:0_0_6px_var(--sb-sub-dot)]"
                                    : "bg-current opacity-40"
                                  }\`}
                              />
                              {sub.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--sb-footer-border)] p-3 shrink-0">
          <div className="relative flex items-center gap-[11px] px-[14px] h-10 cursor-pointer mx-2 my-px text-[var(--sb-item-text)] text-[${fs}px] font-medium whitespace-nowrap">
            <span className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
              <span
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center
                  font-['DM_Mono',monospace] text-[8px] font-medium
                  bg-[var(--sb-accent-dim)] border border-[var(--sb-accent)]/[.27]
                  text-[var(--sb-item-active-text)]"
              >
                CF
              </span>
            </span>
            <span
              className={\`flex-1 overflow-hidden text-ellipsis transition-opacity duration-[150ms] text-[12.5px]
                \${collapsed ? "opacity-0 w-0 pointer-events-none" : ""}\`}
            >
              compforge.dev
            </span>
          </div>
        </div>

        {/* Popout panel (collapsed + submenu hover) */}
        {collapsed && popout && (() => {
          const popItem = NAV.flatMap((s) => s.items).find((i) => i.id === popout.id);
          if (!popItem?.submenus) return null;
          return (
            <div
              className="absolute left-[var(--sb-collapsed-width)] bg-[var(--sb-popout-bg)] border border-[var(--sb-popout-border)]
                rounded-[10px] p-[6px] min-w-[160px] z-[999]"
              style={{ top: popout.top, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
              onMouseEnter={cancelHide}
              onMouseLeave={() => { hidePopout(); setPopout(null); }}
            >
              <div
                className="font-['DM_Mono',monospace] text-[9px] tracking-[0.1em] uppercase
                  text-[var(--sb-popout-header)] px-2 pt-1 pb-[6px]
                  border-b border-[var(--sb-logo-border)] mb-1"
              >
                {popItem.label}
              </div>
              {popItem.submenus.map((sub) => {
                const subActive = activeSub === sub.id && activeItem === popItem.id;
                return (
                  <div
                    key={sub.id}
                    className={\`relative flex items-center gap-2 h-8 pl-[18px] pr-[10px]
                      rounded-[7px] text-[${fs}px] whitespace-nowrap cursor-pointer
                      transition-[background,color] duration-[100ms]
                      \${subActive
                        ? "text-[var(--sb-sub-active-text)]"
                        : "text-[var(--sb-item-text)] hover:bg-[var(--sb-item-hover-bg)] hover:text-[var(--sb-item-hover-text)]"
                      }\`}
                    onClick={() => handleSubClick(popItem.id, sub.id)}
                  >
                    <span
                      className={\`absolute left-[6px] w-[5px] h-[5px] rounded-full shrink-0
                        \${subActive
                          ? "bg-[var(--sb-sub-dot)] opacity-100 [box-shadow:0_0_6px_var(--sb-sub-dot)]"
                          : "bg-current opacity-40"
                        }\`}
                    />
                    {sub.label}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Tooltip (collapsed + no-submenu hover) */}
        {collapsed && tooltip && (
          <div
            className="absolute left-[var(--sb-collapsed-width)] pointer-events-none z-[999]
              bg-[var(--sb-tooltip-bg)] border border-[var(--sb-tooltip-border)]
              rounded-[7px] px-[10px] py-[5px] text-[${fsSmall}px] text-[var(--sb-tooltip-text)] whitespace-nowrap"
            style={{ top: tooltip.top, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
          >
            {tooltip.label}
          </div>
        )}

      </aside>
    </div>
  );
}

// ─── Icons (inline SVGs) ──────────────────────────────────────────────────────
function IconComponents(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}
function IconPalette(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a7 7 0 100 14c1.1 0 2-.9 2-2v-.5c0-.5.4-1 1-1H14a2 2 0 002-2 7 7 0 00-7-8.5z"/>
      <circle cx="6.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="5.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="11.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconCode(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6l-3 3 3 3M13 6l3 3-3 3M10 3l-2 12"/>
    </svg>
  );
}
function IconDocs(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h7l4 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
      <path d="M11 2v4h4M6 9h6M6 12h4"/>
    </svg>
  );
}
function IconChangelog(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.5l-3.7 1.8.7-4.1L3 6.3l4.2-.7z"/>
    </svg>
  );
}
function IconSettings(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5"/>
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4"/>
    </svg>
  );
}
function IconHelp(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7"/>
      <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-2 2"/>
      <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
`;
}
