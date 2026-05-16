// /lib/signupModalConfig.ts

export type SignupModalMode = "dark" | "light";

export interface CustomField {
  id: string;
  type: "text" | "email" | "password" | "number" | "tel";
  label: string;
  placeholder: string;
}

export interface CustomDropdown {
  id: string;
  label: string;
  options: string[]; // comma-separated options as array
}

export interface SignupModalConfig {
  // Container
  backdropBlur: boolean;
  modalWidth: number;
  modalBorderRadius: number;
  modalBackground: string;
  modalBorderColor: string;
  showShadow: boolean;

  // Branding header
  showBrandingHeader: boolean;
  accentColor: string;
  accentIconColor: string;
  headingText: string;
  subheadingText: string;
  headingColor: string;
  subheadingColor: string;

  // Fields (fixed)
  showFullName: boolean;
  showEmail: boolean;
  showPassword: boolean;
  showPasswordStrength: boolean;
  showTermsCheckbox: boolean;

  // Input styling
  inputBackground: string;
  inputBorderColor: string;
  inputFocusBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputBorderRadius: number;
  labelColor: string;

  // CTA Button
  ctaLabel: string;
  ctaBackground: string;
  ctaTextColor: string;
  ctaBorderRadius: number;

  // Social buttons
  showSocialButtons: boolean;

  // Footer
  footerBackground: string;
  footerTextColor: string;

  // Dynamic fields added by user
  customFields: CustomField[];
  customDropdowns: CustomDropdown[];

  // Typography
  fontSize: number;
  fontFamily: string;
}

export const darkSignupModalConfig: SignupModalConfig = {
  backdropBlur: true,
  modalWidth: 480,
  modalBorderRadius: 16,
  modalBackground: "#1c1c22",
  modalBorderColor: "#2a2a38",
  showShadow: true,

  showBrandingHeader: true,
  accentColor: "#7c6cfc",
  accentIconColor: "#ffffff",
  headingText: "Create your account",
  subheadingText: "Join and start managing your workspace efficiently.",
  headingColor: "#f0f0f5",
  subheadingColor: "#9090a8",

  showFullName: true,
  showEmail: true,
  showPassword: true,
  showPasswordStrength: true,
  showTermsCheckbox: true,

  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputFocusBorderColor: "#7c6cfc",
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputBorderRadius: 10,
  labelColor: "#9090a8",

  ctaLabel: "Create Account",
  ctaBackground: "#7c6cfc",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 10,

  showSocialButtons: true,

  footerBackground: "#141418",
  footerTextColor: "#9090a8",

  customFields: [],
  customDropdowns: [],

  fontSize: 14,
  fontFamily: "'Instrument Sans', sans-serif",
};

export const lightSignupModalConfig: SignupModalConfig = {
  backdropBlur: true,
  modalWidth: 480,
  modalBorderRadius: 16,
  modalBackground: "#ffffff",
  modalBorderColor: "#e2e2ee",
  showShadow: true,

  showBrandingHeader: true,
  accentColor: "#6c5ce7",
  accentIconColor: "#ffffff",
  headingText: "Create your account",
  subheadingText: "Join and start managing your workspace efficiently.",
  headingColor: "#1a1a2e",
  subheadingColor: "#9090a8",

  showFullName: true,
  showEmail: true,
  showPassword: true,
  showPasswordStrength: true,
  showTermsCheckbox: true,

  inputBackground: "#f8f8fc",
  inputBorderColor: "#d4d4e0",
  inputFocusBorderColor: "#6c5ce7",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputBorderRadius: 10,
  labelColor: "#5a5a72",

  ctaLabel: "Create Account",
  ctaBackground: "#6c5ce7",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 10,

  showSocialButtons: true,

  footerBackground: "#f4f4f8",
  footerTextColor: "#9090a8",

  customFields: [],
  customDropdowns: [],

  fontSize: 14,
  fontFamily: "'Instrument Sans', sans-serif",
};

export const signupModalModePresets: Record<
  SignupModalMode,
  SignupModalConfig
> = {
  dark: darkSignupModalConfig,
  light: lightSignupModalConfig,
};

export const defaultSignupModalConfig = darkSignupModalConfig;
