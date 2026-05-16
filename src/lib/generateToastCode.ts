// /lib/generateToastCode.ts

import { ToastConfig, ToastVariant, ToastPosition } from "./toastConfig";

// ─── Position → CSS ────────────────────────────────────────────────
function positionToCss(position: ToastPosition): string {
  switch (position) {
    case "top-right":
      return "top: 1rem; right: 1rem;";
    case "top-left":
      return "top: 1rem; left: 1rem;";
    case "bottom-right":
      return "bottom: 1rem; right: 1rem;";
    case "bottom-left":
      return "bottom: 1rem; left: 1rem;";
  }
}

// ─── Entrance animation per variant ───────────────────────────────
function variantAnimation(variant: ToastVariant): string {
  const map: Record<ToastVariant, string> = {
    success: "toast-slide-right 0.45s cubic-bezier(0.22,1,0.36,1) both",
    loading: "toast-glow-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
    countdown: "toast-pulse-in 0.55s cubic-bezier(0.22,1,0.36,1) both",
    multistep: "toast-cascade 0.5s cubic-bezier(0.22,1,0.36,1) both",
    progress: "toast-slide-left 0.45s cubic-bezier(0.22,1,0.36,1) both",
    action: "toast-slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
    gradient: "toast-sweep-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
    promise: "toast-morph 0.5s cubic-bezier(0.22,1,0.36,1) both",
    error: "toast-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both",
    streaming: "toast-flip-in 0.55s cubic-bezier(0.22,1,0.36,1) both",
  };
  return map[variant];
}

// ─── JSX code generator ────────────────────────────────────────────
export function generateToastJSX(config: ToastConfig): string {
  const {
    variant,
    position,
    title,
    message,
    actionLabel,
    iconColor,
    accentColor,
    backgroundColor,
    borderColor,
    titleColor,
    messageColor,
    borderRadius,
    showProgressBar,
    autoDismissDuration,
    showCloseButton,
  } = config;

  const posCSS = positionToCss(position);
  const anim = variantAnimation(variant);
  const isGradient = variant === "gradient";
  const hasTopBorder = variant === "success" || variant === "error";
  const topBorderColor = variant === "success" ? "#4ade80" : "#f87171";

  const progressBarSection =
    showProgressBar &&
    (variant === "progress" || variant === "success" || variant === "action")
      ? `
  {/* Progress bar */}
  <div className="toast__progress">
    <div className="toast__progress-bar" />
  </div>`
      : "";

  const closeSection = showCloseButton
    ? `
  <button className="toast__close" onClick={dismiss} aria-label="Close">
    <XIcon />
  </button>`
    : "";

  const actionSection =
    variant === "action"
      ? `
  <button className="toast__action" onClick={dismiss}>${actionLabel}</button>`
      : "";

  // Build variant-specific content section
  let contentBody = "";

  switch (variant) {
    case "countdown":
      contentBody = `
        <p className="toast__title">{countdownDone ? "Limit Reset" : "${title}"}</p>
        <p className="toast__message">
          {countdownDone
            ? "Ready — send your request."
            : <>Retry in <strong style={{ color: "#f97316" }}>{countdown}s</strong>...</>
          }
        </p>`;
      break;

    case "multistep":
      contentBody = `
        <p className="toast__title">{pipelineDone ? "Pipeline Complete" : "${title}"}</p>
        <div className="toast__steps">
          {STEPS.map((step, i) => (
            <span key={step} className={\`toast__step \${stepsDone.includes(i) ? "done" : activeStep === i ? "active" : ""}\`}>
              <span className="toast__step-dot" />
              {step}
            </span>
          ))}
        </div>`;
      break;

    case "streaming":
      contentBody = `
        <p className="toast__title">{streamDone ? "Response Complete" : "${title}"}</p>
        <p className={\`toast__message \${streamDone ? "" : "toast__message--streaming"}\`}>
          <span className="toast__typed">{streamedText}</span>
        </p>`;
      break;

    case "promise":
      contentBody = `
        <p className="toast__title">{resolved ? "Scan Passed" : "${title}"}</p>
        <p className="toast__message" style={{ color: resolved ? "#4ade80" : undefined }}>
          {resolved ? "No hallucinations detected. Output verified." : "${message}"}
        </p>`;
      break;

    default:
      contentBody = `
        <p className="toast__title">${title}</p>
        <p className="toast__message">${message}</p>`;
  }

  // Build hooks section per variant
  let hooksSection = "";
  switch (variant) {
    case "countdown":
      hooksSection = `
  const [countdown, setCountdown] = useState(5);
  const [countdownDone, setCountdownDone] = useState(false);

  useEffect(() => {
    if (countdownDone) return;
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setCountdownDone(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [countdownDone]);`;
      break;

    case "multistep":
      hooksSection = `
  const STEPS = ["Tokenize", "Embed", "Classify"];
  const [activeStep, setActiveStep] = useState(0);
  const [stepsDone, setStepsDone] = useState([]);
  const [pipelineDone, setPipelineDone] = useState(false);

  useEffect(() => {
    if (pipelineDone) return;
    const iv = setInterval(() => {
      setStepsDone((prev) => [...prev, activeStep]);
      setActiveStep((i) => {
        const next = i + 1;
        if (next >= STEPS.length) setPipelineDone(true);
        return next;
      });
    }, 1100);
    return () => clearInterval(iv);
  }, [activeStep, pipelineDone]);`;
      break;

    case "promise":
      hooksSection = `
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setResolved(true), 2200);
    return () => clearTimeout(t);
  }, []);`;
      break;

    case "streaming":
      hooksSection = `
  const FULL_TEXT = "Attention is all you need.";
  const [streamedText, setStreamedText] = useState("");
  const [streamDone, setStreamDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      setStreamedText(FULL_TEXT.slice(0, idx));
      if (idx >= FULL_TEXT.length) { clearInterval(iv); setStreamDone(true); }
    }, 38);
    return () => clearInterval(iv);
  }, []);`;
      break;

    default:
      hooksSection = "";
  }

  const gradientBorderStyle = isGradient
    ? `
      background:
        linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
        conic-gradient(from var(--sweep-angle, 0deg), #a855f7, #06b6d4, #10b981, #a855f7) border-box`
    : "";

  return `import { useState, useEffect } from "react";
import "./Toast.css";

// Duration before auto-dismiss (ms)
const DISMISS_AFTER = ${autoDismissDuration};

export default function Toast({ onDismiss }) {
  const [visible, setVisible] = useState(true);${hooksSection}

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), DISMISS_AFTER);
    return () => clearTimeout(t);
  }, []);

  function dismiss() { setVisible(false); }

  if (!visible) return null;

  return (
    <div className="toast__wrapper">
      <div className="toast${isGradient ? " toast--gradient" : ""}${hasTopBorder ? ` toast--border-${variant}` : ""}">
        {/* Icon */}
        <div className="toast__icon">
          {/* Replace with your icon */}
          <span>✦</span>
        </div>

        {/* Content */}
        <div className="toast__content">${contentBody}
        </div>
${actionSection}${closeSection}${progressBarSection}
      </div>
    </div>
  );
}`;
}

