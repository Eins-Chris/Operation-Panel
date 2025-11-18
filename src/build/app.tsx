import React, { useState, useRef } from "react";
import "../styles/app.css";

interface Panel {
  id: string;
  row: number;
  col: number;
  widthSlots: number;
  heightSlots: number;
  content: React.ReactNode;
  interactive: boolean;
  resizeModeActive?: boolean; // true, wenn Resize-Modus aktiv
}

type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | null;

const App: React.FC = () => {
  const numCols = 8;
  const numRows = 4;
  const slotWidth = 100 / numCols;
  const slotHeight = 100 / numRows;

  const [panels, setPanels] = useState<Panel[]>([
    { id: "panel1", row: 0, col: 0, widthSlots: 2, heightSlots: 2, content: "Panel 1", interactive: true },
  ]);

  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(null);

  const [resizingPanelId, setResizingPanelId] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; row: number; col: number; w: number; h: number } | null>(null);

  const allowCollision = false; // optional Kollision

  // --------------------------
  // Collision Check
  // --------------------------
  const isSlotFree = (panel: Panel, row: number, col: number, w: number, h: number) => {
    if (allowCollision) return true;
    for (const other of panels) {
      if (other.id === panel.id) continue;
      const overlapX = col < other.col + other.widthSlots && col + w > other.col;
      const overlapY = row < other.row + other.heightSlots && row + h > other.row;
      if (overlapX && overlapY) return false;
    }
    return true;
  };

  // --------------------------
  // Toggle Interactive
  // --------------------------
  const toggleInteractive = (id: string) => {
    setPanels(prev =>
      prev.map(p => (p.id === id ? { ...p, interactive: !p.interactive } : p))
    );
  };

  // --------------------------
  // Toggle ResizeMode per Panel (DoubleTap)
  // --------------------------
  const toggleResizeMode = (id: string) => {
    setPanels(prev =>
      prev.map(p => (p.id === id ? { ...p, resizeModeActive: !p.resizeModeActive } : p))
    );
  };

  // --------------------------
  // DoubleTap Detection
  // --------------------------
  const lastTap = useRef<{ [key: string]: number }>({});
  const handleTap = (panelId: string) => {
    const now = Date.now();
    const last = lastTap.current[panelId] || 0;
    if (now - last < 300) {
      toggleResizeMode(panelId);
      lastTap.current[panelId] = 0;
    } else {
      lastTap.current[panelId] = now;
    }
  };

  // --------------------------
  // Pointer Down
  // --------------------------
  const handlePointerDown = (e: React.PointerEvent, panel: Panel, direction: ResizeDirection = null) => {
    if (!panel.interactive) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (panel.resizeModeActive && direction) {
      // Resize starten
      setResizingPanelId(panel.id);
      setResizeDirection(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        row: panel.row,
        col: panel.col,
        w: panel.widthSlots,
        h: panel.heightSlots,
      });
    } else if (!panel.resizeModeActive) {
      // Drag starten
      setDraggingPanelId(panel.id);
      setDragPos({ row: panel.row, col: panel.col });
    }
  };

  // --------------------------
  // Pointer Move
  // --------------------------
  const handlePointerMove = (e: React.PointerEvent) => {
    // Resize
    if (resizingPanelId && resizeStart && resizeDirection) {
      const panel = panels.find(p => p.id === resizingPanelId);
      if (!panel) return;

      let deltaX = Math.round((e.clientX - resizeStart.x) / (slotWidth * window.innerWidth / 100));
      let deltaY = Math.round((e.clientY - resizeStart.y) / (slotHeight * window.innerHeight / 100));

      let newRow = resizeStart.row;
      let newCol = resizeStart.col;
      let newW = resizeStart.w;
      let newH = resizeStart.h;

      switch (resizeDirection) {
        case "top-left":
          newCol = resizeStart.col + deltaX;
          newRow = resizeStart.row + deltaY;
          newW = resizeStart.w - deltaX;
          newH = resizeStart.h - deltaY;
          break;
        case "top-right":
          newRow = resizeStart.row + deltaY;
          newW = resizeStart.w + deltaX;
          newH = resizeStart.h - deltaY;
          break;
        case "bottom-left":
          newCol = resizeStart.col + deltaX;
          newW = resizeStart.w - deltaX;
          newH = resizeStart.h + deltaY;
          break;
        case "bottom-right":
          newW = resizeStart.w + deltaX;
          newH = resizeStart.h + deltaY;
          break;
        case "top":
          newRow = resizeStart.row + deltaY;
          newH = resizeStart.h - deltaY;
          break;
        case "bottom":
          newH = resizeStart.h + deltaY;
          break;
        case "left":
          newCol = resizeStart.col + deltaX;
          newW = resizeStart.w - deltaX;
          break;
        case "right":
          newW = resizeStart.w + deltaX;
          break;
      }

      // Limits
      newW = Math.max(1, Math.min(numCols - newCol, newW));
      newH = Math.max(1, Math.min(numRows - newRow, newH));
      newCol = Math.max(0, Math.min(numCols - newW, newCol));
      newRow = Math.max(0, Math.min(numRows - newH, newRow));

      if (!isSlotFree(panel, newRow, newCol, newW, newH)) return;

      setPanels(prev =>
        prev.map(p =>
          p.id === panel.id ? { ...p, row: newRow, col: newCol, widthSlots: newW, heightSlots: newH } : p
        )
      );
      return;
    }

    // Drag
    if (draggingPanelId && !resizingPanelId) {
      const panel = panels.find(p => p.id === draggingPanelId);
      if (!panel) return;

      const contentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - contentRect.left) / contentRect.width;
      const y = (e.clientY - contentRect.top) / contentRect.height;

      const col = Math.min(Math.floor(x * numCols), numCols - panel.widthSlots);
      const row = Math.min(Math.floor(y * numRows), numRows - panel.heightSlots);

      setDragPos({ row, col });
    }
  };

  // --------------------------
  // Pointer Up
  // --------------------------
  const handlePointerUp = () => {
    if (draggingPanelId && dragPos) {
      const panel = panels.find(p => p.id === draggingPanelId);
      if (panel && isSlotFree(panel, dragPos.row, dragPos.col, panel.widthSlots, panel.heightSlots)) {
        setPanels(prev =>
          prev.map(p => (p.id === panel.id ? { ...p, row: dragPos.row!, col: dragPos.col! } : p))
        );
      }
    }

    setDraggingPanelId(null);
    setDragPos(null);
    setResizingPanelId(null);
    setResizeDirection(null);
    setResizeStart(null);
  };

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div
      id="content"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {panels.map(panel => {
        const pos = draggingPanelId === panel.id && dragPos ? dragPos : { row: panel.row, col: panel.col };

        return (
          <div
            key={panel.id}
            className="panel pane"
            style={{
              position: "absolute",
              top: `${pos.row * slotHeight}%`,
              left: `${pos.col * slotWidth}%`,
              width: `${panel.widthSlots * slotWidth}%`,
              height: `${panel.heightSlots * slotHeight}%`,
              border: "2px solid #333",
              boxSizing: "border-box",
              touchAction: "none",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {panel.content}

            {/* Lock Symbol */}
            <div
              className="lock pane"
              style={{ position: "absolute", bottom: 0, left: 0, cursor: "pointer" }}
              onClick={e => { e.stopPropagation(); toggleInteractive(panel.id); }}
            >
              {panel.interactive ? "🔓" : "🔒"}
            </div>

            {/* Resize Handles */}
            {panel.interactive && (
              <>
                {["top-left","top-right","bottom-left","bottom-right","top","bottom","left","right"].map((dir) => (
                  <div
                    key={dir}
                    className={`resize-handle ${dir}`}
                    onPointerDown={e => handlePointerDown(e, panel, dir as ResizeDirection)}
                    onPointerUp={() => handleTap(panel.id)} // DoubleTap Detection
                  />
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default App;
