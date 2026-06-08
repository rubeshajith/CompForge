"use client";

import { useMemo, useState } from "react";
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
  | "Dashboards"
  | "Productivity"
  | "Maps"
  | "Utilities";

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
  "Date & Time",
  "Navigation",
  "Feedback",
  "Modals & Forms",
  "Data Display",
  "Dashboards",
  "Productivity",
  "Maps",
  "Utilities",
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
    name: "Button, Button group",
    description: "Buttons and button groups with variants and states",
    status: "ready",
    preview: "Click button",
    category: "Inputs",
  },
  {
    id: "toggle",
    name: "Toggle, Toggle group",
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
    id: "dataTable",
    name: "Data Table",
    description:
      "Interactive data table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "analyticsTable",
    name: "Analytics Table",
    description: "Analytics table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "productTable",
    name: "Product Table",
    description: "Product table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "invoiceTable",
    name: "Invoice Table",
    description: "Invoice table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "userTable",
    name: "User Table",
    description: "User table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "orderTable",
    name: "Order Table",
    description: "Order table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
  },
  {
    id: "recordTable",
    name: "Record Table",
    description: "Record table with sorting, filtering, and pagination",
    status: "ready",
    preview: "Open table",
    category: "Data Display",
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
    name: "Saas Dashboard",
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
    category: "Inputs",
  },
  {
    id: "badge",
    name: "Badge",
    description: "Status badges and label chips",
    status: "soon",
    preview: "Active",
    category: "Data Display",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<
    "All" | ComponentCategory
  >("All");
  const [query, setQuery] = useState("");

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
          <span className={styles.logoMark}>⬡</span>
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
            All
            <span>{components.length}</span>
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
              {category}
              <span>{categoryCounts[category]}</span>
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
    </main>
  );
}

function ComponentCard({
  id,
  name,
  description,
  status,
  preview,
  category,
}: ComponentItem) {
  const isReady = status === "ready";

  const card = (
    <div
      className={`${styles.card} ${isReady ? styles.cardReady : styles.cardSoon}`}
    >
      <div className={styles.cardPreview}>
        <span className={styles.previewText}>{preview}</span>
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
        {isReady && <span className={styles.cardCta}>Open Playground →</span>}
      </div>
    </div>
  );

  return isReady ? (
    <Link href={`/playground/${id}`} className={styles.cardLink}>
      {card}
    </Link>
  ) : (
    <div className={styles.cardLink}>{card}</div>
  );
}
