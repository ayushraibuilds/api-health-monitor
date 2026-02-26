import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import {
    DollarSign, Activity, Clock, Shield, TrendingUp, TrendingDown,
    AlertTriangle, AlertCircle, Info, ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProvidersData, getKPIData, getCostTrendData, getSpendBreakdown, getAlerts } from '../services/apiService';
import { supabase } from '../lib/supabase';
const severityIcon = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const kpiIcons = [DollarSign, Activity, Clock, Shield];
const kpiColors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: '0.8rem',
        }}>
            <p style={{ color: '#94a3b8', marginBottom: 8 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, fontWeight: 600 }}>
                    {p.name}: ${p.value.toFixed(2)}
                </p>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const [providers, setProviders] = useState([]);
    const [kpiMetrics, setKpiMetrics] = useState({});
    const [costTrendData, setCostTrendData] = useState([]);
    const [spendBreakdown, setSpendBreakdown] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const load = async () => {
            setProviders(await getProvidersData());
            setKpiMetrics(await getKPIData() || {});
            setCostTrendData(await getCostTrendData());
            setSpendBreakdown(await getSpendBreakdown());
            setAlerts(await getAlerts());
        };
        load();

        // Real-time live sync for new metrics
        const channel = supabase
            .channel('public:api_metrics')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'api_metrics' }, () => {
                // Reload dashboard data when a new ping is recorded
                load();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const kpiData = Object.values(kpiMetrics);
    const recentAlerts = alerts.filter(a => !a?.acknowledged).slice(0, 4);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>API Health Dashboard</h1>
                        <p>Real-time monitoring across {providers.length} providers • Last updated just now</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary">Export Report</button>
                        <button className="btn btn-primary">+ Add Provider</button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpiData.map((kpi, i) => {
                    const Icon = kpiIcons[i];
                    return (
                        <div
                            key={i}
                            className={`kpi-card animate-fade-in stagger-${i + 1}`}
                            style={{ '--kpi-color': kpiColors[i], '--kpi-bg': `${kpiColors[i]}20` }}
                        >
                            <div className="kpi-card-top">
                                <div className="kpi-icon">
                                    <Icon />
                                </div>
                                <span className={`kpi-trend ${kpi.trendDirection}`}>
                                    {kpi.trendDirection === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {kpi.trend}
                                </span>
                            </div>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className="kpi-label">{kpi.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Cost Trend Chart */}
                <div className="glass-card animate-fade-in stagger-5">
                    <div className="glass-card-header">
                        <h3>Cost Trend (30 Days)</h3>
                        <div className="tab-group">
                            <button className="tab-item active">Daily</button>
                            <button className="tab-item">Weekly</button>
                            <button className="tab-item">Monthly</button>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={costTrendData}>
                                <defs>
                                    <linearGradient id="gradOpenai" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10a37f" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10a37f" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradAnthropic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4a27f" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4a27f" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradGoogle" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4285f4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4285f4" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradAws" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff9900" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ff9900" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="openai" name="OpenAI" stroke="#10a37f" fill="url(#gradOpenai)" strokeWidth={2} />
                                <Area type="monotone" dataKey="anthropic" name="Anthropic" stroke="#d4a27f" fill="url(#gradAnthropic)" strokeWidth={2} />
                                <Area type="monotone" dataKey="google" name="Google AI" stroke="#4285f4" fill="url(#gradGoogle)" strokeWidth={2} />
                                <Area type="monotone" dataKey="aws" name="AWS" stroke="#ff9900" fill="url(#gradAws)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spend Breakdown Donut */}
                <div className="glass-card animate-fade-in stagger-6">
                    <div className="glass-card-header">
                        <h3>Spend Breakdown</h3>
                    </div>
                    <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendBreakdown}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {spendBreakdown.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`$${value.toFixed(2)}`, null]}
                                    contentStyle={{
                                        background: 'rgba(17,24,39,0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 10,
                                        fontSize: '0.8rem',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 4 }}>
                        {spendBreakdown.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#94a3b8' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Quick Status + Recent Alerts */}
            <div className="charts-grid">
                {/* Provider Quick Status */}
                <div className="glass-card">
                    <div className="glass-card-header">
                        <h3>Provider Status</h3>
                        <button className="btn btn-ghost btn-sm">
                            View All <ArrowRight size={12} />
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Status</th>
                                <th>Latency</th>
                                <th>Requests</th>
                                <th>Spend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{
                                                width: 28, height: 28, borderRadius: 6, background: p.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.65rem', fontWeight: 700, color: 'white',
                                            }}>
                                                {p.name.slice(0, 2).toUpperCase()}
                                            </span>
                                            {p.name}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${p.status}`}>
                                            <span className="status-dot" />
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>{p.latency}ms</td>
                                    <td>{p.requests.toLocaleString()}</td>
                                    <td style={{ fontWeight: 600 }}>${p.spend.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Alerts */}
                <div className="glass-card">
                    <div className="glass-card-header">
                        <h3>Active Alerts</h3>
                        <span className="status-badge critical">
                            <span className="status-dot" />
                            {recentAlerts.length} unresolved
                        </span>
                    </div>
                    <div className="alerts-list">
                        {recentAlerts.map((alert) => {
                            const Icon = severityIcon[alert.severity];
                            return (
                                <div key={alert.id} className="alert-item">
                                    <div className={`alert-icon ${alert.severity}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="alert-content">
                                        <div className="alert-title">{alert.title}</div>
                                        <div className="alert-meta">
                                            <span>{alert.provider}</span>
                                            <span>•</span>
                                            <span>{alert.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
