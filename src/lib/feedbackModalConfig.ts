export type FeedbackModalMode = "dark" | "light";
export type FeedbackIssueType = "bug" | "feature" | "usability" | "other";

export interface FeedbackModalConfig {
  // Container
  backdropColor: string;
  modalBackground: string;
  modalBorderColor: string;
  modalBorderRadius: number;
  modalWidth: number;
  showShadow: boolean;

  // Header
  headerBackground: string;
  headerBorderColor: string;
  headerIconColor: string;
  headerTextColor: string;
  closeButtonColor: string;
  closeButtonHoverBackground: string;

  // Body
  bodyBackground: string;
  labelColor: string;
  inputBackground: string;
  inputBorderColor: string;
  inputFocusBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputBorderRadius: number;

  // Star rating
  starEmptyColor: string;
  starFilledColor: string;
  starHoverColor: string;
  starSize: number;

  // Attachments
  attachButtonBackground: string;
  attachButtonBorderColor: string;
  attachButtonTextColor: string;
  attachButtonHoverBackground: string;
  thumbnailBorderColor: string;
  removeBtnBackground: string;
  removeBtnTextColor: string;

  // Footer
  footerBackground: string;
  footerBorderColor: string;
  badgeBackground: string;
  badgeTextColor: string;

  // Buttons
  cancelTextColor: string;
  cancelHoverBackground: string;
  submitBackground: string;
  submitTextColor: string;
  submitHoverBackground: string;

  // Typography
  fontSize: number;
  fontFamily: string;

  // Behavior
  animateOpen: boolean;
}

export const darkFeedbackModalConfig: FeedbackModalConfig = {
  // Container
  backdropColor: "rgba(0,0,0,0.6)",
  modalBackground: "#1c1c22",
  modalBorderColor: "#2a2a38",
  modalBorderRadius: 16,
  modalWidth: 520,
  showShadow: true,

  // Header
  headerBackground: "#141418",
  headerBorderColor: "#2a2a38",
  headerIconColor: "#7c6cfc",
  headerTextColor: "#f0f0f5",
  closeButtonColor: "#9090a8",
  closeButtonHoverBackground: "#242430",

  // Body
  bodyBackground: "#1c1c22",
  labelColor: "#9090a8",
  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputFocusBorderColor: "#7c6cfc",
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputBorderRadius: 10,

  // Star rating
  starEmptyColor: "#2a2a38",
  starFilledColor: "#7c6cfc",
  starHoverColor: "#9d91fd",
  starSize: 32,

  // Attachments
  attachButtonBackground: "#141418",
  attachButtonBorderColor: "#2a2a38",
  attachButtonTextColor: "#9090a8",
  attachButtonHoverBackground: "#242430",
  thumbnailBorderColor: "#2a2a38",
  removeBtnBackground: "#f87171",
  removeBtnTextColor: "#ffffff",

  // Footer
  footerBackground: "#141418",
  footerBorderColor: "#2a2a38",
  badgeBackground: "#7c6cfc22",
  badgeTextColor: "#9d91fd",

  // Buttons
  cancelTextColor: "#9090a8",
  cancelHoverBackground: "#242430",
  submitBackground: "#7c6cfc",
  submitTextColor: "#ffffff",
  submitHoverBackground: "#9d91fd",

  // Typography
  fontSize: 13,
  fontFamily: "'Instrument Sans', sans-serif",

  // Behavior
  animateOpen: true,
};

export const lightFeedbackModalConfig: FeedbackModalConfig = {
  // Container
  backdropColor: "rgba(0,0,0,0.3)",
  modalBackground: "#ffffff",
  modalBorderColor: "#e2e2ee",
  modalBorderRadius: 16,
  modalWidth: 520,
  showShadow: true,

  // Header
  headerBackground: "#f8f8fc",
  headerBorderColor: "#e2e2ee",
  headerIconColor: "#6c5ce7",
  headerTextColor: "#1a1a2e",
  closeButtonColor: "#9090a8",
  closeButtonHoverBackground: "#f0f0f8",

  // Body
  bodyBackground: "#ffffff",
  labelColor: "#6060788",
  inputBackground: "#f8f8fc",
  inputBorderColor: "#e2e2ee",
  inputFocusBorderColor: "#6c5ce7",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputBorderRadius: 10,

  // Star rating
  starEmptyColor: "#e2e2ee",
  starFilledColor: "#6c5ce7",
  starHoverColor: "#9d91fd",
  starSize: 32,

  // Attachments
  attachButtonBackground: "#f8f8fc",
  attachButtonBorderColor: "#e2e2ee",
  attachButtonTextColor: "#6060788",
  attachButtonHoverBackground: "#f0f0f8",
  thumbnailBorderColor: "#e2e2ee",
  removeBtnBackground: "#f87171",
  removeBtnTextColor: "#ffffff",

  // Footer
  footerBackground: "#f8f8fc",
  footerBorderColor: "#e2e2ee",
  badgeBackground: "#6c5ce71a",
  badgeTextColor: "#6c5ce7",

  // Buttons
  cancelTextColor: "#9090a8",
  cancelHoverBackground: "#f0f0f8",
  submitBackground: "#6c5ce7",
  submitTextColor: "#ffffff",
  submitHoverBackground: "#5a4bd4",

  // Typography
  fontSize: 13,
  fontFamily: "'Instrument Sans', sans-serif",

  // Behavior
  animateOpen: true,
};

export const feedbackModalModePresets: Record<
  FeedbackModalMode,
  FeedbackModalConfig
> = {
  dark: darkFeedbackModalConfig,
  light: lightFeedbackModalConfig,
};

export const defaultFeedbackModalConfig = darkFeedbackModalConfig;
