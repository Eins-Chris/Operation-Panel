import { backendAddress } from "../../resources/network";

export const favourites = () => {
    async function joinSession() {
        await fetch(backendAddress + "/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: "Flo"
            })
        });
    }

    return (
        <button onClick={() => joinSession()}>Click me</button>
    );
}
