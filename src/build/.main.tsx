import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { Sites } from "./types.tsx";
import { database, importDatabase, initializeSite, saveContent, useContent } from './database.tsx';
import "../styles/.main.css"
import Background from './background.tsx'
import App from './app.tsx'
import Nav from './nav.tsx'
/* 
const jsonString = "{\"panels\":[{\"site\":\"home\",\"id\":\"GeneralInformation\",\"col\":2,\"row\":1,\"colSize\":4,\"rowSize\":2,\"interactive\":false},{\"site\":\"info\",\"id\":\"GeneralInformation\",\"col\":0,\"row\":0,\"colSize\":4,\"rowSize\":2,\"interactive\":false},{\"site\":\"info\",\"id\":\"NavInformation\",\"col\":0,\"row\":3,\"colSize\":8,\"rowSize\":1,\"interactive\":false},{\"site\":\"info\",\"id\":\"StillUnderDevelopment\",\"col\":0,\"row\":2,\"colSize\":8,\"rowSize\":1,\"interactive\":false},{\"site\":\"setting-user\",\"id\":\"UserAdministration\",\"col\":2,\"row\":1,\"colSize\":4,\"rowSize\":2,\"interactive\":false},{\"site\":\"setting-config-database\",\"id\":\"DatabaseInfo\",\"col\":0,\"row\":0,\"colSize\":3,\"rowSize\":4,\"interactive\":false},{\"site\":\"setting-config-database\",\"id\":\"Import\",\"col\":4,\"row\":0,\"colSize\":2,\"rowSize\":4,\"interactive\":false},{\"site\":\"setting-config-database\",\"id\":\"Export\",\"col\":6,\"row\":0,\"colSize\":2,\"rowSize\":4,\"interactive\":false},{\"site\":\"setting-devices\",\"id\":\"DeviceList\",\"col\":2,\"row\":1,\"colSize\":4,\"rowSize\":2,\"interactive\":false},{\"site\":\"TEMPORARY\",\"id\":\"Temporary\",\"col\":2,\"row\":1,\"colSize\":4,\"rowSize\":2,\"interactive\":false}]}";
importDatabase(database, jsonString);
 */

const Main = () => {
    const [site, setSite] = useState<Sites>('home');
    const { panels, setPanels } = useContent(database, site);

    useEffect(() => {
        const loadPanels = async () => {
            const loadedPanels = await initializeSite(database, site);
            setPanels(loadedPanels);
        };

        loadPanels();
    }, [site]);

    const onSetContent = async () => {
        if (!panels || panels.length === 0) return;

        const lockedPanels = panels.map(p => ({ ...p, interactive: false }));

        await saveContent(database, site, lockedPanels);

        const updated = await database.panels
            .where("site")
            .equals(site)
            .toArray();

        setPanels(updated);
    };

    const onResetContent = async () => {
        const defaultPanels = await initializeSite(database, site);
        setPanels(defaultPanels);
    };
    
    return (
        <>
            <Background />
            <App panels={panels} setPanels={setPanels} />
            <Nav site={site} setSite={setSite} onSetContent={onSetContent} onResetContent={onResetContent} />
        </>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Main />
    </StrictMode>
);


// TO FIX:
//   Panels can get resised to size 0 0, meaning they disappear.  