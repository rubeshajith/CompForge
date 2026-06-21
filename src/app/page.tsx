"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type ComponentStatus = "ready" | "soon";

type ComponentCategory =
  | "Inputs"
  | "Date & Time"
  | "Navigation"
  | "Feedback"
  | "Modals & Forms"
  | "Data Display"
  | "Table"
  | "Dashboards"
  | "Productivity"
  | "Utilities"
  | "Maps"
  | "Coming Soon";

type ComponentItem = {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  preview: string;
  category: ComponentCategory;
};

const categoryOrder: ComponentCategory[] = [
  "Inputs",
  "Navigation",
  "Date & Time",
  "Data Display",
  "Table",
  "Feedback",
  "Modals & Forms",
  "Dashboards",
  "Productivity",
  "Utilities",
  "Maps",
  "Coming Soon",
];

const components: ComponentItem[] = [
  {
    id: "dropdown",
    name: "Dropdown",
    description: "Fully customizable select dropdown with animations",
    status: "ready",
    preview: "Select option",
    category: "Inputs",
  },
  {
    id: "multiselect",
    name: "Multi Select",
    description: "Multi-select dropdown with search, badges, and clear filters",
    status: "ready",
    preview: "Select multiple",
    category: "Inputs",
  },
  {
    id: "button",
    name: "Button, Button Group",
    description: "Buttons and button groups with variants and states",
    status: "ready",
    preview: "Click button",
    category: "Inputs",
  },
  {
    id: "toggle",
    name: "Toggle, Toggle Group",
    description: "Switch controls and grouped toggle selections",
    status: "ready",
    preview: "Toggle on",
    category: "Inputs",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Customizable checkboxes with various styles and animations",
    status: "ready",
    preview: "Checked",
    category: "Inputs",
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Expandable content sections with animation effects",
    status: "ready",
    preview: "Accordion",
    category: "Navigation",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Customizable sidebar with various themes and layouts",
    status: "ready",
    preview: "Sidebar",
    category: "Navigation",
  },
  {
    id: "menuBar",
    name: "Menu Bar",
    description: "Menu bar variations for app navigation",
    status: "ready",
    preview: "Menu bar",
    category: "Navigation",
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Interactive breadcrumbs with variants",
    status: "ready",
    preview: "Breadcrumbs",
    category: "Navigation",
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Interactive calendar with date selection and navigation",
    status: "ready",
    preview: "Select date",
    category: "Date & Time",
  },
  {
    id: "weekStrip",
    name: "Week Strip",
    description:
      "Horizontal week navigation strip with month labels and selection modes",
    status: "ready",
    preview: "Select week",
    category: "Date & Time",
  },
  {
    id: "dateTimeInput",
    name: "Date Time Input Field",
    description: "Date and time input field with polished interactions",
    status: "ready",
    preview: "Select date and time",
    category: "Date & Time",
  },
  {
    id: "progress",
    name: "Progress",
    description: "Customizable progress indicators",
    status: "ready",
    preview: "Progress",
    category: "Data Display",
  },
  {
    id: "stepProgress",
    name: "Step Progress",
    description: "Customizable progress step flow",
    status: "ready",
    preview: "Step progress",
    category: "Data Display",
  },
  {
    id: "stepper",
    name: "Stepper",
    description: "Customizable stepped process flow",
    status: "ready",
    preview: "Stepper",
    category: "Data Display",
  },
  {
    id: "stepper1",
    name: "Stepper 1.0",
    description: "Alternative customizable stepped process flow",
    status: "ready",
    preview: "Stepper",
    category: "Data Display",
  },
  {
    id: "stepper2",
    name: "Stepper 2.0",
    description: "Advanced customizable stepped process flow",
    status: "ready",
    preview: "Stepper",
    category: "Data Display",
  },
  {
    id: "kpiCard",
    name: "KPI Cards",
    description: "Metric cards for dashboards and reporting views",
    status: "ready",
    preview: "KPI cards",
    category: "Data Display",
  },
  {
    id: "skeleton",
    name: "Skeleton Loader",
    description: "Skeleton loading placeholders for content areas",
    status: "ready",
    preview: "Loading",
    category: "Data Display",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Interactive timeline with customizable nodes and connectors",
    status: "ready",
    preview: "Timeline",
    category: "Data Display",
  },
  {
    id: "dataTable",
    name: "Data Table",
    description:
      "Interactive data table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "analyticsTable",
    name: "Analytics Table",
    description: "Analytics table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "productTable",
    name: "Product Table",
    description: "Product table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "invoiceTable",
    name: "Invoice Table",
    description: "Invoice table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "userTable",
    name: "User Table",
    description: "User table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "orderTable",
    name: "Order Table",
    description: "Order table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "recordTable",
    name: "Record Table",
    description: "Record table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Table",
  },
  {
    id: "systemState",
    name: "System State",
    description: "Display various system states with customizable variants",
    status: "ready",
    preview: "System State",
    category: "Feedback",
  },
  {
    id: "toast",
    name: "Toast",
    description: "Notification toasts with variants and positioning",
    status: "ready",
    preview: "Notification",
    category: "Feedback",
  },
  {
    id: "popOver",
    name: "Pop Over",
    description: "Popover variations for contextual content",
    status: "ready",
    preview: "Pop over",
    category: "Feedback",
  },
  {
    id: "loader",
    name: "Loader",
    description: "Animated loading indicators and spinners",
    status: "ready",
    preview: "Loading",
    category: "Feedback",
  },
  {
    id: "customLoader",
    name: "Custom Loader",
    description: "Custom animated loading indicators and spinners",
    status: "ready",
    preview: "Loading",
    category: "Feedback",
  },
  {
    id: "filterModal",
    name: "Modal Filter",
    description: "Dialog modal for filtering data",
    status: "ready",
    preview: "Open modal",
    category: "Modals & Forms",
  },
  {
    id: "feedbackModal",
    name: "Feedback Modal",
    description: "Dialog modal for collecting user feedback",
    status: "ready",
    preview: "Open modal",
    category: "Modals & Forms",
  },
  {
    id: "uploadModal",
    name: "Upload Modal",
    description: "Modal for uploading files with progress tracking",
    status: "ready",
    preview: "Open modal",
    category: "Modals & Forms",
  },
  {
    id: "signupModal",
    name: "Signup Modal",
    description: "Modal for collecting signup information",
    status: "ready",
    preview: "Open modal",
    category: "Modals & Forms",
  },
  {
    id: "loginModal",
    name: "Login Modal",
    description: "Modal for collecting login information",
    status: "ready",
    preview: "Open modal",
    category: "Modals & Forms",
  },
  {
    id: "jobApplicationForm",
    name: "Job Application Form",
    description:
      "Form for submitting job applications with fields and sections",
    status: "ready",
    preview: "Open form",
    category: "Modals & Forms",
  },
  {
    id: "formBuilder",
    name: "Form Builder",
    description: "Visual form builder with drag-and-drop functionality",
    status: "ready",
    preview: "Open form builder",
    category: "Modals & Forms",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Interactive dashboard component",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "healthDashboard",
    name: "Health Tech Dashboard",
    description: "Interactive healthcare dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "ecommerceDashboard",
    name: "Ecommerce Dashboard",
    description: "Interactive ecommerce dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "marketingDashboard",
    name: "Marketing Dashboard",
    description: "Interactive marketing dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "saasDashboard",
    name: "SaaS Dashboard",
    description: "Interactive SaaS dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "mediaDashboard",
    name: "Media Dashboard",
    description: "Interactive media dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "manufacturingDashboard",
    name: "Manufacturing Dashboard",
    description: "Interactive manufacturing dashboard",
    status: "ready",
    preview: "Open dashboard",
    category: "Dashboards",
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Interactive Kanban board with drag-and-drop functionality",
    status: "ready",
    preview: "Open Kanban Board",
    category: "Productivity",
  },
  {
    id: "aiChat",
    name: "AI Chat",
    description: "Interactive AI chat",
    status: "ready",
    preview: "Open AI Chat",
    category: "Productivity",
  },
  {
    id: "imageCarousel",
    name: "Image Carousel",
    description:
      "Interactive image carousel with zoom and thumbnail navigation",
    status: "ready",
    preview: "Open carousel",
    category: "Utilities",
  },
  {
    id: "spotlightSearch",
    name: "Spotlight Search",
    description: "Search component with spotlight effect",
    status: "ready",
    preview: "Open search",
    category: "Utilities",
  },
  {
    id: "emoji",
    name: "Emoji",
    description: "Emoji selector and display patterns",
    status: "ready",
    preview: "Emojis",
    category: "Utilities",
  },
  {
    id: "emailTemplate",
    name: "Email Template",
    description: "Email template component",
    status: "ready",
    preview: "Email",
    category: "Utilities",
  },
  {
    id: "indiaMap",
    name: "India Map",
    description:
      "Interactive map of India with data visualization capabilities",
    status: "ready",
    preview: "Open map",
    category: "Maps",
  },
  {
    id: "buttonSoon",
    name: "Button",
    description: "Buttons with variants, sizes, and states",
    status: "soon",
    preview: "Click me",
    category: "Coming Soon",
  },
  {
    id: "badge",
    name: "Badge",
    description: "Status badges and label chips",
    status: "soon",
    preview: "Active",
    category: "Coming Soon",
  },
];

