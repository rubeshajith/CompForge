// /lib/generateSignupModalCode.ts

import {
  SignupModalConfig,
  CustomField,
  CustomDropdown,
} from "./signupModalConfig";

// ──────────────────────────────────────────────────────────────
// JSX Generator
// ──────────────────────────────────────────────────────────────
export function generateSignupModalJSX(config: SignupModalConfig): string {
  const {
    modalWidth,
    modalBorderRadius,
    modalBackground,
    modalBorderColor,
    showShadow,
    accentColor,
    accentIconColor,
    headingText,
    subheadingText,
    headingColor,
    subheadingColor,
    showBrandingHeader,
    showFullName,
    showEmail,
    showPassword,
    showPasswordStrength,
    showTermsCheckbox,
    showSocialButtons,
    inputBackground,
    inputBorderColor,
    inputFocusBorderColor,
    inputTextColor,
    inputPlaceholderColor,
    inputBorderRadius,
    labelColor,
    ctaLabel,
    ctaBackground,
    ctaTextColor,
    ctaBorderRadius,
    footerBackground,
    footerTextColor,
    customFields,
    customDropdowns,
    fontSize,
    fontFamily,
  } = config;

  const shadow = showShadow ? "0 8px 48px rgba(0,0,0,0.5)" : "none";

  // ── Render custom fields ────────────────────────────────
  function renderCustomFields(): string {
    if (!customFields.length) return "";
    return customFields
      .map(
        (f: CustomField) => `
        {/* Custom Field: ${f.label || "Untitled"} */}
        <div>
          <label style={{ display: "block", fontSize: ${fontSize - 1}, color: "${labelColor}", marginBottom: 6, fontWeight: 500 }}>
            ${f.label || "Custom Field"}
          </label>
          <div style={{ position: "relative" }}>
            <input
              style={{
                width: "100%",
                background: "${inputBackground}",
                border: "1px solid ${inputBorderColor}",
                borderRadius: ${inputBorderRadius},
                padding: "10px 12px 10px 16px",
                fontSize: ${fontSize},
                color: "${inputTextColor}",
                outline: "none",
                boxSizing: "border-box",
              }}
              type="${f.type}"
              placeholder="${f.placeholder || `Enter ${f.label}...`}"
            />
          </div>
        </div>`,
      )
      .join("\n");
  }

  // ── Render custom dropdowns ─────────────────────────────
  function renderCustomDropdownState(): string {
    if (!customDropdowns.length) return "";
    return customDropdowns
      .map(
        (dd: CustomDropdown) =>
          `  const [open_${dd.id}, setOpen_${dd.id}] = useState(false);
  const [val_${dd.id}, setVal_${dd.id}] = useState("${dd.options[0] ?? ""}");`,
      )
      .join("\n");
  }

  function renderCustomDropdownJSX(): string {
    if (!customDropdowns.length) return "";
    return customDropdowns
      .map(
        (dd: CustomDropdown) => `
        {/* Custom Dropdown: ${dd.label || "Select"} */}
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", fontSize: ${fontSize - 1}, color: "${labelColor}", marginBottom: 6, fontWeight: 500 }}>
            ${dd.label || "Select Option"}
          </label>
          <button
            onClick={() => setOpen_${dd.id}(p => !p)}
            style={{
              width: "100%",
              background: "${inputBackground}",
              border: \`1px solid \${open_${dd.id} ? "${inputFocusBorderColor}" : "${inputBorderColor}"}\`,
              borderRadius: ${inputBorderRadius},
              padding: "10px 42px 10px 16px",
              fontSize: ${fontSize},
              color: val_${dd.id} ? "${inputTextColor}" : "${inputPlaceholderColor}",
              textAlign: "left",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <span>{val_${dd.id} || "Select an option..."}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2" style={{ position: "absolute", right: 12 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {open_${dd.id} && (
            <div className="sm__dd-menu" style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "${modalBackground}",
              border: "1px solid ${modalBorderColor}",
              borderRadius: ${inputBorderRadius},
              boxShadow: "${shadow}",
              zIndex: 10,
              overflow: "hidden",
            }}>
              ${dd.options
                .map(
                  (opt: string, i: number) => `
              <div
                className="sm__dd-item"
                onClick={() => { setVal_${dd.id}("${opt}"); setOpen_${dd.id}(false); }}
                style={{ padding: "9px 16px", fontSize: ${fontSize}, color: "${inputTextColor}", cursor: "pointer" }}
              >
                ${opt}
              </div>`,
                )
                .join("")}
            </div>
          )}
        </div>`,
      )
      .join("\n");
  }

  const hasDropdowns = customDropdowns.length > 0;

  return `import { useState } from "react";
import "./SignupModal.css";

export default function SignupModal({ onSubmit }) {
  const [showPass, setShowPass] = useState(false);
${hasDropdowns ? renderCustomDropdownState() : ""}

  return (
    <div
      className="sm"
      style={{
        width: ${modalWidth},
        maxWidth: "100%",
        background: "${modalBackground}",
        border: "1px solid ${modalBorderColor}",
        borderRadius: ${modalBorderRadius},
        boxShadow: "${shadow}",
        overflow: "hidden",
        fontFamily: ${JSON.stringify(fontFamily)},
        fontSize: ${fontSize},
      }}
    >
      ${
        showBrandingHeader
          ? `{/* Branding Header */}
      <div className="sm__header">
        <div className="sm__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${accentIconColor}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <h1 className="sm__heading">${headingText}</h1>
        <p className="sm__subheading">${subheadingText}</p>
      </div>`
          : ""
      }

      {/* Form */}
      <div className="sm__form">
        ${
          showFullName
            ? `{/* Full Name */}
        <div className="sm__field">
          <label className="sm__label">Full Name</label>
          <div className="sm__input-wrap">
            <svg className="sm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input className="sm__input" type="text" placeholder="John Doe" />
          </div>
        </div>`
            : ""
        }

        ${
          showEmail
            ? `{/* Email */}
        <div className="sm__field">
          <label className="sm__label">Email Address</label>
          <div className="sm__input-wrap">
            <svg className="sm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input className="sm__input" type="email" placeholder="john@example.com" />
          </div>
        </div>`
            : ""
        }

        ${
          showPassword
            ? `{/* Password */}
        <div className="sm__field">
          <label className="sm__label">Password</label>
          <div className="sm__input-wrap">
            <svg className="sm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input className="sm__input sm__input--pass" type={showPass ? "text" : "password"} placeholder="••••••••" />
            <button className="sm__eye" onClick={() => setShowPass(p => !p)} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          ${
            showPasswordStrength
              ? `<div className="sm__strength">
            <div className="sm__strength-bars">
              <div className="sm__strength-bar sm__strength-bar--fill"></div>
              <div className="sm__strength-bar sm__strength-bar--fill"></div>
              <div className="sm__strength-bar sm__strength-bar--fill"></div>
              <div className="sm__strength-bar"></div>
            </div>
            <span className="sm__strength-label">✓ Strong password</span>
          </div>`
              : ""
          }
        </div>`
            : ""
        }

        ${renderCustomFields()}
        ${renderCustomDropdownJSX()}

        ${
          showTermsCheckbox
            ? `{/* Terms */}
        <div className="sm__terms">
          <input type="checkbox" id="terms" className="sm__checkbox" />
          <label htmlFor="terms" className="sm__terms-label">
            I agree to the <a href="#" className="sm__link">Terms of Service</a> and <a href="#" className="sm__link">Privacy Policy</a>.
          </label>
        </div>`
            : ""
        }

        {/* CTA */}
        <button className="sm__cta" type="button" onClick={onSubmit}>
          ${ctaLabel}
        </button>

        ${
          showSocialButtons
            ? `{/* Social */}
        <div className="sm__divider"><span>Or sign up with</span></div>
        <div className="sm__socials">
          <button className="sm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button className="sm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${inputTextColor}"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
        </div>`
            : ""
        }
      </div>

      {/* Footer */}
      <div className="sm__footer">
        Already have an account? <a href="#" className="sm__link sm__link--bold">Sign In</a>
      </div>
    </div>
  );
}
`;
}

