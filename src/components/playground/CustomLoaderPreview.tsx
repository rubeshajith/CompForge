// /components/playground/LoaderPreview.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { LoaderConfig, ImageAnimation } from "@/lib/customLoaderConfig";

interface LoaderPreviewProps {
  config: LoaderConfig;
  imageDataUrl: string | null;
  onImageUpload: (dataUrl: string) => void;
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ onUpload }: { onUpload: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onUpload(e.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        width: 260,
        height: 200,
        border: `1.5px dashed ${dragging ? "#7c6cfc" : "#2a2a38"}`,
        borderRadius: 16,
        cursor: "pointer",
        background: dragging ? "#7c6cfc0a" : "transparent",
        transition: "border-color 0.2s, background 0.2s",
        userSelect: "none",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="12" fill="#7c6cfc18" />
        <path
          d="M20 26V18M20 18L17 21M20 18L23 21"
          stroke="#7c6cfc"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 28h14"
          stroke="#5a5a72"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 13,
            color: "#f0f0f5",
            fontWeight: 500,
            fontFamily: "sans-serif",
          }}
        >
          Upload your logo / image
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#5a5a72",
            marginTop: 4,
            fontFamily: "sans-serif",
          }}
        >
          PNG, SVG, WebP, JPG — click or drag
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
        }}
      />
    </div>
  );
}

// ─── useLoadedImage ────────────────────────────────────────────────────────────
function useLoadedImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = src;
  }, [src]);
  return img;
}

