// ─────────────────────────────────────────────
//  popoverConfig.ts
//  CompForge — AI Popovers component config
// ─────────────────────────────────────────────

export type PopoverMode = "dark" | "light";

// ── Shared sub-types ──────────────────────────

export interface NotificationItem {
  message: string;
  time: string;
  unread: boolean;
}

export interface CommandItem {
  label: string;
  kbd: string;
}

export interface ModelItem {
  name: string;
  provider: string;
  context: string;
  price: string;
  latency: string;
}

// ─────────────────────────────────────────────
//  Main config interface
// ─────────────────────────────────────────────

export interface PopoverConfig {
  // ── Shared / Global ──
  accentColor: string;
  accentTextColor: string;
  gradStart: string;
  gradEnd: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  textMutedColor: string;
  borderRadius: number;
  fontFamily: string;

  // ── 1. Basic ──
  basicHeading: string;
  basicDescription: string;
  basicIconBg: string;

  // ── 2. Dropdown Transition ──
  dtModels: ModelItem[];
  dtShowStats: boolean;

  // ── 3. Training Status ──
  statusModelName: string;
  statusProgress: number;
  statusLoss: string;
  statusAccuracy: string;
  statusEpoch: string;
  statusAnimatePulse: boolean;

  // ── 4. User Card ──
  userInitial: string;
  userName: string;
  userRole: string;
  userStat1Label: string;
  userStat1Value: string;
  userStat2Label: string;
  userStat2Value: string;
  userStat3Label: string;
  userStat3Value: string;

  // ── 5. Nested Menu ──
  menuShowExport: boolean;
  menuExportFormats: string;
  menuDangerLabel: string;
  menuItemBorderRadius: number;

  // ── 7. Notification ──
  notifications: NotificationItem[];
  notifShowDot: boolean;
  notifDotColor: string;

  // ── 8. Command Palette ──
  commands: CommandItem[];
  cmdShowKbd: boolean;
  cmdAccentOnHover: boolean;

  // ── 10. Token Breakdown ──
  tokSystemCount: number;
  tokPromptCount: number;
  tokCompletionCount: number;
  tokModelName: string;
  tokSystemColor: string;
  tokPromptColorStart: string;
  tokPromptColorEnd: string;
  tokCompletionColorStart: string;
  tokCompletionColorEnd: string;
  tokAnimateBars: boolean;
}

// ─────────────────────────────────────────────
//  Dark preset (default)
// ─────────────────────────────────────────────

export const darkPopoverConfig: PopoverConfig = {
  // Shared
  accentColor: "#7C6AFF",
  accentTextColor: "#ffffff",
  gradStart: "#7C6AFF",
  gradEnd: "#00D4AA",
  surfaceColor: "#141418",
  borderColor: "#1F1F28",
  textColor: "#ECEAF5",
  textMutedColor: "#5E5B72",
  borderRadius: 10,
  fontFamily: "Poppins, sans-serif",

  // Basic
  basicHeading: "Neural Engine v4",
  basicDescription:
    "Next-gen inference engine with 3x throughput gains and built-in safety guardrails.",
  basicIconBg: "#7C6AFF",

  // Dropdown Transition
  dtModels: [
    {
      name: "GPT-5",
      provider: "OpenAI",
      context: "1M",
      price: "$12",
      latency: "45ms",
    },
    {
      name: "Claude Opus 4",
      provider: "Anthropic",
      context: "200K",
      price: "$15",
      latency: "65ms",
    },
    {
      name: "Gemini 2.5 Pro",
      provider: "Google",
      context: "1M",
      price: "$5",
      latency: "55ms",
    },
    {
      name: "Llama 4 Maverick",
      provider: "Meta",
      context: "1M",
      price: "$2",
      latency: "60ms",
    },
  ],
  dtShowStats: true,

  // Training Status
  statusModelName: "Claude Opus 4 — Fine-tune",
  statusProgress: 73,
  statusLoss: "0.0241",
  statusAccuracy: "94.2%",
  statusEpoch: "7/10",
  statusAnimatePulse: true,

  // User Card
  userInitial: "D",
  userName: "David Mraz",
  userRole: "ML Engineer",
  userStat1Label: "Models",
  userStat1Value: "142",
  userStat2Label: "Runs",
  userStat2Value: "2.4k",
  userStat3Label: "Uptime",
  userStat3Value: "98%",

  // Nested Menu
  menuShowExport: true,
  menuExportFormats: "ONNX, TensorRT, CoreML",
  menuDangerLabel: "Delete",
  menuItemBorderRadius: 6,

  // Notification
  notifications: [
    {
      message: "Training complete on Llama 4 Scout",
      time: "2 min ago",
      unread: true,
    },
    {
      message: "New eval results ready for review",
      time: "18 min ago",
      unread: true,
    },
    {
      message: "Deployment prod-v3 scaled to 4 replicas",
      time: "1 hr ago",
      unread: true,
    },
  ],
  notifShowDot: true,
  notifDotColor: "#00D4AA",

  // Command Palette
  commands: [
    { label: "New Model", kbd: "⌘N" },
    { label: "Deploy to Production", kbd: "⌘D" },
    { label: "Run Evaluation", kbd: "⌘E" },
    { label: "View Logs", kbd: "⌘L" },
    { label: "Settings", kbd: "⌘," },
  ],
  cmdShowKbd: true,
  cmdAccentOnHover: true,

  // Token Breakdown
  tokSystemCount: 486,
  tokPromptCount: 1247,
  tokCompletionCount: 2485,
  tokModelName: "Claude Opus 4",
  tokSystemColor: "#5E5B72",
  tokPromptColorStart: "#7C6AFF",
  tokPromptColorEnd: "#00D4AA",
  tokCompletionColorStart: "#00D4AA",
  tokCompletionColorEnd: "#7C6AFF",
  tokAnimateBars: true,
};

