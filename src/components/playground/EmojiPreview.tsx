"use client";

import { useEffect, useRef } from "react";
import type {
  EmojiConfig,
  EmojiVariant,
  EmojiAnimation,
} from "@/lib/emojiConfig";

// ─── Keyframe injection ───────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
  30%       { transform: translateY(-18%) scaleX(0.94) scaleY(1.06); }
  50%       { transform: translateY(0) scaleX(1.06) scaleY(0.94); }
  70%       { transform: translateY(-8%) scaleX(0.98) scaleY(1.02); }
}
@keyframes emoji-spin {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(90deg) scale(1.08); }
  50%  { transform: rotate(180deg) scale(1); }
  75%  { transform: rotate(270deg) scale(1.08); }
  100% { transform: rotate(360deg) scale(1); }
}
@keyframes emoji-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  40%       { transform: scale(1.12); opacity: 0.9; }
  60%       { transform: scale(0.92); opacity: 1; }
}
@keyframes emoji-shake {
  0%, 100% { transform: rotate(0deg) translateX(0); }
  15%       { transform: rotate(-8deg) translateX(-4px); }
  35%       { transform: rotate(8deg) translateX(4px); }
  55%       { transform: rotate(-6deg) translateX(-3px); }
  75%       { transform: rotate(6deg) translateX(3px); }
  90%       { transform: rotate(-2deg) translateX(-1px); }
}
@keyframes emoji-float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%       { transform: translateY(-12%) rotate(1deg); }
}
@keyframes emoji-rubber {
  0%,  100% { transform: scaleX(1)    scaleY(1); }
  20%        { transform: scaleX(0.88) scaleY(1.2); }
  40%        { transform: scaleX(1.22) scaleY(0.82); }
  60%        { transform: scaleX(0.92) scaleY(1.1); }
  80%        { transform: scaleX(1.08) scaleY(0.94); }
}
`;

function useKeyframes() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const style = document.createElement("style");
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
  }, []);
}

const ANIM_NAME: Record<EmojiAnimation, string> = {
  bounce: "emoji-bounce",
  spin: "emoji-spin",
  pulse: "emoji-pulse",
  shake: "emoji-shake",
  float: "emoji-float",
  rubber: "emoji-rubber",
};

// ─── SVG face builders ────────────────────────────────────────────────────────
function HappyFace({ c }: { c: EmojiConfig }) {
  return (
    <>
      {/* Shade */}
      <ellipse
        cx="50"
        cy="56"
        rx="38"
        ry="20"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      {/* Left eye */}
      <ellipse cx="34" cy="40" rx="7" ry="8" fill={c.eyeColor} />
      <ellipse cx="36" cy="38" rx="2.5" ry="2.5" fill={c.pupilColor} />
      {/* Right eye */}
      <ellipse cx="66" cy="40" rx="7" ry="8" fill={c.eyeColor} />
      <ellipse cx="68" cy="38" rx="2.5" ry="2.5" fill={c.pupilColor} />
      {/* Cheeks */}
      <ellipse
        cx="22"
        cy="56"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.6"
      />
      <ellipse
        cx="78"
        cy="56"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.6"
      />
      {/* Smile */}
      <path
        d="M32 60 Q50 78 68 60"
        stroke={c.mouthColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function CoolFace({ c }: { c: EmojiConfig }) {
  return (
    <>
      <ellipse
        cx="50"
        cy="56"
        rx="38"
        ry="20"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      {/* Sunglasses bar */}
      <rect x="20" y="34" width="60" height="4" rx="2" fill={c.eyeColor} />
      {/* Left lens */}
      <rect
        x="18"
        y="30"
        width="24"
        height="16"
        rx="6"
        fill={c.eyeColor}
        opacity="0.9"
      />
      <rect
        x="22"
        y="34"
        width="10"
        height="7"
        rx="3"
        fill={c.accentColor}
        opacity="0.5"
      />
      {/* Right lens */}
      <rect
        x="58"
        y="30"
        width="24"
        height="16"
        rx="6"
        fill={c.eyeColor}
        opacity="0.9"
      />
      <rect
        x="62"
        y="34"
        width="10"
        height="7"
        rx="3"
        fill={c.accentColor}
        opacity="0.5"
      />
      {/* Cool smirk */}
      <path
        d="M36 62 Q46 72 64 60"
        stroke={c.mouthColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="57"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
      <ellipse
        cx="78"
        cy="57"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
    </>
  );
}

function LoveFace({ c }: { c: EmojiConfig }) {
  // Heart-shaped eyes
  function Heart({ cx, cy, s }: { cx: number; cy: number; s: number }) {
    const d = `M${cx} ${cy + s * 0.2} C${cx} ${cy - s * 0.4} ${cx - s} ${cy - s * 0.4} ${cx - s} ${cy + s * 0.3} C${cx - s} ${cy + s * 0.9} ${cx} ${cy + s * 1.2} ${cx} ${cy + s * 1.6} C${cx} ${cy + s * 1.2} ${cx + s} ${cy + s * 0.9} ${cx + s} ${cy + s * 0.3} C${cx + s} ${cy - s * 0.4} ${cx} ${cy - s * 0.4} ${cx} ${cy + s * 0.2}Z`;
    return <path d={d} fill={c.accentColor} />;
  }
  return (
    <>
      <ellipse
        cx="50"
        cy="56"
        rx="38"
        ry="20"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      <Heart cx={34} cy={32} s={8} />
      <Heart cx={66} cy={32} s={8} />
      <ellipse
        cx="22"
        cy="57"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.65"
      />
      <ellipse
        cx="78"
        cy="57"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.65"
      />
      <path
        d="M30 62 Q50 80 70 62"
        stroke={c.mouthColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Floating hearts */}
      <Heart cx={82} cy={14} s={5} />
      <Heart cx={12} cy={18} s={4} />
    </>
  );
}

function FireFace({ c }: { c: EmojiConfig }) {
  return (
    <>
      {/* Flame wisps on top of head — drawn before face so they appear behind */}
      <path
        d="M34 20 Q30 10 36 4 Q32 14 40 12 Q36 6 44 2 Q42 12 50 10 Q46 4 54 2 Q52 12 58 10 Q54 6 60 4 Q64 14 60 20"
        fill={c.accentColor}
        opacity="0.85"
      />
      <ellipse
        cx="50"
        cy="56"
        rx="38"
        ry="20"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      {/* Angry brows */}
      <path
        d="M26 35 L44 40"
        stroke={c.eyeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M74 35 L56 40"
        stroke={c.eyeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Eyes */}
      <ellipse cx="35" cy="44" rx="7" ry="7" fill={c.eyeColor} />
      <ellipse cx="37" cy="42" rx="2.5" ry="2.5" fill="#ef4444" />
      <ellipse cx="65" cy="44" rx="7" ry="7" fill={c.eyeColor} />
      <ellipse cx="67" cy="42" rx="2.5" ry="2.5" fill="#ef4444" />
      {/* Grim mouth */}
      <path
        d="M33 62 Q50 56 67 62"
        stroke={c.mouthColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="56"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
      <ellipse
        cx="78"
        cy="56"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
    </>
  );
}

function ExplodeFace({ c }: { c: EmojiConfig }) {
  // Surprised / explode
  return (
    <>
      {/* Star burst */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={50 + 42 * Math.cos((deg * Math.PI) / 180)}
          y1={50 + 42 * Math.sin((deg * Math.PI) / 180)}
          x2={50 + 52 * Math.cos((deg * Math.PI) / 180)}
          y2={50 + 52 * Math.sin((deg * Math.PI) / 180)}
          stroke={c.accentColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <ellipse
        cx="50"
        cy="56"
        rx="36"
        ry="18"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      {/* Wide eyes */}
      <circle cx="34" cy="40" r="9" fill="white" />
      <circle cx="34" cy="40" r="5" fill={c.eyeColor} />
      <circle cx="36" cy="38" r="2" fill={c.pupilColor} />
      <circle cx="66" cy="40" r="9" fill="white" />
      <circle cx="66" cy="40" r="5" fill={c.eyeColor} />
      <circle cx="68" cy="38" r="2" fill={c.pupilColor} />
      {/* Shocked O mouth */}
      <ellipse cx="50" cy="65" rx="10" ry="12" fill={c.mouthColor} />
      <ellipse cx="50" cy="65" rx="7" ry="8.5" fill="#1c0a00" />
      <ellipse
        cx="22"
        cy="54"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
      <ellipse
        cx="78"
        cy="54"
        rx="9"
        ry="6"
        fill={c.cheekColor}
        opacity="0.5"
      />
    </>
  );
}

function SleepyFace({ c }: { c: EmojiConfig }) {
  return (
    <>
      <ellipse
        cx="50"
        cy="58"
        rx="38"
        ry="18"
        fill={c.faceShadeColor}
        opacity="0.4"
      />
      {/* Half-closed eyes */}
      <ellipse cx="34" cy="42" rx="7" ry="4" fill={c.eyeColor} />
      <ellipse cx="66" cy="42" rx="7" ry="4" fill={c.eyeColor} />
      {/* Zzz */}
      <text
        x="70"
        y="28"
        fontSize="10"
        fontWeight="bold"
        fill={c.accentColor}
        fontFamily="sans-serif"
      >
        z
      </text>
      <text
        x="76"
        y="20"
        fontSize="13"
        fontWeight="bold"
        fill={c.accentColor}
        fontFamily="sans-serif"
      >
        z
      </text>
      <text
        x="83"
        y="13"
        fontSize="16"
        fontWeight="bold"
        fill={c.accentColor}
        fontFamily="sans-serif"
      >
        Z
      </text>
      {/* Drool bubble */}
      <ellipse cx="38" cy="72" rx="6" ry="8" fill="white" opacity="0.7" />
      <ellipse cx="38" cy="80" rx="4" ry="5" fill="white" opacity="0.6" />
      {/* Sleepy mouth */}
      <path
        d="M36 64 Q50 70 64 60"
        stroke={c.mouthColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="58"
        rx="9"
        ry="5"
        fill={c.cheekColor}
        opacity="0.5"
      />
      <ellipse
        cx="78"
        cy="58"
        rx="9"
        ry="5"
        fill={c.cheekColor}
        opacity="0.5"
      />
    </>
  );
}

const FACE_MAP: Record<EmojiVariant, (c: EmojiConfig) => JSX.Element> = {
  happy: (c) => <HappyFace c={c} />,
  cool: (c) => <CoolFace c={c} />,
  love: (c) => <LoveFace c={c} />,
  fire: (c) => <FireFace c={c} />,
  explode: (c) => <ExplodeFace c={c} />,
  sleepy: (c) => <SleepyFace c={c} />,
};

// ─── Main Preview ─────────────────────────────────────────────────────────────
export function EmojiPreview({ config: c }: { config: EmojiConfig }) {
  useKeyframes();

  const totalSize = c.size + c.backgroundPadding * 2;
  const animStyle: React.CSSProperties = c.animationEnabled
    ? {
        animation: `${ANIM_NAME[c.animation]} ${c.animationDuration}ms ease-in-out infinite`,
        display: "block",
      }
    : { display: "block" };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: 240,
      }}
    >
      <div
        style={{
          width: totalSize,
          height: totalSize,
          borderRadius: `${c.backgroundRadius}%`,
          background: c.showBackground ? c.backgroundColor : "transparent",
          boxShadow: c.showShadow
            ? "0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={c.size}
          height={c.size}
          style={animStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base face circle */}
          <circle cx="50" cy="50" r="46" fill={c.faceColor} />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={c.outlineColor}
            strokeWidth="2"
          />
          {/* Variant-specific face features */}
          {FACE_MAP[c.variant](c)}
        </svg>
      </div>
    </div>
  );
}
