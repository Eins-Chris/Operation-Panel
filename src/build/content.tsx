import { useState, useEffect } from "react";
import type { PanelDexie, Panel, ResizeDir } from "./types.tsx";
import { Load } from "./load.tsx";

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
        id: "id:" + site,
        site,
        col: 2,
        row: 1,
        colSize: 4,
        rowSize: 2,
        interactive: false,
        url: ""
        };

        await database.panels.add(panel); 
        panels = [panel];
    }

    return panels;
};

export function AppContent({
    panel,
    display,
    slotHeight,
    slotWidth,
    borderMarginVH,
    panelGapVH,
    handlePointerDown,
    toggleInteractive,
    startResize,
}: {
    panel: Panel;
    display: Panel;
    slotHeight: number;
    slotWidth: number;
    borderMarginVH: number;
    panelGapVH: number;
    handlePointerDown: (e: React.PointerEvent, panel: Panel) => void;
    toggleInteractive: (id: string) => void;
    startResize: (e: React.PointerEvent, panel: Panel, direction: ResizeDir) => void;
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className="panel pane"
            style={{
                top: `calc(${display.row * slotHeight}% + ${borderMarginVH}vh)`,
                left: `calc(${display.col * slotWidth}% + ${borderMarginVH}vh)`,
                width: `calc(${display.colSize * slotWidth}% - ${panelGapVH}vh)`,
                height: `calc(${display.rowSize * slotHeight}% - ${panelGapVH}vh)`,
            }}
            onPointerDown={(e) => handlePointerDown(e, panel)}
        >
            <div id="content-wrapper" className={panel.interactive ? 'interactive' : 'fix'}>
                <div className="content">
                    {!loaded && <Load panelId={panel.id} />}

                    <iframe
                        src={panel.url}
                        style={{
                            display: loaded ? "block" : "none",
                            width: "100%",
                            height: "100%",
                            border: "none",
                        }}
                        onLoad={() => setLoaded(true)}
                    />
                </div>
            </div>

            <div
                className="lock pane"
                onClick={(ev) => {
                    ev.stopPropagation();
                    toggleInteractive(panel.id);
                }}
            >
                {panel.interactive ? "🔓" : "🔒"}
            </div>

            {panel.interactive && (
                <>
                    <div className="resize-handle handle-top" onPointerDown={(e) => startResize(e, panel, "top")} />
                    <div className="resize-handle handle-bottom" onPointerDown={(e) => startResize(e, panel, "bottom")} />
                    <div className="resize-handle handle-left" onPointerDown={(e) => startResize(e, panel, "left")} />
                    <div className="resize-handle handle-right" onPointerDown={(e) => startResize(e, panel, "right")} />

                    <div className="resize-handle handle-tl" onPointerDown={(e) => startResize(e, panel, "top-left")} />
                    <div className="resize-handle handle-tr" onPointerDown={(e) => startResize(e, panel, "top-right")} />
                    <div className="resize-handle handle-bl" onPointerDown={(e) => startResize(e, panel, "bottom-left")} />
                    <div className="resize-handle handle-br" onPointerDown={(e) => startResize(e, panel, "bottom-right")} />
                </>
            )}
        </div>
    );
}


/* 
    Hier die Daten aus der Datenbank abgreifen:
    Für die id werden alle Panels auf der Seite gespeichert.
    Editierbar und speicherbar, damit aktuelle Ansicht in der Datenbank gespeichert wird.
 */