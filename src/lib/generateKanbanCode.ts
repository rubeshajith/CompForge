import { KanbanConfig, ALL_COLUMNS, DEFAULT_CARDS } from "./kanbanConfig";

export function generateKanbanJSX(config: KanbanConfig): string {
  const visibleCols = ALL_COLUMNS.slice(0, config.columnCount);
  const colIds = visibleCols.map((c) => `"${c.id}"`).join(", ");

  return `import { useState, useRef } from "react";
import "./KanbanBoard.css";

const COLUMNS = [
${visibleCols.map((c) => `  { id: "${c.id}", label: "${c.label}" }`).join(",\n")}
];

const INITIAL_CARDS = [
${DEFAULT_CARDS.filter((c) => visibleCols.some((col) => col.id === c.columnId))
  .map(
    (c) =>
      `  { id: "${c.id}", columnId: "${c.columnId}", title: "${c.title}", desc: "${c.desc}", priority: "${c.priority}", tag: "${c.tag}", progress: ${c.progress}, attachments: ${c.attachments}, comments: ${c.comments} }`,
  )
  .join(",\n")}
];

function PriorityBadge({ priority }) {
  const styles = {
    high:   { background: "${config.priorityHighBg}",   color: "${config.priorityHighText}" },
    medium: { background: "${config.priorityMediumBg}", color: "${config.priorityMediumText}" },
    low:    { background: "${config.priorityLowBg}",    color: "${config.priorityLowText}" },
  };
  return <span className="kb__badge" style={styles[priority]}>{priority}</span>;
}

function TagBadge({ label }) {
  return (
    <span className="kb__badge" style={{ background: "${config.tagBg}", color: "${config.tagText}" }}>
      {label}
    </span>
  );
}

function KanbanCard({ card, onDragStart, isDragging }) {
  const isDone = card.progress === 100;
  return (
    <article
      className={\`kb__card\${isDragging ? " kb__card--dragging" : ""}\`}
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart(); }}
    >
      <div className="kb__card-badges">
        <PriorityBadge priority={card.priority} />
        <TagBadge label={card.tag} />
      </div>
      <h3 className="kb__card-title">{card.title}</h3>
      <p className="kb__card-desc">{card.desc}</p>
      <div className="kb__progress">
        <div className="kb__progress-header">
          <span>{isDone ? "Done ✓" : "Progress"}</span>
          <span>{card.progress}%</span>
        </div>
        <div className="kb__progress-track">
          <div
            className="kb__progress-fill"
            style={{
              width: card.progress + "%",
              background: isDone ? "${config.progressFillColorDone}" : "${config.progressFillColor}"
            }}
          />
        </div>
      </div>
      <div className="kb__card-footer">
        <div className="kb__meta">
          <span>📎 {card.attachments}</span>
          <span>💬 {card.comments}</span>
        </div>
      </div>
    </article>
  );
}

function KanbanColumn({ col, cards, draggingId, onDragStart, onDrop }) {
  const [isOver, setIsOver] = useState(false);
  const enterCount = useRef(0);

  return (
    <section
      className={\`kb__col\${isOver ? " kb__col--over" : ""}\`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDragEnter={() => { enterCount.current++; setIsOver(true); }}
      onDragLeave={() => { enterCount.current--; if (enterCount.current <= 0) { enterCount.current = 0; setIsOver(false); } }}
      onDrop={(e) => { e.preventDefault(); enterCount.current = 0; setIsOver(false); onDrop(col.id); }}
    >
      <header className="kb__col-header">
        <span className="kb__col-label">{col.label}</span>
        <span className="kb__col-count">{cards.length}</span>
      </header>
      <div className="kb__col-body">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggingId === card.id}
            onDragStart={() => onDragStart(card.id)}
          />
        ))}
      </div>
      <button className="kb__add-btn">+ Add task</button>
    </section>
  );
}

export function KanbanBoard({ onCardMove } = {}) {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [draggingId, setDraggingId] = useState(null);

  function handleDrop(targetColId) {
    if (!draggingId) return;
    setCards((prev) =>
      prev.map((c) => c.id === draggingId ? { ...c, columnId: targetColId } : c)
    );
    onCardMove?.({ cardId: draggingId, newColumnId: targetColId });
    setDraggingId(null);
  }

  return (
    <div className="kb" onDragEnd={() => setDraggingId(null)}>
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          col={col}
          cards={cards.filter((c) => c.columnId === col.id)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
`;
}

