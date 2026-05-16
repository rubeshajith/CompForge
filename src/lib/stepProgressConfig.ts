// /lib/stepProgressConfig.ts

export type StepProgressMode = "dark" | "light";
export type StepShape = "circle" | "diamond" | "square" | "hexagon";
export type StepLabelType = "number" | "letter" | "roman" | "icon" | "none";
export type ConnectorStyle = "solid" | "dashed" | "dotted";
export type Orientation = "horizontal" | "vertical";

export interface StepProgressConfig {
  // Layout
  orientation: Orientation;
  stepCount: number; // 2–5

  // Node appearance
  nodeShape: StepShape;
  nodeSize: number;
  labelType: StepLabelType;
  nodeFontSize: number;

  // Colors — completed
  completedBackground: string;
  completedBorderColor: string;
  completedTextColor: string;

  // Colors — active (current step)
  activeBackground: string;
  activeBorderColor: string;
  activeTextColor: string;
  activeGlow: boolean;

  // Colors — incomplete
  incompleteBackground: string;
  incompleteBorderColor: string;
  incompleteTextColor: string;

  // Connector
  connectorStyle: ConnectorStyle;
  connectorThickness: number;
  connectorCompletedColor: string;
  connectorIncompleteColor: string;
  connectorLength: number;

  // Step labels
  stepLabelColor: string;
  stepLabelActiveColor: string;
  stepLabelFontSize: number;
  showStepLabels: boolean;

  // Animation
  animateTransitions: boolean;

  // Shadow
  showNodeShadow: boolean;
}

export const darkStepProgressConfig: StepProgressConfig = {
  orientation: "horizontal",
  stepCount: 4,
  nodeShape: "circle",
  nodeSize: 40,
  labelType: "number",
  nodeFontSize: 14,

  completedBackground: "#7c6cfc",
  completedBorderColor: "#7c6cfc",
  completedTextColor: "#ffffff",

  activeBackground: "#141418",
  activeBorderColor: "#7c6cfc",
  activeTextColor: "#7c6cfc",
  activeGlow: true,

  incompleteBackground: "#1c1c22",
  incompleteBorderColor: "#2a2a38",
  incompleteTextColor: "#5a5a72",

  connectorStyle: "solid",
  connectorThickness: 2,
  connectorCompletedColor: "#7c6cfc",
  connectorIncompleteColor: "#2a2a38",
  connectorLength: 80,

  stepLabelColor: "#5a5a72",
  stepLabelActiveColor: "#f0f0f5",
  stepLabelFontSize: 13,
  showStepLabels: true,

  animateTransitions: true,
  showNodeShadow: true,
};

export const lightStepProgressConfig: StepProgressConfig = {
  orientation: "horizontal",
  stepCount: 4,
  nodeShape: "circle",
  nodeSize: 40,
  labelType: "number",
  nodeFontSize: 14,

  completedBackground: "#6c5ce7",
  completedBorderColor: "#6c5ce7",
  completedTextColor: "#ffffff",

  activeBackground: "#ffffff",
  activeBorderColor: "#6c5ce7",
  activeTextColor: "#6c5ce7",
  activeGlow: true,

  incompleteBackground: "#f4f4f8",
  incompleteBorderColor: "#d4d4e0",
  incompleteTextColor: "#9090a8",

  connectorStyle: "solid",
  connectorThickness: 2,
  connectorCompletedColor: "#6c5ce7",
  connectorIncompleteColor: "#d4d4e0",
  connectorLength: 80,

  stepLabelColor: "#9090a8",
  stepLabelActiveColor: "#1a1a2e",
  stepLabelFontSize: 13,
  showStepLabels: true,

  animateTransitions: true,
  showNodeShadow: false,
};

export const stepProgressModePresets: Record<
  StepProgressMode,
  StepProgressConfig
> = {
  dark: darkStepProgressConfig,
  light: lightStepProgressConfig,
};

export const defaultStepProgressConfig = darkStepProgressConfig;