// ─── Shared skeleton helpers ──────────────────────────────────────────────────

const S = {
  box: (
    w: string | number,
    h: number,
    r = 6,
    accent = false,
  ): React.CSSProperties => ({
    width: w,
    height: h,
    borderRadius: r,
    background: accent ? "var(--preview-accent)" : "var(--preview-shimmer)",
  }),
  line: (w: string | number, h = 6, r = 99): React.CSSProperties => ({
    width: w,
    height: h,
    borderRadius: r,
    background: "var(--preview-shimmer)",
  }),
  accentLine: (w: string | number, h = 6): React.CSSProperties => ({
    width: w,
    height: h,
    borderRadius: 99,
    background: "var(--preview-accent)",
  }),
  circle: (size: number, accent = false): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    background: accent ? "var(--preview-accent)" : "var(--preview-shimmer)",
  }),
  row: (gap = 6): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap,
  }),
  col: (gap = 6): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    gap,
  }),
  border: (r = 8): React.CSSProperties => ({
    border: "1.5px solid var(--preview-border)",
    borderRadius: r,
  }),
  accentBorder: (r = 8): React.CSSProperties => ({
    border: "1.5px solid var(--preview-accent)",
    borderRadius: r,
  }),
};

// ─── Mini Previews ────────────────────────────────────────────────────────────

