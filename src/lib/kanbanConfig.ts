export type KanbanMode = "dark" | "light";

export interface KanbanConfig {
  // Board
  boardBackground: string;
  boardGap: number;

  // Column
  columnBackground: string;
  columnBorderColor: string;
  columnBorderRadius: number;
  columnWidth: number;
  columnHeaderTextColor: string;
  columnHeaderFontSize: number;
  columnCountBadgeBackground: string;
  columnCountBadgeColor: string;

  // Card
  cardBackground: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardGap: number;
  cardPadding: number;
  cardTitleColor: string;
  cardTitleFontSize: number;
  cardDescColor: string;
  cardDescFontSize: number;
  cardShadow: boolean;
  cardDragRotation: boolean;
  cardHoverBorderColor: string;

  // Progress bar
  progressTrackColor: string;
  progressFillColor: string;
  progressFillColorDone: string;

  // Priority badges
  priorityHighBg: string;
  priorityHighText: string;
  priorityMediumBg: string;
  priorityMediumText: string;
  priorityLowBg: string;
  priorityLowText: string;

  // Tag badge (generic)
  tagBg: string;
  tagText: string;

  // Add task button
  addBtnBorderColor: string;
  addBtnTextColor: string;
  addBtnHoverBg: string;

  // Meta icons
  metaIconColor: string;
  metaTextColor: string;

  // Column count
  columnCount: 3 | 4 | 5;
}

// ─── Dark Preset ─────────────────────────────────────────────────────────────

export const darkKanbanConfig: KanbanConfig = {
  boardBackground: "#0c0c0f",
  boardGap: 20,

  columnBackground: "#141418",
  columnBorderColor: "#2a2a38",
  columnBorderRadius: 14,
  columnWidth: 300,
  columnHeaderTextColor: "#f0f0f5",
  columnHeaderFontSize: 13,
  columnCountBadgeBackground: "#242430",
  columnCountBadgeColor: "#9090a8",

  cardBackground: "#1c1c22",
  cardBorderColor: "#2a2a38",
  cardBorderRadius: 10,
  cardGap: 10,
  cardPadding: 14,
  cardTitleColor: "#f0f0f5",
  cardTitleFontSize: 13,
  cardDescColor: "#5a5a72",
  cardDescFontSize: 11,
  cardShadow: false,
  cardDragRotation: true,
  cardHoverBorderColor: "#7c6cfc55",

  progressTrackColor: "#242430",
  progressFillColor: "#7c6cfc",
  progressFillColorDone: "#4ade80",

  priorityHighBg: "#f8717120",
  priorityHighText: "#f87171",
  priorityMediumBg: "#facc1520",
  priorityMediumText: "#facc15",
  priorityLowBg: "#4ade8020",
  priorityLowText: "#4ade80",

  tagBg: "#7c6cfc22",
  tagText: "#9d91fd",

  addBtnBorderColor: "#2a2a38",
  addBtnTextColor: "#5a5a72",
  addBtnHoverBg: "#1c1c22",

  metaIconColor: "#3a3a50",
  metaTextColor: "#5a5a72",

  columnCount: 4,
};

// ─── Light Preset ─────────────────────────────────────────────────────────────

export const lightKanbanConfig: KanbanConfig = {
  boardBackground: "#f0f0f8",
  boardGap: 20,

  columnBackground: "#f3f6fc",
  columnBorderColor: "#d4d4e0",
  columnBorderRadius: 14,
  columnWidth: 300,
  columnHeaderTextColor: "#1a1a2e",
  columnHeaderFontSize: 13,
  columnCountBadgeBackground: "#f0f0f8",
  columnCountBadgeColor: "#9090a8",

  cardBackground: "#ffffff",
  cardBorderColor: "#e4e4f0",
  cardBorderRadius: 10,
  cardGap: 10,
  cardPadding: 14,
  cardTitleColor: "#1a1a2e",
  cardTitleFontSize: 13,
  cardDescColor: "#9090a8",
  cardDescFontSize: 11,
  cardShadow: false,
  cardDragRotation: true,
  cardHoverBorderColor: "#6c5ce755",

  progressTrackColor: "#f0f0f8",
  progressFillColor: "#6c5ce7",
  progressFillColorDone: "#22c55e",

  priorityHighBg: "#fee2e2",
  priorityHighText: "#dc2626",
  priorityMediumBg: "#fef9c3",
  priorityMediumText: "#ca8a04",
  priorityLowBg: "#dcfce7",
  priorityLowText: "#16a34a",

  tagBg: "#ede9fe",
  tagText: "#6c5ce7",

  addBtnBorderColor: "#d4d4e0",
  addBtnTextColor: "#9090a8",
  addBtnHoverBg: "#f4f4f8",

  metaIconColor: "#c4c4d4",
  metaTextColor: "#9090a8",

  columnCount: 4,
};

