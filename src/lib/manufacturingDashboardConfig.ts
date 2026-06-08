export type ManufacturingDashboardMode = "dark" | "light";
export type ManufacturingDashboardDensity = "comfortable" | "compact";

export interface ManufacturingDashboardConfig {
  density: ManufacturingDashboardDensity;
  showSidebar: boolean;
  showDownloadCard: boolean;
  showProfile: boolean;
  animateCards: boolean;
  dashboardWidth: number;
  shellRadius: number;
  cardRadius: number;
  cardPadding: number;
  fontSize: number;
  backgroundColor: string;
  shellColor: string;
  cardColor: string;
  cardHoverColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  accentTextColor: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  sidebarColor: string;
  chartGridColor: string;
}

export const darkManufacturingDashboardConfig: ManufacturingDashboardConfig = {
  density: "comfortable",
  showSidebar: true,
  showDownloadCard: true,
  showProfile: true,
  animateCards: true,
  dashboardWidth: 1180,
  shellRadius: 36,
  cardRadius: 24,
  cardPadding: 24,
  fontSize: 14,
  backgroundColor: "#0c0c0f",
  shellColor: "#121417",
  cardColor: "#1e2126",
  cardHoverColor: "#252a31",
  borderColor: "#2a2a38",
  textColor: "#f0f0f5",
  mutedTextColor: "#9ca3af",
  accentColor: "#b688f2",
  accentTextColor: "#0c0c0f",
  successColor: "#6ee7b7",
  warningColor: "#facc15",
  dangerColor: "#f87171",
  sidebarColor: "#121417",
  chartGridColor: "#374151",
};

export const lightManufacturingDashboardConfig: ManufacturingDashboardConfig = {
  density: "comfortable",
  showSidebar: true,
  showDownloadCard: true,
  showProfile: true,
  animateCards: true,
  dashboardWidth: 1180,
  shellRadius: 36,
  cardRadius: 24,
  cardPadding: 24,
  fontSize: 14,
  backgroundColor: "#f4f4f8",
  shellColor: "#ffffff",
  cardColor: "#ffffff",
  cardHoverColor: "#f6f4fb",
  borderColor: "#d4d4e0",
  textColor: "#1a1a2e",
  mutedTextColor: "#68687d",
  accentColor: "#7c3aed",
  accentTextColor: "#ffffff",
  successColor: "#059669",
  warningColor: "#ca8a04",
  dangerColor: "#dc2626",
  sidebarColor: "#ffffff",
  chartGridColor: "#d4d4e0",
};

export const manufacturingDashboardModePresets: Record<ManufacturingDashboardMode, ManufacturingDashboardConfig> = {
  dark: darkManufacturingDashboardConfig,
  light: lightManufacturingDashboardConfig,
};

export const defaultManufacturingDashboardConfig = darkManufacturingDashboardConfig;
