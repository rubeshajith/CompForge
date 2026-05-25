"use client";

import Link from "next/link";
import styles from "./page.module.css";

const components: {
  id: string;
  name: string;
  description: string;
  status: "ready" | "soon";
  preview: string;
}[] = [
  {
    id: "dropdown",
    name: "Dropdown",
    description: "Fully customizable select dropdown with animations",
    status: "ready",
    preview: "▾ Select option",
  },
  {
    id: "multiselect",
    name: "Multi Select",
    description: "Multi-select dropdown with search, badges, and clear filters",
    status: "ready",
    preview: "☑ Select multiple",
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Expandable content sections with various animation effects",
    status: "ready",
    preview: "▾ Accordion",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Customizable sidebar with various themes and layouts",
    status: "ready",
    preview: "▾ Sidebar",
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Interactive calendar with date selection and navigation",
    status: "ready",
    preview: "📅 Select date",
  },
  {
    id: "weekStrip",
    name: "Week Strip",
    description:
      "Horizontal week navigation strip with month labels and selection modes",
    status: "ready",
    preview: "📅 Select date",
  },
  {
    id: "dateTimeInput",
    name: "Date Time Input Field",
    description: "Date time input field",
    status: "ready",
    preview: "📅 Select date and time",
  },
  {
    id: "stepProgress",
    name: "Step Progress",
    description: "customizable progress step flow",
    status: "ready",
    preview: " progress",
  },
  {
    id: "stepper",
    name: "Stepper",
    description: "customizable progress step flow",
    status: "ready",
    preview: " progress",
  },
  {
    id: "stepper1",
    name: "Stepper 1.0",
    description: "customizable progress step flow",
    status: "ready",
    preview: " progress",
  },
  {
    id: "stepper2",
    name: "Stepper 2.0",
    description: "customizable progress step flow",
    status: "ready",
    preview: " progress",
  },
  {
    id: "toast",
    name: "Toast",
    description: "Notification toasts with variants and positioning",
    status: "ready",
    preview: "🔔 Notification",
  },
  {
    id: "popOver",
    name: "Pop Over",
    description: "Pop Over variations",
    status: "ready",
    preview: "🔔 pop over",
  },
  {
    id: "loader",
    name: "Loader",
    description: "Animated loading indicators and spinners",
    status: "ready",
    preview: "◌ Loading...",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Customizable checkboxes with various styles and animations",
    status: "ready",
    preview: "☐ Checked",
  },
  {
    id: "systemState",
    name: "System State",
    description: "Display various system states with customizable variants",
    status: "ready",
    preview: "● System State",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Interactive timeline with customizable nodes and connectors",
    status: "ready",
    preview: "● Timeline",
  },
  {
    id: "skeleton",
    name: "Skeleton Loader",
    description: "Skeleton loading placeholders for content areas",
    status: "ready",
    preview: "◌ Loading...",
  },
  {
    id: "filterModal",
    name: "Modal Filter",
    description: "Dialog modals with backdrop and transitions",
    status: "ready",
    preview: "⊡ Open Modal",
  },
  {
    id: "feedbackModal",
    name: "Feedback Modal",
    description: "Dialog modals for collecting user feedback",
    status: "ready",
    preview: "⊡ Open Modal",
  },
  {
    id: "uploadModal",
    name: "Upload Modal",
    description: "Modal for uploading files with progress tracking",
    status: "ready",
    preview: "⊡ Open Modal",
  },
  {
    id: "signupModal",
    name: "Signup Modal",
    description: "Modal for collecting user signup information",
    status: "ready",
    preview: "⊡ Open Modal",
  },
  {
    id: "loginModal",
    name: "Login Modal",
    description: "Modal for collecting user login information",
    status: "ready",
    preview: "⊡ Open Modal",
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Interactive Kanban board with drag-and-drop functionality",
    status: "ready",
    preview: "⊡ Open Kanban Board",
  },
  {
    id: "formBuilder",
    name: "Form Builder",
    description: "Visual form builder with drag-and-drop functionality",
    status: "ready",
    preview: "⊡ Open Form Builder",
  },
  {
    id: "imageCarousel",
    name: "Image Carousel",
    description:
      "Interactive image carousel with zoom and thumbnail navigation",
    status: "ready",
    preview: "⊡ Open Image Carousel",
  },
  {
    id: "spotlightSearch",
    name: "Spotlight Search",
    description: "Search component with spotlight effect",
    status: "ready",
    preview: "⊡ Open Spotlight Search",
  },
  {
    id: "dataTable",
    name: "Data Table",
    description:
      "Interactive data table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Data Table",
  },
  {
    id: "analyticsTable",
    name: "Analytics Table",
    description:
      "Interactive analytics table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Analytics Table",
  },
  {
    id: "productTable",
    name: "Product Table",
    description:
      "Interactive product table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Product Table",
  },
  {
    id: "invoiceTable",
    name: "Invoice Table",
    description:
      "Interactive invoice table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Invoice Table",
  },
  {
    id: "userTable",
    name: "User Table",
    description:
      "Interactive user table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open User Table",
  },
  {
    id: "orderTable",
    name: "Order Table",
    description:
      "Interactive order table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Order Table",
  },
  {
    id: "recordTable",
    name: "Record Table",
    description:
      "Interactive record table with sorting, filtering, and pagination",
    status: "ready",
    preview: "⊡ Open Record Table",
  },
  {
    id: "indiaMap",
    name: "India Map",
    description:
      "Interactive map of India with data visualization capabilities",
    status: "ready",
    preview: "⊡ Open India Map",
  },
  {
    id: "button",
    name: "Button",
    description: "Buttons with variants, sizes, and states",
    status: "soon",
    preview: "[ Click me ]",
  },
  {
    id: "badge",
    name: "Badge",
    description: "Status badges and label chips",
    status: "soon",
    preview: "● Active",
  },
];

export default function Home() {
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

      <section className={styles.grid}>
        {components.map((comp) => (
          <ComponentCard key={comp.id} {...comp} />
        ))}
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
}: {
  id: string;
  name: string;
  description: string;
  status: "ready" | "soon";
  preview: string;
}) {
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
