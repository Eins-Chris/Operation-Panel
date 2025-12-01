import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { Panel, Sites } from "./types.tsx";
import { database } from "./types.tsx";
import { initializeSite, saveContent, useContent } from './content.tsx';
import "../styles/.main.css"
import Background from './background.tsx'
import App from './app.tsx'
import Nav from './nav.tsx'

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
        console.log("onSetContent");

        if (!panels || panels.length === 0) return;

        await saveContent(database, site, panels);

        const updated = await database.panels
            .where("site")
            .equals(site)
            .toArray();

        setPanels(updated);
    };

    const onResetContent = async () => {
        console.log("onResetContent");
        const defaultPanels = await initializeSite(database, site);
        setPanels(defaultPanels);
    };
    
    return (
        <>
            <Background />
            <App panels={panels} setPanels={setPanels} />
            <Nav database={database} site={site} setSite={setSite} onSetContent={onSetContent} onResetContent={onResetContent} />
        </>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
