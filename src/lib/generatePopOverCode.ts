// ─────────────────────────────────────────────
//  generatePopoverCode.ts
//  CompForge — AI Popovers
//  Generates JSX + CSS for ONE selected variant
// ─────────────────────────────────────────────

import { PopoverConfig } from "./popOverConfig";
import { PopoverVariantId } from "./popOverVariants";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────
//  Shared CSS tokens (always emitted)
// ─────────────────────────────────────────────

function sharedCSS(c: PopoverConfig): string {
  const accentGlow = hexToRgba(c.accentColor, 0.18);
  const accentDim = hexToRgba(c.accentColor, 0.08);
  const accentDimH = hexToRgba(c.accentColor, 0.12);
  const gradStart = c.gradStart;
  const gradEnd = c.gradEnd;

  return `/* ── Trigger ─────────────────────────────── */
.pop-trigger {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  font-family: ${c.fontFamily}; font-size: 0.68rem; font-weight: 500;
  color: ${c.textColor};
  background: ${accentDim};
  border: 1px solid ${c.borderColor};
  border-radius: 8px; cursor: pointer;
  transition: all 0.25s ease;
}
.pop-trigger:hover {
  background: ${accentDimH};
  border-color: ${c.accentColor};
  box-shadow: 0 0 12px ${accentGlow};
}
.pop-trigger__badge {
  display: flex; align-items: center; justify-content: center;
  width: 1rem; height: 1rem; font-size: 0.5rem; font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, ${gradStart}, ${gradEnd});
  border-radius: 50%;
}

/* ── Popover shell ───────────────────────── */
.pop {
  position: absolute;
  top: calc(100% + 10px); left: 50%;
  transform: translateX(-50%) scale(0.92) translateY(-6px);
  background: ${c.surfaceColor};
  border: 1px solid ${c.borderColor};
  border-radius: ${c.borderRadius}px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentGlow};
  z-index: 200; font-family: ${c.fontFamily};
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22,0.61,0.36,1), visibility 0.25s ease;
}
.pop--open {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: translateX(-50%) scale(1) translateY(0);
}
.pop__arrow {
  position: absolute; top: -6px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px; height: 10px;
  background: ${c.surfaceColor};
  border-top: 1px solid ${c.borderColor};
  border-left: 1px solid ${c.borderColor};
}

/* ── Shared buttons ──────────────────────── */
.pop-btn {
  font-family: ${c.fontFamily}; font-size: 0.58rem; font-weight: 600;
  padding: 0.35rem 0.65rem; border-radius: 6px; border: none; cursor: pointer;
  transition: all 0.2s ease;
}
.pop-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, ${gradStart}, ${gradEnd});
  box-shadow: 0 2px 8px ${hexToRgba(gradStart, 0.3)};
}
.pop-btn--primary:hover { filter: brightness(1.1); }
.pop-btn--ghost {
  color: ${c.textMutedColor};
  background: ${accentDim};
  border: 1px solid ${c.borderColor};
}
.pop-btn--ghost:hover { color: ${c.textColor}; background: ${accentDimH}; }
.pop-btn--full { width: 100%; }`;
}

// ─────────────────────────────────────────────
//  Variant CSS blocks
// ─────────────────────────────────────────────

function cssBasic(c: PopoverConfig): string {
  return `
/* ── Basic ───────────────────────────────── */
.pop--basic { max-width: 256px; padding: 0.85rem; overflow: hidden; }
.pop-rich__header { display: flex; gap: 0.6rem; align-items: flex-start; margin-bottom: 0.65rem; }
.pop-rich__icon {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; flex-shrink: 0; border-radius: 8px;
  background: ${c.basicIconBg}; color: #fff;
}
.pop-rich__heading { font-size: 0.72rem; font-weight: 600; color: ${c.textColor}; margin-bottom: 2px; }
.pop-rich__desc { font-size: 0.58rem; line-height: 1.5; color: ${c.textMutedColor}; }
.pop-rich__actions { display: flex; gap: 0.4rem; justify-content: flex-end; padding-top: 0.5rem; border-top: 1px solid ${c.borderColor}; }`;
}

