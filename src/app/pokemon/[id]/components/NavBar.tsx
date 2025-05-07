'use client';

import Link from "next/link";
import { useState } from "react";
import {
    Home, BarChart2, Zap, Key, Activity, Ruler, RefreshCcw, Menu, X
} from "lucide-react";

export async function NavBar() {
    const [open, setOpen] = useState(false);

    const sections = [
        { href: "/", label: "Start", icon: <Home size={18} /> },
        { href: "#stats", label: "Stats", icon: <BarChart2 size={18} /> },
        { href: "#abilities", label: "Fähigkeiten", icon: <Key size={18} /> },
        { href: "#moves", label: "Attacken", icon: <Zap size={18} /> },
        { href: "#types", label: "Typen", icon: <Activity size={18} /> },
        { href: "#size", label: "Größe", icon: <Ruler size={18} /> },
        { href: "#forms", label: "Formen", icon: <RefreshCcw size={18} /> },
        { href: "#evolution", label: "Entwicklung", icon: <RefreshCcw size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-emerald-500 to-gray-900 shadow-lg rounded-b-xl">
            <div className="flex items-center justify-between px-4 py-3 md:hidden">
                <span className="text-white font-bold text-lg align-middle justify-center">Pokedex</span>
                <button onClick={() => setOpen(!open)} className="text-white">
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <ul className="flex flex-col items-center gap-2 pb-4 md:hidden">
                    {sections.map((section, idx) => (
                        <li key={idx}>
                            <Link
                                href={section.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 pb-4 px-4 py-2 text-white font-medium hover:bg-blue-600/70 rounded-md"
                            >
                                {section.icon}
                                <span>{section.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* Desktop menu */}
            <ul className="hidden md:flex justify-center gap-4 p-3">
                {sections.map((section, idx) => (
                    <li key={idx}>
                        <Link
                            href={section.href}
                            className="flex items-center gap-2 px-4 py-2 text-white text-sm md:text-base font-medium transition-all duration-200 rounded-md hover:bg-blue-600/70 hover:shadow-md"
                        >
                            {section.icon}
                            <span>{section.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