// ─────────────────────────────────────────────
//  Light preset
// ─────────────────────────────────────────────

export const lightPopoverConfig: PopoverConfig = {
  // Shared
  accentColor: "#6B5CE7",
  accentTextColor: "#ffffff",
  gradStart: "#E8457C",
  gradEnd: "#4F6DF5",
  surfaceColor: "#FFFFFF",
  borderColor: "#E8E6F0",
  textColor: "#1A1A2E",
  textMutedColor: "#7E7E9A",
  borderRadius: 10,
  fontFamily: "Poppins, sans-serif",

  // Basic
  basicHeading: "Neural Engine v4",
  basicDescription:
    "Next-gen inference engine with 3x throughput gains and built-in safety guardrails.",
  basicIconBg: "#6B5CE7",

  // Dropdown Transition
  dtModels: [
    {
      name: "GPT-5",
      provider: "OpenAI",
      context: "1M",
      price: "$12",
      latency: "45ms",
    },
    {
      name: "Claude Opus 4",
      provider: "Anthropic",
      context: "200K",
      price: "$15",
      latency: "65ms",
    },
    {
      name: "Gemini 2.5 Pro",
      provider: "Google",
      context: "1M",
      price: "$5",
      latency: "55ms",
    },
    {
      name: "Llama 4 Maverick",
      provider: "Meta",
      context: "1M",
      price: "$2",
      latency: "60ms",
    },
  ],
  dtShowStats: true,

  // Training Status
  statusModelName: "Claude Opus 4 — Fine-tune",
  statusProgress: 73,
  statusLoss: "0.0241",
  statusAccuracy: "94.2%",
  statusEpoch: "7/10",
  statusAnimatePulse: true,

  // User Card
  userInitial: "D",
  userName: "David Mraz",
  userRole: "ML Engineer",
  userStat1Label: "Models",
  userStat1Value: "142",
  userStat2Label: "Runs",
  userStat2Value: "2.4k",
  userStat3Label: "Uptime",
  userStat3Value: "98%",

  // Nested Menu
  menuShowExport: true,
  menuExportFormats: "ONNX, TensorRT, CoreML",
  menuDangerLabel: "Delete",
  menuItemBorderRadius: 6,

  // Notification
  notifications: [
    {
      message: "Training complete on Llama 4 Scout",
      time: "2 min ago",
      unread: true,
    },
    {
      message: "New eval results ready for review",
      time: "18 min ago",
      unread: true,
    },
    {
      message: "Deployment prod-v3 scaled to 4 replicas",
      time: "1 hr ago",
      unread: true,
    },
  ],
  notifShowDot: true,
  notifDotColor: "#6B5CE7",

  // Command Palette
  commands: [
    { label: "New Model", kbd: "⌘N" },
    { label: "Deploy to Production", kbd: "⌘D" },
    { label: "Run Evaluation", kbd: "⌘E" },
    { label: "View Logs", kbd: "⌘L" },
    { label: "Settings", kbd: "⌘," },
  ],
  cmdShowKbd: true,
  cmdAccentOnHover: true,

  // Token Breakdown
  tokSystemCount: 486,
  tokPromptCount: 1247,
  tokCompletionCount: 2485,
  tokModelName: "Claude Opus 4",
  tokSystemColor: "#7E7E9A",
  tokPromptColorStart: "#E8457C",
  tokPromptColorEnd: "#6B5CE7",
  tokCompletionColorStart: "#E8457C",
  tokCompletionColorEnd: "#4F6DF5",
  tokAnimateBars: true,
};

export const popoverModePresets: Record<PopoverMode, PopoverConfig> = {
  dark: darkPopoverConfig,
  light: lightPopoverConfig,
};

export const defaultPopoverConfig = darkPopoverConfig;
