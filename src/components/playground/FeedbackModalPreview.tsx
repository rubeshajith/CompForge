"use client";

import { useState, useRef, useCallback } from "react";
import { FeedbackModalConfig } from "@/lib/feedbackModalConfig";

interface FeedbackModalPreviewProps {
  config: FeedbackModalConfig;
}

interface AttachedFile {
  id: string;
  name: string;
  preview: string;
}

export function FeedbackModalPreview({ config: c }: FeedbackModalPreviewProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [issueType, setIssueType] = useState("bug");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none";

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: AttachedFile[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const id = Math.random().toString(36).slice(2);
      const preview = URL.createObjectURL(file);
      newFiles.push({ id, name: file.name, preview });
    });
    setAttachments((prev) => [...prev, ...newFiles].slice(0, 6));
  }, []);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const starColor = (index: number) => {
    const active = hoverRating || rating;
    if (index <= active)
      return hoverRating ? c.starHoverColor : c.starFilledColor;
    return c.starEmptyColor;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: c.fontFamily,
        fontSize: c.fontSize,
      }}
    >
      {/* Backdrop blur hint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: c.backdropColor,
          backdropFilter: "blur(4px)",
          borderRadius: "inherit",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: c.modalWidth,
          background: c.modalBackground,
          border: `1px solid ${c.modalBorderColor}`,
          borderRadius: c.modalBorderRadius,
          boxShadow: shadow,
          overflow: "hidden",
          animation: c.animateOpen
            ? "fm-slide-in 0.25s cubic-bezier(0.34,1.56,0.64,1)"
            : "none",
        }}
      >
        <style>{`
          @keyframes fm-slide-in {
            from { opacity: 0; transform: scale(0.94) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: c.headerBackground,
            borderBottom: `1px solid ${c.headerBorderColor}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.headerIconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span
              style={{
                color: c.headerTextColor,
                fontWeight: 600,
                fontSize: c.fontSize + 1,
                letterSpacing: "-0.01em",
              }}
            >
              Submit Feedback
            </span>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: c.closeButtonColor,
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                c.closeButtonHoverBackground;
              (e.currentTarget as HTMLButtonElement).style.color =
                c.headerTextColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                c.closeButtonColor;
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px",
            background: c.bodyBackground,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Star Rating */}
          <div>
            <label
              style={{
                display: "block",
                color: c.labelColor,
                fontSize: c.fontSize - 1,
                marginBottom: 10,
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              How satisfied are you?
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 2,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "transform 0.1s",
                    transform: hoverRating === i ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <svg
                    width={c.starSize}
                    height={c.starSize}
                    viewBox="0 0 24 24"
                    fill={starColor(i)}
                    style={{
                      transition: "fill 0.15s, filter 0.15s",
                      filter:
                        i <= (hoverRating || rating)
                          ? `drop-shadow(0 0 6px ${c.starFilledColor}66)`
                          : "none",
                    }}
                  >
                    <polygon
                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      stroke={
                        starColor(i) === c.starEmptyColor
                          ? c.modalBorderColor
                          : "none"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {(i === 1 || i === 5) && (
                    <span
                      style={{
                        fontSize: 10,
                        color:
                          i <= (hoverRating || rating)
                            ? c.starFilledColor
                            : c.labelColor,
                        fontWeight: 500,
                      }}
                    >
                      {i === 1 ? "Poor" : "Great"}
                    </span>
                  )}
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    color: c.starFilledColor,
                    fontSize: c.fontSize - 1,
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {ratingLabels[hoverRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Issue Type */}
          <div>
            <label
              style={{
                display: "block",
                color: c.labelColor,
                fontSize: c.fontSize - 1,
                marginBottom: 6,
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Issue Type
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={{
                  width: "100%",
                  height: 42,
                  padding: "0 36px 0 14px",
                  background: c.inputBackground,
                  border: `1px solid ${c.inputBorderColor}`,
                  borderRadius: c.inputBorderRadius,
                  color: c.inputTextColor,
                  fontSize: c.fontSize,
                  fontFamily: c.fontFamily,
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = c.inputFocusBorderColor;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${c.inputFocusBorderColor}22`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = c.inputBorderColor;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="usability">Usability Issue</option>
                <option value="other">Other Feedback</option>
              </select>
              <svg
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={c.labelColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Details textarea */}
          <div>
            <label
              style={{
                display: "block",
                color: c.labelColor,
                fontSize: c.fontSize - 1,
                marginBottom: 6,
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened or what you'd like to see..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: c.inputBackground,
                border: `1px solid ${c.inputBorderColor}`,
                borderRadius: c.inputBorderRadius,
                color: c.inputTextColor,
                fontSize: c.fontSize,
                fontFamily: c.fontFamily,
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = c.inputFocusBorderColor;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${c.inputFocusBorderColor}22`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = c.inputBorderColor;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Attachments */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  color: c.labelColor,
                  fontSize: c.fontSize - 1,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Attachments{" "}
                <span
                  style={{
                    textTransform: "none",
                    fontWeight: 400,
                    opacity: 0.7,
                  }}
                >
                  (optional)
                </span>
              </label>
              <span style={{ color: c.labelColor, fontSize: c.fontSize - 1 }}>
                Max 5MB · {attachments.length}/6
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              {/* Upload button / drop zone */}
              {attachments.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    background: isDragging
                      ? c.attachButtonHoverBackground
                      : c.attachButtonBackground,
                    border: `1.5px dashed ${isDragging ? c.inputFocusBorderColor : c.attachButtonBorderColor}`,
                    borderRadius: c.inputBorderRadius,
                    color: c.attachButtonTextColor,
                    fontSize: c.fontSize,
                    fontFamily: c.fontFamily,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      c.attachButtonHoverBackground;
                  }}
                  onMouseLeave={(e) => {
                    if (!isDragging)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        c.attachButtonBackground;
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  Attach Screenshot
                </button>
              )}

              {/* Thumbnails */}
              {attachments.map((file) => (
                <div
                  key={file.id}
                  style={{
                    position: "relative",
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    overflow: "visible",
                  }}
                  className="fm-thumb-group"
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: `1px solid ${c.thumbnailBorderColor}`,
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(file.id)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: c.removeBtnBackground,
                      color: c.removeBtnTextColor,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: c.footerBackground,
            borderTop: `1px solid ${c.footerBorderColor}`,
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: c.badgeBackground,
              borderRadius: 100,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.badgeTextColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span
              style={{
                color: c.badgeTextColor,
                fontSize: c.fontSize - 1,
                fontWeight: 500,
              }}
            >
              Feedback is anonymous
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderRadius: c.inputBorderRadius,
                color: c.cancelTextColor,
                fontSize: c.fontSize,
                fontFamily: c.fontFamily,
                cursor: "pointer",
                fontWeight: 500,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  c.cancelHoverBackground;
                (e.currentTarget as HTMLButtonElement).style.color =
                  c.headerTextColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  c.cancelTextColor;
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{
                padding: "8px 20px",
                background: c.submitBackground,
                border: "none",
                borderRadius: c.inputBorderRadius,
                color: c.submitTextColor,
                fontSize: c.fontSize,
                fontFamily: c.fontFamily,
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                transition:
                  "background 0.15s, transform 0.1s, box-shadow 0.15s",
                boxShadow: `0 2px 12px ${c.submitBackground}55`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  c.submitHoverBackground;
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 4px 20px ${c.submitBackground}66`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  c.submitBackground;
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 2px 12px ${c.submitBackground}55`;
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.97)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
