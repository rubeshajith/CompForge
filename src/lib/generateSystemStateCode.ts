// /lib/generateSystemStateCode.ts

import { SystemStateConfig, SystemStateVariant } from "./systemStateConfig";

// ─── Accent map (mirrors Preview) ────────────────────────────────────────────

const ACCENT_MAP: Record<SystemStateVariant, string> = {
  empty: "#7c6cfc",
  error: "#f87171",
  serverError: "#fb923c",
  permission: "#4ade80",
  noConnection: "#fb923c",
  firstRun: "#7c6cfc",
  noResults: "#4ade80",
  filteredState: "#c084fc",
  rateLimited: "#facc15",
  sessionExpired: "#60a5fa",
  maintenance: "#fb923c",
  conflictingEdit: "#f87171",
};

// ─── JSX per variant ──────────────────────────────────────────────────────────

function getVariantJSX(config: SystemStateConfig): string {
  const v = config.variant;
  const accent = ACCENT_MAP[v];
  const cr = config.primaryBorderRadius;

  const iconContainerStyle = (shape: "square" | "circle" = "square") => {
    const r =
      shape === "circle"
        ? config.iconContainerSize / 2
        : config.iconContainerRadius;
    return `{{
        width: ${config.iconContainerSize}, height: ${config.iconContainerSize},
        borderRadius: ${r},
        background: "${accent}18", border: "1px solid ${accent}30",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", color: "${accent}",
      }}`;
  };

  const primaryBtn = (label: string, fullWidth = false) =>
    `<button style={{ background: "${config.primaryBg}", color: "${config.primaryText}", border: "none", borderRadius: ${cr}, padding: "9px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"${fullWidth ? ', width: "100%"' : ""} }}>${label}</button>`;

  const secondaryBtn = (
    label: string,
    color: string,
    borderColor: string,
    fullWidth = false,
  ) =>
    `<button style={{ background: "${config.secondaryBg}", color: "${color}", border: "1px solid ${borderColor}", borderRadius: ${cr}, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit"${fullWidth ? ', width: "100%"' : ""} }}>${label}</button>`;

  switch (v) {
    case "empty":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      {/* Box icon */}
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Nothing here yet</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 auto 28px", maxWidth: 220, lineHeight: 1.6 }}>
      Your projects will appear here once you create one.
    </p>
    ${primaryBtn("Create project")}
  </div>`;

    case "error":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle("circle")}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 20px" }}>Something went wrong.</p>
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
      ${primaryBtn("Try again")}
      ${secondaryBtn("Contact support", config.secondaryText, config.secondaryBorderColor)}
    </div>
    <div style={{ background: "${config.logBoxBackground}", borderRadius: 10, padding: "12px 16px", textAlign: "left" }}>
      <span style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "${config.logBoxText}", fontWeight: 700, marginBottom: 4 }}>What happened?</span>
      <code style={{ fontSize: 12, color: "${config.logBoxText}", fontFamily: "DM Mono, monospace" }}>Network timed out after 30s.</code>
    </div>
  </div>`;

    case "serverError":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 4px" }}>Something broke</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 24px" }}>on our end.</p>
    ${primaryBtn("Try again", true)}
    <p style={{ marginTop: 14, fontSize: 10, color: "${config.labelColor}", textTransform: "uppercase", letterSpacing: "0.18em", fontStyle: "italic" }}>Full surface blocking</p>
  </div>`;

    case "permission":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle("circle")}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>You don't have access.</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 20px", lineHeight: 1.6 }}>This resource requires additional permissions.</p>
    <button style={{ background: "none", border: "none", color: "${accent}", fontWeight: 600, fontSize: 13, cursor: "pointer", textDecoration: "underline", marginBottom: 16, fontFamily: "inherit" }}>Sign in</button>
    <p style={{ fontSize: 10, color: "${config.labelColor}", textTransform: "uppercase", letterSpacing: "0.18em", fontStyle: "italic", margin: 0 }}>Gated, requires action</p>
  </div>`;

    case "noConnection":
      return `
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "${config.logBoxBackground}", borderRadius: 14, padding: "14px 16px", border: "1px solid ${config.cardBorderColor}", marginBottom: 16 }}>
      <div style={{ color: "${accent}", flexShrink: 0 }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.828-2.828.586-.586M9.172 9.172a4 4 0 005.656 5.656" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "${config.titleColor}", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>No connection.</p>
        <p style={{ color: "${config.bodyColor}", fontSize: 11, margin: 0 }}>Reconnecting…</p>
      </div>
      <div className="ss-spinner" />
    </div>
    <div style={{ opacity: 0.15, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ height: 10, background: "${config.bodyColor}", borderRadius: 5, width: "75%" }} />
      <div style={{ height: 10, background: "${config.bodyColor}", borderRadius: 5, width: "50%" }} />
    </div>
    <p style={{ marginTop: 20, fontSize: 10, color: "${config.labelColor}", textTransform: "uppercase", letterSpacing: "0.18em", fontStyle: "italic" }}>Non-blocking, transient</p>
  </div>`;

    case "firstRun":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Welcome aboard</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 28px", lineHeight: 1.6 }}>Let's set up your workspace in under a minute.</p>
    ${secondaryBtn("Start tutorial", accent, accent + "40", true)}
  </div>`;

    case "noResults":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle("circle")}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>No matches found</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 28px", lineHeight: 1.6 }}>Try different keywords or check your spelling.</p>
    ${secondaryBtn("Clear search", accent, accent + "40", true)}
  </div>`;

    case "filteredState":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Hidden by filters</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 28px", lineHeight: 1.6 }}>You have 42 items but filters are hiding them all.</p>
    ${secondaryBtn("Reset filters", accent, accent + "40", true)}
  </div>`;

    case "rateLimited":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Slow down a bit.</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 20px", lineHeight: 1.6 }}>
      You've hit the rate limit. Try again in <strong style={{ color: "${accent}" }}>42 seconds</strong>.
    </p>
    <div style={{ background: "${config.logBoxBackground}", borderRadius: 10, padding: "10px 16px", marginBottom: 20 }}>
      <code style={{ fontSize: 12, color: "${config.logBoxText}", fontFamily: "DM Mono, monospace" }}>429 Too Many Requests</code>
    </div>
    ${secondaryBtn("Learn about limits", config.secondaryText, config.secondaryBorderColor, true)}
  </div>`;

    case "sessionExpired":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle("circle")}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Session expired.</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 24px", lineHeight: 1.6 }}>Your session timed out for security. Sign in again to continue.</p>
    <div style={{ display: "flex", gap: 10 }}>
      ${primaryBtn("Sign in again", true)}
      ${secondaryBtn("Go home", config.secondaryText, config.secondaryBorderColor, true)}
    </div>
  </div>`;

    case "maintenance":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle()}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Under maintenance.</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 20px", lineHeight: 1.6 }}>
      We're making things better. Back in approximately <strong style={{ color: "${accent}" }}>2 hours</strong>.
    </p>
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "${config.logBoxBackground}", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "${accent}", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "${config.logBoxText}", fontFamily: "DM Mono, monospace" }}>Scheduled · 02:00 – 04:00 UTC</span>
    </div>
    ${secondaryBtn("Check status page", config.secondaryText, config.secondaryBorderColor, true)}
  </div>`;

    case "conflictingEdit":
      return `
  <div style={{ textAlign: "center" }}>
    <div style=${iconContainerStyle("circle")}>
      <svg width={${config.iconSize}} height={${config.iconSize}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    </div>
    <p style={{ color: "${config.titleColor}", fontSize: ${config.titleSize}, fontWeight: 600, margin: "0 0 8px" }}>Editing conflict.</p>
    <p style={{ color: "${config.bodyColor}", fontSize: ${config.bodySize}, margin: "0 0 20px", lineHeight: 1.6 }}>
      <strong style={{ color: "${config.titleColor}" }}>Sara</strong> is editing this file right now. Your changes may be lost.
    </p>
    <div style={{ display: "flex", gap: 10 }}>
      ${primaryBtn("Take over", true)}
      ${secondaryBtn("View their version", config.secondaryText, config.secondaryBorderColor, true)}
    </div>
  </div>`;

    default:
      return `<div>Unknown variant</div>`;
  }
}