function cssDropdown(c: PopoverConfig): string {
  const accentDim = hexToRgba(c.accentColor, 0.08);
  const accentDimH = hexToRgba(c.accentColor, 0.12);
  return `
/* ── Dropdown Transition ─────────────────── */
.pop--dropdown { min-width: 192px; max-width: 224px; padding: 0; overflow: hidden; }
.pop-dt__list { padding: 0.35rem; transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-dt__list--hidden { opacity: 0; transform: translateY(-10px); pointer-events: none; visibility: hidden; }
.pop-dt__item { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.5rem; border-radius: 6px; cursor: pointer; transition: background 0.15s ease; }
.pop-dt__item:hover { background: ${accentDim}; }
.pop-dt__item:hover .pop-dt__name { color: ${c.accentColor}; }
.pop-dt__icon { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: ${accentDim}; color: ${c.accentColor}; transition: all 0.2s ease; }
.pop-dt__item:hover .pop-dt__icon { background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); color:#fff; }
.pop-dt__info { display: flex; flex-direction: column; flex: 1; }
.pop-dt__name { font-size: 0.62rem; font-weight: 500; color: ${c.textColor}; }
.pop-dt__meta { font-size: 0.48rem; color: ${c.textMutedColor}; }
.pop-dt__detail { padding: 0.55rem; opacity: 0; transform: translateY(10px); pointer-events: none; visibility: hidden; display: none; transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-dt__detail--active { opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible; display: flex; flex-direction: column; }
.pop-dt__back { display: flex; align-items: center; gap: 4px; font-family: ${c.fontFamily}; font-size: 0.55rem; font-weight: 500; color: ${c.textMutedColor}; background: none; border: none; cursor: pointer; padding: 0.2rem 0.1rem 0.4rem; }
.pop-dt__back:hover { color: ${c.accentColor}; }
.pop-dt__detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.55rem; }
.pop-dt__detail-name { font-size: 0.72rem; font-weight: 600; background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pop-dt__detail-badge { font-size: 0.45rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); padding: 0.15rem 0.45rem; border-radius: 2rem; }
.pop-dt__stats { display: flex; gap: 4px; padding: 0.5rem 0; margin-bottom: 0.5rem; border-top: 1px solid ${c.borderColor}; border-bottom: 1px solid ${c.borderColor}; }
.pop-dt__stat { flex: 1; text-align: center; }
.pop-dt__stat-val { display: block; font-size: 0.72rem; font-weight: 700; background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pop-dt__stat-lbl { display: block; font-size: 0.45rem; color: ${c.textMutedColor}; text-transform: uppercase; letter-spacing: 0.05em; }`;
}

function cssStatus(c: PopoverConfig): string {
  return `
/* ── Training Status ─────────────────────── */
.pop--status { max-width: 256px; padding: 0.85rem; overflow: hidden; }
.pop-status__header { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.7rem; }
.pop-status__ring { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
.pop-status__svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.pop-status__fill--pulse { animation: statusPulse 2s ease-in-out infinite; }
.pop-status__pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 600; color: ${c.accentColor}; }
.pop-status__model { font-size: 0.72rem; font-weight: 600; color: ${c.textColor}; }
.pop-status__state { display: flex; align-items: center; gap: 4px; font-size: 0.62rem; color: ${c.accentColor}; font-weight: 500; margin-top: 2px; }
.pop-status__dot { width: 6px; height: 6px; border-radius: 50%; background: ${c.accentColor}; }
.pop-status__dot--blink { animation: dotBlink 1.4s ease-in-out infinite; }
.pop-status__metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.4rem; padding: 0.55rem 0; border-top: 1px solid ${c.borderColor}; border-bottom: 1px solid ${c.borderColor}; margin-bottom: 0.6rem; }
.pop-status__metric { text-align: center; }
.pop-status__val { display: block; font-size: 0.72rem; font-weight: 600; color: ${c.textColor}; }
.pop-status__lbl { display: block; font-size: 0.55rem; color: ${c.textMutedColor}; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
.pop-status__actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
@keyframes statusPulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
@keyframes dotBlink    { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`;
}

