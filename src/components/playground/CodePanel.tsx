"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./CodePanel.module.css";

interface Props {
  jsx: string;
  css: string;
}

export function CodePanel({ jsx, css }: Props) {
  const [tab, setTab] = useState<"jsx" | "css">("jsx");
  const [copied, setCopied] = useState(false);

  const currentCode = tab === "jsx" ? jsx : css;
  const language = tab === "jsx" ? "jsx" : "css";

  function handleCopy() {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "jsx" ? styles.tabActive : ""}`}
            onClick={() => setTab("jsx")}
          >
            jsx
          </button>
          <button
            className={`${styles.tab} ${tab === "css" ? styles.tabActive : ""}`}
            onClick={() => setTab("css")}
          >
            css
          </button>
        </div>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? "✓ Copied!" : "⎘ Copy"}
        </button>
      </div>
      <div className={styles.codeWrapper}>
        <SyntaxHighlighter
          language={language}
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
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