export function generateKanbanCSS(config: KanbanConfig): string {
  return `/* ── Kanban Board ── */

.kb {
  display: flex;
  gap: ${config.boardGap}px;
  padding: 24px;
  background: ${config.boardBackground};
  min-height: 100%;
  align-items: flex-start;
  box-sizing: border-box;
  overflow-x: auto;
}

/* ── Column ── */

.kb__col {
  width: ${config.columnWidth}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: ${config.columnBackground};
  border: 1px solid ${config.columnBorderColor};
  border-radius: ${config.columnBorderRadius}px;
  padding: 14px 12px;
  transition: border-color 0.15s;
}

.kb__col--over {
  border-color: ${config.cardHoverBorderColor};
  background: ${config.cardHoverBorderColor}08;
}

.kb__col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.kb__col-label {
  font-size: ${config.columnHeaderFontSize}px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  color: ${config.columnHeaderTextColor};
  letter-spacing: 0.01em;
}

.kb__col-count {
  background: ${config.columnCountBadgeBackground};
  color: ${config.columnCountBadgeColor};
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
}

.kb__col-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${config.cardGap}px;
  min-height: 40px;
}

/* ── Card ── */

.kb__card {
  background: ${config.cardBackground};
  border: 1px solid ${config.cardBorderColor};
  border-radius: ${config.cardBorderRadius}px;
  padding: ${config.cardPadding}px;
  cursor: grab;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  ${config.cardShadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.25);" : ""}
  user-select: none;
}

.kb__card:hover {
  border-color: ${config.cardHoverBorderColor};
}

.kb__card--dragging {
  opacity: 0.5;
  transform: ${config.cardDragRotation ? "rotate(2deg) scale(1.03)" : "scale(1.03)"};
  ${config.cardShadow ? "box-shadow: 0 20px 40px rgba(0,0,0,0.4);" : ""}
}

.kb__card-badges {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.kb__card-title {
  margin: 0 0 4px;
  font-size: ${config.cardTitleFontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 600;
  color: ${config.cardTitleColor};
  line-height: 1.4;
}

.kb__card-desc {
  margin: 0 0 12px;
  font-size: ${config.cardDescFontSize}px;
  font-family: 'Instrument Sans', sans-serif;
  color: ${config.cardDescColor};
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.kb__card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* ── Badge ── */

.kb__badge {
  font-size: 9px;
  font-family: 'DM Mono', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 7px;
  border-radius: 5px;
}

/* ── Progress ── */

.kb__progress {
  margin-bottom: 12px;
}

.kb__progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  font-family: 'DM Mono', monospace;
  color: ${config.metaTextColor};
  margin-bottom: 5px;
}

.kb__progress-track {
  height: 4px;
  border-radius: 99px;
  background: ${config.progressTrackColor};
  overflow: hidden;
}

.kb__progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s;
}

/* ── Meta ── */

.kb__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: ${config.metaTextColor};
}

/* ── Add button ── */

.kb__add-btn {
  margin-top: 12px;
  width: 100%;
  padding: 9px;
  background: transparent;
  border: 1.5px dashed ${config.addBtnBorderColor};
  border-radius: 8px;
  color: ${config.addBtnTextColor};
  font-size: 11px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.kb__add-btn:hover {
  background: ${config.addBtnHoverBg};
  border-color: ${config.cardHoverBorderColor};
}
`;
}

// ─── TSX + CSS ────────────────────────

