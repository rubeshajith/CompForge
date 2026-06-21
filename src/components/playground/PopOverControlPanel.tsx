"use client";

import { useState, useMemo } from "react";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { PopoverConfig } from "@/lib/popOverConfig";
import { PopoverVariantId, POPOVER_VARIANTS } from "@/lib/popOverVariants";
import { debounce } from "@/utils/debounce";
import styles from "./ControlPanel.module.css";

interface Props {
  config: PopoverConfig;
  selectedVariant: PopoverVariantId;
  onVariantChange: (id: PopoverVariantId) => void;
  onChange: (patch: Partial<PopoverConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

// ── Pill ───────────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 7,
        border: "1px solid",
        borderColor: active ? "#7c6cfc" : "#2a2a38",
        background: active ? "#7c6cfc1a" : "transparent",
        color: active ? "#9d91fd" : "#5a5a72",
        fontSize: 11,
        fontFamily: "'DM Mono', monospace",
        cursor: "pointer",
        transition: "all 0.15s ease",
        letterSpacing: "0.04em",
        lineHeight: "1.6",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ── TextRow ────────────────────────────────────────────────────────────────

function TextRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      className={styles.row}
      style={{
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <span className={styles.label}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.3rem 0.5rem",
          fontFamily: "inherit",
          fontSize: "0.68rem",
          color: "var(--text-primary)",
          background: "var(--bg-4)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          outline: "none",
        }}
      />
    </div>
  );
}

// ── NumberRow ──────────────────────────────────────────────────────────────

function NumberRow({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 80,
          padding: "0.3rem 0.5rem",
          fontFamily: "inherit",
          fontSize: "0.68rem",
          color: "var(--text-primary)",
          background: "var(--bg-4)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          outline: "none",
          textAlign: "right",
        }}
      />
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{ height: 1, background: "var(--border)", margin: "0.15rem 0" }}
    />
  );
}

// ── Variant control panels ─────────────────────────────────────────────────

function BasicControls({
  local,
  update,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
}) {
  return (
    <Section title="Basic popover">
      <TextRow
        label="Heading"
        value={local.basicHeading}
        onChange={(v) => update("basicHeading", v)}
      />
      <TextRow
        label="Description"
        value={local.basicDescription}
        onChange={(v) => update("basicDescription", v)}
      />
      <ColorRow
        label="Icon background"
        value={local.basicIconBg}
        onChange={(v) => update("basicIconBg", v)}
        isDark={isDark}
/>
    </Section>
  );
}

function DropdownControls({
  local,
  update,
  updateModel,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
  updateModel: (
    i: number,
    field: keyof PopoverConfig["dtModels"][0],
    v: string,
  ) => void;
}) {
  return (
    <Section title="Dropdown transition">
      <ToggleRow
        label="Show stats panel"
        value={local.dtShowStats}
        onChange={(v) => update("dtShowStats", v)}
      />
      {local.dtModels.map((m, i) => (
        <div key={i}>
          <Divider />
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem",
              marginTop: "0.4rem",
            }}
          >
            Model {i + 1}
          </div>
          <TextRow
            label="Name"
            value={m.name}
            onChange={(v) => updateModel(i, "name", v)}
          />
          <TextRow
            label="Provider"
            value={m.provider}
            onChange={(v) => updateModel(i, "provider", v)}
          />
          <TextRow
            label="Context"
            value={m.context}
            onChange={(v) => updateModel(i, "context", v)}
          />
          <TextRow
            label="Price"
            value={m.price}
            onChange={(v) => updateModel(i, "price", v)}
          />
          <TextRow
            label="Latency"
            value={m.latency}
            onChange={(v) => updateModel(i, "latency", v)}
          />
        </div>
      ))}
    </Section>
  );
}

