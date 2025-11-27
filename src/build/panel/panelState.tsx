import type { Panel } from "./panels.tsx";

export type ResizeDir =
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export interface PanelState {
    panels: Panel[];
    setPanels: React.Dispatch<React.SetStateAction<Panel[]>>;
    draggingId: string | null;
    setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
    dragPos: { row: number; col: number } | null;
    setDragPos: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
    dragOffset: { x: number; y: number };
    setDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    resizePanelId: string | null;
    setResizePanelId: React.Dispatch<React.SetStateAction<string | null>>;
    resizeDir: ResizeDir | null;
    setResizeDir: React.Dispatch<React.SetStateAction<ResizeDir | null>>;
    tempPanel: Panel | null;
    setTempPanel: React.Dispatch<React.SetStateAction<Panel | null>>;
    originalPanel: Panel | null;
    setOriginalPanel: React.Dispatch<React.SetStateAction<Panel | null>>;
    numCols: number;
    numRows: number;
    slotWidth: number;
    slotHeight: number;
    borderMarginVH: number;
    panelGapVH: number;
    collides: (panel: Panel) => boolean;
    startResize: (e: React.PointerEvent, panel: Panel, dir: ResizeDir) => void;
    handlePointerDown: (e: React.PointerEvent, panel: Panel) => void;
}
