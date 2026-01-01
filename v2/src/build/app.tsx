import { useState } from 'react';
import '../styles/app.css'
import Nav from './nav.tsx'

const App = () => {
    const [site, setSite] = useState("home");

    return (
        <>
            {/* <Content site={site} /> */}
            <Nav site={site} setSite={setSite} />
        </>
    );
};

export default App;