// ──────────────────────────────────────────────────────────────
// CSS Generator
// ──────────────────────────────────────────────────────────────
export function generateSignupModalCSS(config: SignupModalConfig): string {
  const {
    accentColor,
    inputBackground,
    inputBorderColor,
    inputFocusBorderColor,
    inputTextColor,
    inputPlaceholderColor,
    inputBorderRadius,
    labelColor,
    ctaBackground,
    ctaTextColor,
    ctaBorderRadius,
    footerBackground,
    footerTextColor,
    modalBorderColor,
    subheadingColor,
    headingColor,
    fontSize,
    fontFamily,
  } = config;

  return `/* SignupModal.css */

.sm {
  box-sizing: border-box;
}

/* ── Header ──────────────────────────────── */
.sm__header {
  padding: 32px 32px 16px;
  text-align: center;
}

.sm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${accentColor};
  border-radius: 12px;
  margin-bottom: 16px;
}

.sm__heading {
  margin: 0 0 8px;
  font-size: ${fontSize + 6}px;
  font-weight: 700;
  color: ${headingColor};
  line-height: 1.2;
  font-family: ${fontFamily};
}

.sm__subheading {
  margin: 0;
  font-size: ${fontSize - 1}px;
  color: ${subheadingColor};
  font-family: ${fontFamily};
}

/* ── Form ────────────────────────────────── */
.sm__form {
  padding: 0 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Field ───────────────────────────────── */
.sm__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sm__label {
  font-size: ${fontSize - 1}px;
  font-weight: 500;
  color: ${labelColor};
  font-family: ${fontFamily};
}

.sm__input-wrap {
  position: relative;
}

.sm__input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.sm__input {
  width: 100%;
  background: ${inputBackground};
  border: 1px solid ${inputBorderColor};
  border-radius: ${inputBorderRadius}px;
  padding: 10px 12px 10px 42px;
  font-size: ${fontSize}px;
  font-family: ${fontFamily};
  color: ${inputTextColor};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.sm__input::placeholder {
  color: ${inputPlaceholderColor};
}

.sm__input:focus {
  border-color: ${inputFocusBorderColor};
  box-shadow: 0 0 0 3px ${inputFocusBorderColor}22;
}

.sm__input--pass {
  padding-right: 42px;
}

.sm__eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

/* ── Password Strength ───────────────────── */
.sm__strength {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 4px;
}

.sm__strength-bars {
  display: flex;
  gap: 4px;
  height: 3px;
}

.sm__strength-bar {
  flex: 1;
  background: ${inputBorderColor};
  border-radius: 99px;
}

.sm__strength-bar--fill {
  background: ${accentColor};
}

.sm__strength-label {
  font-size: ${fontSize - 2}px;
  color: ${accentColor};
  font-family: ${fontFamily};
}

/* ── Dropdown ────────────────────────────── */
.sm__dd-menu {
  /* see inline style - dynamic border/bg */
}

.sm__dd-item {
  transition: background 0.15s;
}

.sm__dd-item:hover {
  background: ${inputBorderColor};
}

/* ── Terms ───────────────────────────────── */
.sm__terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sm__checkbox {
  margin-top: 2px;
  accent-color: ${accentColor};
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  cursor: pointer;
}

.sm__terms-label {
  font-size: ${fontSize - 1}px;
  color: ${subheadingColor};
  line-height: 1.5;
  font-family: ${fontFamily};
}

/* ── CTA Button ──────────────────────────── */
.sm__cta {
  width: 100%;
  background: ${ctaBackground};
  color: ${ctaTextColor};
  border: none;
  border-radius: ${ctaBorderRadius}px;
  padding: 11px 0;
  font-size: ${fontSize}px;
  font-family: ${fontFamily};
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.sm__cta:hover {
  opacity: 0.88;
}

.sm__cta:active {
  transform: scale(0.98);
}

/* ── Divider ─────────────────────────────── */
.sm__divider {
  position: relative;
  text-align: center;
  margin: 4px 0;
}

.sm__divider::before {
  content: "";
  position: absolute;
  inset: 50% 0 auto;
  height: 1px;
  background: ${modalBorderColor};
}

.sm__divider span {
  position: relative;
  background: inherit;
  padding: 0 12px;
  font-size: ${fontSize - 2}px;
  color: ${subheadingColor};
  font-family: ${fontFamily};
}

/* ── Social Buttons ──────────────────────── */
.sm__socials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.sm__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${inputBackground};
  border: 1px solid ${inputBorderColor};
  border-radius: ${inputBorderRadius}px;
  padding: 9px 0;
  font-size: ${fontSize - 1}px;
  font-family: ${fontFamily};
  color: ${inputTextColor};
  cursor: pointer;
  transition: border-color 0.2s;
}

.sm__social-btn:hover {
  border-color: ${inputFocusBorderColor};
}

/* ── Links ───────────────────────────────── */
.sm__link {
  color: ${accentColor};
  text-decoration: none;
  font-weight: 500;
}

.sm__link:hover {
  text-decoration: underline;
}

.sm__link--bold {
  font-weight: 700;
}

/* ── Footer ──────────────────────────────── */
.sm__footer {
  background: ${footerBackground};
  border-top: 1px solid ${modalBorderColor};
  padding: 14px 32px;
  text-align: center;
  font-size: ${fontSize - 1}px;
  font-family: ${fontFamily};
  color: ${footerTextColor};
}
`;
}
