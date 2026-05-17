"use client";

import { useState, useMemo } from "react";
import {
  FormConfig,
  FormField,
  FieldType,
  createField,
} from "@/lib/formConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import styles from "@/components/playground/ControlPanel.module.css";
import { debounce } from "@/utils/debounce";

interface Props {
  config: FormConfig;
  onChange: (patch: Partial<FormConfig>) => void;
  onReset: () => void;
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Text Input",
  dropdown: "Dropdown",
  multiselect: "Multi-Select Dropdown",
  "date-single": "Date Picker (Single)",
  "date-range": "Date Picker (Range)",
  datetime: "Date & Time Picker",
  "star-rating": "Star Rating",
  chips: "Chips / Tabs",
  radio: "Radio Buttons",
};

const ALL_TYPES: FieldType[] = [
  "text",
  "dropdown",
  "multiselect",
  "date-single",
  "date-range",
  "datetime",
  "star-rating",
  "chips",
  "radio",
];

export function FormControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof FormConfig, value: number) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  }
  function handleSliderEnd(key: keyof FormConfig, value: number) {
    onChange({ [key]: value });
  }

  function updateField(id: string, patch: Partial<FormField>) {
    const fields = config.fields.map((f) =>
      f.id === id ? { ...f, ...patch } : f,
    );
    onChange({ fields });
  }

  function removeField(id: string) {
    onChange({ fields: config.fields.filter((f) => f.id !== id) });
    if (expandedFieldId === id) setExpandedFieldId(null);
  }

  function addField(type: FieldType) {
    const newField = createField(type);
    onChange({ fields: [...config.fields, newField] });
    setExpandedFieldId(newField.id);
  }

  function moveField(id: string, dir: -1 | 1) {
    const fields = [...config.fields];
    const idx = fields.findIndex((f) => f.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= fields.length) return;
    [fields[idx], fields[newIdx]] = [fields[newIdx], fields[idx]];
    onChange({ fields });
  }

  function updateOptions(id: string, raw: string) {
    const options = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateField(id, { options });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Fields List ─────────────────────────────────────────────────── */}
      <Section title="Form Fields">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {config.fields.map((field, idx) => {
            const isExpanded = expandedFieldId === field.id;
            const hasOptions = [
              "dropdown",
              "multiselect",
              "chips",
              "radio",
            ].includes(field.type);
            return (
              <div
                key={field.id}
                style={{
                  border: "1px solid #2a2a38",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: "#141418",
                    gap: 6,
                  }}
                >
                  {/* Up/down */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <button
                      onClick={() => moveField(field.id, -1)}
                      disabled={idx === 0}
                      style={arrowBtn(idx === 0)}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveField(field.id, 1)}
                      disabled={idx === config.fields.length - 1}
                      style={arrowBtn(idx === config.fields.length - 1)}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() =>
                      setExpandedFieldId(isExpanded ? null : field.id)
                    }
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "#f0f0f5",
                      fontSize: 13,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {field.label || "(no label)"}
                    </span>
                    <span style={{ fontSize: 11, color: "#5a5a72" }}>
                      {FIELD_TYPE_LABELS[field.type]}
                    </span>
                  </button>

                  <button
                    onClick={() => removeField(field.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f87171",
                      fontSize: 16,
                      padding: "0 4px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Expanded options */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      borderTop: "1px solid #2a2a38",
                    }}
                  >
                    {/* Label */}
                    <div className={styles.row}>
                      <span className={styles.label}>Label</span>
                      <input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        style={textInputStyle}
                      />
                    </div>

                    {/* Placeholder (for text/date types) */}
                    {["text", "date-single", "date-range", "datetime"].includes(
                      field.type,
                    ) && (
                      <div className={styles.row}>
                        <span className={styles.label}>Placeholder</span>
                        <input
                          value={field.placeholder ?? ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: e.target.value,
                            })
                          }
                          style={textInputStyle}
                        />
                      </div>
                    )}

                    {/* Required toggle */}
                    <div className={styles.row}>
                      <span className={styles.label}>Required</span>
                      <button
                        onClick={() =>
                          updateField(field.id, { required: !field.required })
                        }
                        style={{
                          ...toggleStyle,
                          background: field.required ? "#7c6cfc" : "#242430",
                          color: field.required ? "#fff" : "#9090a8",
                        }}
                      >
                        {field.required ? "Yes" : "No"}
                      </button>
                    </div>

                    {/* Max stars */}
                    {field.type === "star-rating" && (
                      <div className={styles.row}>
                        <span className={styles.label}>Max Stars</span>
                        <input
                          type="number"
                          min={3}
                          max={10}
                          value={field.maxStars ?? 5}
                          onChange={(e) =>
                            updateField(field.id, {
                              maxStars: Math.max(
                                3,
                                Math.min(10, +e.target.value),
                              ),
                            })
                          }
                          style={{ ...textInputStyle, width: 60 }}
                        />
                      </div>
                    )}

                    {/* Options textarea */}
                    {hasOptions && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#9090a8",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Options (one per line)
                        </span>
                        <textarea
                          rows={4}
                          value={(field.options ?? []).join("\n")}
                          onChange={(e) =>
                            updateOptions(field.id, e.target.value)
                          }
                          style={{
                            ...textInputStyle,
                            resize: "vertical",
                            fontFamily: "DM Mono, monospace",
                            fontSize: 12,
                            lineHeight: 1.6,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add field */}
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: 11,
              color: "#9090a8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Add Field
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => addField(type)}
                style={addBtnStyle}
              >
                + {FIELD_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Form Container ────────────────────────────────────────────── */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={config.formBackground}
          onChange={(v) => onChange({ formBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.formBorderColor}
          onChange={(v) => onChange({ formBorderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.formBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => handleSlider("formBorderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("formBorderRadius", v)}
        />
        <SliderRow
          label="Padding"
          value={localConfig.formPadding}
          min={12}
          max={56}
          unit="px"
          onChange={(v) => handleSlider("formPadding", v)}
          onChangeEnd={(v) => handleSliderEnd("formPadding", v)}
        />
        <SliderRow
          label="Field Gap"
          value={localConfig.fieldGap}
          min={8}
          max={40}
          unit="px"
          onChange={(v) => handleSlider("fieldGap", v)}
          onChangeEnd={(v) => handleSliderEnd("fieldGap", v)}
        />
        <ToggleRow
          label="Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
      </Section>

      {/* ── Labels ──────────────────────────────────────────────────── */}
      <Section title="Labels">
        <ColorRow
          label="Label Color"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
        />
        <SliderRow
          label="Label Size"
          value={localConfig.labelFontSize}
          min={10}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("labelFontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("labelFontSize", v)}
        />
        <ColorRow
          label="Required *"
          value={config.requiredColor}
          onChange={(v) => onChange({ requiredColor: v })}
        />
      </Section>

      {/* ── Input Fields ────────────────────────────────────────────── */}
      <Section title="Input Fields">
        <ColorRow
          label="Background"
          value={config.inputBackground}
          onChange={(v) => onChange({ inputBackground: v })}
        />
        <ColorRow
          label="Border"
          value={config.inputBorderColor}
          onChange={(v) => onChange({ inputBorderColor: v })}
        />
        <ColorRow
          label="Focus Border"
          value={config.inputFocusBorderColor}
          onChange={(v) => onChange({ inputFocusBorderColor: v })}
        />
        <ColorRow
          label="Text"
          value={config.inputTextColor}
          onChange={(v) => onChange({ inputTextColor: v })}
        />
        <ColorRow
          label="Placeholder"
          value={config.inputPlaceholderColor}
          onChange={(v) => onChange({ inputPlaceholderColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => handleSlider("inputBorderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("inputBorderRadius", v)}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.inputFontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => handleSlider("inputFontSize", v)}
          onChangeEnd={(v) => handleSliderEnd("inputFontSize", v)}
        />
      </Section>

      {/* ── Dropdowns / Popups ──────────────────────────────────────── */}
      <Section title="Dropdowns & Popups">
        <ColorRow
          label="Panel BG"
          value={config.dropdownBackground}
          onChange={(v) => onChange({ dropdownBackground: v })}
        />
        <ColorRow
          label="Panel Border"
          value={config.dropdownBorderColor}
          onChange={(v) => onChange({ dropdownBorderColor: v })}
        />
        <ColorRow
          label="Item Hover BG"
          value={config.dropdownItemHoverBg}
          onChange={(v) => onChange({ dropdownItemHoverBg: v })}
        />
        <ColorRow
          label="Item Text"
          value={config.dropdownItemTextColor}
          onChange={(v) => onChange({ dropdownItemTextColor: v })}
        />
      </Section>

      {/* ── Accent ──────────────────────────────────────────────────── */}
      <Section title="Accent">
        <ColorRow
          label="Accent Color"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
        <ColorRow
          label="Accent Text"
          value={config.accentTextColor}
          onChange={(v) => onChange({ accentTextColor: v })}
        />
      </Section>

      {/* ── Submit Button ────────────────────────────────────────────── */}
      <Section title="Submit Button">
        <ColorRow
          label="Background"
          value={config.buttonBackground}
          onChange={(v) => onChange({ buttonBackground: v })}
        />
        <ColorRow
          label="Text Color"
          value={config.buttonTextColor}
          onChange={(v) => onChange({ buttonTextColor: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.buttonBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("buttonBorderRadius", v)}
          onChangeEnd={(v) => handleSliderEnd("buttonBorderRadius", v)}
        />
        <div className={styles.row}>
          <span className={styles.label}>Button Label</span>
          <input
            value={config.buttonLabel}
            onChange={(e) => onChange({ buttonLabel: e.target.value })}
            style={textInputStyle}
          />
        </div>
      </Section>
    </ControlPanelShell>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const textInputStyle: React.CSSProperties = {
  background: "#141418",
  border: "1px solid #2a2a38",
  borderRadius: 6,
  color: "#f0f0f5",
  fontSize: 13,
  padding: "5px 9px",
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const toggleStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 6,
  padding: "4px 12px",
  cursor: "pointer",
  fontSize: 12,
  fontFamily: "inherit",
  fontWeight: 500,
};

const addBtnStyle: React.CSSProperties = {
  background: "#1c1c22",
  border: "1px solid #2a2a38",
  borderRadius: 6,
  color: "#9090a8",
  fontSize: 11,
  padding: "5px 10px",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.15s",
};

function arrowBtn(disabled: boolean): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    cursor: disabled ? "default" : "pointer",
    color: disabled ? "#2a2a38" : "#9090a8",
    fontSize: 9,
    lineHeight: 1,
    padding: "1px 3px",
    display: "block",
  };
}
