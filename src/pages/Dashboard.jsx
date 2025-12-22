import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Heatmap from '../components/Heatmap';
import { motion } from 'framer-motion';

import { QUOTES } from '../constants/quotes';

export default function Dashboard() {
    const { session } = useAuth();
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
            .from('diario_2026')
            .select('date')
            .eq('user_id', session.user.id);

        if (data) {
            setEntries(data);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-12 pt-8">
            <header className="flex flex-col gap-2">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight"
                >
                    Olá, {session.user.email.split('@')[0]}
                </motion.h2>
            </header>

            <section>
                {loading ? (
                    <div className="w-full h-64 bg-gray-50 rounded-3xl animate-pulse" />
                ) : (
                    <Heatmap entries={entries} />
                )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <p className="text-xl font-medium leading-relaxed text-brand-text mb-4 italic">"{quote.text}"</p>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">— {quote.author}</span>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Trajetória</h3>
                    <p className="text-5xl font-bold tracking-tighter">{entries.length} <span className="text-xl text-gray-300 font-medium">dias</span></p>
                </div>
            </section>
        </div>
    );
}
