import React, { useState } from "react";
import "../styles/app.css";
import Load from "./load";

interface Panel {
    id: string;
    row: number;
    col: number;
    widthSlots: number;
    heightSlots: number;
    interactive: boolean;
}

type ResizeDir =
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

const App: React.FC = () => {
    // -----------------------------
    // GRID SETTINGS
    // -----------------------------
    const numCols = 8;
    const numRows = 4;

    const slotWidth = 100 / numCols;
    const slotHeight = 100 / numRows;

    const borderMarginVH = 0.25;
    const panelGapVH = 0.75;

    // -----------------------------
    // PANELS
    // -----------------------------
    const [panels, setPanels] = useState<Panel[]>([
        {
        id: "panel1",
        row: 0,
        col: 0,
        widthSlots: 2,
        heightSlots: 2,
        interactive: true,
        },
        {
        id: "panel2",
        row: 2,
        col: 0,
        widthSlots: 2,
        heightSlots: 2,
        interactive: false,
        },
        {
        id: "panel5",
        row: 0,
        col: 4,
        widthSlots: 4,
        heightSlots: 4,
        interactive: false,
        },
    ]);

    // -----------------------------
    // DRAGGING
    // -----------------------------
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragPos, setDragPos] =
        useState<{ row: number; col: number } | null>(null);

    // -----------------------------
    // RESIZING
    // -----------------------------
    const [resizePanelId, setResizePanelId] = useState<string | null>(null);
    const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);

    const [tempPanel, setTempPanel] = useState<Panel | null>(null);
    const [originalPanel, setOriginalPanel] = useState<Panel | null>(null);

    // -----------------------------
    // Collision check
    // -----------------------------
    const collides = (panel: Panel) => {
        for (const other of panels) {
        if (other.id === panel.id) continue;

        const overlapX =
            panel.col < other.col + other.widthSlots &&
            panel.col + panel.widthSlots > other.col;

        const overlapY =
            panel.row < other.row + other.heightSlots &&
            panel.row + panel.heightSlots > other.row;

        if (overlapX && overlapY) return true;
        }
        return false;
    };

    // -----------------------------
    // DRAG START
    // -----------------------------
    const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
        if (!panel.interactive) return;
        if (resizePanelId) return; // don't drag while resizing

        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        setDraggingId(panel.id);
        setDragPos({ row: panel.row, col: panel.col });
    };

    // -----------------------------
    // RESIZE START
    // -----------------------------
    const startResize = (
        e: React.PointerEvent,
        panel: Panel,
        dir: ResizeDir
    ) => {
        if (!panel.interactive) return;

        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        setResizePanelId(panel.id);
        setResizeDir(dir);
        setTempPanel({ ...panel });
        setOriginalPanel({ ...panel });
    };

    // -----------------------------
    // POINTER MOVE
    // -----------------------------
    const handlePointerMove = (e: React.PointerEvent) => {
        const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - container.left) / container.width;
        const y = (e.clientY - container.top) / container.height;

        // ----------------------------------------
        // DRAGGING
        // ----------------------------------------
        if (draggingId) {
        const panel = panels.find((p) => p.id === draggingId)!;

        const col = Math.max(
            0,
            Math.min(Math.floor(x * numCols), numCols - panel.widthSlots)
        );

        const row = Math.max(
            0,
            Math.min(Math.floor(y * numRows), numRows - panel.heightSlots)
        );

        setDragPos({ row, col });
        return;
        }

        // ----------------------------------------
        // RESIZING — live free movement allowed but constrained within grid
        // ----------------------------------------
        if (resizePanelId && resizeDir && tempPanel) {
        const newPanel = { ...tempPanel };

        const relCol = Math.floor(x * numCols);
        const relRow = Math.floor(y * numRows);

        // RIGHT edge
        if (resizeDir.includes("right")) {
            newPanel.widthSlots = Math.max(
            1,
            Math.min(relCol - newPanel.col + 1, numCols - newPanel.col)
            );
        }

        // BOTTOM edge
        if (resizeDir.includes("bottom")) {
            newPanel.heightSlots = Math.max(
            1,
            Math.min(relRow - newPanel.row + 1, numRows - newPanel.row)
            );
        }

        // LEFT edge
        if (resizeDir.includes("left")) {
            const diff = newPanel.col - relCol;
            let newWidth = newPanel.widthSlots + diff;
            let newCol = relCol;

            if (newCol < 0) {
            newWidth += newCol;
            newCol = 0;
            }
            if (newWidth < 1) newWidth = 1;
            newPanel.col = newCol;
            newPanel.widthSlots = Math.min(newWidth, numCols - newCol);
        }

        // TOP edge
        if (resizeDir.includes("top")) {
            const diff = newPanel.row - relRow;
            let newHeight = newPanel.heightSlots + diff;
            let newRow = relRow;

            if (newRow < 0) {
            newHeight += newRow;
            newRow = 0;
            }
            if (newHeight < 1) newHeight = 1;
            newPanel.row = newRow;
            newPanel.heightSlots = Math.min(newHeight, numRows - newRow);
        }

        setTempPanel(newPanel);
        }
    };

    // -----------------------------
    // POINTER UP
    // -----------------------------
    const handlePointerUp = () => {
        // ---------------------
        // Drag end
        // ---------------------
        if (draggingId && dragPos) {
        const p = panels.find((p) => p.id === draggingId)!;
        const updated = { ...p, ...dragPos };

        if (!collides(updated)) {
            setPanels((prev) =>
            prev.map((x) => (x.id === p.id ? updated : x))
            );
        }
        }

        // ---------------------
        // Resize end (collision → revert)
        // ---------------------
        if (resizePanelId && tempPanel && originalPanel) {
        if (collides(tempPanel)) {
            // revert
            setPanels((prev) =>
            prev.map((p) =>
                p.id === originalPanel.id ? originalPanel : p
            )
            );
        } else {
            // accept
            setPanels((prev) =>
            prev.map((p) => (p.id === tempPanel.id ? tempPanel : p))
            );
        }
        }

        // cleanup
        setDraggingId(null);
        setDragPos(null);
        setResizePanelId(null);
        setResizeDir(null);
        setTempPanel(null);
        setOriginalPanel(null);
    };

    // -----------------------------
    // LOCK TOGGLE
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
        id="panelgrid"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        >
        {panels.map((panel) => {
            const display =
            resizePanelId === panel.id && tempPanel
                ? tempPanel
                : draggingId === panel.id && dragPos
                ? { ...panel, ...dragPos }
                : panel;

            return (
            <div
                key={panel.id}
                className="panel pane"
                style={{
                top: `calc(${display.row * slotHeight}% + ${borderMarginVH}vh)`,
                left: `calc(${display.col * slotWidth}% + ${borderMarginVH}vh)`,
                width: `calc(${display.widthSlots * slotWidth}% - ${panelGapVH}vh)`,
                height: `calc(${display.heightSlots * slotHeight}% - ${panelGapVH}vh)`,
                }}
                onPointerDown={(e) => handlePointerDown(e, panel)}
            >
                <Load />

                {/* LOCK BUTTON */}
                <div
                className="lock pane"
                onClick={(ev) => {
                    ev.stopPropagation();
                    toggleInteractive(panel.id);
                }}
                >
                {panel.interactive ? "🔓" : "🔒"}
                </div>

                {/* RESIZE HANDLES */}
                {panel.interactive && (
                <>
                    {/* edges */}
                    <div
                    className="resize-handle handle-top"
                    onPointerDown={(e) => startResize(e, panel, "top")}
                    />
                    <div
                    className="resize-handle handle-bottom"
                    onPointerDown={(e) => startResize(e, panel, "bottom")}
                    />
                    <div
                    className="resize-handle handle-left"
                    onPointerDown={(e) => startResize(e, panel, "left")}
                    />
                    <div
                    className="resize-handle handle-right"
                    onPointerDown={(e) => startResize(e, panel, "right")}
                    />

                    {/* corners */}
                    <div
                    className="resize-handle handle-tl"
                    onPointerDown={(e) => startResize(e, panel, "top-left")}
                    />
                    <div
                    className="resize-handle handle-tr"
                    onPointerDown={(e) => startResize(e, panel, "top-right")}
                    />
                    <div
                    className="resize-handle handle-bl"
                    onPointerDown={(e) => startResize(e, panel, "bottom-left")}
                    />
                    <div
                    className="resize-handle handle-br"
                    onPointerDown={(e) => startResize(e, panel, "bottom-right")}
                    />
                </>
                )}
            </div>
            );
        })}
        </div>
    );
};

export default App;
