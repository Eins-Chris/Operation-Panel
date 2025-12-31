import { useEffect, useState } from "react";
import { getAllPanels } from "./database";
import "./../styles/types.css"

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

export const getSites = [
    "home",
    "info",
    "setting-devices",
    "setting-config-database",
    "setting-user",
    "TEMPORARY"
] as const;

export type Sites = typeof getSites[number];

interface InputFieldProps {
    label?: string;
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    placeholder?: string;
}
export const InputField: React.FC<InputFieldProps> = ({ label, options, value, onChange, isOpen, onToggle, placeholder }) => {
    return (
        <div className="selectInput">
            {label && (
                <label style={{ fontSize: "16px", display: "block", marginBottom: "6px" }}>
                    {label}
                </label>
            )}

            <div
            className="inputFieldInput"
            onClick={onToggle}
            style={{
                padding: "12px",
                border: "1px solid #888",
                borderRadius: "6px",
                fontSize: "20px",
                background: "#f8f8f8",
                cursor: "pointer",
                color: "black"
            }}
            >
                {value || placeholder || "Select.."}
            </div>

            {isOpen && (
                <div
                className="inputFieldDropdown"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #888",
                    borderRadius: "6px",
                    marginTop: "6px",
                    zIndex: 100,
                    maxHeight: "200px",
                    overflowY: "auto",
                    color: "black"
                }}
                >
                    {options.map((option) => (
                        <div
                        key={option}
                        onClick={() => {
                            onChange(option);
                            onToggle;
                        }}
                        style={{
                            padding: "14px",
                            fontSize: "20px",
                            borderBottom: "1px solid #eee",
                            cursor: "pointer",
                            color: "black"
                        }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface PositionVisualProps {
    visible: boolean;
    editable: boolean;
    site: string;
    position: number[];
    setPosition: React.Dispatch<React.SetStateAction<number[]>>;
    validPos: React.Dispatch<React.SetStateAction<boolean>>;
}
export const PositionVisual: React.FC<PositionVisualProps> = ({
    visible,
    editable,
    site,
    position,
    setPosition,
    validPos
}) => {
    const [panels, setPanels] = useState<Panel[]>([]);

    useEffect(() => {
        getAllPanels().then(setPanels);
    }, []);

    const [startW, startH, width, height] = position;

    function overlapsPanel(p: Panel) {
        return !(
            startW + width <= p.startW ||
            startW >= p.startW + p.width ||
            startH + height <= p.startH ||
            startH >= p.startH + p.height
        );
    }

    useEffect(() => {
        if (!site) return validPos(false);
        const sitePanels = panels.filter((p) => p.site === site);
        const collides = sitePanels.some(overlapsPanel);
        validPos(!collides);
    }, [position, site, panels]);

    return (
        <div className={`positionvisual ${visible ? "visible" : "invisible"}`}>
            <div className="simulator">
                {!site ? (
                    <div className="no-site">Keine Site ausgewählt</div>
                ) : (
                    <>
                        <div className="site-simulator positionvisual-size">
                            <div className="grid-overlay">
                                {[...Array(4)].map((_, y) =>
                                    [...Array(8)].map((_, x) => (
                                        <div key={`${x}-${y}`} className="grid-cell" />
                                    ))
                                )}
                            </div>
                            {panels
                            .filter((p) => p.site === site)
                            .map((panel) => (
                                <div
                                    key={panel.id}
                                    className="existing-panel"
                                    style={{
                                        "--x": panel.startW,
                                        "--y": panel.startH,
                                        "--w": panel.width,
                                        "--h": panel.height
                                    } as React.CSSProperties}
                                >
                                    {panel.id}
                                </div>
                            ))}
                            {editable && (
                                <div
                                className={`new-panel ${
                                    panels.filter((p) => p.site === site).some(overlapsPanel)
                                        ? "invalid"
                                        : "valid"
                                }`}
                                style={{
                                    "--x": position[0],
                                    "--y": position[1],
                                    "--w": position[2],
                                    "--h": position[3]
                                } as React.CSSProperties}
                                />
                            )}
                        </div>
                        {editable && ( 
                            <div className="controller">
                                <div className="resize">
                                    <div className="rebtn-wrapper">
                                        <h1>Size</h1>
                                        <button className="rebtn up" tabIndex={-1} disabled={!(position[3] > 1)} onClick={() => {setPosition([position[0], position[1], position[2], position[3]-1])}}></button>
                                        <button className="rebtn ri" tabIndex={-1} disabled={!(position[0]+position[2]+1 <= 8)} onClick={() => {setPosition([position[0], position[1], position[2]+1, position[3]])}}></button>
                                        <button className="rebtn do" tabIndex={-1} disabled={!(position[1]+position[3]+1 <= 4)} onClick={() => {setPosition([position[0], position[1], position[2], position[3]+1])}}></button>
                                        <button className="rebtn le" tabIndex={-1} disabled={!(position[2] > 1)} onClick={() => {setPosition([position[0], position[1], position[2]-1, position[3]])}}></button>
                                    </div>
                                </div>
                                <div className="reposition">
                                    <div className="rebtn-wrapper">
                                        <h1>Pos</h1>
                                        <button className="rebtn up" tabIndex={-1} disabled={!(position[1] > 0)} onClick={() => {setPosition([position[0], position[1]-1, position[2], position[3]])}}></button>
                                        <button className="rebtn ri" tabIndex={-1} disabled={!(position[0]-1+position[2] < 7)} onClick={() => {setPosition([position[0]+1, position[1], position[2], position[3]])}}></button>
                                        <button className="rebtn do" tabIndex={-1} disabled={!(position[1]-1+position[3] < 3)} onClick={() => {setPosition([position[0], position[1]+1, position[2], position[3]])}}></button>
                                        <button className="rebtn le" tabIndex={-1} disabled={!(position[0] > 0)} onClick={() => {setPosition([position[0]-1, position[1], position[2], position[3]])}}></button>
                                    </div>
                                </div>
                            </div> 
                        )}
                    </>
                )}
            </div>
            {editable ? ( <div className="controller"> {/* Vergrößerung/Verkleinerung/Repositionierung des Panels */} {/* ERSTMAL NOCH IGNORIEREN */} </div> ) : ( <></> )}
        </div>
    );
};
