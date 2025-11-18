import React, { useState } from "react";
import "../styles/app.css";
import Load from './load.tsx'

interface Panel {
    id: string;
    row: number;
    col: number;
    widthSlots: number;
    heightSlots: number;
    /* content: React.ReactNode; */
    interactive: boolean;
}

const App: React.FC = () => {
    // -----------------------------------------------------------
    // GRID SETTINGS
    // -----------------------------------------------------------
    const numCols = 8;
    const numRows = 4;

    const slotWidth = 100 / numCols;
    const slotHeight = 100 / numRows;

    // Abstand in vh:
    const borderMarginVH = 0.25; // zum Rand
    const panelGapVH = 0.75; // zwischen Panels

    // -----------------------------------------------------------
    // PANELS
    // -----------------------------------------------------------
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
        },/* 
        {
        id: "panel3",
        row: 0,
        col: 2,
        widthSlots: 2,
        heightSlots: 2,
        interactive: true,
        },
        {
        id: "panel4",
        row: 2,
        col: 2,
        widthSlots: 2,
        heightSlots: 2,
        interactive: false,
        }, */
        {
        id: "panel5",
        row: 0,
        col: 4,
        widthSlots: 4,
        heightSlots: 4,
        interactive: false,
        },
    ]);

    // -----------------------------------------------------------
    // DRAGGING
    // -----------------------------------------------------------
    const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
    const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(null);

    // -----------------------------------------------------------
    // COLLISION CHECK
    // -----------------------------------------------------------
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

    // -----------------------------------------------------------
    // POINTER DOWN
    // -----------------------------------------------------------
    const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
        if (!panel.interactive) return;

        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        setDraggingPanelId(panel.id);
        setDragPos({ row: panel.row, col: panel.col });
    };

    // -----------------------------------------------------------
    // POINTER MOVE (DRAGGING)
    // -----------------------------------------------------------
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingPanelId) return;

        const panel = panels.find((p) => p.id === draggingPanelId);
        if (!panel) return;

        const contentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        const x = (e.clientX - contentRect.left) / contentRect.width;
        const y = (e.clientY - contentRect.top) / contentRect.height;

        const col = Math.max(
        0,
        Math.min(Math.floor(x * numCols), numCols - panel.widthSlots)
        );

        const row = Math.max(
        0,
        Math.min(Math.floor(y * numRows), numRows - panel.heightSlots)
        );

        setDragPos({ row, col });
    };

    // -----------------------------------------------------------
    // POINTER UP
    // -----------------------------------------------------------
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

    // -----------------------------------------------------------
    // TOGGLE INTERACTIVE
    // -----------------------------------------------------------
    const toggleInteractive = (id: string) => {
        setPanels((prev) =>
        prev.map((p) =>
            p.id === id ? { ...p, interactive: !p.interactive } : p
        )
        );
    };

    // -----------------------------------------------------------
    // RENDER
    // -----------------------------------------------------------
    return (
        <div
        id="panelgrid"
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
                top: `calc(${pos.row * slotHeight}% + ${borderMarginVH}vh)`,
                left: `calc(${pos.col * slotWidth}% + ${borderMarginVH}vh)`,
                width: `calc(${panel.widthSlots * slotWidth}% - ${panelGapVH}vh)`,
                height: `calc(${panel.heightSlots * slotHeight}% - ${panelGapVH}vh)`,
                }}
                onPointerDown={(e) => handlePointerDown(e, panel)}
            >
                <div className="content">
                    <Load />
                </div>
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
