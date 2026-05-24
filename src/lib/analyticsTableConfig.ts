// /lib/analyticsTableConfig.ts

export type AnalyticsTableMode = "dark" | "light";

export interface AnalyticsTableConfig {
  // Container
  tableBackground: string;
  tableBorderColor: string;
  tableBorderRadius: number;
  showShadow: boolean;

  // Header
  headerBackground: string;
  headerTextColor: string;
  headerBorderColor: string;

  // Rows
  rowBackground: string;
  rowHoverBackground: string;
  rowBorderColor: string;
  rowTextColor: string;
  rowSubtextColor: string;
  rowSelectedBackground: string;

  // Avatar
  avatarRadius: number;

  // Status badges
  activeBackground: string;
  activeTextColor: string;
  activeBorderColor: string;
  pendingBackground: string;
  pendingTextColor: string;
  pendingBorderColor: string;
  atRiskBackground: string;
  atRiskTextColor: string;
  atRiskBorderColor: string;

  // Churn risk bar
  riskBarTrackColor: string;
  riskLowColor: string;
  riskMedColor: string;
  riskHighColor: string;

  // Sparkline (mini bar chart in row)
  sparklineColorHealthy: string;
  sparklineColorDeclining: string;
  sparklineColorAtRisk: string;

  // Expanded panel
  expandedBackground: string;
  expandedBorderAccentColor: string;
  expandedChartBackground: string;
  expandedChartBarColor: string;
  expandedChartBarHighlight: string;
  expandedMetaBackground: string;
  expandedMetaBorderColor: string;
  expandedMetaLabelColor: string;
  expandedMetaValueColor: string;

  // CTA button inside expanded
  ctaBackground: string;
  ctaTextColor: string;

  // Accent
  accentColor: string;
  accentTextColor: string;

  // Pagination
  paginationBackground: string;
  paginationActiveBackground: string;
  paginationActiveTextColor: string;
  paginationTextColor: string;
  paginationBorderColor: string;

  // Typography & shape
  fontSize: number;
  borderRadius: number;

  // Behavior
  showCheckboxes: boolean;
  showSparklines: boolean;
  showChurnBar: boolean;
  showPagination: boolean;
  animateExpand: boolean;
  showSyncFooter: boolean;
  rowsPerPage: number;
}

export const darkAnalyticsTableConfig: AnalyticsTableConfig = {
  tableBackground: "#1c1c22",
  tableBorderColor: "#2a2a38",
  tableBorderRadius: 12,
  showShadow: true,

  headerBackground: "#141418",
  headerTextColor: "#5a5a72",
  headerBorderColor: "#2a2a38",

  rowBackground: "#1c1c22",
  rowHoverBackground: "#242430",
  rowBorderColor: "#2a2a38",
  rowTextColor: "#f0f0f5",
  rowSubtextColor: "#5a5a72",
  rowSelectedBackground: "#7c6cfc14",

  avatarRadius: 50,

  activeBackground: "#0d2618",
  activeTextColor: "#4ade80",
  activeBorderColor: "#1a4a2e",
  pendingBackground: "#2a1f08",
  pendingTextColor: "#facc15",
  pendingBorderColor: "#4a3510",
  atRiskBackground: "#2a1010",
  atRiskTextColor: "#f87171",
  atRiskBorderColor: "#4a2020",

  riskBarTrackColor: "#2a2a38",
  riskLowColor: "#4ade80",
  riskMedColor: "#facc15",
  riskHighColor: "#f87171",

  sparklineColorHealthy: "#7c6cfc",
  sparklineColorDeclining: "#facc15",
  sparklineColorAtRisk: "#f87171",

  expandedBackground: "#141418",
  expandedBorderAccentColor: "#7c6cfc",
  expandedChartBackground: "#1c1c22",
  expandedChartBarColor: "#7c6cfc44",
  expandedChartBarHighlight: "#7c6cfc",
  expandedMetaBackground: "#1c1c22",
  expandedMetaBorderColor: "#2a2a38",
  expandedMetaLabelColor: "#5a5a72",
  expandedMetaValueColor: "#f0f0f5",

  ctaBackground: "#7c6cfc",
  ctaTextColor: "#ffffff",

  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",

  paginationBackground: "#141418",
  paginationActiveBackground: "#7c6cfc",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#9090a8",
  paginationBorderColor: "#2a2a38",

  fontSize: 13,
  borderRadius: 8,

  showCheckboxes: true,
  showSparklines: true,
  showChurnBar: true,
  showPagination: true,
  animateExpand: true,
  showSyncFooter: true,
  rowsPerPage: 5,
};

export const lightAnalyticsTableConfig: AnalyticsTableConfig = {
  tableBackground: "#ffffff",
  tableBorderColor: "#d4d4e0",
  tableBorderRadius: 12,
  showShadow: true,

  headerBackground: "#f4f4f8",
  headerTextColor: "#9090a8",
  headerBorderColor: "#d4d4e0",

  rowBackground: "#ffffff",
  rowHoverBackground: "#f9f9fc",
  rowBorderColor: "#ebebf2",
  rowTextColor: "#1a1a2e",
  rowSubtextColor: "#9090a8",
  rowSelectedBackground: "#6c5ce714",

  avatarRadius: 50,

  activeBackground: "#f0fdf4",
  activeTextColor: "#16a34a",
  activeBorderColor: "#bbf7d0",
  pendingBackground: "#fefce8",
  pendingTextColor: "#ca8a04",
  pendingBorderColor: "#fde68a",
  atRiskBackground: "#fef2f2",
  atRiskTextColor: "#dc2626",
  atRiskBorderColor: "#fecaca",

  riskBarTrackColor: "#e5e5f0",
  riskLowColor: "#16a34a",
  riskMedColor: "#ca8a04",
  riskHighColor: "#dc2626",

  sparklineColorHealthy: "#6c5ce7",
  sparklineColorDeclining: "#ca8a04",
  sparklineColorAtRisk: "#dc2626",

  expandedBackground: "#f4f4f8",
  expandedBorderAccentColor: "#6c5ce7",
  expandedChartBackground: "#ffffff",
  expandedChartBarColor: "#6c5ce733",
  expandedChartBarHighlight: "#6c5ce7",
  expandedMetaBackground: "#ffffff",
  expandedMetaBorderColor: "#d4d4e0",
  expandedMetaLabelColor: "#9090a8",
  expandedMetaValueColor: "#1a1a2e",

  ctaBackground: "#6c5ce7",
  ctaTextColor: "#ffffff",

  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",

  paginationBackground: "#f4f4f8",
  paginationActiveBackground: "#6c5ce7",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#5a5a72",
  paginationBorderColor: "#d4d4e0",

  fontSize: 13,
  borderRadius: 8,

  showCheckboxes: true,
  showSparklines: true,
  showChurnBar: true,
  showPagination: true,
  animateExpand: true,
  showSyncFooter: true,
  rowsPerPage: 5,
};

export const analyticsTableModePresets: Record<
  AnalyticsTableMode,
  AnalyticsTableConfig
> = {
  dark: darkAnalyticsTableConfig,
  light: lightAnalyticsTableConfig,
};

export const defaultAnalyticsTableConfig = darkAnalyticsTableConfig;
