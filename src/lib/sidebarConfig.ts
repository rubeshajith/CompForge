// /lib/sidebarConfig.ts

export type SidebarMode = "dark" | "light";

export interface SidebarConfig {
  // Layout
  sidebarWidth: number; // expanded width in px
  collapsedWidth: number; // collapsed width in px
  defaultCollapsed: boolean; // start collapsed

  // Shell
  backgroundColor: string;
  borderColor: string;
  borderRadius: number; // outer radius of the sidebar card

  // Logo area
  logoAreaBorderColor: string;

  // Item — default state
  itemTextColor: string;
  itemIconColor: string;
  itemHoverBackground: string;
  itemHoverTextColor: string;
  itemBorderRadius: number;

  // Item — active state
  itemActiveBackground: string;
  itemActiveTextColor: string;
  itemActiveIconColor: string;
  itemActiveIndicatorColor: string; // left bar

  // Section label
  sectionLabelColor: string;

  // Submenu items
  submenuTextColor: string;
  submenuActiveTextColor: string;
  submenuActiveBackground: string;
  submenuDotColor: string; // active dot glow color

  // Popout panel (collapsed + submenu hover)
  popoutBackground: string;
  popoutBorderColor: string;
  popoutHeaderColor: string;

  // Tooltip (collapsed + no-submenu hover)
  tooltipBackground: string;
  tooltipBorderColor: string;
  tooltipTextColor: string;

  // Collapse button
  collapseButtonBackground: string;
  collapseButtonBorderColor: string;
  collapseButtonIconColor: string;
  collapseButtonHoverBorderColor: string;
  collapseButtonHoverIconColor: string;

  // Badge
  badgeBackground: string;
  badgeBorderColor: string;
  badgeTextColor: string;

  // Accent color (drives indicator + active states)
  accentColor: string;
  accentDim: string;

  // Typography
  fontSize: number;

  // Chevron
  chevronColor: string;

  // Footer border
  footerBorderColor: string;

  // Shadow
  showShadow: boolean;
}

// ─── Dark preset ──────────────────────────────────────────────────────────────

export const darkSidebarConfig: SidebarConfig = {
  sidebarWidth: 240,
  collapsedWidth: 64,
  defaultCollapsed: false,

  backgroundColor: "#0c0c0f",
  borderColor: "#2a2a38",
  borderRadius: 0,

  logoAreaBorderColor: "#1c1c22",

  itemTextColor: "#9090a8",
  itemIconColor: "#9090a8",
  itemHoverBackground: "#141418",
  itemHoverTextColor: "#f0f0f5",
  itemBorderRadius: 8,

  itemActiveBackground: "#7c6cfc22",
  itemActiveTextColor: "#9d91fd",
  itemActiveIconColor: "#7c6cfc",
  itemActiveIndicatorColor: "#7c6cfc",

  sectionLabelColor: "#5a5a72",

  submenuTextColor: "#5a5a72",
  submenuActiveTextColor: "#9d91fd",
  submenuActiveBackground: "#7c6cfc12",
  submenuDotColor: "#7c6cfc",

  popoutBackground: "#141418",
  popoutBorderColor: "#2a2a38",
  popoutHeaderColor: "#5a5a72",

  tooltipBackground: "#242430",
  tooltipBorderColor: "#2a2a38",
  tooltipTextColor: "#f0f0f5",

  collapseButtonBackground: "#141418",
  collapseButtonBorderColor: "#2a2a38",
  collapseButtonIconColor: "#9090a8",
  collapseButtonHoverBorderColor: "#7c6cfc",
  collapseButtonHoverIconColor: "#7c6cfc",

  badgeBackground: "#7c6cfc22",
  badgeBorderColor: "#7c6cfc44",
  badgeTextColor: "#9d91fd",

  accentColor: "#7c6cfc",
  accentDim: "#7c6cfc22",

  fontSize: 13,

  chevronColor: "#5a5a72",
  footerBorderColor: "#1c1c22",
  showShadow: false,
};

// ─── Light preset ─────────────────────────────────────────────────────────────

export const lightSidebarConfig: SidebarConfig = {
  sidebarWidth: 240,
  collapsedWidth: 64,
  defaultCollapsed: false,

  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  borderRadius: 0,

  logoAreaBorderColor: "#e8e8f0",

  itemTextColor: "#7070888",
  itemIconColor: "#9090a8",
  itemHoverBackground: "#f4f4f8",
  itemHoverTextColor: "#1a1a2e",
  itemBorderRadius: 8,

  itemActiveBackground: "#6c5ce715",
  itemActiveTextColor: "#6c5ce7",
  itemActiveIconColor: "#6c5ce7",
  itemActiveIndicatorColor: "#6c5ce7",

  sectionLabelColor: "#a0a0b8",

  submenuTextColor: "#a0a0b8",
  submenuActiveTextColor: "#6c5ce7",
  submenuActiveBackground: "#6c5ce710",
  submenuDotColor: "#6c5ce7",

  popoutBackground: "#ffffff",
  popoutBorderColor: "#d4d4e0",
  popoutHeaderColor: "#a0a0b8",

  tooltipBackground: "#1a1a2e",
  tooltipBorderColor: "#2a2a38",
  tooltipTextColor: "#f0f0f5",

  collapseButtonBackground: "#ffffff",
  collapseButtonBorderColor: "#d4d4e0",
  collapseButtonIconColor: "#9090a8",
  collapseButtonHoverBorderColor: "#6c5ce7",
  collapseButtonHoverIconColor: "#6c5ce7",

  badgeBackground: "#6c5ce715",
  badgeBorderColor: "#6c5ce730",
  badgeTextColor: "#6c5ce7",

  accentColor: "#6c5ce7",
  accentDim: "#6c5ce715",

  fontSize: 13,

  chevronColor: "#a0a0b8",
  footerBorderColor: "#e8e8f0",
  showShadow: true,
};

// ─── Presets map ──────────────────────────────────────────────────────────────

export const sidebarModePresets: Record<SidebarMode, SidebarConfig> = {
  dark: darkSidebarConfig,
  light: lightSidebarConfig,
};

export const defaultSidebarConfig = darkSidebarConfig;
