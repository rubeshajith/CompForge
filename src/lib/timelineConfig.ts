// lib/timelineConfig.ts

export type TimelineMode = "dark" | "light";
export type RiskLevel = "Low" | "Minimal" | "Moderate" | "High" | "Critical";

export interface TimelineMilestone {
  id: string;
  date: string; // e.g. "OCT 14"
  year: string; // e.g. "2024"
  icon: string; // Material Symbols name e.g. "hub"
  title: string;
  subtitle: string;
  volatility: string; // e.g. "0.12%"
  delta: string; // e.g. "+14.2%"
  risk: RiskLevel;
  narrative: string;
  impactItems: { label: string; value: string; barWidth: string }[];
}

export interface TimelineConfig {
  // Container
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  showShadow: boolean;

  // Row / card
  rowBackground: string;
  rowHoverBorderColor: string;
  expandedRowBackground: string;
  headerStripBackground: string;

  // Path connector
  pathConnectorColor: string;
  iconActiveBackground: string;
  iconActiveColor: string;
  iconIdleBackground: string;
  iconIdleBorderColor: string;
  iconIdleColor: string;
  iconBorderRadius: number;

  // Typography — date
  dateActiveColor: string;
  dateIdleColor: string;
  yearColor: string;

  // Typography — row
  titleColor: string;
  subtitleColor: string;

  // KPIs
  volatilityColor: string;
  deltaPositiveColor: string;
  deltaNegativeColor: string;
  deltaNeutralColor: string;

  // Risk badge colors (by level)
  riskLowBackground: string;
  riskLowColor: string;
  riskMinimalBackground: string;
  riskMinimalColor: string;
  riskModerateBackground: string;
  riskModerateColor: string;
  riskHighBackground: string;
  riskHighColor: string;
  riskCriticalBackground: string;
  riskCriticalColor: string;

  // Expanded panel
  sectionLabelColor: string;
  narrativeTextColor: string;
  impactBarTrackColor: string;
  impactBarFillColor: string;
  impactLabelColor: string;
  impactValueColor: string;
  impactCardBackground: string;

  // Divider inside expanded panel
  expandedDividerColor: string;

  // Typography sizes
  fontSize: number;
  titleFontSize: number;

  // Animation
  animateExpand: boolean;
}

// ─── Dark preset ────────────────────────────────────────────────────────────
export const darkTimelineConfig: TimelineConfig = {
  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  borderRadius: 14,
  showShadow: true,

  rowBackground: "#141418",
  rowHoverBorderColor: "#7c6cfc",
  expandedRowBackground: "#1c1c22",
  headerStripBackground: "#18181f",

  pathConnectorColor: "#7c6cfc",
  iconActiveBackground: "#7c6cfc22",
  iconActiveColor: "#9d91fd",
  iconIdleBackground: "#1c1c22",
  iconIdleBorderColor: "#2a2a38",
  iconIdleColor: "#5a5a72",
  iconBorderRadius: 50,

  dateActiveColor: "#9d91fd",
  dateIdleColor: "#9090a8",
  yearColor: "#5a5a72",

  titleColor: "#f0f0f5",
  subtitleColor: "#5a5a72",

  volatilityColor: "#9090a8",
  deltaPositiveColor: "#4ade80",
  deltaNegativeColor: "#f87171",
  deltaNeutralColor: "#9090a8",

  riskLowBackground: "#4ade8022",
  riskLowColor: "#4ade80",
  riskMinimalBackground: "#9090a822",
  riskMinimalColor: "#9090a8",
  riskModerateBackground: "#facc1522",
  riskModerateColor: "#facc15",
  riskHighBackground: "#fb923c22",
  riskHighColor: "#fb923c",
  riskCriticalBackground: "#f8717122",
  riskCriticalColor: "#f87171",

  sectionLabelColor: "#5a5a72",
  narrativeTextColor: "#c0c0d8",
  impactBarTrackColor: "#2a2a38",
  impactBarFillColor: "#7c6cfc",
  impactLabelColor: "#9090a8",
  impactValueColor: "#9d91fd",
  impactCardBackground: "#18181f",
  expandedDividerColor: "#2a2a38",

  fontSize: 13,
  titleFontSize: 15,
  animateExpand: true,
};

