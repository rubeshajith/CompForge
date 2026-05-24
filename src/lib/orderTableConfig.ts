export type OrderTableMode = "dark" | "light";

export interface OrderTableConfig {
  width: number;
  tableMinWidth: number;
  backgroundColor: string;
  surfaceColor: string;
  filterBackground: string;
  expandedBackground: string;
  borderColor: string;
  borderRadius: number;
  headerBackground: string;
  headerTextColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  accentTextColor: string;
  hoverBackground: string;
  selectedBackground: string;
  inputBackground: string;
  chipRadius: number;
  rowHeight: number;
  fontSize: number;
  showShadow: boolean;
  showFilters: boolean;
  showFooter: boolean;
  showAvatars: boolean;
  expandableRows: boolean;
  animateRows: boolean;
}

export const darkOrderTableConfig: OrderTableConfig = {
  width: 980,
  tableMinWidth: 860,
  backgroundColor: "#0c0c0f",
  surfaceColor: "#1c1c22",
  filterBackground: "#141418",
  expandedBackground: "#181820",
  borderColor: "#2a2a38",
  borderRadius: 10,
  headerBackground: "#242430",
  headerTextColor: "#9090a8",
  textColor: "#f0f0f5",
  mutedTextColor: "#9090a8",
  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",
  hoverBackground: "#242430",
  selectedBackground: "#7c6cfc1f",
  inputBackground: "#0f0f14",
  chipRadius: 999,
  rowHeight: 64,
  fontSize: 14,
  showShadow: true,
  showFilters: true,
  showFooter: true,
  showAvatars: true,
  expandableRows: true,
  animateRows: true,
};

export const lightOrderTableConfig: OrderTableConfig = {
  width: 980,
  tableMinWidth: 860,
  backgroundColor: "#f8f9ff",
  surfaceColor: "#ffffff",
  filterBackground: "#ffffff",
  expandedBackground: "#f6f8ff",
  borderColor: "#d4d4e0",
  borderRadius: 10,
  headerBackground: "#eff4ff",
  headerTextColor: "#464555",
  textColor: "#0b1c30",
  mutedTextColor: "#777587",
  accentColor: "#3525cd",
  accentTextColor: "#ffffff",
  hoverBackground: "#eef2ff",
  selectedBackground: "#3525cd14",
  inputBackground: "#ffffff",
  chipRadius: 999,
  rowHeight: 64,
  fontSize: 14,
  showShadow: true,
  showFilters: true,
  showFooter: true,
  showAvatars: true,
  expandableRows: true,
  animateRows: true,
};

export const orderTableModePresets: Record<OrderTableMode, OrderTableConfig> = {
  dark: darkOrderTableConfig,
  light: lightOrderTableConfig,
};

export const defaultOrderTableConfig = darkOrderTableConfig;
