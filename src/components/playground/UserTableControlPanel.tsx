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
        />
        <ColorRow
          label="Border"
          value={localConfig.borderColor}
          onChange={(v) => handleImmediate({ borderColor: v })}
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
        />
        <ColorRow
          label="Header Text"
          value={localConfig.headerTextColor}
          onChange={(v) => handleImmediate({ headerTextColor: v })}
        />
        <ColorRow
          label="Header Border"
          value={localConfig.headerBorderColor}
          onChange={(v) => handleImmediate({ headerBorderColor: v })}
        />
      </Section>

      {/* ── Rows ───────────────────────────────────── */}
      <Section title="Rows">
        <ColorRow
          label="Row Background"
          value={localConfig.rowBackground}
          onChange={(v) => handleImmediate({ rowBackground: v })}
        />
        <ColorRow
          label="Row Hover"
          value={localConfig.rowHoverBackground}
          onChange={(v) => handleImmediate({ rowHoverBackground: v })}
        />
        <ColorRow
          label="Text"
          value={localConfig.rowTextColor}
          onChange={(v) => handleImmediate({ rowTextColor: v })}
        />
        <ColorRow
          label="Subtext"
          value={localConfig.rowSubtextColor}
          onChange={(v) => handleImmediate({ rowSubtextColor: v })}
        />
        <ColorRow
          label="Divider"
          value={localConfig.rowDividerColor}
          onChange={(v) => handleImmediate({ rowDividerColor: v })}
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
          />
        )}
      </Section>

      {/* ── Avatar ─────────────────────────────────── */}
      <Section title="Avatar">
        <ColorRow
          label="Avatar Background"
          value={localConfig.avatarBackground}
          onChange={(v) => handleImmediate({ avatarBackground: v })}
        />
        <ColorRow
          label="Avatar Text"
          value={localConfig.avatarTextColor}
          onChange={(v) => handleImmediate({ avatarTextColor: v })}
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
        />
        <ColorRow
          label="Admin Text"
          value={localConfig.adminBadgeTextColor}
          onChange={(v) => handleImmediate({ adminBadgeTextColor: v })}
        />
        <ColorRow
          label="Editor Background"
          value={localConfig.editorBadgeBackground}
          onChange={(v) => handleImmediate({ editorBadgeBackground: v })}
        />
        <ColorRow
          label="Editor Text"
          value={localConfig.editorBadgeTextColor}
          onChange={(v) => handleImmediate({ editorBadgeTextColor: v })}
        />
        <ColorRow
          label="Viewer Background"
          value={localConfig.viewerBadgeBackground}
          onChange={(v) => handleImmediate({ viewerBadgeBackground: v })}
        />
        <ColorRow
          label="Viewer Text"
          value={localConfig.viewerBadgeTextColor}
          onChange={(v) => handleImmediate({ viewerBadgeTextColor: v })}
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
        />
        <ColorRow
          label="Active Text"
          value={localConfig.activeTextColor}
          onChange={(v) => handleImmediate({ activeTextColor: v })}
        />
        <ColorRow
          label="Active Dot"
          value={localConfig.activeDotColor}
          onChange={(v) => handleImmediate({ activeDotColor: v })}
        />
        <ColorRow
          label="Inactive Background"
          value={localConfig.inactiveBackground}
          onChange={(v) => handleImmediate({ inactiveBackground: v })}
        />
        <ColorRow
          label="Inactive Text"
          value={localConfig.inactiveTextColor}
          onChange={(v) => handleImmediate({ inactiveTextColor: v })}
        />
        <ColorRow
          label="Pending Background"
          value={localConfig.pendingBackground}
          onChange={(v) => handleImmediate({ pendingBackground: v })}
        />
        <ColorRow
          label="Pending Text"
          value={localConfig.pendingTextColor}
          onChange={(v) => handleImmediate({ pendingTextColor: v })}
        />
      </Section>

      {/* ── Expanded Row ───────────────────────────── */}
      <Section title="Expanded Row">
        <ColorRow
          label="Expanded Background"
          value={localConfig.expandedBackground}
          onChange={(v) => handleImmediate({ expandedBackground: v })}
        />
        <ColorRow
          label="Accent Border"
          value={localConfig.expandedAccentBorder}
          onChange={(v) => handleImmediate({ expandedAccentBorder: v })}
        />
        <ColorRow
          label="Expanded Text"
          value={localConfig.expandedTextColor}
          onChange={(v) => handleImmediate({ expandedTextColor: v })}
        />
      </Section>

      {/* ── Pagination ─────────────────────────────── */}
      <Section title="Pagination">
        <ColorRow
          label="Pagination Background"
          value={localConfig.paginationBackground}
          onChange={(v) => handleImmediate({ paginationBackground: v })}
        />
        <ColorRow
          label="Active Background"
          value={localConfig.paginationActiveBackground}
          onChange={(v) => handleImmediate({ paginationActiveBackground: v })}
        />
        <ColorRow
          label="Active Text"
          value={localConfig.paginationActiveTextColor}
          onChange={(v) => handleImmediate({ paginationActiveTextColor: v })}
        />
        <ColorRow
          label="Page Text"
          value={localConfig.paginationTextColor}
          onChange={(v) => handleImmediate({ paginationTextColor: v })}
        />
      </Section>

      {/* ── Accent & Interactive ───────────────────── */}
      <Section title="Accent & Interactive">
        <ColorRow
          label="Accent Color"
          value={localConfig.accentColor}
          onChange={(v) => handleImmediate({ accentColor: v })}
        />
        <ColorRow
          label="Checkbox Color"
          value={localConfig.checkboxColor}
          onChange={(v) => handleImmediate({ checkboxColor: v })}
        />
        <ColorRow
          label="Chevron Color"
          value={localConfig.chevronColor}
          onChange={(v) => handleImmediate({ chevronColor: v })}
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
            />
            <ColorRow
              label="Card Border"
              value={localConfig.summaryCardBorderColor}
              onChange={(v) => handleImmediate({ summaryCardBorderColor: v })}
            />
            <ColorRow
              label="Icon Color"
              value={localConfig.summaryCardIconColor}
              onChange={(v) => handleImmediate({ summaryCardIconColor: v })}
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
