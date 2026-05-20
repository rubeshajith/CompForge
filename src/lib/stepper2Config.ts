// /lib/stepperConfig.ts

export type StepperMode = "dark" | "light";

export type StepperVariant =
  | "segmented-pill"
  | "breadcrumb-gray"
  | "breadcrumb-colorful"
  | "numbered-line"
  | "checkmark-horizontal"
  | "chevron-loading"
  | "dot-loading"
  | "sharp-chevron"
  | "dashed-confirmation";

export interface StepperConfig {
  // Variant selection
  variant: StepperVariant;

  // Step labels (up to 4 steps)
  step1Label: string;
  step2Label: string;
  step3Label: string;
  step4Label: string;

  // Current active step (1-based)
  activeStep: number;

  // Total steps shown
  totalSteps: number;

  // Colors — multi-stop gradient across steps
  color1: string; // step 1 / filled color
  color2: string; // step 2
  color3: string; // step 3 / active
  color4: string; // step 4

  // Inactive / background
  inactiveColor: string;
  inactiveTextColor: string;

  // Active step override (used for single-accent variants)
  activeColor: string;
  activeTextColor: string;

  // Completed step color
  completedColor: string;
  completedTextColor: string;

  // Text
  stepTextColor: string; // text on colored segments
  labelColor: string; // labels below stepper

  // Size
  height: number; // px
  fontSize: number; // px
  borderRadius: number; // for pill variants
  connectorHeight: number; // px, for line steppers

  // Options
  showLabels: boolean;
  showNumbers: boolean;
  showCheckmarks: boolean; // for completed steps
  animateDots: boolean;
}

// ─── Dark preset ────────────────────────────────────────────────────────────
export const darkStepperConfig: StepperConfig = {
  variant: "breadcrumb-colorful",
  step1Label: "Cart",
  step2Label: "Shipping",
  step3Label: "Review",
  step4Label: "Payment",
  activeStep: 2,
  totalSteps: 4,
  color1: "#fbbd33",
  color2: "#f58232",
  color3: "#d91e36",
  color4: "#42d3c1",
  inactiveColor: "#242430",
  inactiveTextColor: "#5a5a72",
  activeColor: "#7c6cfc",
  activeTextColor: "#ffffff",
  completedColor: "#42d3c1",
  completedTextColor: "#ffffff",
  stepTextColor: "#ffffff",
  labelColor: "#9090a8",
  height: 40,
  fontSize: 11,
  borderRadius: 99,
  connectorHeight: 2,
  showLabels: true,
  showNumbers: true,
  showCheckmarks: true,
  animateDots: true,
};

// ─── Light preset ────────────────────────────────────────────────────────────
export const lightStepperConfig: StepperConfig = {
  variant: "breadcrumb-colorful",
  step1Label: "Cart",
  step2Label: "Shipping",
  step3Label: "Review",
  step4Label: "Payment",
  activeStep: 2,
  totalSteps: 4,
  color1: "#fbbd33",
  color2: "#f58232",
  color3: "#d91e36",
  color4: "#42d3c1",
  inactiveColor: "#e5e7eb",
  inactiveTextColor: "#9ca3af",
  activeColor: "#6c5ce7",
  activeTextColor: "#ffffff",
  completedColor: "#42d3c1",
  completedTextColor: "#ffffff",
  stepTextColor: "#ffffff",
  labelColor: "#6b7280",
  height: 40,
  fontSize: 11,
  borderRadius: 99,
  connectorHeight: 2,
  showLabels: true,
  showNumbers: true,
  showCheckmarks: true,
  animateDots: true,
};

export const stepperModePresets: Record<StepperMode, StepperConfig> = {
  dark: darkStepperConfig,
  light: lightStepperConfig,
};

export const defaultStepperConfig = darkStepperConfig;

export const VARIANT_LABELS: Record<StepperVariant, string> = {
  "segmented-pill": "Segmented Pill",
  "breadcrumb-gray": "Breadcrumb Gray",
  "breadcrumb-colorful": "Breadcrumb Colorful",
  "numbered-line": "Numbered Line",
  "checkmark-horizontal": "Checkmark Horizontal",
  "chevron-loading": "Chevron Loading",
  "dot-loading": "Dot Loading",
  "sharp-chevron": "Sharp Chevron",
  "dashed-confirmation": "Dashed Confirmation",
};
