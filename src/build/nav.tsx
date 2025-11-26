import React, { useEffect, useRef, useState } from "react";
import "../styles/nav.css";
import type { Sites } from "./.main.tsx";

type NavProps = {
  site: string;
  setSite: React.Dispatch<React.SetStateAction<Sites>>;
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
            <div className={`container dropdown-container ${open ? "open" : ""}`} ref={containerRef}>
                <button 
                className={`square-btn ${open ? "open" : ""} pane`}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls="dropdownMenu"
                title="Menu"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                }}
                ref={buttonRef}
                >
                    <span className="bar bar1"></span>
                    <span className="bar bar2"></span>
                    <span className="bar bar3"></span>
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
                        <button>Device-01</button>
                    </li>
                    <li role="menusplit" tabIndex={-1} className="menusplit"></li>
                    <li role="menutext" tabIndex={-1} className="menutext">Actions</li>
                    <li role="menuitem" tabIndex={-1} className="pane">
                        <button onClick={() => setSite('devices')}>Edit Devices</button>
                    </li>
                </ul>
            </div>
            <div className="container home-container" >
                <button className="square-btn pane" onClick={() => setSite('home')}>
                    <span className="bar roof-left"></span>
                    <span className="bar roof-right"></span>
                    <span className="bar wall-left"></span>
                    <span className="bar wall-right"></span>
                    <span className="bar bottom"></span>
                </button>
            </div>
            <p>Current: [{site}]</p>
        </nav>
    )
}

export default Nav;
