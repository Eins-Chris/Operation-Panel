import React, { useState } from "react";
import "../styles/app.css";
import type { Panel, ResizeDir } from "./types.tsx";
import { AppContent } from "./content.tsx";

type Inputs = {
    panels: Panel[];
    setPanels: React.Dispatch<React.SetStateAction<Panel[]>>;
}

const App = ({ panels, setPanels }: Inputs) => {
    const numCols = 8;
    const numRows = 4;

    const slotWidth = 100 / numCols;
    const slotHeight = 100 / numRows;

    const borderMarginVH = 0.25;
    const panelGapVH = 0.75;

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragPos, setDragPos] =
        useState<{ row: number; col: number } | null>(null);
    const [dragOffset, setDragOffset] =
        useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [resizePanelId, setResizePanelId] = useState<string | null>(null);
    const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);

    const [tempPanel, setTempPanel] = useState<Panel | null>(null);
    const [originalPanel, setOriginalPanel] = useState<Panel | null>(null);

    const collides = (panel: Panel) => {
        for (const other of panels) {
        if (other.id === panel.id) continue;

        const overlapX =
            panel.startW < other.startW + other.width &&
            panel.startW + panel.width > other.startW;

        const overlapY =
            panel.startH < other.startH + other.height &&
            panel.startH + panel.height > other.startH;

        if (overlapX && overlapY) return true;
        }
        return false;
    };

    const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
        if (!panel.interactive) return;
        if (resizePanelId) return;

        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const pointerX = e.clientX - container.left;
        const pointerY = e.clientY - container.top;

        const panelLeft = panel.startW * container.width / numCols;
        const panelTop = panel.startH * container.height / numRows;

        setDragOffset({ x: pointerX - panelLeft, y: pointerY - panelTop });
        setDraggingId(panel.id);
        setDragPos({ row: panel.startH, col: panel.startW });
    };

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

    const handlePointerMove = (e: React.PointerEvent) => {
        const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - container.left) / container.width;
        const y = (e.clientY - container.top) / container.height;

        if (draggingId) {
        const panel = panels.find((p) => p.id === draggingId)!;

        const pointerX = e.clientX - container.left;
        const pointerY = e.clientY - container.top;

        const col = Math.max(
            0,
            Math.min(
            Math.floor((pointerX - dragOffset.x) / container.width * numCols),
            numCols - panel.width
            )
        );

        const row = Math.max(
            0,
            Math.min(
            Math.floor((pointerY - dragOffset.y) / container.height * numRows),
            numRows - panel.height
            )
        );

        setDragPos({ row, col });
        return;
        }

        if (resizePanelId && resizeDir && tempPanel) {
        const newPanel = { ...tempPanel };
        const relCol = Math.floor(x * numCols);
        const relRow = Math.floor(y * numRows);

        if (resizeDir.includes("right")) {
            newPanel.width = Math.max(
            1,
            Math.min(relCol - newPanel.startW + 1, numCols - newPanel.startW)
            );
        }

        if (resizeDir.includes("bottom")) {
            newPanel.height = Math.max(
            1,
            Math.min(relRow - newPanel.startH + 1, numRows - newPanel.startH)
            );
        }

        if (resizeDir.includes("left")) {
            const diff = newPanel.startW - relCol;
            let newWidth = newPanel.width + diff;
            let newCol = relCol;

            if (newCol < 0) {
            newWidth += newCol;
            newCol = 0;
            }
            if (newWidth < 1) newWidth = 1;
            newPanel.startW = newCol;
            newPanel.width = Math.min(newWidth, numCols - newCol);
        }

        if (resizeDir.includes("top")) {
            const diff = newPanel.startH - relRow;
            let newHeight = newPanel.height + diff;
            let newRow = relRow;

            if (newRow < 0) {
            newHeight += newRow;
            newRow = 0;
            }
            if (newHeight < 1) newHeight = 1;
            newPanel.startH = newRow;
            newPanel.height = Math.min(newHeight, numRows - newRow);
        }

        setTempPanel(newPanel);
        }
    };

    const handlePointerUp = () => {
        if (draggingId && dragPos) {
        const p = panels.find((p) => p.id === draggingId)!;
        const updated = { ...p, ...dragPos };

        if (!collides(updated)) {
            setPanels((prev) =>
            prev.map((x) => (x.id === p.id ? updated : x))
            );
        }
        }

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

        setDraggingId(null);
        setDragPos(null);
        setDragOffset({ x: 0, y: 0 });
        setResizePanelId(null);
        setResizeDir(null);
        setTempPanel(null);
        setOriginalPanel(null);
    };

    const toggleInteractive = (id: string) => {
        setPanels((prev) =>
        prev.map((p) =>
            p.id === id ? { ...p, interactive: !p.interactive } : p
        )
        );
    };

    return (
        <div
        id="panelgrid"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        >
            {panels.map(panel => {
                const display =
                    resizePanelId === panel.id && tempPanel
                        ? tempPanel
                        : draggingId === panel.id && dragPos
                        ? { ...panel, ...dragPos }
                        : panel;

                return (
                    <AppContent
                        key={panel.dbid}
                        panel={panel}
                        display={display}
                        slotHeight={slotHeight}
                        slotWidth={slotWidth}
                        borderMarginVH={borderMarginVH}
                        panelGapVH={panelGapVH}
                        handlePointerDown={handlePointerDown}
                        toggleInteractive={toggleInteractive}
                        startResize={startResize}
                    />
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