function cssUserCard(c: PopoverConfig): string {
  return `
/* ── User Card ───────────────────────────── */
.pop--usercard { max-width: 224px; padding: 0.85rem; overflow: hidden; }
.pop-user__top { display: flex; gap: 0.55rem; align-items: center; margin-bottom: 0.6rem; }
.pop-user__avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; color: #fff; border: 2px solid ${c.borderColor}; }
.pop-user__name { font-size: 0.72rem; font-weight: 600; color: ${c.textColor}; }
.pop-user__role { font-size: 0.56rem; color: ${c.textMutedColor}; }
.pop-user__stats { display: flex; padding-top: 0.55rem; border-top: 1px solid ${c.borderColor}; }
.pop-user__stat { flex: 1; text-align: center; }
.pop-user__stat-val { display: block; font-size: 0.78rem; font-weight: 700; background: linear-gradient(135deg,${c.gradStart},${c.gradEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pop-user__stat-lbl { display: block; font-size: 0.48rem; font-weight: 500; color: ${c.textMutedColor}; text-transform: uppercase; letter-spacing: 0.06em; }`;
}

function cssMenu(c: PopoverConfig): string {
  const accentDim = hexToRgba(c.accentColor, 0.08);
  return `
/* ── Nested Menu ─────────────────────────── */
.pop--menu { min-width: 128px; max-width: 160px; padding: 0.35rem; overflow: hidden; }
.pop-menu__item { display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.55rem; font-size: 0.62rem; color: ${c.textColor}; border-radius: ${c.menuItemBorderRadius}px; cursor: pointer; position: relative; transition: background 0.15s ease, color 0.15s ease; }
.pop-menu__item:hover { background: ${accentDim}; color: ${c.accentColor}; }
.pop-menu__item--danger { color: #F87171; }
.pop-menu__item--danger:hover { background: rgba(248,113,113,0.1); color: #F87171; }
.pop-menu__divider { height: 1px; background: ${c.borderColor}; margin: 0.2rem 0.4rem; }
.pop-sub { position: absolute; left: calc(100% + 4px); top: -6px; min-width: 112px; padding: 0.35rem; background: ${c.surfaceColor}; border: 1px solid ${c.borderColor}; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); opacity: 0; visibility: hidden; transform: translateX(-4px); transition: all 0.2s ease; z-index: 10; }
.pop-sub--open { opacity: 1; visibility: visible; transform: translateX(0); }`;
}

function cssNotif(c: PopoverConfig): string {
  const accentDim = hexToRgba(c.accentColor, 0.06);
  const dotGlow = hexToRgba(c.notifDotColor, 0.5);
  return `
/* ── Notification ────────────────────────── */
.pop--notif { min-width: 224px; max-width: 256px; padding: 0; overflow: hidden; }
.pop-notif__title { font-size: 0.65rem; font-weight: 600; color: ${c.textColor}; padding: 0.6rem 0.75rem 0.4rem; border-bottom: 1px solid ${c.borderColor}; }
.pop-notif__list { max-height: 160px; overflow-y: auto; }
.pop-notif__item { display: flex; gap: 0.5rem; align-items: flex-start; padding: 0.55rem 0.75rem; border-bottom: 1px solid ${c.borderColor}; cursor: pointer; transition: background 0.15s ease; }
.pop-notif__item:last-child { border-bottom: none; }
.pop-notif__item:hover { background: ${accentDim}; }
.pop-notif__item:hover .pop-notif__msg { color: ${c.accentColor}; }
.pop-notif__dot { width: 7px; height: 7px; border-radius: 50%; background: ${c.notifDotColor}; flex-shrink: 0; margin-top: 4px; box-shadow: 0 0 6px ${dotGlow}; }
.pop-notif__msg { font-size: 0.58rem; color: ${c.textColor}; line-height: 1.45; }
.pop-notif__time { font-size: 0.48rem; color: ${c.textMutedColor}; margin-top: 2px; }`;
}

