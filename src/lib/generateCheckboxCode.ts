import { CheckboxConfig, CheckboxVariant } from "./checkboxConfig";

// ─── Shared path helper ───────────────────────────────────────────────────────

function checkPath(s: number): string {
  return `M${(s * 0.22).toFixed(1)} ${(s * 0.5).toFixed(1)} L${(s * 0.42).toFixed(1)} ${(s * 0.7).toFixed(1)} L${(s * 0.78).toFixed(1)} ${(s * 0.3).toFixed(1)}`;
}

function scribblePath(s: number): string {
  return `M${(s * 0.18).toFixed(1)} ${(s * 0.52).toFixed(1)} C${(s * 0.26).toFixed(1)} ${(s * 0.44).toFixed(1)} ${(s * 0.32).toFixed(1)} ${(s * 0.72).toFixed(1)} ${(s * 0.42).toFixed(1)} ${(s * 0.72).toFixed(1)} C${(s * 0.5).toFixed(1)} ${(s * 0.72).toFixed(1)} ${(s * 0.56).toFixed(1)} ${(s * 0.58).toFixed(1)} ${(s * 0.65).toFixed(1)} ${(s * 0.42).toFixed(1)} L${(s * 0.82).toFixed(1)} ${(s * 0.26).toFixed(1)}`;
}

// ─── Per-variant JSX body ─────────────────────────────────────────────────────

function variantJSX(v: CheckboxVariant, c: CheckboxConfig): string {
  const s = c.size;
  const br = c.borderRadius;
  const ubg = c.uncheckedBackground;
  const ubc = c.uncheckedBorderColor;
  const ubw = c.uncheckedBorderWidth;
  const cbg = c.checkedBackground;
  const cbc = c.checkedBorderColor;
  const ckc = c.checkmarkColor;
  const acc = c.accentColor;
  const acc2 = c.accentSecondary;
  const cp = checkPath(s);
  const sp = scribblePath(s);

  switch (v) {
    case "morph":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--morph"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", borderRadius: checked ? ${br + 4} : ${br} }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path
            d="${cp}"
            fill="none" stroke="${ckc}" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1) 0.05s" }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "stamp":
      return `
function Checkbox({ checked, onChange, label }) {
  const [key, setKey] = React.useState(0);
  function handleClick() { onChange(); if (!checked) setKey(k => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--stamp"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: checked ? "cbx-stamp 0.35s cubic-bezier(.4,0,.2,1)" : "none" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "slide":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--slide"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <g style={{ transform: checked ? "translateX(0)" : "translateX(-110%)", transition: "transform 0.28s cubic-bezier(.4,0,.2,1)" }}>
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "ripple":
      return `
