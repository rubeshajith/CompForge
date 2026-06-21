"use client";

// /components/playground/SignupModalControlPanel.tsx

import { useMemo, useState } from "react";
import {
  SignupModalConfig,
  CustomField,
  CustomDropdown,
} from "@/lib/signupModalConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: SignupModalConfig;
  onChange: (patch: Partial<SignupModalConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

// ──────────────────────────────────────────────────────────────
// Inline micro-styles (no CSS module dependency here)
// ──────────────────────────────────────────────────────────────
const S = {
  addRow: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  } as React.CSSProperties,

  addBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "7px 0",
    border: "1px dashed #2a2a38",
    borderRadius: 8,
    background: "transparent",
    color: "#9090a8",
    fontSize: 12,
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
  } as React.CSSProperties,

  fieldBlock: {
    background: "#141418",
    border: "1px solid #2a2a38",
    borderRadius: 10,
    padding: "12px",
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  } as React.CSSProperties,

  fieldHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  } as React.CSSProperties,

  fieldTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#7c6cfc",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  },

  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#5a5a72",
    fontSize: 14,
    lineHeight: 1,
    padding: "0 2px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  } as React.CSSProperties,

  miniLabel: {
    fontSize: 11,
    color: "#9090a8",
    marginBottom: 4,
    display: "block",
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
  },

  miniInput: {
    width: "100%",
    background: "#0c0c0f",
    border: "1px solid #2a2a38",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    color: "#f0f0f5",
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  } as React.CSSProperties,

  miniSelect: {
    width: "100%",
    background: "#0c0c0f",
    border: "1px solid #2a2a38",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    color: "#f0f0f5",
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  optionTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#242430",
    border: "1px solid #2a2a38",
    borderRadius: 5,
    padding: "2px 8px",
    fontSize: 11,
    color: "#c0c0d8",
    fontFamily: "var(--font-body, 'Instrument Sans', sans-serif)",
  } as React.CSSProperties,

  optionRemove: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#5a5a72",
    fontSize: 12,
    padding: 0,
    lineHeight: 1,
  } as React.CSSProperties,
};

