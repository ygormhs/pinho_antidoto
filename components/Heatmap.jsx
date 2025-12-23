import React, { useMemo, useState } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { X, Briefcase, Smile, Moon, Target, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Heatmap({ entries = [], showTitle = true }) {
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Get sorted list of entries with dates
    const sortedEntries = useMemo(() => {
        return entries
            .filter(e => e.work_good || e.day_good || e.sleep_good || e.tasks_done || e.notes)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [entries]);

    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startOfYear(new Date(2026, 0, 1)),
            end: endOfYear(new Date(2026, 11, 31)),
        });
    }, []);

    const getEntryContent = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = entries.find(e => e.date === dateStr);
        if (entry && (entry.work_good || entry.day_good || entry.sleep_good || entry.tasks_done || entry.notes)) {
            return entry;
        }
        return null;
    };

    const handleDayClick = (day, entry) => {
        if (entry) {
            setSelectedEntry(entry);
            setSelectedDate(day);
        }
    };

    const navigateEntry = (direction) => {
        if (!selectedEntry) return;
        const currentIndex = sortedEntries.findIndex(e => e.date === selectedEntry.date);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < sortedEntries.length) {
            const newEntry = sortedEntries[newIndex];
            setSelectedEntry(newEntry);
            setSelectedDate(new Date(newEntry.date + 'T12:00:00'));
        }
    };

    const canNavigatePrev = selectedEntry && sortedEntries.findIndex(e => e.date === selectedEntry.date) > 0;
    const canNavigateNext = selectedEntry && sortedEntries.findIndex(e => e.date === selectedEntry.date) < sortedEntries.length - 1;

    const closeModal = () => {
        setSelectedEntry(null);
        setSelectedDate(null);
    };

    return (
        <>
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
                            const entry = getEntryContent(day);
                            const active = !!entry;
                            const dateStr = format(day, 'dd/MM/yyyy');
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const tooltipId = `tooltip-${dateKey}`;

                            let summary = "Sem registros";
                            if (active) {
                                const parts = [];
                                if (entry.work_good) parts.push("Trabalho");
                                if (entry.day_good) parts.push("Dia Bom");
                                if (entry.sleep_good) parts.push("Sono");
                                if (entry.tasks_done) parts.push("Metas");
                                if (entry.notes) parts.push("Diário");
                                summary = parts.length > 0 ? parts.join(", ") : "Registrado";
                            }

                            return (
                                <div key={dateKey}>
                                    <motion.div
                                        data-tooltip-id={tooltipId}
                                        data-tooltip-content={`${dateStr} - ${summary}`}
                                        initial={false}
                                        animate={{ backgroundColor: active ? '#111827' : '#F3F4F6' }}
                                        whileHover={{ scale: 1.2, zIndex: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDayClick(day, entry)}
                                        className={`w-3.5 h-3.5 rounded-sm transition-colors ${active ? 'cursor-pointer' : 'cursor-default'} ${active ? '' : 'hover:bg-gray-200'}`}
                                    />
                                    <Tooltip id={tooltipId} style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '8px' }} />
                                </div>
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

            {/* Modal */}
            <AnimatePresence>
                {selectedEntry && selectedDate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[20px] shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-[#111827] text-white p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-xs uppercase tracking-widest text-gray-400">Registro do Dia</p>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors -mt-1 -mr-1"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        onClick={() => navigateEntry(-1)}
                                        disabled={!canNavigatePrev}
                                        className={`p-2 rounded-full transition-colors ${canNavigatePrev ? 'hover:bg-white/10 text-white' : 'text-gray-600 cursor-not-allowed'}`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <h3 className="text-xl font-black tracking-tight capitalize text-center flex-1">
                                        {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                                    </h3>
                                    <button
                                        onClick={() => navigateEntry(1)}
                                        disabled={!canNavigateNext}
                                        className={`p-2 rounded-full transition-colors ${canNavigateNext ? 'hover:bg-white/10 text-white' : 'text-gray-600 cursor-not-allowed'}`}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Status indicators */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedEntry.work_good ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                        <Briefcase size={20} />
                                        <span className="font-medium text-sm">Trabalho produtivo</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedEntry.day_good ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                        <Smile size={20} />
                                        <span className="font-medium text-sm">Dia foi bom</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedEntry.sleep_good ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                        <Moon size={20} />
                                        <span className="font-medium text-sm">Dormiu bem</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedEntry.tasks_done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                        <Target size={20} />
                                        <span className="font-medium text-sm">Metas cumpridas</span>
                                    </div>
                                </div>

                                {/* Diary notes */}
                                {selectedEntry.notes && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Diário</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedEntry.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!selectedEntry.notes && (
                                    <p className="text-center text-gray-400 text-sm py-4">Nenhum registro no diário</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
