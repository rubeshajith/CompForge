// ─── buttonConfig.ts ────────────────────────────────────────────────────────

export type ButtonMode = "dark" | "light";
export type ButtonVariant = "solid" | "outline" | "ghost" | "soft" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";
export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonConfig {
  // Variant & Size
  variant: ButtonVariant;
  size: ButtonSize;
  radius: ButtonRadius;

  // Group
  groupEnabled: boolean;
  groupOrientation: ButtonGroupOrientation;
  groupItemCount: number; // 2–5

  // Colors — Solid
  solidBg: string;
  solidText: string;
  solidHoverBg: string;
  solidBorder: string;

  // Colors — Outline
  outlineBorder: string;
  outlineText: string;
  outlineHoverBg: string;

  // Colors — Ghost
  ghostText: string;
  ghostHoverBg: string;

  // Colors — Soft
  softBg: string;
  softText: string;
  softHoverBg: string;

  // Colors — Link
  linkText: string;
  linkHoverText: string;

  // States
  loading: boolean;
  disabled: boolean;
  iconLeft: boolean;
  iconRight: boolean;

  // Typography
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;

  // Animation
  animateHover: boolean;
  showRipple: boolean;
}

// ─── Dark preset ─────────────────────────────────────────────────────────────
export const darkButtonConfig: ButtonConfig = {
  variant: "solid",
  size: "md",
  radius: "md",

  groupEnabled: false,
  groupOrientation: "horizontal",
  groupItemCount: 3,

  solidBg: "#7c6cfc",
  solidText: "#ffffff",
  solidHoverBg: "#6a59f0",
  solidBorder: "#7c6cfc",

  outlineBorder: "#2a2a38",
  outlineText: "#f0f0f5",
  outlineHoverBg: "#242430",

  ghostText: "#9090a8",
  ghostHoverBg: "#1c1c22",

  softBg: "#7c6cfc22",
  softText: "#9d91fd",
  softHoverBg: "#7c6cfc33",

  linkText: "#7c6cfc",
  linkHoverText: "#9d91fd",

  loading: false,
  disabled: false,
  iconLeft: false,
  iconRight: false,

  fontFamily: "'Instrument Sans', sans-serif",
  fontWeight: 500,
  letterSpacing: 0,

  animateHover: true,
  showRipple: true,
};

// ─── Light preset ─────────────────────────────────────────────────────────────
export const lightButtonConfig: ButtonConfig = {
  variant: "solid",
  size: "md",
  radius: "md",

  groupEnabled: false,
  groupOrientation: "horizontal",
  groupItemCount: 3,

  solidBg: "#6c5ce7",
  solidText: "#ffffff",
  solidHoverBg: "#5a4bd1",
  solidBorder: "#6c5ce7",

  outlineBorder: "#d4d4e0",
  outlineText: "#1a1a2e",
  outlineHoverBg: "#f4f4f8",

  ghostText: "#6060a0",
  ghostHoverBg: "#f4f4f8",

  softBg: "#6c5ce71a",
  softText: "#6c5ce7",
  softHoverBg: "#6c5ce730",

  linkText: "#6c5ce7",
  linkHoverText: "#5a4bd1",

  loading: false,
  disabled: false,
  iconLeft: false,
  iconRight: false,

  fontFamily: "'Instrument Sans', sans-serif",
  fontWeight: 500,
  letterSpacing: 0,

  animateHover: true,
  showRipple: true,
};

export const buttonModePresets: Record<ButtonMode, ButtonConfig> = {
  dark: darkButtonConfig,
  light: lightButtonConfig,
};

export const defaultButtonConfig = darkButtonConfig;
