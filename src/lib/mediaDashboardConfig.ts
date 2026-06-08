export type MediaDashboardMode = "dark" | "light";
export type MediaDashboardDensity = "comfortable" | "compact";
export type MediaDashboardRange = "realtime" | "day" | "week";

export interface MediaDashboardConfig {
  density: MediaDashboardDensity;
  selectedRange: MediaDashboardRange;
  showSidebar: boolean;
  showTopBar: boolean;
  showGlow: boolean;
  animateCards: boolean;
  dashboardWidth: number;
  cardRadius: number;
  cardPadding: number;
  fontSize: number;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  cardHoverColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  accentTextColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  dangerColor: string;
  sidebarColor: string;
  chartGridColor: string;
}

export const darkMediaDashboardConfig: MediaDashboardConfig = {
  density: "comfortable",
  selectedRange: "realtime",
  showSidebar: true,
  showTopBar: true,
  showGlow: true,
  animateCards: true,
  dashboardWidth: 1180,
  cardRadius: 12,
  cardPadding: 24,
  fontSize: 14,
  backgroundColor: "#0c0c0f",
  surfaceColor: "#141418",
  cardColor: "#1c1c22",
  cardHoverColor: "#242430",
  borderColor: "#2a2a38",
  textColor: "#f0f0f5",
  mutedTextColor: "#9090a8",
  accentColor: "#adc6ff",
  accentTextColor: "#00285c",
  secondaryColor: "#4ade80",
  tertiaryColor: "#ddb7ff",
  dangerColor: "#f87171",
  sidebarColor: "#141418",
  chartGridColor: "#353545",
};

export const lightMediaDashboardConfig: MediaDashboardConfig = {
  density: "comfortable",
  selectedRange: "realtime",
  showSidebar: true,
  showTopBar: true,
  showGlow: true,
  animateCards: true,
  dashboardWidth: 1180,
  cardRadius: 12,
  cardPadding: 24,
  fontSize: 14,
  backgroundColor: "#f4f4f8",
  surfaceColor: "#ffffff",
  cardColor: "#ffffff",
  cardHoverColor: "#f8f8fc",
  borderColor: "#d4d4e0",
  textColor: "#1a1a2e",
  mutedTextColor: "#68687d",
  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",
  secondaryColor: "#16a34a",
  tertiaryColor: "#9d4edd",
  dangerColor: "#dc2626",
  sidebarColor: "#ffffff",
  chartGridColor: "#d4d4e0",
};

export const mediaDashboardModePresets: Record<MediaDashboardMode, MediaDashboardConfig> = {
  dark: darkMediaDashboardConfig,
  light: lightMediaDashboardConfig,
};

export const defaultMediaDashboardConfig = darkMediaDashboardConfig;
