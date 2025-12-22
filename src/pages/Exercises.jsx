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

    useEffect(() => {
        if (session?.user) fetchMeditationStats();
    }, [session]);

    useEffect(() => {
        let interval;
        if (timer && !isPaused && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timer) {
            handleCompleteSession();
        }
        return () => clearInterval(interval);
    }, [timer, isPaused, timeLeft]);

    const fetchMeditationStats = async () => {
        setRefreshing(true);
        const { data } = await supabase
            .from('meditacao_2026')
            .select('*')
            .eq('user_email', session.user.email);
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

        // Play sound PLIM!
        try {
            const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
            audio.volume = 0.6;
            audio.play();
        } catch (e) { console.log("Erro ao tocar som:", e) }

        setTimer(null);
        setShowPlim(true);

        // Save persistently
        await supabase.from('meditacao_2026').insert({
            user_email: session.user.email,
            duration: duration,
            date: today
        });

        // Update local state immediately
        await fetchMeditationStats();

        setTimeout(() => setShowPlim(false), 6000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return ;
    };

    return (
        <div className="max-w-4xl mx-auto py-12 pb-32 lg:pb-12">
            <header className="mb-12 flex flex-col items-center">
                <h2 className="text-5xl font-black tracking-tighter mb-10 text-brand-text">Exercícios</h2>

                <div className="flex gap-2 p-2 bg-white/50 border border-white/50 rounded-3xl shadow-3d-lg backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('meditation')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-500 text-sm ${activeTab === 'meditation' ? 'bg-brand-text text-white shadow-3d scale-[1.05]' : 'text-gray-400 hover:text-brand-text'
                            }`}
                    >
                        <Sparkles size={16} />
                        Meditação
                    </button>
                    <button
                        onClick={() => setActiveTab('breathing')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-500 text-sm ${activeTab === 'breathing' ? 'bg-brand-text text-white shadow-3d scale-[1.05]' : 'text-gray-400 hover:text-brand-text'
                            }`}
                    >
                        <Wind size={16} />
                        Respirando
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'meditation' ? (
                    <motion.div
                        key="med"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-16"
                    >
                        {timer ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-10">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="w-80 h-80 rounded-full border-8 border-white shadow-3d-lg flex items-center justify-center bg-white/40 backdrop-blur-md"
                                >
                                    <div className="text-7xl font-black tracking-tighter text-brand-text tabular-nums">
                                        {formatTime(timeLeft)}
                                    </div>
                                </motion.div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsPaused(!isPaused)}
                                        className="flex items-center gap-2 bg-brand-text text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-3d-lg hover:bg-black transition-all text-sm"
                                    >
                                        {isPaused ? <Play fill="currentColor" size={16} /> : 'Pausar'}
                                    </button>
                                    <button
                                        onClick={() => setTimer(null)}
                                        className="flex items-center gap-2 bg-white text-gray-400 px-8 py-4 rounded-[1.5rem] font-bold shadow-3d border border-white/50 text-sm"
                                    >
                                        <RotateCcw size={16} /> Resetar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-16 text-center">
                                <section className="flex flex-col items-center gap-10">
                                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <Clock className="text-gray-300" /> Escolha o seu tempo
                                    </h3>
                                    <div className="grid grid-cols-5 gap-6 w-full max-w-3xl overflow-x-auto pb-4 px-4 snap-x">
                                        {timerOptions.map((min, idx) => (
                                            <motion.button
                                                key={min}
                                                whileHover={{ y: -5, shadow: "var(--shadow-3d-lg)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => startMeditation(min)}
                                                className="bg-white border border-white/50 p-6 rounded-[2rem] font-black text-center shadow-3d transition-all group min-w-[80px] snap-center"
                                            >
                                                <span className="text-3xl block mb-1 text-brand-text group-hover:scale-110 transition-transform">{min}</span>
                                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">Min</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>

                                <AnimatePresence>
                                    {showPlim && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="bg-brand-text text-white p-10 rounded-[3rem] shadow-3d-lg flex flex-col items-center gap-4 text-center max-w-sm mx-auto z-50 border-4 border-white/20"
                                        >
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                                                <Bell size={32} />
                                            </div>
                                            <h4 className="text-3xl font-black italic tracking-tighter">PLIM! ✨</h4>
                                            <p className="font-medium opacity-80">Sessão finalizada com sucesso. Seus dados foram salvos.</p>
                                            <button
                                                onClick={() => setShowPlim(false)}
                                                className="mt-4 text-xs font-bold uppercase tracking-widest bg-white/10 px-6 py-2 rounded-full"
                                            >
                                                Fechar
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <section className="space-y-10">
                                    <div className="flex justify-between items-center px-4">
                                        <h3 className="text-xl font-black tracking-tight">Sua Jornada</h3>
                                        <button
                                            onClick={fetchMeditationStats}
                                            disabled={refreshing}
                                            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-3d active:scale-95 disabled:opacity-50"
                                            title="Atualizar Stats"
                                        >
                                            <RefreshCw className={`text-brand-text ${refreshing ? 'animate-spin' : ''}`} size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-3d flex items-center gap-6 group">
                                            <div className="bg-gray-50 p-5 rounded-2xl group-hover:bg-brand-text group-hover:text-white transition-colors duration-500">
                                                <History size={28} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Frequência</p>
                                                <p className="text-5xl font-black tracking-tighter text-gray-800">
                                                    {meditationStats.totalDays} <span className="text-lg text-gray-400 ml-1">dias</span>
                                                </p>
                                                <p className="text-xs text-brand-text font-bold mt-1 opacity-60">meditados</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-3d flex items-center gap-6 group">
                                            <div className="bg-gray-50 p-5 rounded-2xl group-hover:bg-brand-text group-hover:text-white transition-colors duration-500">
                                                <Clock size={28} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tempo Total</p>
                                                <p className="text-5xl font-black tracking-tighter text-gray-800">
                                                    {meditationStats.totalMinutes} <span className="text-lg text-gray-400 ml-1">min</span>
                                                </p>
                                                <p className="text-xs text-brand-text font-bold mt-1 opacity-60">de foco</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="breath"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-white p-12 rounded-[4rem] border border-white/50 shadow-3d-lg"
                    >
                        <BreathingCircle />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