function Checkbox({ checked, onChange, label }) {
  const [ripple, setRipple] = React.useState(false);
  function handleClick() {
    onChange();
    if (!checked) { setRipple(false); requestAnimationFrame(() => setRipple(true)); }
  }
  return (
    <label className="cbx__wrap">
      <div className="cbx__ripple-wrap">
        {ripple && <span className="cbx__ripple" onAnimationEnd={() => setRipple(false)} />}
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", position: "relative", zIndex: 1 }}
          onClick={handleClick}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="28"
              style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.28s ease 0.05s" }} />
          </svg>
        </button>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "neon":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className={\`cbx__box cbx__box--neon \${checked ? "cbx__box--neon-on" : ""}\`}
        style={{
          background: checked ? "${acc}18" : "${ubg}",
          borderColor: checked ? "${acc}" : "${ubc}",
          boxShadow: checked ? "0 0 8px 2px ${acc}88, 0 0 20px 4px ${acc}44" : "none",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none"
            stroke={checked ? "${acc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{
              strokeDashoffset: checked ? 0 : 28,
              transition: "stroke-dashoffset 0.3s ease, stroke 0.1s",
              filter: checked ? "drop-shadow(0 0 3px ${acc})" : "none",
              animation: checked ? "cbx-neon-flicker 3s ease-in-out infinite" : "none",
            }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "flip":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <div className="cbx__flip-scene" onClick={onChange}>
        <div className="cbx__flip-card" style={{ transform: checked ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div className="cbx__flip-front" style={{ borderColor: "${ubc}", background: "${ubg}" }} />
          <div className="cbx__flip-back" style={{ borderColor: "${cbc}", background: "${cbg}" }}>
            <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
              <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "scribble":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <path d="${sp}" fill="none" stroke="${ckc}" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="52"
            style={{ strokeDashoffset: checked ? 0 : 52, transition: "stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "glitch":
      return `
function Checkbox({ checked, onChange, label }) {
  const [glitching, setGlitching] = React.useState(false);
  function handleClick() { onChange(); setGlitching(true); setTimeout(() => setGlitching(false), 500); }
  return (
    <label className="cbx__wrap">
      <div className="cbx__glitch-wrap" onClick={handleClick}>
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s" }} />
          </svg>
        </button>
        {glitching && <>
          <div className="cbx__glitch-layer cbx__glitch-layer--1" style={{ background: "${acc}" }} />
          <div className="cbx__glitch-layer cbx__glitch-layer--2" style={{ background: "${acc2}" }} />
        </>}
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "elastic":
      return `
function Checkbox({ checked, onChange, label }) {
  const [key, setKey] = React.useState(0);
  function handleClick() { onChange(); setKey(k => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--elastic"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: "cbx-elastic 0.5s cubic-bezier(.4,0,.2,1)" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.25s ease 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "unfold":
      return `
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--unfold"
        style={{ background: "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <div className="cbx__unfold-fill" style={{
          background: "${cbg}",
          clipPath: checked ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 0,0 0,0 100%,0 100%)",
        }} />
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ position: "relative", zIndex: 1 }}>
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"} strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.25s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;
  }
}

// ─── Per-variant TSX body ─────────────────────────────────────────────────────

