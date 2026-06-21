"use client";
// /components/playground/JobApplicationFormControlPanel.tsx

import { useMemo, useState } from "react";
import { JobApplicationFormConfig } from "@/lib/jobApplicationFormConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: JobApplicationFormConfig;
  onChange: (patch: Partial<JobApplicationFormConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Hybrid",
] as const;
const BUTTON_STYLES = ["filled", "outlined", "pill"] as const;
const FORM_LAYOUTS = ["single", "two-column"] as const;

export function JobApplicationFormControlPanel({
  config,
  onChange,
  onReset,
  isDark = true,
}: Props) {
  const [localConfig, setLocalConfig] =
    useState<JobApplicationFormConfig>(config);

  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (patch: Partial<JobApplicationFormConfig>) => onChange(patch),
        100,
      ),
    [onChange],
  );

  function set<K extends keyof JobApplicationFormConfig>(
    key: K,
    value: JobApplicationFormConfig[K],
  ) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<JobApplicationFormConfig>);
  }

  function setSlider<K extends keyof JobApplicationFormConfig>(
    key: K,
    value: JobApplicationFormConfig[K],
  ) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    debouncedOnChange({ [key]: value } as Partial<JobApplicationFormConfig>);
  }

  function setSliderEnd<K extends keyof JobApplicationFormConfig>(
    key: K,
    value: JobApplicationFormConfig[K],
  ) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<JobApplicationFormConfig>);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ─── Job Info ─────────────────────────────────────── */}
      <Section title="Job Info">
        {/* Job Title text input */}
        <div className="row">
          <span className="label">Job Title</span>
          <input
            type="text"
            value={localConfig.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            style={{
              flex: 1,
              background: "#141418",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "5px 8px",
              fontFamily: "inherit",
              minWidth: 0,
            }}
          />
        </div>

        {/* Company Name */}
        <div className="row">
          <span className="label">Company</span>
          <input
            type="text"
            value={localConfig.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            style={{
              flex: 1,
              background: "#141418",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "5px 8px",
              fontFamily: "inherit",
              minWidth: 0,
            }}
          />
        </div>

        {/* Location */}
        <div className="row">
          <span className="label">Location</span>
          <input
            type="text"
            value={localConfig.jobLocation}
            onChange={(e) => set("jobLocation", e.target.value)}
            style={{
              flex: 1,
              background: "#141418",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "5px 8px",
              fontFamily: "inherit",
              minWidth: 0,
            }}
          />
        </div>

        {/* Job Type select */}
        <div className="row">
          <span className="label">Job Type</span>
          <select
            value={localConfig.jobType}
            onChange={(e) =>
              set(
                "jobType",
                e.target.value as JobApplicationFormConfig["jobType"],
              )
            }
            style={{
              flex: 1,
              background: "#141418",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "5px 8px",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description textarea */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label" style={{ fontSize: 11 }}>
            Job Description
          </span>
          <textarea
            value={localConfig.jobDescription}
            rows={4}
            onChange={(e) => set("jobDescription", e.target.value)}
            style={{
              background: "#141418",
              border: "1px solid #2a2a38",
              borderRadius: 6,
              color: "#f0f0f5",
              fontSize: 12,
              padding: "7px 8px",
              fontFamily: "inherit",
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        </div>
      </Section>

      {/* ─── Visible Fields ────────────────────────────────── */}
      <Section title="Form Fields">
        <ToggleRow
          label="Phone Field"
          value={localConfig.showPhoneField}
          onChange={(v) => set("showPhoneField", v)}
        />
        <ToggleRow
          label="LinkedIn URL"
          value={localConfig.showLinkedIn}
          onChange={(v) => set("showLinkedIn", v)}
        />
        <ToggleRow
          label="Portfolio URL"
          value={localConfig.showPortfolio}
          onChange={(v) => set("showPortfolio", v)}
        />
        <ToggleRow
          label="Salary Expectation"
          value={localConfig.showSalaryExpectation}
          onChange={(v) => set("showSalaryExpectation", v)}
        />
        <ToggleRow
          label="Start Date"
          value={localConfig.showStartDate}
          onChange={(v) => set("showStartDate", v)}
        />
        <ToggleRow
          label="Cover Letter"
          value={localConfig.showCoverLetter}
          onChange={(v) => set("showCoverLetter", v)}
        />
      </Section>

      {/* ─── Layout ────────────────────────────────────────── */}
      <Section title="Layout">
        {/* Layout mode */}
        <div className="row">
          <span className="label">Columns</span>
          <div style={{ display: "flex", gap: 6 }}>
            {FORM_LAYOUTS.map((l) => (
              <button
                key={l}
                onClick={() => set("formLayout", l)}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor:
                    localConfig.formLayout === l ? "#7c6cfc" : "#2a2a38",
                  background:
                    localConfig.formLayout === l ? "#7c6cfc22" : "transparent",
                  color: localConfig.formLayout === l ? "#9d91fd" : "#9090a8",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
              >
                {l === "single" ? "1 col" : "2 col"}
              </button>
            ))}
          </div>
        </div>

        <SliderRow
          label="Form Width"
          value={localConfig.formWidth}
          min={340}
          max={800}
          unit="px"
          onChange={(v) => setSlider("formWidth", v)}
          onChangeEnd={(v) => setSliderEnd("formWidth", v)}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={28}
          unit="px"
          onChange={(v) => setSlider("borderRadius", v)}
          onChangeEnd={(v) => setSliderEnd("borderRadius", v)}
        />
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => set("showShadow", v)}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => setSlider("fontSize", v)}
          onChangeEnd={(v) => setSliderEnd("fontSize", v)}
        />
      </Section>

      {/* ─── Container Colors ──────────────────────────────── */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => set("backgroundColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => set("borderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Header BG"
          value={localConfig.headerBackground}
          onChange={(v) => set("headerBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Header Text"
          value={localConfig.headerTextColor}
          onChange={(v) => set("headerTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Company Tag"
          value={localConfig.companyTagColor}
          onChange={(v) => set("companyTagColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Badge BG"
          value={localConfig.jobTypeBadgeBackground}
          onChange={(v) => set("jobTypeBadgeBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Badge Text"
          value={localConfig.jobTypeBadgeTextColor}
          onChange={(v) => set("jobTypeBadgeTextColor", v)}
          isDark={isDark}
/>
      </Section>

      {/* ─── Input Fields ──────────────────────────────────── */}
      <Section title="Input Fields">
        <ColorRow
          label="Input BG"
          value={localConfig.inputBackground}
          onChange={(v) => set("inputBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Input Border"
          value={localConfig.inputBorderColor}
          onChange={(v) => set("inputBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Focus Border"
          value={localConfig.inputFocusBorderColor}
          onChange={(v) => set("inputFocusBorderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Input Text"
          value={localConfig.inputTextColor}
          onChange={(v) => set("inputTextColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Placeholder"
          value={localConfig.inputPlaceholderColor}
          onChange={(v) => set("inputPlaceholderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Label"
          value={localConfig.labelColor}
          onChange={(v) => set("labelColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Input Radius"
          value={localConfig.inputBorderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => setSlider("inputBorderRadius", v)}
          onChangeEnd={(v) => setSliderEnd("inputBorderRadius", v)}
        />
        <ColorRow
          label="Section Title"
          value={localConfig.sectionTitleColor}
          onChange={(v) => set("sectionTitleColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Divider"
          value={localConfig.dividerColor}
          onChange={(v) => set("dividerColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Required *"
          value={localConfig.requiredColor}
          onChange={(v) => set("requiredColor", v)}
          isDark={isDark}
/>
      </Section>

      {/* ─── Button ────────────────────────────────────────── */}
      <Section title="Submit Button">
        {/* Button style picker */}
        <div className="row">
          <span className="label">Style</span>
          <div style={{ display: "flex", gap: 6 }}>
            {BUTTON_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => set("buttonStyle", s)}
                style={{
                  fontSize: 11,
                  padding: "4px 9px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor:
                    localConfig.buttonStyle === s ? "#7c6cfc" : "#2a2a38",
                  background:
                    localConfig.buttonStyle === s ? "#7c6cfc22" : "transparent",
                  color: localConfig.buttonStyle === s ? "#9d91fd" : "#9090a8",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                  textTransform: "capitalize" as const,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <ColorRow
          label="Button BG"
          value={localConfig.buttonBackground}
          onChange={(v) => set("buttonBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Hover BG"
          value={localConfig.buttonHoverBackground}
          onChange={(v) => set("buttonHoverBackground", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Button Text"
          value={localConfig.buttonTextColor}
          onChange={(v) => set("buttonTextColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Button Radius"
          value={localConfig.buttonBorderRadius}
          min={0}
          max={28}
          unit="px"
          onChange={(v) => setSlider("buttonBorderRadius", v)}
          onChangeEnd={(v) => setSliderEnd("buttonBorderRadius", v)}
        />
      </Section>
    </ControlPanelShell>
  );
}
