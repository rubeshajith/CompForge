"use client";

import { useState, useRef, useEffect } from "react";
import { PopoverConfig } from "@/lib/popOverConfig";
import { PopoverVariantId } from "@/lib/popOverVariants";

interface Props {
  config: PopoverConfig;
  selectedVariant: PopoverVariantId;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── PopShell ───────────────────────────────────────────────────────────────

function PopShell({
  config,
  isOpen,
  children,
  minWidth = 160,
  maxWidth = 240,
  padding = "0.75rem 0.85rem",
}: {
  config: PopoverConfig;
  isOpen: boolean;
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  padding?: string;
}) {
  const { surfaceColor, borderColor, accentColor, borderRadius } = config;
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: isOpen
          ? "translateX(-50%) scale(1) translateY(0)"
          : "translateX(-50%) scale(0.92) translateY(-6px)",
        minWidth,
        maxWidth,
        width: "max-content",
        padding,
        background: surfaceColor,
        border: `1px solid ${borderColor}`,
        borderRadius,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${hexToRgba(accentColor, 0.12)}`,
        zIndex: 200,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
        transition:
          "opacity 0.25s ease, transform 0.35s cubic-bezier(0.22,0.61,0.36,1), visibility 0.25s ease",
        fontFamily: config.fontFamily,
        overflow: "hidden",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 10,
          height: 10,
          background: surfaceColor,
          borderTop: `1px solid ${borderColor}`,
          borderLeft: `1px solid ${borderColor}`,
        }}
      />
    </div>
  );
}

// ── TriggerBtn ─────────────────────────────────────────────────────────────

function TriggerBtn({
  config,
  onClick,
  children,
  badge,
}: {
  config: PopoverConfig;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  const { borderColor, textColor, accentColor } = config;
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.45rem 0.9rem",
        fontFamily: config.fontFamily,
        fontSize: "0.68rem",
        fontWeight: 500,
        color: textColor,
        background: hov
          ? hexToRgba(accentColor, 0.08)
          : hexToRgba(accentColor, 0.04),
        border: `1px solid ${hov ? accentColor : borderColor}`,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: hov ? `0 0 12px ${hexToRgba(accentColor, 0.18)}` : "none",
        position: "relative",
      }}
    >
      {children}
      {badge !== undefined && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1rem",
            height: "1rem",
            fontSize: "0.5rem",
            fontWeight: 700,
            color: "#fff",
            background: `linear-gradient(135deg, ${config.gradStart}, ${config.gradEnd})`,
            borderRadius: "50%",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ── PopBtn ─────────────────────────────────────────────────────────────────

function PopBtn({
  config,
  variant,
  onClick,
  full,
  children,
}: {
  config: PopoverConfig;
  variant: "primary" | "ghost";
  onClick?: () => void;
  full?: boolean;
  children: React.ReactNode;
}) {
  const { gradStart, gradEnd, borderColor, textMutedColor, textColor } = config;
  const isPrimary = variant === "primary";
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: config.fontFamily,
        fontSize: "0.58rem",
        fontWeight: 600,
        padding: "0.35rem 0.65rem",
        borderRadius: 6,
        border: isPrimary ? "none" : `1px solid ${borderColor}`,
        cursor: "pointer",
        width: full ? "100%" : undefined,
        background: isPrimary
          ? `linear-gradient(135deg, ${gradStart}, ${gradEnd})`
          : hov
            ? hexToRgba("#fff", 0.08)
            : hexToRgba("#fff", 0.04),
        color: isPrimary ? "#fff" : hov ? textColor : textMutedColor,
        filter: isPrimary && hov ? "brightness(1.12)" : "none",
        boxShadow: isPrimary
          ? `0 2px 8px ${hexToRgba(gradStart, 0.3)}`
          : "none",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  VARIANT IMPLEMENTATIONS
// ══════════════════════════════════════════════════════════════════════════

// ── 1. Basic ───────────────────────────────────────────────────────────────

function BasicPop({
  config,
  isOpen,
  close,
}: {
  config: PopoverConfig;
  isOpen: boolean;
  close: () => void;
}) {
  const { textColor, textMutedColor, borderColor } = config;
  return (
    <PopShell config={config} isOpen={isOpen} maxWidth={256} padding="0.85rem">
      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          alignItems: "flex-start",
          marginBottom: "0.65rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 8,
            background: config.basicIconBg,
            color: "#fff",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
            <circle cx="12" cy="15" r="2" />
          </svg>
        </span>
        <div>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: textColor,
              marginBottom: 2,
            }}
          >
            {config.basicHeading}
          </p>
          <p
            style={{
              fontSize: "0.58rem",
              lineHeight: 1.5,
              color: textMutedColor,
            }}
          >
            {config.basicDescription}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          justifyContent: "flex-end",
          paddingTop: "0.5rem",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <PopBtn config={config} variant="ghost" onClick={close}>
          Dismiss
        </PopBtn>
        <PopBtn config={config} variant="primary">
          Learn More
        </PopBtn>
      </div>
    </PopShell>
  );
}

// ── 2. Dropdown Transition ─────────────────────────────────────────────────

function DropdownTransitionPop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  const {
    gradStart,
    gradEnd,
    textColor,
    textMutedColor,
    borderColor,
    accentColor,
  } = config;

  useEffect(() => {
    if (!isOpen) setTimeout(() => setActiveDetail(null), 300);
  }, [isOpen]);

  return (
    <PopShell
      config={config}
      isOpen={isOpen}
      minWidth={192}
      maxWidth={224}
      padding="0"
    >
      {/* List panel */}
      <div
        style={{
          opacity: activeDetail !== null ? 0 : 1,
          transform:
            activeDetail !== null ? "translateY(-10px)" : "translateY(0)",
          visibility: activeDetail !== null ? "hidden" : "visible",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          padding: "0.35rem",
          position: activeDetail !== null ? "absolute" : "relative",
          width: "100%",
        }}
      >
        {config.dtModels.map((m, i) => (
          <ModelRow
            key={i}
            model={m}
            config={config}
            onClick={() => setActiveDetail(i)}
          />
        ))}
      </div>
      {/* Detail panels */}
      {config.dtModels.map((m, i) => (
        <div
          key={i}
          style={{
            opacity: activeDetail === i ? 1 : 0,
            transform:
              activeDetail === i ? "translateY(0)" : "translateY(10px)",
            visibility: activeDetail === i ? "visible" : "hidden",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            padding: "0.55rem",
            position: activeDetail === i ? "relative" : "absolute",
            width: "100%",
          }}
        >
          <button
            onClick={() => setActiveDetail(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: config.fontFamily,
              fontSize: "0.55rem",
              fontWeight: 500,
              color: textMutedColor,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.2rem 0.1rem 0.4rem",
            }}
          >
            ‹ Back
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.55rem",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                background: `linear-gradient(135deg,${gradStart},${gradEnd})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {m.name}
            </span>
            <span
              style={{
                fontSize: "0.45rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#fff",
                background: `linear-gradient(135deg,${gradStart},${gradEnd})`,
                padding: "0.15rem 0.45rem",
                borderRadius: "2rem",
              }}
            >
              {m.provider}
            </span>
          </div>
          {config.dtShowStats && (
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "0.5rem 0",
                marginBottom: "0.5rem",
                borderTop: `1px solid ${borderColor}`,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {[
                ["Context", m.context],
                ["Price", m.price + "/1M"],
                ["Latency", m.latency],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ flex: 1, textAlign: "center" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: `linear-gradient(135deg,${gradStart},${gradEnd})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {val}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.45rem",
                      fontWeight: 500,
                      color: textMutedColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {lbl}
                  </span>
                </div>
              ))}
            </div>
          )}
          <PopBtn config={config} variant="primary" full>
            Select Model
          </PopBtn>
        </div>
      ))}
    </PopShell>
  );
}

function ModelRow({
  model,
  config,
  onClick,
}: {
  model: any;
  config: PopoverConfig;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const { textColor, textMutedColor, accentColor, gradStart, gradEnd } = config;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.45rem 0.5rem",
        borderRadius: 6,
        cursor: "pointer",
        background: hov ? hexToRgba(accentColor, 0.08) : "transparent",
        transition: "background 0.15s ease",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          flexShrink: 0,
          borderRadius: 6,
          background: hov
            ? `linear-gradient(135deg,${gradStart},${gradEnd})`
            : hexToRgba(accentColor, 0.12),
          color: hov ? "#fff" : accentColor,
          transition: "all 0.2s ease",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4m-7.07-14.93l2.83 2.83m8.48 8.48l2.83 2.83m-16.97 0l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: "0.62rem",
            fontWeight: 500,
            color: hov ? accentColor : textColor,
          }}
        >
          {model.name}
        </span>
        <span
          style={{
            display: "block",
            fontSize: "0.48rem",
            color: textMutedColor,
          }}
        >
          {model.context} context
        </span>
      </div>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke={hov ? accentColor : textMutedColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

// ── 3. Training Status ─────────────────────────────────────────────────────

function TrainingStatusPop({
  config,
  isOpen,
  close,
}: {
  config: PopoverConfig;
  isOpen: boolean;
  close: () => void;
}) {
  const { textColor, textMutedColor, borderColor, accentColor } = config;
  const pct = config.statusProgress;
  const circumference = 2 * Math.PI * 16;
  const offset = circumference * (1 - pct / 100);
  return (
    <PopShell config={config} isOpen={isOpen} maxWidth={256} padding="0.85rem">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          marginBottom: "0.7rem",
        }}
      >
        <div
          style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}
        >
          <svg
            viewBox="0 0 40 40"
            style={{
              width: "100%",
              height: "100%",
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={borderColor}
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                animation: config.statusAnimatePulse
                  ? "statusPulse 2s ease-in-out infinite"
                  : "none",
              }}
            />
          </svg>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: 600,
              color: accentColor,
            }}
          >
            {pct}%
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: textColor,
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {config.statusModelName}
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.62rem",
              color: accentColor,
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accentColor,
                animation: config.statusAnimatePulse
                  ? "dotBlink 1.4s ease-in-out infinite"
                  : "none",
              }}
            />
            Training
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0.4rem",
          padding: "0.55rem 0",
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          marginBottom: "0.6rem",
        }}
      >
        {[
          ["Loss", config.statusLoss],
          ["Accuracy", config.statusAccuracy],
          ["Epoch", config.statusEpoch],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: textColor,
              }}
            >
              {val}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.55rem",
                color: textMutedColor,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: 2,
              }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}
      >
        <PopBtn config={config} variant="ghost" onClick={close}>
          ⏸ Pause
        </PopBtn>
        <PopBtn config={config} variant="primary">
          View Logs
        </PopBtn>
      </div>
    </PopShell>
  );
}

// ── 4. User Card ───────────────────────────────────────────────────────────

function UserCardPop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const { gradStart, gradEnd, textColor, textMutedColor, borderColor } = config;
  const stats = [
    [config.userStat1Label, config.userStat1Value],
    [config.userStat2Label, config.userStat2Value],
    [config.userStat3Label, config.userStat3Value],
  ];
  return (
    <PopShell config={config} isOpen={isOpen} maxWidth={224} padding="0.85rem">
      <div
        style={{
          display: "flex",
          gap: "0.55rem",
          alignItems: "center",
          marginBottom: "0.6rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg,${gradStart},${gradEnd})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#fff",
            border: `2px solid ${borderColor}`,
          }}
        >
          {config.userInitial}
        </div>
        <div>
          <p style={{ fontSize: "0.72rem", fontWeight: 600, color: textColor }}>
            {config.userName}
          </p>
          <p style={{ fontSize: "0.56rem", color: textMutedColor }}>
            {config.userRole}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "0.55rem",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        {stats.map(([lbl, val]) => (
          <div key={lbl} style={{ flex: 1, textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: `linear-gradient(135deg,${gradStart},${gradEnd})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {val}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.48rem",
                fontWeight: 500,
                color: textMutedColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </PopShell>
  );
}

// ── 5. Nested Menu ─────────────────────────────────────────────────────────

function NestedMenuPop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const {
    textColor,
    textMutedColor,
    borderColor,
    accentColor,
    surfaceColor,
    menuItemBorderRadius,
  } = config;
  const formats = config.menuExportFormats
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <PopShell
      config={config}
      isOpen={isOpen}
      minWidth={128}
      maxWidth={160}
      padding="0.35rem"
    >
      {config.menuShowExport && (
        <div
          onMouseEnter={() => setSubOpen(true)}
          onMouseLeave={() => setSubOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.4rem 0.55rem",
            fontSize: "0.62rem",
            fontWeight: 400,
            color: subOpen ? accentColor : textColor,
            borderRadius: menuItemBorderRadius,
            cursor: "pointer",
            position: "relative",
            background: subOpen ? hexToRgba(accentColor, 0.08) : "transparent",
            transition: "all 0.15s ease",
          }}
        >
          <span>Export</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: "calc(100% + 4px)",
              top: -6,
              minWidth: 112,
              padding: "0.35rem",
              background: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              opacity: subOpen ? 1 : 0,
              visibility: subOpen ? "visible" : "hidden",
              transform: subOpen ? "translateX(0)" : "translateX(-4px)",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
          >
            {formats.map((f) => (
              <div
                key={f}
                style={{
                  padding: "0.4rem 0.55rem",
                  fontSize: "0.62rem",
                  color: textColor,
                  borderRadius: menuItemBorderRadius,
                  cursor: "pointer",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      )}
      <MenuItem label="Duplicate" config={config} />
      <MenuItem label="Archive" config={config} />
      <div
        style={{ height: 1, background: borderColor, margin: "0.2rem 0.4rem" }}
      />
      <MenuItem label={config.menuDangerLabel} config={config} danger />
    </PopShell>
  );
}

function MenuItem({
  label,
  config,
  danger,
}: {
  label: string;
  config: PopoverConfig;
  danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const { textColor, accentColor, menuItemBorderRadius } = config;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.4rem 0.55rem",
        fontSize: "0.62rem",
        fontWeight: 400,
        color: danger ? "#F87171" : hov ? accentColor : textColor,
        borderRadius: menuItemBorderRadius,
        cursor: "pointer",
        background: hov
          ? danger
            ? "rgba(248,113,113,0.1)"
            : hexToRgba(accentColor, 0.08)
          : "transparent",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </div>
  );
}

// ── 7. Notification ────────────────────────────────────────────────────────

function NotificationPop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const { textColor, textMutedColor, borderColor, accentColor, notifDotColor } =
    config;
  return (
    <PopShell
      config={config}
      isOpen={isOpen}
      minWidth={224}
      maxWidth={256}
      padding="0"
    >
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 600,
          color: textColor,
          padding: "0.6rem 0.75rem 0.4rem",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        Notifications
      </p>
      <div style={{ maxHeight: 160, overflowY: "auto" }}>
        {config.notifications.map((n, i) => {
          const isLast = i === config.notifications.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                padding: "0.55rem 0.75rem",
                borderBottom: isLast ? "none" : `1px solid ${borderColor}`,
                cursor: "pointer",
              }}
            >
              {config.notifShowDot && n.unread ? (
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: notifDotColor,
                    flexShrink: 0,
                    marginTop: 4,
                    boxShadow: `0 0 6px ${hexToRgba(notifDotColor, 0.5)}`,
                  }}
                />
              ) : (
                <div style={{ width: 7, flexShrink: 0 }} />
              )}
              <div>
                <p
                  style={{
                    fontSize: "0.58rem",
                    color: textColor,
                    lineHeight: 1.45,
                  }}
                >
                  {n.message}
                </p>
                <p
                  style={{
                    fontSize: "0.48rem",
                    color: textMutedColor,
                    marginTop: 2,
                  }}
                >
                  {n.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </PopShell>
  );
}

// ── 8. Command Palette ─────────────────────────────────────────────────────

function CommandPalettePop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const [query, setQuery] = useState("");
  const { textColor, textMutedColor, borderColor, accentColor } = config;

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const filtered = config.commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PopShell
      config={config}
      isOpen={isOpen}
      minWidth={224}
      maxWidth={256}
      padding="0"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.55rem 0.65rem",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke={textMutedColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          style={{
            width: "100%",
            fontFamily: config.fontFamily,
            fontSize: "0.62rem",
            color: textColor,
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      </div>
      <div style={{ padding: "0.2rem 0.35rem 0.35rem" }}>
        <div
          style={{
            fontSize: "0.48rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: textMutedColor,
            padding: "0.45rem 0.45rem 0.2rem",
          }}
        >
          Actions
        </div>
        {filtered.length === 0 && (
          <p
            style={{
              fontSize: "0.58rem",
              color: textMutedColor,
              textAlign: "center",
              padding: "0.75rem",
            }}
          >
            No commands found
          </p>
        )}
        {filtered.map((cmd, i) => (
          <CmdItem key={i} cmd={cmd} config={config} />
        ))}
      </div>
    </PopShell>
  );
}

function CmdItem({ cmd, config }: { cmd: any; config: PopoverConfig }) {
  const [hov, setHov] = useState(false);
  const [flash, setFlash] = useState(false);
  const { textColor, textMutedColor, accentColor, borderColor } = config;
  function handleClick() {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  }
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.4rem 0.45rem",
        fontSize: "0.6rem",
        fontWeight: 400,
        color: hov && config.cmdAccentOnHover ? accentColor : textColor,
        borderRadius: 6,
        cursor: "pointer",
        background: flash
          ? hexToRgba(accentColor, 0.12)
          : hov
            ? hexToRgba(accentColor, 0.08)
            : "transparent",
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ flex: 1 }}>{cmd.label}</span>
      {config.cmdShowKbd && (
        <span style={{ marginLeft: "auto" }}>
          {cmd.kbd.split("").map((k: string, idx: number) => (
            <kbd
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "1.1rem",
                height: "1.1rem",
                padding: "0 0.2rem",
                fontFamily: config.fontFamily,
                fontSize: "0.45rem",
                fontWeight: 600,
                color: textMutedColor,
                background: hexToRgba("#fff", 0.04),
                border: `1px solid ${borderColor}`,
                borderRadius: 4,
                marginLeft: 2,
              }}
            >
              {k}
            </kbd>
          ))}
        </span>
      )}
    </div>
  );
}

