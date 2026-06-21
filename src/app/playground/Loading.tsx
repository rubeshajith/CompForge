// app/playground/loading.tsx
//
// Next.js App Router automatically shows this file while any
// /playground/* route is loading. One file covers ALL ~50 components.
// No changes needed to individual pages or cards.

import React from "react";

export default function PlaygroundLoading() {
  return (
    <>
      <style>{`
        @keyframes cf-pulse {
          0%, 100% {
            opacity: 0.12;
            transform: scale(0.72);
            background: #2a2a38;
          }
          50% {
            opacity: 1;
            transform: scale(1);
            background: #7c6cfc;
          }
        }
        .cf-dot {
          animation: cf-pulse 1.4s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#0c0c0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* 5×3 dot grid with diagonal wave */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 10px)",
            gap: "10px",
          }}
        >
          {Array.from({ length: 15 }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            return (
              <span
                key={i}
                className="cf-dot"
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "3px",
                  background: "#2a2a38",
                  animationDelay: `${(col + row) * 0.09}s`,
                }}
              />
            );
          })}
        </div>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "12px",
            letterSpacing: "0.08em",
            color: "#5a5a72",
            margin: 0,
          }}
        >
          Loading playground…
        </p>
      </div>
    </>
  );
}
