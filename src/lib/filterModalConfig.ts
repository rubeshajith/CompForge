// /lib/filterModalConfig.ts

export type FilterModalMode = "dark" | "light";
export type SortField = "creationDate" | "projectName" | "dueDate" | "priority";
export type SortDirection = "asc" | "desc";
export type StatusOption =
  | "inProgress"
  | "completed"
  | "review"
  | "onHold"
  | "cancelled";
export type CategoryOption =
  | "operations"
  | "compliance"
  | "marketing"
  | "engineering"
  | "design";

export interface FilterModalConfig {
  // Modal container
  modalBackground: string;
  modalBorderColor: string;
  modalBorderRadius: number;
  modalWidth: number;
  showShadow: boolean;
  backdropBlur: boolean;

  // Header
  headerBackground: string;
  headerBorderColor: string;
  headerTextColor: string;
  headerIconColor: string;
  closeButtonHoverBackground: string;

  // Section labels
  sectionLabelColor: string;

  // Sort buttons
  sortButtonBackground: string;
  sortButtonBorderColor: string;
  sortButtonTextColor: string;
  sortButtonActiveBackground: string;
  sortButtonActiveBorderColor: string;
  sortButtonActiveTextColor: string;
  sortButtonBorderRadius: number;

  // Status chips
  statusChipBackground: string;
  statusChipBorderColor: string;
  statusChipTextColor: string;
  statusChipActiveBackground: string;
  statusChipActiveTextColor: string;
  statusChipBorderRadius: number;

  // Calendar / date range
  calendarBackground: string;
  calendarBorderColor: string;
  calendarBorderRadius: number;
  calendarHeaderTextColor: string;
  calendarChevronColor: string;
  calendarDayNameColor: string;
  calendarDayTextColor: string;
  calendarDayHoverBackground: string;
  calendarSelectedBackground: string;
  calendarSelectedTextColor: string;
  calendarRangeBackground: string;
  calendarRangeTextColor: string;

  // Category checkboxes
  checkboxBorderColor: string;
  checkboxActiveBackground: string;
  checkboxActiveTextColor: string;
  categoryRowBackground: string;
  categoryRowBorderColor: string;
  categoryRowHoverBackground: string;
  categoryCountColor: string;

  // Footer
  footerBackground: string;
  footerBorderColor: string;
  resetButtonTextColor: string;
  cancelButtonBackground: string;
  cancelButtonBorderColor: string;
  cancelButtonTextColor: string;
  applyButtonBackground: string;
  applyButtonTextColor: string;
  applyButtonBorderRadius: number;

  // Typography
  fontSize: number;

  // Behavior
  animateOpen: boolean;
  showCategoryCount: boolean;

  // State (behavioral — preserved on mode toggle)
  selectedStatuses: StatusOption[];
  selectedCategories: CategoryOption[];
  sortField: SortField;
  sortDirection: SortDirection;
}

export const darkFilterModalConfig: FilterModalConfig = {
  // Modal container
  modalBackground: "#1c1c22",
  modalBorderColor: "#2a2a38",
  modalBorderRadius: 16,
  modalWidth: 560,
  showShadow: true,
  backdropBlur: true,

  // Header
  headerBackground: "#1c1c22",
  headerBorderColor: "#2a2a38",
  headerTextColor: "#f0f0f5",
  headerIconColor: "#7c6cfc",
  closeButtonHoverBackground: "#242430",

  // Section labels
  sectionLabelColor: "#5a5a72",

  // Sort buttons
  sortButtonBackground: "#141418",
  sortButtonBorderColor: "#2a2a38",
  sortButtonTextColor: "#9090a8",
  sortButtonActiveBackground: "#7c6cfc22",
  sortButtonActiveBorderColor: "#7c6cfc",
  sortButtonActiveTextColor: "#f0f0f5",
  sortButtonBorderRadius: 10,

  // Status chips
  statusChipBackground: "#141418",
  statusChipBorderColor: "#2a2a38",
  statusChipTextColor: "#9090a8",
  statusChipActiveBackground: "#7c6cfc",
  statusChipActiveTextColor: "#ffffff",
  statusChipBorderRadius: 999,

  // Calendar / date range
  calendarBackground: "#141418",
  calendarBorderColor: "#2a2a38",
  calendarBorderRadius: 10,
  calendarHeaderTextColor: "#f0f0f5",
  calendarChevronColor: "#9090a8",
  calendarDayNameColor: "#5a5a72",
  calendarDayTextColor: "#c0c0d8",
  calendarDayHoverBackground: "#242430",
  calendarSelectedBackground: "#7c6cfc",
  calendarSelectedTextColor: "#ffffff",
  calendarRangeBackground: "#7c6cfc1a",
  calendarRangeTextColor: "#9d91fd",

  // Category checkboxes
  checkboxBorderColor: "#2a2a38",
  checkboxActiveBackground: "#7c6cfc",
  checkboxActiveTextColor: "#ffffff",
  categoryRowBackground: "#141418",
  categoryRowBorderColor: "#2a2a38",
  categoryRowHoverBackground: "#242430",
  categoryCountColor: "#5a5a72",

  // Footer
  footerBackground: "#141418",
  footerBorderColor: "#2a2a38",
  resetButtonTextColor: "#9090a8",
  cancelButtonBackground: "#1c1c22",
  cancelButtonBorderColor: "#2a2a38",
  cancelButtonTextColor: "#f0f0f5",
  applyButtonBackground: "#7c6cfc",
  applyButtonTextColor: "#ffffff",
  applyButtonBorderRadius: 10,

  // Typography
  fontSize: 13,

  // Behavior
  animateOpen: true,
  showCategoryCount: true,

  // State
  selectedStatuses: ["inProgress", "review"],
  selectedCategories: ["operations", "compliance"],
  sortField: "creationDate",
  sortDirection: "desc",
};

