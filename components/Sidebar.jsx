import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle2, Wind, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: CheckCircle2, label: 'Check-in', path: '/check-in' },
    { icon: Wind, label: 'Exercícios', path: '/exercicios' },
    { icon: BookOpen, label: 'Blog', path: '/blog' },
];

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex-col p-6 z-50">
            <div className="mb-12">
                <h1 className="text-2xl font-bold tracking-tighter text-brand-text">Antídoto</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-brand-text text-white'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-brand-text'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-auto"
            >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
            </button>
        </aside>
    );
}
