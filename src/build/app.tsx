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
}

const App: React.FC = () => {
  const numCols = 8;
  const numRows = 4;
  const slotWidth = 100 / numCols;
  const slotHeight = 100 / numRows;

  const [panels, setPanels] = useState<Panel[]>([
    {
      id: "panel1",
      row: 0,
      col: 0,
      widthSlots: 2,
      heightSlots: 2,
      content: "Panel 1",
      interactive: true,
    },
    /* weitere Panels können dynamisch hinzugefügt werden */
  ]);

  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(null);

  const [pinchPanelId, setPinchPanelId] = useState<string | null>(null);
  const initialPinchRef = useRef<{
    dx: number;
    dy: number;
    startW: number;
    startH: number;
    panelId: string | null;
  } | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // Hilfsfunktionen
  // -----------------------------
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const isSlotFree = (panel: Panel, row: number, col: number, w?: number, h?: number) => {
    const width = w ?? panel.widthSlots;
    const height = h ?? panel.heightSlots;
    // check each other panel for overlap
    for (const other of panels) {
      if (other.id === panel.id) continue;
      const overlapX = col < other.col + other.widthSlots && col + width > other.col;
      const overlapY = row < other.row + other.heightSlots && row + height > other.row;
      if (overlapX && overlapY) return false;
    }
    return true;
  };

  const getPanelElementRect = (panel: Panel) => {
    const el = document.getElementById(panel.id);
    return el ? el.getBoundingClientRect() : null;
  };

  const getPanelAtPoint = (x: number, y: number) => {
    // Return panel where point is inside its DOM rect, prefer interactive panels
    for (const p of panels) {
      const rect = getPanelElementRect(p);
      if (!rect) continue;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (p.interactive) return p;
      }
    }
    return null;
  };

  // -----------------------------
  // Pointer Down
  // -----------------------------
  const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
    if (!panel.interactive) return;

    (e.target as Element).setPointerCapture(e.pointerId);

    // store pointer in global map (document) to track multi-touch
    const docAny = document as any;
    docAny._activePointers = docAny._activePointers || new Map<number, { x: number; y: number }>();
    const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;
    activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // if two pointers are active -> attempt to start pinch on panel that both touch
    if (activeTouches.size >= 2) {
      const pts = Array.from(activeTouches.entries());
      // get first two pointers
      const [, pA] = pts[0];
      const [, pB] = pts[1];
      // find panels at each touch
      const panelA = getPanelAtPoint(pA.x, pA.y);
      const panelB = getPanelAtPoint(pB.x, pB.y);
      // if both touches fall on the same interactive panel -> start pinch
      if (panelA && panelB && panelA.id === panelB.id) {
        const dx = Math.abs(pA.x - pB.x);
        const dy = Math.abs(pA.y - pB.y);
        setPinchPanelId(panelA.id);
        initialPinchRef.current = {
          dx,
          dy,
          startW: panelA.widthSlots,
          startH: panelA.heightSlots,
          panelId: panelA.id,
        };
        // stop starting a drag for this pointer (pinch takes precedence)
        setDraggingPanelId(null);
        setDragPos(null);
        return;
      }
    }

    // otherwise -> start dragging this panel with one finger
    setDraggingPanelId(panel.id);
    setDragPos({ row: panel.row, col: panel.col });
  };

  // -----------------------------
  // Pointer Move
  // -----------------------------
  const handlePointerMove = (e: React.PointerEvent) => {
    const docAny = document as any;
    docAny._activePointers = docAny._activePointers || new Map<number, { x: number; y: number }>();
    const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;

    // update pointer position in active map if present (for pinch)
    if (activeTouches.has(e.pointerId)) {
      activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // --- PINCH handling ---
    if (pinchPanelId && initialPinchRef.current) {
      // need exactly 2 active touches to continue pinch
      if (activeTouches.size < 2) return;

      // read two pointers
      const vals = Array.from(activeTouches.values()).slice(0, 2) as { x: number; y: number }[];
      const a = vals[0];
      const b = vals[1];

      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);

      const initial = initialPinchRef.current;
      if (!initial || initial.panelId !== pinchPanelId) return;

      const panel = panels.find((p) => p.id === pinchPanelId);
      if (!panel) return;

      // decide whether horizontal / vertical / both based on relative changes
      const changeX = dx / (initial.dx || 1);
      const changeY = dy / (initial.dy || 1);

      // thresholds - tuneable
      const growThreshold = 1.15; // > 15% bigger -> grow
      const shrinkThreshold = 0.85; // < 15% smaller -> shrink

      // determine mode
      const horizontalSignificant = changeX > growThreshold || changeX < shrinkThreshold;
      const verticalSignificant = changeY > growThreshold || changeY < shrinkThreshold;

      // compute new sizes based on scale for relevant axes
      let newW = panel.widthSlots;
      let newH = panel.heightSlots;

      if (horizontalSignificant && !verticalSignificant) {
        // only width changes
        const proposed = Math.round(initial.startW * changeX);
        newW = clamp(proposed, 1, numCols - panel.col); // ensure within grid width
      } else if (verticalSignificant && !horizontalSignificant) {
        // only height changes
        const proposed = Math.round(initial.startH * changeY);
        newH = clamp(proposed, 1, numRows - panel.row);
      } else if (horizontalSignificant && verticalSignificant) {
        // both change
        const proposedW = Math.round(initial.startW * changeX);
        const proposedH = Math.round(initial.startH * changeY);
        newW = clamp(proposedW, 1, numCols - panel.col);
        newH = clamp(proposedH, 1, numRows - panel.row);
      } else {
        // no significant change -> do nothing
        return;
      }

      // collision check for new size at same position
      if (!isSlotFree(panel, panel.row, panel.col, newW, newH)) {
        // If blocked, we do not apply the size change
        return;
      }

      // apply size change live
      setPanels((prev) =>
        prev.map((p) =>
          p.id === panel.id ? { ...p, widthSlots: newW, heightSlots: newH } : p
        )
      );

      return;
    }

    // --- DRAG handling (single finger) ---
    if (!draggingPanelId) return;
    const panel = panels.find((p) => p.id === draggingPanelId);
    if (!panel) return;

    // calculate pointer relative to content area
    const contentElement = contentRef.current;
    if (!contentElement) return;
    const contentRect = contentElement.getBoundingClientRect();
    const x = (e.clientX - contentRect.left) / contentRect.width;
    const y = (e.clientY - contentRect.top) / contentRect.height;

    const col = clamp(Math.floor(x * numCols), 0, numCols - panel.widthSlots);
    const row = clamp(Math.floor(y * numRows), 0, numRows - panel.heightSlots);

    // during drag: show temporary position (over others is allowed)
    setDragPos({ row, col });
  };

  // -----------------------------
  // Pointer Up / Cancel
  // -----------------------------
  const handlePointerUp = (e: React.PointerEvent) => {
    const docAny = document as any;
    docAny._activePointers = docAny._activePointers || new Map<number, { x: number; y: number }>();
    const activeTouches: Map<number, { x: number; y: number }> = docAny._activePointers;

    // remove pointer from active map
    if (activeTouches.has(e.pointerId)) activeTouches.delete(e.pointerId);

    // if we were pinching and now less than 2 pointers -> end pinch
    if (pinchPanelId && activeTouches.size < 2) {
      setPinchPanelId(null);
      initialPinchRef.current = null;
    }

    // if we were dragging -> try to commit new position if slot free
    if (draggingPanelId && dragPos) {
      const panel = panels.find((p) => p.id === draggingPanelId);
      if (panel) {
        if (isSlotFree(panel, dragPos.row, dragPos.col, panel.widthSlots, panel.heightSlots)) {
          setPanels((prev) =>
            prev.map((p) =>
              p.id === panel.id ? { ...p, row: dragPos.row!, col: dragPos.col! } : p
            )
          );
        }
      }
    }

    setDraggingPanelId(null);
    setDragPos(null);
  };

  // -----------------------------
  // Toggle interactive per panel
  // -----------------------------
  const toggleInteractive = (id: string) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, interactive: !p.interactive } : p)));
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div
      id="content"
      ref={contentRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {panels.map((panel) => {
        const pos = draggingPanelId === panel.id && dragPos ? dragPos : { row: panel.row, col: panel.col };
        return (
          <div
            id={panel.id}
            key={panel.id}
            onPointerDown={(e) => handlePointerDown(e, panel)}
            style={{
              position: "absolute",
              top: `${pos.row * slotHeight}%`,
              left: `${pos.col * slotWidth}%`,
              width: `${panel.widthSlots * slotWidth}%`,
              height: `${panel.heightSlots * slotHeight}%`,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #ccc",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none", // wichtig für multi-touch / pinch
              userSelect: "none",
              zIndex: draggingPanelId === panel.id || pinchPanelId === panel.id ? 999 : 1,
            }}
          >
            <div style={{ pointerEvents: "none" }}>{panel.content}</div>

            {/* lock icon bottom-left */}
            <div
              onClick={(ev) => {
                ev.stopPropagation();
                toggleInteractive(panel.id);
              }}
              style={{
                position: "absolute",
                bottom: 6,
                left: 6,
                width: 28,
                height: 28,
                borderRadius: 6,
                background: panel.interactive ? "rgba(0,200,0,0.12)" : "rgba(200,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                userSelect: "none",
                zIndex: 1000,
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
