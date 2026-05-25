"use client";
// /components/playground/JobApplicationFormPreview.tsx

import { JobApplicationFormConfig } from "@/lib/jobApplicationFormConfig";

interface Props {
  config: JobApplicationFormConfig;
}

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Hybrid",
] as const;

export function JobApplicationFormPreview({ config }: Props) {
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

  const isTwo = formLayout === "two-column";

  const containerStyle: React.CSSProperties = {
    width: formWidth,
    maxWidth: "100%",
    backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius,
    overflow: "hidden",
    boxShadow: showShadow ? "0 8px 48px rgba(0,0,0,0.45)" : "none",
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: inputBackground,
    border: `1px solid ${inputBorderColor}`,
    borderRadius: inputBorderRadius,
    color: inputTextColor,
    fontSize,
    padding: "9px 12px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: fontSize - 1,
    color: labelColor,
    marginBottom: 5,
    fontWeight: 500,
    letterSpacing: "0.02em",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column" as const,
  };

  const requiredDot = (
    <span style={{ color: requiredColor, marginLeft: 3 }}>*</span>
  );

  function Field({
    label,
    required,
    type = "text",
    placeholder,
    isTextarea,
  }: {
    label: string;
    required?: boolean;
    type?: string;
    placeholder?: string;
    isTextarea?: boolean;
  }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>
          {label}
          {required && requiredDot}
        </label>
        {isTextarea ? (
          <textarea
            placeholder={placeholder ?? `Enter ${label.toLowerCase()}…`}
            rows={4}
            readOnly
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder ?? `Enter ${label.toLowerCase()}…`}
            readOnly
            style={inputStyle}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                inputFocusBorderColor;
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                inputBorderColor;
            }}
          />
        )}
      </div>
    );
  }

  const gridStyle: React.CSSProperties = isTwo
    ? {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }
    : { display: "flex", flexDirection: "column", gap: 16 };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fontSize + 1,
    fontWeight: 600,
    color: sectionTitleColor,
    marginBottom: 16,
    letterSpacing: "-0.01em",
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: `1px solid ${dividerColor}`,
    margin: "24px 0",
  };

  const getButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.18s ease",
      fontFamily: "inherit",
      letterSpacing: "0.01em",
    };

    if (buttonStyle === "filled") {
      return {
        ...base,
        backgroundColor: buttonBackground,
        color: buttonTextColor,
        border: "none",
        borderRadius: buttonBorderRadius,
        padding: "11px 28px",
      };
    }
    if (buttonStyle === "outlined") {
      return {
        ...base,
        backgroundColor: "transparent",
        color: buttonBackground,
        border: `1.5px solid ${buttonBackground}`,
        borderRadius: buttonBorderRadius,
        padding: "10px 28px",
      };
    }
    // pill
    return {
      ...base,
      backgroundColor: buttonBackground,
      color: buttonTextColor,
      border: "none",
      borderRadius: 999,
      padding: "11px 32px",
    };
  };

  return (
    <div style={containerStyle}>
      {/* ─── Header ─── */}
      <div
        style={{
          backgroundColor: headerBackground,
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: fontSize - 1,
                color: companyTagColor,
                fontWeight: 500,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              {companyName}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: fontSize + 7,
                fontWeight: 700,
                color: headerTextColor,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {jobTitle}
            </h2>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 10,
                flexWrap: "wrap" as const,
                alignItems: "center",
              }}
            >
              <span style={{ color: companyTagColor, fontSize: fontSize - 1 }}>
                📍 {jobLocation}
              </span>
              <span
                style={{
                  backgroundColor: jobTypeBadgeBackground,
                  color: jobTypeBadgeTextColor,
                  fontSize: fontSize - 1,
                  fontWeight: 600,
                  padding: "2px 10px",
                  borderRadius: 999,
                  letterSpacing: "0.03em",
                }}
              >
                {jobType}
              </span>
            </div>
          </div>
        </div>

        {jobDescription && (
          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              fontSize: fontSize - 1,
              color: companyTagColor,
              lineHeight: 1.65,
              maxWidth: 540,
            }}
          >
            {jobDescription}
          </p>
        )}
      </div>

      {/* ─── Form Body ─── */}
      <div style={{ padding: "24px 28px 28px" }}>
        {/* Personal Info */}
        <p style={sectionTitleStyle}>Personal Information</p>
        <div style={gridStyle}>
          <Field label="First Name" required />
          <Field label="Last Name" required />
          <Field
            label="Email Address"
            required
            type="email"
            placeholder="you@example.com"
          />
          {showPhoneField && (
            <Field
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
            />
          )}
        </div>

        <div style={dividerStyle} />

        {/* Professional Info */}
        <p style={sectionTitleStyle}>Professional Details</p>
        <div style={{ ...gridStyle }}>
          <Field
            label="Current Role / Title"
            placeholder="e.g. Frontend Developer"
          />
          <Field
            label="Years of Experience"
            type="number"
            placeholder="e.g. 5"
          />
          {showLinkedIn && (
            <Field
              label="LinkedIn Profile"
              type="url"
              placeholder="linkedin.com/in/your-profile"
            />
          )}
          {showPortfolio && (
            <Field
              label="Portfolio / Website"
              type="url"
              placeholder="yourwebsite.com"
            />
          )}
          {showSalaryExpectation && (
            <Field label="Salary Expectation" placeholder="e.g. $120,000/yr" />
          )}
          {showStartDate && <Field label="Earliest Start Date" type="date" />}
        </div>

        {/* Cover Letter */}
        {showCoverLetter && (
          <>
            <div style={dividerStyle} />
            <p style={sectionTitleStyle}>Cover Letter</p>
            <Field
              label="Tell us why you're a great fit"
              required
              isTextarea
              placeholder="Share your experience, motivation, and what excites you about this role…"
            />
          </>
        )}

        {/* Resume upload placeholder */}
        <div style={dividerStyle} />
        <p style={sectionTitleStyle}>Resume / CV</p>
        <div
          style={{
            border: `1.5px dashed ${inputBorderColor}`,
            borderRadius: inputBorderRadius,
            padding: "22px 16px",
            textAlign: "center" as const,
            color: inputPlaceholderColor,
            fontSize: fontSize - 1,
            cursor: "default",
            backgroundColor: inputBackground,
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>
            Drop your resume here
          </div>
          <div>PDF, DOC, DOCX — max 5 MB</div>
        </div>

        {/* Submit */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={getButtonStyles()}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                buttonHoverBackground;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                buttonStyle === "outlined" ? "transparent" : buttonBackground;
            }}
          >
            Submit Application →
          </button>
        </div>
      </div>
    </div>
  );
}
