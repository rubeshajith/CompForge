import { LoaderConfig, LoaderVariant } from "./loaderConfig";

// ─── JSX generators per variant ──────────────────────────────────────────────

function jsxPulseWave(c: LoaderConfig): string {
  const w = c.size;
  const h = Math.round(c.size * 0.75);
  const dur = (1.4 * c.speed).toFixed(2);
  return `  <div className="ldr-wrap">
    <svg className="ldr ldr--pulse-wave" width="${w}" height="${h}" viewBox="0 0 64 48">
      <polyline className="ldr__back" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
      <polyline className="ldr__front" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
    </svg>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssPulseWave(c: LoaderConfig): string {
  const dur = (1.4 * c.speed).toFixed(2);
  return `.ldr--pulse-wave .ldr__back,
.ldr--pulse-wave .ldr__front {
  fill: none;
  stroke-width: ${c.strokeWidth};
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ldr--pulse-wave .ldr__back  { stroke: ${c.secondaryColor}; }
.ldr--pulse-wave .ldr__front {
  stroke: ${c.primaryColor};
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: ldr-wave ${dur}s linear infinite;
}
@keyframes ldr-wave {
  72.5% { opacity: 0; }
  to    { stroke-dashoffset: 0; }
}`;
}

function jsxHexBloom(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--hex-bloom">
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
      <div className="ldr__hex"></div>
    </div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssHexBloom(c: LoaderConfig): string {
  const s = c.size;
  const unit = s * 0.375;
  const half = unit / 2;
  const bodyH = unit * 0.5;
  const capH = bodyH * 0.5;
  const dur = (2.1 * c.speed).toFixed(2);
  const positions = [
    [-unit * 0.875, 0, 0],
    [-unit * 0.4375, unit * 0.6875, 0.1],
    [unit * 0.4375, unit * 0.6875, 0.2],
    [unit * 0.875, 0, 0.3],
    [unit * 0.4375, -unit * 0.6875, 0.4],
    [-unit * 0.4375, -unit * 0.6875, 0.5],
    [0, 0, 0.6],
  ];
  const nthRules = positions
    .map(
      ([, , delay], i) =>
        `.ldr--hex-bloom .ldr__hex:nth-child(${i + 1}) { animation-delay: ${(delay * c.speed).toFixed(2)}s; left: ${(positions[i][0] - half).toFixed(1)}px; top: ${(positions[i][1] - bodyH / 2).toFixed(1)}px; }`,
    )
    .join("\n");

  return `.ldr--hex-bloom {
  width: ${s}px; height: ${s}px;
  position: relative;
}
.ldr--hex-bloom .ldr__hex {
  position: absolute;
  width: ${unit.toFixed(1)}px; height: ${bodyH.toFixed(1)}px;
  left: 50%; top: 50%;
  animation: ldr-hexbloom ${dur}s infinite backwards;
}
.ldr--hex-bloom .ldr__hex::before,
.ldr--hex-bloom .ldr__hex::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  border-left: ${half.toFixed(1)}px solid transparent;
  border-right: ${half.toFixed(1)}px solid transparent;
}
.ldr--hex-bloom .ldr__hex::before {
  top: -${capH.toFixed(1)}px;
  border-bottom: ${capH.toFixed(1)}px solid ${c.primaryColor};
}
.ldr--hex-bloom .ldr__hex::after {
  bottom: -${capH.toFixed(1)}px;
  border-top: ${capH.toFixed(1)}px solid ${c.primaryColor};
}
.ldr--hex-bloom .ldr__hex > div { background: ${c.primaryColor}; width: 100%; height: 100%; }
${nthRules}
@keyframes ldr-hexbloom {
  0%,20%,80%,100% { opacity:0; transform:scale(0); }
  30%,70%          { opacity:1; transform:scale(1); }
}`;
}

function jsxOrbitRing(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--orbit-ring"></div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssOrbitRing(c: LoaderConfig): string {
  const s = c.size;
  const dot = Math.round(s * 0.19);
  const pad = Math.round(s * 0.047);
  const sw = c.strokeWidth;
  const dur = (2 * c.speed).toFixed(2);
  return `.ldr--orbit-ring {
  width: ${s}px; height: ${s}px;
  border-radius: 50%;
  padding: ${pad}px;
  background:
    radial-gradient(farthest-side, ${c.primaryColor} 95%, transparent) 50% 0 / ${dot}px ${dot}px no-repeat,
    radial-gradient(farthest-side, transparent calc(100% - ${sw + 1}px), ${c.primaryColor} calc(100% - ${sw}px)) content-box;
  box-sizing: border-box;
  animation: ldr-orbit ${dur}s linear infinite;
}
@keyframes ldr-orbit { to { transform: rotate(1turn); } }`;
}

function jsxYinSpiral(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--yin-spiral"><div></div></div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssYinSpiral(c: LoaderConfig): string {
  const s = c.size;
  const dur = (2 * c.speed).toFixed(2);
  return `.ldr--yin-spiral {
  width: ${s}px; height: ${s}px;
  border-radius: 50%;
  background: ${c.secondaryColor};
  overflow: hidden;
}
.ldr--yin-spiral > div {
  width: 100%; height: 100%;
  border-radius: 50%;
  background:
    radial-gradient(154% 68.5% at top,    transparent 79.5%, ${c.primaryColor} 80%),
    radial-gradient(154% 68.5% at bottom, ${c.primaryColor} 79.5%, transparent 80%),
    radial-gradient(154% 68.5% at top,    transparent 79.5%, ${c.primaryColor} 80%);
  background-size: 50.5% 220%;
  background-position: -100% 0%, 0% 0%, 100% 0%;
  background-repeat: no-repeat;
  animation: ldr-yin ${dur}s linear infinite;
}
@keyframes ldr-yin {
  33%  { background-position: 0% 33%,  100% 33%,  200% 33%; }
  66%  { background-position: -100% 66%, 0% 66%,   100% 66%; }
  100% { background-position: 0% 100%, 100% 100%, 200% 100%; }
}`;
}

function jsxBarFill(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--bar-fill"></div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssBarFill(c: LoaderConfig): string {
  const s = c.size;
  const h = Math.round(s * 0.78);
  const dur = (2 * c.speed).toFixed(2);
  return `.ldr--bar-fill {
  width: ${s}px; height: ${h}px;
  -webkit-mask:
    no-repeat linear-gradient(90deg,#000 70%,transparent 0) calc(0*100%/4) 100%/calc(100%/5) calc(1*100%/5),
    no-repeat linear-gradient(90deg,#000 70%,transparent 0) calc(1*100%/4) 100%/calc(100%/5) calc(2*100%/5),
    no-repeat linear-gradient(90deg,#000 70%,transparent 0) calc(2*100%/4) 100%/calc(100%/5) calc(3*100%/5),
    no-repeat linear-gradient(90deg,#000 70%,transparent 0) calc(3*100%/4) 100%/calc(100%/5) calc(4*100%/5),
    no-repeat linear-gradient(90deg,#000 70%,transparent 0) calc(4*100%/4) 100%/calc(100%/5) calc(5*100%/5);
  background: linear-gradient(${c.primaryColor} 0 0) left/0% 100% no-repeat ${c.secondaryColor};
  animation: ldr-barfill ${dur}s infinite steps(6);
}
@keyframes ldr-barfill { 100% { background-size: 120% 100%; } }`;
}

function jsxSlideShift(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--slide-shift">
      <div></div>
      <div></div>
    </div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssSlideShift(c: LoaderConfig): string {
  const s = Math.round(c.size * 0.625);
  const d = Math.round(s * 0.353);
  const travel = d * 1.5;
  const dur = (2 * c.speed).toFixed(2);
  return `.ldr--slide-shift {
  width: ${s + d}px; height: ${s + d}px;
  display: grid;
}
.ldr--slide-shift > div {
  grid-area: 1/1;
  clip-path: polygon(${d}px 0,100% 0,100% calc(100% - ${d}px),calc(100% - ${d}px) 100%,0 100%,0 ${d}px);
  background: conic-gradient(
    from -90deg at calc(100% - ${d}px) ${d}px,
    ${c.secondaryColor} 135deg, ${c.primaryColor} 0 270deg, ${c.primaryColor}80 0
  );
  animation: ldr-slide ${dur}s infinite;
}
.ldr--slide-shift > div:last-child { animation-delay: -${c.speed.toFixed(2)}s; }
@keyframes ldr-slide {
  0%   { transform: translate(0,0); }
  25%  { transform: translate(${travel.toFixed(1)}px,0); }
  50%  { transform: translate(${travel.toFixed(1)}px,${travel.toFixed(1)}px); }
  75%  { transform: translate(0,${travel.toFixed(1)}px); }
  100% { transform: translate(0,0); }
}`;
}

function jsxDotBounce(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--dot-bounce">
      <div></div><div></div><div></div>
    </div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssDotBounce(c: LoaderConfig): string {
  const dot = Math.round(c.size * 0.22);
  const gap = Math.round(c.size * 0.12);
  const bounce = Math.round(c.size * 0.45);
  const dur = (1.2 * c.speed).toFixed(2);
  return `.ldr--dot-bounce {
  display: flex;
  align-items: flex-end;
  gap: ${gap}px;
  height: ${c.size}px;
}
.ldr--dot-bounce > div {
  width: ${dot}px; height: ${dot}px;
  border-radius: 50%;
  background: ${c.primaryColor};
  animation: ldr-bounce ${dur}s ease-in-out infinite;
}
.ldr--dot-bounce > div:nth-child(2) { animation-delay: ${(0.16 * c.speed).toFixed(2)}s; }
.ldr--dot-bounce > div:nth-child(3) { animation-delay: ${(0.32 * c.speed).toFixed(2)}s; }
@keyframes ldr-bounce {
  0%,80%,100% { transform: translateY(0); }
  40%          { transform: translateY(-${bounce}px); }
}`;
}

function jsxMorphBlob(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--morph-blob"></div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssMorphBlob(c: LoaderConfig): string {
  const s = c.size;
  const dur = (3 * c.speed).toFixed(2);
  return `.ldr--morph-blob {
  width: ${s}px; height: ${s}px;
  background: radial-gradient(circle at 30% 30%, ${c.primaryColor}, ${c.secondaryColor});
  animation: ldr-morph ${dur}s ease-in-out infinite;
}
@keyframes ldr-morph {
  0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%      { border-radius: 50% 60% 30% 60% / 40% 70% 60% 30%; }
  75%      { border-radius: 70% 30% 60% 40% / 30% 50% 60% 50%; }
}`;
}

function jsxStaggerBars(c: LoaderConfig): string {
  return `  <div className="ldr-wrap">
    <div className="ldr ldr--stagger-bars">
      <div></div><div></div><div></div><div></div><div></div>
    </div>${c.showLabel ? `\n    <span className="ldr__label">${c.labelText}</span>` : ""}
  </div>`;
}

function cssStaggerBars(c: LoaderConfig): string {
  const barW = Math.round(c.size * 0.14);
  const gap = Math.round(c.size * 0.08);
  const dur = (1.0 * c.speed).toFixed(2);
  const delays = [0, 0.1, 0.2, 0.1, 0];
  const nthRules = delays
    .map(
      (d, i) =>
        `.ldr--stagger-bars > div:nth-child(${i + 1}) { animation-delay: ${(d * c.speed).toFixed(2)}s; }`,
    )
    .join("\n");
  return `.ldr--stagger-bars {
  display: flex;
  align-items: center;
  gap: ${gap}px;
  height: ${c.size}px;
}
.ldr--stagger-bars > div {
  width: ${barW}px; height: 30%;
  border-radius: ${Math.round(barW / 2)}px;
  background: ${c.primaryColor};
  animation: ldr-stagger ${dur}s ease-in-out infinite;
}
${nthRules}
@keyframes ldr-stagger {
  0%,100% { height: 30%; opacity: 0.4; }
  50%      { height: 100%; opacity: 1; }
}`;
}

// ─── shared wrapper CSS ───────────────────────────────────────────────────────

function cssWrapper(c: LoaderConfig): string {
  return `.ldr-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${c.backgroundColor};
  padding: 2rem;
  border-radius: 12px;
}
.ldr__label {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: ${c.labelColor};
}`;
}

// ─── dispatch tables ──────────────────────────────────────────────────────────

const JSX_GENERATORS: Record<LoaderVariant, (c: LoaderConfig) => string> = {
  "pulse-wave": jsxPulseWave,
  "hex-bloom": jsxHexBloom,
  "orbit-ring": jsxOrbitRing,
  "yin-spiral": jsxYinSpiral,
  "bar-fill": jsxBarFill,
  "slide-shift": jsxSlideShift,
  "dot-bounce": jsxDotBounce,
  "morph-blob": jsxMorphBlob,
  "stagger-bars": jsxStaggerBars,
};

const CSS_GENERATORS: Record<LoaderVariant, (c: LoaderConfig) => string> = {
  "pulse-wave": cssPulseWave,
  "hex-bloom": cssHexBloom,
  "orbit-ring": cssOrbitRing,
  "yin-spiral": cssYinSpiral,
  "bar-fill": cssBarFill,
  "slide-shift": cssSlideShift,
  "dot-bounce": cssDotBounce,
  "morph-blob": cssMorphBlob,
  "stagger-bars": cssStaggerBars,
};

// ─── public exports ───────────────────────────────────────────────────────────

export function generateLoaderJSX(config: LoaderConfig): string {
  const inner = JSX_GENERATORS[config.variant](config);
  return `import React from "react";
import "./Loader.css";

export default function Loader() {
  return (
${inner}
  );
}`;
}

export function generateLoaderCSS(config: LoaderConfig): string {
  const variantCSS = CSS_GENERATORS[config.variant](config);
  return `${cssWrapper(config)}

${variantCSS}`;
}
