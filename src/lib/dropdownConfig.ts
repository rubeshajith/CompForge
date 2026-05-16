export interface DropdownConfig {
  // Appearance
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  placeholderColor: string;

  // Shape
  borderRadius: number;
  borderWidth: number;

  // Size
  fontSize: number;
  padding: number;
  width: number;

  // Behavior / Style
  showShadow: boolean;
  showArrowIcon: boolean;
  animateOpen: boolean;

  // Content
  placeholder: string;
}

export type DropdownMode = "dark" | "light";

export const darkDropdownConfig: DropdownConfig = {
  backgroundColor: "#1c1c22",
  textColor: "#f0f0f5",
  borderColor: "#2a2a38",
  accentColor: "#7c6cfc",
  placeholderColor: "#9090a8",
  borderRadius: 10,
  borderWidth: 1,
  fontSize: 14,
  padding: 12,
  width: 280,
  showShadow: true,
  showArrowIcon: true,
  animateOpen: true,
  placeholder: "Select an option",
};

export const lightDropdownConfig: DropdownConfig = {
  backgroundColor: "#ffffff",
  textColor: "#1a1a2e",
  borderColor: "#d4d4e0",
  accentColor: "#6c5ce7",
  placeholderColor: "#9090a8",
  borderRadius: 10,
  borderWidth: 1,
  fontSize: 14,
  padding: 12,
  width: 280,
  showShadow: true,
  showArrowIcon: true,
  animateOpen: true,
  placeholder: "Select an option",
};

export const modePresets: Record<DropdownMode, DropdownConfig> = {
  dark: darkDropdownConfig,
  light: lightDropdownConfig,
};

// Alias so existing imports don't break
export const defaultDropdownConfig = darkDropdownConfig;

export const DROPDOWN_OPTIONS = [
  "Design System",
  "React Components",
  "TypeScript",
  "Next.js",
  "Node.js",
];
