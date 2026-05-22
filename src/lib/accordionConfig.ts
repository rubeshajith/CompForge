// lib/accordionConfig.ts

export type AccordionMode = "dark" | "light";
export type AccordionVariant =
  | "animated-height"
  | "nested"
  | "bordered-cards"
  | "icon-reveal";

export interface AccordionConfig {
  // Variant
  variant: AccordionVariant;

  // Layout
  accordionWidth: number;
  itemBorderRadius: number;
  itemGap: number;
  contentPadding: number;

  // Container
  backgroundColor: string;
  borderColor: string;
  separatorColor: string;

  // Header
  headerBackground: string;
  headerHoverBackground: string;
  headerTextColor: string;
  headerFontSize: number;
  headerFontWeight: number;
  headerPaddingY: number;
  headerPaddingX: number;

  // Content
  contentBackground: string;
  contentTextColor: string;
  contentFontSize: number;

  // Accent / Icon
  accentColor: string;
  iconColor: string;
  iconSize: number;

  // Behavior
  allowMultiple: boolean;
  animationDuration: number; // ms

  // Nested-specific (only used in nested variant)
  nestedHeaderBackground: string;
  nestedHeaderTextColor: string;
  nestedAccentColor: string;

  // Shadow
  showShadow: boolean;
  shadowColor: string;
}

export const darkAccordionConfig: AccordionConfig = {
  variant: "animated-height",

  accordionWidth: 520,
  itemBorderRadius: 10,
  itemGap: 6,
  contentPadding: 16,

  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  separatorColor: "#2a2a38",

  headerBackground: "#1c1c22",
  headerHoverBackground: "#242430",
  headerTextColor: "#f0f0f5",
  headerFontSize: 14,
  headerFontWeight: 500,
  headerPaddingY: 16,
  headerPaddingX: 18,

  contentBackground: "#141418",
  contentTextColor: "#9090a8",
  contentFontSize: 13,

  accentColor: "#7c6cfc",
  iconColor: "#9090a8",
  iconSize: 16,

  allowMultiple: false,
  animationDuration: 280,

  nestedHeaderBackground: "#242430",
  nestedHeaderTextColor: "#c0c0d8",
  nestedAccentColor: "#9d91fd",

  showShadow: true,
  shadowColor: "rgba(0,0,0,0.4)",
};

export const lightAccordionConfig: AccordionConfig = {
  variant: "animated-height",

  accordionWidth: 520,
  itemBorderRadius: 10,
  itemGap: 6,
  contentPadding: 16,

  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  separatorColor: "#e8e8f0",

  headerBackground: "#ffffff",
  headerHoverBackground: "#f4f4f8",
  headerTextColor: "#1a1a2e",
  headerFontSize: 14,
  headerFontWeight: 500,
  headerPaddingY: 16,
  headerPaddingX: 18,

  contentBackground: "#fafafc",
  contentTextColor: "#6060780",
  contentFontSize: 13,

  accentColor: "#6c5ce7",
  iconColor: "#9090a8",
  iconSize: 16,

  allowMultiple: false,
  animationDuration: 280,

  nestedHeaderBackground: "#f4f4f8",
  nestedHeaderTextColor: "#4a4a6a",
  nestedAccentColor: "#6c5ce7",

  showShadow: true,
  shadowColor: "rgba(0,0,0,0.08)",
};

export const accordionModePresets: Record<AccordionMode, AccordionConfig> = {
  dark: darkAccordionConfig,
  light: lightAccordionConfig,
};

export const defaultAccordionConfig = darkAccordionConfig;

export const ACCORDION_VARIANT_LABELS: Record<AccordionVariant, string> = {
  "animated-height": "Animated Height",
  nested: "Nested",
  "bordered-cards": "Bordered Cards",
  "icon-reveal": "Icon Reveal",
};
