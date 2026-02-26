import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, User, ArrowRight, Zap, BarChart3, Shield } from 'lucide-react';

export default function AuthPage() {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = mode === 'login'
                ? await signIn(email, password)
                : await signUp(email, password, name);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Authentication failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: BarChart3, text: 'Real-time cost tracking across all API providers' },
        { icon: Shield, text: 'Uptime monitoring with instant alerts' },
        { icon: Zap, text: 'Performance insights & optimization tips' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--bg-primary)',
            position: 'relative',
            zIndex: 1,
        }}>
            {/* Left Panel — Branding */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '48px 64px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)',
                borderRight: '1px solid var(--border-primary)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                    }}>
                        <Activity size={22} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary-hover))',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>PulseAPI</h1>
                    </div>
                </div>

                <h2 style={{
                    fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2,
                    letterSpacing: '-0.03em', marginBottom: 16,
                    background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    Monitor every API.<br />Control every dollar.
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 440 }}>
                    Track health, costs, and performance across OpenAI, Anthropic, Google AI, AWS, and more — all in one dashboard.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: 10,
                                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <f.icon size={18} color="var(--accent-primary)" />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.text}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 64, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Trusted by 2,400+ developers worldwide
                </div>
            </div>

            {/* Right Panel — Auth Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
                        {mode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 32 }}>
                        {mode === 'login'
                            ? 'Sign in to your PulseAPI dashboard'
                            : 'Start monitoring your APIs for free'}
                    </p>

                    {error && (
                        <div style={{
                            padding: '10px 16px', marginBottom: 20, borderRadius: 10,
                            background: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)',
                            color: 'var(--status-critical)', fontSize: '0.8rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{
                                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                    }} />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ paddingLeft: 40, width: '100%' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }} />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: 40, width: '100%' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }} />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ paddingLeft: 40, width: '100%' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%', justifyContent: 'center', padding: '12px',
                                fontSize: '0.9rem', marginTop: 8, borderRadius: 12,
                            }}
                        >
                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div style={{
                        textAlign: 'center', marginTop: 24,
                        fontSize: '0.8rem', color: 'var(--text-muted)',
                    }}>
                        {mode === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => { setMode('signup'); setError(''); }}
                                    style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                                >
                                    Sign up free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); }}
                                    style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{
                        marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-primary)',
                        textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)',
                    }}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>
                </div>
            </div>
        </div>
    );
}
