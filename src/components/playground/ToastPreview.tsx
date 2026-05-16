// /components/playground/ToastPreview.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToastConfig, ToastVariant, ToastPosition } from "@/lib/toastConfig";

interface ToastPreviewProps {
  config: ToastConfig;
}

// ─── SVG Icons ────────────────────────────────────────────────────
const ICONS = {
  check: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5l10-10" />
    </svg>
  ),
  spinner: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "toast-spin 0.8s linear infinite" }}
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  ),
  clock: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  cpu: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M3 10h2M3 14h2M10 3v2M14 3v2M21 10h-2M21 14h-2M14 21v-2M10 21v-2" />
    </svg>
  ),
  sparkle: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275l5.813 1.912l-5.813 1.912a2 2 0 0 0-1.275 1.275l-1.912 5.813l-1.912-5.813a2 2 0 0 0-1.275-1.275l-5.813-1.912l5.813-1.912a2 2 0 0 0 1.275-1.275z" />
    </svg>
  ),
  bolt: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 3l0 7l6 0l-8 11l0-7l-6 0l8-11" />
    </svg>
  ),
  wand: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 21l15-15l-3-3l-15 15l3 3" />
      <path d="M15 6l3 3" />
      <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" />
    </svg>
  ),
  rocket: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3-5a9 9 0 0 0 6-8a3 3 0 0 0-3-3a9 9 0 0 0-8 6a6 6 0 0 0-5 3" />
      <path d="M7 14a6 6 0 0 0-3 6a6 6 0 0 0 6-3" />
      <circle cx="15" cy="9" r="1" />
    </svg>
  ),
  brain: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.5 13a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
      <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1-7 0v-1.8" />
      <path d="M17.5 16a3.5 3.5 0 0 0 0-7h-.5" />
      <path d="M19 9.3v-2.8a3.5 3.5 0 0 0-7 0" />
      <path d="M6.5 16a3.5 3.5 0 0 1 0-7h.5" />
      <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
    </svg>
  ),
  close: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6l-12 12M6 6l12 12" />
    </svg>
  ),
};

const VARIANT_ICONS: Record<ToastVariant, keyof typeof ICONS> = {
  success: "check",
  loading: "spinner",
  countdown: "clock",
  multistep: "cpu",
  progress: "sparkle",
  action: "bolt",
  gradient: "wand",
  promise: "rocket",
  error: "bolt",
  streaming: "brain",
};

const VARIANT_DEFAULT_ICON_COLORS: Record<ToastVariant, string> = {
  success: "#4ade80",
  loading: "#7c6cfc",
  countdown: "#f97316",
  multistep: "#06b6d4",
  progress: "#7c6cfc",
  action: "#f59e0b",
  gradient: "#a855f7",
  promise: "#f97316",
  error: "#f87171",
  streaming: "#8b5cf6",
};

const MULTISTEP_STEPS = ["Tokenize", "Embed", "Classify"];
const STREAMING_TEXT =
  "Attention is all you need — the foundation of every modern language model.";

