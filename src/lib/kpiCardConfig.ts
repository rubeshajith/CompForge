// /lib/kpiCardConfig.ts

export type KpiCardMode = "dark" | "light";
export type KpiChartVariant = "sparkline" | "bar" | "donut" | "progress" | "area";

export interface KpiCardConfig {
  // Card variant
  chartVariant: KpiChartVariant;

  // Container
  cardBackground: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardWidth: number;
  showShadow: boolean;
  glowEffect: boolean;

  // Typography
  labelColor: string;
  valueColor: string;
  subTextColor: string;
  badgeColor: string;
  badgeTextColor: string;
  fontSize: number;

  // Chart colors
  accentColor: string;
  accentColorDim: string;
  chartTrackColor: string;

  // Data (behavioral — preserved on mode switch)
  label: string;
  value: string;
  percentChange: number;
  changeDirection: "up" | "down";
  subText: string;
  showBadge: boolean;
  animateChart: boolean;
}

export const darkKpiCardConfig: KpiCardConfig = {
  chartVariant: "sparkline",

  cardBackground: "#1c1c22",
  cardBorderColor: "#2a2a38",
  cardBorderRadius: 16,
  cardWidth: 320,
  showShadow: true,
  glowEffect: true,

  labelColor: "#9090a8",
  valueColor: "#f0f0f5",
  subTextColor: "#5a5a72",
  badgeColor: "#7c6cfc22",
  badgeTextColor: "#9d91fd",
  fontSize: 13,

  accentColor: "#7c6cfc",
  accentColorDim: "#7c6cfc33",
  chartTrackColor: "#242430",

  label: "Total Revenue",
  value: "$98,450",
  percentChange: 12.5,
  changeDirection: "up",
  subText: "from last month",
  showBadge: true,
  animateChart: true,
};

export const lightKpiCardConfig: KpiCardConfig = {
  chartVariant: "sparkline",

  cardBackground: "#ffffff",
  cardBorderColor: "#e0e0ec",
  cardBorderRadius: 16,
  cardWidth: 320,
  showShadow: true,
  glowEffect: false,

  labelColor: "#9090a8",
  valueColor: "#1a1a2e",
  subTextColor: "#a0a0b8",
  badgeColor: "#6c5ce711",
  badgeTextColor: "#6c5ce7",
  fontSize: 13,

  accentColor: "#6c5ce7",
  accentColorDim: "#6c5ce722",
  chartTrackColor: "#f0f0f8",

  label: "Total Revenue",
  value: "$98,450",
  percentChange: 12.5,
  changeDirection: "up",
  subText: "from last month",
  showBadge: true,
  animateChart: true,
};

export const kpiCardModePresets: Record<KpiCardMode, KpiCardConfig> = {
  dark: darkKpiCardConfig,
  light: lightKpiCardConfig,
};

export const defaultKpiCardConfig = darkKpiCardConfig;
