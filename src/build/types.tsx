export interface Panel {
    dbid?: number;
    id: string;
    site: string;
    col: number;
    row: number;
    colSize: number;
    rowSize: number;
    interactive: boolean;
}

export type ResizeDir =
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export type Sites = 
    "home" | "info" | "setting-devices" | "setting-config-database" | "setting-user" | "TEMPORARY";