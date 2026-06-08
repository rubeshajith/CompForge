// ─────────────────────────────────────────────────────────────────────────────
// generateProgressCode.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { ProgressConfig } from "./progressConfig";

function clampVal(v: number) {
  return Math.max(0, Math.min(100, v));
}

// ─── JSX + CSS ───────────────────────────────────────────────────────────────

export function generateProgressJSX(config: ProgressConfig): string {
  const pct = clampVal(config.value);
  const circ = (r: number) => +(2 * Math.PI * r).toFixed(2);
  const offset = (r: number, p: number) =>
    +(circ(r) * (1 - p / 100)).toFixed(2);

  const animStyle = config.animated
    ? `transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)"`
    : "";

  const barAnim = config.animated
    ? `transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)"`
    : "";

  // ── per-variant JSX ───────────────────────────────────────────────────────
  const variantJSX: Record<string, string> = {
    linear: `
export default function ProgressLinear() {
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Uploading assets…</span>` : ""}
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.valueColor}", fontWeight: 600 }}>${pct}%</span>` : ""}
      </div>
      <div className="prog__track">
        <div className="prog__fill" style={{ width: "${pct}%" }} />
      </div>
    </div>
  );
}`,

    ring: `
export default function ProgressRing() {
  const circ = ${circ(40)};
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="${config.accentColor}" strokeWidth={2.5} strokeLinecap="round" className="prog__spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Processing data</span>` : ""}
    </div>
  );
}`,

    segmented: `
export default function ProgressSegmented() {
  const total = 5;
  const filled = ${Math.round((pct / 100) * 5)};
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={i < filled ? "prog__seg prog__seg--filled" : "prog__seg"} />
        ))}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Batch: {filled} of {total}</span>` : ""}
    </div>
  );
}`,

    percentageRing: `
export default function ProgressPercentageRing() {
  const circ = ${circ(40)};
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentSecondary}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        ${
          config.showValue
            ? `<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>${pct}%</span>
        </div>`
            : ""
        }
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Completion Rate</span>` : ""}
    </div>
  );
}`,

    rhythmWave: `
export default function ProgressRhythmWave() {
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Optimizing render pipeline…</span>` : ""}
      <div className="prog__wave-track">
        <div className="prog__wave-fill" style={{ width: "${pct}%" }} />
      </div>
      ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.valueColor}", fontWeight: 600 }}>${pct}%</span>` : ""}
    </div>
  );
}`,

    powerNode: `
export default function ProgressPowerNode() {
  const battColor = ${pct} <= 25 ? "${config.dangerColor}" : ${pct} <= 50 ? "${config.warningColor}" : "${config.successColor}";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="prog__battery">
          <div className="prog__battery-fill" style={{ width: "${pct}%", background: battColor }} />
          <div className="prog__battery-tip" />
        </div>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 2}, fontWeight: 700, color: battColor }}>${pct}%</span>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>${pct <= 25 ? "Low Energy Mode" : pct <= 50 ? "Normal Mode" : "Charging"}</span>` : ""}
    </div>
  );
}`,

    verticalFill: `
export default function ProgressVerticalFill() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "sans-serif" }}>
      <div className="prog__vtrack">
        <div className="prog__vfill" style={{ height: "calc(${pct}% - 8px)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>${pct}%</span>` : ""}
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Target</span>` : ""}
      </div>
    </div>
  );
}`,

    glassFluid: `
export default function ProgressGlassFluid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div className="prog__glass">
        <div className="prog__glass-fill" style={{ height: "${pct}%" }}>
          <div className="prog__glass-wave" />
        </div>
        ${config.showValue ? `<div className="prog__glass-label">${pct}%</div>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Storage used</span>` : ""}
    </div>
  );
}`,

    gamifiedXP: `
export default function ProgressGamifiedXP() {
  const xp = ${Math.round((pct / 100) * 2000)};
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Next Level</span>` : ""}
        <span className="prog__level-badge">LVL 42</span>
      </div>
      ${config.showValue ? `<div style={{ textAlign: "right" }}><span style={{ fontSize: ${config.fontSize}, color: "${config.labelColor}" }}>{xp.toLocaleString()} / 2,000 XP</span></div>` : ""}
      <div className="prog__xp-track">
        <div className="prog__xp-fill" style={{ width: "${pct}%" }} />
      </div>
    </div>
  );
}`,

    gpuCapacity: `
export default function ProgressGPUCapacity() {
  const used = ${((pct / 100) * 10).toFixed(1)};
  const circ = ${circ(30)};
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${Math.round(config.ringSize * 0.75)}, height: ${Math.round(config.ringSize * 0.75)} }}>
        <svg width={${Math.round(config.ringSize * 0.75)}} height={${Math.round(config.ringSize * 0.75)}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${Math.round((config.ringSize * 0.75) / 2)}} cy={${Math.round((config.ringSize * 0.75) / 2)}} r={30} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${Math.round((config.ringSize * 0.75) / 2)}} cy={${Math.round((config.ringSize * 0.75) / 2)}} r={30} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(30, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ${config.fontSize - 2}, fontWeight: 700, color: "${config.valueColor}" }}>GPU</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>{used} GB</span>` : ""}
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>/ 10 GB Used</span>` : ""}
      </div>
    </div>
  );
}`,

    // Remaining variants use generic templates
    processQueue: `
export default function ProgressProcessQueue() {
  const items = [
    { name: "hero_banner_v2.psd", status: "done", icon: "🖼" },
    { name: "brand_guidelines.pdf", status: "processing", icon: "📄" },
    { name: "icon_set_v3.zip", status: "waiting", icon: "📦" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8, fontFamily: "sans-serif" }}>
      {items.map((item, i) => (
        <div key={i} className={\`prog__queue-item \${item.status === "processing" ? "prog__queue-item--active" : ""}\`}>
          <div className="prog__queue-icon">{item.icon}</div>
          <div className="prog__queue-info">
            <div className="prog__queue-name">{item.name}</div>
            <div className={\`prog__queue-status prog__queue-status--\${item.status}\`}>
              {item.status === "done" ? "Complete" : item.status === "processing" ? "Processing…" : "Waiting…"}
            </div>
          </div>
          {item.status === "done" && <span style={{ color: "${config.successColor}" }}>✓</span>}
        </div>
      ))}
    </div>
  );
}`,

    speedGauge: `
export default function ProgressSpeedGauge() {
  const pct = ${pct};
  const isHigh = pct > 75, isMed = pct > 40;
  const gaugeColor = isHigh ? "${config.dangerColor}" : isMed ? "${config.warningColor}" : "${config.successColor}";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: 120, height: 70 }}>
        <svg viewBox="0 0 100 60" width={120} height={70}>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="${config.trackColor}" strokeWidth={10} strokeLinecap="round" />
          <path className="prog__gauge-fill" fill="none" strokeWidth={10} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
          <span style={{ fontSize: ${config.fontSize - 1}, fontWeight: 700, color: gaugeColor, letterSpacing: "0.1em" }}>
            {isHigh ? "CRITICAL" : isMed ? "NORMAL" : "IDLE"}
          </span>
        </div>
      </div>
      ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>{pct}% load</span>` : ""}
    </div>
  );
}`,

    multiRing: `
export default function ProgressMultiRing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          {/* Outer ring — CPU */}
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.accentColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2), pct)}" strokeLinecap="round" className="prog__ring-fill" />
          {/* Middle ring — GPU */}
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.accentSecondary}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5), Math.round(pct * 0.72))}" strokeLinecap="round" className="prog__ring-fill" />
        </svg>
      </div>
      ${
        config.showLabel
          ? `<div style={{ display: "flex", gap: 12 }}>
        <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}><span style={{ color: "${config.accentColor}" }}>●</span> CPU</span>
        <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}><span style={{ color: "${config.accentSecondary}" }}>●</span> GPU</span>
      </div>`
          : ""
      }
    </div>
  );
}`,

    levelLadder: `
