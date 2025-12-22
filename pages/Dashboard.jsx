import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Heatmap from '../components/Heatmap';
import { motion } from 'framer-motion';
import { QUOTES } from '../constants/quotes';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
    const { session, logout } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState({ text: '', author: '' });

    useEffect(() => {
        if (session?.user) fetchEntries();
        // Simple daily rotation based on day of year
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, [session]);

    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from('daily_checklist')
            .select('date, content')
            .eq('user_email', session.user.email);

        if (data) {
            setEntries(data);
        }
        setLoading(false);
    };

    const getUserName = () => {
        if (!session?.user?.email) return 'Viajante';
        return session.user.email.split('@')[0];
    };

    return (
        <div className="space-y-8 lg:space-y-12 pt-8 pb-32 lg:pb-0">
            {/* Greeting */}
            <header className="mb-8 lg:mb-10 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-brand-text mb-2">
                    Olá, <span className="opacity-60">{getUserName()}</span>
                </h1>
                <p className="text-lg text-gray-500 font-medium">Faça o hoje valer a pena.</p>
            </header>

            {/* REMOVED QUOTE CARD COMPLETELY AS REQUESTED */}

            {/* Heatmap Section */}
            <section>
                <div className="flex items-center gap-4 mb-6 px-2">
                    <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-gray-800">Seu Progresso</h3>
                </div>
                <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-50 shadow-3d overflow-x-auto">
                    <Heatmap data={entries} showTitle={false} />
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-12">
                <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <p className="text-lg lg:text-xl font-medium leading-relaxed text-brand-text mb-4 italic">"{quote.text}"</p>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">— {quote.author}</span>
                </div>
                <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Trajetória</h3>
                    <p className="text-5xl font-bold tracking-tighter text-brand-text">
                        {entries.length}
                        <span className="text-xl text-gray-400 font-medium ml-3 tracking-widest">DIAS</span>
                    </p>
                </div>
            </section>

            {/* Mobile Footer Logout */}
            <div className="mt-12 mb-8 lg:hidden flex justify-center">
                <button
                    onClick={logout}
                    className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors flex items-center gap-2 py-4 px-8 rounded-full bg-gray-50/50"
                >
                    <LogOut size={14} /> Sair da conta
                </button>
            </div>
        </div>
    );
}
