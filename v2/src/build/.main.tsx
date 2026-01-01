import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/.main.css'
import Background from './background.tsx'
import App from './app.tsx'

const Main = () => {
    const [backgroundUrl, setBackgroundUrl] = useState("");

    return (
        <>
            <Background url={backgroundUrl} />
            <App />
        </>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
