"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckboxConfig,
  CheckboxVariant,
  CHECKBOX_VARIANTS,
  VARIANT_LABELS,
  VARIANT_DESCRIPTIONS,
} from "@/lib/checkboxConfig";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const DEMO_LABELS = [
  "Notifications enabled",
  "Save to drafts",
  "Share analytics",
  "Dark mode",
  "Auto-update",
  "Beta features",
  "Email digest",
  "Two-factor auth",
  "Public profile",
  "Remember me",
];

// Inject keyframes once into document head
function useGlobalStyles(css: string) {
  useEffect(() => {
    const id = "cbx-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);
}

const KEYFRAMES = `
@keyframes cbx-draw { to { stroke-dashoffset: 0; } }
@keyframes cbx-stamp { 0%{transform:scale(1.5);opacity:0} 60%{transform:scale(0.88)} 100%{transform:scale(1);opacity:1} }
@keyframes cbx-ripple { 0%{transform:scale(0);opacity:0.7} 100%{transform:scale(2.8);opacity:0} }
@keyframes cbx-neon-flicker {
  0%{opacity:1} 5%{opacity:0.4} 10%{opacity:1} 15%{opacity:0.6} 20%{opacity:1}
  75%{opacity:1} 76%{opacity:0.3} 77%{opacity:1} 100%{opacity:1}
}
@keyframes cbx-neon-glow { 0%,100%{box-shadow:0 0 6px 2px currentColor,0 0 16px 4px currentColor} 50%{box-shadow:0 0 10px 4px currentColor,0 0 28px 8px currentColor} }
@keyframes cbx-flip-in { 0%{transform:rotateY(90deg);opacity:0} 100%{transform:rotateY(0deg);opacity:1} }
@keyframes cbx-scribble { to { stroke-dashoffset: 0; } }
@keyframes cbx-glitch-1 { 0%,100%{clip-path:inset(0 0 0 0)} 20%{clip-path:inset(2px 0 18px 0);transform:translate(-2px,0)} 40%{clip-path:inset(14px 0 2px 0);transform:translate(2px,0)} 60%{clip-path:inset(6px 0 10px 0);transform:translate(-1px,0)} 80%{clip-path:inset(0 0 0 0)} }
@keyframes cbx-glitch-2 { 0%,100%{clip-path:inset(0 0 0 0)} 20%{clip-path:inset(14px 0 2px 0);transform:translate(3px,0)} 40%{clip-path:inset(2px 0 18px 0);transform:translate(-2px,0)} 60%{clip-path:inset(10px 0 6px 0);transform:translate(1px,0)} 80%{clip-path:inset(0 0 0 0)} }
@keyframes cbx-elastic { 0%{transform:scale(1)} 20%{transform:scale(0.7,1.3)} 40%{transform:scale(1.3,0.7)} 55%{transform:scale(0.88,1.1)} 70%{transform:scale(1.05,0.95)} 100%{transform:scale(1)} }
@keyframes cbx-unfold { 0%{clip-path:polygon(0 0,0 0,0 100%,0 100%)} 100%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)} }
@keyframes cbx-slide-in { 0%{transform:translateX(-110%)} 100%{transform:translateX(0)} }
`;

// ─── Individual Variant Checkboxes ────────────────────────────────────────────

// 1. MORPH
function MorphCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  const pathLen = 28;
  return (
    <button
      onClick={onChange}
      style={{
        width: s,
        height: s,

        background: checked ? cbg : ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "background 0.28s cubic-bezier(.4,0,.2,1), border-color 0.28s, border-radius 0.28s",
        padding: 0,
        flexShrink: 0,
        borderRadius: checked ? br + 4 : br,
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={path}
          fill="none"
          stroke={ckc}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={checked ? 0 : pathLen}
          style={{
            transition: "stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1) 0.05s",
          }}
        />
      </svg>
    </button>
  );
}

// 2. STAMP
function StampCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const [key, setKey] = useState(0);
  function handleClick() {
    onChange();
    if (!checked) setKey((k) => k + 1);
  }
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  return (
    <button
      onClick={handleClick}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: checked ? cbg : ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        animation: checked ? `cbx-stamp 0.35s cubic-bezier(.4,0,.2,1)` : "none",
      }}
      key={key}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <path
          d={path}
          fill="none"
          stroke={checked ? ckc : "transparent"}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.1s 0.1s" }}
        />
      </svg>
    </button>
  );
}

