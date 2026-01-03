import { useEffect, useState } from 'react'
import '../styles/app.css'
import Content from './content.tsx'
import Nav from './nav.tsx'

const App = () => {
    const [site, setSite] = useState("home");

    console.log("NoUseEffect");
    useEffect(() => {
        console.log("UseEffect");
    });

    return (
        <>
            <div className="content pane">
                <Content site={site} />
            </div>
            <Nav setSite={setSite} />
        </>
    );
}

export default App;
