export type DashboardMode = "dark" | "light";

export interface DashboardConfig {
  accentColor: string;
}

export const darkDashboardConfig: DashboardConfig = {
  accentColor: "#ff6b00",
};

export const lightDashboardConfig: DashboardConfig = {
  accentColor: "#ff6b00",
};

export const dashboardModePresets: Record<DashboardMode, DashboardConfig> = {
  dark: darkDashboardConfig,
  light: lightDashboardConfig,
};

export const defaultDashboardConfig: DashboardConfig = darkDashboardConfig;

// Preset accent themes available in the control panel
export const accentPresets: { label: string; color: string }[] = [
  { label: "Ember", color: "#ff6b00" }, // default orange
  { label: "CompForge", color: "#7c6cfc" }, // CompForge purple
  { label: "Neon", color: "#00e5ff" },
  { label: "Lime", color: "#a3e635" },
  { label: "Rose", color: "#f43f5e" },
  { label: "Violet", color: "#8b5cf6" },
  { label: "Teal", color: "#14b8a6" },
  { label: "Gold", color: "#f59e0b" },
];