export function generateKanbanTSX(config: KanbanConfig): string {
  const visibleCols = ALL_COLUMNS.slice(0, config.columnCount);

  return `import { useState, useRef } from "react";
import "./KanbanBoard.css";

interface CardData {
  id: string;
  columnId: string;
  title: string;
  desc: string;
  priority: "high" | "medium" | "low";
  tag: string;
  progress: number;
  attachments: number;
  comments: number;
}

interface ColumnData {
  id: string;
  label: string;
}

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
}

interface TagBadgeProps {
  label: string;
}

interface KanbanCardProps {
  card: CardData;
  onDragStart: () => void;
  isDragging: boolean;
}

interface KanbanColumnProps {
  col: ColumnData;
  cards: CardData[];
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (colId: string) => void;
}

interface KanbanBoardProps {
  onCardMove?: (info: { cardId: string; newColumnId: string }) => void;
}

const COLUMNS: ColumnData[] = [
${visibleCols.map((c) => `  { id: "${c.id}", label: "${c.label}" }`).join(",\n")}
];

const INITIAL_CARDS: CardData[] = [
${DEFAULT_CARDS.filter((c) => visibleCols.some((col) => col.id === c.columnId))
  .map(
    (c) =>
      `  { id: "${c.id}", columnId: "${c.columnId}", title: "${c.title}", desc: "${c.desc}", priority: "${c.priority}", tag: "${c.tag}", progress: ${c.progress}, attachments: ${c.attachments}, comments: ${c.comments} }`,
  )
  .join(",\n")}
];

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles: Record<string, { background: string; color: string }> = {
    high:   { background: "${config.priorityHighBg}",   color: "${config.priorityHighText}" },
    medium: { background: "${config.priorityMediumBg}", color: "${config.priorityMediumText}" },
    low:    { background: "${config.priorityLowBg}",    color: "${config.priorityLowText}" },
  };
  return <span className="kb__badge" style={styles[priority]}>{priority}</span>;
}

function TagBadge({ label }: TagBadgeProps) {
  return (
    <span className="kb__badge" style={{ background: "${config.tagBg}", color: "${config.tagText}" }}>
      {label}
    </span>
  );
}

function KanbanCard({ card, onDragStart, isDragging }: KanbanCardProps) {
  const isDone = card.progress === 100;
  return (
    <article
      className={\`kb__card\${isDragging ? " kb__card--dragging" : ""}\`}
      draggable
      onDragStart={(e: React.DragEvent<HTMLElement>) => { e.dataTransfer.effectAllowed = "move"; onDragStart(); }}
    >
      <div className="kb__card-badges">
        <PriorityBadge priority={card.priority} />
        <TagBadge label={card.tag} />
      </div>
      <h3 className="kb__card-title">{card.title}</h3>
      <p className="kb__card-desc">{card.desc}</p>
      <div className="kb__progress">
        <div className="kb__progress-header">
          <span>{isDone ? "Done ✓" : "Progress"}</span>
          <span>{card.progress}%</span>
        </div>
        <div className="kb__progress-track">
          <div
            className="kb__progress-fill"
            style={{
              width: card.progress + "%",
              background: isDone ? "${config.progressFillColorDone}" : "${config.progressFillColor}"
            }}
          />
        </div>
      </div>
      <div className="kb__card-footer">
        <div className="kb__meta">
          <span>📎 {card.attachments}</span>
          <span>💬 {card.comments}</span>
        </div>
      </div>
    </article>
  );
}

function KanbanColumn({ col, cards, draggingId, onDragStart, onDrop }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState<boolean>(false);
  const enterCount = useRef<number>(0);

  return (
    <section
      className={\`kb__col\${isOver ? " kb__col--over" : ""}\`}
      onDragOver={(e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDragEnter={() => { enterCount.current++; setIsOver(true); }}
      onDragLeave={() => { enterCount.current--; if (enterCount.current <= 0) { enterCount.current = 0; setIsOver(false); } }}
      onDrop={(e: React.DragEvent<HTMLElement>) => { e.preventDefault(); enterCount.current = 0; setIsOver(false); onDrop(col.id); }}
    >
      <header className="kb__col-header">
        <span className="kb__col-label">{col.label}</span>
        <span className="kb__col-count">{cards.length}</span>
      </header>
      <div className="kb__col-body">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggingId === card.id}
            onDragStart={() => onDragStart(card.id)}
          />
        ))}
      </div>
      <button className="kb__add-btn">+ Add task</button>
    </section>
  );
}

export function KanbanBoard({ onCardMove }: KanbanBoardProps = {}) {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleDrop(targetColId: string): void {
    if (!draggingId) return;
    setCards((prev) =>
      prev.map((c) => c.id === draggingId ? { ...c, columnId: targetColId } : c)
    );
    onCardMove?.({ cardId: draggingId, newColumnId: targetColId });
    setDraggingId(null);
  }

  return (
    <div className="kb" onDragEnd={() => setDraggingId(null)}>
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          col={col}
          cards={cards.filter((c) => c.columnId === col.id)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
`;
}

