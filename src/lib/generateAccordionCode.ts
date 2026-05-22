// lib/generateAccordionCode.ts

import { AccordionConfig, AccordionVariant } from "./accordionConfig";

// ─── JSX Generator ────────────────────────────────────────────────────────────

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

// ─── CSS Generator ────────────────────────────────────────────────────────────

export function generateAccordionCSS(config: AccordionConfig): string {
  const { variant } = config;

  const base = `/* Accordion — ${VARIANT_LABEL[variant]} variant */

.acc-wrap {
  max-width: 100%;
  font-family: 'Instrument Sans', system-ui, sans-serif;
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
