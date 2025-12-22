import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle2, Wind } from 'lucide-react';

export default function MobileNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center justify-between px-10 z-50 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {/* Check-in (Left) */}
            <NavLink
                to="/check-in"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-brand-text' : 'text-gray-300'}`
                }
            >
                <CheckCircle2 size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Check-in</span>
            </NavLink>

            {/* Home (Center - Floating/Featured) */}
            <div className="relative -top-6">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center justify-center w-16 h-16 rounded-full shadow-3d-lg transition-all duration-300 transform active:scale-95 ${isActive ? 'bg-brand-text text-white ring-4 ring-white' : 'bg-white text-gray-300 border border-gray-100'
                        }`
                    }
                >
                    <Home size={28} strokeWidth={2.5} />
                </NavLink>
            </div>

            {/* Exercises (Right) */}
            <NavLink
                to="/exercicios"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-brand-text' : 'text-gray-300'}`
                }
            >
                <Wind size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Exercícios</span>
            </NavLink>
        </nav>
    );
}
