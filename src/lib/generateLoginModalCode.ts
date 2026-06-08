// /lib/generateLoginModalCode.ts

import { LoginModalConfig } from "./loginModalConfig";

// ──────────────────────────────────────────────────────────────
// JSX Generator
// ──────────────────────────────────────────────────────────────
export function generateLoginModalJSX(config: LoginModalConfig): string {
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

  return `import { useState } from "react";
import "./LoginModal.css";

export default function LoginModal({ onSubmit, onForgotPassword, onCreateAccount }) {
  const [showPass, setShowPass] = useState(false);
  const [remembered, setRemembered] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password, remembered });
  }

  return (
    <div
      className="lm"
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
      <div className="lm__header">
        <div className="lm__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${accentIconColor}" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="lm__heading">${headingText}</h1>
        <p className="lm__subheading">${subheadingText}</p>
      </div>`
          : ""
      }

      {/* Body */}
      <div className="lm__body">

        ${
          showSocialButtons
            ? `{/* Social Buttons */}
        <div className="lm__socials">
          <button className="lm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="lm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${socialButtonTextColor}">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="lm__divider"><span>or email</span></div>`
            : ""
        }

        {/* Form */}
        <form className="lm__form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="lm__field">
            <label className="lm__label">Email Address</label>
            <div className="lm__input-wrap">
              <svg className="lm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                className="lm__input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="lm__field">
            <div className="lm__field-header">
              <label className="lm__label">Password</label>
              ${
                showForgotPassword
                  ? `<button type="button" className="lm__forgot" onClick={onForgotPassword}>
                Forgot password?
              </button>`
                  : ""
              }
            </div>
            <div className="lm__input-wrap">
              <svg className="lm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
              </svg>
              <input
                className="lm__input lm__input--pass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="lm__eye" onClick={() => setShowPass(p => !p)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          ${
            showRememberMe
              ? `{/* Remember Me */}
          <div className="lm__remember">
            <input
              type="checkbox"
              id="remember"
              className="lm__checkbox"
              checked={remembered}
              onChange={e => setRemembered(e.target.checked)}
            />
            <label htmlFor="remember" className="lm__remember-label">
              ${rememberMeText}
            </label>
          </div>`
              : ""
          }

          {/* CTA */}
          <button className="lm__cta" type="submit">
            ${ctaLabel}
          </button>

        </form>
      </div>

      {/* Footer */}
      <div className="lm__footer">
        <span>Don't have an account?</span>
        <button type="button" className="lm__footer-link" onClick={onCreateAccount}>
          Create an account
        </button>
      </div>
    </div>
  );
}
`;
}

// ──────────────────────────────────────────────────────────────
// CSS Generator
// ──────────────────────────────────────────────────────────────
export function generateLoginModalCSS(config: LoginModalConfig): string {
  const {
    accentColor,
    accentIconColor,
    headingColor,
    subheadingColor,
    modalBorderColor,
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
    forgotPasswordColor,
    rememberMeColor,
    ctaBackground,
    ctaTextColor,
    ctaBorderRadius,
    footerBackground,
    footerTextColor,
    fontSize,
    fontFamily,
  } = config;

  return `/* LoginModal.css */

.lm {
  box-sizing: border-box;
}

/* ── Header ──────────────────────────────── */
.lm__header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid ${modalBorderColor};
}

.lm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${accentColor};
  border-radius: 12px;
  margin-bottom: 16px;
}

.lm__heading {
  margin: 0 0 8px;
  font-size: ${fontSize + 6}px;
  font-weight: 700;
  color: ${headingColor};
  line-height: 1.2;
  font-family: ${fontFamily};
}

.lm__subheading {
  margin: 0;
  font-size: ${fontSize - 1}px;
  color: ${subheadingColor};
  font-family: ${fontFamily};
}

/* ── Body ────────────────────────────────── */
.lm__body {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Social Buttons ──────────────────────── */
.lm__socials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.lm__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${socialButtonBackground};
  border: 1px solid ${socialButtonBorderColor};
  border-radius: ${inputBorderRadius}px;
  padding: 9px 0;
  font-size: ${fontSize - 1}px;
  font-family: ${fontFamily};
  color: ${socialButtonTextColor};
  cursor: pointer;
  transition: border-color 0.2s;
}

