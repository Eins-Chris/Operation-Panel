import { useState, useEffect } from "react";
import type { PanelDexie, Panel } from "./types.tsx";

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
    const oldIds = await database.panels.where("site").equals(site).primaryKeys();
    await database.panels.bulkDelete(oldIds);
    await database.panels.bulkPut(panels);
}

export const initializeSite = async (database: PanelDexie, site: string): Promise<Panel[]> => {
    let panels = await database.panels.where("site").equals(site).toArray();

    if (panels.length === 0) {
        const panel: Panel = {
        id: "test-article",
        site,
        col: 2,
        row: 1,
        colSize: 4,
        rowSize: 2,
        interactive: false
        };

        await database.panels.add(panel); 
        panels = [panel];
    }

    // Export der aktuellen Datenbank
    if (site === "setting-config-database") console.log(exportDatabase(database));

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