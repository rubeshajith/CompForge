export interface MultiSelectConfig {
  // Colors
  triggerBackground: string;
  triggerBorderColor: string;
  triggerTextColor: string;
  placeholderColor: string;
  dropdownBackground: string;
  dropdownBorderColor: string;
  optionHoverBackground: string;
  selectedOptionBackground: string;
  selectedOptionColor: string;
  badgeBackground: string;
  badgeTextColor: string;
  accentColor: string;
  searchTextColor: string;

  // Shape
  triggerBorderRadius: number;
  dropdownBorderRadius: number;
  badgeBorderRadius: number;

  // Size
  fontSize: number;
  padding: number;
  width: number;

  // Options
  maxCount: number;
  showShadow: boolean;
  animateOpen: boolean;
  placeholder: string;
}

export type MultiSelectMode = "dark" | "light";

export const darkMultiSelectConfig: MultiSelectConfig = {
  triggerBackground: "#1c1c22",
  triggerBorderColor: "#2a2a38",
  triggerTextColor: "#f0f0f5",
  placeholderColor: "#9090a8",
  dropdownBackground: "#1c1c22",
  dropdownBorderColor: "#2a2a38",
  optionHoverBackground: "#242430",
  selectedOptionBackground: "#7c6cfc22",
  selectedOptionColor: "#7c6cfc",
  badgeBackground: "#7c6cfc",
  badgeTextColor: "#ffffff",
  accentColor: "#7c6cfc",
  searchTextColor: "#f0f0f5",
  triggerBorderRadius: 10,
  dropdownBorderRadius: 10,
  badgeBorderRadius: 20,
  fontSize: 14,
  padding: 10,
  width: 300,
  maxCount: 2,
  showShadow: true,
  animateOpen: true,
  placeholder: "Select items...",
};

export const lightMultiSelectConfig: MultiSelectConfig = {
  triggerBackground: "#ffffff",
  triggerBorderColor: "#d4d4e0",
  triggerTextColor: "#1a1a2e",
  placeholderColor: "#9090a8",
  dropdownBackground: "#ffffff",
  dropdownBorderColor: "#d4d4e0",
  optionHoverBackground: "#f4f4f8",
  selectedOptionBackground: "#eff6ff",
  selectedOptionColor: "#6c5ce7",
  badgeBackground: "#6c5ce7",
  badgeTextColor: "#ffffff",
  accentColor: "#6c5ce7",
  searchTextColor: "#1a1a2e",
  triggerBorderRadius: 10,
  dropdownBorderRadius: 10,
  badgeBorderRadius: 20,
  fontSize: 14,
  padding: 10,
  width: 300,
  maxCount: 2,
  showShadow: true,
  animateOpen: true,
  placeholder: "Select items...",
};

export const multiSelectModePresets: Record<
  MultiSelectMode,
  MultiSelectConfig
> = {
  dark: darkMultiSelectConfig,
  light: lightMultiSelectConfig,
};

export const defaultMultiSelectConfig = darkMultiSelectConfig;

export const MULTI_SELECT_OPTIONS = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "graphql", label: "GraphQL" },
  { value: "prisma", label: "Prisma" },
];
