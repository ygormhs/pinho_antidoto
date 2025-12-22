import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle2, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { icon: CheckCircle2, label: 'Check-in', path: '/check-in' },
    { icon: Home, label: 'Início', path: '/' },
    { icon: Wind, label: 'Exercícios', path: '/exercicios' },
];

export default function MobileNav() {
    return (
        <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50 lg:hidden pb-8"
        >
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 relative ${isActive
                            ? 'text-brand-text'
                            : 'text-gray-300 hover:text-brand-text'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <item.icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute -bottom-2 w-1 h-1 bg-brand-text rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </motion.nav>
    );
}