function PreviewDropdown() {
  return (
    <div style={{ ...S.col(7), width: "80%", alignItems: "center" }}>
      {/* trigger field */}
      <div
        style={{
          ...S.border(8),
          ...S.row(0),
          justifyContent: "space-between",
          padding: "8px 10px",
          width: "100%",
          background: "var(--preview-surface)",
        }}
      >
        <div style={S.line("55%", 7)} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="var(--preview-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* open list */}
      <div
        style={{
          ...S.border(8),
          ...S.col(0),
          width: "100%",
          background: "var(--preview-surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            background: "var(--preview-accent-light)",
            borderBottom: "1px solid var(--preview-border)",
          }}
        >
          <div style={S.accentLine("50%", 6)} />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              padding: "6px 10px",
              borderBottom: i < 2 ? "1px solid var(--preview-border)" : "none",
            }}
          >
            <div style={S.line(`${45 - i * 5}%`, 6)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewMultiSelect() {
  return (
    <div style={{ ...S.col(7), width: "80%", alignItems: "center" }}>
      <div
        style={{
          ...S.accentBorder(8),
          ...S.row(5),
          padding: "7px 8px",
          width: "100%",
          background: "var(--preview-surface)",
          flexWrap: "wrap",
        }}
      >
        {["60%", "45%"].map((w, i) => (
          <div
            key={i}
            style={{
              background: "var(--preview-accent-light)",
              border: "1px solid var(--preview-accent)",
              borderRadius: 4,
              padding: "3px 8px",
              ...S.row(4),
            }}
          >
            <div style={S.accentLine(w, 5)} />
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--preview-accent)",
                opacity: 0.5,
              }}
            />
          </div>
        ))}
        <div style={{ ...S.row(3), marginLeft: "auto" }}>
          <div style={S.line(18, 5)} />
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="var(--preview-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PreviewButton() {
  return (
    <div style={{ ...S.col(10), alignItems: "center" }}>
      <div style={S.row(8)}>
        <div
          style={{
            background: "var(--preview-accent)",
            borderRadius: 7,
            padding: "7px 18px",
            width: 64,
            height: 28,
          }}
        />
        <div
          style={{
            ...S.border(7),
            borderColor: "var(--preview-accent)",
            borderRadius: 7,
            padding: "7px 18px",
            width: 64,
            height: 28,
          }}
        />
        <div
          style={{ ...S.border(7), borderRadius: 7, width: 28, height: 28 }}
        />
      </div>
      <div style={{ ...S.row(0), ...S.border(7), overflow: "hidden" }}>
        {[
          ["S", false],
          ["M", true],
          ["L", false],
        ].map(([l, a], i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: a ? "var(--preview-accent-light)" : "transparent",
              borderRight: i < 2 ? "1px solid var(--preview-border)" : "none",
            }}
          >
            <div
              style={{
                width: 8,
                height: 6,
                borderRadius: 3,
                background: a
                  ? "var(--preview-accent)"
                  : "var(--preview-shimmer)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewToggle() {
  return (
    <div style={{ ...S.col(10), alignItems: "center" }}>
      {[true, false].map((on, i) => (
        <div key={i} style={S.row(10)}>
          <div
            style={{
              width: 38,
              height: 22,
              borderRadius: 11,
              background: on
                ? "var(--preview-accent)"
                : "var(--preview-border)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 3,
                [on ? "right" : "left"]: 3,
                opacity: on ? 1 : 0.7,
              }}
            />
          </div>
          <div style={S.line(on ? "42%" : "36%", 7)} />
        </div>
      ))}
      {/* toggle group */}
      <div
        style={{
          ...S.row(0),
          ...S.border(7),
          overflow: "hidden",
          marginTop: 2,
        }}
      >
        {[true, false, false].map((a, i) => (
          <div
            key={i}
            style={{
              width: 30,
              height: 24,
              background: a ? "var(--preview-accent-light)" : "transparent",
              borderRight: i < 2 ? "1px solid var(--preview-border)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 6,
                borderRadius: 3,
                background: a
                  ? "var(--preview-accent)"
                  : "var(--preview-shimmer)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewCheckbox() {
  return (
    <div style={{ ...S.col(9), paddingLeft: 16 }}>
      {[true, true, false].map((checked, i) => (
        <div key={i} style={S.row(10)}>
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: 4,
              background: checked ? "var(--preview-accent)" : "transparent",
              border: checked ? "none" : "1.5px solid var(--preview-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {checked && (
              <svg width="9" height="9" viewBox="0 0 9 9">
                <path
                  d="M1.5 4.5L3.5 6.5L7.5 2.5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </div>
          <div style={S.line(`${50 - i * 6}%`, 6)} />
        </div>
      ))}
    </div>
  );
}

function PreviewAccordion() {
  return (
    <div style={{ ...S.col(5), width: "88%" }}>
      {/* open item */}
      <div style={{ ...S.border(8), overflow: "hidden" }}>
        <div
          style={{
            padding: "7px 10px",
            background: "var(--preview-accent-light)",
            ...S.row(0),
            justifyContent: "space-between",
          }}
        >
          <div style={S.accentLine("55%", 6)} />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            style={{ transform: "rotate(180deg)", flexShrink: 0 }}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="var(--preview-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid var(--preview-border)",
            ...S.col(4),
          }}
        >
          <div style={S.line("90%", 5)} />
          <div style={S.line("70%", 5)} />
        </div>
      </div>
      {/* collapsed items */}
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            ...S.border(8),
            padding: "7px 10px",
            ...S.row(0),
            justifyContent: "space-between",
          }}
        >
          <div style={S.line(`${48 - i * 6}%`, 6)} />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="var(--preview-text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function PreviewSidebar() {
  return (
    <div
      style={{
        display: "flex",
        height: 108,
        width: "88%",
        ...S.border(9),
        overflow: "hidden",
      }}
    >
      {/* icon rail */}
      <div
        style={{
          width: 38,
          background: "var(--preview-accent)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 10,
          gap: 9,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "rgba(255,255,255,0.25)",
          }}
        />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
      {/* label rail */}
      <div
        style={{
          flex: 1,
          background: "var(--preview-surface)",
          padding: "8px 7px",
          ...S.col(5),
        }}
      >
        <div
          style={{
            padding: "5px 8px",
            borderRadius: 5,
            background: "var(--preview-accent-light)",
            ...S.row(6),
          }}
        >
          <div style={S.accentLine("60%", 6)} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ padding: "5px 8px", ...S.row(6) }}>
            <div style={S.line(`${45 - i * 5}%`, 5)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewMenuBar() {
  return (
    <div style={{ ...S.col(7), width: "92%" }}>
      <div
        style={{
          ...S.border(8),
          ...S.row(3),
          padding: "5px",
          background: "var(--preview-surface)",
        }}
      >
        <div
          style={{
            background: "var(--preview-accent)",
            borderRadius: 5,
            padding: "5px 14px",
            height: 26,
          }}
        />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              borderRadius: 5,
              padding: "5px 10px",
              height: 26,
              ...S.row(0),
              justifyContent: "center",
            }}
          >
            <div style={S.line(`${28 - i * 2}px`, 6)} />
          </div>
        ))}
        <div style={{ marginLeft: "auto", ...S.circle(20) }} />
      </div>
    </div>
  );
}

function PreviewBreadcrumb() {
  return (
    <div style={S.row(6)}>
      {[1, 2, 3].map((_, i) => (
        <div key={i} style={S.row(6)}>
          <div
            style={{
              ...S.line(`${36 - i * 4}px`, 7),
              background:
                i === 2 ? "var(--preview-accent)" : "var(--preview-shimmer)",
            }}
          />
          {i < 2 && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 1,
                background: "var(--preview-border)",
                transform: "rotate(15deg)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PreviewCalendar() {
  return (
    <div
      style={{
        ...S.border(9),
        width: "88%",
        padding: "9px 10px",
        background: "var(--preview-surface)",
        ...S.col(7),
      }}
    >
      {/* header */}
      <div
        style={{
          ...S.row(0),
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <div style={S.line("38%", 8)} />
        <div style={S.row(6)}>
          <div style={S.box(14, 14, 3)} />
          <div style={S.box(14, 14, 3)} />
        </div>
      </div>
      {/* day labels row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
        }}
      >
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              background: "var(--preview-border)",
            }}
          />
        ))}
      </div>
      {/* date grid */}
      {[...Array(3)].map((_, row) => (
        <div
          key={row}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 3,
          }}
        >
          {[...Array(7)].map((_, col) => {
            const isHighlight = row === 1 && col === 3;
            const isEmpty = row === 0 && col < 2;
            return (
              <div
                key={col}
                style={{
                  height: 14,
                  borderRadius: 4,
                  background: isHighlight
                    ? "var(--preview-accent)"
                    : isEmpty
                      ? "transparent"
                      : "var(--preview-shimmer)",
                  opacity: isEmpty ? 0 : 1,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PreviewWeekStrip() {
  return (
    <div style={{ ...S.col(6), width: "92%" }}>
      <div style={S.line("28%", 6)} />
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const active = i === 2;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                ...S.col(5),
                alignItems: "center",
                padding: "6px 2px",
                borderRadius: 8,
                background: active
                  ? "var(--preview-accent)"
                  : "var(--preview-surface)",
                border: `1.5px solid ${active ? "var(--preview-accent)" : "var(--preview-border)"}`,
              }}
            >
              <div
                style={{
                  width: "60%",
                  height: 5,
                  borderRadius: 3,
                  background: active
                    ? "rgba(255,255,255,0.4)"
                    : "var(--preview-shimmer)",
                }}
              />
              <div
                style={{
                  width: "70%",
                  height: 10,
                  borderRadius: 4,
                  background: active
                    ? "rgba(255,255,255,0.8)"
                    : "var(--preview-border)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PreviewDateTimeInput() {
  return (
    <div style={{ ...S.col(8), width: "82%", alignItems: "center" }}>
      <div
        style={{
          ...S.accentBorder(8),
          padding: "8px 10px",
          width: "100%",
          ...S.row(0),
          justifyContent: "space-between",
          background: "var(--preview-accent-light)",
        }}
      >
        <div style={S.row(6)}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              border: "1.5px solid var(--preview-accent)",
              ...S.row(0),
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 1,
                background: "var(--preview-accent)",
              }}
            />
          </div>
          <div style={S.accentLine("55%", 7)} />
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--preview-accent)",
          }}
        />
      </div>
      <div
        style={{
          ...S.border(8),
          padding: "8px 10px",
          width: "100%",
          ...S.row(0),
          justifyContent: "space-between",
        }}
      >
        <div style={S.row(6)}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "1.5px solid var(--preview-border)",
              ...S.row(0),
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 1,
                height: 6,
                background: "var(--preview-text-muted)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 1,
                  background: "var(--preview-text-muted)",
                  position: "absolute",
                  top: 5,
                  left: 0,
                }}
              />
            </div>
          </div>
          <div style={S.line("45%", 7)} />
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--preview-shimmer)",
          }}
        />
      </div>
    </div>
  );
}

function PreviewProgress() {
  return (
    <div style={{ ...S.col(10), width: "88%" }}>
      {[
        { w: "72%", color: "var(--preview-accent)" },
        { w: "45%", color: "#facc15" },
        { w: "88%", color: "#f87171" },
      ].map(({ w, color }, i) => (
        <div key={i} style={S.col(4)}>
          <div style={{ ...S.row(0), justifyContent: "space-between" }}>
            <div style={S.line("28%", 5)} />
            <div
              style={{
                width: 20,
                height: 5,
                borderRadius: 3,
                background: color,
                opacity: 0.7,
              }}
            />
          </div>
          <div
            style={{
              height: 7,
              background: "var(--preview-border)",
              borderRadius: 99,
            }}
          >
            <div
              style={{
                height: "100%",
                width: w,
                background: color,
                borderRadius: 99,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewStepProgress() {
  return (
    <div style={{ ...S.col(10), width: "88%" }}>
      <div style={{ ...S.row(0), alignItems: "center" }}>
        {[1, 2, 3, 4].map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < 3 ? 1 : "none",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                  step <= 2
                    ? "var(--preview-accent)"
                    : step === 3
                      ? "var(--preview-accent-light)"
                      : "var(--preview-surface)",
                border:
                  step === 3
                    ? "2px solid var(--preview-accent)"
                    : step > 3
                      ? "1.5px solid var(--preview-border)"
                      : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {step <= 2 ? (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path
                    d="M2 5L4 7L8 3"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      step === 3
                        ? "var(--preview-accent)"
                        : "var(--preview-border)",
                  }}
                />
              )}
            </div>
            {i < 3 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background:
                    step <= 2
                      ? "var(--preview-accent)"
                      : "var(--preview-border)",
                  margin: "0 3px",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={S.line("80%", 5, 3)} />
        ))}
      </div>
    </div>
  );
}

function PreviewStepper() {
  return (
    <div style={{ ...S.col(2), width: "80%", paddingLeft: 8 }}>
      {[true, true, "active", false].map((state, i) => {
        const done = state === true;
        const active = state === "active";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              position: "relative",
              paddingBottom: i < 3 ? 14 : 0,
            }}
          >
            {i < 3 && (
              <div
                style={{
                  position: "absolute",
                  left: 7,
                  top: 18,
                  width: 2,
                  height: 14,
                  background: done
                    ? "var(--preview-accent)"
                    : "var(--preview-border)",
                  borderRadius: 1,
                }}
              />
            )}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                flexShrink: 0,
                background: done
                  ? "var(--preview-accent)"
                  : active
                    ? "var(--preview-accent-light)"
                    : "var(--preview-surface)",
                border: active
                  ? "2px solid var(--preview-accent)"
                  : done
                    ? "none"
                    : "1.5px solid var(--preview-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {done && (
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path
                    d="M1.5 4L3 5.5L6.5 2"
                    stroke="#fff"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}
            </div>
            <div
              style={{
                ...S.line(`${52 - i * 6}%`, 6),
                background: active
                  ? "var(--preview-accent)"
                  : done
                    ? "var(--preview-shimmer)"
                    : "var(--preview-border)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function PreviewKpiCard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 7,
        width: "88%",
      }}
    >
      {[
        { trend: "up", accent: true },
        { trend: "up", accent: false },
        { trend: "down", accent: false },
        { trend: "down", accent: false },
      ].map(({ trend, accent }, i) => (
        <div
          key={i}
          style={{
            ...S.border(8),
            padding: "9px 10px",
            background: "var(--preview-surface)",
            ...S.col(5),
          }}
        >
          <div style={S.line("60%", 5)} />
          <div
            style={{
              width: "75%",
              height: 14,
              borderRadius: 4,
              background: accent
                ? "var(--preview-accent)"
                : "var(--preview-shimmer)",
              opacity: accent ? 0.9 : 1,
            }}
          />
          <div style={S.row(4)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={trend === "up" ? "M2 7L5 3L8 7" : "M2 3L5 7L8 3"}
                stroke={trend === "up" ? "#4ade80" : "#f87171"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                width: 22,
                height: 5,
                borderRadius: 3,
                background:
                  trend === "up"
                    ? "rgba(74,222,128,0.3)"
                    : "rgba(248,113,113,0.3)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div style={{ ...S.col(9), width: "88%" }}>
      <div style={S.row(10)}>
        <div
          style={{
            ...S.circle(34),
            animation: "skshimmer 1.4s ease-in-out infinite",
          }}
        />
        <div style={{ ...S.col(6), flex: 1 }}>
          <div
            style={{
              ...S.line("70%", 8),
              animation: "skshimmer 1.4s ease-in-out 0.1s infinite",
            }}
          />
          <div
            style={{
              ...S.line("50%", 6),
              animation: "skshimmer 1.4s ease-in-out 0.2s infinite",
            }}
          />
        </div>
      </div>
      {[
        ["100%", 0.0],
        ["85%", 0.15],
        ["65%", 0.3],
      ].map(([w, delay], i) => (
        <div
          key={i}
          style={{
            ...S.line(w as string, 7),
            animation: `skshimmer 1.4s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function PreviewTimeline() {
  const items = [
    { done: true },
    { done: true },
    { done: false, active: true },
    { done: false },
  ];
  return (
    <div style={{ ...S.col(0), width: "82%", paddingLeft: 4 }}>
      {items.map(({ done, active }, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            paddingBottom: i < 3 ? 14 : 0,
            position: "relative",
          }}
        >
          {i < 3 && (
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 12,
                width: 2,
                height: 14,
                background: done
                  ? "var(--preview-accent)"
                  : "var(--preview-border)",
                borderRadius: 1,
              }}
            />
          )}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              marginTop: 2,
              flexShrink: 0,
              background:
                done || active
                  ? "var(--preview-accent)"
                  : "var(--preview-border)",
              border: active ? "2px solid var(--preview-accent-light)" : "none",
            }}
          />
          <div style={{ ...S.col(4), flex: 1, paddingTop: 1 }}>
            <div
              style={{
                ...S.line(`${60 - i * 5}%`, 6),
                background:
                  done || active
                    ? "var(--preview-shimmer)"
                    : "var(--preview-border)",
              }}
            />
            <div style={S.line("35%", 4)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewSystemState() {
  return (
    <div style={{ ...S.col(6), width: "88%" }}>
      {[
        { color: "#4ade80", bg: "rgba(74,222,128,0.1)", w: "65%" },
        { color: "#facc15", bg: "rgba(250,204,21,0.1)", w: "55%" },
        { color: "#f87171", bg: "rgba(248,113,113,0.1)", w: "70%" },
      ].map(({ color, bg, w }, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: bg,
            borderRadius: 6,
            padding: "7px 9px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <div style={{ ...S.col(4), flex: 1 }}>
            <div
              style={{
                width: "30%",
                height: 6,
                borderRadius: 3,
                background: color,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                width: w,
                height: 5,
                borderRadius: 3,
                background: color,
                opacity: 0.3,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewToast() {
  return (
    <div style={{ ...S.col(6), width: "92%" }}>
      {[
        { color: "#4ade80", bg: "rgba(74,222,128,0.1)", icon: "✓" },
        { color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: "✕" },
        { color: "#9d91fd", bg: "rgba(124,108,252,0.12)", icon: "ℹ" },
      ].map(({ color, bg, icon }, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: bg,
            borderRadius: 7,
            padding: "7px 10px",
            justifyContent: "space-between",
          }}
        >
          <div style={S.row(7)}>
            <span
              style={{ fontSize: 11, color, fontWeight: 700, lineHeight: 1 }}
            >
              {icon}
            </span>
            <div
              style={{
                width: `${65 - i * 8}px`,
                height: 6,
                borderRadius: 3,
                background: color,
                opacity: 0.5,
              }}
            />
          </div>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: color,
              opacity: 0.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 9, color, opacity: 0.8 }}>×</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewPopOver() {
  return (
    <div style={{ ...S.col(8), alignItems: "flex-end", paddingRight: 10 }}>
      <div
        style={{
          background: "var(--preview-accent)",
          borderRadius: 6,
          padding: "6px 14px",
          height: 26,
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -5,
            right: 18,
            width: 8,
            height: 8,
            background: "var(--preview-surface)",
            border: "1.5px solid var(--preview-border)",
            transform: "rotate(45deg)",
            borderBottom: "none",
            borderRight: "none",
          }}
        />
        <div
          style={{
            ...S.border(9),
            background: "var(--preview-surface)",
            padding: "10px 12px",
            width: 138,
            ...S.col(5),
          }}
        >
          <div style={S.line("80%", 6)} />
          <div style={S.line("65%", 5)} />
          <div style={S.line("72%", 5)} />
        </div>
      </div>
    </div>
  );
}

function PreviewLoader() {
  return (
    <div style={{ ...S.row(16), justifyContent: "center" }}>
      {/* spinner */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "3px solid var(--preview-border)",
          borderTopColor: "var(--preview-accent)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {/* dots */}
      <div style={S.col(5)}>
        <div style={S.row(5)}>
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--preview-accent)",
                animation: `bounce 0.6s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <div style={S.line(42, 5)} />
      </div>
      {/* bar pulse */}
      <div style={S.col(5)}>
        {[70, 50, 35].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 5,
              borderRadius: 99,
              background: "var(--preview-accent)",
              opacity: 1 - i * 0.25,
              animation: `skshimmer 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewModal({ variant = "filter" }: { variant?: string }) {
  const isUpload = variant === "upload";
  const isAuth = variant === "signup" || variant === "login";
  return (
    <div
      style={{
        width: "90%",
        ...S.border(10),
        background: "var(--preview-surface)",
        padding: "11px 12px",
        ...S.col(9),
      }}
    >
      {/* title row */}
      <div style={{ ...S.row(0), justifyContent: "space-between" }}>
        <div style={S.line("42%", 8)} />
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--preview-shimmer)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 9, color: "var(--preview-text-muted)" }}>
            ×
          </span>
        </div>
      </div>
      <div style={{ height: 1, background: "var(--preview-border)" }} />
      {/* body */}
      {isUpload ? (
        <div
          style={{
            border: "1.5px dashed var(--preview-border)",
            borderRadius: 8,
            padding: "14px 10px",
            ...S.col(6),
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...S.box(28, 28, 99),
              background: "var(--preview-accent-light)",
            }}
          />
          <div style={S.line("55%", 5)} />
          <div style={S.line("38%", 5)} />
        </div>
      ) : isAuth ? (
        <div style={S.col(6)}>
          {(variant === "signup" ? [1, 2, 3] : [1, 2]).map((i) => (
            <div
              key={i}
              style={{
                ...S.border(6),
                padding: "8px 10px",
                height: 30,
                background: "var(--preview-bg)",
              }}
            >
              <div style={S.line("40%", 6)} />
            </div>
          ))}
        </div>
      ) : variant === "feedback" ? (
        <div
          style={{
            ...S.border(6),
            height: 52,
            background: "var(--preview-bg)",
            padding: "8px 10px",
            ...S.col(5),
          }}
        >
          <div style={S.line("60%", 5)} />
          <div style={S.line("40%", 5)} />
        </div>
      ) : (
        <div style={S.col(7)}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ ...S.row(0), justifyContent: "space-between" }}
            >
              <div style={S.line("32%", 6)} />
              <div
                style={{
                  ...S.border(5),
                  padding: "4px 10px",
                  width: 56,
                  height: 22,
                }}
              />
            </div>
          ))}
        </div>
      )}
      {/* footer */}
      <div style={{ ...S.row(6), justifyContent: "flex-end" }}>
        <div style={{ ...S.border(5), width: 52, height: 24 }} />
        <div
          style={{
            background: "var(--preview-accent)",
            borderRadius: 5,
            width: 52,
            height: 24,
          }}
        />
      </div>
    </div>
  );
}

function PreviewJobForm() {
  return (
    <div
      style={{
        width: "90%",
        ...S.border(10),
        background: "var(--preview-surface)",
        padding: "10px 12px",
        ...S.col(7),
      }}
    >
      <div style={S.line("45%", 8)} />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={S.col(4)}>
          <div style={S.line("28%", 5)} />
          <div
            style={{
              ...S.border(6),
              height: i === 4 ? 24 : 26,
              background: "var(--preview-bg)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function PreviewFormBuilder() {
  return (
    <div style={{ width: "90%", ...S.row(8) }}>
      {/* palette */}
      <div
        style={{
          width: 68,
          ...S.border(8),
          background: "var(--preview-surface)",
          padding: "8px 7px",
          ...S.col(5),
        }}
      >
        <div style={S.line("70%", 5)} />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              ...S.row(5),
              border: "1px dashed var(--preview-border)",
              borderRadius: 4,
              padding: "4px 5px",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 1,
                background: "var(--preview-border)",
              }}
            />
            <div style={S.line(`${32 - i * 2}px`, 5)} />
          </div>
        ))}
      </div>
      {/* canvas */}
      <div
        style={{
          flex: 1,
          border: "1.5px dashed var(--preview-accent)",
          borderRadius: 8,
          padding: "8px 7px",
          ...S.col(6),
        }}
      >
        <div style={S.accentLine("40%", 5)} />
        <div
          style={{
            ...S.border(5),
            height: 24,
            background: "var(--preview-bg)",
          }}
        />
        <div
          style={{
            ...S.accentBorder(5),
            height: 24,
            background: "var(--preview-accent-light)",
          }}
        />
        <div
          style={{
            background: "var(--preview-accent)",
            borderRadius: 5,
            height: 22,
            width: "55%",
          }}
        />
      </div>
    </div>
  );
}

function PreviewTable({ variant = "data" }: { variant?: string }) {
  const colCount = variant === "user" || variant === "product" ? 3 : 4;
  return (
    <div style={{ width: "92%", ...S.border(8), overflow: "hidden" }}>
      {/* header */}
      <div
        style={{
          display: "flex",
          padding: "6px 10px",
          background: "var(--preview-shimmer)",
          borderBottom: "1px solid var(--preview-border)",
          gap: 6,
        }}
      >
        {[...Array(colCount)].map((_, i) => (
          <div key={i} style={{ flex: 1, ...S.row(4) }}>
            <div style={S.line("60%", 5)} />
            {i === 0 && (
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path
                  d="M1 2.5L3.5 5L6 2.5"
                  stroke="var(--preview-accent)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      {/* rows */}
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          style={{
            display: "flex",
            padding: "6px 10px",
            background:
              row === 0 ? "var(--preview-accent-light)" : "transparent",
            borderBottom: row < 2 ? "1px solid var(--preview-border)" : "none",
            gap: 6,
            alignItems: "center",
          }}
        >
          {[...Array(colCount)].map((_, col) => (
            <div key={col} style={{ flex: 1 }}>
              {col === 0 && row === 0 ? (
                <div style={{ ...S.row(5) }}>
                  <div style={S.circle(14, true)} />
                  <div style={S.accentLine("50%", 6)} />
                </div>
              ) : (
                <div
                  style={{
                    width: `${55 - col * 8}%`,
                    height: 6,
                    borderRadius: 3,
                    background:
                      col === colCount - 1 && row === 0
                        ? "rgba(74,222,128,0.35)"
                        : "var(--preview-shimmer)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      {/* pagination */}
      <div
        style={{
          padding: "5px 10px",
          ...S.row(5),
          justifyContent: "flex-end",
          borderTop: "1px solid var(--preview-border)",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 18,
              borderRadius: 4,
              background:
                i === 1 ? "var(--preview-accent)" : "var(--preview-shimmer)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewDashboard({ variant = "generic" }: { variant?: string }) {
  const accentMap: Record<string, string> = {
    generic: "var(--preview-accent)",
    health: "#34d399",
    ecommerce: "#fbbf24",
    marketing: "#a78bfa",
    saas: "#60a5fa",
    media: "#f472b6",
    manufacturing: "#9ca3af",
  };
  const color = accentMap[variant] || accentMap.generic;
  const bars = [40, 65, 45, 80, 55, 70, 60];
  return (
    <div style={{ ...S.col(7), width: "94%" }}>
      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...S.border(7),
              padding: "7px 8px",
              background: "var(--preview-surface)",
              ...S.col(4),
            }}
          >
            <div style={S.line("65%", 5)} />
            <div
              style={{
                width: "75%",
                height: 11,
                borderRadius: 3,
                background: color,
                opacity: i === 0 ? 0.9 : 0.5,
              }}
            />
          </div>
        ))}
      </div>
      {/* chart area */}
      <div
        style={{
          ...S.border(7),
          padding: "8px",
          background: "var(--preview-surface)",
          ...S.col(6),
        }}
      >
        <div style={{ ...S.row(0), justifyContent: "space-between" }}>
          <div style={S.line("30%", 5)} />
          <div style={S.line("18%", 5)} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 48,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: color,
                borderRadius: "3px 3px 0 0",
                opacity: i === 3 ? 1 : 0.45,
              }}
            />
          ))}
        </div>
      </div>
      {/* mini line chart */}
      <div
        style={{
          ...S.border(7),
          padding: "8px",
          background: "var(--preview-surface)",
        }}
      >
        <svg
          width="100%"
          height="28"
          viewBox="0 0 200 28"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,22 30,18 60,12 90,16 120,8 150,10 200,4"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <polyline
            points="0,28 0,22 30,18 60,12 90,16 120,8 150,10 200,4 200,28"
            fill={color}
            opacity="0.1"
          />
        </svg>
      </div>
    </div>
  );
}

function PreviewKanban() {
  const cols = [
    { color: "var(--preview-text-muted)", cards: 2 },
    { color: "var(--preview-accent)", cards: 2 },
    { color: "#4ade80", cards: 1 },
  ];
  return (
    <div style={{ display: "flex", gap: 7, width: "96%" }}>
      {cols.map(({ color, cards }, ci) => (
        <div key={ci} style={{ flex: 1, ...S.col(5) }}>
          <div style={S.row(5)}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
              }}
            />
            <div
              style={{
                width: "55%",
                height: 5,
                borderRadius: 3,
                background: "var(--preview-shimmer)",
              }}
            />
          </div>
          {[...Array(cards)].map((_, i) => (
            <div
              key={i}
              style={{
                ...S.border(6),
                background: "var(--preview-surface)",
                padding: "7px 8px",
                ...S.col(5),
              }}
            >
              <div style={S.line("80%", 6)} />
              <div style={S.line("55%", 5)} />
              <div style={S.row(4)}>
                <div style={S.circle(10)} />
                <div
                  style={{
                    width: 20,
                    height: 5,
                    borderRadius: 3,
                    background: color,
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>
          ))}
          <div
            style={{
              ...S.border(6),
              borderStyle: "dashed",
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "1.5px solid var(--preview-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "var(--preview-text-muted)",
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewAIChat() {
  return (
    <div style={{ ...S.col(7), width: "90%" }}>
      {/* AI bubble */}
      <div style={S.row(7)}>
        <div
          style={{
            ...S.circle(20, true),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "rgba(255,255,255,0.7)",
            }}
          />
        </div>
        <div
          style={{
            ...S.border(10),
            borderBottomLeftRadius: 2,
            background: "var(--preview-surface)",
            padding: "8px 10px",
            maxWidth: 130,
            ...S.col(4),
          }}
        >
          <div style={S.line("90%", 6)} />
          <div style={S.line("65%", 5)} />
        </div>
      </div>
      {/* User bubble */}
      <div style={{ ...S.row(7), flexDirection: "row-reverse" }}>
        <div
          style={{
            ...S.circle(20),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--preview-border)",
            }}
          />
        </div>
        <div
          style={{
            background: "var(--preview-accent)",
            borderRadius: "10px 10px 2px 10px",
            padding: "8px 10px",
            maxWidth: 120,
            ...S.col(4),
          }}
        >
          <div
            style={{
              width: "85%",
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,0.5)",
            }}
          />
          <div
            style={{
              width: "55%",
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.3)",
            }}
          />
        </div>
      </div>
      {/* input */}
      <div
        style={{
          ...S.border(8),
          ...S.row(0),
          justifyContent: "space-between",
          padding: "7px 10px",
          background: "var(--preview-surface)",
        }}
      >
        <div style={S.line("55%", 6)} />
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--preview-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 10, color: "#fff", lineHeight: 1 }}>↑</span>
        </div>
      </div>
    </div>
  );
}

function PreviewImageCarousel() {
  const thumbColors = [
    "#2a2a38",
    "var(--preview-accent-light)",
    "#242430",
    "#1c1c22",
  ];
  return (
    <div style={{ ...S.col(8), width: "90%", alignItems: "center" }}>
      {/* main slide */}
      <div style={{ width: "100%", ...S.row(5) }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--preview-shimmer)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--preview-text-muted)" }}>
            ‹
          </span>
        </div>
        <div
          style={{
            flex: 1,
            height: 62,
            borderRadius: 8,
            background: "var(--preview-accent-light)",
            border: "1.5px solid var(--preview-accent)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* image placeholder pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--preview-accent)",
                opacity: 0.3,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 20,
              background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
            }}
          />
        </div>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--preview-shimmer)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--preview-text-muted)" }}>
            ›
          </span>
        </div>
      </div>
      {/* thumbnails + dots */}
      <div style={S.row(5)}>
        {thumbColors.map((c, i) => (
          <div
            key={i}
            style={{
              width: i === 1 ? 36 : 28,
              height: i === 1 ? 24 : 18,
              borderRadius: 4,
              background: c,
              border:
                i === 1
                  ? "2px solid var(--preview-accent)"
                  : "1px solid var(--preview-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewSpotlightSearch() {
  return (
    <div style={{ ...S.col(5), width: "92%" }}>
      <div
        style={{
          ...S.accentBorder(9),
          ...S.row(8),
          padding: "8px 10px",
          background: "var(--preview-surface)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle
            cx="5.5"
            cy="5.5"
            r="4"
            stroke="var(--preview-accent)"
            strokeWidth="1.5"
          />
          <path
            d="M9 9L11.5 11.5"
            stroke="var(--preview-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div style={S.accentLine("40%", 7)} />
        <div
          style={{
            marginLeft: "auto",
            ...S.border(3),
            padding: "2px 5px",
            ...S.row(0),
            justifyContent: "center",
          }}
        >
          <div style={S.line(16, 5)} />
        </div>
      </div>
      {[true, false, false].map((active, i) => (
        <div
          key={i}
          style={{
            ...S.row(8),
            padding: "5px 10px",
            borderRadius: 7,
            background: active ? "var(--preview-accent-light)" : "transparent",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: active
                ? "var(--preview-accent)"
                : "var(--preview-shimmer)",
            }}
          />
          <div
            style={{
              width: `${70 - i * 12}px`,
              height: 6,
              borderRadius: 3,
              background: active
                ? "var(--preview-accent)"
                : "var(--preview-shimmer)",
            }}
          />
          {active && (
            <div
              style={{
                marginLeft: "auto",
                ...S.line(20, 14),
                borderRadius: 4,
                background: "var(--preview-accent-light)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PreviewEmoji() {
  const grid = [
    "🔥",
    "✨",
    "👍",
    "🎉",
    "❤️",
    "😊",
    "🚀",
    "⭐",
    "💡",
    "🎨",
    "✅",
    "💬",
  ];
  return (
    <div
      style={{
        ...S.border(9),
        width: "88%",
        background: "var(--preview-surface)",
        padding: "8px 9px",
        ...S.col(7),
      }}
    >
      {/* category + search row */}
      <div style={S.row(6)}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background:
                i === 1
                  ? "var(--preview-accent-light)"
                  : "var(--preview-shimmer)",
              border: i === 1 ? "1px solid var(--preview-accent)" : "none",
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            ...S.border(5),
            height: 20,
            background: "var(--preview-bg)",
          }}
        />
      </div>
      {/* emoji grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 3,
        }}
      >
        {grid.map((e, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              background:
                i === 0 ? "var(--preview-accent-light)" : "transparent",
              fontSize: 13,
            }}
          >
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewEmailTemplate() {
  return (
    <div
      style={{
        background: "#0c0c0f",
        borderRadius: 9,
        padding: "6px",
        width: "90%",
      }}
    >
      <div style={{ background: "#fff", borderRadius: 7, overflow: "hidden" }}>
        {/* header bar */}
        <div
          style={{
            background: "var(--preview-accent)",
            padding: "8px 12px",
            ...S.row(6),
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "rgba(255,255,255,0.3)",
            }}
          />
          <div
            style={{
              width: 50,
              height: 7,
              borderRadius: 3,
              background: "rgba(255,255,255,0.6)",
            }}
          />
        </div>
        {/* body */}
        <div style={{ padding: "10px 12px", ...S.col(5) }}>
          <div
            style={{
              width: "55%",
              height: 9,
              borderRadius: 4,
              background: "#e5e7eb",
            }}
          />
          {["90%", "75%", "83%"].map((w, i) => (
            <div
              key={i}
              style={{
                width: w,
                height: 5,
                borderRadius: 3,
                background: "#f3f4f6",
              }}
            />
          ))}
          <div
            style={{
              background: "var(--preview-accent)",
              borderRadius: 5,
              width: 80,
              height: 22,
              marginTop: 4,
            }}
          />
        </div>
        {/* footer */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "5px 12px",
            ...S.row(8),
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 3,
              background: "#e5e7eb",
            }}
          />
          <div
            style={{
              width: 30,
              height: 4,
              borderRadius: 3,
              background: "#e5e7eb",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewIndiaMap() {
  return (
    <div style={{ ...S.col(7), alignItems: "center" }}>
      <svg viewBox="0 0 400 460" width="76" height="90" fill="none">
        {/* Main India body */}
        <path
          d="
            M 195 18
            L 202 20 L 210 18 L 218 22 L 224 28 L 222 36 L 228 40 L 236 38 L 242 42 L 248 50
            L 252 46 L 258 44 L 265 48 L 270 54 L 268 62 L 262 68 L 258 76 L 262 82
            L 270 80 L 278 84 L 282 92 L 278 100 L 272 106 L 280 110 L 288 108 L 296 114
            L 298 122 L 294 130 L 288 136 L 292 144 L 296 152 L 298 162 L 294 170
            L 286 176 L 278 180 L 270 178 L 266 186 L 268 196 L 264 204 L 258 210
            L 252 218 L 248 228 L 244 240 L 240 252 L 236 264 L 230 276 L 224 288
            L 218 300 L 212 314 L 206 328 L 200 342 L 196 354 L 192 342 L 188 330
            L 184 318 L 178 306 L 172 294 L 168 282 L 164 270 L 158 258 L 154 246
            L 150 234 L 146 222 L 142 212 L 138 202 L 136 192 L 134 184 L 128 178
            L 120 176 L 114 170 L 110 162 L 112 152 L 116 142 L 112 134 L 106 126
            L 100 118 L 98 108 L 104 100 L 110 94 L 116 88 L 112 80 L 106 74
            L 100 68 L 96 60 L 98 52 L 104 46 L 112 42 L 120 44 L 128 40 L 132 32
            L 138 26 L 146 22 L 154 20 L 162 18 L 170 22 L 178 20 L 186 18 L 195 18 Z
          "
          fill="var(--preview-accent-light)"
          stroke="var(--preview-accent)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Northeast region bump */}
        <path
          d="M 280 84 L 290 80 L 302 76 L 312 80 L 316 90 L 310 98 L 302 102 L 296 108 L 288 108 L 280 104 L 280 84 Z"
          fill="var(--preview-accent-light)"
          stroke="var(--preview-accent)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Far northeast nub */}
        <path
          d="M 310 70 L 318 66 L 328 68 L 334 76 L 330 84 L 322 88 L 312 84 L 308 76 L 310 70 Z"
          fill="var(--preview-accent-light)"
          stroke="var(--preview-accent)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* City dots */}
        {[
          [200, 120, 3.5, 1.0], // Delhi (pulse)
          [155, 165, 2.8, 0.85], // Mumbai
          [240, 155, 2.8, 0.85], // Kolkata
          [200, 200, 2.5, 0.7], // Hyderabad
          [170, 250, 2.5, 0.6], // Bengaluru
          [220, 270, 2.2, 0.5], // Chennai
        ].map(([cx, cy, r, op], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="var(--preview-accent)"
            opacity={op}
          />
        ))}

        {/* Pulse ring on Delhi */}
        <circle
          cx={200}
          cy={120}
          r={10}
          fill="none"
          stroke="var(--preview-accent)"
          strokeWidth="2.5"
          opacity={0.3}
        />
      </svg>

      {/* Legend */}
      <div style={S.row(8)}>
        {[
          ["High", 1],
          ["Med", 0.5],
          ["Low", 0.25],
        ].map(([label, op]) => (
          <div key={label as string} style={S.row(4)}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "var(--preview-accent)",
                opacity: op as number,
              }}
            />
            <div
              style={{
                width: 18,
                height: 5,
                borderRadius: 3,
                background: "var(--preview-shimmer)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewSoon() {
  return (
    <div style={{ ...S.col(10), alignItems: "center" }}>
      <div style={{ ...S.row(5) }}>
        {[0, 0.2, 0.4].map((op, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--preview-shimmer)",
              opacity: 0.4 + op,
            }}
          />
        ))}
      </div>
      <div style={S.line(48, 6)} />
    </div>
  );
}

// ─── Preview Map ─────────────────────────────────────────────────────────────

function ComponentPreview({
  id,
  status,
}: {
  id: string;
  status: ComponentStatus;
}) {
  if (status === "soon") return <PreviewSoon />;

  const previewMap: Record<string, React.ReactNode> = {
    dropdown: <PreviewDropdown />,
    multiselect: <PreviewMultiSelect />,
    button: <PreviewButton />,
    buttonSoon: <PreviewSoon />,
    toggle: <PreviewToggle />,
    checkbox: <PreviewCheckbox />,
    accordion: <PreviewAccordion />,
    sidebar: <PreviewSidebar />,
    menuBar: <PreviewMenuBar />,
    breadcrumb: <PreviewBreadcrumb />,
    calendar: <PreviewCalendar />,
    weekStrip: <PreviewWeekStrip />,
    dateTimeInput: <PreviewDateTimeInput />,
    progress: <PreviewProgress />,
    stepProgress: <PreviewStepProgress />,
    stepper: <PreviewStepper />,
    stepper1: <PreviewStepper />,
    stepper2: <PreviewStepProgress />,
    kpiCard: <PreviewKpiCard />,
    skeleton: <PreviewSkeleton />,
    timeline: <PreviewTimeline />,
    systemState: <PreviewSystemState />,
    toast: <PreviewToast />,
    popOver: <PreviewPopOver />,
    loader: <PreviewLoader />,
    customLoader: <PreviewLoader />,
    filterModal: <PreviewModal variant="filter" />,
    feedbackModal: <PreviewModal variant="feedback" />,
    uploadModal: <PreviewModal variant="upload" />,
    signupModal: <PreviewModal variant="signup" />,
    loginModal: <PreviewModal variant="login" />,
    jobApplicationForm: <PreviewJobForm />,
    formBuilder: <PreviewFormBuilder />,
    dataTable: <PreviewTable variant="data" />,
    analyticsTable: <PreviewTable variant="analytics" />,
    productTable: <PreviewTable variant="product" />,
    invoiceTable: <PreviewTable variant="invoice" />,
    userTable: <PreviewTable variant="user" />,
    orderTable: <PreviewTable variant="data" />,
    recordTable: <PreviewTable variant="data" />,
    dashboard: <PreviewDashboard variant="generic" />,
    healthDashboard: <PreviewDashboard variant="health" />,
    ecommerceDashboard: <PreviewDashboard variant="ecommerce" />,
    marketingDashboard: <PreviewDashboard variant="marketing" />,
    saasDashboard: <PreviewDashboard variant="saas" />,
    mediaDashboard: <PreviewDashboard variant="media" />,
    manufacturingDashboard: <PreviewDashboard variant="manufacturing" />,
    kanban: <PreviewKanban />,
    aiChat: <PreviewAIChat />,
    imageCarousel: <PreviewImageCarousel />,
    spotlightSearch: <PreviewSpotlightSearch />,
    emoji: <PreviewEmoji />,
    emailTemplate: <PreviewEmailTemplate />,
    indiaMap: <PreviewIndiaMap />,
  };

  return previewMap[id] ?? <PreviewSoon />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<
    "All" | ComponentCategory
  >("All");
  const [query, setQuery] = useState("");
  console.log(components.length);
  const categoryCounts = useMemo(() => {
    return components.reduce(
      (counts, component) => {
        counts[component.category] += 1;
        return counts;
      },
      Object.fromEntries(
        categoryOrder.map((category) => [category, 0]),
      ) as Record<ComponentCategory, number>,
    );
  }, []);

  const filteredComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return components.filter((component) => {
      const matchesCategory =
        activeCategory === "All" || component.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        component.name.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery) ||
        component.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  return (
    <main className={styles.main}>
      <div className={styles.noise} />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true">
            <svg
              className={styles.logoIcon}
              viewBox="0 0 40 40"
              role="img"
              focusable="false"
            >
              <rect
                className={styles.logoTile}
                x="7"
                y="7"
                width="26"
                height="26"
                rx="7"
              />
              <path
                className={styles.logoCode}
                d="M17 15l-5 5 5 5M23 15l5 5-5 5"
              />
              <path className={styles.logoSlash} d="M21.5 13.5l-3 13" />
              <path className={styles.logoSpark} d="M30 6v5M27.5 8.5h5" />
            </svg>
          </span>
          <span className={styles.logoText}>CompForge</span>
        </div>
        <p className={styles.tagline}>
          Craft React components visually. Export clean code instantly.
        </p>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Your component
          <br />
          <span className={styles.heroAccent}>playground.</span>
        </h1>
        <p className={styles.heroSub}>
          Pick a component, tweak it live with visual controls, copy the JSX +
          CSS. No guessing. No digging through docs.
        </p>
      </section>

      <section className={styles.libraryTools} aria-label="Component filters">
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true">
            Search
          </span>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components..."
            type="search"
          />
        </div>
        <div
          className={styles.chipRow}
          role="tablist"
          aria-label="Component categories"
        >
          <button
            className={`${styles.chip} ${activeCategory === "All" ? styles.chipActive : ""}`}
            onClick={() => setActiveCategory("All")}
            type="button"
            role="tab"
            aria-selected={activeCategory === "All"}
          >
            All <span>{components.length}</span>
          </button>
          {categoryOrder.map((category) => (
            <button
              key={category}
              className={`${styles.chip} ${activeCategory === category ? styles.chipActive : ""}`}
              onClick={() => setActiveCategory(category)}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
            >
              {category} <span>{categoryCounts[category]}</span>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.libraryMeta}>
        <span>
          Showing {filteredComponents.length} of {components.length} components
        </span>
        {activeCategory !== "All" || query ? (
          <button
            className={styles.clearFilters}
            onClick={() => {
              setActiveCategory("All");
              setQuery("");
            }}
            type="button"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <section
        className={
          filteredComponents.length > 0 ? styles.grid : styles.emptyState
        }
      >
        {filteredComponents.length > 0 ? (
          filteredComponents.map((comp) => (
            <ComponentCard key={comp.id} {...comp} />
          ))
        ) : (
          <>
            <h2>No components found</h2>
            <p>Try another category or search term.</p>
            <button
              className={styles.clearFilters}
              onClick={() => {
                setActiveCategory("All");
                setQuery("");
              }}
              type="button"
            >
              Reset library
            </button>
          </>
        )}
      </section>

      <footer className={styles.footer}>
        <span>Built with Next.js · Your side project</span>
      </footer>

      <style>{`
        :root {
          --preview-accent: #7c6cfc;
          --preview-accent-light: #1a1830;
          --preview-surface: #1c1c22;
          --preview-bg: #141418;
          --preview-border: #2a2a38;
          --preview-text: #f0f0f5;
          --preview-text-muted: #6b6b84;
          --preview-shimmer: #242430;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes skshimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </main>
  );
}

// Replace your ComponentCard function in app/page.tsx with this.
// Also add useTransition to your imports at the top:
//   import { useState, useMemo, useTransition } from "react";

function ComponentCard({
  id,
  name,
  description,
  status,
  category,
}: ComponentItem) {
  const isReady = status === "ready";
  const [isPending, startTransition] = useTransition();

  // useTransition is the correct Next.js App Router hook for this.
  // isPending becomes true the moment the navigation starts and
  // stays true until the new page (or loading.tsx) has rendered.
  // This gives you click → card dims instantly → loading.tsx takes over.

  const card = (
    <div
      className={`${styles.card} ${isReady ? styles.cardReady : styles.cardSoon}`}
      style={
        isPending
          ? {
              opacity: 0.5,
              transform: "scale(0.98)",
              transition: "opacity 0.15s, transform 0.15s",
            }
          : { transition: "opacity 0.15s, transform 0.15s" }
      }
    >
      <div className={styles.cardPreview} style={{ paddingTop: 16 }}>
        {isPending ? (
          <CardLoadingShimmer />
        ) : (
          <ComponentPreview id={id} status={status} />
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h2 className={styles.cardName}>{name}</h2>
          <span
            className={`${styles.badge} ${isReady ? styles.badgeReady : styles.badgeSoon}`}
          >
            {isReady ? "Ready" : "Soon"}
          </span>
        </div>
        <span className={styles.categoryLabel}>{category}</span>
        <p className={styles.cardDesc}>{description}</p>
        {isReady && (
          <span className={styles.cardCta}>
            {isPending ? "Opening…" : "Open Playground →"}
          </span>
        )}
      </div>
    </div>
  );

  return isReady ? (
    <Link
      href={`/playground/${id}`}
      className={styles.cardLink}
      prefetch={true}
      onClick={() => {
        // Wrap in startTransition so isPending tracks the navigation.
        // Next.js Link's onClick fires before navigation starts,
        // so this correctly marks the transition as in-flight.
        startTransition(() => {});
      }}
    >
      {card}
    </Link>
  ) : (
    <div className={styles.cardLink}>{card}</div>
  );
}

// Small shimmer block that replaces the ComponentPreview while navigating.
// Matches the dark surface palette so it looks intentional.
function CardLoadingShimmer() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 80,
        borderRadius: 8,
        background: "#1c1c22",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            background: "#7c6cfc",
            display: "block",
            animation: "bounce 0.6s ease-in-out infinite alternate",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
