import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Wind, Sparkles, Clock, History, Bell, RefreshCw, X } from 'lucide-react';
import BreathingCircle from '../components/BreathingCircle';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Exercises() {
    const [activeTab, setActiveTab] = useState('meditation');
    const { session } = useAuth();
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showPlim, setShowPlim] = useState(false);
    const [meditationStats, setMeditationStats] = useState({ totalMinutes: 0, totalDays: 0, entries: [] });
    const [refreshing, setRefreshing] = useState(false);
    const timerOptions = [1, 5, 10, 15, 30];

    useEffect(() => { if (session?.user) fetchMeditationStats(); }, [session]);

    useEffect(() => {
        let interval;
        if (timer && !isPaused && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && timer) {
            handleCompleteSession();
        }
        return () => clearInterval(interval);
    }, [timer, isPaused, timeLeft]);

    const fetchMeditationStats = async () => {
        setRefreshing(true);
        const { data } = await supabase
            .from('meditacao_2026')
            .select('duration, date')
            .eq('user_id', session.user.id);

        if (data) {
            let totalMin = 0;
            const uniqueDays = new Set();

            data.forEach(session => {
                totalMin += session.duration || 0;
                uniqueDays.add(session.date);
            });

            setMeditationStats({
                totalMinutes: totalMin,
                totalDays: uniqueDays.size,
                entries: data
            });
        }
        setTimeout(() => setRefreshing(false), 500);
    };

    const startMeditation = (minutes) => {
        setTimer(minutes);
        setTimeLeft(minutes * 60);
        setIsPaused(false);
        setShowPlim(false);
    };

    const handleCompleteSession = async () => {
        const duration = timer;
        const today = new Date().toISOString().split('T')[0];

        try {
            const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
            audio.volume = 0.6;
            audio.play();
        } catch (e) { console.log("Erro som:", e) }

        setTimer(null);
        setShowPlim(true);

        let userId = session.user.id;

        // Safety: resolve email-id to UUID
        if (userId && userId.includes('@')) {
            const { data } = await supabase
                .from('allowed_users')
                .select('id')
                .eq('email', session.user.email)
                .single();
            if (data) userId = data.id;
        }

        // Save meditation log to meditacao_2026
        const { error } = await supabase
            .from('meditacao_2026')
            .insert({
                user_id: userId,
                duration: duration,
                date: today
            });

        if (error) {
            console.error('Erro ao salvar meditação:', error);
        }

        await fetchMeditationStats();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 lg:py-12 pb-32 lg:pb-12 px-4">
            <header className="mb-8 lg:mb-12 flex flex-col items-center">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-8 text-[#111827]">Exercícios</h2>
                <div className="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-[18px] shadow-lg">
                    <button
                        onClick={() => setActiveTab('meditation')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[12px] font-black transition-all duration-300 text-xs uppercase tracking-widest ${activeTab === 'meditation' ? 'bg-[#111827] text-white shadow-md' : 'text-gray-400 hover:text-[#111827]'}`}
                    >
                        <Sparkles size={14} /> Meditação
                    </button>
                    <button
                        onClick={() => setActiveTab('breathing')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[12px] font-black transition-all duration-300 text-xs uppercase tracking-widest ${activeTab === 'breathing' ? 'bg-[#111827] text-white shadow-md' : 'text-gray-400 hover:text-[#111827]'}`}
                    >
                        <Wind size={14} /> Respirar
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'meditation' ? (
                    <motion.div key="med" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 lg:space-y-12">
                        {timer ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-8">
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-white shadow-2xl flex items-center justify-center bg-white/60 backdrop-blur-md relative overflow-hidden">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-[#111827]"
                                    />
                                    <div className="text-7xl lg:text-8xl font-black tracking-tighter text-[#111827] tabular-nums relative z-10">{formatTime(timeLeft)}</div>
                                </motion.div>
                                <div className="flex gap-4">
                                    <button onClick={() => setIsPaused(!isPaused)} className="flex items-center gap-2 bg-[#111827] text-white px-8 py-4 rounded-[12px] font-black shadow-xl hover:shadow-2xl transition-all active:scale-95 text-base">
                                        {isPaused ? <Play fill="currentColor" size={20} /> : 'Pausar'}
                                    </button>
                                    <button onClick={() => setTimer(null)} className="flex items-center gap-2 bg-white text-gray-400 px-8 py-4 rounded-[12px] font-black shadow-xl border border-gray-50 transition-all active:scale-95 text-base">
                                        <RotateCcw size={20} /> Resetar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10 text-center max-w-md mx-auto px-4">
                                <section className="flex flex-col items-center gap-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black tracking-tight text-[#111827]">
                                            Meditar
                                        </h3>
                                        <p className="text-gray-400 text-sm">Escolha a duração da sessão</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        {timerOptions.map((min) => (
                                            <motion.button
                                                key={min}
                                                whileTap={{ scale: 0.95 }}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => startMeditation(min)}
                                                className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl py-5 font-bold text-[#111827] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1"
                                            >
                                                <span className="text-3xl font-black">{min}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">min</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-8 pt-8">
                                    <div className="flex justify-between items-center px-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Sua Jornada</h3>
                                        <button onClick={fetchMeditationStats} disabled={refreshing} className="p-2.5 bg-white border border-gray-50 rounded-xl hover:bg-gray-50 transition-all shadow-md active:scale-95 disabled:opacity-50">
                                            <RefreshCw className={`text-[#111827] ${refreshing ? 'animate-spin' : ''}`} size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-white p-7 rounded-[14px] border border-gray-50 shadow-xl flex items-center gap-6 group hover:shadow-2xl transition-all duration-300">
                                            <div className="bg-gray-50 p-5 rounded-[12px] text-[#111827] group-hover:scale-110 transition-transform">
                                                <History size={28} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Frequência</p>
                                                <p className="text-5xl font-black tracking-tighter text-[#111827] leading-none">
                                                    {meditationStats.totalDays} <span className="text-xl text-gray-300 font-medium ml-1 tracking-widest">DIAS</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-7 rounded-[14px] border border-gray-50 shadow-xl flex items-center gap-6 group hover:shadow-2xl transition-all duration-300">
                                            <div className="bg-gray-50 p-5 rounded-[12px] text-[#111827] group-hover:scale-110 transition-transform">
                                                <Clock size={28} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Tempo Total</p>
                                                <p className="text-5xl font-black tracking-tighter text-[#111827] leading-none">
                                                    {meditationStats.totalMinutes} <span className="text-xl text-gray-300 font-medium ml-1 tracking-widest">MIN</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="breath" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-8 lg:p-12 rounded-[14px] lg:rounded-[2rem] border border-gray-50 shadow-2xl">
                        <BreathingCircle />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPlim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#111827]/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#111827] text-white p-10 rounded-[2rem] shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full border border-white/10"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-bounce text-white">
                                <Bell size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-4xl font-black italic tracking-tighter">PLIM! ✨</h4>
                                <p className="text-gray-400 font-medium">Sessão concluída com sucesso.</p>
                            </div>
                            <button
                                onClick={() => setShowPlim(false)}
                                className="w-full bg-white text-[#111827] py-4 rounded-[12px] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <X size={16} strokeWidth={3} /> Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
