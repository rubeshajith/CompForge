// /lib/userTableConfig.ts

export type UserTableMode = "dark" | "light";
export type TableDensity = "compact" | "comfortable" | "spacious";
export type AvatarStyle = "initials" | "gradient" | "icon";

export interface UserTableConfig {
  // Layout & Density
  density: TableDensity;
  tableWidth: number;
  borderRadius: number;

  // Container
  backgroundColor: string;
  borderColor: string;
  showShadow: boolean;

  // Header
  headerBackground: string;
  headerTextColor: string;
  headerBorderColor: string;

  // Rows
  rowBackground: string;
  rowHoverBackground: string;
  rowTextColor: string;
  rowSubtextColor: string;
  rowDividerColor: string;
  stripedRows: boolean;
  rowStripeColor: string;

  // Avatar
  avatarStyle: AvatarStyle;
  avatarBackground: string;
  avatarTextColor: string;
  avatarSize: number;
  avatarBorderRadius: number;

  // Badges / Roles
  adminBadgeBackground: string;
  adminBadgeTextColor: string;
  editorBadgeBackground: string;
  editorBadgeTextColor: string;
  viewerBadgeBackground: string;
  viewerBadgeTextColor: string;
  badgeBorderRadius: number;

  // Status Pills
  activeBackground: string;
  activeTextColor: string;
  activeDotColor: string;
  inactiveBackground: string;
  inactiveTextColor: string;
  inactiveDotColor: string;
  pendingBackground: string;
  pendingTextColor: string;
  pendingDotColor: string;

  // Expanded Row
  expandedBackground: string;
  expandedAccentBorder: string;
  expandedTextColor: string;

  // Bulk Actions Bar
  bulkBarBackground: string;
  bulkBarTextColor: string;

  // Pagination
  paginationBackground: string;
  paginationBorderColor: string;
  paginationActiveBackground: string;
  paginationActiveTextColor: string;
  paginationTextColor: string;

  // Accent / Interactive
  accentColor: string;
  checkboxColor: string;
  chevronColor: string;

  // Summary Cards
  showSummaryCards: boolean;
  summaryCardBackground: string;
  summaryCardBorderColor: string;
  summaryCardIconColor: string;

  // Features
  showExpandableRows: boolean;
  showBulkActions: boolean;
  showSearch: boolean;
  animateRows: boolean;

  // Typography
  fontSize: number;
}

export const darkUserTableConfig: UserTableConfig = {
  // Layout
  density: "comfortable",
  tableWidth: 900,
  borderRadius: 12,

  // Container
  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  showShadow: true,

  // Header
  headerBackground: "#141418",
  headerTextColor: "#5a5a72",
  headerBorderColor: "#2a2a38",

  // Rows
  rowBackground: "#1c1c22",
  rowHoverBackground: "#242430",
  rowTextColor: "#f0f0f5",
  rowSubtextColor: "#9090a8",
  rowDividerColor: "#2a2a38",
  stripedRows: false,
  rowStripeColor: "#1e1e26",

  // Avatar
  avatarStyle: "initials",
  avatarBackground: "#242430",
  avatarTextColor: "#7c6cfc",
  avatarSize: 38,
  avatarBorderRadius: 10,

  // Badges
  adminBadgeBackground: "#7c6cfc22",
  adminBadgeTextColor: "#9d91fd",
  editorBadgeBackground: "#facc1522",
  editorBadgeTextColor: "#facc15",
  viewerBadgeBackground: "#2a2a38",
  viewerBadgeTextColor: "#9090a8",
  badgeBorderRadius: 4,

  // Status
  activeBackground: "#4ade8022",
  activeTextColor: "#4ade80",
  activeDotColor: "#4ade80",
  inactiveBackground: "#2a2a38",
  inactiveTextColor: "#5a5a72",
  inactiveDotColor: "#5a5a72",
  pendingBackground: "#facc1522",
  pendingTextColor: "#facc15",
  pendingDotColor: "#facc15",

  // Expanded Row
  expandedBackground: "#141418",
  expandedAccentBorder: "#7c6cfc",
  expandedTextColor: "#9090a8",

  // Bulk Actions
  bulkBarBackground: "#7c6cfc22",
  bulkBarTextColor: "#9d91fd",

  // Pagination
  paginationBackground: "#141418",
  paginationBorderColor: "#2a2a38",
  paginationActiveBackground: "#7c6cfc",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#9090a8",

  // Accent
  accentColor: "#7c6cfc",
  checkboxColor: "#7c6cfc",
  chevronColor: "#5a5a72",

  // Summary Cards
  showSummaryCards: true,
  summaryCardBackground: "#141418",
  summaryCardBorderColor: "#2a2a38",
  summaryCardIconColor: "#7c6cfc",

  // Features
  showExpandableRows: true,
  showBulkActions: true,
  showSearch: true,
  animateRows: true,

  // Typography
  fontSize: 13,
};

