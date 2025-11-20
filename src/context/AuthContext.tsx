import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { initSupabase, signIn, signOut } from '../services/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Supabase from local storage OR env vars
        const localUrl = localStorage.getItem('supabase_url');
        const localKey = localStorage.getItem('supabase_key');

        const url = localUrl || import.meta.env.VITE_SUPABASE_URL;
        const key = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (url && key) {
            const supabase = initSupabase(url, key);
            if (supabase) {
                // Check active session
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setUser(session?.user ?? null);
                    setLoading(false);
                });

                // Listen for changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setUser(session?.user ?? null);
                });

                return () => subscription.unsubscribe();
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string) => {
        await signIn(email);
    };

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
