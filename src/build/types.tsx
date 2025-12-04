export interface Panel {
    dbid?: number;
    id: string;
    site: string;
    startW: number;
    startH: number;
    width: number;
    height: number;
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