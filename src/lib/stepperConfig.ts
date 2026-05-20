// lib/stepperConfig.ts

export type StepperMode = "dark" | "light";

export type StepperVariant =
  | "progressPin"
  | "multiStep"
  | "rangeSlider"
  | "segmented"
  | "dotStepper";

export interface StepperConfig {
  // Variant
  variant: StepperVariant;

  // Track
  trackColor: string;
  trackHeight: number;

  // Fill / accent
  accentColor: string;
  accentColorSecondary: string;
  useGradient: boolean;

  // Progress value (0–100)
  progressValue: number;

  // Multi-step
  totalSteps: number;
  activeStep: number; // 1-based

  // Step node sizes
  stepNodeSize: number;
  stepNodeBorderRadius: number;

  // Dot stepper
  dotActiveSize: number;
  dotInactiveSize: number;

  // Range slider thumb
  thumbWidth: number;
  thumbHeight: number;
  thumbColor: string;
  thumbBorderRadius: number;

  // Segmented
  segmentCount: number;
  activeSegments: number;

  // Pin shape
  showPin: boolean;
  pinColor: string;

  // Labels
  showLabels: boolean;
  labelColor: string;
  activeLabelColor: string;
  fontSize: number;

  // Container
  backgroundColor: string;
  showShadow: boolean;
  borderRadius: number;

  // Glow / shadow on accent
  accentGlow: boolean;
}

// ─── DARK PRESET ────────────────────────────────────────────────
export const darkStepperConfig: StepperConfig = {
  variant: "progressPin",

  trackColor: "#2c3154",
  trackHeight: 2,

  accentColor: "#ff5e95",
  accentColorSecondary: "#ff8a7a",
  useGradient: true,

  progressValue: 68,

  totalSteps: 5,
  activeStep: 3,

  stepNodeSize: 40,
  stepNodeBorderRadius: 50,

  dotActiveSize: 48,
  dotInactiveSize: 16,

  thumbWidth: 8,
  thumbHeight: 32,
  thumbColor: "#ffffff",
  thumbBorderRadius: 4,

  segmentCount: 5,
  activeSegments: 2,

  showPin: true,
  pinColor: "#ff5e95",

  showLabels: true,
  labelColor: "#a0a5ba",
  activeLabelColor: "#ffffff",
  fontSize: 11,

  backgroundColor: "#13162b",
  showShadow: true,
  borderRadius: 16,

  accentGlow: true,
};

// ─── LIGHT PRESET ────────────────────────────────────────────────
export const lightStepperConfig: StepperConfig = {
  variant: "progressPin",

  trackColor: "#e2e4ef",
  trackHeight: 2,

  accentColor: "#6c5ce7",
  accentColorSecondary: "#a29bfe",
  useGradient: true,

  progressValue: 68,

  totalSteps: 5,
  activeStep: 3,

  stepNodeSize: 40,
  stepNodeBorderRadius: 50,

  dotActiveSize: 48,
  dotInactiveSize: 16,

  thumbWidth: 8,
  thumbHeight: 32,
  thumbColor: "#6c5ce7",
  thumbBorderRadius: 4,

  segmentCount: 5,
  activeSegments: 2,

  showPin: true,
  pinColor: "#6c5ce7",

  showLabels: true,
  labelColor: "#9090a8",
  activeLabelColor: "#1a1a2e",
  fontSize: 11,

  backgroundColor: "#f4f4f8",
  showShadow: true,
  borderRadius: 16,

  accentGlow: false,
};

export const stepperModePresets: Record<StepperMode, StepperConfig> = {
  dark: darkStepperConfig,
  light: lightStepperConfig,
};

export const defaultStepperConfig = darkStepperConfig;

export const VARIANT_LABELS: Record<StepperVariant, string> = {
  progressPin: "Progress Pin",
  multiStep: "Multi-Step",
  rangeSlider: "Range Slider",
  segmented: "Segmented",
  dotStepper: "Dot Stepper",
};

export const STEP_LABELS = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"];
