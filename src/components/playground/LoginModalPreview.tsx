"use client";

// /components/playground/LoginModalPreview.tsx

import { useState } from "react";
import { LoginModalConfig } from "@/lib/loginModalConfig";

interface Props {
  config: LoginModalConfig;
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

function KeyIcon({ color }: { color: string }) {
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
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
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
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export function LoginModalPreview({ config }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [remembered, setRemembered] = useState(false);

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
    showSocialButtons,
    socialButtonBackground,
    socialButtonBorderColor,
    socialButtonTextColor,
    inputBackground,
    inputBorderColor,
    inputFocusBorderColor,
    inputTextColor,
    inputPlaceholderColor,
    inputBorderRadius,
    labelColor,
    showForgotPassword,
    forgotPasswordColor,
    showRememberMe,
    rememberMeText,
    rememberMeColor,
    ctaLabel,
    ctaBackground,
    ctaTextColor,
    ctaBorderRadius,
    footerBackground,
    footerTextColor,
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
        <div
          style={{
            padding: "32px 32px 24px",
            textAlign: "center",
            borderBottom: `1px solid ${modalBorderColor}`,
          }}
        >
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
            {/* Lock icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentIconColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1
            style={{
              margin: "0 0 8px",
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

      {/* Body */}
      <div
        style={{
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Social Buttons */}
        {showSocialButtons && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              { label: "Google", Icon: () => <GoogleIcon /> },
              {
                label: "GitHub",
                Icon: () => <GithubIcon color={socialButtonTextColor} />,
              },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: socialButtonBackground,
                  border: `1px solid ${socialButtonBorderColor}`,
                  borderRadius: inputBorderRadius,
                  padding: "9px 0",
                  fontSize: fontSize - 1,
                  fontFamily,
                  color: socialButtonTextColor,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    inputFocusBorderColor)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    socialButtonBorderColor)
                }
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Divider */}
        {showSocialButtons && (
          <div style={{ position: "relative", textAlign: "center" }}>
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
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              or email
            </span>
          </div>
        )}

        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>
              <MailIcon color={inputPlaceholderColor} />
            </span>
            <input
              style={inputStyle}
              type="email"
              placeholder="name@company.com"
              readOnly
              onFocus={(e) =>
                (e.target.style.borderColor = inputFocusBorderColor)
              }
              onBlur={(e) => (e.target.style.borderColor = inputBorderColor)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            {showForgotPassword && (
              <a
                href="#"
                style={{
                  fontSize: fontSize - 2,
                  color: forgotPasswordColor,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.textDecoration = "none")
                }
              >
                Forgot password?
              </a>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>
              <KeyIcon color={inputPlaceholderColor} />
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
        </div>

        {/* Remember Me */}
        {showRememberMe && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={remembered}
              onChange={() => setRemembered((p) => !p)}
              style={{
                width: 15,
                height: 15,
                accentColor,
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <label
              style={{
                fontSize: fontSize - 1,
                color: rememberMeColor,
                fontFamily,
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setRemembered((p) => !p)}
            >
              {rememberMeText}
            </label>
          </div>
        )}

        {/* CTA */}
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
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "1")
          }
          onMouseDown={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(0.98)")
          }
          onMouseUp={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
          }
        >
          {ctaLabel}
        </button>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span>Don't have an account?</span>
        <a
          href="#"
          style={{
            color: accentColor,
            fontWeight: 700,
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.textDecoration = "underline")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.textDecoration = "none")
          }
        >
          Create an account
        </a>
      </div>
    </div>
  );
}
