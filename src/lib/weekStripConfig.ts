export type WeekStripMode = "dark" | "light";

export interface WeekStripConfig {
  // Container
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  showShadow: boolean;

  // Month label
  showMonthLabel: boolean;
  monthLabelColor: string;
  monthLabelSize: number; // px

  // Day names (SUN, MON …)
  dayNameColor: string;
  dayNameSize: number; // px

  // Day number
  dayNumberColor: string;
  dayNumberSize: number; // px

  // Past days
  pastDayOpacity: number; // 0–100

  // Today highlight (unselected)
  todayColor: string;

  // Selected day
  selectedBackground: string;
  selectedTextColor: string;
  selectedBorderRadius: number;

  // Hover
  hoverBackground: string;

  // Event dot
  showDots: boolean;
  dotColor: string;

  // Navigation chevrons
  chevronColor: string;

  // Strip sizing
  dayButtonWidth: number; // px
  dayButtonHeight: number; // px

  // Animation
  animateSelection: boolean;
}

export const darkWeekStripConfig: WeekStripConfig = {
  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  borderRadius: 12,
  showShadow: true,

  showMonthLabel: true,
  monthLabelColor: "#f0f0f5",
  monthLabelSize: 14,

  dayNameColor: "#5a5a72",
  dayNameSize: 11,

  dayNumberColor: "#c0c0d8",
  dayNumberSize: 15,

  pastDayOpacity: 35,

  todayColor: "#9d91fd",

  selectedBackground: "#7c6cfc",
  selectedTextColor: "#ffffff",
  selectedBorderRadius: 10,

  hoverBackground: "#242430",

  showDots: true,
  dotColor: "#7c6cfc",

  chevronColor: "#9090a8",

  dayButtonWidth: 44,
  dayButtonHeight: 58,

  animateSelection: true,
};

export const lightWeekStripConfig: WeekStripConfig = {
  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  borderRadius: 12,
  showShadow: true,

  showMonthLabel: true,
  monthLabelColor: "#1a1a2e",
  monthLabelSize: 14,

  dayNameColor: "#9090a8",
  dayNameSize: 11,

  dayNumberColor: "#1a1a2e",
  dayNumberSize: 15,

  pastDayOpacity: 35,

  todayColor: "#6c5ce7",

  selectedBackground: "#6c5ce7",
  selectedTextColor: "#ffffff",
  selectedBorderRadius: 10,

  hoverBackground: "#f4f4f8",

  showDots: true,
  dotColor: "#6c5ce7",

  chevronColor: "#9090a8",

  dayButtonWidth: 44,
  dayButtonHeight: 58,

  animateSelection: true,
};

export const weekStripModePresets: Record<WeekStripMode, WeekStripConfig> = {
  dark: darkWeekStripConfig,
  light: lightWeekStripConfig,
};

export const defaultWeekStripConfig = darkWeekStripConfig;
