// /lib/imageCarouselConfig.ts

export type ImageCarouselMode = "dark" | "light";

export interface ImageCarouselConfig {
  // Container
  containerWidth: number; // px — width of the main image box
  borderRadius: number; // px — radius on the main image
  showShadow: boolean;

  // Carousel buttons
  btnBackground: string; // bg of prev/next arrow buttons
  btnColor: string; // icon/arrow colour
  btnBorderRadius: number; // px — how round the buttons are

  // Thumbnail strip
  thumbnailSize: number; // px — width & height of each thumbnail
  thumbnailBorderRadius: number;
  thumbnailBorderColor: string; // active thumbnail border
  thumbnailOpacity: number; // 0–1 — inactive thumbnail opacity

  // Zoom lens
  showZoom: boolean;
  zoomFactor: number; // multiplier, e.g. 2.5
  lensBorderColor: string;
  lensBackground: string; // rgba overlay inside the lens box
  zoomPreviewSize: number; // px — width & height of the zoom panel
  zoomPreviewBorderRadius: number;
  zoomPreviewBorderColor: string;

  // Image list (URLs used in the preview; stripped from exported code template)
  images: string[];
}

// ── Dark preset ──────────────────────────────────────────────────────────────
export const darkImageCarouselConfig: ImageCarouselConfig = {
  containerWidth: 480,
  borderRadius: 16,
  showShadow: true,

  btnBackground: "rgba(28, 28, 34, 0.88)",
  btnColor: "#f0f0f5",
  btnBorderRadius: 50,

  thumbnailSize: 68,
  thumbnailBorderRadius: 10,
  thumbnailBorderColor: "#7c6cfc",
  thumbnailOpacity: 0.45,

  showZoom: true,
  zoomFactor: 3,
  lensBorderColor: "#7c6cfc",
  lensBackground: "rgba(124, 108, 252, 0.12)",
  zoomPreviewSize: 320,
  zoomPreviewBorderRadius: 12,
  zoomPreviewBorderColor: "#2a2a38",

  images: [
    "assets/images/imageCarousel.jpg",
    "assets/images/ic1.jpg",
    "assets/images/ic3.webp",
    "assets/images/ic4.jpg",
    "assets/images/ic5.jpg",
    "assets/images/ic6.jpg",
  ],
};

// ── Light preset ─────────────────────────────────────────────────────────────
export const lightImageCarouselConfig: ImageCarouselConfig = {
  containerWidth: 480,
  borderRadius: 16,
  showShadow: true,

  btnBackground: "rgba(255, 255, 255, 0.90)",
  btnColor: "#1a1a2e",
  btnBorderRadius: 50,

  thumbnailSize: 68,
  thumbnailBorderRadius: 10,
  thumbnailBorderColor: "#6c5ce7",
  thumbnailOpacity: 0.45,

  showZoom: true,
  zoomFactor: 3,
  lensBorderColor: "#6c5ce7",
  lensBackground: "rgba(108, 92, 231, 0.10)",
  zoomPreviewSize: 320,
  zoomPreviewBorderRadius: 12,
  zoomPreviewBorderColor: "#d4d4e0",

  images: [
    "assets/images/imageCarousel.jpg",
    "assets/images/ic1.jpg",
    "assets/images/ic3.webp",
    "assets/images/ic4.jpg",
    "assets/images/ic5.jpg",
    "assets/images/ic6.jpg",
  ],
};

export const imageCarouselModePresets: Record<
  ImageCarouselMode,
  ImageCarouselConfig
> = {
  dark: darkImageCarouselConfig,
  light: lightImageCarouselConfig,
};

export const defaultImageCarouselConfig = darkImageCarouselConfig;
