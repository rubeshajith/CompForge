// ─────────────────────────────────────────────
//  popoverVariants.ts
//  CompForge — AI Popovers
// ─────────────────────────────────────────────

export type PopoverVariantId =
  | "basic"
  | "dropdown"
  | "status"
  | "usercard"
  | "menu"
  | "notif"
  | "command"
  | "tokens";

export interface PopoverVariantMeta {
  id: PopoverVariantId;
  label: string;
  num: number;
}

export const POPOVER_VARIANTS: PopoverVariantMeta[] = [
  { id: "basic", label: "Basic", num: 1 },
  { id: "dropdown", label: "Dropdown", num: 2 },
  { id: "status", label: "Status", num: 3 },
  { id: "usercard", label: "User Card", num: 4 },
  { id: "menu", label: "Menu", num: 5 },
  { id: "notif", label: "Notif", num: 7 },
  { id: "command", label: "Command", num: 8 },
  { id: "tokens", label: "Tokens", num: 10 },
];

export const DEFAULT_VARIANT: PopoverVariantId = "basic";
