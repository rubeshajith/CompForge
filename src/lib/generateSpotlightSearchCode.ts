import type { SpotlightConfig } from "./spotlightSearchConfig";

export function generateSpotlightSearchJSX(config: SpotlightConfig): string {
  const c = config;

  return `import { useState, useRef, useEffect, useCallback } from "react";
import "./SpotlightSearch.css";

const ITEMS = [
  { id: "new-project", icon: "add_circle",  label: "Create New Project",     kbd: "⌘ N",  category: "Quick Actions" },
  { id: "dashboard",   icon: "dashboard",   label: "Go to Dashboard",         kbd: "G D",  category: "Quick Actions" },
  { id: "settings",    icon: "settings",    label: "System Settings",         kbd: "⌘ ,",  category: "Quick Actions" },
  { id: "report",      icon: "description", label: "Q4 Financial Report.pdf", sublabel: "Edited 2h ago",      kbd: "⌘ 1", category: "Recent Items" },
  { id: "brand",       icon: "folder",      label: "Brand Identity Assets",   sublabel: "Modified by Alex",   kbd: "⌘ 2", category: "Recent Items" },
  { id: "design-sys",  icon: "palette",     label: "Design System v3.figma",  sublabel: "Modified yesterday", kbd: "⌘ 3", category: "Recent Items" },
  { id: "marcus",      icon: "person",      label: "Marcus Chen",             sublabel: "Product Director",   kbd: "P M", category: "People" },
  { id: "sarah",       icon: "person",      label: "Sarah Miller",            sublabel: "Lead Architect",     kbd: "P S", category: "People" },
];

const CATEGORIES = ["Quick Actions", "Recent Items", "People"];

// Icon map — replace with your icon library if preferred
function Icon({ name, size = 16 }) {
  const icons = {
    add_circle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    dashboard:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    settings:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
    description:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    folder:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    palette:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/></svg>,
    person:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    search:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  };
  return icons[name] ?? icons.search;
}

export default function SpotlightSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.sublabel ?? "").toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const handleKey = useCallback((e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[activeIndex]) {
      onSelect?.(filtered[activeIndex]);
    }
  }, [filtered, activeIndex, onSelect]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const visibleCats = CATEGORIES.filter((cat) => filtered.some((i) => i.category === cat));

  return (
    <div className="sp" role="dialog" aria-modal="true" aria-label="Spotlight search">
      {/* Input */}
      <div className="sp__input-row">
        <span className="sp__search-icon"><Icon name="search" size={18} /></span>
        <input
          ref={inputRef}
          className="sp__input"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
          onKeyDown={handleKey}
          placeholder="Search actions, files, or people…"
          autoFocus
          aria-label="Search"
        />
        <kbd className="sp__kbd">ESC</kbd>
      </div>

      {/* Results */}
      <div ref={listRef} className="sp__list">
        {filtered.length === 0 && (
          <p className="sp__empty">No results for &ldquo;{query}&rdquo;</p>
        )}

        {visibleCats.map((cat) => (
          <section key={cat}>
            <div className="sp__cat-label">{cat}</div>
            {filtered.filter((i) => i.category === cat).map((item) => {
              const globalIndex = filtered.indexOf(item);
              const isActive = globalIndex === activeIndex;
              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  className={\`sp__item\${isActive ? " sp__item--active" : ""}\`}
                  onClick={() => { setActiveIndex(globalIndex); onSelect?.(item); }}
                >
                  <div className="sp__item-left">
                    <div className="sp__icon-wrap">
                      <Icon name={item.icon} size={15} />
                    </div>
                    <div>
                      <div className="sp__item-label">{item.label}</div>
                      {item.sublabel && <div className="sp__item-sub">{item.sublabel}</div>}
                    </div>
                  </div>
                  {item.kbd && <kbd className="sp__item-kbd">{item.kbd}</kbd>}
                </button>
              );
            })}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="sp__footer">
        <div className="sp__footer-hints">
          {[["↑","↓","navigate"],["↵","select"],["ESC","close"]].map(([...keys]) => {
            const label = keys.pop();
            return (
              <div key={label} className="sp__hint">
                {keys.map((k) => <kbd key={k} className="sp__footer-kbd">{k}</kbd>)}
                <span className="sp__hint-label">{label}</span>
              </div>
            );
          })}
        </div>
        <span className="sp__footer-brand">Spotlight Search</span>
      </footer>
    </div>
  );
}`;
}

