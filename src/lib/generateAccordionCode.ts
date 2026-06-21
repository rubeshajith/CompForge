// lib/generateAccordionCode.ts

import { AccordionConfig, AccordionVariant } from "./accordionConfig";

// ─── JSX + CSS ────────────────────────────────────────────────────────────────

export function generateAccordionJSX(config: AccordionConfig): string {
  const { variant } = config;

  const commonHeader = `import { useState, useRef, useEffect, useCallback } from "react";
import "./Accordion.css";

const ITEMS = [
  { id: "1", title: "What is CompForge?", content: "CompForge is a component playground and code generator. Customize UI components visually, preview changes in real time, and copy ready-to-use JSX and CSS with a single click." },
  { id: "2", title: "How does live preview work?", content: "Every change you make in the control panel is reflected instantly in the preview panel. The generated code is always in sync with what you see — no compilation step needed." },
  { id: "3", title: "Can I use the generated code in my project?", content: "Yes. The generated JSX and CSS are fully self-contained. No extra dependencies are required — just drop them into your project and they work out of the box." },
  { id: "4", title: "Are dark and light themes supported?", content: "Absolutely. Every component ships with carefully tuned dark and light presets. Toggle between them using the mode button at the top of the playground." },
];
`;

  if (variant === "animated-height") {
    return `${commonHeader}
function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight("auto"), ${config.animationDuration + 20});
      return () => clearTimeout(t);
    } else {
      if (height === "auto") {
        setHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
    <div className={\`acc__item\${isOpen ? " acc__item--open" : ""}\`}>
      <button className="acc__header" onClick={onToggle}>
        <span className="acc__title">{item.title}</span>
        <svg className="acc__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="acc__body-wrap"
        style={{
          height: height === "auto" ? "auto" : \`\${height}px\`,
          overflow: "hidden",
          transition: height === "auto" ? "none" : \`height ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)\`,
        }}
      >
        <div ref={contentRef}>
          <div className="acc__separator" />
          <div className="acc__body">{item.content}</div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ onValueChange }) {
  const [openIds, setOpenIds] = useState(new Set(["1"]));

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openIds.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}`;
  }

  if (variant === "bordered-cards") {
    return `${commonHeader}
export default function Accordion({ onValueChange }) {
  const [openIds, setOpenIds] = useState(new Set(["1"]));

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          return (
            <div key={item.id} className={\`acc__item acc__item--card\${isOpen ? " acc__item--open" : ""}\`}>
              <button className="acc__header" onClick={() => toggle(item.id)}>
                <div className="acc__badge">{String(idx + 1).padStart(2, "0")}</div>
                <span className="acc__title">{item.title}</span>
                <svg className="acc__plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {isOpen && <div className="acc__body">{item.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
  }

  if (variant === "icon-reveal") {
    return `${commonHeader}
const ICONS = ["✦", "◈", "⬡", "◉"];

export default function Accordion({ onValueChange }) {
  const [openIds, setOpenIds] = useState(new Set(["1"]));

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          const isLast = idx === ITEMS.length - 1;
          return (
            <div key={item.id}>
              <button className={\`acc__header\${isOpen ? " acc__header--open" : ""}\`} onClick={() => toggle(item.id)}>
                <div className={\`acc__icon-box\${isOpen ? " acc__icon-box--open" : ""}\`}>{ICONS[idx]}</div>
                <span className="acc__title">{item.title}</span>
                <div className="acc__dash">
                  <div className={\`acc__dash-vert\${isOpen ? " acc__dash-vert--hidden" : ""}\`} />
                </div>
              </button>
              {isOpen && (
                <div className="acc__body acc__body--indented">{item.content}</div>
              )}
              {!isLast && <div className="acc__separator" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
  }

  // nested
  return `${commonHeader}
const NESTED_ITEMS = [
  { id: "a", title: "Design System", content: "Global tokens and guidelines.", children: [
    { id: "a1", title: "Color Palette", content: "Purple accent on dark neutrals; designed for accessibility." },
    { id: "a2", title: "Typography Scale", content: "Syne for headings, Instrument Sans for body, DM Mono for code." },
  ]},
  { id: "b", title: "Components", content: "Pre-built, configurable UI primitives.", children: [
    { id: "b1", title: "Calendar", content: "Single and range selection, month/year picker, animated open." },
    { id: "b2", title: "Accordion", content: "Multiple variants: animated height, nested, bordered cards, icon reveal." },
  ]},
  { id: "c", title: "Code Generation", content: "Every customization bakes down into plain JSX + CSS." },
];

export default function Accordion({ onValueChange }) {
  const [openIds, setOpenIds] = useState(new Set(["a"]));

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {NESTED_ITEMS.map((item) => (
          <div key={item.id} className={\`acc__item\${openIds.has(item.id) ? " acc__item--open" : ""}\`}>
            <button className="acc__header acc__header--root" onClick={() => toggle(item.id)}>
              <div className="acc__bar" />
              <span className="acc__title">{item.title}</span>
              <svg className="acc__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openIds.has(item.id) && (
              <div className="acc__body">
                {item.content && <p className="acc__body-text">{item.content}</p>}
                {item.children && (
                  <div className="acc__nested">
                    {item.children.map((child) => (
                      <div key={child.id} className={\`acc__item acc__item--child\${openIds.has(child.id) ? " acc__item--open" : ""}\`}>
                        <button className="acc__header acc__header--child" onClick={() => toggle(child.id)}>
                          <span className="acc__title">{child.title}</span>
                          <svg className="acc__chevron acc__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                        {openIds.has(child.id) && (
                          <div className="acc__body acc__body--child">{child.content}</div>
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
    </div>
  );
}`;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

export function generateAccordionCSS(config: AccordionConfig): string {
  const { variant } = config;

  const base = `/* Accordion — ${VARIANT_LABEL[variant]} variant */

.acc-wrap {
  max-width: 100%;
  font-family: 'Instrument Sans', system-ui, sans-serif;
  background: ${config.backgroundColor};
}

.acc {
  display: flex;
  flex-direction: column;
  gap: ${config.itemGap}px;
}`;

  if (variant === "animated-height") {
    return `${base}

.acc__item {
  border: 1px solid ${config.borderColor};
  border-radius: ${config.itemBorderRadius}px;
  overflow: hidden;
  background: ${config.headerBackground};
  ${config.showShadow ? `box-shadow: 0 2px 8px ${config.shadowColor};` : ""}
}

.acc__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${config.headerPaddingY}px ${config.headerPaddingX}px;
  background: ${config.headerBackground};
  border: none;
  cursor: pointer;
  color: ${config.headerTextColor};
  font-size: ${config.headerFontSize}px;
  font-weight: ${config.headerFontWeight};
  font-family: inherit;
  text-align: left;
  transition: background ${config.animationDuration}ms;
}

.acc__header:hover {
  background: ${config.headerHoverBackground};
}

.acc__item--open .acc__header {
  background: ${config.headerHoverBackground};
}

.acc__title {
  flex: 1;
}

.acc__chevron {
  width: ${config.iconSize}px;
  height: ${config.iconSize}px;
  color: ${config.iconColor};
  flex-shrink: 0;
  transition: transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1),
              color ${config.animationDuration}ms;
}

.acc__item--open .acc__chevron {
  transform: rotate(180deg);
  color: ${config.accentColor};
}

.acc__separator {
  height: 1px;
  background: ${config.separatorColor};
  margin: 0 ${config.headerPaddingX}px;
}

.acc__body {
  padding: ${config.contentPadding}px ${config.headerPaddingX}px;
  background: ${config.contentBackground};
  color: ${config.contentTextColor};
  font-size: ${config.contentFontSize}px;
  line-height: 1.7;
}`;
  }

  if (variant === "bordered-cards") {
    return `${base}

.acc__item--card {
  border: 1.5px solid ${config.borderColor};
  border-radius: ${config.itemBorderRadius}px;
  overflow: hidden;
  transition: border-color ${config.animationDuration}ms, box-shadow ${config.animationDuration}ms;
  ${config.showShadow ? `box-shadow: 0 2px 8px ${config.shadowColor};` : ""}
}

.acc__item--card.acc__item--open {
  border-color: ${config.accentColor};
  ${config.showShadow ? `box-shadow: 0 0 0 3px ${config.accentColor}18;` : ""}
}

.acc__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${config.headerPaddingY}px ${config.headerPaddingX}px;
  background: ${config.headerBackground};
  border: none;
  cursor: pointer;
  color: ${config.headerTextColor};
  font-size: ${config.headerFontSize}px;
  font-weight: ${config.headerFontWeight};
  font-family: inherit;
  text-align: left;
  transition: background ${config.animationDuration}ms, color ${config.animationDuration}ms;
}

.acc__item--open .acc__header {
  background: ${config.accentColor}10;
  color: ${config.accentColor};
}

.acc__badge {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: ${config.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: ${config.iconColor};
  flex-shrink: 0;
  transition: background ${config.animationDuration}ms, color ${config.animationDuration}ms;
}

.acc__item--open .acc__badge {
  background: ${config.accentColor};
  color: #fff;
}

.acc__title {
  flex: 1;
}

.acc__plus {
  width: ${config.iconSize}px;
  height: ${config.iconSize}px;
  flex-shrink: 0;
  transition: transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1);
}

.acc__item--open .acc__plus {
  transform: rotate(45deg);
}

.acc__body {
  padding: ${config.contentPadding}px ${config.headerPaddingX}px;
  background: ${config.contentBackground};
  color: ${config.contentTextColor};
  font-size: ${config.contentFontSize}px;
  line-height: 1.7;
  border-top: 1px solid ${config.accentColor}30;
}`;
  }

  if (variant === "icon-reveal") {
    return `${base}

.acc {
  border: 1px solid ${config.borderColor};
  border-radius: ${config.itemBorderRadius}px;
  overflow: hidden;
  gap: 0;
  ${config.showShadow ? `box-shadow: 0 4px 24px ${config.shadowColor};` : ""}
}

.acc__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: ${config.headerPaddingY}px ${config.headerPaddingX}px;
  background: ${config.headerBackground};
  border: none;
  cursor: pointer;
  color: ${config.headerTextColor};
  font-size: ${config.headerFontSize}px;
  font-weight: ${config.headerFontWeight};
  font-family: inherit;
  text-align: left;
  transition: background ${config.animationDuration}ms;
}

.acc__header:hover,
.acc__header--open {
  background: ${config.headerHoverBackground};
}

.acc__icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid ${config.borderColor};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${config.iconColor};
  font-size: 14px;
  flex-shrink: 0;
  transition: border-color ${config.animationDuration}ms,
              background ${config.animationDuration}ms,
              color ${config.animationDuration}ms;
}

.acc__icon-box--open {
  border-color: ${config.accentColor};
  background: ${config.accentColor}18;
  color: ${config.accentColor};
}

.acc__title {
  flex: 1;
}

.acc__dash {
  width: ${config.iconSize}px;
  height: 2px;
  background: ${config.iconColor};
  border-radius: 1px;
  position: relative;
  flex-shrink: 0;
}

.acc__header--open .acc__dash {
  background: ${config.accentColor};
}

.acc__dash-vert {
  position: absolute;
  width: 2px;
  height: ${config.iconSize}px;
  background: inherit;
  border-radius: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scaleY(1);
  transition: transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1);
}

.acc__dash-vert--hidden {
  transform: translate(-50%, -50%) scaleY(0);
}

.acc__separator {
  height: 1px;
  background: ${config.separatorColor};
}

.acc__body {
  background: ${config.contentBackground};
  color: ${config.contentTextColor};
  font-size: ${config.contentFontSize}px;
  line-height: 1.7;
}

.acc__body--indented {
  padding: ${config.contentPadding}px ${config.headerPaddingX}px ${config.contentPadding}px ${config.headerPaddingX + 46}px;
}`;
  }

  // nested
  return `${base}

.acc__item {
  border: 1px solid ${config.borderColor};
  border-radius: ${config.itemBorderRadius}px;
  overflow: hidden;
  ${config.showShadow ? `box-shadow: 0 2px 8px ${config.shadowColor};` : ""}
}

.acc__header--root {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${config.headerPaddingY}px ${config.headerPaddingX}px;
  background: ${config.headerBackground};
  border: none;
  cursor: pointer;
  color: ${config.headerTextColor};
  font-size: ${config.headerFontSize}px;
  font-weight: 600;
  font-family: inherit;
  text-align: left;
  transition: background ${config.animationDuration}ms;
}

.acc__item--open > .acc__header--root {
  background: ${config.nestedHeaderBackground};
}

.acc__bar {
  width: 3px;
  height: 18px;
  border-radius: 2px;
  background: transparent;
  flex-shrink: 0;
  transition: background ${config.animationDuration}ms;
}

.acc__item--open > .acc__header--root .acc__bar {
  background: ${config.accentColor};
}

.acc__title {
  flex: 1;
}

.acc__chevron {
  width: ${config.iconSize}px;
  height: ${config.iconSize}px;
  color: ${config.iconColor};
  flex-shrink: 0;
  transition: transform ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1),
              color ${config.animationDuration}ms;
}

.acc__item--open > .acc__header--root .acc__chevron {
  transform: rotate(180deg);
  color: ${config.accentColor};
}

.acc__chevron--right {
  transform: rotate(0deg);
}

.acc__item--child.acc__item--open .acc__chevron--right {
  transform: rotate(90deg);
  color: ${config.nestedAccentColor};
}

.acc__body {
  background: ${config.contentBackground};
}

.acc__body-text {
  margin: 0;
  padding: 12px ${config.headerPaddingX}px;
  color: ${config.contentTextColor};
  font-size: ${config.contentFontSize}px;
  line-height: 1.65;
  border-bottom: 1px solid ${config.separatorColor};
}

.acc__nested {
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.acc__item--child {
  border: 1px solid ${config.borderColor};
  border-radius: ${config.itemBorderRadius - 2}px;
  overflow: hidden;
}

.acc__header--child {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${config.headerBackground};
  border: none;
  cursor: pointer;
  color: ${config.nestedHeaderTextColor};
  font-size: ${config.headerFontSize - 1}px;
  font-weight: 500;
  font-family: inherit;
  text-align: left;
  transition: background ${config.animationDuration}ms;
}

.acc__item--child.acc__item--open > .acc__header--child {
  background: ${config.nestedHeaderBackground};
}

.acc__body--child {
  padding: 10px 14px 14px;
  color: ${config.contentTextColor};
  font-size: ${config.contentFontSize - 1}px;
  line-height: 1.65;
  border-top: 1px solid ${config.separatorColor};
}`;
}

const VARIANT_LABEL: Record<AccordionVariant, string> = {
  "animated-height": "Animated Height",
  nested: "Nested",
  "bordered-cards": "Bordered Cards",
  "icon-reveal": "Icon Reveal",
};

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateAccordionTSX(config: AccordionConfig): string {
  const { variant } = config;

  const commonHeader = `import { useState, useRef, useEffect, useCallback } from "react";
import "./Accordion.css";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

const ITEMS: AccordionItem[] = [
  { id: "1", title: "What is CompForge?", content: "CompForge is a component playground and code generator. Customize UI components visually, preview changes in real time, and copy ready-to-use JSX and CSS with a single click." },
  { id: "2", title: "How does live preview work?", content: "Every change you make in the control panel is reflected instantly in the preview panel. The generated code is always in sync with what you see — no compilation step needed." },
  { id: "3", title: "Can I use the generated code in my project?", content: "Yes. The generated JSX and CSS are fully self-contained. No extra dependencies are required — just drop them into your project and they work out of the box." },
  { id: "4", title: "Are dark and light themes supported?", content: "Absolutely. Every component ships with carefully tuned dark and light presets. Toggle between them using the mode button at the top of the playground." },
];
`;

  if (variant === "animated-height") {
    return `${commonHeader}
interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({ item, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight("auto"), ${config.animationDuration + 20});
      return () => clearTimeout(t);
    } else {
      if (height === "auto") {
        setHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
    <div className={\`acc__item\${isOpen ? " acc__item--open" : ""}\`}>
      <button className="acc__header" onClick={onToggle}>
        <span className="acc__title">{item.title}</span>
        <svg className="acc__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="acc__body-wrap"
        style={{
          height: height === "auto" ? "auto" : \`\${height}px\`,
          overflow: "hidden",
          transition: height === "auto" ? "none" : \`height ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)\`,
        }}
      >
        <div ref={contentRef}>
          <div className="acc__separator" />
          <div className="acc__body">{item.content}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item) => (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isOpen={openIds.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}`;
  }

  if (variant === "bordered-cards") {
    return `${commonHeader}
interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          return (
            <div key={item.id} className={\`acc__item acc__item--card\${isOpen ? " acc__item--open" : ""}\`}>
              <button className="acc__header" onClick={() => toggle(item.id)}>
                <div className="acc__badge">{String(idx + 1).padStart(2, "0")}</div>
                <span className="acc__title">{item.title}</span>
                <svg className="acc__plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {isOpen && <div className="acc__body">{item.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
  }

  if (variant === "icon-reveal") {
    return `${commonHeader}
const ICONS: string[] = ["✦", "◈", "⬡", "◉"];

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {ITEMS.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          const isLast = idx === ITEMS.length - 1;
          return (
            <div key={item.id}>
              <button className={\`acc__header\${isOpen ? " acc__header--open" : ""}\`} onClick={() => toggle(item.id)}>
                <div className={\`acc__icon-box\${isOpen ? " acc__icon-box--open" : ""}\`}>{ICONS[idx]}</div>
                <span className="acc__title">{item.title}</span>
                <div className="acc__dash">
                  <div className={\`acc__dash-vert\${isOpen ? " acc__dash-vert--hidden" : ""}\`} />
                </div>
              </button>
              {isOpen && (
                <div className="acc__body acc__body--indented">{item.content}</div>
              )}
              {!isLast && <div className="acc__separator" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
  }

  // nested
  return `${commonHeader}
interface NestedChild {
  id: string;
  title: string;
  content: string;
}

interface NestedItem {
  id: string;
  title: string;
  content?: string;
  children?: NestedChild[];
}

const NESTED_ITEMS: NestedItem[] = [
  { id: "a", title: "Design System", content: "Global tokens and guidelines.", children: [
    { id: "a1", title: "Color Palette", content: "Purple accent on dark neutrals; designed for accessibility." },
    { id: "a2", title: "Typography Scale", content: "Syne for headings, Instrument Sans for body, DM Mono for code." },
  ]},
  { id: "b", title: "Components", content: "Pre-built, configurable UI primitives.", children: [
    { id: "b1", title: "Calendar", content: "Single and range selection, month/year picker, animated open." },
    { id: "b2", title: "Accordion", content: "Multiple variants: animated height, nested, bordered cards, icon reveal." },
  ]},
  { id: "c", title: "Code Generation", content: "Every customization bakes down into plain JSX + CSS." },
];

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["a"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div className="acc-wrap" style={{ width: ${config.accordionWidth} }}>
      <div className="acc">
        {NESTED_ITEMS.map((item) => (
          <div key={item.id} className={\`acc__item\${openIds.has(item.id) ? " acc__item--open" : ""}\`}>
            <button className="acc__header acc__header--root" onClick={() => toggle(item.id)}>
              <div className="acc__bar" />
              <span className="acc__title">{item.title}</span>
              <svg className="acc__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openIds.has(item.id) && (
              <div className="acc__body">
                {item.content && <p className="acc__body-text">{item.content}</p>}
                {item.children && (
                  <div className="acc__nested">
                    {item.children.map((child) => (
                      <div key={child.id} className={\`acc__item acc__item--child\${openIds.has(child.id) ? " acc__item--open" : ""}\`}>
                        <button className="acc__header acc__header--child" onClick={() => toggle(child.id)}>
                          <span className="acc__title">{child.title}</span>
                          <svg className="acc__chevron acc__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                        {openIds.has(child.id) && (
                          <div className="acc__body acc__body--child">{child.content}</div>
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
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateAccordionTailwind(config: AccordionConfig): string {
  const { variant } = config;

  // Pre-compute complex values
  const shadow = config.showShadow ? "0 2px 8px var(--acc-shadow)" : "none";
  const shadowLarge = config.showShadow
    ? "0 4px 24px var(--acc-shadow)"
    : "none";

  // Baked font sizes
  const headerFs = config.headerFontSize;
  const contentFs = config.contentFontSize;
  const childHeaderFs = config.headerFontSize - 1;
  const childContentFs = config.contentFontSize - 1;

  const commonHeader = `import { useState, useRef, useEffect, useCallback, CSSProperties } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

const ITEMS: AccordionItem[] = [
  { id: "1", title: "What is CompForge?", content: "CompForge is a component playground and code generator. Customize UI components visually, preview changes in real time, and copy ready-to-use JSX and CSS with a single click." },
  { id: "2", title: "How does live preview work?", content: "Every change you make in the control panel is reflected instantly in the preview panel. The generated code is always in sync with what you see — no compilation step needed." },
  { id: "3", title: "Can I use the generated code in my project?", content: "Yes. The generated JSX and CSS are fully self-contained. No extra dependencies are required — just drop them into your project and they work out of the box." },
  { id: "4", title: "Are dark and light themes supported?", content: "Absolutely. Every component ships with carefully tuned dark and light presets. Toggle between them using the mode button at the top of the playground." },
];`;

  if (variant === "animated-height") {
    return `${commonHeader}

// Baked-in CSS variable tokens — update these to reskin the Accordion
const accVars: CSSProperties = {
"--acc-bg": "${config.backgroundColor}",
  "--acc-border":          "${config.borderColor}",
  "--acc-radius":          "${config.itemBorderRadius}px",
  "--acc-header-bg":       "${config.headerBackground}",
  "--acc-header-hover-bg": "${config.headerHoverBackground}",
  "--acc-header-text":     "${config.headerTextColor}",
  "--acc-icon":            "${config.iconColor}",
  "--acc-icon-size":       "${config.iconSize}px",
  "--acc-accent":          "${config.accentColor}",
  "--acc-separator":       "${config.separatorColor}",
  "--acc-content-bg":      "${config.contentBackground}",
  "--acc-content-text":    "${config.contentTextColor}",
  "--acc-shadow":          "${config.shadowColor}",
  "--acc-gap":             "${config.itemGap}px",
  "--acc-px":              "${config.headerPaddingX}px",
  "--acc-py":              "${config.headerPaddingY}px",
  "--acc-content-p":       "${config.contentPadding}px",
} as CSSProperties;

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({ item, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight("auto"), ${config.animationDuration + 20});
      return () => clearTimeout(t);
    } else {
      if (height === "auto") {
        setHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
<div
  className="border border-[var(--acc-border)] rounded-[var(--acc-radius)] overflow-hidden bg-[var(--acc-header-bg)]"
  ${config.showShadow ? 'style={{ boxShadow: "0 2px 8px var(--acc-shadow)" }}' : ""}
    >
      <button
        className="w-full flex items-center justify-between bg-[var(--acc-header-bg)] hover:bg-[var(--acc-header-hover-bg)] border-none cursor-pointer text-[var(--acc-header-text)] text-left font-[inherit] transition-colors duration-[${config.animationDuration}ms]"
        style={{ padding: "var(--acc-py) var(--acc-px)", fontSize: "${headerFs}px", fontWeight: ${config.headerFontWeight} }}
        onClick={onToggle}
      >
        <span className="flex-1">{item.title}</span>
        <svg
          className={\`shrink-0 transition-transform duration-[${config.animationDuration}ms] \${isOpen ? "rotate-180 text-[var(--acc-accent)]" : "text-[var(--acc-icon)]"}\`}
          style={{ width: "var(--acc-icon-size)", height: "var(--acc-icon-size)" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        style={{
          height: height === "auto" ? "auto" : \`\${height}px\`,
          overflow: "hidden",
          transition: height === "auto" ? "none" : \`height ${config.animationDuration}ms cubic-bezier(0.4,0,0.2,1)\`,
        }}
      >
        <div ref={contentRef}>
          <div className="h-px bg-[var(--acc-separator)]" style={{ margin: "0 var(--acc-px)" }} />
          <div
            className="bg-[var(--acc-content-bg)] text-[var(--acc-content-text)] leading-[1.7]"
            style={{ padding: "var(--acc-content-p) var(--acc-px)", fontSize: "${contentFs}px" }}
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div
      className="max-w-full font-[inherit] flex flex-col"
      style={{ ...accVars, width: ${config.accordionWidth}, gap: "var(--acc-gap)" } as CSSProperties}
    >
      {ITEMS.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}`;
  }

  if (variant === "bordered-cards") {
    return `${commonHeader}

// Baked-in CSS variable tokens — update these to reskin the Accordion
const accVars: CSSProperties = {
  "--acc-bg":              "${config.backgroundColor}",
  "--acc-border":          "${config.borderColor}",
  "--acc-radius":          "${config.itemBorderRadius}px",
  "--acc-header-bg":       "${config.headerBackground}",
  "--acc-header-text":     "${config.headerTextColor}",
  "--acc-icon":            "${config.iconColor}",
  "--acc-icon-size":       "${config.iconSize}px",
  "--acc-accent":          "${config.accentColor}",
  "--acc-content-bg":      "${config.contentBackground}",
  "--acc-content-text":    "${config.contentTextColor}",
  "--acc-shadow":          "${config.shadowColor}",
  "--acc-gap":             "${config.itemGap}px",
  "--acc-px":              "${config.headerPaddingX}px",
  "--acc-py":              "${config.headerPaddingY}px",
  "--acc-content-p":       "${config.contentPadding}px",
} as CSSProperties;

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div
      className="max-w-full font-[inherit] flex flex-col"
      style={{ ...accVars, width: ${config.accordionWidth}, gap: "var(--acc-gap)" } as CSSProperties}
    >
      {ITEMS.map((item, idx) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={\`border-[1.5px] rounded-[var(--acc-radius)] overflow-hidden transition-[border-color] duration-[${config.animationDuration}ms] \${isOpen ? "border-[var(--acc-accent)]" : "border-[var(--acc-border)]"}\`}
            ${config.showShadow ? `style={{ boxShadow: isOpen ? \`0 0 0 3px ${config.accentColor}18\` : "0 2px 8px var(--acc-shadow)" }}` : ""}
          >
            <button
              className="w-full flex items-center gap-[10px] bg-[var(--acc-header-bg)] border-none cursor-pointer text-left font-[inherit] transition-[background,color] duration-[${config.animationDuration}ms]"
              style={{
                padding: "var(--acc-py) var(--acc-px)",
                fontSize: "${headerFs}px",
                fontWeight: ${config.headerFontWeight},
                color: isOpen ? "var(--acc-accent)" : "var(--acc-header-text)",
                background: isOpen ? \`${config.accentColor}1a\` : "var(--acc-header-bg)",
              }}
              onClick={() => toggle(item.id)}
            >
              <div
                className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[11px] font-bold shrink-0 transition-[background,color] duration-[${config.animationDuration}ms]"
                style={{
                  background: isOpen ? "var(--acc-accent)" : "var(--acc-border)",
                  color: isOpen ? "#fff" : "var(--acc-icon)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
              <span className="flex-1">{item.title}</span>
              <svg
                className={\`shrink-0 transition-transform duration-[${config.animationDuration}ms] \${isOpen ? "rotate-45" : ""}\`}
                style={{ width: "var(--acc-icon-size)", height: "var(--acc-icon-size)" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            {isOpen && (
              <div
                className="bg-[var(--acc-content-bg)] text-[var(--acc-content-text)] leading-[1.7] border-t border-[${config.accentColor}4d]"
                style={{ padding: "var(--acc-content-p) var(--acc-px)", fontSize: "${contentFs}px" }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}`;
  }

  if (variant === "icon-reveal") {
    return `${commonHeader}

// Baked-in CSS variable tokens — update these to reskin the Accordion
const accVars: CSSProperties = {
  "--acc-bg":              "${config.backgroundColor}",
  "--acc-border":          "${config.borderColor}",
  "--acc-radius":          "${config.itemBorderRadius}px",
  "--acc-header-bg":       "${config.headerBackground}",
  "--acc-header-hover-bg": "${config.headerHoverBackground}",
  "--acc-header-text":     "${config.headerTextColor}",
  "--acc-icon":            "${config.iconColor}",
  "--acc-icon-size":       "${config.iconSize}px",
  "--acc-accent":          "${config.accentColor}",
  "--acc-separator":       "${config.separatorColor}",
  "--acc-content-bg":      "${config.contentBackground}",
  "--acc-content-text":    "${config.contentTextColor}",
  "--acc-shadow":          "${config.shadowColor}",
  "--acc-px":              "${config.headerPaddingX}px",
  "--acc-py":              "${config.headerPaddingY}px",
  "--acc-content-p":       "${config.contentPadding}px",
} as CSSProperties;

const ICONS: string[] = ["✦", "◈", "⬡", "◉"];

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["1"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { ${config.allowMultiple ? "" : "next.clear(); "}next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div
      className="max-w-full font-[inherit] border border-[var(--acc-border)] rounded-[var(--acc-radius)] overflow-hidden flex flex-col"
      style={{ ...accVars, width: ${config.accordionWidth}, ${config.showShadow ? `boxShadow: "0 4px 24px var(--acc-shadow)"` : ""} } as CSSProperties}
    >
      {ITEMS.map((item, idx) => {
        const isOpen = openIds.has(item.id);
        const isLast = idx === ITEMS.length - 1;
        return (
          <div key={item.id}>
            <button
              className={\`w-full flex items-center gap-[14px] bg-[var(--acc-header-bg)] border-none cursor-pointer text-[var(--acc-header-text)] text-left font-[inherit] transition-colors duration-[${config.animationDuration}ms] \${isOpen ? "bg-[var(--acc-header-hover-bg)]" : "hover:bg-[var(--acc-header-hover-bg)]"}\`}
              style={{ padding: "var(--acc-py) var(--acc-px)", fontSize: "${headerFs}px", fontWeight: ${config.headerFontWeight} }}
              onClick={() => toggle(item.id)}
            >
              <div
                className={\`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[14px] shrink-0 transition-[border-color,background,color] duration-[${config.animationDuration}ms] \${isOpen ? "border-[var(--acc-accent)] bg-[${config.accentColor}1a] text-[var(--acc-accent)]" : "border border-[var(--acc-border)] bg-transparent text-[var(--acc-icon)]"}\`}
                style={{ border: isOpen ? "1.5px solid var(--acc-accent)" : "1.5px solid var(--acc-border)" }}
              >
                {ICONS[idx]}
              </div>
              <span className="flex-1">{item.title}</span>
              <div
                className={\`shrink-0 relative rounded-[1px] \${isOpen ? "bg-[var(--acc-accent)]" : "bg-[var(--acc-icon)]"}\`}
                style={{ width: "var(--acc-icon-size)", height: "2px" }}
              >
                <div
                  className="absolute w-[2px] bg-[inherit] rounded-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-[${config.animationDuration}ms]"
                  style={{
                    height: "var(--acc-icon-size)",
                    transform: \`translate(-50%, -50%) scaleY(\${isOpen ? 0 : 1})\`,
                  }}
                />
              </div>
            </button>
            {isOpen && (
              <div
                className="bg-[var(--acc-content-bg)] text-[var(--acc-content-text)] leading-[1.7]"
                style={{
                  padding: \`var(--acc-content-p) var(--acc-px) var(--acc-content-p) calc(var(--acc-px) + 46px)\`,
                  fontSize: "${contentFs}px",
                }}
              >
                {item.content}
              </div>
            )}
            {!isLast && <div className="h-px bg-[var(--acc-separator)]" />}
          </div>
        );
      })}
    </div>
  );
}`;
  }

  // nested
  return `${commonHeader}

// Baked-in CSS variable tokens — update these to reskin the Accordion
const accVars: CSSProperties = {
  "--acc-bg":              "${config.backgroundColor}",
  "--acc-border":               "${config.borderColor}",
  "--acc-radius":               "${config.itemBorderRadius}px",
  "--acc-header-bg":            "${config.headerBackground}",
  "--acc-nested-header-bg":     "${config.nestedHeaderBackground}",
  "--acc-header-text":          "${config.headerTextColor}",
  "--acc-nested-header-text":   "${config.nestedHeaderTextColor}",
  "--acc-icon":                 "${config.iconColor}",
  "--acc-icon-size":            "${config.iconSize}px",
  "--acc-accent":               "${config.accentColor}",
  "--acc-nested-accent":        "${config.nestedAccentColor}",
  "--acc-separator":            "${config.separatorColor}",
  "--acc-content-bg":           "${config.contentBackground}",
  "--acc-content-text":         "${config.contentTextColor}",
  "--acc-shadow":               "${config.shadowColor}",
  "--acc-gap":                  "${config.itemGap}px",
  "--acc-px":                   "${config.headerPaddingX}px",
  "--acc-py":                   "${config.headerPaddingY}px",
  "--acc-content-p":            "${config.contentPadding}px",
} as CSSProperties;

interface NestedChild {
  id: string;
  title: string;
  content: string;
}

interface NestedItem {
  id: string;
  title: string;
  content?: string;
  children?: NestedChild[];
}

const NESTED_ITEMS: NestedItem[] = [
  { id: "a", title: "Design System", content: "Global tokens and guidelines.", children: [
    { id: "a1", title: "Color Palette", content: "Purple accent on dark neutrals; designed for accessibility." },
    { id: "a2", title: "Typography Scale", content: "Syne for headings, Instrument Sans for body, DM Mono for code." },
  ]},
  { id: "b", title: "Components", content: "Pre-built, configurable UI primitives.", children: [
    { id: "b1", title: "Calendar", content: "Single and range selection, month/year picker, animated open." },
    { id: "b2", title: "Accordion", content: "Multiple variants: animated height, nested, bordered cards, icon reveal." },
  ]},
  { id: "c", title: "Code Generation", content: "Every customization bakes down into plain JSX + CSS." },
];

interface AccordionProps {
  onValueChange?: (openIds: string[]) => void;
}

export default function Accordion({ onValueChange }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["a"]));

  const toggle = useCallback((id: string): void => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      if (onValueChange) onValueChange([...next]);
      return next;
    });
  }, [onValueChange]);

  return (
    <div
      className="max-w-full font-[inherit] flex flex-col"
      style={{ ...accVars, width: ${config.accordionWidth}, gap: "var(--acc-gap)" } as CSSProperties}
    >
      {NESTED_ITEMS.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className="border border-[var(--acc-border)] rounded-[var(--acc-radius)] overflow-hidden"
            ${config.showShadow ? `style={{ boxShadow: "0 2px 8px var(--acc-shadow)" }}` : ""}
          >
            <button
              className="w-full flex items-center gap-[8px] bg-[var(--acc-header-bg)] border-none cursor-pointer text-[var(--acc-header-text)] text-left font-[inherit] font-semibold transition-colors duration-[${config.animationDuration}ms]"
              style={{
                padding: "var(--acc-py) var(--acc-px)",
                fontSize: "${headerFs}px",
                background: isOpen ? "var(--acc-nested-header-bg)" : "var(--acc-header-bg)",
              }}
              onClick={() => toggle(item.id)}
            >
              <div
                className="w-[3px] h-[18px] rounded-[2px] shrink-0 transition-colors duration-[${config.animationDuration}ms]"
                style={{ background: isOpen ? "var(--acc-accent)" : "transparent" }}
              />
              <span className="flex-1">{item.title}</span>
              <svg
                className={\`shrink-0 transition-transform duration-[${config.animationDuration}ms] \${isOpen ? "rotate-180 text-[var(--acc-accent)]" : "text-[var(--acc-icon)]"}\`}
                style={{ width: "var(--acc-icon-size)", height: "var(--acc-icon-size)" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div className="bg-[var(--acc-content-bg)]">
                {item.content && (
                  <p
                    className="m-0 text-[var(--acc-content-text)] leading-[1.65] border-b border-[var(--acc-separator)]"
                    style={{ padding: "12px var(--acc-px)", fontSize: "${contentFs}px" }}
                  >
                    {item.content}
                  </p>
                )}
                {item.children && (
                  <div className="flex flex-col gap-[4px] p-[8px_12px_12px]">
                    {item.children.map((child) => {
                      const childOpen = openIds.has(child.id);
                      return (
                        <div
                          key={child.id}
                          className="border border-[var(--acc-border)] rounded-[calc(var(--acc-radius)-2px)] overflow-hidden"
                        >
                          <button
                            className="w-full flex items-center justify-between border-none cursor-pointer text-left font-[inherit] font-medium transition-colors duration-[${config.animationDuration}ms]"
                            style={{
                              padding: "10px 14px",
                              fontSize: "${childHeaderFs}px",
                              color: "var(--acc-nested-header-text)",
                              background: childOpen ? "var(--acc-nested-header-bg)" : "var(--acc-header-bg)",
                            }}
                            onClick={() => toggle(child.id)}
                          >
                            <span className="flex-1">{child.title}</span>
                            <svg
                              className={\`shrink-0 transition-transform duration-[${config.animationDuration}ms] \${childOpen ? "rotate-90 text-[var(--acc-nested-accent)]" : "text-[var(--acc-icon)]"}\`}
                              style={{ width: "var(--acc-icon-size)", height: "var(--acc-icon-size)" }}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                          {childOpen && (
                            <div
                              className="bg-[var(--acc-content-bg)] text-[var(--acc-content-text)] leading-[1.65] border-t border-[var(--acc-separator)]"
                              style={{ padding: "10px 14px 14px", fontSize: "${childContentFs}px" }}
                            >
                              {child.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}`;
}
