"use client";

// /app/playground/userTable/page.tsx

import { useState, useMemo } from "react";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import { UserTablePreview } from "@/components/playground/UserTablePreview";
import { UserTableControlPanel } from "@/components/playground/UserTableControlPanel";
import {
  UserTableConfig,
  darkUserTableConfig,
  UserTableMode,
  userTableModePresets,
} from "@/lib/userTableConfig";
import {
  generateUserTableCSS,
  generateUserTableJSX,
  generateUserTableTailwind,
  generateUserTableTSX,
} from "@/lib/generateUserTableCode";

export default function DataTablePlayground() {
  const [mode, setMode] = useState<UserTableMode>("dark");
  const [config, setConfig] = useState<UserTableConfig>(darkUserTableConfig);

  function handleChange(patch: Partial<UserTableConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: UserTableMode) {
    setMode(newMode);
    // Preserve behavioral / layout props that shouldn't reset on theme switch
    setConfig({
      ...userTableModePresets[newMode],
      density: config.density,
      tableWidth: config.tableWidth,
      borderRadius: config.borderRadius,
      showBulkActions: config.showBulkActions,
    });
  }

  function handleReset() {
    setConfig({
      ...userTableModePresets[mode],
      density: config.density,
      tableWidth: config.tableWidth,

      borderRadius: config.borderRadius,

      showBulkActions: config.showBulkActions,
    });
  }

  const jsxCode = useMemo(() => generateUserTableJSX(config), [config]);
  const cssCode = useMemo(() => generateUserTableCSS(config), [config]);
  const tsxCode = useMemo(() => generateUserTableTSX(config), [config]);
  const tailwindCode = useMemo(
    () => generateUserTableTailwind(config),
    [config],
  );
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Data Table"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · layout, density & features preserved"
      preview={<UserTablePreview config={config} />}
      controls={
        <UserTableControlPanel
          config={config}
          onChange={handleChange}
          onReset={handleReset}
          isDark={mode === "dark"}
        />
      }
      code={
        <CodePanel
          jsx={jsxCode}
          css={cssCode}
          tsx={tsxCode}
          tailwind={tailwindCode}
        />
      }
    />
  );
}
