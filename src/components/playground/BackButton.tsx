// components/playground/BackButton.tsx
//
// Drop-in replacement for wherever your ResizablePlayground renders the back button.
// Shows a small spinner while router.back() is in flight.
// Usage: <BackButton />

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleBack() {
    setLoading(true);
    router.back();
    // router.back() doesn't return a promise, so we reset after a
    // generous timeout in case navigation is cancelled or very fast.
    setTimeout(() => setLoading(false), 3000);
  }

  return (
    <button
      onClick={handleBack}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "1px solid #2a2a38",
        borderRadius: "8px",
        padding: "6px 14px",
        color: loading ? "#5a5a72" : "#9090a8",
        fontFamily: "'DM Mono', monospace",
        fontSize: "12px",
        letterSpacing: "0.04em",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "color 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!loading)
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#353545";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a38";
      }}
    >
      {loading ? (
        <MiniSpinner />
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.5 2.5L4 7l4.5 4.5" />
        </svg>
      )}
      {loading ? "Going back…" : "Back"}
    </button>
  );
}

function MiniSpinner() {
  return (
    <>
      <style>{`
        @keyframes cf-spin {
          to { transform: rotate(360deg); }
        }
        .cf-mini-spin {
          animation: cf-spin 0.7s linear infinite;
        }
      `}</style>
      <svg
        className="cf-mini-spin"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <circle cx="6" cy="6" r="4.5" stroke="#2a2a38" strokeWidth="1.5" />
        <path
          d="M6 1.5A4.5 4.5 0 0 1 10.5 6"
          stroke="#7c6cfc"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}