export default function ProgressLevelLadder() {
  const levels = [
    { label: "Arch-Mage", id: "L4", active: false, completed: false },
    { label: "Wizard", id: "L3", active: true, completed: false },
    { label: "Apprentice", id: "L2", active: false, completed: true },
    { label: "Novice", id: "L1", active: false, completed: true },
  ];
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div className="prog__ladder">
        {levels.map((lv, i) => (
          <div key={i} className={\`prog__ladder-step \${lv.active ? "prog__ladder-step--active" : ""} \${lv.completed ? "prog__ladder-step--done" : ""}\`}>
            <div className="prog__ladder-dot">{lv.completed && !lv.active ? "✓" : lv.id}</div>
            <span className="prog__ladder-label">{lv.label}{lv.active ? " (Active)" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    iconPath: `
export default function ProgressIconPath() {
  const badges = [
    { icon: "⭐", earned: true, label: "Explorer" },
    { icon: "🏆", earned: true, label: "Champion" },
    { icon: "🎖", earned: false, label: "Legend" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 280 }}>
        {badges.map((badge, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < badges.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: badge.earned ? 1 : 0.35 }}>
              <span style={{ fontSize: 22 }}>{badge.icon}</span>
              ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize - 2}, color: badge.earned ? "${config.accentSecondary}" : "${config.mutedColor}" }}>{badge.label}</span>` : ""}
            </div>
            {i < badges.length - 1 && <div className="prog__path-connector" />}
          </div>
        ))}
      </div>
      <span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>2 of 3 badges earned</span>
    </div>
  );
}`,

    donutThin: `
export default function ProgressDonutThin() {
  const sw = ${Math.max(2, Math.round(config.strokeWidth * 0.3))};
  const r = ${Math.round(config.ringSize / 2 - Math.max(2, config.strokeWidth * 0.3) / 2 - 2)};
  const circ = +(2 * Math.PI * r).toFixed(2);
  const offset = +(circ * (1 - ${pct} / 100)).toFixed(2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none" stroke="${config.trackColor}" strokeWidth={sw} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none" stroke="${config.accentTertiary}" strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        ${config.showValue ? `<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: ${config.fontSize + 1}, fontWeight: 700, color: "${config.accentTertiary}" }}>${pct}%</span></div>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Sync progress</span>` : ""}
    </div>
  );
}`,

    conversionFunnel: `
export default function ProgressConversionFunnel() {
  const stages = [
    { label: "Visitors", value: "10k", w: "100%" },
    { label: "Qualified", value: "4k", w: "78%" },
    { label: "Trial", value: "1k", w: "52%" },
    { label: "Sale", value: "200", w: "22%" },
  ];
  const opacities = [1, 0.75, 0.5, 0.3];
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 4, fontFamily: "sans-serif" }}>
      {stages.map((s, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: s.w, height: 28, background: "${config.accentColor}", opacity: opacities[i], borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>{s.label} ({s.value})</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,

    workDistribution: `
export default function ProgressWorkDistribution() {
  const bars = [
    { label: "To Do", height: 72, color: "${config.accentColor}" },
    { label: "Active", height: 28, color: "${config.accentTertiary}" },
    { label: "Done", height: 52, color: "${config.accentSecondary}" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 90 }}>
        {bars.map((bar, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="prog__bar-track">
              <div className="prog__bar-fill" style={{ height: bar.height, background: bar.color }} />
            </div>
            ${config.showLabel ? `<span style={{ fontSize: 10, color: "${config.mutedColor}", textTransform: "uppercase", fontWeight: 600 }}>{bar.label}</span>` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}`,

    storageStack: `
export default function ProgressStorageStack() {
  const segs = [
    { label: "System", pct: 40, color: "${config.accentColor}" },
    { label: "Apps", pct: 30, color: "${config.accentTertiary}" },
    { label: "Media", pct: 15, color: "${config.accentSecondary}" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div className="prog__storage-bar">
        {segs.map((s, i) => <div key={i} style={{ height: "100%", width: s.pct + "%", background: s.color }} />)}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    taskProgress: `
export default function ProgressTaskProgress() {
  const tasks = ${Math.round((pct / 100) * 3)};
  return (
    <div style={{ width: "100%", maxWidth: 320, fontFamily: "sans-serif" }}>
      <div className="prog__card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: ${config.fontSize}, fontWeight: 600, color: "${config.labelColor}" }}>Data Migration</div>
            <div style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>Due Tomorrow</div>
          </div>
          <span>📋</span>
        </div>
        <div className="prog__track" style={{ marginTop: 12 }}>
          <div className="prog__fill" style={{ width: "${pct}%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.accentColor}", fontWeight: 600 }}>{tasks}/3 Tasks</span>
          ${config.showValue ? `<span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>${pct}%</span>` : ""}
        </div>
      </div>
    </div>
  );
}`,
  };

  const body = variantJSX[config.variant] ?? variantJSX["linear"];

  return `import { useState } from "react";
import "./Progress.css";

${body.trim()}
`;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

export function generateProgressCSS(config: ProgressConfig): string {
  return `/* Progress — ${config.variant} */
/* Generated by CompForge */

/* ── Linear track / fill ──────────────────────── */
.prog__track {
  height: ${config.barHeight}px;
  width: 100%;
  background: ${config.trackColor};
  border-radius: ${config.barHeight}px;
  overflow: hidden;
}
.prog__fill {
  height: 100%;
  background: ${config.accentColor};
  border-radius: ${config.barHeight}px;
  ${config.animated ? `transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}

/* ── Ring fill ────────────────────────────────── */
.prog__ring-fill {
  ${config.animated ? `transition: stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}

/* ── Spin ─────────────────────────────────────── */
.prog__spin {
  ${config.animated ? `animation: prog-spin 1s linear infinite;` : ""}
}
@keyframes prog-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Segmented ────────────────────────────────── */
.prog__seg {
  flex: 1;
  height: ${config.barHeight + 2}px;
  border-radius: 4px;
  background: ${config.trackColor};
  ${config.animated ? `transition: background 0.3s ease;` : ""}
}
.prog__seg--filled {
  background: ${config.accentColor};
}

/* ── Wave ─────────────────────────────────────── */
.prog__wave-track {
  height: ${config.barHeight + 14}px;
  width: 100%;
  background: ${config.trackColor};
  border-radius: ${config.barHeight + 14}px;
  overflow: hidden;
  position: relative;
}
.prog__wave-fill {
  height: 100%;
  background: linear-gradient(90deg, ${config.accentColor} 0%, ${config.accentTertiary} 50%, ${config.accentColor} 100%);
  background-size: 200% 100%;
  border-radius: ${config.barHeight + 14}px;
  ${
    config.animated
      ? `animation: prog-wave 2s linear infinite;
  transition: width 0.6s ease;`
      : ""
  }
}
@keyframes prog-wave {
  0% { background-position: 200% 0; }
  100% { background-position: 0% 0; }
}

/* ── Battery ──────────────────────────────────── */
.prog__battery {
  width: 72px;
  height: 34px;
  border: 2px solid ${config.borderColor};
  border-radius: 6px;
  padding: 3px;
  display: flex;
  align-items: stretch;
  position: relative;
  background: ${config.backgroundColor};
}
.prog__battery-fill {
  height: 100%;
  border-radius: 3px;
  ${config.animated ? `transition: width 0.6s ease, background 0.3s ease;` : ""}
}
.prog__battery-tip {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  background: ${config.borderColor};
  border-radius: 0 2px 2px 0;
}

/* ── Vertical fill ────────────────────────────── */
.prog__vtrack {
  width: 32px;
  height: 120px;
  background: ${config.trackColor};
  border-radius: 16px;
  padding: 4px;
  position: relative;
  border: 1px solid ${config.borderColor};
}
.prog__vfill {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary});
  border-radius: 12px;
  min-height: 4px;
  ${config.animated ? `transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}

/* ── Glass fluid ──────────────────────────────── */
.prog__glass {
  height: 128px;
  width: 56px;
  background: ${config.trackColor};
  border: 3px solid ${config.borderColor};
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}
.prog__glass-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary});
  ${config.animated ? `transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}
.prog__glass-wave {
  position: absolute;
  top: -8px;
  left: -20%;
  width: 140%;
  height: 16px;
  border-radius: 40%;
  background: rgba(255,255,255,0.2);
  ${config.animated ? `animation: prog-wave-rot 8s linear infinite;` : ""}
}
@keyframes prog-wave-rot {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.prog__glass-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${config.fontSize - 1}px;
  font-weight: 700;
  color: #fff;
  mix-blend-mode: overlay;
}

/* ── XP bar ───────────────────────────────────── */
.prog__level-badge {
  background: ${config.accentColor};
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: ${config.fontSize - 1}px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.prog__xp-track {
  height: ${config.barHeight + 4}px;
  width: 100%;
  background: ${config.trackColor};
  border-radius: 8px;
  overflow: hidden;
}
.prog__xp-fill {
  height: 100%;
  background: linear-gradient(90deg, ${config.accentColor}, ${config.accentSecondary});
  border-radius: 8px;
  ${config.animated ? `transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}

/* ── Queue ────────────────────────────────────── */
.prog__queue-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: ${config.trackColor};
  border-radius: ${config.borderRadius * 0.7}px;
  border: 1px solid ${config.borderColor};
}
.prog__queue-item--active {
  background: ${config.accentColor}14;
  border-color: ${config.accentColor}33;
}
.prog__queue-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${config.accentColor}22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.prog__queue-name {
  font-size: ${config.fontSize}px;
  color: ${config.labelColor};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prog__queue-status {
  font-size: ${config.fontSize - 1}px;
}
.prog__queue-status--done { color: ${config.successColor}; }
.prog__queue-status--processing { color: ${config.accentColor}; }
.prog__queue-status--waiting { color: ${config.mutedColor}; }

/* ── Ladder ───────────────────────────────────── */
.prog__ladder {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 16px;
  position: relative;
}
.prog__ladder::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: ${config.borderColor};
  border-radius: 2px;
}
.prog__ladder-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 4px;
  border-radius: 8px;
  opacity: 0.45;
}
.prog__ladder-step--active {
  background: ${config.accentColor}18;
  opacity: 1;
}
.prog__ladder-step--done {
  opacity: 1;
}
.prog__ladder-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${config.trackColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: ${config.mutedColor};
  z-index: 1;
}
.prog__ladder-step--active .prog__ladder-dot {
  background: ${config.accentColor};
  color: #fff;
}
.prog__ladder-step--done .prog__ladder-dot {
  background: ${config.accentColor}44;
  color: ${config.accentColor};
}
.prog__ladder-label {
  font-size: ${config.fontSize}px;
  color: ${config.labelColor};
}
.prog__ladder-step--active .prog__ladder-label {
  color: ${config.accentColor};
  font-weight: 600;
}

/* ── Icon path ────────────────────────────────── */
.prog__path-connector {
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(90deg, ${config.accentSecondary} 0, ${config.accentSecondary} 5px, transparent 5px, transparent 10px);
  margin: 0 8px;
}

/* ── Bar chart (work dist) ────────────────────── */
.prog__bar-track {
  width: 28px;
  height: 90px;
  background: ${config.trackColor};
  border-radius: 4px 4px 0 0;
  position: relative;
  overflow: hidden;
}
.prog__bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  ${config.animated ? `transition: height 0.6s ease;` : ""}
}

/* ── Storage bar ──────────────────────────────── */
.prog__storage-bar {
  height: ${config.barHeight + 8}px;
  width: 100%;
  background: ${config.trackColor};
  border-radius: 4px;
  display: flex;
  overflow: hidden;
}

/* ── Task card ────────────────────────────────── */
.prog__card {
  padding: 16px;
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  ${config.showShadow ? `box-shadow: 0 4px 24px rgba(0,0,0,0.3);` : ""}
}

/* ── Gauge ────────────────────────────────────── */
.prog__gauge-fill {
  stroke: ${config.value > 75 ? config.dangerColor : config.value > 40 ? config.warningColor : config.successColor};
  ${config.animated ? `transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);` : ""}
}
`;
}

// ─── TSX + CSS ───────────────────────────────────────────────────────────────

export function generateProgressTSX(config: ProgressConfig): string {
  const pct = clampVal(config.value);
  const circ = (r: number) => +(2 * Math.PI * r).toFixed(2);
  const offset = (r: number, p: number) =>
    +(circ(r) * (1 - p / 100)).toFixed(2);

  const variantTSX: Record<string, string> = {
    linear: `
interface ProgressLinearProps {
  label?: string;
  value?: number;
}

export default function ProgressLinear({ label, value }: ProgressLinearProps) {
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Uploading assets…</span>` : ""}
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.valueColor}", fontWeight: 600 }}>${pct}%</span>` : ""}
      </div>
      <div className="prog__track">
        <div className="prog__fill" style={{ width: "${pct}%" }} />
      </div>
    </div>
  );
}`,

    ring: `
export default function ProgressRing() {
  const circ = ${circ(40)};
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="${config.accentColor}" strokeWidth={2.5} strokeLinecap="round" className="prog__spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Processing data</span>` : ""}
    </div>
  );
}`,

    segmented: `
export default function ProgressSegmented() {
  const total: number = 5;
  const filled: number = ${Math.round((pct / 100) * 5)};
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_: unknown, i: number) => (
          <div key={i} className={i < filled ? "prog__seg prog__seg--filled" : "prog__seg"} />
        ))}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Batch: {filled} of {total}</span>` : ""}
    </div>
  );
}`,

    percentageRing: `
export default function ProgressPercentageRing() {
  const circ: number = ${circ(40)};
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentSecondary}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        ${
          config.showValue
            ? `<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>${pct}%</span>
        </div>`
            : ""
        }
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Completion Rate</span>` : ""}
    </div>
  );
}`,

    rhythmWave: `
