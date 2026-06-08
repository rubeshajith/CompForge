// /lib/generateLoaderCode.ts

import { LoaderConfig } from "./customLoaderConfig";

// ─── JSX Generator ─────────────────────────────────────────────────────────────

export function generateLoaderJSX(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize,
    imageBorderRadius,
    imageOpacity,
    tileColumns,
    tileRows,
    glitchIntensity,
    glitchSlices,
    revealAngle,
    revealBlur,
    scanlineCount,
    scanlineDirection,
    dissolveParticleSize,
    shatterPieces,
    accentColor,
    glowColor,
    showGlow,
    backgroundColor,
    containerPadding,
    containerBorderRadius,
    showShadow,
    showBackground,
    showLabel,
    labelText,
    labelColor,
    labelFontSize,
    labelGap,
  } = config;

  const sharedHooks = `
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"in" | "hold" | "out">("in");`;

  const animFnBody = generateAnimationFunction(config);

  return `"use client";
import { useRef, useEffect, useCallback } from "react";

// Props: pass your image as a data URL or a public path string
interface LoaderProps {
  imageSrc: string;
}

export default function Loader({ imageSrc }: LoaderProps) {${sharedHooks}

${animFnBody}

  useEffect(() => {
    phaseRef.current = "in";
    startRef.current = 0;
    const img = new Image();
    img.onload = () => {
      animRef.current = requestAnimationFrame((ts) => draw(ts, img));
    };
    img.src = imageSrc;
    return () => cancelAnimationFrame(animRef.current);
  }, [imageSrc, draw]);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",${
          showBackground
            ? `
        padding: ${containerPadding}px,
        borderRadius: ${containerBorderRadius}px,
        background: "${backgroundColor}",
        boxShadow: ${showShadow ? `"0 8px 48px rgba(0,0,0,0.5)"` : `"none"`},`
            : ""
        }
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={${imageSize}}
        height={${imageSize}}
        style={{
          width: ${imageSize},
          height: ${imageSize},
          borderRadius: ${imageBorderRadius},
          display: "block",${
            showGlow
              ? `
          boxShadow: "0 0 32px ${glowColor}40",`
              : ""
          }
        }}
      />
${
  showLabel
    ? `      <p style={{
        margin: 0,
        marginTop: ${labelGap}px,
        fontSize: ${labelFontSize}px,
        color: "${labelColor}",
        fontFamily: "'Instrument Sans', sans-serif",
        letterSpacing: "0.06em",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}>
        ${labelText}
      </p>`
    : ""
}
    </div>
  );
}`;
}

