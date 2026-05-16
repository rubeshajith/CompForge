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
