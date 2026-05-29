export type EcommerceDashboardTheme =
  | "omnidash"
  | "compforge"
  | "mint"
  | "amber"
  | "rose"
  | "custom";

export interface EcommerceDashboardConfig {
  theme: EcommerceDashboardTheme;
  accentColor: string;
  accentSoft: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  tertiaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  surfaceMuted: string;
  surfaceRaised: string;
  cardColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  faintTextColor: string;
}

export const omnidashEcommerceDashboardConfig: EcommerceDashboardConfig = {
  theme: "omnidash",
  accentColor: "#adc6ff",
  accentSoft: "#4b8eff",
  successColor: "#4edea3",
  warningColor: "#f59e0b",
  dangerColor: "#ffb4ab",
  tertiaryColor: "#ddb7ff",
  backgroundColor: "#000000",
  surfaceColor: "#131313",
  surfaceMuted: "#1c1b1b",
  surfaceRaised: "#2a2a2a",
  cardColor: "rgba(18,18,18,0.86)",
  borderColor: "rgba(255,255,255,0.08)",
  textColor: "#e5e2e1",
  mutedTextColor: "#c1c6d7",
  faintTextColor: "#8b90a0",
};

export const compforgeEcommerceDashboardConfig: EcommerceDashboardConfig = {
  theme: "compforge",
  accentColor: "#7c6cfc",
  accentSoft: "#9d91fd",
  successColor: "#4ade80",
  warningColor: "#facc15",
  dangerColor: "#f87171",
  tertiaryColor: "#ddb7ff",
  backgroundColor: "#0c0c0f",
  surfaceColor: "#141418",
  surfaceMuted: "#1c1c22",
  surfaceRaised: "#242430",
  cardColor: "rgba(28,28,34,0.86)",
  borderColor: "#2a2a38",
  textColor: "#f0f0f5",
  mutedTextColor: "#9090a8",
  faintTextColor: "#5a5a72",
};

export const mintEcommerceDashboardConfig: EcommerceDashboardConfig = {
  theme: "mint",
  accentColor: "#5eead4",
  accentSoft: "#14b8a6",
  successColor: "#86efac",
  warningColor: "#fbbf24",
  dangerColor: "#fb7185",
  tertiaryColor: "#a78bfa",
  backgroundColor: "#020403",
  surfaceColor: "#0b1110",
  surfaceMuted: "#101a18",
  surfaceRaised: "#182623",
  cardColor: "rgba(11,17,16,0.88)",
  borderColor: "rgba(94,234,212,0.16)",
  textColor: "#ecfdf5",
  mutedTextColor: "#99f6e4",
  faintTextColor: "#5eead4",
};

export const amberEcommerceDashboardConfig: EcommerceDashboardConfig = {
  theme: "amber",
  accentColor: "#fbbf24",
  accentSoft: "#f59e0b",
  successColor: "#34d399",
  warningColor: "#fb923c",
  dangerColor: "#f87171",
  tertiaryColor: "#fde68a",
  backgroundColor: "#050403",
  surfaceColor: "#14100c",
  surfaceMuted: "#1f1710",
  surfaceRaised: "#302317",
  cardColor: "rgba(20,16,12,0.88)",
  borderColor: "rgba(251,191,36,0.14)",
  textColor: "#fff7ed",
  mutedTextColor: "#fed7aa",
  faintTextColor: "#d6a25f",
};

export const roseEcommerceDashboardConfig: EcommerceDashboardConfig = {
  theme: "rose",
  accentColor: "#fb7185",
  accentSoft: "#e11d48",
  successColor: "#22c55e",
  warningColor: "#f59e0b",
  dangerColor: "#f43f5e",
  tertiaryColor: "#c084fc",
  backgroundColor: "#050206",
  surfaceColor: "#130b10",
  surfaceMuted: "#1d1017",
  surfaceRaised: "#2b1822",
  cardColor: "rgba(19,11,16,0.88)",
  borderColor: "rgba(251,113,133,0.16)",
  textColor: "#fff1f2",
  mutedTextColor: "#fda4af",
  faintTextColor: "#be7180",
};

export const ecommerceDashboardThemePresets: Record<
  Exclude<EcommerceDashboardTheme, "custom">,
  EcommerceDashboardConfig
> = {
  omnidash: omnidashEcommerceDashboardConfig,
  compforge: compforgeEcommerceDashboardConfig,
  mint: mintEcommerceDashboardConfig,
  amber: amberEcommerceDashboardConfig,
  rose: roseEcommerceDashboardConfig,
};

export const ecommerceDashboardThemeLabels: Record<
  Exclude<EcommerceDashboardTheme, "custom">,
  string
> = {
  omnidash: "HTML Blue",
  compforge: "CompForge",
  mint: "Mint",
  amber: "Amber",
  rose: "Rose",
};

export const defaultEcommerceDashboardConfig = omnidashEcommerceDashboardConfig;
