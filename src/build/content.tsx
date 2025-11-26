import App from "./app.tsx";

type Inputs = {
    site: string;
}

const Content = ({ site }: Inputs) => {
    switch (site) {
        case "home":
            console.log("Home");
            return <App />;

        case "devices":
            console.log("Devices");
            return <p>DEVICES</p>

        default:
            return <></>;
    }
} 

export default Content;