export default function ProgressRhythmWave() {
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Optimizing render pipeline…</span>` : ""}
      <div className="prog__wave-track">
        <div className="prog__wave-fill" style={{ width: "${pct}%" }} />
      </div>
      ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.valueColor}", fontWeight: 600 }}>${pct}%</span>` : ""}
    </div>
  );
}`,

    powerNode: `
export default function ProgressPowerNode() {
  const battColor: string = ${pct} <= 25 ? "${config.dangerColor}" : ${pct} <= 50 ? "${config.warningColor}" : "${config.successColor}";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="prog__battery">
          <div className="prog__battery-fill" style={{ width: "${pct}%", background: battColor }} />
          <div className="prog__battery-tip" />
        </div>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 2}, fontWeight: 700, color: battColor }}>${pct}%</span>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>${pct <= 25 ? "Low Energy Mode" : pct <= 50 ? "Normal Mode" : "Charging"}</span>` : ""}
    </div>
  );
}`,

    verticalFill: `
export default function ProgressVerticalFill() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "sans-serif" }}>
      <div className="prog__vtrack">
        <div className="prog__vfill" style={{ height: "calc(${pct}% - 8px)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>${pct}%</span>` : ""}
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Target</span>` : ""}
      </div>
    </div>
  );
}`,

    glassFluid: `
export default function ProgressGlassFluid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div className="prog__glass">
        <div className="prog__glass-fill" style={{ height: "${pct}%" }}>
          <div className="prog__glass-wave" />
        </div>
        ${config.showValue ? `<div className="prog__glass-label">${pct}%</div>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Storage used</span>` : ""}
    </div>
  );
}`,

    gamifiedXP: `
export default function ProgressGamifiedXP() {
  const xp: number = ${Math.round((pct / 100) * 2000)};
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Next Level</span>` : ""}
        <span className="prog__level-badge">LVL 42</span>
      </div>
      ${config.showValue ? `<div style={{ textAlign: "right" }}><span style={{ fontSize: ${config.fontSize}, color: "${config.labelColor}" }}>{xp.toLocaleString()} / 2,000 XP</span></div>` : ""}
      <div className="prog__xp-track">
        <div className="prog__xp-fill" style={{ width: "${pct}%" }} />
      </div>
    </div>
  );
}`,

    gpuCapacity: `