function StatusControls({
  local,
  update,
  updateDebounced,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
  updateDebounced: <K extends keyof PopoverConfig>(
    k: K,
    v: PopoverConfig[K],
  ) => void;
}) {
  return (
    <Section title="Training status">
      <TextRow
        label="Model name"
        value={local.statusModelName}
        onChange={(v) => update("statusModelName", v)}
      />
      <SliderRow
        label="Progress"
        value={local.statusProgress}
        min={0}
        max={100}
        unit="%"
        onChange={(v) => updateDebounced("statusProgress", v)}
        onChangeEnd={(v) => update("statusProgress", v)}
      />
      <TextRow
        label="Loss"
        value={local.statusLoss}
        onChange={(v) => update("statusLoss", v)}
      />
      <TextRow
        label="Accuracy"
        value={local.statusAccuracy}
        onChange={(v) => update("statusAccuracy", v)}
      />
      <TextRow
        label="Epoch"
        value={local.statusEpoch}
        onChange={(v) => update("statusEpoch", v)}
      />
      <ToggleRow
        label="Animate pulse"
        value={local.statusAnimatePulse}
        onChange={(v) => update("statusAnimatePulse", v)}
      />
    </Section>
  );
}

function UserCardControls({
  local,
  update,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
}) {
  return (
    <Section title="User card">
      <TextRow
        label="Avatar initial"
        value={local.userInitial}
        onChange={(v) =>
          update("userInitial", v.charAt(0).toUpperCase() || "A")
        }
      />
      <TextRow
        label="Name"
        value={local.userName}
        onChange={(v) => update("userName", v)}
      />
      <TextRow
        label="Role"
        value={local.userRole}
        onChange={(v) => update("userRole", v)}
      />
      <Divider />
      <TextRow
        label="Stat 1 label"
        value={local.userStat1Label}
        onChange={(v) => update("userStat1Label", v)}
      />
      <TextRow
        label="Stat 1 value"
        value={local.userStat1Value}
        onChange={(v) => update("userStat1Value", v)}
      />
      <Divider />
      <TextRow
        label="Stat 2 label"
        value={local.userStat2Label}
        onChange={(v) => update("userStat2Label", v)}
      />
      <TextRow
        label="Stat 2 value"
        value={local.userStat2Value}
        onChange={(v) => update("userStat2Value", v)}
      />
      <Divider />
      <TextRow
        label="Stat 3 label"
        value={local.userStat3Label}
        onChange={(v) => update("userStat3Label", v)}
      />
      <TextRow
        label="Stat 3 value"
        value={local.userStat3Value}
        onChange={(v) => update("userStat3Value", v)}
      />
    </Section>
  );
}

function MenuControls({
  local,
  update,
  updateDebounced,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
  updateDebounced: <K extends keyof PopoverConfig>(
    k: K,
    v: PopoverConfig[K],
  ) => void;
}) {
  return (
    <Section title="Nested menu">
      <ToggleRow
        label="Show Export item"
        value={local.menuShowExport}
        onChange={(v) => update("menuShowExport", v)}
      />
      <TextRow
        label="Export formats"
        value={local.menuExportFormats}
        onChange={(v) => update("menuExportFormats", v)}
        placeholder="ONNX, TensorRT, CoreML"
      />
      <TextRow
        label="Danger label"
        value={local.menuDangerLabel}
        onChange={(v) => update("menuDangerLabel", v)}
      />
      <SliderRow
        label="Item border radius"
        value={local.menuItemBorderRadius}
        min={0}
        max={12}
        unit="px"
        onChange={(v) => updateDebounced("menuItemBorderRadius", v)}
        onChangeEnd={(v) => update("menuItemBorderRadius", v)}
      />
    </Section>
  );
}

