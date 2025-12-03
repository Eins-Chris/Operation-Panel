import { useState, useEffect } from "react";
import type { Panel } from "./types.tsx";
import Dexie, { type Table } from "dexie";

export class PanelDexie extends Dexie {
    panels!: Table<Panel, number>;

    constructor() {
        super("PanelStorage");

        this.version(1).stores({
            panels: "++dbid, site, id, [site+id]"
        });
    }
}

export const database = new PanelDexie();

export function useContent(database: PanelDexie, site: string) {
    const [panels, setPanels] = useState<Panel[]>([]);

    useEffect(() => {
        database.panels
            .where("site")
            .equals(site)
            .toArray()
            .then((result) => setPanels(result));
    }, [site, database]);

    return { panels, setPanels };
}

export async function saveContent(
    database: PanelDexie,
    site: string,
    panels: Panel[]
) {
    for (const panel of panels) {
        const existing = await database.panels
            .where("[site+id]")
            .equals([site, panel.id])
            .first();

        if (existing) {
            await database.panels.update(existing.dbid!, panel);
        } else {
            await database.panels.add(panel);
        }
    }
}

export const initializeSite = async (database: PanelDexie, site: string): Promise<Panel[]> => {
    let panels = await database.panels.where("site").equals(site).toArray();
    return panels;
};

export async function exportDatabase(database: PanelDexie) {
    const exportData: Record<string, any[]> = {};

    for (const table of database.tables) {
        const tableName = table.name;
        const data = await table.toArray();
        exportData[tableName] = data;
    }

    return JSON.stringify(exportData);
}

export async function importDatabase(database: PanelDexie, jsonString: string) {
    const jsonData = JSON.parse(jsonString);

    for (const table of database.tables) {
        const tableName = table.name;

        if (!jsonData[tableName]) continue;

        await table.clear();
        await table.bulkAdd(jsonData[tableName]);
    }
}