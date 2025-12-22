import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BreathingCircle() {
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [text, setText] = useState('Tocar para Iniciar');

    useEffect(() => {
        let timeout;
        if (phase === 'inhale') {
            setText('Inspire');
            timeout = setTimeout(() => setPhase('hold'), 4000);
        } else if (phase === 'hold') {
            setText('Segure');
            timeout = setTimeout(() => setPhase('exhale'), 1000);
        } else if (phase === 'exhale') {
            setText('Expire');
            timeout = setTimeout(() => setPhase('inhale'), 4000);
        }
        return () => clearTimeout(timeout);
    }, [phase]);

    const toggle = () => {
        if (phase === 'ready') setPhase('inhale');
        else setPhase('ready');
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-12">
            <div
                onClick={toggle}
                className="relative w-80 h-80 flex items-center justify-center cursor-pointer group"
            >
                {/* Outer Circle (Reference) */}
                <div className="absolute inset-0 border-2 border-gray-100 rounded-full" />

                {/* Primary Breathing Circle */}
                <motion.div
                    animate={{
                        scale: phase === 'ready' ? 0.3 : (phase === 'inhale' ? 1 : (phase === 'hold' ? 1 : 0.3)),
                        backgroundColor: phase === 'ready' ? '#E5E7EB' : '#111827',
                    }}
                    transition={{
                        duration: phase === 'inhale' ? 4 : (phase === 'hold' ? 1 : 4),
                        ease: "easeInOut"
                    }}
                    className="w-full h-full rounded-full flex items-center justify-center"
                >
                    <span className="text-white font-bold text-xl uppercase tracking-widest pointer-events-none">
                        {phase === 'ready' ? '' : text}
                    </span>
                </motion.div>


                {/* Ready State Helper */}
                {phase === 'ready' && (
                    <div className="absolute text-brand-text font-bold text-lg uppercase tracking-wider animate-pulse">
                        {text}
                    </div>
                )}
            </div>

            <div className="text-center max-w-xs">
                <p className="text-gray-400 text-sm">
                    A respiração consciente ajuda a acalmar o sistema nervoso e focar no presente.
                </p>
            </div>
        </div>
    );
}
