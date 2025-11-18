import React, { useState } from "react";
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
    {
    id: "panel2",
    row: 2,
    col: 2,
    widthSlots: 2,
    heightSlots: 2,
    content: "Panel 2",
    interactive: false,
    },
]);

const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(
    null
);

// -----------------------------
// Collision Check (unchanged)
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
// Touch Down → Start Drag
// -----------------------------
const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
    if (!panel.interactive) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDraggingPanelId(panel.id);
    setDragPos({ row: panel.row, col: panel.col });
};

// -----------------------------
// Touch Move → Dragging
// -----------------------------
const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingPanelId) return;

    const panel = panels.find((p) => p.id === draggingPanelId);
    if (!panel) return;

    const contentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - contentRect.left) / contentRect.width;
    const y = (e.clientY - contentRect.top) / contentRect.height;

    const col = Math.max(
    0,
    Math.min(
        Math.floor(x * numCols),
        numCols - panel.widthSlots
    )
    );


    const row = Math.max(
    0,
    Math.min(
        Math.floor(y * numRows),
        numRows - panel.heightSlots
    )
    );


    setDragPos({ row, col });
};

// -----------------------------
// Touch End → Finish Drag
// -----------------------------
const handlePointerUp = () => {
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
// Toggle Interactive
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
