import React, { useState } from "react";/* 
import { connect, MqttClient } from "mqtt"; */
import "../styles/app.css";
import { Load } from "./load";

interface Panel {
    id: string;
    col: number;
    row: number;
    colSize: number;
    rowSize: number;
    interactive: boolean;
    url: string;
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
        id: "data-panel-id",
        col: 2,
        row: 1,
        colSize: 4,
        rowSize: 2,
        interactive: false,
        url: "",
        },
    ]);

    // -----------------------------
    // DRAGGING
    // -----------------------------
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragPos, setDragPos] =
        useState<{ row: number; col: number } | null>(null);
    const [dragOffset, setDragOffset] =
        useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
            panel.col < other.col + other.colSize &&
            panel.col + panel.colSize > other.col;

        const overlapY =
            panel.row < other.row + other.rowSize &&
            panel.row + panel.rowSize > other.row;

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

        const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const pointerX = e.clientX - container.left;
        const pointerY = e.clientY - container.top;

        const panelLeft = panel.col * container.width / numCols;
        const panelTop = panel.row * container.height / numRows;

        setDragOffset({ x: pointerX - panelLeft, y: pointerY - panelTop });
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

        const pointerX = e.clientX - container.left;
        const pointerY = e.clientY - container.top;

        const col = Math.max(
            0,
            Math.min(
            Math.floor((pointerX - dragOffset.x) / container.width * numCols),
            numCols - panel.colSize
            )
        );

        const row = Math.max(
            0,
            Math.min(
            Math.floor((pointerY - dragOffset.y) / container.height * numRows),
            numRows - panel.rowSize
            )
        );

        setDragPos({ row, col });
        return;
        }

        // ----------------------------------------
        // RESIZING
        // ----------------------------------------
        if (resizePanelId && resizeDir && tempPanel) {
        const newPanel = { ...tempPanel };
        const relCol = Math.floor(x * numCols);
        const relRow = Math.floor(y * numRows);

        // RIGHT
        if (resizeDir.includes("right")) {
            newPanel.colSize = Math.max(
            1,
            Math.min(relCol - newPanel.col + 1, numCols - newPanel.col)
            );
        }

        // BOTTOM
        if (resizeDir.includes("bottom")) {
            newPanel.rowSize = Math.max(
            1,
            Math.min(relRow - newPanel.row + 1, numRows - newPanel.row)
            );
        }

        // LEFT
        if (resizeDir.includes("left")) {
            const diff = newPanel.col - relCol;
            let newWidth = newPanel.colSize + diff;
            let newCol = relCol;

            if (newCol < 0) {
            newWidth += newCol;
            newCol = 0;
            }
            if (newWidth < 1) newWidth = 1;
            newPanel.col = newCol;
            newPanel.colSize = Math.min(newWidth, numCols - newCol);
        }

        // TOP
        if (resizeDir.includes("top")) {
            const diff = newPanel.row - relRow;
            let newHeight = newPanel.rowSize + diff;
            let newRow = relRow;

            if (newRow < 0) {
            newHeight += newRow;
            newRow = 0;
            }
            if (newHeight < 1) newHeight = 1;
            newPanel.row = newRow;
            newPanel.rowSize = Math.min(newHeight, numRows - newRow);
        }

        setTempPanel(newPanel);
        }
    };

    // -----------------------------
    // POINTER UP
    // -----------------------------
    const handlePointerUp = () => {
        // Drag end
        if (draggingId && dragPos) {
        const p = panels.find((p) => p.id === draggingId)!;
        const updated = { ...p, ...dragPos };

        if (!collides(updated)) {
            setPanels((prev) =>
            prev.map((x) => (x.id === p.id ? updated : x))
            );
        }
        }

        // Resize end (collision → revert)
        if (resizePanelId && tempPanel && originalPanel) {
        if (collides(tempPanel)) {
            setPanels((prev) =>
            prev.map((p) =>
                p.id === originalPanel.id ? originalPanel : p
            )
            );
        } else {
            setPanels((prev) =>
            prev.map((p) => (p.id === tempPanel.id ? tempPanel : p))
            );
        }
        }

        // cleanup
        setDraggingId(null);
        setDragPos(null);
        setDragOffset({ x: 0, y: 0 });
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

            const [loaded, setLoaded] = useState(false);
            return (
                <div
                key={panel.id}
                className="panel pane"
                style={{
                top: `calc(${display.row * slotHeight}% + ${borderMarginVH}vh)`,
                left: `calc(${display.col * slotWidth}% + ${borderMarginVH}vh)`,
                width: `calc(${display.colSize * slotWidth}% - ${panelGapVH}vh)`,
                height: `calc(${display.rowSize * slotHeight}% - ${panelGapVH}vh)`,
                }}
                onPointerDown={(e) => handlePointerDown(e, panel)}
                >
                    <div id="content-wrapper" className={panel.interactive ? 'interactive' : 'fix'}>
                        <div className="content">
                            { !loaded && <Load panelId={panel.id} /> }
                            <iframe
                                src={panel.url}
                                style={{
                                    display: loaded ? "block" : "none",
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                                onLoad={() => setLoaded(true)}
                            />
                        </div>
                    </div>

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

/* 
    Still ToDo:
    
    Maybe overlapping panels
    Automated creation of Panels with data from API
    
    Different use cases:
        rocket telemetry
        drone telemetry
        camera system
        smarthome / light controll

*/