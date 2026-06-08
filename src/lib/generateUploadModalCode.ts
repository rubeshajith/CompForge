import type { UploadModalConfig } from "@/lib/uploadModalConfig";

export function generateUploadModalJSX(config: UploadModalConfig): string {
  return `import { useMemo, useRef, useState } from "react";
import "./UploadModal.css";

const initialItems = ${JSON.stringify(config.pendingUploads, null, 2)};

export default function UploadModal({ onUploadChange }) {
  const [items, setItems] = useState(initialItems);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const remaining = Math.max(${config.quotaTotal} - ${config.quotaUsed}, 0).toFixed(1);
  const pendingCount = items.filter((item) => item.status !== "complete").length;

  const dropzoneStyle = useMemo(() => ({
    background: isDragging ? "${config.dropzoneActiveBackground}" : "${config.dropzoneBackground}",
    borderColor: "${config.dropzoneBorderColor}",
    transform: isDragging ? "scale(1.01)" : "scale(1)",
  }), [isDragging]);

  function inferType(name) {
    const lower = name.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].some((ext) => lower.endsWith('.' + ext))) return "image";
    if (["zip", "rar", "7z", "tar"].some((ext) => lower.endsWith('.' + ext))) return "archive";
    if (["pdf", "doc", "docx", "txt", "md"].some((ext) => lower.endsWith('.' + ext))) return "document";
    return "generic";
  }

  function pushFiles(files) {
    const next = Array.from(files).map((file, index) => ({
      id: file.name + '-' + file.size + '-' + index + '-' + Date.now(),
      name: file.name,
      sizeLabel: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      type: inferType(file.name),
      progress: 0,
      status: "queued",
      message: "Waiting...",
    }));
    const merged = [...next, ...items];
    setItems(merged);
    if (onUploadChange) onUploadChange(merged);
  }

  function startUpload() {
    const updated = items.map((item) => {
      if (item.status === "error" || item.status === "complete") return item;
      const progress = item.status === "uploading" ? Math.min(item.progress + 20, 100) : 35;
      return {
        ...item,
        status: progress >= 100 ? "complete" : "uploading",
        progress,
        message: progress >= 100 ? "Uploaded" : progress + "% completed",
      };
    });
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function retryItem(id) {
    const updated = items.map((item) => item.id === id ? { ...item, status: "queued", progress: 0, message: "Waiting..." } : item);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  return (
    <div className="upm-wrap">
      <div className="upm upm--open ${config.animateOpen ? "upm--animated" : ""}">
        <div className="upm__header">
          <div>
            <h2 className="upm__title">Upload files</h2>
            <p className="upm__subtitle">Add files to your shared workspace folder</p>
          </div>
          <button className="upm__icon-btn" aria-label="Close upload modal">×</button>
        </div>

        <div className="upm__body">
          <div
            className={"upm__dropzone" + (isDragging ? " upm__dropzone--active" : "")}
            style={dropzoneStyle}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) pushFiles(e.dataTransfer.files); }}
          >
            <input ref={fileInputRef} type="file" multiple className="upm__file-input" onChange={(e) => e.target.files?.length && pushFiles(e.target.files)} />
            <div className="upm__dropzone-icon">↑</div>
            <p className="upm__dropzone-title">Drag and drop your files here</p>
            <p className="upm__dropzone-copy">Support for PDF, JPG, PNG, DOCX, and ZIP up to 50MB</p>
            <button className="upm__browse-btn">Browse files</button>
          </div>

          <div className="upm__section-head">
            <p className="upm__section-label">Pending uploads ({pendingCount})</p>
            <button className="upm__clear-btn" onClick={() => { setItems([]); if (onUploadChange) onUploadChange([]); }}>Clear all</button>
          </div>

          <div className="upm__list">
            {items.map((item) => (
              <div key={item.id} className={"upm__item" + (item.status === "error" ? " upm__item--error" : "")}>
                <div className="upm__item-row">
                  <div className="upm__file-icon">{item.type === "image" ? "IMG" : item.type === "document" ? "DOC" : item.type === "archive" ? "ZIP" : "FILE"}</div>
                  <div className="upm__item-copy">
                    <div className="upm__item-top">
                      <p className="upm__item-name">{item.name}</p>
                      <div className="upm__item-actions">
                        {item.status === "error" ? <button className="upm__retry-btn" onClick={() => retryItem(item.id)}>Retry</button> : null}
                        <button className="upm__remove-btn" onClick={() => removeItem(item.id)}>×</button>
                      </div>
                    </div>
                    <p className="upm__item-meta">{item.sizeLabel} • {item.message}</p>
                  </div>
                </div>
                {(item.status === "uploading" || item.status === "complete") ? (
                  <div className="upm__progress"><span style={{ width: item.progress + '%' }} /></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="upm__footer">
          <p className="upm__quota">Remaining quota: {remaining} GB</p>
          <div className="upm__footer-actions">
            <button className="upm__cancel-btn">Cancel</button>
            <button className="upm__start-btn" onClick={startUpload}>Start upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

export function generateUploadModalCSS(config: UploadModalConfig): string {
  return `.upm-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${config.overlayColor};
  backdrop-filter: blur(12px);
}

