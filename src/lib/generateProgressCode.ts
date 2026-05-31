// ─────────────────────────────────────────────────────────────────────────────
// generateProgressCode.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { ProgressConfig } from "./progressConfig";

function clampVal(v: number) {
  return Math.max(0, Math.min(100, v));
}

// ─── JSX ─────────────────────────────────────────────────────────────────────

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