function cssCommand(c: PopoverConfig): string {
  const accentDim = hexToRgba(c.accentColor, 0.08);
  return `
/* ── Command Palette ─────────────────────── */
.pop--command { min-width: 224px; max-width: 256px; padding: 0; overflow: hidden; }
.pop-cmd__search { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 0.65rem; border-bottom: 1px solid ${c.borderColor}; }
.pop-cmd__input { width: 100%; font-family: ${c.fontFamily}; font-size: 0.62rem; color: ${c.textColor}; background: transparent; border: none; outline: none; }
.pop-cmd__input::placeholder { color: ${c.textMutedColor}; opacity: 0.6; }
.pop-cmd__list { padding: 0.2rem 0.35rem 0.35rem; }
.pop-cmd__group-label { font-size: 0.48rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${c.textMutedColor}; padding: 0.45rem 0.45rem 0.2rem; }
.pop-cmd__item { display: flex; align-items: center; gap: 0.45rem; padding: 0.4rem 0.45rem; font-size: 0.6rem; color: ${c.textColor}; border-radius: 6px; cursor: pointer; transition: all 0.15s ease; }
.pop-cmd__item:hover { background: ${accentDim}; ${c.cmdAccentOnHover ? `color: ${c.accentColor};` : ""} }
.pop-cmd__kbd { margin-left: auto; }
.pop-cmd__kbd kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 1.1rem; height: 1.1rem; padding: 0 0.2rem; font-family: ${c.fontFamily}; font-size: 0.45rem; font-weight: 600; color: ${c.textMutedColor}; background: rgba(255,255,255,0.04); border: 1px solid ${c.borderColor}; border-radius: 4px; margin-left: 2px; }
.pop-cmd__empty { font-size: 0.58rem; color: ${c.textMutedColor}; text-align: center; padding: 0.75rem; }`;
}

function cssTokens(c: PopoverConfig): string {
  const accentDim = hexToRgba(c.accentColor, 0.12);
  return `
/* ── Token Breakdown ─────────────────────── */
.pop--tokens { min-width: 232px; max-width: 256px; padding: 0.85rem; overflow: hidden; }
.pop-tok__header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.65rem; }
.pop-tok__title { font-size: 0.72rem; font-weight: 600; color: ${c.textColor}; }
.pop-tok__total { font-size: 0.55rem; color: ${c.textMutedColor}; font-weight: 500; }
.pop-tok__bars { display: flex; flex-direction: column; gap: 0.55rem; }
.pop-tok__row-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.pop-tok__label { font-size: 0.6rem; font-weight: 500; color: ${c.textColor}; }
.pop-tok__count { font-size: 0.55rem; font-weight: 600; color: ${c.textMutedColor}; font-variant-numeric: tabular-nums; }
.pop-tok__track { width: 100%; height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden; }
.pop-tok__bar { height: 100%; border-radius: 3px; }
.pop-tok__bar--animate { animation: barGrow 0.6s cubic-bezier(0.22,0.61,0.36,1) both; }
.pop-tok__bar--system { background: ${c.tokSystemColor}; }
.pop-tok__bar--prompt { background: linear-gradient(90deg,${c.tokPromptColorStart},${c.tokPromptColorEnd}); animation-delay: 0.07s; }
.pop-tok__bar--completion { background: linear-gradient(90deg,${c.tokCompletionColorStart},${c.tokCompletionColorEnd}); animation-delay: 0.14s; }
.pop-tok__footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.7rem; padding-top: 0.6rem; border-top: 1px solid ${c.borderColor}; }
.pop-tok__cost { display: flex; flex-direction: column; gap: 2px; }
.pop-tok__cost-label { font-size: 0.5rem; color: ${c.textMutedColor}; text-transform: uppercase; letter-spacing: 0.05em; }
.pop-tok__cost-val { font-size: 0.82rem; font-weight: 700; color: ${c.accentColor}; }
.pop-tok__model-badge { font-size: 0.5rem; font-weight: 600; color: ${c.accentColor}; background: ${accentDim}; padding: 0.2rem 0.5rem; border-radius: 2rem; border: 1px solid ${c.accentColor}; opacity: 0.8; }
@keyframes barGrow { from { width: 0; } }`;
}

