import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save, Loader2, Calendar, Briefcase, Smile, Moon, Target, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const questions = [
    { id: 'work_good', label: 'Trabalho produtivo?', icon: Briefcase },
    { id: 'day_good', label: 'O dia foi bom?', icon: Smile },
    { id: 'sleep_good', label: 'Dormiu bem?', icon: Moon },
    { id: 'tasks_done', label: 'Cumpriu promessas?', icon: Target },
];

export default function CheckIn() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [formData, setFormData] = useState({
        work_good: false,
        day_good: false,
        sleep_good: false,
        tasks_done: false,
    });
    const [notes, setNotes] = useState('');

    const dateInputRef = useRef(null);

    useEffect(() => {
        if (session?.user) fetchEntry(selectedDate);
    }, [selectedDate, session]);

    const fetchEntry = async (date) => {
        const { data } = await supabase
            .from('daily_checklist')
            .select('content')
            .eq('user_email', session.user.email)
            .eq('date', date)
            .single();

        if (data && data.content) {
            setFormData({
                work_good: data.content.work_good || false,
                day_good: data.content.day_good || false,
                sleep_good: data.content.sleep_good || false,
                tasks_done: data.content.tasks_done || false,
            });
            setNotes(data.content.notes || '');
        } else {
            setFormData({
                work_good: false,
                day_good: false,
                sleep_good: false,
                tasks_done: false,
            });
            setNotes('');
        }
    };

    const handleToggle = (id) => {
        setFormData(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const contentToSave = {
            ...formData,
            notes: notes
        };

        await supabase
            .from('daily_checklist')
            .upsert({
                user_email: session.user.email,
                date: selectedDate,
                content: contentToSave
            }, { onConflict: 'user_email,date' });

        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-xl mx-auto py-8 mb-24 lg:mb-0">
            <header className="mb-8 flex flex-col items-center gap-6">
                <div className="text-center">
                    <h2 className="text-3xl font-black tracking-tighter mb-1 text-brand-text">Check-in</h2>
                    <p className="text-gray-400 text-sm font-medium capitalize">
                        {format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="relative z-10 flex items-center gap-2 px-5 py-2 bg-white border border-gray-100 rounded-full text-xs font-black text-gray-700 shadow-3d hover:shadow-3d-lg transition-all duration-300"
                    >
                        <Calendar size={18} className="text-brand-text" />
                        <span>Escolher Data</span>
                        <ChevronDown size={14} className="text-gray-300" />
                    </button>
                    <input
                        ref={dateInputRef}
                        type="date"
                        min="2026-01-01"
                        max="2026-12-31"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        style={{ top: 0, left: 0 }}
                    />
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {questions.map((q) => (
                        <motion.div
                            key={q.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToggle(q.id)}
                            className={`flex items-center gap-3 p-4 rounded-3xl border transition-all cursor-pointer select-none ${formData[q.id]
                                ? 'bg-brand-text border-brand-text text-white shadow-3d scale-[1.02]'
                                : 'bg-white border-gray-50 text-brand-text hover:border-gray-200 shadow-3d'
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${formData[q.id] ? 'bg-white/10' : 'bg-gray-50'}`}>
                                <q.icon size={18} strokeWidth={formData[q.id] ? 3 : 2} />
                            </div>
                            <span className="font-bold text-sm tracking-tight leading-tight">{q.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-3">
                    <label className="block font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] ml-2">Diário</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Escreva aqui o seu dia..."
                        className="w-full bg-white border border-gray-50 rounded-[2rem] p-8 min-h-[140px] outline-none focus:ring-4 focus:ring-brand-text/5 transition-all text-base resize-none shadow-3d placeholder:text-gray-300 leading-relaxed text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-text text-white py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:shadow-3d-lg transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin text-white" />
                    ) : success ? (
                        <span className="flex items-center gap-2 italic">✓ Salvo.</span>
                    ) : (
                        <>
                            <Save size={18} />
                            <span>Finalizar Dia</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
