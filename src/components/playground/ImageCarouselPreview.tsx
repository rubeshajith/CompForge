"use client";

// /components/playground/ImageCarouselPreview.tsx

import { useState, useRef, useCallback, useEffect } from "react";
import { ImageCarouselConfig } from "@/lib/imageCarouselConfig";

// ── Placeholder images used in the playground preview ───────────────────────
const PREVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
];

interface Props {
  config: ImageCarouselConfig;
}

export function ImageCarouselPreview({ config }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomVisible, setZoomVisible] = useState(false);
  const [bgPos, setBgPos] = useState("0px 0px");
  const [bgSize, setBgSize] = useState("0px 0px");

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const LENS_FRAC = 0.2; // lens is 20% of container width

  const goTo = useCallback((index: number) => {
    const len = PREVIEW_IMAGES.length;
    setCurrentIndex(((index % len) + len) % len);
  }, []);

  // Reset to first image if config changes (e.g., theme switch)
  useEffect(() => {
    setCurrentIndex(0);
    setZoomVisible(false);
  }, [config]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!config.showZoom) return;
      const el = containerRef.current;
      const imgEl = imgRef.current;
      if (!el || !imgEl) return;

      const rect = el.getBoundingClientRect();
      const lensW = rect.width * LENS_FRAC;
      const lensH = rect.height * LENS_FRAC;

      let x = e.clientX - rect.left - lensW / 2;
      let y = e.clientY - rect.top - lensH / 2;

      x = Math.max(0, Math.min(x, rect.width - lensW));
      y = Math.max(0, Math.min(y, rect.height - lensH));

      setLensPos({ x, y });

      const zoom = config.zoomFactor;
      setBgSize(`${imgEl.offsetWidth * zoom}px ${imgEl.offsetHeight * zoom}px`);
      setBgPos(`-${x * zoom}px -${y * zoom}px`);
    },
    [config.showZoom, config.zoomFactor],
  );

  const containerSize = config.containerWidth;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: containerSize,
    aspectRatio: "1 / 1",
    overflow: "hidden",
    borderRadius: config.borderRadius,
    cursor: config.showZoom ? "zoom-in" : "default",
    boxShadow: config.showShadow ? "0 8px 48px rgba(0,0,0,0.55)" : "none",
    flexShrink: 0,
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    borderRadius: config.borderRadius,
    userSelect: "none",
    pointerEvents: "none",
  };

  const lensStyle: React.CSSProperties = {
    position: "absolute",
    width: `${LENS_FRAC * 100}%`,
    height: `${LENS_FRAC * 100}%`,
    left: lensPos.x,
    top: lensPos.y,
    border: `2px solid ${config.lensBorderColor}`,
    background: config.lensBackground,
    display: zoomVisible && config.showZoom ? "block" : "none",
    pointerEvents: "none",
    zIndex: 3,
    borderRadius: 4,
    boxSizing: "border-box",
  };

  const btnStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: 12,
    zIndex: 5,
    width: 38,
    height: 38,
    border: "none",
    borderRadius: config.btnBorderRadius,
    background: config.btnBackground,
    color: config.btnColor,
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
    transition: "transform 0.15s ease, background 0.15s ease",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  });

  const zoomPreviewStyle: React.CSSProperties = {
    position: "absolute",
    top: "10%",
    left: `calc(100% + 16px)`,
    zIndex: 20,
    width: config.zoomPreviewSize,
    height: config.zoomPreviewSize,
    border: `1px solid ${config.zoomPreviewBorderColor}`,
    borderRadius: config.zoomPreviewBorderRadius,
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${PREVIEW_IMAGES[currentIndex]})`,
    backgroundSize: bgSize,
    backgroundPosition: bgPos,
    display: zoomVisible && config.showZoom ? "block" : "none",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    overflow: "hidden",
    flexShrink: 0,
  };

  const thumbStyle = (active: boolean): React.CSSProperties => ({
    width: config.thumbnailSize,
    height: config.thumbnailSize,
    objectFit: "cover",
    borderRadius: config.thumbnailBorderRadius,
    border: `2px solid ${active ? config.thumbnailBorderColor : "transparent"}`,
    opacity: active ? 1 : config.thumbnailOpacity,
    cursor: "pointer",
    transition: "opacity 0.18s ease, border-color 0.18s ease",
    flexShrink: 0,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Main image + zoom preview row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        {/* Main container */}
        <div
          ref={containerRef}
          style={containerStyle}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => config.showZoom && setZoomVisible(true)}
          onMouseLeave={() => setZoomVisible(false)}
        >
          {/* Prev button */}
          <button
            style={btnStyle("left")}
            onClick={(e) => {
              e.stopPropagation();
              goTo(currentIndex - 1);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%)";
            }}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <img
            ref={imgRef}
            src={PREVIEW_IMAGES[currentIndex]}
            alt="Product preview"
            style={imgStyle}
            draggable={false}
          />

          {/* Next button */}
          <button
            style={btnStyle("right")}
            onClick={(e) => {
              e.stopPropagation();
              goTo(currentIndex + 1);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%)";
            }}
            aria-label="Next image"
          >
            &#10095;
          </button>

          {/* Zoom lens overlay */}
          <div style={lensStyle} />
        </div>

        {/* Zoom preview panel — floats to the right */}
        <div style={zoomPreviewStyle} />
      </div>

      {/* Thumbnail strip */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          maxWidth: containerSize,
        }}
      >
        {PREVIEW_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Thumbnail ${i + 1}`}
            style={thumbStyle(i === currentIndex)}
            onClick={() => goTo(i)}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
