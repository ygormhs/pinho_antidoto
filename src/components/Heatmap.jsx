import React, { useMemo } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, isFuture } from 'date-fns';
import { motion } from 'framer-motion';

export default function Heatmap({ entries = [], showTitle = true }) {
    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startOfYear(new Date(2026, 0, 1)),
            end: endOfYear(new Date(2026, 11, 31)),
        });
    }, []);

    const hasEntry = (date) => {
        return entries.some(entry => isSameDay(new Date(entry.date), date));
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-white/50 shadow-3d-lg overflow-x-auto">
            <div className="flex flex-col gap-6 min-w-[800px]">
                {showTitle && (
                    <div className="flex justify-between items-center px-2">
                        <h3 className="font-bold text-lg tracking-tight">Seu Ano em 2026</h3>
                        <div className="flex gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                                <span>Vazio</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-brand-text rounded-sm"></div>
                                <span>Registro</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                    {days.map((day, idx) => {
                        const active = hasEntry(day);
                        const future = isFuture(day) && day.getFullYear() >= 2026;

                        return (
                            <motion.div
                                key={day.toISOString()}
                                initial={false}
                                animate={{ backgroundColor: active ? '#111827' : '#F3F4F6' }}
                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                title={format(day, 'dd/MM/yyyy')}
                                className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-help ${active ? '' : 'hover:bg-gray-200'
                                    }`}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 font-medium px-2 uppercase tracking-widest">
                    <span>Jan</span>
                    <span>Fev</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Ago</span>
                    <span>Set</span>
                    <span>Out</span>
                    <span>Nov</span>
                    <span>Dez</span>
                </div>
            </div>
        </div>
    );
}