export default function ProgressGPUCapacity() {
  const used: string = "${((pct / 100) * 10).toFixed(1)}";
  const circ: number = ${circ(30)};
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${Math.round(config.ringSize * 0.75)}, height: ${Math.round(config.ringSize * 0.75)} }}>
        <svg width={${Math.round(config.ringSize * 0.75)}} height={${Math.round(config.ringSize * 0.75)}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${Math.round((config.ringSize * 0.75) / 2)}} cy={${Math.round((config.ringSize * 0.75) / 2)}} r={30} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${Math.round((config.ringSize * 0.75) / 2)}} cy={${Math.round((config.ringSize * 0.75) / 2)}} r={30} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circ} strokeDashoffset={${offset(30, pct)}}
            strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ${config.fontSize - 2}, fontWeight: 700, color: "${config.valueColor}" }}>GPU</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        ${config.showValue ? `<span style={{ fontSize: ${config.fontSize + 4}, fontWeight: 700, color: "${config.labelColor}" }}>{used} GB</span>` : ""}
        ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>/ 10 GB Used</span>` : ""}
      </div>
    </div>
  );
}`,

    processQueue: `
interface QueueItem {
  name: string;
  status: "done" | "processing" | "waiting";
  icon: string;
}

export default function ProgressProcessQueue() {
  const items: QueueItem[] = [
    { name: "hero_banner_v2.psd", status: "done", icon: "🖼" },
    { name: "brand_guidelines.pdf", status: "processing", icon: "📄" },
    { name: "icon_set_v3.zip", status: "waiting", icon: "📦" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8, fontFamily: "sans-serif" }}>
      {items.map((item: QueueItem, i: number) => (
        <div key={i} className={\`prog__queue-item \${item.status === "processing" ? "prog__queue-item--active" : ""}\`}>
          <div className="prog__queue-icon">{item.icon}</div>
          <div className="prog__queue-info">
            <div className="prog__queue-name">{item.name}</div>
            <div className={\`prog__queue-status prog__queue-status--\${item.status}\`}>
              {item.status === "done" ? "Complete" : item.status === "processing" ? "Processing…" : "Waiting…"}
            </div>
          </div>
          {item.status === "done" && <span style={{ color: "${config.successColor}" }}>✓</span>}
        </div>
      ))}
    </div>
  );
}`,

    speedGauge: `
export default function ProgressSpeedGauge() {
  const pct: number = ${pct};
  const isHigh: boolean = pct > 75;
  const isMed: boolean = pct > 40;
  const gaugeColor: string = isHigh ? "${config.dangerColor}" : isMed ? "${config.warningColor}" : "${config.successColor}";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: 120, height: 70 }}>
        <svg viewBox="0 0 100 60" width={120} height={70}>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="${config.trackColor}" strokeWidth={10} strokeLinecap="round" />
          <path className="prog__gauge-fill" fill="none" strokeWidth={10} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
          <span style={{ fontSize: ${config.fontSize - 1}, fontWeight: 700, color: gaugeColor, letterSpacing: "0.1em" }}>
            {isHigh ? "CRITICAL" : isMed ? "NORMAL" : "IDLE"}
          </span>
        </div>
      </div>
      ${config.showValue ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>{pct}% load</span>` : ""}
    </div>
  );
}`,

    multiRing: `
export default function ProgressMultiRing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          {/* Outer ring — CPU */}
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.accentColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2), pct)}" strokeLinecap="round" className="prog__ring-fill" />
          {/* Middle ring — GPU */}
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.accentSecondary}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5), Math.round(pct * 0.72))}" strokeLinecap="round" className="prog__ring-fill" />
        </svg>
      </div>
      ${
        config.showLabel
          ? `<div style={{ display: "flex", gap: 12 }}>
        <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}><span style={{ color: "${config.accentColor}" }}>●</span> CPU</span>
        <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}><span style={{ color: "${config.accentSecondary}" }}>●</span> GPU</span>
      </div>`
          : ""
      }
    </div>
  );
}`,

    levelLadder: `
interface LevelStep {
  label: string;
  id: string;
  active: boolean;
  completed: boolean;
}

