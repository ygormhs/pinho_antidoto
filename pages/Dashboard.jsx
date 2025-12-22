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
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, [session]);

    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from('diario_2026')
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
        <div className="space-y-12 pt-8 pb-32 lg:pb-0">
            <header className="mb-12 text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-[#111827] mb-2">
                    Olá, <span className="opacity-40">{getUserName()}</span>
                </h1>
                <p className="text-xl text-gray-400 font-medium">Faça o hoje valer a pena.</p>
            </header>

            <section>
                <div className="flex items-center gap-4 mb-8 px-2">
                    <h3 className="text-2xl font-black tracking-tighter text-[#111827]">Seu Progresso</h3>
                </div>
                <div className="bg-white p-8 lg:p-12 rounded-[14px] border border-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-x-auto">
                    <Heatmap data={entries} showTitle={false} />
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-white p-10 rounded-[14px] border border-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-center">
                    <p className="text-xl lg:text-2xl font-bold leading-tight text-[#111827] mb-6 italic">"{quote.text}"</p>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">— {quote.author}</span>
                </div>
                <div className="bg-white p-10 rounded-[14px] border border-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.25em] mb-2">Trajetória</h3>
                    <p className="text-6xl font-black tracking-tighter text-[#111827]">
                        {entries.length}
                        <span className="text-2xl text-gray-300 font-medium ml-4 tracking-widest">DIAS</span>
                    </p>
                </div>
            </section>

            <div className="mt-16 mb-8 lg:hidden flex justify-center">
                <button
                    onClick={logout}
                    className="text-gray-400 text-xs font-black uppercase tracking-[0.25em] hover:text-red-500 transition-all flex items-center gap-3 py-5 px-10 rounded-[10px] bg-white border border-gray-50 shadow-lg"
                >
                    <LogOut size={16} /> Sair da conta
                </button>
            </div>
        </div>
    );
}
