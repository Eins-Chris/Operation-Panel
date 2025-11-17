import React, { useState } from "react";
import '../styles/app.css';

interface Panel {
  id: string;
  row: number;
  col: number;
  widthSlots: number;
  heightSlots: number;
  content: React.ReactNode;
  interactive: boolean;
}

const App: React.FC = () => {
  const numCols = 8;
  const numRows = 2;
  const slotWidth = 100 / numCols;
  const slotHeight = 100 / numRows;

  const [panels, setPanels] = useState<Panel[]>([
    {
      id: "panel1",
      row: 0,
      col: 0,
      widthSlots: 2,
      heightSlots: 1,
      content: "Panel 1",
      interactive: true,
    },
    {
      id: "panel2",
      row: 1,
      col: 2,
      widthSlots: 2,
      heightSlots: 1,
      content: "Panel 2",
      interactive: false,
    },
  ]);

  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(
    null
  );

  const [pinchPanelId, setPinchPanelId] = useState<string | null>(null);
  const [initialPinchDist, setInitialPinchDist] = useState<number | null>(null);

  // -----------------------------
  // Collision Check
  // -----------------------------
  const isSlotFree = (panel: Panel, row: number, col: number) => {
    for (const other of panels) {
      if (other.id === panel.id) continue;

      const overlapX =
        col < other.col + other.widthSlots &&
        col + panel.widthSlots > other.col;
      const overlapY =
        row < other.row + other.heightSlots &&
        row + panel.heightSlots > other.row;

      if (overlapX && overlapY) return false;
    }
    return true;
  };

  // -----------------------------
  // Touch Down (Start Move or Pinch)
  // -----------------------------
  const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
    if (!panel.interactive) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const targetPanel = panels.find((p) => p.id === panel.id);
    if (!targetPanel) return;

    // If two fingers touch → pinch mode
    if (e.nativeEvent instanceof PointerEvent) {
      const docAny = document as any;
      docAny._activePointers =
        docAny._activePointers || new Map<number, { x: number; y: number }>();
      const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;

      activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activeTouches.size === 2) {
        const vals = Array.from(activeTouches.values()) as { x: number; y: number }[];
        const [a, b] = vals;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);

        setPinchPanelId(panel.id);
        setInitialPinchDist(dist);
        return;
      }
    }

    // Otherwise → drag mode
    setDraggingPanelId(panel.id);
    setDragPos({ row: panel.row, col: panel.col });
  };

  // -----------------------------
  // Touch Move (Drag or Pinch)
  // -----------------------------
  const handlePointerMove = (e: React.PointerEvent) => {
    const docAny = document as any;
    docAny._activePointers =
      docAny._activePointers || new Map<number, { x: number; y: number }>();
    const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;

    if (pinchPanelId && initialPinchDist) {
      activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activeTouches.size === 2) {
        const panel = panels.find((p) => p.id === pinchPanelId);
        if (!panel) return;

        const vals = Array.from(activeTouches.values()) as { x: number; y: number }[];
        const [a, b] = vals;
        const currentDist = Math.hypot(b.x - a.x, b.y - a.y);
        const scale = currentDist / initialPinchDist;

        const newWidth = Math.min(numCols, Math.max(1, Math.round(scale * panel.widthSlots)));
        const newHeight = Math.min(numRows, Math.max(1, Math.round(scale * panel.heightSlots)));

        setPanels((prev) =>
          prev.map((p) =>
            p.id === panel.id
              ? { ...p, widthSlots: newWidth, heightSlots: newHeight }
              : p
          )
        );
      }
      return;
    }

    // -------- DRAGGING --------
    if (!draggingPanelId) return;

    const panel = panels.find((p) => p.id === draggingPanelId);
    if (!panel) return;

    const contentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - contentRect.left) / contentRect.width;
    const y = (e.clientY - contentRect.top) / contentRect.height;

    const col = Math.min(
      Math.floor(x * numCols),
      numCols - panel.widthSlots
    );
    const row = Math.min(
      Math.floor(y * numRows),
      numRows - panel.heightSlots
    );

    setDragPos({ row, col });
  };

  // -----------------------------
  // Touch Release
  // -----------------------------
  const handlePointerUp = (e: React.PointerEvent) => {
    const docAny = document as any;
    docAny._activePointers =
      docAny._activePointers || new Map<number, { x: number; y: number }>();
    const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;

    activeTouches.delete(e.pointerId);

    // Finish pinch?
    if (pinchPanelId && activeTouches.size < 2) {
      setPinchPanelId(null);
      setInitialPinchDist(null);
    }

    // Finish drag?
    if (draggingPanelId && dragPos) {
      const panel = panels.find((p) => p.id === draggingPanelId);
      if (panel && isSlotFree(panel, dragPos.row, dragPos.col)) {
        setPanels((prev) =>
          prev.map((p) =>
            p.id === panel.id ? { ...p, row: dragPos.row, col: dragPos.col } : p
          )
        );
      }
    }

    setDraggingPanelId(null);
    setDragPos(null);
  };

  // -----------------------------
  // Toggle interactive mode per panel
  // -----------------------------
  const toggleInteractive = (id: string) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, interactive: !p.interactive } : p
      )
    );
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div
      id="content"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {panels.map((panel) => {
        const pos =
          draggingPanelId === panel.id && dragPos
            ? dragPos
            : { row: panel.row, col: panel.col };

        return (
          <div
            className="panel pane"
            key={panel.id}
            style={{
              top: `${pos.row * slotHeight}%`,
              left: `${pos.col * slotWidth}%`,
              width: `${panel.widthSlots * slotWidth}%`,
              height: `${panel.heightSlots * slotHeight}%`,
            }}
            onPointerDown={(e) => handlePointerDown(e, panel)}
          >
            {/* Content */}
            {panel.content}

            {/* Lock icon bottom-left */}
            <div
              className="lock pane"
              onClick={(event) => {
                event.stopPropagation();
                toggleInteractive(panel.id);
              }}
            >
              {panel.interactive ? "🔓" : "🔒"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
