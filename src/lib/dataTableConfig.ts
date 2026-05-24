// /lib/dataTableConfig.ts

export type DataTableMode = "dark" | "light";
export type StatusFilter = "all" | "completed" | "pending" | "flagged";
export type SortDirection = "asc" | "desc";

export interface DataTableConfig {
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

  // Expanded row
  expandedRowBackground: string;
  expandedBorderAccentColor: string;

  // Filters bar
  filterBarBackground: string;
  filterBarBorderColor: string;
  filterChipBackground: string;
  filterChipTextColor: string;
  filterChipBorderColor: string;

  // Status badges
  completedBackground: string;
  completedTextColor: string;
  completedBorderColor: string;
  pendingBackground: string;
  pendingTextColor: string;
  pendingBorderColor: string;
  flaggedBackground: string;
  flaggedTextColor: string;
  flaggedBorderColor: string;

  // Amounts
  debitColor: string;
  creditColor: string;

  // Accent / interactive
  accentColor: string;
  accentTextColor: string;

  // Pagination
  paginationBackground: string;
  paginationActiveBackground: string;
  paginationActiveTextColor: string;
  paginationTextColor: string;
  paginationBorderColor: string;

  // Typography
  fontSize: number;
  borderRadius: number;

  // Behavior
  showFilters: boolean;
  showPagination: boolean;
  showCheckboxes: boolean;
  showContextCards: boolean;
  stripedRows: boolean;
  animateExpand: boolean;
  rowsPerPage: number;
}

export const darkDataTableConfig: DataTableConfig = {
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

  expandedRowBackground: "#141418",
  expandedBorderAccentColor: "#7c6cfc",

  filterBarBackground: "#141418",
  filterBarBorderColor: "#2a2a38",
  filterChipBackground: "#1c1c22",
  filterChipTextColor: "#9090a8",
  filterChipBorderColor: "#2a2a38",

  completedBackground: "#0d2618",
  completedTextColor: "#4ade80",
  completedBorderColor: "#1a4a2e",
  pendingBackground: "#2a1f08",
  pendingTextColor: "#facc15",
  pendingBorderColor: "#4a3510",
  flaggedBackground: "#2a1010",
  flaggedTextColor: "#f87171",
  flaggedBorderColor: "#4a2020",

  debitColor: "#f87171",
  creditColor: "#4ade80",

  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",

  paginationBackground: "#141418",
  paginationActiveBackground: "#7c6cfc",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#9090a8",
  paginationBorderColor: "#2a2a38",

  fontSize: 13,
  borderRadius: 8,

  showFilters: true,
  showPagination: true,
  showCheckboxes: true,
  showContextCards: true,
  stripedRows: false,
  animateExpand: true,
  rowsPerPage: 5,
};

export const lightDataTableConfig: DataTableConfig = {
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

  expandedRowBackground: "#f4f4f8",
  expandedBorderAccentColor: "#6c5ce7",

  filterBarBackground: "#f4f4f8",
  filterBarBorderColor: "#d4d4e0",
  filterChipBackground: "#ffffff",
  filterChipTextColor: "#5a5a72",
  filterChipBorderColor: "#d4d4e0",

  completedBackground: "#f0fdf4",
  completedTextColor: "#16a34a",
  completedBorderColor: "#bbf7d0",
  pendingBackground: "#fefce8",
  pendingTextColor: "#ca8a04",
  pendingBorderColor: "#fde68a",
  flaggedBackground: "#fef2f2",
  flaggedTextColor: "#dc2626",
  flaggedBorderColor: "#fecaca",

  debitColor: "#dc2626",
  creditColor: "#16a34a",

  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",

  paginationBackground: "#f4f4f8",
  paginationActiveBackground: "#6c5ce7",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#5a5a72",
  paginationBorderColor: "#d4d4e0",

  fontSize: 13,
  borderRadius: 8,

  showFilters: true,
  showPagination: true,
  showCheckboxes: true,
  showContextCards: true,
  stripedRows: false,
  animateExpand: true,
  rowsPerPage: 5,
};

export const dataTableModePresets: Record<DataTableMode, DataTableConfig> = {
  dark: darkDataTableConfig,
  light: lightDataTableConfig,
};

export const defaultDataTableConfig = darkDataTableConfig;
