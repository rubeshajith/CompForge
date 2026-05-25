// /lib/jobApplicationFormConfig.ts

export type JobFormMode = "dark" | "light";

export type FormLayout = "single" | "two-column";
export type ButtonStyle = "filled" | "outlined" | "pill";

export interface JobApplicationFormConfig {
  // Job Info (control panel customizable)
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  jobLocation: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Remote" | "Hybrid";

  // Fields visibility
  showLinkedIn: boolean;
  showPortfolio: boolean;
  showSalaryExpectation: boolean;
  showStartDate: boolean;
  showCoverLetter: boolean;
  showPhoneField: boolean;

  // Layout
  formLayout: FormLayout;
  formWidth: number;

  // Container
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  showShadow: boolean;

  // Header / Banner
  headerBackground: string;
  headerTextColor: string;
  companyTagColor: string;
  jobTypeBadgeBackground: string;
  jobTypeBadgeTextColor: string;

  // Input fields
  inputBackground: string;
  inputBorderColor: string;
  inputBorderRadius: number;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputFocusBorderColor: string;
  labelColor: string;
  fontSize: number;

  // Section dividers
  sectionTitleColor: string;
  dividerColor: string;

  // Submit button
  buttonStyle: ButtonStyle;
  buttonBackground: string;
  buttonTextColor: string;
  buttonBorderRadius: number;
  buttonHoverBackground: string;

  // Required indicator
  requiredColor: string;
}

// ─── Dark Preset ──────────────────────────────────────────────────────────────
export const darkJobApplicationFormConfig: JobApplicationFormConfig = {
  jobTitle: "Senior Frontend Engineer",
  companyName: "Acme Corp",
  jobDescription:
    "We're looking for a Senior Frontend Engineer to join our product team. You'll work closely with design and backend engineers to build pixel-perfect, high-performance web experiences. Experience with React, TypeScript, and modern CSS is required.",
  jobLocation: "San Francisco, CA",
  jobType: "Hybrid",

  showLinkedIn: true,
  showPortfolio: true,
  showSalaryExpectation: true,
  showStartDate: true,
  showCoverLetter: true,
  showPhoneField: true,

  formLayout: "two-column",
  formWidth: 680,

  backgroundColor: "#1c1c22",
  borderColor: "#2a2a38",
  borderRadius: 14,
  showShadow: true,

  headerBackground: "#141418",
  headerTextColor: "#f0f0f5",
  companyTagColor: "#9090a8",
  jobTypeBadgeBackground: "#7c6cfc22",
  jobTypeBadgeTextColor: "#9d91fd",

  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputBorderRadius: 8,
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputFocusBorderColor: "#7c6cfc",
  labelColor: "#9090a8",
  fontSize: 13,

  sectionTitleColor: "#f0f0f5",
  dividerColor: "#2a2a38",

  buttonStyle: "filled",
  buttonBackground: "#7c6cfc",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonHoverBackground: "#9d91fd",

  requiredColor: "#f87171",
};

// ─── Light Preset ─────────────────────────────────────────────────────────────
export const lightJobApplicationFormConfig: JobApplicationFormConfig = {
  jobTitle: "Senior Frontend Engineer",
  companyName: "Acme Corp",
  jobDescription:
    "We're looking for a Senior Frontend Engineer to join our product team. You'll work closely with design and backend engineers to build pixel-perfect, high-performance web experiences. Experience with React, TypeScript, and modern CSS is required.",
  jobLocation: "San Francisco, CA",
  jobType: "Hybrid",

  showLinkedIn: true,
  showPortfolio: true,
  showSalaryExpectation: true,
  showStartDate: true,
  showCoverLetter: true,
  showPhoneField: true,

  formLayout: "two-column",
  formWidth: 680,

  backgroundColor: "#ffffff",
  borderColor: "#d4d4e0",
  borderRadius: 14,
  showShadow: true,

  headerBackground: "#f4f4f8",
  headerTextColor: "#1a1a2e",
  companyTagColor: "#6b6b85",
  jobTypeBadgeBackground: "#6c5ce71a",
  jobTypeBadgeTextColor: "#6c5ce7",

  inputBackground: "#f9f9fc",
  inputBorderColor: "#d4d4e0",
  inputBorderRadius: 8,
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputFocusBorderColor: "#6c5ce7",
  labelColor: "#6b6b85",
  fontSize: 13,

  sectionTitleColor: "#1a1a2e",
  dividerColor: "#e4e4ee",

  buttonStyle: "filled",
  buttonBackground: "#6c5ce7",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonHoverBackground: "#5a4bd1",

  requiredColor: "#e55353",
};

export const jobFormModePresets: Record<JobFormMode, JobApplicationFormConfig> =
  {
    dark: darkJobApplicationFormConfig,
    light: lightJobApplicationFormConfig,
  };

export const defaultJobApplicationFormConfig = darkJobApplicationFormConfig;
