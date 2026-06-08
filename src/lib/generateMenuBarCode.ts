// lib/generateMenuBarCode.ts

import type { MenuBarConfig } from "./menuBarConfig";

export function generateMenuBarJSX(config: MenuBarConfig): string {
  const {
    variant,
    barBackground,
    barBorderColor,
    barBorderRadius,
    barPaddingX,
    barPaddingY,
    showBarShadow,
    barBlur,
    itemTextColor,
    itemBackground,
    itemHoverBackground,
    itemHoverTextColor,
    itemActiveBackground,
    itemActiveTextColor,
    itemBorderRadius,
    itemFontSize,
    itemGap,
    popupBackground,
    popupBorderColor,
    popupBorderRadius,
    popupShadow,
    popupMinWidth,
    optionTextColor,
    optionBackground,
    optionHoverBackground,
    optionHoverTextColor,
    optionBorderRadius,
    optionFontSize,
    showOptionIcons,
    showOptionShortcuts,
    dividerColor,
    showDividers,
    popupAnimation,
    animationDuration,
  } = config;

  const barShadow = showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none";
  const popShadow = popupShadow
    ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
    : "none";
  const blur = barBlur
    ? `backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",`
    : "";

  const isTopnav = variant === "topnav";
  const isSegmented = variant === "segmented";
  const isCommand = variant === "commandbar";

  let triggerInner = "";
  let barExtraStyle = "";

  if (isTopnav) {
    triggerInner = `
      <span>{item.label}</span>
      <span style={{ fontSize: 9, opacity: isOpen ? 0.7 : 0.4, display: "inline-block",
        transition: "transform 160ms ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>`;
    barExtraStyle = `gap: ${itemGap},`;
  } else if (isSegmented) {
    triggerInner = `
      <span style={{ fontSize: 14 }}>{item.icon}</span>
      <span>{item.label}</span>`;
    barExtraStyle = `gap: 2, borderRadius: 9999,`;
  } else if (isCommand) {
    triggerInner = `
      <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
      <span>{item.label}</span>`;
    barExtraStyle = `flexDirection: "column", gap: 2,`;
  }

  const triggerStyle = isCommand
    ? `{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 4, width: 52, padding: "8px 0",
          borderRadius: ${itemBorderRadius}, fontSize: 10, fontFamily: "inherit", border: "none",
          cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "transparent",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease", outline: "none",
        }`
    : isSegmented
      ? `{
          display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 9999,
          fontSize: ${itemFontSize}, fontFamily: "inherit",
          border: isOpen ? "1px solid ${barBorderColor}" : "1px solid transparent",
          cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "transparent",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease, border-color 120ms ease", outline: "none",
        }`
      : `{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
          borderRadius: ${itemBorderRadius}, fontSize: ${itemFontSize},
          fontFamily: "inherit", border: "none", cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "${itemBackground}",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease", outline: "none",
        }`;

  const animHidden: Record<string, string> = {
    fade: `{ opacity: 0 }`,
    slide: `{ opacity: 0, transform: "translateY(-8px)" }`,
    scale: `{ opacity: 0, transform: "scale(0.92) translateY(-4px)" }`,
    none: `{}`,
  };
  const animShown: Record<string, string> = {
    fade: `{ opacity: 1 }`,
    slide: `{ opacity: 1, transform: "translateY(0)" }`,
    scale: `{ opacity: 1, transform: "scale(1) translateY(0)" }`,
    none: `{}`,
  };

  return `import { useState, useRef, useEffect, forwardRef } from "react";
import "./MenuBar.css";

const MENU_DATA = [
  {
    label: "File", icon: "📄",
    groups: [
      { items: [
        { label: "New File", icon: "✦", shortcut: "⌘N" },
        { label: "New Window", icon: "⊞", shortcut: "⌘⇧N" },
        { label: "Open…", icon: "⌂", shortcut: "⌘O" },
      ]},
      { items: [
        { label: "Save", icon: "↓", shortcut: "⌘S" },
        { label: "Save As…", icon: "↓↓", shortcut: "⌘⇧S" },
        { label: "Export", icon: "⤴" },
      ]},
      { items: [
        { label: "Close", icon: "✕", shortcut: "⌘W", danger: true },
      ]},
    ],
  },
  {
    label: "Edit", icon: "✏️",
    groups: [
      { items: [
        { label: "Undo", icon: "↩", shortcut: "⌘Z" },
        { label: "Redo", icon: "↪", shortcut: "⌘⇧Z" },
      ]},
      { items: [
        { label: "Cut", icon: "✂", shortcut: "⌘X" },
        { label: "Copy", icon: "⎘", shortcut: "⌘C" },
        { label: "Paste", icon: "⧉", shortcut: "⌘V" },
      ]},
    ],
  },
  {
    label: "View", icon: "👁",
    groups: [
      { items: [
        { label: "Zoom In", icon: "+", shortcut: "⌘+" },
        { label: "Zoom Out", icon: "−", shortcut: "⌘−" },
        { label: "Reset Zoom", icon: "◎", shortcut: "⌘0" },
      ]},
      { items: [
        { label: "Toggle Sidebar", icon: "▐", shortcut: "⌘B" },
        { label: "Full Screen", icon: "⛶", shortcut: "F11" },
      ]},
    ],
  },
  {
    label: "Settings", icon: "⚙️",
    groups: [
      { items: [
        { label: "Preferences", icon: "⚙", shortcut: "⌘," },
        { label: "Keyboard Shortcuts", icon: "⌨" },
        { label: "Extensions", icon: "⧉" },
      ]},
      { items: [
        { label: "Reset to Default", icon: "↺", danger: true },
      ]},
    ],
  },
];

function OptionsPopup({ item, onClose, triggerRect }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  const animBase = {
    transition: "opacity ${animationDuration}ms ease, transform ${animationDuration}ms cubic-bezier(0.16,1,0.3,1)",
    transformOrigin: "top left",
  };
  const hiddenStyle = ${animHidden[popupAnimation]};
  const shownStyle = ${animShown[popupAnimation]};
  const animStyle = visible ? { ...animBase, ...shownStyle } : { ...animBase, ...hiddenStyle };

  const popupStyle = {
    position: "fixed",
    top: triggerRect ? triggerRect.bottom + 6 : 60,
    left: triggerRect ? triggerRect.left : 0,
    zIndex: 9999,
    minWidth: ${popupMinWidth},
    background: "${popupBackground}",
    border: "1px solid ${popupBorderColor}",
    borderRadius: ${popupBorderRadius},
    padding: "6px",
    boxShadow: "${popShadow}",
    ...animStyle,
  };

  const allRows = item.groups.flatMap((g, gi) => [
    ...(gi > 0 && ${showDividers} ? ["divider"] : []),
    ...g.items,
  ]);

  return (
    <div ref={ref} style={popupStyle}>
      {allRows.map((row, i) => {
        if (row === "divider") {
          return <div key={\`div-\${i}\`} style={{ height: 1, background: "${dividerColor}", margin: "4px 0" }} />;
        }
        return <OptionRow key={row.label} opt={row} onClose={onClose} />;
      })}
    </div>
  );
}

function OptionRow({ opt, onClose }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
    borderRadius: ${optionBorderRadius}, cursor: "pointer", fontSize: ${optionFontSize},
    background: hovered ? "${optionHoverBackground}" : "${optionBackground}",
    color: opt.danger ? "#f87171" : hovered ? "${optionHoverTextColor}" : "${optionTextColor}",
    transition: "background 120ms ease, color 120ms ease", userSelect: "none",
  };
  return (
    <div style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClose}>
      ${showOptionIcons ? `{opt.icon && <span style={{ width: 18, textAlign: "center", opacity: 0.6, fontFamily: "monospace", fontSize: 11 }}>{opt.icon}</span>}` : ""}
      <span style={{ flex: 1 }}>{opt.label}</span>
      ${showOptionShortcuts ? `{opt.shortcut && <span style={{ fontSize: 11, opacity: 0.45, fontFamily: "monospace" }}>{opt.shortcut}</span>}` : ""}
    </div>
  );
}

const MenuTrigger = forwardRef(function MenuTrigger({ item, isOpen, onToggle }, ref) {
  const [hovered, setHovered] = useState(false);
  const style = ${triggerStyle};
  return (
    <button ref={ref} style={style}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >${triggerInner}
    </button>
  );
});

export default function MenuBar({ onMenuSelect }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [triggerRects, setTriggerRects] = useState(MENU_DATA.map(() => null));
  const triggerRefs = useRef([]);

  function toggle(i) {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects(prev => { const n = [...prev]; n[i] = rect; return n; });
    setOpenIndex(prev => prev === i ? null : i);
  }

  const barStyle = {
    display: "inline-flex", alignItems: "center",
    ${barExtraStyle}
    background: "${barBackground}",
    border: "1px solid ${barBorderColor}",
    borderRadius: ${isSegmented ? 9999 : barBorderRadius},
    padding: "${barPaddingY}px ${barPaddingX}px",
    boxShadow: "${barShadow}",
    ${blur}
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={barStyle}>
        {MENU_DATA.map((item, i) => (
          <MenuTrigger key={item.label} item={item} isOpen={openIndex === i}
            onToggle={() => toggle(i)} ref={el => { triggerRefs.current[i] = el; }} />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup item={MENU_DATA[openIndex]} onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]} />
      )}
    </div>
  );
}
`;
}

