// /lib/indiaMapConfig.ts

export type IndiaMapMode = "dark" | "light";
export type MapMetric = "gdp" | "population" | "literacy" | "healthIndex";
export type ChartType = "scatter" | "bar" | "bubble";

export interface IndiaMapConfig {
  // Map Colors
  mapBackground: string;
  stateDefaultFill: string;
  stateBorderColor: string;
  stateBorderWidth: number;
  stateHoverFill: string;
  stateSelectedFill: string;
  oceanColor: string;

  // Choropleth
  choroplethLow: string;
  choroplethHigh: string;
  showChoropleth: boolean;
  activeMetric: MapMetric;

  // Typography
  stateLabelColor: string;
  stateLabelSize: number;
  showStateLabels: boolean;

  // Chart (drill-down panel)
  chartType: ChartType;
  chartBackground: string;
  chartBorderColor: string;
  chartBorderRadius: number;
  chartAccentColor: string;
  chartSecondaryColor: string;
  chartGridColor: string;
  chartTextColor: string;
  chartDotSize: number;

  // Tooltip
  tooltipBackground: string;
  tooltipTextColor: string;
  tooltipBorderColor: string;
  tooltipBorderRadius: number;

  // Layout / Behavior
  showShadow: boolean;
  animateTransition: boolean;
  mapWidth: number;
  mapHeight: number;
}

// ─── Dark Preset ────────────────────────────────────────────────────────────
export const darkIndiaMapConfig: IndiaMapConfig = {
  mapBackground: "#0c0c0f",
  stateDefaultFill: "#1c1c22",
  stateBorderColor: "#2a2a38",
  stateBorderWidth: 1,
  stateHoverFill: "#242430",
  stateSelectedFill: "#7c6cfc",
  oceanColor: "#0c0c0f",

  choroplethLow: "#1c1c22",
  choroplethHigh: "#7c6cfc",
  showChoropleth: true,
  activeMetric: "gdp",

  stateLabelColor: "#5a5a72",
  stateLabelSize: 8,
  showStateLabels: true,

  chartType: "scatter",
  chartBackground: "#141418",
  chartBorderColor: "#2a2a38",
  chartBorderRadius: 12,
  chartAccentColor: "#7c6cfc",
  chartSecondaryColor: "#4ade80",
  chartGridColor: "#1c1c22",
  chartTextColor: "#9090a8",
  chartDotSize: 7,

  tooltipBackground: "#1c1c22",
  tooltipTextColor: "#f0f0f5",
  tooltipBorderColor: "#2a2a38",
  tooltipBorderRadius: 8,

  showShadow: true,
  animateTransition: true,
  mapWidth: 480,
  mapHeight: 560,
};

// ─── Light Preset ───────────────────────────────────────────────────────────
export const lightIndiaMapConfig: IndiaMapConfig = {
  mapBackground: "#f4f4f8",
  stateDefaultFill: "#e8e8f0",
  stateBorderColor: "#c4c4d4",
  stateBorderWidth: 1,
  stateHoverFill: "#d8d8e8",
  stateSelectedFill: "#6c5ce7",
  oceanColor: "#f4f4f8",

  choroplethLow: "#e8e8f0",
  choroplethHigh: "#6c5ce7",
  showChoropleth: true,
  activeMetric: "gdp",

  stateLabelColor: "#9090a8",
  stateLabelSize: 8,
  showStateLabels: true,

  chartType: "scatter",
  chartBackground: "#ffffff",
  chartBorderColor: "#d4d4e0",
  chartBorderRadius: 12,
  chartAccentColor: "#6c5ce7",
  chartSecondaryColor: "#10b981",
  chartGridColor: "#f4f4f8",
  chartTextColor: "#6060788",
  chartDotSize: 7,

  tooltipBackground: "#ffffff",
  tooltipTextColor: "#1a1a2e",
  tooltipBorderColor: "#d4d4e0",
  tooltipBorderRadius: 8,

  showShadow: true,
  animateTransition: true,
  mapWidth: 480,
  mapHeight: 560,
};

export const indiaMapModePresets: Record<IndiaMapMode, IndiaMapConfig> = {
  dark: darkIndiaMapConfig,
  light: lightIndiaMapConfig,
};

export const defaultIndiaMapConfig = darkIndiaMapConfig;