export const lightFilterModalConfig: FilterModalConfig = {
  // Modal container
  modalBackground: "#ffffff",
  modalBorderColor: "#e2e2ec",
  modalBorderRadius: 16,
  modalWidth: 560,
  showShadow: true,
  backdropBlur: true,

  // Header
  headerBackground: "#ffffff",
  headerBorderColor: "#e2e2ec",
  headerTextColor: "#1a1a2e",
  headerIconColor: "#6c5ce7",
  closeButtonHoverBackground: "#f4f4f8",

  // Section labels
  sectionLabelColor: "#9090a8",

  // Sort buttons
  sortButtonBackground: "#f4f4f8",
  sortButtonBorderColor: "#e2e2ec",
  sortButtonTextColor: "#9090a8",
  sortButtonActiveBackground: "#6c5ce71a",
  sortButtonActiveBorderColor: "#6c5ce7",
  sortButtonActiveTextColor: "#1a1a2e",
  sortButtonBorderRadius: 10,

  // Status chips
  statusChipBackground: "#f4f4f8",
  statusChipBorderColor: "#e2e2ec",
  statusChipTextColor: "#9090a8",
  statusChipActiveBackground: "#6c5ce7",
  statusChipActiveTextColor: "#ffffff",
  statusChipBorderRadius: 999,

  // Calendar / date range
  calendarBackground: "#f4f4f8",
  calendarBorderColor: "#e2e2ec",
  calendarBorderRadius: 10,
  calendarHeaderTextColor: "#1a1a2e",
  calendarChevronColor: "#9090a8",
  calendarDayNameColor: "#9090a8",
  calendarDayTextColor: "#1a1a2e",
  calendarDayHoverBackground: "#e8e8f0",
  calendarSelectedBackground: "#6c5ce7",
  calendarSelectedTextColor: "#ffffff",
  calendarRangeBackground: "#6c5ce71a",
  calendarRangeTextColor: "#6c5ce7",

  // Category checkboxes
  checkboxBorderColor: "#d4d4e0",
  checkboxActiveBackground: "#6c5ce7",
  checkboxActiveTextColor: "#ffffff",
  categoryRowBackground: "#f4f4f8",
  categoryRowBorderColor: "#e2e2ec",
  categoryRowHoverBackground: "#e8e8f0",
  categoryCountColor: "#9090a8",

  // Footer
  footerBackground: "#f4f4f8",
  footerBorderColor: "#e2e2ec",
  resetButtonTextColor: "#9090a8",
  cancelButtonBackground: "#ffffff",
  cancelButtonBorderColor: "#e2e2ec",
  cancelButtonTextColor: "#1a1a2e",
  applyButtonBackground: "#6c5ce7",
  applyButtonTextColor: "#ffffff",
  applyButtonBorderRadius: 10,

  // Typography
  fontSize: 13,

  // Behavior
  animateOpen: true,
  showCategoryCount: true,

  // State
  selectedStatuses: ["inProgress", "review"],
  selectedCategories: ["operations", "compliance"],
  sortField: "creationDate",
  sortDirection: "desc",
};

export const filterModalModePresets: Record<
  FilterModalMode,
  FilterModalConfig
> = {
  dark: darkFilterModalConfig,
  light: lightFilterModalConfig,
};

export const defaultFilterModalConfig = darkFilterModalConfig;
