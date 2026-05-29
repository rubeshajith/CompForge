// /lib/omnidashConfig.ts

export interface OmnidashConfig {
  // Primary accent color (drives ECG line, badges, metric highlights, progress bars)
  accentColor: string;
  // Secondary accent (tertiary ring, some borders)
  secondaryColor: string;
  // Surface / panel background
  panelBackground: string;
  // Main page background
  pageBackground: string;
  // Border / outline color
  borderColor: string;
  // Primary text
  textPrimary: string;
  // Muted / secondary text
  textMuted: string;
  // Error / critical color (alert badge, critical metrics)
  errorColor: string;
  // Sidebar background
  sidebarBackground: string;
  // Sidebar active item highlight
  sidebarActiveBackground: string;
}

// ─── Preset themes ────────────────────────────────────────────────────────────

export type OmnidashTheme =
  | "emerald" // original — teal/green on near-black (OmniDash default)
  | "compforge" // CompForge purple accent on dark
  | "cobalt" // electric blue on dark navy
  | "amber" // warm amber/gold on deep dark
  | "rose" // rose/pink on dark slate
  | "custom"; // user-defined accent (everything else stays emerald-dark)

export const omnidashThemePresets: Record<
  Exclude<OmnidashTheme, "custom">,
  OmnidashConfig
> = {
  emerald: {
    accentColor: "#4edea3",
    secondaryColor: "#ddb7ff",
    panelBackground: "rgba(18,18,18,0.70)",
    pageBackground: "#131313",
    borderColor: "rgba(255,255,255,0.08)",
    textPrimary: "#e5e2e1",
    textMuted: "#8b90a0",
    errorColor: "#ffb4ab",
    sidebarBackground: "#131313",
    sidebarActiveBackground: "#2a2a2a",
  },
  compforge: {
    accentColor: "#7c6cfc",
    secondaryColor: "#9d91fd",
    panelBackground: "rgba(12,12,18,0.80)",
    pageBackground: "#0c0c0f",
    borderColor: "rgba(124,108,252,0.15)",
    textPrimary: "#f0f0f5",
    textMuted: "#5a5a72",
    errorColor: "#f87171",
    sidebarBackground: "#0c0c0f",
    sidebarActiveBackground: "#1c1c22",
  },
  cobalt: {
    accentColor: "#38bdf8",
    secondaryColor: "#818cf8",
    panelBackground: "rgba(8,16,28,0.80)",
    pageBackground: "#080e1a",
    borderColor: "rgba(56,189,248,0.12)",
    textPrimary: "#e2eaf5",
    textMuted: "#4a6080",
    errorColor: "#fb7185",
    sidebarBackground: "#080e1a",
    sidebarActiveBackground: "#0f1e30",
  },
  amber: {
    accentColor: "#fbbf24",
    secondaryColor: "#f97316",
    panelBackground: "rgba(16,12,4,0.80)",
    pageBackground: "#0e0b04",
    borderColor: "rgba(251,191,36,0.12)",
    textPrimary: "#fef3c7",
    textMuted: "#78716c",
    errorColor: "#f87171",
    sidebarBackground: "#0e0b04",
    sidebarActiveBackground: "#1c1508",
  },
  rose: {
    accentColor: "#fb7185",
    secondaryColor: "#c084fc",
    panelBackground: "rgba(18,10,14,0.80)",
    pageBackground: "#120a0e",
    borderColor: "rgba(251,113,133,0.12)",
    textPrimary: "#fce7f3",
    textMuted: "#6b4c56",
    errorColor: "#fbbf24",
    sidebarBackground: "#120a0e",
    sidebarActiveBackground: "#1e0f16",
  },
};

export const defaultOmnidashConfig: OmnidashConfig =
  omnidashThemePresets.emerald;
