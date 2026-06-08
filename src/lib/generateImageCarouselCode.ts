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

// ─────────────────────────────────────────────────────────────────────────────
// TSX + CSS
// ─────────────────────────────────────────────────────────────────────────────
export function generateImageCarouselTSX(config: ImageCarouselConfig): string {
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

const IMAGES: string[] = ${images};

interface LensPos {
  x: number;
  y: number;
}

interface ImageCarouselProps {
  onImageChange?: (src: string) => void;
}

export default function ImageCarousel({ onImageChange }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lensPos, setLensPos] = useState<LensPos>({ x: 0, y: 0 });
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [bgPos, setBgPos] = useState<string>("0px 0px");
  const [bgSize, setBgSize] = useState<string>("0px 0px");

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const LENS_FRAC = 0.2;

  const goTo = useCallback((index: number): void => {
    const len = IMAGES.length;
    const next = ((index % len) + len) % len;
    setCurrentIndex(next);
    if (onImageChange) onImageChange(IMAGES[next]);
  }, [onImageChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); goTo(currentIndex - 1); }}
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); goTo(currentIndex + 1); }}
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
        {IMAGES.map((src: string, i: number) => (
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
// TSX + Tailwind
// ─────────────────────────────────────────────────────────────────────────────
export function generateImageCarouselTailwind(
  config: ImageCarouselConfig,
): string {
  const images = config.images.length
    ? JSON.stringify(config.images, null, 2)
    : `[
  "assets/images/image1.jpg",
  "assets/images/image2.jpg",
  "assets/images/image3.jpg",
]`;

  const zoom = config.zoomFactor;
  const shadow = config.showShadow ? "0 8px 48px rgba(0,0,0,0.55)" : "none";
  const thumbHoverOpacity = Math.min(config.thumbnailOpacity + 0.25, 1);

  return `import { useState, useRef, useCallback, CSSProperties } from "react";

const IMAGES: string[] = ${images};

interface LensPos {
  x: number;
  y: number;
}

interface ImageCarouselProps {
  onImageChange?: (src: string) => void;
}

// Baked-in CSS variable tokens — update these to reskin the ImageCarousel
const icVars: CSSProperties = {
  "--ic-radius":              "${config.borderRadius}px",
  "--ic-btn-bg":              "${config.btnBackground}",
  "--ic-btn-color":           "${config.btnColor}",
  "--ic-btn-radius":          "${config.btnBorderRadius}px",
  "--ic-thumb-size":          "${config.thumbnailSize}px",
  "--ic-thumb-radius":        "${config.thumbnailBorderRadius}px",
  "--ic-thumb-border":        "${config.thumbnailBorderColor}",
  "--ic-thumb-opacity":       "${config.thumbnailOpacity}",
  "--ic-thumb-hover-opacity": "${thumbHoverOpacity}",
  "--ic-lens-border":         "${config.lensBorderColor}",
  "--ic-lens-bg":             "${config.lensBackground}",
  "--ic-zoom-size":           "${config.zoomPreviewSize}px",
  "--ic-zoom-radius":         "${config.zoomPreviewBorderRadius}px",
  "--ic-zoom-border":         "${config.zoomPreviewBorderColor}",
  "--ic-container-width":     "${config.containerWidth}px",
} as CSSProperties;

export default function ImageCarousel({ onImageChange }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lensPos, setLensPos] = useState<LensPos>({ x: 0, y: 0 });
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [bgPos, setBgPos] = useState<string>("0px 0px");
  const [bgSize, setBgSize] = useState<string>("0px 0px");

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const LENS_FRAC = 0.2;

  const goTo = useCallback((index: number): void => {
    const len = IMAGES.length;
    const next = ((index % len) + len) % len;
    setCurrentIndex(next);
    if (onImageChange) onImageChange(IMAGES[next]);
  }, [onImageChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
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
    <div
      className="flex flex-col gap-[14px] select-none font-sans"
      style={icVars}
    >

      {/* ── Main image row ──────────────────────────── */}
      <div className="flex gap-4 items-start relative">
        <div
          ref={containerRef}
          className="relative w-[var(--ic-container-width)] aspect-square overflow-hidden rounded-[var(--ic-radius)] cursor-zoom-in shrink-0"
          style={{ boxShadow: "${shadow}" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomVisible(true)}
          onMouseLeave={() => setZoomVisible(false)}
        >
          <button
            className="absolute top-1/2 -translate-y-1/2 left-3 z-[5] w-[38px] h-[38px] border-none rounded-[var(--ic-btn-radius)] bg-[var(--ic-btn-bg)] text-[var(--ic-btn-color)] text-[20px] cursor-pointer flex items-center justify-center backdrop-blur-[6px] transition-transform duration-[150ms] ease hover:scale-110"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); goTo(currentIndex - 1); }}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <img
            ref={imgRef}
            className="w-full h-full object-cover block rounded-[var(--ic-radius)] pointer-events-none select-none"
            src={IMAGES[currentIndex]}
            alt={\`Product image \${currentIndex + 1}\`}
            draggable={false}
          />

          <button
            className="absolute top-1/2 -translate-y-1/2 right-3 z-[5] w-[38px] h-[38px] border-none rounded-[var(--ic-btn-radius)] bg-[var(--ic-btn-bg)] text-[var(--ic-btn-color)] text-[20px] cursor-pointer flex items-center justify-center backdrop-blur-[6px] transition-transform duration-[150ms] ease hover:scale-110"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); goTo(currentIndex + 1); }}
            aria-label="Next image"
          >
            &#10095;
          </button>

          <div
            className="absolute w-[20%] h-[20%] border-2 border-[var(--ic-lens-border)] bg-[var(--ic-lens-bg)] pointer-events-none z-[3] rounded-[4px] box-border"
            style={{
              left: lensPos.x,
              top:  lensPos.y,
              display: zoomVisible ? "block" : "none",
            }}
          />
        </div>

        {/* ── Zoom preview panel ───────────────────── */}
        <div
          className="w-[var(--ic-zoom-size)] h-[var(--ic-zoom-size)] border border-[var(--ic-zoom-border)] rounded-[var(--ic-zoom-radius)] bg-no-repeat overflow-hidden shrink-0 self-start mt-[10%]"
          style={{
            backgroundImage: \`url(\${IMAGES[currentIndex]})\`,
            backgroundSize: bgSize,
            backgroundPosition: bgPos,
            display: zoomVisible ? "block" : "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          }}
        />
      </div>

      {/* ── Thumbnail strip ──────────────────────────── */}
      <div className="flex gap-[10px] flex-wrap max-w-[var(--ic-container-width)]">
        {IMAGES.map((src: string, i: number) => {
          let thumbCls = "w-[var(--ic-thumb-size)] h-[var(--ic-thumb-size)] object-cover rounded-[var(--ic-thumb-radius)] border-2 cursor-pointer transition-[opacity,border-color] duration-[180ms] ease";
          if (i === currentIndex) {
            thumbCls += " border-[var(--ic-thumb-border)] opacity-100";
          } else {
            thumbCls += " border-transparent opacity-[var(--ic-thumb-opacity)] hover:opacity-[var(--ic-thumb-hover-opacity)]";
          }
          return (
            <img
              key={i}
              src={src}
              alt={\`Thumbnail \${i + 1}\`}
              className={thumbCls}
              onClick={() => goTo(i)}
              draggable={false}
            />
          );
        })}
      </div>

    </div>
  );
}
`;
}
