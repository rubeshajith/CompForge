"use client";

import { LoaderConfig, LoaderVariant } from "@/lib/loaderConfig";
import { CSSProperties } from "react";

interface Props {
  config: LoaderConfig;
}

// ─── individual loaders ──────────────────────────────────────────────────────

function PulseWave({ c }: { c: LoaderConfig }) {
  const dur = `${1.4 * c.speed}s`;
  const w = c.size;
  const h = Math.round(c.size * 0.75);
  return (
    <svg width={w} height={h} viewBox="0 0 64 48" style={{ display: "block" }}>
      <defs>
        <style>{`
          @keyframes ldr-wave {
            72.5% { opacity: 0; }
            to    { stroke-dashoffset: 0; }
          }
        `}</style>
      </defs>
      <polyline
        points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
        fill="none"
        stroke={c.secondaryColor}
        strokeWidth={c.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
        fill="none"
        stroke={c.primaryColor}
        strokeWidth={c.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="48, 144"
        strokeDashoffset="192"
        style={{ animation: `ldr-wave ${dur} linear infinite` }}
      />
    </svg>
  );
}

function HexBloom({ c }: { c: LoaderConfig }) {
  const baseDur = 2.1 * c.speed;
  const s = c.size;
  const unit = s * 0.375;
  const half = unit / 2;
  const bodyH = unit * 0.5;
  const capH = bodyH * 0.5;

  const hexes = [
    { dx: -unit * 0.875, dy: 0, delay: 0 },
    { dx: -unit * 0.4375, dy: unit * 0.6875, delay: 0.1 },
    { dx: unit * 0.4375, dy: unit * 0.6875, delay: 0.2 },
    { dx: unit * 0.875, dy: 0, delay: 0.3 },
    { dx: unit * 0.4375, dy: -unit * 0.6875, delay: 0.4 },
    { dx: -unit * 0.4375, dy: -unit * 0.6875, delay: 0.5 },
    { dx: 0, dy: 0, delay: 0.6 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: s,
        height: s,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes ldr-hexbloom {
          0%,20%,80%,100% { opacity:0; transform:scale(0); }
          30%,70%          { opacity:1; transform:scale(1); }
        }
      `}</style>
      {hexes.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: h.dx - half,
            marginTop: h.dy - bodyH / 2,
            width: unit,
            height: bodyH,
            animation: `ldr-hexbloom ${baseDur}s ${h.delay * c.speed}s infinite backwards`,
          }}
        >
          {/* hex shape via borders */}
          <div
            style={{
              position: "absolute",
              top: -capH,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderBottom: `${capH}px solid ${c.primaryColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: unit,
              height: bodyH,
              background: c.primaryColor,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -capH,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderTop: `${capH}px solid ${c.primaryColor}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function OrbitRing({ c }: { c: LoaderConfig }) {
  const dur = `${2 * c.speed}s`;
  const dotSize = Math.round(c.size * 0.19);
  const dotHalf = dotSize / 2;
  return (
    <div
      style={{
        width: c.size,
        height: c.size,
        borderRadius: "50%",
        padding: `${Math.round(c.size * 0.047)}px`,
        background: `
          radial-gradient(farthest-side, ${c.primaryColor} 95%, transparent) 50% 0 / ${dotSize}px ${dotSize}px no-repeat,
          radial-gradient(farthest-side, transparent calc(100% - ${c.strokeWidth + 1}px), ${c.primaryColor} calc(100% - ${c.strokeWidth}px)) content-box
        `,
        animation: `ldr-orbit ${dur} linear infinite`,
        boxSizing: "border-box" as const,
      }}
    >
      <style>{`@keyframes ldr-orbit { to { transform: rotate(1turn); } }`}</style>
    </div>
  );
}

function YinSpiral({ c }: { c: LoaderConfig }) {
  const dur = `${2 * c.speed}s`;
  const s = c.size;
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: c.secondaryColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes ldr-yin {
          33%  { background-position: 0% 33%,  100% 33%,  200% 33%; }
          66%  { background-position: -100% 66%, 0% 66%,   100% 66%; }
          100% { background-position: 0% 100%, 100% 100%, 200% 100%; }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `
            radial-gradient(154% 68.5% at top,    transparent 79.5%, ${c.primaryColor} 80%),
            radial-gradient(154% 68.5% at bottom, ${c.primaryColor} 79.5%, transparent 80%),
            radial-gradient(154% 68.5% at top,    transparent 79.5%, ${c.primaryColor} 80%)
          `,
          backgroundSize: "50.5% 220%",
          backgroundPosition: "-100% 0%, 0% 0%, 100% 0%",
          backgroundRepeat: "no-repeat",
          animation: `ldr-yin ${dur} linear infinite`,
        }}
      />
    </div>
  );
}

function BarFill({ c }: { c: LoaderConfig }) {
  const dur = `${2 * c.speed}s`;
  const s = c.size;
  const h = Math.round(s * 0.78);
  return (
    <div style={{ width: s, height: h }}>
      <style>{`@keyframes ldr-barfill { 100% { background-size: 120% 100%; } }`}</style>
      <div
        style={{
          width: "100%",
          height: "100%",
          WebkitMask: `
            no-repeat linear-gradient(90deg, #000 70%, transparent 0) calc(0*100%/4) 100% / calc(100%/5) calc(1*100%/5),
            no-repeat linear-gradient(90deg, #000 70%, transparent 0) calc(1*100%/4) 100% / calc(100%/5) calc(2*100%/5),
            no-repeat linear-gradient(90deg, #000 70%, transparent 0) calc(2*100%/4) 100% / calc(100%/5) calc(3*100%/5),
            no-repeat linear-gradient(90deg, #000 70%, transparent 0) calc(3*100%/4) 100% / calc(100%/5) calc(4*100%/5),
            no-repeat linear-gradient(90deg, #000 70%, transparent 0) calc(4*100%/4) 100% / calc(100%/5) calc(5*100%/5)
          `,
          background: `linear-gradient(${c.primaryColor} 0 0) left/0% 100% no-repeat ${c.secondaryColor}`,
          animation: `ldr-barfill ${dur} infinite steps(6)`,
        }}
      />
    </div>
  );
}

function SlideShift({ c }: { c: LoaderConfig }) {
  const dur = `${2 * c.speed}s`;
  const s = Math.round(c.size * 0.625);
  const d = Math.round(s * 0.353);
  return (
    <div
      style={{
        position: "relative",
        width: s + d,
        height: s + d,
        display: "grid",
      }}
    >
      <style>{`
        @keyframes ldr-slide-a {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(${d * 1.5}px,0); }
          50%  { transform: translate(${d * 1.5}px,${d * 1.5}px); }
          75%  { transform: translate(0,${d * 1.5}px); }
          100% { transform: translate(0,0); }
        }
        @keyframes ldr-slide-b {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(${d * 1.5}px,0); }
          50%  { transform: translate(${d * 1.5}px,${d * 1.5}px); }
          75%  { transform: translate(0,${d * 1.5}px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            gridArea: "1/1",
            clipPath: `polygon(${d}px 0, 100% 0, 100% calc(100% - ${d}px), calc(100% - ${d}px) 100%, 0 100%, 0 ${d}px)`,
            background: `conic-gradient(from -90deg at calc(100% - ${d}px) ${d}px,
              ${c.secondaryColor} 135deg, ${c.primaryColor} 0 270deg, ${c.primaryColor}80 0)`,
            animation: `ldr-slide-${i === 0 ? "a" : "b"} ${dur} infinite`,
            animationDelay: i === 1 ? `-${c.speed}s` : "0s",
          }}
        />
      ))}
    </div>
  );
}

function DotBounce({ c }: { c: LoaderConfig }) {
  const baseDur = 1.2 * c.speed;
  const dotSize = Math.round(c.size * 0.22);
  const gap = Math.round(c.size * 0.12);
  const bounceH = Math.round(c.size * 0.45);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap, height: c.size }}
    >
      <style>{`
        @keyframes ldr-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-${bounceH}px); }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: c.primaryColor,
            animation: `ldr-dot-bounce ${baseDur}s ease-in-out ${i * 0.16 * c.speed}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function MorphBlob({ c }: { c: LoaderConfig }) {
  const dur = `${3 * c.speed}s`;
  const s = c.size;
  return (
    <div
      style={{
        width: s,
        height: s,
        background: `radial-gradient(circle at 30% 30%, ${c.primaryColor}, ${c.secondaryColor})`,
        animation: `ldr-morph ${dur} ease-in-out infinite`,
      }}
    >
      <style>{`
        @keyframes ldr-morph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%      { border-radius: 50% 60% 30% 60% / 40% 70% 60% 30%; }
          75%      { border-radius: 70% 30% 60% 40% / 30% 50% 60% 50%; }
        }
      `}</style>
    </div>
  );
}

function StaggerBars({ c }: { c: LoaderConfig }) {
  const baseDur = 1.0 * c.speed;
  const barW = Math.round(c.size * 0.14);
  const barMaxH = c.size;
  const gap = Math.round(c.size * 0.08);
  const delays = [0, 0.1, 0.2, 0.1, 0];
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap, height: barMaxH }}
    >
      <style>{`
        @keyframes ldr-stagger {
          0%,100% { height: 30%; opacity: 0.4; }
          50%      { height: 100%; opacity: 1; }
        }
      `}</style>
      {delays.map((delay, i) => (
        <div
          key={i}
          style={{
            width: barW,
            height: "30%",
            borderRadius: barW / 2,
            background: c.primaryColor,
            animation: `ldr-stagger ${baseDur}s ease-in-out ${delay * c.speed}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── map variant → component ─────────────────────────────────────────────────

const LOADER_MAP: Record<LoaderVariant, (c: LoaderConfig) => JSX.Element> = {
  "pulse-wave": (c) => <PulseWave c={c} />,
  "hex-bloom": (c) => <HexBloom c={c} />,
  "orbit-ring": (c) => <OrbitRing c={c} />,
  "yin-spiral": (c) => <YinSpiral c={c} />,
  "bar-fill": (c) => <BarFill c={c} />,
  "slide-shift": (c) => <SlideShift c={c} />,
  "dot-bounce": (c) => <DotBounce c={c} />,
  "morph-blob": (c) => <MorphBlob c={c} />,
  "stagger-bars": (c) => <StaggerBars c={c} />,
};

// ─── preview wrapper ─────────────────────────────────────────────────────────

export function LoaderPreview({ config }: Props) {
  const loaderEl = LOADER_MAP[config.variant]?.(config);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        width: "100%",
        height: "100%",
        background: config.backgroundColor,
        borderRadius: 12,
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 120,
          minHeight: 120,
        }}
      >
        {loaderEl}
      </div>
      {config.showLabel && (
        <span
          style={{
            color: config.labelColor,
            fontSize: 13,
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            letterSpacing: "0.08em",
          }}
        >
          {config.labelText}
        </span>
      )}
    </div>
  );
}