function variantTSX(v: CheckboxVariant, c: CheckboxConfig): string {
  const s = c.size;
  const br = c.borderRadius;
  const ubg = c.uncheckedBackground;
  const ubc = c.uncheckedBorderColor;
  const ubw = c.uncheckedBorderWidth;
  const cbg = c.checkedBackground;
  const cbc = c.checkedBorderColor;
  const ckc = c.checkmarkColor;
  const acc = c.accentColor;
  const acc2 = c.accentSecondary;
  const cp = checkPath(s);
  const sp = scribblePath(s);

  switch (v) {
    case "morph":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--morph"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", borderRadius: checked ? ${br + 4} : ${br} }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path
            d="${cp}"
            fill="none" stroke="${ckc}" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1) 0.05s" }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "stamp":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [key, setKey] = React.useState<number>(0);
  function handleClick(): void { onChange(); if (!checked) setKey((k: number) => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--stamp"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: checked ? "cbx-stamp 0.35s cubic-bezier(.4,0,.2,1)" : "none" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "slide":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--slide"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <g style={{ transform: checked ? "translateX(0)" : "translateX(-110%)", transition: "transform 0.28s cubic-bezier(.4,0,.2,1)" }}>
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "ripple":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [ripple, setRipple] = React.useState<boolean>(false);
  function handleClick(): void {
    onChange();
    if (!checked) { setRipple(false); requestAnimationFrame(() => setRipple(true)); }
  }
  return (
    <label className="cbx__wrap">
      <div className="cbx__ripple-wrap">
        {ripple && <span className="cbx__ripple" onAnimationEnd={() => setRipple(false)} />}
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", position: "relative", zIndex: 1 }}
          onClick={handleClick}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="28"
              style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.28s ease 0.05s" }} />
          </svg>
        </button>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "neon":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <button
        className={\`cbx__box cbx__box--neon \${checked ? "cbx__box--neon-on" : ""}\`}
        style={{
          background: checked ? "${acc}18" : "${ubg}",
          borderColor: checked ? "${acc}" : "${ubc}",
          boxShadow: checked ? "0 0 8px 2px ${acc}88, 0 0 20px 4px ${acc}44" : "none",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none"
            stroke={checked ? "${acc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{
              strokeDashoffset: checked ? 0 : 28,
              transition: "stroke-dashoffset 0.3s ease, stroke 0.1s",
              filter: checked ? "drop-shadow(0 0 3px ${acc})" : "none",
              animation: checked ? "cbx-neon-flicker 3s ease-in-out infinite" : "none",
            }}
          />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "flip":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <div className="cbx__flip-scene" onClick={onChange}>
        <div className="cbx__flip-card" style={{ transform: checked ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div className="cbx__flip-front" style={{ borderColor: "${ubc}", background: "${ubg}" }} />
          <div className="cbx__flip-back" style={{ borderColor: "${cbc}", background: "${cbg}" }}>
            <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
              <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "scribble":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <path d="${sp}" fill="none" stroke="${ckc}" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="52"
            style={{ strokeDashoffset: checked ? 0 : 52, transition: "stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "glitch":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [glitching, setGlitching] = React.useState<boolean>(false);
  function handleClick(): void { onChange(); setGlitching(true); setTimeout(() => setGlitching(false), 500); }
  return (
    <label className="cbx__wrap">
      <div className="cbx__glitch-wrap" onClick={handleClick}>
        <button
          className="cbx__box"
          style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s" }} />
          </svg>
        </button>
        {glitching && <>
          <div className="cbx__glitch-layer cbx__glitch-layer--1" style={{ background: "${acc}" }} />
          <div className="cbx__glitch-layer cbx__glitch-layer--2" style={{ background: "${acc2}" }} />
        </>}
      </div>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "elastic":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [key, setKey] = React.useState<number>(0);
  function handleClick(): void { onChange(); setKey((k: number) => k + 1); }
  return (
    <label className="cbx__wrap">
      <button
        key={key}
        className="cbx__box cbx__box--elastic"
        style={{ background: checked ? "${cbg}" : "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}", animation: "cbx-elastic 0.5s cubic-bezier(.4,0,.2,1)" }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.25s ease 0.1s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;

    case "unfold":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="cbx__wrap">
      <button
        className="cbx__box cbx__box--unfold"
        style={{ background: "${ubg}", borderColor: checked ? "${cbc}" : "${ubc}" }}
        onClick={onChange}
        type="button"
      >
        <div className="cbx__unfold-fill" style={{
          background: "${cbg}",
          clipPath: checked ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 0,0 0,0 100%,0 100%)",
        }} />
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ position: "relative", zIndex: 1 }}>
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"} strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.25s" }} />
        </svg>
      </button>
      {label && <span className="cbx__label">{label}</span>}
    </label>
  );
}`;
  }
}

// ─── Per-variant Tailwind body ────────────────────────────────────────────────

function variantTailwind(v: CheckboxVariant, c: CheckboxConfig): string {
  const s = c.size;
  const br = c.borderRadius;
  const ubg = c.uncheckedBackground;
  const ubc = c.uncheckedBorderColor;
  const ubw = c.uncheckedBorderWidth;
  const cbg = c.checkedBackground;
  const cbc = c.checkedBorderColor;
  const ckc = c.checkmarkColor;
  const acc = c.accentColor;
  const acc2 = c.accentSecondary;
  const cp = checkPath(s);
  const sp = scribblePath(s);

  switch (v) {
    case "morph":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid transition-[background,border-color,border-radius] duration-[280ms] [transition-timing-function:cubic-bezier(.4,0,.2,1)] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
          borderRadius: checked ? ${br + 4} : ${br},
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path
            d="${cp}"
            fill="none" stroke="${ckc}" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1) 0.05s" }}
          />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "stamp":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [key, setKey] = React.useState<number>(0);
  function handleClick(): void { onChange(); if (!checked) setKey((k: number) => k + 1); }
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        key={key}
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid transition-[background,border-color] duration-[150ms] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
          animation: checked ? "cbx-stamp 0.35s cubic-bezier(.4,0,.2,1)" : "none",
        }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.1s" }} />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "slide":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid overflow-hidden transition-[background,border-color] duration-[220ms] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <g style={{ transform: checked ? "translateX(0)" : "translateX(-110%)", transition: "transform 0.28s cubic-bezier(.4,0,.2,1)" }}>
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "ripple":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [ripple, setRipple] = React.useState<boolean>(false);
  function handleClick(): void {
    onChange();
    if (!checked) { setRipple(false); requestAnimationFrame(() => setRipple(true)); }
  }
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <div className="relative shrink-0" style={{ width: "var(--cbx-size)", height: "var(--cbx-size)" }}>
        {ripple && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none [animation:cbx-ripple_0.55s_ease-out_forwards]"
            style={{ background: "var(--cbx-ripple-color)" }}
            onAnimationEnd={() => setRipple(false)}
          />
        )}
        <button
          className="flex items-center justify-center border-[var(--cbx-unchecked-border-width)] border-solid relative z-[1] cursor-pointer p-0 outline-none"
          style={{
            width: "var(--cbx-size)",
            height: "var(--cbx-size)",
            borderRadius: "var(--cbx-radius)",
            background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
            borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
          }}
          onClick={handleClick}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="28"
              style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.28s ease 0.05s" }} />
          </svg>
        </button>
      </div>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "neon":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid transition-[background,border-color,box-shadow] duration-[200ms] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: checked ? "var(--cbx-neon-bg-on)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-accent)" : "var(--cbx-unchecked-border)",
          boxShadow: checked ? "0 0 8px 2px var(--cbx-neon-glow-near), 0 0 20px 4px var(--cbx-neon-glow-far)" : "none",
          animation: checked ? "cbx-neon-glow 1.8s ease-in-out infinite" : "none",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none"
            stroke={checked ? "var(--cbx-accent)" : "transparent"}
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{
              strokeDashoffset: checked ? 0 : 28,
              transition: "stroke-dashoffset 0.3s ease, stroke 0.1s",
              filter: checked ? "drop-shadow(0 0 3px var(--cbx-accent))" : "none",
              animation: checked ? "cbx-neon-flicker 3s ease-in-out infinite" : "none",
            }}
          />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "flip":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <div
        className="shrink-0 cursor-pointer"
        style={{ width: "var(--cbx-size)", height: "var(--cbx-size)", perspective: "80px" }}
        onClick={onChange}
      >
        <div
          className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[450ms] [transition-timing-function:cubic-bezier(.4,0,.2,1)]"
          style={{ transform: checked ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div
            className="absolute inset-0 border-solid [backface-visibility:hidden] flex items-center justify-center"
            style={{
              borderRadius: "var(--cbx-radius)",
              borderWidth: "var(--cbx-unchecked-border-width)",
              borderColor: "var(--cbx-unchecked-border)",
              background: "var(--cbx-unchecked-bg)",
            }}
          />
          <div
            className="absolute inset-0 border-solid [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center"
            style={{
              borderRadius: "var(--cbx-radius)",
              borderWidth: "var(--cbx-unchecked-border-width)",
              borderColor: "var(--cbx-checked-border)",
              background: "var(--cbx-checked-bg)",
            }}
          >
            <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
              <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "scribble":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid transition-[background,border-color] duration-[220ms] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
        }}
        onClick={onChange}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style={{ overflow: "visible" }}>
          <path d="${sp}" fill="none" stroke="${ckc}" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="52"
            style={{ strokeDashoffset: checked ? 0 : 52, transition: "stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "glitch":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [glitching, setGlitching] = React.useState<boolean>(false);
  function handleClick(): void { onChange(); setGlitching(true); setTimeout(() => setGlitching(false), 500); }
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <div className="relative shrink-0 cursor-pointer" style={{ width: "var(--cbx-size)", height: "var(--cbx-size)" }} onClick={handleClick}>
        <button
          className="flex items-center justify-center border-[var(--cbx-unchecked-border-width)] border-solid cursor-pointer p-0 outline-none"
          style={{
            width: "var(--cbx-size)",
            height: "var(--cbx-size)",
            borderRadius: "var(--cbx-radius)",
            background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
            borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
          }}
          type="button"
        >
          <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
            <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s" }} />
          </svg>
        </button>
        {glitching && <>
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.55] [animation:cbx-glitch-1_0.45s_steps(1)_forwards]"
            style={{ borderRadius: "var(--cbx-radius)", background: "var(--cbx-accent)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.45] [animation:cbx-glitch-2_0.45s_steps(1)_0.05s_forwards]"
            style={{ borderRadius: "var(--cbx-radius)", background: "var(--cbx-accent-secondary)" }}
          />
        </>}
      </div>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "elastic":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [key, setKey] = React.useState<number>(0);
  function handleClick(): void { onChange(); setKey((k: number) => k + 1); }
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        key={key}
        className="flex items-center justify-center shrink-0 border-[var(--cbx-unchecked-border-width)] border-solid transition-[background,border-color] duration-[150ms] cursor-pointer p-0 outline-none [animation:cbx-elastic_0.5s_cubic-bezier(.4,0,.2,1)]"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: checked ? "var(--cbx-checked-bg)" : "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
        }}
        onClick={handleClick}
        type="button"
      >
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          <path d="${cp}" fill="none" stroke="${ckc}" strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="28"
            style={{ strokeDashoffset: checked ? 0 : 28, transition: "stroke-dashoffset 0.25s ease 0.1s" }} />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;

    case "unfold":
      return `
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string | null;
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-[var(--cbx-label-gap)] cursor-pointer select-none">
      <button
        className="relative flex items-center justify-center shrink-0 overflow-hidden border-[var(--cbx-unchecked-border-width)] border-solid transition-[border-color] duration-[220ms] cursor-pointer p-0 outline-none"
        style={{
          width: "var(--cbx-size)",
          height: "var(--cbx-size)",
          borderRadius: "var(--cbx-radius)",
          background: "var(--cbx-unchecked-bg)",
          borderColor: checked ? "var(--cbx-checked-border)" : "var(--cbx-unchecked-border)",
        }}
        onClick={onChange}
        type="button"
      >
        <div
          className="absolute inset-0 transition-[clip-path] duration-[350ms] [transition-timing-function:cubic-bezier(.4,0,.2,1)]"
          style={{
            background: "var(--cbx-checked-bg)",
            clipPath: checked ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 0,0 0,0 100%,0 100%)",
          }}
        />
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" className="relative z-[1]">
          <path d="${cp}" fill="none" stroke={checked ? "${ckc}" : "transparent"} strokeWidth="2.3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.1s 0.25s" }} />
        </svg>
      </button>
      {label && <span className="text-[var(--cbx-label-color)] text-[${c.labelFontSize}px] leading-snug">{label}</span>}
    </label>
  );
}`;
  }
}

