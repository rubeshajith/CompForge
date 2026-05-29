export type MarketingDashboardTheme =
  | "omni"
  | "compforge"
  | "cyberMint"
  | "electricBlue"
  | "solarCoral"
  | "custom";

export interface MarketingDashboardConfig {
  theme: MarketingDashboardTheme;
  customAccent: string;
}

export interface MarketingDashboardThemeTokens {
  name: string;
  accent: string;
  accent2: string;
  accent3: string;
  danger: string;
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  text: string;
  muted: string;
  softText: string;
  gradient: string;
}

export const marketingDashboardThemes: Record<MarketingDashboardTheme, MarketingDashboardThemeTokens> = {
  omni: {
    name: "OmniDash",
    accent: "#adc6ff",
    accent2: "#4edea3",
    accent3: "#ddb7ff",
    danger: "#ffb4ab",
    bg: "#131313",
    surface: "#1c1b1b",
    surface2: "#201f1f",
    surface3: "#353534",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e2e1",
    muted: "#8b90a0",
    softText: "#c1c6d7",
    gradient: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
  },
  compforge: {
    name: "CompForge",
    accent: "#7c6cfc",
    accent2: "#4ade80",
    accent3: "#9d91fd",
    danger: "#f87171",
    bg: "#0c0c0f",
    surface: "#141418",
    surface2: "#1c1c22",
    surface3: "#242430",
    border: "#2a2a38",
    text: "#f0f0f5",
    muted: "#9090a8",
    softText: "#c0c0d8",
    gradient: "linear-gradient(135deg, #7c6cfc 0%, #9d91fd 100%)",
  },
  cyberMint: {
    name: "Cyber Mint",
    accent: "#35f0bf",
    accent2: "#8cff66",
    accent3: "#6aa6ff",
    danger: "#ff6b8b",
    bg: "#070909",
    surface: "#101615",
    surface2: "#15201e",
    surface3: "#20312d",
    border: "rgba(103,255,211,0.14)",
    text: "#ecfff9",
    muted: "#8ba89f",
    softText: "#c0ddd5",
    gradient: "linear-gradient(135deg, #35f0bf 0%, #1677ff 100%)",
  },
  electricBlue: {
    name: "Electric Blue",
    accent: "#38bdf8",
    accent2: "#22c55e",
    accent3: "#a78bfa",
    danger: "#fb7185",
    bg: "#070a12",
    surface: "#101521",
    surface2: "#151d2d",
    surface3: "#253044",
    border: "rgba(148,163,184,0.16)",
    text: "#f8fafc",
    muted: "#94a3b8",
    softText: "#cbd5e1",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
  },
  solarCoral: {
    name: "Solar Coral",
    accent: "#ff8a4c",
    accent2: "#facc15",
    accent3: "#fb7185",
    danger: "#ff5c7a",
    bg: "#0f0c0a",
    surface: "#181311",
    surface2: "#221a16",
    surface3: "#39251d",
    border: "rgba(255,184,108,0.14)",
    text: "#fff7ed",
    muted: "#b9a394",
    softText: "#f3d8c6",
    gradient: "linear-gradient(135deg, #ff8a4c 0%, #fb7185 100%)",
  },
  custom: {
    name: "Custom",
    accent: "#adc6ff",
    accent2: "#4edea3",
    accent3: "#ddb7ff",
    danger: "#ffb4ab",
    bg: "#131313",
    surface: "#1c1b1b",
    surface2: "#201f1f",
    surface3: "#353534",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e2e1",
    muted: "#8b90a0",
    softText: "#c1c6d7",
    gradient: "linear-gradient(135deg, #adc6ff 0%, #4edea3 100%)",
  },
};

export const darkMarketingDashboardConfig: MarketingDashboardConfig = {
  theme: "omni",
  customAccent: "#adc6ff",
};

export const defaultMarketingDashboardConfig = darkMarketingDashboardConfig;

export function getMarketingDashboardTheme(config: MarketingDashboardConfig): MarketingDashboardThemeTokens {
  const base = marketingDashboardThemes[config.theme] ?? marketingDashboardThemes.omni;

  if (config.theme !== "custom") {
    return base;
  }

  return {
    ...base,
    accent: config.customAccent,
    gradient: `linear-gradient(135deg, ${config.customAccent} 0%, ${base.accent2} 100%)`,
  };
}