function NotifControls({
  local,
  update,
  updateNotif,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
  updateNotif: (
    i: number,
    field: "message" | "time" | "unread",
    v: string | boolean,
  ) => void;
}) {
  return (
    <Section title="Notifications">
      <ToggleRow
        label="Show unread dot"
        value={local.notifShowDot}
        onChange={(v) => update("notifShowDot", v)}
      />
      <ColorRow
        label="Dot color"
        value={local.notifDotColor}
        onChange={(v) => update("notifDotColor", v)}
        isDark={isDark}
/>
      {local.notifications.map((n, i) => (
        <div key={i}>
          <Divider />
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              margin: "0.4rem 0",
            }}
          >
            Notification {i + 1}
          </div>
          <TextRow
            label="Message"
            value={n.message}
            onChange={(v) => updateNotif(i, "message", v)}
          />
          <TextRow
            label="Time"
            value={n.time}
            onChange={(v) => updateNotif(i, "time", v)}
          />
          <ToggleRow
            label="Unread"
            value={n.unread}
            onChange={(v) => updateNotif(i, "unread", v)}
          />
        </div>
      ))}
    </Section>
  );
}

function CommandControls({
  local,
  update,
  updateCmd,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
  updateCmd: (i: number, field: "label" | "kbd", v: string) => void;
}) {
  return (
    <Section title="Command palette">
      <ToggleRow
        label="Show keyboard shortcuts"
        value={local.cmdShowKbd}
        onChange={(v) => update("cmdShowKbd", v)}
      />
      <ToggleRow
        label="Accent color on hover"
        value={local.cmdAccentOnHover}
        onChange={(v) => update("cmdAccentOnHover", v)}
      />
      {local.commands.map((cmd, i) => (
        <div key={i}>
          <Divider />
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              margin: "0.4rem 0",
            }}
          >
            Command {i + 1}
          </div>
          <TextRow
            label="Label"
            value={cmd.label}
            onChange={(v) => updateCmd(i, "label", v)}
          />
          <TextRow
            label="Shortcut"
            value={cmd.kbd}
            onChange={(v) => updateCmd(i, "kbd", v)}
          />
        </div>
      ))}
    </Section>
  );
}