// ─── Main exports ─────────────────────────────────────────────────────────────

export function generateSystemStateJSX(config: SystemStateConfig): string {
  const inner = getVariantJSX(config);
  const animation = config.animateIn
    ? `\n  animation: "ss-fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",`
    : "";

  return `import { useState } from "react";
import "./SystemState.css";

export default function SystemState() {
  return (
    <div
      className="ss-card"
      style={{
        background: "${config.cardBackground}",
        border: "1px solid ${config.cardBorderColor}",
        borderRadius: ${config.cardBorderRadius},
        padding: ${config.cardPadding},
        boxShadow: ${config.showShadow ? `"0 8px 48px rgba(0,0,0,0.5)"` : `"none"`},
        maxWidth: 360,
        width: "100%",
        fontFamily: "'Instrument Sans', -apple-system, sans-serif",${animation}
      }}
    >${inner}
    </div>
  );
}
`;
}

export function generateSystemStateCSS(config: SystemStateConfig): string {
  const accent = ACCENT_MAP[config.variant];
  return `.ss-card {
  box-sizing: border-box;
}

/* Primary button */
.ss-btn-primary {
  background: ${config.primaryBg};
  color: ${config.primaryText};
  border: none;
  border-radius: ${config.primaryBorderRadius}px;
  padding: 9px 22px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.01em;
  transition: opacity 0.15s ease, transform 0.1s ease;
}
.ss-btn-primary:hover { opacity: 0.88; }
.ss-btn-primary:active { transform: scale(0.97); }

/* Secondary button */
.ss-btn-secondary {
  background: ${config.secondaryBg};
  color: ${config.secondaryText};
  border: 1px solid ${config.secondaryBorderColor};
  border-radius: ${config.primaryBorderRadius}px;
  padding: 9px 22px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.01em;
  transition: background 0.15s ease;
}
.ss-btn-secondary:hover { background: ${accent}12; }

/* Spinner (no-connection) */
.ss-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid ${accent}30;
  border-top: 2px solid ${accent};
  border-radius: 50%;
  animation: ss-spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes ss-spin {
  to { transform: rotate(360deg); }
}

@keyframes ss-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}
`;
}
