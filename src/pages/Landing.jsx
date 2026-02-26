import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, ArrowRight, BarChart3, Shield, Zap, Globe, Bell,
    DollarSign, TrendingUp, Check, Star, ChevronRight, Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
    {
        icon: BarChart3,
        title: 'Real-Time Dashboards',
        desc: 'Monitor spend, latency, and uptime across all your API providers in a single pane of glass.',
        color: '#6366f1',
    },
    {
        icon: DollarSign,
        title: 'Cost Intelligence',
        desc: 'Track cost-per-request, model-level spend, and get projected monthly estimates before you overspend.',
        color: '#10b981',
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        desc: 'Budget limits, latency spikes, downtime — get notified via email, Slack, or webhook instantly.',
        color: '#f59e0b',
    },
    {
        icon: Globe,
        title: 'Multi-Provider',
        desc: 'OpenAI, Anthropic, Google AI, AWS Bedrock, Stripe, Twilio — one dashboard for everything.',
        color: '#3b82f6',
    },
    {
        icon: Shield,
        title: 'Uptime Monitoring',
        desc: 'Track API health and uptime with automatic status detection and incident timelines.',
        color: '#8b5cf6',
    },
    {
        icon: Zap,
        title: 'Performance Insights',
        desc: 'Identify slow endpoints, compare model costs, and optimize your API stack for speed and savings.',
        color: '#ec4899',
    },
];

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for side projects',
        features: ['3 API providers', 'Basic dashboard', 'Email alerts', '7-day history', 'Community support'],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/month',
        desc: 'For growing dev teams',
        features: ['Unlimited providers', 'Advanced analytics', 'Slack + webhook alerts', '90-day history', 'Budget forecasting', 'Priority support', 'Custom alert rules'],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$79',
        period: '/month',
        desc: 'For scaling organizations',
        features: ['Everything in Pro', 'Team access (10 seats)', 'SSO / SAML', '1-year history', 'API access', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
        cta: 'Contact Sales',
        popular: false,
    },
];

const logos = ['OpenAI', 'Anthropic', 'Google AI', 'AWS', 'Stripe', 'Twilio'];
const logoColors = ['#10a37f', '#d4a27f', '#4285f4', '#ff9900', '#635bff', '#f22f46'];