export default function ProgressLevelLadder() {
  const levels: LevelStep[] = [
    { label: "Arch-Mage", id: "L4", active: false, completed: false },
    { label: "Wizard", id: "L3", active: true, completed: false },
    { label: "Apprentice", id: "L2", active: false, completed: true },
    { label: "Novice", id: "L1", active: false, completed: true },
  ];
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div className="prog__ladder">
        {levels.map((lv: LevelStep, i: number) => (
          <div key={i} className={\`prog__ladder-step \${lv.active ? "prog__ladder-step--active" : ""} \${lv.completed ? "prog__ladder-step--done" : ""}\`}>
            <div className="prog__ladder-dot">{lv.completed && !lv.active ? "✓" : lv.id}</div>
            <span className="prog__ladder-label">{lv.label}{lv.active ? " (Active)" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    iconPath: `
interface Badge {
  icon: string;
  earned: boolean;
  label: string;
}

export default function ProgressIconPath() {
  const badges: Badge[] = [
    { icon: "⭐", earned: true, label: "Explorer" },
    { icon: "🏆", earned: true, label: "Champion" },
    { icon: "🎖", earned: false, label: "Legend" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 280 }}>
        {badges.map((badge: Badge, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < badges.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: badge.earned ? 1 : 0.35 }}>
              <span style={{ fontSize: 22 }}>{badge.icon}</span>
              ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize - 2}, color: badge.earned ? "${config.accentSecondary}" : "${config.mutedColor}" }}>{badge.label}</span>` : ""}
            </div>
            {i < badges.length - 1 && <div className="prog__path-connector" />}
          </div>
        ))}
      </div>
      <span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>2 of 3 badges earned</span>
    </div>
  );
}`,

    donutThin: `
export default function ProgressDonutThin() {
  const sw: number = ${Math.max(2, Math.round(config.strokeWidth * 0.3))};
  const r: number = ${Math.round(config.ringSize / 2 - Math.max(2, config.strokeWidth * 0.3) / 2 - 2)};
  const circ: number = +(2 * Math.PI * r).toFixed(2);
  const offset: number = +(circ * (1 - ${pct} / 100)).toFixed(2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none" stroke="${config.trackColor}" strokeWidth={sw} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none" stroke="${config.accentTertiary}" strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="prog__ring-fill" />
        </svg>
        ${config.showValue ? `<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: ${config.fontSize + 1}, fontWeight: 700, color: "${config.accentTertiary}" }}>${pct}%</span></div>` : ""}
      </div>
      ${config.showLabel ? `<span style={{ fontSize: ${config.fontSize}, color: "${config.mutedColor}" }}>Sync progress</span>` : ""}
    </div>
  );
}`,

    conversionFunnel: `
interface FunnelStage {
  label: string;
  value: string;
  w: string;
}

export default function ProgressConversionFunnel() {
  const stages: FunnelStage[] = [
    { label: "Visitors", value: "10k", w: "100%" },
    { label: "Qualified", value: "4k", w: "78%" },
    { label: "Trial", value: "1k", w: "52%" },
    { label: "Sale", value: "200", w: "22%" },
  ];
  const opacities: number[] = [1, 0.75, 0.5, 0.3];
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 4, fontFamily: "sans-serif" }}>
      {stages.map((s: FunnelStage, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: s.w, height: 28, background: "${config.accentColor}", opacity: opacities[i], borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>{s.label} ({s.value})</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,

    workDistribution: `
interface BarItem {
  label: string;
  height: number;
  color: string;
}

export default function ProgressWorkDistribution() {
  const bars: BarItem[] = [
    { label: "To Do", height: 72, color: "${config.accentColor}" },
    { label: "Active", height: 28, color: "${config.accentTertiary}" },
    { label: "Done", height: 52, color: "${config.accentSecondary}" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 90 }}>
        {bars.map((bar: BarItem, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="prog__bar-track">
              <div className="prog__bar-fill" style={{ height: bar.height, background: bar.color }} />
            </div>
            ${config.showLabel ? `<span style={{ fontSize: 10, color: "${config.mutedColor}", textTransform: "uppercase", fontWeight: 600 }}>{bar.label}</span>` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}`,

    storageStack: `
interface StorageSegment {
  label: string;
  pct: number;
  color: string;
}

export default function ProgressStorageStack() {
  const segs: StorageSegment[] = [
    { label: "System", pct: 40, color: "${config.accentColor}" },
    { label: "Apps", pct: 30, color: "${config.accentTertiary}" },
    { label: "Media", pct: 15, color: "${config.accentSecondary}" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <div className="prog__storage-bar">
        {segs.map((s: StorageSegment, i: number) => <div key={i} style={{ height: "100%", width: s.pct + "%", background: s.color }} />)}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {segs.map((s: StorageSegment, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    taskProgress: `
export default function ProgressTaskProgress() {
  const tasks: number = ${Math.round((pct / 100) * 3)};
  return (
    <div style={{ width: "100%", maxWidth: 320, fontFamily: "sans-serif" }}>
      <div className="prog__card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: ${config.fontSize}, fontWeight: 600, color: "${config.labelColor}" }}>Data Migration</div>
            <div style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>Due Tomorrow</div>
          </div>
          <span>📋</span>
        </div>
        <div className="prog__track" style={{ marginTop: 12 }}>
          <div className="prog__fill" style={{ width: "${pct}%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: ${config.fontSize - 1}, color: "${config.accentColor}", fontWeight: 600 }}>{tasks}/3 Tasks</span>
          ${config.showValue ? `<span style={{ fontSize: ${config.fontSize - 1}, color: "${config.mutedColor}" }}>${pct}%</span>` : ""}
        </div>
      </div>
    </div>
  );
}`,
  };

  const body = variantTSX[config.variant] ?? variantTSX["linear"];

  return `import { useState } from "react";
import "./Progress.css";

${body.trim()}
`;
}

// ─── TSX + Tailwind ───────────────────────────────────────────────────────────

export function generateProgressTailwind(config: ProgressConfig): string {
  const pct = clampVal(config.value);
  const circ = (r: number) => +(2 * Math.PI * r).toFixed(2);
  const offset = (r: number, p: number) =>
    +(circ(r) * (1 - p / 100)).toFixed(2);

  // Pre-compute values needing JS logic
  const shadow = config.showShadow ? "0 4px 24px rgba(0,0,0,0.3)" : "none";

  const battColor =
    pct <= 25
      ? config.dangerColor
      : pct <= 50
        ? config.warningColor
        : config.successColor;

  const gaugeStroke =
    pct > 75
      ? config.dangerColor
      : pct > 40
        ? config.warningColor
        : config.successColor;

  // Baked font sizes
  const fsBase = config.fontSize;
  const fsLg = config.fontSize + 4;
  const fsSm = config.fontSize - 1;
  const fsXs = config.fontSize - 2;
  const fsMd = config.fontSize + 2;
  const fsRingLabel = config.fontSize + 1;

  const variantTailwind: Record<string, string> = {
    linear: `
export default function ProgressLinear() {
  const progVars: CSSProperties = {
    "--prog-accent":   "${config.accentColor}",
    "--prog-track":    "${config.trackColor}",
    "--prog-muted":    "${config.mutedColor}",
    "--prog-value":    "${config.valueColor}",
  } as CSSProperties;

  return (
    <div className="w-full max-w-[360px] flex flex-col gap-2 font-sans" style={progVars}>
      <div className="flex justify-between">
        ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Uploading assets…</span>` : ""}
        ${config.showValue ? `<span className="text-[${fsBase}px] text-[var(--prog-value)] font-semibold">${pct}%</span>` : ""}
      </div>
      <div className="w-full h-[${config.barHeight}px] bg-[var(--prog-track)] rounded-[${config.barHeight}px] overflow-hidden">
        <div
          className="h-full bg-[var(--prog-accent)] rounded-[${config.barHeight}px]${config.animated ? " transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]" : ""}"
          style={{ width: "${pct}%" }}
        />
      </div>
    </div>
  );
}`,

    ring: `
export default function ProgressRing() {
  const progVars: CSSProperties = {
    "--prog-accent": "${config.accentColor}",
    "--prog-track":  "${config.trackColor}",
    "--prog-muted":  "${config.mutedColor}",
  } as CSSProperties;

  const circVal: number = ${circ(40)};

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="relative" style={{ width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circVal} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round"
            className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="${config.accentColor}" strokeWidth={2.5} strokeLinecap="round"
            className="${config.animated ? "[animation:prog-spin_1s_linear_infinite]" : ""}">
            ${config.animated ? `<style>{\`@keyframes prog-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\`}</style>` : ""}
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Processing data</span>` : ""}
    </div>
  );
}`,

    segmented: `
export default function ProgressSegmented() {
  const progVars: CSSProperties = {
    "--prog-accent": "${config.accentColor}",
    "--prog-track":  "${config.trackColor}",
    "--prog-muted":  "${config.mutedColor}",
  } as CSSProperties;

  const total: number = 5;
  const filled: number = ${Math.round((pct / 100) * 5)};

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-[10px] font-sans" style={progVars}>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_: unknown, i: number) => {
          let cls = "flex-1 h-[${config.barHeight + 2}px] rounded-[4px]";
          if (i < filled) {
            cls += " bg-[var(--prog-accent)]";
          } else {
            cls += " bg-[var(--prog-track)]";
          }
          ${config.animated ? `cls += " transition-colors duration-[300ms]";` : ""}
          return <div key={i} className={cls} />;
        })}
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Batch: {filled} of {total}</span>` : ""}
    </div>
  );
}`,

    percentageRing: `
export default function ProgressPercentageRing() {
  const progVars: CSSProperties = {
    "--prog-accent-secondary": "${config.accentSecondary}",
    "--prog-track":            "${config.trackColor}",
    "--prog-label":            "${config.labelColor}",
    "--prog-muted":            "${config.mutedColor}",
  } as CSSProperties;

  const circVal: number = ${circ(40)};

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="relative" style={{ width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={40} fill="none"
            stroke="${config.accentSecondary}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circVal} strokeDashoffset={${offset(40, pct)}}
            strokeLinecap="round"
            className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
        ${
          config.showValue
            ? `<div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[${config.fontSize + 4}px] font-bold text-[var(--prog-label)]">${pct}%</span>
        </div>`
            : ""
        }
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Completion Rate</span>` : ""}
    </div>
  );
}`,

    rhythmWave: `
export default function ProgressRhythmWave() {
  const progVars: CSSProperties = {
    "--prog-accent":   "${config.accentColor}",
    "--prog-accent3":  "${config.accentTertiary}",
    "--prog-track":    "${config.trackColor}",
    "--prog-muted":    "${config.mutedColor}",
    "--prog-value":    "${config.valueColor}",
  } as CSSProperties;

  return (
    <div className="w-full max-w-[360px] flex flex-col gap-[10px] font-sans" style={progVars}>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Optimizing render pipeline…</span>` : ""}
      <div className="w-full relative overflow-hidden rounded-[${config.barHeight + 14}px] bg-[var(--prog-track)]" style={{ height: ${config.barHeight + 14} }}>
        <div
          className="h-full rounded-[${config.barHeight + 14}px] [background-size:200%_100%]${config.animated ? " [animation:prog-wave_2s_linear_infinite] transition-[width] duration-[600ms]" : ""}"
          style={{ width: "${pct}%", backgroundImage: "linear-gradient(90deg, ${config.accentColor} 0%, ${config.accentTertiary} 50%, ${config.accentColor} 100%)" }}
        />
        ${config.animated ? `<style>{\`@keyframes prog-wave { 0% { background-position: 200% 0; } 100% { background-position: 0% 0; } }\`}</style>` : ""}
      </div>
      ${config.showValue ? `<span className="text-[${fsBase}px] text-[var(--prog-value)] font-semibold">${pct}%</span>` : ""}
    </div>
  );
}`,

    powerNode: `
export default function ProgressPowerNode() {
  const progVars: CSSProperties = {
    "--prog-bg":      "${config.backgroundColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const battColor: string = "${battColor}";

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="flex items-center gap-3">
        <div className="relative flex items-stretch w-[72px] h-[34px] rounded-[6px] p-[3px] bg-[var(--prog-bg)]" style={{ border: "2px solid ${config.borderColor}" }}>
          <div
            className="h-full rounded-[3px]${config.animated ? " transition-[width,background] duration-[600ms]" : ""}"
            style={{ width: "${pct}%", background: battColor }}
          />
          <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-[4px] h-[14px] rounded-[0_2px_2px_0]" style={{ background: "${config.borderColor}" }} />
        </div>
        ${config.showValue ? `<span className="text-[${fsMd}px] font-bold" style={{ color: battColor }}>${pct}%</span>` : ""}
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">${pct <= 25 ? "Low Energy Mode" : pct <= 50 ? "Normal Mode" : "Charging"}</span>` : ""}
    </div>
  );
}`,

    verticalFill: `
export default function ProgressVerticalFill() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-accent3": "${config.accentTertiary}",
    "--prog-track":   "${config.trackColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-label":   "${config.labelColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  return (
    <div className="flex items-center gap-4 font-sans" style={progVars}>
      <div className="relative w-8 h-[120px] rounded-2xl p-1 border border-[var(--prog-border)] bg-[var(--prog-track)]">
        <div
          className="absolute bottom-1 left-1 right-1 rounded-xl min-h-[4px]${config.animated ? " [transition:height_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}"
          style={{ height: "calc(${pct}% - 8px)", backgroundImage: "linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary})" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        ${config.showValue ? `<span className="text-[${fsLg}px] font-bold text-[var(--prog-label)]">${pct}%</span>` : ""}
        ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Target</span>` : ""}
      </div>
    </div>
  );
}`,

    glassFluid: `
export default function ProgressGlassFluid() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-accent3": "${config.accentTertiary}",
    "--prog-track":   "${config.trackColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="relative w-14 h-32 rounded-[28px] overflow-hidden border-[3px] border-[var(--prog-border)] bg-[var(--prog-track)]">
        <div
          className="absolute bottom-0 left-0 w-full${config.animated ? " [transition:height_0.8s_cubic-bezier(0.4,0,0.2,1)]" : ""}"
          style={{ height: "${pct}%", backgroundImage: "linear-gradient(to top, ${config.accentColor}, ${config.accentTertiary})" }}
        >
          <div className="absolute -top-2 -left-[20%] w-[140%] h-4 rounded-[40%] bg-white/20${config.animated ? " [animation:prog-wave-rot_8s_linear_infinite]" : ""}">
            ${config.animated ? `<style>{\`@keyframes prog-wave-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\`}</style>` : ""}
          </div>
        </div>
        ${
          config.showValue
            ? `<div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[${fsSm}px] font-bold text-white mix-blend-overlay">${pct}%</span>
        </div>`
            : ""
        }
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Storage used</span>` : ""}
    </div>
  );
}`,

    gamifiedXP: `
export default function ProgressGamifiedXP() {
  const progVars: CSSProperties = {
    "--prog-accent":   "${config.accentColor}",
    "--prog-accent2":  "${config.accentSecondary}",
    "--prog-track":    "${config.trackColor}",
    "--prog-label":    "${config.labelColor}",
    "--prog-muted":    "${config.mutedColor}",
  } as CSSProperties;

  const xp: number = ${Math.round((pct / 100) * 2000)};

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-[10px] font-sans" style={progVars}>
      <div className="flex justify-between items-center">
        ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Next Level</span>` : ""}
        <span className="bg-[var(--prog-accent)] text-white px-2 py-[2px] rounded text-[${fsSm}px] font-bold tracking-[0.05em]">LVL 42</span>
      </div>
      ${config.showValue ? `<div className="text-right"><span className="text-[${fsBase}px] text-[var(--prog-label)]">{xp.toLocaleString()} / 2,000 XP</span></div>` : ""}
      <div className="w-full h-[${config.barHeight + 4}px] bg-[var(--prog-track)] rounded-lg overflow-hidden">
        <div
          className="h-full rounded-lg${config.animated ? " transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]" : ""}"
          style={{ width: "${pct}%", backgroundImage: "linear-gradient(90deg, ${config.accentColor}, ${config.accentSecondary})" }}
        />
      </div>
    </div>
  );
}`,

    gpuCapacity: `
export default function ProgressGPUCapacity() {
  const progVars: CSSProperties = {
    "--prog-accent": "${config.accentColor}",
    "--prog-track":  "${config.trackColor}",
    "--prog-label":  "${config.labelColor}",
    "--prog-value":  "${config.valueColor}",
    "--prog-muted":  "${config.mutedColor}",
  } as CSSProperties;

  const used: string = "${((pct / 100) * 10).toFixed(1)}";
  const circVal: number = ${circ(30)};
  const sz: number = ${Math.round(config.ringSize * 0.75)};
  const cx: number = ${Math.round((config.ringSize * 0.75) / 2)};

  return (
    <div className="flex items-center gap-4 font-sans" style={progVars}>
      <div className="relative" style={{ width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cx} r={30} fill="none" stroke="${config.trackColor}" strokeWidth={${config.strokeWidth}} />
          <circle cx={cx} cy={cx} r={30} fill="none"
            stroke="${config.accentColor}" strokeWidth={${config.strokeWidth}}
            strokeDasharray={circVal} strokeDashoffset={${offset(30, pct)}}
            strokeLinecap="round"
            className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[${fsXs}px] font-bold text-[var(--prog-value)]">GPU</span>
        </div>
      </div>
      <div className="flex flex-col gap-[2px]">
        ${config.showValue ? `<span className="text-[${fsLg}px] font-bold text-[var(--prog-label)]">{used} GB</span>` : ""}
        ${config.showLabel ? `<span className="text-[${fsSm}px] text-[var(--prog-muted)]">/ 10 GB Used</span>` : ""}
      </div>
    </div>
  );
}`,

    processQueue: `
interface QueueItem {
  name: string;
  status: "done" | "processing" | "waiting";
  icon: string;
}

export default function ProgressProcessQueue() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-track":   "${config.trackColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-label":   "${config.labelColor}",
    "--prog-muted":   "${config.mutedColor}",
    "--prog-success": "${config.successColor}",
  } as CSSProperties;

  const items: QueueItem[] = [
    { name: "hero_banner_v2.psd", status: "done", icon: "🖼" },
    { name: "brand_guidelines.pdf", status: "processing", icon: "📄" },
    { name: "icon_set_v3.zip", status: "waiting", icon: "📦" },
  ];

  return (
    <div className="w-full max-w-[360px] flex flex-col gap-2 font-sans" style={progVars}>
      {items.map((item: QueueItem, i: number) => {
        let cls = "flex items-center gap-3 px-3 py-[10px] rounded-[${Math.round(config.borderRadius * 0.7)}px] border border-[var(--prog-border)] bg-[var(--prog-track)]";
        if (item.status === "processing") cls += " !bg-[${config.accentColor}14] !border-[${config.accentColor}33]";
        return (
          <div key={i} className={cls}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 bg-[${config.accentColor}22]">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[${fsBase}px] text-[var(--prog-label)] font-medium truncate">{item.name}</div>
              <div className={\`text-[${fsSm}px] \${item.status === "done" ? "text-[var(--prog-success)]" : item.status === "processing" ? "text-[var(--prog-accent)]" : "text-[var(--prog-muted)]"}\`}>
                {item.status === "done" ? "Complete" : item.status === "processing" ? "Processing…" : "Waiting…"}
              </div>
            </div>
            {item.status === "done" && <span className="text-[var(--prog-success)]">✓</span>}
          </div>
        );
      })}
    </div>
  );
}`,

    speedGauge: `
export default function ProgressSpeedGauge() {
  const progVars: CSSProperties = {
    "--prog-track":   "${config.trackColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const pctVal: number = ${pct};
  const isHigh: boolean = pctVal > 75;
  const isMed: boolean = pctVal > 40;
  const gaugeColor: string = "${gaugeStroke}";

  return (
    <div className="flex flex-col items-center gap-2 font-sans" style={progVars}>
      <div className="relative w-[120px] h-[70px]">
        <svg viewBox="0 0 100 60" width={120} height={70}>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="${config.trackColor}" strokeWidth={10} strokeLinecap="round" />
          <path fill="none" strokeWidth={10} strokeLinecap="round"
            stroke={gaugeColor}
            className="${config.animated ? "[transition:all_0.6s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
        <div className="absolute bottom-0 w-full text-center">
          <span className="text-[${fsSm}px] font-bold tracking-[0.1em]" style={{ color: gaugeColor }}>
            {isHigh ? "CRITICAL" : isMed ? "NORMAL" : "IDLE"}
          </span>
        </div>
      </div>
      ${config.showValue ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">{pctVal}% load</span>` : ""}
    </div>
  );
}`,

    multiRing: `
export default function ProgressMultiRing() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-accent2": "${config.accentSecondary}",
    "--prog-track":   "${config.trackColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="relative" style={{ width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2)}} fill="none" stroke="${config.accentColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}}
            strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2), pct)}"
            strokeLinecap="round" className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.trackColor}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={${Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5)}} fill="none" stroke="${config.accentSecondary}" strokeWidth={${Math.round(config.strokeWidth * 0.6)}}
            strokeDasharray="${circ(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5))}" strokeDashoffset="${offset(Math.round(config.ringSize / 2 - config.strokeWidth / 2 - 2 - config.strokeWidth * 1.5), Math.round(pct * 0.72))}"
            strokeLinecap="round" className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
      </div>
      ${
        config.showLabel
          ? `<div className="flex gap-3">
        <span className="text-[${fsSm}px] text-[var(--prog-muted)]"><span className="text-[var(--prog-accent)]">●</span> CPU</span>
        <span className="text-[${fsSm}px] text-[var(--prog-muted)]"><span className="text-[var(--prog-accent2)]">●</span> GPU</span>
      </div>`
          : ""
      }
    </div>
  );
}`,

    levelLadder: `
interface LevelStep {
  label: string;
  id: string;
  active: boolean;
  completed: boolean;
}

export default function ProgressLevelLadder() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-track":   "${config.trackColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-label":   "${config.labelColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const levels: LevelStep[] = [
    { label: "Arch-Mage", id: "L4", active: false, completed: false },
    { label: "Wizard", id: "L3", active: true, completed: false },
    { label: "Apprentice", id: "L2", active: false, completed: true },
    { label: "Novice", id: "L1", active: false, completed: true },
  ];

  return (
    <div className="font-sans" style={progVars}>
      <div className="relative flex flex-col gap-[2px] pl-4 before:content-[''] before:absolute before:left-[10px] before:top-1 before:bottom-1 before:w-[2px] before:rounded-sm before:bg-[var(--prog-border)]">
        {levels.map((lv: LevelStep, i: number) => {
          let cls = "flex items-center gap-[10px] py-2 pr-3 pl-1 rounded-lg";
          if (lv.active) cls += " bg-[${config.accentColor}18]";
          else if (!lv.completed) cls += " opacity-45";
          return (
            <div key={i} className={cls}>
              <div className={\`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold z-[1] \${lv.active ? "bg-[var(--prog-accent)] text-white" : lv.completed ? "bg-[${config.accentColor}44] text-[var(--prog-accent)]" : "bg-[var(--prog-track)] text-[var(--prog-muted)]"}\`}>
                {lv.completed && !lv.active ? "✓" : lv.id}
              </div>
              <span className={\`text-[${fsBase}px] \${lv.active ? "text-[var(--prog-accent)] font-semibold" : "text-[var(--prog-label)]"}\`}>
                {lv.label}{lv.active ? " (Active)" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,

    iconPath: `
interface Badge {
  icon: string;
  earned: boolean;
  label: string;
}

export default function ProgressIconPath() {
  const progVars: CSSProperties = {
    "--prog-accent2": "${config.accentSecondary}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const badges: Badge[] = [
    { icon: "⭐", earned: true, label: "Explorer" },
    { icon: "🏆", earned: true, label: "Champion" },
    { icon: "🎖", earned: false, label: "Legend" },
  ];

  return (
    <div className="flex flex-col gap-3 items-center font-sans" style={progVars}>
      <div className="flex items-center w-full max-w-[280px]">
        {badges.map((badge: Badge, i: number) => (
          <div key={i} className={\`flex items-center \${i < badges.length - 1 ? "flex-1" : ""}\`}>
            <div className={\`flex flex-col items-center gap-1 \${badge.earned ? "opacity-100" : "opacity-35"}\`}>
              <span style={{ fontSize: 22 }}>{badge.icon}</span>
              ${config.showLabel ? `<span className={\`text-[${config.fontSize - 2}px] \${badge.earned ? "text-[var(--prog-accent2)]" : "text-[var(--prog-muted)]"}\`}>{badge.label}</span>` : ""}
            </div>
            {i < badges.length - 1 && (
              <div className="flex-1 h-[2px] mx-2" style={{ backgroundImage: "repeating-linear-gradient(90deg, ${config.accentSecondary} 0, ${config.accentSecondary} 5px, transparent 5px, transparent 10px)" }} />
            )}
          </div>
        ))}
      </div>
      <span className="text-[${fsBase}px] text-[var(--prog-muted)]">2 of 3 badges earned</span>
    </div>
  );
}`,

    donutThin: `
export default function ProgressDonutThin() {
  const progVars: CSSProperties = {
    "--prog-accent3": "${config.accentTertiary}",
    "--prog-track":   "${config.trackColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const sw: number = ${Math.max(2, Math.round(config.strokeWidth * 0.3))};
  const r: number = ${Math.round(config.ringSize / 2 - Math.max(2, config.strokeWidth * 0.3) / 2 - 2)};
  const circVal: number = +(2 * Math.PI * r).toFixed(2);
  const dashOffset: number = +(circVal * (1 - ${pct} / 100)).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-3 font-sans" style={progVars}>
      <div className="relative" style={{ width: ${config.ringSize}, height: ${config.ringSize} }}>
        <svg width={${config.ringSize}} height={${config.ringSize}} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none" stroke="${config.trackColor}" strokeWidth={sw} />
          <circle cx={${config.ringSize / 2}} cy={${config.ringSize / 2}} r={r} fill="none"
            stroke="${config.accentTertiary}" strokeWidth={sw}
            strokeDasharray={circVal} strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="${config.animated ? "[transition:stroke-dashoffset_0.7s_cubic-bezier(0.4,0,0.2,1)]" : ""}" />
        </svg>
        ${
          config.showValue
            ? `<div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[${fsRingLabel}px] font-bold text-[var(--prog-accent3)]">${pct}%</span>
        </div>`
            : ""
        }
      </div>
      ${config.showLabel ? `<span className="text-[${fsBase}px] text-[var(--prog-muted)]">Sync progress</span>` : ""}
    </div>
  );
}`,

    conversionFunnel: `
interface FunnelStage {
  label: string;
  value: string;
  w: string;
}

export default function ProgressConversionFunnel() {
  const progVars: CSSProperties = {
    "--prog-accent": "${config.accentColor}",
  } as CSSProperties;

  const stages: FunnelStage[] = [
    { label: "Visitors", value: "10k", w: "100%" },
    { label: "Qualified", value: "4k", w: "78%" },
    { label: "Trial", value: "1k", w: "52%" },
    { label: "Sale", value: "200", w: "22%" },
  ];
  const opacities: number[] = [1, 0.75, 0.5, 0.3];

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-1 font-sans" style={progVars}>
      {stages.map((s: FunnelStage, i: number) => (
        <div key={i} className="flex justify-center">
          <div
            className="h-7 rounded flex items-center justify-center bg-[var(--prog-accent)]"
            style={{ width: s.w, opacity: opacities[i] }}
          >
            <span className="text-[11px] text-white font-medium">{s.label} ({s.value})</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,

    workDistribution: `
interface BarItem {
  label: string;
  height: number;
  color: string;
}

export default function ProgressWorkDistribution() {
  const progVars: CSSProperties = {
    "--prog-track": "${config.trackColor}",
    "--prog-muted": "${config.mutedColor}",
  } as CSSProperties;

  const bars: BarItem[] = [
    { label: "To Do", height: 72, color: "${config.accentColor}" },
    { label: "Active", height: 28, color: "${config.accentTertiary}" },
    { label: "Done", height: 52, color: "${config.accentSecondary}" },
  ];

  return (
    <div className="flex flex-col gap-3 font-sans" style={progVars}>
      <div className="flex items-end gap-3 h-[90px]">
        {bars.map((bar: BarItem, i: number) => (
          <div key={i} className="flex flex-col items-center gap-[6px]">
            <div className="w-7 h-[90px] bg-[var(--prog-track)] rounded-t relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0${config.animated ? " transition-[height] duration-[600ms]" : ""}"
                style={{ height: bar.height, background: bar.color }}
              />
            </div>
            ${config.showLabel ? `<span className="text-[10px] text-[var(--prog-muted)] uppercase font-semibold">{bar.label}</span>` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}`,

    storageStack: `
interface StorageSegment {
  label: string;
  pct: number;
  color: string;
}

export default function ProgressStorageStack() {
  const progVars: CSSProperties = {
    "--prog-track": "${config.trackColor}",
    "--prog-muted": "${config.mutedColor}",
  } as CSSProperties;

  const segs: StorageSegment[] = [
    { label: "System", pct: 40, color: "${config.accentColor}" },
    { label: "Apps", pct: 30, color: "${config.accentTertiary}" },
    { label: "Media", pct: 15, color: "${config.accentSecondary}" },
  ];

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-[10px] font-sans" style={progVars}>
      <div className="w-full h-[${config.barHeight + 8}px] bg-[var(--prog-track)] rounded flex overflow-hidden">
        {segs.map((s: StorageSegment, i: number) => (
          <div key={i} style={{ width: s.pct + "%", background: s.color, height: "100%" }} />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {segs.map((s: StorageSegment, i: number) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-[${fsSm}px] text-[var(--prog-muted)]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    taskProgress: `
export default function ProgressTaskProgress() {
  const progVars: CSSProperties = {
    "--prog-accent":  "${config.accentColor}",
    "--prog-track":   "${config.trackColor}",
    "--prog-border":  "${config.borderColor}",
    "--prog-bg":      "${config.backgroundColor}",
    "--prog-label":   "${config.labelColor}",
    "--prog-muted":   "${config.mutedColor}",
  } as CSSProperties;

  const tasks: number = ${Math.round((pct / 100) * 3)};

  return (
    <div className="w-full max-w-[320px] font-sans" style={progVars}>
      <div
        className="p-4 bg-[var(--prog-bg)] border border-[var(--prog-border)] rounded-[${config.borderRadius}px]"
        ${config.showShadow ? `style={{ boxShadow: "${shadow}" }}` : ""}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[${fsBase}px] font-semibold text-[var(--prog-label)]">Data Migration</div>
            <div className="text-[${fsSm}px] text-[var(--prog-muted)]">Due Tomorrow</div>
          </div>
          <span>📋</span>
        </div>
        <div className="mt-3 w-full h-[${config.barHeight}px] bg-[var(--prog-track)] rounded-[${config.barHeight}px] overflow-hidden">
          <div
            className="h-full bg-[var(--prog-accent)] rounded-[${config.barHeight}px]${config.animated ? " transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]" : ""}"
            style={{ width: "${pct}%" }}
          />
        </div>
        <div className="flex justify-between mt-[6px]">
          <span className="text-[${fsSm}px] text-[var(--prog-accent)] font-semibold">{tasks}/3 Tasks</span>
          ${config.showValue ? `<span className="text-[${fsSm}px] text-[var(--prog-muted)]">${pct}%</span>` : ""}
        </div>
      </div>
    </div>
  );
}`,
  };

  const body = variantTailwind[config.variant] ?? variantTailwind["linear"];

  return `import { CSSProperties } from "react";

${body.trim()}
`;
}
