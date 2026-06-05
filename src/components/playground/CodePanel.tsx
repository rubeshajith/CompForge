"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./CodePanel.module.css";

type Framework = "jsx" | "tsx";
type Styling = "css" | "tailwind";

interface Props {
  jsx: string;
  css: string;
  tsx: string;
  tailwind: string;
}

// Derived file tabs based on the current framework + styling selection
interface FileTab {
  label: string;
  code: string;
  language: string;
}

function getFileTabs(
  framework: Framework,
  styling: Styling,
  { jsx, css, tsx, tailwind }: Props,
): FileTab[] {
  // Tailwind is always TSX, single file — no separate CSS tab
  if (styling === "tailwind") {
    return [
      { label: "Calendar.tailwind.tsx", code: tailwind, language: "tsx" },
    ];
  }
  // JSX + CSS
  if (framework === "jsx") {
    return [
      { label: "Calendar.jsx", code: jsx, language: "jsx" },
      { label: "Calendar.css", code: css, language: "css" },
    ];
  }
  // TSX + CSS
  return [
    { label: "Calendar.tsx", code: tsx, language: "tsx" },
    { label: "Calendar.css", code: css, language: "css" },
  ];
}

export function CodePanel({ jsx, css, tsx, tailwind }: Props) {
  const [framework, setFramework] = useState<Framework>("jsx");
  const [styling, setStyling] = useState<Styling>("css");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const fileTabs = getFileTabs(framework, styling, { jsx, css, tsx, tailwind });

  // Clamp activeFile if tabs shrink (e.g. switching to Tailwind collapses 2→1 tab)
  const safeActiveFile = Math.min(activeFile, fileTabs.length - 1);
  const currentTab = fileTabs[safeActiveFile];

  function handleFrameworkChange(f: Framework) {
    setFramework(f);
    // If switching to JSX while on Tailwind, fall back to CSS
    if (f === "jsx" && styling === "tailwind") setStyling("css");
    setActiveFile(0);
  }

  function handleStylingChange(s: Styling) {
    // Tailwind only available for TSX
    if (s === "tailwind" && framework === "jsx") setFramework("tsx");
    setStyling(s);
    setActiveFile(0);
  }

  function handleCopy() {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.panel}>
      {/* ── Top bar: selectors + copy ── */}
      <div className={styles.topBar}>
        <div className={styles.selectors}>
          {/* Framework segmented control */}
          <div className={styles.segmentGroup}>
            <button
              className={`${styles.segment} ${framework === "jsx" ? styles.segmentActive : ""}`}
              onClick={() => handleFrameworkChange("jsx")}
            >
              JSX
            </button>
            <button
              className={`${styles.segment} ${framework === "tsx" ? styles.segmentActive : ""}`}
              onClick={() => handleFrameworkChange("tsx")}
            >
              TSX
            </button>
          </div>

          <div className={styles.selectorDivider} />

          {/* Styling segmented control */}
          <div className={styles.segmentGroup}>
            <button
              className={`${styles.segment} ${styling === "css" ? styles.segmentActive : ""}`}
              onClick={() => handleStylingChange("css")}
            >
              CSS
            </button>
            <button
              className={`${styles.segment} ${styling === "tailwind" ? styles.segmentActive : ""} ${
                framework === "jsx" ? styles.segmentDisabled : ""
              }`}
              onClick={() => handleStylingChange("tailwind")}
              title={
                framework === "jsx"
                  ? "Switch to TSX to use Tailwind"
                  : undefined
              }
            >
              Tailwind
            </button>
          </div>
        </div>

        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? "✓ Copied!" : "⎘ Copy"}
        </button>
      </div>

      {/* ── File tabs ── */}
      <div className={styles.fileTabs}>
        {fileTabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`${styles.fileTab} ${i === safeActiveFile ? styles.fileTabActive : ""}`}
            onClick={() => setActiveFile(i)}
          >
            <span className={styles.fileTabDot} data-lang={tab.language} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Code ── */}
      <div className={styles.codeWrapper}>
        <SyntaxHighlighter
          key={`${framework}-${styling}-${safeActiveFile}`}
          language={currentTab.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "20px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.7",
            height: "100%",
          }}
          showLineNumbers
          lineNumberStyle={{
            color: "#3a3a52",
            minWidth: "2.5em",
            paddingRight: "12px",
          }}
        >
          {currentTab.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