export function generateSpotlightSearchCSS(config: SpotlightConfig): string {
  const c = config;

  return `.sp {
  width: ${c.panelWidth}px;
  max-width: 100%;
  background: ${c.panelBackground};
  border: 1px solid ${c.panelBorderColor};
  border-radius: ${c.panelBorderRadius}px;
  ${c.showShadow ? "box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3);" : ""}
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Instrument Sans', sans-serif;
  font-size: ${c.fontSize}px;
  ${c.animateOpen ? "animation: sp-open 0.18s cubic-bezier(0.16,1,0.3,1);" : ""}
}

@keyframes sp-open {
  from { opacity: 0; transform: scale(0.96) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Input Row */
.sp__input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid ${c.panelBorderColor};
  background: ${c.inputBackground};
}

.sp__search-icon {
  color: ${c.inputIconColor};
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sp__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${c.inputTextColor};
  font-size: ${c.fontSize + 1}px;
  font-family: inherit;
  font-weight: 500;
}

.sp__input::placeholder {
  color: ${c.inputPlaceholderColor};
}

/* KBD */
.sp__kbd,
.sp__item-kbd,
.sp__footer-kbd {
  font-family: 'DM Mono', monospace;
  border-radius: 5px;
  line-height: 1.6;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: default;
}

.sp__kbd {
  font-size: 10px;
  padding: 2px 7px;
  background: ${c.kbdBackground};
  border: 1px solid ${c.kbdBorderColor};
  color: ${c.kbdTextColor};
}

.sp__item-kbd {
  font-size: 10px;
  padding: 2px 7px;
  background: ${c.kbdBackground};
  border: 1px solid ${c.kbdBorderColor};
  color: ${c.kbdTextColor};
  transition: all 0.1s;
}

/* List */
.sp__list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: ${c.panelBorderColor} transparent;
}

.sp__list::-webkit-scrollbar { width: 4px; }
.sp__list::-webkit-scrollbar-track { background: transparent; }
.sp__list::-webkit-scrollbar-thumb { background: ${c.panelBorderColor}; border-radius: 99px; }

.sp__empty {
  padding: 32px 20px;
  text-align: center;
  color: ${c.sectionLabelColor};
  margin: 0;
}

/* Category label */
.sp__cat-label {
  padding: 6px 18px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${c.sectionLabelColor};
  font-family: 'DM Mono', monospace;
}

/* Item */
.sp__item {
  width: calc(100% - 16px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 18px;
  background: ${c.itemBackground};
  border: none;
  cursor: pointer;
  border-radius: ${c.itemBorderRadius}px;
  margin: 1px 8px;
  transition: background 0.1s;
  font-family: inherit;
  text-align: left;
}

.sp__item:hover {
  background: ${c.itemHoverBackground};
}

.sp__item--active {
  background: ${c.activeItemBackground} !important;
}

.sp__item--active .sp__item-label {
  color: ${c.activeItemTextColor} !important;
}

.sp__item--active .sp__item-sub {
  color: rgba(255,255,255,0.6) !important;
}

.sp__item--active .sp__icon-wrap {
  background: rgba(255,255,255,0.15);
  color: ${c.activeItemIconColor};
}

.sp__item--active .sp__item-kbd {
  background: ${c.kbdActiveBackground};
  border-color: ${c.kbdActiveBorderColor};
  color: ${c.kbdActiveTextColor};
}

.sp__item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sp__icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: ${c.inputBackground};
  color: ${c.itemIconColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

.sp__item-label {
  font-size: ${c.fontSize}px;
  font-weight: 500;
  color: ${c.itemTextColor};
  line-height: 1.3;
  transition: color 0.1s;
}

.sp__item-sub {
  font-size: ${c.fontSize - 1}px;
  color: ${c.itemSubtextColor};
  margin-top: 1px;
  line-height: 1.2;
  transition: color 0.1s;
}

/* Footer */
.sp__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  height: 38px;
  background: ${c.footerBackground};
  border-top: 1px solid ${c.footerBorderColor};
}

.sp__footer-hints {
  display: flex;
  gap: 16px;
  align-items: center;
}

.sp__hint {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sp__footer-kbd {
  font-size: 9px;
  padding: 1px 5px;
  background: ${c.footerKbdBackground};
  border: 1px solid ${c.footerKbdBorderColor};
  color: ${c.footerTextColor};
  border-radius: 4px;
  line-height: 1.7;
}

.sp__hint-label {
  font-size: 10px;
  color: ${c.footerTextColor};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: 'DM Mono', monospace;
}

.sp__footer-brand {
  font-size: 10px;
  color: ${c.footerTextColor};
  font-family: 'DM Mono', monospace;
  opacity: 0.5;
  letter-spacing: 0.04em;
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateSpotlightSearchTSX(config: SpotlightConfig): string {
  const c = config;

  return `import { useState, useRef, useEffect, useCallback } from "react";
import "./SpotlightSearch.css";

interface Item {
  id: string;
  icon: string;
  label: string;
  sublabel?: string;
  kbd?: string;
  category: string;
}

const ITEMS: Item[] = [
  { id: "new-project", icon: "add_circle",  label: "Create New Project",     kbd: "⌘ N",  category: "Quick Actions" },
  { id: "dashboard",   icon: "dashboard",   label: "Go to Dashboard",         kbd: "G D",  category: "Quick Actions" },
  { id: "settings",    icon: "settings",    label: "System Settings",         kbd: "⌘ ,",  category: "Quick Actions" },
  { id: "report",      icon: "description", label: "Q4 Financial Report.pdf", sublabel: "Edited 2h ago",      kbd: "⌘ 1", category: "Recent Items" },
  { id: "brand",       icon: "folder",      label: "Brand Identity Assets",   sublabel: "Modified by Alex",   kbd: "⌘ 2", category: "Recent Items" },
  { id: "design-sys",  icon: "palette",     label: "Design System v3.figma",  sublabel: "Modified yesterday", kbd: "⌘ 3", category: "Recent Items" },
  { id: "marcus",      icon: "person",      label: "Marcus Chen",             sublabel: "Product Director",   kbd: "P M", category: "People" },
  { id: "sarah",       icon: "person",      label: "Sarah Miller",            sublabel: "Lead Architect",     kbd: "P S", category: "People" },
];

const CATEGORIES: string[] = ["Quick Actions", "Recent Items", "People"];

interface IconProps {
  name: string;
  size?: number;
}

// Icon map — replace with your icon library if preferred
function Icon({ name, size = 16 }: IconProps) {
  const icons: Record<string, JSX.Element> = {
    add_circle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    dashboard:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    settings:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
    description:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    folder:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    palette:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/></svg>,
    person:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    search:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  };
  return icons[name] ?? icons.search;
}

interface SpotlightSearchProps {
  onSelect?: (item: Item) => void;
}

export default function SpotlightSearch({ onSelect }: SpotlightSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered: Item[] = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.sublabel ?? "").toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[activeIndex]) {
      onSelect?.(filtered[activeIndex]);
    }
  }, [filtered, activeIndex, onSelect]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const visibleCats: string[] = CATEGORIES.filter((cat) => filtered.some((i) => i.category === cat));

  return (
    <div className="sp" role="dialog" aria-modal="true" aria-label="Spotlight search">
      {/* Input */}
      <div className="sp__input-row">
        <span className="sp__search-icon"><Icon name="search" size={18} /></span>
        <input
          ref={inputRef}
          className="sp__input"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setActiveIndex(0); }}
          onKeyDown={handleKey}
          placeholder="Search actions, files, or people…"
          autoFocus
          aria-label="Search"
        />
        <kbd className="sp__kbd">ESC</kbd>
      </div>

      {/* Results */}
      <div ref={listRef} className="sp__list">
        {filtered.length === 0 && (
          <p className="sp__empty">No results for &ldquo;{query}&rdquo;</p>
        )}

        {visibleCats.map((cat) => (
          <section key={cat}>
            <div className="sp__cat-label">{cat}</div>
            {filtered.filter((i) => i.category === cat).map((item) => {
              const globalIndex = filtered.indexOf(item);
              const isActive = globalIndex === activeIndex;
              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  className={\`sp__item\${isActive ? " sp__item--active" : ""}\`}
                  onClick={() => { setActiveIndex(globalIndex); onSelect?.(item); }}
                >
                  <div className="sp__item-left">
                    <div className="sp__icon-wrap">
                      <Icon name={item.icon} size={15} />
                    </div>
                    <div>
                      <div className="sp__item-label">{item.label}</div>
                      {item.sublabel && <div className="sp__item-sub">{item.sublabel}</div>}
                    </div>
                  </div>
                  {item.kbd && <kbd className="sp__item-kbd">{item.kbd}</kbd>}
                </button>
              );
            })}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="sp__footer">
        <div className="sp__footer-hints">
          {[["↑","↓","navigate"],["↵","select"],["ESC","close"]].map(([...keys]) => {
            const label = keys.pop();
            return (
              <div key={label} className="sp__hint">
                {keys.map((k) => <kbd key={k} className="sp__footer-kbd">{k}</kbd>)}
                <span className="sp__hint-label">{label}</span>
              </div>
            );
          })}
        </div>
        <span className="sp__footer-brand">Spotlight Search</span>
      </footer>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateSpotlightSearchTailwind(
  config: SpotlightConfig,
): string {
  const c = config;

  const shadow = c.showShadow
    ? "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)"
    : "none";

  const fsBase = c.fontSize;
  const fsInput = c.fontSize + 1;
  const fsSub = c.fontSize - 1;

  return `import { useState, useRef, useEffect, useCallback, CSSProperties } from "react";

interface Item {
  id: string;
  icon: string;
  label: string;
  sublabel?: string;
  kbd?: string;
  category: string;
}

const ITEMS: Item[] = [
  { id: "new-project", icon: "add_circle",  label: "Create New Project",     kbd: "⌘ N",  category: "Quick Actions" },
  { id: "dashboard",   icon: "dashboard",   label: "Go to Dashboard",         kbd: "G D",  category: "Quick Actions" },
  { id: "settings",    icon: "settings",    label: "System Settings",         kbd: "⌘ ,",  category: "Quick Actions" },
  { id: "report",      icon: "description", label: "Q4 Financial Report.pdf", sublabel: "Edited 2h ago",      kbd: "⌘ 1", category: "Recent Items" },
  { id: "brand",       icon: "folder",      label: "Brand Identity Assets",   sublabel: "Modified by Alex",   kbd: "⌘ 2", category: "Recent Items" },
  { id: "design-sys",  icon: "palette",     label: "Design System v3.figma",  sublabel: "Modified yesterday", kbd: "⌘ 3", category: "Recent Items" },
  { id: "marcus",      icon: "person",      label: "Marcus Chen",             sublabel: "Product Director",   kbd: "P M", category: "People" },
  { id: "sarah",       icon: "person",      label: "Sarah Miller",            sublabel: "Lead Architect",     kbd: "P S", category: "People" },
];

const CATEGORIES: string[] = ["Quick Actions", "Recent Items", "People"];

interface IconProps {
  name: string;
  size?: number;
}

// Icon map — replace with your icon library if preferred
function Icon({ name, size = 16 }: IconProps) {
  const icons: Record<string, JSX.Element> = {
    add_circle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    dashboard:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    settings:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
    description:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    folder:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    palette:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/></svg>,
    person:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    search:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  };
  return icons[name] ?? icons.search;
}

interface SpotlightSearchProps {
  onSelect?: (item: Item) => void;
}

// Baked-in CSS variable tokens — update these to reskin the SpotlightSearch
const spVars: CSSProperties = {
  "--sp-panel-bg":              "${c.panelBackground}",
  "--sp-panel-border":          "${c.panelBorderColor}",
  "--sp-panel-radius":          "${c.panelBorderRadius}px",
  "--sp-input-bg":              "${c.inputBackground}",
  "--sp-input-text":            "${c.inputTextColor}",
  "--sp-input-placeholder":     "${c.inputPlaceholderColor}",
  "--sp-input-icon":            "${c.inputIconColor}",
  "--sp-kbd-bg":                "${c.kbdBackground}",
  "--sp-kbd-border":            "${c.kbdBorderColor}",
  "--sp-kbd-text":              "${c.kbdTextColor}",
  "--sp-kbd-active-bg":         "${c.kbdActiveBackground}",
  "--sp-kbd-active-border":     "${c.kbdActiveBorderColor}",
  "--sp-kbd-active-text":       "${c.kbdActiveTextColor}",
  "--sp-section-label":         "${c.sectionLabelColor}",
  "--sp-item-bg":               "${c.itemBackground}",
  "--sp-item-hover-bg":         "${c.itemHoverBackground}",
  "--sp-item-radius":           "${c.itemBorderRadius}px",
  "--sp-item-text":             "${c.itemTextColor}",
  "--sp-item-subtext":          "${c.itemSubtextColor}",
  "--sp-item-icon":             "${c.itemIconColor}",
  "--sp-active-bg":             "${c.activeItemBackground}",
  "--sp-active-text":           "${c.activeItemTextColor}",
  "--sp-active-icon":           "${c.activeItemIconColor}",
  "--sp-footer-bg":             "${c.footerBackground}",
  "--sp-footer-border":         "${c.footerBorderColor}",
  "--sp-footer-text":           "${c.footerTextColor}",
  "--sp-footer-kbd-bg":         "${c.footerKbdBackground}",
  "--sp-footer-kbd-border":     "${c.footerKbdBorderColor}",
  "--sp-panel-width":           "${c.panelWidth}px",
} as CSSProperties;

export default function SpotlightSearch({ onSelect }: SpotlightSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered: Item[] = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.sublabel ?? "").toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[activeIndex]) {
      onSelect?.(filtered[activeIndex]);
    }
  }, [filtered, activeIndex, onSelect]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const visibleCats: string[] = CATEGORIES.filter((cat) => filtered.some((i) => i.category === cat));

  return (
    <div
      className="flex flex-col overflow-hidden font-['Instrument_Sans',sans-serif] w-[var(--sp-panel-width)] max-w-full bg-[var(--sp-panel-bg)] border border-[var(--sp-panel-border)] rounded-[var(--sp-panel-radius)]${c.animateOpen ? " [animation:sp-open_0.18s_cubic-bezier(0.16,1,0.3,1)]" : ""}"
      style={{ ...spVars, boxShadow: "${shadow}" }}
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
    >
      ${
        c.animateOpen
          ? `<style>{\`
        @keyframes sp-open {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      \`}</style>`
          : ""
      }

      {/* Input */}
      <div className="flex items-center gap-3 px-[18px] py-[14px] border-b border-[var(--sp-panel-border)] bg-[var(--sp-input-bg)]">
        <span className="text-[var(--sp-input-icon)] flex items-center shrink-0">
          <Icon name="search" size={18} />
        </span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent border-none outline-none text-[var(--sp-input-text)] text-[${fsInput}px] font-medium font-[inherit] placeholder:text-[var(--sp-input-placeholder)]"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setActiveIndex(0); }}
          onKeyDown={handleKey}
          placeholder="Search actions, files, or people…"
          autoFocus
          aria-label="Search"
        />
        <kbd className="font-['DM_Mono',monospace] rounded-[5px] leading-relaxed whitespace-nowrap shrink-0 cursor-default text-[10px] px-[7px] py-[2px] bg-[var(--sp-kbd-bg)] border border-[var(--sp-kbd-border)] text-[var(--sp-kbd-text)]">ESC</kbd>
      </div>

      {/* Results */}
      <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2 scrollbar-thin">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-[var(--sp-section-label)] text-[${fsBase}px] m-0">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}

        {visibleCats.map((cat) => (
          <section key={cat}>
            <div className="px-[18px] pt-[6px] pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--sp-section-label)] font-['DM_Mono',monospace]">
              {cat}
            </div>
            {filtered.filter((i) => i.category === cat).map((item) => {
              const globalIndex = filtered.indexOf(item);
              const isActive = globalIndex === activeIndex;

              let itemCls = "w-[calc(100%-16px)] flex items-center justify-between gap-3 px-[18px] py-[9px] border-none cursor-pointer rounded-[var(--sp-item-radius)] mx-2 my-[1px] transition-colors duration-[100ms] font-[inherit] text-left";
              if (isActive) {
                itemCls += " bg-[var(--sp-active-bg)]";
              } else {
                itemCls += " bg-[var(--sp-item-bg)] hover:bg-[var(--sp-item-hover-bg)]";
              }

              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  className={itemCls}
                  onClick={() => { setActiveIndex(globalIndex); onSelect?.(item); }}
                >
                  <div className="flex items-center gap-3">
                    <div className={\`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center shrink-0 transition-colors duration-[100ms] \${isActive ? "bg-white/15 text-[var(--sp-active-icon)]" : "bg-[var(--sp-input-bg)] text-[var(--sp-item-icon)]"}\`}>
                      <Icon name={item.icon} size={15} />
                    </div>
                    <div>
                      <div className={\`text-[${fsBase}px] font-medium leading-[1.3] transition-colors duration-[100ms] \${isActive ? "text-[var(--sp-active-text)]" : "text-[var(--sp-item-text)]"}\`}>
                        {item.label}
                      </div>
                      {item.sublabel && (
                        <div className={\`text-[${fsSub}px] mt-[1px] leading-[1.2] transition-colors duration-[100ms] \${isActive ? "text-white/60" : "text-[var(--sp-item-subtext)]"}\`}>
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.kbd && (
                    <kbd className={\`font-['DM_Mono',monospace] rounded-[5px] leading-relaxed whitespace-nowrap shrink-0 cursor-default text-[10px] px-[7px] py-[2px] border transition-all duration-[100ms] \${isActive ? "bg-[var(--sp-kbd-active-bg)] border-[var(--sp-kbd-active-border)] text-[var(--sp-kbd-active-text)]" : "bg-[var(--sp-kbd-bg)] border-[var(--sp-kbd-border)] text-[var(--sp-kbd-text)]"}\`}>
                      {item.kbd}
                    </kbd>
                  )}
                </button>
              );
            })}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-[18px] h-[38px] bg-[var(--sp-footer-bg)] border-t border-[var(--sp-footer-border)]">
        <div className="flex gap-4 items-center">
          {[["↑","↓","navigate"],["↵","select"],["ESC","close"]].map(([...keys]) => {
            const label = keys.pop();
            return (
              <div key={label} className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="font-['DM_Mono',monospace] text-[9px] px-[5px] py-[1px] bg-[var(--sp-footer-kbd-bg)] border border-[var(--sp-footer-kbd-border)] text-[var(--sp-footer-text)] rounded border-[4px] leading-[1.7]">
                    {k}
                  </kbd>
                ))}
                <span className="text-[10px] text-[var(--sp-footer-text)] tracking-[0.05em] uppercase font-['DM_Mono',monospace]">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <span className="text-[10px] text-[var(--sp-footer-text)] font-['DM_Mono',monospace] opacity-50 tracking-[0.04em]">
          Spotlight Search
        </span>
      </footer>
    </div>
  );
}`;
}