// ─── Light preset ────────────────────────────────────────────────────────────
export const lightTimelineConfig: TimelineConfig = {
  backgroundColor: "#ffffff",
  borderColor: "#e0e3e5",
  borderRadius: 14,
  showShadow: true,

  rowBackground: "#f7f9fb",
  rowHoverBorderColor: "#3158ba",
  expandedRowBackground: "#ffffff",
  headerStripBackground: "#f2f4f6",

  pathConnectorColor: "#3158ba",
  iconActiveBackground: "#dbe1ff",
  iconActiveColor: "#1041a3",
  iconIdleBackground: "#ffffff",
  iconIdleBorderColor: "#c4c6d4",
  iconIdleColor: "#747684",
  iconBorderRadius: 50,

  dateActiveColor: "#1041a3",
  dateIdleColor: "#747684",
  yearColor: "#9090a8",

  titleColor: "#191c1e",
  subtitleColor: "#747684",

  volatilityColor: "#747684",
  deltaPositiveColor: "#166534",
  deltaNegativeColor: "#991b1b",
  deltaNeutralColor: "#747684",

  riskLowBackground: "#d1fae5",
  riskLowColor: "#166534",
  riskMinimalBackground: "#f2f4f6",
  riskMinimalColor: "#747684",
  riskModerateBackground: "#fef9c3",
  riskModerateColor: "#854d0e",
  riskHighBackground: "#ffedd5",
  riskHighColor: "#9a3412",
  riskCriticalBackground: "#ffdbce",
  riskCriticalColor: "#370e00",

  sectionLabelColor: "#747684",
  narrativeTextColor: "#191c1e",
  impactBarTrackColor: "#e0e3e5",
  impactBarFillColor: "#3158ba",
  impactLabelColor: "#747684",
  impactValueColor: "#1041a3",
  impactCardBackground: "#f2f4f6",
  expandedDividerColor: "#e0e3e5",

  fontSize: 13,
  titleFontSize: 15,
  animateExpand: true,
};

export const timelineModePresets: Record<TimelineMode, TimelineConfig> = {
  dark: darkTimelineConfig,
  light: lightTimelineConfig,
};

export const defaultTimelineConfig = darkTimelineConfig;

// ─── Default milestone data ───────────────────────────────────────────────────
export const defaultMilestones: TimelineMilestone[] = [
  {
    id: "m1",
    date: "OCT 14",
    year: "2024",
    icon: "hub",
    title: "Tier-1 Market Expansion Completion",
    subtitle: "Strategic deployment across APAC and EMEA operational zones.",
    volatility: "0.12%",
    delta: "+14.2%",
    risk: "Low",
    narrative:
      "The final phase of the 'Blue Horizon' expansion was executed with 98% efficiency. All regional compliance hurdles were cleared within the projected 45-day window. Operational costs remained within 2% of the initial variance models, primarily driven by optimized local logistics partnerships.",
    impactItems: [
      { label: "Market Share", value: "+3.4%", barWidth: "75%" },
      { label: "Revenue Run-rate", value: "$12.4M", barWidth: "52%" },
    ],
  },
  {
    id: "m2",
    date: "SEP 22",
    year: "2024",
    icon: "account_balance",
    title: "Annual Compliance Refactoring",
    subtitle:
      "Automated audit trails established for all regional subsidiaries.",
    volatility: "0.04%",
    delta: "-1.2%",
    risk: "Minimal",
    narrative:
      "Internal audit processes were overhauled to comply with updated regional data governance mandates. Automated trail generation reduced manual overhead by 60%, freeing analyst capacity for higher-value review cycles.",
    impactItems: [
      { label: "Audit Coverage", value: "100%", barWidth: "100%" },
      { label: "Manual Overhead", value: "-60%", barWidth: "40%" },
    ],
  },
  {
    id: "m3",
    date: "AUG 05",
    year: "2024",
    icon: "monitoring",
    title: "Big Data Migration: Phase 1",
    subtitle:
      "Transitioning from legacy on-premise silos to centralized cloud repository.",
    volatility: "0.45%",
    delta: "+28.1%",
    risk: "Critical",
    narrative:
      "The first migration wave transferred 4.2TB of structured records with zero data-loss incidents. Latency on core reporting queries dropped from an average of 8.4 seconds to under 900ms, enabling near-real-time analytics dashboards.",
    impactItems: [
      { label: "Query Latency", value: "-89%", barWidth: "89%" },
      { label: "Data Migrated", value: "4.2 TB", barWidth: "65%" },
    ],
  },
];