export function generateMenuBarCSS(config: MenuBarConfig): string {
  return `/* MenuBar.css — generated by CompForge */

/* Wrapper */
.mb-wrap {
  display: inline-flex;
  align-items: center;
  gap: ${config.itemGap}px;
  background: ${config.barBackground};
  border: 1px solid ${config.barBorderColor};
  border-radius: ${config.barBorderRadius}px;
  padding: ${config.barPaddingY}px ${config.barPaddingX}px;
  box-shadow: ${config.showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none"};
  ${config.barBlur ? "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);" : ""}
}

/* Menu item trigger */
.mb__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: ${config.itemBorderRadius}px;
  font-size: ${config.itemFontSize}px;
  font-family: inherit;
  border: none;
  background: ${config.itemBackground};
  color: ${config.itemTextColor};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
  outline: none;
  user-select: none;
}

.mb__item:hover {
  background: ${config.itemHoverBackground};
  color: ${config.itemHoverTextColor};
}

.mb__item--open {
  background: ${config.itemActiveBackground};
  color: ${config.itemActiveTextColor};
}

/* Popup */
.mb__popup {
  position: fixed;
  z-index: 9999;
  min-width: ${config.popupMinWidth}px;
  background: ${config.popupBackground};
  border: 1px solid ${config.popupBorderColor};
  border-radius: ${config.popupBorderRadius}px;
  padding: 6px;
  box-shadow: ${
    config.popupShadow
      ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
      : "none"
  };
  transform-origin: top left;
}

/* Popup enter animation */
@keyframes mb-popup-in {
  from {
    opacity: 0;
    transform: ${
      config.popupAnimation === "scale"
        ? "scale(0.92) translateY(-4px)"
        : config.popupAnimation === "slide"
          ? "translateY(-8px)"
          : config.popupAnimation === "fade"
            ? "none"
            : "none"
    };
  }
  to {
    opacity: 1;
    transform: ${config.popupAnimation !== "fade" ? "scale(1) translateY(0)" : "none"};
  }
}

.mb__popup--enter {
  animation: mb-popup-in ${config.animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Option row */
.mb__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: ${config.optionBorderRadius}px;
  font-size: ${config.optionFontSize}px;
  color: ${config.optionTextColor};
  background: ${config.optionBackground};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
  user-select: none;
}

.mb__option:hover {
  background: ${config.optionHoverBackground};
  color: ${config.optionHoverTextColor};
}

.mb__option--danger {
  color: #f87171;
}

.mb__option__icon {
  width: 18px;
  text-align: center;
  opacity: 0.6;
  font-family: monospace;
  font-size: 11px;
}

.mb__option__label {
  flex: 1;
}

.mb__option__shortcut {
  font-size: 11px;
  opacity: 0.45;
  font-family: monospace;
  letter-spacing: 0.02em;
}

/* Divider */
.mb__divider {
  height: 1px;
  background: ${config.dividerColor};
  margin: 4px 0;
}

/* Segmented variant overrides */
.mb-wrap--segmented {
  border-radius: 9999px;
  gap: 2px;
}

.mb-wrap--segmented .mb__item {
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.mb-wrap--segmented .mb__item--open {
  border-color: ${config.barBorderColor};
}

/* Command bar variant overrides */
.mb-wrap--commandbar {
  flex-direction: column;
  border-radius: ${config.barBorderRadius + 4}px;
}

.mb-wrap--commandbar .mb__item {
  flex-direction: column;
  justify-content: center;
  width: 52px;
  padding: 8px 0;
  gap: 4px;
  font-size: 10px;
  letter-spacing: 0.02em;
}

.mb-wrap--commandbar .mb__item .mb__item-icon {
  font-size: 18px;
  line-height: 1;
}
`;
}

