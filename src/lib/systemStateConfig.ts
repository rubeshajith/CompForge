// /lib/systemStateConfig.ts

export type SystemStateMode = "dark" | "light";

export type SystemStateVariant =
  | "empty"
  | "error"
  | "serverError"
  | "permission"
  | "noConnection"
  | "firstRun"
  | "noResults"
  | "filteredState"
  | "rateLimited"
  | "sessionExpired"
  | "maintenance"
  | "conflictingEdit";

export const VARIANT_LABELS: Record<SystemStateVariant, string> = {
  empty: "Nothing Here Yet",
  error: "Something Went Wrong",
  serverError: "Server Error",
  permission: "No Access",
  noConnection: "No Connection",
  firstRun: "Welcome Aboard",
  noResults: "No Results",
  filteredState: "Hidden by Filters",
  rateLimited: "Rate Limited",
  sessionExpired: "Session Expired",
  maintenance: "Maintenance Mode",
  conflictingEdit: "Conflicting Edit",
};

export interface SystemStateConfig {
  // Variant
  variant: SystemStateVariant;
  // Card
  cardBackground: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardPadding: number;
  showShadow: boolean;
  // Icon container
  iconContainerSize: number;
  iconSize: number;
  iconContainerRadius: number;
  // Typography
  titleColor: string;
  titleSize: number;
  bodyColor: string;
  bodySize: number;
  labelColor: string;
  // Primary button
  primaryBg: string;
  primaryText: string;
  primaryBorderRadius: number;
  // Secondary button
  secondaryBg: string;
  secondaryBorderColor: string;
  secondaryText: string;
  // Error log box
  logBoxBackground: string;
  logBoxText: string;
  // Animation
  animateIn: boolean;
}

export const darkSystemStateConfig: SystemStateConfig = {
  variant: "empty",
  // Card
  cardBackground: "#1c1c22",
  cardBorderColor: "#2a2a38",
  cardBorderRadius: 20,
  cardPadding: 40,
  showShadow: true,
  // Icon
  iconContainerSize: 72,
  iconSize: 32,
  iconContainerRadius: 16,
  // Typography
  titleColor: "#f0f0f5",
  titleSize: 20,
  bodyColor: "#5a5a72",
  bodySize: 13,
  labelColor: "#3a3a52",
  // Primary button
  primaryBg: "#7c6cfc",
  primaryText: "#ffffff",
  primaryBorderRadius: 10,
  // Secondary button
  secondaryBg: "rgba(255,255,255,0.04)",
  secondaryBorderColor: "#2a2a38",
  secondaryText: "#9090a8",
  // Log box
  logBoxBackground: "#12121a",
  logBoxText: "#5a5a72",
  // Animation
  animateIn: true,
};

export const lightSystemStateConfig: SystemStateConfig = {
  variant: "empty",
  // Card
  cardBackground: "#ffffff",
  cardBorderColor: "#d4d4e0",
  cardBorderRadius: 20,
  cardPadding: 40,
  showShadow: true,
  // Icon
  iconContainerSize: 72,
  iconSize: 32,
  iconContainerRadius: 16,
  // Typography
  titleColor: "#1a1a2e",
  titleSize: 20,
  bodyColor: "#9090a8",
  bodySize: 13,
  labelColor: "#c8c8da",
  // Primary button
  primaryBg: "#6c5ce7",
  primaryText: "#ffffff",
  primaryBorderRadius: 10,
  // Secondary button
  secondaryBg: "#f4f4f8",
  secondaryBorderColor: "#d4d4e0",
  secondaryText: "#6060a0",
  // Log box
  logBoxBackground: "#f4f4f8",
  logBoxText: "#9090a8",
  // Animation
  animateIn: true,
};

export const systemStateModePresets: Record<
  SystemStateMode,
  SystemStateConfig
> = {
  dark: darkSystemStateConfig,
  light: lightSystemStateConfig,
};

export const defaultSystemStateConfig = darkSystemStateConfig;
