import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/.main.css'
import { Background } from './background.tsx'
import App from './app.tsx'
import Nav from './nav.tsx'

const Main = () => {


    return (
        <>
            <Background url='https://usercontent.one/wp/www.feuerwehr-norderney.de/wp-content/uploads/2022/07/tlf_4000_1-scaled.jpg?media=1650906405'/>
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