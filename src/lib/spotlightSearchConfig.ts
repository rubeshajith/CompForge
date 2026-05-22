export type SpotlightMode = "dark" | "light";

export interface SpotlightConfig {
  // Container
  backdropColor: string;
  panelBackground: string;
  panelBorderColor: string;
  panelBorderRadius: number;
  panelWidth: number;
  showShadow: boolean;

  // Search Input
  inputBackground: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputIconColor: string;
  inputBorderRadius: number;

  // Section Headers
  sectionLabelColor: string;

  // Items (default)
  itemBackground: string;
  itemHoverBackground: string;
  itemTextColor: string;
  itemSubtextColor: string;
  itemIconColor: string;
  itemBorderRadius: number;

  // Active / Selected Item
  activeItemBackground: string;
  activeItemTextColor: string;
  activeItemIconColor: string;
  activeItemBorderColor: string;

  // Keyboard Shortcuts
  kbdBackground: string;
  kbdBorderColor: string;
  kbdTextColor: string;
  kbdActiveBackground: string;
  kbdActiveBorderColor: string;
  kbdActiveTextColor: string;

  // Footer
  footerBackground: string;
  footerBorderColor: string;
  footerTextColor: string;
  footerKbdBackground: string;
  footerKbdBorderColor: string;

  // Typography
  fontSize: number;

  // Behavior
  animateOpen: boolean;
  showFooter: boolean;
  showCategories: boolean;
}

export const darkSpotlightConfig: SpotlightConfig = {
  backdropColor: "rgba(0,0,0,0.6)",
  panelBackground: "#141418",
  panelBorderColor: "#2a2a38",
  panelBorderRadius: 14,
  panelWidth: 620,
  showShadow: true,

  inputBackground: "#1c1c22",
  inputBorderColor: "#2a2a38",
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputIconColor: "#5a5a72",
  inputBorderRadius: 10,

  sectionLabelColor: "#5a5a72",

  itemBackground: "transparent",
  itemHoverBackground: "#1c1c22",
  itemTextColor: "#c0c0d8",
  itemSubtextColor: "#5a5a72",
  itemIconColor: "#9090a8",
  itemBorderRadius: 8,

  activeItemBackground: "#7c6cfc",
  activeItemTextColor: "#ffffff",
  activeItemIconColor: "#ffffff",
  activeItemBorderColor: "transparent",

  kbdBackground: "#1c1c22",
  kbdBorderColor: "#2a2a38",
  kbdTextColor: "#9090a8",
  kbdActiveBackground: "rgba(255,255,255,0.15)",
  kbdActiveBorderColor: "rgba(255,255,255,0.2)",
  kbdActiveTextColor: "#ffffff",

  footerBackground: "#0c0c0f",
  footerBorderColor: "#2a2a38",
  footerTextColor: "#5a5a72",
  footerKbdBackground: "#1c1c22",
  footerKbdBorderColor: "#2a2a38",

  fontSize: 13,
  animateOpen: true,
  showFooter: true,
  showCategories: true,
};

export const lightSpotlightConfig: SpotlightConfig = {
  backdropColor: "rgba(0,0,0,0.3)",
  panelBackground: "#ffffff",
  panelBorderColor: "#d4d4e0",
  panelBorderRadius: 14,
  panelWidth: 620,
  showShadow: true,

  inputBackground: "#f4f4f8",
  inputBorderColor: "#d4d4e0",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputIconColor: "#9090a8",
  inputBorderRadius: 10,

  sectionLabelColor: "#9090a8",

  itemBackground: "transparent",
  itemHoverBackground: "#f4f4f8",
  itemTextColor: "#1a1a2e",
  itemSubtextColor: "#9090a8",
  itemIconColor: "#9090a8",
  itemBorderRadius: 8,

  activeItemBackground: "#6c5ce7",
  activeItemTextColor: "#ffffff",
  activeItemIconColor: "#ffffff",
  activeItemBorderColor: "transparent",

  kbdBackground: "#f4f4f8",
  kbdBorderColor: "#d4d4e0",
  kbdTextColor: "#9090a8",
  kbdActiveBackground: "rgba(255,255,255,0.25)",
  kbdActiveBorderColor: "rgba(255,255,255,0.35)",
  kbdActiveTextColor: "#ffffff",

  footerBackground: "#f4f4f8",
  footerBorderColor: "#d4d4e0",
  footerTextColor: "#9090a8",
  footerKbdBackground: "#e8e8f0",
  footerKbdBorderColor: "#d4d4e0",

  fontSize: 13,
  animateOpen: true,
  showFooter: true,
  showCategories: true,
};

export const spotlightModePresets: Record<SpotlightMode, SpotlightConfig> = {
  dark: darkSpotlightConfig,
  light: lightSpotlightConfig,
};

export const defaultSpotlightConfig = darkSpotlightConfig;
