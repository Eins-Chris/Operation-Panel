import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/.main.css'
import Background from './background.tsx'
import App from './app.tsx'
import UserSelection from './user_selection.tsx'

const Main = () => {
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const [connected, setConntected] = useState(true); // connected irgendwie true setzen wenn connected und false, wenn session beendet oder verlassen wird

    return (
        <>
            <Background url={backgroundUrl} />
            {connected ? <App /> : <UserSelection />}
        </>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Main />
    </StrictMode>
);

/* 
    R.A.I.N.E.R
    
    Raging
    Assistant &
    Intelligent
    Neuronal
    Extrahuman
    Render
 */