import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../styles/.main.css"
import Background from './background.tsx'
import App from './app.tsx'
import Nav from './nav.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Background />
        <App />
        <Nav />
    </StrictMode>,
)
