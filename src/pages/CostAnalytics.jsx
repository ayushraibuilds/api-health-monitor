import { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Calculator } from 'lucide-react';
import { getProvidersData, getCostTrendData } from '../services/apiService';
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(17+ 24, 39, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: '0.8rem',
        }}>
            <p style={{ color: '#94a3b8', marginBottom: 8 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.fill, fontWeight: 600 }}>
                    {p.name}: ${typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </p>
            ))}
        </div>
    );
};

export default function CostAnalytics() {
    const [period, setPeriod] = useState('daily');
    const [providers, setProviders] = useState([]);
    const [costTrendData, setCostTrendData] = useState([]);
    const costByModel = [];
    const weeklyComparison = [];

    useEffect(() => {
        getProvidersData().then(setProviders);
        getCostTrendData().then(setCostTrendData);
    }, []);

    const totalSpend = providers.reduce((sum, p) => sum + p.spend, 0);
    const totalBudget = providers.reduce((sum, p) => sum + p.budget, 0);
    const budgetPct = ((totalSpend / totalBudget) * 100).toFixed(1);
    const projectedSpend = (totalSpend / 19 * 30).toFixed(0); // 19 days into month
    const projectedOver = projectedSpend > totalBudget;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>Cost Analytics</h1>
                        <p>Track spend, budgets, and cost optimization opportunities</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary">Download CSV</button>
                        <button className="btn btn-primary">Set Budget</button>
                    </div>
                </div>
            </div>

            {/* Cost KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card animate-fade-in stagger-1" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99,102,241,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><DollarSign /></div>
                        <span className="kpi-trend up"><TrendingUp size={12} /> +12.3%</span>
                    </div>
                    <div className="kpi-value">${totalSpend.toFixed(0)}</div>
                    <div className="kpi-label">Total Spend (MTD)</div>
                </div>

                <div className="kpi-card animate-fade-in stagger-2" style={{ '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16,185,129,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><Target /></div>
                    </div>
                    <div className="kpi-value">{budgetPct}%</div>
                    <div className="kpi-label">Budget Utilization</div>
                </div>

                <div className="kpi-card animate-fade-in stagger-3" style={{ '--kpi-color': projectedOver ? '#ef4444' : '#f59e0b', '--kpi-bg': projectedOver ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><Calculator /></div>
                        {projectedOver && <span className="kpi-trend down"><AlertTriangle size={12} /> Over</span>}
                    </div>
                    <div className="kpi-value">${projectedSpend}</div>
                    <div className="kpi-label">Projected Monthly</div>
                </div>

                <div className="kpi-card animate-fade-in stagger-4" style={{ '--kpi-color': '#8b5cf6', '--kpi-bg': 'rgba(139,92,246,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><DollarSign /></div>
                        <span className="kpi-trend up"><TrendingDown size={12} /> -3.2%</span>
                    </div>
                    <div className="kpi-value">$0.028</div>
                    <div className="kpi-label">Avg Cost / Request</div>
                </div>
            </div>

            {/* Spend Trend */}
            <div className="glass-card animate-fade-in stagger-5" style={{ marginBottom: 24 }}>
                <div className="glass-card-header">
                    <h3>Spend Trend</h3>
                    <div className="tab-group">
                        {['daily', 'weekly', 'monthly'].map((p) => (
                            <button key={p} className={`tab-item ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="chart-container" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={costTrendData}>
                            <defs>
                                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="total" name="Total Spend" stroke="#6366f1" fill="url(#totalGrad)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="charts-grid">
                {/* Budget vs Actual */}
                <div className="glass-card">
                    <div className="glass-card-header">
                        <h3>Budget vs Actual (Weekly)</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyComparison} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }}
                                />
                                <Bar dataKey="budget" name="Budget" fill="rgba(99,102,241,0.25)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actual" name="Actual" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost by Provider */}
                <div className="glass-card">
                    <div className="glass-card-header">
                        <h3>Cost by Provider</h3>
                    </div>
                    <div className="cost-breakdown-list">
                        {providers.sort((a, b) => b.spend - a.spend).map((p) => {
                            const pct = ((p.spend / totalSpend) * 100).toFixed(0);
                            return (
                                <div key={p.id} className="cost-breakdown-item">
                                    <span className="cost-bar-label">{p.name}</span>
                                    <div className="cost-bar-track">
                                        <div className="cost-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                                    </div>
                                    <span className="cost-bar-value">${p.spend.toFixed(0)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Cost by Model Table */}
            <div className="glass-card" style={{ marginTop: 24 }}>
                <div className="glass-card-header">
                    <h3>Cost by Model</h3>
                    <button className="btn btn-ghost btn-sm">Export</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Provider</th>
                            <th>Requests</th>
                            <th>Total Cost</th>
                            <th>Avg Cost/Req</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costByModel.map((row) => {
                            const isUp = row.trend.startsWith('+');
                            return (
                                <tr key={row.model}>
                                    <td style={{ fontWeight: 600 }}>{row.model}</td>
                                    <td style={{ color: '#94a3b8' }}>{row.provider}</td>
                                    <td>{row.requests.toLocaleString()}</td>
                                    <td style={{ fontWeight: 600 }}>${row.cost.toFixed(2)}</td>
                                    <td>${row.avgCost.toFixed(4)}</td>
                                    <td>
                                        <span style={{
                                            color: isUp ? '#ef4444' : '#10b981',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                        }}>
                                            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {row.trend}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
