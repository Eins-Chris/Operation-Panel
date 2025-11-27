import type { PanelState } from "../panel/panelState.tsx";
import { Home } from "./home.tsx";
import SetConfigDatabase from "./setConfigDatabase.tsx";
import SetDevices from "./setDevices.tsx";

type Inputs = {
    site: string;
}

interface PanelStateProps {
    panelState: PanelState;
}

type ContentProps = Inputs & Partial<PanelStateProps>; 

const Content = ({ site, panelState }: ContentProps) => {
    switch (site) {
        case "home": return <Home panelState={panelState} />;
        case "setting-config-database": return <SetConfigDatabase panelState={panelState} />;
        case "setting-devices": return <SetDevices panelState={panelState} />;
        default: return <></>;
    }
} 

export default Content;

/* 
    STANDARD FOR NEW CASE:
    <NAME panelState={panelState} />

    Inside the file:

    interface Props {
        panelState: PanelState;
    }

    export const NAME: React.FC<Props> = ({ panelState }) => {
        const {
            panels, dragPos, draggingId, dragOffset,
            resizePanelId, tempPanel, originalPanel,
            numCols, numRows, slotWidth, slotHeight,
            borderMarginVH, panelGapVH, collides,
            startResize, handlePointerDown, setPanels
        } = panelState;

        console.log(panels, dragPos, draggingId, dragOffset, resizePanelId, tempPanel, originalPanel, numCols, numRows, slotWidth, slotHeight, borderMarginVH, panelGapVH, collides, startResize, handlePointerDown, setPanels);

        const toggleInteractive = (id: string) => {
            setPanels(prev => prev.map(p => p.id === id ? { ...p, interactive: !p.interactive } : p));
        };

        return (
            <></>
        );
    }


 */