.upm {
  width: 100%;
  max-width: ${config.modalWidth}px;
  border-radius: ${config.borderRadius}px;
  background: ${config.panelBackground};
  border: 1px solid ${config.panelBorderColor};
  color: ${config.titleColor};
  overflow: hidden;
  box-shadow: ${config.showShadow ? "0 28px 90px rgba(0,0,0,0.34)" : "none"};
}

.upm--animated { animation: upmIn 260ms cubic-bezier(.2,.8,.2,1); }
@keyframes upmIn {
  from { opacity: 0; transform: translateY(12px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.upm__header, .upm__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.upm__header { border-bottom: 1px solid ${config.panelBorderColor}; }
.upm__footer { border-top: 1px solid ${config.panelBorderColor}; background: ${config.footerBackground}; flex-wrap: wrap; }
.upm__body { padding: 24px; display: grid; gap: 20px; }
.upm__title { margin: 0; font-size: 28px; line-height: 1.1; }
.upm__subtitle, .upm__quota { margin: 6px 0 0; color: ${config.subtitleColor}; font-size: 14px; }
.upm__icon-btn, .upm__remove-btn, .upm__clear-btn, .upm__retry-btn { background: transparent; border: none; cursor: pointer; }
.upm__icon-btn { color: ${config.closeButtonColor}; font-size: 20px; width: 40px; height: 40px; border-radius: 999px; }
.upm__dropzone {
  border: 1px dashed ${config.dropzoneBorderColor};
  background: ${config.dropzoneBackground};
  border-radius: 24px;
  padding: 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}
.upm__dropzone--active { background: ${config.dropzoneActiveBackground}; }
.upm__file-input { display: none; }
.upm__dropzone-icon {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  background: ${config.dropzoneIconBackground};
  color: ${config.dropzoneIconColor};
  font-size: 28px;
}
.upm__dropzone-title { margin: 0; font-size: 20px; font-weight: 700; color: ${config.dropzoneTitleColor}; }
.upm__dropzone-copy { margin: 8px 0 0; color: ${config.dropzoneTextColor}; font-size: 14px; }
.upm__browse-btn, .upm__cancel-btn, .upm__start-btn {
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}
.upm__browse-btn { margin-top: 20px; background: ${config.browseButtonBackground}; color: ${config.browseButtonTextColor}; }
.upm__section-head, .upm__item-row, .upm__item-top, .upm__footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.upm__section-label { margin: 0; color: ${config.sectionLabelColor}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; }
.upm__clear-btn, .upm__retry-btn { color: ${config.clearActionColor}; font-weight: 700; }
.upm__list { display: grid; gap: 14px; }
.upm__item {
  background: ${config.itemBackground};
  border: 1px solid ${config.itemBorderColor};
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 10px;
}
.upm__item--error { background: ${config.errorBackground}; border-color: ${config.errorBorderColor}; }
.upm__file-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${config.itemIconBackground};
  color: ${config.itemIconColor};
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}
.upm__item--error .upm__file-icon { background: ${config.errorBorderColor}; color: ${config.errorTextColor}; }
.upm__item-copy { flex: 1; min-width: 0; }
.upm__item-name { margin: 0; color: ${config.itemTitleColor}; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.upm__item-meta { margin: 4px 0 0; color: ${config.itemMetaColor}; font-size: 13px; }
.upm__item--error .upm__item-meta { color: ${config.errorTextColor}; }
.upm__progress {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: ${config.progressTrackColor};
}
.upm__progress span {
  display: block;
  height: 100%;
  background: ${config.progressFillColor};
  border-radius: 999px;
  transition: width 180ms ease;
}
.upm__cancel-btn { background: ${config.cancelButtonBackground}; color: ${config.cancelButtonTextColor}; }
.upm__start-btn { background: ${config.actionButtonBackground}; color: ${config.actionButtonTextColor}; }

@media (max-width: 640px) {
  .upm-wrap { padding: 12px; }
  .upm__header, .upm__body, .upm__footer { padding: 18px; }
  .upm__dropzone { padding: 24px; }
  .upm__title { font-size: 24px; }
}
`;
}

// ─── TSX + CSS ────────────────────────
export function generateUploadModalTSX(config: UploadModalConfig): string {
  return `import { useMemo, useRef, useState } from "react";
import "./UploadModal.css";

interface UploadItem {
  id: string;
  name: string;
  sizeLabel: string;
  type: "image" | "archive" | "document" | "generic";
  progress: number;
  status: "queued" | "uploading" | "complete" | "error";
  message: string;
}

interface UploadModalProps {
  onUploadChange?: (items: UploadItem[]) => void;
}

const initialItems: UploadItem[] = ${JSON.stringify(config.pendingUploads, null, 2)};

export default function UploadModal({ onUploadChange }: UploadModalProps) {
  const [items, setItems] = useState<UploadItem[]>(initialItems);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = Math.max(${config.quotaTotal} - ${config.quotaUsed}, 0).toFixed(1);
  const pendingCount = items.filter((item) => item.status !== "complete").length;

  const dropzoneStyle = useMemo(() => ({
    background: isDragging ? "${config.dropzoneActiveBackground}" : "${config.dropzoneBackground}",
    borderColor: "${config.dropzoneBorderColor}",
    transform: isDragging ? "scale(1.01)" : "scale(1)",
  }), [isDragging]);

  function inferType(name: string): UploadItem["type"] {
    const lower = name.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].some((ext) => lower.endsWith('.' + ext))) return "image";
    if (["zip", "rar", "7z", "tar"].some((ext) => lower.endsWith('.' + ext))) return "archive";
    if (["pdf", "doc", "docx", "txt", "md"].some((ext) => lower.endsWith('.' + ext))) return "document";
    return "generic";
  }

  function pushFiles(files: FileList): void {
    const next: UploadItem[] = Array.from(files).map((file, index) => ({
      id: file.name + '-' + file.size + '-' + index + '-' + Date.now(),
      name: file.name,
      sizeLabel: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      type: inferType(file.name),
      progress: 0,
      status: "queued",
      message: "Waiting...",
    }));
    const merged = [...next, ...items];
    setItems(merged);
    if (onUploadChange) onUploadChange(merged);
  }

  function startUpload(): void {
    const updated = items.map((item) => {
      if (item.status === "error" || item.status === "complete") return item;
      const progress = item.status === "uploading" ? Math.min(item.progress + 20, 100) : 35;
      return {
        ...item,
        status: (progress >= 100 ? "complete" : "uploading") as UploadItem["status"],
        progress,
        message: progress >= 100 ? "Uploaded" : progress + "% completed",
      };
    });
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function removeItem(id: string): void {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function retryItem(id: string): void {
    const updated = items.map((item) => item.id === id ? { ...item, status: "queued" as UploadItem["status"], progress: 0, message: "Waiting..." } : item);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  return (
    <div className="upm-wrap">
      <div className="upm upm--open ${config.animateOpen ? "upm--animated" : ""}">
        <div className="upm__header">
          <div>
            <h2 className="upm__title">Upload files</h2>
            <p className="upm__subtitle">Add files to your shared workspace folder</p>
          </div>
          <button className="upm__icon-btn" aria-label="Close upload modal">×</button>
        </div>

        <div className="upm__body">
          <div
            className={"upm__dropzone" + (isDragging ? " upm__dropzone--active" : "")}
            style={dropzoneStyle}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) pushFiles(e.dataTransfer.files); }}
          >
            <input ref={fileInputRef} type="file" multiple className="upm__file-input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.length && pushFiles(e.target.files)} />
            <div className="upm__dropzone-icon">↑</div>
            <p className="upm__dropzone-title">Drag and drop your files here</p>
            <p className="upm__dropzone-copy">Support for PDF, JPG, PNG, DOCX, and ZIP up to 50MB</p>
            <button className="upm__browse-btn">Browse files</button>
          </div>

          <div className="upm__section-head">
            <p className="upm__section-label">Pending uploads ({pendingCount})</p>
            <button className="upm__clear-btn" onClick={() => { setItems([]); if (onUploadChange) onUploadChange([]); }}>Clear all</button>
          </div>

          <div className="upm__list">
            {items.map((item) => (
              <div key={item.id} className={"upm__item" + (item.status === "error" ? " upm__item--error" : "")}>
                <div className="upm__item-row">
                  <div className="upm__file-icon">{item.type === "image" ? "IMG" : item.type === "document" ? "DOC" : item.type === "archive" ? "ZIP" : "FILE"}</div>
                  <div className="upm__item-copy">
                    <div className="upm__item-top">
                      <p className="upm__item-name">{item.name}</p>
                      <div className="upm__item-actions">
                        {item.status === "error" ? <button className="upm__retry-btn" onClick={() => retryItem(item.id)}>Retry</button> : null}
                        <button className="upm__remove-btn" onClick={() => removeItem(item.id)}>×</button>
                      </div>
                    </div>
                    <p className="upm__item-meta">{item.sizeLabel} • {item.message}</p>
                  </div>
                </div>
                {(item.status === "uploading" || item.status === "complete") ? (
                  <div className="upm__progress"><span style={{ width: item.progress + '%' }} /></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="upm__footer">
          <p className="upm__quota">Remaining quota: {remaining} GB</p>
          <div className="upm__footer-actions">
            <button className="upm__cancel-btn">Cancel</button>
            <button className="upm__start-btn" onClick={startUpload}>Start upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────
export function generateUploadModalTailwind(config: UploadModalConfig): string {
  const shadow = config.showShadow ? "0 28px 90px rgba(0,0,0,0.34)" : "none";

  return `import { useMemo, useRef, useState, CSSProperties } from "react";

interface UploadItem {
  id: string;
  name: string;
  sizeLabel: string;
  type: "image" | "archive" | "document" | "generic";
  progress: number;
  status: "queued" | "uploading" | "complete" | "error";
  message: string;
}

interface UploadModalProps {
  onUploadChange?: (items: UploadItem[]) => void;
}

const initialItems: UploadItem[] = ${JSON.stringify(config.pendingUploads, null, 2)};

// Baked-in CSS variable tokens — update these to reskin the UploadModal
const upmVars: CSSProperties = {
  "--upm-overlay":               "${config.overlayColor}",
  "--upm-panel-bg":              "${config.panelBackground}",
  "--upm-panel-border":          "${config.panelBorderColor}",
  "--upm-radius":                "${config.borderRadius}px",
  "--upm-title-color":           "${config.titleColor}",
  "--upm-subtitle-color":        "${config.subtitleColor}",
  "--upm-footer-bg":             "${config.footerBackground}",
  "--upm-close-btn-color":       "${config.closeButtonColor}",
  "--upm-dropzone-bg":           "${config.dropzoneBackground}",
  "--upm-dropzone-active-bg":    "${config.dropzoneActiveBackground}",
  "--upm-dropzone-border":       "${config.dropzoneBorderColor}",
  "--upm-dropzone-icon-bg":      "${config.dropzoneIconBackground}",
  "--upm-dropzone-icon-color":   "${config.dropzoneIconColor}",
  "--upm-dropzone-title-color":  "${config.dropzoneTitleColor}",
  "--upm-dropzone-text-color":   "${config.dropzoneTextColor}",
  "--upm-browse-btn-bg":         "${config.browseButtonBackground}",
  "--upm-browse-btn-text":       "${config.browseButtonTextColor}",
  "--upm-section-label-color":   "${config.sectionLabelColor}",
  "--upm-clear-action-color":    "${config.clearActionColor}",
  "--upm-item-bg":               "${config.itemBackground}",
  "--upm-item-border":           "${config.itemBorderColor}",
  "--upm-item-icon-bg":          "${config.itemIconBackground}",
  "--upm-item-icon-color":       "${config.itemIconColor}",
  "--upm-item-title-color":      "${config.itemTitleColor}",
  "--upm-item-meta-color":       "${config.itemMetaColor}",
  "--upm-error-bg":              "${config.errorBackground}",
  "--upm-error-border":          "${config.errorBorderColor}",
  "--upm-error-text":            "${config.errorTextColor}",
  "--upm-progress-track":        "${config.progressTrackColor}",
  "--upm-progress-fill":         "${config.progressFillColor}",
  "--upm-cancel-btn-bg":         "${config.cancelButtonBackground}",
  "--upm-cancel-btn-text":       "${config.cancelButtonTextColor}",
  "--upm-action-btn-bg":         "${config.actionButtonBackground}",
  "--upm-action-btn-text":       "${config.actionButtonTextColor}",
  "--upm-modal-width":           "${config.modalWidth}px",
} as CSSProperties;

export default function UploadModal({ onUploadChange }: UploadModalProps) {
  const [items, setItems] = useState<UploadItem[]>(initialItems);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = Math.max(${config.quotaTotal} - ${config.quotaUsed}, 0).toFixed(1);
  const pendingCount = items.filter((item) => item.status !== "complete").length;

  const dropzoneBg = useMemo(
    () => isDragging ? "var(--upm-dropzone-active-bg)" : "var(--upm-dropzone-bg)",
    [isDragging]
  );

  function inferType(name: string): UploadItem["type"] {
    const lower = name.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].some((ext) => lower.endsWith('.' + ext))) return "image";
    if (["zip", "rar", "7z", "tar"].some((ext) => lower.endsWith('.' + ext))) return "archive";
    if (["pdf", "doc", "docx", "txt", "md"].some((ext) => lower.endsWith('.' + ext))) return "document";
    return "generic";
  }

  function pushFiles(files: FileList): void {
    const next: UploadItem[] = Array.from(files).map((file, index) => ({
      id: file.name + '-' + file.size + '-' + index + '-' + Date.now(),
      name: file.name,
      sizeLabel: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      type: inferType(file.name),
      progress: 0,
      status: "queued",
      message: "Waiting...",
    }));
    const merged = [...next, ...items];
    setItems(merged);
    if (onUploadChange) onUploadChange(merged);
  }

  function startUpload(): void {
    const updated = items.map((item) => {
      if (item.status === "error" || item.status === "complete") return item;
      const progress = item.status === "uploading" ? Math.min(item.progress + 20, 100) : 35;
      return {
        ...item,
        status: (progress >= 100 ? "complete" : "uploading") as UploadItem["status"],
        progress,
        message: progress >= 100 ? "Uploaded" : progress + "% completed",
      };
    });
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function removeItem(id: string): void {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  function retryItem(id: string): void {
    const updated = items.map((item) => item.id === id ? { ...item, status: "queued" as UploadItem["status"], progress: 0, message: "Waiting..." } : item);
    setItems(updated);
    if (onUploadChange) onUploadChange(updated);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 font-sans"
      style={{ ...upmVars, background: "var(--upm-overlay)", backdropFilter: "blur(12px)" }}
    >
      ${
        config.animateOpen
          ? `<style>{\`
        @keyframes upmIn {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .upm-animated { animation: upmIn 260ms cubic-bezier(.2,.8,.2,1); }
      \`}</style>`
          : ""
      }
      <div
        className={"w-full overflow-hidden border border-[var(--upm-panel-border)] bg-[var(--upm-panel-bg)] text-[var(--upm-title-color)] rounded-[var(--upm-radius)]" + (${config.animateOpen} ? " upm-animated" : "")}
        style={{ maxWidth: "var(--upm-modal-width)", boxShadow: "${shadow}" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-[var(--upm-panel-border)]">
          <div>
            <h2 className="m-0 text-[28px] leading-tight">Upload files</h2>
            <p className="mt-1.5 mb-0 text-[var(--upm-subtitle-color)] text-[14px]">Add files to your shared workspace folder</p>
          </div>
          <button
            className="bg-transparent border-none cursor-pointer text-[var(--upm-close-btn-color)] text-[20px] w-10 h-10 rounded-full flex items-center justify-center"
            aria-label="Close upload modal"
          >×</button>
        </div>

        {/* Body */}
        <div className="p-6 grid gap-5">
          {/* Dropzone */}
          <div
            className="border border-dashed border-[var(--upm-dropzone-border)] rounded-3xl py-9 px-9 text-center flex flex-col items-center cursor-pointer transition-[background,transform] duration-[160ms] ease-linear"
            style={{ background: dropzoneBg, transform: isDragging ? "scale(1.01)" : "scale(1)" }}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) pushFiles(e.dataTransfer.files); }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.length && pushFiles(e.target.files)}
            />
            <div className="w-16 h-16 rounded-full grid place-items-center mb-4 bg-[var(--upm-dropzone-icon-bg)] text-[var(--upm-dropzone-icon-color)] text-[28px] shrink-0">↑</div>
            <p className="m-0 text-[20px] font-bold text-[var(--upm-dropzone-title-color)]">Drag and drop your files here</p>
            <p className="mt-2 mb-0 text-[var(--upm-dropzone-text-color)] text-[14px]">Support for PDF, JPG, PNG, DOCX, and ZIP up to 50MB</p>
            <button className="mt-5 border-none rounded-[14px] px-[18px] py-3 font-bold cursor-pointer bg-[var(--upm-browse-btn-bg)] text-[var(--upm-browse-btn-text)]">
              Browse files
            </button>
          </div>

          {/* Section head */}
          <div className="flex items-center justify-between gap-3">
            <p className="m-0 text-[var(--upm-section-label-color)] text-[12px] uppercase tracking-[0.12em] font-bold">
              Pending uploads ({pendingCount})
            </p>
            <button
              className="bg-transparent border-none cursor-pointer text-[var(--upm-clear-action-color)] font-bold"
              onClick={() => { setItems([]); if (onUploadChange) onUploadChange([]); }}
            >Clear all</button>
          </div>

          {/* List */}
          <div className="grid gap-3.5">
            {items.map((item) => {
              const isError = item.status === "error";
              let itemCls = "border rounded-[18px] p-4 grid gap-2.5";
              if (isError) {
                itemCls += " bg-[var(--upm-error-bg)] border-[var(--upm-error-border)]";
              } else {
                itemCls += " bg-[var(--upm-item-bg)] border-[var(--upm-item-border)]";
              }
              const iconCls = "w-10 h-10 rounded-xl grid place-items-center text-[11px] font-extrabold shrink-0 " +
                (isError
                  ? "bg-[var(--upm-error-border)] text-[var(--upm-error-text)]"
                  : "bg-[var(--upm-item-icon-bg)] text-[var(--upm-item-icon-color)]");

              return (
                <div key={item.id} className={itemCls}>
                  <div className="flex items-center justify-between gap-3">
                    <div className={iconCls}>
                      {item.type === "image" ? "IMG" : item.type === "document" ? "DOC" : item.type === "archive" ? "ZIP" : "FILE"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="m-0 font-bold text-[var(--upm-item-title-color)] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === "error" ? (
                            <button
                              className="bg-transparent border-none cursor-pointer text-[var(--upm-clear-action-color)] font-bold"
                              onClick={() => retryItem(item.id)}
                            >Retry</button>
                          ) : null}
                          <button
                            className="bg-transparent border-none cursor-pointer text-[var(--upm-close-btn-color)]"
                            onClick={() => removeItem(item.id)}
                          >×</button>
                        </div>
                      </div>
                      <p className={"mt-1 mb-0 text-[13px] " + (isError ? "text-[var(--upm-error-text)]" : "text-[var(--upm-item-meta-color)]")}>
                        {item.sizeLabel} • {item.message}
                      </p>
                    </div>
                  </div>
                  {(item.status === "uploading" || item.status === "complete") ? (
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-[var(--upm-progress-track)]">
                      <span
                        className="block h-full rounded-full bg-[var(--upm-progress-fill)] transition-[width] duration-[180ms] ease-linear"
                        style={{ width: item.progress + "%" }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-[var(--upm-panel-border)] bg-[var(--upm-footer-bg)] flex-wrap">
          <p className="mt-0 mb-0 text-[var(--upm-subtitle-color)] text-[14px]">Remaining quota: {remaining} GB</p>
          <div className="flex items-center gap-3">
            <button className="border-none rounded-[14px] px-[18px] py-3 font-bold cursor-pointer bg-[var(--upm-cancel-btn-bg)] text-[var(--upm-cancel-btn-text)]">
              Cancel
            </button>
            <button
              className="border-none rounded-[14px] px-[18px] py-3 font-bold cursor-pointer bg-[var(--upm-action-btn-bg)] text-[var(--upm-action-btn-text)]"
              onClick={startUpload}
            >
              Start upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}
