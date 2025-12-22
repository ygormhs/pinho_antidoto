import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle2, Wind, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: CheckCircle2, label: 'Check-in', path: '/check-in' },
    { icon: Wind, label: 'Exercícios', path: '/exercicios' },
    { icon: BookOpen, label: 'Blog', path: '/blog' },
];

export default function MobileNav() {
    const { logout } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive
                            ? 'text-brand-text scale-110'
                            : 'text-gray-400 hover:text-brand-text'
                        }`
                    }
                >
                    <item.icon size={24} strokeWidth={2.5} />
                </NavLink>
            ))}

            <button
                onClick={logout}
                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sair"
            >
                <LogOut size={24} strokeWidth={2.5} />
            </button>
        </nav>
    );
}