// ─── TSX + CSS ────────────────────────
export function generateMenuBarTSX(config: MenuBarConfig): string {
  const {
    variant,
    barBackground,
    barBorderColor,
    barBorderRadius,
    barPaddingX,
    barPaddingY,
    showBarShadow,
    barBlur,
    itemTextColor,
    itemBackground,
    itemHoverBackground,
    itemHoverTextColor,
    itemActiveBackground,
    itemActiveTextColor,
    itemBorderRadius,
    itemFontSize,
    itemGap,
    popupBackground,
    popupBorderColor,
    popupBorderRadius,
    popupShadow,
    popupMinWidth,
    optionTextColor,
    optionBackground,
    optionHoverBackground,
    optionHoverTextColor,
    optionBorderRadius,
    optionFontSize,
    showOptionIcons,
    showOptionShortcuts,
    dividerColor,
    showDividers,
    popupAnimation,
    animationDuration,
  } = config;

  const barShadow = showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none";
  const popShadow = popupShadow
    ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
    : "none";
  const blur = barBlur
    ? `backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",`
    : "";

  const isTopnav = variant === "topnav";
  const isSegmented = variant === "segmented";
  const isCommand = variant === "commandbar";

  let triggerInner = "";
  let barExtraStyle = "";

  if (isTopnav) {
    triggerInner = `
      <span>{item.label}</span>
      <span style={{ fontSize: 9, opacity: isOpen ? 0.7 : 0.4, display: "inline-block",
        transition: "transform 160ms ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>`;
    barExtraStyle = `gap: ${itemGap},`;
  } else if (isSegmented) {
    triggerInner = `
      <span style={{ fontSize: 14 }}>{item.icon}</span>
      <span>{item.label}</span>`;
    barExtraStyle = `gap: 2, borderRadius: 9999,`;
  } else if (isCommand) {
    triggerInner = `
      <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
      <span>{item.label}</span>`;
    barExtraStyle = `flexDirection: "column", gap: 2,`;
  }

  const triggerStyle = isCommand
    ? `{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 4, width: 52, padding: "8px 0",
          borderRadius: ${itemBorderRadius}, fontSize: 10, fontFamily: "inherit", border: "none",
          cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "transparent",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease", outline: "none",
        }`
    : isSegmented
      ? `{
          display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 9999,
          fontSize: ${itemFontSize}, fontFamily: "inherit",
          border: isOpen ? "1px solid ${barBorderColor}" : "1px solid transparent",
          cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "transparent",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease, border-color 120ms ease", outline: "none",
        }`
      : `{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
          borderRadius: ${itemBorderRadius}, fontSize: ${itemFontSize},
          fontFamily: "inherit", border: "none", cursor: "pointer",
          background: isOpen ? "${itemActiveBackground}" : hovered ? "${itemHoverBackground}" : "${itemBackground}",
          color: isOpen ? "${itemActiveTextColor}" : hovered ? "${itemHoverTextColor}" : "${itemTextColor}",
          transition: "background 120ms ease, color 120ms ease", outline: "none",
        }`;

  const animHidden: Record<string, string> = {
    fade: `{ opacity: 0 }`,
    slide: `{ opacity: 0, transform: "translateY(-8px)" }`,
    scale: `{ opacity: 0, transform: "scale(0.92) translateY(-4px)" }`,
    none: `{}`,
  };
  const animShown: Record<string, string> = {
    fade: `{ opacity: 1 }`,
    slide: `{ opacity: 1, transform: "translateY(0)" }`,
    scale: `{ opacity: 1, transform: "scale(1) translateY(0)" }`,
    none: `{}`,
  };

  return `import { useState, useRef, useEffect, forwardRef } from "react";
import "./MenuBar.css";

interface MenuItem {
  label: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
}

interface MenuGroup {
  items: MenuItem[];
}

interface MenuEntry {
  label: string;
  icon: string;
  groups: MenuGroup[];
}

interface OptionsPopupProps {
  item: MenuEntry;
  onClose: () => void;
  triggerRect: DOMRect | null;
}

interface OptionRowProps {
  opt: MenuItem;
  onClose: () => void;
}

interface MenuTriggerProps {
  item: MenuEntry;
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuBarProps {
  onMenuSelect?: (label: string) => void;
}

const MENU_DATA: MenuEntry[] = [
  {
    label: "File", icon: "📄",
    groups: [
      { items: [
        { label: "New File", icon: "✦", shortcut: "⌘N" },
        { label: "New Window", icon: "⊞", shortcut: "⌘⇧N" },
        { label: "Open…", icon: "⌂", shortcut: "⌘O" },
      ]},
      { items: [
        { label: "Save", icon: "↓", shortcut: "⌘S" },
        { label: "Save As…", icon: "↓↓", shortcut: "⌘⇧S" },
        { label: "Export", icon: "⤴" },
      ]},
      { items: [
        { label: "Close", icon: "✕", shortcut: "⌘W", danger: true },
      ]},
    ],
  },
  {
    label: "Edit", icon: "✏️",
    groups: [
      { items: [
        { label: "Undo", icon: "↩", shortcut: "⌘Z" },
        { label: "Redo", icon: "↪", shortcut: "⌘⇧Z" },
      ]},
      { items: [
        { label: "Cut", icon: "✂", shortcut: "⌘X" },
        { label: "Copy", icon: "⎘", shortcut: "⌘C" },
        { label: "Paste", icon: "⧉", shortcut: "⌘V" },
      ]},
    ],
  },
  {
    label: "View", icon: "👁",
    groups: [
      { items: [
        { label: "Zoom In", icon: "+", shortcut: "⌘+" },
        { label: "Zoom Out", icon: "−", shortcut: "⌘−" },
        { label: "Reset Zoom", icon: "◎", shortcut: "⌘0" },
      ]},
      { items: [
        { label: "Toggle Sidebar", icon: "▐", shortcut: "⌘B" },
        { label: "Full Screen", icon: "⛶", shortcut: "F11" },
      ]},
    ],
  },
  {
    label: "Settings", icon: "⚙️",
    groups: [
      { items: [
        { label: "Preferences", icon: "⚙", shortcut: "⌘," },
        { label: "Keyboard Shortcuts", icon: "⌨" },
        { label: "Extensions", icon: "⧉" },
      ]},
      { items: [
        { label: "Reset to Default", icon: "↺", danger: true },
      ]},
    ],
  },
];

function OptionsPopup({ item, onClose, triggerRect }: OptionsPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  const animBase = {
    transition: "opacity ${animationDuration}ms ease, transform ${animationDuration}ms cubic-bezier(0.16,1,0.3,1)",
    transformOrigin: "top left",
  };
  const hiddenStyle = ${animHidden[popupAnimation]};
  const shownStyle = ${animShown[popupAnimation]};
  const animStyle = visible ? { ...animBase, ...shownStyle } : { ...animBase, ...hiddenStyle };

  const popupStyle = {
    position: "fixed" as const,
    top: triggerRect ? triggerRect.bottom + 6 : 60,
    left: triggerRect ? triggerRect.left : 0,
    zIndex: 9999,
    minWidth: ${popupMinWidth},
    background: "${popupBackground}",
    border: "1px solid ${popupBorderColor}",
    borderRadius: ${popupBorderRadius},
    padding: "6px",
    boxShadow: "${popShadow}",
    ...animStyle,
  };

  const allRows: (MenuItem | "divider")[] = item.groups.flatMap((g, gi) => [
    ...(gi > 0 && ${showDividers} ? ["divider" as const] : []),
    ...g.items,
  ]);

  return (
    <div ref={ref} style={popupStyle}>
      {allRows.map((row, i) => {
        if (row === "divider") {
          return <div key={\`div-\${i}\`} style={{ height: 1, background: "${dividerColor}", margin: "4px 0" }} />;
        }
        return <OptionRow key={row.label} opt={row} onClose={onClose} />;
      })}
    </div>
  );
}

function OptionRow({ opt, onClose }: OptionRowProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const style = {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
    borderRadius: ${optionBorderRadius}, cursor: "pointer", fontSize: ${optionFontSize},
    background: hovered ? "${optionHoverBackground}" : "${optionBackground}",
    color: opt.danger ? "#f87171" : hovered ? "${optionHoverTextColor}" : "${optionTextColor}",
    transition: "background 120ms ease, color 120ms ease", userSelect: "none" as const,
  };
  return (
    <div style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClose}>
      ${showOptionIcons ? `{opt.icon && <span style={{ width: 18, textAlign: "center", opacity: 0.6, fontFamily: "monospace", fontSize: 11 }}>{opt.icon}</span>}` : ""}
      <span style={{ flex: 1 }}>{opt.label}</span>
      ${showOptionShortcuts ? `{opt.shortcut && <span style={{ fontSize: 11, opacity: 0.45, fontFamily: "monospace" }}>{opt.shortcut}</span>}` : ""}
    </div>
  );
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger({ item, isOpen, onToggle }, ref) {
  const [hovered, setHovered] = useState<boolean>(false);
  const style = ${triggerStyle};
  return (
    <button ref={ref} style={style}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >${triggerInner}
    </button>
  );
});

export default function MenuBar({ onMenuSelect }: MenuBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [triggerRects, setTriggerRects] = useState<(DOMRect | null)[]>(MENU_DATA.map(() => null));
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(i: number): void {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects(prev => { const n = [...prev]; n[i] = rect; return n; });
    setOpenIndex(prev => prev === i ? null : i);
  }

  const barStyle = {
    display: "inline-flex", alignItems: "center",
    ${barExtraStyle}
    background: "${barBackground}",
    border: "1px solid ${barBorderColor}",
    borderRadius: ${isSegmented ? 9999 : barBorderRadius},
    padding: "${barPaddingY}px ${barPaddingX}px",
    boxShadow: "${barShadow}",
    ${blur}
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={barStyle}>
        {MENU_DATA.map((item, i) => (
          <MenuTrigger key={item.label} item={item} isOpen={openIndex === i}
            onToggle={() => toggle(i)} ref={el => { triggerRefs.current[i] = el; }} />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup item={MENU_DATA[openIndex]} onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]} />
      )}
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateMenuBarTailwind(config: MenuBarConfig): string {
  const {
    variant,
    barBackground,
    barBorderColor,
    barBorderRadius,
    barPaddingX,
    barPaddingY,
    showBarShadow,
    barBlur,
    itemTextColor,
    itemBackground,
    itemHoverBackground,
    itemHoverTextColor,
    itemActiveBackground,
    itemActiveTextColor,
    itemBorderRadius,
    itemFontSize,
    itemGap,
    popupBackground,
    popupBorderColor,
    popupBorderRadius,
    popupShadow,
    popupMinWidth,
    optionTextColor,
    optionBackground,
    optionHoverBackground,
    optionHoverTextColor,
    optionBorderRadius,
    optionFontSize,
    showOptionIcons,
    showOptionShortcuts,
    dividerColor,
    showDividers,
    popupAnimation,
    animationDuration,
  } = config;

  // Pre-compute complex values
  const barShadow = showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none";
  const popShadow = popupShadow
    ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
    : "none";

  // Bake font sizes as literals
  const itemFs = itemFontSize;
  const optionFs = optionFontSize;

  const isTopnav = variant === "topnav";
  const isSegmented = variant === "segmented";
  const isCommand = variant === "commandbar";

  let triggerInner = "";

  if (isTopnav) {
    triggerInner = `
      <span>{item.label}</span>
      <span className="text-[9px] inline-block transition-transform duration-[160ms] ease-in-out"
        style={{ opacity: isOpen ? 0.7 : 0.4, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>`;
  } else if (isSegmented) {
    triggerInner = `
      <span className="text-[14px]">{item.icon}</span>
      <span>{item.label}</span>`;
  } else if (isCommand) {
    triggerInner = `
      <span className="text-[18px] leading-none">{item.icon}</span>
      <span>{item.label}</span>`;
  }

  const animHidden: Record<string, string> = {
    fade: `{ opacity: 0 }`,
    slide: `{ opacity: 0, transform: "translateY(-8px)" }`,
    scale: `{ opacity: 0, transform: "scale(0.92) translateY(-4px)" }`,
    none: `{}`,
  };
  const animShown: Record<string, string> = {
    fade: `{ opacity: 1 }`,
    slide: `{ opacity: 1, transform: "translateY(0)" }`,
    scale: `{ opacity: 1, transform: "scale(1) translateY(0)" }`,
    none: `{}`,
  };

  // Bar layout classes per variant
  const barLayoutClass = isCommand
    ? "inline-flex flex-col items-center"
    : "inline-flex items-center";
  const barGapClass = isCommand
    ? "gap-0.5"
    : isSegmented
      ? "gap-0.5"
      : `gap-[${itemGap}px]`;
  const barRadiusClass = isSegmented
    ? "rounded-full"
    : `rounded-[var(--mb-bar-radius)]`;

  // Trigger classes per variant
  let triggerBaseClass = "";
  if (isCommand) {
    triggerBaseClass = `flex flex-col items-center justify-center gap-1 w-[52px] py-2 px-0 text-[10px] font-[inherit] border-0 cursor-pointer outline-none transition-[background,color] duration-[120ms] ease-in-out rounded-[var(--mb-item-radius)]`;
  } else if (isSegmented) {
    triggerBaseClass = `flex items-center gap-[7px] py-[6px] px-[14px] rounded-full text-[${itemFs}px] font-[inherit] cursor-pointer outline-none transition-[background,color,border-color] duration-[120ms] ease-in-out border`;
  } else {
    triggerBaseClass = `flex items-center gap-[6px] py-[5px] px-[10px] text-[${itemFs}px] font-[inherit] border-0 cursor-pointer outline-none transition-[background,color] duration-[120ms] ease-in-out rounded-[var(--mb-item-radius)]`;
  }

  return `import { useState, useRef, useEffect, forwardRef, CSSProperties } from "react";

interface MenuItem {
  label: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
}

interface MenuGroup {
  items: MenuItem[];
}

interface MenuEntry {
  label: string;
  icon: string;
  groups: MenuGroup[];
}

interface OptionsPopupProps {
  item: MenuEntry;
  onClose: () => void;
  triggerRect: DOMRect | null;
}

interface OptionRowProps {
  opt: MenuItem;
  onClose: () => void;
}

interface MenuTriggerProps {
  item: MenuEntry;
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuBarProps {
  onMenuSelect?: (label: string) => void;
}

// Baked-in CSS variable tokens — update these to reskin the MenuBar
const mbVars: CSSProperties = {
  "--mb-bar-bg":            "${barBackground}",
  "--mb-bar-border":        "${barBorderColor}",
  "--mb-bar-radius":        "${barBorderRadius}px",
  "--mb-bar-px":            "${barPaddingX}px",
  "--mb-bar-py":            "${barPaddingY}px",
  "--mb-item-text":         "${itemTextColor}",
  "--mb-item-bg":           "${itemBackground}",
  "--mb-item-hover-bg":     "${itemHoverBackground}",
  "--mb-item-hover-text":   "${itemHoverTextColor}",
  "--mb-item-active-bg":    "${itemActiveBackground}",
  "--mb-item-active-text":  "${itemActiveTextColor}",
  "--mb-item-radius":       "${itemBorderRadius}px",
  "--mb-popup-bg":          "${popupBackground}",
  "--mb-popup-border":      "${popupBorderColor}",
  "--mb-popup-radius":      "${popupBorderRadius}px",
  "--mb-popup-min-w":       "${popupMinWidth}px",
  "--mb-option-text":       "${optionTextColor}",
  "--mb-option-bg":         "${optionBackground}",
  "--mb-option-hover-bg":   "${optionHoverBackground}",
  "--mb-option-hover-text": "${optionHoverTextColor}",
  "--mb-option-radius":     "${optionBorderRadius}px",
  "--mb-divider":           "${dividerColor}",
} as CSSProperties;

const MENU_DATA: MenuEntry[] = [
  {
    label: "File", icon: "📄",
    groups: [
      { items: [
        { label: "New File", icon: "✦", shortcut: "⌘N" },
        { label: "New Window", icon: "⊞", shortcut: "⌘⇧N" },
        { label: "Open…", icon: "⌂", shortcut: "⌘O" },
      ]},
      { items: [
        { label: "Save", icon: "↓", shortcut: "⌘S" },
        { label: "Save As…", icon: "↓↓", shortcut: "⌘⇧S" },
        { label: "Export", icon: "⤴" },
      ]},
      { items: [
        { label: "Close", icon: "✕", shortcut: "⌘W", danger: true },
      ]},
    ],
  },
  {
    label: "Edit", icon: "✏️",
    groups: [
      { items: [
        { label: "Undo", icon: "↩", shortcut: "⌘Z" },
        { label: "Redo", icon: "↪", shortcut: "⌘⇧Z" },
      ]},
      { items: [
        { label: "Cut", icon: "✂", shortcut: "⌘X" },
        { label: "Copy", icon: "⎘", shortcut: "⌘C" },
        { label: "Paste", icon: "⧉", shortcut: "⌘V" },
      ]},
    ],
  },
  {
    label: "View", icon: "👁",
    groups: [
      { items: [
        { label: "Zoom In", icon: "+", shortcut: "⌘+" },
        { label: "Zoom Out", icon: "−", shortcut: "⌘−" },
        { label: "Reset Zoom", icon: "◎", shortcut: "⌘0" },
      ]},
      { items: [
        { label: "Toggle Sidebar", icon: "▐", shortcut: "⌘B" },
        { label: "Full Screen", icon: "⛶", shortcut: "F11" },
      ]},
    ],
  },
  {
    label: "Settings", icon: "⚙️",
    groups: [
      { items: [
        { label: "Preferences", icon: "⚙", shortcut: "⌘," },
        { label: "Keyboard Shortcuts", icon: "⌨" },
        { label: "Extensions", icon: "⧉" },
      ]},
      { items: [
        { label: "Reset to Default", icon: "↺", danger: true },
      ]},
    ],
  },
];

function OptionsPopup({ item, onClose, triggerRect }: OptionsPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  const animBase = {
    transition: "opacity ${animationDuration}ms ease, transform ${animationDuration}ms cubic-bezier(0.16,1,0.3,1)",
    transformOrigin: "top left" as const,
  };
  const hiddenStyle = ${animHidden[popupAnimation]};
  const shownStyle = ${animShown[popupAnimation]};
  const animStyle = visible ? { ...animBase, ...shownStyle } : { ...animBase, ...hiddenStyle };

  const popupStyle: CSSProperties = {
    position: "fixed",
    top: triggerRect ? triggerRect.bottom + 6 : 60,
    left: triggerRect ? triggerRect.left : 0,
    zIndex: 9999,
    minWidth: "var(--mb-popup-min-w)",
    background: "var(--mb-popup-bg)",
    border: "1px solid var(--mb-popup-border)",
    borderRadius: "var(--mb-popup-radius)",
    padding: "6px",
    boxShadow: "${popShadow}",
    ...animStyle,
  };

  const allRows: (MenuItem | "divider")[] = item.groups.flatMap((g, gi) => [
    ...(gi > 0 && ${showDividers} ? ["divider" as const] : []),
    ...g.items,
  ]);

  return (
    <div ref={ref} style={popupStyle}>
      {allRows.map((row, i) => {
        if (row === "divider") {
          return (
            <div
              key={\`div-\${i}\`}
              className="h-px my-1 bg-[var(--mb-divider)]"
            />
          );
        }
        return <OptionRow key={row.label} opt={row} onClose={onClose} />;
      })}
    </div>
  );
}

function OptionRow({ opt, onClose }: OptionRowProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  let cls = "flex items-center gap-2 py-[6px] px-2 rounded-[var(--mb-option-radius)] cursor-pointer text-[${optionFs}px] transition-[background,color] duration-[120ms] ease-in-out select-none";
  if (opt.danger) {
    cls += " text-[#f87171]";
    cls += hovered ? " bg-[var(--mb-option-hover-bg)]" : " bg-[var(--mb-option-bg)]";
  } else if (hovered) {
    cls += " bg-[var(--mb-option-hover-bg)] text-[var(--mb-option-hover-text)]";
  } else {
    cls += " bg-[var(--mb-option-bg)] text-[var(--mb-option-text)]";
  }
  return (
    <div
      className={cls}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClose}
    >
      ${
        showOptionIcons
          ? `{opt.icon && (
        <span className="w-[18px] text-center opacity-60 font-mono text-[11px]">{opt.icon}</span>
      )}`
          : ""
      }
      <span className="flex-1">{opt.label}</span>
      ${
        showOptionShortcuts
          ? `{opt.shortcut && (
        <span className="text-[11px] opacity-45 font-mono">{opt.shortcut}</span>
      )}`
          : ""
      }
    </div>
  );
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger({ item, isOpen, onToggle }, ref) {
  const [hovered, setHovered] = useState<boolean>(false);

  let cls = "${triggerBaseClass}";
  ${
    isSegmented
      ? `if (isOpen) {
    cls += " bg-[var(--mb-item-active-bg)] text-[var(--mb-item-active-text)] border-[var(--mb-bar-border)]";
  } else if (hovered) {
    cls += " bg-[var(--mb-item-hover-bg)] text-[var(--mb-item-hover-text)] border-transparent";
  } else {
    cls += " bg-transparent text-[var(--mb-item-text)] border-transparent";
  }`
      : isCommand
        ? `if (isOpen) {
    cls += " bg-[var(--mb-item-active-bg)] text-[var(--mb-item-active-text)]";
  } else if (hovered) {
    cls += " bg-[var(--mb-item-hover-bg)] text-[var(--mb-item-hover-text)]";
  } else {
    cls += " bg-transparent text-[var(--mb-item-text)]";
  }`
        : `if (isOpen) {
    cls += " bg-[var(--mb-item-active-bg)] text-[var(--mb-item-active-text)]";
  } else if (hovered) {
    cls += " bg-[var(--mb-item-hover-bg)] text-[var(--mb-item-hover-text)]";
  } else {
    cls += " bg-[var(--mb-item-bg)] text-[var(--mb-item-text)]";
  }`
  }

  return (
    <button
      ref={ref}
      className={cls}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >${triggerInner}
    </button>
  );
});

export default function MenuBar({ onMenuSelect }: MenuBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [triggerRects, setTriggerRects] = useState<(DOMRect | null)[]>(MENU_DATA.map(() => null));
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(i: number): void {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects(prev => { const n = [...prev]; n[i] = rect; return n; });
    setOpenIndex(prev => prev === i ? null : i);
  }

  const barWrapClass = "${barLayoutClass} ${barGapClass} ${barRadiusClass} border border-[var(--mb-bar-border)] bg-[var(--mb-bar-bg)] px-[var(--mb-bar-px)] py-[var(--mb-bar-py)] font-sans";

  return (
    <div
      className="relative"
      style={mbVars}
    >
      <div
        className={barWrapClass}
        style={{ boxShadow: "${barShadow}"${barBlur ? `, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)"` : ""} }}
      >
        {MENU_DATA.map((item, i) => (
          <MenuTrigger
            key={item.label}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            ref={el => { triggerRefs.current[i] = el; }}
          />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup
          item={MENU_DATA[openIndex]}
          onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]}
        />
      )}
    </div>
  );
}
`;
}
