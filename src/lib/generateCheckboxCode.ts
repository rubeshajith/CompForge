import { CheckboxConfig, CheckboxVariant } from "./checkboxConfig";

// ─── Shared path helper ───────────────────────────────────────────────────────

function checkPath(s: number): string {
  return `M${(s * 0.22).toFixed(1)} ${(s * 0.5).toFixed(1)} L${(s * 0.42).toFixed(1)} ${(s * 0.7).toFixed(1)} L${(s * 0.78).toFixed(1)} ${(s * 0.3).toFixed(1)}`;
}

function scribblePath(s: number): string {
  return `M${(s * 0.18).toFixed(1)} ${(s * 0.52).toFixed(1)} C${(s * 0.26).toFixed(1)} ${(s * 0.44).toFixed(1)} ${(s * 0.32).toFixed(1)} ${(s * 0.72).toFixed(1)} ${(s * 0.42).toFixed(1)} ${(s * 0.72).toFixed(1)} C${(s * 0.5).toFixed(1)} ${(s * 0.72).toFixed(1)} ${(s * 0.56).toFixed(1)} ${(s * 0.58).toFixed(1)} ${(s * 0.65).toFixed(1)} ${(s * 0.42).toFixed(1)} L${(s * 0.82).toFixed(1)} ${(s * 0.26).toFixed(1)}`;
}

// ─── Per-variant JSX body ─────────────────────────────────────────────────────

function variantJSX(v: CheckboxVariant, c: CheckboxConfig): string {
  const s = c.size;
  const br = c.borderRadius;
  const ubg = c.uncheckedBackground;
  const ubc = c.uncheckedBorderColor;
  const ubw = c.uncheckedBorderWidth;
  const cbg = c.checkedBackground;
  const cbc = c.checkedBorderColor;
  const ckc = c.checkmarkColor;
  const acc = c.accentColor;
  const acc2 = c.accentSecondary;
  const cp = checkPath(s);
  const sp = scribblePath(s);

  switch (v) {
    case "morph":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--morph"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", borderRadius: checked ? ${br + 4} : ${br} }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path
            d="${cp}"
            fill="none" stroke="${ckc}" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1) 0.05s" }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "stamp":
      return `
function Checkbox({ checked, onChange, label }) {
  const [key, setKey] = React.useState(0);
  function handleClick() { onChange(); if (!checked) setKey(k => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--stamp"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: checked ? "cbx-stamp 0.35s cubic-bezier(.4,0,.2,1)" : "none" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "slide":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--slide"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <g style={{ transform: checked ? "translateX(0)" : "translateX(-110%)", transition: "transform 0.28s cubic-bezier(.4,0,.2,1)" }}>
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "ripple":
      return `
