"use client";

// /components/playground/UserTableControlPanel.tsx

import { useMemo, useState } from "react";
import { UserTableConfig } from "@/lib/userTableConfig";
import {
  ControlPanelShell,
  Section,
  ColorRow,
  SliderRow,
  ToggleRow,
} from "@/components/ui/ControlHelpers";
import { debounce } from "@/utils/debounce";

interface Props {
  config: UserTableConfig;
  onChange: (patch: Partial<UserTableConfig>) => void;
  onReset: () => void;
  isDark?: boolean;
}

export function UserTableControlPanel({ config, onChange, onReset }: Props) {
  const [localConfig, setLocalConfig] = useState(config);

  // Keep local in sync when parent resets
  if (
    localConfig.backgroundColor !== config.backgroundColor ||
    localConfig.accentColor !== config.accentColor
  ) {
    setLocalConfig(config);
  }

  const debouncedOnChange = useMemo(() => debounce(onChange, 80), [onChange]);

  function handleSlider(key: keyof UserTableConfig, value: number) {
    const patch = { [key]: value } as Partial<UserTableConfig>;
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    debouncedOnChange(patch);
  }

  function handleImmediate(patch: Partial<UserTableConfig>) {
    setLocalConfig((prev) => ({ ...prev, ...patch }));
    onChange(patch);
  }

  return (
    <ControlPanelShell onReset={onReset}>
      {/* ── Layout ─────────────────────────────────── */}
      <Section title="Layout">
        <SliderRow
          label="Table Width"
          value={localConfig.tableWidth}
          min={480}
          max={1200}
          unit="px"
          onChange={(v) => handleSlider("tableWidth", v)}
          onChangeEnd={(v) => onChange({ tableWidth: v })}
        />
        <SliderRow
          label="Border Radius"
          value={localConfig.borderRadius}
          min={0}
          max={24}
          unit="px"
          onChange={(v) => handleSlider("borderRadius", v)}
          onChangeEnd={(v) => onChange({ borderRadius: v })}
        />
        <SliderRow
          label="Font Size"
          value={localConfig.fontSize}
          min={11}
          max={16}
          unit="px"
          onChange={(v) => handleSlider("fontSize", v)}
          onChangeEnd={(v) => onChange({ fontSize: v })}
        />
        {/* Density select */}
        <div className="row">
          <label className="label">Density</label>
          <select
            value={localConfig.density}
            onChange={(e) =>
              handleImmediate({
                density: e.target.value as UserTableConfig["density"],
              })
            }
            style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </Section>

      {/* ── Container ──────────────────────────────── */}
      <Section title="Container">
        <ColorRow
          label="Background"
          value={localConfig.backgroundColor}
          onChange={(v) => handleImmediate({ backgroundColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate({ borderColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Show Shadow"
          value={localConfig.showShadow}
          onChange={(v) => handleImmediate({ showShadow: v })}
        />
      </Section>

      {/* ── Header ─────────────────────────────────── */}
      <Section title="Header">
        <ColorRow
          label="Header Background"
          value={localConfig.headerBackground}
          onChange={(v) => handleImmediate({ headerBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Header Text"
          value={localConfig.headerTextColor}
          onChange={(v) => handleImmediate({ headerTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Header Border"
          value={localConfig.headerBorderColor}
          onChange={(v) => handleImmediate({ headerBorderColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Rows ───────────────────────────────────── */}
      <Section title="Rows">
        <ColorRow
          label="Row Background"
          value={localConfig.rowBackground}
          onChange={(v) => handleImmediate({ rowBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Row Hover"
          value={localConfig.rowHoverBackground}
          onChange={(v) => handleImmediate({ rowHoverBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Text"
          value={localConfig.rowTextColor}
          onChange={(v) => handleImmediate({ rowTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Subtext"
          value={localConfig.rowSubtextColor}
          onChange={(v) => handleImmediate({ rowSubtextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Divider"
          value={localConfig.rowDividerColor}
          onChange={(v) => handleImmediate({ rowDividerColor: v })}
          isDark={isDark}
/>
        <ToggleRow
          label="Striped Rows"
          value={localConfig.stripedRows}
          onChange={(v) => handleImmediate({ stripedRows: v })}
        />
        {localConfig.stripedRows && (
          <ColorRow
            label="Stripe Color"
            value={localConfig.rowStripeColor}
            onChange={(v) => handleImmediate({ rowStripeColor: v })}
            isDark={isDark}
/>
        )}
      </Section>

      {/* ── Avatar ─────────────────────────────────── */}
      <Section title="Avatar">
        <ColorRow
          label="Avatar Background"
          value={localConfig.avatarBackground}
          onChange={(v) => handleImmediate({ avatarBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Avatar Text"
          value={localConfig.avatarTextColor}
          onChange={(v) => handleImmediate({ avatarTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Avatar Size"
          value={localConfig.avatarSize}
          min={28}
          max={52}
          unit="px"
          onChange={(v) => handleSlider("avatarSize", v)}
          onChangeEnd={(v) => onChange({ avatarSize: v })}
        />
        <SliderRow
          label="Avatar Radius"
          value={localConfig.avatarBorderRadius}
          min={0}
          max={26}
          unit="px"
          onChange={(v) => handleSlider("avatarBorderRadius", v)}
          onChangeEnd={(v) => onChange({ avatarBorderRadius: v })}
        />
      </Section>

      {/* ── Role Badges ────────────────────────────── */}
      <Section title="Role Badges">
        <ColorRow
          label="Admin Background"
          value={localConfig.adminBadgeBackground}
          onChange={(v) => handleImmediate({ adminBadgeBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Admin Text"
          value={localConfig.adminBadgeTextColor}
          onChange={(v) => handleImmediate({ adminBadgeTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Editor Background"
          value={localConfig.editorBadgeBackground}
          onChange={(v) => handleImmediate({ editorBadgeBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Editor Text"
          value={localConfig.editorBadgeTextColor}
          onChange={(v) => handleImmediate({ editorBadgeTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Viewer Background"
          value={localConfig.viewerBadgeBackground}
          onChange={(v) => handleImmediate({ viewerBadgeBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Viewer Text"
          value={localConfig.viewerBadgeTextColor}
          onChange={(v) => handleImmediate({ viewerBadgeTextColor: v })}
          isDark={isDark}
/>
        <SliderRow
          label="Badge Radius"
          value={localConfig.badgeBorderRadius}
          min={0}
          max={12}
          unit="px"
          onChange={(v) => handleSlider("badgeBorderRadius", v)}
          onChangeEnd={(v) => onChange({ badgeBorderRadius: v })}
        />
      </Section>

      {/* ── Status Pills ───────────────────────────── */}
      <Section title="Status Pills">
        <ColorRow
          label="Active Background"
          value={localConfig.activeBackground}
          onChange={(v) => handleImmediate({ activeBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Text"
          value={localConfig.activeTextColor}
          onChange={(v) => handleImmediate({ activeTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Dot"
          value={localConfig.activeDotColor}
          onChange={(v) => handleImmediate({ activeDotColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Inactive Background"
          value={localConfig.inactiveBackground}
          onChange={(v) => handleImmediate({ inactiveBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Inactive Text"
          value={localConfig.inactiveTextColor}
          onChange={(v) => handleImmediate({ inactiveTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Pending Background"
          value={localConfig.pendingBackground}
          onChange={(v) => handleImmediate({ pendingBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Pending Text"
          value={localConfig.pendingTextColor}
          onChange={(v) => handleImmediate({ pendingTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Expanded Row ───────────────────────────── */}
      <Section title="Expanded Row">
        <ColorRow
          label="Expanded Background"
          value={localConfig.expandedBackground}
          onChange={(v) => handleImmediate({ expandedBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Accent Border"
          value={localConfig.expandedAccentBorder}
          onChange={(v) => handleImmediate({ expandedAccentBorder: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Expanded Text"
          value={localConfig.expandedTextColor}
          onChange={(v) => handleImmediate({ expandedTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Pagination ─────────────────────────────── */}
      <Section title="Pagination">
        <ColorRow
          label="Pagination Background"
          value={localConfig.paginationBackground}
          onChange={(v) => handleImmediate({ paginationBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Background"
          value={localConfig.paginationActiveBackground}
          onChange={(v) => handleImmediate({ paginationActiveBackground: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Active Text"
          value={localConfig.paginationActiveTextColor}
          onChange={(v) => handleImmediate({ paginationActiveTextColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Page Text"
          value={localConfig.paginationTextColor}
          onChange={(v) => handleImmediate({ paginationTextColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Accent & Interactive ───────────────────── */}
      <Section title="Accent & Interactive">
        <ColorRow
          label="Accent Color"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Checkbox Color"
          value={localConfig.checkboxColor}
          onChange={(v) => handleImmediate({ checkboxColor: v })}
          isDark={isDark}
/>
        <ColorRow
          label="Chevron Color"
          value={localConfig.chevronColor}
          onChange={(v) => handleImmediate({ chevronColor: v })}
          isDark={isDark}
/>
      </Section>

      {/* ── Summary Cards ──────────────────────────── */}
      <Section title="Summary Cards">
        <ToggleRow
          label="Show Summary Cards"
          value={localConfig.showSummaryCards}
          onChange={(v) => handleImmediate({ showSummaryCards: v })}
        />
        {localConfig.showSummaryCards && (
          <>
            <ColorRow
              label="Card Background"
              value={localConfig.summaryCardBackground}
              onChange={(v) => handleImmediate({ summaryCardBackground: v })}
              isDark={isDark}
/>
            <ColorRow
              label="Card Border"
              value={localConfig.summaryCardBorderColor}
              onChange={(v) => handleImmediate({ summaryCardBorderColor: v })}
              isDark={isDark}
/>
            <ColorRow
              label="Icon Color"
              value={localConfig.summaryCardIconColor}
              onChange={(v) => handleImmediate({ summaryCardIconColor: v })}
              isDark={isDark}
/>
          </>
        )}
      </Section>

      {/* ── Features ───────────────────────────────── */}
      <Section title="Features">
        <ToggleRow
          label="Expandable Rows"
          value={localConfig.showExpandableRows}
          onChange={(v) => handleImmediate({ showExpandableRows: v })}
        />
        <ToggleRow
          label="Bulk Actions"
          value={localConfig.showBulkActions}
          onChange={(v) => handleImmediate({ showBulkActions: v })}
        />
        <ToggleRow
          label="Search Bar"
          value={localConfig.showSearch}
          onChange={(v) => handleImmediate({ showSearch: v })}
        />
        <ToggleRow
          label="Animate Rows"
          value={localConfig.animateRows}
          onChange={(v) => handleImmediate({ animateRows: v })}
        />
        <ToggleRow
          label="Striped Rows"
          value={localConfig.stripedRows}
          onChange={(v) => handleImmediate({ stripedRows: v })}
        />
      </Section>
    </ControlPanelShell>
  );
}
