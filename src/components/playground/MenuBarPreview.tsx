"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { MenuBarConfig } from "@/lib/menuBarConfig";

// ─── Menu data ────────────────────────────────────────────────────────────────

interface OptionItem {
  label: string;
  icon: string;
  shortcut?: string;
  danger?: boolean;
}

interface OptionGroup {
  items: OptionItem[];
}

interface MenuItem {
  label: string;
  icon: string;
  groups: OptionGroup[];
}

const MENU_DATA: MenuItem[] = [
  {
    label: "File",
    icon: "📄",
    groups: [
      {
        items: [
          { label: "New File", icon: "✦", shortcut: "⌘N" },
          { label: "New Window", icon: "⊞", shortcut: "⌘⇧N" },
          { label: "Open…", icon: "⌂", shortcut: "⌘O" },
        ],
      },
      {
        items: [
          { label: "Save", icon: "↓", shortcut: "⌘S" },
          { label: "Save As…", icon: "↓↓", shortcut: "⌘⇧S" },
          { label: "Export", icon: "⤴" },
        ],
      },
      {
        items: [{ label: "Close", icon: "✕", shortcut: "⌘W", danger: true }],
      },
    ],
  },
  {
    label: "Edit",
    icon: "✏️",
    groups: [
      {
        items: [
          { label: "Undo", icon: "↩", shortcut: "⌘Z" },
          { label: "Redo", icon: "↪", shortcut: "⌘⇧Z" },
        ],
      },
      {
        items: [
          { label: "Cut", icon: "✂", shortcut: "⌘X" },
          { label: "Copy", icon: "⎘", shortcut: "⌘C" },
          { label: "Paste", icon: "⧉", shortcut: "⌘V" },
        ],
      },
      {
        items: [{ label: "Find & Replace", icon: "⌕", shortcut: "⌘H" }],
      },
    ],
  },
  {
    label: "View",
    icon: "👁",
    groups: [
      {
        items: [
          { label: "Zoom In", icon: "+", shortcut: "⌘+" },
          { label: "Zoom Out", icon: "−", shortcut: "⌘−" },
          { label: "Reset Zoom", icon: "◎", shortcut: "⌘0" },
        ],
      },
      {
        items: [
          { label: "Toggle Sidebar", icon: "▐", shortcut: "⌘B" },
          { label: "Toggle Terminal", icon: "❯_", shortcut: "⌘`" },
          { label: "Full Screen", icon: "⛶", shortcut: "F11" },
        ],
      },
    ],
  },
  {
    label: "Settings",
    icon: "⚙️",
    groups: [
      {
        items: [
          { label: "Preferences", icon: "⚙", shortcut: "⌘," },
          { label: "Keyboard Shortcuts", icon: "⌨" },
          { label: "Extensions", icon: "⧉" },
        ],
      },
      {
        items: [{ label: "Reset to Default", icon: "↺", danger: true }],
      },
    ],
  },
];

// ─── Popup ────────────────────────────────────────────────────────────────────

