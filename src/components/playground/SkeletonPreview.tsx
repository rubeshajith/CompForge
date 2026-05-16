"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { SkeletonConfig, SkeletonBox } from "@/lib/skeletonConfig";

interface SkeletonPreviewProps {
  config: SkeletonConfig;
  onChange: (patch: Partial<SkeletonConfig>) => void;
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
}

type DragMode =
  | {
      type: "move";
      boxId: string;
      startMouseX: number;
      startMouseY: number;
      startBoxX: number;
      startBoxY: number;
    }
  | {
      type: "resize";
      boxId: string;
      startMouseX: number;
      startMouseY: number;
      startW: number;
      startH: number;
      handle: string;
    }
  | null;

const HANDLE_SIZE = 8;
const MIN_SIZE = 10;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function SkeletonPreview({
  config,
  onChange,
  selectedBoxId,
  onSelectBox,
}: SkeletonPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragMode>(null);
  const [, forceRender] = useState(0);

  const shimmerKeyframes = `
    @keyframes skel-shimmer {
      0%   { background-position: -${config.canvasWidth * 2}px 0; }
      100% { background-position: ${config.canvasWidth * 2}px 0; }
    }
  `;

  const shimmerStyle: React.CSSProperties = {
    background: `linear-gradient(
      90deg,
      ${config.shimmerBaseColor} 25%,
      ${config.shimmerHighlightColor} 50%,
      ${config.shimmerBaseColor} 75%
    )`,
    backgroundSize: `${config.canvasWidth * 4}px 100%`,
    animation: `skel-shimmer ${config.shimmerSpeed}s infinite linear`,
  };

  const updateBox = useCallback(
    (id: string, patch: Partial<SkeletonBox>) => {
      onChange({
        boxes: config.boxes.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      });
    },
    [config.boxes, onChange],
  );

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      e.preventDefault();

      if (drag.type === "move") {
        const dx = e.clientX - drag.startMouseX;
        const dy = e.clientY - drag.startMouseY;
        const box = config.boxes.find((b) => b.id === drag.boxId);
        if (!box) return;
        const newX = clamp(
          drag.startBoxX + dx,
          0,
          config.canvasWidth - box.width,
        );
        const newY = clamp(
          drag.startBoxY + dy,
          0,
          config.canvasHeight - box.height,
        );
        updateBox(drag.boxId, { x: newX, y: newY });
      }

      if (drag.type === "resize") {
        const dx = e.clientX - drag.startMouseX;
        const dy = e.clientY - drag.startMouseY;
        const newW = clamp(drag.startW + dx, MIN_SIZE, config.canvasWidth);
        const newH = clamp(drag.startH + dy, MIN_SIZE, config.canvasHeight);
        updateBox(drag.boxId, { width: newW, height: newH });
      }
    },
    [config.boxes, config.canvasWidth, config.canvasHeight, updateBox],
  );

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    forceRender((n) => n + 1);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const onBoxMouseDown = (e: React.MouseEvent, box: SkeletonBox) => {
    e.stopPropagation();
    onSelectBox(box.id);
    dragRef.current = {
      type: "move",
      boxId: box.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startBoxX: box.x,
      startBoxY: box.y,
    };
  };

  const onResizeHandleMouseDown = (
    e: React.MouseEvent,
    box: SkeletonBox,
    handle: string,
  ) => {
    e.stopPropagation();
    dragRef.current = {
      type: "resize",
      boxId: box.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startW: box.width,
      startH: box.height,
      handle,
    };
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectBox(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        userSelect: "none",
      }}
    >
      <style>{shimmerKeyframes}</style>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onMouseDown={onCanvasMouseDown}
        style={{
          position: "relative",
          width: config.canvasWidth,
          height: config.canvasHeight,
          background: config.canvasBackground,
          borderRadius: config.canvasBorderRadius,
          border: `1px solid ${config.canvasBorder}`,
          boxShadow: config.showCanvasShadow
            ? "0 8px 48px rgba(0,0,0,0.5)"
            : "none",
          overflow: "hidden",
          cursor: "default",
          flexShrink: 0,
        }}
      >
        {/* Shimmer boxes */}
        {config.boxes.map((box) => {
          const isSelected = box.id === selectedBoxId;
          const radius =
            box.shape === "circle"
              ? Math.min(box.width, box.height) / 2
              : box.borderRadius;

          return (
            <div
              key={box.id}
              onMouseDown={(e) => onBoxMouseDown(e, box)}
              style={{
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
                borderRadius: radius,
                cursor: "move",
                outline: isSelected
                  ? "2px solid #7c6cfc"
                  : "2px solid transparent",
                outlineOffset: "1px",
                zIndex: isSelected ? 10 : 1,
                ...shimmerStyle,
              }}
            >
              {/* Resize handle — bottom-right */}
              {isSelected && (
                <div
                  onMouseDown={(e) => onResizeHandleMouseDown(e, box, "br")}
                  style={{
                    position: "absolute",
                    right: -HANDLE_SIZE / 2,
                    bottom: -HANDLE_SIZE / 2,
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    background: "#7c6cfc",
                    border: "1.5px solid #ffffff44",
                    borderRadius: 2,
                    cursor: "se-resize",
                    zIndex: 20,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {config.boxes.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="4" rx="2" fill="#2a2a38" />
              <rect x="3" y="10" width="12" height="4" rx="2" fill="#2a2a38" />
              <rect x="3" y="17" width="15" height="4" rx="2" fill="#2a2a38" />
            </svg>
            <span
              style={{
                color: "#5a5a72",
                fontSize: 12,
                fontFamily: "DM Mono, monospace",
              }}
            >
              Add boxes from the panel →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
