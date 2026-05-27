// /lib/aiChatConfig.ts

export type AIChatMode = "dark" | "light";
export type BubbleStyle = "rounded" | "sharp" | "pill";
export type TypingStyle = "dots" | "pulse" | "bar";

export interface AIChatConfig {
  // Container
  containerBackground: string;
  containerBorderColor: string;
  containerBorderRadius: number;
  containerWidth: number;
  containerHeight: number;
  showShadow: boolean;

  // Header
  headerBackground: string;
  headerTextColor: string;
  headerBorderColor: string;
  avatarBackground: string;
  avatarColor: string;
  statusDotColor: string;

  // User Bubble
  userBubbleBackground: string;
  userBubbleTextColor: string;
  userBubbleBorderRadius: number;

  // AI Bubble
  aiBubbleBackground: string;
  aiBubbleTextColor: string;
  aiBubbleBorderColor: string;
  aiBubbleBorderRadius: number;

  // Typing Indicator
  typingDotColor: string;
  typingBackground: string;
  typingStyle: TypingStyle;

  // Streaming text
  streamingCursorColor: string;
  streamingTextColor: string;

  // AI Response Card
  cardBackground: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardAccentColor: string;
  cardTextColor: string;
  cardLabelColor: string;

  // Prompt Suggestions
  suggestionBackground: string;
  suggestionBorderColor: string;
  suggestionTextColor: string;
  suggestionHoverBackground: string;
  suggestionBorderRadius: number;

  // Input area
  inputBackground: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  sendButtonBackground: string;
  sendButtonColor: string;
  sendButtonBorderRadius: number;

  // Global
  accentColor: string;
  fontSize: number;
  messageFontSize: number;
  bubbleStyle: BubbleStyle;
  animateMessages: boolean;
  showTimestamps: boolean;
}

export const darkAIChatConfig: AIChatConfig = {
  // Container
  containerBackground: "#0c0c0f",
  containerBorderColor: "#2a2a38",
  containerBorderRadius: 16,
  containerWidth: 420,
  containerHeight: 600,
  showShadow: true,

  // Header
  headerBackground: "#141418",
  headerTextColor: "#f0f0f5",
  headerBorderColor: "#2a2a38",
  avatarBackground: "#7c6cfc22",
  avatarColor: "#7c6cfc",
  statusDotColor: "#4ade80",

  // User Bubble
  userBubbleBackground: "#7c6cfc",
  userBubbleTextColor: "#ffffff",
  userBubbleBorderRadius: 18,

  // AI Bubble
  aiBubbleBackground: "#1c1c22",
  aiBubbleTextColor: "#c0c0d8",
  aiBubbleBorderColor: "#2a2a38",
  aiBubbleBorderRadius: 18,

  // Typing
  typingDotColor: "#7c6cfc",
  typingBackground: "#1c1c22",
  typingStyle: "dots",

  // Streaming
  streamingCursorColor: "#7c6cfc",
  streamingTextColor: "#c0c0d8",

  // Card
  cardBackground: "#141418",
  cardBorderColor: "#2a2a38",
  cardBorderRadius: 12,
  cardAccentColor: "#7c6cfc",
  cardTextColor: "#c0c0d8",
  cardLabelColor: "#5a5a72",

  // Suggestions
  suggestionBackground: "#1c1c22",
  suggestionBorderColor: "#2a2a38",
  suggestionTextColor: "#9090a8",
  suggestionHoverBackground: "#242430",
  suggestionBorderRadius: 20,

  // Input
  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  sendButtonBackground: "#7c6cfc",
  sendButtonColor: "#ffffff",
  sendButtonBorderRadius: 10,

  // Global
  accentColor: "#7c6cfc",
  fontSize: 13,
  messageFontSize: 14,
  bubbleStyle: "rounded",
  animateMessages: true,
  showTimestamps: true,
};

export const lightAIChatConfig: AIChatConfig = {
  // Container
  containerBackground: "#ffffff",
  containerBorderColor: "#d4d4e0",
  containerBorderRadius: 16,
  containerWidth: 420,
  containerHeight: 600,
  showShadow: true,

  // Header
  headerBackground: "#f8f8fc",
  headerTextColor: "#1a1a2e",
  headerBorderColor: "#d4d4e0",
  avatarBackground: "#6c5ce71a",
  avatarColor: "#6c5ce7",
  statusDotColor: "#4ade80",

  // User Bubble
  userBubbleBackground: "#6c5ce7",
  userBubbleTextColor: "#ffffff",
  userBubbleBorderRadius: 18,

  // AI Bubble
  aiBubbleBackground: "#f4f4f8",
  aiBubbleTextColor: "#1a1a2e",
  aiBubbleBorderColor: "#d4d4e0",
  aiBubbleBorderRadius: 18,

  // Typing
  typingDotColor: "#6c5ce7",
  typingBackground: "#f4f4f8",
  typingStyle: "dots",

  // Streaming
  streamingCursorColor: "#6c5ce7",
  streamingTextColor: "#1a1a2e",

  // Card
  cardBackground: "#f8f8fc",
  cardBorderColor: "#d4d4e0",
  cardBorderRadius: 12,
  cardAccentColor: "#6c5ce7",
  cardTextColor: "#1a1a2e",
  cardLabelColor: "#9090a8",

  // Suggestions
  suggestionBackground: "#f4f4f8",
  suggestionBorderColor: "#d4d4e0",
  suggestionTextColor: "#5a5a72",
  suggestionHoverBackground: "#eaeaf0",
  suggestionBorderRadius: 20,

  // Input
  inputBackground: "#f8f8fc",
  inputBorderColor: "#d4d4e0",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  sendButtonBackground: "#6c5ce7",
  sendButtonColor: "#ffffff",
  sendButtonBorderRadius: 10,

  // Global
  accentColor: "#6c5ce7",
  fontSize: 13,
  messageFontSize: 14,
  bubbleStyle: "rounded",
  animateMessages: true,
  showTimestamps: true,
};

export const aiChatModePresets: Record<AIChatMode, AIChatConfig> = {
  dark: darkAIChatConfig,
  light: lightAIChatConfig,
};

export const defaultAIChatConfig: AIChatConfig = darkAIChatConfig;
