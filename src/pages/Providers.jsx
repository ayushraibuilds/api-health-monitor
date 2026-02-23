import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { providers, generateSparkline } from '../data/mockData';

export default function Providers() {
    const [expanded, setExpanded] = useState(null);

    const toggle = (id) => setExpanded(expanded === id ? null : id);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>API Providers</h1>
                        <p>Monitor health, latency, and usage across all connected providers</p>
                    </div>
                    <button className="btn btn-primary">+ Connect Provider</button>
                </div>
            </div>

            <div className="providers-grid">
                {providers.map((provider, i) => {
                    const sparkData = generateSparkline(provider.latency, 0.3);
                    const isExpanded = expanded === provider.id;
                    const budgetPct = ((provider.spend / provider.budget) * 100).toFixed(0);

                    return (
                        <div
                            key={provider.id}
                            className={`provider-card animate-fade-in stagger-${i + 1}`}
                            onClick={() => toggle(provider.id)}
                        >
                            <div className="provider-card-header">
                                <div className="provider-info">
                                    <div className="provider-logo" style={{ background: provider.color }}>
                                        {provider.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="provider-name">{provider.name}</div>
                                        <div className="provider-type">{provider.type}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className={`status-badge ${provider.status}`}>
                                        <span className="status-dot" />
                                        {provider.status}
                                    </span>
                                    {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                                </div>
                            </div>

                            <div className="provider-metrics">
                                <div className="provider-metric">
                                    <div className="provider-metric-value">{provider.latency}ms</div>
                                    <div className="provider-metric-label">Latency</div>
                                </div>
                                <div className="provider-metric">
                                    <div className="provider-metric-value">{provider.uptime}%</div>
                                    <div className="provider-metric-label">Uptime</div>
                                </div>
                                <div className="provider-metric">
                                    <div className="provider-metric-value">${provider.spend.toFixed(0)}</div>
                                    <div className="provider-metric-label">Spend MTD</div>
                                </div>
                            </div>

                            {/* Budget Bar */}
                            <div style={{ marginTop: 16, padding: '12px 0 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 6 }}>
                                    <span style={{ color: '#94a3b8' }}>Budget Usage</span>
                                    <span style={{ fontWeight: 600, color: budgetPct > 80 ? '#f59e0b' : '#94a3b8' }}>{budgetPct}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${Math.min(budgetPct, 100)}%`,
                                            background: budgetPct > 80
                                                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                                : `linear-gradient(90deg, ${provider.color}, ${provider.color}88)`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Sparkline */}
                            <div className="provider-sparkline">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparkData}>
                                        <Line type="monotone" dataKey="y" stroke={provider.color} strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    {provider.models.length > 0 && (
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                                Models
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {provider.models.map((m) => (
                                                    <span key={m} style={{
                                                        padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem',
                                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                                        color: '#94a3b8',
                                                    }}>{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                        Endpoints
                                    </div>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Endpoint</th>
                                                <th>Requests</th>
                                                <th>Latency</th>
                                                <th>Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {provider.endpoints.map((ep) => (
                                                <tr key={ep.name}>
                                                    <td style={{ fontFamily: "'SF Mono', monospace", fontSize: '0.78rem' }}>{ep.name}</td>
                                                    <td>{ep.requests.toLocaleString()}</td>
                                                    <td>{ep.latency}ms</td>
                                                    <td style={{ fontWeight: 600 }}>${ep.cost.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink size={12} /> View Docs
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
