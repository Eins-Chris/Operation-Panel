import { useState, useEffect } from "react";
import type { Panel } from "./app.tsx";

export function getContent(site: string) {
    const [panels, setPanels] = useState<Panel[]>(() => [
        {
            id: "id: " + site,
            col: 2,
            row: 1,
            colSize: 4,
            rowSize: 2,
            interactive: false,
            url: "",
        },
    ]);

    // für die aktualisierung verantwortlich
    useEffect(() => {
        setPanels([
            {
                id: "id: " + site,
                col: 2,
                row: 1,
                colSize: 4,
                rowSize: 2,
                interactive: false,
                url: "",
            },
        ]);
    }, [site]);

    return [panels, setPanels] as const;
} 

/* 
    Hier die Daten aus der Datenbank abgreifen:
    Für die id werden alle Panels auf der Seite gespeichert.
    Editierbar und speicherbar, damit aktuelle Ansicht in der Datenbank gespeichert wird.
 */