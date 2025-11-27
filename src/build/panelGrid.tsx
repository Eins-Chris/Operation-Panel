import "../styles/panelGrid.css";
import Content from "./content/.content.tsx";
import React, { useState } from "react";
import { initialPanels, type Panel } from "./panel/panels.tsx";
import type { PanelState, ResizeDir } from "./panel/panelState.tsx";

type Inputs = {
    site: string;
}

export const PanelGrid = ({ site }: Inputs) => {
    const numCols = 8;
    const numRows = 4;
    const slotWidth = 100 / numCols;
    const slotHeight = 100 / numRows;
    const borderMarginVH = 0.25;
    const panelGapVH = 0.75;

    const [panels, setPanels] = useState<Panel[]>(initialPanels);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [resizePanelId, setResizePanelId] = useState<string | null>(null);
    const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);
    const [tempPanel, setTempPanel] = useState<Panel | null>(null);
    const [originalPanel, setOriginalPanel] = useState<Panel | null>(null);

    const collides = (panel: Panel) => {
        for (const other of panels) {
            if (other.id === panel.id) continue;
            const overlapX = panel.col < other.col + other.colSize && panel.col + panel.colSize > other.col;
            const overlapY = panel.row < other.row + other.rowSize && panel.row + panel.rowSize > other.row;
            if (overlapX && overlapY) return true;
        }
        return false;
    };

    const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
        if (!panel.interactive || resizePanelId) return;
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

    const startResize = (e: React.PointerEvent, panel: Panel, dir: ResizeDir) => {
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
            const col = Math.max(0, Math.min(Math.floor((pointerX - dragOffset.x) / container.width * numCols), numCols - panel.colSize));
            const row = Math.max(0, Math.min(Math.floor((pointerY - dragOffset.y) / container.height * numRows), numRows - panel.rowSize));
            setDragPos({ row, col });
        }

        if (resizePanelId && resizeDir && tempPanel) {
            const newPanel = { ...tempPanel };
            const relCol = Math.floor(x * numCols);
            const relRow = Math.floor(y * numRows);

            if (resizeDir.includes("right")) newPanel.colSize = Math.max(1, Math.min(relCol - newPanel.col + 1, numCols - newPanel.col));
            if (resizeDir.includes("bottom")) newPanel.rowSize = Math.max(1, Math.min(relRow - newPanel.row + 1, numRows - newPanel.row));
            if (resizeDir.includes("left")) {
                let newWidth = newPanel.colSize + (newPanel.col - relCol);
                let newCol = relCol;
                if (newCol < 0) { newWidth += newCol; newCol = 0; }
                if (newWidth < 1) newWidth = 1;
                newPanel.col = newCol;
                newPanel.colSize = Math.min(newWidth, numCols - newCol);
            }
            if (resizeDir.includes("top")) {
                let newHeight = newPanel.rowSize + (newPanel.row - relRow);
                let newRow = relRow;
                if (newRow < 0) { newHeight += newRow; newRow = 0; }
                if (newHeight < 1) newHeight = 1;
                newPanel.row = newRow;
                newPanel.rowSize = Math.min(newHeight, numRows - newRow);
            }

            setTempPanel(newPanel);
        }
    };

    const handlePointerUp = () => {
        if (draggingId && dragPos) {
            const p = panels.find((p) => p.id === draggingId)!;
            const updated = { ...p, ...dragPos };
            if (!collides(updated)) setPanels(prev => prev.map(x => x.id === p.id ? updated : x));
        }
        if (resizePanelId && tempPanel && originalPanel) {
            if (collides(tempPanel)) setPanels(prev => prev.map(p => p.id === originalPanel.id ? originalPanel : p));
            else setPanels(prev => prev.map(p => p.id === tempPanel.id ? tempPanel : p));
        }
        setDraggingId(null); setDragPos(null); setDragOffset({ x: 0, y: 0 });
        setResizePanelId(null); setResizeDir(null); setTempPanel(null); setOriginalPanel(null);
    };

    const panelState: PanelState = {
        panels,
        setPanels,
        draggingId,
        setDraggingId,
        dragPos,
        setDragPos,
        dragOffset,
        setDragOffset,
        resizePanelId,
        setResizePanelId,
        resizeDir,
        setResizeDir,
        tempPanel,
        setTempPanel,
        originalPanel,
        setOriginalPanel,
        numCols,
        numRows,
        slotWidth,
        slotHeight,
        borderMarginVH,
        panelGapVH,
        collides,
        startResize,
        handlePointerDown,
    };

    return (
        <div
            id="panelgrid"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <Content site={site} panelState={panelState} />
        </div>
    );
};
