// /lib/toastConfig.ts

export type ToastMode = "dark" | "light";

export type ToastVariant =
  | "success"
  | "loading"
  | "countdown"
  | "multistep"
  | "progress"
  | "action"
  | "gradient"
  | "promise"
  | "error"
  | "streaming";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface ToastConfig {
  // Variant
  variant: ToastVariant;

  // Position (affects generated code only)
  position: ToastPosition;

  // Content (editable for static variants)
  title: string;
  message: string;
  actionLabel: string; // used by "action" variant

  // Appearance
  iconColor: string;
  accentColor: string; // border, glow, progress bar
  backgroundColor: string;
  borderColor: string;
  titleColor: string;
  messageColor: string;
  borderRadius: number;

  // Behavior
  showProgressBar: boolean;
  autoDismissDuration: number; // ms — shown in generated code, not used in preview
  showCloseButton: boolean;
}

// ─── Variant metadata ──────────────────────────────────────────────
export const VARIANT_META: Record<
  ToastVariant,
  {
    label: string;
    contentEditable: boolean;
    defaultTitle: string;
    defaultMessage: string;
  }
> = {
  success: {
    label: "Success",
    contentEditable: true,
    defaultTitle: "Model Deployed",
    defaultMessage: "GPT-4o is now live in production.",
  },
  loading: {
    label: "Loading",
    contentEditable: true,
    defaultTitle: "Generating Response",
    defaultMessage: "Claude is thinking...",
  },
  countdown: {
    label: "Countdown",
    contentEditable: false,
    defaultTitle: "Rate Limited",
    defaultMessage: "Retry in 5s...",
  },
  multistep: {
    label: "Multi-step",
    contentEditable: false,
    defaultTitle: "AI Pipeline",
    defaultMessage: "",
  },
  progress: {
    label: "Progress",
    contentEditable: true,
    defaultTitle: "Fine-tuning Model",
    defaultMessage: "Training in progress...",
  },
  action: {
    label: "Action",
    contentEditable: true,
    defaultTitle: "Dataset Deleted",
    defaultMessage: "3 files permanently removed.",
  },
  gradient: {
    label: "Gradient",
    contentEditable: true,
    defaultTitle: "Neural Sync Active",
    defaultMessage: "Weights streaming across 8 nodes...",
  },
  promise: {
    label: "Promise",
    contentEditable: false,
    defaultTitle: "Safety Scan Running",
    defaultMessage: "Checking for hallucinations...",
  },
  error: {
    label: "Error",
    contentEditable: true,
    defaultTitle: "Token Limit Exceeded",
    defaultMessage: "Context window full. Reduce prompt size.",
  },
  streaming: {
    label: "Streaming",
    contentEditable: false,
    defaultTitle: "AI Generating",
    defaultMessage: "",
  },
};

// ─── Dark preset ───────────────────────────────────────────────────
export const darkToastConfig: ToastConfig = {
  variant: "success",
  position: "top-right",

  title: VARIANT_META.success.defaultTitle,
  message: VARIANT_META.success.defaultMessage,
  actionLabel: "Undo",

  iconColor: "#4ade80",
  accentColor: "#7c6cfc",
  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  titleColor: "#f0f0f5",
  messageColor: "#9090a8",
  borderRadius: 12,

  showProgressBar: true,
  autoDismissDuration: 4000,
  showCloseButton: true,
};

// ─── Light preset ──────────────────────────────────────────────────
export const lightToastConfig: ToastConfig = {
  variant: "success",
  position: "top-right",

  title: VARIANT_META.success.defaultTitle,
  message: VARIANT_META.success.defaultMessage,
  actionLabel: "Undo",

  iconColor: "#10b981",
  accentColor: "#6c5ce7",
  backgroundColor: "#ffffff",
  borderColor: "#e2e0f0",
  titleColor: "#1a1a2e",
  messageColor: "#7e7e9a",
  borderRadius: 12,

  showProgressBar: true,
  autoDismissDuration: 4000,
  showCloseButton: true,
};

export const toastModePresets: Record<ToastMode, ToastConfig> = {
  dark: darkToastConfig,
  light: lightToastConfig,
};

export const defaultToastConfig = darkToastConfig;
