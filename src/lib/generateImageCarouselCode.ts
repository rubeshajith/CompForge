// /lib/generateImageCarouselCode.ts

import { ImageCarouselConfig } from "./imageCarouselConfig";

// ─────────────────────────────────────────────────────────────────────────────
// JSX
// ─────────────────────────────────────────────────────────────────────────────
export function generateImageCarouselJSX(config: ImageCarouselConfig): string {
  const images = config.images.length
    ? JSON.stringify(config.images, null, 2)
    : `[
  "assets/images/image1.jpg",
  "assets/images/image2.jpg",
  "assets/images/image3.jpg",
]`;

  const zoom = config.zoomFactor;

  return `import { useState, useRef, useCallback } from "react";
import "./ImageCarousel.css";

const IMAGES = ${images};

export default function ImageCarousel({ onImageChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomVisible, setZoomVisible] = useState(false);
  const [bgPos, setBgPos] = useState("0px 0px");
  const [bgSize, setBgSize] = useState("0px 0px");

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const LENS_FRAC = 0.2;

  const goTo = useCallback((index) => {
    const len = IMAGES.length;
    const next = ((index % len) + len) % len;
    setCurrentIndex(next);
    if (onImageChange) onImageChange(IMAGES[next]);
  }, [onImageChange]);

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    const imgEl = imgRef.current;
    if (!el || !imgEl) return;

    const rect = el.getBoundingClientRect();
    const lensW = rect.width * LENS_FRAC;
    const lensH = rect.height * LENS_FRAC;

    let x = e.clientX - rect.left - lensW / 2;
    let y = e.clientY - rect.top  - lensH / 2;

    x = Math.max(0, Math.min(x, rect.width  - lensW));
    y = Math.max(0, Math.min(y, rect.height - lensH));

    setLensPos({ x, y });

    const zoom = ${zoom};
    setBgSize(\`\${imgEl.offsetWidth  * zoom}px \${imgEl.offsetHeight * zoom}px\`);
    setBgPos(\`-\${x * zoom}px -\${y * zoom}px\`);
  }, []);

  return (
    <div className="ic-wrap">

      {/* ── Main image row ──────────────────────────── */}
      <div className="ic__image-row">
        <div
          ref={containerRef}
          className="ic__main"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomVisible(true)}
          onMouseLeave={() => setZoomVisible(false)}
        >
          <button
            className="ic__nav ic__nav--prev"
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <img
            ref={imgRef}
            className="ic__img"
            src={IMAGES[currentIndex]}
            alt={\`Product image \${currentIndex + 1}\`}
            draggable={false}
          />

          <button
            className="ic__nav ic__nav--next"
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
            aria-label="Next image"
          >
            &#10095;
          </button>

          <div
            className="ic__lens"
            style={{
              left: lensPos.x,
              top:  lensPos.y,
              display: zoomVisible ? "block" : "none",
            }}
          />
        </div>

        {/* ── Zoom preview panel ───────────────────── */}
        <div
          className="ic__zoom-preview"
          style={{
            backgroundImage: \`url(\${IMAGES[currentIndex]})\`,
            backgroundSize: bgSize,
            backgroundPosition: bgPos,
            display: zoomVisible ? "block" : "none",
          }}
        />
      </div>

      {/* ── Thumbnail strip ──────────────────────────── */}
      <div className="ic__thumbs">
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={\`Thumbnail \${i + 1}\`}
            className={\`ic__thumb\${i === currentIndex ? " ic__thumb--active" : ""}\`}
            onClick={() => goTo(i)}
            draggable={false}
          />
        ))}
      </div>

    </div>
  );
}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
export function generateImageCarouselCSS(config: ImageCarouselConfig): string {
  const {
    containerWidth,
    borderRadius,
    showShadow,
    btnBackground,
    btnColor,
    btnBorderRadius,
    thumbnailSize,
    thumbnailBorderRadius,
    thumbnailBorderColor,
    thumbnailOpacity,
    lensBorderColor,
    lensBackground,
    zoomPreviewSize,
    zoomPreviewBorderRadius,
    zoomPreviewBorderColor,
  } = config;

  const shadow = showShadow ? "0 8px 48px rgba(0,0,0,0.55)" : "none";

  return `/* ImageCarousel.css */

/* ── Wrapper ──────────────────────────────────────────── */
.ic-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  user-select: none;
}

/* ── Main image row ───────────────────────────────────── */
.ic__image-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  position: relative;
}

/* ── Main image container ─────────────────────────────── */
.ic__main {
  position: relative;
  width: ${containerWidth}px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: ${borderRadius}px;
  cursor: zoom-in;
  box-shadow: ${shadow};
  flex-shrink: 0;
}

.ic__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: ${borderRadius}px;
  pointer-events: none;
  user-select: none;
}

/* ── Carousel nav buttons ─────────────────────────────── */
.ic__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: ${btnBorderRadius}px;
  background: ${btnBackground};
  color: ${btnColor};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: transform 0.15s ease, background 0.15s ease;
}

.ic__nav:hover {
  transform: translateY(-50%) scale(1.1);
}

.ic__nav--prev { left: 12px; }
.ic__nav--next { right: 12px; }

/* ── Zoom lens ────────────────────────────────────────── */
.ic__lens {
  position: absolute;
  width: 20%;
  height: 20%;
  border: 2px solid ${lensBorderColor};
  background: ${lensBackground};
  pointer-events: none;
  z-index: 3;
  border-radius: 4px;
  box-sizing: border-box;
}

/* ── Zoom preview panel ───────────────────────────────── */
.ic__zoom-preview {
  width: ${zoomPreviewSize}px;
  height: ${zoomPreviewSize}px;
  border: 1px solid ${zoomPreviewBorderColor};
  border-radius: ${zoomPreviewBorderRadius}px;
  background-repeat: no-repeat;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 10%;
}

/* ── Thumbnail strip ──────────────────────────────────── */
.ic__thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-width: ${containerWidth}px;
}

.ic__thumb {
  width: ${thumbnailSize}px;
  height: ${thumbnailSize}px;
  object-fit: cover;
  border-radius: ${thumbnailBorderRadius}px;
  border: 2px solid transparent;
  opacity: ${thumbnailOpacity};
  cursor: pointer;
  transition: opacity 0.18s ease, border-color 0.18s ease;
}

.ic__thumb--active {
  border-color: ${thumbnailBorderColor};
  opacity: 1;
}

.ic__thumb:hover:not(.ic__thumb--active) {
  opacity: ${Math.min(thumbnailOpacity + 0.25, 1)};
}
`;
}