// ─── Demo wrapper (5 items) ───────────────────────────────────────────────────

const DEMO_LABELS = [
  "Notifications enabled",
  "Save to drafts",
  "Share analytics",
  "Dark mode",
  "Auto-update",
];

function demoApp(c: CheckboxConfig): string {
  const items = DEMO_LABELS.map(
    (lbl, i) => `  { id: ${i + 1}, label: "${lbl}", checked: ${i % 3 === 0} },`,
  ).join("\n");

  return `
export default function CheckboxDemo() {
  const [items, setItems] = React.useState([
${items}
  ]);

  function toggle(id) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  return (
    <div className="cbx__demo">
      {items.map(item => (
        <Checkbox
          key={item.id}
          checked={item.checked}
          onChange={() => toggle(item.id)}
          label={${c.showLabels ? "item.label" : "null"}}
        />
      ))}
    </div>
  );
}`;
}

function demoAppTSX(c: CheckboxConfig): string {
  interface CheckboxItem {
    id: number;
    label: string;
    checked: boolean;
  }

  const items = DEMO_LABELS.map(
    (lbl, i) => `  { id: ${i + 1}, label: "${lbl}", checked: ${i % 3 === 0} },`,
  ).join("\n");

  return `
export default function CheckboxDemo() {
  const [items, setItems] = React.useState<CheckboxItem[]>([
${items}
  ]);

  function toggle(id: number): void {
    setItems((prev: CheckboxItem[]) => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  return (
    <div className="cbx__demo">
      {items.map((item: CheckboxItem) => (
        <Checkbox
          key={item.id}
          checked={item.checked}
          onChange={() => toggle(item.id)}
          label={${c.showLabels ? "item.label" : "null"}}
        />
      ))}
    </div>
  );
}`;
}

