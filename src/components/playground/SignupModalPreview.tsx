"use client";

// /components/playground/SignupModalPreview.tsx

import { useState } from "react";
import {
  SignupModalConfig,
  CustomField,
  CustomDropdown,
} from "@/lib/signupModalConfig";

interface Props {
  config: SignupModalConfig;
}

function EyeIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function FieldIcon({ type, color }: { type: string; color: string }) {
  if (type === "email") return <MailIcon color={color} />;
  if (type === "password" || type === "tel") return <LockIcon color={color} />;
  return <PersonIcon color={color} />;
}

export function SignupModalPreview({ config }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: inputBackground,
    border: `1px solid ${inputBorderColor}`,
    borderRadius: inputBorderRadius,
    padding: "10px 12px 10px 42px",
    fontSize,
    fontFamily,
    color: inputTextColor,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: fontSize - 1,
    fontFamily,
    color: labelColor,
    marginBottom: 6,
    fontWeight: 500,
  };

  const iconWrap: React.CSSProperties = {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      style={{
        width: modalWidth,
        maxWidth: "100%",
        background: modalBackground,
        border: `1px solid ${modalBorderColor}`,
        borderRadius: modalBorderRadius,
        boxShadow: shadow,
        overflow: "hidden",
        fontFamily,
        fontSize,
      }}
    >
      {/* Branding Header */}
      {showBrandingHeader && (
        <div style={{ padding: "32px 32px 16px 32px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              background: accentColor,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentIconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: fontSize + 6,
              fontWeight: 700,
              color: headingColor,
              lineHeight: 1.2,
            }}
          >
            {headingText}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: fontSize - 1,
              color: subheadingColor,
            }}
          >
            {subheadingText}
          </p>
        </div>
      )}

      {/* Form Body */}
      <div
        style={{
          padding: "0 32px 24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Full Name */}
        {showFullName && (
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <PersonIcon color={inputPlaceholderColor} />
              </span>
              <input
                style={inputStyle}
                type="text"
                placeholder="John Doe"
                readOnly
                onFocus={(e) =>
                  (e.target.style.borderColor = inputFocusBorderColor)
                }
                onBlur={(e) => (e.target.style.borderColor = inputBorderColor)}
              />
            </div>
          </div>
        )}

        {/* Email */}
        {showEmail && (
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <MailIcon color={inputPlaceholderColor} />
              </span>
              <input
                style={inputStyle}
                type="email"
                placeholder="john@example.com"
                readOnly
                onFocus={(e) =>
                  (e.target.style.borderColor = inputFocusBorderColor)
                }
                onBlur={(e) => (e.target.style.borderColor = inputBorderColor)}
              />
            </div>
          </div>
        )}

        {/* Password */}
        {showPassword && (
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <LockIcon color={inputPlaceholderColor} />
              </span>
              <input
                style={{ ...inputStyle, paddingRight: 42 }}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                readOnly
                onFocus={(e) =>
                  (e.target.style.borderColor = inputFocusBorderColor)
                }
                onBlur={(e) => (e.target.style.borderColor = inputBorderColor)}
              />
              <button
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EyeIcon color={inputPlaceholderColor} />
              </button>
            </div>

            {/* Password Strength */}
            {showPasswordStrength && (
              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    height: 3,
                    marginBottom: 6,
                  }}
                >
                  {[
                    accentColor,
                    accentColor,
                    accentColor,
                    inputBorderColor,
                  ].map((bg, i) => (
                    <div
                      key={i}
                      style={{ flex: 1, background: bg, borderRadius: 99 }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: fontSize - 2, color: accentColor }}>
                  ✓ Strong password
                </span>
              </div>
            )}
          </div>
        )}

        {/* Custom Text/Input Fields */}
        {customFields.map((field: CustomField) => (
          <div key={field.id}>
            <label style={labelStyle}>{field.label || "Custom Field"}</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <FieldIcon type={field.type} color={inputPlaceholderColor} />
              </span>
              <input
                style={inputStyle}
                type={field.type}
                placeholder={field.placeholder || `Enter ${field.label}...`}
                readOnly
              />
            </div>
          </div>
        ))}

        {/* Custom Dropdowns */}
        {customDropdowns.map((dd: CustomDropdown) => (
          <div key={dd.id} style={{ position: "relative" }}>
            <label style={labelStyle}>{dd.label || "Select Option"}</label>
            <button
              onClick={() => toggleDropdown(dd.id)}
              style={{
                width: "100%",
                background: inputBackground,
                border: `1px solid ${dropdownOpen[dd.id] ? inputFocusBorderColor : inputBorderColor}`,
                borderRadius: inputBorderRadius,
                padding: "10px 42px 10px 16px",
                fontSize,
                fontFamily,
                color: dd.options.length
                  ? inputTextColor
                  : inputPlaceholderColor,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
            >
              <span>
                {dd.options.length ? dd.options[0] : "Select an option..."}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronIcon color={inputPlaceholderColor} />
              </span>
            </button>

            {dropdownOpen[dd.id] && dd.options.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: modalBackground,
                  border: `1px solid ${modalBorderColor}`,
                  borderRadius: inputBorderRadius,
                  boxShadow: shadow,
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                {dd.options.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "9px 16px",
                      fontSize,
                      fontFamily,
                      color: inputTextColor,
                      cursor: "pointer",
                      borderBottom:
                        i < dd.options.length - 1
                          ? `1px solid ${modalBorderColor}`
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background =
                        inputBorderColor)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background =
                        "transparent")
                    }
                    onClick={() =>
                      setDropdownOpen((prev) => ({ ...prev, [dd.id]: false }))
                    }
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Terms Checkbox */}
        {showTermsCheckbox && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <input
              type="checkbox"
              style={{
                marginTop: 2,
                accentColor,
                width: 15,
                height: 15,
                flexShrink: 0,
                cursor: "pointer",
              }}
              readOnly
            />
            <span
              style={{
                fontSize: fontSize - 1,
                color: subheadingColor,
                lineHeight: 1.5,
              }}
            >
              I agree to the{" "}
              <a
                style={{
                  color: accentColor,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
                href="#"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                style={{
                  color: accentColor,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
                href="#"
              >
                Privacy Policy
              </a>
              .
            </span>
          </div>
        )}

        {/* CTA Button */}
        <button
          style={{
            width: "100%",
            background: ctaBackground,
            color: ctaTextColor,
            border: "none",
            borderRadius: ctaBorderRadius,
            padding: "11px 0",
            fontSize,
            fontFamily,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 4,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        >
          {ctaLabel}
        </button>

        {/* Social buttons */}
        {showSocialButtons && (
          <>
            <div
              style={{
                position: "relative",
                textAlign: "center",
                margin: "4px 0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "50% 0 auto",
                  height: 1,
                  background: modalBorderColor,
                }}
              />
              <span
                style={{
                  position: "relative",
                  background: modalBackground,
                  padding: "0 12px",
                  fontSize: fontSize - 2,
                  color: subheadingColor,
                }}
              >
                Or sign up with
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                { label: "Google", Icon: () => <GoogleIcon /> },
                {
                  label: "GitHub",
                  Icon: () => <GithubIcon color={inputTextColor} />,
                },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: inputBackground,
                    border: `1px solid ${inputBorderColor}`,
                    borderRadius: inputBorderRadius,
                    padding: "9px 0",
                    fontSize: fontSize - 1,
                    fontFamily,
                    color: inputTextColor,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      inputFocusBorderColor)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      inputBorderColor)
                  }
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          background: footerBackground,
          borderTop: `1px solid ${modalBorderColor}`,
          padding: "14px 32px",
          textAlign: "center",
          fontSize: fontSize - 1,
          fontFamily,
          color: footerTextColor,
        }}
      >
        Already have an account?{" "}
        <a
          style={{
            color: accentColor,
            fontWeight: 700,
            textDecoration: "none",
          }}
          href="#"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