// ── 10. Token Breakdown ────────────────────────────────────────────────────

function TokenBreakdownPop({
  config,
  isOpen,
}: {
  config: PopoverConfig;
  isOpen: boolean;
}) {
  const { textColor, textMutedColor, borderColor, accentColor } = config;
  const total =
    config.tokSystemCount + config.tokPromptCount + config.tokCompletionCount;
  const maxTok = Math.max(
    config.tokSystemCount,
    config.tokPromptCount,
    config.tokCompletionCount,
  );
  const cost = ((total / 1_000_000) * 15).toFixed(3);
  const bars = [
    {
      label: "System",
      count: config.tokSystemCount,
      color: config.tokSystemColor,
    },
    {
      label: "Prompt",
      count: config.tokPromptCount,
      color: `linear-gradient(90deg,${config.tokPromptColorStart},${config.tokPromptColorEnd})`,
    },
    {
      label: "Completion",
      count: config.tokCompletionCount,
      color: `linear-gradient(90deg,${config.tokCompletionColorStart},${config.tokCompletionColorEnd})`,
    },
  ];
  return (
    <PopShell
      config={config}
      isOpen={isOpen}
      minWidth={232}
      maxWidth={256}
      padding="0.85rem"
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.65rem",
        }}
      >
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: textColor }}>
          Token Usage
        </p>
        <span
          style={{
            fontSize: "0.55rem",
            color: textMutedColor,
            fontWeight: 500,
          }}
        >
          {total.toLocaleString()} tokens
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {bars.map((bar) => {
          const w = Math.round((bar.count / maxTok) * 100);
          return (
            <div key={bar.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    color: textColor,
                  }}
                >
                  {bar.label}
                </span>
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    color: textMutedColor,
                  }}
                >
                  {bar.count.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  background: hexToRgba("#fff", 0.04),
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    width: `${w}%`,
                    background: bar.color,
                    animation:
                      config.tokAnimateBars && isOpen
                        ? "barGrow 0.6s cubic-bezier(0.22,0.61,0.36,1) both"
                        : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.7rem",
          paddingTop: "0.6rem",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.5rem",
              color: textMutedColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            Estimated cost
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: accentColor,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            ${cost}
          </span>
        </div>
        <span
          style={{
            fontSize: "0.5rem",
            fontWeight: 600,
            color: accentColor,
            background: hexToRgba(accentColor, 0.12),
            padding: "0.2rem 0.5rem",
            borderRadius: "2rem",
            border: `1px solid ${accentColor}`,
            opacity: 0.8,
          }}
        >
          {config.tokModelName}
        </span>
      </div>
    </PopShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  Main Preview
// ══════════════════════════════════════════════════════════════════════════

export function PopoverPreview({ config, selectedVariant }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on variant switch so animation replays cleanly
  useEffect(() => {
    setIsOpen(false);
  }, [selectedVariant]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const triggerLabels: Record<PopoverVariantId, string> = {
    basic: "Details",
    dropdown: "Select Model",
    status: "Status",
    usercard: `@${config.userName.split(" ")[0].toLowerCase()}_ai`,
    menu: "Actions",
    notif: "🔔",
    command: "⌘K",
    tokens: "$0.042",
  };

  const unreadCount = config.notifications.filter((n) => n.unread).length;

  function renderPop() {
    switch (selectedVariant) {
      case "basic":
        return (
          <BasicPop
            config={config}
            isOpen={isOpen}
            close={() => setIsOpen(false)}
          />
        );
      case "dropdown":
        return <DropdownTransitionPop config={config} isOpen={isOpen} />;
      case "status":
        return (
          <TrainingStatusPop
            config={config}
            isOpen={isOpen}
            close={() => setIsOpen(false)}
          />
        );
      case "usercard":
        return <UserCardPop config={config} isOpen={isOpen} />;
      case "menu":
        return <NestedMenuPop config={config} isOpen={isOpen} />;
      case "notif":
        return <NotificationPop config={config} isOpen={isOpen} />;
      case "command":
        return <CommandPalettePop config={config} isOpen={isOpen} />;
      case "tokens":
        return <TokenBreakdownPop config={config} isOpen={isOpen} />;
    }
  }

  return (
    <>
      <style>{`
        @keyframes statusPulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
        @keyframes dotBlink    { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes barGrow     { from { width:0; } }
      `}</style>
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "5rem",
          width: "100%",
        }}
      >
        <TriggerBtn
          config={config}
          onClick={() => setIsOpen((p) => !p)}
          badge={selectedVariant === "notif" ? unreadCount : undefined}
        >
          {triggerLabels[selectedVariant]}
        </TriggerBtn>
        {renderPop()}
      </div>
    </>
  );
}
