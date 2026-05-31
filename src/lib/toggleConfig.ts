// ─── toggleConfig.ts ──────────────────────────────────────────────────────────

export type ToggleMode = "dark" | "light";

// Single toggle appearance styles
export type ToggleVariant = "pill" | "chip" | "switch" | "underline" | "icon-label";

// Group selection behavior
export type ToggleGroupMode = "single" | "multi";

// Group visual style
export type ToggleGroupVariant = "segmented" | "chip-row" | "pill-row" | "icon-tabs";

export interface ToggleConfig {
  // ── Single Toggle ────────────────────────────────
  variant: ToggleVariant;
  toggleValue: boolean; // current state of the single demo

  // ── Group ────────────────────────────────────────
  groupEnabled: boolean;
  groupVariant: ToggleGroupVariant;
  groupMode: ToggleGroupMode;     // single-select or multi-select
  groupItemCount: number;         // 2–5
  showGroupIcons: boolean;

  // ── Colors: Inactive State ────────────────────────
  trackBg: string;          // pill/chip track background
  trackBorder: string;
  inactiveText: string;
  inactiveHoverBg: string;

  // ── Colors: Active State ──────────────────────────
  activeBg: string;
  activeText: string;
  activeBorder: string;
  thumbColor: string;          // switch thumb

  // ── Colors: Group ─────────────────────────────────
  groupBg: string;             // segmented group background
  groupBorder: string;
  groupActiveIndicatorBg: string;
  groupActiveText: string;
  groupInactiveText: string;

  // ── Geometry ──────────────────────────────────────
  size: "sm" | "md" | "lg";
  borderRadius: "sm" | "md" | "lg" | "full";

  // ── Animation ─────────────────────────────────────
  animateToggle: boolean;
  animateIndicator: boolean;   // sliding indicator in group
}

// ─── Dark preset ─────────────────────────────────────────────────────────────
export const darkToggleConfig: ToggleConfig = {
  variant: "pill",
  toggleValue: false,

  groupEnabled: false,
  groupVariant: "segmented",
  groupMode: "single",
  groupItemCount: 3,
  showGroupIcons: true,

  trackBg: "#1c1c22",
  trackBorder: "#2a2a38",
  inactiveText: "#9090a8",
  inactiveHoverBg: "#242430",

  activeBg: "#7c6cfc",
  activeText: "#ffffff",
  activeBorder: "#7c6cfc",
  thumbColor: "#ffffff",

  groupBg: "#1c1c22",
  groupBorder: "#2a2a38",
  groupActiveIndicatorBg: "#2a2a38",
  groupActiveText: "#f0f0f5",
  groupInactiveText: "#5a5a72",

  size: "md",
  borderRadius: "full",

  animateToggle: true,
  animateIndicator: true,
};

// ─── Light preset ─────────────────────────────────────────────────────────────
export const lightToggleConfig: ToggleConfig = {
  variant: "pill",
  toggleValue: false,

  groupEnabled: false,
  groupVariant: "segmented",
  groupMode: "single",
  groupItemCount: 3,
  showGroupIcons: true,

  trackBg: "#ebebf5",
  trackBorder: "#d4d4e0",
  inactiveText: "#6060a0",
  inactiveHoverBg: "#e4e4f0",

  activeBg: "#6c5ce7",
  activeText: "#ffffff",
  activeBorder: "#6c5ce7",
  thumbColor: "#ffffff",

  groupBg: "#ebebf5",
  groupBorder: "#d4d4e0",
  groupActiveIndicatorBg: "#ffffff",
  groupActiveText: "#1a1a2e",
  groupInactiveText: "#9090a8",

  size: "md",
  borderRadius: "full",

  animateToggle: true,
  animateIndicator: true,
};

export const toggleModePresets: Record<ToggleMode, ToggleConfig> = {
  dark: darkToggleConfig,
  light: lightToggleConfig,
};

export const defaultToggleConfig = darkToggleConfig;
