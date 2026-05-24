export type RecordTableMode = "dark" | "light";
export type RecordTableViewMode = "grid" | "list";

export interface RecordTableConfig {
  viewMode: RecordTableViewMode;
  tableWidth: number;
  cardMinWidth: number;
  rowHeight: number;
  gap: number;
  borderRadius: number;
  fontSize: number;
  avatarSize: number;
  backgroundColor: string;
  surfaceColor: string;
  searchBackground: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  subtleTextColor: string;
  accentColor: string;
  accentTextColor: string;
  hoverBackground: string;
  readyColor: string;
  draftColor: string;
  reviewColor: string;
  archivedColor: string;
  showSearch: boolean;
  showFilters: boolean;
  showMetrics: boolean;
  showShadow: boolean;
  animateItems: boolean;
}

export const darkRecordTableConfig: RecordTableConfig = {
  viewMode: "grid",
  tableWidth: 920,
  cardMinWidth: 260,
  rowHeight: 72,
  gap: 14,
  borderRadius: 12,
  fontSize: 13,
  avatarSize: 38,
  backgroundColor: "#141418",
  surfaceColor: "#1c1c22",
  searchBackground: "#242430",
  borderColor: "#2a2a38",
  textColor: "#f0f0f5",
  mutedTextColor: "#9090a8",
  subtleTextColor: "#5a5a72",
  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",
  hoverBackground: "#242430",
  readyColor: "#4ade80",
  draftColor: "#facc15",
  reviewColor: "#7c6cfc",
  archivedColor: "#9090a8",
  showSearch: true,
  showFilters: true,
  showMetrics: true,
  showShadow: true,
  animateItems: true,
};

export const lightRecordTableConfig: RecordTableConfig = {
  viewMode: "grid",
  tableWidth: 920,
  cardMinWidth: 260,
  rowHeight: 72,
  gap: 14,
  borderRadius: 12,
  fontSize: 13,
  avatarSize: 38,
  backgroundColor: "#f4f4f8",
  surfaceColor: "#ffffff",
  searchBackground: "#f4f4f8",
  borderColor: "#d4d4e0",
  textColor: "#1a1a2e",
  mutedTextColor: "#67677f",
  subtleTextColor: "#9090a8",
  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",
  hoverBackground: "#f4f4f8",
  readyColor: "#16a34a",
  draftColor: "#ca8a04",
  reviewColor: "#6c5ce7",
  archivedColor: "#64748b",
  showSearch: true,
  showFilters: true,
  showMetrics: true,
  showShadow: true,
  animateItems: true,
};

export const recordTableModePresets: Record<RecordTableMode, RecordTableConfig> = {
  dark: darkRecordTableConfig,
  light: lightRecordTableConfig,
};

export const defaultRecordTableConfig = darkRecordTableConfig;