// ─────────────────────────────────────────────
//  JSX Generators
// ─────────────────────────────────────────────

function jsxSharedHeader(c: PopoverConfig, variant: string): string {
  return `import { useState, useEffect, useRef } from "react";
import "./Popover.css";

/* ── Config (baked from CompForge) ── */
const CFG = {
  accent:       "${c.accentColor}",
  gradStart:    "${c.gradStart}",
  gradEnd:      "${c.gradEnd}",
  surface:      "${c.surfaceColor}",
  border:       "${c.borderColor}",
  text:         "${c.textColor}",
  textMuted:    "${c.textMutedColor}",
  radius:       ${c.borderRadius},
  font:         "${c.fontFamily}",
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return \`rgba(\${r},\${g},\${b},\${alpha})\`;
}
`;
}

function jsxShell(): string {
  return `
function PopShell({ isOpen, children, cls = "", minWidth = 160, maxWidth = 240, padding = "0.75rem 0.85rem" }) {
  return (
    <div className={\`pop \${cls} \${isOpen ? "pop--open" : ""}\`}
      style={{ minWidth, maxWidth, padding, fontFamily: CFG.font }}>
      {children}
      <div className="pop__arrow" />
    </div>
  );
}

function TriggerBtn({ onClick, children, badge }) {
  return (
    <button className="pop-trigger" onClick={onClick} style={{ fontFamily: CFG.font }}>
      {children}
      {badge !== undefined && <span className="pop-trigger__badge">{badge}</span>}
    </button>
  );
}

function PopBtn({ variant, onClick, full, children }) {
  return (
    <button className={\`pop-btn pop-btn--\${variant}\${full ? " pop-btn--full" : ""}\`}
      onClick={onClick} style={{ fontFamily: CFG.font }}>
      {children}
    </button>
  );
}
`;
}

function jsxBasic(c: PopoverConfig): string {
  return `
function BasicPopover({ isOpen, close }) {
  return (
    <PopShell isOpen={isOpen} cls="pop--basic" maxWidth={256} padding="0.85rem">
      <div className="pop-rich__header">
        <span className="pop-rich__icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/>
            <circle cx="12" cy="15" r="2"/>
          </svg>
        </span>
        <div>
          <p className="pop-rich__heading">${c.basicHeading}</p>
          <p className="pop-rich__desc">${c.basicDescription}</p>
        </div>
      </div>
      <div className="pop-rich__actions">
        <PopBtn variant="ghost" onClick={close}>Dismiss</PopBtn>
        <PopBtn variant="primary">Learn More</PopBtn>
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>Details</TriggerBtn>
      <BasicPopover isOpen={open} close={() => setOpen(false)} />
    </div>
  );
}`;
}