function OptionsPopup({
  item,
  config,
  onClose,
  triggerRect,
  variant,
}: {
  item: MenuItem;
  config: MenuBarConfig;
  onClose: () => void;
  triggerRect: DOMRect | null;
  variant: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  const dur = config.animationDuration;

  const animBase: React.CSSProperties = {
    transition: `opacity ${dur}ms ease, transform ${dur}ms cubic-bezier(0.16,1,0.3,1)`,
    transformOrigin: "top left",
  };

  const hidden: Record<string, React.CSSProperties> = {
    fade: { opacity: 0 },
    slide: { opacity: 0, transform: "translateY(-8px)" },
    scale: { opacity: 0, transform: "scale(0.92) translateY(-4px)" },
    none: {},
  };
  const shown: Record<string, React.CSSProperties> = {
    fade: { opacity: 1 },
    slide: { opacity: 1, transform: "translateY(0)" },
    scale: { opacity: 1, transform: "scale(1) translateY(0)" },
    none: {},
  };

  const animStyle = visible
    ? { ...animBase, ...shown[config.popupAnimation] }
    : { ...animBase, ...hidden[config.popupAnimation] };

  const popupStyle: React.CSSProperties = {
    position: "fixed",
    top: triggerRect ? triggerRect.bottom + 6 : 60,
    left: triggerRect ? triggerRect.left : 0,
    zIndex: 9999,
    minWidth: config.popupMinWidth,
    background: config.popupBackground,
    border: `1px solid ${config.popupBorderColor}`,
    borderRadius: config.popupBorderRadius,
    padding: "6px",
    boxShadow: config.popupShadow
      ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
      : "none",
    ...animStyle,
  };

  const allItems = item.groups.flatMap((g, gi) => [
    ...(gi > 0 && config.showDividers ? ["divider"] : []),
    ...g.items,
  ]);

  return (
    <div ref={ref} style={popupStyle}>
      {allItems.map((row, i) => {
        if (row === "divider") {
          return (
            <div
              key={`div-${i}`}
              style={{
                height: 1,
                background: config.dividerColor,
                margin: "4px 0",
              }}
            />
          );
        }
        const opt = row as OptionItem;
        return (
          <OptionRow
            key={opt.label}
            opt={opt}
            config={config}
            onClose={onClose}
          />
        );
      })}
    </div>
  );
}

function OptionRow({
  opt,
  config,
  onClose,
}: {
  opt: OptionItem;
  config: MenuBarConfig;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 8px",
    borderRadius: config.optionBorderRadius,
    cursor: "pointer",
    fontSize: config.optionFontSize,
    background: hovered
      ? config.optionHoverBackground
      : config.optionBackground,
    color: opt.danger
      ? "#f87171"
      : hovered
        ? config.optionHoverTextColor
        : config.optionTextColor,
    transition: "background 120ms ease, color 120ms ease",
    userSelect: "none",
  };

  return (
    <div
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClose}
    >
      {config.showOptionIcons && (
        <span
          style={{
            width: 18,
            textAlign: "center",
            opacity: 0.6,
            fontFamily: "monospace",
            fontSize: 11,
          }}
        >
          {opt.icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{opt.label}</span>
      {config.showOptionShortcuts && opt.shortcut && (
        <span
          style={{
            fontSize: 11,
            opacity: 0.45,
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}
        >
          {opt.shortcut}
        </span>
      )}
    </div>
  );
}

// ─── Variant: Top Nav ─────────────────────────────────────────────────────────

function TopNavMenuBar({ config }: { config: MenuBarConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [triggerRects, setTriggerRects] = useState<(DOMRect | null)[]>(
    MENU_DATA.map(() => null),
  );
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(i: number) {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects((prev) => {
      const next = [...prev];
      next[i] = rect;
      return next;
    });
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  const barStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: config.itemGap,
    background: config.barBackground,
    border: `1px solid ${config.barBorderColor}`,
    borderRadius: config.barBorderRadius,
    padding: `${config.barPaddingY}px ${config.barPaddingX}px`,
    boxShadow: config.showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
    backdropFilter: config.barBlur ? "blur(12px)" : "none",
    WebkitBackdropFilter: config.barBlur ? "blur(12px)" : "none",
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={barStyle}>
        {MENU_DATA.map((item, i) => (
          <MenuTrigger
            key={item.label}
            item={item}
            config={config}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            showIcon={false}
          />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup
          item={MENU_DATA[openIndex]}
          config={config}
          onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]}
          variant="topnav"
        />
      )}
    </div>
  );
}

// ─── Variant: Segmented ───────────────────────────────────────────────────────

function SegmentedMenuBar({ config }: { config: MenuBarConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [triggerRects, setTriggerRects] = useState<(DOMRect | null)[]>(
    MENU_DATA.map(() => null),
  );
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(i: number) {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects((prev) => {
      const next = [...prev];
      next[i] = rect;
      return next;
    });
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  const barStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    background: config.barBackground,
    border: `1px solid ${config.barBorderColor}`,
    borderRadius: 9999,
    padding: `${config.barPaddingY}px ${config.barPaddingX + 4}px`,
    boxShadow: config.showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
    gap: 2,
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={barStyle}>
        {MENU_DATA.map((item, i) => (
          <SegmentTrigger
            key={item.label}
            item={item}
            config={config}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
          />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup
          item={MENU_DATA[openIndex]}
          config={config}
          onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]}
          variant="segmented"
        />
      )}
    </div>
  );
}

// ─── Variant: Command Bar ─────────────────────────────────────────────────────

function CommandMenuBar({ config }: { config: MenuBarConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [triggerRects, setTriggerRects] = useState<(DOMRect | null)[]>(
    MENU_DATA.map(() => null),
  );
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(i: number) {
    const rect = triggerRefs.current[i]?.getBoundingClientRect() ?? null;
    setTriggerRects((prev) => {
      const next = [...prev];
      next[i] = rect;
      return next;
    });
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  const barStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
    background: config.barBackground,
    border: `1px solid ${config.barBorderColor}`,
    borderRadius: config.barBorderRadius + 4,
    padding: `${config.barPaddingY + 4}px ${config.barPaddingX + 2}px`,
    boxShadow: config.showBarShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={barStyle}>
        {MENU_DATA.map((item, i) => (
          <CommandTrigger
            key={item.label}
            item={item}
            config={config}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
          />
        ))}
      </div>
      {openIndex !== null && (
        <OptionsPopup
          item={MENU_DATA[openIndex]}
          config={config}
          onClose={() => setOpenIndex(null)}
          triggerRect={triggerRects[openIndex]}
          variant="commandbar"
        />
      )}
    </div>
  );
}

// ─── Trigger buttons ──────────────────────────────────────────────────────────

import { forwardRef } from "react";

const MenuTrigger = forwardRef<
  HTMLButtonElement,
  {
    item: MenuItem;
    config: MenuBarConfig;
    isOpen: boolean;
    onToggle: () => void;
    showIcon?: boolean;
  }
>(({ item, config, isOpen, onToggle, showIcon = true }, ref) => {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: config.itemBorderRadius,
    fontSize: config.itemFontSize,
    fontFamily: "inherit",
    border: "none",
    cursor: "pointer",
    background: isOpen
      ? config.itemActiveBackground
      : hovered
        ? config.itemHoverBackground
        : config.itemBackground,
    color: isOpen
      ? config.itemActiveTextColor
      : hovered
        ? config.itemHoverTextColor
        : config.itemTextColor,
    transition: "background 120ms ease, color 120ms ease",
    outline: "none",
  };

  return (
    <button
      ref={ref}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      {showIcon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
      <span>{item.label}</span>
      <span
        style={{
          fontSize: 9,
          opacity: isOpen ? 0.7 : 0.4,
          marginLeft: 1,
          transition: "transform 160ms ease, opacity 160ms ease",
          display: "inline-block",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        ▼
      </span>
    </button>
  );
});
MenuTrigger.displayName = "MenuTrigger";

const SegmentTrigger = forwardRef<
  HTMLButtonElement,
  {
    item: MenuItem;
    config: MenuBarConfig;
    isOpen: boolean;
    onToggle: () => void;
  }
>(({ item, config, isOpen, onToggle }, ref) => {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "6px 14px",
    borderRadius: 9999,
    fontSize: config.itemFontSize,
    fontFamily: "inherit",
    border: isOpen
      ? `1px solid ${config.barBorderColor}`
      : "1px solid transparent",
    cursor: "pointer",
    background: isOpen
      ? config.itemActiveBackground
      : hovered
        ? config.itemHoverBackground
        : "transparent",
    color: isOpen
      ? config.itemActiveTextColor
      : hovered
        ? config.itemHoverTextColor
        : config.itemTextColor,
    transition:
      "background 120ms ease, color 120ms ease, border-color 120ms ease",
    outline: "none",
  };

  return (
    <button
      ref={ref}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
});
SegmentTrigger.displayName = "SegmentTrigger";

const CommandTrigger = forwardRef<
  HTMLButtonElement,
  {
    item: MenuItem;
    config: MenuBarConfig;
    isOpen: boolean;
    onToggle: () => void;
  }
>(({ item, config, isOpen, onToggle }, ref) => {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 52,
    padding: "8px 0",
    borderRadius: config.itemBorderRadius,
    fontSize: 10,
    fontFamily: "inherit",
    border: "none",
    cursor: "pointer",
    background: isOpen
      ? config.itemActiveBackground
      : hovered
        ? config.itemHoverBackground
        : "transparent",
    color: isOpen
      ? config.itemActiveTextColor
      : hovered
        ? config.itemHoverTextColor
        : config.itemTextColor,
    transition: "background 120ms ease, color 120ms ease",
    outline: "none",
    letterSpacing: "0.02em",
  };

  return (
    <button
      ref={ref}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
});
CommandTrigger.displayName = "CommandTrigger";

// ─── Main Preview ─────────────────────────────────────────────────────────────

export function MenuBarPreview({ config }: { config: MenuBarConfig }) {
  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 300,
    fontFamily: "'Instrument Sans', sans-serif",
  };

  return (
    <div style={wrapStyle}>
      {config.variant === "topnav" && <TopNavMenuBar config={config} />}
      {config.variant === "segmented" && <SegmentedMenuBar config={config} />}
      {config.variant === "commandbar" && <CommandMenuBar config={config} />}
    </div>
  );
}