export default function Landing() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        const { success } = await signIn('demo@pulseapi.com', 'demo12345');
        setIsDemoLoading(false);
        if (success) navigate('/dashboard');
        else alert('Demo login failed. Please ensure the Supabase backend is running.');
    };

    return (
        <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>

            {/* ===== NAV ===== */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '16px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border-primary)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                    }}>
                        <Activity size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PulseAPI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <a href="#features" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
                    <a href="#pricing" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</a>
                    <button className="btn btn-ghost" onClick={() => navigate('/auth')} style={{ fontSize: '0.85rem' }}>Sign In</button>
                    <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ fontSize: '0.85rem' }}>
                        Get Started <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '120px 24px 80px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Glow effects */}
                <div style={{
                    position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: '30%', left: '20%',
                    width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 18px', borderRadius: 50,
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                    fontSize: '0.78rem', color: 'var(--accent-primary-hover)', fontWeight: 500,
                    marginBottom: 32,
                }}>
                    <Star size={13} fill="currentColor" /> Now in Public Beta — Free to use
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: 800,
                    lineHeight: 1.1, letterSpacing: '-0.04em',
                    maxWidth: 800, marginBottom: 24,
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #f1f5f9 30%, #6366f1 70%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Your APIs Cost Money.
                    </span>
                    <br />
                    <span style={{ color: 'var(--text-primary)' }}>Know Where It Goes.</span>
                </h1>

                <p style={{
                    fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-secondary)',
                    maxWidth: 600, marginBottom: 40,
                }}>
                    PulseAPI monitors health, costs, and performance across every API you use — so you never get a surprise bill or miss an outage again.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/auth')}
                        style={{
                            padding: '14px 32px', fontSize: '1rem', borderRadius: 14,
                            boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                        }}
                    >
                        Start Monitoring — Free <ArrowRight size={18} />
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleDemoLogin}
                        disabled={isDemoLoading}
                        style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 14 }}
                    >
                        <Eye size={18} /> {isDemoLoading ? 'Loading Demo...' : 'Live Demo'}
                    </button>
                </div>

                {/* Provider Logos */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 24, marginTop: 64,
                    padding: '16px 32px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-primary)',
                }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Supports
                    </span>
                    {logos.map((name, i) => (
                        <div key={name} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500,
                        }}>
                            <span style={{
                                width: 24, height: 24, borderRadius: 6, background: logoColors[i],
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.55rem', fontWeight: 700, color: 'white',
                            }}>
                                {name.slice(0, 2).toUpperCase()}
                            </span>
                            {name}
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" style={{
                padding: '100px 48px', maxWidth: 1200, margin: '0 auto',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <p style={{
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
                        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
                    }}>
                        Features
                    </p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                        Everything to Control Your API Spend
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
                        Stop guessing. Start monitoring. PulseAPI gives you full visibility from day one.
                    </p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24,
                }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            padding: 32, borderRadius: 16,
                            background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                            backdropFilter: 'blur(12px)',
                            transition: 'all 250ms ease',
                            cursor: 'default',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${f.color}44`;
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}15`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 20,
                            }}>
                                <f.icon size={22} color={f.color} />
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section style={{
                padding: '48px', margin: '0 48px', borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
                border: '1px solid rgba(99,102,241,0.15)',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                    maxWidth: 900, margin: '0 auto',
                }}>
                    {[
                        { value: '2.4K+', label: 'Developers' },
                        { value: '12M+', label: 'API Calls Monitored' },
                        { value: '$840K', label: 'Saved in API Costs' },
                        { value: '99.9%', label: 'Platform Uptime' },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4, color: 'var(--text-primary)' }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" style={{
                padding: '100px 48px', maxWidth: 1100, margin: '0 auto',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <p style={{
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
                        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
                    }}>
                        Pricing
                    </p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                        Simple, Transparent Pricing
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Start free, upgrade when you need more power.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
                    {plans.map((plan, i) => (
                        <div key={i} style={{
                            padding: 36, borderRadius: 20,
                            background: plan.popular
                                ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))'
                                : 'var(--bg-card)',
                            border: `1px solid ${plan.popular ? 'rgba(99,102,241,0.3)' : 'var(--border-primary)'}`,
                            position: 'relative',
                            transform: plan.popular ? 'scale(1.04)' : 'none',
                            boxShadow: plan.popular ? '0 8px 40px rgba(99,102,241,0.15)' : 'none',
                        }}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                    padding: '4px 16px', borderRadius: 50,
                                    background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                                    fontSize: '0.7rem', fontWeight: 700, color: 'white',
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>
                                    Most Popular
                                </div>
                            )}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>{plan.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{plan.price}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                            </div>
                            <button
                                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => navigate('/auth')}
                                style={{
                                    width: '100%', justifyContent: 'center', padding: '12px',
                                    borderRadius: 12, fontSize: '0.85rem', marginBottom: 28,
                                }}
                            >
                                {plan.cta} <ChevronRight size={14} />
                            </button>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {plan.features.map((f, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                        <Check size={15} color="var(--status-healthy)" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section style={{
                padding: '80px 48px', textAlign: 'center',
                borderTop: '1px solid var(--border-primary)',
                background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04))',
            }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                    Stop Bleeding API Costs
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                    Join thousands of developers who monitor their APIs with PulseAPI. Free forever. No credit card needed.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/auth')}
                    style={{
                        padding: '16px 40px', fontSize: '1.05rem', borderRadius: 14,
                        boxShadow: '0 0 40px rgba(99,102,241,0.3)',
                    }}
                >
                    Get Started Free <ArrowRight size={18} />
                </button>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={{
                padding: '48px 48px 32px', borderTop: '1px solid var(--border-primary)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Activity size={14} color="white" />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>PulseAPI</span>
                </div>
                <div style={{ display: 'flex', gap: 24, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <a href="#" style={{ color: 'inherit' }}>Privacy</a>
                    <a href="#" style={{ color: 'inherit' }}>Terms</a>
                    <a href="#" style={{ color: 'inherit' }}>Documentation</a>
                    <a href="#" style={{ color: 'inherit' }}>GitHub</a>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    © 2026 PulseAPI. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
