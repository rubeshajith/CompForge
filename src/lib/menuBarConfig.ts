// lib/menuBarConfig.ts

export type MenuBarMode = "dark" | "light";
export type MenuBarVariant = "topnav" | "segmented" | "commandbar";
export type PopupAnimation = "fade" | "slide" | "scale" | "none";
export type PopupPosition = "bottom-start" | "bottom-center" | "bottom-end";

export interface MenuBarConfig {
  // Variant
  variant: MenuBarVariant;

  // Bar appearance
  barBackground: string;
  barBorderColor: string;
  barBorderRadius: number;
  barPaddingX: number;
  barPaddingY: number;
  showBarShadow: boolean;
  barBlur: boolean;

  // Item (trigger) appearance
  itemTextColor: string;
  itemBackground: string;
  itemHoverBackground: string;
  itemHoverTextColor: string;
  itemActiveBackground: string;
  itemActiveTextColor: string;
  itemBorderRadius: number;
  itemFontSize: number;
  itemGap: number;

  // Popup appearance
  popupBackground: string;
  popupBorderColor: string;
  popupBorderRadius: number;
  popupShadow: boolean;
  popupMinWidth: number;

  // Popup option rows
  optionTextColor: string;
  optionBackground: string;
  optionHoverBackground: string;
  optionHoverTextColor: string;
  optionBorderRadius: number;
  optionFontSize: number;
  showOptionIcons: boolean;
  showOptionShortcuts: boolean;

  // Divider between option groups
  dividerColor: string;
  showDividers: boolean;

  // Animation
  popupAnimation: PopupAnimation;
  animationDuration: number;
}

export const darkMenuBarConfig: MenuBarConfig = {
  variant: "topnav",

  barBackground: "#141418",
  barBorderColor: "#2a2a38",
  barBorderRadius: 12,
  barPaddingX: 8,
  barPaddingY: 6,
  showBarShadow: true,
  barBlur: true,

  itemTextColor: "#9090a8",
  itemBackground: "transparent",
  itemHoverBackground: "#1c1c22",
  itemHoverTextColor: "#f0f0f5",
  itemActiveBackground: "#242430",
  itemActiveTextColor: "#f0f0f5",
  itemBorderRadius: 8,
  itemFontSize: 13,
  itemGap: 4,

  popupBackground: "#1c1c22",
  popupBorderColor: "#2a2a38",
  popupBorderRadius: 10,
  popupShadow: true,
  popupMinWidth: 200,

  optionTextColor: "#c0c0d8",
  optionBackground: "transparent",
  optionHoverBackground: "#242430",
  optionHoverTextColor: "#f0f0f5",
  optionBorderRadius: 6,
  optionFontSize: 13,
  showOptionIcons: true,
  showOptionShortcuts: true,

  dividerColor: "#2a2a38",
  showDividers: true,

  popupAnimation: "scale",
  animationDuration: 160,
};

export const lightMenuBarConfig: MenuBarConfig = {
  variant: "topnav",

  barBackground: "#ffffff",
  barBorderColor: "#d4d4e0",
  barBorderRadius: 12,
  barPaddingX: 8,
  barPaddingY: 6,
  showBarShadow: true,
  barBlur: false,

  itemTextColor: "#5a5a72",
  itemBackground: "transparent",
  itemHoverBackground: "#f4f4f8",
  itemHoverTextColor: "#1a1a2e",
  itemActiveBackground: "#ebebf2",
  itemActiveTextColor: "#1a1a2e",
  itemBorderRadius: 8,
  itemFontSize: 13,
  itemGap: 4,

  popupBackground: "#ffffff",
  popupBorderColor: "#d4d4e0",
  popupBorderRadius: 10,
  popupShadow: true,
  popupMinWidth: 200,

  optionTextColor: "#1a1a2e",
  optionBackground: "transparent",
  optionHoverBackground: "#f4f4f8",
  optionHoverTextColor: "#1a1a2e",
  optionBorderRadius: 6,
  optionFontSize: 13,
  showOptionIcons: true,
  showOptionShortcuts: true,

  dividerColor: "#d4d4e0",
  showDividers: true,

  popupAnimation: "scale",
  animationDuration: 160,
};

export const menuBarModePresets: Record<MenuBarMode, MenuBarConfig> = {
  dark: darkMenuBarConfig,
  light: lightMenuBarConfig,
};

export const defaultMenuBarConfig = darkMenuBarConfig;
