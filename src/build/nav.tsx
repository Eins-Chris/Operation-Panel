import React, { useEffect, useRef, useState } from "react";
import "../styles/nav.css";

const BottomNavbar: React.FC = () => {
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
        <div className={`dropdown-container ${open ? "open" : ""}`} ref={containerRef}>
            <button 
            className={`square-btn ${open ? "open" : ""} panel`}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="dropdownMenu"
            title="Settings"
            onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
            }}
            ref={buttonRef}
            >
                <span className="bar bar1"></span>
                <span className="bar bar2"></span>
                <span className="bar bar3"></span>
                <span className="sr-only">Menü öffnen</span>
            </button>

            <ul
            id="dropdownMenu"
            className="dropdown-menu"
            role="menu"
            aria-hidden={!open}
            ref={menuRef}
            >
                <li role="menuitem" tabIndex={-1}>
                    <button>Aktion 1</button>
                </li>
                <li role="menuitem" tabIndex={-1}>
                    <button>Aktion 2</button>
                </li>
                <li role="menuitem" tabIndex={-1}>
                    <button>Einstellungen</button>
                </li>
            </ul>
        </div>
        </nav>
    )
}

export default BottomNavbar;