function jsxDropdown(c: PopoverConfig): string {
  const modelsJson = JSON.stringify(c.dtModels, null, 2);
  return `
const MODELS = ${modelsJson};

function DropdownPopover({ isOpen }) {
  const [activeDetail, setActiveDetail] = useState(null);
  useEffect(() => { if (!isOpen) setTimeout(() => setActiveDetail(null), 300); }, [isOpen]);

  return (
    <PopShell isOpen={isOpen} cls="pop--dropdown" minWidth={192} maxWidth={224} padding="0">
      <div className={\`pop-dt__list \${activeDetail !== null ? "pop-dt__list--hidden" : ""}\`}>
        {MODELS.map((m, i) => (
          <div key={i} className="pop-dt__item" onClick={() => setActiveDetail(i)}>
            <span className="pop-dt__icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m-7.07-14.93l2.83 2.83m8.48 8.48l2.83 2.83m-16.97 0l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            </span>
            <div className="pop-dt__info">
              <span className="pop-dt__name">{m.name}</span>
              <span className="pop-dt__meta">{m.context} context</span>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
      {MODELS.map((m, i) => (
        <div key={i} className={\`pop-dt__detail \${activeDetail === i ? "pop-dt__detail--active" : ""}\`}>
          <button className="pop-dt__back" onClick={() => setActiveDetail(null)}>‹ Back</button>
          <div className="pop-dt__detail-header">
            <span className="pop-dt__detail-name">{m.name}</span>
            <span className="pop-dt__detail-badge">{m.provider}</span>
          </div>
          ${
            c.dtShowStats
              ? `<div className="pop-dt__stats">
            {[["Context", m.context], ["Price", m.price + "/1M"], ["Latency", m.latency]].map(([lbl, val]) => (
              <div key={lbl} className="pop-dt__stat">
                <span className="pop-dt__stat-val">{val}</span>
                <span className="pop-dt__stat-lbl">{lbl}</span>
              </div>
            ))}
          </div>`
              : ""
          }
          <PopBtn variant="primary" full>Select Model</PopBtn>
        </div>
      ))}
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>Select Model</TriggerBtn>
      <DropdownPopover isOpen={open} />
    </div>
  );
}`;
}

function jsxStatus(c: PopoverConfig): string {
  const circ = (2 * Math.PI * 16).toFixed(2);
  const offset = (2 * Math.PI * 16 * (1 - c.statusProgress / 100)).toFixed(2);
  return `
function StatusPopover({ isOpen, close }) {
  return (
    <PopShell isOpen={isOpen} cls="pop--status" maxWidth={256} padding="0.85rem">
      <div className="pop-status__header">
        <div className="pop-status__ring">
          <svg viewBox="0 0 40 40" className="pop-status__svg">
            <circle cx="20" cy="20" r="16" fill="none" stroke={CFG.border} strokeWidth="3"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke={CFG.accent} strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={${circ}}
              strokeDashoffset={${offset}}
              className="${c.statusAnimatePulse ? "pop-status__fill--pulse" : ""}"/>
          </svg>
          <span className="pop-status__pct">${c.statusProgress}%</span>
        </div>
        <div>
          <p className="pop-status__model">${c.statusModelName}</p>
          <p className="pop-status__state">
            <span className="pop-status__dot${c.statusAnimatePulse ? " pop-status__dot--blink" : ""}"/>
            Training
          </p>
        </div>
      </div>
      <div className="pop-status__metrics">
        {[["Loss","${c.statusLoss}"],["Accuracy","${c.statusAccuracy}"],["Epoch","${c.statusEpoch}"]].map(([lbl,val]) => (
          <div key={lbl} className="pop-status__metric">
            <span className="pop-status__val">{val}</span>
            <span className="pop-status__lbl">{lbl}</span>
          </div>
        ))}
      </div>
      <div className="pop-status__actions">
        <PopBtn variant="ghost" onClick={close}>⏸ Pause</PopBtn>
        <PopBtn variant="primary">View Logs</PopBtn>
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>Status</TriggerBtn>
      <StatusPopover isOpen={open} close={() => setOpen(false)} />
    </div>
  );
}`;
}