// ─── TSX + Tailwind ───────────────────

export function generateKanbanTailwind(config: KanbanConfig): string {
  const visibleCols = ALL_COLUMNS.slice(0, config.columnCount);

  const cardShadow = config.cardShadow ? "0 2px 8px rgba(0,0,0,0.25)" : "none";
  const cardDraggingShadow = config.cardShadow
    ? "0 20px 40px rgba(0,0,0,0.4)"
    : "none";
  const cardDragTransform = config.cardDragRotation
    ? "rotate(2deg) scale(1.03)"
    : "scale(1.03)";

  const colHeaderFs = config.columnHeaderFontSize;
  const cardTitleFs = config.cardTitleFontSize;
  const cardDescFs = config.cardDescFontSize;

  return `import { useState, useRef, CSSProperties } from "react";

interface CardData {
  id: string;
  columnId: string;
  title: string;
  desc: string;
  priority: "high" | "medium" | "low";
  tag: string;
  progress: number;
  attachments: number;
  comments: number;
}

interface ColumnData {
  id: string;
  label: string;
}

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
}

interface TagBadgeProps {
  label: string;
}

interface KanbanCardProps {
  card: CardData;
  onDragStart: () => void;
  isDragging: boolean;
}

interface KanbanColumnProps {
  col: ColumnData;
  cards: CardData[];
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (colId: string) => void;
}

interface KanbanBoardProps {
  onCardMove?: (info: { cardId: string; newColumnId: string }) => void;
}

const COLUMNS: ColumnData[] = [
${visibleCols.map((c) => `  { id: "${c.id}", label: "${c.label}" }`).join(",\n")}
];

const INITIAL_CARDS: CardData[] = [
${DEFAULT_CARDS.filter((c) => visibleCols.some((col) => col.id === c.columnId))
  .map(
    (c) =>
      `  { id: "${c.id}", columnId: "${c.columnId}", title: "${c.title}", desc: "${c.desc}", priority: "${c.priority}", tag: "${c.tag}", progress: ${c.progress}, attachments: ${c.attachments}, comments: ${c.comments} }`,
  )
  .join(",\n")}
];

// Baked-in CSS variable tokens — update these to reskin the KanbanBoard
const kbVars: CSSProperties = {
  "--kb-board-bg":              "${config.boardBackground}",
  "--kb-board-gap":             "${config.boardGap}px",
  "--kb-col-bg":                "${config.columnBackground}",
  "--kb-col-border":            "${config.columnBorderColor}",
  "--kb-col-radius":            "${config.columnBorderRadius}px",
  "--kb-col-width":             "${config.columnWidth}px",
  "--kb-col-header-color":      "${config.columnHeaderTextColor}",
  "--kb-col-count-bg":          "${config.columnCountBadgeBackground}",
  "--kb-col-count-color":       "${config.columnCountBadgeColor}",
  "--kb-card-bg":               "${config.cardBackground}",
  "--kb-card-border":           "${config.cardBorderColor}",
  "--kb-card-radius":           "${config.cardBorderRadius}px",
  "--kb-card-padding":          "${config.cardPadding}px",
  "--kb-card-gap":              "${config.cardGap}px",
  "--kb-card-hover-border":     "${config.cardHoverBorderColor}",
  "--kb-card-shadow":           "${cardShadow}",
  "--kb-card-dragging-shadow":  "${cardDraggingShadow}",
  "--kb-card-title-color":      "${config.cardTitleColor}",
  "--kb-card-desc-color":       "${config.cardDescColor}",
  "--kb-priority-high-bg":      "${config.priorityHighBg}",
  "--kb-priority-high-text":    "${config.priorityHighText}",
  "--kb-priority-medium-bg":    "${config.priorityMediumBg}",
  "--kb-priority-medium-text":  "${config.priorityMediumText}",
  "--kb-priority-low-bg":       "${config.priorityLowBg}",
  "--kb-priority-low-text":     "${config.priorityLowText}",
  "--kb-tag-bg":                "${config.tagBg}",
  "--kb-tag-text":              "${config.tagText}",
  "--kb-progress-track":        "${config.progressTrackColor}",
  "--kb-progress-fill":         "${config.progressFillColor}",
  "--kb-progress-fill-done":    "${config.progressFillColorDone}",
  "--kb-meta-color":            "${config.metaTextColor}",
  "--kb-add-btn-border":        "${config.addBtnBorderColor}",
  "--kb-add-btn-color":         "${config.addBtnTextColor}",
  "--kb-add-btn-hover-bg":      "${config.addBtnHoverBg}",
} as CSSProperties;

function PriorityBadge({ priority }: PriorityBadgeProps) {
  let cls = "text-[9px] font-mono font-bold uppercase tracking-[0.06em] px-[7px] py-[3px] rounded-[5px]";
  if (priority === "high") {
    cls += " bg-[var(--kb-priority-high-bg)] text-[var(--kb-priority-high-text)]";
  } else if (priority === "medium") {
    cls += " bg-[var(--kb-priority-medium-bg)] text-[var(--kb-priority-medium-text)]";
  } else {
    cls += " bg-[var(--kb-priority-low-bg)] text-[var(--kb-priority-low-text)]";
  }
  return <span className={cls}>{priority}</span>;
}

function TagBadge({ label }: TagBadgeProps) {
  return (
    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.06em] px-[7px] py-[3px] rounded-[5px] bg-[var(--kb-tag-bg)] text-[var(--kb-tag-text)]">
      {label}
    </span>
  );
}

function KanbanCard({ card, onDragStart, isDragging }: KanbanCardProps) {
  const isDone = card.progress === 100;

  let cardCls = "bg-[var(--kb-card-bg)] border border-[var(--kb-card-border)] rounded-[var(--kb-card-radius)] p-[var(--kb-card-padding)] cursor-grab select-none transition-[border-color,box-shadow,transform] duration-[150ms] hover:border-[var(--kb-card-hover-border)]";
  if (isDragging) {
    cardCls += " opacity-50";
  }

  return (
    <article
      className={cardCls}
      style={isDragging
        ? { transform: "${cardDragTransform}", boxShadow: "var(--kb-card-dragging-shadow)" }
        : { boxShadow: "var(--kb-card-shadow)" }
      }
      draggable
      onDragStart={(e: React.DragEvent<HTMLElement>) => { e.dataTransfer.effectAllowed = "move"; onDragStart(); }}
    >
      <div className="flex items-center gap-[5px] mb-[10px]">
        <PriorityBadge priority={card.priority} />
        <TagBadge label={card.tag} />
      </div>
      <h3 className="m-0 mb-1 text-[${cardTitleFs}px] font-['Instrument_Sans',sans-serif] font-semibold text-[var(--kb-card-title-color)] leading-[1.4]">
        {card.title}
      </h3>
      <p className="m-0 mb-3 text-[${cardDescFs}px] font-['Instrument_Sans',sans-serif] text-[var(--kb-card-desc-color)] leading-[1.5] overflow-hidden [-webkit-line-clamp:2] [display:-webkit-box] [-webkit-box-orient:vertical]">
        {card.desc}
      </p>
      <div className="mb-3">
        <div className="flex justify-between text-[9px] font-mono text-[var(--kb-meta-color)] mb-[5px]">
          <span>{isDone ? "Done ✓" : "Progress"}</span>
          <span>{card.progress}%</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--kb-progress-track)] overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: card.progress + "%",
              background: isDone ? "var(--kb-progress-fill-done)" : "var(--kb-progress-fill)"
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-[10px] text-[10px] font-mono text-[var(--kb-meta-color)]">
          <span>📎 {card.attachments}</span>
          <span>💬 {card.comments}</span>
        </div>
      </div>
    </article>
  );
}

function KanbanColumn({ col, cards, draggingId, onDragStart, onDrop }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState<boolean>(false);
  const enterCount = useRef<number>(0);

  let colCls = "w-[var(--kb-col-width)] shrink-0 flex flex-col bg-[var(--kb-col-bg)] border border-[var(--kb-col-border)] rounded-[var(--kb-col-radius)] px-3 py-[14px] transition-[border-color] duration-[150ms]";
  if (isOver) {
    colCls += " border-[var(--kb-card-hover-border)]";
  }

  return (
    <section
      className={colCls}
      onDragOver={(e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDragEnter={() => { enterCount.current++; setIsOver(true); }}
      onDragLeave={() => { enterCount.current--; if (enterCount.current <= 0) { enterCount.current = 0; setIsOver(false); } }}
      onDrop={(e: React.DragEvent<HTMLElement>) => { e.preventDefault(); enterCount.current = 0; setIsOver(false); onDrop(col.id); }}
    >
      <header className="flex items-center justify-between mb-[14px]">
        <span className="text-[${colHeaderFs}px] font-['Syne',sans-serif] font-bold text-[var(--kb-col-header-color)] tracking-[0.01em]">
          {col.label}
        </span>
        <span className="bg-[var(--kb-col-count-bg)] text-[var(--kb-col-count-color)] text-[10px] font-mono font-bold px-2 py-[2px] rounded-full">
          {cards.length}
        </span>
      </header>
      <div className="flex-1 flex flex-col gap-[var(--kb-card-gap)] min-h-[40px]">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggingId === card.id}
            onDragStart={() => onDragStart(card.id)}
          />
        ))}
      </div>
      <button className="mt-3 w-full py-[9px] bg-transparent border-[1.5px] border-dashed border-[var(--kb-add-btn-border)] rounded-lg text-[var(--kb-add-btn-color)] text-[11px] font-['Instrument_Sans',sans-serif] font-medium cursor-pointer transition-[background,border-color] duration-[150ms] hover:bg-[var(--kb-add-btn-hover-bg)] hover:border-[var(--kb-card-hover-border)]">
        + Add task
      </button>
    </section>
  );
}

export function KanbanBoard({ onCardMove }: KanbanBoardProps = {}) {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleDrop(targetColId: string): void {
    if (!draggingId) return;
    setCards((prev) =>
      prev.map((c) => c.id === draggingId ? { ...c, columnId: targetColId } : c)
    );
    onCardMove?.({ cardId: draggingId, newColumnId: targetColId });
    setDraggingId(null);
  }

  return (
    <div
      className="flex gap-[var(--kb-board-gap)] p-6 bg-[var(--kb-board-bg)] min-h-full items-start box-border overflow-x-auto font-sans"
      style={kbVars}
      onDragEnd={() => setDraggingId(null)}
    >
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          col={col}
          cards={cards.filter((c) => c.columnId === col.id)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
`;
}
