import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Globe,
    DollarSign,
    Bell,
    Settings,
    Activity,
    Search,
    Moon,
    Zap,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAlerts } from '../../services/apiService';

const pageNames = {
    '/dashboard': 'Dashboard',
    '/providers': 'API Providers',
    '/costs': 'Cost Analytics',
    '/alerts': 'Alerts & Incidents',
    '/settings': 'Settings',
};

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const currentPage = pageNames[location.pathname] || 'Dashboard';
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        getAlerts().then(setAlerts);
    }, []);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/providers', icon: Globe, label: 'API Providers' },
        { path: '/costs', icon: DollarSign, label: 'Cost Analytics' },
        { path: '/alerts', icon: Bell, label: 'Alerts & Incidents', badge: alerts.filter(a => !a?.acknowledged).length },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const initials = user?.initials || user?.name?.slice(0, 2).toUpperCase() || 'DK';

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Activity />
                    </div>
                    <div className="sidebar-brand">
                        <h1>PulseAPI</h1>
                        <span>Monitor &amp; Control</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Main Menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-footer-card">
                        <p>Upgrade to Pro for unlimited APIs &amp; custom alerts</p>
                        <button className="upgrade-btn">
                            <Zap size={12} />
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <h2>{currentPage}</h2>
                        <span className="topbar-breadcrumb">
                            <ChevronRight size={12} style={{ opacity: 0.4 }} /> Overview
                        </span>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-search">
                            <Search />
                            <input type="text" placeholder="Search APIs, alerts..." />
                        </div>
                        <button className="topbar-icon-btn">
                            <Moon size={18} />
                        </button>
                        <button className="topbar-icon-btn">
                            <Bell size={18} />
                            <span className="notification-dot"></span>
                        </button>
                        <div className="topbar-avatar">{initials}</div>
                        <button
                            className="topbar-icon-btn"
                            onClick={handleSignOut}
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