// ─── CSS code generator ────────────────────────────────────────────
export function generateToastCSS(config: ToastConfig): string {
  const {
    variant,
    position,
    iconColor,
    accentColor,
    backgroundColor,
    borderColor,
    titleColor,
    messageColor,
    borderRadius,
    showProgressBar,
  } = config;

  const posCSS = positionToCss(position);
  const anim = variantAnimation(variant);
  const isGradient = variant === "gradient";
  const hasTopBorder = variant === "success" || variant === "error";
  const topBorderColor = variant === "success" ? "#4ade80" : "#f87171";

  return `/* ── Toast wrapper — fixed position ── */
.toast__wrapper {
  position: fixed;
  ${posCSS}
  z-index: 9999;
  width: 360px;
  max-width: calc(100vw - 2rem);
}

/* ── Toast base ── */
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${backgroundColor};
  border: 1px solid ${borderColor};
  border-radius: ${borderRadius}px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
  animation: ${anim};
  font-family: 'Instrument Sans', sans-serif;
}
${
  hasTopBorder
    ? `
.toast--border-${variant} {
  border-top: 2px solid ${topBorderColor};
}`
    : ""
}
${
  isGradient
    ? `
/* @property needed for conic-gradient animation */
@property --sweep-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.toast--gradient {
  border: 2px solid transparent;
  background:
    linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
    conic-gradient(from var(--sweep-angle, 0deg), #a855f7, #06b6d4, #10b981, #a855f7) border-box;
  animation: ${anim}, sweep-rotate 3s linear infinite;
}

@keyframes sweep-rotate {
  from { --sweep-angle: 0deg; }
  to   { --sweep-angle: 360deg; }
}`
    : ""
}

/* ── Icon ── */
.toast__icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${iconColor}18;
  color: ${iconColor};
}

/* ── Content ── */
.toast__content { flex: 1; min-width: 0; }

.toast__title {
  font-size: 13px;
  font-weight: 600;
  color: ${titleColor};
  line-height: 1.3;
  margin-bottom: 2px;
}

.toast__message {
  font-size: 12px;
  color: ${messageColor};
  line-height: 1.5;
}

/* ── Close button ── */
.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: ${messageColor};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.toast__close:hover { opacity: 1; }

/* ── Action button ── */
.toast__action {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, ${accentColor}, ${accentColor}cc);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.04em;
}

.toast__action:hover { opacity: 0.85; }
.toast__action:active { transform: scale(0.95); }

/* ── Progress bar ── */
${
  showProgressBar
    ? `
.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${accentColor}20;
  border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
  overflow: hidden;
}

.toast__progress-bar {
  height: 100%;
  width: 100%;
  background: ${accentColor};
  transform-origin: left;
  animation: toast-progress-shrink ${config.autoDismissDuration}ms linear forwards;
  border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
}`
    : ""
}

/* ── Multi-step ── */
.toast__steps {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
}

.toast__step {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-family: 'DM Mono', monospace;
  color: ${messageColor};
}

.toast__step + .toast__step::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 1px;
  background: ${borderColor};
  margin-right: 4px;
}

.toast__step-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${borderColor};
  flex-shrink: 0;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.toast__step.active .toast__step-dot {
  background: #06b6d4;
  box-shadow: 0 0 8px rgba(6,182,212,0.6);
  animation: toast-dot-pulse 0.8s ease infinite;
}

.toast__step.done { color: #10b981; }
.toast__step.done .toast__step-dot { background: #10b981; }
.toast__step.done + .toast__step::before { background: #10b981; }

/* ── Streaming cursor ── */
.toast__message--streaming .toast__typed::after {
  content: '|';
  animation: toast-cursor-blink 0.6s step-end infinite;
  color: #8b5cf6;
  font-weight: 700;
  margin-left: 1px;
}

/* ── Loading spinner ── */
.toast__spinner {
  animation: toast-spin 0.8s linear infinite;
}

/* ══════════════════════════════════
   KEYFRAMES
   ══════════════════════════════════ */
@keyframes toast-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes toast-dot-pulse {
  0%, 100% { box-shadow: 0 0 4px rgba(6,182,212,0.3); }
  50%       { box-shadow: 0 0 10px rgba(6,182,212,0.7); }
}

@keyframes toast-cursor-blink {
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
}

@keyframes toast-progress-shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* ── Entrance animations ── */
@keyframes toast-slide-right {
  from { opacity: 0; transform: translateX(60px) scale(0.96); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-slide-left {
  from { opacity: 0; transform: translateX(-60px) scale(0.96); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-slide-up {
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toast-glow-in {
  0%   { opacity: 0; transform: scale(0.92); }
  50%  { opacity: 1; box-shadow: 0 0 24px 4px rgba(99,102,241,0.25); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes toast-pulse-in {
  0%   { opacity: 0; transform: scale(0.8); }
  50%  { opacity: 1; transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes toast-cascade {
  0%   { opacity: 0; transform: translateY(-16px) scaleY(0.9); }
  60%  { opacity: 1; transform: translateY(3px) scaleY(1.01); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}

@keyframes toast-sweep-in {
  0%   { opacity: 0; transform: translateX(-30px) scale(0.96); filter: blur(4px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-morph {
  from { opacity: 0; transform: translateY(12px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toast-shake {
  0%   { opacity: 0; transform: translateX(0) scale(0.95); }
  20%  { opacity: 1; transform: translateX(-5px) scale(1); }
  40%  { transform: translateX(4px); }
  60%  { transform: translateX(-3px); }
  80%  { transform: translateX(2px); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-flip-in {
  0%   { opacity: 0; transform: perspective(600px) rotateX(-15deg) translateY(-20px) scale(0.95); }
  60%  { opacity: 1; transform: perspective(600px) rotateX(3deg) translateY(2px) scale(1.01); }
  100% { opacity: 1; transform: perspective(600px) rotateX(0) translateY(0) scale(1); }
}

/* ── Exit animation ── */
.toast--exit {
  animation: toast-exit 0.3s cubic-bezier(0.55,0,1,0.45) forwards !important;
}

@keyframes toast-exit {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(100%) scale(0.9); }
}
`;
}
