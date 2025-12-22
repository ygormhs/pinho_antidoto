import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email) => {
        // Whitelist check
        const { data, error: countError } = await supabase
            .from('allowed_users')
            .select('email')
            .eq('email', email)
            .single();

        if (countError || !data) {
            throw new Error('Acesso não autorizado. Adquira o Antídoto.');
        }

        // Sign in with OTP (Magic Link)
        const { error: authError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (authError) throw authError;
        return true;
    };

    const logout = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ session, user: session?.user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