// ──────────────────────────────────────────────────────────────
// Custom Field Editor
// ──────────────────────────────────────────────────────────────
function CustomFieldEditor({
  field,
  onUpdate,
  onRemove,
}: {
  field: CustomField;
  onUpdate: (patch: Partial<CustomField>) => void;
  onRemove: () => void;
}) {
  return (
    <div style={S.fieldBlock}>
      <div style={S.fieldHeader}>
        <span style={S.fieldTitle}>Text Field</span>
        <button style={S.removeBtn} onClick={onRemove} title="Remove field">
          ✕
        </button>
      </div>

      <div>
        <span style={S.miniLabel}>Label</span>
        <input
          style={S.miniInput}
          value={field.label}
          placeholder="e.g. Company"
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      <div>
        <span style={S.miniLabel}>Placeholder</span>
        <input
          style={S.miniInput}
          value={field.placeholder}
          placeholder="e.g. Acme Inc."
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
        />
      </div>

      <div>
        <span style={S.miniLabel}>Input type</span>
        <div style={{ position: "relative" }}>
          <select
            style={S.miniSelect}
            value={field.type}
            onChange={(e) =>
              onUpdate({ type: e.target.value as CustomField["type"] })
            }
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="number">Number</option>
            <option value="tel">Phone</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Custom Dropdown Editor
// ──────────────────────────────────────────────────────────────
function CustomDropdownEditor({
  dd,
  onUpdate,
  onRemove,
}: {
  dd: CustomDropdown;
  onUpdate: (patch: Partial<CustomDropdown>) => void;
  onRemove: () => void;
}) {
  const [newOption, setNewOption] = useState("");

  function addOption() {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    onUpdate({ options: [...dd.options, trimmed] });
    setNewOption("");
  }

  function removeOption(idx: number) {
    onUpdate({ options: dd.options.filter((_, i) => i !== idx) });
  }

  return (
    <div style={S.fieldBlock}>
      <div style={S.fieldHeader}>
        <span style={{ ...S.fieldTitle, color: "#4ade80" }}>Dropdown</span>
        <button style={S.removeBtn} onClick={onRemove} title="Remove dropdown">
          ✕
        </button>
      </div>

      <div>
        <span style={S.miniLabel}>Label</span>
        <input
          style={S.miniInput}
          value={dd.label}
          placeholder="e.g. Team Size"
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      <div>
        <span style={S.miniLabel}>Options</span>
        {dd.options.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 7,
            }}
          >
            {dd.options.map((opt, i) => (
              <span key={i} style={S.optionTag}>
                {opt}
                <button style={S.optionRemove} onClick={() => removeOption(i)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <input
            style={{ ...S.miniInput, flex: 1 }}
            value={newOption}
            placeholder="Add option…"
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addOption()}
          />
          <button
            onClick={addOption}
            style={{
              background: "#242430",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#9090a8",
              fontSize: 16,
              padding: "0 10px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Control Panel
// ──────────────────────────────────────────────────────────────
export function SignupModalControlPanel({ config, onChange, onReset }: Props) {
  const debouncedChange = useMemo(() => debounce(onChange, 80), [onChange]);

  // ── Custom field helpers ──────────────────────────────────
  function addCustomField() {
    const id = `field_${Date.now()}`;
    onChange({
      customFields: [
        ...config.customFields,
        { id, type: "text", label: "", placeholder: "" },
      ],
    });
  }

  function updateCustomField(id: string, patch: Partial<CustomField>) {
    onChange({
      customFields: config.customFields.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    });
  }

  function removeCustomField(id: string) {
    onChange({ customFields: config.customFields.filter((f) => f.id !== id) });
  }

  function addCustomDropdown() {
    const id = `dd_${Date.now()}`;
    onChange({
      customDropdowns: [
        ...config.customDropdowns,
        { id, label: "", options: [] },
      ],
    });
  }

  function updateCustomDropdown(id: string, patch: Partial<CustomDropdown>) {
    onChange({
      customDropdowns: config.customDropdowns.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    });
  }

  function removeCustomDropdown(id: string) {
    onChange({
      customDropdowns: config.customDropdowns.filter((d) => d.id !== id),
    });
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Container ───────────────────────────────────────── */}
      <Section title="Container">
        <SliderRow
          label="Width"
          value={config.modalWidth}
          min={360}
          max={640}
          unit="px"
          onChange={(v) => debouncedChange({ modalWidth: v })}
          onChangeEnd={(v) => onChange({ modalWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={config.modalBorderRadius}
          min={0}
          max={32}
          unit="px"
          onChange={(v) => debouncedChange({ modalBorderRadius: v })}
          onChangeEnd={(v) => onChange({ modalBorderRadius: v })}
        />
        <ColorRow
          label="Background"
          value={config.modalBackground}
          onChange={(v) => onChange({ modalBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.modalBorderColor}
          onChange={(v) => onChange({ modalBorderColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Show Shadow"
          value={config.showShadow}
          onChange={(v) => onChange({ showShadow: v })}
        />
        <ToggleRow
          label="Backdrop Blur"
          value={config.backdropBlur}
          onChange={(v) => onChange({ backdropBlur: v })}
        />
      </Section>

      {/* ── Branding ────────────────────────────────────────── */}
      <Section title="Branding">
        <ToggleRow
          label="Show Header"
          value={config.showBrandingHeader}
          onChange={(v) => onChange({ showBrandingHeader: v })}
        />
        <ColorRow
          label="Accent Color"
          value={config.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Icon Color"
          value={config.accentIconColor}
          onChange={(v) => onChange({ accentIconColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Heading"
          value={config.headingColor}
          onChange={(v) => onChange({ headingColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Subheading"
          value={config.subheadingColor}
          onChange={(v) => onChange({ subheadingColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Fields (core) ───────────────────────────────────── */}
      <Section title="Fields">
        <ToggleRow
          label="Full Name"
          value={config.showFullName}
          onChange={(v) => onChange({ showFullName: v })}
        />
        <ToggleRow
          label="Email"
          value={config.showEmail}
          onChange={(v) => onChange({ showEmail: v })}
        />
        <ToggleRow
          label="Password"
          value={config.showPassword}
          onChange={(v) => onChange({ showPassword: v })}
        />
        <ToggleRow
          label="Password Strength"
          value={config.showPasswordStrength}
          onChange={(v) => onChange({ showPasswordStrength: v })}
        />
        <ToggleRow
          label="Terms Checkbox"
          value={config.showTermsCheckbox}
          onChange={(v) => onChange({ showTermsCheckbox: v })}
        />
      </Section>

      {/* ── Input Styling ────────────────────────────────────── */}
      <Section title="Input Styling">
        <ColorRow
          label="Input Background"
          value={config.inputBackground}
          onChange={(v) => onChange({ inputBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={config.inputBorderColor}
          onChange={(v) => onChange({ inputBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Focus Border"
          value={config.inputFocusBorderColor}
          onChange={(v) => onChange({ inputFocusBorderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={config.inputTextColor}
          onChange={(v) => onChange({ inputTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Placeholder"
          value={config.inputPlaceholderColor}
          onChange={(v) => onChange({ inputPlaceholderColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Label"
          value={config.labelColor}
          onChange={(v) => onChange({ labelColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Input Radius"
          value={config.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => debouncedChange({ inputBorderRadius: v })}
          onChangeEnd={(v) => onChange({ inputBorderRadius: v })}
        />
      </Section>

      {/* ── CTA Button ──────────────────────────────────────── */}
      <Section title="CTA Button">
        <ColorRow
          label="Background"
          value={config.ctaBackground}
          onChange={(v) => onChange({ ctaBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text Color"
          value={config.ctaTextColor}
          onChange={(v) => onChange({ ctaTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Radius"
          value={config.ctaBorderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => debouncedChange({ ctaBorderRadius: v })}
          onChangeEnd={(v) => onChange({ ctaBorderRadius: v })}
        />
      </Section>

      {/* ── Social & Footer ─────────────────────────────────── */}
      <Section title="Social & Footer">
        <ToggleRow
          label="Social Buttons"
          value={config.showSocialButtons}
          onChange={(v) => onChange({ showSocialButtons: v })}
        />
        <ColorRow
          label="Footer Background"
          value={config.footerBackground}
          onChange={(v) => onChange({ footerBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Footer Text"
          value={config.footerTextColor}
          onChange={(v) => onChange({ footerTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Typography ──────────────────────────────────────── */}
      <Section title="Typography">
        <SliderRow
          label="Font Size"
          value={config.fontSize}
          min={11}
          max={18}
          unit="px"
          onChange={(v) => debouncedChange({ fontSize: v })}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
      </Section>

      {/* ── Custom Fields Builder ───────────────────────────── */}
      <Section title="Custom Fields">
        {/* Existing custom fields */}
        {config.customFields.map((field) => (
          <CustomFieldEditor
            key={field.id}
            field={field}
            onUpdate={(patch) => updateCustomField(field.id, patch)}
            onRemove={() => removeCustomField(field.id)}
          />
        ))}

        {/* Existing custom dropdowns */}
        {config.customDropdowns.map((dd) => (
          <CustomDropdownEditor
            key={dd.id}
            dd={dd}
            onUpdate={(patch) => updateCustomDropdown(dd.id, patch)}
            onRemove={() => removeCustomDropdown(dd.id)}
          />
        ))}

        {/* Add buttons */}
        <div style={S.addRow}>
          <button
            style={S.addBtn}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#7c6cfc";
              (e.currentTarget as HTMLElement).style.color = "#7c6cfc";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2a38";
              (e.currentTarget as HTMLElement).style.color = "#9090a8";
            }}
            onClick={addCustomField}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
            Add Field
          </button>

          <button
            style={S.addBtn}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#4ade80";
              (e.currentTarget as HTMLElement).style.color = "#4ade80";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2a38";
              (e.currentTarget as HTMLElement).style.color = "#9090a8";
            }}
            onClick={addCustomDropdown}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>⌄</span>
            Add Dropdown
          </button>
        </div>
      </Section>
    </ControlPanelShell>
  );
}
