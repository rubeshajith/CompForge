// ─── Variant Types ────────────────────────────────────────────────────────────

export type CheckboxVariant =
  | "morph"
  | "stamp"
  | "slide"
  | "ripple"
  | "neon"
  | "flip"
  | "scribble"
  | "glitch"
  | "elastic"
  | "unfold";

export const CHECKBOX_VARIANTS: CheckboxVariant[] = [
  "morph",
  "stamp",
  "slide",
  "ripple",
  "neon",
  "flip",
  "scribble",
  "glitch",
  "elastic",
  "unfold",
];

export const VARIANT_LABELS: Record<CheckboxVariant, string> = {
  morph: "Morph",
  stamp: "Stamp",
  slide: "Slide",
  ripple: "Ripple",
  neon: "Neon",
  flip: "Flip",
  scribble: "Scribble",
  glitch: "Glitch",
  elastic: "Elastic",
  unfold: "Unfold",
};

export const VARIANT_DESCRIPTIONS: Record<CheckboxVariant, string> = {
  morph: "Border morphs & fills, checkmark draws on",
  stamp: "Bold stamp press with scale bounce",
  slide: "Checkmark slides in from the left",
  ripple: "Ink ripple radiates from center",
  neon: "Glowing neon flicker on check",
  flip: "3D card flip reveals checked face",
  scribble: "Hand-drawn SVG pen stroke",
  glitch: "Digital glitch with channel split",
  elastic: "Squish & elastic bounce back",
  unfold: "Corner unfolds to reveal check",
};

// ─── Config Interface ─────────────────────────────────────────────────────────

export interface CheckboxConfig {
  variant: CheckboxVariant;

  // Box geometry
  size: number;
  borderRadius: number;

  // Unchecked state
  uncheckedBackground: string;
  uncheckedBorderColor: string;
  uncheckedBorderWidth: number;

  // Checked state
  checkedBackground: string;
  checkedBorderColor: string;
  checkmarkColor: string;

  // Label
  labelColor: string;
  labelFontSize: number;
  labelGap: number;

  // Accent (ripple, neon glow, glitch colors)
  accentColor: string;
  accentSecondary: string; // used by glitch second channel

  // Preview layout
  showLabels: boolean;
  itemGap: number;
}

// ─── Mode ─────────────────────────────────────────────────────────────────────

export type CheckboxMode = "dark" | "light";

export const darkCheckboxConfig: CheckboxConfig = {
  variant: "morph",

  size: 22,
  borderRadius: 6,

  uncheckedBackground: "#141418",
  uncheckedBorderColor: "#2a2a38",
  uncheckedBorderWidth: 2,

  checkedBackground: "#7c6cfc",
  checkedBorderColor: "#7c6cfc",
  checkmarkColor: "#ffffff",

  labelColor: "#c0c0d8",
  labelFontSize: 14,
  labelGap: 10,

  accentColor: "#7c6cfc",
  accentSecondary: "#fc6c8f",

  showLabels: true,
  itemGap: 20,
};

export const lightCheckboxConfig: CheckboxConfig = {
  ...darkCheckboxConfig,

  uncheckedBackground: "#ffffff",
  uncheckedBorderColor: "#d4d4e0",

  checkedBackground: "#6c5ce7",
  checkedBorderColor: "#6c5ce7",
  checkmarkColor: "#ffffff",

  labelColor: "#1a1a2e",
  accentColor: "#6c5ce7",
  accentSecondary: "#e84393",
};

export const checkboxModePresets: Record<CheckboxMode, CheckboxConfig> = {
  dark: darkCheckboxConfig,
  light: lightCheckboxConfig,
};

export const defaultCheckboxConfig = darkCheckboxConfig;
