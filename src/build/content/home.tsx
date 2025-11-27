import React, { useState } from "react";
import type { PanelState } from "../panel/panelState.tsx";
import { Load } from "../load.tsx";

interface Props {
    panelState: PanelState;
}

export const Home: React.FC<Props> = ({ panelState }) => {
    const {
        panels, dragPos, draggingId, dragOffset,
        resizePanelId, tempPanel, originalPanel,
        numCols, numRows, slotWidth, slotHeight,
        borderMarginVH, panelGapVH, collides,
        startResize, handlePointerDown, setPanels
    } = panelState;

    console.log(panels, dragPos, draggingId, dragOffset, resizePanelId, tempPanel, originalPanel, numCols, numRows, slotWidth, slotHeight, borderMarginVH, panelGapVH, collides, startResize, handlePointerDown, setPanels);

    const toggleInteractive = (id: string) => {
        setPanels(prev => prev.map(p => p.id === id ? { ...p, interactive: !p.interactive } : p));
    };

    return (
        <>
            {panels.map(panel => {
                const display =
                    resizePanelId === panel.id && tempPanel ? tempPanel
                        : draggingId === panel.id && dragPos ? { ...panel, ...dragPos }
                        : panel;

                const [loaded, setLoaded] = useState(false);

                return (
                    <div key={panel.id}
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
                                    style={{ display: loaded ? "block" : "none", width: "100%", height: "100%", border: "none" }}
                                    onLoad={() => setLoaded(true)}
                                />
                            </div>
                        </div>

                        <div className="lock pane" onClick={ev => { ev.stopPropagation(); toggleInteractive(panel.id); }}>
                            {panel.interactive ? "🔓" : "🔒"}
                        </div>

                        {panel.interactive && (
                            <>
                                <div className="resize-handle handle-top" onPointerDown={e => startResize(e, panel, "top")} />
                                <div className="resize-handle handle-bottom" onPointerDown={e => startResize(e, panel, "bottom")} />
                                <div className="resize-handle handle-left" onPointerDown={e => startResize(e, panel, "left")} />
                                <div className="resize-handle handle-right" onPointerDown={e => startResize(e, panel, "right")} />
                                <div className="resize-handle handle-tl" onPointerDown={e => startResize(e, panel, "top-left")} />
                                <div className="resize-handle handle-tr" onPointerDown={e => startResize(e, panel, "top-right")} />
                                <div className="resize-handle handle-bl" onPointerDown={e => startResize(e, panel, "bottom-left")} />
                                <div className="resize-handle handle-br" onPointerDown={e => startResize(e, panel, "bottom-right")} />
                            </>
                        )}
                    </div>
                );
            })}
        </>
    );
};
