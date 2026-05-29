export type SaasDashboardTheme =
  | "omni"
  | "compforge"
  | "mintOps"
  | "blueSignal"
  | "rosePulse"
  | "custom";

export interface SaasDashboardConfig {
  theme: SaasDashboardTheme;
  customAccent: string;
}

export interface SaasDashboardThemeTokens {
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
  buttonText: string;
}

export const saasDashboardThemes: Record<SaasDashboardTheme, SaasDashboardThemeTokens> = {
  omni: {
    name: "Omni SaaS",
    accent: "#adc6ff",
    accent2: "#4edea3",
    accent3: "#ddb7ff",
    danger: "#ffb4ab",
    bg: "#000000",
    surface: "#131313",
    surface2: "#1c1b1b",
    surface3: "#2a2a2a",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e2e1",
    muted: "#8b90a0",
    softText: "#c1c6d7",
    buttonText: "#00285c",
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
    buttonText: "#ffffff",
  },
  mintOps: {
    name: "Mint Ops",
    accent: "#31e6b5",
    accent2: "#8cff66",
    accent3: "#7dd3fc",
    danger: "#fb7185",
    bg: "#050807",
    surface: "#0f1513",
    surface2: "#15211d",
    surface3: "#20312b",
    border: "rgba(103,255,211,0.14)",
    text: "#ecfff9",
    muted: "#8aa89e",
    softText: "#c0ddd5",
    buttonText: "#022c22",
  },
  blueSignal: {
    name: "Blue Signal",
    accent: "#38bdf8",
    accent2: "#22c55e",
    accent3: "#818cf8",
    danger: "#fb7185",
    bg: "#060914",
    surface: "#101521",
    surface2: "#151d2d",
    surface3: "#243044",
    border: "rgba(148,163,184,0.16)",
    text: "#f8fafc",
    muted: "#94a3b8",
    softText: "#cbd5e1",
    buttonText: "#082f49",
  },
  rosePulse: {
    name: "Rose Pulse",
    accent: "#fb7185",
    accent2: "#facc15",
    accent3: "#c084fc",
    danger: "#ff5c7a",
    bg: "#10070a",
    surface: "#1a1013",
    surface2: "#25171b",
    surface3: "#3a2229",
    border: "rgba(251,113,133,0.16)",
    text: "#fff1f2",
    muted: "#bda0a5",
    softText: "#f0cbd1",
    buttonText: "#4c0519",
  },
  custom: {
    name: "Custom",
    accent: "#adc6ff",
    accent2: "#4edea3",
    accent3: "#ddb7ff",
    danger: "#ffb4ab",
    bg: "#000000",
    surface: "#131313",
    surface2: "#1c1b1b",
    surface3: "#2a2a2a",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e2e1",
    muted: "#8b90a0",
    softText: "#c1c6d7",
    buttonText: "#001a41",
  },
};

export const darkSaasDashboardConfig: SaasDashboardConfig = {
  theme: "omni",
  customAccent: "#adc6ff",
};

export const defaultSaasDashboardConfig = darkSaasDashboardConfig;

export function getSaasDashboardTheme(config: SaasDashboardConfig): SaasDashboardThemeTokens {
  const base = saasDashboardThemes[config.theme] ?? saasDashboardThemes.omni;

  if (config.theme !== "custom") {
    return base;
  }

  return {
    ...base,
    accent: config.customAccent,
  };
}
