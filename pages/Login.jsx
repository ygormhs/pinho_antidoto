import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Mail, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await login(email);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Erro ao tentar entrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F6F7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="flex justify-center mb-12">
                    <div className="w-24 h-24 bg-white rounded-[14px] flex items-center justify-center shadow-xl border border-white/50 p-5 transform hover:scale-105 transition-transform">
                        <img src={logo} alt="Antídoto Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[14px] border border-white shadow-2xl text-center space-y-10 relative overflow-hidden">
                    <div className="space-y-3">
                        <h1 className="text-5xl font-black tracking-tighter text-[#111827]">Antídoto</h1>
                        <p className="text-gray-400 font-medium tracking-tight px-4 text-sm">Digite seu e-mail de compra para acessar sua jornada.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#111827] transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-gray-50 border border-transparent focus:border-black/5 focus:bg-white rounded-[10px] py-6 pl-16 pr-6 outline-none transition-all font-bold text-[#111827] shadow-inner text-base"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-xs font-black bg-red-50 py-4 rounded-[8px] border border-red-100"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <button
                            disabled={loading}
                            className="w-full bg-[#111827] text-white py-6 rounded-[10px] font-black text-xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-black disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Entrar</span>
                                    <ArrowRight size={22} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
