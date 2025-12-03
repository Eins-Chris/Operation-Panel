import { useState } from "react";
import { database, exportDatabase, importDatabase } from "../database.tsx";


export const DatabaseInfo = () => {
    const viewSwitch: number = 0;
    /* 
        tree-wrapper nimmt alle panels in der Datenbank und listet sie auf.
        Switch der beiden Sachen: 
        Entweder:
            Panels lassen sich anklicken und in weiterem Fenster nebenan lässt sich zum ausgewählten Panel die Informationen anzeigen.
        Oder:
            Panel Informationen werden gleich im Tree angezeigt.
        
        In irgendeiner Art und Weise müsste die ID noch änderbar sein.
     */
    switch(viewSwitch) {
        case 0: return <InteractiveTree />
        case 1: return <DetailedTree />
        default: return <InteractiveTree />
    }
}
const InteractiveTree = () => {
    return(
        <>
            <p>InteractiveTree (das Entweder von oben)</p>
        </>
    );
}
const DetailedTree = () => {
    return(
        <>
            <p>DetailedTree (das Oder von oben)</p>
        </>
    );
}



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