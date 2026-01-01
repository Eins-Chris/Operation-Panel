import React, { useEffect, useRef, useState } from "react";
import "../styles/nav.css";
import { MenuIC, HomeIC, UploadIC, LoadIC, PlusIC } from "./icons.tsx";

type NavProps = {
    site: string;
    setSite: React.Dispatch<React.SetStateAction<string>>;
};

const Nav = ({ site, setSite }: NavProps) => {
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
            <div className="info">
                <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="controlls">
                <div className={`dropdown-container ${open ? "open" : ""}`} ref={containerRef}>
                    <button 
                    className="option pane dropdownBtn"
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
                        <li role="menutext" tabIndex={-1} className="menutext">General</li>
                        <li role="menuitem" tabIndex={-1} className="pane">
                            <button tabIndex={-1} onClick={() => setSite('info')}>Information</button>
                        </li>
                        <li role="menuitem" tabIndex={-1} className="pane">
                            <button tabIndex={-1} onClick={() => setSite('info')}>Instructions</button>
                        </li>
                        <li role="menusplit" tabIndex={-1} className="menusplit"></li>
                        <li role="menutext" tabIndex={-1} className="menutext">Actions</li>
                        <li role="menuitem" tabIndex={-1} className="pane">
                            <button tabIndex={-1} onClick={() => setSite('setting-devices')}>Settings</button>
                        </li>
                        <li role="menuitem" tabIndex={-1} className="pane">
                            <button tabIndex={-1} onClick={() => setSite('setting-user')}>
                                Select User
                                {/* Datenbank Shit - Wenn kein User selected ist: Select User, wenn einer selected is: Selected User: userID */}
                            </button>
                        </li>
                    </ul>
                </div>
                <button className="option pane" tabIndex={-1} onClick={() => setSite('home')}>
                    <HomeIC />
                </button>
                {/* <button className="option pane" tabIndex={-1} onClick={() => console.log("ÖLKJ")}>
                    <UploadIC />
                </button>
                <button className="option pane" tabIndex={-1} onClick={() => console.log("ÖLKJ")}>
                    <LoadIC />
                </button>
                <button className="option pane" tabIndex={-1}>
                    <PlusIC />
                </button> */}
            </div>
        </nav>
    )
}

export default Nav;
