import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (log in, log out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, initials: (name || email).slice(0, 2).toUpperCase() }
            }
        });
        if (error) return { success: false, error: error.message };
        return { success: true, user: data.user };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, user: data.user };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const updateUser = async (updates) => {
        // Depending on what we're updating, we would hit supabase.auth.updateUser
        // or a profile table.
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });
        if (!error && data.user) {
            setUser(data.user);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
