// ─── Field Types ────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "dropdown"
  | "multiselect"
  | "date-single" // input + single-date calendar popup
  | "date-range" // input + range calendar popup
  | "datetime" // input + date-time popup
  | "star-rating"
  | "chips" // multi-select chips / tabs
  | "radio";

// ─── Per-Field Definition ───────────────────────────────────────────────────

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  // dropdown / multiselect / chips / radio options
  options?: string[];
  // star-rating max stars
  maxStars?: number;
}

// ─── Form-Level Style Config ─────────────────────────────────────────────────

export interface FormConfig {
  // Fields
  fields: FormField[];

  // Container
  formBackground: string;
  formBorderColor: string;
  formBorderRadius: number;
  formPadding: number;
  showShadow: boolean;

  // Labels
  labelColor: string;
  labelFontSize: number;

  // Required asterisk
  requiredColor: string;

  // Generic input styling
  inputBackground: string;
  inputBorderColor: string;
  inputBorderRadius: number;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputFontSize: number;
  inputFocusBorderColor: string;

  // Dropdown / popup panels
  dropdownBackground: string;
  dropdownBorderColor: string;
  dropdownItemHoverBg: string;
  dropdownItemTextColor: string;

  // Accent (selected state, chips active, star fill, radio dot)
  accentColor: string;
  accentTextColor: string;

  // Submit button
  buttonBackground: string;
  buttonTextColor: string;
  buttonBorderRadius: number;
  buttonLabel: string;

  // Gap between fields
  fieldGap: number;
}

// ─── Default Field Factory ───────────────────────────────────────────────────

let _idCounter = 1;
export function createField(type: FieldType): FormField {
  const id = `field_${_idCounter++}`;
  const base: FormField = { id, type, label: labelFor(type), required: false };
  if (needsOptions(type)) base.options = defaultOptions(type);
  if (type === "star-rating") base.maxStars = 5;
  if (type === "text") base.placeholder = "Enter value…";
  if (type === "date-single") base.placeholder = "Select date…";
  if (type === "date-range") base.placeholder = "Select range…";
  if (type === "datetime") base.placeholder = "Select date & time…";
  return base;
}

function labelFor(type: FieldType): string {
  const map: Record<FieldType, string> = {
    text: "Text Input",
    dropdown: "Dropdown",
    multiselect: "Multi-Select",
    "date-single": "Date",
    "date-range": "Date Range",
    datetime: "Date & Time",
    "star-rating": "Rating",
    chips: "Select Option",
    radio: "Choose One",
  };
  return map[type];
}

function needsOptions(type: FieldType) {
  return ["dropdown", "multiselect", "chips", "radio"].includes(type);
}

function defaultOptions(type: FieldType): string[] {
  if (type === "radio") return ["Option A", "Option B", "Option C"];
  if (type === "chips")
    return ["Design", "Engineering", "Marketing", "Product"];
  return ["Option 1", "Option 2", "Option 3"];
}

// ─── Mode Presets ────────────────────────────────────────────────────────────

export type FormMode = "dark" | "light";

export const darkFormConfig: FormConfig = {
  fields: [
    {
      id: "field_d1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your name…",
      required: true,
      options: undefined,
    },
    {
      id: "field_d2",
      type: "dropdown",
      label: "Department",
      required: false,
      options: ["Engineering", "Design", "Product", "Marketing"],
    },
    {
      id: "field_d3",
      type: "date-single",
      label: "Start Date",
      placeholder: "Select date…",
      required: false,
      options: undefined,
    },
    {
      id: "field_d4",
      type: "star-rating",
      label: "Experience",
      required: false,
      maxStars: 5,
    },
    {
      id: "field_d5",
      type: "radio",
      label: "Employment Type",
      required: false,
      options: ["Full-time", "Part-time", "Contract"],
    },
  ],

  formBackground: "#1c1c22",
  formBorderColor: "#2a2a38",
  formBorderRadius: 16,
  formPadding: 28,
  showShadow: true,

  labelColor: "#9090a8",
  labelFontSize: 12,

  requiredColor: "#f87171",

  inputBackground: "#141418",
  inputBorderColor: "#2a2a38",
  inputBorderRadius: 8,
  inputTextColor: "#f0f0f5",
  inputPlaceholderColor: "#5a5a72",
  inputFontSize: 14,
  inputFocusBorderColor: "#7c6cfc",

  dropdownBackground: "#1c1c22",
  dropdownBorderColor: "#2a2a38",
  dropdownItemHoverBg: "#242430",
  dropdownItemTextColor: "#c0c0d8",

  accentColor: "#7c6cfc",
  accentTextColor: "#ffffff",

  buttonBackground: "#7c6cfc",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonLabel: "Submit",

  fieldGap: 20,
};

export const lightFormConfig: FormConfig = {
  ...darkFormConfig,
  fields: darkFormConfig.fields.map((f) => ({
    ...f,
    id: f.id.replace("_d", "_l"),
  })),

  formBackground: "#ffffff",
  formBorderColor: "#d4d4e0",

  labelColor: "#6b7280",

  inputBackground: "#f9f9fb",
  inputBorderColor: "#d4d4e0",
  inputTextColor: "#1a1a2e",
  inputPlaceholderColor: "#9090a8",
  inputFocusBorderColor: "#6c5ce7",

  dropdownBackground: "#ffffff",
  dropdownBorderColor: "#d4d4e0",
  dropdownItemHoverBg: "#f4f4f8",
  dropdownItemTextColor: "#1a1a2e",

  accentColor: "#6c5ce7",
  accentTextColor: "#ffffff",

  buttonBackground: "#6c5ce7",

  requiredColor: "#ef4444",
};

export const formModePresets: Record<FormMode, FormConfig> = {
  dark: darkFormConfig,
  light: lightFormConfig,
};

export const defaultFormConfig = darkFormConfig;
