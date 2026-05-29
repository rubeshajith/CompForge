"use client";

import React, { useEffect, useRef } from "react";
import { OmnidashConfig } from "@/lib/healthDashConfig";

interface Props {
  config: OmnidashConfig;
}

// ─── Tiny icon helper (Material Symbols via inline SVG text substitutes) ──────
// We use emoji / unicode symbols as stand-ins so the Preview is fully self-contained.
const Icon = ({
  name,
  size = 20,
  color,
  pulse,
  slowPulse,
}: {
  name: string;
  size?: number;
  color?: string;
  pulse?: boolean;
  slowPulse?: boolean;
}) => {
  const map: Record<string, string> = {
    monitor_heart: "🫀",
    group: "👥",
    warning: "⚠",
    pace: "⏱",
    payments: "💳",
    shopping_cart: "🛒",
    security: "🔐",
    local_shipping: "🚚",
    campaign: "📣",
    analytics: "📊",
    bolt: "⚡",
    notifications: "🔔",
    apps: "⋯",
    settings: "⚙",
    help: "?",
    add: "+",
    search: "🔍",
    trending_up: "↑",
    arrow_downward: "↓",
    emergency: "🚨",
    favorite: "♥",
  };
  return (
    <span
      style={{
        fontSize: size,
        color,
        display: "inline-block",
        lineHeight: 1,
        animation: pulse
          ? "omnipulse 1.5s ease-in-out infinite"
          : slowPulse
            ? "omnipulse-slow 3s ease-in-out infinite"
            : undefined,
      }}
    >
      {map[name] ?? "•"}
    </span>
  );
};

