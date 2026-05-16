export type LoaderMode = "dark" | "light";

export type LoaderVariant =
  | "pulse-wave"
  | "hex-bloom"
  | "orbit-ring"
  | "yin-spiral"
  | "bar-fill"
  | "slide-shift"
  | "dot-bounce"
  | "morph-blob"
  | "stagger-bars";

export interface LoaderConfig {
  variant: LoaderVariant;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  size: number;
  speed: number; // multiplier: 0.5 (fast) → 2.0 (slow)
  strokeWidth: number; // for ring/wave loaders
  showLabel: boolean;
  labelColor: string;
  labelText: string;
}

export const LOADER_VARIANTS: { id: LoaderVariant; label: string }[] = [
  { id: "pulse-wave", label: "Pulse Wave" },
  { id: "hex-bloom", label: "Hex Bloom" },
  { id: "orbit-ring", label: "Orbit Ring" },
  { id: "yin-spiral", label: "Yin Spiral" },
  { id: "bar-fill", label: "Bar Fill" },
  { id: "slide-shift", label: "Slide Shift" },
  { id: "dot-bounce", label: "Dot Bounce" },
  { id: "morph-blob", label: "Morph Blob" },
  { id: "stagger-bars", label: "Stagger Bars" },
];

export const darkLoaderConfig: LoaderConfig = {
  variant: "pulse-wave",
  primaryColor: "#7c6cfc",
  secondaryColor: "#7c6cfc30",
  backgroundColor: "#1c1c22",
  size: 64,
  speed: 1.0,
  strokeWidth: 5,
  showLabel: false,
  labelColor: "#9090a8",
  labelText: "Loading...",
};

export const lightLoaderConfig: LoaderConfig = {
  variant: "pulse-wave",
  primaryColor: "#6c5ce7",
  secondaryColor: "#6c5ce730",
  backgroundColor: "#ffffff",
  size: 64,
  speed: 1.0,
  strokeWidth: 5,
  showLabel: false,
  labelColor: "#9090a8",
  labelText: "Loading...",
};

export const loaderModePresets: Record<LoaderMode, LoaderConfig> = {
  dark: darkLoaderConfig,
  light: lightLoaderConfig,
};

export const defaultLoaderConfig = darkLoaderConfig;
