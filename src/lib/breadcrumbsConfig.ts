export type BreadcrumbMode = "dark" | "light";
export type BreadcrumbVariant =
  | "default"
  | "pill"
  | "arrow"
  | "underline"
  | "mono";

export interface BreadcrumbConfig {
  // Variant
  variant: BreadcrumbVariant;

  // Colors
  backgroundColor: string; // container bg (arrow/pill variants)
  itemBackground: string; // individual item bg (pill/arrow)
  itemHoverBackground: string;
  activeBackground: string; // active/current item bg

  textColor: string; // inactive crumb text
  textHoverColor: string;
  activeTextColor: string; // current page text
  separatorColor: string;

  borderColor: string;
  activeBorderColor: string;

  accentColor: string; // underline accent / pill active color

  // Typography
  fontSize: number; // 11–18px
  fontWeight: number; // 400 / 500 / 600 / 700

  // Shape
  borderRadius: number; // for pill/arrow items
  itemPaddingX: number; // horizontal padding per item
  itemPaddingY: number; // vertical padding per item
  gap: number; // gap between items + separators

  // Options
  showHomeIcon: boolean;
  showShadow: boolean;
  animate: boolean;
}

// ─── Dark preset ────────────────────────────────────────────────────
export const darkBreadcrumbConfig: BreadcrumbConfig = {
  variant: "default",

  backgroundColor: "#1c1c22",
  itemBackground: "#242430",
  itemHoverBackground: "#2e2e3e",
  activeBackground: "#7c6cfc22",

  textColor: "#9090a8",
  textHoverColor: "#f0f0f5",
  activeTextColor: "#f0f0f5",
  separatorColor: "#3a3a50",

  borderColor: "#2a2a38",
  activeBorderColor: "#7c6cfc",

  accentColor: "#7c6cfc",

  fontSize: 13,
  fontWeight: 500,

  borderRadius: 8,
  itemPaddingX: 12,
  itemPaddingY: 6,
  gap: 4,

  showHomeIcon: true,
  showShadow: false,
  animate: true,
};

// ─── Light preset ────────────────────────────────────────────────────
export const lightBreadcrumbConfig: BreadcrumbConfig = {
  variant: "default",

  backgroundColor: "#f4f4f8",
  itemBackground: "#ffffff",
  itemHoverBackground: "#ededf5",
  activeBackground: "#6c5ce715",

  textColor: "#9090a8",
  textHoverColor: "#1a1a2e",
  activeTextColor: "#1a1a2e",
  separatorColor: "#c8c8d8",

  borderColor: "#d4d4e0",
  activeBorderColor: "#6c5ce7",

  accentColor: "#6c5ce7",

  fontSize: 13,
  fontWeight: 500,

  borderRadius: 8,
  itemPaddingX: 12,
  itemPaddingY: 6,
  gap: 4,

  showHomeIcon: true,
  showShadow: false,
  animate: true,
};

export const breadcrumbModePresets: Record<BreadcrumbMode, BreadcrumbConfig> = {
  dark: darkBreadcrumbConfig,
  light: lightBreadcrumbConfig,
};

export const defaultBreadcrumbConfig = darkBreadcrumbConfig;