function Checkbox({ checked, onChange, label }) {
  const [ripple, setRipple] = React.useState(false);
  function handleClick() {
    onChange();
    if (!checked) { setRipple(false); requestAnimationFrame(() => setRipple(true)); }
  }
  return (
    <label className="cbx__wrap">
      <div className="cbx__ripple-wrap">
        {ripple && <span className="cbx__ripple" onAnimationEnd={() => setRipple(false)} />}
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", position: "relative", zIndex: 1 }}
          onClick={handleClick}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="28"
              style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.28s ease 0.05s" }} />
          </svg>
        </button>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "neon":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className={\`cbx__box cbx__box--neon \${checked ? "cbx__box--neon-on" : ""}\`}
        style={{
          background: checked ? "${acc}18" : "${ubg}",
          borderColor: checked ? "${acc}" : "${ubc}",
          boxShadow: checked ? "0 0 8px 2px ${acc}88, 0 0 20px 4px ${acc}44" : "none",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none"
            stroke={checked ? "${acc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{
              strokeDashoffset: checked ? 0 : 28,
              transition: "stroke-dashoffset 0.3s ease, stroke 0.1s",
              filter: checked ? "drop-shadow(0 0 3px ${acc})" : "none",
              animation: checked ? "cbx-neon-flicker 3s ease-in-out infinite" : "none",
            }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "flip":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <div className="cbx__flip-scene" onClick={onChange}>
        <div className="cbx__flip-card" style={{ transform: checked ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div className="cbx__flip-front" style={{ borderColor: "${ubc}", background: "${ubg}" }} />
          <div className="cbx__flip-back" style={{ borderColor: "${cbc}", background: "${cbg}" }}>
            <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
              <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "scribble":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <path d="${sp}" fill="none" stroke="${ckc}" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="52"
            style={{ strokeDashoffset: checked ? 0 : 52, transition: "stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "glitch":
      return `
function Checkbox({ checked, onChange, label }) {
  const [glitching, setGlitching] = React.useState(false);
  function handleClick() { onChange(); setGlitching(true); setTimeout(() => setGlitching(false), 500); }
  return (
    <label className="cbx__wrap">
      <div className="cbx__glitch-wrap" onClick={handleClick}>
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s" }} />
          </svg>
        </button>
        {glitching && <>
          <div className="cbx__glitch-layer cbx__glitch-layer--1" style={{ background: "${acc}" }} />
          <div className="cbx__glitch-layer cbx__glitch-layer--2" style={{ background: "${acc2}" }} />
        </>}
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "elastic":
      return `
function Checkbox({ checked, onChange, label }) {
  const [key, setKey] = React.useState(0);
  function handleClick() { onChange(); setKey(k => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--elastic"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: "cbx-elastic 0.5s cubic-bezier(.4,0,.2,1)" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.25s ease 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "unfold":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--unfold"
        style={{ background: "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <div className="cbx__unfold-fill" style={{
          background: "${cbg}",
          clipPath: checked ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 0,0 0,0 100%,0 100%)",
        }} />
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ position: "relative", zIndex: 1 }}>
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"} strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.25s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;
  }
}

// ─── Demo wrapper (5 items) ───────────────────────────────────────────────────

const DEMO_LABELS = [
  "Notifications enabled",
  "Save to drafts",
  "Share analytics",
  "Dark mode",
  "Auto-update",
];

function demoApp(c: CheckboxConfig): string {
  const items = DEMO_LABELS.map(
    (lbl, i) => `  { id: ${i + 1}, label: "${lbl}", checked: ${i % 3 === 0} },`,
  ).join("\n");

  return `
export default function CheckboxDemo() {
  const [items, setItems] = React.useState([
${items}
  ]);

  function toggle(id) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  return (
    <div className="cbx__demo">
      {items.map(item => (
        <Checkbox
          key={item.id}
          checked={item.checked}
          onChange={() => toggle(item.id)}
          label={${c.showLabels ? "item.label" : "null"}}
        />
      ))}
    </div>
  );
}`;
}

// ─── JSX Generator ────────────────────────────────────────────────────────────

export function generateCheckboxJSX(config: CheckboxConfig): string {
  return [
    `import React, { useState } from "react";`,
    `import "./Checkbox.css";`,
    ``,
    variantJSX(config.variant, config),
    demoApp(config),
  ].join("\n");
}

// ─── CSS Generator ────────────────────────────────────────────────────────────

export function generateCheckboxCSS(config: CheckboxConfig): string {
  const {
    size: s,
    borderRadius: br,
    uncheckedBorderWidth: ubw,
    labelColor: lc,
    labelFontSize: lfs,
    labelGap: lg,
    itemGap: ig,
    accentColor: acc,
    accentSecondary: acc2,
  } = config;

  const v = config.variant;

  const keyframes: Record<CheckboxVariant, string> = {
    morph: ``,
    stamp: `
@keyframes cbx-stamp {
  0%   { transform: scale(1.5); opacity: 0; }
  60%  { transform: scale(0.88); }
  100% { transform: scale(1); opacity: 1; }
}`,
    slide: ``,
    ripple: `
@keyframes cbx-ripple {
  0%   { transform: scale(0); opacity: 0.7; }
  100% { transform: scale(2.8); opacity: 0; }
}`,
    neon: `
@keyframes cbx-neon-flicker {
  0%  { opacity: 1; }  5%  { opacity: 0.4; } 10% { opacity: 1; }
  15% { opacity: 0.6; } 20% { opacity: 1; }  75% { opacity: 1; }
  76% { opacity: 0.3; } 77% { opacity: 1; }  100%{ opacity: 1; }
}
@keyframes cbx-neon-glow {
  0%, 100% { box-shadow: 0 0 6px 2px ${acc}, 0 0 16px 4px ${acc}; }
  50%       { box-shadow: 0 0 10px 4px ${acc}, 0 0 28px 8px ${acc}; }
}`,
    flip: ``,
    scribble: ``,
    glitch: `
@keyframes cbx-glitch-1 {
  0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
  40%     { clip-path: inset(14px 0 2px 0); transform: translate(2px,0); }
  60%     { clip-path: inset(6px 0 10px 0); transform: translate(-1px,0); }
}
@keyframes cbx-glitch-2 {
  0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20%     { clip-path: inset(14px 0 2px 0); transform: translate(3px,0); }
  40%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
  60%     { clip-path: inset(10px 0 6px 0); transform: translate(1px,0); }
}`,
    elastic: `
@keyframes cbx-elastic {
  0%   { transform: scale(1); }
  20%  { transform: scale(0.7, 1.3); }
  40%  { transform: scale(1.3, 0.7); }
  55%  { transform: scale(0.88, 1.1); }
  70%  { transform: scale(1.05, 0.95); }
  100% { transform: scale(1); }
}`,
    unfold: ``,
  };

  const variantCSS: Record<CheckboxVariant, string> = {
    morph: `
.cbx__box--morph {
  transition: background 0.28s cubic-bezier(.4,0,.2,1),
              border-color 0.28s,
              border-radius 0.28s;
}`,
    stamp: `
.cbx__box--stamp {
  transition: background 0.15s, border-color 0.15s;
}`,
    slide: `
.cbx__box--slide {
  overflow: hidden;
  transition: background 0.22s, border-color 0.22s;
}`,
    ripple: `
.cbx__ripple-wrap {
  position: relative;
  width: ${s}px;
  height: ${s}px;
  flex-shrink: 0;
}
.cbx__ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${acc}55;
  animation: cbx-ripple 0.55s ease-out forwards;
  pointer-events: none;
}`,
    neon: `
.cbx__box--neon {
  transition: background 0.2s, border-color 0.2s, box-shadow 0.3s;
}
.cbx__box--neon-on {
  animation: cbx-neon-glow 1.8s ease-in-out infinite;
}`,
    flip: `
.cbx__flip-scene {
  width: ${s}px;
  height: ${s}px;
  perspective: 80px;
  flex-shrink: 0;
  cursor: pointer;
}
.cbx__flip-card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(.4,0,.2,1);
  position: relative;
}
.cbx__flip-front,
.cbx__flip-back {
  position: absolute;
  inset: 0;
  border-radius: ${br}px;
  border: ${ubw}px solid;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cbx__flip-back {
  transform: rotateY(180deg);
}`,
    scribble: `
.cbx__box {
  transition: background 0.22s, border-color 0.22s;
}`,
    glitch: `
.cbx__glitch-wrap {
  position: relative;
  width: ${s}px;
  height: ${s}px;
  flex-shrink: 0;
  cursor: pointer;
}
.cbx__glitch-layer {
  position: absolute;
  inset: 0;
  border-radius: ${br}px;
  pointer-events: none;
}
.cbx__glitch-layer--1 {
  opacity: 0.55;
  animation: cbx-glitch-1 0.45s steps(1) forwards;
}
.cbx__glitch-layer--2 {
  opacity: 0.45;
  animation: cbx-glitch-2 0.45s steps(1) 0.05s forwards;
}`,
    elastic: `
.cbx__box--elastic {
  transition: background 0.15s, border-color 0.15s;
}`,
    unfold: `
.cbx__box--unfold {
  position: relative;
  overflow: hidden;
  transition: border-color 0.22s;
}
.cbx__unfold-fill {
  position: absolute;
  inset: 0;
  transition: clip-path 0.35s cubic-bezier(.4,0,.2,1);
}`,
  };

  return `
/* ── Keyframes ────────────────────────────────────────────────── */
${keyframes[v]}

/* ── Demo Layout ──────────────────────────────────────────────── */
.cbx__demo {
  display: flex;
  flex-direction: column;
  gap: ${ig}px;
  padding: 32px;
  font-family: "Instrument Sans", sans-serif;
}

/* ── Row ──────────────────────────────────────────────────────── */
.cbx__wrap {
  display: flex;
  align-items: center;
  gap: ${lg}px;
  cursor: pointer;
  user-select: none;
}

/* ── Base Box ─────────────────────────────────────────────────── */
.cbx__box {
  width: ${s}px;
  height: ${s}px;
  border-radius: ${br}px;
  border: ${ubw}px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  outline: none;
}

/* ── Label ────────────────────────────────────────────────────── */
.cbx__label {
  color: ${lc};
  font-size: ${lfs}px;
  line-height: 1.3;
}

/* ── Variant-specific ─────────────────────────────────────────── */
${variantCSS[v]}
`.trim();
}
