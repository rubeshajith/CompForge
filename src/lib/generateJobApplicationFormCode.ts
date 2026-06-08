// /lib/generateJobApplicationFormCode.ts

import { JobApplicationFormConfig } from "./jobApplicationFormConfig";

export function generateJobApplicationFormJSX(
  config: JobApplicationFormConfig,
): string {
  const {
    jobTitle,
    companyName,
    jobDescription,
    jobLocation,
    jobType,
    showLinkedIn,
    showPortfolio,
    showSalaryExpectation,
    showStartDate,
    showCoverLetter,
    showPhoneField,
    formLayout,
    formWidth,
    inputBorderRadius,
    buttonStyle,
    buttonBackground,
    buttonTextColor,
    buttonBorderRadius,
    buttonHoverBackground,
    fontSize,
  } = config;

  const isTwo = formLayout === "two-column";

  const conditionalFields = [
    showPhoneField
      ? `          <Field label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />`
      : null,
    showLinkedIn
      ? `          <Field label="LinkedIn Profile" type="url" placeholder="linkedin.com/in/your-profile" />`
      : null,
    showPortfolio
      ? `          <Field label="Portfolio / Website" type="url" placeholder="yourwebsite.com" />`
      : null,
    showSalaryExpectation
      ? `          <Field label="Salary Expectation" placeholder="e.g. $120,000/yr" />`
      : null,
    showStartDate
      ? `          <Field label="Earliest Start Date" type="date" />`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const coverLetterSection = showCoverLetter
    ? `
        <div className="jaf__divider" />
        <p className="jaf__section-title">Cover Letter</p>
        <Field
          label="Tell us why you're a great fit"
          required
          isTextarea
          placeholder="Share your experience and motivation…"
        />`
    : "";

  return `import { useState } from "react";
import "./JobApplicationForm.css";

export default function JobApplicationForm({ onSubmit }) {
  const [hoverBtn, setHoverBtn] = useState(false);

  function Field({ label, required, type = "text", placeholder, isTextarea }) {
    return (
      <div className="jaf__field">
        <label className="jaf__label">
          {label}
          {required && <span className="jaf__required">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            className="jaf__input jaf__textarea"
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
            rows={4}
          />
        ) : (
          <input
            className="jaf__input"
            type={type}
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
          />
        )}
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit && onSubmit(e);
  }

  return (
    <div className="jaf-wrap">
      <form className="jaf" onSubmit={handleSubmit}>

        {/* Header */}
        <div className="jaf__header">
          <div className="jaf__company">${companyName}</div>
          <h2 className="jaf__title">${jobTitle}</h2>
          <div className="jaf__meta">
            <span className="jaf__location">📍 ${jobLocation}</span>
            <span className="jaf__badge">${jobType}</span>
          </div>
          ${jobDescription ? `<p className="jaf__description">${jobDescription}</p>` : ""}
        </div>

        {/* Body */}
        <div className="jaf__body">

          {/* Personal Info */}
          <p className="jaf__section-title">Personal Information</p>
          <div className="jaf__grid${isTwo ? " jaf__grid--two" : ""}">
            <Field label="First Name" required />
            <Field label="Last Name" required />
            <Field label="Email Address" required type="email" placeholder="you@example.com" />
${conditionalFields ? `${conditionalFields}\n` : ""}          </div>

          <div className="jaf__divider" />

          {/* Professional Details */}
          <p className="jaf__section-title">Professional Details</p>
          <div className="jaf__grid${isTwo ? " jaf__grid--two" : ""}">
            <Field label="Current Role / Title" placeholder="e.g. Frontend Developer" />
            <Field label="Years of Experience" type="number" placeholder="e.g. 5" />
          </div>
${coverLetterSection}

          <div className="jaf__divider" />

          {/* Resume */}
          <p className="jaf__section-title">Resume / CV</p>
          <div className="jaf__upload">
            <div className="jaf__upload-icon">📎</div>
            <div className="jaf__upload-title">Drop your resume here</div>
            <div className="jaf__upload-hint">PDF, DOC, DOCX — max 5 MB</div>
          </div>

          {/* Submit */}
          <div className="jaf__footer">
            <button
              type="submit"
              className="jaf__submit"
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{ backgroundColor: hoverBtn ? "${buttonHoverBackground}" : "${buttonBackground}" }}
            >
              Submit Application →
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}`;
}

export function generateJobApplicationFormCSS(
  config: JobApplicationFormConfig,
): string {
  const {
    formWidth,
    backgroundColor,
    borderColor,
    borderRadius,
    showShadow,
    headerBackground,
    headerTextColor,
    companyTagColor,
    jobTypeBadgeBackground,
    jobTypeBadgeTextColor,
    inputBackground,
    inputBorderColor,
    inputBorderRadius,
    inputTextColor,
    inputPlaceholderColor,
    inputFocusBorderColor,
    labelColor,
    fontSize,
    sectionTitleColor,
    dividerColor,
    buttonStyle,
    buttonBackground,
    buttonTextColor,
    buttonBorderRadius,
    buttonHoverBackground,
    requiredColor,
  } = config;

  const shadow = showShadow ? "0 8px 48px rgba(0,0,0,0.45)" : "none";

  const btnBase = `
  padding: 11px 28px;
  font-size: ${fontSize}px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  letter-spacing: 0.01em;
  font-family: inherit;`;

  const btnStyle =
    buttonStyle === "outlined"
      ? `background: transparent;
  color: ${buttonBackground};
  border: 1.5px solid ${buttonBackground};
  border-radius: ${buttonBorderRadius}px;`
      : buttonStyle === "pill"
        ? `background: ${buttonBackground};
  color: ${buttonTextColor};
  border: none;
  border-radius: 999px;
  padding: 11px 32px;`
        : `background: ${buttonBackground};
  color: ${buttonTextColor};
  border: none;
  border-radius: ${buttonBorderRadius}px;`;

  return `.jaf-wrap {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.jaf {
  width: ${formWidth}px;
  max-width: 100%;
  background: ${backgroundColor};
  border: 1px solid ${borderColor};
  border-radius: ${borderRadius}px;
  overflow: hidden;
  box-shadow: ${shadow};
  font-family: 'Instrument Sans', system-ui, sans-serif;
  font-size: ${fontSize}px;
}

/* ─── Header ─── */
.jaf__header {
  background: ${headerBackground};
  padding: 24px 28px 20px;
  border-bottom: 1px solid ${borderColor};
}

.jaf__company {
  font-size: ${fontSize - 1}px;
  color: ${companyTagColor};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.jaf__title {
  margin: 0;
  font-size: ${fontSize + 7}px;
  font-weight: 700;
  color: ${headerTextColor};
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.jaf__meta {
  margin-top: 8px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.jaf__location {
  color: ${companyTagColor};
  font-size: ${fontSize - 1}px;
}

.jaf__badge {
  background: ${jobTypeBadgeBackground};
  color: ${jobTypeBadgeTextColor};
  font-size: ${fontSize - 1}px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  letter-spacing: 0.03em;
}

.jaf__description {
  margin: 14px 0 0;
  font-size: ${fontSize - 1}px;
  color: ${companyTagColor};
  line-height: 1.65;
  max-width: 540px;
}

/* ─── Body ─── */
.jaf__body {
  padding: 24px 28px 28px;
}

.jaf__section-title {
  margin: 0 0 16px;
  font-size: ${fontSize + 1}px;
  font-weight: 600;
  color: ${sectionTitleColor};
  letter-spacing: -0.01em;
}

.jaf__divider {
  border-top: 1px solid ${dividerColor};
  margin: 24px 0;
}

/* ─── Grid ─── */
.jaf__grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jaf__grid--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 540px) {
  .jaf__grid--two {
    grid-template-columns: 1fr;
  }
}

/* ─── Fields ─── */
.jaf__field {
  display: flex;
  flex-direction: column;
}

.jaf__label {
  display: block;
  font-size: ${fontSize - 1}px;
  color: ${labelColor};
  margin-bottom: 5px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.jaf__required {
  color: ${requiredColor};
  margin-left: 3px;
}

.jaf__input {
  width: 100%;
  background: ${inputBackground};
  border: 1px solid ${inputBorderColor};
  border-radius: ${inputBorderRadius}px;
  color: ${inputTextColor};
  font-size: ${fontSize}px;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
  font-family: inherit;
}

.jaf__input::placeholder {
  color: ${inputPlaceholderColor};
}

.jaf__input:focus {
  border-color: ${inputFocusBorderColor};
}

.jaf__textarea {
  resize: vertical;
  line-height: 1.5;
}

/* ─── Upload ─── */
.jaf__upload {
  border: 1.5px dashed ${inputBorderColor};
  border-radius: ${inputBorderRadius}px;
  padding: 22px 16px;
  text-align: center;
  color: ${inputPlaceholderColor};
  font-size: ${fontSize - 1}px;
  background: ${inputBackground};
}

.jaf__upload-icon {
  font-size: 22px;
  margin-bottom: 6px;
}

.jaf__upload-title {
  font-weight: 500;
  margin-bottom: 2px;
}

/* ─── Footer ─── */
.jaf__footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* ─── Button ─── */
.jaf__submit {
  ${btnBase}
  ${btnStyle}
}

.jaf__submit:hover {
  background: ${buttonHoverBackground};${buttonStyle === "outlined" ? `\n  color: ${buttonTextColor};\n  border-color: ${buttonHoverBackground};` : ""}
}`;
}

// ─── TSX + CSS ────────────────────────
export function generateJobApplicationFormTSX(
  config: JobApplicationFormConfig,
): string {
  const {
    jobTitle,
    companyName,
    jobDescription,
    jobLocation,
    jobType,
    showLinkedIn,
    showPortfolio,
    showSalaryExpectation,
    showStartDate,
    showCoverLetter,
    showPhoneField,
    formLayout,
    formWidth,
    inputBorderRadius,
    buttonStyle,
    buttonBackground,
    buttonTextColor,
    buttonBorderRadius,
    buttonHoverBackground,
    fontSize,
  } = config;

  const isTwo = formLayout === "two-column";

  const conditionalFields = [
    showPhoneField
      ? `          <Field label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />`
      : null,
    showLinkedIn
      ? `          <Field label="LinkedIn Profile" type="url" placeholder="linkedin.com/in/your-profile" />`
      : null,
    showPortfolio
      ? `          <Field label="Portfolio / Website" type="url" placeholder="yourwebsite.com" />`
      : null,
    showSalaryExpectation
      ? `          <Field label="Salary Expectation" placeholder="e.g. $120,000/yr" />`
      : null,
    showStartDate
      ? `          <Field label="Earliest Start Date" type="date" />`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const coverLetterSection = showCoverLetter
    ? `
        <div className="jaf__divider" />
        <p className="jaf__section-title">Cover Letter</p>
        <Field
          label="Tell us why you're a great fit"
          required
          isTextarea
          placeholder="Share your experience and motivation…"
        />`
    : "";

  return `import { useState } from "react";
import "./JobApplicationForm.css";

interface FieldProps {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  isTextarea?: boolean;
}

interface JobApplicationFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function JobApplicationForm({ onSubmit }: JobApplicationFormProps) {
  const [hoverBtn, setHoverBtn] = useState<boolean>(false);

  function Field({ label, required, type = "text", placeholder, isTextarea }: FieldProps) {
    return (
      <div className="jaf__field">
        <label className="jaf__label">
          {label}
          {required && <span className="jaf__required">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            className="jaf__input jaf__textarea"
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
            rows={4}
          />
        ) : (
          <input
            className="jaf__input"
            type={type}
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
          />
        )}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit && onSubmit(e);
  }

  return (
    <div className="jaf-wrap">
      <form className="jaf" onSubmit={handleSubmit}>

        {/* Header */}
        <div className="jaf__header">
          <div className="jaf__company">${companyName}</div>
          <h2 className="jaf__title">${jobTitle}</h2>
          <div className="jaf__meta">
            <span className="jaf__location">📍 ${jobLocation}</span>
            <span className="jaf__badge">${jobType}</span>
          </div>
          ${jobDescription ? `<p className="jaf__description">${jobDescription}</p>` : ""}
        </div>

        {/* Body */}
        <div className="jaf__body">

          {/* Personal Info */}
          <p className="jaf__section-title">Personal Information</p>
          <div className="jaf__grid${isTwo ? " jaf__grid--two" : ""}">
            <Field label="First Name" required />
            <Field label="Last Name" required />
            <Field label="Email Address" required type="email" placeholder="you@example.com" />
${conditionalFields ? `${conditionalFields}\n` : ""}          </div>

          <div className="jaf__divider" />

          {/* Professional Details */}
          <p className="jaf__section-title">Professional Details</p>
          <div className="jaf__grid${isTwo ? " jaf__grid--two" : ""}">
            <Field label="Current Role / Title" placeholder="e.g. Frontend Developer" />
            <Field label="Years of Experience" type="number" placeholder="e.g. 5" />
          </div>
${coverLetterSection}

          <div className="jaf__divider" />

          {/* Resume */}
          <p className="jaf__section-title">Resume / CV</p>
          <div className="jaf__upload">
            <div className="jaf__upload-icon">📎</div>
            <div className="jaf__upload-title">Drop your resume here</div>
            <div className="jaf__upload-hint">PDF, DOC, DOCX — max 5 MB</div>
          </div>

          {/* Submit */}
          <div className="jaf__footer">
            <button
              type="submit"
              className="jaf__submit"
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{ backgroundColor: hoverBtn ? "${buttonHoverBackground}" : "${buttonBackground}" }}
            >
              Submit Application →
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}`;
}

// ─── TSX + Tailwind ───────────────────
export function generateJobApplicationFormTailwind(
  config: JobApplicationFormConfig,
): string {
  const {
    jobTitle,
    companyName,
    jobDescription,
    jobLocation,
    jobType,
    showLinkedIn,
    showPortfolio,
    showSalaryExpectation,
    showStartDate,
    showCoverLetter,
    showPhoneField,
    formLayout,
    formWidth,
    backgroundColor,
    borderColor,
    borderRadius,
    showShadow,
    headerBackground,
    headerTextColor,
    companyTagColor,
    jobTypeBadgeBackground,
    jobTypeBadgeTextColor,
    inputBackground,
    inputBorderColor,
    inputBorderRadius,
    inputTextColor,
    inputPlaceholderColor,
    inputFocusBorderColor,
    labelColor,
    fontSize,
    sectionTitleColor,
    dividerColor,
    buttonStyle,
    buttonBackground,
    buttonTextColor,
    buttonBorderRadius,
    buttonHoverBackground,
    requiredColor,
  } = config;

  const shadow = showShadow ? "0 8px 48px rgba(0,0,0,0.45)" : "none";

  const isTwo = formLayout === "two-column";

  // Baked font sizes
  const fsBase = fontSize;
  const fsSmall = fontSize - 1;
  const fsTitle = fontSize + 7;
  const fsSectionTitle = fontSize + 1;

  // Button style classes
  const btnBaseClasses = `inline-flex items-center cursor-pointer font-semibold transition-colors duration-[180ms] tracking-[0.01em] font-sans`;
  const btnSizeClasses =
    buttonStyle === "pill"
      ? `px-8 py-[11px] rounded-full`
      : `px-7 py-[11px] rounded-[var(--jaf-btn-radius)]`;

  let btnColorClasses: string;
  if (buttonStyle === "outlined") {
    btnColorClasses = `bg-transparent text-[var(--jaf-btn-bg)] border border-[var(--jaf-btn-bg)]`;
  } else {
    btnColorClasses = `bg-[var(--jaf-btn-bg)] text-[var(--jaf-btn-text)] border-none`;
  }

  const conditionalFields = [
    showPhoneField
      ? `          <Field label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />`
      : null,
    showLinkedIn
      ? `          <Field label="LinkedIn Profile" type="url" placeholder="linkedin.com/in/your-profile" />`
      : null,
    showPortfolio
      ? `          <Field label="Portfolio / Website" type="url" placeholder="yourwebsite.com" />`
      : null,
    showSalaryExpectation
      ? `          <Field label="Salary Expectation" placeholder="e.g. $120,000/yr" />`
      : null,
    showStartDate
      ? `          <Field label="Earliest Start Date" type="date" />`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const coverLetterSection = showCoverLetter
    ? `
        <div className="border-t border-[var(--jaf-divider)] my-6" />
        <p className="text-[${fsSectionTitle}px] font-semibold text-[var(--jaf-section-title)] tracking-[-0.01em] mb-4">Cover Letter</p>
        <Field
          label="Tell us why you're a great fit"
          required
          isTextarea
          placeholder="Share your experience and motivation…"
        />`
    : "";

  return `import { useState, CSSProperties } from "react";

interface FieldProps {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  isTextarea?: boolean;
}

interface JobApplicationFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Baked-in CSS variable tokens — update these to reskin the JobApplicationForm
const jafVars: CSSProperties = {
  "--jaf-bg":               "${backgroundColor}",
  "--jaf-border":           "${borderColor}",
  "--jaf-radius":           "${borderRadius}px",
  "--jaf-header-bg":        "${headerBackground}",
  "--jaf-header-text":      "${headerTextColor}",
  "--jaf-company-tag":      "${companyTagColor}",
  "--jaf-badge-bg":         "${jobTypeBadgeBackground}",
  "--jaf-badge-text":       "${jobTypeBadgeTextColor}",
  "--jaf-input-bg":         "${inputBackground}",
  "--jaf-input-border":     "${inputBorderColor}",
  "--jaf-input-radius":     "${inputBorderRadius}px",
  "--jaf-input-text":       "${inputTextColor}",
  "--jaf-input-placeholder":"${inputPlaceholderColor}",
  "--jaf-input-focus":      "${inputFocusBorderColor}",
  "--jaf-label":            "${labelColor}",
  "--jaf-section-title":    "${sectionTitleColor}",
  "--jaf-divider":          "${dividerColor}",
  "--jaf-btn-bg":           "${buttonBackground}",
  "--jaf-btn-text":         "${buttonTextColor}",
  "--jaf-btn-radius":       "${buttonBorderRadius}px",
  "--jaf-btn-hover-bg":     "${buttonHoverBackground}",
  "--jaf-required":         "${requiredColor}",
} as CSSProperties;

export default function JobApplicationForm({ onSubmit }: JobApplicationFormProps) {
  const [hoverBtn, setHoverBtn] = useState<boolean>(false);

  function Field({ label, required, type = "text", placeholder, isTextarea }: FieldProps) {
    return (
      <div className="flex flex-col">
        <label className="text-[${fsSmall}px] text-[var(--jaf-label)] mb-[5px] font-medium tracking-[0.02em]">
          {label}
          {required && <span className="text-[var(--jaf-required)] ml-[3px]">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            className="w-full bg-[var(--jaf-input-bg)] border border-[var(--jaf-input-border)] rounded-[var(--jaf-input-radius)] text-[var(--jaf-input-text)] text-[${fsBase}px] px-3 py-[9px] outline-none box-border transition-colors duration-[150ms] resize-y leading-[1.5] font-sans placeholder:text-[var(--jaf-input-placeholder)] focus:border-[var(--jaf-input-focus)]"
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
            rows={4}
          />
        ) : (
          <input
            className="w-full bg-[var(--jaf-input-bg)] border border-[var(--jaf-input-border)] rounded-[var(--jaf-input-radius)] text-[var(--jaf-input-text)] text-[${fsBase}px] px-3 py-[9px] outline-none box-border transition-colors duration-[150ms] font-sans placeholder:text-[var(--jaf-input-placeholder)] focus:border-[var(--jaf-input-focus)]"
            type={type}
            placeholder={placeholder ?? \`Enter \${label.toLowerCase()}…\`}
          />
        )}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit && onSubmit(e);
  }

  return (
    <div
      className="flex justify-center p-10 px-4 font-sans"
      style={jafVars}
    >
      <form
        className="w-[${formWidth}px] max-w-full bg-[var(--jaf-bg)] border border-[var(--jaf-border)] rounded-[var(--jaf-radius)] overflow-hidden text-[${fsBase}px]"
        style={{ boxShadow: "${shadow}" }}
        onSubmit={handleSubmit}
      >

        {/* Header */}
        <div className="bg-[var(--jaf-header-bg)] px-7 pt-6 pb-5 border-b border-[var(--jaf-border)]">
          <div className="text-[${fsSmall}px] text-[var(--jaf-company-tag)] font-medium uppercase tracking-[0.08em] mb-[6px]">${companyName}</div>
          <h2 className="m-0 text-[${fsTitle}px] font-bold text-[var(--jaf-header-text)] tracking-[-0.02em] leading-[1.2]">${jobTitle}</h2>
          <div className="mt-2 flex gap-[10px] flex-wrap items-center">
            <span className="text-[var(--jaf-company-tag)] text-[${fsSmall}px]">📍 ${jobLocation}</span>
            <span className="bg-[var(--jaf-badge-bg)] text-[var(--jaf-badge-text)] text-[${fsSmall}px] font-semibold px-[10px] py-[2px] rounded-full tracking-[0.03em]">${jobType}</span>
          </div>
          ${jobDescription ? `<p className="mt-[14px] mb-0 text-[${fsSmall}px] text-[var(--jaf-company-tag)] leading-[1.65] max-w-[540px]">${jobDescription}</p>` : ""}
        </div>

        {/* Body */}
        <div className="px-7 pt-6 pb-7">

          {/* Personal Info */}
          <p className="text-[${fsSectionTitle}px] font-semibold text-[var(--jaf-section-title)] tracking-[-0.01em] mb-4 mt-0">Personal Information</p>
          <div className="${isTwo ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}">
            <Field label="First Name" required />
            <Field label="Last Name" required />
            <Field label="Email Address" required type="email" placeholder="you@example.com" />
${conditionalFields ? `${conditionalFields}\n` : ""}          </div>

          <div className="border-t border-[var(--jaf-divider)] my-6" />

          {/* Professional Details */}
          <p className="text-[${fsSectionTitle}px] font-semibold text-[var(--jaf-section-title)] tracking-[-0.01em] mb-4 mt-0">Professional Details</p>
          <div className="${isTwo ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}">
            <Field label="Current Role / Title" placeholder="e.g. Frontend Developer" />
            <Field label="Years of Experience" type="number" placeholder="e.g. 5" />
          </div>
${coverLetterSection}

          <div className="border-t border-[var(--jaf-divider)] my-6" />

          {/* Resume */}
          <p className="text-[${fsSectionTitle}px] font-semibold text-[var(--jaf-section-title)] tracking-[-0.01em] mb-4 mt-0">Resume / CV</p>
          <div className="border-2 border-dashed border-[var(--jaf-input-border)] rounded-[var(--jaf-input-radius)] p-[22px_16px] text-center text-[var(--jaf-input-placeholder)] text-[${fsSmall}px] bg-[var(--jaf-input-bg)]">
            <div className="text-[22px] mb-[6px]">📎</div>
            <div className="font-medium mb-[2px]">Drop your resume here</div>
            <div>PDF, DOC, DOCX — max 5 MB</div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="${btnBaseClasses} ${btnSizeClasses} ${btnColorClasses} text-[${fsBase}px]"
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{ backgroundColor: hoverBtn ? "${buttonHoverBackground}" : undefined }}
            >
              Submit Application →
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}`;
}
