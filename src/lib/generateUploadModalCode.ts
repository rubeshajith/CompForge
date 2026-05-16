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