// 3. SLIDE
function SlideCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  return (
    <button
      onClick={onChange}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: checked ? cbg : ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.22s, border-color 0.22s",
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        style={{ overflow: "visible" }}
      >
        <g
          style={{
            transform: checked ? "translateX(0)" : "translateX(-110%)",
            transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <path
            d={path}
            fill="none"
            stroke={ckc}
            strokeWidth={2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
}

// 4. RIPPLE
function RippleCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
    accentColor,
  } = config;
  const [ripple, setRipple] = useState(false);
  function handleClick() {
    onChange();
    if (!checked) {
      setRipple(false);
      requestAnimationFrame(() => setRipple(true));
    }
  }
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  const pathLen = 28;
  return (
    <div style={{ position: "relative", width: s, height: s, flexShrink: 0 }}>
      {ripple && (
        <span
          onAnimationEnd={() => setRipple(false)}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `${accentColor}55`,
            animation: "cbx-ripple 0.55s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}
      <button
        onClick={handleClick}
        style={{
          width: s,
          height: s,
          borderRadius: br,
          background: checked ? cbg : ubg,
          border: `${ubw}px solid ${checked ? cbg : ubc}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "background 0.22s, border-color 0.22s",
          position: "relative",
          zIndex: 1,
        }}
      >
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={path}
            fill="none"
            stroke={ckc}
            strokeWidth={2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={checked ? 0 : pathLen}
            style={{ transition: "stroke-dashoffset 0.28s ease 0.05s" }}
          />
        </svg>
      </button>
    </div>
  );
}

// 5. NEON
function NeonCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
    accentColor,
  } = config;
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  const pathLen = 28;
  return (
    <button
      onClick={onChange}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: checked ? `${accentColor}18` : ubg,
        border: `${ubw}px solid ${checked ? accentColor : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        color: accentColor,
        animation: checked ? "cbx-neon-glow 1.8s ease-in-out infinite" : "none",
        boxShadow: checked
          ? `0 0 8px 2px ${accentColor}88, 0 0 20px 4px ${accentColor}44`
          : "none",
        transition: "background 0.2s, border-color 0.2s, box-shadow 0.3s",
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <path
          d={path}
          fill="none"
          stroke={checked ? accentColor : "transparent"}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={checked ? 0 : pathLen}
          style={{
            transition: "stroke-dashoffset 0.3s ease, stroke 0.1s",
            filter: checked ? `drop-shadow(0 0 3px ${accentColor})` : "none",
            animation: checked
              ? "cbx-neon-flicker 3s ease-in-out infinite"
              : "none",
          }}
        />
      </svg>
    </button>
  );
}

// 6. FLIP
function FlipCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  return (
    <div
      style={{
        width: s,
        height: s,
        perspective: 80,
        flexShrink: 0,
        cursor: "pointer",
      }}
      onClick={onChange}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: checked ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.45s cubic-bezier(.4,0,.2,1)",
          position: "relative",
        }}
      >
        {/* Front (unchecked) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: br,
            background: ubg,
            border: `${ubw}px solid ${ubc}`,
            backfaceVisibility: "hidden",
          }}
        />
        {/* Back (checked) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: br,
            background: cbg,
            border: `${ubw}px solid ${cbg}`,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
            <path
              d={path}
              fill="none"
              stroke={ckc}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// 7. SCRIBBLE
function ScribbleCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  // Wobbly scribble path — slightly imperfect to look hand-drawn
  const scribblePath = `M${s * 0.18} ${s * 0.52} C${s * 0.26} ${s * 0.44} ${s * 0.32} ${s * 0.72} ${s * 0.42} ${s * 0.72} C${s * 0.5} ${s * 0.72} ${s * 0.56} ${s * 0.58} ${s * 0.65} ${s * 0.42} L${s * 0.82} ${s * 0.26}`;
  const pathLen = 52;
  return (
    <button
      onClick={onChange}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: checked ? cbg : ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.22s, border-color 0.22s",
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={scribblePath}
          fill="none"
          stroke={ckc}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={checked ? 0 : pathLen}
          style={{
            transition: "stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
    </button>
  );
}

// 8. GLITCH
function GlitchCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
    accentColor,
    accentSecondary,
  } = config;
  const [glitching, setGlitching] = useState(false);
  function handleClick() {
    onChange();
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  }
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  return (
    <div
      style={{
        position: "relative",
        width: s,
        height: s,
        flexShrink: 0,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: s,
          height: s,
          borderRadius: br,
          background: checked ? cbg : ubg,
          border: `${ubw}px solid ${checked ? cbg : ubc}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <path
            d={path}
            fill="none"
            stroke={ckc}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </svg>
      </div>
      {/* Glitch layers */}
      {glitching && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: br,
              background: accentColor,
              opacity: 0.55,
              animation: "cbx-glitch-1 0.45s steps(1) forwards",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: br,
              background: accentSecondary,
              opacity: 0.45,
              animation: "cbx-glitch-2 0.45s steps(1) 0.05s forwards",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </div>
  );
}

// 9. ELASTIC
function ElasticCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const [key, setKey] = useState(0);
  function handleClick() {
    onChange();
    setKey((k) => k + 1);
  }
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  const pathLen = 28;
  return (
    <button
      onClick={handleClick}
      key={key}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: checked ? cbg : ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        animation: "cbx-elastic 0.5s cubic-bezier(.4,0,.2,1)",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <path
          d={path}
          fill="none"
          stroke={ckc}
          strokeWidth={2.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={checked ? 0 : pathLen}
          style={{ transition: "stroke-dashoffset 0.25s ease 0.1s" }}
        />
      </svg>
    </button>
  );
}

// 10. UNFOLD
function UnfoldCheckbox({
  checked,
  onChange,
  config,
}: {
  checked: boolean;
  onChange: () => void;
  config: CheckboxConfig;
}) {
  const {
    size: s,
    borderRadius: br,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    uncheckedBorderWidth: ubw,
    checkedBackground: cbg,
    checkmarkColor: ckc,
  } = config;
  const path = `M${s * 0.22} ${s * 0.5} L${s * 0.42} ${s * 0.7} L${s * 0.78} ${s * 0.3}`;
  return (
    <button
      onClick={onChange}
      style={{
        width: s,
        height: s,
        borderRadius: br,
        background: ubg,
        border: `${ubw}px solid ${checked ? cbg : ubc}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.22s",
      }}
    >
      {/* Checked fill layer that unfolds */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: cbg,
          clipPath: checked
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 0 0, 0 100%, 0 100%)",
          transition: "clip-path 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        style={{ position: "relative", zIndex: 1 }}
      >
        <path
          d={path}
          fill="none"
          stroke={checked ? ckc : "transparent"}
          strokeWidth={2.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.1s 0.25s" }}
        />
      </svg>
    </button>
  );
}

// ─── Variant Renderer ─────────────────────────────────────────────────────────

const VARIANT_COMPONENTS: Record<
  CheckboxVariant,
  React.FC<{ checked: boolean; onChange: () => void; config: CheckboxConfig }>
> = {
  morph: MorphCheckbox,
  stamp: StampCheckbox,
  slide: SlideCheckbox,
  ripple: RippleCheckbox,
  neon: NeonCheckbox,
  flip: FlipCheckbox,
  scribble: ScribbleCheckbox,
  glitch: GlitchCheckbox,
  elastic: ElasticCheckbox,
  unfold: UnfoldCheckbox,
};

// ─── Single Item ──────────────────────────────────────────────────────────────

function CheckboxItem({
  variant,
  index,
  config,
}: {
  variant: CheckboxVariant;
  index: number;
  config: CheckboxConfig;
}) {
  const [checked, setChecked] = useState(index % 3 === 0);
  const Comp = VARIANT_COMPONENTS[variant];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: config.labelGap,
        cursor: "pointer",
      }}
      onClick={() => setChecked((c) => !c)}
    >
      <Comp
        checked={checked}
        onChange={() => setChecked((c) => !c)}
        config={config}
      />
      {config.showLabels && (
        <span
          style={{
            color: config.labelColor,
            fontSize: config.labelFontSize,
            fontFamily: "Instrument Sans, sans-serif",
            userSelect: "none",
            lineHeight: 1.3,
          }}
        >
          {DEMO_LABELS[index % DEMO_LABELS.length]}
        </span>
      )}
    </div>
  );
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

export function CheckboxPreview({ config }: { config: CheckboxConfig }) {
  useGlobalStyles(KEYFRAMES);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: config.itemGap,
        padding: 32,
        fontFamily: "Instrument Sans, sans-serif",
      }}
    >
      {/* Variant label */}
      <div
        style={{
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: config.accentColor,
            fontFamily: "DM Mono, monospace",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          variant
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: config.labelColor,
            letterSpacing: "-0.02em",
          }}
        >
          {config.variant.charAt(0).toUpperCase() + config.variant.slice(1)}
        </span>
        <span
          style={{
            fontSize: 12,
            color: `${config.labelColor}80`,
            marginTop: 2,
          }}
        >
          {VARIANT_DESCRIPTIONS[config.variant]}
        </span>
      </div>

      {/* 5 demo checkboxes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <CheckboxItem
          key={`${config.variant}-${i}`}
          variant={config.variant}
          index={i}
          config={config}
        />
      ))}
    </div>
  );
}
