// ─────────────────────────────────────────────────────────────────────────────
// emailTemplateConfig.ts
// Config interface + dark/light presets for the Email Template component
// ─────────────────────────────────────────────────────────────────────────────

export type EmailTemplateMode = "dark" | "light";

export type EmailTemplateVariant =
  | "orderSummary"
  | "reviewRequest"
  | "orderShipped"
  | "welcomeOnboard"
  | "flashSale"
  | "refundProcessed";

// ── Config Interface ──────────────────────────────────────────────────────────

export interface EmailTemplateConfig {
  // Variant
  variant: EmailTemplateVariant;

  // Outer wrapper / email background
  emailBackground: string;

  // Card / container
  cardBackground: string;
  cardBorderColor: string;
  cardBorderRadius: number;

  // Header bar
  headerBackground: string;
  headerTextColor: string;
  logoTextColor: string;

  // Body typography
  bodyTextColor: string;
  mutedTextColor: string;
  headingTextColor: string;

  // Accent (buttons, highlights, links)
  accentColor: string;
  accentTextColor: string;

  // Divider / separator
  dividerColor: string;

  // Table / product row
  tableRowBackground: string;
  tableAltRowBackground: string;

  // Footer
  footerBackground: string;
  footerTextColor: string;

  // Star rating (review template)
  starFilledColor: string;
  starEmptyColor: string;

  // Tracking badge (shipped template)
  trackingBadgeBackground: string;
  trackingBadgeTextColor: string;

  // Welcome onboard — feature highlight pill
  featurePillBackground: string;
  featurePillTextColor: string;

  // Flash sale — sale badge + coupon block
  saleBadgeBackground: string;
  saleBadgeTextColor: string;
  couponBlockBackground: string;
  couponBorderColor: string;
  couponTextColor: string;

  // Refund — status chip
  refundStatusBackground: string;
  refundStatusTextColor: string;

  // Font family (email-safe stack)
  fontFamily: string;

  // Card width
  cardWidth: number;

  // Show shadow under card
  showShadow: boolean;
}

// ── Dark Preset ───────────────────────────────────────────────────────────────

export const darkEmailTemplateConfig: EmailTemplateConfig = {
  variant: "orderSummary",

  emailBackground: "#0c0c0f",

  cardBackground: "#141418",
  cardBorderColor: "#2a2a38",
  cardBorderRadius: 12,

  headerBackground: "#1c1c22",
  headerTextColor: "#f0f0f5",
  logoTextColor: "#7c6cfc",

  bodyTextColor: "#c0c0d8",
  mutedTextColor: "#5a5a72",
  headingTextColor: "#f0f0f5",

  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",

  dividerColor: "#2a2a38",

  tableRowBackground: "#1c1c22",
  tableAltRowBackground: "#141418",

  footerBackground: "#0c0c0f",
  footerTextColor: "#5a5a72",

  starFilledColor: "#facc15",
  starEmptyColor: "#2a2a38",

  trackingBadgeBackground: "#7c6cfc22",
  trackingBadgeTextColor: "#9d91fd",

  featurePillBackground: "#7c6cfc18",
  featurePillTextColor: "#9d91fd",

  saleBadgeBackground: "#f8717122",
  saleBadgeTextColor: "#f87171",
  couponBlockBackground: "#7c6cfc12",
  couponBorderColor: "#7c6cfc",
  couponTextColor: "#9d91fd",

  refundStatusBackground: "#4ade8022",
  refundStatusTextColor: "#4ade80",

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

  cardWidth: 600,
  showShadow: true,
};

// ── Light Preset ──────────────────────────────────────────────────────────────

export const lightEmailTemplateConfig: EmailTemplateConfig = {
  variant: "orderSummary",

  emailBackground: "#f4f4f8",

  cardBackground: "#ffffff",
  cardBorderColor: "#d4d4e0",
  cardBorderRadius: 12,

  headerBackground: "#ffffff",
  headerTextColor: "#1a1a2e",
  logoTextColor: "#6c5ce7",

  bodyTextColor: "#3a3a52",
  mutedTextColor: "#9090a8",
  headingTextColor: "#1a1a2e",

  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",

  dividerColor: "#e4e4f0",

  tableRowBackground: "#f9f9fc",
  tableAltRowBackground: "#ffffff",

  footerBackground: "#f4f4f8",
  footerTextColor: "#9090a8",

  starFilledColor: "#f59e0b",
  starEmptyColor: "#d4d4e0",

  trackingBadgeBackground: "#6c5ce71a",
  trackingBadgeTextColor: "#6c5ce7",

  featurePillBackground: "#6c5ce712",
  featurePillTextColor: "#6c5ce7",

  saleBadgeBackground: "#ef444418",
  saleBadgeTextColor: "#dc2626",
  couponBlockBackground: "#6c5ce710",
  couponBorderColor: "#6c5ce7",
  couponTextColor: "#6c5ce7",

  refundStatusBackground: "#16a34a18",
  refundStatusTextColor: "#16a34a",

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

  cardWidth: 600,
  showShadow: true,
};

// ── Presets Map ───────────────────────────────────────────────────────────────

export const emailTemplateModePresets: Record<
  EmailTemplateMode,
  EmailTemplateConfig
> = {
  dark: darkEmailTemplateConfig,
  light: lightEmailTemplateConfig,
};

export const defaultEmailTemplateConfig = darkEmailTemplateConfig;
