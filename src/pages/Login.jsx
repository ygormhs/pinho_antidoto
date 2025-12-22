import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            await login(email);
            // Redirect happens automatically as AuthProvider state changes
        } catch (err) {
            setError(err.message || 'Erro ao tentar entrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/20">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="flex justify-center mb-12">
                    <div className="w-16 h-16 bg-brand-text rounded-2xl flex items-center justify-center shadow-3d-lg">
                        <Sparkles className="text-white" size={32} />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-3d-lg text-center space-y-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black tracking-tighter text-brand-text">Antídoto</h1>
                                <p className="text-gray-400 font-medium tracking-tight">Digite seu e-mail de compra do antidoto para entrar.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-text transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-brand-text/10 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-6 outline-none transition-all font-medium text-brand-text shadow-inner"
                                    />
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="text-red-500 text-sm font-bold bg-red-50 py-3 rounded-xl border border-red-100"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <button
                                    disabled={loading}
                                    className="w-full bg-brand-text text-white py-5 rounded-[1.5rem] font-black text-lg shadow-3d hover:shadow-3d-lg flex items-center justify-center gap-3 transition-all hover:bg-black disabled:opacity-50 min-h-[70px]"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-white font-black">Carregando diário...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Entrar <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
