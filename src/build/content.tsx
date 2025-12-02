import React, { useState } from "react";
import type { Panel, ResizeDir } from "./types.tsx";
import "../styles/content.css";
import { Load } from "./load.tsx";

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
    const [hasContent, setHasContent] = useState<boolean | null>(null);
    React.useEffect(() => {
        let active = true;

        async function checkContent() {
            try {
                const module = await import(`./contents/${panel.site}.tsx`);
                const exists = !!module[panel.id];

                if (active) setHasContent(exists);
            } catch (err) {
                if (active) setHasContent(false);
            }
        }

        checkContent();
        return () => { active = false; };
    }, [panel.site, panel.id]);


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
                <div className="content" id={panel.site + "-" + panel.id}>
                    {hasContent === null && <Load panelId={panel.id} />}
                    {hasContent === false && <Load panelId={panel.id} />}
                    {hasContent === true && (
                        loaded ? (
                            <Load panelId={panel.id} />
                        ) : (
                            <PanelContent panel={panel} onLoaded={() => setLoaded(true)} />
                        )
                    )}
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

export function PanelContent({ panel, onLoaded }: { panel: Panel; onLoaded: () => void; }) {
    const LazyContent = React.lazy(async () => {
        try {
            const module = await import(`./contents/${panel.site}.tsx`);
            const content = module[panel.id];

            if (!content) {
                React.useEffect(() => { onLoaded(); }, []);
                return { default: () => null };
            }

            return { default: content };
        } catch (err) {
            React.useEffect(() => { onLoaded(); }, []);
            return { default: () => null };
        }
    });

    return (
        <React.Suspense fallback={null}>
            <LazyContent />
        </React.Suspense>
    );
}






/* 
    Hier die Daten aus der Datenbank abgreifen:
    Für die id werden alle Panels auf der Seite gespeichert.
    Editierbar und speicherbar, damit aktuelle Ansicht in der Datenbank gespeichert wird.
 */