function TokenControls({
  local,
  update,
}: {
  local: PopoverConfig;
  update: <K extends keyof PopoverConfig>(k: K, v: PopoverConfig[K]) => void;
}) {
  return (
    <Section title="Token breakdown">
      <TextRow
        label="Model name"
        value={local.tokModelName}
        onChange={(v) => update("tokModelName", v)}
      />
      <Divider />
      <NumberRow
        label="System tokens"
        value={local.tokSystemCount}
        min={0}
        max={99999}
        onChange={(v) => update("tokSystemCount", v)}
      />
      <NumberRow
        label="Prompt tokens"
        value={local.tokPromptCount}
        min={0}
        max={99999}
        onChange={(v) => update("tokPromptCount", v)}
      />
      <NumberRow
        label="Completion tokens"
        value={local.tokCompletionCount}
        min={0}
        max={99999}
        onChange={(v) => update("tokCompletionCount", v)}
      />
      <Divider />
      <ColorRow
        label="System bar"
        value={local.tokSystemColor}
        onChange={(v) => update("tokSystemColor", v)}
        isDark={isDark}
/>
      <ColorRow
        label="Prompt bar start"
        value={local.tokPromptColorStart}
        onChange={(v) => update("tokPromptColorStart", v)}
        isDark={isDark}
/>
      <ColorRow
        label="Prompt bar end"
        value={local.tokPromptColorEnd}
        onChange={(v) => update("tokPromptColorEnd", v)}
        isDark={isDark}
/>
      <ColorRow
        label="Completion bar start"
        value={local.tokCompletionColorStart}
        onChange={(v) => update("tokCompletionColorStart", v)}
        isDark={isDark}
/>
      <ColorRow
        label="Completion bar end"
        value={local.tokCompletionColorEnd}
        onChange={(v) => update("tokCompletionColorEnd", v)}
        isDark={isDark}
/>
      <ToggleRow
        label="Animate bars on open"
        value={local.tokAnimateBars}
        onChange={(v) => update("tokAnimateBars", v)}
      />
    </Section>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────

export function PopoverControlPanel({
  config,
  selectedVariant,
  onVariantChange,
  onChange,
  onReset,
  isDark = true,
}: Props) {
  const [local, setLocal] = useState(config);
  useMemo(() => setLocal(config), [config]);

  const debouncedChange = useMemo(
    () => debounce((patch: Partial<PopoverConfig>) => onChange(patch), 80),
    [onChange],
  );

  function update<K extends keyof PopoverConfig>(
    key: K,
    value: PopoverConfig[K],
  ) {
    setLocal((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value } as Partial<PopoverConfig>);
  }

  function updateDebounced<K extends keyof PopoverConfig>(
    key: K,
    value: PopoverConfig[K],
  ) {
    setLocal((prev) => ({ ...prev, [key]: value }));
    debouncedChange({ [key]: value } as Partial<PopoverConfig>);
  }

  function updateNotif(
    i: number,
    field: "message" | "time" | "unread",
    value: string | boolean,
  ) {
    const updated = local.notifications.map((n, idx) =>
      idx === i ? { ...n, [field]: value } : n,
    );
    update("notifications", updated);
  }

  function updateCmd(i: number, field: "label" | "kbd", value: string) {
    const updated = local.commands.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    );
    update("commands", updated);
  }

  function updateModel(
    i: number,
    field: keyof PopoverConfig["dtModels"][0],
    value: string,
  ) {
    const updated = local.dtModels.map((m, idx) =>
      idx === i ? { ...m, [field]: value } : m,
    );
    update("dtModels", updated);
  }

  function renderVariantControls() {
    switch (selectedVariant) {
      case "basic":
        return <BasicControls local={local} update={update} />;
      case "dropdown":
        return (
          <DropdownControls
            local={local}
            update={update}
            updateModel={updateModel}
          />
        );
      case "status":
        return (
          <StatusControls
            local={local}
            update={update}
            updateDebounced={updateDebounced}
          />
        );
      case "usercard":
        return <UserCardControls local={local} update={update} />;
      case "menu":
        return (
          <MenuControls
            local={local}
            update={update}
            updateDebounced={updateDebounced}
          />
        );
      case "notif":
        return (
          <NotifControls
            local={local}
            update={update}
            updateNotif={updateNotif}
          />
        );
      case "command":
        return (
          <CommandControls
            local={local}
            update={update}
            updateCmd={updateCmd}
          />
        );
      case "tokens":
        return <TokenControls local={local} update={update} />;
    }
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Variant Selector Pills ─────────────────────────────────────── */}
      <div
        style={{
          padding: "0.75rem 0.85rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)",
          }}
        >
          Variant
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {POPOVER_VARIANTS.map((v) => (
            <Pill
              key={v.id}
              active={selectedVariant === v.id}
              onClick={() => onVariantChange(v.id)}
            >
              {v.label}
            </Pill>
          ))}
        </div>
      </div>

      {/* ── Shared / Global ────────────────────────────────────────────── */}
      <Section title="Global">
        <ColorRow
          label="Accent color"
          value={local.accentColor}
          onChange={(v) => update("accentColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Gradient start"
          value={local.gradStart}
          onChange={(v) => update("gradStart", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Gradient end"
          value={local.gradEnd}
          onChange={(v) => update("gradEnd", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Surface"
          value={local.surfaceColor}
          onChange={(v) => update("surfaceColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={local.borderColor}
          onChange={(v) => update("borderColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={local.textColor}
          onChange={(v) => update("textColor", v)}
          isDark={isDark}
/>
        <ColorRow
          label="Text muted"
          value={local.textMutedColor}
          onChange={(v) => update("textMutedColor", v)}
          isDark={isDark}
/>
        <SliderRow
          label="Border radius"
          value={local.borderRadius}
          min={0}
          max={20}
          unit="px"
          onChange={(v) => updateDebounced("borderRadius", v)}
          onChangeEnd={(v) => update("borderRadius", v)}
        />
      </Section>

      {/* ── Variant-specific controls ──────────────────────────────────── */}
      {renderVariantControls()}
    </ControlPanelShell>
  );
}
