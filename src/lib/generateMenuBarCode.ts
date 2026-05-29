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
