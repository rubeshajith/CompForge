"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EmailTemplatePreview.tsx
// Live preview for the Email Template playground.
// Renders the generated HTML inside a sandboxed iframe so email styles are
// completely isolated from the app shell.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { EmailTemplateConfig } from "@/lib/emailTemplateConfig";
import { generateEmailTemplateHTML } from "@/lib/generateEmailTemplate";

interface EmailTemplatePreviewProps {
  config: EmailTemplateConfig;
}

export function EmailTemplatePreview({ config }: EmailTemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const html = generateEmailTemplateHTML(config);
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();
  }, [config]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <iframe
        ref={iframeRef}
        title="Email Preview"
        style={{
          width: "100%",
          maxWidth: `${config.cardWidth + 80}px`,
          minHeight: "700px",
          border: "none",
          borderRadius: "8px",
          display: "block",
          background: config.emailBackground,
        }}
        // Scroll inside the stage, not a separate scroll container
        scrolling="no"
        onLoad={() => {
          // Auto-resize iframe to content height
          const iframe = iframeRef.current;
          if (!iframe || !iframe.contentWindow) return;
          try {
            const height = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = `${height + 48}px`;
          } catch {
            // cross-origin guard (won't trigger here since srcdoc)
          }
        }}
      />
    </div>
  );
}