function jsxUserCard(c: PopoverConfig): string {
  return `
function UserCardPopover({ isOpen }) {
  const stats = [["${c.userStat1Label}","${c.userStat1Value}"],["${c.userStat2Label}","${c.userStat2Value}"],["${c.userStat3Label}","${c.userStat3Value}"]];
  return (
    <PopShell isOpen={isOpen} cls="pop--usercard" maxWidth={224} padding="0.85rem">
      <div className="pop-user__top">
        <div className="pop-user__avatar">${c.userInitial}</div>
        <div>
          <p className="pop-user__name">${c.userName}</p>
          <p className="pop-user__role">${c.userRole}</p>
        </div>
      </div>
      <div className="pop-user__stats">
        {stats.map(([lbl,val]) => (
          <div key={lbl} className="pop-user__stat">
            <span className="pop-user__stat-val">{val}</span>
            <span className="pop-user__stat-lbl">{lbl}</span>
          </div>
        ))}
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>@${c.userName.split(" ")[0].toLowerCase()}_ai</TriggerBtn>
      <UserCardPopover isOpen={open} />
    </div>
  );
}`;
}

function jsxMenu(c: PopoverConfig): string {
  const formats = JSON.stringify(
    c.menuExportFormats
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return `
const FORMATS = ${formats};

function MenuPopover({ isOpen }) {
  const [subOpen, setSubOpen] = useState(false);
  return (
    <PopShell isOpen={isOpen} cls="pop--menu" minWidth={128} maxWidth={160} padding="0.35rem">
      ${
        c.menuShowExport
          ? `<div className="pop-menu__item" onMouseEnter={() => setSubOpen(true)} onMouseLeave={() => setSubOpen(false)}>
        <span>Export</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <div className={\`pop-sub \${subOpen ? "pop-sub--open" : ""}\`}>
          {FORMATS.map(f => <div key={f} className="pop-menu__item">{f}</div>)}
        </div>
      </div>`
          : ""
      }
      <div className="pop-menu__item">Duplicate</div>
      <div className="pop-menu__item">Archive</div>
      <div className="pop-menu__divider"/>
      <div className="pop-menu__item pop-menu__item--danger">${c.menuDangerLabel}</div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>Actions</TriggerBtn>
      <MenuPopover isOpen={open} />
    </div>
  );
}`;
}

function jsxNotif(c: PopoverConfig): string {
  const notifsJson = JSON.stringify(c.notifications, null, 2);
  const unread = c.notifications.filter((n) => n.unread).length;
  return `
const NOTIFICATIONS = ${notifsJson};

function NotifPopover({ isOpen }) {
  return (
    <PopShell isOpen={isOpen} cls="pop--notif" minWidth={224} maxWidth={256} padding="0">
      <p className="pop-notif__title">Notifications</p>
      <div className="pop-notif__list">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className="pop-notif__item">
            ${c.notifShowDot ? `{n.unread && <div className="pop-notif__dot"/>}` : ""}
            <div>
              <p className="pop-notif__msg">{n.message}</p>
              <p className="pop-notif__time">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)} badge={${unread}}>🔔</TriggerBtn>
      <NotifPopover isOpen={open} />
    </div>
  );
}`;
}

function jsxCommand(c: PopoverConfig): string {
  const cmdsJson = JSON.stringify(c.commands, null, 2);
  return `
const COMMANDS = ${cmdsJson};

function CommandPopover({ isOpen }) {
  const [query, setQuery] = useState("");
  useEffect(() => { if (!isOpen) setQuery(""); }, [isOpen]);
  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <PopShell isOpen={isOpen} cls="pop--command" minWidth={224} maxWidth={256} padding="0">
      <div className="pop-cmd__search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c.textMutedColor}" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input className="pop-cmd__input" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Type a command..." style={{ fontFamily: CFG.font }}/>
      </div>
      <div className="pop-cmd__list">
        <div className="pop-cmd__group-label">Actions</div>
        {filtered.length === 0 && <p className="pop-cmd__empty">No commands found</p>}
        {filtered.map((cmd, i) => (
          <div key={i} className="pop-cmd__item">
            <span>{cmd.label}</span>
            ${
              c.cmdShowKbd
                ? `<span className="pop-cmd__kbd">
              {cmd.kbd.split("").map((k, j) => <kbd key={j}>{k}</kbd>)}
            </span>`
                : ""
            }
          </div>
        ))}
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>⌘K</TriggerBtn>
      <CommandPopover isOpen={open} />
    </div>
  );
}`;
}

function jsxTokens(c: PopoverConfig): string {
  const total = c.tokSystemCount + c.tokPromptCount + c.tokCompletionCount;
  const maxTok = Math.max(
    c.tokSystemCount,
    c.tokPromptCount,
    c.tokCompletionCount,
  );
  const cost = ((total / 1_000_000) * 15).toFixed(3);
  return `
