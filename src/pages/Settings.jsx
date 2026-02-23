import { useState } from 'react';
import {
    Key, Bell, Palette, Shield, User, CreditCard,
    Eye, EyeOff, Copy, Trash2, Plus, Save,
} from 'lucide-react';
import { apiKeys, providers } from '../data/mockData';

const settingsTabs = [
    { id: 'api-keys', icon: Key, label: 'API Keys' },
    { id: 'budgets', icon: CreditCard, label: 'Budgets' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'account', icon: User, label: 'Account' },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('api-keys');
    const [showKey, setShowKey] = useState({});

    const toggleKey = (provider) => {
        setShowKey(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Configure API keys, budgets, notifications, and preferences</p>
            </div>

            <div className="settings-grid">
                {/* Settings Nav */}
                <div>
                    <div className="settings-nav">
                        {settingsTabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div>
                    {/* API Keys Tab */}
                    {activeTab === 'api-keys' && (
                        <div className="glass-card">
                            <div className="settings-section">
                                <h3>API Key Management</h3>
                                <p>Manage your API keys for connected providers. Keys are encrypted and stored securely.</p>

                                {apiKeys.map((key) => (
                                    <div key={key.provider} className="api-key-row">
                                        <div className="api-key-provider">
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8, background: key.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.65rem', fontWeight: 700, color: 'white',
                                            }}>
                                                {key.provider.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{key.provider}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Last used: {key.lastUsed}</div>
                                            </div>
                                        </div>
                                        <div className="api-key-value">
                                            {showKey[key.provider] ? key.key.replace(/\*/g, 'a') : key.key}
                                        </div>
                                        <div className="api-key-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => toggleKey(key.provider)} title="Toggle visibility">
                                                {showKey[key.provider] ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button className="btn btn-ghost btn-sm" title="Copy"><Copy size={14} /></button>
                                            <button className="btn btn-ghost btn-sm" title="Remove" style={{ color: '#ef4444' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button className="btn btn-secondary" style={{ marginTop: 16 }}>
                                    <Plus size={14} /> Add API Key
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Budgets Tab */}
                    {activeTab === 'budgets' && (
                        <div className="glass-card">
                            <div className="settings-section">
                                <h3>Budget Configuration</h3>
                                <p>Set monthly spending limits for each provider. You'll receive alerts when approaching thresholds.</p>

                                {providers.map((p) => (
                                    <div key={p.id} className="settings-row">
                                        <div className="settings-row-info">
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{
                                                    width: 24, height: 24, borderRadius: 6, background: p.color,
                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.55rem', fontWeight: 700, color: 'white',
                                                }}>
                                                    {p.name.slice(0, 2).toUpperCase()}
                                                </span>
                                                {p.name}
                                            </h4>
                                            <p>Current: ${p.spend.toFixed(0)} / ${p.budget} ({((p.spend / p.budget) * 100).toFixed(0)}%)</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>$</span>
                                            <input
                                                type="number"
                                                defaultValue={p.budget}
                                                style={{ width: 100, textAlign: 'right' }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                                    <button className="btn btn-primary"><Save size={14} /> Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="glass-card">
                            <div className="settings-section">
                                <h3>Notification Preferences</h3>
                                <p>Choose how and when you want to be notified about API events.</p>

                                {[
                                    { name: 'Email Notifications', desc: 'Receive alerts via email', enabled: true },
                                    { name: 'Slack Integration', desc: 'Post alerts to your Slack channel', enabled: true },
                                    { name: 'Webhook Notifications', desc: 'Send alerts to custom webhook URL', enabled: false },
                                    { name: 'SMS Alerts (Critical Only)', desc: 'Get SMS for critical alerts', enabled: false },
                                    { name: 'Weekly Cost Report', desc: 'Receive weekly cost summary', enabled: true },
                                    { name: 'Daily Health Digest', desc: 'Morning summary of all provider statuses', enabled: true },
                                ].map((item, i) => (
                                    <div key={i} className="settings-row">
                                        <div className="settings-row-info">
                                            <h4>{item.name}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                        <div className={`toggle-switch ${item.enabled ? 'active' : ''}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="glass-card">
                            <div className="settings-section">
                                <h3>Appearance</h3>
                                <p>Customize the look and feel of your dashboard.</p>

                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <h4>Theme</h4>
                                        <p>Choose between dark and light mode</p>
                                    </div>
                                    <div className="tab-group">
                                        <button className="tab-item active">Dark</button>
                                        <button className="tab-item">Light</button>
                                        <button className="tab-item">System</button>
                                    </div>
                                </div>

                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <h4>Auto-Refresh Interval</h4>
                                        <p>How often to refresh dashboard data</p>
                                    </div>
                                    <select defaultValue="30" style={{ width: 120 }}>
                                        <option value="10">10 seconds</option>
                                        <option value="30">30 seconds</option>
                                        <option value="60">1 minute</option>
                                        <option value="300">5 minutes</option>
                                    </select>
                                </div>

                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <h4>Compact Mode</h4>
                                        <p>Reduce spacing for more content density</p>
                                    </div>
                                    <div className="toggle-switch" />
                                </div>

                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <h4>Animations</h4>
                                        <p>Enable smooth transitions and animations</p>
                                    </div>
                                    <div className="toggle-switch active" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="glass-card">
                            <div className="settings-section">
                                <h3>Account Settings</h3>
                                <p>Manage your account details and subscription.</p>

                                <div className="form-group">
                                    <label className="form-label">Display Name</label>
                                    <input type="text" className="form-input" defaultValue="DK" style={{ maxWidth: 320 }} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" defaultValue="dk@example.com" style={{ maxWidth: 320 }} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Organization</label>
                                    <input type="text" className="form-input" defaultValue="My Startup" style={{ maxWidth: 320 }} />
                                </div>

                                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <h3 style={{ marginBottom: 8 }}>Current Plan</h3>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 12,
                                        padding: '12px 20px', background: 'rgba(99,102,241,0.1)',
                                        border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12,
                                    }}>
                                        <Shield size={20} color="#6366f1" />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Free Plan</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Up to 3 providers, basic alerts</div>
                                        </div>
                                        <button className="btn btn-primary btn-sm" style={{ marginLeft: 16 }}>Upgrade</button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                                    <button className="btn btn-primary"><Save size={14} /> Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
