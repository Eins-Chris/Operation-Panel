export interface Panel {
    id: string;
    col: number;
    row: number;
    colSize: number;
    rowSize: number;
    interactive: boolean;
    url: string;
}

export const initialPanels: Panel[] = [
    {
        id: "data-panel-id",
        col: 2,
        row: 1,
        colSize: 4,
        rowSize: 2,
        interactive: false,
        url: "",
    },
];
