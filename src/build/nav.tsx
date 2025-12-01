import React, { useEffect, useRef, useState } from "react";
import Dexie from "dexie";
import type { Sites } from "./types.tsx";
import "../styles/nav.css";
import { MenuIC, HomeIC, UploadIC, LoadIC, PlusIC } from "./icons.tsx";

type NavProps = {
    database: Dexie;
    site: string;
    setSite: React.Dispatch<React.SetStateAction<Sites>>;
    onSetContent: () => void;
    onResetContent: () => void;
};

const Nav = ({ site, setSite, onSetContent, onResetContent }: NavProps) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)

    const openMenu = () => {
        setOpen(true)
        buttonRef.current?.setAttribute("aria-expanded", "true")
        menuRef.current?.setAttribute("aria-hidden", "false")
        const first = menuRef.current?.querySelector<HTMLElement>("li[role='menuitem'] button")
        first?.focus()
    }

    const closeMenu = () => {
        setOpen(false)
        buttonRef.current?.setAttribute("aria-expanded", "false")
        menuRef.current?.setAttribute("aria-hidden", "true")
        buttonRef.current?.focus()
    }

    const toggleMenu = () => (open ? closeMenu() : openMenu())

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                closeMenu();
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    return (
        <nav className="navbar pane">
            <div className={`container dropdown-container ${open ? "open" : ""}`} ref={containerRef}>
                <button 
                className={`square-btn ${open ? "open" : ""} pane`}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls="dropdownMenu"
                title="Menu" 
                tabIndex={-1}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                }}
                ref={buttonRef}
                >
                    <MenuIC open={open} />
                </button>

                <ul
                id="dropdownMenu"
                className="dropdown-menu pane"
                role="menu"
                aria-hidden={!open}
                ref={menuRef}
                >
                    <li role="menutext" tabIndex={-1} className="menutext">Devices</li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button tabIndex={-1} onClick={() => setSite('TEMPORARY')}>temporary</button>
                    </li>
                    <li role="menusplit" tabIndex={-1} className="menusplit"></li>
                    <li role="menutext" tabIndex={-1} className="menutext">Actions</li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button tabIndex={-1} onClick={() => setSite('setting-devices')}>Edit Devices</button>
                    </li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button tabIndex={-1} onClick={() => setSite('setting-config-database')}>Config / Database</button>
                    </li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button tabIndex={-1} onClick={() => setSite('setting-user')}>
                            Select User
                            {/* Datenbank Shit - Wenn kein User selected ist: Select User, wenn einer selected is: Selected User: userID */}
                        </button>
                    </li>
                    <li role="menusplit" tabIndex={-1} className="menusplit"></li>
                    <li role="menutext" tabIndex={-1} className="menutext">General</li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button tabIndex={-1} onClick={() => setSite('info')}>Information</button>
                    </li>
                </ul>
            </div>
            <div className="container home-container" >
                <button className="square-btn pane" tabIndex={-1} onClick={() => setSite('home')}>
                    <HomeIC />
                </button>
            </div>
            <div className="navsplit"></div>
            <div className="container safeToDataBase-container">
                <button className="square-btn pane" tabIndex={-1} onClick={() => onSetContent()}>
                    <UploadIC />
                </button>
            </div>
            <div className="container loadFromDataBase-container">
                <button className="square-btn pane" tabIndex={-1} onClick={() => onResetContent()}>
                    <LoadIC />
                </button>
            </div>
            <div className="navsplit"></div>
            <div className={`container add-container ${site.includes("device") ? "visible" : ""}`} onClick={() => console.log(" ")}>
                <button className="square-btn pane">
                    <PlusIC />
                </button>
            </div>
            <p>Current: [{site}]</p>
        </nav>
    )
}

export default Nav;
