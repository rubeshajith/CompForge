export type EmojiMode = "dark" | "light";

export type EmojiVariant =
  | "happy"
  | "cool"
  | "love"
  | "fire"
  | "explode"
  | "sleepy";

export type EmojiAnimation =
  | "bounce"
  | "spin"
  | "pulse"
  | "shake"
  | "float"
  | "rubber";

export interface EmojiConfig {
  // Selection
  variant: EmojiVariant;
  animation: EmojiAnimation;

  // Size
  size: number; // px

  // Face colors
  faceColor: string;
  faceShadeColor: string;
  outlineColor: string;

  // Feature colors
  eyeColor: string;
  pupilColor: string;
  mouthColor: string;
  cheekColor: string;
  accentColor: string; // tears, stars, flames etc.

  // Container
  backgroundColor: string;
  showBackground: boolean;
  backgroundRadius: number; // 0 = square, 50 = circle
  backgroundPadding: number;

  // Animation
  animationDuration: number; // ms
  animationEnabled: boolean;

  // Display
  showShadow: boolean;
}

export const darkEmojiConfig: EmojiConfig = {
  variant: "happy",
  animation: "bounce",
  size: 120,
  faceColor: "#fbbf24",
  faceShadeColor: "#f59e0b",
  outlineColor: "#92400e",
  eyeColor: "#1c1917",
  pupilColor: "#fef3c7",
  mouthColor: "#92400e",
  cheekColor: "#f87171",
  accentColor: "#7c6cfc",
  backgroundColor: "#1c1c22",
  showBackground: true,
  backgroundRadius: 50,
  backgroundPadding: 24,
  animationDuration: 800,
  animationEnabled: true,
  showShadow: true,
};

export const lightEmojiConfig: EmojiConfig = {
  variant: "happy",
  animation: "bounce",
  size: 120,
  faceColor: "#fbbf24",
  faceShadeColor: "#f59e0b",
  outlineColor: "#92400e",
  eyeColor: "#1c1917",
  pupilColor: "#fef3c7",
  mouthColor: "#92400e",
  cheekColor: "#fca5a5",
  accentColor: "#6c5ce7",
  backgroundColor: "#f0f0f8",
  showBackground: true,
  backgroundRadius: 50,
  backgroundPadding: 24,
  animationDuration: 800,
  animationEnabled: true,
  showShadow: true,
};

export const emojiModePresets: Record<EmojiMode, EmojiConfig> = {
  dark: darkEmojiConfig,
  light: lightEmojiConfig,
};

export const defaultEmojiConfig = darkEmojiConfig;
