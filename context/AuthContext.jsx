import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for pseudo-session in localStorage
        const savedUser = localStorage.getItem('antidoto_user');
        if (savedUser) {
            setSession({ user: JSON.parse(savedUser) });
        }
        setLoading(false);
    }, []);

    const login = async (email) => {
        const cleanEmail = email.trim().toLowerCase();

        // Whitelist check
        const { data, error: fetchError } = await supabase
            .from('allowed_users')
            .select('id, email')
            .eq('email', cleanEmail)
            .single();

        if (fetchError || !data) {
            throw new Error('Acesso não autorizado. Adquira o Antídoto.');
        }

        // Create pseudo-session with REAL id from database
        const pseudoUser = { email: cleanEmail, id: data.id };
        localStorage.setItem('antidoto_user', JSON.stringify(pseudoUser));
        setSession({ user: pseudoUser });

        return true;
    };

    const logout = () => {
        localStorage.removeItem('antidoto_user');
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, user: session?.user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
