// /lib/dataTableConfig.ts

export type DataTableMode = "dark" | "light";
export type DataTableDensity = "compact" | "comfortable" | "spacious";
export type DataTableColumnVisibility = {
  sku: boolean;
  name: boolean;
  category: boolean;
  stock: boolean;
  price: boolean;
  status: boolean;
  warehouse: boolean;
  lastModified: boolean;
};

export interface DataTableConfig {
  // Layout & Sizing
  density: DataTableDensity;
  tableWidth: number;
  detailPanelWidth: number;
  borderRadius: number;
  showShadow: boolean;

  // Shell Colors
  backgroundColor: string;
  headerBackgroundColor: string;
  rowHoverColor: string;
  selectedRowColor: string;
  borderColor: string;
  dividerColor: string;

  // Header Typography
  headerTextColor: string;
  headerFontSize: number;

  // Cell Typography
  cellTextColor: string;
  cellMutedColor: string;
  cellFontSize: number;

  // Accent / Primary
  accentColor: string;
  accentTextColor: string;
  skuColor: string;

  // Status Badge Colors
  inStockBg: string;
  inStockText: string;
  lowStockBg: string;
  lowStockText: string;
  oosBg: string;
  oosText: string;
  discontinuedBg: string;
  discontinuedText: string;

  // Footer / Pagination
  footerBackgroundColor: string;
  footerTextColor: string;
  paginationActiveBg: string;
  paginationActiveText: string;

  // Detail Panel
  panelBackgroundColor: string;
  panelBorderColor: string;
  panelHeaderColor: string;
  panelLabelColor: string;
  panelValueColor: string;
  panelAccentColor: string;

  // Toolbar
  toolbarBackgroundColor: string;
  toolbarBorderColor: string;
  filterChipBg: string;
  filterChipText: string;

  // Bulk Action Bar
  bulkBarBg: string;
  bulkBarText: string;

  // Feature Toggles
  showRowNumbers: boolean;
  showColumnFilters: boolean;
  showBulkActions: boolean;
  stickyHeader: boolean;
  stickyFirstColumn: boolean;
  animateDetailPanel: boolean;
  showSearchBar: boolean;
  showColumnVisibilityToggle: boolean;
  showSortIndicators: boolean;
  lowStockThreshold: number;

  // Column Visibility
  columnVisibility: DataTableColumnVisibility;
}

export const darkDataTableConfig: DataTableConfig = {
  // Layout
  density: "compact",
  tableWidth: 1200,
  detailPanelWidth: 320,
  borderRadius: 10,
  showShadow: true,

  // Shell
  backgroundColor: "#0c0c0f",
  headerBackgroundColor: "#141418",
  rowHoverColor: "#7c6cfc14",
  selectedRowColor: "#7c6cfc22",
  borderColor: "#2a2a38",
  dividerColor: "#1e1e28",

  // Header Typography
  headerTextColor: "#5a5a72",
  headerFontSize: 11,

  // Cell Typography
  cellTextColor: "#c0c0d8",
  cellMutedColor: "#5a5a72",
  cellFontSize: 13,

  // Accent
  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",
  skuColor: "#9d91fd",

  // Status Badges
  inStockBg: "#4ade8022",
  inStockText: "#4ade80",
  lowStockBg: "#facc1522",
  lowStockText: "#facc15",
  oosBg: "#f8717122",
  oosText: "#f87171",
  discontinuedBg: "#5a5a7222",
  discontinuedText: "#5a5a72",

  // Footer
  footerBackgroundColor: "#0c0c0f",
  footerTextColor: "#5a5a72",
  paginationActiveBg: "#7c6cfc",
  paginationActiveText: "#ffffff",

  // Detail Panel
  panelBackgroundColor: "#141418",
  panelBorderColor: "#2a2a38",
  panelHeaderColor: "#f0f0f5",
  panelLabelColor: "#5a5a72",
  panelValueColor: "#c0c0d8",
  panelAccentColor: "#7c6cfc",

  // Toolbar
  toolbarBackgroundColor: "#0c0c0f",
  toolbarBorderColor: "#2a2a38",
  filterChipBg: "#7c6cfc22",
  filterChipText: "#9d91fd",

  // Bulk Bar
  bulkBarBg: "#7c6cfc",
  bulkBarText: "#ffffff",

  // Toggles
  showRowNumbers: false,
  showColumnFilters: false,
  showBulkActions: true,
  stickyHeader: true,
  stickyFirstColumn: true,
  animateDetailPanel: true,
  showSearchBar: true,
  showColumnVisibilityToggle: true,
  showSortIndicators: true,
  lowStockThreshold: 20,

  // Column Visibility
  columnVisibility: {
    sku: true,
    name: true,
    category: true,
    stock: true,
    price: true,
    status: true,
    warehouse: true,
    lastModified: true,
  },
};

export const lightDataTableConfig: DataTableConfig = {
  // Layout
  density: "compact",
  tableWidth: 1200,
  detailPanelWidth: 320,
  borderRadius: 10,
  showShadow: true,

  // Shell
  backgroundColor: "#f8f9ff",
  headerBackgroundColor: "#dce9ff",
  rowHoverColor: "#4f46e510",
  selectedRowColor: "#4f46e51a",
  borderColor: "#c7c4d8",
  dividerColor: "#e5eeff",

  // Header Typography
  headerTextColor: "#464455",
  headerFontSize: 11,

  // Cell Typography
  cellTextColor: "#0b1c30",
  cellMutedColor: "#777587",
  cellFontSize: 13,

  // Accent
  accentColor: "#3525cd",
  accentTextColor: "#ffffff",
  skuColor: "#4648d4",

  // Status Badges
  inStockBg: "#dcfce7",
  inStockText: "#15803d",
  lowStockBg: "#fef9c3",
  lowStockText: "#a16207",
  oosBg: "#fee2e2",
  oosText: "#dc2626",
  discontinuedBg: "#f1f5f9",
  discontinuedText: "#64748b",

  // Footer
  footerBackgroundColor: "#f8f9ff",
  footerTextColor: "#777587",
  paginationActiveBg: "#3525cd",
  paginationActiveText: "#ffffff",

  // Detail Panel
  panelBackgroundColor: "#ffffff",
  panelBorderColor: "#c7c4d8",
  panelHeaderColor: "#0b1c30",
  panelLabelColor: "#777587",
  panelValueColor: "#0b1c30",
  panelAccentColor: "#3525cd",

  // Toolbar
  toolbarBackgroundColor: "#ffffff",
  toolbarBorderColor: "#c7c4d8",
  filterChipBg: "#e2dfff",
  filterChipText: "#3323cc",

  // Bulk Bar
  bulkBarBg: "#4f46e5",
  bulkBarText: "#ffffff",

  // Toggles
  showRowNumbers: false,
  showColumnFilters: false,
  showBulkActions: true,
  stickyHeader: true,
  stickyFirstColumn: true,
  animateDetailPanel: true,
  showSearchBar: true,
  showColumnVisibilityToggle: true,
  showSortIndicators: true,
  lowStockThreshold: 20,

  // Column Visibility
  columnVisibility: {
    sku: true,
    name: true,
    category: true,
    stock: true,
    price: true,
    status: true,
    warehouse: true,
    lastModified: true,
  },
};

export const dataTableModePresets: Record<DataTableMode, DataTableConfig> = {
  dark: darkDataTableConfig,
  light: lightDataTableConfig,
};

export const defaultDataTableConfig = darkDataTableConfig;