// ─── Position diagram ─────────────────────────────────────────────
function PositionDiagram({ position }: { position: ToastPosition }) {
  const positions: ToastPosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
        width: 72,
        height: 52,
        padding: 4,
        background: "#0c0c0f",
        borderRadius: 8,
        border: "1px solid #2a2a38",
      }}
    >
      {positions.map((pos) => (
        <div
          key={pos}
          style={{
            borderRadius: 3,
            background: pos === position ? "#7c6cfc" : "#1c1c22",
            border: `1px solid ${pos === position ? "#7c6cfc" : "#2a2a38"}`,
            transition: "all 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── The actual toast renderer ─────────────────────────────────────
function LiveToast({
  config,
  replayKey,
  onReplayDone,
}: {
  config: ToastConfig;
  replayKey: number;
  onReplayDone: () => void;
}) {
  const {
    variant,
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
    showCloseButton,
  } = config;

  // Derived icon color — use config.iconColor for static, override for dynamic
  const resolvedIconColor = iconColor || VARIANT_DEFAULT_ICON_COLORS[variant];

  // ── Countdown state ──
  const [countdown, setCountdown] = useState(5);
  const [countdownDone, setCountdownDone] = useState(false);

  // ── Multistep state ──
  const [stepIndex, setStepIndex] = useState(0); // which step is active
  const [stepsDone, setStepsDone] = useState<number[]>([]); // completed indices
  const [multistepDone, setMultistepDone] = useState(false);

  // ── Progress bar state ──
  const [progressPct, setProgressPct] = useState(100);

  // ── Promise state ──
  const [promiseDone, setPromiseDone] = useState(false);

  // ── Streaming state ──
  const [streamedText, setStreamedText] = useState("");
  const [streamingDone, setStreamingDone] = useState(false);

  // ── Gradient sweep angle ──
  const [sweepAngle, setSweepAngle] = useState(0);

  // Reset all state on replayKey change
  useEffect(() => {
    setCountdown(5);
    setCountdownDone(false);
    setStepIndex(0);
    setStepsDone([]);
    setMultistepDone(false);
    setProgressPct(100);
    setPromiseDone(false);
    setStreamedText("");
    setStreamingDone(false);
    setSweepAngle(0);
  }, [replayKey, variant]);

  // Countdown loop
  useEffect(() => {
    if (variant !== "countdown") return;
    if (countdownDone) {
      const resetTimer = setTimeout(() => {
        setCountdown(5);
        setCountdownDone(false);
      }, 2500);
      return () => clearTimeout(resetTimer);
    }
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setCountdownDone(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [variant, countdownDone, replayKey]);

  // Multistep loop
  useEffect(() => {
    if (variant !== "multistep") return;
    if (multistepDone) {
      const reset = setTimeout(() => {
        setStepIndex(0);
        setStepsDone([]);
        setMultistepDone(false);
      }, 2500);
      return () => clearTimeout(reset);
    }
    const iv = setInterval(() => {
      setStepsDone((prev) => {
        const newDone = [...prev, stepIndex];
        return newDone;
      });
      setStepIndex((i) => {
        const next = i + 1;
        if (next >= MULTISTEP_STEPS.length) {
          setMultistepDone(true);
        }
        return next;
      });
    }, 1100);
    return () => clearInterval(iv);
  }, [variant, stepIndex, multistepDone, replayKey]);

  // Progress bar animation
  useEffect(() => {
    if (variant !== "progress") return;
    setProgressPct(100);
    const start = performance.now();
    const duration = 3500;
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgressPct(pct);
      if (pct > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setProgressPct(100), 800);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, replayKey]);

  // Promise morph
  useEffect(() => {
    if (variant !== "promise") return;
    setPromiseDone(false);
    const t = setTimeout(() => setPromiseDone(true), 2200);
    const reset = setTimeout(() => setPromiseDone(false), 5000);
    return () => {
      clearTimeout(t);
      clearTimeout(reset);
    };
  }, [variant, replayKey]);

  // Streaming typewriter loop
  useEffect(() => {
    if (variant !== "streaming") return;
    setStreamedText("");
    setStreamingDone(false);
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      setStreamedText(STREAMING_TEXT.slice(0, idx));
      if (idx >= STREAMING_TEXT.length) {
        clearInterval(iv);
        setStreamingDone(true);
        setTimeout(() => {
          setStreamedText("");
          setStreamingDone(false);
        }, 2000);
      }
    }, 38);
    return () => clearInterval(iv);
  }, [variant, replayKey]);

  // Gradient sweep rotation
  useEffect(() => {
    if (variant !== "gradient") return;
    let angle = 0;
    const iv = setInterval(() => {
      angle = (angle + 2) % 360;
      setSweepAngle(angle);
    }, 16);
    return () => clearInterval(iv);
  }, [variant]);

  // ── Derived display values ──
  const isCountdownDone = variant === "countdown" && countdownDone;
  const isPromiseDone = variant === "promise" && promiseDone;
  const isMultistepDone = variant === "multistep" && multistepDone;
  const isStreamingDone = variant === "streaming" && streamingDone;

  const displayTitle = (() => {
    if (isCountdownDone) return "Limit Reset";
    if (isPromiseDone) return "Scan Passed";
    if (isMultistepDone) return "Pipeline Complete";
    if (isStreamingDone) return "Response Complete";
    return title;
  })();

  const displayIconColor = (() => {
    if (isCountdownDone || isPromiseDone || isMultistepDone || isStreamingDone)
      return "#4ade80";
    return resolvedIconColor;
  })();

  const displayIcon = (() => {
    if (isCountdownDone || isPromiseDone || isMultistepDone || isStreamingDone)
      return ICONS.check;
    return ICONS[VARIANT_ICONS[variant]];
  })();

  // ── Toast border ──
  const toastBorder =
    variant === "gradient" ? "none" : `1px solid ${borderColor}`;

  const toastBoxShadow =
    variant === "error"
      ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${borderColor}`
      : `0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)`;

  const gradientBorder =
    variant === "gradient"
      ? `linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
       conic-gradient(from ${sweepAngle}deg, #a855f7, #06b6d4, #10b981, #a855f7) border-box`
      : undefined;

  // ── Entrance animation class ──
  const animMap: Record<ToastVariant, string> = {
    success: "toast-anim-slide-right",
    loading: "toast-anim-glow-in",
    countdown: "toast-anim-pulse-in",
    multistep: "toast-anim-cascade",
    progress: "toast-anim-slide-left",
    action: "toast-anim-slide-up",
    gradient: "toast-anim-sweep-in",
    promise: "toast-anim-morph",
    error: "toast-anim-shake",
    streaming: "toast-anim-flip-in",
  };

  const topBorderColor =
    variant === "success" ? "#4ade80" : variant === "error" ? "#f87171" : null;

  return (
    <div
      key={replayKey}
      className={animMap[variant]}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        maxWidth: 380,
        padding: "14px 16px",
        background:
          variant === "gradient"
            ? gradientBorder
              ? backgroundColor
              : backgroundColor
            : backgroundColor,
        backgroundImage: variant === "gradient" ? gradientBorder : undefined,
        border: variant === "gradient" ? "2px solid transparent" : toastBorder,
        borderTop: topBorderColor ? `2px solid ${topBorderColor}` : undefined,
        borderRadius,
        boxShadow: toastBoxShadow,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: `${displayIconColor}18`,
          color: displayIconColor,
          transition: "all 0.4s ease",
        }}
      >
        {displayIcon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: titleColor,
            lineHeight: 1.3,
            marginBottom: 2,
            transition: "color 0.3s ease",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {displayTitle}
        </p>

        {/* Countdown */}
        {variant === "countdown" && !isCountdownDone && (
          <p style={{ fontSize: 12, color: messageColor }}>
            Retry in{" "}
            <span style={{ color: "#f97316", fontWeight: 700 }}>
              {countdown}s
            </span>
            ...
          </p>
        )}
        {variant === "countdown" && isCountdownDone && (
          <p style={{ fontSize: 12, color: "#4ade80" }}>
            Ready — send your request.
          </p>
        )}

        {/* Multistep */}
        {variant === "multistep" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 2,
            }}
          >
            {MULTISTEP_STEPS.map((step, i) => {
              const isDone = stepsDone.includes(i);
              const isActive = i === stepIndex && !multistepDone;
              return (
                <div
                  key={step}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        width: 16,
                        height: 1,
                        background: isDone ? "#10b981" : "#2a2a38",
                        transition: "background 0.3s ease",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isDone
                        ? "#10b981"
                        : isActive
                          ? "#06b6d4"
                          : "#2a2a38",
                      boxShadow: isActive
                        ? "0 0 8px rgba(6,182,212,0.6)"
                        : "none",
                      transition: "all 0.3s ease",
                      animation: isActive
                        ? "toast-dot-pulse 0.8s ease infinite"
                        : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                      color: isDone
                        ? "#10b981"
                        : isActive
                          ? titleColor
                          : messageColor,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Streaming */}
        {variant === "streaming" && (
          <p style={{ fontSize: 12, color: messageColor, lineHeight: 1.5 }}>
            {streamedText}
            {!isStreamingDone && (
              <span
                style={{
                  animation: "toast-cursor-blink 0.6s step-end infinite",
                  color: "#8b5cf6",
                  fontWeight: 700,
                }}
              >
                |
              </span>
            )}
          </p>
        )}

        {/* Static message variants */}
        {variant !== "countdown" &&
          variant !== "multistep" &&
          variant !== "streaming" && (
            <p
              style={{
                fontSize: 12,
                color: isPromiseDone ? "#4ade80" : messageColor,
                lineHeight: 1.4,
                transition: "color 0.3s ease",
              }}
            >
              {isPromiseDone
                ? "No hallucinations detected. Output verified."
                : message}
            </p>
          )}
      </div>

      {/* Action button */}
      {variant === "action" && (
        <button
          style={{
            flexShrink: 0,
            padding: "5px 12px",
            borderRadius: 6,
            border: "none",
            background: `linear-gradient(135deg, ${accentColor}, #9d91fd)`,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {actionLabel}
        </button>
      )}

      {/* Close button */}
      {showCloseButton && (
        <button
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            color: messageColor,
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.6,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          {ICONS.close}
        </button>
      )}

      {/* Progress bar */}
      {showProgressBar && variant === "progress" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `${accentColor}20`,
            borderRadius: "0 0 12px 12px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: variant === "progress" ? `${progressPct}%` : "100%",
              background: accentColor,
              borderRadius: "0 0 12px 12px",
              transformOrigin: "left",
              animation: "toast-progress-shrink 3.5s linear forwards",

              transition:
                variant === "progress" ? "width 0.05s linear" : "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Preview ──────────────────────────────────────────────────
export function ToastPreview({ config }: ToastPreviewProps) {
  const [replayKey, setReplayKey] = useState(0);

  // Re-trigger animation when variant changes
  const prevVariant = useRef(config.variant);
  useEffect(() => {
    if (config.variant !== prevVariant.current) {
      prevVariant.current = config.variant;
      setReplayKey((k) => k + 1);
    }
  }, [config.variant]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "2.5rem 1.5rem",
        width: "100%",
      }}
    >
      {/* Toast */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <LiveToast
          config={config}
          replayKey={replayKey}
          onReplayDone={() => {}}
        />
      </div>

      {/* Controls row: replay + position diagram */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Replay */}
        <button
          onClick={() => setReplayKey((k) => k + 1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #2a2a38",
            background: "#1c1c22",
            color: "#9090a8",
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.06em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#7c6cfc";
            e.currentTarget.style.color = "#9d91fd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a38";
            e.currentTarget.style.color = "#9090a8";
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
            <path d="M20 4v5h-5" />
          </svg>
          REPLAY
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#2a2a38" }} />

        {/* Position label + diagram */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              color: "#5a5a72",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.06em",
            }}
          >
            POSITION
          </span>
          <PositionDiagram position={config.position} />
        </div>
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes toast-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toast-dot-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(6,182,212,0.3); }
          50%       { box-shadow: 0 0 10px rgba(6,182,212,0.7); }
        }
        @keyframes toast-cursor-blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes toast-progress-shrink {
          from { transform: scaleX(1); } to { transform: scaleX(0); }
        }

        /* Entrance animations */
        .toast-anim-slide-right {
          animation: _slide-right 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _slide-right {
          from { opacity:0; transform: translateX(60px) scale(0.96); }
          to   { opacity:1; transform: translateX(0) scale(1); }
        }
        .toast-anim-slide-left {
          animation: _slide-left 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _slide-left {
          from { opacity:0; transform: translateX(-60px) scale(0.96); }
          to   { opacity:1; transform: translateX(0) scale(1); }
        }
        .toast-anim-slide-up {
          animation: _slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _slide-up {
          from { opacity:0; transform: translateY(40px) scale(0.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .toast-anim-glow-in {
          animation: _glow-in 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes _glow-in {
          0%  { opacity:0; transform:scale(0.92); box-shadow:0 0 0 0 rgba(99,102,241,0); }
          50% { opacity:1; box-shadow:0 0 24px 4px rgba(99,102,241,0.25); }
          100%{ opacity:1; transform:scale(1); }
        }
        .toast-anim-pulse-in {
          animation: _pulse-in 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _pulse-in {
          0%  { opacity:0; transform:scale(0.8); }
          50% { opacity:1; transform:scale(1.04); }
          100%{ opacity:1; transform:scale(1); }
        }
        .toast-anim-cascade {
          animation: _cascade 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _cascade {
          0%  { opacity:0; transform:translateY(-16px) scaleY(0.9); }
          60% { opacity:1; transform:translateY(3px) scaleY(1.01); }
          100%{ opacity:1; transform:translateY(0) scaleY(1); }
        }
        .toast-anim-sweep-in {
          animation: _sweep-in 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _sweep-in {
          0%  { opacity:0; transform:translateX(-30px) scale(0.96); filter:blur(4px); }
          60% { opacity:1; filter:blur(0); }
          100%{ opacity:1; transform:translateX(0) scale(1); }
        }
        .toast-anim-morph {
          animation: _morph 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes _morph {
          from { opacity:0; transform:translateY(12px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .toast-anim-shake {
          animation: _shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        @keyframes _shake {
          0%  { opacity:0; transform:translateX(0) scale(0.95); }
          20% { opacity:1; transform:translateX(-5px) scale(1); }
          40% { transform:translateX(4px); }
          60% { transform:translateX(-3px); }
          80% { transform:translateX(2px); }
          100%{ opacity:1; transform:translateX(0) scale(1); }
        }
        .toast-anim-flip-in {
          animation: _flip-in 0.55s cubic-bezier(0.22,1,0.36,1) both;
          transform-origin: top center;
        }
        @keyframes _flip-in {
          0%  { opacity:0; transform:perspective(600px) rotateX(-15deg) translateY(-20px) scale(0.95); }
          60% { opacity:1; transform:perspective(600px) rotateX(3deg) translateY(2px) scale(1.01); }
          100%{ opacity:1; transform:perspective(600px) rotateX(0) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
