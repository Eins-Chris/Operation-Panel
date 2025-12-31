import React from "react";
import "../styles/icons.css";

interface MenuICProps {
  open: boolean;
}

/* https://www.svgrepo.com/collection/keyicons-interface-icons/2 */

export const MenuIC: React.FC<MenuICProps> = ({ open }) => {
    return (
        <>
            {open ? 
                <img src="./src/resources/icons/MenuClose.svg" alt="#" className="icon" />
                :
                <img src="./src/resources/icons/MenuOpen.svg" alt="#" className="icon" />
            }
        </>
    );
};

export const HomeIC = () => {
    return (
        <img src="./src/resources/icons/Home.svg" alt="0" className="icon" />
    );
}

export const UploadIC = () => {
    return (
        <img src="./src/resources/icons/Upload.svg" alt="i" className="icon" />
    );
}

export const LoadIC = () => {
    return (
        <img src="./src/resources/icons/Load.svg" alt="!" className="icon" />
    );
}

export const PlusIC = () => {
    return (
        <img src="./src/resources/icons/Add.svg" alt="+" className="icon" />
    );
}