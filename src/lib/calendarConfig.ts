export type CalendarMode = "dark" | "light";
export type SelectionMode = "single" | "range";

export interface CalendarConfig {
  // Colors — container
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;

  // Header
  headerTextColor: string;
  chevronColor: string;

  // Day names row
  dayNameColor: string;

  // Day cells
  dayTextColor: string;
  dayHoverBackground: string;
  dayHoverTextColor: string;

  // Selected / accent
  accentColor: string;
  accentTextColor: string;
  rangeBackground: string;
  rangeTextColor: string;

  // Month/year picker
  pickerBackground: string;
  pickerBorderColor: string;
  pickerOptionHover: string;

  // Shape & size
  dayBorderRadius: number;
  dayCellSize: number; // px — controls both width and height of each day cell
  calendarWidth: number; // px — width of each calendar panel
  fontSize: number;

  // Options
  showShadow: boolean;
  animateOpen: boolean;

  // Selection mode
  selectionMode: SelectionMode;
}

export const darkCalendarConfig: CalendarConfig = {
  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  borderRadius: 12,
  headerTextColor: "#f0f0f5",
  chevronColor: "#9090a8",
  dayNameColor: "#5a5a72",
  dayTextColor: "#c0c0d8",
  dayHoverBackground: "#242430",
  dayHoverTextColor: "#f0f0f5",
  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",
  rangeBackground: "#7c6cfc1a",
  rangeTextColor: "#9d91fd",
  pickerBackground: "#1c1c22",
  pickerBorderColor: "#2a2a38",
  pickerOptionHover: "#242430",
  dayBorderRadius: 8,
  dayCellSize: 36,
  calendarWidth: 280,
  fontSize: 13,
  showShadow: true,
  animateOpen: true,
  selectionMode: "single",
};

export const lightCalendarConfig: CalendarConfig = {
  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  borderRadius: 12,
  headerTextColor: "#1a1a2e",
  chevronColor: "#9090a8",
  dayNameColor: "#9090a8",
  dayTextColor: "#1a1a2e",
  dayHoverBackground: "#f4f4f8",
  dayHoverTextColor: "#1a1a2e",
  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",
  rangeBackground: "#6c5ce71a",
  rangeTextColor: "#6c5ce7",
  pickerBackground: "#ffffff",
  pickerBorderColor: "#d4d4e0",
  pickerOptionHover: "#f4f4f8",
  dayBorderRadius: 8,
  dayCellSize: 36,
  calendarWidth: 280,
  fontSize: 13,
  showShadow: true,
  animateOpen: true,
  selectionMode: "single",
};

export const calendarModePresets: Record<CalendarMode, CalendarConfig> = {
  dark: darkCalendarConfig,
  light: lightCalendarConfig,
};

export const defaultCalendarConfig = darkCalendarConfig;
