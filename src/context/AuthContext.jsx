import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'pulseapi_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const signUp = (email, password, name) => {
        // In production, this would call Supabase/Firebase
        const newUser = {
            id: crypto.randomUUID(),
            email,
            name: name || email.split('@')[0],
            initials: (name || email).slice(0, 2).toUpperCase(),
            plan: 'free',
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser };
    };

    const signIn = (email, password) => {
        // In production, this would validate against a backend
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const existingUser = JSON.parse(stored);
            if (existingUser.email === email) {
                setUser(existingUser);
                return { success: true, user: existingUser };
            }
        }
        // For demo: auto-create account on login
        return signUp(email, password, email.split('@')[0]);
    };

    const signOut = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setUser(updated);
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
