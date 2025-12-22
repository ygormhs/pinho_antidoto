import React, { useMemo } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, isFuture } from 'date-fns';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

export default function Heatmap({ entries = [], showTitle = true }) {
    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startOfYear(new Date(2026, 0, 1)),
            end: endOfYear(new Date(2026, 11, 31)),
        });
    }, []);

    const getEntryContent = (date) => {
        // Use manual YYYY-MM-DD format to avoid timezone issues
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = entries.find(e => e.date === dateStr);
        // Check if entry exists and has any recorded activity
        if (entry && (entry.work_good || entry.day_good || entry.sleep_good || entry.tasks_done || entry.notes)) {
            return entry;
        }
        return null;
    };

    // Debug: log entries on first load
    React.useEffect(() => {
        if (entries.length > 0) {
            console.log('Heatmap entries loaded:', entries.map(e => e.date));
        }
    }, [entries]);

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
                        const entry = getEntryContent(day);
                        const active = !!entry;
                        const dateStr = format(day, 'dd/MM/yyyy');
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const tooltipId = `tooltip-${dateKey}`;

                        // Debug first 5 days of January
                        if (idx < 5) {
                            console.log(`Day ${idx}: ${dateKey}, entry found: ${active}`);
                        }

                        // Generate summary for tooltip
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
                            <div key={dateKey}> {/* Wrapper for tooltip anchor */}
                                <motion.div
                                    data-tooltip-id={tooltipId}
                                    data-tooltip-content={`${dateStr} - ${summary}`}
                                    initial={false}
                                    animate={{ backgroundColor: active ? '#111827' : '#F3F4F6' }}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-help ${active ? '' : 'hover:bg-gray-200'}`}
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
    );
}
