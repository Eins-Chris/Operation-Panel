import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import "../styles/.main.css"
import Background from './background.tsx'
import App from './app.tsx'
import Nav from './nav.tsx'

export type Sites = "home" | "info" | "setting-devices" | "setting-config-database" | "setting-user" | "TEMPORARY";

const Main = () => {
    const [site, setSite] = useState<Sites>('home');

    return (
        <>
            <Background />
            <App site={site} />
            <Nav site={site} setSite={setSite} />
        </>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
