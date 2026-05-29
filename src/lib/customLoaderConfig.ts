// /lib/loaderConfig.ts

export type LoaderMode = "dark" | "light";

export type ImageAnimation =
  | "diagonal-reveal" // blurred → sharp, diagonal wipe
  | "tile-assemble" // grid tiles fly in from random positions
  | "scanline" // horizontal scan lines fade image in
  | "glitch" // RGB channel split + pixel shift loop
  | "dissolve" // ink-drop origins spread like watercolor to reveal image
  | "shatter"; // fragments explode out then reassemble

export interface LoaderConfig {
  // Core animation
  animation: ImageAnimation;
  animationSpeed: number; // ms — total cycle duration (600–4000)
  loopDelay: number; // ms — pause between cycles (0–3000)

  // Image display
  imageSize: number; // px — width & height of the image frame
  imageBorderRadius: number; // px
  imageOpacity: number; // 0–100 (base opacity of image)

  // Tile assemble
  tileColumns: number; // 3–8 grid columns
  tileRows: number; // 3–8 grid rows
  tileGap: number; // px gap between tiles during flight

  // Glitch
  glitchIntensity: number; // 1–10  — magnitude of channel split & shift
  glitchSlices: number; // 4–16  — number of horizontal slices

  // Diagonal reveal
  revealAngle: number; // degrees — 0 = left→right, 45 = diagonal, 90 = top→bottom
  revealBlur: number; // px blur at the start

  // Scanline
  scanlineCount: number; // 4–20
  scanlineDirection: "top-down" | "bottom-up" | "alternating";

  // Dissolve
  dissolveParticleSize: number; // px — size of dissolve "pixels"

  // Shatter
  shatterPieces: number; // 6–20

  // Accent / overlay color
  accentColor: string;
  glowColor: string;
  showGlow: boolean;

  // Container
  backgroundColor: string;
  containerPadding: number;
  containerBorderRadius: number;
  showShadow: boolean;
  showBackground: boolean;

  // Label
  showLabel: boolean;
  labelText: string;
  labelColor: string;
  labelFontSize: number;
  labelGap: number;
}

export const darkLoaderConfig: LoaderConfig = {
  animation: "diagonal-reveal",
  animationSpeed: 1800,
  loopDelay: 600,

  imageSize: 120,
  imageBorderRadius: 16,
  imageOpacity: 100,

  tileColumns: 5,
  tileRows: 5,
  tileGap: 4,

  glitchIntensity: 5,
  glitchSlices: 8,

  revealAngle: 45,
  revealBlur: 14,

  scanlineCount: 10,
  scanlineDirection: "top-down",

  dissolveParticleSize: 6,
  shatterPieces: 12,

  accentColor: "#7c6cfc",
  glowColor: "#7c6cfc",
  showGlow: true,

  backgroundColor: "#141418",
  containerPadding: 40,
  containerBorderRadius: 20,
  showShadow: true,
  showBackground: true,

  showLabel: true,
  labelText: "Loading…",
  labelColor: "#5a5a72",
  labelFontSize: 13,
  labelGap: 20,
};

export const lightLoaderConfig: LoaderConfig = {
  animation: "diagonal-reveal",
  animationSpeed: 1800,
  loopDelay: 600,

  imageSize: 120,
  imageBorderRadius: 16,
  imageOpacity: 100,

  tileColumns: 5,
  tileRows: 5,
  tileGap: 4,

  glitchIntensity: 5,
  glitchSlices: 8,

  revealAngle: 45,
  revealBlur: 14,

  scanlineCount: 10,
  scanlineDirection: "top-down",

  dissolveParticleSize: 6,
  shatterPieces: 12,

  accentColor: "#6c5ce7",
  glowColor: "#6c5ce7",
  showGlow: true,

  backgroundColor: "#ffffff",
  containerPadding: 40,
  containerBorderRadius: 20,
  showShadow: true,
  showBackground: true,

  showLabel: true,
  labelText: "Loading…",
  labelColor: "#9090a8",
  labelFontSize: 13,
  labelGap: 20,
};

export const loaderModePresets: Record<LoaderMode, LoaderConfig> = {
  dark: darkLoaderConfig,
  light: lightLoaderConfig,
};

export const defaultLoaderConfig = darkLoaderConfig;
