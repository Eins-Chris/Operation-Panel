export interface Panel {
    dbid?: number;
    id: string;
    site: string;
    startW: number;
    startH: number;
    width: number;
    height: number;
    interactive: boolean;
}

export type ResizeDir =
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export const getSites = [
    "home",
    "info",
    "setting-devices",
    "setting-config-database",
    "setting-user",
    "TEMPORARY"
] as const;

export type Sites = typeof getSites[number];

interface InputFieldProps {
    label?: string;
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    placeholder?: string;
}
export const InputField: React.FC<InputFieldProps> = ({ label, options, value, onChange, isOpen, onToggle, placeholder }) => {

    return (
        <div className="selectInput">
            {label && (
                <label style={{ fontSize: "16px", display: "block", marginBottom: "6px" }}>
                    {label}
                </label>
            )}

            <div
            className="inputFieldInput"
            onClick={onToggle}
            style={{
                padding: "12px",
                border: "1px solid #888",
                borderRadius: "6px",
                fontSize: "20px",
                background: "#f8f8f8",
                cursor: "pointer",
                color: "black"
            }}
            >
                {value || placeholder || "Select.."}
            </div>

            {isOpen && (
                <div
                className="inputFieldDropdown"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #888",
                    borderRadius: "6px",
                    marginTop: "6px",
                    zIndex: 100,
                    maxHeight: "200px",
                    overflowY: "auto",
                    color: "black"
                }}
                >
                    {options.map((option) => (
                        <div
                        key={option}
                        onClick={() => {
                            onChange(option);
                            onToggle;
                        }}
                        style={{
                            padding: "14px",
                            fontSize: "20px",
                            borderBottom: "1px solid #eee",
                            cursor: "pointer",
                            color: "black"
                        }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
