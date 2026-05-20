// lib/stepperConfig.ts

export type StepperMode = "dark" | "light";

export type StepperVariant =
  | "segmented-loading"
  | "slider-tooltip"
  | "multi-point-slider"
  | "gradient-progress"
  | "stepper-dots"
  | "status-stepper"
  | "color-segments"
  | "completeness"
  | "verification";

export interface StepperConfig {
  // Variant selector
  variant: StepperVariant;

  // Common
  trackColor: string;
  trackHeight: number; // px
  borderRadius: number; // px

  // Progress / fill
  accentColor: string;
  accentColorSecondary: string; // used for gradients and multi-point
  fillPercent: number; // 0–100 (primary progress value)

  // Stepper dots / status stepper
  stepCount: number; // 3–6
  activeStep: number; // 1-indexed
  stepDotSize: number; // px
  stepActiveColor: string;
  stepCompleteColor: string;
  stepInactiveColor: string;
  stepLabelColor: string;
  stepConnectorColor: string;
  showStepLabels: boolean;

  // Tooltip
  tooltipBackground: string;
  tooltipTextColor: string;
  tooltipBorderRadius: number;
  showTooltip: boolean;

  // Slider thumb
  thumbSize: number; // px
  thumbBorderColor: string;
  thumbBackground: string;

  // Multi-point slider colors (4 points)
  point1Color: string;
  point2Color: string;
  point3Color: string;
  point4Color: string;

  // Segmented loading
  segmentCount: number; // 4–8
  segmentGap: number; // px
  segmentWidth: number; // px

  // Color segments (cart checkout style)
  seg1Color: string;
  seg2Color: string;
  seg3Color: string;
  seg4Color: string;
  segLabelColor: string;

  // Striped / completeness
  stripeColor: string;
  showStripes: boolean;

  // Verification
  verificationNodeBorderColor: string;
  verificationNodeBackground: string;

  // Typography
  fontSize: number;
  labelColor: string;
  fontWeight: number;
}

export const darkStepperConfig: StepperConfig = {
  variant: "stepper-dots",

  trackColor: "#2a2a38",
  trackHeight: 4,
  borderRadius: 99,

  accentColor: "#7c6cfc",
  accentColorSecondary: "#4ade80",
  fillPercent: 60,

  stepCount: 4,
  activeStep: 3,
  stepDotSize: 14,
  stepActiveColor: "#7c6cfc",
  stepCompleteColor: "#4ade80",
  stepInactiveColor: "#2a2a38",
  stepLabelColor: "#9090a8",
  stepConnectorColor: "#2a2a38",
  showStepLabels: true,

  tooltipBackground: "#1c1c22",
  tooltipTextColor: "#f0f0f5",
  tooltipBorderRadius: 6,
  showTooltip: true,

  thumbSize: 16,
  thumbBorderColor: "#7c6cfc",
  thumbBackground: "#1c1c22",

  point1Color: "#facc15",
  point2Color: "#fb923c",
  point3Color: "#f87171",
  point4Color: "#c084fc",

  segmentCount: 7,
  segmentGap: 3,
  segmentWidth: 28,

  seg1Color: "#facc15",
  seg2Color: "#fb923c",
  seg3Color: "#f87171",
  seg4Color: "#2a2a38",
  segLabelColor: "#9090a8",

  stripeColor: "#ffffff",
  showStripes: true,

  verificationNodeBorderColor: "#7c6cfc",
  verificationNodeBackground: "#1c1c22",

  fontSize: 10,
  labelColor: "#9090a8",
  fontWeight: 700,
};

export const lightStepperConfig: StepperConfig = {
  variant: "stepper-dots",

  trackColor: "#e2e2ec",
  trackHeight: 4,
  borderRadius: 99,

  accentColor: "#6c5ce7",
  accentColorSecondary: "#22c55e",
  fillPercent: 60,

  stepCount: 4,
  activeStep: 3,
  stepDotSize: 14,
  stepActiveColor: "#6c5ce7",
  stepCompleteColor: "#22c55e",
  stepInactiveColor: "#d4d4e0",
  stepLabelColor: "#6b7280",
  stepConnectorColor: "#d4d4e0",
  showStepLabels: true,

  tooltipBackground: "#1a1a2e",
  tooltipTextColor: "#ffffff",
  tooltipBorderRadius: 6,
  showTooltip: true,

  thumbSize: 16,
  thumbBorderColor: "#6c5ce7",
  thumbBackground: "#ffffff",

  point1Color: "#eab308",
  point2Color: "#f97316",
  point3Color: "#ef4444",
  point4Color: "#a855f7",

  segmentCount: 7,
  segmentGap: 3,
  segmentWidth: 28,

  seg1Color: "#eab308",
  seg2Color: "#f97316",
  seg3Color: "#ef4444",
  seg4Color: "#e2e2ec",
  segLabelColor: "#6b7280",

  stripeColor: "#ffffff",
  showStripes: true,

  verificationNodeBorderColor: "#6c5ce7",
  verificationNodeBackground: "#ffffff",

  fontSize: 10,
  labelColor: "#6b7280",
  fontWeight: 700,
};

export const stepperModePresets: Record<StepperMode, StepperConfig> = {
  dark: darkStepperConfig,
  light: lightStepperConfig,
};

export const defaultStepperConfig = darkStepperConfig;

export const VARIANT_LABELS: Record<StepperVariant, string> = {
  "segmented-loading": "Segmented Loading",
  "slider-tooltip": "Slider with Tooltip",
  "multi-point-slider": "Multi-Point Slider",
  "gradient-progress": "Gradient Progress",
  "stepper-dots": "Step Indicator Dots",
  "status-stepper": "Status Stepper",
  "color-segments": "Color Segments",
  completeness: "Completeness Bar",
  verification: "Verification Track",
};
