"use client";

import { useState, useRef } from "react";
import {
  KanbanConfig,
  KanbanCard,
  KanbanMode,
  ColumnId,
  ALL_COLUMNS,
  DEFAULT_CARDS,
  Priority,
} from "@/lib/kanbanConfig";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconArrow({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function IconCircle({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1"
        fill={color}
        stroke="none"
      />
    </svg>
  );
}
function IconRefresh({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4v5h5M20 20v-5h-5" />
      <path d="M4.07 15a9 9 0 1 0 .29-4.88" />
    </svg>
  );
}
function IconCheck({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconX({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
function IconClip({ color }: { color: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconMsg({ color }: { color: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
function IconPlus({ color }: { color: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconDots({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function ColIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === "arrow") return <IconArrow color={color} />;
  if (icon === "circle") return <IconCircle color={color} />;
  if (icon === "refresh") return <IconRefresh color={color} />;
  if (icon === "check") return <IconCheck color={color} />;
  if (icon === "x") return <IconX color={color} />;
  return null;
}

// ─── Avatar strip (deterministic from card id) ───────────────────────────────

const AVATAR_COLORS = [
  "#7c6cfc",
  "#f87171",
  "#4ade80",
  "#facc15",
  "#60a5fa",
  "#f472b6",
];
function AvatarStrip({
  cardId,
  config,
}: {
  cardId: string;
  config: KanbanConfig;
}) {
  const seed = cardId.charCodeAt(cardId.length - 1);
  const count = (seed % 3) + 1;
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: count }).map((_, i) => {
        const c = AVATAR_COLORS[(seed + i) % AVATAR_COLORS.length];
        const initials = String.fromCharCode(65 + ((seed + i * 3) % 26));
        return (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: c + "33",
              border: `2px solid ${config.cardBackground}`,
              marginLeft: i === 0 ? 0 : -6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontFamily: "Instrument Sans, sans-serif",
              fontWeight: 600,
              color: c,
            }}
          >
            {initials}
          </div>
        );
      })}
    </div>
  );
}

// ─── Priority badge ───────────────────────────────────────────────────────────

function PriorityBadge({
  priority,
  config,
}: {
  priority: Priority;
  config: KanbanConfig;
}) {
  const styles: Record<Priority, { bg: string; color: string }> = {
    high: { bg: config.priorityHighBg, color: config.priorityHighText },
    medium: { bg: config.priorityMediumBg, color: config.priorityMediumText },
    low: { bg: config.priorityLowBg, color: config.priorityLowText },
  };
  const s = styles[priority];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 9,
        fontFamily: "DM Mono, monospace",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "3px 7px",
        borderRadius: 5,
      }}
    >
      {priority}
    </span>
  );
}

// ─── Tag badge ────────────────────────────────────────────────────────────────

function TagBadge({ label, config }: { label: string; config: KanbanConfig }) {
  return (
    <span
      style={{
        background: config.tagBg,
        color: config.tagText,
        fontSize: 9,
        fontFamily: "DM Mono, monospace",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "3px 7px",
        borderRadius: 5,
      }}
    >
      {label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  card: KanbanCard;
  config: KanbanConfig;
  mode: KanbanMode;
  isDragging: boolean;
  onDragStart: () => void;
}

function KanbanCardComp({ card, config, isDragging, onDragStart }: CardProps) {
  const isDone = card.progress === 100;
  const progressColor = isDone
    ? config.progressFillColorDone
    : config.progressFillColor;

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      style={{
        background: config.cardBackground,
        border: `1px solid ${isDragging ? config.cardHoverBorderColor : config.cardBorderColor}`,
        borderRadius: config.cardBorderRadius,
        padding: config.cardPadding,
        cursor: "grab",
        transform: isDragging
          ? config.cardDragRotation
            ? "rotate(2deg) scale(1.03)"
            : "scale(1.03)"
          : "none",
        opacity: isDragging ? 0.5 : 1,
        boxShadow:
          isDragging && config.cardShadow
            ? "0 20px 40px rgba(0,0,0,0.5)"
            : config.cardShadow
              ? "0 2px 8px rgba(0,0,0,0.25)"
              : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        userSelect: "none",
      }}
    >
      {/* Badges row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <PriorityBadge priority={card.priority} config={config} />
        <TagBadge label={card.tag} config={config} />
        <div style={{ marginLeft: "auto", cursor: "pointer" }}>
          <IconDots color={config.metaIconColor} />
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: config.cardTitleFontSize,
          fontFamily: "Instrument Sans, sans-serif",
          fontWeight: 600,
          color: config.cardTitleColor,
          lineHeight: 1.4,
        }}
      >
        {card.title}
      </h3>

      {/* Desc */}
      <p
        style={{
          margin: "0 0 12px",
          fontSize: config.cardDescFontSize,
          fontFamily: "Instrument Sans, sans-serif",
          color: config.cardDescColor,
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {card.desc}
      </p>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "DM Mono, monospace",
              color: isDone ? progressColor : config.metaTextColor,
              fontWeight: isDone ? 700 : 400,
            }}
          >
            {isDone ? "Done ✓" : "Progress"}
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "DM Mono, monospace",
              color: isDone ? progressColor : config.metaTextColor,
              fontWeight: isDone ? 700 : 400,
            }}
          >
            {card.progress}%
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: config.progressTrackColor,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${card.progress}%`,
              height: "100%",
              borderRadius: 99,
              background: progressColor,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AvatarStrip cardId={card.id} config={config} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontFamily: "DM Mono, monospace",
              color: config.metaTextColor,
            }}
          >
            <IconClip color={config.metaIconColor} /> {card.attachments}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontFamily: "DM Mono, monospace",
              color: config.metaTextColor,
            }}
          >
            <IconMsg color={config.metaIconColor} /> {card.comments}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

interface ColumnProps {
  colDef: (typeof ALL_COLUMNS)[0];
  cards: KanbanCard[];
  config: KanbanConfig;
  mode: KanbanMode;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (targetColumnId: ColumnId) => void;
  isDropTarget: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

function KanbanColumn({
  colDef,
  cards,
  config,
  mode,
  draggingId,
  onDragStart,
  onDrop,
  isDropTarget,
  onDragEnter,
  onDragLeave,
}: ColumnProps) {
  const iconColor = colDef.iconColor[mode];

  return (
    <section
      style={{
        width: config.columnWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: config.columnBackground,
        border: `1px solid ${isDropTarget ? config.cardHoverBorderColor : config.columnBorderColor}`,
        borderRadius: config.columnBorderRadius,
        padding: "14px 12px",
        transition: "border-color 0.15s",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(colDef.id);
      }}
    >
      {/* Column header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <ColIcon icon={colDef.icon} color={iconColor} />
          <span
            style={{
              fontSize: config.columnHeaderFontSize,
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              color: config.columnHeaderTextColor,
              letterSpacing: "0.01em",
            }}
          >
            {colDef.label}
          </span>
          <span
            style={{
              background: config.columnCountBadgeBackground,
              color: config.columnCountBadgeColor,
              fontSize: 10,
              fontFamily: "DM Mono, monospace",
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 99,
            }}
          >
            {cards.length}
          </span>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconPlus color={config.metaIconColor} />
        </button>
      </header>

      {/* Drop zone glow when dragging over */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: config.cardGap,
          minHeight: 40,
          borderRadius: 8,
          padding: isDropTarget ? "6px" : "0",
          background: isDropTarget
            ? config.cardHoverBorderColor + "18"
            : "transparent",
          transition: "all 0.15s",
        }}
      >
        {cards.map((card) => (
          <KanbanCardComp
            key={card.id}
            card={card}
            config={config}
            mode={mode}
            isDragging={draggingId === card.id}
            onDragStart={() => onDragStart(card.id)}
          />
        ))}
      </div>

      {/* Add task button */}
      <button
        style={{
          marginTop: 12,
          width: "100%",
          padding: "9px",
          background: "transparent",
          border: `1.5px dashed ${config.addBtnBorderColor}`,
          borderRadius: 8,
          color: config.addBtnTextColor,
          fontSize: 11,
          fontFamily: "Instrument Sans, sans-serif",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            config.addBtnHoverBg;
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            config.cardHoverBorderColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            config.addBtnBorderColor;
        }}
      >
        <IconPlus color={config.addBtnTextColor} />
        Add task
      </button>
    </section>
  );
}

// ─── Preview root ──────────────────────────────────────────────────────────────

interface KanbanPreviewProps {
  config: KanbanConfig;
  mode: KanbanMode;
}

export function KanbanPreview({ config, mode }: KanbanPreviewProps) {
  const [cards, setCards] = useState<KanbanCard[]>(DEFAULT_CARDS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<ColumnId | null>(null);
  const dragEnterCounters = useRef<Record<string, number>>({});

  const visibleColumns = ALL_COLUMNS.slice(0, config.columnCount);

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDropTargetId(null);
    dragEnterCounters.current = {};
  }

  function handleDrop(targetColumnId: ColumnId) {
    if (!draggingId) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === draggingId ? { ...c, columnId: targetColumnId } : c,
      ),
    );
    setDraggingId(null);
    setDropTargetId(null);
    dragEnterCounters.current = {};
  }

  function handleDragEnter(colId: ColumnId) {
    dragEnterCounters.current[colId] =
      (dragEnterCounters.current[colId] ?? 0) + 1;
    setDropTargetId(colId);
  }

  function handleDragLeave(colId: ColumnId) {
    dragEnterCounters.current[colId] =
      (dragEnterCounters.current[colId] ?? 1) - 1;
    if (dragEnterCounters.current[colId] <= 0) {
      setDropTargetId((prev) => (prev === colId ? null : prev));
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        display: "flex",
        alignItems: "flex-start",
        padding: "24px",
        boxSizing: "border-box",
      }}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",
          gap: config.boardGap,
          height: "100%",
          alignItems: "flex-start",
        }}
      >
        {visibleColumns.map((col) => (
          <KanbanColumn
            key={col.id}
            colDef={col}
            cards={cards.filter((c) => c.columnId === col.id)}
            config={config}
            mode={mode}
            draggingId={draggingId}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            isDropTarget={dropTargetId === col.id && draggingId !== null}
            onDragEnter={() => handleDragEnter(col.id)}
            onDragLeave={() => handleDragLeave(col.id)}
          />
        ))}
      </div>
    </div>
  );
}
