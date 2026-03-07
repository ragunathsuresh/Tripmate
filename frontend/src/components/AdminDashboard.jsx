import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Users,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Search,
    Bell,
    LayoutDashboard,
    Compass,
    ShoppingBag,
    PieChart,
    Settings,
    HelpCircle,
    Plus,
    Pencil,
    Plane,
    Loader2,
    MoreVertical
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');

        if (!userInfo || !token || userInfo.role !== 'admin') {
            navigate('/admin/login');
            return;
        }

        setAdmin(userInfo);
        fetchDashboardData(token);
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const res = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            if (err.response?.status === 403) {
                navigate('/admin/login');
            }
        }
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
        return `$${amount}`;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Helper for CSS Chart
    const getMaxCount = (growthData) => {
        if (!growthData || growthData.length === 0) return 1;
        return Math.max(...growthData.map(d => d.count));
    };

    if (loading) return (
        <div className="admin-loading">
            <Loader2 className="animate-spin" size={48} />
            <p>Gathering analytics...</p>
        </div>
    );

    const { stats, userGrowthData, popularDestinations, recentBookings } = data;

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-box"><Plane size={20} fill="white" /></div>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-item active">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} /> Manage Users
                    </Link>
                    <Link to="/admin/destinations" className="admin-nav-item">
                        <Compass size={20} /> Destinations
                    </Link>
                    <Link to="/admin/bookings" className="admin-nav-item">
                        <Calendar size={20} /> Bookings
                    </Link>
                    <Link to="/admin/revenue" className="admin-nav-item">
                        <PieChart size={20} /> Revenue
                    </Link>

                    <span className="nav-label">Support</span>
                    <Link to="/admin/settings" className="admin-nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                    <Link to="/admin/help" className="admin-nav-item">
                        <HelpCircle size={20} /> Help Center
                    </Link>
                </nav>

                <button className="btn-new-dest">
                    <Plus size={20} /> New Destination
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-top-bar">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search analytics, users or reports..." />
                    </div>

                    <div className="admin-profile">
                        <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
                        <div className="admin-user-info">
                            <h4>{admin?.name || 'Admin User'}</h4>
                            <p>Senior Admin</p>
                        </div>
                        <img src={`https://i.pravatar.cc/150?u=${admin?._id}`} className="admin-avatar" alt="Admin" />
                    </div>
                </header>

                <div className="analytics-header">
                    <h1>Analytics Overview</h1>
                    <p>Real-time data for your travel platform performance.</p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-row">
                            <div className="stat-icon-box bg-blue"><Users size={22} /></div>
                            <div className="stat-trend trend-up">
                                <TrendingUp size={12} /> 12%
                            </div>
                        </div>
                        <div className="stat-info">
                            <span>Total Users</span>
                            <h2>{stats.totalUsers.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-row">
                            <div className="stat-icon-box bg-cyan"><Compass size={22} /></div>
                            <div className="stat-trend trend-up">
                                <TrendingUp size={12} /> 5%
                            </div>
                        </div>
                        <div className="stat-info">
                            <span>Destinations</span>
                            <h2>{stats.totalDestinations.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-row">
                            <div className="stat-icon-box bg-purple"><Calendar size={22} /></div>
                            <div className="stat-trend trend-down">
                                <TrendingDown size={12} /> 2%
                            </div>
                        </div>
                        <div className="stat-info">
                            <span>Bookings</span>
                            <h2>{stats.totalBookings.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-row">
                            <div className="stat-icon-box bg-amber"><DollarSign size={22} /></div>
                            <div className="stat-trend trend-up">
                                <TrendingUp size={12} /> 24%
                            </div>
                        </div>
                        <div className="stat-info">
                            <span>Gross Revenue</span>
                            <h2>{formatCurrency(stats.grossRevenue)}</h2>
                        </div>
                    </div>
                </div>

                {/* Charts & Lists */}
                <div className="dashboard-middle">
                    <div className="chart-container">
                        <div className="card-header">
                            <h3>User Growth</h3>
                            <select style={{ border: 'none', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                <option>Last 30 days</option>
                                <option>Last 7 days</option>
                            </select>
                        </div>
                        <div className="growth-chart">
                            {userGrowthData.length > 0 ? userGrowthData.slice(-7).map((d, i) => (
                                <div key={i} className="chart-bar-wrapper">
                                    <div
                                        className={`chart-bar ${i === userGrowthData.slice(-7).length - 1 ? 'active' : ''}`}
                                        style={{ height: `${(d.count / getMaxCount(userGrowthData)) * 100}%` }}
                                    ></div>
                                    <span className="chart-label">{new Date(d._id).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', width: '100%', color: '#94a3b8' }}>No growth data yet</div>
                            )}
                        </div>
                    </div>

                    <div className="popular-container">
                        <div className="card-header">
                            <h3>Popular Places</h3>
                            <MoreVertical size={18} style={{ color: '#94a3b8' }} />
                        </div>
                        <div className="popular-list">
                            {popularDestinations.length > 0 ? popularDestinations.map((dest, i) => (
                                <div key={i} className="popular-item">
                                    <div className="popular-item-meta">
                                        <span>{dest.name}, {dest.country}</span>
                                        <span className="visits-tag">{dest.visits.toLocaleString()} visits</span>
                                    </div>
                                    <div className="progress-track">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(dest.visits / popularDestinations[0].visits) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Not enough booking data.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="recent-bookings-container">
                    <div className="card-header">
                        <h3>Recent Bookings</h3>
                        <Link to="/admin/bookings" className="view-all-link">View All</Link>
                    </div>

                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Destination</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking, idx) => (
                                    <tr key={booking._id || idx}>
                                        <td>
                                            <div className="user-cell">
                                                <img src={`https://i.pravatar.cc/150?u=${booking.user?._id}`} alt="User" />
                                                <span>{booking.user?.name || 'Unknown User'}</span>
                                            </div>
                                        </td>
                                        <td>{booking.destination?.name || 'Old Dest'}</td>
                                        <td>{formatDate(booking.createdAt)}</td>
                                        <td className="price-cell">${booking.amount.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge status-${booking.status}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-edit"><Pencil size={18} /></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

