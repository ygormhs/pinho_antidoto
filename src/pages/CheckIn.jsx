import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save, Loader2, Calendar, Briefcase, Smile, Moon, Target, ChevronDown, Edit3 } from 'lucide-react';
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
    const [hasExistingData, setHasExistingData] = useState(false);
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
            setHasExistingData(true);
            setFormData({
                work_good: data.content.work_good || false,
                day_good: data.content.day_good || false,
                sleep_good: data.content.sleep_good || false,
                tasks_done: data.content.tasks_done || false,
            });
            setNotes(data.content.notes || '');
        } else {
            setHasExistingData(false);
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
        setHasExistingData(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    // Definitive approach for date picking:
    // Some browsers block showPicker if not immediately following a user gesture.
    // We'll use a hidden input and proxy the click properly.
    const openDatePicker = () => {
        if (dateInputRef.current) {
            try {
                if (dateInputRef.current.showPicker) {
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.click();
                }
            } catch (err) {
                dateInputRef.current.click();
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8 mb-24 lg:mb-0">
            <header className="mb-12 flex flex-col items-center gap-6 text-center">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-2 text-[#111827]">Check-in</h2>
                    <p className="text-gray-400 text-base font-medium capitalize">
                        {format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>

                <div className="relative group inline-block">
                    {/* Visual Button - Responsive to click */}
                    <button
                        type="button"
                        onClick={openDatePicker}
                        className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-[12px] text-sm font-bold text-[#111827] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                    >
                        <Calendar size={18} />
                        <span>Escolher Data</span>
                        <ChevronDown size={14} className="text-gray-300 ml-1" />
                    </button>

                    {/* Hidden Date Input */}
                    <input
                        ref={dateInputRef}
                        type="date"
                        min="2024-01-01"
                        max="2030-12-31"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute h-0 w-0 opacity-0 pointer-events-none"
                        style={{ border: 'none', padding: 0 }}
                    />
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    {questions.map((q) => (
                        <motion.div
                            key={q.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToggle(q.id)}
                            className={`flex items-center gap-4 p-5 rounded-[14px] border transition-all duration-200 ease-out cursor-pointer select-none ${formData[q.id]
                                ? 'bg-[#111827] border-[#111827] text-white shadow-xl scale-[1.02]'
                                : 'bg-white border-gray-50 text-[#111827] hover:border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            <div className={`p-2.5 rounded-[8px] ${formData[q.id] ? 'bg-white/10' : 'bg-gray-50'}`}>
                                <q.icon size={20} strokeWidth={formData[q.id] ? 3 : 2} />
                            </div>
                            <span className="font-bold text-sm tracking-tight leading-tight">{q.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-4">
                    <label className="block font-black text-gray-400 text-[11px] uppercase tracking-[0.25em] ml-2">Diário</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Escreva aqui o seu dia..."
                        className="w-full bg-white border border-gray-50 rounded-[14px] p-8 min-h-[180px] outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm resize-none shadow-lg hover:shadow-xl focus:shadow-xl placeholder:text-gray-300 leading-relaxed text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#111827] text-white py-5 rounded-[12px] font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 ease-out disabled:opacity-50 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="animate-spin text-white mx-auto" size={24} />
                    ) : success ? (
                        <span className="flex items-center justify-center gap-2 italic">✓ Salvo com sucesso</span>
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            {hasExistingData ? <Edit3 size={20} /> : <Save size={20} />}
                            <span>{hasExistingData ? 'Editar dia' : 'Finalizar Dia'}</span>
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
}
