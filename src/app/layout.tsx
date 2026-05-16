import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompForge — React Component Playground",
  description: "Customize React components visually and export clean code",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