function demoAppTailwind(c: CheckboxConfig): string {
  interface CheckboxItem {
    id: number;
    label: string;
    checked: boolean;
  }

  const items = DEMO_LABELS.map(
    (lbl, i) => `  { id: ${i + 1}, label: "${lbl}", checked: ${i % 3 === 0} },`,
  ).join("\n");

  return `
export default function CheckboxDemo() {
  const [items, setItems] = React.useState<CheckboxItem[]>([
${items}
  ]);

  function toggle(id: number): void {
    setItems((prev: CheckboxItem[]) => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  return (
    <div className="flex flex-col gap-[var(--cbx-item-gap)] p-8 font-sans" style={cbxVars}>
      {items.map((item: CheckboxItem) => (
        <Checkbox
          key={item.id}
          checked={item.checked}
          onChange={() => toggle(item.id)}
          label={${c.showLabels ? "item.label" : "null"}}
        />
      ))}
    </div>
  );
}`;
}

// ─── JSX + CSS ────────────────────────────────────────────────────────────────

export function generateCheckboxJSX(config: CheckboxConfig): string {
  return [
    `import React, { useState } from "react";`,
    `import "./Checkbox.css";`,
    ``,
    variantJSX(config.variant, config),
    demoApp(config),
  ].join("\n");
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

export function generateCheckboxCSS(config: CheckboxConfig): string {
  const {
    size: s,
    borderRadius: br,
    uncheckedBorderWidth: ubw,
    labelColor: lc,
    labelFontSize: lfs,
    labelGap: lg,
    itemGap: ig,
    accentColor: acc,
    accentSecondary: acc2,
  } = config;

  const v = config.variant;

  const keyframes: Record<CheckboxVariant, string> = {
    morph: ``,
    stamp: `
@keyframes cbx-stamp {
  0%   { transform: scale(1.5); opacity: 0; }
  60%  { transform: scale(0.88); }
  100% { transform: scale(1); opacity: 1; }
}`,
    slide: ``,
    ripple: `
@keyframes cbx-ripple {
  0%   { transform: scale(0); opacity: 0.7; }
  100% { transform: scale(2.8); opacity: 0; }
}`,
    neon: `
@keyframes cbx-neon-flicker {
  0%  { opacity: 1; }  5%  { opacity: 0.4; } 10% { opacity: 1; }
  15% { opacity: 0.6; } 20% { opacity: 1; }  75% { opacity: 1; }
  76% { opacity: 0.3; } 77% { opacity: 1; }  100%{ opacity: 1; }
}
@keyframes cbx-neon-glow {
  0%, 100% { box-shadow: 0 0 6px 2px ${acc}, 0 0 16px 4px ${acc}; }
  50%       { box-shadow: 0 0 10px 4px ${acc}, 0 0 28px 8px ${acc}; }
}`,
    flip: ``,
    scribble: ``,
    glitch: `
@keyframes cbx-glitch-1 {
  0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
  40%     { clip-path: inset(14px 0 2px 0); transform: translate(2px,0); }
  60%     { clip-path: inset(6px 0 10px 0); transform: translate(-1px,0); }
}
@keyframes cbx-glitch-2 {
  0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20%     { clip-path: inset(14px 0 2px 0); transform: translate(3px,0); }
  40%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
  60%     { clip-path: inset(10px 0 6px 0); transform: translate(1px,0); }
}`,
    elastic: `
@keyframes cbx-elastic {
  0%   { transform: scale(1); }
  20%  { transform: scale(0.7, 1.3); }
  40%  { transform: scale(1.3, 0.7); }
  55%  { transform: scale(0.88, 1.1); }
  70%  { transform: scale(1.05, 0.95); }
  100% { transform: scale(1); }
}`,
    unfold: ``,
  };

  const variantCSS: Record<CheckboxVariant, string> = {
    morph: `
.cbx__box--morph {
  transition: background 0.28s cubic-bezier(.4,0,.2,1),
              border-color 0.28s,
              border-radius 0.28s;
}`,
    stamp: `
.cbx__box--stamp {
  transition: background 0.15s, border-color 0.15s;
}`,
    slide: `
.cbx__box--slide {
  overflow: hidden;
  transition: background 0.22s, border-color 0.22s;
}`,
    ripple: `
.cbx__ripple-wrap {
  position: relative;
  width: ${s}px;
  height: ${s}px;
  flex-shrink: 0;
}
.cbx__ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${acc}55;
  animation: cbx-ripple 0.55s ease-out forwards;
  pointer-events: none;
}`,
    neon: `
.cbx__box--neon {
  transition: background 0.2s, border-color 0.2s, box-shadow 0.3s;
}
.cbx__box--neon-on {
  animation: cbx-neon-glow 1.8s ease-in-out infinite;
}`,
    flip: `
.cbx__flip-scene {
  width: ${s}px;
  height: ${s}px;
  perspective: 80px;
  flex-shrink: 0;
  cursor: pointer;
}
.cbx__flip-card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(.4,0,.2,1);
  position: relative;
}
.cbx__flip-front,
.cbx__flip-back {
  position: absolute;
  inset: 0;
  border-radius: ${br}px;
  border: ${ubw}px solid;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cbx__flip-back {
  transform: rotateY(180deg);
}`,
    scribble: `
.cbx__box {
  transition: background 0.22s, border-color 0.22s;
}`,
    glitch: `
.cbx__glitch-wrap {
  position: relative;
  width: ${s}px;
  height: ${s}px;
  flex-shrink: 0;
  cursor: pointer;
}
.cbx__glitch-layer {
  position: absolute;
  inset: 0;
  border-radius: ${br}px;
  pointer-events: none;
}
.cbx__glitch-layer--1 {
  opacity: 0.55;
  animation: cbx-glitch-1 0.45s steps(1) forwards;
}
.cbx__glitch-layer--2 {
  opacity: 0.45;
  animation: cbx-glitch-2 0.45s steps(1) 0.05s forwards;
}`,
    elastic: `
.cbx__box--elastic {
  transition: background 0.15s, border-color 0.15s;
}`,
    unfold: `
.cbx__box--unfold {
  position: relative;
  overflow: hidden;
  transition: border-color 0.22s;
}
.cbx__unfold-fill {
  position: absolute;
  inset: 0;
  transition: clip-path 0.35s cubic-bezier(.4,0,.2,1);
}`,
  };

  return `
/* ── Keyframes ────────────────────────────────────────────────── */
${keyframes[v]}

/* ── Demo Layout ──────────────────────────────────────────────── */
.cbx__demo {
  display: flex;
  flex-direction: column;
  gap: ${ig}px;
  padding: 32px;
  font-family: "Instrument Sans", sans-serif;
}

/* ── Row ──────────────────────────────────────────────────────── */
.cbx__wrap {
  display: flex;
  align-items: center;
  gap: ${lg}px;
  cursor: pointer;
  user-select: none;
}

/* ── Base Box ─────────────────────────────────────────────────── */
.cbx__box {
  width: ${s}px;
  height: ${s}px;
  border-radius: ${br}px;
  border: ${ubw}px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  outline: none;
}

/* ── Label ────────────────────────────────────────────────────── */
.cbx__label {
  color: ${lc};
  font-size: ${lfs}px;
  line-height: 1.3;
}

/* ── Variant-specific ─────────────────────────────────────────── */
${variantCSS[v]}
`.trim();
}

// ─── TSX + CSS ────────────────────────────────────────────────────────────────

export function generateCheckboxTSX(config: CheckboxConfig): string {
  interface CheckboxItem {
    id: number;
    label: string;
    checked: boolean;
  }

  return [
    `import React, { useState } from "react";`,
    `import "./Checkbox.css";`,
    ``,
    `interface CheckboxItem {`,
    `  id: number;`,
    `  label: string;`,
    `  checked: boolean;`,
    `}`,
    ``,
    variantTSX(config.variant, config),
    demoAppTSX(config),
  ].join("\n");
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateCheckboxTailwind(config: CheckboxConfig): string {
  const {
    size: s,
    borderRadius: br,
    uncheckedBorderWidth: ubw,
    labelColor: lc,
    labelFontSize: lfs,
    labelGap: lg,
    itemGap: ig,
    accentColor: acc,
    accentSecondary: acc2,
    uncheckedBackground: ubg,
    uncheckedBorderColor: ubc,
    checkedBackground: cbg,
    checkedBorderColor: cbc,
    checkmarkColor: ckc,
  } = config;

  const v = config.variant;

  // Pre-compute keyframes string for variants that need animations
  const keyframes: Record<CheckboxVariant, string> = {
    morph: "",
    stamp: `
  @keyframes cbx-stamp {
    0%   { transform: scale(1.5); opacity: 0; }
    60%  { transform: scale(0.88); }
    100% { transform: scale(1); opacity: 1; }
  }`,
    slide: "",
    ripple: `
  @keyframes cbx-ripple {
    0%   { transform: scale(0); opacity: 0.7; }
    100% { transform: scale(2.8); opacity: 0; }
  }`,
    neon: `
  @keyframes cbx-neon-flicker {
    0%  { opacity: 1; }  5%  { opacity: 0.4; } 10% { opacity: 1; }
    15% { opacity: 0.6; } 20% { opacity: 1; }  75% { opacity: 1; }
    76% { opacity: 0.3; } 77% { opacity: 1; }  100%{ opacity: 1; }
  }
  @keyframes cbx-neon-glow {
    0%, 100% { box-shadow: 0 0 6px 2px ${acc}, 0 0 16px 4px ${acc}; }
    50%       { box-shadow: 0 0 10px 4px ${acc}, 0 0 28px 8px ${acc}; }
  }`,
    flip: "",
    scribble: "",
    glitch: `
  @keyframes cbx-glitch-1 {
    0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
    20%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
    40%     { clip-path: inset(14px 0 2px 0); transform: translate(2px,0); }
    60%     { clip-path: inset(6px 0 10px 0); transform: translate(-1px,0); }
  }
  @keyframes cbx-glitch-2 {
    0%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
    20%     { clip-path: inset(14px 0 2px 0); transform: translate(3px,0); }
    40%     { clip-path: inset(2px 0 18px 0); transform: translate(-2px,0); }
    60%     { clip-path: inset(10px 0 6px 0); transform: translate(1px,0); }
  }`,
    elastic: `
  @keyframes cbx-elastic {
    0%   { transform: scale(1); }
    20%  { transform: scale(0.7, 1.3); }
    40%  { transform: scale(1.3, 0.7); }
    55%  { transform: scale(0.88, 1.1); }
    70%  { transform: scale(1.05, 0.95); }
    100% { transform: scale(1); }
  }`,
    unfold: "",
  };

  const kf = keyframes[v];
  const keyframesBlock = kf
    ? `\n  {/* Keyframes */}\n  <style>{\`${kf}\n\`}</style>`
    : "";

  return `import React, { useState, CSSProperties } from "react";

interface CheckboxItem {
  id: number;
  label: string;
  checked: boolean;
}

// Baked-in CSS variable tokens — update these to reskin the Checkbox
const cbxVars: CSSProperties = {
  "--cbx-size":                   "${s}px",
  "--cbx-radius":                 "${br}px",
  "--cbx-unchecked-bg":           "${ubg}",
  "--cbx-unchecked-border":       "${ubc}",
  "--cbx-unchecked-border-width": "${ubw}px",
  "--cbx-checked-bg":             "${cbg}",
  "--cbx-checked-border":         "${cbc}",
  "--cbx-checkmark-color":        "${ckc}",
  "--cbx-accent":                 "${acc}",
  "--cbx-accent-secondary":       "${acc2}",
  "--cbx-neon-bg-on":             "${acc}18",
  "--cbx-neon-glow-near":         "${acc}88",
  "--cbx-neon-glow-far":          "${acc}44",
  "--cbx-ripple-color":           "${acc}55",
  "--cbx-label-color":            "${lc}",
  "--cbx-label-gap":              "${lg}px",
  "--cbx-item-gap":               "${ig}px",
} as CSSProperties;

${variantTailwind(v, config)}
${demoAppTailwind(config)}`;
}