function TokensPopover({ isOpen }) {
  const total = ${total};
  const bars = [
    { label: "System",     count: ${c.tokSystemCount},     pct: ${Math.round((c.tokSystemCount / maxTok) * 100)}, cls: "pop-tok__bar--system" },
    { label: "Prompt",     count: ${c.tokPromptCount},     pct: ${Math.round((c.tokPromptCount / maxTok) * 100)}, cls: "pop-tok__bar--prompt" },
    { label: "Completion", count: ${c.tokCompletionCount}, pct: ${Math.round((c.tokCompletionCount / maxTok) * 100)}, cls: "pop-tok__bar--completion" },
  ];
  return (
    <PopShell isOpen={isOpen} cls="pop--tokens" minWidth={232} maxWidth={256} padding="0.85rem">
      <div className="pop-tok__header">
        <p className="pop-tok__title">Token Usage</p>
        <span className="pop-tok__total">{total.toLocaleString()} tokens</span>
      </div>
      <div className="pop-tok__bars">
        {bars.map(bar => (
          <div key={bar.label} className="pop-tok__row">
            <div className="pop-tok__row-top">
              <span className="pop-tok__label">{bar.label}</span>
              <span className="pop-tok__count">{bar.count.toLocaleString()}</span>
            </div>
            <div className="pop-tok__track">
              <div className={\`pop-tok__bar \${bar.cls}${c.tokAnimateBars ? " pop-tok__bar--animate" : ""}\`}
                style={{ width: bar.pct + "%" }}/>
            </div>
          </div>
        ))}
      </div>
      <div className="pop-tok__footer">
        <div className="pop-tok__cost">
          <span className="pop-tok__cost-label">Estimated cost</span>
          <span className="pop-tok__cost-val">$${cost}</span>
        </div>
        <span className="pop-tok__model-badge">${c.tokModelName}</span>
      </div>
    </PopShell>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <TriggerBtn onClick={() => setOpen(p => !p)}>$0.042</TriggerBtn>
      <TokensPopover isOpen={open} />
    </div>
  );
}`;
}

// ─────────────────────────────────────────────
//  Public exports
// ─────────────────────────────────────────────

export function generatePopoverJSX(
  config: PopoverConfig,
  variant: PopoverVariantId,
): string {
  const header = jsxSharedHeader(config, variant) + jsxShell();
  switch (variant) {
    case "basic":
      return header + jsxBasic(config);
    case "dropdown":
      return header + jsxDropdown(config);
    case "status":
      return header + jsxStatus(config);
    case "usercard":
      return header + jsxUserCard(config);
    case "menu":
      return header + jsxMenu(config);
    case "notif":
      return header + jsxNotif(config);
    case "command":
      return header + jsxCommand(config);
    case "tokens":
      return header + jsxTokens(config);
  }
}

export function generatePopoverCSS(
  config: PopoverConfig,
  variant: PopoverVariantId,
): string {
  const base =
    `/* ─── AI Popover — ${variant} — generated by CompForge ─── */\n\n` +
    sharedCSS(config);
  switch (variant) {
    case "basic":
      return base + cssBasic(config);
    case "dropdown":
      return base + cssDropdown(config);
    case "status":
      return base + cssStatus(config);
    case "usercard":
      return base + cssUserCard(config);
    case "menu":
      return base + cssMenu(config);
    case "notif":
      return base + cssNotif(config);
    case "command":
      return base + cssCommand(config);
    case "tokens":
      return base + cssTokens(config);
  }
}
