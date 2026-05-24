// /lib/invoiceTableConfig.ts

export type InvoiceTableMode = "dark" | "light";
export type InvoiceStatus = "All" | "Pending" | "Paid" | "Overdue";

export interface InvoiceTableConfig {
  // Layout
  borderRadius: number;
  showShadow: boolean;
  tableWidth: number;

  // Shell
  backgroundColor: string;
  toolbarBackgroundColor: string;
  toolbarBorderColor: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  headerFontSize: number;
  borderColor: string;
  dividerColor: string;

  // Rows
  rowHoverColor: string;
  selectedRowColor: string;
  cellTextColor: string;
  cellMutedColor: string;
  cellFontSize: number;

  // Accent / Invoice #
  accentColor: string;
  accentTextColor: string;
  invoiceNumColor: string;

  // Avatar
  avatarBackgroundColor: string;
  avatarTextColor: string;

  // Tab pills
  tabActiveBg: string;
  tabActiveText: string;
  tabHoverBg: string;
  tabInactiveText: string;
  tabBadgeBg: string;
  tabBadgeText: string;

  // Status badges
  paidBg: string;
  paidText: string;
  pendingBg: string;
  pendingText: string;
  overdueBg: string;
  overdueText: string;

  // Overdue days
  overdueDaysColor: string;

  // Payment method icon
  paymentIconColor: string;
  paymentTextColor: string;

  // Action buttons
  actionIconColor: string;
  actionHoverBg: string;

  // Footer / Pagination
  footerBackgroundColor: string;
  footerTextColor: string;
  paginationActiveBg: string;
  paginationActiveText: string;
  paginationBorderColor: string;

  // Search
  searchBackgroundColor: string;
  searchBorderColor: string;
  searchTextColor: string;
  searchPlaceholderColor: string;

  // Feature toggles
  showSearch: boolean;
  showStatusTabs: boolean;
  showBulkCheckboxes: boolean;
  showDownloadAction: boolean;
  showMoreAction: boolean;
  stickyHeader: boolean;
  animateRows: boolean;
}

export const darkInvoiceTableConfig: InvoiceTableConfig = {
  // Layout
  borderRadius: 12,
  showShadow: true,
  tableWidth: 1100,

  // Shell
  backgroundColor: "#0c0c0f",
  toolbarBackgroundColor: "#141418",
  toolbarBorderColor: "#2a2a38",
  headerBackgroundColor: "#141418",
  headerTextColor: "#5a5a72",
  headerFontSize: 11,
  borderColor: "#2a2a38",
  dividerColor: "#1c1c24",

  // Rows
  rowHoverColor: "#7c6cfc12",
  selectedRowColor: "#7c6cfc1e",
  cellTextColor: "#c0c0d8",
  cellMutedColor: "#5a5a72",
  cellFontSize: 13,

  // Accent
  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",
  invoiceNumColor: "#9d91fd",

  // Avatar
  avatarBackgroundColor: "#242430",
  avatarTextColor: "#9090a8",

  // Tab pills
  tabActiveBg: "#242430",
  tabActiveText: "#f0f0f5",
  tabHoverBg: "#1c1c22",
  tabInactiveText: "#5a5a72",
  tabBadgeBg: "#7c6cfc",
  tabBadgeText: "#ffffff",

  // Status badges
  paidBg: "#4ade8022",
  paidText: "#4ade80",
  pendingBg: "#5a5a7222",
  pendingText: "#9090a8",
  overdueBg: "#f8717122",
  overdueText: "#f87171",

  // Overdue days
  overdueDaysColor: "#f87171",

  // Payment
  paymentIconColor: "#5a5a72",
  paymentTextColor: "#5a5a72",

  // Actions
  actionIconColor: "#5a5a72",
  actionHoverBg: "#242430",

  // Footer
  footerBackgroundColor: "#0c0c0f",
  footerTextColor: "#5a5a72",
  paginationActiveBg: "#7c6cfc",
  paginationActiveText: "#ffffff",
  paginationBorderColor: "#2a2a38",

  // Search
  searchBackgroundColor: "#0c0c0f",
  searchBorderColor: "#2a2a38",
  searchTextColor: "#c0c0d8",
  searchPlaceholderColor: "#5a5a72",

  // Toggles
  showSearch: true,
  showStatusTabs: true,
  showBulkCheckboxes: true,
  showDownloadAction: true,
  showMoreAction: true,
  stickyHeader: true,
  animateRows: true,
};

export const lightInvoiceTableConfig: InvoiceTableConfig = {
  // Layout
  borderRadius: 12,
  showShadow: true,
  tableWidth: 1100,

  // Shell
  backgroundColor: "#ffffff",
  toolbarBackgroundColor: "#f8f9ff",
  toolbarBorderColor: "#c7c4d8",
  headerBackgroundColor: "#eff4ff",
  headerTextColor: "#464455",
  headerFontSize: 11,
  borderColor: "#c7c4d8",
  dividerColor: "#e5eeff",

  // Rows
  rowHoverColor: "#4f46e50a",
  selectedRowColor: "#4f46e514",
  cellTextColor: "#0b1c30",
  cellMutedColor: "#777587",
  cellFontSize: 13,

  // Accent
  accentColor: "#3525cd",
  accentTextColor: "#ffffff",
  invoiceNumColor: "#3525cd",

  // Avatar
  avatarBackgroundColor: "#dce9ff",
  avatarTextColor: "#464455",

  // Tab pills
  tabActiveBg: "#dce9ff",
  tabActiveText: "#0b1c30",
  tabHoverBg: "#e5eeff",
  tabInactiveText: "#777587",
  tabBadgeBg: "#3525cd",
  tabBadgeText: "#ffffff",

  // Status badges
  paidBg: "#dcfce7",
  paidText: "#15803d",
  pendingBg: "#f1f5f9",
  pendingText: "#64748b",
  overdueBg: "#fee2e2",
  overdueText: "#dc2626",

  // Overdue days
  overdueDaysColor: "#dc2626",

  // Payment
  paymentIconColor: "#777587",
  paymentTextColor: "#777587",

  // Actions
  actionIconColor: "#777587",
  actionHoverBg: "#e5eeff",

  // Footer
  footerBackgroundColor: "#f8f9ff",
  footerTextColor: "#777587",
  paginationActiveBg: "#3525cd",
  paginationActiveText: "#ffffff",
  paginationBorderColor: "#c7c4d8",

  // Search
  searchBackgroundColor: "#ffffff",
  searchBorderColor: "#c7c4d8",
  searchTextColor: "#0b1c30",
  searchPlaceholderColor: "#777587",

  // Toggles
  showSearch: true,
  showStatusTabs: true,
  showBulkCheckboxes: true,
  showDownloadAction: true,
  showMoreAction: true,
  stickyHeader: true,
  animateRows: true,
};

export const invoiceTableModePresets: Record<
  InvoiceTableMode,
  InvoiceTableConfig
> = {
  dark: darkInvoiceTableConfig,
  light: lightInvoiceTableConfig,
};

export const defaultInvoiceTableConfig = darkInvoiceTableConfig;
