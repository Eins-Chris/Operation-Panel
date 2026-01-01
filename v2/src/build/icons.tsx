import React from 'react'
import '../styles/icons.css'

interface MenuICProps {
  open: boolean;
}

/* https://www.svgrepo.com/collection/keyicons-interface-icons/2 */

export const FavouritesIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Favourites.svg" alt="0" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

export const HomeIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Home.svg" alt="0" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

export const InformationIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Information.svg" alt="#" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

export const InstructionIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Instruction.svg" alt="#" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

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

export const NaviIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Navi.svg" alt="#" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

export const SettingsIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Settings.svg" alt="#" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}

export const UsersIC = ({small}:{small?:boolean}) => {
    return (
        <img src="./src/resources/icons/Users.svg" alt="#" className="icon" style={small ? {width: "3vh", height: "3vh", marginRight: "0.25vw"} : {}}/>
    );
}
