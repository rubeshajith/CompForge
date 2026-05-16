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