.lm__social-btn:hover {
  border-color: ${inputFocusBorderColor};
}

/* ── Divider ─────────────────────────────── */
.lm__divider {
  position: relative;
  text-align: center;
}

.lm__divider::before {
  content: "";
  position: absolute;
  inset: 50% 0 auto;
  height: 1px;
  background: ${modalBorderColor};
}

.lm__divider span {
  position: relative;
  background: inherit;
  padding: 0 12px;
  font-size: ${fontSize - 2}px;
  color: ${subheadingColor};
  font-family: ${fontFamily};
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Form ────────────────────────────────── */
.lm__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Field ───────────────────────────────── */
.lm__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lm__field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lm__label {
  font-size: ${fontSize - 1}px;
  font-weight: 500;
  color: ${labelColor};
  font-family: ${fontFamily};
}

.lm__input-wrap {
  position: relative;
}

.lm__input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.lm__input {
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

.lm__input::placeholder {
  color: ${inputPlaceholderColor};
}

.lm__input:focus {
  border-color: ${inputFocusBorderColor};
  box-shadow: 0 0 0 3px ${inputFocusBorderColor}22;
}

.lm__input--pass {
  padding-right: 42px;
}

.lm__eye {
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

/* ── Forgot Password ─────────────────────── */
.lm__forgot {
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${fontSize - 2}px;
  color: ${forgotPasswordColor};
  font-family: ${fontFamily};
  font-weight: 500;
  padding: 0;
  transition: text-decoration 0.15s;
}

.lm__forgot:hover {
  text-decoration: underline;
}

/* ── Remember Me ─────────────────────────── */
.lm__remember {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lm__checkbox {
  width: 15px;
  height: 15px;
  accent-color: ${accentColor};
  cursor: pointer;
  flex-shrink: 0;
}

.lm__remember-label {
  font-size: ${fontSize - 1}px;
  color: ${rememberMeColor};
  font-family: ${fontFamily};
  cursor: pointer;
  user-select: none;
}

/* ── CTA Button ──────────────────────────── */
.lm__cta {
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

.lm__cta:hover {
  opacity: 0.88;
}

.lm__cta:active {
  transform: scale(0.98);
}

/* ── Footer ──────────────────────────────── */
.lm__footer {
  background: ${footerBackground};
  border-top: 1px solid ${modalBorderColor};
  padding: 14px 32px;
  text-align: center;
  font-size: ${fontSize - 1}px;
  font-family: ${fontFamily};
  color: ${footerTextColor};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.lm__footer-link {
  background: none;
  border: none;
  cursor: pointer;
  color: ${accentColor};
  font-weight: 700;
  font-size: ${fontSize - 1}px;
  font-family: ${fontFamily};
  padding: 0;
  transition: text-decoration 0.15s;
}

.lm__footer-link:hover {
  text-decoration: underline;
}
`;
}

// ──────────────────────────────────────────────────────────────
// TSX Generator  (same logic as JSX + TypeScript types)
// ──────────────────────────────────────────────────────────────
export function generateLoginModalTSX(config: LoginModalConfig): string {
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

  return `import { useState } from "react";
import "./LoginModal.css";

interface LoginFormData {
  email: string;
  password: string;
  remembered: boolean;
}

interface LoginModalProps {
  onSubmit?: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}

export default function LoginModal({ onSubmit, onForgotPassword, onCreateAccount }: LoginModalProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [remembered, setRemembered] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password, remembered });
  }

  return (
    <div
      className="lm"
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
      <div className="lm__header">
        <div className="lm__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${accentIconColor}" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="lm__heading">${headingText}</h1>
        <p className="lm__subheading">${subheadingText}</p>
      </div>`
          : ""
      }

      {/* Body */}
      <div className="lm__body">

        ${
          showSocialButtons
            ? `{/* Social Buttons */}
        <div className="lm__socials">
          <button className="lm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="lm__social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${socialButtonTextColor}">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="lm__divider"><span>or email</span></div>`
            : ""
        }

        {/* Form */}
        <form className="lm__form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="lm__field">
            <label className="lm__label">Email Address</label>
            <div className="lm__input-wrap">
              <svg className="lm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                className="lm__input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="lm__field">
            <div className="lm__field-header">
              <label className="lm__label">Password</label>
              ${
                showForgotPassword
                  ? `<button type="button" className="lm__forgot" onClick={onForgotPassword}>
                Forgot password?
              </button>`
                  : ""
              }
            </div>
            <div className="lm__input-wrap">
              <svg className="lm__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
              </svg>
              <input
                className="lm__input lm__input--pass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="lm__eye" onClick={() => setShowPass((p: boolean) => !p)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${inputPlaceholderColor}" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          ${
            showRememberMe
              ? `{/* Remember Me */}
          <div className="lm__remember">
            <input
              type="checkbox"
              id="remember"
              className="lm__checkbox"
              checked={remembered}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemembered(e.target.checked)}
            />
            <label htmlFor="remember" className="lm__remember-label">
              ${rememberMeText}
            </label>
          </div>`
              : ""
          }

          {/* CTA */}
          <button className="lm__cta" type="submit">
            ${ctaLabel}
          </button>

        </form>
      </div>

      {/* Footer */}
      <div className="lm__footer">
        <span>Don't have an account?</span>
        <button type="button" className="lm__footer-link" onClick={onCreateAccount}>
          Create an account
        </button>
      </div>
    </div>
  );
}
`;
}

// ──────────────────────────────────────────────────────────────
// Tailwind Generator  (TSX + Tailwind, no CSS import)
// ──────────────────────────────────────────────────────────────
export function generateLoginModalTailwind(config: LoginModalConfig): string {
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

  // Bake font sizes as literals
  const fsBase = fontSize; // inputs, CTA, divider body
  const fsHeading = fontSize + 6; // modal heading
  const fsSub = fontSize - 1; // subheading, labels, social btns, footer
  const fsDivider = fontSize - 2; // divider "or email" text, forgot password

  return `import { useState, CSSProperties } from "react";

interface LoginFormData {
  email: string;
  password: string;
  remembered: boolean;
}

interface LoginModalProps {
  onSubmit?: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}

// Baked-in CSS variable tokens — update these to reskin the LoginModal
const lmVars: CSSProperties = {
  "--lm-bg":                  "${modalBackground}",
  "--lm-border":              "${modalBorderColor}",
  "--lm-radius":              "${modalBorderRadius}px",
  "--lm-accent":              "${accentColor}",
  "--lm-accent-icon":         "${accentIconColor}",
  "--lm-heading":             "${headingColor}",
  "--lm-subheading":          "${subheadingColor}",
  "--lm-social-bg":           "${socialButtonBackground}",
  "--lm-social-border":       "${socialButtonBorderColor}",
  "--lm-social-text":         "${socialButtonTextColor}",
  "--lm-input-bg":            "${inputBackground}",
  "--lm-input-border":        "${inputBorderColor}",
  "--lm-input-focus":         "${inputFocusBorderColor}",
  "--lm-input-text":          "${inputTextColor}",
  "--lm-input-placeholder":   "${inputPlaceholderColor}",
  "--lm-input-radius":        "${inputBorderRadius}px",
  "--lm-label":               "${labelColor}",
  "--lm-forgot":              "${forgotPasswordColor}",
  "--lm-remember":            "${rememberMeColor}",
  "--lm-cta-bg":              "${ctaBackground}",
  "--lm-cta-text":            "${ctaTextColor}",
  "--lm-cta-radius":          "${ctaBorderRadius}px",
  "--lm-footer-bg":           "${footerBackground}",
  "--lm-footer-text":         "${footerTextColor}",
} as CSSProperties;

export default function LoginModal({ onSubmit, onForgotPassword, onCreateAccount }: LoginModalProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [remembered, setRemembered] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password, remembered });
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        ...lmVars,
        width: ${modalWidth},
        maxWidth: "100%",
        background: "var(--lm-bg)",
        border: "1px solid var(--lm-border)",
        borderRadius: "var(--lm-radius)",
        boxShadow: "${shadow}",
        fontFamily: ${JSON.stringify(fontFamily)},
        fontSize: "${fsBase}px",
      }}
    >
      ${
        showBrandingHeader
          ? `{/* Branding Header */}
      <div className="px-8 pt-8 pb-6 text-center border-b border-[var(--lm-border)]">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--lm-accent)] rounded-xl mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--lm-accent-icon)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="m-0 mb-2 text-[${fsHeading}px] font-bold text-[var(--lm-heading)] leading-tight">${headingText}</h1>
        <p className="m-0 text-[${fsSub}px] text-[var(--lm-subheading)]">${subheadingText}</p>
      </div>`
          : ""
      }

      {/* Body */}
      <div className="flex flex-col gap-5 px-8 py-6">

        ${
          showSocialButtons
            ? `{/* Social Buttons */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button
            className="flex items-center justify-center gap-2 bg-[var(--lm-social-bg)] border border-[var(--lm-social-border)] rounded-[var(--lm-input-radius)] py-[9px] text-[${fsSub}px] text-[var(--lm-social-text)] cursor-pointer transition-colors hover:border-[var(--lm-input-focus)]"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-[var(--lm-social-bg)] border border-[var(--lm-social-border)] rounded-[var(--lm-input-radius)] py-[9px] text-[${fsSub}px] text-[var(--lm-social-text)] cursor-pointer transition-colors hover:border-[var(--lm-input-focus)]"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--lm-social-text)">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--lm-border)]" />
          <span className="relative bg-[var(--lm-bg)] px-3 text-[${fsDivider}px] text-[var(--lm-subheading)] tracking-widest uppercase">
            or email
          </span>
        </div>`
            : ""
        }

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[${fsSub}px] font-medium text-[var(--lm-label)]">
              Email Address
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--lm-input-placeholder)" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                className="w-full box-border bg-[var(--lm-input-bg)] border border-[var(--lm-input-border)] rounded-[var(--lm-input-radius)] pl-[42px] pr-3 py-[10px] text-[${fsBase}px] text-[var(--lm-input-text)] placeholder:text-[var(--lm-input-placeholder)] outline-none transition-colors focus:border-[var(--lm-input-focus)]"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[${fsSub}px] font-medium text-[var(--lm-label)]">
                Password
              </label>
              ${
                showForgotPassword
                  ? `<button
                type="button"
                className="bg-transparent border-none cursor-pointer text-[${fsDivider}px] text-[var(--lm-forgot)] font-medium p-0 hover:underline"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>`
                  : ""
              }
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--lm-input-placeholder)" strokeWidth="2">
                <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
              </svg>
              <input
                className="w-full box-border bg-[var(--lm-input-bg)] border border-[var(--lm-input-border)] rounded-[var(--lm-input-radius)] pl-[42px] pr-[42px] py-[10px] text-[${fsBase}px] text-[var(--lm-input-text)] placeholder:text-[var(--lm-input-placeholder)] outline-none transition-colors focus:border-[var(--lm-input-focus)]"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center"
                onClick={() => setShowPass((p: boolean) => !p)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--lm-input-placeholder)" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          ${
            showRememberMe
              ? `{/* Remember Me */}
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="remember"
              className="w-[15px] h-[15px] cursor-pointer shrink-0 accent-[var(--lm-accent)]"
              checked={remembered}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemembered(e.target.checked)}
            />
            <label htmlFor="remember" className="text-[${fsSub}px] text-[var(--lm-remember)] cursor-pointer select-none">
              ${rememberMeText}
            </label>
          </div>`
              : ""
          }

          {/* CTA */}
          <button
            className="w-full bg-[var(--lm-cta-bg)] text-[var(--lm-cta-text)] border-none rounded-[var(--lm-cta-radius)] py-[11px] text-[${fsBase}px] font-semibold cursor-pointer transition-[opacity,transform] duration-200 hover:opacity-[0.88] active:scale-[0.98]"
            type="submit"
          >
            ${ctaLabel}
          </button>

        </form>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5 bg-[var(--lm-footer-bg)] border-t border-[var(--lm-border)] px-8 py-[14px] text-[${fsSub}px] text-[var(--lm-footer-text)]">
        <span>Don't have an account?</span>
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer text-[var(--lm-accent)] font-bold text-[${fsSub}px] p-0 hover:underline"
          onClick={onCreateAccount}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
`;
}