export const kanbanModePresets: Record<KanbanMode, KanbanConfig> = {
  dark: darkKanbanConfig,
  light: lightKanbanConfig,
};

export const defaultKanbanConfig = darkKanbanConfig;

// ─── Static column definitions (label + icon key + accent) ───────────────────

export type ColumnId = "todo" | "inprogress" | "inreview" | "done" | "blocked";

export interface ColumnDef {
  id: ColumnId;
  label: string;
  icon: "arrow" | "circle" | "refresh" | "check" | "x";
  iconColor: { dark: string; light: string };
}

export const ALL_COLUMNS: ColumnDef[] = [
  {
    id: "todo",
    label: "To Do",
    icon: "arrow",
    iconColor: { dark: "#5a5a72", light: "#9090a8" },
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: "circle",
    iconColor: { dark: "#7c6cfc", light: "#6c5ce7" },
  },
  {
    id: "inreview",
    label: "In Review",
    icon: "refresh",
    iconColor: { dark: "#facc15", light: "#ca8a04" },
  },
  {
    id: "done",
    label: "Done",
    icon: "check",
    iconColor: { dark: "#4ade80", light: "#16a34a" },
  },
  {
    id: "blocked",
    label: "Blocked",
    icon: "x",
    iconColor: { dark: "#f87171", light: "#dc2626" },
  },
];

export type Priority = "high" | "medium" | "low";

export interface KanbanCard {
  id: string;
  columnId: ColumnId;
  title: string;
  desc: string;
  priority: Priority;
  tag: string;
  progress: number; // 0–100
  attachments: number;
  comments: number;
}

export const DEFAULT_CARDS: KanbanCard[] = [
  {
    id: "c1",
    columnId: "todo",
    title: "Design card component",
    desc: "Design a reusable task card for the design system",
    priority: "medium",
    tag: "UI Design",
    progress: 0,
    attachments: 0,
    comments: 0,
  },
  {
    id: "c2",
    columnId: "inprogress",
    title: "Set up project API",
    desc: "Create the initial REST endpoints for the data layer",
    priority: "low",
    tag: "Backend",
    progress: 34,
    attachments: 2,
    comments: 8,
  },
  {
    id: "c3",
    columnId: "inprogress",
    title: "Build task detail modal",
    desc: "Create a modal view to display and edit task details",
    priority: "low",
    tag: "Frontend",
    progress: 55,
    attachments: 1,
    comments: 12,
  },
  {
    id: "c4",
    columnId: "inprogress",
    title: "Fix login redirect issue",
    desc: "Users are not redirected correctly after OAuth callback",
    priority: "medium",
    tag: "Bug",
    progress: 23,
    attachments: 3,
    comments: 16,
  },
  {
    id: "c5",
    columnId: "inreview",
    title: "Kanban drag and drop",
    desc: "Add drag and drop interaction between board columns",
    priority: "medium",
    tag: "Frontend",
    progress: 59,
    attachments: 4,
    comments: 18,
  },
  {
    id: "c6",
    columnId: "inreview",
    title: "Test project creation flow",
    desc: "Verify the project creation flow works end-to-end",
    priority: "high",
    tag: "QA",
    progress: 74,
    attachments: 3,
    comments: 22,
  },
  {
    id: "c7",
    columnId: "done",
    title: "Design homepage hero",
    desc: "New hero section layout for the marketing homepage",
    priority: "high",
    tag: "UI Design",
    progress: 100,
    attachments: 7,
    comments: 26,
  },
  {
    id: "c8",
    columnId: "done",
    title: "Write onboarding guide",
    desc: "Short guide to help new users get started quickly",
    priority: "low",
    tag: "Docs",
    progress: 100,
    attachments: 3,
    comments: 32,
  },
];
