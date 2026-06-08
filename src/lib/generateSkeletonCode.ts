import { SkeletonConfig, SkeletonBox } from "./skeletonConfig";

function getBorderRadius(box: SkeletonBox): number {
  if (box.shape === "circle") return Math.min(box.width, box.height) / 2;
  return box.borderRadius;
}

export function generateSkeletonJSX(config: SkeletonConfig): string {
  const boxesJSX = config.boxes
    .map(
      (box) => `
      <div className="skel__box" style={{
        left: ${Math.round(box.x)},
        top: ${Math.round(box.y)},
        width: ${Math.round(box.width)},
        height: ${Math.round(box.height)},
        borderRadius: ${getBorderRadius(box)},
      }} />`,
    )
    .join("");

  return `import "./SkeletonLoader.css";

export function SkeletonLoader() {
  return (
    <div className="skel">
      ${boxesJSX.trim()}
    </div>
  );
}
`;
}

export function generateSkeletonCSS(config: SkeletonConfig): string {
  const shimmerWidth = config.canvasWidth * 4;

  return `@keyframes skel-shimmer {
  0%   { background-position: -${config.canvasWidth * 2}px 0; }
  100% { background-position: ${config.canvasWidth * 2}px 0; }
}

.skel {
  position: relative;
  width: ${config.canvasWidth}px;
  height: ${config.canvasHeight}px;
  background: ${config.canvasBackground};
  border-radius: ${config.canvasBorderRadius}px;
  border: 1px solid ${config.canvasBorder};
  ${config.showCanvasShadow ? "box-shadow: 0 8px 48px rgba(0, 0, 0, 0.5);" : ""}
  overflow: hidden;
}

.skel__box {
  position: absolute;
  background: linear-gradient(
    90deg,
    ${config.shimmerBaseColor} 25%,
    ${config.shimmerHighlightColor} 50%,
    ${config.shimmerBaseColor} 75%
  );
  background-size: ${shimmerWidth}px 100%;
  animation: skel-shimmer ${config.shimmerSpeed}s infinite linear;
}
`;
}

// ─── TSX + CSS ────────────────────────
export function generateSkeletonTSX(config: SkeletonConfig): string {
  const boxesJSX = config.boxes
    .map(
      (box) => `
      <div className="skel__box" style={{
        left: ${Math.round(box.x)},
        top: ${Math.round(box.y)},
        width: ${Math.round(box.width)},
        height: ${Math.round(box.height)},
        borderRadius: ${getBorderRadius(box)},
      }} />`,
    )
    .join("");

  return `import "./SkeletonLoader.css";

export function SkeletonLoader() {
  return (
    <div className="skel">
      ${boxesJSX.trim()}
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateSkeletonTailwind(config: SkeletonConfig): string {
  const shimmerWidth = config.canvasWidth * 4;
  const canvasShadow = config.showCanvasShadow
    ? "0 8px 48px rgba(0, 0, 0, 0.5)"
    : "none";

  const boxesJSX = config.boxes
    .map((box) => {
      const radius = getBorderRadius(box);
      return `
      <div
        className="absolute [animation:skel-shimmer_var(--skel-speed)s_infinite_linear] bg-[linear-gradient(90deg,var(--skel-base)_25%,var(--skel-highlight)_50%,var(--skel-base)_75%)]"
        style={{
          left: ${Math.round(box.x)},
          top: ${Math.round(box.y)},
          width: ${Math.round(box.width)},
          height: ${Math.round(box.height)},
          borderRadius: ${radius},
          backgroundSize: \`${shimmerWidth}px 100%\`,
        }}
      />`;
    })
    .join("");

  return `import { CSSProperties } from "react";

// Baked-in CSS variable tokens — update these to reskin the SkeletonLoader
const skelVars: CSSProperties = {
  "--skel-canvas-bg":     "${config.canvasBackground}",
  "--skel-canvas-border": "${config.canvasBorder}",
  "--skel-canvas-radius": "${config.canvasBorderRadius}px",
  "--skel-base":          "${config.shimmerBaseColor}",
  "--skel-highlight":     "${config.shimmerHighlightColor}",
  "--skel-speed":         "${config.shimmerSpeed}",
} as CSSProperties;

export function SkeletonLoader() {
  return (
    <div
      className="relative overflow-hidden bg-[var(--skel-canvas-bg)] border border-[var(--skel-canvas-border)] rounded-[var(--skel-canvas-radius)]"
      style={{
        ...skelVars,
        width: ${config.canvasWidth},
        height: ${config.canvasHeight},
        boxShadow: "${canvasShadow}",
      }}
    >
      <style>{\`
        @keyframes skel-shimmer {
          0%   { background-position: -${config.canvasWidth * 2}px 0; }
          100% { background-position: ${config.canvasWidth * 2}px 0; }
        }
      \`}</style>
      ${boxesJSX.trim()}
    </div>
  );
}
`;
}
