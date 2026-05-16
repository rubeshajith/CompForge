# CompForge — React Component Playground

A visual playground to customize React components and export clean JSX + CSS code.

---

## Setup Instructions

### Step 1 — Prerequisites
Make sure you have Node.js installed (v18 or newer).
Check with: `node -v`

If not installed, download from https://nodejs.org

---

### Step 2 — Create a Next.js project

You have two options:

#### Option A: Use this folder directly
Copy this entire `compforge` folder somewhere on your machine, then:
```bash
cd compforge
npm install
npm run dev
```

#### Option B: Bootstrap fresh (recommended to understand the setup)
```bash
npx create-next-app@14 compforge \
  --typescript \
  --no-tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-import-alias
```
When prompted, say YES to App Router, YES to src/ directory, NO to Tailwind.

Then copy all files from this repo into that folder, replacing any that exist.

---

### Step 3 — Install dependencies
```bash
cd compforge
npm install react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter
```

---

### Step 4 — Run the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Folder Structure

```
compforge/
├── src/
│   ├── app/
│   │   ├── globals.css              ← Design tokens, fonts, global reset
│   │   ├── layout.tsx               ← Root HTML wrapper
│   │   ├── page.tsx                 ← Landing page (component gallery)
│   │   ├── page.module.css
│   │   └── playground/
│   │       └── dropdown/
│   │           ├── page.tsx         ← Dropdown playground page
│   │           └── page.module.css
│   │
│   ├── components/
│   │   └── playground/
│   │       ├── DropdownPreview.tsx  ← Live rendered dropdown (driven by config)
│   │       ├── ControlPanel.tsx     ← All the knobs, sliders, toggles
│   │       └── CodePanel.tsx        ← Syntax-highlighted JSX/CSS export
│   │
│   └── lib/
│       ├── dropdownConfig.ts        ← TypeScript type + default values
│       └── generateDropdownCode.ts  ← Pure functions: config → code strings
│
├── package.json
├── next.config.mjs
└── tsconfig.json
```

---

## How to Add a New Component (e.g. Toast)

1. Create `src/lib/toastConfig.ts` — define `ToastConfig` type and defaults
2. Create `src/lib/generateToastCode.ts` — write JSX + CSS generators
3. Create `src/components/playground/ToastPreview.tsx` — live preview component
4. Create `src/app/playground/toast/page.tsx` — wire it all together (same pattern as dropdown)
5. Add the entry to the `components` array in `src/app/page.tsx` and change status to `"ready"`

The pattern is always:
- Config type → Control Panel reads it → Preview renders it → Generator outputs code from it

---

## Key Concepts (Next.js vs React)

| Concept | React | Next.js |
|---------|-------|---------|
| Routing | React Router / manual | File-based: `app/about/page.tsx` = `/about` |
| "use client" | Everything is client | Add `"use client"` at top for interactive components |
| CSS Modules | Same | Same — `import styles from './file.module.css'` |
| Link | `<a>` or React Router | `import Link from 'next/link'` |
| Deploy | Varies | `npm run build` then Vercel (one click) |

The most important thing: any component with `useState`, `useEffect`, event handlers etc. needs `"use client"` at the top of the file. Components without it are Server Components by default (fine for static layouts).
