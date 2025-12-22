import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Wind, Sparkles, Clock, History, Bell, RefreshCw } from 'lucide-react';
import BreathingCircle from '../components/BreathingCircle';
import Heatmap from '../components/Heatmap';
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
        const { data } = await supabase.from('meditacao_2026').select('*').eq('user_email', session.user.email);
        if (data) {
            const totalMin = data.reduce((acc, curr) => acc + curr.duration, 0);
            const uniqueDays = new Set(data.map(d => d.date)).size;
            setMeditationStats({ totalMinutes: totalMin, totalDays: uniqueDays, entries: data });
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
        await supabase.from('meditacao_2026').insert({ user_email: session.user.email, duration: duration, date: today });
        await fetchMeditationStats();
        setTimeout(() => setShowPlim(false), 6000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 lg:py-12 pb-32 lg:pb-12">
            <header className="mb-8 lg:mb-12 flex flex-col items-center">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-8 text-brand-text">Exercícios</h2>
                <div className="flex gap-2 p-1.5 bg-white/50 border border-white/50 rounded-2xl shadow-3d backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('meditation')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black transition-all duration-300 text-xs uppercase tracking-wider ${activeTab === 'meditation' ? 'bg-brand-text text-white shadow-md' : 'text-gray-400 hover:text-brand-text'}`}
                    >
                        <Sparkles size={14} /> Meditação
                    </button>
                    <button
                        onClick={() => setActiveTab('breathing')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black transition-all duration-300 text-xs uppercase tracking-wider ${activeTab === 'breathing' ? 'bg-brand-text text-white shadow-md' : 'text-gray-400 hover:text-brand-text'}`}
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
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-8 border-white shadow-3d-lg flex items-center justify-center bg-white/40 backdrop-blur-md">
                                    <div className="text-6xl lg:text-7xl font-black tracking-tighter text-brand-text tabular-nums">{formatTime(timeLeft)}</div>
                                </motion.div>
                                <div className="flex gap-4">
                                    <button onClick={() => setIsPaused(!isPaused)} className="flex items-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full font-bold shadow-3d hover:bg-black transition-all text-sm">
                                        {isPaused ? <Play fill="currentColor" size={16} /> : 'Pausar'}
                                    </button>
                                    <button onClick={() => setTimer(null)} className="flex items-center gap-2 bg-white text-gray-400 px-6 py-3 rounded-full font-bold shadow-3d border border-white/50 text-sm">
                                        <RotateCcw size={16} /> Resetar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 text-center max-w-lg mx-auto">
                                {/* COMPACT TIMER SELECTION - NO SCROLLING */}
                                <section className="flex flex-col items-center gap-6">
                                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2 opacity-80">
                                        <Clock size={20} className="text-gray-300" /> Escolha o tempo
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-3 w-full">
                                        {timerOptions.map((min) => (
                                            <motion.button
                                                key={min}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => startMeditation(min)}
                                                className="w-14 h-14 lg:w-16 lg:h-16 bg-white border border-gray-100 rounded-2xl lg:rounded-3xl font-black text-xl lg:text-2xl text-brand-text shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                                            >
                                                {min}
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>

                                <AnimatePresence>
                                    {showPlim && (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-brand-text text-white p-6 rounded-3xl shadow-3d flex flex-col items-center gap-3 text-center z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-xs">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce"><Bell size={24} /></div>
                                            <h4 className="text-2xl font-black italic">PLIM! ✨</h4>
                                            <button onClick={() => setShowPlim(false)} className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">Fechar</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <section className="space-y-6">
                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-lg font-black tracking-tight opacity-80">Sua Jornada</h3>
                                        <button onClick={fetchMeditationStats} disabled={refreshing} className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                                            <RefreshCw className={`text-brand-text ${refreshing ? 'animate-spin' : ''}`} size={14} />
                                        </button>
                                    </div>

                                    {/* COMPACT STATS CARDS */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-5">
                                            <div className="bg-gray-50 p-4 rounded-2xl text-brand-text">
                                                <History size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Frequência</p>
                                                <p className="text-4xl font-black tracking-tighter text-gray-800 leading-none">
                                                    {meditationStats.totalDays} <span className="text-sm text-gray-400 font-medium ml-1">dias</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-5">
                                            <div className="bg-gray-50 p-4 rounded-2xl text-brand-text">
                                                <Clock size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Tempo Total</p>
                                                <p className="text-4xl font-black tracking-tighter text-gray-800 leading-none">
                                                    {meditationStats.totalMinutes} <span className="text-sm text-gray-400 font-medium ml-1">min</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="breath" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] border border-white/50 shadow-sm">
                        <BreathingCircle />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
