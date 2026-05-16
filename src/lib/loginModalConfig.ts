// /lib/loginModalConfig.ts

export type LoginModalMode = "dark" | "light";

export interface LoginModalConfig {
  // Container
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

  // Social buttons
  showSocialButtons: boolean;
  socialButtonBackground: string;
  socialButtonBorderColor: string;
  socialButtonTextColor: string;

  // Input styling
  inputBackground: string;
  inputBorderColor: string;
  inputFocusBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputBorderRadius: number;
  labelColor: string;

  // Forgot password link
  showForgotPassword: boolean;
  forgotPasswordColor: string;

  // Remember me
  showRememberMe: boolean;
  rememberMeText: string;
  rememberMeColor: string;

  // CTA Button
  ctaLabel: string;
  ctaBackground: string;
  ctaTextColor: string;
  ctaBorderRadius: number;

  // Footer
  footerBackground: string;
  footerTextColor: string;

  // Typography
  fontSize: number;
  fontFamily: string;
}

export const darkLoginModalConfig: LoginModalConfig = {
  modalWidth: 480,
  modalBorderRadius: 16,
  modalBackground: "#1c1c22",
  modalBorderColor: "#2a2a38",
  showShadow: true,

  showBrandingHeader: true,
  accentColor: "#7c6cfc",
  accentIconColor: "#ffffff",
  headingText: "Welcome back",
  subheadingText: "Sign in to manage your workspace assets",
  headingColor: "#f0f0f5",
  subheadingColor: "#9090a8",

  showSocialButtons: true,
  socialButtonBackground: "#141418",
  socialButtonBorderColor: "#2a2a38",
  socialButtonTextColor: "#f0f0f5",

  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputFocusBorderColor: "#7c6cfc",
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputBorderRadius: 10,
  labelColor: "#9090a8",

  showForgotPassword: true,
  forgotPasswordColor: "#7c6cfc",

  showRememberMe: true,
  rememberMeText: "Keep me signed in for 30 days",
  rememberMeColor: "#9090a8",

  ctaLabel: "Sign In",
  ctaBackground: "#7c6cfc",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 10,

  footerBackground: "#141418",
  footerTextColor: "#9090a8",

  fontSize: 14,
  fontFamily: "'Instrument Sans', sans-serif",
};

export const lightLoginModalConfig: LoginModalConfig = {
  modalWidth: 480,
  modalBorderRadius: 16,
  modalBackground: "#ffffff",
  modalBorderColor: "#e2e2ee",
  showShadow: true,

  showBrandingHeader: true,
  accentColor: "#6c5ce7",
  accentIconColor: "#ffffff",
  headingText: "Welcome back",
  subheadingText: "Sign in to manage your workspace assets",
  headingColor: "#1a1a2e",
  subheadingColor: "#9090a8",

  showSocialButtons: true,
  socialButtonBackground: "#f8f8fc",
  socialButtonBorderColor: "#d4d4e0",
  socialButtonTextColor: "#1a1a2e",

  inputBackground: "#f8f8fc",
  inputBorderColor: "#d4d4e0",
  inputFocusBorderColor: "#6c5ce7",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputBorderRadius: 10,
  labelColor: "#5a5a72",

  showForgotPassword: true,
  forgotPasswordColor: "#6c5ce7",

  showRememberMe: true,
  rememberMeText: "Keep me signed in for 30 days",
  rememberMeColor: "#9090a8",

  ctaLabel: "Sign In",
  ctaBackground: "#6c5ce7",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 10,

  footerBackground: "#f4f4f8",
  footerTextColor: "#9090a8",

  fontSize: 14,
  fontFamily: "'Instrument Sans', sans-serif",
};

export const loginModalModePresets: Record<LoginModalMode, LoginModalConfig> = {
  dark: darkLoginModalConfig,
  light: lightLoginModalConfig,
};

export const defaultLoginModalConfig = darkLoginModalConfig;
