// /lib/dateTimeInputConfig.ts

export type DateTimeInputMode = "dark" | "light";
export type DateTimeInputPickerMode = "date" | "time" | "datetime";

export interface DateTimeInputConfig {
  // Picker mode
  pickerMode: DateTimeInputPickerMode;

  // Input field
  inputBackground: string;
  inputBorderColor: string;
  inputBorderRadius: number;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputIconColor: string;
  inputFocusBorderColor: string;
  inputErrorBorderColor: string;

  // Label
  labelTextColor: string;
  labelFontSize: number;

  // Popover / panel
  popoverBackground: string;
  popoverBorderColor: string;
  popoverBorderRadius: number;
  popoverShadow: boolean;

  // Calendar header
  calHeaderTextColor: string;
  calNavButtonColor: string;
  calNavButtonHoverBackground: string;

  // Calendar day grid
  dayNameColor: string;
  dayTextColor: string;
  dayHoverBackground: string;
  dayHoverTextColor: string;
  dayBorderRadius: number;
  dayCellSize: number;

  // Selected day
  accentColor: string;
  accentTextColor: string;

  // Today highlight
  todayTextColor: string;

  // Picker popup (month/year grid)
  pickerPopupBackground: string;
  pickerPopupBorderColor: string;
  pickerPopupItemHover: string;
  pickerPopupSelectedBackground: string;
  pickerPopupSelectedTextColor: string;

  // Clock
  clockFaceBackground: string;
  clockHandColor: string;
  clockNumberColor: string;
  clockNumberActiveBackground: string;
  clockNumberActiveTextColor: string;
  clockDisplayBackground: string;
  clockDisplayTextColor: string;
  clockAmPmBorderColor: string;
  clockAmPmActiveBackground: string;
  clockAmPmActiveTextColor: string;

  // Footer buttons
  cancelButtonColor: string;
  okButtonBackground: string;
  okButtonTextColor: string;

  // Typography
  fontSize: number;

  // Behavior
  allowFutureTime: boolean;
  animateOpen: boolean;
}

// ─── Dark Preset ─────────────────────────────────────────────────────────────
export const darkDateTimeInputConfig: DateTimeInputConfig = {
  pickerMode: "datetime",

  inputBackground: "#1c1c22",
  inputBorderColor: "#2a2a38",
  inputBorderRadius: 10,
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputIconColor: "#9090a8",
  inputFocusBorderColor: "#7c6cfc",
  inputErrorBorderColor: "#f87171",

  labelTextColor: "#9090a8",
  labelFontSize: 13,

  popoverBackground: "#1c1c22",
  popoverBorderColor: "#2a2a38",
  popoverBorderRadius: 12,
  popoverShadow: true,

  calHeaderTextColor: "#f0f0f5",
  calNavButtonColor: "#9090a8",
  calNavButtonHoverBackground: "#242430",

  dayNameColor: "#5a5a72",
  dayTextColor: "#c0c0d8",
  dayHoverBackground: "#242430",
  dayHoverTextColor: "#f0f0f5",
  dayBorderRadius: 8,
  dayCellSize: 36,

  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",

  todayTextColor: "#7c6cfc",

  pickerPopupBackground: "#1c1c22",
  pickerPopupBorderColor: "#2a2a38",
  pickerPopupItemHover: "#242430",
  pickerPopupSelectedBackground: "#7c6cfc",
  pickerPopupSelectedTextColor: "#ffffff",

  clockFaceBackground: "#141418",
  clockHandColor: "#7c6cfc",
  clockNumberColor: "#c0c0d8",
  clockNumberActiveBackground: "#7c6cfc",
  clockNumberActiveTextColor: "#ffffff",
  clockDisplayBackground: "#141418",
  clockDisplayTextColor: "#f0f0f5",
  clockAmPmBorderColor: "#2a2a38",
  clockAmPmActiveBackground: "#7c6cfc",
  clockAmPmActiveTextColor: "#ffffff",

  cancelButtonColor: "#9090a8",
  okButtonBackground: "#7c6cfc",
  okButtonTextColor: "#ffffff",

  fontSize: 13,
  allowFutureTime: false,
  animateOpen: true,
};

// ─── Light Preset ─────────────────────────────────────────────────────────────
export const lightDateTimeInputConfig: DateTimeInputConfig = {
  pickerMode: "datetime",

  inputBackground: "#ffffff",
  inputBorderColor: "#d4d4e0",
  inputBorderRadius: 10,
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputIconColor: "#9090a8",
  inputFocusBorderColor: "#6c5ce7",
  inputErrorBorderColor: "#ef4444",

  labelTextColor: "#52525b",
  labelFontSize: 13,

  popoverBackground: "#ffffff",
  popoverBorderColor: "#d4d4e0",
  popoverBorderRadius: 12,
  popoverShadow: true,

  calHeaderTextColor: "#1a1a2e",
  calNavButtonColor: "#9090a8",
  calNavButtonHoverBackground: "#f4f4f8",

  dayNameColor: "#9090a8",
  dayTextColor: "#1a1a2e",
  dayHoverBackground: "#f4f4f8",
  dayHoverTextColor: "#1a1a2e",
  dayBorderRadius: 8,
  dayCellSize: 36,

  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",

  todayTextColor: "#6c5ce7",

  pickerPopupBackground: "#ffffff",
  pickerPopupBorderColor: "#d4d4e0",
  pickerPopupItemHover: "#f4f4f8",
  pickerPopupSelectedBackground: "#6c5ce7",
  pickerPopupSelectedTextColor: "#ffffff",

  clockFaceBackground: "#f4f4f8",
  clockHandColor: "#6c5ce7",
  clockNumberColor: "#1a1a2e",
  clockNumberActiveBackground: "#6c5ce7",
  clockNumberActiveTextColor: "#ffffff",
  clockDisplayBackground: "#f4f4f8",
  clockDisplayTextColor: "#1a1a2e",
  clockAmPmBorderColor: "#d4d4e0",
  clockAmPmActiveBackground: "#6c5ce7",
  clockAmPmActiveTextColor: "#ffffff",

  cancelButtonColor: "#71717a",
  okButtonBackground: "#6c5ce7",
  okButtonTextColor: "#ffffff",

  fontSize: 13,
  allowFutureTime: false,
  animateOpen: true,
};

export const dateTimeInputModePresets: Record<
  DateTimeInputMode,
  DateTimeInputConfig
> = {
  dark: darkDateTimeInputConfig,
  light: lightDateTimeInputConfig,
};

export const defaultDateTimeInputConfig = darkDateTimeInputConfig;
