import Dexie, { type Table } from "dexie";

export class PanelDexie extends Dexie {
  panels!: Table<Panel, number>;

    constructor() {
            super("PanelStorage");
            this.version(1).stores({
            panels: "++id, site"
        });
    }
}

export const database = new PanelDexie;

export interface Panel {
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