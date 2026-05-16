"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./ResizablePlayground.module.css";

interface Props {
  componentName: string;
  mode: "dark" | "light";
  onModeToggle: (m: "dark" | "light") => void;
  modeHint?: string;
  preview: React.ReactNode;
  controls: React.ReactNode;
  code: React.ReactNode;
}

const MIN_CODE_HEIGHT = 80;
const MAX_CODE_RATIO = 0.75; // code panel can take at most 75% of available height
const DEFAULT_CODE_HEIGHT = 260;

export function ResizablePlayground({
  componentName,
  mode,
  onModeToggle,
  modeHint = "Switching resets to preset · customize freely after",
  preview,
  controls,
  code,
}: Props) {
  const [codeHeight, setCodeHeight] = useState(DEFAULT_CODE_HEIGHT);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startY.current = e.clientY;
      startHeight.current = codeHeight;
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    },
    [codeHeight],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !containerRef.current) return;
      const delta = startY.current - e.clientY; // dragging up → bigger code panel
      const containerH = containerRef.current.getBoundingClientRect().height;
      const maxH = containerH * MAX_CODE_RATIO;
      const newH = Math.min(
        maxH,
        Math.max(MIN_CODE_HEIGHT, startHeight.current + delta),
      );
      setCodeHeight(newH);
    }

    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className={styles.shell}>
      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/" className={styles.backLink}>
            <span>←</span>
            <span className={styles.logoMark}>⬡</span>
            <span className={styles.logoText}>CompForge</span>
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.componentName}>{componentName}</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.hint}>Customize → Preview → Copy code</span>
        </div>
      </header>

      {/* ── Main 2-column layout ── */}
      <div className={styles.layout}>
        {/* LEFT — preview + resizable code panel */}
        <div className={styles.previewPane} ref={containerRef}>
          {/* Label bar with mode toggle */}
          <div className={styles.previewLabel}>
            <span className={styles.dot} />
            <span>Live Preview</span>

            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${mode === "dark" ? styles.modeBtnActive : ""}`}
                onClick={() => onModeToggle("dark")}
              >
                🌙 Dark
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "light" ? styles.modeBtnActive : ""}`}
                onClick={() => onModeToggle("light")}
              >
                ☀️ Light
              </button>
            </div>

            <span className={styles.modeHint}>{modeHint}</span>
          </div>

          {/* Preview stage — takes all remaining space */}
          <div
            className={`${styles.previewStage} ${mode === "light" ? styles.previewStageLight : ""}`}
          >
            <div className={styles.previewScroll}>{preview}</div>
          </div>

          {/* Drag handle */}
          <div
            className={styles.dragHandle}
            onMouseDown={onDragStart}
            title="Drag to resize"
          >
            <div className={styles.dragPill} />
          </div>

          {/* Code panel — height controlled by drag */}
          <div className={styles.codePane} style={{ height: codeHeight }}>
            {code}
          </div>
        </div>

        {/* RIGHT — controls */}
        <div className={styles.controlPane}>{controls}</div>
      </div>
    </div>
  );
}