export const lightUserTableConfig: UserTableConfig = {
  // Layout
  density: "comfortable",
  tableWidth: 900,
  borderRadius: 12,

  // Container
  backgroundColor: "#ffffff",
  borderColor: "#e2e2ec",
  showShadow: true,

  // Header
  headerBackground: "#f8f8fc",
  headerTextColor: "#9090a8",
  headerBorderColor: "#e2e2ec",

  // Rows
  rowBackground: "#ffffff",
  rowHoverBackground: "#f4f4f8",
  rowTextColor: "#1a1a2e",
  rowSubtextColor: "#9090a8",
  rowDividerColor: "#e2e2ec",
  stripedRows: false,
  rowStripeColor: "#f8f8fc",

  // Avatar
  avatarStyle: "initials",
  avatarBackground: "#ede9fe",
  avatarTextColor: "#6c5ce7",
  avatarSize: 38,
  avatarBorderRadius: 10,

  // Badges
  adminBadgeBackground: "#ede9fe",
  adminBadgeTextColor: "#6c5ce7",
  editorBadgeBackground: "#fef9c3",
  editorBadgeTextColor: "#a16207",
  viewerBadgeBackground: "#f1f5f9",
  viewerBadgeTextColor: "#64748b",
  badgeBorderRadius: 4,

  // Status
  activeBackground: "#dcfce7",
  activeTextColor: "#16a34a",
  activeDotColor: "#22c55e",
  inactiveBackground: "#f1f5f9",
  inactiveTextColor: "#94a3b8",
  inactiveDotColor: "#94a3b8",
  pendingBackground: "#fef9c3",
  pendingTextColor: "#ca8a04",
  pendingDotColor: "#eab308",

  // Expanded Row
  expandedBackground: "#f8f8fc",
  expandedAccentBorder: "#6c5ce7",
  expandedTextColor: "#64748b",

  // Bulk Actions
  bulkBarBackground: "#ede9fe",
  bulkBarTextColor: "#6c5ce7",

  // Pagination
  paginationBackground: "#f8f8fc",
  paginationBorderColor: "#e2e2ec",
  paginationActiveBackground: "#6c5ce7",
  paginationActiveTextColor: "#ffffff",
  paginationTextColor: "#64748b",

  // Accent
  accentColor: "#6c5ce7",
  checkboxColor: "#6c5ce7",
  chevronColor: "#94a3b8",

  // Summary Cards
  showSummaryCards: true,
  summaryCardBackground: "#ffffff",
  summaryCardBorderColor: "#e2e2ec",
  summaryCardIconColor: "#6c5ce7",

  // Features
  showExpandableRows: true,
  showBulkActions: true,
  showSearch: true,
  animateRows: true,

  // Typography
  fontSize: 13,
};

export const userTableModePresets: Record<UserTableMode, UserTableConfig> = {
  dark: darkUserTableConfig,
  light: lightUserTableConfig,
};

export const defaultUserTableConfig = darkUserTableConfig;
