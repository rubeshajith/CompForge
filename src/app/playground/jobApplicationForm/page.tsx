"use client";
// /app/playground/jobApplicationForm/page.tsx

import { useState, useMemo } from "react";
import {
  JobApplicationFormConfig,
  JobFormMode,
  jobFormModePresets,
  darkJobApplicationFormConfig,
} from "@/lib/jobApplicationFormConfig";

import { JobApplicationFormPreview } from "@/components/playground/JobApplicationFormPreview";
import { JobApplicationFormControlPanel } from "@/components/playground/JobApplicationFormControlPanel";
import { CodePanel } from "@/components/playground/CodePanel";
import { ResizablePlayground } from "@/components/playground/ResizablePlayground";
import {
  generateJobApplicationFormCSS,
  generateJobApplicationFormJSX,
  generateJobApplicationFormTailwind,
  generateJobApplicationFormTSX,
} from "@/lib/generateJobApplicationFormCode";

// Behavioral props that survive a theme switch / reset
const PRESERVED_KEYS: (keyof JobApplicationFormConfig)[] = [
  "jobTitle",
  "companyName",
  "jobDescription",
  "jobLocation",
  "jobType",
  "showLinkedIn",
  "showPortfolio",
  "showSalaryExpectation",
  "showStartDate",
  "showCoverLetter",
  "showPhoneField",
  "formLayout",
  "formWidth",
];

function pickPreserved(
  config: JobApplicationFormConfig,
): Partial<JobApplicationFormConfig> {
  return Object.fromEntries(
    PRESERVED_KEYS.map((k) => [k, config[k]]),
  ) as Partial<JobApplicationFormConfig>;
}

export default function JobApplicationFormPlayground() {
  const [mode, setMode] = useState<JobFormMode>("dark");
  const [config, setConfig] = useState<JobApplicationFormConfig>(
    darkJobApplicationFormConfig,
  );

  function handleChange(patch: Partial<JobApplicationFormConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleModeToggle(newMode: JobFormMode) {
    setMode(newMode);
    setConfig({ ...jobFormModePresets[newMode], ...pickPreserved(config) });
  }

  function handleReset() {
    setConfig({ ...jobFormModePresets[mode], ...pickPreserved(config) });
  }

  const jsxCode = useMemo(
    () => generateJobApplicationFormJSX(config),
    [config],
  );
  const cssCode = useMemo(
    () => generateJobApplicationFormCSS(config),
    [config],
  );
  const tsxCode = useMemo(
    () => generateJobApplicationFormTSX(config),
    [config],
  );
  const tailwindCode = useMemo(
    () => generateJobApplicationFormTailwind(config),
    [config],
  );
  const stageStyle =
    mode === "light"
      ? {
          background: "#f4f4f8",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }
      : undefined;

  return (
    <ResizablePlayground
      componentName="Job Application Form"
      mode={mode}
      onModeToggle={handleModeToggle}
      modeHint="Switching resets colors · job info & fields preserved"
      preview={<JobApplicationFormPreview config={config} />}
      controls={
        <JobApplicationFormControlPanel
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