function generateAnimationFunction(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize: s,
    imageBorderRadius,
    revealAngle,
    revealBlur,
    tileColumns,
    tileRows,
    scanlineCount,
    scanlineDirection,
    glitchIntensity,
    glitchSlices,
    dissolveParticleSize,
    shatterPieces,
    glowColor,
    showGlow,
  } = config;

  const roundedClip = `
    // Rounded clip helper
    function clipRounded(ctx: CanvasRenderingContext2D, s: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(s - r, 0); ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r); ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s); ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
    }`;

  if (animation === "diagonal-reveal") {
    return `${roundedClip}

  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = Math.min(elapsed / ${animationSpeed}, 1);
      if (t >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t <= 0) { phaseRef.current = "in"; startRef.current = ts; t = 0; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    clipRounded(ctx, ${s}, ${imageBorderRadius}); ctx.clip();

    const angleRad = (${revealAngle} * Math.PI) / 180;
    const diag = Math.sqrt(${s}*${s} + ${s}*${s});
    const wipePos = eased * (diag * 2) - diag;

    ctx.filter = \`blur(\${(${revealBlur} * (1 - eased)).toFixed(1)}px)\`;
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.filter = "none";

    ctx.save();
    ctx.translate(${s / 2}, ${s / 2}); ctx.rotate(angleRad); ctx.translate(-${s / 2}, -${s / 2});
    ctx.beginPath(); ctx.rect(wipePos - diag, -${s}, diag * 2, ${s * 3}); ctx.restore();
    ctx.clip();
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "tile-assemble") {
    return `
  const tilesRef = useRef<{ ox: number; oy: number; delay: number; rot: number }[]>([]);
  useEffect(() => {
    const tiles = [];
    for (let i = 0; i < ${tileColumns * tileRows}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const r4 = ((seed * 214013 + 2531011) & 0xffff) / 0xffff;
      tiles.push({ ox: (r1-0.5)*${s * 1.8}, oy: (r2-0.5)*${s * 1.8}, delay: r3*0.5, rot: (r4-0.5)*60 });
    }
    tilesRef.current = tiles;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.7)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const tW = ${s} / ${tileColumns}; const tH = ${s} / ${tileRows};

    for (let row = 0; row < ${tileRows}; row++) {
      for (let col = 0; col < ${tileColumns}; col++) {
        const tile = tilesRef.current[row * ${tileColumns} + col];
        if (!tile) continue;
        const tileT = Math.max(0, Math.min((globalT - tile.delay * 0.4) / (1 - tile.delay * 0.4), 1));
        const eased = tileT < 0.5 ? 4*tileT*tileT*tileT : 1 - Math.pow(-2*tileT+2,3)/2;
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.translate(col*tW + tile.ox*(1-eased) + tW/2, row*tH + tile.oy*(1-eased) + tH/2);
        ctx.rotate((tile.rot*(1-eased)*Math.PI)/180);
        ctx.translate(-tW/2, -tH/2);
        ctx.beginPath(); ctx.rect(1, 1, tW-2, tH-2); ctx.clip();
        ctx.drawImage(image, col*tW, row*tH, tW, tH, 0, 0, tW, tH);
        ctx.restore();
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill();
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "scanline") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    ctx.globalAlpha = 0.08; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    const lineH = ${s} / ${scanlineCount};

    for (let i = 0; i < ${scanlineCount}; i++) {
      const delay = (i / ${scanlineCount}) * 0.5;
      const lineT = Math.max(0, Math.min((globalT - delay) / (1 - delay), 1));
      const eased = lineT < 0.5 ? 2*lineT*lineT : -1+(4-2*lineT)*lineT;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, i * lineH, ${s}, lineH); ctx.clip();
      ctx.globalAlpha = eased; ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.restore();
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "glitch") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const phase = phaseRef.current;
    if (phase === "in" && elapsed > ${animationSpeed}) { phaseRef.current = "hold"; startRef.current = ts; }
    else if (phase === "hold" && elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    else if (phase === "out" && elapsed > ${Math.round(animationSpeed * 0.5)}) { phaseRef.current = "in"; startRef.current = ts; }

    const glitchT = phaseRef.current === "in" ? elapsed / ${animationSpeed} : 0;
    const intensity = Math.sin(glitchT * Math.PI) * ${glitchIntensity};

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    if (phaseRef.current === "hold") {
      ctx.drawImage(image, 0, 0, ${s}, ${s});
    } else {
      const split = intensity * 2.5;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(-split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(255,0,0,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(0,255,255,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.globalAlpha = 0.75; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "dissolve") {
    return `
  const gridRef = useRef<number[]>([]);
  useEffect(() => {
    const cols = Math.ceil(${s} / ${dissolveParticleSize});
    const rows = Math.ceil(${s} / ${dissolveParticleSize});
    const orders = Array.from({ length: cols * rows }, (_, i) => i);
    for (let i = orders.length - 1; i > 0; i--) {
      const j = Math.floor(((i * 2654435761) ^ (i >> 16)) % (i + 1));
      [orders[i], orders[j]] = [orders[j], orders[i]];
    }
    gridRef.current = orders;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.8)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const ps = ${dissolveParticleSize};
    const cols = Math.ceil(${s} / ps);
    const count = gridRef.current.length;
    const revealed = Math.floor(globalT * count);

    const off = document.createElement("canvas");
    off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < count; i++) {
      const idx = gridRef.current[i];
      if (idx < revealed) {
        const col = idx % cols; const row = Math.floor(idx / cols);
        ctx.drawImage(off, col*ps, row*ps, ps, ps, col*ps, row*ps, ps, ps);
      }
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
  }

  // shatter (default fallback)
  return `
  const draw = useCallback((ts: number, image: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = 1 - Math.min(elapsed / ${animationSpeed}, 1);
      if (t <= 0) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 0;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t >= 1) { phaseRef.current = "in"; startRef.current = ts; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    const off = document.createElement("canvas"); off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < ${shatterPieces}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const cx = ${s} * r1; const cy = ${s} * r2;
      const vx = (r1 - 0.5) * ${s} * 1.4 * eased;
      const vy = (r2 - 0.5) * ${s} * 1.4 * eased;
      const rot = (r3 - 0.5) * Math.PI * 2 * eased;
      ctx.save();
      ctx.translate(cx + vx, cy + vy); ctx.rotate(rot); ctx.translate(-cx, -cy);
      const region = ${s} * 0.7;
      ctx.beginPath(); ctx.rect(cx - region, cy - region, region * 2, region * 2); ctx.clip();
      ctx.drawImage(off, 0, 0, ${s}, ${s});
      ctx.restore();
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2) => draw(ts2, image));
  }, []);`;
}

// ─── CSS Generator ─────────────────────────────────────────────────────────────
// NOTE: All animation logic lives on <canvas> via rAF; CSS is minimal container/label styling.

export function generateLoaderCSS(config: LoaderConfig): string {
  const {
    imageSize,
    imageBorderRadius,
    glowColor,
    showGlow,
    backgroundColor,
    containerPadding,
    containerBorderRadius,
    showShadow,
    showBackground,
    showLabel,
    labelColor,
    labelFontSize,
    labelGap,
  } = config;

  return `/* ── Image Morph Loader ─────────────────────────── */

/* Container */
.ldr-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;${
    showBackground
      ? `
  padding: ${containerPadding}px;
  border-radius: ${containerBorderRadius}px;
  background: ${backgroundColor};${
    showShadow
      ? `
  box-shadow: 0 8px 48px rgba(0,0,0,0.5);`
      : ""
  }`
      : ""
  }
}

/* Canvas (animation is driven by rAF — no CSS animation needed) */
.ldr-canvas {
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: ${imageBorderRadius}px;
  display: block;${
    showGlow
      ? `
  box-shadow: 0 0 32px ${glowColor}40;`
      : ""
  }
}
${
  showLabel
    ? `
/* Label */
.ldr-label {
  margin: 0;
  margin-top: ${labelGap}px;
  font-size: ${labelFontSize}px;
  color: ${labelColor};
  font-family: 'Instrument Sans', sans-serif;
  letter-spacing: 0.06em;
  font-weight: 500;
  white-space: nowrap;
}`
    : ""
}
`;
}

// ─── TSX + CSS Generator ───────────────────────────────────────────────────────

export function generateLoaderTSX(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize,
    imageBorderRadius,
    imageOpacity,
    tileColumns,
    tileRows,
    glitchIntensity,
    glitchSlices,
    revealAngle,
    revealBlur,
    scanlineCount,
    scanlineDirection,
    dissolveParticleSize,
    shatterPieces,
    accentColor,
    glowColor,
    showGlow,
    backgroundColor,
    containerPadding,
    containerBorderRadius,
    showShadow,
    showBackground,
    showLabel,
    labelText,
    labelColor,
    labelFontSize,
    labelGap,
  } = config;

  const sharedHooks = `
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"in" | "hold" | "out">("in");`;

  const animFnBody = generateAnimationFunctionTSX(config);

  return `"use client";
import { useRef, useEffect, useCallback } from "react";
import "./Loader.css";

interface LoaderProps {
  imageSrc: string;
}

export default function Loader({ imageSrc }: LoaderProps) {${sharedHooks}

${animFnBody}

  useEffect(() => {
    phaseRef.current = "in";
    startRef.current = 0;
    const img = new Image();
    img.onload = () => {
      animRef.current = requestAnimationFrame((ts: number) => draw(ts, img));
    };
    img.src = imageSrc;
    return () => cancelAnimationFrame(animRef.current);
  }, [imageSrc, draw]);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",${
          showBackground
            ? `
        padding: ${containerPadding}px,
        borderRadius: ${containerBorderRadius}px,
        background: "${backgroundColor}",
        boxShadow: ${showShadow ? `"0 8px 48px rgba(0,0,0,0.5)"` : `"none"`},`
            : ""
        }
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={${imageSize}}
        height={${imageSize}}
        style={{
          width: ${imageSize},
          height: ${imageSize},
          borderRadius: ${imageBorderRadius},
          display: "block",${
            showGlow
              ? `
          boxShadow: "0 0 32px ${glowColor}40",`
              : ""
          }
        }}
      />
${
  showLabel
    ? `      <p style={{
        margin: 0,
        marginTop: ${labelGap}px,
        fontSize: ${labelFontSize}px,
        color: "${labelColor}",
        fontFamily: "'Instrument Sans', sans-serif",
        letterSpacing: "0.06em",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}>
        ${labelText}
      </p>`
    : ""
}
    </div>
  );
}`;
}

function generateAnimationFunctionTSX(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize: s,
    imageBorderRadius,
    revealAngle,
    revealBlur,
    tileColumns,
    tileRows,
    scanlineCount,
    glitchIntensity,
    dissolveParticleSize,
    shatterPieces,
  } = config;

  const roundedClip = `
    // Rounded clip helper
    function clipRounded(ctx: CanvasRenderingContext2D, s: number, r: number): void {
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(s - r, 0); ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r); ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s); ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
    }`;

  if (animation === "diagonal-reveal") {
    return `${roundedClip}

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = Math.min(elapsed / ${animationSpeed}, 1);
      if (t >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t <= 0) { phaseRef.current = "in"; startRef.current = ts; t = 0; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    clipRounded(ctx, ${s}, ${imageBorderRadius}); ctx.clip();

    const angleRad = (${revealAngle} * Math.PI) / 180;
    const diag = Math.sqrt(${s}*${s} + ${s}*${s});
    const wipePos = eased * (diag * 2) - diag;

    ctx.filter = \`blur(\${(${revealBlur} * (1 - eased)).toFixed(1)}px)\`;
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.filter = "none";

    ctx.save();
    ctx.translate(${s / 2}, ${s / 2}); ctx.rotate(angleRad); ctx.translate(-${s / 2}, -${s / 2});
    ctx.beginPath(); ctx.rect(wipePos - diag, -${s}, diag * 2, ${s * 3}); ctx.restore();
    ctx.clip();
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "tile-assemble") {
    return `
  interface TileData { ox: number; oy: number; delay: number; rot: number; }
  const tilesRef = useRef<TileData[]>([]);
  useEffect(() => {
    const tiles: TileData[] = [];
    for (let i = 0; i < ${tileColumns * tileRows}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const r4 = ((seed * 214013 + 2531011) & 0xffff) / 0xffff;
      tiles.push({ ox: (r1-0.5)*${s * 1.8}, oy: (r2-0.5)*${s * 1.8}, delay: r3*0.5, rot: (r4-0.5)*60 });
    }
    tilesRef.current = tiles;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.7)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const tW = ${s} / ${tileColumns}; const tH = ${s} / ${tileRows};

    for (let row = 0; row < ${tileRows}; row++) {
      for (let col = 0; col < ${tileColumns}; col++) {
        const tile = tilesRef.current[row * ${tileColumns} + col];
        if (!tile) continue;
        const tileT = Math.max(0, Math.min((globalT - tile.delay * 0.4) / (1 - tile.delay * 0.4), 1));
        const eased = tileT < 0.5 ? 4*tileT*tileT*tileT : 1 - Math.pow(-2*tileT+2,3)/2;
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.translate(col*tW + tile.ox*(1-eased) + tW/2, row*tH + tile.oy*(1-eased) + tH/2);
        ctx.rotate((tile.rot*(1-eased)*Math.PI)/180);
        ctx.translate(-tW/2, -tH/2);
        ctx.beginPath(); ctx.rect(1, 1, tW-2, tH-2); ctx.clip();
        ctx.drawImage(image, col*tW, row*tH, tW, tH, 0, 0, tW, tH);
        ctx.restore();
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill();
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "scanline") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    ctx.globalAlpha = 0.08; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    const lineH = ${s} / ${scanlineCount};

    for (let i = 0; i < ${scanlineCount}; i++) {
      const delay = (i / ${scanlineCount}) * 0.5;
      const lineT = Math.max(0, Math.min((globalT - delay) / (1 - delay), 1));
      const eased = lineT < 0.5 ? 2*lineT*lineT : -1+(4-2*lineT)*lineT;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, i * lineH, ${s}, lineH); ctx.clip();
      ctx.globalAlpha = eased; ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.restore();
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "glitch") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const phase = phaseRef.current;
    if (phase === "in" && elapsed > ${animationSpeed}) { phaseRef.current = "hold"; startRef.current = ts; }
    else if (phase === "hold" && elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    else if (phase === "out" && elapsed > ${Math.round(animationSpeed * 0.5)}) { phaseRef.current = "in"; startRef.current = ts; }

    const glitchT = phaseRef.current === "in" ? elapsed / ${animationSpeed} : 0;
    const intensity = Math.sin(glitchT * Math.PI) * ${glitchIntensity};

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    if (phaseRef.current === "hold") {
      ctx.drawImage(image, 0, 0, ${s}, ${s});
    } else {
      const split = intensity * 2.5;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(-split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(255,0,0,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(0,255,255,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.globalAlpha = 0.75; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "dissolve") {
    return `
  const gridRef = useRef<number[]>([]);
  useEffect(() => {
    const cols = Math.ceil(${s} / ${dissolveParticleSize});
    const rows = Math.ceil(${s} / ${dissolveParticleSize});
    const orders: number[] = Array.from({ length: cols * rows }, (_: unknown, i: number) => i);
    for (let i = orders.length - 1; i > 0; i--) {
      const j = Math.floor(((i * 2654435761) ^ (i >> 16)) % (i + 1));
      [orders[i], orders[j]] = [orders[j], orders[i]];
    }
    gridRef.current = orders;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.8)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const ps = ${dissolveParticleSize};
    const cols = Math.ceil(${s} / ps);
    const count = gridRef.current.length;
    const revealed = Math.floor(globalT * count);

    const off = document.createElement("canvas");
    off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < count; i++) {
      const idx = gridRef.current[i];
      if (idx < revealed) {
        const col = idx % cols; const row = Math.floor(idx / cols);
        ctx.drawImage(off, col*ps, row*ps, ps, ps, col*ps, row*ps, ps, ps);
      }
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  // shatter (default fallback)
  return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = 1 - Math.min(elapsed / ${animationSpeed}, 1);
      if (t <= 0) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 0;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t >= 1) { phaseRef.current = "in"; startRef.current = ts; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    const off = document.createElement("canvas"); off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < ${shatterPieces}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const cx = ${s} * r1; const cy = ${s} * r2;
      const vx = (r1 - 0.5) * ${s} * 1.4 * eased;
      const vy = (r2 - 0.5) * ${s} * 1.4 * eased;
      const rot = (r3 - 0.5) * Math.PI * 2 * eased;
      ctx.save();
      ctx.translate(cx + vx, cy + vy); ctx.rotate(rot); ctx.translate(-cx, -cy);
      const region = ${s} * 0.7;
      ctx.beginPath(); ctx.rect(cx - region, cy - region, region * 2, region * 2); ctx.clip();
      ctx.drawImage(off, 0, 0, ${s}, ${s});
      ctx.restore();
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
}

// ─── TSX + Tailwind Generator ──────────────────────────────────────────────────

export function generateLoaderTailwind(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize,
    imageBorderRadius,
    tileColumns,
    tileRows,
    glitchIntensity,
    revealAngle,
    revealBlur,
    scanlineCount,
    dissolveParticleSize,
    shatterPieces,
    glowColor,
    showGlow,
    backgroundColor,
    containerPadding,
    containerBorderRadius,
    showShadow,
    showBackground,
    showLabel,
    labelText,
    labelColor,
    labelFontSize,
    labelGap,
  } = config;

  // Pre-compute complex values
  const shadow = showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";

  const glowShadow = showGlow ? `0 0 32px ${glowColor}40` : "none";

  // Bake font size as literal
  const labelFs = labelFontSize;

  const animFnBody = generateAnimationFunctionTailwind(config);

  return `"use client";
import { useRef, useEffect, useCallback, CSSProperties } from "react";

interface LoaderProps {
  imageSrc: string;
}

// Baked-in CSS variable tokens — update these to reskin the Loader
const ldrVars: CSSProperties = {
  "--ldr-bg":             "${backgroundColor}",
  "--ldr-glow":           "${glowColor}",
  "--ldr-label-color":    "${labelColor}",
  "--ldr-radius":         "${imageBorderRadius}px",
  "--ldr-container-radius": "${containerBorderRadius}px",
  "--ldr-shadow":         "${shadow}",
  "--ldr-glow-shadow":    "${glowShadow}",
  "--ldr-size":           "${imageSize}px",
  "--ldr-padding":        "${containerPadding}px",
  "--ldr-label-gap":      "${labelGap}px",
} as CSSProperties;

export default function Loader({ imageSrc }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"in" | "hold" | "out">("in");

${animFnBody}

  useEffect(() => {
    phaseRef.current = "in";
    startRef.current = 0;
    const img = new Image();
    img.onload = () => {
      animRef.current = requestAnimationFrame((ts: number) => draw(ts, img));
    };
    img.src = imageSrc;
    return () => cancelAnimationFrame(animRef.current);
  }, [imageSrc, draw]);

  return (
    <div
      className="inline-flex flex-col items-center justify-center relative${
        showBackground
          ? " p-[var(--ldr-padding)] rounded-[var(--ldr-container-radius)] bg-[var(--ldr-bg)]"
          : ""
      }"
      style={ldrVars}
    >${
      showBackground && showShadow
        ? `
      {/* Shadow applied via style since multi-part box-shadow isn't reliable via Tailwind arbitrary */}`
        : ""
    }
      <canvas
        ref={canvasRef}
        width={${imageSize}}
        height={${imageSize}}
        className="block rounded-[var(--ldr-radius)] w-[var(--ldr-size)] h-[var(--ldr-size)]"${
          showGlow
            ? `
        style={{ boxShadow: "var(--ldr-glow-shadow)" }}`
            : ""
        }
      />
${
  showLabel
    ? `      <p
        className="m-0 mt-[var(--ldr-label-gap)] text-[${labelFs}px] text-[var(--ldr-label-color)] font-medium tracking-[0.06em] whitespace-nowrap"
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        ${labelText}
      </p>`
    : ""
}
    </div>
  );
}`;
}

function generateAnimationFunctionTailwind(config: LoaderConfig): string {
  const {
    animation,
    animationSpeed,
    loopDelay,
    imageSize: s,
    imageBorderRadius,
    revealAngle,
    revealBlur,
    tileColumns,
    tileRows,
    scanlineCount,
    glitchIntensity,
    dissolveParticleSize,
    shatterPieces,
  } = config;

  const roundedClip = `
    function clipRounded(ctx: CanvasRenderingContext2D, s: number, r: number): void {
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(s - r, 0); ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r); ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s); ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
    }`;

  if (animation === "diagonal-reveal") {
    return `${roundedClip}

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = Math.min(elapsed / ${animationSpeed}, 1);
      if (t >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t <= 0) { phaseRef.current = "in"; startRef.current = ts; t = 0; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    clipRounded(ctx, ${s}, ${imageBorderRadius}); ctx.clip();

    const angleRad = (${revealAngle} * Math.PI) / 180;
    const diag = Math.sqrt(${s}*${s} + ${s}*${s});
    const wipePos = eased * (diag * 2) - diag;

    ctx.filter = \`blur(\${(${revealBlur} * (1 - eased)).toFixed(1)}px)\`;
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.filter = "none";

    ctx.save();
    ctx.translate(${s / 2}, ${s / 2}); ctx.rotate(angleRad); ctx.translate(-${s / 2}, -${s / 2});
    ctx.beginPath(); ctx.rect(wipePos - diag, -${s}, diag * 2, ${s * 3}); ctx.restore();
    ctx.clip();
    ctx.drawImage(image, 0, 0, ${s}, ${s});
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "tile-assemble") {
    return `
  interface TileData { ox: number; oy: number; delay: number; rot: number; }
  const tilesRef = useRef<TileData[]>([]);
  useEffect(() => {
    const tiles: TileData[] = [];
    for (let i = 0; i < ${tileColumns * tileRows}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const r4 = ((seed * 214013 + 2531011) & 0xffff) / 0xffff;
      tiles.push({ ox: (r1-0.5)*${s * 1.8}, oy: (r2-0.5)*${s * 1.8}, delay: r3*0.5, rot: (r4-0.5)*60 });
    }
    tilesRef.current = tiles;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.7)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const tW = ${s} / ${tileColumns}; const tH = ${s} / ${tileRows};

    for (let row = 0; row < ${tileRows}; row++) {
      for (let col = 0; col < ${tileColumns}; col++) {
        const tile = tilesRef.current[row * ${tileColumns} + col];
        if (!tile) continue;
        const tileT = Math.max(0, Math.min((globalT - tile.delay * 0.4) / (1 - tile.delay * 0.4), 1));
        const eased = tileT < 0.5 ? 4*tileT*tileT*tileT : 1 - Math.pow(-2*tileT+2,3)/2;
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.translate(col*tW + tile.ox*(1-eased) + tW/2, row*tH + tile.oy*(1-eased) + tH/2);
        ctx.rotate((tile.rot*(1-eased)*Math.PI)/180);
        ctx.translate(-tW/2, -tH/2);
        ctx.beginPath(); ctx.rect(1, 1, tW-2, tH-2); ctx.clip();
        ctx.drawImage(image, col*tW, row*tH, tW, tH, 0, 0, tW, tH);
        ctx.restore();
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill();
    ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "scanline") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    ctx.globalAlpha = 0.08; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    const lineH = ${s} / ${scanlineCount};

    for (let i = 0; i < ${scanlineCount}; i++) {
      const delay = (i / ${scanlineCount}) * 0.5;
      const lineT = Math.max(0, Math.min((globalT - delay) / (1 - delay), 1));
      const eased = lineT < 0.5 ? 2*lineT*lineT : -1+(4-2*lineT)*lineT;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, i * lineH, ${s}, lineH); ctx.clip();
      ctx.globalAlpha = eased; ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.restore();
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "glitch") {
    return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const phase = phaseRef.current;
    if (phase === "in" && elapsed > ${animationSpeed}) { phaseRef.current = "hold"; startRef.current = ts; }
    else if (phase === "hold" && elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    else if (phase === "out" && elapsed > ${Math.round(animationSpeed * 0.5)}) { phaseRef.current = "in"; startRef.current = ts; }

    const glitchT = phaseRef.current === "in" ? elapsed / ${animationSpeed} : 0;
    const intensity = Math.sin(glitchT * Math.PI) * ${glitchIntensity};

    ctx.clearRect(0, 0, ${s}, ${s});
    ctx.save();
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.clip();

    if (phaseRef.current === "hold") {
      ctx.drawImage(image, 0, 0, ${s}, ${s});
    } else {
      const split = intensity * 2.5;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(-split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(255,0,0,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(split, 0);
      ctx.drawImage(image, 0, 0, ${s}, ${s});
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(0,255,255,0.35)";
      ctx.fillRect(0,0,${s},${s}); ctx.restore();

      ctx.globalAlpha = 0.75; ctx.drawImage(image, 0, 0, ${s}, ${s}); ctx.globalAlpha = 1;
    }
    ctx.restore();
    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  if (animation === "dissolve") {
    return `
  const gridRef = useRef<number[]>([]);
  useEffect(() => {
    const cols = Math.ceil(${s} / ${dissolveParticleSize});
    const rows = Math.ceil(${s} / ${dissolveParticleSize});
    const orders: number[] = Array.from({ length: cols * rows }, (_: unknown, i: number) => i);
    for (let i = orders.length - 1; i > 0; i--) {
      const j = Math.floor(((i * 2654435761) ^ (i >> 16)) % (i + 1));
      [orders[i], orders[j]] = [orders[j], orders[i]];
    }
    gridRef.current = orders;
  }, []);

  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let globalT = 0;
    if (phaseRef.current === "in") {
      globalT = Math.min(elapsed / ${animationSpeed}, 1);
      if (globalT >= 1) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      globalT = 1;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      globalT = 1 - Math.min(elapsed / ${Math.round(animationSpeed * 0.8)}, 1);
      if (globalT <= 0) { phaseRef.current = "in"; startRef.current = ts; }
    }

    ctx.clearRect(0, 0, ${s}, ${s});
    const ps = ${dissolveParticleSize};
    const cols = Math.ceil(${s} / ps);
    const count = gridRef.current.length;
    const revealed = Math.floor(globalT * count);

    const off = document.createElement("canvas");
    off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < count; i++) {
      const idx = gridRef.current[i];
      if (idx < revealed) {
        const col = idx % cols; const row = Math.floor(idx / cols);
        ctx.drawImage(off, col*ps, row*ps, ps, ps, col*ps, row*ps, ps, ps);
      }
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
  }

  // shatter (default fallback)
  return `
  const draw = useCallback((ts: number, image: HTMLImageElement): void => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = ${s}; canvas.height = ${s};

    if (startRef.current === 0) startRef.current = ts;
    const elapsed = ts - startRef.current;
    let t = 0;
    if (phaseRef.current === "in") {
      t = 1 - Math.min(elapsed / ${animationSpeed}, 1);
      if (t <= 0) { phaseRef.current = "hold"; startRef.current = ts; }
    } else if (phaseRef.current === "hold") {
      t = 0;
      if (elapsed > ${loopDelay}) { phaseRef.current = "out"; startRef.current = ts; }
    } else {
      t = Math.min(elapsed / ${Math.round(animationSpeed * 0.6)}, 1);
      if (t >= 1) { phaseRef.current = "in"; startRef.current = ts; }
    }
    const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, ${s}, ${s});
    const off = document.createElement("canvas"); off.width = ${s}; off.height = ${s};
    const oc = off.getContext("2d")!; oc.drawImage(image, 0, 0, ${s}, ${s});

    for (let i = 0; i < ${shatterPieces}; i++) {
      const seed = i * 2654435761;
      const r1 = ((seed ^ (seed >> 16)) & 0xffff) / 0xffff;
      const r2 = ((seed * 1664525 + 1013904223) & 0xffff) / 0xffff;
      const r3 = ((seed * 22695477 + 1) & 0xffff) / 0xffff;
      const cx = ${s} * r1; const cy = ${s} * r2;
      const vx = (r1 - 0.5) * ${s} * 1.4 * eased;
      const vy = (r2 - 0.5) * ${s} * 1.4 * eased;
      const rot = (r3 - 0.5) * Math.PI * 2 * eased;
      ctx.save();
      ctx.translate(cx + vx, cy + vy); ctx.rotate(rot); ctx.translate(-cx, -cy);
      const region = ${s} * 0.7;
      ctx.beginPath(); ctx.rect(cx - region, cy - region, region * 2, region * 2); ctx.clip();
      ctx.drawImage(off, 0, 0, ${s}, ${s});
      ctx.restore();
    }

    ctx.save(); ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    const r = ${imageBorderRadius};
    ctx.moveTo(r,0); ctx.lineTo(${s}-r,0); ctx.quadraticCurveTo(${s},0,${s},r);
    ctx.lineTo(${s},${s}-r); ctx.quadraticCurveTo(${s},${s},${s}-r,${s});
    ctx.lineTo(r,${s}); ctx.quadraticCurveTo(0,${s},0,${s}-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.restore();

    animRef.current = requestAnimationFrame((ts2: number) => draw(ts2, image));
  }, []);`;
}
