import App from "./app.tsx";
/* import Home from "./content/home.tsx"; */
import SetConfigDatabase from "./content/setConfigDatabase.tsx";
import SetDevices from "./content/setDevices.tsx";

type Inputs = {
    site: string;
}

const Content = ({ site }: Inputs) => {
    switch (site) {
        case "home": return <App />; {/* <Home /> */};
        case "setting-config-database": return <SetConfigDatabase />;
        case "setting-devices": return <SetDevices />;
        default: return <></>;
    }
} 

export default Content;