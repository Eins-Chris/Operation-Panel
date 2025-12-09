import { useEffect, useState } from "react";
import { database, exportDatabase, getAllPanels, importDatabase } from "../database.tsx";
import { getSites, InputField, type Panel, type Sites } from "../types.tsx";

export const DatabaseInfo = () => {
    const [panels, setPanels] = useState<Panel[]>([]);

    useEffect(() => {
        getAllPanels().then(setPanels);
    }, []);

    const viewSwitch:number = -1;

    switch(viewSwitch) {
        case 0: return <InteractiveTree panels={panels} />;
        case 1: return <DetailedTree panels={panels} />;
        default: return <Creator />;
    }
};   /* Oben rechts im Eck oder unten rechts im Eck ein Switch für zwischen den beiden Trees */
const InteractiveTree = ({ panels }: { panels: Panel[] }) => {
    return (
        <>
            <p>InteractiveTree (das Entweder von oben)</p>
            {panels.map(panel => (
                <div key={panel.dbid}>{panel.id}</div>
            ))}
        </>
    );
};
const DetailedTree = ({ panels }: { panels: Panel[] }) => {
    return (
        <ul className="tree">
            {getSites.map((site) => (
                <li key={site}>
                    {site}
                    <ul>
                        {panels.filter((p) => p.site === site).map((panel) => (
                            <li key={panel.dbid}>
                            {panel.id}

                            <ul>
                                <li>({panel.startH}, {panel.startW})</li>
                            </ul>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

/* 
    Temporary solution
 */
export const Import = () => {
    const [importText, setImportText] = useState("");
    async function handleImport() {
        if (!importText.trim()) return;
        await importDatabase(database, importText);
        alert("Import erfolgreich!");
    }
    return (
        <>
            <textarea
                style={{ width: "100%", height: "85%", color: "black" }}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Hier JSON einfügen"
            />

            <button onClick={handleImport} style={{ marginTop: "10px", color: "black" }}>
                Import ausführen
            </button>
        </>
    );
}

export const Export = () => {
    const [exportText, setExportText] = useState("");
    async function handleExport() {
        const jsonString = await exportDatabase(database);
        setExportText(jsonString);
    }
    return(
        <>
            <button onClick={handleExport} style={{ color: "black"}}>Datenbank exportieren</button>
            <textarea
                style={{ width: "100%", height: "85%", marginTop: "10px", color: "black" }}
                value={exportText}
                readOnly
            />
        </>
    );
}

export const Controller = () => {
    const ControllerContent = () => {
        return (
            <><p>Auswahl zwischen Editor, Creator und was es sonst noch so geben wird, mithilfe von Buttons.</p></>
        );
    }

    const [panels, setPanels] = useState<Panel[]>([]);

    useEffect(() => {
        getAllPanels().then(setPanels);
    }, []);

    const viewSwitch:number = -1;

    switch(viewSwitch) {
        case 0: return <Creator />;
        case 1: return <Editor panels={panels} />;
        default: return <ControllerContent />;
    }
}
const Creator = () => {
    const [openDropdown, setOpenDropdown] = useState<"site" | "id" | null>(null);
    const [site, setSite] = useState<string>("all");
    const siteOptions: SiteFilter[] = ["all", ...getSites];
    const [id, setId] = useState<string>("");
    const [avids, setAvids] = useState<string[]>([]);
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadAvids() {
            const selectedSites = site === "all" ? getSites : [site];
            const list: string[] = [];

            for (const s of selectedSites) {
                try {
                    const module = await import(`./${s}.tsx`);
                    const keys = Object.keys(module);

                    keys.forEach((k) => {
                        if (site === "all") {
                            list.push(`${s}:${k}`);
                        } else {
                            list.push(k);
                        }
                    });
                } catch (e) {
                    console.warn("Fehler beim Laden von", s, e);
                }
            }

            if (!cancelled) {
                setAvids(list);

                if (pendingId) {
                    setId(pendingId);
                    setPendingId(null);
                } else {
                    setId("");
                }
            }
        }

        loadAvids();
        return () => { cancelled = true; };
    }, [site]);

    return (
        <>
            <div className="creator">
                <InputField
                label="Site"
                options={siteOptions}
                value={site}
                onChange={(newSite) => {
                    setSite(newSite);
                    setId(""); 
                    setOpenDropdown(null);
                }}
                isOpen={openDropdown === "site"} 
                onToggle={() => setOpenDropdown(openDropdown === "site" ? null : "site")}
                />

                <InputField
                label="ID"
                options={avids}
                value={id}
                onChange={(value) => {
                    if (site === "all") {
                        const [s, i] = value.split(":");
                        setPendingId(i); 
                        setSite(s);
                    } else {
                        setId(value);
                    };
                    setOpenDropdown(null);
                }}
                isOpen={openDropdown === "id"} 
                onToggle={() => setOpenDropdown(openDropdown === "id" ? null : "id")}
                placeholder="Select ID..."
                />


                {/* 
                Im Tree für jede site ein Grid anzeigen, welches visualisiert wo welche Panels sind und wo was frei ist.
                Selbe Visualisierung hier auch, an der man das Panel so positionieren kann, dass es nicht überlappt. 
                Wenn die Pos passt, "Create" Button clickable machen, wenn Panels überlappen Button nicht clickable.
                 */}

                {/* Create button */}
                {/* addPanelToDB(site, id, startW, startH, width, height); */}
            </div>
        </>
    );
    /* Erstellen eines neuen Panels, anzugeben: ID, SITE, (vlt Position und Größe, darf dann aber nicht mit anderen kollidieren) */
}
const Editor = ({ panels }: { panels: Panel[] }) => {
    console.log("Editor: " + panels);
    return(<>Editor</>);
    /* Verändern eines bestehenden Panels, möglich: ID, (vlt Position und Größe, darf dann aber nicht mit anderen kollidieren). */
}
type SiteFilter = Sites | "all";
