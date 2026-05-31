// ─────────────────────────────────────────────────────────────────────────────
// progressConfig.ts — Progress Indicators Component Config
// ─────────────────────────────────────────────────────────────────────────────

export type ProgressMode = "dark" | "light";

export type ProgressVariant =
  | "linear"
  | "ring"
  | "processQueue"
  | "segmented"
  | "percentageRing"
  | "speedGauge"
  | "multiRing"
  | "levelLadder"
  | "rhythmWave"
  | "powerNode"
  | "iconPath"
  | "donutThin"
  | "verticalFill"
  | "glassFluid"
  | "gamifiedXP"
  | "conversionFunnel"
  | "workDistribution"
  | "storageStack"
  | "taskProgress"
  | "gpuCapacity";

export const progressVariantLabels: Record<ProgressVariant, string> = {
  linear: "01 · Linear Standard",
  ring: "02 · Classic Ring",
  processQueue: "03 · Process Queue",
  segmented: "04 · Segmented",
  percentageRing: "05 · Percentage Ring",
  speedGauge: "06 · Speed Gauge",
  multiRing: "07 · Multi-Ring",
  levelLadder: "08 · Level Ladder",
  rhythmWave: "09 · Rhythm Wave",
  powerNode: "10 · Power Node",
  iconPath: "11 · Icon Path",
  donutThin: "12 · Donut Thin",
  verticalFill: "13 · Vertical Fill",
  glassFluid: "14 · Glass Fluid",
  gamifiedXP: "15 · Gamified XP",
  conversionFunnel: "16 · Conversion Funnel",
  workDistribution: "17 · Work Distribution",
  storageStack: "18 · Storage Stack",
  taskProgress: "19 · Task Progress",
  gpuCapacity: "20 · GPU Capacity",
};

export interface ProgressConfig {
  // Variant
  variant: ProgressVariant;

  // Progress value (0–100)
  value: number;

  // Colors — primary track/fill
  accentColor: string;
  accentSecondary: string;
  accentTertiary: string;
  trackColor: string;

  // Surface
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;

  // Text
  labelColor: string;
  mutedColor: string;
  valueColor: string;

  // Typography
  fontSize: number;

  // Dimensions
  barHeight: number;
  ringSize: number;
  strokeWidth: number;

  // Behavior
  showLabel: boolean;
  showValue: boolean;
  animated: boolean;

  // Status color overrides
  dangerColor: string;
  successColor: string;
  warningColor: string;

  // Shadow
  showShadow: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// DARK PRESET
// ─────────────────────────────────────────────────────────────────────────────
export const darkProgressConfig: ProgressConfig = {
  variant: "linear",
  value: 65,

  accentColor: "#7c6cfc",
  accentSecondary: "#4ade80",
  accentTertiary: "#60a5fa",
  trackColor: "#242430",

  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  borderRadius: 10,

  labelColor: "#f0f0f5",
  mutedColor: "#9090a8",
  valueColor: "#7c6cfc",

  fontSize: 13,

  barHeight: 6,
  ringSize: 96,
  strokeWidth: 8,

  showLabel: true,
  showValue: true,
  animated: true,

  dangerColor: "#f87171",
  successColor: "#4ade80",
  warningColor: "#facc15",

  showShadow: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// LIGHT PRESET
// ─────────────────────────────────────────────────────────────────────────────
export const lightProgressConfig: ProgressConfig = {
  variant: "linear",
  value: 65,

  accentColor: "#6c5ce7",
  accentSecondary: "#00b894",
  accentTertiary: "#3b82f6",
  trackColor: "#e8e8f0",

  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  borderRadius: 10,

  labelColor: "#1a1a2e",
  mutedColor: "#9090a8",
  valueColor: "#6c5ce7",

  fontSize: 13,

  barHeight: 6,
  ringSize: 96,
  strokeWidth: 8,

  showLabel: true,
  showValue: true,
  animated: true,

  dangerColor: "#ef4444",
  successColor: "#22c55e",
  warningColor: "#eab308",

  showShadow: true,
};

export const progressModePresets: Record<ProgressMode, ProgressConfig> = {
  dark: darkProgressConfig,
  light: lightProgressConfig,
};

export const defaultProgressConfig = darkProgressConfig;
