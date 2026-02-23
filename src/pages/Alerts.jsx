import { useState } from 'react';
import {
    AlertCircle, AlertTriangle, Info, Bell, Check, X, Filter,
    Plus, Clock, Zap,
} from 'lucide-react';
import { alerts, incidents, alertRules } from '../data/mockData';

const severityIcon = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

export default function Alerts() {
    const [tab, setTab] = useState('alerts');
    const [filter, setFilter] = useState('all');

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter(a => a.severity === filter);

    const unresolved = alerts.filter(a => !a.acknowledged).length;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>Alerts & Incidents</h1>
                        <p>Monitor, manage, and configure alert rules for all your APIs</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary">
                            <Filter size={14} /> Filter
                        </button>
                        <button className="btn btn-primary">
                            <Plus size={14} /> New Rule
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card" style={{ '--kpi-color': '#ef4444', '--kpi-bg': 'rgba(239,68,68,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><AlertCircle /></div>
                    </div>
                    <div className="kpi-value">{alerts.filter(a => a.severity === 'critical').length}</div>
                    <div className="kpi-label">Critical Alerts</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': '#f59e0b', '--kpi-bg': 'rgba(245,158,11,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><AlertTriangle /></div>
                    </div>
                    <div className="kpi-value">{alerts.filter(a => a.severity === 'warning').length}</div>
                    <div className="kpi-label">Warnings</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99,102,241,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><Bell /></div>
                    </div>
                    <div className="kpi-value">{unresolved}</div>
                    <div className="kpi-label">Unresolved</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16,185,129,0.12)' }}>
                    <div className="kpi-card-top">
                        <div className="kpi-icon"><Zap /></div>
                    </div>
                    <div className="kpi-value">{alertRules.filter(r => r.enabled).length}</div>
                    <div className="kpi-label">Active Rules</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div className="tab-group">
                    {[['alerts', 'Alerts'], ['timeline', 'Timeline'], ['rules', 'Rules']].map(([key, label]) => (
                        <button key={key} className={`tab-item ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                            {label}
                        </button>
                    ))}
                </div>
                {tab === 'alerts' && (
                    <div className="tab-group">
                        {['all', 'critical', 'warning', 'info'].map((f) => (
                            <button key={f} className={`tab-item ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tab Content */}
            {tab === 'alerts' && (
                <div className="alerts-list">
                    {filteredAlerts.map((alert) => {
                        const Icon = severityIcon[alert.severity];
                        return (
                            <div key={alert.id} className="alert-item">
                                <div className={`alert-icon ${alert.severity}`}>
                                    <Icon size={16} />
                                </div>
                                <div className="alert-content">
                                    <div className="alert-title">{alert.title}</div>
                                    <div className="alert-description">{alert.description}</div>
                                    <div className="alert-meta">
                                        <span>{alert.provider}</span>
                                        <span>•</span>
                                        <span><Clock size={10} style={{ marginRight: 3 }} />{alert.timestamp}</span>
                                        {alert.acknowledged && (
                                            <>
                                                <span>•</span>
                                                <span style={{ color: '#10b981' }}><Check size={10} /> Acknowledged</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="alert-actions">
                                    {!alert.acknowledged && (
                                        <>
                                            <button className="btn btn-ghost btn-sm" title="Acknowledge">
                                                <Check size={14} />
                                            </button>
                                            <button className="btn btn-ghost btn-sm" title="Dismiss">
                                                <X size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {tab === 'timeline' && (
                <div className="glass-card">
                    <div className="glass-card-header">
                        <h3>Today's Incident Timeline</h3>
                    </div>
                    <div className="timeline">
                        {incidents.map((inc, i) => (
                            <div key={i} className="timeline-item">
                                <div className={`timeline-dot ${inc.severity}`} />
                                <div className="timeline-time">{inc.time}</div>
                                <div className="timeline-title">{inc.title}</div>
                                <div className="timeline-desc">{inc.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'rules' && (
                <div className="rules-grid">
                    {alertRules.map((rule) => (
                        <div key={rule.id} className="rule-card">
                            <div className="rule-card-header">
                                <div className="rule-name">{rule.name}</div>
                                <div
                                    className={`toggle-switch ${rule.enabled ? 'active' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="rule-details">
                                <div className="rule-detail-row">
                                    <span style={{ color: '#64748b' }}>Condition</span>
                                    <span>{rule.condition}</span>
                                </div>
                                <div className="rule-detail-row">
                                    <span style={{ color: '#64748b' }}>Providers</span>
                                    <span>{rule.providers.join(', ')}</span>
                                </div>
                                <div className="rule-detail-row">
                                    <span style={{ color: '#64748b' }}>Notify via</span>
                                    <span>{rule.channel}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
