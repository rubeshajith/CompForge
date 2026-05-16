"use client";

import { useMemo, useRef, useState } from "react";
import type { UploadItem, UploadModalConfig } from "@/lib/uploadModalConfig";

export function UploadModalPreview({ config }: { config: UploadModalConfig }) {
  const [items, setItems] = useState<UploadItem[]>(config.pendingUploads);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const remaining = Math.max(config.quotaTotal - config.quotaUsed, 0).toFixed(1);
  const pendingCount = items.filter((item) => item.status !== "complete").length;

  const shellShadow = config.showShadow ? "0 28px 90px rgba(0,0,0,0.34)" : "none";
  const animation = config.animateOpen
    ? { animation: "uploadModalIn 260ms cubic-bezier(.2,.8,.2,1)" }
    : undefined;

  const dropzoneStyle = useMemo(
    () => ({
      background: isDragging ? config.dropzoneActiveBackground : config.dropzoneBackground,
      border: `1px dashed ${config.dropzoneBorderColor}`,
      transition: "background 160ms ease, border-color 160ms ease, transform 160ms ease",
      transform: isDragging ? "scale(1.01)" : "scale(1)",
    }),
    [config.dropzoneActiveBackground, config.dropzoneBackground, config.dropzoneBorderColor, isDragging]
  );

  function inferType(name: string): UploadItem["type"] {
    const lower = name.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].some((ext) => lower.endsWith(`.${ext}`))) return "image";
    if (["zip", "rar", "7z", "tar"].some((ext) => lower.endsWith(`.${ext}`))) return "archive";
    if (["pdf", "doc", "docx", "txt", "md"].some((ext) => lower.endsWith(`.${ext}`))) return "document";
    return "generic";
  }

  function pushFiles(files: FileList | File[]) {
    const next = Array.from(files).map((file, index) => ({
      id: `${file.name}-${file.size}-${index}-${Date.now()}`,
      name: file.name,
      sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: inferType(file.name),
      progress: 0,
      status: "queued" as const,
      message: "Waiting...",
    }));
    setItems((prev) => [...next, ...prev]);
  }

  function startUpload() {
    setItems((prev) =>
      prev.map((item) => {
        if (item.status === "error") return item;
        if (item.status === "complete") return item;
        const progress = item.status === "uploading" ? Math.min(item.progress + 20, 100) : 35;
        return {
          ...item,
          status: progress >= 100 ? "complete" : "uploading",
          progress,
          message: progress >= 100 ? "Uploaded" : `${progress}% completed`,
        };
      })
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function retryItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "queued", progress: 0, message: "Waiting..." }
          : item
      )
    );
  }

  function clearAll() {
    setItems([]);
  }

  if (!isOpen) {
    return (
      <div style={{ color: config.subtitleColor, fontFamily: "var(--font-body)" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: config.actionButtonBackground,
            color: config.actionButtonTextColor,
            border: "none",
            borderRadius: 12,
            padding: "12px 18px",
            fontWeight: 600,
          }}
        >
          Reopen upload modal
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: 720,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "radial-gradient(circle at top, rgba(124,108,252,0.08), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        borderRadius: 28,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes uploadModalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.overlayColor,
          backdropFilter: "blur(14px)",
        }}
      />
      <div
        style={{
          width: "100%",
          maxWidth: config.modalWidth,
          borderRadius: config.borderRadius,
          background: config.panelBackground,
          border: `1px solid ${config.panelBorderColor}`,
          boxShadow: shellShadow,
          position: "relative",
          overflow: "hidden",
          ...animation,
        }}
      >
        <div style={{ padding: 24, borderBottom: `1px solid ${config.panelBorderColor}`, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ color: config.titleColor, fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700 }}>Upload files</div>
            <div style={{ color: config.subtitleColor, marginTop: 6, fontSize: 14 }}>Add files to your shared workspace folder</div>
          </div>
          <button
            aria-label="Close upload modal"
            onClick={() => setIsOpen(false)}
            style={{ width: 40, height: 40, borderRadius: 999, background: "transparent", color: config.closeButtonColor, border: "none", fontSize: 20 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: 24, display: "grid", gap: 24, maxHeight: 716, overflowY: "auto" }}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.length) pushFiles(e.dataTransfer.files);
            }}
            style={{
              ...dropzoneStyle,
              borderRadius: 24,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.length) pushFiles(e.target.files);
              }}
            />
            <div style={{ width: 64, height: 64, borderRadius: 999, background: config.dropzoneIconBackground, color: config.dropzoneIconColor, display: "grid", placeItems: "center", fontSize: 28, marginBottom: 16 }}>↑</div>
            <div style={{ color: config.dropzoneTitleColor, fontWeight: 700, fontSize: 20 }}>Drag and drop your files here</div>
            <div style={{ color: config.dropzoneTextColor, marginTop: 8, fontSize: 14 }}>Support for PDF, JPG, PNG, DOCX, and ZIP up to 50MB</div>
            <button
              style={{
                marginTop: 20,
                background: config.browseButtonBackground,
                color: config.browseButtonTextColor,
                border: "none",
                borderRadius: 14,
                padding: "12px 18px",
                fontWeight: 700,
              }}
            >
              Browse files
            </button>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div style={{ color: config.sectionLabelColor, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                Pending uploads ({pendingCount})
              </div>
              <button onClick={clearAll} style={{ color: config.clearActionColor, fontWeight: 700, border: "none", background: "transparent" }}>Clear all</button>
            </div>

            {items.length === 0 ? (
              <div style={{ border: `1px dashed ${config.itemBorderColor}`, borderRadius: 18, padding: 24, color: config.itemMetaColor, textAlign: "center" }}>
                No files queued yet.
              </div>
            ) : (
              items.map((item) => {
                const isError = item.status === "error";
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isError ? config.errorBackground : config.itemBackground,
                      border: `1px solid ${isError ? config.errorBorderColor : config.itemBorderColor}`,
                      borderRadius: 18,
                      padding: 16,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: isError ? config.errorBorderColor : config.itemIconBackground, color: isError ? config.errorTextColor : config.itemIconColor, display: "grid", placeItems: "center", fontWeight: 700 }}>
                        {item.type === "image" ? "IMG" : item.type === "document" ? "DOC" : item.type === "archive" ? "ZIP" : "FILE"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ color: isError ? config.titleColor : config.itemTitleColor, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {isError && (
                              <button onClick={() => retryItem(item.id)} style={{ color: config.clearActionColor, border: "none", background: "transparent", fontWeight: 700 }}>Retry</button>
                            )}
                            <button onClick={() => removeItem(item.id)} style={{ color: config.itemMetaColor, border: "none", background: "transparent", fontWeight: 700 }}>×</button>
                          </div>
                        </div>
                        <div style={{ color: isError ? config.errorTextColor : config.itemMetaColor, fontSize: 13, marginTop: 4 }}>
                          {item.sizeLabel} • {item.message}
                        </div>
                      </div>
                    </div>
                    {(item.status === "uploading" || item.status === "complete") && (
                      <div style={{ width: "100%", height: 6, borderRadius: 999, overflow: "hidden", background: config.progressTrackColor }}>
                        <div style={{ width: `${item.progress}%`, height: "100%", background: config.progressFillColor, borderRadius: 999, transition: "width 180ms ease" }} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ padding: 24, borderTop: `1px solid ${config.panelBorderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: config.footerBackground, flexWrap: "wrap" }}>
          <div style={{ color: config.footerTextColor, fontSize: 13 }}>
            Remaining quota: {remaining} GB
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: config.cancelButtonBackground, color: config.cancelButtonTextColor, border: "none", borderRadius: 14, padding: "12px 18px", fontWeight: 700 }}>Cancel</button>
            <button onClick={startUpload} style={{ background: config.actionButtonBackground, color: config.actionButtonTextColor, border: "none", borderRadius: 14, padding: "12px 18px", fontWeight: 700 }}>
              Start upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
