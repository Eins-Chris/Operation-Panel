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
    ]);

    const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);
    const [dragPos, setDragPos] = useState<{ row: number; col: number } | null>(null);

    // pinch state
    const [pinchPanelId, setPinchPanelId] = useState<string | null>(null);
    const [initialFingerBox, setInitialFingerBox] = useState<{
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    } | null>(null);
    const [initialPanelState, setInitialPanelState] = useState<Panel | null>(null);

    // track touch pointers
    const activeTouches: Map<number, { x: number; y: number }> = (document as any)._activePointers ||
        ((document as any)._activePointers = new Map());

    // -------------------------
    // Check collisions
    // -------------------------
    const isSlotFree = (panel: Panel, row: number, col: number) => {
        for (const other of panels) {
            if (panel.id === other.id) continue;

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

    // ------------------------------------------------------------
    // Pointer Down
    // ------------------------------------------------------------
    const handlePointerDown = (e: React.PointerEvent, panel: Panel) => {
        if (!panel.interactive) return;

        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

        // If two fingers → PINCH MODE
        if (activeTouches.size === 2) {
            const pts = Array.from(activeTouches.values());
            const [a, b] = pts;

            // store finger bounding box
            const fingerBox = {
                minX: Math.min(a.x, b.x),
                maxX: Math.max(a.x, b.x),
                minY: Math.min(a.y, b.y),
                maxY: Math.max(a.y, b.y),
            };

            setPinchPanelId(panel.id);
            setInitialFingerBox(fingerBox);
            setInitialPanelState({ ...panel });

            return;
        }

        // otherwise drag
        setDraggingPanelId(panel.id);
        setDragPos({ row: panel.row, col: panel.col });
    };

    // ------------------------------------------------------------
    // Pointer Move
    // ------------------------------------------------------------
    const handlePointerMove = (e: React.PointerEvent) => {
        activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

        // -------------------------
        // PINCH RESIZE
        // -------------------------
        if (pinchPanelId && initialFingerBox && initialPanelState) {
            if (activeTouches.size !== 2) return;

            const panel = panels.find((p) => p.id === pinchPanelId);
            if (!panel) return;

            const pts = Array.from(activeTouches.values());
            const [a, b] = pts;

            const currBox = {
                minX: Math.min(a.x, b.x),
                maxX: Math.max(a.x, b.x),
                minY: Math.min(a.y, b.y),
                maxY: Math.max(a.y, b.y),
            };

            // -------------------------
            // Compute scale in each direction
            // -------------------------
            const scaleX =
                (currBox.maxX - currBox.minX) /
                (initialFingerBox.maxX - initialFingerBox.minX);

            const scaleY =
                (currBox.maxY - currBox.minY) /
                (initialFingerBox.maxY - initialFingerBox.minY);

            // Resize relative to PINCH rectangle
            let newWidth = Math.round(initialPanelState.widthSlots * scaleX);
            let newHeight = Math.round(initialPanelState.heightSlots * scaleY);

            newWidth = Math.max(1, Math.min(numCols, newWidth));
            newHeight = Math.max(1, Math.min(numRows, newHeight));

            // ------------------------------------------------
            // Edge logic: determine WHICH corner is fixed:
            //
            // If the two touches are:
            //   a.x < b.x  AND  a.y < b.y  → fingers at TL & BR → anchor = opposite corner where no fingers are
            //
            // We use relative direction sign to position the panel.
            // ------------------------------------------------

            let anchorCol = initialPanelState.col;
            let anchorRow = initialPanelState.row;

            // Finger positions relative to box
            const left = currBox.minX;
            const top = currBox.minY;

            const leftInitial = initialFingerBox.minX;
            const topInitial = initialFingerBox.minY;

            const movedLeft = left < leftInitial;
            const movedUp = top < topInitial;

            // Expand left?
            if (movedLeft) {
                anchorCol = initialPanelState.col + initialPanelState.widthSlots - newWidth;
            }
            // Expand up?
            if (movedUp) {
                anchorRow = initialPanelState.row + initialPanelState.heightSlots - newHeight;
            }

            anchorCol = Math.max(0, Math.min(numCols - newWidth, anchorCol));
            anchorRow = Math.max(0, Math.min(numRows - newHeight, anchorRow));

            setPanels((prev) =>
                prev.map((p) =>
                    p.id === panel.id
                        ? {
                              ...p,
                              widthSlots: newWidth,
                              heightSlots: newHeight,
                              col: anchorCol,
                              row: anchorRow,
                          }
                        : p
                )
            );

            return;
        }

        // -------------------------
        // DRAGGING
        // -------------------------
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

    // ------------------------------------------------------------
    // Pointer Up
    // ------------------------------------------------------------
    const handlePointerUp = (e: React.PointerEvent) => {
        activeTouches.delete(e.pointerId);

        // finish pinch
        if (pinchPanelId && activeTouches.size < 2) {
            setPinchPanelId(null);
            setInitialFingerBox(null);
            setInitialPanelState(null);
        }

        // finish drag
        if (draggingPanelId && dragPos) {
            const panel = panels.find((p) => p.id === draggingPanelId);
            if (panel && isSlotFree(panel, dragPos.row, dragPos.col)) {
                setPanels((prev) =>
                    prev.map((p) =>
                        p.id === panel.id
                            ? { ...p, row: dragPos.row, col: dragPos.col }
                            : p
                    )
                );
            }
        }

        setDraggingPanelId(null);
        setDragPos(null);
    };

    // toggle interactive
    const toggleInteractive = (id: string) => {
        setPanels((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, interactive: !p.interactive } : p
            )
        );
    };

    // -------------------------
    // RENDER
    // -------------------------
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
                        {panel.content}

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
