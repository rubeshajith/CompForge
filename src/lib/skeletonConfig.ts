export type SkeletonMode = "dark" | "light";
export type BoxShape = "rect" | "circle" | "line";

export interface SkeletonBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  shape: BoxShape;
}

export interface SkeletonConfig {
  // Canvas
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  canvasBorderRadius: number;
  canvasBorder: string;
  showCanvasShadow: boolean;

  // Shimmer
  shimmerBaseColor: string;
  shimmerHighlightColor: string;
  shimmerSpeed: number; // seconds

  // Global box defaults
  defaultBorderRadius: number;

  // Boxes
  boxes: SkeletonBox[];
}

export const darkSkeletonConfig: SkeletonConfig = {
  canvasWidth: 320,
  canvasHeight: 200,
  canvasBackground: "#1c1c22",
  canvasBorderRadius: 12,
  canvasBorder: "#2a2a38",
  showCanvasShadow: true,

  shimmerBaseColor: "#242430",
  shimmerHighlightColor: "#2e2e3e",
  shimmerSpeed: 1.4,

  defaultBorderRadius: 6,

  boxes: [
    {
      id: "box-1",
      x: 16,
      y: 16,
      width: 48,
      height: 48,
      borderRadius: 24,
      shape: "circle",
    },
    {
      id: "box-2",
      x: 76,
      y: 20,
      width: 120,
      height: 12,
      borderRadius: 4,
      shape: "rect",
    },
    {
      id: "box-3",
      x: 76,
      y: 40,
      width: 80,
      height: 10,
      borderRadius: 4,
      shape: "rect",
    },
    {
      id: "box-4",
      x: 16,
      y: 84,
      width: 288,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-5",
      x: 16,
      y: 102,
      width: 240,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-6",
      x: 16,
      y: 120,
      width: 260,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-7",
      x: 16,
      y: 152,
      width: 90,
      height: 28,
      borderRadius: 6,
      shape: "rect",
    },
  ],
};

export const lightSkeletonConfig: SkeletonConfig = {
  canvasWidth: 320,
  canvasHeight: 200,
  canvasBackground: "#ffffff",
  canvasBorderRadius: 12,
  canvasBorder: "#d4d4e0",
  showCanvasShadow: true,

  shimmerBaseColor: "#ebebf0",
  shimmerHighlightColor: "#f8f8fc",
  shimmerSpeed: 1.4,

  defaultBorderRadius: 6,

  boxes: [
    {
      id: "box-1",
      x: 16,
      y: 16,
      width: 48,
      height: 48,
      borderRadius: 24,
      shape: "circle",
    },
    {
      id: "box-2",
      x: 76,
      y: 20,
      width: 120,
      height: 12,
      borderRadius: 4,
      shape: "rect",
    },
    {
      id: "box-3",
      x: 76,
      y: 40,
      width: 80,
      height: 10,
      borderRadius: 4,
      shape: "rect",
    },
    {
      id: "box-4",
      x: 16,
      y: 84,
      width: 288,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-5",
      x: 16,
      y: 102,
      width: 240,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-6",
      x: 16,
      y: 120,
      width: 260,
      height: 10,
      borderRadius: 4,
      shape: "line",
    },
    {
      id: "box-7",
      x: 16,
      y: 152,
      width: 90,
      height: 28,
      borderRadius: 6,
      shape: "rect",
    },
  ],
};

export const skeletonModePresets: Record<SkeletonMode, SkeletonConfig> = {
  dark: darkSkeletonConfig,
  light: lightSkeletonConfig,
};

export const defaultSkeletonConfig = darkSkeletonConfig;
