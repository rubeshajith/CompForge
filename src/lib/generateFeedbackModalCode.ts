import { FeedbackModalConfig } from "./feedbackModalConfig";

export function generateFeedbackModalJSX(config: FeedbackModalConfig): string {
  const c = config;
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none";

  return `import { useState, useRef, useCallback } from "react";
import "./FeedbackModal.css";

export function FeedbackModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [issueType, setIssueType] = useState("bug");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  const handleFiles = useCallback((files) => {
    if (!files) return;
    const newFiles = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const id = Math.random().toString(36).slice(2);
      const preview = URL.createObjectURL(file);
      newFiles.push({ id, name: file.name, preview });
    });
    setAttachments((prev) => [...prev, ...newFiles].slice(0, 6));
  }, []);

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const starColor = (index) => {
    const active = hoverRating || rating;
    if (index <= active) return hoverRating ? "${c.starHoverColor}" : "${c.starFilledColor}";
    return "${c.starEmptyColor}";
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ rating, issueType, details, attachments });
    if (onClose) onClose();
  };

  return (
    <div className="fm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="fm-modal${c.animateOpen ? " fm-modal--animate" : ""}">
        {/* Header */}
        <div className="fm-header">
          <div className="fm-header__left">
            <svg className="fm-header__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="fm-header__title">Submit Feedback</span>
          </div>
          <button className="fm-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="fm-body">
          {/* Star Rating */}
          <div className="fm-field">
            <label className="fm-label">How satisfied are you?</label>
            <div className="fm-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={\`fm-star\${i <= (hoverRating || rating) ? " fm-star--active" : ""}\`}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <svg width="${c.starSize}" height="${c.starSize}" viewBox="0 0 24 24" fill={starColor(i)}>
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      stroke={starColor(i) === "${c.starEmptyColor}" ? "${c.modalBorderColor}" : "none"}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {(i === 1 || i === 5) && (
                    <span className="fm-star__label">{i === 1 ? "Poor" : "Great"}</span>
                  )}
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span className="fm-rating-label">{ratingLabels[hoverRating || rating]}</span>
              )}
            </div>
          </div>

          {/* Issue Type */}
          <div className="fm-field">
            <label className="fm-label">Issue Type</label>
            <div className="fm-select-wrap">
              <select className="fm-select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="usability">Usability Issue</option>
                <option value="other">Other Feedback</option>
              </select>
              <svg className="fm-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>

          {/* Details */}
          <div className="fm-field">
            <label className="fm-label">Details</label>
            <textarea
              className="fm-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened or what you'd like to see..."
              rows={4}
            />
          </div>

          {/* Attachments */}
          <div className="fm-field">
            <div className="fm-attach-header">
              <label className="fm-label">Attachments <span className="fm-label--soft">(optional)</span></label>
              <span className="fm-attach-count">{attachments.length}/6</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
            <div className="fm-attach-list">
              {attachments.length < 6 && (
                <button
                  type="button"
                  className={\`fm-attach-btn\${isDragging ? " fm-attach-btn--drag" : ""}\`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                  </svg>
                  Attach Screenshot
                </button>
              )}
              {attachments.map((file) => (
                <div key={file.id} className="fm-thumb">
                  <img src={file.preview} alt={file.name} className="fm-thumb__img" />
                  <button className="fm-thumb__remove" onClick={() => removeAttachment(file.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fm-footer">
          <div className="fm-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Feedback is anonymous
          </div>
          <div className="fm-actions">
            <button className="fm-btn fm-btn--cancel" onClick={onClose}>Cancel</button>
            <button className="fm-btn fm-btn--submit" onClick={handleSubmit}>Send Feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

export function generateFeedbackModalCSS(config: FeedbackModalConfig): string {
  const c = config;
  const shadow = c.showShadow ? "0 8px 48px rgba(0,0,0,0.6)" : "none";

  return `/* FeedbackModal.css */

.fm-backdrop {
  position: fixed;
  inset: 0;
  background: ${c.backdropColor};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 999;
  font-family: ${c.fontFamily};
  font-size: ${c.fontSize}px;
}

@keyframes fm-slide-in {
  from { opacity: 0; transform: scale(0.94) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

.fm-modal {
  width: 100%;
  max-width: ${c.modalWidth}px;
  background: ${c.modalBackground};
  border: 1px solid ${c.modalBorderColor};
  border-radius: ${c.modalBorderRadius}px;
  box-shadow: ${shadow};
  overflow: hidden;
}

.fm-modal--animate {
  animation: fm-slide-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Header */
.fm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${c.headerBackground};
  border-bottom: 1px solid ${c.headerBorderColor};
}

.fm-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fm-header__icon {
  color: ${c.headerIconColor};
  flex-shrink: 0;
}

.fm-header__title {
  color: ${c.headerTextColor};
  font-weight: 600;
  font-size: ${c.fontSize + 1}px;
  letter-spacing: -0.01em;
}

.fm-close {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: ${c.closeButtonColor};
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.fm-close:hover {
  background: ${c.closeButtonHoverBackground};
  color: ${c.headerTextColor};
}

/* Body */
.fm-body {
  padding: 20px;
  background: ${c.bodyBackground};
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fm-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fm-label {
  color: ${c.labelColor};
  font-size: ${c.fontSize - 1}px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.fm-label--soft {
  text-transform: none;
  font-weight: 400;
  opacity: 0.7;
}

/* Stars */
.fm-stars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fm-star {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.1s;
}

.fm-star:hover,
.fm-star--active {
  transform: scale(1.15);
}

.fm-star svg {
  transition: fill 0.15s, filter 0.15s;
}

.fm-star--active svg {
  filter: drop-shadow(0 0 6px ${c.starFilledColor}66);
}

.fm-star__label {
  font-size: 10px;
  color: ${c.labelColor};
  font-weight: 500;
}

.fm-star--active .fm-star__label {
  color: ${c.starFilledColor};
}

.fm-rating-label {
  margin-left: 8px;
  color: ${c.starFilledColor};
  font-size: ${c.fontSize - 1}px;
  font-weight: 500;
  opacity: 0.9;
}

/* Select */
.fm-select-wrap {
  position: relative;
}

.fm-select {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 14px;
  background: ${c.inputBackground};
  border: 1px solid ${c.inputBorderColor};
  border-radius: ${c.inputBorderRadius}px;
  color: ${c.inputTextColor};
  font-size: ${c.fontSize}px;
  font-family: ${c.fontFamily};
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.fm-select:focus {
  border-color: ${c.inputFocusBorderColor};
  box-shadow: 0 0 0 3px ${c.inputFocusBorderColor}22;
}

.fm-select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${c.labelColor};
}

/* Textarea */
.fm-textarea {
  width: 100%;
  padding: 12px 14px;
  background: ${c.inputBackground};
  border: 1px solid ${c.inputBorderColor};
  border-radius: ${c.inputBorderRadius}px;
  color: ${c.inputTextColor};
  font-size: ${c.fontSize}px;
  font-family: ${c.fontFamily};
  resize: none;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.fm-textarea::placeholder {
  color: ${c.inputPlaceholderColor};
}

.fm-textarea:focus {
  border-color: ${c.inputFocusBorderColor};
  box-shadow: 0 0 0 3px ${c.inputFocusBorderColor}22;
}

/* Attachments */
.fm-attach-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fm-attach-count {
  color: ${c.labelColor};
  font-size: ${c.fontSize - 1}px;
}

.fm-attach-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.fm-attach-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${c.attachButtonBackground};
  border: 1.5px dashed ${c.attachButtonBorderColor};
  border-radius: ${c.inputBorderRadius}px;
  color: ${c.attachButtonTextColor};
  font-size: ${c.fontSize}px;
  font-family: ${c.fontFamily};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.fm-attach-btn:hover,
.fm-attach-btn--drag {
  background: ${c.attachButtonHoverBackground};
  border-color: ${c.inputFocusBorderColor};
}

.fm-thumb {
  position: relative;
  width: 56px;
  height: 56px;
}

.fm-thumb__img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${c.thumbnailBorderColor};
  display: block;
}

.fm-thumb__remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${c.removeBtnBackground};
  color: ${c.removeBtnTextColor};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s, transform 0.15s;
}

.fm-thumb:hover .fm-thumb__remove {
  opacity: 1;
  transform: scale(1);
}

/* Footer */
.fm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: ${c.footerBackground};
  border-top: 1px solid ${c.footerBorderColor};
  gap: 12px;
}

.fm-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${c.badgeBackground};
  border-radius: 100px;
  color: ${c.badgeTextColor};
  font-size: ${c.fontSize - 1}px;
  font-weight: 500;
}

.fm-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: ${c.inputBorderRadius}px;
  font-size: ${c.fontSize}px;
  font-family: ${c.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s;
}

.fm-btn--cancel {
  background: transparent;
  color: ${c.cancelTextColor};
}

.fm-btn--cancel:hover {
  background: ${c.cancelHoverBackground};
  color: ${c.headerTextColor};
}

.fm-btn--submit {
  padding: 8px 20px;
  background: ${c.submitBackground};
  color: ${c.submitTextColor};
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: 0 2px 12px ${c.submitBackground}55;
}

.fm-btn--submit:hover {
  background: ${c.submitHoverBackground};
  box-shadow: 0 4px 20px ${c.submitBackground}66;
}

.fm-btn--submit:active {
  transform: scale(0.97);
}
`;
}