export function OmnidashPreview({ config }: Props) {
  const c = config;
  const accentGlow = `0 0 20px ${c.accentColor}22`;

  const navItems = [
    { label: "HealthTech", icon: "monitor_heart", active: true },
    { label: "FinTech", icon: "payments" },
    { label: "E-commerce", icon: "shopping_cart" },
    { label: "Cybersecurity", icon: "security" },
    { label: "Logistics", icon: "local_shipping" },
    { label: "Marketing", icon: "campaign" },
    { label: "SaaS", icon: "analytics" },
    { label: "Energy", icon: "bolt" },
  ];

  // Animated ECG canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ecgPoints = [
      0, 0, 0, 0, -8, 0, 0, -60, 60, 0, 10, -10, 0, 0, 0, 0, 0, -8, 0, 0, -60,
      60, 0, 10, -10, 0, 0,
    ];

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += W / 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += H / 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // ECG line
      ctx.beginPath();
      ctx.strokeStyle = c.accentColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = c.accentColor;
      ctx.shadowBlur = 8;
      const step = W / (ecgPoints.length * 2);
      const midY = H / 2;
      let x = offsetRef.current;
      for (let i = 0; i < ecgPoints.length; i++) {
        const px = (((x + i * step) % W) + W) % W;
        const py = midY + ecgPoints[i] * (H / 200);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      offsetRef.current = (offsetRef.current - 1 + W) % W;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [c.accentColor]);

  // ─── Styles helpers ─────────────────────────────────────────────────────────
  const panel: React.CSSProperties = {
    background: c.panelBackground,
    backdropFilter: "blur(20px)",
    border: `1px solid ${c.borderColor}`,
    borderRadius: 12,
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: c.pageBackground,
        color: c.textPrimary,
        display: "flex",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes omnipulse {
          0%,100%{opacity:1} 50%{opacity:0}
        }
        @keyframes omnipulse-slow {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
        @keyframes omnidot {
          0%{transform:scale(1);opacity:1}
          100%{transform:scale(3);opacity:0}
        }
        .omni-nav-link:hover { background: ${c.sidebarActiveBackground} !important; color: ${c.textPrimary} !important; }
        .omni-hover-panel:hover { border-color: ${c.accentColor}44 !important; }
        .omni-select { background: transparent; border: none; color: ${c.textMuted}; font-size: 12px; outline: none; cursor: pointer; }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 220,
          minWidth: 220,
          background: c.sidebarBackground,
          borderRight: `1px solid ${c.borderColor}`,
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: c.accentColor + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${c.accentColor}44`,
              }}
            >
              <Icon name="monitor_heart" size={18} color={c.accentColor} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                OmniDash Pro
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: c.textMuted,
                  textTransform: "uppercase",
                }}
              >
                Enterprise Suite
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 8px" }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              className="omni-nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                marginBottom: 2,
                cursor: "pointer",
                fontSize: 14,
                color: item.active ? c.accentColor : c.textMuted,
                fontWeight: item.active ? 700 : 400,
                background: item.active
                  ? c.sidebarActiveBackground
                  : "transparent",
                borderRight: item.active
                  ? `2px solid ${c.accentColor}`
                  : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon
                name={item.icon}
                size={16}
                color={item.active ? c.accentColor : c.textMuted}
              />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 12px 0" }}>
          <button
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              background: c.accentColor,
              color: "#000",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="add" size={14} color="#000" /> New Dashboard
          </button>
          <div
            style={{
              borderTop: `1px solid ${c.borderColor}`,
              marginTop: 12,
              paddingTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {["settings", "help"].map((icon) => (
              <div
                key={icon}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: c.textMuted,
                  fontSize: 13,
                }}
              >
                <Icon name={icon} size={15} color={c.textMuted} />
                {icon.charAt(0).toUpperCase() + icon.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <header
          style={{
            height: 56,
            borderBottom: `1px solid ${c.borderColor}`,
            background: c.pageBackground + "cc",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 360,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: c.textMuted,
                fontSize: 14,
              }}
            >
              🔍
            </span>
            <input
              readOnly
              placeholder="Search patients, vitals, or medical records..."
              style={{
                width: "100%",
                background: c.sidebarActiveBackground,
                border: "none",
                borderRadius: 999,
                padding: "7px 14px 7px 34px",
                fontSize: 12,
                color: c.textMuted,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: c.textMuted,
                position: "relative",
                padding: 4,
              }}
            >
              🔔
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: c.errorColor,
                }}
              />
            </button>
            <div
              style={{
                borderLeft: `1px solid ${c.borderColor}`,
                paddingLeft: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                  Dr. Sarah Chen
                </div>
                <div style={{ fontSize: 10, color: c.textMuted }}>
                  Senior Cardiologist
                </div>
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: c.accentColor + "33",
                  border: `2px solid ${c.accentColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                👩‍⚕️
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "20px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Page header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Clinical Overview
              </h2>
              <p
                style={{ fontSize: 13, color: c.textMuted, margin: "4px 0 0" }}
              >
                Real-time surveillance for cardiac care unit (CCU-4).
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 999,
                  background: c.accentColor + "18",
                  border: `1px solid ${c.accentColor}33`,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: c.accentColor,
                    display: "inline-block",
                    animation: "omnipulse 1.5s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: c.accentColor,
                  }}
                >
                  Live Monitoring Active
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: c.textMuted,
                  fontFamily: "monospace",
                }}
              >
                Last synced: 14:32:05 GMT
              </span>
            </div>
          </div>

          {/* ── Key Metrics ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {/* Active Patients */}
            <div
              className="omni-hover-panel"
              style={{
                ...panel,
                padding: 20,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: c.textMuted,
                  }}
                >
                  Active Patients
                </span>
                <Icon name="group" size={18} color={c.accentColor} />
              </div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: c.textPrimary,
                }}
              >
                1,284
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.accentColor,
                }}
              >
                ↑ +4.2% from last week
              </div>
            </div>

            {/* Critical Alerts */}
            <div
              className="omni-hover-panel"
              style={{
                ...panel,
                padding: 20,
                cursor: "pointer",
                border: `1px solid ${c.errorColor}33`,
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: c.errorColor,
                  }}
                >
                  Critical Alerts
                </span>
                <Icon name="warning" size={18} color={c.errorColor} pulse />
              </div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: c.errorColor,
                }}
              >
                07
              </div>
              <div style={{ fontSize: 11, color: c.textMuted, marginTop: 6 }}>
                Requiring immediate clinician review
              </div>
            </div>

            {/* Avg Recovery */}
            <div
              className="omni-hover-panel"
              style={{
                ...panel,
                padding: 20,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: c.textMuted,
                  }}
                >
                  Avg Recovery Time
                </span>
                <Icon name="pace" size={18} color={c.secondaryColor} />
              </div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: c.textPrimary,
                }}
              >
                4.2 <span style={{ fontSize: 20, fontWeight: 600 }}>days</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.accentColor,
                }}
              >
                ↓ -12% vs National Average
              </div>
            </div>
          </div>

          {/* ── Central Data ─────────────────────────────────────────────── */}
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}
          >
            {/* ECG Panel */}
            <div
              style={{
                ...panel,
                padding: 20,
                height: 280,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                    Patient Vitals: Room 402
                  </h3>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: c.sidebarActiveBackground,
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: c.accentColor,
                    }}
                  >
                    ECG Lead II
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: c.textMuted }}>
                      Heart Rate
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: c.accentColor,
                        lineHeight: 1,
                      }}
                    >
                      72 BPM
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 24,
                      color: c.accentColor,
                      animation: "omnipulse-slow 3s ease-in-out infinite",
                    }}
                  >
                    ♥
                  </span>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: 8,
                  background: c.pageBackground + "88",
                  border: `1px solid ${c.borderColor}`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={160}
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    right: 0,
                    background: `linear-gradient(to left, ${c.panelBackground}, transparent 60%)`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Procedures */}
            <div
              style={{
                ...panel,
                padding: 20,
                height: 280,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  Upcoming Procedures
                </h3>
                <span
                  style={{
                    fontSize: 12,
                    color: c.accentColor,
                    cursor: "pointer",
                  }}
                >
                  View Calendar
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflowY: "auto",
                }}
              >
                {[
                  {
                    time: "08:00",
                    period: "AM",
                    title: "Coronary Bypass",
                    patient: "John D.",
                    room: "OR-3",
                    color: c.accentColor,
                  },
                  {
                    time: "10:30",
                    period: "AM",
                    title: "Valve Replacement",
                    patient: "Sarah M.",
                    room: "OR-1",
                    color: c.secondaryColor,
                  },
                  {
                    time: "01:15",
                    period: "PM",
                    title: "Angioplasty",
                    patient: "Robert K.",
                    room: "OR-5",
                    color: c.textMuted,
                  },
                ].map((p) => (
                  <div
                    key={p.title}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: c.sidebarActiveBackground,
                      borderLeft: `3px solid ${p.color}`,
                    }}
                  >
                    <div
                      style={{
                        background: c.pageBackground + "88",
                        padding: "4px 8px",
                        borderRadius: 6,
                        textAlign: "center",
                        minWidth: 44,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: c.textMuted,
                          lineHeight: 1,
                        }}
                      >
                        {p.time}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: c.textPrimary,
                        }}
                      >
                        {p.period}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 11, color: c.textMuted }}>
                        {p.patient} · {p.room}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom Row ───────────────────────────────────────────────── */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {/* Weekly intake chart */}
            <div
              style={{
                ...panel,
                padding: 20,
                height: 220,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  Weekly Patient Intake
                </h3>
                <select className="omni-select">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <svg
                  viewBox="0 0 700 150"
                  style={{ width: "100%", height: "100%" }}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={`areaGrad-${c.accentColor.replace("#", "")}`}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={c.accentColor}
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor={c.accentColor}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
                    <line x1="0" x2="700" y1="40" y2="40" />
                    <line x1="0" x2="700" y1="80" y2="80" />
                    <line x1="0" x2="700" y1="120" y2="120" />
                  </g>
                  <path
                    d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130 V 150 H 0 Z"
                    fill={`url(#areaGrad-${c.accentColor.replace("#", "")})`}
                  />
                  <path
                    d="M 0 120 C 50 110,100 130,150 100 C 200 70,250 40,300 10 C 350 -20,400 60,450 80 C 500 100,550 115,600 125 C 650 135,700 130,700 130"
                    fill="none"
                    stroke={c.accentColor}
                    strokeWidth="2.5"
                  />
                  <circle cx="300" cy="10" r="4" fill={c.accentColor} />
                  <circle
                    cx="300"
                    cy="10"
                    r="10"
                    fill="none"
                    stroke={c.accentColor}
                    strokeOpacity="0.3"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="4;14"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 6,
                }}
              >
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                  <span
                    key={d}
                    style={{
                      fontSize: 10,
                      color: d === "WED" ? c.accentColor : c.textMuted,
                      fontWeight: d === "WED" ? 700 : 400,
                      fontFamily: "monospace",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Pathology distribution */}
            <div
              style={{
                ...panel,
                padding: 20,
                height: 220,
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}
                >
                  Pathology Distribution
                </h3>
                {[
                  { label: "Cardiovascular", pct: 64, color: c.accentColor },
                  { label: "Post-Surgical", pct: 22, color: c.secondaryColor },
                  { label: "Diagnostics", pct: 14, color: "#adc6ff" },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: c.textMuted }}>{item.label}</span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: c.textPrimary,
                        }}
                      >
                        {item.pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: c.sidebarActiveBackground,
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${item.pct}%`,
                          background: item.color,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Donut */}
              <div
                style={{
                  position: "relative",
                  width: 110,
                  height: 110,
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "rotate(-90deg)",
                  }}
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={c.accentColor}
                    strokeWidth="3"
                    strokeDasharray="64 100"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={c.secondaryColor}
                    strokeWidth="3"
                    strokeDasharray="22 100"
                    strokeDashoffset="-64"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                    1.2k
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      color: c.textMuted,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: c.accentColor,
          color: "#000",
          border: "none",
          cursor: "pointer",
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: accentGlow,
          zIndex: 10,
          transition: "transform 0.15s",
        }}
        title="Code Blue Alert"
      >
        🚨
      </button>
    </div>
  );
}