// ─── DIAGONAL REVEAL ──────────────────────────────────────────────────────────
function DiagonalReveal({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"reveal" | "hold" | "hide">("reveal");
  const progressRef = useRef(0);

  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    revealAngle,
    revealBlur,
    accentColor,
    showGlow,
    glowColor,
  } = config;

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) startRef.current = ts;
      const elapsed = ts - startRef.current;

      let t = 0;
      const phase = phaseRef.current;

      if (phase === "reveal") {
        t = Math.min(elapsed / animationSpeed, 1);
        if (t >= 1) {
          phaseRef.current = "hold";
          startRef.current = ts;
        }
      } else if (phase === "hold") {
        t = 1;
        if (elapsed > loopDelay) {
          phaseRef.current = "hide";
          startRef.current = ts;
        }
      } else {
        t = 1 - Math.min(elapsed / (animationSpeed * 0.6), 1);
        if (t <= 0) {
          phaseRef.current = "reveal";
          startRef.current = ts;
          t = 0;
        }
      }

      // Ease in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      ctx.clearRect(0, 0, s, s);
      ctx.save();
      // Rounded clip
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      const angleRad = (revealAngle * Math.PI) / 180;
      const diag = Math.sqrt(s * s + s * s);
      const wipePos = eased * (diag * 2) - diag;

      // Draw blurred version (background)
      const blurAmt = revealBlur * (1 - eased);
      ctx.filter = `blur(${blurAmt.toFixed(1)}px)`;
      ctx.drawImage(image, 0, 0, s, s);
      ctx.filter = "none";

      // Clip region for the sharp revealed part using diagonal wipe
      ctx.save();
      ctx.translate(s / 2, s / 2);
      ctx.rotate(angleRad);
      ctx.translate(-s / 2, -s / 2);

      const clipX = wipePos - diag;
      ctx.beginPath();
      ctx.rect(clipX, -diag, diag * 2 + s, diag * 3 + s);
      ctx.restore();

      // Draw sharp version clipped to revealed region
      ctx.save();
      ctx.beginPath();
      ctx.translate(s / 2, s / 2);
      ctx.rotate(angleRad);
      ctx.translate(-s / 2, -s / 2);
      ctx.rect(wipePos - diag, -s, diag * 2, s * 3);
      ctx.restore();
      ctx.clip();
      ctx.drawImage(image, 0, 0, s, s);
      ctx.restore();

      // Glow shimmer line at the wipe edge
      if (showGlow && eased > 0 && eased < 1) {
        ctx.save();
        ctx.translate(s / 2, s / 2);
        ctx.rotate(angleRad);
        ctx.translate(-s / 2, -s / 2);
        const shimmerX = wipePos;
        const shimmerGrad = ctx.createLinearGradient(
          shimmerX - 12,
          0,
          shimmerX + 8,
          0,
        );
        shimmerGrad.addColorStop(0, "transparent");
        shimmerGrad.addColorStop(0.4, `${glowColor}50`);
        shimmerGrad.addColorStop(0.7, `${glowColor}cc`);
        shimmerGrad.addColorStop(1, "transparent");
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(shimmerX - 12, -s, 20, s * 3);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    },
    [config, image],
  );

  useEffect(() => {
    phaseRef.current = "reveal";
    startRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── TILE ASSEMBLE ────────────────────────────────────────────────────────────
function TileAssemble({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"assemble" | "hold" | "disassemble">("assemble");

  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    tileColumns,
    tileRows,
    accentColor,
    showGlow,
    glowColor,
  } = config;

  // Pre-compute deterministic random offsets for each tile
  const tilesRef = useRef<
    { ox: number; oy: number; delay: number; rot: number }[]
  >([]);
  useEffect(() => {
    const tiles = [];
    const count = tileColumns * tileRows;
    for (let i = 0; i < count; i++) {
      const seed = i * 2654435761;
      const rand1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const rand2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const rand3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const rand4 = ((seed * 214013 + 2531011) & 0xffff) / 0xffff;
      tiles.push({
        ox: (rand1 - 0.5) * imageSize * 1.8,
        oy: (rand2 - 0.5) * imageSize * 1.8,
        delay: rand3 * 0.5,
        rot: (rand4 - 0.5) * 60,
      });
    }
    tilesRef.current = tiles;
  }, [tileColumns, tileRows, imageSize]);

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const phase = phaseRef.current;

      let globalT = 0;
      if (phase === "assemble") {
        globalT = Math.min(elapsed / animationSpeed, 1);
        if (globalT >= 1) {
          phaseRef.current = "hold";
          startRef.current = ts;
        }
      } else if (phase === "hold") {
        globalT = 1;
        if (elapsed > loopDelay) {
          phaseRef.current = "disassemble";
          startRef.current = ts;
        }
      } else {
        globalT = 1 - Math.min(elapsed / (animationSpeed * 0.7), 1);
        if (globalT <= 0) {
          phaseRef.current = "assemble";
          startRef.current = ts;
          globalT = 0;
        }
      }

      ctx.clearRect(0, 0, s, s);

      const tileW = s / tileColumns;
      const tileH = s / tileRows;

      const tiles = tilesRef.current;
      for (let row = 0; row < tileRows; row++) {
        for (let col = 0; col < tileColumns; col++) {
          const idx = row * tileColumns + col;
          const tile = tiles[idx];
          if (!tile) continue;

          // Each tile has its own delayed progress
          const tileT = Math.max(
            0,
            Math.min((globalT - tile.delay * 0.4) / (1 - tile.delay * 0.4), 1),
          );
          const eased =
            tileT < 0.5
              ? 4 * tileT * tileT * tileT
              : 1 - Math.pow(-2 * tileT + 2, 3) / 2;

          const destX = col * tileW;
          const destY = row * tileH;
          const curX = destX + tile.ox * (1 - eased);
          const curY = destY + tile.oy * (1 - eased);
          const curRot = tile.rot * (1 - eased);
          const alpha = eased;

          ctx.save();
          ctx.globalAlpha = alpha;
          // Move to the tile's current flying position (centered)
          ctx.translate(curX + tileW / 2, curY + tileH / 2);
          ctx.rotate((curRot * Math.PI) / 180);
          ctx.translate(-tileW / 2, -tileH / 2);

          // Clip to tile bounds with 1px gap
          ctx.beginPath();
          const gap = 1;
          ctx.rect(gap, gap, tileW - gap * 2, tileH - gap * 2);
          ctx.clip();

          // Draw the full image offset so that the correct tile slice lands at (0,0)
          // i.e. shift image left by destX and up by destY so the right region shows
          ctx.drawImage(image, -destX, -destY, s, s);
          ctx.restore();
        }
      }

      // Overall rounded clip — draw a mask overlay
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    },
    [config, image],
  );

  useEffect(() => {
    phaseRef.current = "assemble";
    startRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── SCANLINE ─────────────────────────────────────────────────────────────────
function Scanline({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"in" | "hold" | "out">("in");

  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    scanlineCount,
    scanlineDirection,
    showGlow,
    glowColor,
    accentColor,
  } = config;

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const phase = phaseRef.current;
      let globalT = 0;

      if (phase === "in") {
        globalT = Math.min(elapsed / animationSpeed, 1);
        if (globalT >= 1) {
          phaseRef.current = "hold";
          startRef.current = ts;
        }
      } else if (phase === "hold") {
        globalT = 1;
        if (elapsed > loopDelay) {
          phaseRef.current = "out";
          startRef.current = ts;
        }
      } else {
        globalT = 1 - Math.min(elapsed / (animationSpeed * 0.6), 1);
        if (globalT <= 0) {
          phaseRef.current = "in";
          startRef.current = ts;
          globalT = 0;
        }
      }

      ctx.clearRect(0, 0, s, s);

      // Rounded clip
      ctx.save();
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      // Draw base image at low opacity (ghost)
      ctx.globalAlpha = 0.08;
      ctx.drawImage(image, 0, 0, s, s);
      ctx.globalAlpha = 1;

      const lineH = s / scanlineCount;

      for (let i = 0; i < scanlineCount; i++) {
        let lineT: number;
        if (scanlineDirection === "alternating") {
          const isEven = i % 2 === 0;
          const offset = isEven ? 0 : 0.15;
          lineT = Math.max(0, Math.min((globalT - offset) / (1 - offset), 1));
        } else if (scanlineDirection === "bottom-up") {
          const idx = scanlineCount - 1 - i;
          const delay = (idx / scanlineCount) * 0.5;
          lineT = Math.max(0, Math.min((globalT - delay) / (1 - delay), 1));
        } else {
          const delay = (i / scanlineCount) * 0.5;
          lineT = Math.max(0, Math.min((globalT - delay) / (1 - delay), 1));
        }

        const eased =
          lineT < 0.5 ? 2 * lineT * lineT : -1 + (4 - 2 * lineT) * lineT;

        const y = i * lineH;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, s, lineH);
        ctx.clip();
        ctx.globalAlpha = eased;
        ctx.drawImage(image, 0, 0, s, s);
        ctx.restore();

        // Scan glow line at leading edge
        if (showGlow && eased > 0.05 && eased < 0.95) {
          const glowY = y + eased * lineH;
          const glowGrad = ctx.createLinearGradient(0, glowY - 3, 0, glowY + 3);
          glowGrad.addColorStop(0, "transparent");
          glowGrad.addColorStop(0.5, `${glowColor}bb`);
          glowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, glowY - 3, s, 6);
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    },
    [config, image],
  );

  useEffect(() => {
    phaseRef.current = "in";
    startRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── GLITCH ───────────────────────────────────────────────────────────────────
function Glitch({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"glitching" | "calm">("glitching");
  const slicesRef = useRef<
    { y: number; h: number; ox: number; seed: number }[]
  >([]);

  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    glitchIntensity,
    glitchSlices,
    accentColor,
    showGlow,
    glowColor,
  } = config;

  // Re-roll slices periodically
  const rollSlices = useCallback(() => {
    const s = imageSize;
    const arr = [];
    let y = 0;
    for (let i = 0; i < glitchSlices; i++) {
      const h = (s / glitchSlices) * (0.5 + Math.random());
      arr.push({
        y,
        h: Math.min(h, s - y),
        ox: (Math.random() - 0.5) * glitchIntensity * 3,
        seed: Math.random(),
      });
      y += h;
      if (y >= s) break;
    }
    slicesRef.current = arr;
  }, [imageSize, glitchSlices, glitchIntensity]);

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) {
        startRef.current = ts;
        rollSlices();
      }
      const elapsed = ts - startRef.current;
      const phase = phaseRef.current;

      if (phase === "glitching" && elapsed > animationSpeed) {
        phaseRef.current = "calm";
        startRef.current = ts;
      } else if (phase === "calm" && elapsed > loopDelay) {
        phaseRef.current = "glitching";
        startRef.current = ts;
        rollSlices();
      }

      const glitchT = phase === "glitching" ? elapsed / animationSpeed : 0;

      ctx.clearRect(0, 0, s, s);

      // Rounded clip
      ctx.save();
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      if (phase === "calm") {
        ctx.drawImage(image, 0, 0, s, s);
      } else {
        const intensity = Math.sin(glitchT * Math.PI) * glitchIntensity;

        // RGB channel separation
        const channelSplit = intensity * 2.5;
        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        // Red channel shifted left
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.translate(-channelSplit, 0);
        // Use a red tint by drawing with multiply blend
        ctx.drawImage(image, 0, 0, s, s);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = `rgba(255,0,0,0.35)`;
        ctx.fillRect(0, 0, s, s);
        ctx.restore();

        // Cyan channel shifted right
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.translate(channelSplit, 0);
        ctx.drawImage(image, 0, 0, s, s);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = `rgba(0,255,255,0.35)`;
        ctx.fillRect(0, 0, s, s);
        ctx.restore();

        ctx.restore();

        // Base image
        ctx.globalAlpha = 0.75;
        ctx.drawImage(image, 0, 0, s, s);
        ctx.globalAlpha = 1;

        // Glitch slices with offsets
        for (const slice of slicesRef.current) {
          if (Math.random() > 0.65) continue; // Random skip for flicker
          const ox = slice.ox * intensity * (slice.seed > 0.5 ? 1 : -1);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, slice.y, s, slice.h);
          ctx.clip();
          ctx.drawImage(image, ox, 0, s, s);
          // Random color aberration per slice
          if (Math.random() > 0.7) {
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.05)`;
            ctx.fillRect(0, slice.y, s, slice.h);
          }
          ctx.restore();
        }

        // Noise scanlines
        for (let y = 0; y < s; y += 2) {
          if (Math.random() > 0.95) {
            ctx.save();
            ctx.globalAlpha = 0.04 * intensity;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, y, s, 1);
            ctx.restore();
          }
        }

        // Glow flash
        if (showGlow) {
          const flashAlpha = Math.max(
            0,
            Math.sin(glitchT * Math.PI * 6) * 0.15,
          );
          ctx.fillStyle = `${glowColor}`;
          ctx.globalAlpha = flashAlpha;
          ctx.fillRect(0, 0, s, s);
          ctx.globalAlpha = 1;
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    },
    [config, image, rollSlices],
  );

  useEffect(() => {
    phaseRef.current = "glitching";
    startRef.current = 0;
    rollSlices();
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, rollSlices]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── INK BLEED ────────────────────────────────────────────────────────────────
// Multiple ink-drop origins spread radially, revealing the image like watercolor
// bleeding into wet paper. Each drop has an organic wobbly edge.
function InkBleed({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"in" | "hold" | "out">("in");

  // Fixed ink-drop origins (deterministic)
  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    dissolveParticleSize,
    showGlow,
    glowColor,
  } = config;

  // Number of ink origins derived from dissolveParticleSize slider (repurposed as "drops" count)
  const DROP_COUNT = Math.max(
    3,
    Math.min(12, Math.round(dissolveParticleSize / 2)),
  );

  const dropsRef = useRef<
    { x: number; y: number; wobble: number[]; startT: number }[]
  >([]);

  useEffect(() => {
    const s = imageSize;
    const drops = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      const seed = i * 2654435761 + 99;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      // Wobble angles: 12 radial control points with random variation
      const wobble = Array.from({ length: 12 }, (_, w) => {
        const ws = (seed + w * 999983) & 0xffff;
        return 0.6 + (ws / 0xffff) * 0.8;
      });
      drops.push({
        x: s * (0.15 + r1 * 0.7),
        y: s * (0.15 + r2 * 0.7),
        wobble,
        startT: r3 * 0.45, // staggered start: each drop starts at a different globalT
      });
    }
    dropsRef.current = drops;

    // Build mask canvas once
    const mask = document.createElement("canvas");
    mask.width = s;
    mask.height = s;
    maskRef.current = mask;
  }, [imageSize, DROP_COUNT]);

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const phase = phaseRef.current;
      let globalT = 0;

      if (phase === "in") {
        globalT = Math.min(elapsed / animationSpeed, 1);
        if (globalT >= 1) {
          phaseRef.current = "hold";
          startRef.current = ts;
        }
      } else if (phase === "hold") {
        globalT = 1;
        if (elapsed > loopDelay) {
          phaseRef.current = "out";
          startRef.current = ts;
        }
      } else {
        globalT = 1 - Math.min(elapsed / (animationSpeed * 0.75), 1);
        if (globalT <= 0) {
          phaseRef.current = "in";
          startRef.current = ts;
          globalT = 0;
        }
      }

      // Ease — smooth start, slightly slower end
      const eased = 1 - Math.pow(1 - globalT, 2.2);

      ctx.clearRect(0, 0, s, s);

      // ── Build the ink-bleed mask on the mask canvas ──
      const mask = maskRef.current!;
      mask.width = s;
      mask.height = s;
      const mCtx = mask.getContext("2d")!;
      mCtx.clearRect(0, 0, s, s);

      const maxRadius = s * 1.1; // large enough to cover corners when all drops expand

      for (const drop of dropsRef.current) {
        // Each drop has its own progress (staggered)
        const dropT = Math.max(
          0,
          Math.min((eased - drop.startT) / (1 - drop.startT), 1),
        );
        if (dropT <= 0) continue;

        // Cubic ease for individual drops — snappy at first, slow settle
        const dt =
          dropT < 0.5
            ? 4 * dropT * dropT * dropT
            : 1 - Math.pow(-2 * dropT + 2, 3) / 2;
        const radius = maxRadius * dt;

        // Draw organic blob using wobble control points
        mCtx.beginPath();
        const pts = drop.wobble.length;
        for (let i = 0; i <= pts; i++) {
          const angle = (i / pts) * Math.PI * 2;
          const wobbleFactor = drop.wobble[i % pts];
          const r = radius * wobbleFactor;
          const px = drop.x + Math.cos(angle) * r;
          const py = drop.y + Math.sin(angle) * r;
          if (i === 0) mCtx.moveTo(px, py);
          else mCtx.lineTo(px, py);
        }
        mCtx.closePath();
        // Soft feathered fill for the ink-bleed edge
        const grad = mCtx.createRadialGradient(
          drop.x,
          drop.y,
          radius * 0.7,
          drop.x,
          drop.y,
          radius,
        );
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(0.7, "rgba(0,0,0,0.95)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        mCtx.fillStyle = grad;
        mCtx.globalCompositeOperation = "source-over";
        mCtx.fill();
      }

      // ── Draw image revealed through the ink mask ──
      // 1. Draw the image
      ctx.save();
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, 0, 0, s, s);
      ctx.restore();

      // 2. Use mask as destination-in to punch out the reveal shape
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0);
      ctx.restore();

      // ── Glow halo at the bleeding frontier ──
      if (showGlow && eased > 0.02 && eased < 0.98) {
        // Draw a thin glowing outline following the mask edge
        const glowMask = document.createElement("canvas");
        glowMask.width = s;
        glowMask.height = s;
        const gCtx = glowMask.getContext("2d")!;
        gCtx.drawImage(mask, 0, 0);
        gCtx.globalCompositeOperation = "source-in";
        gCtx.fillStyle = `${glowColor}60`;
        gCtx.fillRect(0, 0, s, s);

        ctx.save();
        ctx.filter = `blur(6px)`;
        ctx.globalCompositeOperation = "source-atop";
        ctx.drawImage(glowMask, 0, 0);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    },
    [config, image, DROP_COUNT],
  );

  useEffect(() => {
    phaseRef.current = "in";
    startRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── SHATTER ──────────────────────────────────────────────────────────────────
// True Voronoi partition: the canvas is divided into non-overlapping cells using
// a nearest-seed test on an offscreen pixel grid. Each cell is a unique fragment
// of the image — no overlaps, no duplicate copies.

type ShatterPiece = {
  // The seed point (centroid of the Voronoi cell) in image space
  cx: number;
  cy: number;
  // Explosion velocity and spin (for dispersal)
  vx: number;
  vy: number;
  rot: number;
  // Pre-rasterized offscreen canvas showing only this fragment
  frag: HTMLCanvasElement;
};

function buildVoronoiFragments(
  image: HTMLImageElement,
  s: number,
  count: number,
): ShatterPiece[] {
  // ── 1. Generate seed points ──────────────────────────────────────────────
  const seeds: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const h1 = (i * 2654435761 + 1) >>> 0;
    const h2 = (i * 1664525 + 1013904223) >>> 0;
    seeds.push([((h1 & 0xffff) / 0xffff) * s, ((h2 & 0xffff) / 0xffff) * s]);
  }

  // ── 2. Build pixel → nearest-seed map using a small resolution grid ──────
  // We work at GRID_S resolution then scale up to avoid O(s²·count) cost.
  const GRID_S = Math.min(s, 128); // work at max 128×128 then scale
  const scale = s / GRID_S;
  const assignment = new Int16Array(GRID_S * GRID_S); // which seed owns each pixel

  for (let py = 0; py < GRID_S; py++) {
    for (let px = 0; px < GRID_S; px++) {
      const wx = (px + 0.5) * scale;
      const wy = (py + 0.5) * scale;
      let best = 0;
      let bestD = Infinity;
      for (let k = 0; k < count; k++) {
        const dx = wx - seeds[k][0];
        const dy = wy - seeds[k][1];
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = k;
        }
      }
      assignment[py * GRID_S + px] = best;
    }
  }

  // ── 3. Rasterize each fragment onto its own offscreen canvas ────────────
  // Draw the full image first into a shared offscreen buffer.
  const imgOff = document.createElement("canvas");
  imgOff.width = s;
  imgOff.height = s;
  imgOff.getContext("2d")!.drawImage(image, 0, 0, s, s);

  const pieces: ShatterPiece[] = seeds.map(([cx, cy], i) => {
    const frag = document.createElement("canvas");
    frag.width = s;
    frag.height = s;
    const fCtx = frag.getContext("2d")!;

    // Build a path from the grid cells belonging to seed i
    // We draw the cell as a filled polygon by compositing pixel blocks
    // Efficient: draw the whole image, then mask out everything not in this cell
    fCtx.drawImage(imgOff, 0, 0);

    // Build a mask: only keep pixels whose grid cell belongs to seed i
    const maskOff = document.createElement("canvas");
    maskOff.width = s;
    maskOff.height = s;
    const mCtx = maskOff.getContext("2d")!;

    // Paint cell pixels at full-s resolution using scaled blocks
    mCtx.fillStyle = "#fff";
    for (let py = 0; py < GRID_S; py++) {
      for (let px = 0; px < GRID_S; px++) {
        if (assignment[py * GRID_S + px] === i) {
          // Fill the corresponding block in full-res space
          const bx = Math.round(px * scale);
          const by = Math.round(py * scale);
          const bw = Math.round((px + 1) * scale) - bx;
          const bh = Math.round((py + 1) * scale) - by;
          mCtx.fillRect(bx, by, bw, bh);
        }
      }
    }

    // Apply mask
    fCtx.globalCompositeOperation = "destination-in";
    fCtx.drawImage(maskOff, 0, 0);

    // Deterministic velocity: shoot away from centre of image
    const h3 = (i * 22695477 + 1) >>> 0;
    const h4 = (i * 214013 + 2531011) >>> 0;
    const speed = s * (0.6 + ((h3 & 0xffff) / 0xffff) * 0.8);
    const dir =
      Math.atan2(cy - s / 2, cx - s / 2) + ((h4 & 0xffff) / 0xffff - 0.5) * 0.8;
    const rot = ((h3 & 0xff) / 0xff - 0.5) * Math.PI * 1.2;

    return {
      cx,
      cy,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      rot,
      frag,
    };
  });

  return pieces;
}

function Shatter({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"hold" | "shatter" | "reform">("hold");
  const piecesRef = useRef<ShatterPiece[]>([]);
  const builtForRef = useRef<string>(""); // track when to rebuild

  const {
    imageSize,
    imageBorderRadius,
    animationSpeed,
    loopDelay,
    shatterPieces,
    showGlow,
    glowColor,
  } = config;

  // Rebuild Voronoi fragments whenever image or piece count changes
  const buildKey = `${imageSize}-${shatterPieces}`;
  if (builtForRef.current !== buildKey) {
    builtForRef.current = buildKey;
    piecesRef.current = buildVoronoiFragments(image, imageSize, shatterPieces);
  }

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const s = imageSize;
      canvas.width = s;
      canvas.height = s;

      if (startRef.current === 0) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const phase = phaseRef.current;

      // disperseT: 0 = assembled, 1 = fully exploded
      let disperseT = 0;

      if (phase === "hold") {
        // Show complete image, then shatter
        disperseT = 0;
        if (elapsed > loopDelay) {
          phaseRef.current = "shatter";
          startRef.current = ts;
        }
      } else if (phase === "shatter") {
        disperseT = Math.min(elapsed / (animationSpeed * 0.55), 1);
        if (disperseT >= 1) {
          phaseRef.current = "reform";
          startRef.current = ts;
        }
      } else {
        // reform: pieces fly back in
        disperseT = 1 - Math.min(elapsed / animationSpeed, 1);
        if (disperseT <= 0) {
          phaseRef.current = "hold";
          startRef.current = ts;
          disperseT = 0;
        }
      }

      // Ease: fast burst out, smooth ease-in back
      const eased =
        phase === "shatter"
          ? disperseT < 0.5
            ? 2 * disperseT * disperseT
            : -1 + (4 - 2 * disperseT) * disperseT
          : 1 - Math.pow(1 - disperseT, 3); // cubic ease-out for reform

      ctx.clearRect(0, 0, s, s);

      for (const piece of piecesRef.current) {
        const { cx, cy, vx, vy, rot, frag } = piece;

        // Current offset from origin position
        const ox = vx * eased;
        const oy = vy * eased;
        const angle = rot * eased;

        ctx.save();
        // Translate to piece centroid, rotate, then shift by explosion offset
        ctx.translate(cx + ox, cy + oy);
        ctx.rotate(angle);
        ctx.translate(-cx, -cy);

        // Each fragment canvas is already exactly s×s with only its Voronoi cell visible
        ctx.drawImage(frag, 0, 0);
        ctx.restore();
      }

      // Rounded clip mask applied after all pieces are drawn
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      const r = imageBorderRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      // Glow shimmer on piece edges while mid-animation
      if (showGlow && eased > 0.04 && eased < 0.96) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = 0.18 * Math.sin(eased * Math.PI);
        ctx.fillStyle = glowColor;
        ctx.fillRect(0, 0, s, s);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    },
    [config, image],
  );

  useEffect(() => {
    // Rebuild pieces on config change
    piecesRef.current = buildVoronoiFragments(image, imageSize, shatterPieces);
    builtForRef.current = `${imageSize}-${shatterPieces}`;
    phaseRef.current = "hold";
    startRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={imageSize}
      height={imageSize}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageBorderRadius,
        display: "block",
        boxShadow: showGlow ? `0 0 32px ${glowColor}40` : "none",
      }}
    />
  );
}

// ─── Animation dispatcher ──────────────────────────────────────────────────────
function AnimationRenderer({
  config,
  image,
}: {
  config: LoaderConfig;
  image: HTMLImageElement;
}) {
  switch (config.animation) {
    case "diagonal-reveal":
      return <DiagonalReveal config={config} image={image} />;
    case "tile-assemble":
      return <TileAssemble config={config} image={image} />;
    case "scanline":
      return <Scanline config={config} image={image} />;
    case "glitch":
      return <Glitch config={config} image={image} />;
    case "dissolve":
      return <InkBleed config={config} image={image} />;
    case "shatter":
      return <Shatter config={config} image={image} />;
    default:
      return <DiagonalReveal config={config} image={image} />;
  }
}

// ─── Main Preview export ───────────────────────────────────────────────────────
export function LoaderPreview({
  config,
  imageDataUrl,
  onImageUpload,
}: LoaderPreviewProps) {
  const image = useLoadedImage(imageDataUrl);

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: config.showBackground ? config.containerPadding : 0,
    borderRadius: config.showBackground ? config.containerBorderRadius : 0,
    background: config.showBackground ? config.backgroundColor : "transparent",
    boxShadow:
      config.showBackground && config.showShadow
        ? "0 8px 48px rgba(0,0,0,0.5)"
        : "none",
    position: "relative",
  };

  if (!imageDataUrl) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <UploadZone onUpload={onImageUpload} />
      </div>
    );
  }

  if (!image) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{ color: "#5a5a72", fontSize: 12, fontFamily: "sans-serif" }}
        >
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={containerStyle}>
        <AnimationRenderer config={config} image={image} />
        {config.showLabel && (
          <div
            style={{
              marginTop: config.labelGap,
              fontSize: config.labelFontSize,
              color: config.labelColor,
              fontFamily: "'Instrument Sans', sans-serif",
              letterSpacing: "0.06em",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {config.labelText}
          </div>
        )}
      </div>
    </div>
  );
}
